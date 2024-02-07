import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand, flags } from '@adonisjs/core/ace'

import modsConfig from '#config/mods'

import { ModsParser } from '#services'

import chalk from 'chalk'
import consola from 'consola'

export default class FMPMods extends BaseCommand {
  static commandName = 'fmp:mods'

  static description = `Парсинг игровых объектов из ${chalk.bold.cyanBright('модов')}`

  static options: CommandOptions = {}

  @flags.array<number[]>({
    allowEmptyValue: true,
    default: [],
    parse(input) {
      input.forEach((inputItem) => {
        if (typeof inputItem === 'string') {
          consola.fail(`Некорректный формат id - ${chalk.bold.yellowBright(inputItem)}`)

          process.exit()
        }
      })

      return input
    },
  })
  declare id: number[]

  @flags.boolean({
    default: false,
  })
  declare all: boolean

  async run() {
    const modsConfigIds = modsConfig.list.map(({ id }) => id)

    if (this.all === false) {
      if (this.id.length === 0) {
        consola.fail('Не указаны ID модификаций')

        return
      }

      this.validateModsIds(this.id, modsConfigIds)
    }

    const modsIds = this.all ? modsConfigIds : this.id

    for (const id of modsIds) {
      await (new ModsParser(id)).parse()
    }
  }

  private validateModsIds(inputIds: number[], modsConfigIds: number[]): void {
    const isValid = inputIds.every((el) => {
      const result = modsConfigIds.includes(el)

      if (result === false) {
        consola.fail(`Указан неизвестный ID модификации: ${chalk.bold.yellowBright(el)}`)
      }

      return result
    })

    if (isValid === false) {
      process.exit()
    }
  }
}
