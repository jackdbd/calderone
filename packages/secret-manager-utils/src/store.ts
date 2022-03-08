import makeDebug from "debug";
import type { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { accessSecretVersion } from "./access-secret-version.js";
import { addSecretVersion } from "./add-secret-version.js";
import { disableSecretVersionsMatchingFilter } from "./disable-secret-versions.js";

export interface Store<T> {
  persist: (data: T) => Promise<void>;
  retrieve: () => Promise<T>;
}

const debug = makeDebug("secret-manager-utils/store");

export interface Config {
  secret_manager: SecretManagerServiceClient;
  secret_name: string;
  should_disable_older_enabled_versions?: boolean;
}

/**
 * Store that retrieves data from, and persists data to, Secret Manager.
 */
export const secretManagerStore = <T>({
  secret_manager,
  secret_name,
  should_disable_older_enabled_versions,
}: Config): Store<T> => {
  //
  const retrieve = async () => {
    debug(`trying to retrieve, from Secret Manager, secret ${secret_name}`);
    const secret = await accessSecretVersion({
      secret_manager,
      secret_name,
      version: "latest",
    });
    debug(`retrieved secret ${secret_name} from Secret Manager`);
    try {
      const obj = JSON.parse(secret);
      return obj as T;
    } catch (err: any) {
      return secret as unknown as T;
    }
  };

  const persist = async (data: T) => {
    debug(`trying to persist data to Secret Manager, in secret ${secret_name}`);
    const new_version = await addSecretVersion({
      secret_manager,
      secret_name,
      payload: JSON.stringify(data, null, 2),
    });
    debug(`data persisted to Secret Manager, in secret ${secret_name}`);

    if (should_disable_older_enabled_versions) {
      debug(
        `trying to disable all older, enabled versions of secret ${secret_name}`
      );
      const { message } = await disableSecretVersionsMatchingFilter({
        secret_manager,
        secret_name,
        filter: `state:ENABLED AND NOT name:${new_version.name}`,
      });
      debug(message);
    }
  };

  return {
    persist,
    retrieve,
  };
};
