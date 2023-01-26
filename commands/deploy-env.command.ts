import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class DeployEnvCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('deploy:env')
      .description('Update env variables on the remote server using your .env.production file.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
