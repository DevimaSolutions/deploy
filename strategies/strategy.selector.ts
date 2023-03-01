import { generateSelect } from '../lib/questions/question-generators.js';
import questionHandler from '../lib/questions/question-handler.js';
import { MESSAGES } from '../lib/ui/messages.js';

import { DeploymentType } from './enums.js';

export class StrategySelector {
  public static async selectStrategy(): Promise<DeploymentType> {
    const questions = [
      {
        input: generateSelect(
          'deploymentType',
          MESSAGES.SELECT_DEPLOYMENT_TYPE,
          Object.values(DeploymentType),
        ),
      },
    ];

    const buildAnswers = await questionHandler(questions);
    const answer = buildAnswers['deploymentType'] as DeploymentType;

    return answer;
  }
}
