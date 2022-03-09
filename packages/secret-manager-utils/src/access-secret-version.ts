import makeDebug from "debug";
import type { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const debug = makeDebug("secret-manager-utils/access-secret-version");

export interface Config {
  project_id?: string;
  secret_manager: SecretManagerServiceClient;
  secret_name: string;
  version?: string;
}

export const accessSecretVersion = async ({
  project_id,
  secret_name,
  secret_manager,
  version = "latest",
}: Config) => {
  let prj = project_id;
  if (!prj) {
    prj = await secret_manager.getProjectId();
  }

  debug(`get secret ${secret_name}:${version} in project ${prj}`);
  const [res] = await secret_manager.accessSecretVersion({
    name: `projects/${prj}/secrets/${secret_name}/versions/${version}`,
  });

  if (res.payload && res.payload.data) {
    return res.payload.data.toString();
  } else {
    throw new Error(
      `could not access secret ${secret_name} in GCP project ${prj}`
    );
  }
};
