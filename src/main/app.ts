import { Application } from "@ubio/framework";
import { HeartbeatRouter } from "./http/heartbeat.route";
import { ApplicationInstanceRepository } from "./services/appinstance.repository";
import { HeartbeatService } from "./services/heartbeat.service";
import { MongoDb } from "@ubio/framework/out/modules/mongodb";
import { MongoApplicationInstanceRepository } from "./repos/appinstance.mongo.repo";

export class App extends Application {
  constructor() {
    super();
    this.container.bind(MongoDb).toSelf().inSingletonScope();
    this.container
      .bind(ApplicationInstanceRepository)
      .to(MongoApplicationInstanceRepository)
      .inSingletonScope();
    this.container.bind(HeartbeatService).toSelf();
    this.bindRouter(HeartbeatRouter);
  }

  async beforeStart() {
    await this.mongoDb.client.connect();
    await this.httpServer.startServer();
  }

  async afterStop() {
    await this.httpServer.stopServer();
    this.mongoDb.client.close();
  }

  // Methods to resolve singletons
  get mongoDb() {
    return this.container.get<MongoDb>(MongoDb);
  }
}
