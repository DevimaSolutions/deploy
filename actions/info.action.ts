import chalk from 'chalk';

import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers/index.js';
import { BANNER } from '../lib/ui/index.js';
import { ConfigurationLoader } from '../lib/utils/configuration.loader.js';
import { packageInfo } from '../lib/utils/package-info.js';

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

  private displayObject(objectToDisplay: object) {
    for (const key in objectToDisplay) {
      if (
        typeof objectToDisplay[key as keyof object] === 'object' &&
        objectToDisplay[key as keyof object] !== null
      ) {
        console.info();
        console.info(`${chalk.green(key)} :`);
        this.displayObject(objectToDisplay[key as keyof object] as object);
      } else {
        console.info(`${key} : ${chalk.blue(objectToDisplay[key as keyof object])}`);
      }
    }
  }

  async displayConfigFile() {
    console.info(chalk.green('[Configuration information]'));
    const configuration = await ConfigurationLoader.load(ConfigurationLoader.configFileName);

    if (!configuration) {
      return;
    }

    this.displayObject(configuration);
    console.info();
  }
}
