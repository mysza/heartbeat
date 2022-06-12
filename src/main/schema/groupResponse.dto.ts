export interface GroupResponse {
  group: string;
  instances: number;
  createdAt: number;
  lastUpdatedAt: number;
}

export const createGroupResponse = (
  group: string,
  instances: number,
  createdAt: number,
  lastUpdatedAt: number
): GroupResponse => ({
  group,
  instances,
  createdAt,
  lastUpdatedAt,
});
