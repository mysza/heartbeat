import { inject, injectable } from "inversify";
import { GroupSummary } from "../schema/groupSummary.model";
import { Instance } from "../schema/instance.model";
import { ApplicationInstanceRepository } from "../services/appinstance.repository";
import { MongoDb } from "@ubio/framework/out/modules/mongodb";
import { Collection, WithId } from "mongodb";
import { Logger } from "@ubio/framework";

@injectable()
export class MongoApplicationInstanceRepository extends ApplicationInstanceRepository {
  constructor(
    @inject(Logger) private logger: Logger,
    @inject(MongoDb) protected readonly mongoDb: MongoDb
  ) {
    super();
  }

  private getInstancesCollection(): Collection<Instance> {
    return this.mongoDb.db.collection<Instance>("instances");
  }

  private mapDbInstanceToInstance(dbInstance: WithId<Instance>): Instance {
    return new Instance(
      dbInstance.id,
      dbInstance.group,
      dbInstance.meta,
      dbInstance.createdAt,
      dbInstance.updatedAt
    );
  }

  public async saveInstance(instance: Instance): Promise<Instance> {
    const { id, group, meta, createdAt, updatedAt } = instance;
    const instancesCollection = this.getInstancesCollection();
    const upsertResult = await instancesCollection.findOneAndUpdate(
      { id, group },
      { $set: { id, group, meta, createdAt, updatedAt } },
      { upsert: true, returnDocument: "after" }
    );
    if (upsertResult === null || !upsertResult.ok || !upsertResult.value) {
      this.logger.error(`Failed to save instance ${id}`, upsertResult);
      throw new Error("Failed to save instance");
    }
    return this.mapDbInstanceToInstance(upsertResult.value);
  }

  public async getInstance(
    group: string,
    id: string
  ): Promise<Instance | null> {
    const instancesCollection = this.getInstancesCollection();
    const instance = await instancesCollection.findOne({
      id,
      group,
    });
    if (instance === null) {
      return null;
    }
    return this.mapDbInstanceToInstance(instance);
  }

  public async deleteInstance(
    group: string,
    id: string
  ): Promise<Instance | null> {
    const instancesCollection = this.getInstancesCollection();
    const toDelete = await instancesCollection.findOneAndDelete({
      id,
      group,
    });
    if (toDelete.ok && toDelete.value) {
      return this.mapDbInstanceToInstance(toDelete.value);
    }
    return null;
  }

  public async getAllGroups(): Promise<GroupSummary[]> {
    const aggregate = [
      {
        $group: {
          _id: "$group",
          instances: { $sum: 1 },
          createdAt: { $min: "$createdAt" },
          lastUpdatedAt: { $max: "$updatedAt" },
        },
      },
      {
        $project: {
          _id: 0,
          group: "$_id",
          instances: "$instances",
          createdAt: "$createdAt",
          lastUpdatedAt: "$lastUpdatedAt",
        },
      },
    ];

    const instancesCollection = this.getInstancesCollection();
    return await instancesCollection
      .aggregate<GroupSummary>(aggregate)
      .toArray();
  }

  public async getAllInstances(group: string): Promise<Instance[]> {
    const instancesCollection = this.getInstancesCollection();
    const instances = await instancesCollection.find({ group }).toArray();
    return instances.map((instance) => this.mapDbInstanceToInstance(instance));
  }
}
