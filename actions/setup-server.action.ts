import fs from 'node:fs/promises';
import { join } from 'node:path';

import chalk from 'chalk';

import { AbstractPackageManager, PackageManagerFactory } from '../lib/package-managers/index.js';
import { BANNER } from '../lib/ui/index.js';
import { packageInfo } from '../lib/utils/package-info.js';

import { AbstractAction } from './abstract.action.js';

interface LockfileDependency {
  version: string;
}

interface PackageJsonDependencies {
  [key: string]: LockfileDependency;
}

export class SetupServerAction extends AbstractAction {
  private manager!: AbstractPackageManager;

  public async handle() {
    this.manager = await PackageManagerFactory.find();
    this.displayBanner();
    await this.displaySystemInformation();
    await this.displayInformation();
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

  async displayInformation(): Promise<void> {
    this.displayCliVersion();
  }

  displayCliVersion(): void {
    console.info(chalk.green('[DS Deploy CLI]'));
    console.info('DS Deploy CLI Version :', chalk.blue(packageInfo.version), '\n');
  }

  async readProjectPackageDependencies(): Promise<PackageJsonDependencies> {
    const buffer = fs.readFile(join(process.cwd(), 'package.json'));
    const pack = JSON.parse(buffer.toString());
    const dependencies = { ...pack.dependencies, ...pack.devDependencies };
    Object.keys(dependencies).forEach((key) => {
      dependencies[key] = {
        version: dependencies[key],
      };
    });
    return dependencies;
  }
}
