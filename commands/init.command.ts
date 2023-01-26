import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class InitCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('init')
      .description('Create configuration files to easily access server.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
