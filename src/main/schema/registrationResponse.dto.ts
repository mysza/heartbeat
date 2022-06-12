import { Schema } from "@ubio/framework";

export interface RegistrationResponse {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta?: Record<string, unknown>;
}

export const Application = new Schema<RegistrationResponse>({
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
