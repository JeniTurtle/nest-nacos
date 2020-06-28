import { Module } from '@nestjs/common';
import { ConfigService } from '@jiaxinjiang/nest-config';
import { LoggerProvider } from '@jiaxinjiang/nest-logger';
import { NacosNamingModule, NacosNamingOptions } from './naming';
import {
  NacosInstanceModule,
  NacosInstanceOptions,
  NacosSubscribeOptions,
} from './instance';
import { NacosConfigModule, ConfigOptionsList, ClientOptions } from './config';

@Module({
  imports: [
    NacosNamingModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerProvider) => {
        const nacosConfig = configService.get('nacos');
        const subscribers =
          (nacosConfig.subscribers as NacosSubscribeOptions[]) || [];
        const naming = configService.get('nacos').naming as NacosNamingOptions;
        logger.setContext('NacosNative');
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
          configs: ConfigOptionsList;
          client: ClientOptions;
        } = configService.get('nacos');
        client.appName = client.appName || configService.get('appName');
        client.serverAddr = client.serverAddr || naming.serverList[0];
        client.namespace = client.namespace || naming.namespace;
        return {
          client,
          configs,
          logger: logger.setContext('NacosConfig'),
        };
      },
      inject: [ConfigService, LoggerProvider],
    }),
  ],
  providers: [],
  exports: [],
})
export class NacosModule {}
