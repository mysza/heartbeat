export class ApplicationNotFoundError extends Error {
  constructor(private id: string, private group: string) {
    super(`Application ${group}/${id} not found`);
    this.name = "ApplicationNotFoundError";
  }
}
