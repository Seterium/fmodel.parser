import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { GeneratorModel, ClassIdModel, ComponentModel } from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
  extractClassNameFromPath,
  normalizeIconPath,
  normalizeClassName,
} from '#utils'

const FILES_SEARCH_PATTERN = ''

export class GeneratorsParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[GeneratorsParser]')

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    await ComponentModel.truncate()

    const files = getFModelDataFiles(FILES_SEARCH_PATTERN)

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)

      process.exit()
    }

    for (const file of files) {
      await this.parseFile(file)
    }
  }

  private async parseFile(filepath: string): Promise<void> {
    const fileData = JSON.parse(fs.readFileSync(filepath).toString())
  }
}
