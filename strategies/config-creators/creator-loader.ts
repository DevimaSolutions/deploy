import { DeploymentType } from '../../strategies/enums.js';

import { AbstractConfigCreator } from './abstract.js';
import { VpsConfigCreator } from './vps.js';

export class CreatorLoader {
  private static strategySelector = {
    [DeploymentType.Vps]: VpsConfigCreator,
  };

  public static load(type: DeploymentType): AbstractConfigCreator {
    const creator = new this.strategySelector[type]();

    return creator;
  }
}
