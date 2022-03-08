import makeDebug from "debug";
import type { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const debug = makeDebug("secret-manager-utils/add-secret-version");

export interface Config {
  payload: string;
  project_id?: string;
  secret_manager: SecretManagerServiceClient;
  secret_name: string;
}

/**
 * Add a new version of an existing secret.
 */
export const addSecretVersion = async ({
  payload,
  project_id,
  secret_manager,
  secret_name,
}: Config) => {
  let prj = project_id;
  if (!prj) {
    prj = await secret_manager.getProjectId();
  }

  const [v] = await secret_manager.addSecretVersion({
    parent: `projects/${prj}/secrets/${secret_name}`,
    payload: {
      data: Buffer.from(payload, "utf8"),
    },
  });

  debug(`added version ${v.name} (etag ${v.etag}) in project ${prj}`);
  return v;
};
