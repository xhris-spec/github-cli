#!/usr/bin/env node
import { Command } from "commander";
import { helloCommand, meta as helloMeta } from "../src/commands/hello.js";
import {
  gitStatusCommand,
  meta as gitStatusMeta,
} from "../src/commands/gitstatus.js";
import {
  listDirectoryCommand,
  meta as listDirectoryMeta,
} from "../src/commands/dir.js";
import {
  commitCommand,
  meta as commitMeta,
} from "../src/commands/smartCommit.js";
import {
  gitCloneCommand,
  meta as gitCloneMeta,
} from "../src/commands/gitClone.js";
import { helpCommand, meta as helpMeta } from "../src/commands/help.js";
import { configCommand, meta as configMeta } from "../src/commands/config.js";

const program = new Command();

program.name("gh").description("Cliente de github").version("0.8.1");

program
  .command(helloMeta.name)
  .description(helloMeta.description)
  .action(helloCommand);

program
  .command(gitStatusMeta.name)
  .description(gitStatusMeta.description)
  .action(gitStatusCommand);

program
  .command(gitCloneMeta.name)
  .description(gitCloneMeta.description)
  .action(gitCloneCommand);

program
  .command(listDirectoryMeta.name)
  .description(listDirectoryMeta.description)
  .action(listDirectoryCommand);

program
  .command(commitMeta.name)
  .description(commitMeta.description)
  .action(commitCommand);

program
  .command(helpMeta.name)
  .description(helpMeta.description)
  .action(helpCommand);

program
  .command(configMeta.name)
  .description(configMeta.description)
  .action(configCommand);

program.parse();
