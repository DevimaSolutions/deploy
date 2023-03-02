import { generateConfirm } from './question-generators.js';
import questionHandler from './question-handler.js';

export const yesOrNoSelect = async (message: string): Promise<boolean> => {
  const questions = [
    {
      input: generateConfirm('confirm', message),
    },
  ];

  const buildAnswers = await questionHandler(questions);
  const answer = buildAnswers['confirm'];

  return answer;
};
