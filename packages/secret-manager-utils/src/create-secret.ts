import makeDebug from "debug";
import type { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const debug = makeDebug("secret-manager-utils/create-secret");

export interface Config {
  labels?: { [key: string]: string };
  project_id?: string;
  secret_data: string;
  secret_id: string;
  secret_manager: SecretManagerServiceClient;
}

export const createSecretAndFirstVersion = async ({
  labels,
  project_id,
  secret_manager,
  secret_data,
  secret_id,
}: Config) => {
  let prj = project_id;
  if (!prj) {
    prj = await secret_manager.getProjectId();
  }

  const [secret] = await secret_manager.createSecret({
    parent: `projects/${prj}`,
    secretId: secret_id,
    secret: {
      labels,
      replication: {
        automatic: {},
      },
    },
  });

  const data = Buffer.from(secret_data, "utf8");
  const parent = secret.name;
  debug("created secret %O", secret);

  const [version] = await secret_manager.addSecretVersion({
    parent,
    payload: {
      data,
    },
  });
  debug("created secret version %O", version);

  return { secret, version };
};
