import { Injectable, OnModuleDestroy, Inject } from '@nestjs/common';
import { NacosConfigService } from './nacos.config.service';

@Injectable()
export class NacosConfigLifecycle implements OnModuleDestroy {
  constructor(
    @Inject(NacosConfigService) private nacosConfigService: NacosConfigService,
  ) {}

  async onModuleDestroy() {
    const listeners = this.nacosConfigService.getListeners();
    const configClient = this.nacosConfigService.getConfigClient();
    for (const { dataId, groupName, listener } of listeners) {
      configClient.unSubscribe({ dataId, group: groupName }, listener);
    }
    this.nacosConfigService.clearListeners();
  }
}
