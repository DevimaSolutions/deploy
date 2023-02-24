import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import chalk from 'chalk';

import { PackageJson } from '../lib/package-managers/package-json.interface.js';
import { MESSAGES } from '../lib/ui/messages.js';
import { ConfigurationLoader, DeployConfiguration } from '../lib/utils/configuration.loader.js';

import { AbstractAction } from './abstract.action.js';

export class InitAction extends AbstractAction {
  configurationFileName = '.dsdeployrc';
  projectName: string;
  config: DeployConfiguration | null = null;

  public async handle() {
    this.ensureCalledFromProjectDirectory();
    const isInitialized = await this.isAlreadyInitialized();

    this.ensureConfigurationFileIsIgnoredByGit();

    if (isInitialized) {
      this.offerUpdateConfiguration();
    } else {
      this.createConfiguration();
    }
  }

  ensureCalledFromProjectDirectory() {
    try {
      const { name } = this.readProjectPackageFile();
      this.projectName = name;
    } catch (err) {
      console.error(chalk.red(MESSAGES.INFORMATION_PACKAGE_MANAGER_FAILED));
      throw new Error();
    }
  }

  readProjectPackageFile() {
    const buffer = readFileSync(join(process.cwd(), 'package.json'));
    const packageFile = JSON.parse(buffer.toString());
    return packageFile as PackageJson;
  }

  async isAlreadyInitialized() {
    this.config = await ConfigurationLoader.load(this.configurationFileName);
    return this.config !== null;
  }

  offerUpdateConfiguration() {
    console.info(MESSAGES.UPDATING_CONFIGURATION(this.projectName));
    console.info();
    // TODO: edit config file filling values using cli
  }

  createConfiguration() {
    console.info(MESSAGES.CREATING_NEW_CONFIGURATION(this.projectName));
    console.info();
    // TODO: create config file filling values using cli
  }

  ensureConfigurationFileIsIgnoredByGit() {
    try {
      const buffer = readFileSync(join(process.cwd(), '.gitignore'));
      const gitIgnorePatterns = buffer
        .toString()
        .split('\n')
        .map((line) => line.trim())
        // remove comments
        .filter((line) => !line.startsWith('#'));

      if (!gitIgnorePatterns.some((pattern) => pattern === this.configurationFileName)) {
        // Not added to gitignore
        // TODO: add `configurationFileName` to .gitignore
      }
    } catch {
      // git might not be initialized
      // just skip it then
    }
  }
}
