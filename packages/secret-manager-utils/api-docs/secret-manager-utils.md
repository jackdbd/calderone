<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/secret-manager-utils](./secret-manager-utils.md)

## secret-manager-utils package

## Functions

<table><thead><tr><th>

Function


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[accessSecretVersion({ project\_id, secret\_name, secret\_manager, version })](./secret-manager-utils.accesssecretversion.md)


</td><td>


</td></tr>
<tr><td>

[addSecretVersion({ payload, project\_id, secret\_manager, secret\_name })](./secret-manager-utils.addsecretversion.md)


</td><td>

Add a new version of an existing secret.


</td></tr>
<tr><td>

[createSecretAndFirstVersion({ labels, project\_id, secret\_manager, secret\_data, secret\_id })](./secret-manager-utils.createsecretandfirstversion.md)


</td><td>


</td></tr>
<tr><td>

[destroySecretVersionsMatchingFilter({ filter, project\_id, secret\_manager, secret\_name })](./secret-manager-utils.destroysecretversionsmatchingfilter.md)


</td><td>

Destroy all versions of a secret that match the given string `filter`<!-- -->.

See here: https://cloud.google.com/secret-manager/docs/filtering


</td></tr>
<tr><td>

[disableSecretVersionsMatchingFilter({ filter, project\_id, secret\_manager, secret\_name })](./secret-manager-utils.disablesecretversionsmatchingfilter.md)


</td><td>

Disable all versions of a secret that match the given string `filter`<!-- -->.

See here: https://cloud.google.com/secret-manager/docs/filtering


</td></tr>
<tr><td>

[secretManager(options)](./secret-manager-utils.secretmanager.md)


</td><td>

Initializes the Secret Manager client from the environment.


</td></tr>
<tr><td>

[secretManagerStore({ secret\_manager, secret\_name, should\_disable\_older\_enabled\_versions })](./secret-manager-utils.secretmanagerstore.md)


</td><td>

Store that retrieves data from, and persists data to, Secret Manager.


</td></tr>
</tbody></table>

## Interfaces

<table><thead><tr><th>

Interface


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[AccessSecretVersionConfig](./secret-manager-utils.accesssecretversionconfig.md)


</td><td>


</td></tr>
<tr><td>

[AddSecretVersionConfig](./secret-manager-utils.addsecretversionconfig.md)


</td><td>


</td></tr>
<tr><td>

[ClientOptions](./secret-manager-utils.clientoptions.md)


</td><td>


</td></tr>
<tr><td>

[CreateSecretAndFirstVersionConfig](./secret-manager-utils.createsecretandfirstversionconfig.md)


</td><td>


</td></tr>
<tr><td>

[DestroySecretVersionsMatchingFilterConfig](./secret-manager-utils.destroysecretversionsmatchingfilterconfig.md)


</td><td>


</td></tr>
<tr><td>

[DisableSecretVersionsMatchingFilterConfig](./secret-manager-utils.disablesecretversionsmatchingfilterconfig.md)


</td><td>


</td></tr>
<tr><td>

[Store](./secret-manager-utils.store.md)


</td><td>


</td></tr>
</tbody></table>
