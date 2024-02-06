export function isStringInclude(sourceString: string, includes: string[]): boolean {
  return includes.some((el) => sourceString.includes(el))
}
