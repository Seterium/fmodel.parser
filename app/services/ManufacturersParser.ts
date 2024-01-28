import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import consola from 'consola'

import { ClassIdModel, ManufacturerModel, BlueprintComponentModel } from '#models'

import {
  getFModelDataFiles,
  getOrCreateClassId,
  extractClassNameFromPath,
  normalizeIconPath,
  normalizeClassName,
  findInFile,
  findInFiles,
} from '#utils'

const DESC_CLASS_SEARCH_PATTERN = 'Content/FactoryGame/Buildable/Factory/**/Desc_*.json'
const BUILDABLE_CLASS_SEARCH_PATTERN_BASE = 'Content/FactoryGame/Buildable/Factory/**'
const RECIPE_CLASS_SEARCH_PATTERN_BASE = 'Content/FactoryGame/Recipes/Buildings/**/Recipe_*.json'

const MANUFACTURERS_CATEGORY = 'BC_Production_C'

const MANUFACTURERS_SUBCATEGORIES = [
  'SC_Manufacturers_C',
  'SC_Smelters_C',
]

export class ManufacturersParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[ManufacturersParser]')

  private recipesClassesFiles = getFModelDataFiles(RECIPE_CLASS_SEARCH_PATTERN_BASE, false)

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    consola.box('ManufacturersParser')

    await ManufacturerModel.truncate()

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

    const isProduction = descMain.Properties.mCategory.ObjectName.includes(MANUFACTURERS_CATEGORY)

    const isManufacturer = MANUFACTURERS_SUBCATEGORIES.some((el) => {
      return (descMain.Properties.mSubCategories as any[]).some((elInner) => {
        return elInner?.ObjectName?.includes(el) === true
      })
    })

    if (isProduction === false || isManufacturer === false) {
      return
    }

    const buildableClassData = this.getBuildableClassData(descMain)

    if (buildableClassData === undefined) {
      return
    }

    const blueprintClassData = this.getBlueprintClassData(descMain)

    if (blueprintClassData === undefined) {
      consola.error(`Не найден чертеж мануфактуры ${chalk.bold.yellowBright(descMain.Type)}`)

      return
    }

    const classId = await getOrCreateClassId(buildableClassData.Type)

    const manufacturerModel = new ManufacturerModel()

    try {
      const isBlueprintSaved = await this.saveBlueprint(classId, blueprintClassData)

      if (isBlueprintSaved === false) {
        return
      }

      manufacturerModel.classId = classId

      manufacturerModel.icon = descMain.Properties?.mPersistentBigIcon?.ObjectPath
        ? normalizeIconPath(descMain.Properties.mPersistentBigIcon.ObjectPath)
        : ''

      manufacturerModel.name = buildableClassData?.Properties?.mDisplayName?.SourceString ?? ''
      manufacturerModel.nameLocale = buildableClassData?.Properties?.mDisplayName?.Key ?? ''
      manufacturerModel.description = buildableClassData?.Properties?.mDescription?.SourceString ?? ''
      manufacturerModel.descriptionLocale = buildableClassData?.Properties?.mDescription?.Key ?? ''
      manufacturerModel.energyConsumption = buildableClassData?.Properties?.mPowerConsumption ?? 0
      manufacturerModel.energyConsumptionExponent = buildableClassData?.Properties?.mPowerConsumptionExponent ?? 1
      manufacturerModel.manufacturingMultiplier = buildableClassData?.Properties?.mManufacturingSpeed ?? 1

      const parentId = await this.getParentBuildableClassId(buildableClassData)

      if (parentId) {
        manufacturerModel.parentId = parentId
      }
    } catch (error) {
      consola.error(`Ошибка парсинга файла ${chalk.bold.yellowBright(filepath)}`)
      consola.error(error)

      process.exit()
    }

    try {
      await manufacturerModel.save()
    } catch (error) {
      consola.error(`Ошибка сохранения компонента ${chalk.bold.yellowBright(normalizeClassName(descClassData[1].Type))}`)
      consola.error(error)

      process.exit()
    }

    consola.success(`${this.logPrefix} Сохранена мануфактура ${chalk.bold.greenBright(manufacturerModel.name)}`)
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

      return findInFile(data, [
        'Type',
      ], (el) => (el.Type as string).endsWith(className))
    } catch (error) {
      consola.error(`Не удалось преобразовать файл BuildableClass: ${chalk.bold.yellowBright(descClassData.Properties.mBuildableClass.ObjectPath)}`)
      consola.error(error)

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

  private async getParentBuildableClassId(buildableClassData: ReturnType<JSON['parse']>) {
    const parentClassPath: string | undefined = buildableClassData[0]?.Super?.ObjectPath

    if (parentClassPath === undefined) {
      return 0
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

    const parentClassModel = await ManufacturerModel.findBy('class_id', parentClassIdModel.id)

    if (parentClassModel === null) {
      consola.error(
        `Не удалось получить класс с ID ${chalk.bold.yellowBright(parentClassIdModel.id)}`,
        chalk.bold.yellowBright(buildableClassData[1].Type),
      )

      process.exit()
    }

    return parentClassModel.id
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
