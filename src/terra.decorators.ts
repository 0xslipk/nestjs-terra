import { Inject } from '@nestjs/common'
import { getTerraToken } from './terra.utils'

export const InjectLCDClient = () => Inject(getTerraToken())
