import { DatasourceRegistry, DatasourceLogger } from '@kilbergr/pg-datasource';
import { PgModuleAsyncOptions, PgModuleConfig } from './pg-config';
import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnApplicationShutdown,
  Provider,
} from '@nestjs/common';
import { DatasourceFactory } from './datasource-factory.service';

const COMMON_PROVIDERS: Provider[] = [
  {
    provide: DatasourceLogger,
    useFactory: (): DatasourceLogger =>
      new DatasourceLogger(new Logger('Postgres')),
  },
  {
    provide: DatasourceFactory,
    useFactory: (logger: DatasourceLogger): DatasourceFactory =>
      new DatasourceFactory(logger),
    inject: [DatasourceLogger],
  },
  {
    provide: DatasourceRegistry,
    useFactory: async (
      config: PgModuleConfig,
      factory: DatasourceFactory,
    ): Promise<DatasourceRegistry> =>
      factory.createRegistry(config.datasources),
    inject: [PgModuleConfig, DatasourceFactory],
  },
];

@Global()
@Module({})
export class PgRootModule implements OnApplicationShutdown {
  private readonly registry: DatasourceRegistry;

  public constructor(registry: DatasourceRegistry) {
    this.registry = registry;
  }

  public static forRootAsync(options: PgModuleAsyncOptions): DynamicModule {
    return {
      module: PgRootModule,
      imports: [...(options.imports ?? [])],
      providers: [
        ...COMMON_PROVIDERS,
        {
          provide: PgModuleConfig,
          useFactory: options.useFactory,
          inject: options.inject ?? [],
        },
      ],
      exports: [DatasourceRegistry, DatasourceFactory],
    };
  }

  public static forRoot(config: PgModuleConfig): DynamicModule {
    return {
      module: PgRootModule,
      providers: [
        ...COMMON_PROVIDERS,
        {
          provide: PgModuleConfig,
          useValue: config,
        },
      ],
      exports: [DatasourceRegistry, DatasourceFactory],
    };
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.registry.destroyAll();
  }
}
