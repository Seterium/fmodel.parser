import { column } from '@adonisjs/lucid/orm'

import { BuildingModel } from '#models/abstracts'

export abstract class EnergyConsumerModel extends BuildingModel {
  @column()
  declare energyConsumption: number

  @column()
  declare energyConsumptionExponent: number
}
