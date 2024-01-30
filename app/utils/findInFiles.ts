import fs from 'fs'

import objectPath from 'object-path'

export function findInFile(
  fileData: Record<string, any>[],
  searchPatterns: string[],
  callback?: (data: Record<string, any>) => boolean,
): Record<string, any> | undefined {
  for (const element of fileData) {
    const isMatched = searchPatterns.every((searchPattern) => {
      return objectPath.get(element, searchPattern) !== undefined
    })

    if (isMatched) {
      if (callback) {
        const callbackResult = callback(element)

        if (callbackResult) {
          return element
        }
      } else {
        return element
      }
    }
  }

  return undefined
}

export function findInFiles(
  filepaths: string[],
  searchPatterns: string[],
  callback?: (data: Record<string, any>) => boolean,
): Record<string, any> | undefined {
  for (const filepath of filepaths) {
    const fileData: Record<string, any>[] = JSON.parse(fs.readFileSync(filepath).toString())

    const searchResult = findInFile(fileData, searchPatterns)

    if (searchResult !== undefined) {
      if (callback) {
        const callbackResult = callback(searchResult)

        if (callbackResult) {
          return searchResult
        }
      } else {
        return searchResult
      }
    }
  }

  return undefined
}

export function findManyInFiles(
  filepaths: string[],
  searchPatterns: string[],
  callback?: (data: Record<string, any>) => boolean,
): Record<string, any>[] {
  return filepaths.reduce<Record<string, any>[]>((result, current) => {
    const fileListData: Record<string, any>[] = JSON.parse(fs.readFileSync(current).toString())

    for (const fileListElement of fileListData) {
      const isMatched = searchPatterns.every((searchPattern) => {
        return objectPath.get(fileListElement, searchPattern) !== undefined
      })

      if (isMatched) {
        if (callback) {
          const callbackResult = callback(fileListElement)

          if (callbackResult) {
            result.push(fileListElement)
          }
        } else {
          result.push(fileListElement)
        }
      }
    }

    return result
  }, [])
}
