import { CommandExecutor } from "../core/CommandExecutor.js";
import chalk from "chalk";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "status",
  description: I18n.t("commands.gitStatus"),
};

export async function gitStatusCommand() {
  const t = I18n.t.bind(I18n);

  const { stdout, stderr } = await CommandExecutor.run("git", ["status"]);
  if (stderr) {
    console.error(chalk.red("❌ " + t("gitStatus.error")));
    console.error(chalk.gray(stderr));
  } else {
    console.log(chalk.green("✅ " + t("gitStatus.success")));
    console.log(chalk.white(stdout));
  }
}
