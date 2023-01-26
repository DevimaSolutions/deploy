import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class CleanServerCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('clean:server')
      .description('Install the app and dependencies to the remote server.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
