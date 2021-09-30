import { Module, Controller, Get, Injectable } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as nock from 'nock'
import * as request from 'supertest'
import { TerraModule, TESTNET_LCD_BASE_URL, TESTNET_CHAIN_ID, InjectLCDClient, LCDClient, Coin } from '../src'
import { treasuryTaxCapUlunaResponse, treasuryTaxRateResponse } from './responses'
import { extraWait } from './utils/extraWait'
import { platforms } from './utils/platforms'

describe('InjectLCDClient', () => {
  beforeEach(() => nock.cleanAll())

  beforeAll(() => {
    if (!nock.isActive()) {
      nock.activate()
    }

    nock.disableNetConnect()
    nock.enableNetConnect('127.0.0.1')
  })

  afterAll(() => {
    nock.restore()
  })

  for (const PlatformAdapter of platforms) {
    describe(PlatformAdapter.name, () => {
      it('should inject terra LCD client in a service successfully', async () => {
        nock(TESTNET_LCD_BASE_URL)
          .get('/terra/treasury/v1beta1/tax_rate')
          .twice()
          .reply(200, treasuryTaxRateResponse)
          .get('/terra/treasury/v1beta1/tax_caps/uluna')
          .twice()
          .reply(200, treasuryTaxCapUlunaResponse)

        @Injectable()
        class TestService {
          constructor(
            @InjectLCDClient()
            private readonly terraClient: LCDClient,
          ) {}
          async someMethod(): Promise<{ tax: string }> {
            const coin = new Coin('uluna', 200)
            const tax = await this.terraClient.utils.calculateTax(coin)
            console.log('tax ========>', tax)

            return { tax: tax?.amount?.toString() ?? '0' }
          }
        }

        @Controller('/')
        class TestController {
          constructor(private readonly service: TestService) {}
          @Get()
          async get() {
            return this.service.someMethod()
          }
        }

        @Module({
          imports: [
            TerraModule.forRoot({
              URL: TESTNET_LCD_BASE_URL,
              chainID: TESTNET_CHAIN_ID,
            }),
          ],
          controllers: [TestController],
          providers: [TestService],
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
            expect(res.body).toHaveProperty('tax', '40')
          })

        await app.close()
      })

      it('should inject terra LCD client in a controller successfully', async () => {
        nock(TESTNET_LCD_BASE_URL)
          .get('/terra/treasury/v1beta1/tax_rate')
          .twice()
          .reply(200, treasuryTaxRateResponse)
          .get('/terra/treasury/v1beta1/tax_caps/uluna')
          .twice()
          .reply(200, treasuryTaxCapUlunaResponse)

        @Controller('/')
        class TestController {
          constructor(
            @InjectLCDClient()
            private readonly terraClient: LCDClient,
          ) {}
          @Get()
          async get() {
            const coin = new Coin('uluna', 200)
            const tax = await this.terraClient.utils.calculateTax(coin)

            return { tax: tax?.amount?.toString() ?? '0' }
          }
        }

        @Module({
          imports: [
            TerraModule.forRoot({
              URL: TESTNET_LCD_BASE_URL,
              chainID: TESTNET_CHAIN_ID,
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
            expect(res.body).toHaveProperty('tax', '40')
          })

        await app.close()
      })
    })
  }
})
