import { inject, injectable } from "inversify";
import { Logger } from "@ubio/framework";
import { ApplicationInstanceRepository } from "./appinstance.repository";
import { RegistrationRequest } from "../schema/dto/registrationRequest.dto";
import { Instance } from "../schema/models/instance.model";
import { UnregistrationRequest } from "../schema/dto/unregistrationRequest.dto";
import {
  createGroupResponse,
  GroupResponse,
} from "../schema/dto/groupResponse.dto";
import {
  createInstanceResponse,
  InstanceResponse,
} from "../schema/dto/instanceResponse.dto";

@injectable()
export class HeartbeatService {
  constructor(
    @inject(Logger)
    private logger: Logger,
    @inject(ApplicationInstanceRepository)
    private appInstanceRepo: ApplicationInstanceRepository
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
}
