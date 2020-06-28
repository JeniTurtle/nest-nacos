import { EventEmitter } from 'events';
import { Logger, Provider } from '@nestjs/common';
import { NACOS_CONFIG_OPTION } from './nacos.config.constants';
import { NacosConfigClient } from './nacos.config.client';
import { ConfigClientOptions } from './nacos.config.interface';

export class ConfigStore extends EventEmitter {
  private static _config: Map<string, any> = new Map();

  get config() {
    return ConfigStore._config;
  }
  set(key: string, value: any) {
    this.config.set(key, value);
  }
  get<T>(key: string, defaultValue?: T | any) {
    return this.config.get(key) || defaultValue;
  }
}

export class NacosConfigService {
  private configClient: NacosConfigClient = null;
  private configStore: ConfigStore = new ConfigStore();
  private readonly logger;
  private readonly listeners = new Array<{
    dataId: string;
    groupName: string;
    listener: Function;
  }>();
  constructor(private readonly options: ConfigClientOptions) {
    this.logger = options.logger || new Logger();
    this.logger.setContext('NacosConfigService');
  }

  getListeners() {
    return this.listeners;
  }

  getConfigStore() {
    return this.configStore;
  }

  getConfigClient() {
    return this.configClient;
  }

  clearListeners() {
    this.listeners.length = 0;
  }

  getConfigKey(dataId: string, groupName = 'DEFAULT_GROUP') {
    return `${groupName}_${dataId}`;
  }

  async init() {
    this.logger.log('Nacos Config Initializing...');
    this.configClient = new NacosConfigClient(this.options.client);
    await this.configClient.ready();

    for (const configOptions of Object.values(this.options.configs)) {
      const { dataId, groupName, options = {} } = configOptions;
      const configKey = this.getConfigKey(dataId, groupName);
      const remoteConfig = await this.configClient.getConfig(
        dataId,
        groupName,
        { ...options },
      );
      this.configStore.set(configKey, remoteConfig);
      this.logger.log(
        `Subscribed Nacos Config! group: ${groupName} configId: ${dataId}`,
      );
      this.listeners.push({
        dataId,
        groupName,
        listener: (content: string) => {
          this.logger.log(
            `Nacos Config update! group: ${groupName} configId: ${dataId}`,
          );
          this.configStore.set(configKey, content);
          this.configStore.emit('change', configKey, content);
        },
      });
    }
    this.listeners.forEach(({ dataId, groupName, listener }) =>
      this.configClient.subscribe({ dataId, group: groupName }, listener),
    );
  }

  async unSubscribe() {
    for (const { dataId, groupName, listener } of this.listeners) {
      this.configClient.unSubscribe({ dataId, groupName }, listener);
    }
    this.listeners.length = 0;
  }
}

export function createNacosConfigService(): Provider {
  return {
    provide: NacosConfigService,
    useFactory: async (options: ConfigClientOptions) => {
      const nacosConfigService = new NacosConfigService(options);
      await nacosConfigService.init();
      return nacosConfigService;
    },
    inject: [NACOS_CONFIG_OPTION],
  };
}
