export { addSecretVersion } from "./add-secret-version.js";
export type { Config as AddSecretVersionConfig } from "./add-secret-version.js";

export { accessSecretVersion } from "./access-secret-version.js";
export type { Config as AccessSecretVersionConfig } from "./access-secret-version.js";

export { createSecretAndFirstVersion } from "./create-secret.js";
export type { Config as CreateSecretAndFirstVersionConfig } from "./create-secret.js";

export { destroySecretVersionsMatchingFilter } from "./destroy-secret-versions.js";
export type { Config as DestroySecretVersionsMatchingFilterConfig } from "./destroy-secret-versions.js";

export { disableSecretVersionsMatchingFilter } from "./disable-secret-versions.js";
export type { Config as DisableSecretVersionsMatchingFilterConfig } from "./disable-secret-versions.js";

export { secretManagerStore } from "./store.js";
export type { Store } from "./store.js";
