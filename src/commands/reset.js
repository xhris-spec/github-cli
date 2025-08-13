import { CommandExecutor } from "../core/CommandExecutor.js";
import chalk from "chalk";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "reset",
  description: I18n.t("commands.reset"),
};

export async function resetCommand() {
  const t = I18n.t.bind(I18n);

  const { stdout, stderr } = await CommandExecutor.run("git", [
    "reset",
    "--soft",
    "HEAD~1",
  ]);

  console.log(chalk.blue(t("reset.resetting")));

  if (stderr) {
    console.log(chalk.red(stderr));
  } else {
    console.log(chalk.green(stdout));
  }
}
