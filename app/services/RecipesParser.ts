import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import {
  ClassIdModel,
  RecipeModel,
  RecipeInputModel,
  RecipeOutputModel,
} from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
  extractClassNameFromPath,
  normalizeIconPath,
  normalizeClassName,
} from '#utils'

const FILES_SEARCH_PATTERN = 'Content/FactoryGame/Recipes/**/Recipe_*.json'

const EXCLUDED_PRODUCED_IN_CLASSES = [
  'BP_BuildGun_C',
]

export class RecipesParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[RecipesParser]')

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

    // await ComponentModel.truncate()

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
    // const fileData = JSON.parse(fs.readFileSync(filepath).toString())

    // const classId = await getOrCreateClassId(fileData[1].Type)

    // if (!fileData[1].Properties?.mCategory?.ObjectPath) {
    //   return
    // }

    // const categoryId = await ComponentsParser.getCategoryId(fileData[1].Properties.mCategory.ObjectPath)

    // const componentModel = new ComponentModel()

    // try {

    // } catch (error) {
    // //   consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
    // //   consola.error(error)

    // //   process.exit()
    // }

    // try {
    //   // await componentModel.save()

    //   // consola.success(`${this.logPrefix} Сохранен рецепт ${chalk.bold.greenBright(componentModel.name)}`)
    // } catch (error) {
    //   // consola.error(`Ошибка сохранения рецепта ${chalk.bold.yellowBright(normalizeClassName(fileData[1].Type))}`)
    //   // consola.error(error)

    //   // process.exit()
    // }
  }
}
