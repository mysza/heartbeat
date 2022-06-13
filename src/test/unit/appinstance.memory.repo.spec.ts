import { ConsoleLogger } from "@ubio/framework";
import { MemoryApplicationInstanceRepository } from "../../main/repos/appinstance.memory.repo";
import { Instance } from "../../main/schema/models/instance.model";

describe("memory repo", () => {
  it("should store instance", async () => {
    const id = "test-app-id";
    const group = "test-group-id";
    const meta = { test: "test" };
    const repo = new MemoryApplicationInstanceRepository(new ConsoleLogger());
    const instance = new Instance(id, group, meta);

    const stored = await repo.saveInstance(instance);
    const retrieved = await repo.getInstance(group, id);
    expect(stored).toEqual(retrieved);
  });
});
