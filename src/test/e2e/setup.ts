import dockerCompose from "docker-compose";

export default async () => {
  await dockerCompose.upAll({
    log: true,
    commandOptions: ["--build", "--force-recreate"],
  });
};
