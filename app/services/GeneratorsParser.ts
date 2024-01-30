import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import consola from 'consola'

import {
  FuelModel,
  ClassIdModel,
  GeneratorModel,
  BlueprintComponentModel,
} from '#models'

import {
  findInFile,
  findInFiles,
  normalizeIconPath,
  getFModelDataFiles,
  getOrCreateClassId,
  extractClassNameFromPath,
} from '#utils'

const DESC_CLASS_SEARCH_PATTERN = 'Content/FactoryGame/Buildable/Factory/**/Desc_*.json'
const BUILDABLE_CLASS_SEARCH_PATTERN_BASE = 'Content/FactoryGame/Buildable/Factory/**'
const RECIPE_CLASS_SEARCH_PATTERN_BASE = 'Content/FactoryGame/Recipes/Buildings/**/Recipe_*.json'

const GENERATOR_SUBCATEGORIY_NAME = 'SC_Generators_C'

const EXCLUDED_CLASSES_NAMES = [
  'Default__Desc_GeneratorIntegratedBiomass_C',
  'Default__Desc_PowerStorageMk1_C',
  'Default__Desc_GeneratorGeoThermal_C',
]

export class GeneratorsParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[GeneratorsParser]')

  private recipesClassesFiles = getFModelDataFiles(RECIPE_CLASS_SEARCH_PATTERN_BASE, false)

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    await GeneratorModel.truncate()
    await FuelModel.truncate()

    const files = getFModelDataFiles(DESC_CLASS_SEARCH_PATTERN)

    if (files.length === 0) {
      consola.fail(`${this.logPrefix} нет файлов данных`)

      process.exit()
    }

    for (const file of files) {
      await this.parseFile(file)
    }
  }

  private async parseFile(filepath: string): Promise<void> {
    const descClassData = JSON.parse(fs.readFileSync(filepath).toString())

    const descMain = findInFile(descClassData, [
      'Properties.mCategory',
      'Properties.mSubCategories',
      'Properties.mBuildableClass',
    ])

    if (descMain === undefined) {
      return
    }

    if (EXCLUDED_CLASSES_NAMES.includes(descMain.Name)) {
      return
    }

    const isGenerator = (descMain.Properties.mSubCategories as any[]).some((subcategory) => {
      return subcategory?.ObjectName?.includes(GENERATOR_SUBCATEGORIY_NAME) ?? false
    })

    if (isGenerator === false) {
      return
    }

    const buildableClassData = this.getBuildableClassData(descMain)

    if (buildableClassData === undefined) {
      return
    }

    const blueprintClassData = this.getBlueprintClassData(descMain)

    if (blueprintClassData === undefined) {
      consola.error(`Не найден чертеж генератора ${chalk.bold.yellowBright(descMain.Type)}`)

      return
    }

    const classId = await getOrCreateClassId(buildableClassData.Type)

    const generatorModel = new GeneratorModel()

    try {
      const isBlueprintSaved = await this.saveBlueprint(classId, blueprintClassData)

      if (isBlueprintSaved === false) {
        return
      }

      const isFuelsSaved = await this.saveFuels(classId, blueprintClassData)

      if (isFuelsSaved === false) {
        return
      }

      generatorModel.classId = classId
      generatorModel.icon = descMain.Properties?.mPersistentBigIcon?.ObjectPath
        ? normalizeIconPath(descMain.Properties.mPersistentBigIcon.ObjectPath)
        : ''

      generatorModel.description = buildableClassData.Properties.mDescription.SourceString
      generatorModel.descriptionLocale = buildableClassData.Properties.mDescription.Key ?? ''
      generatorModel.power = buildableClassData.Properties.mPowerProduction
      generatorModel.supplementalComponentId = await this.getSupplementalComponentId(buildableClassData)
      generatorModel.supplementalToPowerRatio = buildableClassData.Properties.mSupplementalToPowerRatio ?? null
      generatorModel.parentClassId = await this.getParentBuildableClassId(buildableClassData)
    } catch (error) {
      consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
      consola.error(error)

      process.exit()
    }
  }

  private getBuildableClassData(descClassData: Record<string, any>): Record<string, any> | undefined {
    const filename = this.getBuildableClassFilenameFromDesc(descClassData)

    if (filename === undefined) {
      return undefined
    }

    const searchPattern = path.join(BUILDABLE_CLASS_SEARCH_PATTERN_BASE, `${filename}.json`)

    const filepath: string | undefined = getFModelDataFiles(searchPattern, false)[0]

    if (filepath === undefined) {
      consola.error(`Не удалось найти файл BuildableClass: ${chalk.bold.yellowBright(descClassData.Properties.mBuildableClass.ObjectPath)}`)

      return undefined
    }

    const className = descClassData.Type.replace('Desc_', '')

    try {
      const data = JSON.parse(fs.readFileSync(filepath).toString())

      return findInFile(data, ['Type'], (el) => (el.Type as string).endsWith(className))
    } catch (error) {
      consola.error(`Не удалось преобразовать файл BuildableClass: ${chalk.bold.yellowBright(descClassData.Properties.mBuildableClass.ObjectPath)}`)
      return undefined
    }
  }

  private getBuildableClassFilenameFromDesc(data: Record<string, any>): string | undefined {
    try {
      return path.parse(data.Properties.mBuildableClass.ObjectPath).name
    } catch (error) {
      consola.warn(`Не найдена ссылка на BuildableClass ${chalk.bold.yellowBright(data.Type)}`)

      return undefined
    }
  }

  private getBlueprintClassData(fileData: Record<string, any>): Record<string, any> | undefined {
    const recipeData = findInFiles(this.recipesClassesFiles, [
      'Properties.mIngredients',
      'Properties.mProduct',
    ], (data) => {
      return (data.Properties.mProduct[0]?.ItemClass?.ObjectName as string).endsWith(`${fileData.Type}'`)
    })

    return recipeData
  }

  private async getParentBuildableClassId(buildableClassData: Record<string, any>): Promise<number | null> {
    const parentClassPath: string | undefined = buildableClassData?.Super?.ObjectPath

    if (parentClassPath === undefined) {
      return null
    }

    const parentClassName = extractClassNameFromPath(parentClassPath)

    const parentClassIdModel = await ClassIdModel.findBy('class', parentClassName)

    if (parentClassIdModel === null) {
      consola.error(
        `Не удалось получить ID родительского класса ${chalk.bold.yellowBright(buildableClassData[0].Name)}`,
        chalk.bold.yellowBright(parentClassName),
      )

      process.exit()
    }

    const parentClassModel = await GeneratorModel.findBy('class_id', parentClassIdModel.id)

    if (parentClassModel === null) {
      consola.error(
        `Не удалось получить класс с ID ${chalk.bold.yellowBright(parentClassIdModel.id)}`,
        chalk.bold.yellowBright(buildableClassData.Type),
      )

      process.exit()
    }

    return parentClassModel.id
  }

  private async getSupplementalComponentId(buildableClassData: Record<string, any>): Promise<number | null> {
    return 0
  }

  private async saveFuels(generatorClassId: number, buildableClassData: Record<string, any>): Promise<boolean> {
    return false
  }

  private async saveBlueprint(classId: number, buildClassData: ReturnType<JSON['parse']>): Promise<boolean> {
    for (const component of buildClassData.Properties.mIngredients) {
      const componentClassName = extractClassNameFromPath(component.ItemClass.ObjectPath)

      const classIdModel = await ClassIdModel.findBy('class', componentClassName)

      if (classIdModel === null) {
        consola.error(`Не найден ID класса ${chalk.bold.yellowBright(componentClassName)}`)

        process.exit()
      }

      const blueprintComponentModel = new BlueprintComponentModel()

      blueprintComponentModel.buildingClassId = classId
      blueprintComponentModel.componentClassId = classIdModel.id
      blueprintComponentModel.amount = component.Amount

      await blueprintComponentModel.save()
    }

    return true
  }
}
