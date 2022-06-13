export class UnregistrationRequest {
  constructor(
    public readonly applicationId: string,
    public readonly groupId: string
  ) {}
}
