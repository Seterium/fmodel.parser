import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RecipeModel extends BaseModel {
  table = 'recipes'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare className: string

  @column()
  declare name: string

  @column()
  declare nameLocale: string

  @column()
  declare manufacturerId: number

  @column()
  declare manufacturingDuration: number

  @column()
  declare energyConsumption: number | null
}
