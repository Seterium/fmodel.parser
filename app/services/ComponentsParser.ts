import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import { BaseParser } from '#services'
import { CategoryModel, ClassIdModel, ComponentModel } from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
  extractClassNameFromPath,
  normalizeIconPath,
  normalizeClassName,
  findInFile,
} from '#utils'

import { COMPONENTS_ALL_PATTERN } from '#constants'

export class ComponentsParser extends BaseParser {
  private logPrefix = chalk.bold.cyanBright('ComponentsParser')

  constructor(modId: number | undefined = undefined) {
    super(modId)
  }

  public async parseFiles(): Promise<void> {
    consola.box(`${this.logPrefix} - парсинг данных компонентов`)

    if (this.modId) {
      consola.info(`Идентификатор модификации: ${chalk.bold.cyanBright(this.modId)}`)
    } else {
      await ComponentModel.truncate()
    }

    const files = getFModelDataFiles(this.getSearchPattern(COMPONENTS_ALL_PATTERN))

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)
    }

    for (const file of files) {
      await this.parseFile(file)
    }
  }

  private async parseFile(filepath: string): Promise<void> {
    const fileData = JSON.parse(fs.readFileSync(filepath).toString())

    const fileDataMain = findInFile(fileData, [
      'Properties.mCategory.ObjectPath',
      'Type',
    ])

    if (fileDataMain === undefined) {
      return
    }

    const classId = await getOrCreateClassId(fileDataMain.Type)

    const categoryId = await ComponentsParser.getCategoryId(fileDataMain.Properties.mCategory.ObjectPath)

    if (categoryId === 0) {
      return
    }

    const componentModel = new ComponentModel()

    try {
      componentModel.classId = classId
      componentModel.categoryId = categoryId

      componentModel.icon = fileDataMain.Properties?.mPersistentBigIcon?.ObjectPath
        ? normalizeIconPath(fileDataMain.Properties.mPersistentBigIcon.ObjectPath)
        : ''

      componentModel.name = fileDataMain.Properties.mDisplayName.SourceString
        ?? fileDataMain.Properties.mDisplayName.CultureInvariantString

      componentModel.nameLocale = fileDataMain.Properties?.mDisplayName?.Key ?? ''

      componentModel.description = fileDataMain.Properties?.mDescription?.SourceString
        ?? fileDataMain.Properties?.mDescription?.CultureInvariantString
        ?? ''

      componentModel.descriptionLocale = fileDataMain.Properties?.mDescription?.Key ?? ''
      componentModel.modId = this.modId
    } catch (error) {
      consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
      consola.error(error)

      process.exit()
    }

    try {
      await componentModel.save()

      consola.success(`${this.logPrefix} Сохранен компонент ${chalk.bold.greenBright(componentModel.name)}`)
    } catch (error) {
      consola.error(`Ошибка сохранения компонента ${chalk.bold.yellowBright(normalizeClassName(fileDataMain.Type))}`)
      consola.error(error)

      process.exit()
    }
  }

  static async getCategoryId(categoryClassName: string): Promise<number> {
    const name = extractClassNameFromPath(categoryClassName)

    const idModel = await ClassIdModel.findBy('class', name)

    if (idModel === null) {
      consola.warn(`Не удалось найти категорию с классом ${chalk.bold.yellowBright(name)}`)

      return 0
    }

    const categoryModel = await CategoryModel.findByOrFail('class_id', idModel.id)

    if (categoryModel === null) {
      consola.warn(`Не удалось найти категорию с ID класса ${chalk.bold.yellowBright(idModel.id)}`)

      return 0
    }

    return categoryModel.id
  }

  static async cleanModData(modId: number): Promise<void> {
    await ComponentModel.query().where('mod_id', modId).delete()
  }
}
