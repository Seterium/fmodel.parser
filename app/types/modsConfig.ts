export interface ModsConfig {
  list: ModsConfig.ListItem[]
}

export namespace ModsConfig {
  export interface ListItem {
    id: number

    smrId: string

    slug: string

    name: string

    exportsFolder: string
  }
}
