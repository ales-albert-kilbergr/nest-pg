import type {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
} from '@nestjs/common';
import type { PgDatasourceConfig } from './datasource-config.interface';

export class PgModuleConfig {
  public datasources: PgDatasourceConfig[] = [];
}

export interface PgModuleAsyncOptions {
  imports?: ModuleMetadata['imports'];
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useFactory: (...args: unknown[]) => PgModuleConfig;
}
