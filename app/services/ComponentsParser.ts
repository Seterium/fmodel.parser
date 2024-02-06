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
} from '#utils'

import { COMPONENTS_ALL_PATTERN } from '#constants'

export class ComponentsParser extends BaseParser {
  private logPrefix = chalk.bold.cyanBright('[CategoriesParser]')

  constructor(modId: number | undefined = undefined) {
    super(modId)
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

    await ComponentModel.truncate()

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

    const classId = await getOrCreateClassId(fileData[1].Type)

    if (!fileData[1].Properties?.mCategory?.ObjectPath) {
      return
    }

    const categoryId = await ComponentsParser.getCategoryId(fileData[1].Properties.mCategory.ObjectPath)

    const componentModel = new ComponentModel()

    try {
      componentModel.classId = classId
      componentModel.categoryId = categoryId

      componentModel.icon = fileData[1].Properties?.mPersistentBigIcon?.ObjectPath
        ? normalizeIconPath(fileData[1].Properties.mPersistentBigIcon.ObjectPath)
        : ''

      componentModel.name = fileData[1].Properties.mDisplayName.SourceString
        ?? fileData[1].Properties.mDisplayName.CultureInvariantString

      componentModel.nameLocale = fileData[1].Properties?.mDisplayName?.Key ?? ''

      componentModel.description = fileData[1].Properties?.mDescription?.SourceString
        ?? fileData[1].Properties?.mDescription?.CultureInvariantString
        ?? ''

      componentModel.descriptionLocale = fileData[1].Properties?.mDescription?.Key ?? ''
    } catch (error) {
      consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
      consola.error(error)

      process.exit()
    }

    try {
      await componentModel.save()

      consola.success(`${this.logPrefix} Сохранен компонент ${chalk.bold.greenBright(componentModel.name)}`)
    } catch (error) {
      consola.error(`Ошибка сохранения компонента ${chalk.bold.yellowBright(normalizeClassName(fileData[1].Type))}`)
      consola.error(error)

      process.exit()
    }
  }

  static async getCategoryId(categoryClassName: string): Promise<number> {
    const name = extractClassNameFromPath(categoryClassName)

    const idModel = await ClassIdModel.findBy('class', name)

    if (idModel === null) {
      consola.error(`Не удалось найти категорию с классом ${chalk.bold.yellowBright(name)}`)

      process.exit()
    }

    const categoryModel = await CategoryModel.findByOrFail('class_id', idModel.id)

    if (categoryModel === null) {
      consola.error(`Не удалось найти категорию с ID класса ${chalk.bold.yellowBright(idModel.id)}`)

      process.exit()
    }

    return categoryModel.id
  }

  static async cleanModData(modId: number): Promise<void> {
    await ComponentModel.query().where('mod_id', modId).delete()
  }
}
