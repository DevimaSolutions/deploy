import { Command } from 'commander';

import { AbstractCommand } from './abstract.command.js';

export class DeployLocalCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('deploy:local')
      .description('Clean local folder from ds-deploy package configuration files.')
      .action(async () => {
        await this.action.handle();
      });
  }
}
