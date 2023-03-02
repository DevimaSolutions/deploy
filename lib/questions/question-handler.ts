import { Answers, Question } from 'inquirer';
import * as inquirer from 'inquirer';
import Joi from 'joi';
export interface IQuestion {
  input: Question;
  validation?: Joi.Schema;
}

const questionHandler = async (questions: IQuestion[]) => {
  const prompt: inquirer.PromptModule = inquirer.createPromptModule();
  let answers: Answers = {};
  let answer: Answers = {};
  let i = 0;
  while (i < questions.length) {
    answer = await prompt([questions[i].input] as ReadonlyArray<Question>);

    const validation = questions[i].validation;

    if (validation) {
      const res = validation.validate(answer[questions[i].input.name as string]);
      //If the input is invalid, the user will receive an error message and repeat the same input until the answer is correct
      if (res.error) {
        console.error(res.error.message);
        continue;
      }
    }
    //If answer is correct user will get next input
    answers = { ...answer, ...answers };
    i++;
  }
  return answers;
};

export default questionHandler;
