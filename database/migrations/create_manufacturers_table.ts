import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'manufacturers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').notNullable()
      table.integer('mod_id').nullable()
      table.string('icon').notNullable()
      table.string('name').notNullable()
      table.string('name_locale').notNullable()
      table.text('description').notNullable()
      table.string('description_locale').notNullable()
      table.float('energy_consumption').nullable()
      table.float('energy_consumption_exponent').notNullable()
      table.integer('parent_class_id').nullable()
      table.float('manufacturing_multiplier').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
