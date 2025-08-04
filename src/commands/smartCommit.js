import { CommandExecutor } from '../core/CommandExecutor.js';
import { OpenAIService } from '../core/OpenAIService.js';
import { CommitTypeDetector } from '../core/CommitTypeDetector.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import inquirer from 'inquirer';

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

        console.log(chalk.green('\n✅ Mensaje de commit generado:\n'));
        console.log(chalk.cyan(fullMessage));

        // Preguntar al usuario qué acción tomar
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: '¿Qué deseas hacer con este commit?',
                choices: [
                    {
                        name: '✅ Realizar commit',
                        value: 'commit'
                    },
                    {
                        name: '✏️  Editar mensaje',
                        value: 'edit'
                    },
                    {
                        name: '❌ Cancelar',
                        value: 'cancel'
                    }
                ],
                default: 'commit'
            }
        ]);

        if (action === 'cancel') {
            console.log(chalk.yellow('\n❌ Commit cancelado.'));
            return;
        }

        let finalMessage = fullMessage;

        if (action === 'edit') {
            const { customMessage } = await inquirer.prompt([
                {
                    type: 'editor',
                    name: 'customMessage',
                    message: 'Edita el mensaje de commit:',
                    default: fullMessage
                }
            ]);
            finalMessage = customMessage.trim();
        }

        // Escribir mensaje a un archivo temporal
        const tempFilePath = path.join(os.tmpdir(), 'commit_message.txt');
        await fs.writeFile(tempFilePath, finalMessage);

        const { stderr } = await CommandExecutor.run('git', ['commit', '-F', tempFilePath]);

        // Limpiar archivo temporal
        try {
            await fs.unlink(tempFilePath);
        } catch (unlinkError) {
            console.error(chalk.red('❌ Error al eliminar el archivo temporal:'), unlinkError.message);
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
