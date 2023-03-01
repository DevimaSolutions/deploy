export abstract class AbstractConfigCreator {
  public abstract offerUpdateConfiguration(): Promise<void>;
  public abstract createConfiguration(): Promise<void>;
}
