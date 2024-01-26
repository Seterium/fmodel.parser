import { column } from '@adonisjs/lucid/orm'

import { BuildingModel } from '#models/abstracts'

export class GeneratorModel extends BuildingModel {
  @column()
  declare icon: string

  @column()
  declare power: number
}
