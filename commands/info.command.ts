import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class InfoCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('info')
      .description('Display DS Deploy command details.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
