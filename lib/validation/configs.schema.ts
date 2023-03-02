import fs from 'fs';

import Joi from 'joi';

import { MESSAGES } from '../../lib/ui/messages.js';
import {
  DeployConfiguration,
  SSHConfiguration,
  BuildConfiguration,
} from '../../lib/utils/configuration.loader.js';
import configRegex from '../regex/configs.js';

export const usernameSchema = Joi.string()
  .required()
  .error(() => new Error(MESSAGES.INVALID_USERNAME));

export const hostnameSchema = Joi.string()
  .required()
  .regex(configRegex.hostRegex)
  .error(() => new Error(MESSAGES.INVALID_HOST));
export const pathToKeyFileSchema = Joi.string()
  .required()
  .error(() => new Error(MESSAGES.INVALID_SSH_PATH))
  .custom((value, helper) => {
    if (!fs.existsSync(value)) {
      return helper.error(MESSAGES.FILE_NOT_EXISTS);
    }
    return value;
  });

export const nodeVersionSchema = Joi.string()
  .required()
  .regex(configRegex.nodeVersionRegex)
  .error(() => new Error(MESSAGES.INVALID_NODE_VERSION));

export const sshConfigsSchema = Joi.object<SSHConfiguration>({
  username: usernameSchema.required(),
  hostname: hostnameSchema.required(),
  pathToKeyFile: pathToKeyFileSchema.required(),
});

export const buildConfigsSchema = Joi.object<BuildConfiguration>({
  server: Joi.string().required().allow('nginx'),
  nodeVersion: nodeVersionSchema.required(),
});

export const deployConfigSchema = Joi.object<DeployConfiguration>({
  ssh: sshConfigsSchema.required(),
  build: buildConfigsSchema.required(),
});
