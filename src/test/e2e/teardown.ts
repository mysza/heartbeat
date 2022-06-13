import dockerCompose from "docker-compose";

export default async () => {
  await dockerCompose.stop();
  await dockerCompose.down();
};
