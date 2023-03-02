import chalk from 'chalk';
interface IBaseObject {
  [key: string]: unknown;
}
const displayObject = (objectToDisplay: IBaseObject, label = '') => {
  for (const key in objectToDisplay) {
    if (typeof objectToDisplay[key] === 'object' && objectToDisplay[key] !== null) {
      console.info();
      label = label.length ? `${label}.${key}` : `${key}`;
      displayObject(objectToDisplay[key] as IBaseObject, label);
      label = '';
    } else {
      console.info(`${label}.${key} : ${chalk.blue(objectToDisplay[key])}`);
    }
  }
};

const displayLogger = { displayObject };

export default displayLogger;
