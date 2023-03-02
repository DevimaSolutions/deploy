import { promises as fs } from 'fs';
import { join } from 'node:path';

import chalk from 'chalk';
import ora from 'ora';

import { AbstractRunner } from '../runners/abstract.runner.js';
import { MESSAGES } from '../ui/index.js';
import { normalizeToKebabOrSnakeCase } from '../utils/formatting.js';

import { PackageJson } from './package-json.interface.js';
import { PackageManagerCommands } from './package-manager-commands.interface.js';
import { ProjectDependency } from './project.dependency.js';

export abstract class AbstractPackageManager {
  constructor(protected runner: AbstractRunner) {}

  public async install(directory = '.') {
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
      },
      text: MESSAGES.PACKAGE_MANAGER_INSTALLATION_IN_PROGRESS,
    });
    spinner.start();
    try {
      const commandArgs = `${this.cli.install} ${this.cli.silentFlag}`;
      const collect = true;
      const normalizedDirectory = normalizeToKebabOrSnakeCase(directory);
      await this.runner.run(commandArgs, collect, join(process.cwd(), normalizedDirectory));
      spinner.succeed();
      console.info();
      console.info(MESSAGES.PACKAGE_MANAGER_INSTALLATION_SUCCEED(directory));
      console.info();
    } catch {
      spinner.fail();
      const commandArgs = this.cli.install;
      const commandToRun = this.runner.rawFullCommand(commandArgs);
      console.error(
        chalk.red(MESSAGES.PACKAGE_MANAGER_INSTALLATION_FAILED(chalk.bold(commandToRun))),
      );
    }
  }

  public async version(): Promise<string> {
    const commandArguments = '--version';
    const collect = true;
    return this.runner.run(commandArguments, collect) as Promise<string>;
  }

  public async addProduction(dependencies: string[], tag: string): Promise<boolean> {
    const command: string = [this.cli.add, this.cli.saveFlag].filter((i) => i).join(' ');
    const args: string = dependencies.map((dependency) => `${dependency}@${tag}`).join(' ');
    const spinner = ora({
      spinner: {
        interval: 120,
        frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
      },
      text: MESSAGES.PACKAGE_MANAGER_PRODUCTION_INSTALLATION_IN_PROGRESS,
    });
    spinner.start();
    try {
      await this.add(`${command} ${args}`);
      spinner.succeed();
      return true;
    } catch {
      spinner.fail();
      return false;
    }
  }

  public async addDevelopment(dependencies: string[], tag: string) {
    const command = `${this.cli.add} ${this.cli.saveDevFlag}`;
    const args: string = dependencies.map((dependency) => `${dependency}@${tag}`).join(' ');
    await this.add(`${command} ${args}`);
  }

  private async add(commandArguments: string) {
    const collect = true;
    await this.runner.run(commandArguments, collect);
  }

  public async getProduction(): Promise<ProjectDependency[]> {
    const packageJsonContent = await this.readPackageJson();
    const packageJsonDependencies = packageJsonContent.dependencies ?? {};
    const dependencies = [];

    for (const [name, version] of Object.entries(packageJsonDependencies)) {
      dependencies.push({ name, version });
    }

    return dependencies as ProjectDependency[];
  }

  public async getDevelopment(): Promise<ProjectDependency[]> {
    const packageJsonContent = await this.readPackageJson();
    const packageJsonDevDependencies = packageJsonContent.devDependencies ?? {};
    const dependencies = [];

    for (const [name, version] of Object.entries(packageJsonDevDependencies)) {
      dependencies.push({ name, version });
    }

    return dependencies as ProjectDependency[];
  }

  private async readPackageJson<T extends PackageJson>(): Promise<T> {
    const file = await fs.readFile(join(process.cwd(), 'package.json'));
    return JSON.parse(file.toString());
  }

  public async updateProduction(dependencies: string[]) {
    const commandArguments = `${this.cli.update} ${dependencies.join(' ')}`;
    await this.update(commandArguments);
  }

  public async updateDevelopment(dependencies: string[]) {
    const commandArguments = `${this.cli.update} ${dependencies.join(' ')}`;
    await this.update(commandArguments);
  }

  private async update(commandArguments: string) {
    const collect = true;
    await this.runner.run(commandArguments, collect);
  }

  public async upgradeProduction(dependencies: string[], tag: string) {
    await this.deleteProduction(dependencies);
    await this.addProduction(dependencies, tag);
  }

  public async upgradeDevelopment(dependencies: string[], tag: string) {
    await this.deleteDevelopment(dependencies);
    await this.addDevelopment(dependencies, tag);
  }

  public async deleteProduction(dependencies: string[]) {
    const command: string = [this.cli.remove, this.cli.saveFlag].filter((i) => i).join(' ');
    const args: string = dependencies.join(' ');
    await this.delete(`${command} ${args}`);
  }

  public async deleteDevelopment(dependencies: string[]) {
    const commandArguments = `${this.cli.remove} ${this.cli.saveDevFlag} ${dependencies.join(' ')}`;
    await this.delete(commandArguments);
  }

  public async delete(commandArguments: string) {
    const collect = true;
    await this.runner.run(commandArguments, collect);
  }

  public abstract get name(): string;

  public abstract get cli(): PackageManagerCommands;
}
