import { CommandExecutor } from "../core/CommandExecutor.js";
import chalk from "chalk";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "cl <url>",
  description: I18n.t("commands.gitClone"),
};

export async function gitCloneCommand(url) {
  const t = I18n.t.bind(I18n);

  if (!url) {
    console.log(chalk.red(t("gitClone.noUrl")));
    return;
  }

  const { stdout, stderr } = await CommandExecutor.run("git", ["clone", url]);
  if (stderr) {
    console.log(chalk.red(stderr));
  } else {
    console.log(chalk.green(stdout));
  }
}
