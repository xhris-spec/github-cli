import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { I18n } from "../i18n/index.js";

export const meta = {
    name: "dir",
    description: I18n.t("commands.dir"),
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lista el contenido del directorio actual.
 */
export async function listDirectoryCommand() {
    const t = I18n.t.bind(I18n);
    const currentDir = process.cwd();

    try {
        const files = fs.readdirSync(currentDir, { withFileTypes: true });

        console.log(chalk.cyan("📂 " + t("dir.title") + ` ${currentDir}:\n`));

        for (const file of files) {
            if (file.isDirectory()) {
                console.log(chalk.blue(`📁 ${file.name}/`));
            } else {
                console.log(chalk.white(`📄 ${file.name}`));
            }
        }
    } catch (error) {
        console.error(chalk.red("❌ " + t("dir.error")), error.message);
    }
}
