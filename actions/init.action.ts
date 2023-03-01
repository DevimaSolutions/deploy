import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import chalk from 'chalk';

import { PackageJson } from '../lib/package-managers/package-json.interface.js';
import { MESSAGES } from '../lib/ui/messages.js';
import {
  ConfigurationLoader,
  DeployConfiguration,
  configFileName,
} from '../lib/utils/configuration.loader.js';
import { AbstractConfigCreator } from '../strategies/config-creators/abstract.js';
import { CreatorLoader } from '../strategies/config-creators/creator-loader.js';
import { StrategySelector } from '../strategies/strategy.selector.js';

import { AbstractAction } from './abstract.action.js';

export class InitAction extends AbstractAction {
  projectName: string;
  config: DeployConfiguration | null = null;
  configCreator: AbstractConfigCreator | null = null;

  async getConfigCreator() {
    if (!this.configCreator) {
      const strategyType = await StrategySelector.selectStrategy();
      this.configCreator = CreatorLoader.load(strategyType);
    }
    return this.configCreator;
  }

  public async handle() {
    this.ensureCalledFromProjectDirectory();
    const isInitialized = await this.isAlreadyInitialized();
    this.ensureConfigurationFileIsIgnoredByGit();
    await this.getConfigCreator();
    if (isInitialized) {
      await this.offerUpdateConfiguration();
    } else {
      await this.createConfiguration();
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
    this.config = await ConfigurationLoader.load(configFileName);
    return this.config !== null;
  }

  async offerUpdateConfiguration() {
    const configCreator = await this.getConfigCreator();
    await configCreator.offerUpdateConfiguration();
  }

  async createConfiguration() {
    const configCreator = await this.getConfigCreator();
    await configCreator.createConfiguration();
  }

  ensureConfigurationFileIsIgnoredByGit() {
    const gitIgnore = join(process.cwd(), '.gitignore');
    try {
      const buffer = readFileSync(gitIgnore);
      const gitIgnorePatterns = buffer
        .toString()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !line.startsWith('#'));

      if (!gitIgnorePatterns.some((pattern) => pattern === configFileName)) {
        writeFileSync(gitIgnore, `#deployment config \n${configFileName}\n\n${buffer.toString()}`);
      }
    } catch {
      // git might not be initialized
      // just skip it then
    }
  }
}
