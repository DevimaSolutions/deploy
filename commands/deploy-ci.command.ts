import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class DeployCiCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('deploy:ci')
      .description('Setup CI/CD for the server (Only github actions are currently available).')
      .action(async () => {
        await this.action.handle();
      });
  }
}
