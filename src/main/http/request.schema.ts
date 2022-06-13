import { JsonSchema } from "@ubio/framework/out/main/schema-types";
import { InstanceMeta } from "../schema/instance.model";

export const ApplicationIdJsonSchema: JsonSchema<string> = {
  type: "string",
  minLength: 1,
};

export const GroupIdJsonSchema: JsonSchema<string> = {
  type: "string",
  minLength: 1,
};

export const MetaJsonSchema: JsonSchema<InstanceMeta> = {
  type: "object",
  properties: {},
  additionalProperties: true,
};
