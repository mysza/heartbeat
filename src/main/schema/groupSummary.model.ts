export class GroupSummary {
  constructor(
    public readonly group: string,
    public readonly instances: number,
    public readonly createdAt: Date,
    public readonly lastUpdatedAt: Date
  ) {}
}
