import path from 'path'

import chalk from 'chalk'
import consola from 'consola'

import modsConfig from '#config/mods'

import { FACTORY_GAME_CONTENTS } from '#constants'

export class BaseParser {
  protected modId: number = 0

  protected baseDir: string = FACTORY_GAME_CONTENTS

  constructor(modId: number | undefined) {
    if (modId) {
      this.modId = modId

      const modData = modsConfig.list.find(({ id }) => id === modId)

      if (modData === undefined) {
        consola.error(`Мод с ID ${chalk.bold.cyanBright(modId)} не зарегистрирован или не найден.`)

        process.exit()
      }

      this.baseDir = `Mods/${modData.exportsFolder}/Content`
    }
  }

  protected getSearchPattern(part: string) {
    return path.join(this.baseDir, part)
  }
}
