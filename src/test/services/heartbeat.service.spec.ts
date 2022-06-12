import { ConsoleLogger } from "@ubio/framework";
import { Instance } from "../../main/schema/instance.model";
import { RegistrationRequest } from "../../main/schema/registrationRequest.dto";
import { ApplicationInstanceRepository } from "../../main/services/appinstance.repository";
import { HeartbeatService } from "../../main/services/heartbeat.service";

describe('heartbeat.service', () => {
    describe('register', () => {
        it('should register non-registered application', async () => {
            const id = 'test-app-id';
            const group = 'test-group-id';
            const meta = {
                test: 'test',
            };

            const repoMock: ApplicationInstanceRepository = {
                save: jest.fn().mockImplementation(async (app: Instance) => app),
                get: jest.fn().mockResolvedValue(null),
            };

            const req: RegistrationRequest = { id, group, meta };
            const service = new HeartbeatService(new ConsoleLogger(), repoMock);
            const registered = await service.register(req);

            expect(repoMock.get).toHaveBeenCalledTimes(1);
            expect(repoMock.save).toHaveBeenCalledTimes(1);

            // not testing id, group and meta, as this logic is in the mock repo
            expect(registered.createdAt).toBeGreaterThan(0);
            expect(registered.updatedAt).toBeGreaterThan(0);
        }
        );
        it('should update existing application', async () => {
            const id = 'test-app-id';
            const group = 'test-group-id';
            const meta = {
                test: 'test-updated',
            };
            const createdAt = Date.parse('2022-01-01T12:00:00.000Z');
            const updatedAt = Date.parse('2022-01-02T12:00:00.000Z');

            const repoMock: ApplicationInstanceRepository = {
                save: jest.fn().mockImplementation(async (app: Instance) => app),
                get: jest.fn().mockResolvedValue({
                    id,
                    group,
                    createdAt,
                    updatedAt,
                    meta: { test: 'test' },
                }),
            };

            const req: RegistrationRequest = { id, group, meta };
            const service = new HeartbeatService(new ConsoleLogger(), repoMock);
            const registered = await service.register(req);

            expect(repoMock.get).toHaveBeenCalledTimes(1);
            expect(repoMock.save).toHaveBeenCalledTimes(1);

            // not testing id and group as this logic is in the mock repo
            expect(registered.meta).toEqual(meta);
            expect(registered.createdAt).toEqual(createdAt);
            expect(registered.updatedAt).toBeGreaterThan(updatedAt);
        });
    });
});
