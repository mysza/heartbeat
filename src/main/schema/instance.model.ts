import { Schema } from "@ubio/framework";
import { JsonSchema } from "@ubio/framework/out/main/schema-types";

export interface Meta {
  [key: string]: unknown;
}

export interface Instance {
  id: string;
  group: string;
  createdAt: number;
  updatedAt: number;
  meta: Meta;
}

export const ApplicationIdJsonSchema: JsonSchema<string> = {
  type: "string",
  minLength: 1,
};

export const GroupIdJsonSchema: JsonSchema<string> = {
  type: "string",
  minLength: 1,
};

export const TimestampJsonSchema: JsonSchema<number> = {
  type: "number",
};

export const MetaJsonSchema: JsonSchema<Meta> = {
  type: "object",
  properties: {},
  additionalProperties: true,
};

export const Instance = new Schema<Instance>({
  schema: {
    type: "object",
    properties: {
      id: ApplicationIdJsonSchema,
      group: GroupIdJsonSchema,
      createdAt: TimestampJsonSchema,
      updatedAt: TimestampJsonSchema,
      meta: MetaJsonSchema,
    },
    required: ["id", "group", "createdAt", "updatedAt"],
  },
  defaults: {
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
});
