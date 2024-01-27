import { BaseModel, column } from '@adonisjs/lucid/orm'

export class ClassIdModel extends BaseModel {
  static table = 'classes_ids'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare class: string
}
