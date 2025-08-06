#!/usr/bin/env node
import { Command } from 'commander';
import { helloCommand } from '../src/commands/hello.js';
import { gitStatusCommand } from '../src/commands/gitstatus.js';
import { listDirectoryCommand } from '../src/commands/dir.js';
import { commitCommand } from '../src/commands/smartCommit.js';
import { registerConfigCommand } from '../src/commands/config.js';
import { gitCloneCommand } from '../src/commands/gitClone.js';
import { helpCommand } from '../src/commands/help.js';

const program = new Command();

program
    .name('gh')
    .description('Cliente de github')
    .version('0.7.1');

program
    .command('hello')
    .description('Comando de prueba')
    .action(helloCommand);

program
    .command('status')
    .description('Muestra el estado del repositorio git actual')
    .action(gitStatusCommand);

program
    .command('cl <url>')
    .description('Hace un clone de un repositorio git')
    .action(gitCloneCommand);

program.
    command('dir')
    .description('Lista el contenido del directorio actual')
    .action(listDirectoryCommand);

program
    .command('oco')
    .description('Crea un commit con ayuda de OpenAI')
    .action(commitCommand);

program
    .command('help')
    .description('Help de comandos')
    .action(helpCommand);

registerConfigCommand(program);

program.parse();



