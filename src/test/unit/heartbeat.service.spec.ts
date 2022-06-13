import { ConsoleLogger } from "@ubio/framework";
import { Instance } from "../../main/schema/models/instance.model";
import { RegistrationRequest } from "../../main/schema/dto/registrationRequest.dto";
import { UnregistrationRequest } from "../../main/schema/dto/unregistrationRequest.dto";
import { ApplicationInstanceRepository } from "../../main/services/appinstance.repository";
import { ApplicationNotFoundError } from "../../main/services/applicationNotFound.error";
import { HeartbeatService } from "../../main/services/heartbeat.service";
import { GroupSummary } from "../../main/schema/models/groupSummary.model";
import { Group } from "../../main/repos/appinstance.memory.repo";

const baseMockRepo: ApplicationInstanceRepository = {
  getInstance: jest.fn(),
  getAllGroups: jest.fn(),
  saveInstance: jest.fn(),
  deleteInstance: jest.fn(),
  getAllInstances: jest.fn(),
};

describe("heartbeat.service", () => {
  describe("register", () => {
    it("should register non-registered application", async () => {
      const id = "test-app-id";
      const group = "test-group-id";
      const meta = {
        test: "test",
      };

      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        {
          saveInstance: jest
            .fn()
            .mockImplementation(async (app: Instance) => app),
          getInstance: jest.fn().mockResolvedValue(null),
        }
      );

      const req: RegistrationRequest = new RegistrationRequest(id, group, meta);
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const registered = await service.register(req);

      expect(repoMock.getInstance).toHaveBeenCalledTimes(1);
      expect(repoMock.saveInstance).toHaveBeenCalledTimes(1);
      expect(repoMock.saveInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "test-app-id",
          group: "test-group-id",
          _meta: { test: "test" },
          _updatedAt: expect.any(Date),
          createdAt: expect.any(Date),
        })
      );

      // not testing id, group and meta, as this logic is in the mock repo
      expect(registered.createdAt).toBeGreaterThan(0);
      expect(registered.updatedAt).toBeGreaterThan(0);
    });
    it("should update existing application", async () => {
      const id = "test-app-id";
      const group = "test-group-id";
      const meta = {
        test: "test-updated",
      };
      const createdAt = new Date("2022-01-01T12:00:00.000Z");
      const updatedAt = new Date("2022-01-02T12:00:00.000Z");

      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        {
          saveInstance: jest
            .fn()
            .mockImplementation(async (app: Instance) => app),
          getInstance: jest.fn().mockResolvedValue(
            new Instance(
              id,
              group,
              {
                test: "test",
              },
              createdAt,
              updatedAt
            )
          ),
        }
      );

      const req: RegistrationRequest = new RegistrationRequest(id, group, meta);
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const registered = await service.register(req);

      expect(repoMock.getInstance).toHaveBeenCalledTimes(1);
      expect(repoMock.saveInstance).toHaveBeenCalledTimes(1);

      // not testing id and group as this logic is in the mock repo
      expect(registered.meta).toEqual(meta);
      expect(registered.createdAt).toEqual(createdAt.getTime());
      expect(registered.updatedAt).toBeGreaterThan(updatedAt.getTime());
    });
  });

  describe("unregister", () => {
    it("should unregister existing application", async () => {
      const existingApp = new Instance("test-app-id", "test-group-id", {
        test: "test",
      });

      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        { deleteInstance: jest.fn().mockResolvedValue(existingApp) }
      );

      const req = new UnregistrationRequest(existingApp.id, existingApp.group);
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const unregistered = await service.unregister(req);

      expect(repoMock.deleteInstance).toHaveBeenCalledTimes(1);

      // not testing id and group as this logic is in the mock repo
      expect(unregistered.id).toEqual(existingApp.id);
      expect(unregistered.group).toEqual(existingApp.group);
    });

    it("should throw if non-existing application", async () => {
      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        { deleteInstance: jest.fn().mockResolvedValue(null) }
      );

      const req = new UnregistrationRequest("test-app-id", "test-group-id");
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);

      await expect(service.unregister(req)).rejects.toThrow(
        ApplicationNotFoundError
      );
      expect(repoMock.deleteInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe("get all", () => {
    it("should get all groups summaries", async () => {
      const groupSummaries = [
        new GroupSummary("test-group-id-1", 1, new Date(), new Date()),
        new GroupSummary("test-group-id-2", 4, new Date(), new Date()),
      ];

      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        {
          getAllGroups: jest.fn().mockResolvedValue(groupSummaries),
        }
      );
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const groups = await service.getAllGroups();

      expect(repoMock.getAllGroups).toHaveBeenCalledTimes(1);
      expect(groups).toEqual([
        {
          group: "test-group-id-1",
          instances: 1,
          createdAt: expect.any(Number),
          lastUpdatedAt: expect.any(Number),
        },
        {
          group: "test-group-id-2",
          instances: 4,
          createdAt: expect.any(Number),
          lastUpdatedAt: expect.any(Number),
        },
      ]);
    });

    it("should get all group instances for existing group", async () => {
      const group = new Group("test-group-id-1");
      group.addInstance(
        new Instance("test-app-id-1", "test-group-id-1", { test: "test" })
      );
      group.addInstance(
        new Instance("test-app-id-2", "test-group-id-1", { test: "test" })
      );
      const repoMock: ApplicationInstanceRepository = Object.assign(
        {},
        baseMockRepo,
        {
          getAllInstances: jest.fn().mockResolvedValue(group.instances),
        }
      );
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const response = await service.getAllInstances(group.name);

      expect(repoMock.getAllInstances).toHaveBeenCalledTimes(1);
      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-app-id-1",
            group: "test-group-id-1",
          }),
          expect.objectContaining({
            id: "test-app-id-2",
            group: "test-group-id-1",
          }),
        ])
      );
    });
  });
});