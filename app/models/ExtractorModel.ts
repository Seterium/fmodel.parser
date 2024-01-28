import { BaseModel, column } from '@adonisjs/lucid/orm'

export class ExtractorModel extends BaseModel {
  static table = 'extractors'

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
  declare recipeId: number

  @column()
  declare icon: string

  @column()
  declare energyConsumption: number

  @column()
  declare energyConsumptionExponent: number

  @column()
  declare extractionRate: number
}
