<h1 align="center">Nestjs Nacos</h1>

<p align="center">Nacos component for NestJs.</p>

## Features

- Automatic registration and subscription services.
- Listen for configuration changes, and use `@jiaxinjiang/nest-remote-config` module to obtain remote configuration data.

### Installation

**Yarn**
```bash
yarn add @jiaxinjiang/nest-nacos
```

**NPM**
```bash
npm install @jiaxinjiang/nest-nacos --save
```

### Getting Started

First, you need to define the log configuration file. You must rely on the `@jiaxinjiang/nest-config` module.

Directory structure:

```bash
├── env
│   ├── env
│   ├── env.dev
│   ├── env.prod
│   ├── env.test
├── src
│   ├── app.module.ts
│   ├── config
│       ├── nacos.config.ts
```

Nacos configuration file:

```bash
// .env.dev

NEST_NACOS_SERVER_LIST=192.168.0.102:8848

NEST_NACOS_NAMESPACE=d8bcbaad-f3d1-40d8-9d55-a03cafea5299

NEST_NACOS_GROUP_NAME=DEV_GROUP

NEST_NACOS_CONFIG_ID_BASIC=basic.config.yml
```

```ts
// nacos.config.ts

import {
  ClientOptions,
  ConfigOptionsList,
  NacosInstanceOptions,
  NacosNamingOptions,
  NacosSubscribeOptions,
} from '@jiaxinjiang/nacos';

const {
  NEST_NACOS_NAMESPACE,
  NEST_NACOS_GROUP_NAME,
  NEST_NACOS_SERVER_LIST,
  NEST_NACOS_CONFIG_ID_BASIC,
} = process.env;

export default {
  naming: {
    serverList: NEST_NACOS_SERVER_LIST,
    namespace: NEST_NACOS_NAMESPACE,
  } as NacosNamingOptions,
  instance: {
    groupName: NEST_NACOS_GROUP_NAME,
  } as NacosInstanceOptions,
  client: {
    leaderPort: Number(`45${Math.floor(Math.random() * 900) + 100}`),
    serverAddr: NEST_NACOS_SERVER_LIST.split(',')[0],
  } as ClientOptions,
  configs: {
    basic: {
      dataId: NEST_NACOS_CONFIG_ID_BASIC,
      groupName: NEST_NACOS_GROUP_NAME,
    },
  } as ConfigOptionsList,
  subscribers: [
    // Services to be monitored
    {
      serviceName: 'service-1',
    },
    {
      serviceName: 'service-2',
    },
  ] as NacosSubscribeOptions[],
};
```

### API

#### NacosNamingService:

* <code>nacosNamingService.<b>registerInstance(serviceName: string, instance: NacosInstanceOptions, groupName?: string)</b></code>
* <code>nacosNamingService.<b>deregisterInstance(serviceName: string, instance: NacosInstanceOptions, groupName?: string)</b></code>
* <code>nacosNamingService.<b>getAllInstances(serviceName: string, groupName?: string,
 clusters?: string, subscribe?: boolean)</b></code>
* <code>nacosNamingService.<b>selectInstances(serviceName: string, groupName?: string, clusters?: string, healthy?: boolean, subscribe?: boolean)</b></code>
* <code>nacosNamingService.<b>getServerStatus()</b></code>
* <code>nacosNamingService.<b>subscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[], logger: NacosLogger) => void = () => null)</b></code>
* <code>nacosNamingService.<b>unSubscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[], logger: NacosLogger) => void = () => null)</b></code>
* <code>nacosNamingService.<b>selectOneHealthyInstance(serviceName: string, groupName?: string, clusters?: string)</b></code>
* <code>nacosNamingService.<b>axiosRequestInterceptor()</b></code>

#### NacosConfigService:

* <code>nacosConfigService.<b>getListeners()</b></code>
* <code>nacosConfigService.<b>getConfigClient()</b></code>
* <code>nacosConfigService.<b>getConfigStore()</b></code>
* <code>nacosConfigService.<b>getConfigKey(dataId: string, groupName = 'DEFAULT_GROUP')</b></code>

#### ConfigStore:
* <code>configStore.<b>get<T>(configKey: string, defaultConfigData?: T | any)</b></code>
* <code>configStore.<b>set(configKey: string, configData?: any)</b></code>
* <code>configStore.<b>on('change', (configKey: string, configData: any) => {})</b></code>
