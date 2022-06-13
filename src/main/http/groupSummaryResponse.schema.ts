import { Schema } from "@ubio/framework";
import { GroupResponse } from "../services/dto/groupResponse.dto";

export const GroupsSummaryResponseSchema = new Schema<GroupResponse[]>({
  schema: {
    type: "array",
    items: {
      type: "object",
      properties: {
        group: {
          type: "string",
          minLength: 1,
        },
        instances: {
          type: "number",
        },
        createdAt: {
          type: "number",
        },
        lastUpdatedAt: {
          type: "number",
        },
      },
    },
  },
});
