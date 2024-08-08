import { DynamicModule, Module } from '@nestjs/common';
import { PgModuleAsyncOptions, PgModuleConfig } from './pg-config';
import { PgRootModule } from './pg-root.module';
/**
 * Nestjs Postgres module.
 *
 *
 * Module allows to define multiple postgres datasources on boostrap or dynamically
 * on demand. Because the datasources can be lazy-created dynamically, they are
 * not injectable as services. Instead the `DatasourceRegistry` service is used to
 * create and manage datasources.
 */
@Module({})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class PgModule {
  public static forRootAsync(options: PgModuleAsyncOptions): DynamicModule {
    return {
      module: PgModule,
      imports: [PgRootModule.forRootAsync(options)],
    };
  }

  public static forRoot(config: PgModuleConfig): DynamicModule {
    return {
      module: PgModule,
      imports: [PgRootModule.forRoot(config)],
    };
  }
}
