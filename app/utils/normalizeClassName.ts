export function normalizeClassName(className: string): string {
  return className.endsWith('_C')
    ? className.slice(0, -2)
    : className
}
