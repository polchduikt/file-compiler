export function createId(prefix: string) {
  try {
    return `${prefix}_${crypto.randomUUID()}`
  } catch {
    return `${prefix}_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`
  }
}
