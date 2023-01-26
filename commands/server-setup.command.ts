import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class ServerSetupCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('server:setup')
      .description('Install the app and dependencies to the remote server.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
