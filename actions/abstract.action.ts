import { Input } from '../commands/index.js';

export abstract class AbstractAction {
  public abstract handle(inputs?: Input[], options?: Input[], extraFlags?: string[]): Promise<void>;
}
