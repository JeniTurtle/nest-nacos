import {
  Injectable,
  Inject,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { NACOS_INSTANCE_OPTION } from './nacos.instance.constants';
import { NacosInstanceConfig } from './nacos.instance.interface';
import { NacosNamingService } from '../naming';

@Injectable()
export class NacosInstanceService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  get metadata(): { [key: string]: any } {
    return this.config.instance.metadata;
  }

  constructor(
    @Inject(NACOS_INSTANCE_OPTION)
    private readonly config: NacosInstanceConfig,
    private readonly namingService: NacosNamingService,
  ) {
    this.config.instance.metadata = this.config.instance.metadata || {
      node_version: process.version,
    };
  }

  async onApplicationBootstrap() {
    const { instance, subscribers } = this.config;
    await this.namingService.registerInstance(
      instance.serviceName,
      instance,
      instance.groupName,
    );
    subscribers.forEach(service => {
      this.namingService.subscribe({ ...service }, (hosts, logger) => {
        if (hosts.length > 0) {
          logger.info(`New service detected: ${JSON.stringify(hosts)}`);
        }
      });
    });
  }

  async onApplicationShutdown() {
    const { instance, subscribers } = this.config;
    await this.namingService.deregisterInstance(
      instance.serviceName,
      instance,
      instance.groupName,
    );
    subscribers.forEach(service => {
      this.namingService.unSubscribe({ ...service });
    });
  }
}
