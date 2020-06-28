import { Module, DynamicModule, Global } from '@nestjs/common';
import {
  NacosInstanceConfig,
  NacosInstanceModuleAsyncOptions,
} from './nacos.instance.interface';
import {
  createInstanceOptionsProvider,
  createInstanceAsyncOptionsProvider,
} from './nacos.instance.provider';
import { NacosInstanceService } from './nacos.instance.service';

@Global()
@Module({})
export class NacosInstanceModule {
  static forRoot(options: NacosInstanceConfig): DynamicModule {
    return {
      module: NacosInstanceModule,
      providers: [createInstanceOptionsProvider(options), NacosInstanceService],
      exports: [NacosInstanceService],
    };
  }

  static forRootAsync(options: NacosInstanceModuleAsyncOptions): DynamicModule {
    return {
      module: NacosInstanceModule,
      providers: [
        createInstanceAsyncOptionsProvider(options),
        NacosInstanceService,
      ],
      exports: [NacosInstanceService],
    };
  }
}
