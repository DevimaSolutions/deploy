import chalk from 'chalk';
import { Command } from 'commander';

import { InfoAction } from '../actions/index.js';
import { ERROR_PREFIX } from '../lib/ui/index.js';

import { InfoCommand } from './info.command.js';
export class CommandLoader {
  public static load(program: Command): void {
    new InfoCommand(new InfoAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(`See ${chalk.red('--help')} for a list of available commands.\n`);
      process.exit(1);
    });
  }
}
