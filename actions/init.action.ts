import chalk from 'chalk';

import { AbstractAction } from './abstract.action.js';

export class InitAction extends AbstractAction {

  public async handle() {
    this.checkIfInProjectDirectory();
    const isInitialized = this.isAlreadyInitialized();

    if (isInitialized) {
      this.offerUpdateConfiguration();
    } else {
      this.createConfiguration();
    }
  }

  checkIfInProjectDirectory() {

  }

  isAlreadyInitialized() {
    return false
  }

  offerUpdateConfiguration() {
    
  }
  
  createConfiguration() {

  }
}
