import dockerCompose from "docker-compose";

export default async () => {
  await dockerCompose.upAll({
    log: true,
    commandOptions: ["--build"],
  });
  // waiting one second for the service to be ready
  // without it, it happens that "socket hung up" error is thrown
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
