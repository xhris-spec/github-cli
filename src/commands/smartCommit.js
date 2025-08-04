import { CommandExecutor } from '../core/CommandExecutor.js';
import { OpenAIService } from '../core/OpenAIService.js';
import chalk from 'chalk';

export async function smartCommitCommand() {
    const { stdout: diff, stderr } = await CommandExecutor.run('git diff --cached');

    if (!diff.trim()) {
        console.log(chalk.yellow('⚠️  No hay cambios para commitear. Usa "git add" primero.'));
        return;
    }

    try {
        const message = await OpenAIService.generateCommitMessage(diff);
        console.log(chalk.green('🧠 Mensaje sugerido por IA:\n'));
        console.log(chalk.white(`"${message}"\n`));

        const { stdout: gitOut } = await CommandExecutor.run(`git commit -m "${message.replace(/"/g, '\\"')}"`);
        console.log(chalk.green('✅ Commit hecho:\n'));
        console.log(gitOut);
    } catch (err) {
        console.error(chalk.red('❌ Error:'), err.message);
    }
}
