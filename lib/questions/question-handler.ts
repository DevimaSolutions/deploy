import { Answers, Question } from 'inquirer';
import * as inquirer from 'inquirer';
import Joi from 'joi';

import { IQuestionInput, IQuestionSelect } from './question-generators.js';

export interface IQuestion {
  input: IQuestionInput | IQuestionSelect;
  validation?: Joi.Schema;
}

const questionHandler = async (questions: IQuestion[]) => {
  const prompt: inquirer.PromptModule = inquirer.createPromptModule();
  let answers: Answers = {};
  let answer: Answers = {};

  for (let i = 0; i < questions.length; ) {
    answer = await prompt([questions[i].input] as ReadonlyArray<Question>);

    const validation = questions[i].validation;

    if (validation) {
      const res = validation.validate(answer[questions[i].input.name]);

      if (res.error) {
        console.error(res.error.message);
        continue;
      }
    }

    answers = { ...answer, ...answers };
    i++;
  }
  return answers;
};

export default questionHandler;
