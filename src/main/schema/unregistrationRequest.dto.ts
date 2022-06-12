import { Schema } from "@ubio/framework";
import { ApplicationIdJsonSchema, GroupIdJsonSchema } from "./instance.model";

export interface UnregistrationRequest {
  id: string;
  group: string;
}

export const UnregistrationRequest = new Schema<UnregistrationRequest>({
  schema: {
    type: "object",
    properties: {
      id: ApplicationIdJsonSchema,
      group: GroupIdJsonSchema,
    },
    required: ["id", "group"],
  },
});
