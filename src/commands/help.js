import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { I18n } from "../i18n/index.js";

export const meta = {
  name: "help",
  description: "Muestra la ayuda y lista de comandos disponibles",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function helpCommand() {
  const t = I18n.t.bind(I18n);

  console.log(chalk.bold("\n📘 " + t("help.helpText")));

  const commandsDir = path.resolve(__dirname);
  const files = fs
    .readdirSync(commandsDir)
    .filter(
      (file) =>
        file.endsWith(".js") &&
        file !== "help.js" &&
        fs.statSync(path.join(commandsDir, file)).isFile()
    );

  for (const file of files) {
    try {
      const filePath = path.join(commandsDir, file);
      const moduleUrl = pathToFileURL(filePath);
      const { meta } = await import(moduleUrl);

      if (meta?.name && meta?.description) {
        console.log(
          `${chalk.cyan(meta.name)}\n  ${chalk.gray(meta.description)}\n`
        );
      }
    } catch (error) {
      console.warn(
        chalk.yellow(
          `⚠️  No se pudo cargar el comando "${file}": ${error.message}`
        )
      );
    }
  }

  console.log(chalk.bold("\nℹ️  " + t("help.commandExample")));
  console.log(chalk.green("  gh <comando>"));
  console.log();
}
