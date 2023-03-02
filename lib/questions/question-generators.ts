import { ListQuestionOptions, Question } from 'inquirer';

export const generateInput = (name: string, message: string, defaultAnswer?: string): Question => ({
  type: 'input',
  name,
  message,
  default: defaultAnswer ?? '',
});

export const generateSelect = (
  name: string,
  message: string,
  choices: string[],
): ListQuestionOptions => ({
  type: 'list',
  name,
  message,
  choices,
});

export const generateConfirm = (name: string, message: string): ListQuestionOptions => ({
  type: 'confirm',
  name,
  message,
});
