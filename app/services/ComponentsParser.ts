import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { ClassIdModel, ComponentModel } from '#models'

import { getFModelDataFiles, getOrCreateClassId } from '#utils'

const FILES_SEARCH_PATTERN = 'Content/FactoryGame/Resource/{Parts,RawResources}'

export class ComponentsParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[Components parsing]')

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

    const classIdModel = await getOrCreateClassId('')
  }
}
