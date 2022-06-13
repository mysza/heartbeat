import { inject, injectable } from "inversify";
import { Logger, config, Config } from "@ubio/framework";
import { Instance } from "../schema/instance.model";
import { ApplicationInstanceRepository } from "./appinstance.repository";
import { RegistrationRequest } from "./dto/registrationRequest.dto";
import { UnregistrationRequest } from "./dto/unregistrationRequest.dto";
import { createGroupResponse, GroupResponse } from "./dto/groupResponse.dto";
import {
  createInstanceResponse,
  InstanceResponse,
} from "./dto/instanceResponse.dto";

@injectable()
export class HeartbeatService {
  @config({ default: 5 }) MAX_AGE_SECONDS!: number;

  constructor(
    @inject(Logger)
    private logger: Logger,
    @inject(ApplicationInstanceRepository)
    private appInstanceRepo: ApplicationInstanceRepository,
    @inject(Config) public config: Config
  ) {}

  public async register(req: RegistrationRequest): Promise<InstanceResponse> {
    this.logger.info(`registering application`, {
      id: req.applicationId,
      group: req.groupId,
    });
    const { applicationId, groupId, meta } = req;
    const instance =
      (await this.appInstanceRepo.getInstance(groupId, applicationId)) ??
      new Instance(applicationId, groupId, meta);
    const added = await this.appInstanceRepo.saveInstance(
      instance.update(meta)
    );
    return createInstanceResponse(added);
  }

  public async unregister(
    req: UnregistrationRequest
  ): Promise<InstanceResponse | null> {
    const { applicationId, groupId } = req;
    this.logger.info(`unregistering application`, {
      id: applicationId,
      group: groupId,
    });
    const unregistered = await this.appInstanceRepo.deleteInstance(
      groupId,
      applicationId
    );
    return unregistered ? createInstanceResponse(unregistered) : null;
  }

  public async getAllGroups(): Promise<GroupResponse[]> {
    this.logger.info(`getting groups summary`);
    const groupSummaries = await this.appInstanceRepo.getAllGroups();
    return groupSummaries.map((group) => createGroupResponse(group));
  }

  public async getAllInstances(
    group: string
  ): Promise<InstanceResponse[] | null> {
    this.logger.info(`getting all instances`);
    const groupInstances = await this.appInstanceRepo.getAllInstances(group);
    if (groupInstances !== null) {
      return groupInstances.map((instance) => createInstanceResponse(instance));
    }
    return null;
  }

  public async sweep(): Promise<void> {
    this.logger.info(`sweeping instances`, {
      maxAgeSeconds: this.MAX_AGE_SECONDS,
    });
    const maxUpdatedAt = new Date(Date.now() - this.MAX_AGE_SECONDS * 1000);
    await this.appInstanceRepo.deleteOlderThan(maxUpdatedAt);
  }
}
