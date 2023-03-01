import { generateInput, generateSelect } from '../../lib/questions/question-generators.js';
import questionHandler from '../../lib/questions/question-handler.js';
import { MESSAGES } from '../../lib/ui/messages.js';
import { ConfigurationLoader, DeployConfiguration } from '../../lib/utils/configuration.loader.js';
import nodeVersionLoader from '../../lib/utils/node-version.loader.js';
import {
  usernameSchema,
  hostnameSchema,
  pathToKeyFileSchema,
  nodeVersionSchema,
} from '../../lib/validation/configs.schema.js';

import { AbstractConfigCreator } from './abstract.js';

export class VpsConfigCreator extends AbstractConfigCreator {
  config: DeployConfiguration | null = null;

  async offerUpdateConfiguration() {
    console.info(MESSAGES.UPDATING_CONFIGURATION);
    console.info();
    console.info(MESSAGES.SSH_CONFIGURATION);

    const sshConfigs = await this.sshQuestions();
    ConfigurationLoader.upsert('ssh', sshConfigs);

    console.info(MESSAGES.CONFIGURATION_UPDATED('ssh'));
    console.info(MESSAGES.BUILD_CONFIGURATION);

    const buildConfigs = await this.buildQuestions();
    ConfigurationLoader.upsert('build', buildConfigs);

    console.info(MESSAGES.CONFIGURATION_UPDATED('build'));
  }

  async createConfiguration() {
    console.info(MESSAGES.CREATING_NEW_CONFIGURATION);
    console.info();
    console.info(MESSAGES.SSH_CONFIGURATION);

    const sshConfigs = await this.sshQuestions();
    ConfigurationLoader.upsert('ssh', sshConfigs);

    console.info(MESSAGES.CONFIGURATION_CREATED('ssh'));
    console.info(MESSAGES.BUILD_CONFIGURATION);

    const buildConfigs = await this.buildQuestions();
    ConfigurationLoader.upsert('build', buildConfigs);

    console.info(MESSAGES.CONFIGURATION_CREATED('build'));
  }

  async sshQuestions() {
    const questions = [
      {
        input: generateInput('hostname', MESSAGES.ENTER_HOST),
        validation: hostnameSchema,
      },
      {
        input: generateInput('username', MESSAGES.ENTER_USERNAME),
        validation: usernameSchema,
      },
      {
        input: generateInput('pathToKeyFile', MESSAGES.ENTER_SSH_PATH),
        validation: pathToKeyFileSchema,
      },
    ];
    const sshAnswers = await questionHandler(questions);

    return sshAnswers;
  }

  async buildQuestions() {
    const node = await nodeVersionLoader.getLastLts();
    const questions = [
      {
        input: generateInput('nodeVersion', MESSAGES.ENTER_NODE_VERSION, node.version),
        validation: nodeVersionSchema,
      },
      {
        input: generateSelect('server', MESSAGES.SELECT_SERVER, ['nginx']),
      },
    ];
    const buildAnswers = await questionHandler(questions);

    return buildAnswers;
  }
}
