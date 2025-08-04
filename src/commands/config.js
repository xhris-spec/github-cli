import { Command } from 'commander';
import { ConfigService } from '../core/ConfigService.js';
import chalk from 'chalk';

export function registerConfigCommand(program) {
    const config = new Command('config');

    config
        .command('set-key')
        .description('Guarda la clave de la API de OpenAI')
        .argument('<apiKey>', 'Tu clave de OpenAI')
        .action((apiKey) => {
            ConfigService.saveApiKey(apiKey);
            console.log(chalk.green('✅ Clave guardada correctamente.'));
        });

    config
        .command('get-key')
        .description('Muestra si la clave está configurada')
        .action(() => {
            const key = ConfigService.getApiKey();
            if (key) {
                console.log(chalk.green('✅ Clave configurada: ') + chalk.gray(key.slice(0, 4) + '...' + key.slice(-4)));
            } else {
                console.log(chalk.red('❌ No hay clave configurada.'));
            }
        });

    program.addCommand(config);
}
