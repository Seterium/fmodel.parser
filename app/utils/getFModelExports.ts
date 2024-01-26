import path from 'path'

import env from '#start/env'

import chalk from 'chalk'
import consola from 'consola'
import { globSync } from 'glob'

import { pluralize } from './pluralize.js'

export function getFModelExports(pattern: string): string[] {
  consola.start(`Поиск файлов по шаблону ${chalk.bold.cyanBright(pattern)}`)

  const dir = path.join(env.get('FMODEL_EXPORTS_DIR'), pattern).replaceAll('\\', '/')

  const files = globSync(dir)

  if (files.length === 0) {
    consola.warn(`Файлы по шаблону ${chalk.bold.yellowBright(pattern)} не найдены`)
    consola.info(`Полный текст шаблона: ${chalk.bold.cyanBright(dir)}`)
    console.log()
  } else {
    consola.success(`Найдено ${chalk.bold.cyanBright(files.length)} ${pluralize(files.length, ['файл', 'файла', 'файлов'])}`)
    console.log()
  }

  return files
}
