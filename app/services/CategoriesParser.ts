import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { BaseParser } from '#services'
import { CategoryModel } from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
} from '#utils'

import { CATEGORIES_PATTERN } from '#constants'

export class CategoriesParser extends BaseParser {
  private logPrefix = chalk.bold.cyanBright('CategoriesParser')

  constructor(modId: number | undefined = undefined) {
    super(modId)
  }

  public async parseFiles(): Promise<void> {
    consola.box(`${this.logPrefix} - парсинг данных компонентов`)

    if (this.modId) {
      consola.info(`Идентификатор модификации: ${chalk.bold.cyanBright(this.modId)}`)
    } else {
      await CategoryModel.truncate()
    }

    const files = getFModelDataFiles(this.getSearchPattern(CATEGORIES_PATTERN))

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)
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
    categoryModel.modId = this.modId

    await categoryModel.save()

    consola.success(`${this.logPrefix} Сохранена категория ${chalk.bold.greenBright(categoryModel.name)}`)
  }

  static async cleanModData(modId: number): Promise<void> {
    await CategoryModel.query().where('mod_id', modId).delete()
  }
}
