import { Module, DynamicModule } from '@nestjs/common';
import { TerraCoreModule } from './terra-core.module';

@Module({})
export class TerraModule {
  static forRoot(): DynamicModule {
    return {
      module: TerraModule,
      imports: [TerraCoreModule.forRoot()],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: TerraModule,
      imports: [TerraCoreModule.forRootAsync()],
    };
  }
}
