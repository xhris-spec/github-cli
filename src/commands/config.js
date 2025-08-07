import chalk from "chalk";
import { ConfigService } from "../core/ConfigService.js";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "config <option> [value]",
  description: I18n.t("commands.config"),
};

export async function configCommand(option, value) {
  const t = I18n.t.bind(I18n);
  switch (option) {
    case "set-key":
      if (!value) {
        console.log(chalk.red("❌ " + t("config.noKey")));
        return;
      }
      ConfigService.saveApiKey(value);
      console.log(chalk.green("✅ " + t("config.apiKeySaved")));
      break;
    case "get-key":
      const key = ConfigService.getApiKey();
      if (key) {
        console.log(
          chalk.green("✅ " + t("config.configuredKey")) +
            " " +
            chalk.gray(key.slice(0, 4) + "..." + key.slice(-4))
        );
      } else {
        console.log(chalk.red("❌ " + t("config.noKey")));
      }
      break;
    case "set-lang":
      ConfigService.saveLang(value);
      console.log(
        chalk.green("✅ " + t("config.configLangSet") + ": " + `${value}`)
      );
      break;
    case "get-lang":
      const current = ConfigService.getLang();
      console.log(
        chalk.green("🌐 " + t("config.currentLang") + ": " + `${current}`)
      );
      break;
    default:
      console.log(chalk.red("❌ " + t("config.invalidOption")));
      break;
  }
}
