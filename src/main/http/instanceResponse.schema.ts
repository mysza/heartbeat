import { Schema } from "@ubio/framework";
import { InstanceResponse } from "../schema/dto/instanceResponse.dto";

export const InstanceResponseSchema = new Schema<InstanceResponse>({
  schema: {
    type: "object",
    properties: {
      id: {
        type: "string",
        minLength: 1,
      },
      group: {
        type: "string",
        minLength: 1,
      },
      meta: {
        type: "object",
        properties: {},
        additionalProperties: true,
      },
      createdAt: {
        type: "number",
      },
      updatedAt: {
        type: "number",
      },
    },
  },
});

export const InstancesResponseSchema = new Schema<InstanceResponse[]>({
  schema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 1,
        },
        group: {
          type: "string",
          minLength: 1,
        },
        meta: {
          type: "object",
          properties: {},
          additionalProperties: true,
        },
        createdAt: {
          type: "number",
        },
        updatedAt: {
          type: "number",
        },
      },
    },
  },
});
