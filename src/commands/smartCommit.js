import { CommandExecutor } from '../core/CommandExecutor.js';
import { OpenAIService } from '../core/OpenAIService.js';
import { CommitTypeDetector } from '../core/CommitTypeDetector.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export async function commitCommand() {
    try {
        const { stdout: fileOutput } = await CommandExecutor.run('git', ['diff', '--cached', '--name-only']);
        const fileList = fileOutput.split('\n').filter(Boolean);

        if (!fileList.length) {
            console.log(chalk.yellow('⚠️ No hay archivos preparados para commit.'));
            return;
        }

        const messageLines = [];

        for (const file of fileList) {
            const fileName = path.basename(file);
            const { stdout: diffOutput } = await CommandExecutor.run('git', ['diff', '--cached', file]);

            if (!diffOutput.trim()) {
                console.log(chalk.gray(`⏭️  Sin cambios detectados en ${fileName}. Saltando...`));
                continue;
            }

            const type = CommitTypeDetector.detect(diffOutput);
            let rawMessage = await OpenAIService.generateCommitMessage(diffOutput);
            rawMessage = rawMessage.replace(/^"|"$/g, '').trim();

            const line = `${type}(${fileName}): ${rawMessage}`;
            messageLines.push(line);
        }

        if (!messageLines.length) {
            console.log(chalk.yellow('⚠️ No se generaron mensajes de commit.'));
            return;
        }

        const fullMessage = messageLines.join('\n\n');

        console.log(chalk.green('\n✅ Commit final:\n'));
        console.log(fullMessage);

        // Escribir mensaje a un archivo temporal
        const tempFilePath = path.join(os.tmpdir(), 'commit_message.txt');
        await fs.writeFile(tempFilePath, fullMessage);

        const { stderr } = await CommandExecutor.run('git', ['commit', '-F', tempFilePath]);

        // Limpiar archivo temporal
        try {
            await fs.unlink(tempFilePath);
        } catch (unlinkError) {
            // Ignorar errores al borrar el archivo temporal
        }

        if (stderr) {
            console.error(chalk.red('❌ Error al hacer commit:'), stderr);
        } else {
            console.log(chalk.green('\n🎉 Commit generado exitosamente.'));
        }

    } catch (error) {
        console.error(chalk.red('❌ Error general:'), error.message);
    }
}
