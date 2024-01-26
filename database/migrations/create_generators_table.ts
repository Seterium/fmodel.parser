import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'generators'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').notNullable()
      table.string('class_name').notNullable()
      table.string('name').notNullable()
      table.string('name_locale').notNullable()
      table.string('description').notNullable()
      table.string('description_locale').notNullable()
      table.integer('recipe_id').notNullable()
      table.float('power').notNullable()
      table.string('icon').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
