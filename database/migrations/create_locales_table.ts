import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'locales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('lang').notNullable()
      table.string('key').notNullable()
      table.text('value').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
