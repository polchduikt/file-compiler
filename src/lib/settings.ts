export function normalizeExtensionListInput(input: string) {
  return input
    .split(/[,;\s]+/g)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => (value.startsWith('.') ? value.toLowerCase() : `.${value.toLowerCase()}`))
}
