import { DECORATED_PREFIX } from './terra.constants'

export function getTerraToken(): string {
  return `${DECORATED_PREFIX}:LCDClient`
}
