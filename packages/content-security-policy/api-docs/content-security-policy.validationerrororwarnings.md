<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/content-security-policy](./content-security-policy.md) &gt; [validationErrorOrWarnings](./content-security-policy.validationerrororwarnings.md)

## validationErrorOrWarnings variable


<b>Signature:</b>

```typescript
validationErrorOrWarnings: ({ allowDeprecatedDirectives, error }: Config) => {
    warnings: string[];
    error?: undefined;
} | {
    error: Error;
    warnings: string[];
}
```