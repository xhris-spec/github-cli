import { CommandExecutor } from '../core/CommandExecutor.js';
import chalk from 'chalk';

export const meta = {
    name: "reset --soft HEAD~1",
    description: "Reinicia el último commit sin perder cambios",
};

export async function resetCommand() {
    const { stdout, stderr } = await CommandExecutor.run('git reset --soft HEAD~1');

    if (stderr) {
        console.log(chalk.red(stderr));
    } else {
        console.log(chalk.green(stdout));
    }
}
