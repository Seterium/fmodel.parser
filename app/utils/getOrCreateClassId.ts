import { ClassIdModel } from '#models'

import { normalizeClassName } from '#utils'

export async function getOrCreateClassId(className: string): Promise<number> {
  const normalizedClassName = normalizeClassName(className)

  const classIdModel = await ClassIdModel.firstOrCreate(
    { class: normalizedClassName },
    { class: normalizedClassName },
  )

  return classIdModel.id
}
