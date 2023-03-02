import chalk from 'chalk';

import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers/index.js';
import { yesOrNoSelect } from '../lib/questions/common-questions.js';
import { BANNER, MESSAGES } from '../lib/ui/index.js';
import { ConfigurationLoader } from '../lib/utils/configuration.loader.js';
import displayLogger from '../lib/utils/display.logger.js';
import { packageInfo } from '../lib/utils/package-info.js';
import { DeploymentStrategyCreatorFactory } from '../strategies/config-creators/creator-loader.js';
import { StrategySelector } from '../strategies/strategy.selector.js';

import { AbstractAction } from './abstract.action.js';

export class InfoAction extends AbstractAction {
  private manager!: AbstractPackageManager;

  public async handle() {
    this.manager = await PackageManagerFactory.find();
    this.displayBanner();
    await this.displaySystemInformation();
    this.displayCliVersion();
    await this.displayConfigFile();
  }

  private displayBanner() {
    console.info(chalk.red(BANNER));
  }

  private async displaySystemInformation(): Promise<void> {
    console.info(chalk.green('[System Information]'));
    console.info('NodeJS Version :', chalk.blue(process.version));
    await this.displayPackageManagerVersion();
  }

  async displayPackageManagerVersion() {
    try {
      const version: string = await this.manager.version();
      console.info(`${this.manager.name} Version   :`, chalk.blue(version), '\n');
    } catch {
      console.error(`${this.manager.name} Version   :`, chalk.red('Unknown'), '\n');
    }
  }

  displayCliVersion(): void {
    console.info(chalk.green('[DS Deploy CLI]'));
    console.info('DS Deploy CLI Version :', chalk.blue(packageInfo.version), '\n');
  }

  async refreshConfiguration() {
    const updateConfiguration = await yesOrNoSelect(MESSAGES.ASK_UPDATE_CONFIG);

    if (!updateConfiguration) {
      return;
    }
    const strategyType = await StrategySelector.selectStrategy();
    const configCreator = DeploymentStrategyCreatorFactory.create(strategyType);
    await configCreator.offerUpdateConfiguration();
  }

  async displayConfigFile() {
    console.info(chalk.green('[Configuration information]'));
    const configuration = await ConfigurationLoader.load(ConfigurationLoader.configFileName);

    if (configuration.values) {
      displayLogger.displayObject(configuration.values);
    }
    if (!configuration.isValid) {
      console.info();
      await this.refreshConfiguration();
    }
  }
}
