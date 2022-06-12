import { Instance } from "../schema/instance.model";
import { ApplicationInstanceRepository } from "../services/appinstance.repository";

export class MemoryApplicationInstanceRepository extends ApplicationInstanceRepository {
  private instances = new Map<string, Instance>();

  private getIdentifier = (id: string, group: string) => `${id}-${group}`;

  public async save(application: Instance): Promise<Instance> {
    const identifier = this.getIdentifier(application.id, application.group);
    this.instances.set(identifier, application);
    return application;
  }

  public async get(id: string, group: string): Promise<Instance | null> {
    const identifier = this.getIdentifier(id, group);
    return this.instances.get(identifier) || null;
  }

  public async getAll(): Promise<Instance[]> {
    return Array.from(this.instances.values());
  }

  public async delete(id: string, group: string): Promise<Instance | null> {
    const identifier = this.getIdentifier(id, group);
    const application = this.instances.get(identifier);
    if (application === undefined) {
      return null;
    }
    this.instances.delete(identifier);
    return application;
  }
}
