<p align="center">
  <a href="https://npm-stat.com/charts.html?package=@postalcode/service-viacep">
    <img src="https://img.shields.io/npm/dm/@postalcode/service-viacep.svg" height="20">
  </a>
  <a href='https://coveralls.io/github/postalcode-ws/service-viacep'><img src='https://coveralls.io/repos/github/postalcode-ws/service-viacep/badge.svg' alt='Coverage Status' height="20" />
  </a>
  <a href="https://badge.fury.io/js/%40postalcode%2Fservice-viacep"><img src="https://badge.fury.io/js/%40postalcode%2Fservice-viacep.svg" alt="npm version" height="20"></a>
  <a href="https://snyk.io/test/github/postalcode-ws/service-viacep"><img src="https://snyk.io/test/github/postalcode-ws/service-viacep/badge.svg" data-canonical-src="https://snyk.io/test/github/postalcode-ws/service-viacep" alt="Known Vulnerabilities" height="20"></a>
  <a href="https://github.com/postalcode-ws/service-viacep/actions/workflows/integration.yml"><img src="https://github.com/postalcode-ws/service-viacep/actions/workflows/integration.yml/badge.svg?branch=master" alt="Workflow status badge" loading="lazy" height="20"></a>
  <a href="https://github.com/postalcode-ws/service-viacep/actions/workflows/publish.yml"><img src="https://github.com/postalcode-ws/service-viacep/actions/workflows/publish.yml/badge.svg?branch=master" alt="Workflow status badge" loading="lazy" height="20"></a>
</p>

# service-viacep

Plugin service for postalcode

```js
import ViaCepService from "@postalcode/service-viacep";

const viaCep = new ViaCepService();
viaCep.get("05010000").then(console.log);

// {
//   "postalcode":  "05010000",
//   "state":  "SP",
//   "city":  "São Paulo",
//   "street":  "Rua Caiubí",
//   "neighborhood":  "Perdizes",
// }
```

### Installation

#### Browser using CDN

```html
<script src="https://unpkg.com/@postalcode/service-viacep@latest/dist/index.min.js"></script>

<script>
  const viaCep = new serviceViacep({
    /* Service configs*/
  });

  viaCep.get("05010000").then(console.log);

  // {
  //   "postalcode":  "05010000",
  //   "state":  "SP",
  //   "city":  "São Paulo",
  //   "street":  "Rua Caiubí",
  //   "neighborhood":  "Perdizes",
  // }
</script>
```

#### npm

```
$ npm install --save @postalcode/service-viacep
```

#### yarn

```
$ yarn add @postalcode/service-viacep
```

#### Typescript

```ts
import serviceViacep from "@postalcode/service-viacep";

const viaCep = new serviceViacep();
viaCep.name;
viaCep.type;
viaCep.country;
viaCep.codeLength;

viaCep.get("05010000").then(console.log);

// {
//   "postalcode":  "05010000",
//   "state":  "SP",
//   "city":  "São Paulo",
//   "street":  "Rua Caiubí",
//   "neighborhood":  "Perdizes",
// }
```

#### Plugin for PostalCode

```ts
import PostalCode from "@postalcode/postalcode";
import serviceViacep, { ServiceOptions } from "@postalcode/service-viacep";

const postalCode = new PostalCode({
  /* All Postal Code Options*/
});

postCode.use<ServiceOptions>(serviceViacep, {
  /* All Service Options*/
});

viaCep.get("05010000").then(console.log);

// {
//   "postalcode":  "05010000",
//   "state":  "SP",
//   "city":  "São Paulo",
//   "street":  "Rua Caiubí",
//   "neighborhood":  "Perdizes",
// }
```

## how to contribute

Read our contribution guide [here](CONTRIBUTING.md)

## contributors

[<img src="https://avatars1.githubusercontent.com/u/11856399?v=3&s=115" width="115"><br><sub>@weltongbi</sub>](https://github.com/weltongbi)
