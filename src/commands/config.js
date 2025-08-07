import chalk from "chalk";
import { ConfigService } from "../core/ConfigService.js";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "config <option> [apiKey]",
  description: I18n.t("commands.config"),
};

export async function configCommand(option, apiKey) {
  const t = I18n.t.bind(I18n);

  if (option === "set-key") {
    if (!apiKey) {
      console.log(chalk.red("❌ " + t("config.noKey")));
      return;
    }
    ConfigService.saveApiKey(apiKey);
    console.log(chalk.green("✅ " + t("config.apiKeySaved")));
  } else if (option === "get-key") {
    const key = ConfigService.getApiKey();
    if (key) {
      console.log(
        chalk.green("✅ " + t("config.configuredKey")) +
        " " + chalk.gray(key.slice(0, 4) + "..." + key.slice(-4))
      );
    } else {
      console.log(chalk.red("❌ " + t("config.noKey")));
    }
  } else {
    console.log(chalk.red("❌ " + t("config.invalidOption")));
  }
}
