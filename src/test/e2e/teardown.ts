import path from "path";
import dockerCompose from "docker-compose";

export default async () => {
  await dockerCompose.down({
    cwd: path.join(__dirname),
  });
};
