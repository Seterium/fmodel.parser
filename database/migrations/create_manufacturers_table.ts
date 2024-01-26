import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'manufacturers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('class_name').notNullable()
      table.integer('class_id').notNullable()
      table.string('name').notNullable()
      table.string('name_locale').notNullable()
      table.string('description').notNullable()
      table.string('description_locale').notNullable()
      table.integer('recipe_id').notNullable()
      table.float('energy_consumption').notNullable()
      table.float('energy_consumption_exponent').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
