/**
 * Плюрализация — это придание чему-либо характера множественности, разнообразия на основе принципов плюрализма.
 *
 * Определение правильного окончания для слова в зависимости от численности
 *
 * @param count численность
 * @param variants варианты слова [1, 2, 5]
 *
 * @returns
 */
export function pluralize(count: number, variants: [string, string, string]) {
  const CASES = [2, 0, 1, 1, 1, 2]
  const index = (count % 100 > 4 && count % 100 < 20)
    ? 2
    : CASES[Math.min(count % 10, 5)]

  return variants[index]
}
