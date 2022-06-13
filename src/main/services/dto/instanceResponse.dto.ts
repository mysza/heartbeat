import { Instance } from "../../schema/instance.model";

export const createInstanceResponse = (instance: Instance) => ({
  id: instance.id,
  group: instance.group,
  meta: instance.meta,
  createdAt: instance.createdAt.getTime(),
  updatedAt: instance.updatedAt.getTime(),
});

export type InstanceResponse = ReturnType<typeof createInstanceResponse>;
