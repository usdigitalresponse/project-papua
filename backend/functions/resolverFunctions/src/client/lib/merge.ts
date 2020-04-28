export function merge(...sources: Record<string, any>[]) {
  const result: Record<string, any> = {}
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (source[key]) {
        result[key] = source[key]
      }
    }
  }

  return result
}
