import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class CleanLocalCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('clean:local')
      .description('Clean local folder from ds-deploy package configuration files.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
