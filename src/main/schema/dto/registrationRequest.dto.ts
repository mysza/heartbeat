import { InstanceMeta } from "../models/instance.model";

export class RegistrationRequest {
  constructor(
    public readonly applicationId: string,
    public readonly groupId: string,
    public readonly meta: InstanceMeta
  ) {}
}
