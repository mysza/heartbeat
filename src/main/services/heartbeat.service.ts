import { inject, injectable } from "inversify";
import { Logger } from "@ubio/framework";
import { RegistrationResponse } from "../schema/registrationResponse.dto";
import { ApplicationInstanceRepository } from "./appinstance.repository";
import { RegistrationRequest } from "../schema/registrationRequest.dto";
import { Instance } from "../schema/instance.model";
import { UnregistrationRequest } from "../schema/unregistrationRequest.dto";
import { UnregistrationResponse } from "../schema/unregistrationResponse.dto";
import { ApplicationNotFoundError } from "./applicationNotFound.error";

@injectable()
export class HeartbeatService {
  constructor(
    @inject(Logger)
    private logger: Logger,
    @inject(ApplicationInstanceRepository)
    private appInstanceRepo: ApplicationInstanceRepository
  ) {}

  public async register(
    req: RegistrationRequest
  ): Promise<RegistrationResponse> {
    this.logger.info(`registering application`, {
      id: req.id,
      group: req.group,
    });
    const { id, group, meta } = req;
    const existingApp = await this.appInstanceRepo.get(id, group);
    if (existingApp !== null) {
      const updated = { ...existingApp, updatedAt: Date.now(), meta };
      this.logger.info(`updating heartbeat`, updated);
      return await this.appInstanceRepo.save(updated);
    }
    const newApp = Instance.create({
      id,
      group,
      meta,
    });
    const added = await this.appInstanceRepo.save(newApp);
    this.logger.info("new instance added", added);
    return added;
  }

  public async unregister(
    req: UnregistrationRequest
  ): Promise<UnregistrationResponse> {
    const { id, group } = req;
    this.logger.info(`unregistering application`, { id, group });
    const existingApp = await this.appInstanceRepo.get(id, group);
    if (existingApp === null) {
      this.logger.info(`application to unregister not found`, { id, group });
      throw new ApplicationNotFoundError(id, group);
    }
    const unregistered = await this.appInstanceRepo.delete(id, group);
    this.logger.info(`unregistered instance`, unregistered);
    return unregistered;
  }

  // public async getAll() {
  //     this.logger.info(`Getting all applications`);
  //     // return all applications
  // }

  // public async getGroup(group: string) {
  //     this.logger.info(`Getting applications in group ${group}`);
  //     // return applications in group
  // }
}
