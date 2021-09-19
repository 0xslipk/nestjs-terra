NestJS-Terra
=============

[![npm](https://img.shields.io/npm/v/nestjs-terra)](https://www.npmjs.com/package/nestjs-terra)
[![CircleCI](https://circleci.com/gh/jarcodallo/nestjs-terra/tree/main.svg?style=svg)](https://circleci.com/gh/jarcodallo/nestjs-terra/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/jarcodallo/nestjs-terra/badge.svg?branch=main)](https://coveralls.io/github/jarcodallo/nestjs-terra?branch=main)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/nestjs-terra)](https://snyk.io/test/github/jarcodallo/nestjs-terra)
[![dependencies](https://img.shields.io/david/jarcodallo/nestjs-terra)](https://img.shields.io/david/jarcodallo/nestjs-terra)
[![dependabot](https://badgen.net/dependabot/jarcodallo/nestjs-terra/?icon=dependabot)](https://badgen.net/dependabot/jarcodallo/nestjs-terra/?icon=dependabot)
[![supported platforms](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)](https://img.shields.io/badge/platforms-Express%20%26%20Fastify-green)


Terra blockchain utilities for NestJS based on [Terra.js](https://github.com/terra-project/terra.js)

## Install

```sh
npm i nestjs-terra
```

## Register module

### Configuration params

`nestjs-terra` can be configured with this options:

```ts
interface TerraModuleOptions {
  /**
   * The base URL to wich Light Client Daemon (LCD) requests will be made.
   * For example: https://lcd.terra.dev
   */
  URL: string;

  /**
   * Chain ID of the blockchain to connect to.
   * For example:
   *  - columbus-5: Mainnet
   *  - tequila-0004: Testnet
   *  - bombay-9: Testnet
   */
  chainID: string;

  /**
   * Optional parameter for gas prices to use for fee estimation.
   */
  gasPrices?: Coins.Input;

  /**
   * Optional parameter for gas adjustment value to use for fee estimation.
   */
  gasAdjustment?: Numeric.Input;
}
```

### Synchronous configuration

Use `TerraModule.forRoot` method with [Options interface](#configuration-params):

```ts
import {
  TerraModule,
  MAINNET_LCD_BASE_URL,
  MAINNET_CHAIN_ID
} from 'nestjs-terra';

@Module({
  imports: [
    TerraModule.forRoot({
      URL: MAINNET_LCD_BASE_URL,
      chainID: MAINNET_CHAIN_ID,
    })
  ],
  ...
})
class MyModule {}
```

### Asynchronous configuration

With `TerraModule.forRootAsync` you can, for example, import your `ConfigModule` and inject `ConfigService` to use it in `useFactory` method.

`useFactory` should return object with [Options interface](#configuration-params)

Here's an example:

```ts
import {
  TerraModule,
  MAINNET_LCD_BASE_URL,
  MAINNET_CHAIN_ID
} from 'nestjs-terra';

@Injectable()
class ConfigService {
  public readonly URL = MAINNET_LCD_BASE_URL;
  public readonly chainID = MAINNET_CHAIN_ID;
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService]
})
class ConfigModule {}

@Module({
  imports: [
    TerraModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        await somePromise();
        return {
          URL: config.URL,
          chainID: config.chainID,
        };
      }
    })
  ],
  ...
})
class MyModule {}
```

Or you can just pass `ConfigService` to `providers`, if you don't have any `ConfigModule`:

```ts
import {
  TerraModule,
  MAINNET_LCD_BASE_URL,
  MAINNET_CHAIN_ID,
} from 'nestjs-terra';

@Injectable()
class ConfigService {
  public readonly URL = MAINNET_LCD_BASE_URL;
  public readonly chainID = MAINNET_CHAIN_ID;
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
      }
    })
  ],
  controllers: [TestController]
})
class MyModule {}
```

## LCDClient

if you are familiar with [LCDClient](https://github.com/terra-project/terra.js/wiki/Making-a-connection), you are ready to go.

```ts
import { InjectLCDClient, LCDClient, MnemonicKey } from 'nestjs-terra';

@Injectable()
export class TestService {
  constructor(
    @InjectLCDClient()
    private readonly terraClient: LCDClient,
  ) {}
  async someMethod(): Promise<{ accountNumber: string }> {
    const wallet = this.terraClient.wallet(
      new MnemonicKey({
        mnemonic: [
          'satisfy',
          'adjust',
          'timber',
          'high',
          'purchase',
          'tuition',
          'stool',
          'faith',
          'fine',
          'install',
          'that',
          'you',
          'unaware',
          'feed',
          'domain',
          'license',
          'impose',
          'boss',
          'human',
          'eager',
          'hat',
          'rent',
          'enjoy',
          'dawn',
        ].join(' ')
      }),
    );
    const accountNumber = await wallet.accountNumber();

    return { accountNumber: accountNumber.toString() };
  }
}
```

## Testing a class that uses @InjectLCDClient

This package exposes a getTerraToken() function that returns a prepared injection token based on the provided context. 
Using this token, you can easily provide a mock implementation of the `LCDClient` using any of the standard custom provider techniques, including useClass, useValue, and useFactory.

```ts
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      MyService,
      {
        provide: getTerraToken(),
        useValue: mockProvider,
      },
    ],
  }).compile();
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Author

**Jose Ramirez [Twitter](https://twitter.com/jarcodallo)**

## License

Licensed under the Apache 2.0 - see the [LICENSE](LICENSE) file for details.
