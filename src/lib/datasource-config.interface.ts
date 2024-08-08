import type { MigrationLoader } from '@kilbergr/pg-migration';
import type { PoolConfig } from 'pg';

export interface PgDatasourceMigrationConfig {
  table: string;
  schema: string;
  loader: MigrationLoader;
  targetSequenceNumber?: number;
}

export interface PgDatasourceConfig {
  name: string;
  pool: PoolConfig;
  migration?: PgDatasourceMigrationConfig;
}
