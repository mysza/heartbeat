import { PathParam, Post, Router, BodyParam, Get } from "@ubio/framework";
import { injectable, inject } from "inversify";
import {
  ApplicationIdJsonSchema,
  GroupIdJsonSchema,
  Meta,
  MetaJsonSchema,
} from "../schema/instance.model";
import { RegistrationResponse } from "../schema/registrationResponse.dto";
import { HeartbeatService } from "../services/heartbeat.service";

@injectable()
export class HeartbeatRouter extends Router {
  constructor(
    @inject(HeartbeatService)
    private heartbeatService: HeartbeatService
  ) {
    super();
  }
  @Post({
    path: "/groups/{group}/apps/{id}",
    responses: {
      200: {
        description: "Application registration or update",
        contentType: "application/json",
        schema: RegistrationResponse,
      },
    },
  })
  async register(
    @PathParam("group", { schema: GroupIdJsonSchema })
    group: string,
    @PathParam("id", { schema: ApplicationIdJsonSchema })
    id: string,
    @BodyParam("meta", {
      schema: MetaJsonSchema,
      required: false,
    })
    meta: Meta = {}
  ): Promise<RegistrationResponse> {
    this.logger.addContextData({ group, id });
    return this.heartbeatService.register({ id, group, meta });
  }

  @Get({
    path: "/ping",
    responses: {
      200: {
        description: "Pong",
        contentType: "application/json",
        schema: {
          type: "object",
          properties: {
            status: {
              type: "enum",
              enum: ["ok", "bad"],
            },
          },
          required: ["status"],
        },
      },
    },
  })
  async ping() {
    return { status: Math.random() > 0.5 ? "ok" : "bad" };
  }
}
