import { CommandExecutor } from '../core/CommandExecutor.js';
import chalk from 'chalk';

export async function gitStatusCommand() {
    const { stdout, stderr } = await CommandExecutor.run('git status');

    if (stderr) {
        console.error(chalk.red('❌ Error al ejecutar "git status":'));
        console.error(chalk.gray(stderr));
    } else {
        console.log(chalk.green('✅ Estado actual del repositorio:\n'));
        console.log(chalk.white(stdout));
    }
}
