import { AbstractAction } from './abstract.action.js';

export class MultiAction extends AbstractAction {
  constructor(private actions: AbstractAction[]) {
    super();
  }

  public async handle() {
    for (const action of this.actions) {
      await action.handle();
    }
  }
}
