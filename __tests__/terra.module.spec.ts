// import { randomBytes } from 'crypto';
import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import * as nock from 'nock';
import {
  TerraModule,
  InjectTerraLCDClient,
  LCDClient,
  Coins,
  Coin,
  MnemonicKey,
} from '../src';
import { platforms } from './utils/platforms';
import { extraWait } from './utils/extraWait';
import {
  TERRA_TEST_BASE_URL,
  TERRA_TEST_CHAIN_ID,
  TERRA_ADDRESS,
  TERRA_MNEMONIC,
} from './utils/constants';
import { supplyTotalResponse, authAccounteResponse } from './responses';

describe('Terra Module Initialization', () => {
  beforeEach(() => nock.cleanAll());

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate();
    }

    // nock.recorder.rec();
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
  });

  afterAll(() => {
    nock.restore();
  });

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      describe('forRoot', () => {
        it('should work with terra testnet client', async () => {
          nock(TERRA_TEST_BASE_URL)
            .get('/supply/total')
            .reply(200, supplyTotalResponse);

          @Controller('/')
          class TestController {
            constructor(
              @InjectTerraLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const total: Coins = await this.terraClient.supply.total();
              const uLuna: Coin | undefined = total.get('uluna');

              return { luna: uLuna?.amount?.toString() ?? '0' };
            }
          }

          @Module({
            imports: [
              TerraModule.forRoot({
                URL: TERRA_TEST_BASE_URL,
                chainID: TERRA_TEST_CHAIN_ID,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
            { logger: false },
          );
          const server = app.getHttpServer();

          await app.init();
          await extraWait(PlatformAdapter, app);

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty(
                'luna',
                supplyTotalResponse.result[0].amount,
              );
            });

          await app.close();
        });

        it('should work with a wallet key', async () => {
          nock(TERRA_TEST_BASE_URL)
            .get(`/auth/accounts/${TERRA_ADDRESS}`)
            .reply(200, authAccounteResponse);

          @Controller('/')
          class TestController {
            constructor(
              @InjectTerraLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ accountNumber: string }> {
              const wallet = this.terraClient.wallet(
                new MnemonicKey({ mnemonic: TERRA_MNEMONIC }),
              );
              const accountNumber = await wallet.accountNumber();

              return { accountNumber: accountNumber.toString() };
            }
          }

          @Module({
            imports: [
              TerraModule.forRoot({
                URL: TERRA_TEST_BASE_URL,
                chainID: TERRA_TEST_CHAIN_ID,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
            { logger: false },
          );
          const server = app.getHttpServer();

          await app.init();
          await extraWait(PlatformAdapter, app);

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty(
                'accountNumber',
                authAccounteResponse.result.value.account_number,
              );
            });

          await app.close();
        });
      });

      describe('forRootAsync', () => {
        it('should compile properly with useFactory', async () => {
          nock(TERRA_TEST_BASE_URL)
            .get('/supply/total')
            .reply(200, supplyTotalResponse);

          @Controller('/')
          class TestController {
            constructor(
              @InjectTerraLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const total: Coins = await this.terraClient.supply.total();
              const uLuna: Coin | undefined = total.get('uluna');

              return { luna: uLuna?.amount?.toString() ?? '0' };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = TERRA_TEST_BASE_URL;
            public readonly chainID = TERRA_TEST_CHAIN_ID;
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}

          @Module({
            imports: [
              TerraModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    URL: config.URL,
                    chainID: config.chainID,
                  };
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
            { logger: false },
          );
          const server = app.getHttpServer();

          await app.init();
          await extraWait(PlatformAdapter, app);

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty(
                'luna',
                supplyTotalResponse.result[0].amount,
              );
            });

          await app.close();
        });

        it('should work properly when pass dependencies via providers', async () => {
          nock(TERRA_TEST_BASE_URL)
            .get('/supply/total')
            .reply(200, supplyTotalResponse);

          @Controller('/')
          class TestController {
            constructor(
              @InjectTerraLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const total: Coins = await this.terraClient.supply.total();
              const uLuna: Coin | undefined = total.get('uluna');

              return { luna: uLuna?.amount?.toString() ?? '0' };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = TERRA_TEST_BASE_URL;
            public readonly chainID = TERRA_TEST_CHAIN_ID;
          }

          @Module({
            imports: [
              TerraModule.forRootAsync({
                providers: [ConfigService],
                inject: [ConfigService],
                useFactory: (config: ConfigService) => {
                  return {
                    URL: config.URL,
                    chainID: config.chainID,
                  };
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
            // { logger: false },
          );
          const server = app.getHttpServer();

          await app.init();
          await extraWait(PlatformAdapter, app);

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty(
                'luna',
                supplyTotalResponse.result[0].amount,
              );
            });

          await app.close();
        });

        it('should work properly when useFactory returns Promise', async () => {
          nock(TERRA_TEST_BASE_URL)
            .get('/supply/total')
            .reply(200, supplyTotalResponse);

          @Controller('/')
          class TestController {
            constructor(
              @InjectTerraLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const total: Coins = await this.terraClient.supply.total();
              const uLuna: Coin | undefined = total.get('uluna');

              return { luna: uLuna?.amount?.toString() ?? '0' };
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = TERRA_TEST_BASE_URL;
            public readonly chainID = TERRA_TEST_CHAIN_ID;
          }

          @Module({
            providers: [ConfigService],
            exports: [ConfigService],
          })
          class ConfigModule {}

          @Module({
            imports: [
              TerraModule.forRootAsync({
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: async (config: ConfigService) => {
                  await new Promise((r) => setTimeout(r, 20));

                  return {
                    URL: config.URL,
                    chainID: config.chainID,
                  };
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(
            TestModule,
            new PlatformAdapter(),
            // { logger: false },
          );
          const server = app.getHttpServer();

          await app.init();
          await extraWait(PlatformAdapter, app);

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined();
              expect(res.body).toHaveProperty(
                'luna',
                supplyTotalResponse.result[0].amount,
              );
            });

          await app.close();
        });
      });
    });
  }
});
