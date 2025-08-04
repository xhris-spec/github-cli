import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);


export class CommandExecutor {
    /**
     * Ejecuta un comando en la terminal
     * @param {string} command - El comando a ejecutar (ej. "git status")
     * @returns {Promise<{ stdout: string, stderr: string }>}
     */
    static async run(command) {
        try {
            const { stdout, stderr } = await execAsync(command);
            return { stdout, stderr };
        } catch (error) {
            return { stdout: '', stderr: error.message };
        }
    }

}