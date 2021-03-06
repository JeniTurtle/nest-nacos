import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { NacosLogger } from '../nacos.logger';
import { NACOS_NAMING_OPTION } from './nacos.naming.constants';
import { NacosNamingConfig } from './nacos.naming.interface';
import { NacosInstance, NacosInstanceOptions } from '../instance';

const NacosNamingClient = require('nacos').NacosNamingClient;

@Injectable()
export class NacosNamingService implements OnModuleInit, OnModuleDestroy {
  private namingClient: any;
  private logger: NacosLogger;
  constructor(@Inject(NACOS_NAMING_OPTION) private options: NacosNamingConfig) {
    this.logger = new NacosLogger(
      options.naming.loggerLevel,
      options.naming.logger,
    );
    this.namingClient = new NacosNamingClient({
      ...options.naming,
      logger: this.logger,
    });
  }

  async onModuleInit() {
    await this.namingClient.ready();
  }

  async onModuleDestroy() {
    await this.namingClient.close();
  }

  registerInstance(
    serviceName: string,
    instance: NacosInstanceOptions,
    groupName?: string,
  ) {
    return this.namingClient.registerInstance(
      serviceName,
      instance,
      groupName,
    ) as Promise<void>;
  }

  deregisterInstance(
    serviceName: string,
    instance: NacosInstanceOptions,
    groupName?: string,
  ) {
    return this.namingClient.deregisterInstance(
      serviceName,
      instance,
      groupName,
    ) as Promise<void>;
  }

  getAllInstances(
    serviceName: string,
    groupName?: string,
    clusters?: string,
    subscribe?: boolean,
  ) {
    return this.namingClient.getAllInstances(
      serviceName,
      groupName,
      clusters,
      subscribe,
    ) as Promise<NacosInstance[]>;
  }

  selectInstances(
    serviceName: string,
    groupName?: string,
    clusters?: string,
    healthy?: boolean,
    subscribe?: boolean,
  ) {
    return this.namingClient.selectInstances(
      serviceName,
      groupName,
      clusters,
      healthy,
      subscribe,
    ) as Promise<NacosInstance[]>;
  }

  getServerStatus() {
    return this.namingClient.getServerStatus() as Promise<'UP' | 'DOWN'>;
  }

  subscribe(
    info:
      | string
      | { serviceName: string; groupName?: string; clusters?: string },
    listener: (instances: NacosInstance[], logger: NacosLogger) => void = () =>
      null,
  ) {
    return this.namingClient.subscribe(info, (instances: NacosInstance[]) =>
      listener(instances, this.logger),
    );
  }

  unSubscribe(
    info:
      | string
      | { serviceName: string; groupName?: string; clusters?: string },
    listener: (instances: NacosInstance[], logger: NacosLogger) => void = () =>
      null,
  ) {
    return this.namingClient.unSubscribe(info, (instances: NacosInstance[]) =>
      listener(instances, this.logger),
    );
  }

  async selectOneHealthyInstance(
    serviceName: string,
    groupName?: string,
    clusters?: string,
  ) {
    const instances = await this.namingClient.selectInstances(
      serviceName,
      groupName,
      clusters,
      true,
    );
    let totalWeight = 0;
    for (const instance of instances) {
      totalWeight += instance.weight;
    }
    let pos = Math.random() * totalWeight;
    for (const instance of instances) {
      if (instance.weight) {
        pos -= instance.weight;
        if (pos <= 0) {
          return instance as NacosInstance;
        }
      }
    }
    throw new Error(`Not found healthy service ${serviceName}!`);
  }

  axiosRequestInterceptor() {
    return async (config: AxiosRequestConfig) => {
      const results = /(?<=:\/\/)[a-zA-Z\.\-_0-9]+(?=\/|$)/.exec(config.url);
      if (results && results.length) {
        let service: NacosInstance;
        const serviceName = results[0];
        const target = this.options.subscribers.find(
          item =>
            serviceName.toLocaleLowerCase() ===
            item.serviceName.toLocaleLowerCase(),
        );
        if (target) {
          service = await this.selectOneHealthyInstance(
            target.serviceName,
            target.groupName,
            target.clusters,
          );
        }
        if (service) {
          config.url = config.url.replace(
            serviceName,
            `${service.ip}:${service.port}`,
          );
        }
      }
      return config;
    };
  }
}
