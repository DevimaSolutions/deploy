import { closeSync, existsSync, openSync, readFileSync, writeFileSync } from 'node:fs';
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
}

export class ConfigurationLoader {
  public static configFileName = '.dsdeployrc';

  public static validationSchema = deployConfigSchema;

  public static getConfigPath() {
    const configFilePath = join(process.cwd(), this.configFileName);
    return configFilePath;
  }

  public static async load(configFilePath: string) {
    try {
      const buffer = readFileSync(configFilePath);
      const configFile = JSON.parse(buffer.toString()) as DeployConfiguration;

      const values = await this.validationSchema.validateAsync(configFile);

      return values;
    } catch (e) {
      console.error(MESSAGES.INVALID_CONFIGS);

      return null;
    }
  }

  public static upsert(key: string, values: Answers) {
    const configFilePath = this.getConfigPath();
    if (!existsSync(configFilePath)) {
      closeSync(openSync(configFilePath, 'w'));
    }
    const configString = readFileSync(configFilePath).toString();

    const configs = configString.length ? JSON.parse(configString) : {};
    configs[key] = { ...configs[key], ...values };

    writeFileSync(this.configFileName, JSON.stringify(configs, null, 4));
  }
}
