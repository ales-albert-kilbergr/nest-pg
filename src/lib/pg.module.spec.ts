/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Test } from '@nestjs/testing';
import { PgModule } from './pg.module';
import { DatasourceFactory } from './datasource-factory.service';
import { DatasourceRegistry } from '@kilbergr/pg-datasource';

describe('(Unit) PgModule', () => {
  it('should export DatasourceFactory', async () => {
    // Arrange
    const testModule = await Test.createTestingModule({
      imports: [PgModule.forRoot({ datasources: [] })],
    }).compile();

    // Act
    const datasourceFactory = testModule.get(DatasourceFactory);
    // Assert
    expect(datasourceFactory).toBeInstanceOf(DatasourceFactory);
  });

  it('should export DatasourceRegistry', async () => {
    // Arrange
    const testModule = await Test.createTestingModule({
      imports: [PgModule.forRoot({ datasources: [] })],
    }).compile();

    // Act
    const datasourceRegistry = testModule.get(DatasourceRegistry);
    // Assert
    expect(datasourceRegistry).toBeInstanceOf(DatasourceRegistry);
  });

  it('should initialize DatasourceRegistry empty if no datasource config is provided', async () => {
    // Arrange
    const testModule = await Test.createTestingModule({
      imports: [PgModule.forRoot({ datasources: [] })],
    }).compile();

    // Act
    const datasourceRegistry = testModule.get(DatasourceRegistry);
    // Assert
    expect(datasourceRegistry.count()).toEqual(0);
  });

  it('should initialize DatasourceRegistry with one datasource config', async () => {
    // Arrange
    const testModule = await Test.createTestingModule({
      imports: [
        PgModule.forRoot({
          datasources: [
            {
              name: 'test',
              pool: {
                host: 'localhost',
                port: 5432,
                user: 'test',
                password: 'test',
                database: 'test',
              },
            },
          ],
        }),
      ],
    }).compile();

    // Act
    const datasourceRegistry = testModule.get(DatasourceRegistry);
    // Assert
    expect(datasourceRegistry.count()).toEqual(1);
  });

  it('should initialize DatasourceRegistry with two datasource configs', async () => {
    // Arrange
    const testModule = await Test.createTestingModule({
      imports: [
        PgModule.forRoot({
          datasources: [
            {
              name: 'test',
              pool: {
                host: 'localhost',
                port: 5432,
                user: 'test',
                password: 'test',
                database: 'test',
              },
            },
            {
              name: 'test2',
              pool: {
                host: 'localhost',
                port: 5432,
                user: 'test',
                password: 'test',
                database: 'test',
              },
            },
          ],
        }),
      ],
    }).compile();

    // Act
    const datasourceRegistry = testModule.get(DatasourceRegistry);
    // Assert
    expect(datasourceRegistry.count()).toEqual(2);
  });
});
