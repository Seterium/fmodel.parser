import { BaseModel, column } from '@adonisjs/lucid/orm'

export abstract class IngameObjectModel extends BaseModel {
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
}
