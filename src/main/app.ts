import { Application } from "@ubio/framework";
import { MemoryApplicationInstanceRepository } from "./repos/appinstance.memory.repo";
import { HeartbeatRouter } from "./http/heartbeat.route";
import { ApplicationInstanceRepository } from "./services/appinstance.repository";
import { HeartbeatService } from "./services/heartbeat.service";

export class App extends Application {
  constructor() {
    super();
    this.container
      .bind(ApplicationInstanceRepository)
      .to(MemoryApplicationInstanceRepository)
      .inSingletonScope();
    this.container.bind(HeartbeatService).toSelf();
    this.bindRouter(HeartbeatRouter);
  }

  async beforeStart() {
    // await this.mongoDb.client.connect();
    // await (this.container.get<MyRepository>(MyRepository)).createIndexes();
    await this.httpServer.startServer();
    // Add other code to execute on application startup
  }

  async afterStop() {
    // this.mongoDb.client.close();
    await this.httpServer.stopServer();
    // Add other finalization code
  }

  // Methods to resolve singletons
  // get mongoDb() {
  //     return this.container.get<MongoDb>(MongoDb);
  // }
}
