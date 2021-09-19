import { DynamicModule, Global, Module } from '@nestjs/common'
import { TerraModuleOptions, TerraModuleAsyncOptions } from './terra.interface'
import { createTerraProvider, createTerraAsyncProvider, createAsyncOptionsProvider } from './terra.providers'

@Global()
@Module({
  providers: [],
  exports: [],
})
export class TerraCoreModule {
  static forRoot(options: TerraModuleOptions): DynamicModule {
    const terraProvider = createTerraProvider(options)

    return {
      module: TerraCoreModule,
      providers: [terraProvider],
      exports: [terraProvider],
    }
  }

  static forRootAsync(options: TerraModuleAsyncOptions): DynamicModule {
    const terraProvider = createTerraAsyncProvider()
    const asyncOptionsProvider = createAsyncOptionsProvider(options)

    return {
      module: TerraCoreModule,
      imports: options.imports,
      providers: [asyncOptionsProvider, terraProvider, ...(options.providers || [])],
      exports: [terraProvider],
    }
  }
}
