import { Schema } from "@ubio/framework";

export type InstanceBase = {
    id: string;
    group: string;
    meta?: Record<string, unknown>;
}

export type InstanceTemporal = {
    createdAt: number;
    updatedAt: number;
}

export type Instance = InstanceBase & InstanceTemporal;

export const Instance = new Schema<Instance>({
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
            createdAt: {
                type: "number",
            },
            updatedAt: {
                type: "number",
            },
            meta: {
                type: "object",
                properties: {},
                additionalProperties: true,
                optional: true,
            }
        },
        required: ["id", "group", "createdAt", "updatedAt"],
    },
    defaults: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
});
