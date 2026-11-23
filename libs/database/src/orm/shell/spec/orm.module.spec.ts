import { Global, Module, type INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Column, DataSource, Entity, PrimaryColumn, type Driver } from 'typeorm';

import { TlsHelper } from '@acme-libs/config';
import { LocalStorageSetupModule } from '@acme-libs/local-storage';
import { ORM_PORT, type IOrmPort } from '@acme-libs/contracts/database';

import { SnakeNamingStrategy } from '../../../naming/snake-naming.strategy';
import { OrmModule } from '../orm.module';

describe('OrmModule', () => {
  let tlsOptions: jest.SpyInstance;
  let connect: jest.SpyInstance;
  let context: INestApplicationContext;

  @Entity()
  class StockItem {
    @PrimaryColumn()
    public id!: number;

    @Column()
    public unitPrice!: number;
  }

  beforeEach(async () => {
    const probe = new DataSource({ type: 'mysql' });
    const driver = Object.getPrototypeOf(probe.driver) as Driver;

    connect = jest.spyOn(driver, 'connect').mockResolvedValue();
    jest.spyOn(driver, 'afterConnect').mockResolvedValue();
    jest.spyOn(driver, 'disconnect').mockResolvedValue();
    tlsOptions = jest.spyOn(TlsHelper, 'options').mockReturnValue({ ca: 'database-ca' });

    @Global()
    @Module({
      exports: [ConfigService],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) =>
              ({
                DATABASE_HOST: 'mysql.internal',
                DATABASE_PORT: 3307,
                DATABASE_USER: 'acme',
                DATABASE_PASSWORD: 'database-password',
                DATABASE_NAME: 'acme',
                DATABASE_LOGGING: false,
                DATABASE_SSL_CA: '/etc/acme/database-ca.pem',
                DATABASE_POOL_SIZE: 20,
                DATABASE_POOL_QUEUE_LIMIT: 100,
              })[key],
          },
        },
      ],
    })
    class ConfigStubModule {}

    @Module({
      imports: [
        LoggerModule.forRoot({ pinoHttp: { level: 'silent' } }),
        LocalStorageSetupModule.forRoot(),
        ConfigStubModule,
        OrmModule.forRoot([StockItem]),
      ],
    })
    class TestModule {}

    context = await NestFactory.createApplicationContext(TestModule, { logger: false });
  });

  afterEach(async () => {
    await context.close();
    Object.assign(PinoLogger, { root: undefined });
  });

  it('connects TypeORM to MySQL with the options of DATABASE_*', () => {
    const { options } = context.get(DataSource);

    expect(connect).toHaveBeenCalledTimes(1);
    expect(tlsOptions).toHaveBeenCalledWith('/etc/acme/database-ca.pem');
    expect(options).toEqual(
      expect.objectContaining({
        type: 'mysql',
        host: 'mysql.internal',
        port: 3307,
        username: 'acme',
        password: 'database-password',
        database: 'acme',
        ssl: { ca: 'database-ca' },
        logging: false,
        synchronize: false,
        timezone: 'Z',
        charset: 'utf8mb4',
        namingStrategy: expect.any(SnakeNamingStrategy) as SnakeNamingStrategy,
        poolSize: 20,
        extra: { queueLimit: 100 },
        entities: [StockItem],
      }),
    );
  });

  it('answers through ORM_PORT a repository of a registered entity with snake_case names', () => {
    const port = context.get<IOrmPort>(ORM_PORT);

    const query = port
      .getRepository(StockItem)
      .createQueryBuilder('item')
      .select('item.unitPrice')
      .getQuery();

    expect(query).toBe('SELECT `item`.`unit_price` AS `item_unit_price` FROM `stock_item` `item`');
  });
});
