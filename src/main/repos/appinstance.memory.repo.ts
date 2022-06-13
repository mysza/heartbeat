import { Logger } from "@ubio/framework";
import { inject } from "inversify";
import { GroupSummary } from "../schema/models/groupSummary.model";
import { Instance } from "../schema/models/instance.model";
import { ApplicationInstanceRepository } from "../services/appinstance.repository";

// Group is internal to the data layer, not relevant to the service.
export class Group {
  private _instances: Record<string, Instance> = {};
  private _createdAt: Date = new Date();
  private _lastUpdatedAt: Date = new Date();

  // can only construct a new group with an instance
  constructor(private _name: string) {}

  public addInstance(instance: Instance): Instance {
    this._instances[instance.id] = instance;
    this._lastUpdatedAt = new Date();
    return instance;
  }

  public getInstance(id: string): Instance | null {
    return this._instances[id] ?? null;
  }

  public deleteInstance(id: string): Instance | null {
    const instance = this._instances[id] ?? null;
    if (instance) {
      delete this._instances[id];
      this._lastUpdatedAt = new Date();
    }
    return instance;
  }

  public get instances(): Instance[] {
    return Object.values(this._instances);
  }

  public get name(): string {
    return this._name;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get lastUpdatedAt(): Date {
    return this._lastUpdatedAt;
  }

  public get instanceCount(): number {
    return Object.entries(this._instances).length;
  }

  public get summary(): GroupSummary {
    return new GroupSummary(
      this.name,
      this.instanceCount,
      this.createdAt,
      this.lastUpdatedAt
    );
  }
}

export class MemoryApplicationInstanceRepository extends ApplicationInstanceRepository {
  private groups: Record<string, Group> = {};

  constructor(@inject(Logger) private logger: Logger) {
    super();
  }

  public async saveInstance(application: Instance): Promise<Instance> {
    this.logger.info("saving instance", { instance: application });
    const group =
      this.groups[application.group] ?? new Group(application.group);
    group.addInstance(application);
    this.groups[application.group] = group;
    return application;
  }

  public async getInstance(
    groupName: string,
    id: string
  ): Promise<Instance | null> {
    this.logger.info(`getting instance`, { group: groupName, id });
    const group = this.groups[groupName];
    if (group === undefined) {
      return null;
    }
    return group.getInstance(id);
  }

  public async deleteInstance(
    groupName: string,
    id: string
  ): Promise<Instance | null> {
    this.logger.info(`deleting instance`, { group: groupName, id });
    const group = this.groups[groupName];
    if (group === undefined) {
      return null;
    }
    return group.deleteInstance(id);
  }

  public async getAllGroups(): Promise<GroupSummary[]> {
    this.logger.info(`getting groups summary`);
    return Object.values(this.groups).map((group) => group.summary);
  }

  public async getAllInstances(groupName: string): Promise<Instance[]> {
    this.logger.info(`getting all instances for group`, { groupName });
    const group = this.groups[groupName];
    if (group === undefined) {
      return [];
    }
    return group.instances;
  }
}
