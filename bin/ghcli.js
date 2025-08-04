#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';

const program = new Command();

program.name('gh').description('Cliente de github').version('0.0.1');

program.command('hello').description('Comando de prueba').action(() => {
    console.log(chalk.green('Hola, mundo!'));
});


program.parse();


