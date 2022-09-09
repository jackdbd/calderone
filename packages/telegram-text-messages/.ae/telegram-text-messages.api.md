## API Report File for "@jackdbd/telegram-text-messages"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// Warning: (ae-missing-release-tag) "anchor" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const anchor: (link: Link) => string;

// Warning: (ae-missing-release-tag) "errorText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const errorText: (config: ErrorTextConfig) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface ErrorTextConfig {
    // (undocumented)
    app_name: string;
    // (undocumented)
    app_version?: string;
    // (undocumented)
    error_message: string;
    // (undocumented)
    error_title: string;
    // (undocumented)
    links?: Link[];
}

// Warning: (ae-missing-release-tag) "gcpCloudRunJobErrorText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const gcpCloudRunJobErrorText: (config: GcpCloudRunJobErrorTextConfig, options?: GcpCloudRunJobErrorTextOptions) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GcpCloudRunJobErrorTextConfig {
    cloud_run_job_region_id: string;
    // (undocumented)
    error: Error;
    gcp_project_id: string;
    // (undocumented)
    title?: string;
}

// Warning: (ae-missing-release-tag) "Options" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GcpCloudRunJobErrorTextOptions {
    // (undocumented)
    emoji?: string;
    // (undocumented)
    should_include_stack_trace?: boolean;
}

// Warning: (ae-missing-release-tag) "gcpCloudRunJobText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const gcpCloudRunJobText: (config: GcpCloudRunJobTextConfig, options?: GcpCloudRunJobTextOptions) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GcpCloudRunJobTextConfig {
    cloud_run_job_region_id: string;
    // (undocumented)
    description: string;
    gcp_project_id: string;
    // (undocumented)
    sections?: Section[];
    // (undocumented)
    title: string;
}

// Warning: (ae-missing-release-tag) "Options" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GcpCloudRunJobTextOptions {
    // (undocumented)
    should_include_task_section?: boolean;
}

// Warning: (ae-missing-release-tag) "genericText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export const genericText: (config: GenericTextConfig, options?: GenericTextOptions) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GenericTextConfig {
    // (undocumented)
    description: string;
    // (undocumented)
    links?: Link[];
    // (undocumented)
    sections?: Section[];
    // (undocumented)
    subtitle?: string;
    // (undocumented)
    title: string;
}

// Warning: (ae-missing-release-tag) "Options" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface GenericTextOptions {
    // (undocumented)
    is_section_title_bold?: boolean;
    // (undocumented)
    is_subtitle_italic?: boolean;
    // (undocumented)
    is_title_bold?: boolean;
}

// Warning: (ae-missing-release-tag) "Link" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public
export interface Link {
    // (undocumented)
    href: string;
    // (undocumented)
    text: string;
}

// Warning: (ae-missing-release-tag) "operationListText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const operationListText: (config: OperationListTextConfig) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface OperationListTextConfig {
    // (undocumented)
    app_name: string;
    // (undocumented)
    app_version: string;
    // (undocumented)
    description: string;
    // (undocumented)
    links?: Link[];
    // (undocumented)
    operations: OperationTextConfig[];
}

// Warning: (ae-missing-release-tag) "operationText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const operationText: ({ title, successes, failures, warnings }: OperationTextConfig) => string;

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface OperationTextConfig {
    // (undocumented)
    failures: string[];
    // (undocumented)
    successes: string[];
    // (undocumented)
    title: string;
    // (undocumented)
    warnings: string[];
}

// Warning: (ae-missing-release-tag) "Section" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface Section {
    // (undocumented)
    body: string;
    // (undocumented)
    links?: Link[];
    // (undocumented)
    title: string;
}

// Warning: (ae-missing-release-tag) "Config" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export interface WarningConfig {
    // (undocumented)
    app_name: string;
    // (undocumented)
    app_version?: string;
    // (undocumented)
    links?: Link[];
    // (undocumented)
    warning_message: string;
    // (undocumented)
    warning_title: string;
}

// Warning: (ae-missing-release-tag) "warningText" is part of the package's API, but it is missing a release tag (@alpha, @beta, @public, or @internal)
//
// @public (undocumented)
export const warningText: (config: WarningConfig) => string;

// (No @packageDocumentation comment for this package)

```