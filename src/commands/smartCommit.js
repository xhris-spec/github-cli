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
import { I18n } from "../i18n/index.js";


export const meta = {
  name: "oco",
  description: I18n.t("commands.oco"),
};

export async function commitCommand() {
  const t = I18n.t.bind(I18n);

  try {
    const { stdout: fileOutput } = await CommandExecutor.run("git", [
      "diff",
      "--cached",
      "--name-only",
    ]);

    if (!ConfigService.hasApiKey()) {
      console.log(chalk.red("❌" + t("oco.noApiKey")));
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
        console.log(chalk.red("❌ " + t("oco.noStaged")));
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
        console.log(chalk.gray("⏭️ " + t("oco.noChanges"), fileName));
        continue;
      }

      const type = CommitTypeDetector.detect(diffOutput);
      let rawMessage = await OpenAIService.generateCommitMessage(diffOutput);
      rawMessage = rawMessage.replace(/^"|"$/g, "").trim();

      const line = `${type}(${fileName}): ${rawMessage}`;
      messageLines.push(line);
    }

    if (!messageLines.length) {
      console.log(chalk.yellow("⚠️ " + t("oco.noMessages")));
      return;
    }

    const fullMessage = messageLines.join("\n\n");

    console.log(chalk.green("\n✅ Mensaje de commit generado:\n"));
    console.log(chalk.cyan(fullMessage));

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: t("oco.actionPrompt"),
        choices: [
          { name: "✅ " + t("oco.actions.commit"), value: "commit" },
          { name: "✏️ " + t("oco.actions.edit"), value: "edit" },
          { name: "❌ " + t("oco.actions.cancel"), value: "cancel" },
        ],
        default: "commit",
      },
    ]);

    if (action === "cancel") {
      console.log(chalk.yellow("\n❌ " + t("oco.commitCancelled")));
      return;
    }

    let finalMessage = fullMessage;

    if (action === "edit") {
      const { customMessage } = await inquirer.prompt([
        {
          type: "editor",
          name: "customMessage",
          message: t("oco.commitCancelled"),
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
        chalk.red("❌ " + t("oco.tmpFileError")),
        unlinkError.message
      );
    }

    const { stderr: pushStderr } = await CommandExecutor.run("git", ["push"]);

    if (pushStderr && pushStderr.toLowerCase().includes("error")) {
      console.error(chalk.red("❌ " + t("oco.pushError")), pushStderr);
      return;
    }

    if (stderr) {
      console.error(chalk.red("❌ " + t("oco.commitError")), stderr);
    } else {
      console.log(
        chalk.green(
          "\n🎉 " + t("oco.success")
        )
      );
    }
  } catch (error) {
    console.error(chalk.red("❌ " + t("oco.generalError")), error.message);
  }
}
