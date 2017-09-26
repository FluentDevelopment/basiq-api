# Basiq.io Node.js bindings
[Basiq.io API][bio-api] bindings for Node.js

[bio-api]: https://basiq.io/api/

## Importing

```javascript
var Basiq = require('@fluentdevelopment/basiq-api');
  // OR
import { Basiq, BasiqAPIOptions, BasiqResponse } from '@fluentdevelopment/basiq-api';
```

## Configuration

The API key can be found on the [API Keys][dashboard] tab in the Basiq.io dashboard.

[dashboard]: https://dashboard.basiq.io/

```javascript
const APIOptions = {
  baseURL: 'https://au-api.basiq.io', // optional
  auth: {
    apiKey: 'abc123'
  }
};

var basiq = Basiq(APIOptions);
  // OR
var basiq = new Basiq(APIOptions);
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
  .then((res) => {
    return res.body;
  })
  ;


// where supported
async function getAccounts(connectionId) {
  var resp = await basiq.accounts.list(connectionId);
  return resp.body;
}

/**
* Response object
*
* BasiqResponse {
*    status: number;
*    statusText: string;
*    body: any;
*    headers?: any;
* }
*/

```

### Available resources and methods

* connections
    * `create(options)`
    * `refresh(connectionId)`
    * `retrieve(connectionId)`
    * `update(connectionId, options)`
    * `delete(connectionId)`
* accounts
    * `retrieve(connectionId, accountId)`
    * `list(connectionId)`
* transactions
    * `retrieve(connectionId, transactionId)`
    * `list(connectionId)`
* institutions
    * `retrieve(institutionId)`
    * `list()`