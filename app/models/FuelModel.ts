import { BaseModel, column } from '@adonisjs/lucid/orm'

export class FuelModel extends BaseModel {
  static table = 'fuels'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare componentId: number

  @column()
  declare generatorClassId: number

  @column()
  declare energy: number

  @column()
  declare wasteComponentId: number | null

  @column()
  declare wasteAmount: number | null
}
