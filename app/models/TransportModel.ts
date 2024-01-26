import { column } from '@adonisjs/lucid/orm'

import { BuildingModel } from '#models/abstracts'

export class TransportModel extends BuildingModel {
  @column()
  declare isPipe: boolean

  @column()
  declare throughput: number
}
