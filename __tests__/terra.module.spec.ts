// import { randomBytes } from 'crypto';
import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import {
  TerraModule,
  MAINNET_LCD_BASE_URL,
  TESTNET_LCD_BASE_URL,
  InjectLCDClient,
  LCDClient,
  Coin,
  MnemonicKey,
} from '../src'
import { supplyTotalResponse, authAccounteResponse } from './responses'
import { TERRA_ADDRESS, TERRA_MNEMONIC } from './utils/constants'
import { extraWait } from './utils/extraWait'
import { platforms } from './utils/platforms'

describe('Terra Module Initialization', () => {
  beforeEach(() => nock.cleanAll())

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    // nock.recorder.rec();
    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  afterAll(() => {
    nock.restore()
  })

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      describe('forRoot', () => {
        it('should work with terra testnet client', async () => {
          nock(MAINNET_LCD_BASE_URL).get('/bank/total').reply(200, supplyTotalResponse)

          @Controller('/')
          class TestController {
            constructor(
              @InjectLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const [total] = await this.terraClient.bank.total()
              const uLuna: Coin | undefined = total.get('uluna')

              return { luna: uLuna?.amount?.toString() ?? '0' }
            }
          }

          @Module({
            imports: [
              TerraModule.forRoot({
                URL: MAINNET_LCD_BASE_URL,
                chainID: TESTNET_LCD_BASE_URL,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('luna', supplyTotalResponse.supply[0].amount)
            })

          await app.close()
        })

        it('should work with a wallet key', async () => {
          nock(MAINNET_LCD_BASE_URL)
            .get(`/cosmos/auth/v1beta1/accounts/${TERRA_ADDRESS}`)
            .reply(200, authAccounteResponse)

          @Controller('/')
          class TestController {
            constructor(
              @InjectLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ accountNumber: string }> {
              const wallet = this.terraClient.wallet(new MnemonicKey({ mnemonic: TERRA_MNEMONIC }))
              const accountNumber = await wallet.accountNumber()

              return { accountNumber: accountNumber.toString() }
            }
          }

          @Module({
            imports: [
              TerraModule.forRoot({
                URL: MAINNET_LCD_BASE_URL,
                chainID: TESTNET_LCD_BASE_URL,
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('accountNumber', authAccounteResponse.account.account_number)
            })

          await app.close()
        })
      })

      describe('forRootAsync', () => {
        it('should compile properly with useFactory', async () => {
          nock(MAINNET_LCD_BASE_URL).get('/bank/total').reply(200, supplyTotalResponse)

          @Controller('/')
          class TestController {
            constructor(
              @InjectLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const [total] = await this.terraClient.bank.total()
              const uLuna: Coin | undefined = total.get('uluna')

              return { luna: uLuna?.amount?.toString() ?? '0' }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = MAINNET_LCD_BASE_URL
            public readonly chainID = TESTNET_LCD_BASE_URL
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
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('luna', supplyTotalResponse.supply[0].amount)
            })

          await app.close()
        })

        it('should work properly when pass dependencies via providers', async () => {
          nock(MAINNET_LCD_BASE_URL).get('/bank/total').reply(200, supplyTotalResponse)

          @Controller('/')
          class TestController {
            constructor(
              @InjectLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const [total] = await this.terraClient.bank.total()
              const uLuna: Coin | undefined = total.get('uluna')

              return { luna: uLuna?.amount?.toString() ?? '0' }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = MAINNET_LCD_BASE_URL
            public readonly chainID = TESTNET_LCD_BASE_URL
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
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('luna', supplyTotalResponse.supply[0].amount)
            })

          await app.close()
        })

        it('should work properly when useFactory returns Promise', async () => {
          nock(MAINNET_LCD_BASE_URL).get('/bank/total').reply(200, supplyTotalResponse)

          @Controller('/')
          class TestController {
            constructor(
              @InjectLCDClient()
              private readonly terraClient: LCDClient,
            ) {}
            @Get()
            async get(): Promise<{ luna: string }> {
              const [total] = await this.terraClient.bank.total()
              const uLuna: Coin | undefined = total.get('uluna')

              return { luna: uLuna?.amount?.toString() ?? '0' }
            }
          }

          @Injectable()
          class ConfigService {
            public readonly URL = MAINNET_LCD_BASE_URL
            public readonly chainID = TESTNET_LCD_BASE_URL
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
                  await new Promise((r) => setTimeout(r, 20))

                  return {
                    URL: config.URL,
                    chainID: config.chainID,
                  }
                },
              }),
            ],
            controllers: [TestController],
          })
          class TestModule {}

          const app = await NestFactory.create(TestModule, new PlatformAdapter(), { logger: false })
          const server = app.getHttpServer()

          await app.init()
          await extraWait(PlatformAdapter, app)

          await request(server)
            .get('/')
            .expect(200)
            .expect((res) => {
              expect(res.body).toBeDefined()
              expect(res.body).toHaveProperty('luna', supplyTotalResponse.supply[0].amount)
            })

          await app.close()
        })
      })
    })
  }
})
