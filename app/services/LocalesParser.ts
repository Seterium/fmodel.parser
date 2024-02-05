import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { LocaleModel } from '#models'

import { getFModelDataFiles } from '#utils'
import path from 'path'

const FILES_SEARCH_PATTERN = 'Content/**/Game.json'

export class LocalesParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[LocalesParser]')

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

    await LocaleModel.truncate()

    const files = getFModelDataFiles(FILES_SEARCH_PATTERN)

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)
    }

    for (const file of files) {
      await this.parseFile(file)
    }
  }

  private async parseFile(filepath: string): Promise<void> {
    const fileData = JSON.parse(fs.readFileSync(filepath).toString())

    const lang = path.parse(path.join(filepath, '..')).base

    const localizationDictionary = Object.entries<string>(
      fileData[Object.keys(fileData)[0]],
    )

    for (const [key, value] of localizationDictionary) {
      const localeModel = new LocaleModel()

      localeModel.lang = lang
      localeModel.key = key
      localeModel.value = value

      await localeModel.save()

      consola.success(`${this.logPrefix} Расшифровка ключа локализации ${chalk.bold.greenBright(key)} сохранена`)
    }
  }
}
