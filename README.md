[![Package Stats](https://nodei.co/npm/basiq-api.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/basiq-api)

# Basiq.io Node.js bindings

[![Travis CI Build Status](https://travis-ci.org/FluentDevelopment/basiq-api.svg?branch=master)](https://travis-ci.org/FluentDevelopment/basiq-api)
[![codecov Code Coverage](https://codecov.io/gh/FluentDevelopment/basiq-api/branch/master/graph/badge.svg)](https://codecov.io/gh/FluentDevelopment/basiq-api)
[![dependencies Status](https://david-dm.org/fluentdevelopment/basiq-api/status.svg)](https://david-dm.org/fluentdevelopment/basiq-api)
[![devDependencies Status](https://david-dm.org/fluentdevelopment/basiq-api/dev-status.svg)](https://david-dm.org/fluentdevelopment/basiq-api?type=dev)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FFluentDevelopment%2Fbasiq-api.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FFluentDevelopment%2Fbasiq-api?ref=badge_shield)

[Basiq.io API][bio-api] bindings for Node.js

[bio-api]: https://basiq.io/api/

## Configuration

The API key can be found on the [API Keys][dashboard] tab in the Basiq.io dashboard.

[dashboard]: https://dashboard.basiq.io/

## Require

```javascript
var BasiqAPI = require('basiq-api').BasiqAPI;

var apiOptions = {
  baseURL: 'https://au-api.basiq.io', // optional
  auth: {
    apiKey: 'abc123'
  }
}

var basiq = new BasiqAPI(apiOptions);
```

## Importing

```javascript
import { BasiqAPI, BasiqAPIOptions, BasiqResponse } from 'basiq-api';

const apiOptions: BasiqAPIOptions = {
  baseURL: 'https://au-api.basiq.io', // optional
  auth: {
    apiKey: 'abc123'
  }
}

const basiq: BasiqAPI = new BasiqAPI(apiOptions);
```

## API Overview

Every resource is accessed via your `basiq` instance:

```javascript
// basiq.{ RESOURCE_NAME }.{ METHOD_NAME }
```

Every resource method returns a promise, which can be chained or used with async/await.

```javascript
basiq.accounts
  .list('123')
  .then((res: BasiqResponse) => {
    return res.body;
  })
  ;

// where supported
async function getAccounts(connectionId) {
  var resp: BasiqResponse = await basiq.accounts.list(connectionId);
  return resp.body;
}
```

### Available resources and methods

* connections
  * `create(options: ConnectionCreateOptions)`
  * `refresh(connectionId: string)`
  * `retrieve(connectionId: string)`
  * `update(connectionId: string, options: ConnectionUpdateOptions)`
  * `delete(connectionId: string)`
* accounts
  * `retrieve(connectionId: string, accountId: string)`
  * `list(connectionId:string)`
* transactions
  * `retrieve(connectionId: string, transactionId: string)`
  * `list(connectionId: string)`
* institutions
  * `retrieve(institutionId: string)`
  * `list()`

### Interfaces

```typescript
export interface AuthenticationOptions {
  apiKey: string;
}

export interface BasiqAPIOptions {
  baseUrl?: string;
  auth: AuthenticationOptions;
}

export interface ConnectionCreateOptions {
  loginId: string;
  password: string;
  securityCode?: string;
  externalUserId?: string;
  institution: {
    id: string;
  };
}

export interface ConnectionUpdateOptions {
  loginId?: string;
  password: string;
  securityCode?: string;
  externalUserId?: string;
}

export interface BasiqResponse {
  status: number;
  statusText: string;
  body: any;
  headers?: any;
}
```

#### 3rd-Party Software License

https://app.fossa.io/reports/ef013f3f-50fe-4268-b2c7-7aa7ca0c26d3