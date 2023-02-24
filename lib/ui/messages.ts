import chalk from 'chalk';

import { EMOJIS } from './emojis.js';

export const MESSAGES = {
  INFORMATION_PACKAGE_MANAGER_FAILED: `${EMOJIS.SMIRK}  Cannot read your project package.json file, are you inside your project directory?`,
  RUNNER_EXECUTION_ERROR: (command: string) => `\nFailed to execute command: ${command}`,
  PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS: `Installation in progress... ${EMOJIS.COFFEE}`,
  PACKAGE_MANAGER_INSTALLATION_SUCCEED: (name: string) =>
    name !== '.'
      ? `${EMOJIS.ROCKET}  Successfully installed packages for the project ${chalk.green(name)}`
      : `${EMOJIS.ROCKET}  Successfully installed packages`,
  PACKAGE_MANAGER_PRODUCTION_INSTALLATION_IN_PROGRESS: `Package installation in progress... ${EMOJIS.COFFEE}`,
  PACKAGE_MANAGER_INSTALLATION_FAILED: (commandToRunManually: string) =>
    `${EMOJIS.SCREAM}  Packages installation failed!\nIn case you don't see any errors above, consider manually running the failed command ${commandToRunManually} to see more details on why it errored out.`,
  CREATING_NEW_CONFIGURATION: (name: string) =>
    `${EMOJIS.CONSTRUCTION}  Creating new configuration for ${chalk.green(name)}`,
  UPDATING_CONFIGURATION: (name: string) =>
    `${EMOJIS.CONSTRUCTION}  Updating configuration for ${chalk.green(name)}`,
};
