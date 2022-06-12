import { Schema } from "@ubio/framework";
import { Instance } from "./instance.model";

export interface RegistrationRequest {
    id: string;
    group: string;
    meta?: Record<string, unknown>;
};

export const RegistrationRequest = new Schema<RegistrationRequest>({
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
                optional: true,
            }
        },
        required: ["id", "group"],
    },
    defaults: {
        meta: {},
    }
});
