import { Module, DynamicModule, Global } from '@nestjs/common';
import {
  NacosNamingConfig,
  NacosNamingModuleAsyncOptions,
} from './nacos.naming.interface';
import {
  createOptionsProvider,
  createAsyncOptionsProvider,
} from './nacos.naming.provider';
import { NacosNamingService } from './nacos.naming.service';

@Global()
@Module({})
export class NacosNamingModule {
  static forRoot(options: NacosNamingConfig): DynamicModule {
    const optionsProvider = createOptionsProvider(options);
    return {
      module: NacosNamingModule,
      imports: [],
      providers: [optionsProvider, NacosNamingService],
      exports: [NacosNamingService],
    };
  }

  static forRootAsync(options: NacosNamingModuleAsyncOptions): DynamicModule {
    const optionsProvider = createAsyncOptionsProvider(options);
    return {
      module: NacosNamingModule,
      imports: [],
      providers: [optionsProvider, NacosNamingService],
      exports: [NacosNamingService],
    };
  }
}
