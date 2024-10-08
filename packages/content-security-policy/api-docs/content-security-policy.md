<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/content-security-policy](./content-security-policy.md)

## content-security-policy package

Entry point for the documentation of content-security-policy.

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[cspDirectives({ directives, patterns })](./content-security-policy.cspdirectives.md)


</td><td>



</td></tr>
<tr><td>

[cspHeader({ directives, patterns })](./content-security-policy.cspheader.md)


</td><td>



</td></tr>
<tr><td>

[cspJSON({ directives, patterns })](./content-security-policy.cspjson.md)


</td><td>



</td></tr>
<tr><td>

[validationErrorOrWarnings({ allowDeprecatedDirectives, error })](./content-security-policy.validationerrororwarnings.md)


</td><td>



</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[Config](./content-security-policy.config.md)


</td><td>



</td></tr>
<tr><td>

[Directives](./content-security-policy.directives.md)


</td><td>



</td></tr>
<tr><td>

[ValidationErrorOrWarningsConfig](./content-security-policy.validationerrororwarningsconfig.md)


</td><td>



</td></tr>
</tbody></table>

## Variables

<table><thead><tr><th>

Variable


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[recommended\_policy](./content-security-policy.recommended_policy.md)


</td><td>

Recommended policy for most sites.

Differences with the standard policy are the following ones: - font-src is set to 'self', to allow self-hosted fonts - frame-ancestors is set to 'none' - manifest-src is set to 'self', to allow a self-hosted web application manifest,so the website can be installed as Progressive Web App. Learn more: https://developer.mozilla.org/en-US/docs/Web/Manifest - object-src is set to 'none' as recommended here: https://csp.withgoogle.com/docs/strict-csp.html - prefetch-src is set to 'self, to allow prefetching content hosted on this origin - upgrade-insecure-requests is set to true, even if I am not sure it's really necessary, since it does NOT replace HSTS. Learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/upgrade-insecure-requests


</td></tr>
<tr><td>

[starter\_policy](./content-security-policy.starter_policy.md)


</td><td>

This is the starter policy described here: https://content-security-policy.com/


</td></tr>
</tbody></table>
