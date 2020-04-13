import { Config } from './index'
import { join } from 'path'

export function toPath(prefix: string, cfg: Config): string {
  return join(prefix, `day=${cfg.day}/hour=${cfg.hour}/`);
}
