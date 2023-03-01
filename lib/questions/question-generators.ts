export interface IQuestionInput {
  type: string;
  name: string;
  message: string;
  default: string;
}

export interface IQuestionSelect {
  type: string;
  name: string;
  message: string;
  choices: string[];
}

export const generateInput = (
  name: string,
  message: string,
  defaultAnswer?: string,
): IQuestionInput => ({
  type: 'input',
  name,
  message,
  default: defaultAnswer ?? '',
});

export const generateSelect = (
  name: string,
  message: string,
  choices: string[],
): IQuestionSelect => ({
  type: 'list',
  name,
  message,
  choices,
});
