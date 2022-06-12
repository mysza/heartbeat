import { ConsoleLogger } from "@ubio/framework";
import { Instance } from "../../../main/schema/instance.model";
import { RegistrationRequest } from "../../../main/schema/registrationRequest.dto";
import { UnregistrationRequest } from "../../../main/schema/unregistrationRequest.dto";
import { ApplicationInstanceRepository } from "../../../main/services/appinstance.repository";
import { ApplicationNotFoundError } from "../../../main/services/applicationNotFound.error";
import { HeartbeatService } from "../../../main/services/heartbeat.service";

describe("heartbeat.service", () => {
  describe("register", () => {
    it("should register non-registered application", async () => {
      const id = "test-app-id";
      const group = "test-group-id";
      const meta = {
        test: "test",
      };

      const repoMock: ApplicationInstanceRepository = {
        save: jest.fn().mockImplementation(async (app: Instance) => app),
        get: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
      };

      const req: RegistrationRequest = { id, group, meta };
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const registered = await service.register(req);

      expect(repoMock.get).toHaveBeenCalledTimes(1);
      expect(repoMock.save).toHaveBeenCalledTimes(1);

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
      const createdAt = Date.parse("2022-01-01T12:00:00.000Z");
      const updatedAt = Date.parse("2022-01-02T12:00:00.000Z");

      const repoMock: ApplicationInstanceRepository = {
        save: jest.fn().mockImplementation(async (app: Instance) => app),
        get: jest.fn().mockResolvedValue({
          id,
          group,
          createdAt,
          updatedAt,
          meta: { test: "test" },
        }),
        delete: jest.fn().mockResolvedValue(null),
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
  describe("unregister", () => {
    it("should unregister existing application", async () => {
      const existingApp = {
        id: "test-app-id",
        group: "test-group-id",
        createdAt: Date.parse("2022-01-01T12:00:00.000Z"),
        updatedAt: Date.parse("2022-01-02T12:00:00.000Z"),
        meta: { test: "test" },
      };

      const repoMock: ApplicationInstanceRepository = {
        save: jest.fn().mockImplementation(async (app: Instance) => app),
        get: jest.fn().mockResolvedValue(existingApp),
        delete: jest.fn().mockResolvedValue(existingApp),
      };

      const req: UnregistrationRequest = {
        id: existingApp.id,
        group: existingApp.group,
      };
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      const unregistered = await service.unregister(req);

      expect(repoMock.get).toHaveBeenCalledTimes(1);
      expect(repoMock.delete).toHaveBeenCalledTimes(1);

      // not testing id and group as this logic is in the mock repo
      expect(unregistered.id).toEqual(existingApp.id);
      expect(unregistered.group).toEqual(existingApp.group);
    });

    it("should not unregister non-existing application", async () => {
      const existingApp = {
        id: "test-app-id",
        group: "test-group-id",
        createdAt: Date.parse("2022-01-01T12:00:00.000Z"),
        updatedAt: Date.parse("2022-01-02T12:00:00.000Z"),
        meta: { test: "test" },
      };

      const repoMock: ApplicationInstanceRepository = {
        save: jest.fn().mockImplementation(async (app: Instance) => app),
        get: jest.fn().mockResolvedValue(null),
        delete: jest.fn().mockResolvedValue(null),
      };

      const req: UnregistrationRequest = {
        id: "non-existing-id",
        group: "non-existing-group",
      };
      const service = new HeartbeatService(new ConsoleLogger(), repoMock);
      await expect(service.unregister(req)).rejects.toThrow(
        ApplicationNotFoundError
      );

      expect(repoMock.get).toHaveBeenCalledTimes(1);
      expect(repoMock.delete).toHaveBeenCalledTimes(0);
    });
  });
});
