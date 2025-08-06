import { CommandExecutor } from "../core/CommandExecutor.js";
import { OpenAIService } from "../core/OpenAIService.js";
import { ConfigService } from "../core/ConfigService.js";
import { CommitTypeDetector } from "../core/CommitTypeDetector.js";
import { StagingService } from "../services/StagingService.js";
import chalk from "chalk";
import path from "path";
import fs from "fs/promises";
import os from "os";
import inquirer from "inquirer";

export const meta = {
  name: "oco",
  description: "Crea un commit con ayuda de OpenAI",
};

export async function commitCommand() {
  try {
    const { stdout: fileOutput } = await CommandExecutor.run("git", [
      "diff",
      "--cached",
      "--name-only",
    ]);

    if (!ConfigService.hasApiKey()) {
      console.log(
        chalk.red(
          '❌ No se ha configurado la clave de OpenAI. Usa "gh config set-key <API_KEY>"'
        )
      );
      return;
    }

    let fileList = fileOutput.split("\n").filter(Boolean);

    if (!fileList.length) {
      const success = await StagingService.handleInteractiveStaging();
      if (!success) return;

      const { stdout: newStaged } = await CommandExecutor.run("git", [
        "diff",
        "--cached",
        "--name-only",
      ]);
      fileList = newStaged.split("\n").filter(Boolean);

      if (!fileList.length) {
        console.log(chalk.red("❌ Aún no hay archivos staged."));
        return;
      }
    }

    const messageLines = [];

    for (const file of fileList) {
      const fileName = path.basename(file);
      const { stdout: diffOutput } = await CommandExecutor.run("git", [
        "diff",
        "--cached",
        file,
      ]);

      if (!diffOutput.trim()) {
        console.log(
          chalk.gray(`⏭️  Sin cambios detectados en ${fileName}. Saltando...`)
        );
        continue;
      }

      const type = CommitTypeDetector.detect(diffOutput);
      let rawMessage = await OpenAIService.generateCommitMessage(diffOutput);
      rawMessage = rawMessage.replace(/^"|"$/g, "").trim();

      const line = `${type}(${fileName}): ${rawMessage}`;
      messageLines.push(line);
    }

    if (!messageLines.length) {
      console.log(chalk.yellow("⚠️ No se generaron mensajes de commit."));
      return;
    }

    const fullMessage = messageLines.join("\n\n");

    console.log(chalk.green("\n✅ Mensaje de commit generado:\n"));
    console.log(chalk.cyan(fullMessage));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "¿Qué deseas hacer con este commit?",
        choices: [
          { name: "✅ Realizar commit", value: "commit" },
          { name: "✏️  Editar mensaje", value: "edit" },
          { name: "❌ Cancelar", value: "cancel" },
        ],
        default: "commit",
      },
    ]);

    if (action === "cancel") {
      console.log(chalk.yellow("\n❌ Commit cancelado."));
      return;
    }

    let finalMessage = fullMessage;

    if (action === "edit") {
      const { customMessage } = await inquirer.prompt([
        {
          type: "editor",
          name: "customMessage",
          message: "Edita el mensaje de commit:",
          default: fullMessage,
        },
      ]);
      finalMessage = customMessage.trim();
    }

    const tempFilePath = path.join(os.tmpdir(), "commit_message.txt");
    await fs.writeFile(tempFilePath, finalMessage);

    const { stderr } = await CommandExecutor.run("git", [
      "commit",
      "-F",
      tempFilePath,
    ]);

    try {
      await fs.unlink(tempFilePath);
    } catch (unlinkError) {
      console.error(
        chalk.red("❌ Error al eliminar el archivo temporal:"),
        unlinkError.message
      );
    }

    const { stderr: pushStderr } = await CommandExecutor.run("git", ["push"]);

    if (pushStderr && pushStderr.toLowerCase().includes("error")) {
      console.error(chalk.red("❌ Error al hacer push:"), pushStderr);
      return;
    }

    if (stderr) {
      console.error(chalk.red("❌ Error al hacer commit:"), stderr);
    } else {
      console.log(
        chalk.green(
          "\n🎉 Commit generado exitosamente y subido al repositorio."
        )
      );
    }
  } catch (error) {
    console.error(chalk.red("❌ Error general:"), error.message);
  }
}
