import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class CleanCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('clean')
      .description('Clean local folder, remove app and dependencies from the remote server.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
