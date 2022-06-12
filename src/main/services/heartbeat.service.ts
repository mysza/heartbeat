import { inject, injectable } from "inversify";
import { Logger } from '@ubio/framework';
import { RegistrationResponse } from "../schema/registrationResponse.dto";
import { ApplicationInstanceRepository } from "./appinstance.repository";
import { RegistrationRequest } from "../schema/registrationRequest.dto";
import { Instance } from "../schema/instance.model";

@injectable()
export class HeartbeatService {
    constructor(
        @inject(Logger)
        private logger: Logger,
        @inject(ApplicationInstanceRepository)
        private appInstanceRepo: ApplicationInstanceRepository) {
        }

    public async register(req: RegistrationRequest): Promise<RegistrationResponse> {
        this.logger.info(`Registering application ${req.id} in group ${req.group}`);
        const { id, group, meta } = req;
        const existingApp = await this.appInstanceRepo.get(id, group);
        if (existingApp !== null) {
            this.logger.info(`Updating ${existingApp.id} heartbeat`);
            const updated = { ...existingApp, updatedAt: Date.now(), meta };
            return await this.appInstanceRepo.save(updated);
        }
        const newApp = Instance.create({
            id,
            group,
            meta,
        })
        return await this.appInstanceRepo.save(newApp)
    }

    // public async unregister(application: Application) {
    //     this.logger.info(`Unregistering application ${application.id}`);
    //     // check if application exists
    //     // if it does, delete it
    // }

    // public async getAll() {
    //     this.logger.info(`Getting all applications`);
    //     // return all applications
    // }

    // public async getGroup(group: string) {
    //     this.logger.info(`Getting applications in group ${group}`);
    //     // return applications in group
    // }
}
