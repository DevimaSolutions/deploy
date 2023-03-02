import fs from 'node:fs/promises';
import { join } from 'node:path';

import chalk from 'chalk';

import { PackageJson } from '../lib/package-managers/package-json.interface.js';
import { MESSAGES } from '../lib/ui/messages.js';
import { ConfigurationLoader, DeployConfiguration } from '../lib/utils/configuration.loader.js';
import { AbstractConfigCreator } from '../strategies/config-creators/abstract.js';
import { DeploymentStrategyCreatorFactory } from '../strategies/config-creators/creator-loader.js';
import { StrategySelector } from '../strategies/strategy.selector.js';

import { AbstractAction } from './abstract.action.js';

export class InitAction extends AbstractAction {
  projectName: string;
  config: DeployConfiguration | null = null;
  configCreator: AbstractConfigCreator | null = null;

  async getConfigCreator() {
    if (!this.configCreator) {
      const strategyType = await StrategySelector.selectStrategy();
      this.configCreator = DeploymentStrategyCreatorFactory.create(strategyType);
    }
    return this.configCreator;
  }

  public async handle() {
    await this.ensureCalledFromProjectDirectory();
    const isInitialized = await this.isAlreadyInitialized();
    await this.ensureConfigurationFileIsIgnoredByGit();
    await this.getConfigCreator();
    if (isInitialized) {
      await this.offerUpdateConfiguration();
    } else {
      await this.createConfiguration();
    }
  }

  async ensureCalledFromProjectDirectory() {
    try {
      const { name } = await this.readProjectPackageFile();
      this.projectName = name;
    } catch (err) {
      console.error(chalk.red(MESSAGES.INFORMATION_PACKAGE_MANAGER_FAILED));
      throw new Error();
    }
  }

  async readProjectPackageFile() {
    const buffer = await fs.readFile(join(process.cwd(), 'package.json'));
    const packageFile = JSON.parse(buffer.toString());
    return packageFile as PackageJson;
  }

  async isAlreadyInitialized() {
    const config = await ConfigurationLoader.load(ConfigurationLoader.configFileName);
    if (config.isValid) {
      this.config = config.values;
    }
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

  async ensureConfigurationFileIsIgnoredByGit() {
    const gitIgnoreFilePath = join(process.cwd(), '.gitignore');
    try {
      const buffer = await fs.readFile(gitIgnoreFilePath);
      const gitIgnorePatterns = buffer
        .toString()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => !line.startsWith('#'));

      if (!gitIgnorePatterns.some((pattern) => pattern === ConfigurationLoader.configFileName)) {
        fs.writeFile(
          gitIgnoreFilePath,
          `#deployment config \n${ConfigurationLoader.configFileName}\n\n${buffer.toString()}`,
        );
      }
    } catch {
      // git might not be initialized
      // just skip it then
    }
  }
}
