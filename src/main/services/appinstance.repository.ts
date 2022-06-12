import { injectable } from "inversify";
import { Instance } from "../schema/instance.model";

/**
 * Defining the ApplicationRepository interface here, to keep the definition
 * contained to the services module.
 */
@injectable()
export abstract class ApplicationInstanceRepository {
  public abstract save(application: Instance): Promise<Instance>;
  public abstract get(id: string, group: string): Promise<Instance | null>;
  public abstract delete(id: string, group: string): Promise<Instance | null>;
  public abstract getAll(): Promise<Instance[]>;
}
