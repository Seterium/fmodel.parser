import path from 'path'

export function extractClassNameFromPath(classPath: string): string {
  return path.parse(classPath).name
}
