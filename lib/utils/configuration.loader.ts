import { readFileSync } from 'node:fs';

import * as Joi from 'joi';

export interface DeployConfiguration {
  ssh: {
    username: string;
    hostname: string;
    pathToKeyFile: string;
  };
  build: {
    // Only nginx is supported currently
    server: 'nginx';
    nodeVersion: string;
  };
}

export class ConfigurationLoader {
  public static validationSchema = Joi.object<DeployConfiguration>({
    ssh: Joi.object({
      username: Joi.string().required(),
      hostname: Joi.string().required(),
      pathToKeyFile: Joi.string().required(),
    }).required(),
  });

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
}
