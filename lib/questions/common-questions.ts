import { generateSelect } from './question-generators.js';
import questionHandler from './question-handler.js';

export const yesOrNoSelect = async (message: string): Promise<boolean> => {
  const questions = [
    {
      input: generateSelect('yesOrNoSelect', message, ['Yes', 'No']),
    },
  ];

  const buildAnswers = await questionHandler(questions);
  const answer = buildAnswers['yesOrNoSelect'];

  return answer === 'Yes';
};
