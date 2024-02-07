import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generators'

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
      table.integer('parent_class_id').nullable()
      table.float('power').notNullable()
      table.integer('supplemental_component_id').nullable()
      table.float('supplemental_to_power_ratio').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
