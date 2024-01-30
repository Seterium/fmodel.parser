import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { CategoryModel } from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
} from '#utils'

const FILES_SEARCH_PATTERN = 'Content/FactoryGame/Resource/ItemCategories/Cat_*.json'

export class CategoriesParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[CategoriesParser]')

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

    await CategoryModel.truncate()

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

    const classId = await getOrCreateClassId(fileData[1].Type)

    const categoryModel = new CategoryModel()

    categoryModel.classId = classId
    categoryModel.name = fileData[1].Properties.mDisplayName.SourceString
    categoryModel.nameLocale = fileData[1].Properties.mDisplayName.Key

    await categoryModel.save()

    consola.success(`${this.logPrefix} Сохранена категория ${chalk.bold.greenBright(categoryModel.name)}`)
  }
}
