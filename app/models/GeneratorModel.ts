import { column } from '@adonisjs/lucid/orm'

import { BuildingModel } from '#models/abstracts'

export class GeneratorModel extends BuildingModel {
  @column()
  declare power: number
}
