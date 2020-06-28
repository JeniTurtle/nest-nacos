import { format } from 'util';
import { Logger, LoggerService } from '@nestjs/common';
const LoggerLevels = {
  DEBUG: 0,
  LOG: 1,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};
export class NacosLogger {
  constructor(
    private readonly loggerLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' = 'INFO',
    private readonly logger: Logger | LoggerService = new Logger('NacosNative'),
  ) {}

  private heartbeatLogCount = 0;

  log(message?: any, ...optionalParams: any[]) {
    if (LoggerLevels.LOG >= LoggerLevels[this.loggerLevel]) {
      this.logger.log(format(message, ...optionalParams));
    }
  }
  info(message?: any, ...optionalParams: any[]) {
    // 屏蔽nacos心跳日志，默认10s一次，太多了，很烦。。。
    if (message.indexOf('[HostReactor] current ips') >= 0) {
      if (this.heartbeatLogCount <= 6) {
        this.heartbeatLogCount += 1;
        return;
      }
      this.heartbeatLogCount = 0;
    }
    if (LoggerLevels.INFO >= LoggerLevels[this.loggerLevel]) {
      this.logger.log(format(message, ...optionalParams));
    }
  }
  warn(message?: any, ...optionalParams: any[]) {
    if (LoggerLevels.WARN >= LoggerLevels[this.loggerLevel]) {
      this.logger.warn(format(message, ...optionalParams));
    }
  }
  debug(message?: any, ...optionalParams: any[]) {
    if (LoggerLevels.DEBUG >= LoggerLevels[this.loggerLevel]) {
      this.logger.debug(format(message, ...optionalParams));
    }
  }
  error(message?: any, ...optionalParams: any[]) {
    if (LoggerLevels.ERROR >= LoggerLevels[this.loggerLevel]) {
      this.logger.error(format(message, ...optionalParams));
    }
  }
}
