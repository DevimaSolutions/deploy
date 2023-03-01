import { closeSync, existsSync, openSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { Answers } from 'inquirer';

import { deployConfigSchema } from '../validation/configs.schema.js';

export const configFileName = '.dsdeployrc';

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
  public static validationSchema = deployConfigSchema;

  public static async load(configFilePath: string) {
    try {
      const buffer = readFileSync(configFilePath);
      const configFile = JSON.parse(buffer.toString()) as DeployConfiguration;

      const values = await this.validationSchema.validateAsync(configFile);
      return values;
    } catch {
      return null;
    }
  }

  public static upsert(key: string, values: Answers) {
    const configFilePath = join(process.cwd(), configFileName);
    if (!existsSync(configFilePath)) {
      closeSync(openSync(configFilePath, 'w'));
    }
    const configString = readFileSync(configFilePath).toString();

    const configs = configString.length ? JSON.parse(configString) : {};
    configs[key] = { ...configs[key], ...values };

    writeFileSync(configFileName, JSON.stringify(configs, null, 4));
  }
}
