import { injectable } from "inversify";
import { GroupSummary } from "../schema/groupSummary.model";
import { Instance } from "../schema/instance.model";

/**
 * Defining the ApplicationRepository interface here, to keep the definition
 * contained to the services module.
 */
@injectable()
export abstract class ApplicationInstanceRepository {
  public abstract saveInstance(instance: Instance): Promise<Instance>;
  public abstract getInstance(
    group: string,
    id: string
  ): Promise<Instance | null>;
  public abstract deleteInstance(
    group: string,
    id: string
  ): Promise<Instance | null>;
  public abstract getAllGroups(): Promise<GroupSummary[]>;
  public abstract getAllInstances(group: string): Promise<Instance[] | null>;
  public abstract deleteOlderThan(date: Date): Promise<void>;
}
