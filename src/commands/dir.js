import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// Para poder usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lista el contenido del directorio actual.
 */
export async function listDirectoryCommand() {
    const currentDir = process.cwd();

    try {
        const files = fs.readdirSync(currentDir, { withFileTypes: true });

        console.log(chalk.cyan(`📂 Contenido de ${currentDir}:\n`));

        for (const file of files) {
            if (file.isDirectory()) {
                console.log(chalk.blue(`📁 ${file.name}/`));
            } else {
                console.log(chalk.white(`📄 ${file.name}`));
            }
        }
    } catch (error) {
        console.error(chalk.red('❌ Error al leer el directorio:'), error.message);
    }
}
