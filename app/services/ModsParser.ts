import {
  CategoriesParser,
  ComponentsParser,
  GeneratorsParser,
  ManufacturersParser,
  RecipesParser,
} from '#services'

import chalk from 'chalk'
import consola from 'consola'

export class ModsParser {
  private modId: number

  constructor(modId: number) {
    this.modId = modId
  }

  async parse() {
    await this.removeSavedModData()

    await (new CategoriesParser(this.modId)).parseFiles()
    await (new ComponentsParser(this.modId)).parseFiles()
    await (new GeneratorsParser(this.modId)).parseFiles()
    await (new ManufacturersParser(this.modId)).parseFiles()
    await (new RecipesParser(this.modId)).parseFiles()
  }

  private async removeSavedModData() {
    consola.start(`Удаление данных мода с ID ${chalk.bold.cyanBright(this.modId)}`)

    await Promise.all([
      CategoriesParser.cleanModData(this.modId),
      ComponentsParser.cleanModData(this.modId),
      GeneratorsParser.cleanModData(this.modId),
      ManufacturersParser.cleanModData(this.modId),
      RecipesParser.cleanModData(this.modId),
    ])

    consola.success(`Удаление данных мода с ID ${chalk.bold.cyanBright(this.modId)} завершено`)
  }
}
