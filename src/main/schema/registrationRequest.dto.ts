import { Schema } from "@ubio/framework";
import {
  ApplicationIdJsonSchema,
  GroupIdJsonSchema,
  Meta,
  MetaJsonSchema,
} from "./instance.model";

export interface RegistrationRequest {
  id: string;
  group: string;
  meta: Meta;
}

export const RegistrationRequest = new Schema<RegistrationRequest>({
  schema: {
    type: "object",
    properties: {
      id: ApplicationIdJsonSchema,
      group: GroupIdJsonSchema,
      meta: MetaJsonSchema,
    },
    required: ["id", "group"],
  },
  defaults: {
    meta: {},
  },
});
