import { spawnSync } from 'child_process';


export class CommandExecutor {
    /**
     * Ejecuta un comando en la terminal
     * @param {string} command - El comando a ejecutar (ej. "git status")
     * @returns {Promise<{ stdout: string, stderr: string }>}
     */
    static run(command, args = []) {
        const result = spawnSync(command, args, {
            encoding: 'utf-8',
            // shell: true // permite usar comandos como git en Windows
        });

        return {
            stdout: result.stdout,
            stderr: result.stderr,
            status: result.status
        };
    }

}