import inquirer from "inquirer";
import { CommandExecutor } from "../core/CommandExecutor.js";
import chalk from "chalk";

export class StagingService {
  static async handleInteractiveStaging() {
    const { stdout: modifiedOutput } = await CommandExecutor.run("git", [
      "ls-files",
      "--modified",
    ]);
    const modifiedFiles = modifiedOutput.split("\n").filter(Boolean);

    if (!modifiedFiles.length) {
      console.log(chalk.yellow("⚠️ No hay archivos modificados para agregar."));
      return false;
    }

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "No hay archivos staged. ¿Qué deseas hacer?",
        choices: [
          {
            name: "✅ Agregar todos los archivos modificados",
            value: "addAll",
          },
          { name: "📁 Seleccionar archivos específicos", value: "selectFiles" },
          { name: "❌ Cancelar", value: "cancel" },
        ],
      },
    ]);

    if (action === "cancel") return false;

    if (action === "addAll") {
      await CommandExecutor.run("git", ["add", "."]);
      return true;
    }

    if (action === "selectFiles") {
      const { filesToAdd } = await inquirer.prompt([
        {
          type: "checkbox",
          name: "filesToAdd",
          message: "Selecciona los archivos a agregar al staging:",
          choices: modifiedFiles.map((file) => ({ name: file, value: file })),
        },
      ]);

      if (!filesToAdd.length) {
        console.log(chalk.yellow("⚠️ No se seleccionaron archivos."));
        return false;
      }

      for (const file of filesToAdd) {
        await CommandExecutor.run("git", ["add", file]);
      }

      return true;
    }
  }
}
