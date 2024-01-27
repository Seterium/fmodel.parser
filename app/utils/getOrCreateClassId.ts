import { ClassIdModel } from '#models'

export async function getOrCreateClassId(className: string): Promise<number> {
  const classIdModel = await ClassIdModel.firstOrCreate(
    { class: className },
    { class: className },
  )

  return classIdModel.id
}
