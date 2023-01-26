import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class DeployCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('deploy')
      .description('Manually trigger a build on the remote server. The app is built from a git branch tracked by the server.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
