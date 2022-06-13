import { InstanceMeta } from "../../schema/instance.model";

export class RegistrationRequest {
  constructor(
    public readonly applicationId: string,
    public readonly groupId: string,
    public readonly meta: InstanceMeta
  ) {}
}
