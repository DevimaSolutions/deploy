import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import { join } from 'node:path';

import { Answers } from 'inquirer';

import { MESSAGES } from '../../lib/ui/messages.js';
import { deployConfigSchema } from '../validation/configs.schema.js';

export interface SSHConfiguration {
  username: string;
  hostname: string;
  pathToKeyFile: string;
}

export interface BuildConfiguration {
  server: 'nginx';
  nodeVersion: string;
}
export interface DeployConfiguration {
  ssh: SSHConfiguration;
  build: BuildConfiguration;
  [key: string]: unknown;
}

export class ConfigurationLoader {
  public static configFileName = '.dsdeployrc';

  public static validationSchema = deployConfigSchema;

  public static getConfigPath() {
    const configFilePath = join(process.cwd(), this.configFileName);
    return configFilePath;
  }

  public static async load(configFilePath: string) {
    let configFile: DeployConfiguration | null = null;
    try {
      const buffer = await fs.readFile(configFilePath);
      configFile = JSON.parse(buffer.toString()) as DeployConfiguration;

      const values = await this.validationSchema.validateAsync(configFile);

      return { values, isValid: true };
    } catch (e) {
      console.info();
      console.error(MESSAGES.INVALID_CONFIGS);

      return { values: configFile, isValid: false };
    }
  }

  public static async updateOrInsert(key: string, values: Answers) {
    const configFilePath = this.getConfigPath();

    const configString = !existsSync(configFilePath)
      ? ''
      : (await fs.readFile(configFilePath)).toString();

    const configs = configString.length ? JSON.parse(configString) : {};
    configs[key] = { ...configs[key], ...values };

    await fs.writeFile(this.configFileName, JSON.stringify(configs, null, 4));
  }
}
