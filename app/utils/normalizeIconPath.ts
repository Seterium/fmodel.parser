import path from 'path'

export function normalizeIconPath(iconPath: string): string {
  const { dir, name } = path.parse(iconPath)

  return `${dir.slice(12)}/${name}.png`
}
