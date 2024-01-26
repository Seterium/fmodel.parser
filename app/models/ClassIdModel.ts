import { BaseModel, column } from '@adonisjs/lucid/orm'

export class ClassIdModel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare class: string
}
