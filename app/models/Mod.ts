import { BaseModel, column } from '@adonisjs/lucid/orm'

export class Mod extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
}
