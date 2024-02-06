import fs from 'fs'

import chalk from 'chalk'
import consola from 'consola'

import {
  RecipeModel,
  ClassIdModel,
  RecipeInputModel,
  RecipeOutputModel,
} from '#models'
import { BaseParser } from '#services'

import {
  findInFile,
  getOrCreateClassId,
  getFModelDataFiles,
  extractClassNameFromPath,
} from '#utils'

import { RECIPES_PATTERN } from '#constants'

export class RecipesParser extends BaseParser {
  private logPrefix = chalk.bold.cyanBright('[RecipesParser]')

  constructor(modId: number | undefined = undefined) {
    super(modId)
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

    await Promise.all([
      RecipeModel.truncate(),
      RecipeInputModel.truncate(),
      RecipeOutputModel.truncate(),
    ])

    const files = getFModelDataFiles(this.getSearchPattern(RECIPES_PATTERN))

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)
    }

    try {
      for (const file of files) {
        await this.parseFile(file)
      }
    } catch (error) {
      consola.error(error)
    }
  }

  private async parseFile(filepath: string): Promise<void> {
    const recipeMain = findInFile(JSON.parse(fs.readFileSync(filepath).toString()), [
      'Properties.mDisplayName',
      'Properties.mIngredients',
      'Properties.mProduct',
      'Properties.mProducedIn',
    ])

    if (recipeMain === undefined) {
      return
    }

    const manufacturerClassId: number = await this.getManufacturerClassId(recipeMain)

    if (manufacturerClassId === 0) {
      return
    }

    const classId: number = await getOrCreateClassId(recipeMain.Type)

    const recipeModel = new RecipeModel()

    try {
      await this.saveInputs(classId, recipeMain)
      await this.saveOutputs(classId, recipeMain)

      recipeModel.classId = classId
      recipeModel.name = recipeMain.Properties.mDisplayName?.SourceString
        ?? recipeMain.Properties.mDisplayName?.CultureInvariantString
        ?? ''

      recipeModel.nameLocale = recipeMain.Properties.mDisplayName.Key ?? ''
      recipeModel.isAlt = recipeMain.Type.includes('Alternate')
      recipeModel.manufacturerClassId = manufacturerClassId
      recipeModel.manufacturingDuration = recipeMain.Properties.mManufactoringDuration ?? 0
      recipeModel.energyConsumptionConstant = recipeMain.Properties.mVariablePowerConsumptionConstant
      recipeModel.energyConsumptionFactor = recipeMain.Properties.mVariablePowerConsumptionFactor
      recipeModel.modId = this.modId
    } catch (error) {
      consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
      consola.error(error)

      process.exit()
    }

    try {
      await recipeModel.save()

      consola.success(`${this.logPrefix} Сохранен рецепт ${chalk.bold.greenBright(recipeMain.Type)}`)
    } catch (error) {
      consola.error(`Ошибка сохранения рецепта ${chalk.bold.yellowBright(recipeMain.Type)}`)
      consola.error(error)

      process.exit()
    }
  }

  private async getManufacturerClassId(recipeData: Record<string, any>): Promise<number> {
    const producersClassesNames = (recipeData.Properties.mProducedIn as any[]).map((item) => {
      return extractClassNameFromPath(item.AssetPathName)
    })

    for (const className of producersClassesNames) {
      const classIdModel = await ClassIdModel.findBy('class', className)

      if (classIdModel !== null) {
        return classIdModel.id
      }
    }

    return 0
  }

  private async saveInputs(recipeClassId: number, recipeData: Record<string, any>): Promise<void> {
    for (const { ItemClass, Amount } of recipeData.Properties.mIngredients) {
      const componentClassName = extractClassNameFromPath(ItemClass.ObjectPath)

      const componentClassIdModel = await ClassIdModel.findBy('class', componentClassName)

      if (componentClassIdModel === null) {
        consola.error(`Не найден ClassID компонента ${chalk.bold.yellowBright(componentClassName)}`)

        return
      }

      const recipeInputModel = new RecipeInputModel()

      try {
        recipeInputModel.recipeClassId = recipeClassId
        recipeInputModel.componentClassId = componentClassIdModel.id
        recipeInputModel.amount = Amount

        await recipeInputModel.save()
      } catch (error) {
        consola.error(`Не удалось сохранить компоненты рецепта ${chalk.bold.greenBright(recipeData.Type)}`)
        consola.error(error)

        return
      }
    }

    consola.success(`${this.logPrefix} Сохранены ингредиенты рецепта ${chalk.bold.greenBright(recipeData.Type)}`)
  }

  private async saveOutputs(recipeClassId: number, recipeData: Record<string, any>): Promise<void> {
    for (const { ItemClass, Amount } of recipeData.Properties.mProduct) {
      const componentClassName = extractClassNameFromPath(ItemClass.ObjectPath)

      const componentClassIdModel = await ClassIdModel.findBy('class', componentClassName)

      if (componentClassIdModel === null) {
        consola.error(`Не найден ClassID компонента ${chalk.bold.yellowBright(componentClassName)}`)

        return
      }

      const recipeOutputModel = new RecipeOutputModel()

      try {
        recipeOutputModel.recipeClassId = recipeClassId
        recipeOutputModel.componentClassId = componentClassIdModel.id
        recipeOutputModel.amount = Amount

        await recipeOutputModel.save()
      } catch (error) {
        consola.error(`Не удалось сохранить результаты рецепта ${chalk.bold.greenBright(recipeData.Type)}`)
        consola.error(error)

        return
      }
    }

    consola.success(`${this.logPrefix} Сохранены результаты рецепта ${chalk.bold.greenBright(recipeData.Type)}`)
  }

  static async cleanModData(modId: number): Promise<void> {
    const models = await RecipeModel.query().where('mod_id', modId)

    if (models.length) {
      const classesIds = models.map(({ classId }) => classId)

      await Promise.all([
        RecipeInputModel.query().whereIn('building_class_id', classesIds).delete(),
        RecipeOutputModel.query().whereIn('building_class_id', classesIds).delete(),
        ...models.map((model) => model.delete()),
      ])
    }
  }
}
