import { BaseModel, column } from '@adonisjs/lucid/orm'

export class RecipeModel extends BaseModel {
  static table = 'recipes'

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
  declare isAlt: boolean

  @column()
  declare manufacturerId: number

  @column()
  declare manufacturingDuration: number

  @column()
  declare energyConsumption: number | null
}
