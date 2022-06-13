import { GroupSummary } from "../../schema/groupSummary.model";

export const createGroupResponse = (group: GroupSummary) => ({
  group: group.group,
  instances: group.instances,
  createdAt: group.createdAt.getTime(),
  lastUpdatedAt: group.lastUpdatedAt.getTime(),
});

export type GroupResponse = ReturnType<typeof createGroupResponse>;
