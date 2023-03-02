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
  CREATING_NEW_CONFIGURATION: `${EMOJIS.CONSTRUCTION}  Creating new configuration`,
  UPDATING_CONFIGURATION: `${EMOJIS.CONSTRUCTION}  Updating configuration`,
  ENTER_USERNAME: 'Enter host username',
  ENTER_HOST: 'Enter host name or IP',
  ENTER_SSH_PATH: 'Enter public SSH key path',
  ENTER_NODE_VERSION: 'Enter node version',
  INVALID_USERNAME: 'Username should be a string',
  INVALID_HOST: 'Host should be in IP v4 or IP v6 format',
  INVALID_SSH_PATH: 'SSH path should be path to [key].pub file',
  INVALID_NODE_VERSION: 'Node version should be in format: 16.19.1',
  FILE_NOT_EXISTS: 'File with this path is not exists',
  SSH_CONFIGURATION: 'Please set SSH configuration:',
  BUILD_CONFIGURATION: 'Please set build configuration:',
  SELECT_SERVER: 'Please select server',
  CONFIGURATION_CREATED: (name: string) =>
    `${EMOJIS.ROCKET} Configuration for ${chalk.green(name)} was created successfully`,
  CONFIGURATION_UPDATED: (name: string) =>
    `${EMOJIS.ROCKET} Configuration for ${chalk.green(name)} was updated successfully`,
  SELECT_DEPLOYMENT_TYPE: 'Select deployment type',
  INVALID_CONFIGS: `${EMOJIS.SMIRK} Config file is invalid, please run init command`,
};
