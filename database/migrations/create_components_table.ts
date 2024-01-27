import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'components'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('class_id').notNullable()
      table.integer('category_id').notNullable()
      table.string('icon').notNullable()
      table.string('name').notNullable()
      table.string('name_locale').notNullable()
      table.string('description').notNullable()
      table.string('description_locale').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
