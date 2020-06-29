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

You can use the `@jiaxinjiang/nest-config` package to configure Nacos.

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

NEST_NACOS_GROUP_NAME=dev

NEST_NACOS_CONFIG_ID_BASIC=basic.config.yml
```

```ts
// nacos.config.ts

import {
  ClientOptions,
  ConfigOptions,
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
  configs: [{
      dataId: NEST_NACOS_CONFIG_ID_BASIC,
      groupName: NEST_NACOS_GROUP_NAME,
  }] as ConfigOptions[],
  subscribers: [
    // Services to be monitored
    {
      serviceName: 'service-1',
      groupName: 'nodejs',
    },
    {
      serviceName: 'service-2',
      groupName: 'nodejs',
    },
  ] as NacosSubscribeOptions[],
};
```

Module introduction example:

```ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider } from '@jiaxinjiang/nest-logger';
import {
  NacosNamingModule,
  NacosNamingOptions,
  NacosInstanceModule,
  NacosInstanceOptions,
  NacosSubscribeOptions,
  NacosConfigModule,
  ConfigOptions,
  ClientOptions,
} from '@jiaxinjiang/nest-nacos';

@Module({
  imports: [
    NacosNamingModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerProvider) => {
        const nacosConfig = configService.get('nacos');
        const subscribers =
          (nacosConfig.subscribers as NacosSubscribeOptions[]) || [];
        const naming = configService.get('nacos').naming as NacosNamingOptions;
        naming.logger = logger;
        naming.appName = naming.appName || configService.get('appName');
        return {
          naming,
          subscribers,
        };
      },
      inject: [ConfigService, LoggerProvider],
    }),
    NacosInstanceModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nacosConfig = configService.get('nacos');
        const instance = nacosConfig.instance as NacosInstanceOptions;
        const subscribers =
          (nacosConfig.subscribers as NacosSubscribeOptions[]) || [];
        instance.serviceName =
          instance.serviceName || configService.get('appName');
        instance.ip = instance.ip || configService.get('ip');
        instance.port = instance.port || configService.get('port');
        return {
          instance,
          subscribers,
        };
      },
      inject: [ConfigService],
    }),
    NacosConfigModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerProvider) => {
        const {
          naming,
          configs,
          client,
        }: {
          naming: NacosNamingOptions;
          configs: ConfigOptions[];
          client: ClientOptions;
        } = configService.get('nacos');
        client.appName = client.appName || configService.get('appName');
        client.serverAddr = client.serverAddr || naming.serverList[0];
        client.namespace = client.namespace || naming.namespace;
        return {
          client,
          configs,
          logger,
        };
      },
      inject: [ConfigService, LoggerProvider],
    }),
  ],
  providers: [],
  exports: [],
})
export class NacosModule {}
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
