import { Schema } from "@ubio/framework";
import { JsonSchema } from "@ubio/framework/out/main/schema-types";

export type InstanceMeta = {
  [key: string]: unknown;
};

export class Instance {
  constructor(
    public readonly id: string,
    public readonly group: string,
    private _meta: InstanceMeta = {},
    public readonly createdAt: Date = new Date(),
    private _updatedAt: Date = new Date()
  ) {}

  public get meta(): InstanceMeta {
    return this._meta;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(meta: InstanceMeta): Instance {
    this._meta = meta;
    this._updatedAt = new Date();
    return this;
  }
}
