import { DeploymentType } from '../../strategies/enums.js';

import { AbstractConfigCreator } from './abstract.js';
import { VpsConfigCreator } from './vps.js';

export class DeploymentStrategyCreatorFactory {
  private static strategySelector = {
    [DeploymentType.VPS]: VpsConfigCreator,
  };

  public static create(type: DeploymentType): AbstractConfigCreator {
    const creator = new this.strategySelector[type]();

    return creator;
  }
}
