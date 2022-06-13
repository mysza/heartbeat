import {
  PathParam,
  Post,
  Router,
  BodyParam,
  Get,
  Delete,
} from "@ubio/framework";
import { injectable, inject } from "inversify";
import { createGroupResponse } from "../schema/dto/groupResponse.dto";
import { InstanceResponse } from "../schema/dto/instanceResponse.dto";
import { RegistrationRequest } from "../schema/dto/registrationRequest.dto";
import { UnregistrationRequest } from "../schema/dto/unregistrationRequest.dto";
import { InstanceMeta } from "../schema/models/instance.model";
import { HeartbeatService } from "../services/heartbeat.service";
import { GroupsSummaryResponseSchema } from "./groupSummaryResponse.schema";
import {
  InstanceResponseSchema,
  InstancesResponseSchema,
} from "./instanceResponse.schema";
import {
  GroupIdJsonSchema,
  ApplicationIdJsonSchema,
  MetaJsonSchema,
} from "./request.schema";

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
        schema: InstanceResponseSchema,
      },
      400: {
        description: "Bad request",
        contentType: "application/json",
      },
      500: {
        description: "Internal server error",
        contentType: "application/json",
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
    meta: InstanceMeta = {}
  ): Promise<InstanceResponse> {
    this.logger.addContextData({ group, id });
    const registrationRequest = new RegistrationRequest(id, group, meta);
    return this.heartbeatService.register(registrationRequest);
  }

  @Delete({
    path: "/groups/{group}/apps/{id}",
    responses: {
      200: {
        description: "Application unregistered",
        contentType: "application/json",
        schema: InstanceResponseSchema,
      },
      404: {
        description: "Application not found",
        contentType: "application/json",
      },
      500: {
        description: "Internal server error",
        contentType: "application/json",
      },
    },
  })
  async unregister(
    @PathParam("group", { schema: GroupIdJsonSchema })
    group: string,
    @PathParam("id", { schema: ApplicationIdJsonSchema })
    id: string
  ): Promise<InstanceResponse> {
    this.logger.addContextData({ group, id });
    const unregistrationRequest = new UnregistrationRequest(id, group);
    return this.heartbeatService.unregister(unregistrationRequest);
  }

  @Get({
    path: "/groups",
    responses: {
      200: {
        description: "Application unregistered",
        contentType: "application/json",
        schema: GroupsSummaryResponseSchema,
      },
      500: {
        description: "Internal server error",
        contentType: "application/json",
      },
    },
  })
  async getAll() {
    return this.heartbeatService.getAllGroups();
  }

  @Get({
    path: "/groups/{group}/apps",
    responses: {
      200: {
        description: "Application unregistered",
        contentType: "application/json",
        schema: InstancesResponseSchema,
      },
      404: {
        description: "Group not found",
        contentType: "application/json",
      },
      500: {
        description: "Internal server error",
        contentType: "application/json",
      },
    },
  })
  async getGroupInstances(
    @PathParam("group", { schema: GroupIdJsonSchema })
    group: string
  ) {
    return this.heartbeatService.getAllInstances(group);
  }
}
