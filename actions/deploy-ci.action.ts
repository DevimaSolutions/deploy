import chalk from 'chalk';

import { AbstractAction } from './abstract.action.js';

export class DeployCiAction extends AbstractAction {

  public async handle() {
    console.error(chalk.red("Command is not implemented!"))
  }
}
