import inquirer from "inquirer";
import { CommandExecutor } from "../core/CommandExecutor.js";
import chalk from "chalk";
import { I18n } from "../i18n/index.js";

export class StagingService {
  static async handleInteractiveStaging() {
    const t = I18n.t.bind(I18n);

    const { stdout: modifiedOutput } = await CommandExecutor.run("git", [
      "ls-files",
      "--modified",
    ]);
    const modifiedFiles = modifiedOutput.split("\n").filter(Boolean);

    if (!modifiedFiles.length) {
      console.log(chalk.yellow("⚠️ " + t("staging.noModified")));
      return false;
    }

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: t("staging.noStagedPrompt"),
        choices: [
          {
            name: "✅ " + t("staging.actions.addAll"),
            value: "addAll",
          },
          { name: "📁 " + t("staging.actions.selectFiles"), value: "selectFiles" },
          { name: "❌ " + t("staging.actions.cancel"), value: "cancel" },
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
          message: t("staging.selectFilesPrompt"),
          choices: modifiedFiles.map((file) => ({ name: file, value: file })),
        },
      ]);

      if (!filesToAdd.length) {
        console.log(chalk.yellow("⚠️ " + t("staging.noFilesSelected")));
        return false;
      }

      for (const file of filesToAdd) {
        await CommandExecutor.run("git", ["add", file]);
      }

      return true;
    }
  }
}
