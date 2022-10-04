# @jackdbd/content-security-policy

[![npm version](https://badge.fury.io/js/@jackdbd%2Fcontent-security-policy.svg)](https://badge.fury.io/js/@jackdbd%2Fcontent-security-policy)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fcontent-security-policy)

Content-Security-Policy in JavaScript, with validation and automatic hashes.

This package validates your Content-Security-Policy directives and calculates a crypographic hash (SHA-256, SHA-384 or SHA-512) for all inline scripts and styles that finds in each HTML file.

> :information_source: **Note:**
> 
> :question: If your site is built with [Eleventy](https://www.11ty.dev/), you can also use [@jackdbd/eleventy-plugin-content-security-policy](https://www.npmjs.com/package/@jackdbd/eleventy-plugin-content-security-policy), which also take care of writing the Content-Security-Policy header in a `_headers` file.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Required parameters](#required-parameters)
- [API](#api)
- [Prior art](#prior-art)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/content-security-policy
```

## Usage

```js
import path from 'node:path'
// pick the format you prefer: object, header (single string), directives (N strings)
import {
  cspJSON,
  cspHeader,
  cspDirectives
} from '@jackdbd/content-security-policy'

// the Content-Security-Policy header is made of directives.
// If you don't know where to start, use one of the following policies:
import {
  starter_policy,
  recommended_policy
} from '@jackdbd/content-security-policy/policies'

const directives = recommended_policy

const patterns = [
  // e.g. for a Eleventy site
  path.join('_site', '**/*.html')
]

const obj = await cspJSON({ directives, patterns })
console.log(`Content-Security-Policy (as Object)`)
console.log(obj)

const header = await cspHeader({ directives, patterns })
console.log(`Content-Security-Policy (as header)`)
console.log(header)

const strings = await cspDirectives({ directives, patterns })
console.log(`Content-Security-Policy (as strings)`)
console.log(strings)
```

## Configuration

### Required parameters

| Parameter | Explanation |
| --- | --- |
| `directives` | [Directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy#directives) for the Content-Security-Policy (or Content-Security-Policy-Report-Only) header. |
| `patterns` | glob patterns for your `.html` files. |

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/content-security-policy/)

## Prior art

- [netlify-plugin-csp-generator](https://github.com/MarcelloTheArcane/netlify-plugin-csp-generator)
- [seespee](https://github.com/papandreou/seespee)
