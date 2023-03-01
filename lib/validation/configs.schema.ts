import fs from 'fs';
import path from 'path';

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
  .regex(configRegex.ipRegex)
  .error(() => new Error(MESSAGES.INVALID_HOST));
export const pathToKeyFileSchema = Joi.string()
  .required()
  .error(() => new Error(MESSAGES.INVALID_SSH_PATH))
  .custom((value, helper) => {
    if (!fs.existsSync(value) || path.extname(value) !== '.pub') {
      return helper.error(MESSAGES.FILE_NOT_EXISTS);
    }
    return value;
  });

export const nodeVersionSchema = Joi.string()
  .required()
  .regex(configRegex.nodeVersionRegex)
  .error(() => new Error(MESSAGES.INVALID_NODE_VERSION));

export const sshConfigsSchema = Joi.object<SSHConfiguration>({
  username: usernameSchema,
  hostname: hostnameSchema,
  pathToKeyFile: pathToKeyFileSchema,
});

export const buildConfigsSchema = Joi.object<BuildConfiguration>({
  server: Joi.string().required().allow('nginx'),
  nodeVersion: nodeVersionSchema,
});

export const deployConfigSchema = Joi.object<DeployConfiguration>({
  ssh: sshConfigsSchema,
  build: buildConfigsSchema,
});
