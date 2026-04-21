const WORKSPACE_NAME_RE = /^workspace\s+(\d+)$/i

export function localizeWorkspaceName(name: string, prefix: string) {
  const match = name.trim().match(WORKSPACE_NAME_RE)
  if (!match) return name
  return `${prefix} ${match[1]}`
}
