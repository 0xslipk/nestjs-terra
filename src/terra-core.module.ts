import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [],
  exports: [],
})
export class TerraCoreModule {
  static forRoot(): DynamicModule {
    return {
      module: TerraCoreModule,
      providers: [],
      exports: [],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: TerraCoreModule,
      imports: [],
      providers: [],
      exports: [],
    };
  }
}
