import {
  Datasource,
  DatasourceRegistry,
  type DatasourceLogger,
} from '@kilbergr/pg-datasource';
import { Pool } from 'pg';
import { MigrationLogger, MigrationRunner } from '@kilbergr/pg-migration';
import { Injectable } from '@nestjs/common';
import {
  PgDatasourceConfig,
  PgDatasourceMigrationConfig,
} from './datasource-config.interface';

@Injectable()
export class DatasourceFactory {
  private readonly logger: DatasourceLogger;

  public constructor(logger: DatasourceLogger) {
    this.logger = logger;
  }

  public async createRegistry(
    configs: PgDatasourceConfig[],
  ): Promise<DatasourceRegistry> {
    const registry = new DatasourceRegistry();
    for (const config of configs) {
      const datasource = await this.createDatasource(config);
      registry.register(datasource);
    }

    return registry;
  }

  public async createDatasource(
    config: PgDatasourceConfig,
  ): Promise<Datasource> {
    const datasource = new Datasource(
      config.name,
      new Pool(config.pool),
      this.logger,
    );

    if (config.migration) {
      const migrationRunner = this.createMigrationRunner(
        datasource,
        config.migration,
      );

      await migrationRunner.run(
        config.migration.targetSequenceNumber ?? Infinity,
      );
    }

    return datasource;
  }

  private createMigrationRunner(
    datasource: Datasource,
    config: PgDatasourceMigrationConfig,
  ): MigrationRunner {
    const migrationConfig = { table: config.table, schema: config.schema };

    return new MigrationRunner(
      datasource,
      migrationConfig,
      config.loader,
      new MigrationLogger(this.logger.getDriver()),
    );
  }
}
