import axios from "axios";
import { v4 as uuid } from "uuid";

const registerInstance = async (
  group: string,
  id: string,
  meta: Record<string, unknown>
) =>
  await axios.post(`http://localhost:8080/groups/${group}/apps/${id}`, {
    meta,
  });

describe("heartbeat service", () => {
  describe("registering applications", () => {
    it("should register non-registered application", async () => {
      const id = uuid();
      const group = uuid();
      const meta = {
        test: "test",
      };

      const res = await registerInstance(group, id, meta);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(id);
      expect(res.data.group).toBe(group);
      expect(res.data.meta).toEqual(meta);
      expect(res.data.createdAt).toBeGreaterThan(0);
      expect(res.data.updatedAt).toBeGreaterThan(0);
    });
    it("should update already registered application", async () => {
      const id = uuid();
      const group = uuid();
      const meta = {
        test: "test",
      };

      const resInitial = await registerInstance(group, id, meta);
      const metaUpdated = { test: "test-updated" };
      const res = await registerInstance(group, id, metaUpdated);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(id);
      expect(res.data.group).toBe(group);
      expect(res.data.meta).toEqual(metaUpdated);
      expect(res.data.createdAt).toBe(resInitial.data.createdAt);
      expect(res.data.updatedAt).toBeGreaterThan(resInitial.data.createdAt);
    });
  });
});
