export function merge<T>(...sources: Record<string, T>[]) {
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
