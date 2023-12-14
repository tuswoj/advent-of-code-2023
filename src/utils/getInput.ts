import { readFileSync } from 'node:fs'

export function getInput (path: string): string {
  return readFileSync(path, 'utf-8')
}
