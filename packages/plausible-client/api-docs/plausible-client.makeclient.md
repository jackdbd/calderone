<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@jackdbd/plausible-client](./plausible-client.md) &gt; [makeClient](./plausible-client.makeclient.md)

## makeClient() function

**Signature:**

```typescript
makeClient: (credentials: Credentials, options?: Options) => {
    stats: {
        aggregate: (options?: import("./stats/interfaces.js").AggregateOptions | undefined) => Promise<{
            bounce_rate: {
                value: number;
            };
            pageviews: {
                value: number;
            };
            visit_duration: {
                value: number;
            };
            visitors: {
                value: number;
            };
        }>;
        breakdown: (options?: import("./stats/interfaces.js").BreakdownOptions | undefined) => Promise<import("./stats/interfaces.js").BreakdownResult[]>;
        timeseries: (options?: import("./stats/interfaces.js").TimeseriesOptions | undefined) => Promise<import("./stats/interfaces.js").TimeseriesResult[]>;
    };
}
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

credentials


</td><td>

[Credentials](./plausible-client.credentials.md)


</td><td>


</td></tr>
<tr><td>

options


</td><td>

Options


</td><td>

_(Optional)_


</td></tr>
</tbody></table>
**Returns:**

{ stats: { aggregate: (options?: import("./stats/interfaces.js").[AggregateOptions](./plausible-client.aggregateoptions.md) \| undefined) =&gt; Promise&lt;{ bounce\_rate: { value: number; }; pageviews: { value: number; }; visit\_duration: { value: number; }; visitors: { value: number; }; }&gt;; breakdown: (options?: import("./stats/interfaces.js").[BreakdownOptions](./plausible-client.breakdownoptions.md) \| undefined) =&gt; Promise&lt;import("./stats/interfaces.js").[BreakdownResult](./plausible-client.breakdownresult.md)<!-- -->\[\]&gt;; timeseries: (options?: import("./stats/interfaces.js").[TimeseriesOptions](./plausible-client.timeseriesoptions.md) \| undefined) =&gt; Promise&lt;import("./stats/interfaces.js").[TimeseriesResult](./plausible-client.timeseriesresult.md)<!-- -->\[\]&gt;; }; }

