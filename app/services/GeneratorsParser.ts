import fs from 'fs'
import path from 'path'

import chalk from 'chalk'
import consola from 'consola'

import {
  FuelModel,
  ClassIdModel,
  GeneratorModel,
  BlueprintComponentModel,
  ComponentModel,
} from '#models'

import {
  findInFile,
  findInFiles,
  findManyInFiles,
  normalizeIconPath,
  getFModelDataFiles,
  getOrCreateClassId,
  normalizeClassName,
  extractClassNameFromPath,
} from '#utils'

const DESC_CLASS_SEARCH_PATTERN = 'Content/FactoryGame/Buildable/Factory/**/Desc_*.json'
const COMPONENTS_DESCS_CLASSES_PATTERN = 'Content/FactoryGame/Resource/**/Desc_*.json'
const BUILDABLE_CLASS_SEARCH_PATTERN_BASE = 'Content/FactoryGame/Buildable/Factory/**'
const RECIPE_CLASS_SEARCH_PATTERN = 'Content/FactoryGame/Recipes/Buildings/**/Recipe_*.json'

const GENERATOR_SUBCATEGORIY_NAME = 'SC_Generators_C'

export class GeneratorsParser {
  public modFolder: string = ''

  private logPrefix = chalk.bold.cyanBright('[GeneratorsParser]')

  private recipesClassesFiles = getFModelDataFiles(RECIPE_CLASS_SEARCH_PATTERN, false)

  private componentsClassesFiles = getFModelDataFiles(COMPONENTS_DESCS_CLASSES_PATTERN, false)

  constructor(modFolder: string | undefined = undefined) {
    if (modFolder) {
      this.modFolder = modFolder
    }
  }

  public async parseFiles(): Promise<void> {
    consola.box(this.logPrefix)

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

    const isGenerator = (descMain.Properties.mSubCategories as any[]).some((subcategory) => {
      return subcategory?.ObjectName?.includes(GENERATOR_SUBCATEGORIY_NAME) ?? false
    })

    if (isGenerator === false) {
      return
    }

    const buildableClassData = this.getBuildableClassData(descMain)

    if (buildableClassData === undefined || buildableClassData.Properties.mDefaultFuelClasses === undefined) {
      return
    }

    const blueprintClassData = this.getBlueprintClassData(descMain)

    if (blueprintClassData === undefined) {
      return
    }
    const classId = await getOrCreateClassId(buildableClassData.Type)

    const generatorModel = new GeneratorModel()

    await this.saveBlueprint(classId, blueprintClassData)

    try {
      await this.saveFuels(classId, buildableClassData)
    } catch (error) {
      consola.error(error)

      process.exit()
    }

    try {
      generatorModel.classId = classId
      generatorModel.icon = descMain.Properties?.mPersistentBigIcon?.ObjectPath
        ? normalizeIconPath(descMain.Properties.mPersistentBigIcon.ObjectPath)
        : ''

      generatorModel.name = buildableClassData.Properties.mDisplayName?.SourceString
        ?? buildableClassData.Properties.mDisplayName?.CultureInvariantString
        ?? ''

      generatorModel.nameLocale = buildableClassData.Properties.mDisplayName.Key ?? ''
      generatorModel.description = buildableClassData.Properties.mDescription?.SourceString
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

    try {
      await generatorModel.save()

      consola.success(`${this.logPrefix} Сохранен генератор ${chalk.bold.greenBright(buildableClassData.Properties.mDisplayName.SourceString)}`)
    } catch (error) {
      consola.error(`Ошибка сохранения компонента ${chalk.bold.yellowBright(buildableClassData.Properties.mDisplayName.SourceString)}`)
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

      return findInFile(data, ['Type'], (el) => {
        return (el.Type as string)?.endsWith(className) ?? false
      })
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
      return (data.Properties.mProduct[0]?.ItemClass?.ObjectName as string)?.endsWith(`${fileData.Type}'`)
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
    if (buildableClassData.Properties.mSupplementalResourceClass === undefined) {
      return null
    }

    const supplementalClassName = extractClassNameFromPath(
      buildableClassData.Properties.mSupplementalResourceClass.ObjectPath,
    )

    const supplementalClassId = await ClassIdModel.findBy('class', supplementalClassName)

    if (supplementalClassId === null) {
      consola.error([
        `Не удалось найти компонент с классом ${chalk.bold.yellowBright(supplementalClassName)},`,
        `испльзуемый в качестве доп. загрузки генератора ${chalk.bold.yellowBright(buildableClassData.Name)}`,
      ].join(' '))

      return null
    }

    const componentId = await ComponentModel.findBy('class_id', supplementalClassId.id)

    if (componentId === null) {
      consola.error(`Не удалось найти компонент с ID класса ${chalk.bold.yellowBright(supplementalClassId)}`)

      return null
    }

    return componentId.id
  }

  private async saveFuels(generatorClassId: number, buildableClassData: Record<string, any>): Promise<void> {
    for (const fuel of buildableClassData.Properties.mDefaultFuelClasses) {
      if (fuel.AssetPathName.startsWith('/Script/FactoryGame')) {
        await this.saveFuelsByDescriptor(fuel, generatorClassId)
      } else {
        const fuelClassName = extractClassNameFromPath(fuel.AssetPathName)

        await this.saveFuel(fuelClassName, generatorClassId)
      }
    }
  }

  private async saveFuel(fuelClassName: string, generatorClassId: number) {
    const fuelComponentClassIdModel = await ClassIdModel.findBy('class', fuelClassName)

    if (fuelComponentClassIdModel === null) {
      consola.error(`Не удалось найти ID класса ${chalk.bold.yellowBright(fuelClassName)}`)

      return
    }

    const fuelDesc = findInFiles(this.componentsClassesFiles, [
      'Type',
      'Name',
      'Properties',
    ], ({ Type }) => {
      return Type === `${fuelClassName}_C`
    })

    if (fuelDesc === undefined) {
      consola.error(`Не удалось найти описание компонента ${chalk.bold.yellowBright(fuelClassName)}`)

      return
    }

    if (fuelDesc.Properties.mEnergyValue === undefined) {
      return
    }

    const fuelModel = new FuelModel()

    fuelModel.generatorClassId = generatorClassId
    fuelModel.componentClassId = fuelComponentClassIdModel.id
    fuelModel.energy = fuelDesc.Properties.mEnergyValue

    if (fuelDesc.Properties.mSpentFuelClass?.ObjectPath) {
      const wasteClassName = extractClassNameFromPath(fuelDesc.Properties.mSpentFuelClass.ObjectPath)

      const wasteClassIdModel = await ClassIdModel.findBy('class', wasteClassName)

      if (wasteClassIdModel === null) {
        consola.error(`Не удалось найти ID класса ${chalk.bold.yellowBright(fuelClassName)}`)

        return
      }

      fuelModel.wasteComponentClassId = wasteClassIdModel.id
      fuelModel.wasteAmount = fuelDesc.Properties.mAmountOfWaste
    }

    const fuelName = fuelDesc.Properties.mDisplayName.SourceString
      ?? fuelDesc.Properties.mDisplayName.CultureInvariantString
      ?? 'unnnamed'

    try {
      await fuelModel.save()

      consola.success(
        `${this.logPrefix} Сохранено топливо ${chalk.bold.greenBright(fuelName)}`,
        chalk.bold.cyanBright(`(${fuelClassName})`),
      )
    } catch (error) {
      consola.error(
        `Ошибка сохранения топлива ${chalk.bold.yellowBright(fuelName)}`,
        chalk.bold.cyanBright(`(${fuelClassName})`),
      )
      consola.error(error)
    }
  }

  private async saveFuelsByDescriptor(
    fuel: Record<string, any>,
    generatorClassId: number,
  ) {
    const descriptorName = (fuel.AssetPathName as string).split('.').pop()

    if (descriptorName === undefined) {
      consola.error(`Не удалось извлечь имя дескриптора из ${chalk.bold.yellowBright(fuel.AssetPathName)}`)

      return
    }

    const componentsMatchDescriptor = findManyInFiles(this.componentsClassesFiles, [
      'SuperStruct.ObjectName',
    ], (data) => data.SuperStruct.ObjectName.includes(descriptorName))

    if (componentsMatchDescriptor.length === 0) {
      consola.error(`Не удалось найти компоненты, соотв. дескриптору ${chalk.bold.yellowBright(descriptorName)}`)

      return
    }

    for (const component of componentsMatchDescriptor) {
      await this.saveFuel(normalizeClassName(component.Name), generatorClassId)
    }
  }

  private async saveBlueprint(classId: number, buildClassData: Record<string, any>): Promise<boolean> {
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
