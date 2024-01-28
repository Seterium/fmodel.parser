import { BaseModel, column } from '@adonisjs/lucid/orm'

export class ManufacturerModel extends BaseModel {
  static table = 'manufacturers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare modId: number | null

  @column()
  declare name: string

  @column()
  declare nameLocale: string

  @column()
  declare description: string

  @column()
  declare descriptionLocale: string

  @column()
  declare icon: string

  @column()
  declare energyConsumption: number

  @column()
  declare energyConsumptionExponent: number

  @column()
  declare parentId: number

  @column()
  declare manufacturingMultiplier: number
}
