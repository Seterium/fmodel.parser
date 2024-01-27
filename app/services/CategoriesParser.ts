import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { CategoryModel, ClassIdModel } from '#models'

import { getFModelDataFiles } from '#utils'

const FILES_SEARCH_PATTERN = 'Content/FactoryGame/Resource/ItemCategories/Cat_*.json'

export class CategoriesParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[Categories parsing]')

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
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

    const classIdModel = await ClassIdModel.firstOrCreate(
      {
        class: fileData[1].Type,
      },
      {
        class: fileData[1].Type,
      },
    )

    const categoryModel = new CategoryModel()

    categoryModel.classId = classIdModel.id
    categoryModel.name = fileData[1].Properties.mDisplayName.SourceString
    categoryModel.nameLocale = fileData[1].Properties.mDisplayName.Key

    await categoryModel.save()

    consola.success(`${this.logPrefix} Добавлена категория ${chalk.bold.greenBright(categoryModel.name)}`)
  }
}
