import { Module, DynamicModule } from '@nestjs/common';
import { TerraCoreModule } from './terra-core.module';
import { TerraModuleOptions, TerraModuleAsyncOptions } from './terra.interface';

@Module({})
export class TerraModule {
  static forRoot(options: TerraModuleOptions): DynamicModule {
    return {
      module: TerraModule,
      imports: [TerraCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: TerraModuleAsyncOptions): DynamicModule {
    return {
      module: TerraModule,
      imports: [TerraCoreModule.forRootAsync(options)],
    };
  }
}
