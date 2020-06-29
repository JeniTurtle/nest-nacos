import { Module } from '@nestjs/common';
import { ConfigService } from '@jiaxinjiang/nest-config';
import { NacosNamingModule, NacosNamingOptions } from './naming';
import {
  NacosInstanceModule,
  NacosInstanceOptions,
  NacosSubscribeOptions,
} from './instance';
import { NacosConfigModule, ConfigOptions, ClientOptions } from './config';

@Module({
  imports: [
    NacosNamingModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const nacosConfig = configService.get('nacos');
        const subscribers =
          (nacosConfig.subscribers as NacosSubscribeOptions[]) || [];
        const naming = configService.get('nacos').naming as NacosNamingOptions;
        naming.appName = naming.appName || configService.get('appName');
        return {
          naming,
          subscribers,
        };
      },
      inject: [ConfigService],
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
      useFactory: (configService: ConfigService) => {
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
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [],
})
export class NacosModule {}
