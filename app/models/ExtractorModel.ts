import { column } from '@adonisjs/lucid/orm'

import { BuildingModel } from '#models/abstracts'

export class ExtractorModel extends BuildingModel {
  @column()
  declare icon: string

  @column()
  declare extractionRate: number
}
