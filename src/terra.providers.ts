import { Provider } from '@nestjs/common'
import { LCDClient as TerraLCDClient } from '@terra-money/terra.js'
import { defer, lastValueFrom } from 'rxjs'
import { TERRA_MODULE_OPTIONS, DEFAULT_GAS_PRICE, DEFAULT_GAS_ADJUSTMENT } from './terra.constants'
import { TerraModuleOptions, TerraModuleAsyncOptions } from './terra.interface'
import { getTerraToken } from './terra.utils'

export async function createLCDClient(options: TerraModuleOptions): Promise<TerraLCDClient> {
  const { URL, chainID, gasPrices = DEFAULT_GAS_PRICE, gasAdjustment = DEFAULT_GAS_ADJUSTMENT } = options

  const client = new TerraLCDClient({
    URL,
    chainID,
    gasPrices,
    gasAdjustment,
  })

  return client
}

export function createTerraProvider(options: TerraModuleOptions): Provider {
  return {
    provide: getTerraToken(),
    useFactory: async (): Promise<TerraLCDClient> => {
      return await lastValueFrom(defer(() => createLCDClient(options)))
    },
  }
}

export function createTerraAsyncProvider(): Provider {
  return {
    provide: getTerraToken(),
    useFactory: async (options: TerraModuleOptions): Promise<TerraLCDClient> => {
      return await lastValueFrom(defer(() => createLCDClient(options)))
    },
    inject: [TERRA_MODULE_OPTIONS],
  }
}

export function createAsyncOptionsProvider(options: TerraModuleAsyncOptions): Provider {
  return {
    provide: TERRA_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject || [],
  }
}
