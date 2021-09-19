import { ModuleMetadata } from '@nestjs/common/interfaces'
import { LCDClientConfig } from '@terra-money/terra.js'

export interface TerraModuleOptions extends LCDClientConfig, Record<string, any> {}

export interface TerraModuleAsyncOptions extends Pick<ModuleMetadata, 'imports' | 'providers'> {
  useFactory: (...args: any[]) => TerraModuleOptions | Promise<TerraModuleOptions>
  inject?: any[]
}
