import path from "path";
import dockerCompose from "docker-compose";

export default async () => {
  await dockerCompose.upAll({
    cwd: path.join(__dirname),
    log: true,
    commandOptions: ["--build", "--force-recreate"],
  });
};
