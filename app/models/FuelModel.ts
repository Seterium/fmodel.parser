import { BaseModel, column } from '@adonisjs/lucid/orm'

export class FuelModel extends BaseModel {
  table = 'fuels'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare componentId: number

  @column()
  declare generatorId: number

  @column()
  declare energy: number
}
