import chalk from 'chalk';
import { Command } from 'commander';

import {
  CleanLocalAction,
  CleanServerAction,
  DeployAction,
  DeployCiAction,
  DeployEnvAction,
  DeployLocalAction,
  InfoAction,
  InitAction,
  MultiAction,
  SetupServerAction,
} from '../actions/index.js';
import { ERROR_PREFIX } from '../lib/ui/index.js';

import {
  CleanCommand,
  CleanLocalCommand,
  CleanServerCommand,
  DeployCiCommand,
  DeployCommand,
  DeployEnvCommand,
  DeployLocalCommand,
  InfoCommand,
  InitCommand,
  ServerSetupCommand,
} from './index.js';

export class CommandLoader {
  public static load(program: Command): void {
    new InfoCommand(new InfoAction()).load(program);
    new InitCommand(new InitAction()).load(program);
    new ServerSetupCommand(new SetupServerAction()).load(program);

    new DeployCiCommand(new DeployCiAction()).load(program);
    new DeployEnvCommand(new DeployEnvAction()).load(program);
    new DeployLocalCommand(new DeployLocalAction()).load(program);
    new DeployCommand(new DeployAction()).load(program);

    new CleanLocalCommand(new CleanLocalAction()).load(program);
    new CleanServerCommand(new CleanServerAction()).load(program);
    new CleanCommand(new MultiAction([new CleanServerAction(), new CleanLocalAction()])).load(
      program,
    );

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(`See ${chalk.red('--help')} for a list of available commands.\n`);
      process.exit(0);
    });
  }
}
