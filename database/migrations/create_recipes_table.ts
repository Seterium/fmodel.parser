import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('class_name').notNullable()
      table.integer('class_id').notNullable()
      table.string('name').notNullable()
      table.string('name_locale').notNullable()
      table.integer('manufacturer_id').notNullable()
      table.float('manufacturing_duration').notNullable()
      table.float('energy_consumption').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
