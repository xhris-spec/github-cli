import { CommandExecutor } from '../core/CommandExecutor.js';
import chalk from 'chalk';


export async function gitCloneCommand(url) {
    if (!url) {
        console.log(chalk.red('Por favor proporciona la URL del repositorio.'));
        return;
    }
    const { stdout, stderr } = await CommandExecutor.run(`git clone ${url}`);
    if (stderr) {
        console.log(chalk.red(stderr));
    } else {
        console.log(chalk.green(stdout));
    }
}