import chalk from "chalk";
import { ConfigService } from "../core/ConfigService.js";

export const meta = {
  name: "config <option> [apiKey]",
  description: "Comandos de configuración para la API de OpenAI",
};

export async function configCommand(option, apiKey) {
  if (option === "set-key") {
    if (!apiKey) {
      console.log(chalk.red("❌ Debes proporcionar una clave de API."));
      return;
    }
    ConfigService.saveApiKey(apiKey);
    console.log(chalk.green("✅ Clave guardada correctamente."));
  } else if (option === "get-key") {
    const key = ConfigService.getApiKey();
    if (key) {
      console.log(
        chalk.green("✅ Clave configurada: ") +
          chalk.gray(key.slice(0, 4) + "..." + key.slice(-4))
      );
    } else {
      console.log(chalk.red("❌ No hay clave configurada."));
    }
  } else {
    console.log(chalk.red("❌ Comando inválido. Usa 'set-key' o 'get-key'."));
  }
}
