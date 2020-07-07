import { NacosNamingOptions } from "./naming";
import { NacosInstanceOptions, NacosSubscribeOptions } from "./instance";
import { ClientOptions, ConfigOptions } from "./config";

export interface NestNacosConfig {
  naming: NacosNamingOptions,
  instance: NacosInstanceOptions,
  configClient: ClientOptions,
  configs: ConfigOptions[],
  subscribers: NacosSubscribeOptions[],
}
