import type { WorkspaceSettings } from '../types'

export type MergePresetId = 'java' | 'javascript' | 'docs'
  | 'react'
  | 'node'
  | 'python'
  | 'csharp'
  | 'php'
  | 'go'
  | 'rust'
  | 'kotlin'
  | 'swift'
  | 'ruby'
  | 'devops'

export type MergePresetDefinition = {
  id: MergePresetId
  label: string
  settingsPatch: Partial<WorkspaceSettings>
}

export const MERGE_PRESETS: MergePresetDefinition[] = [
  {
    id: 'java',
    label: 'Java',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.java', '.kt', '.kts', '.xml', '.properties', '.yml', '.yaml', '.sql'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-java.txt',
      zipOutput: false,
    },
  },
  {
    id: 'javascript',
    label: 'JavaScript / TypeScript',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.css', '.scss', '.html'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-web.txt',
      zipOutput: false,
    },
  },
  {
    id: 'react',
    label: 'React Frontend',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.html', '.json'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-react.txt',
      zipOutput: false,
    },
  },
  {
    id: 'node',
    label: 'Node.js Backend',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.ts', '.js', '.mjs', '.cjs', '.json', '.graphql', '.gql', '.env'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-node.txt',
      zipOutput: false,
    },
  },
  {
    id: 'python',
    label: 'Python',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.py', '.pyi', '.ipynb', '.toml', '.yaml', '.yml', '.ini', '.cfg'],
      addSeparators: true,
      separatorTemplate: '# --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-python.txt',
      zipOutput: false,
    },
  },
  {
    id: 'csharp',
    label: 'C# / .NET',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.cs', '.csproj', '.sln', '.props', '.targets', '.json', '.xml', '.config'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-dotnet.txt',
      zipOutput: false,
    },
  },
  {
    id: 'php',
    label: 'PHP',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.php', '.phtml', '.inc', '.json', '.yaml', '.yml', '.twig'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-php.txt',
      zipOutput: false,
    },
  },
  {
    id: 'go',
    label: 'Go',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.go', '.mod', '.sum', '.yaml', '.yml', '.json', '.sql'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-go.txt',
      zipOutput: false,
    },
  },
  {
    id: 'rust',
    label: 'Rust',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.rs', '.toml', '.lock', '.md'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-rust.txt',
      zipOutput: false,
    },
  },
  {
    id: 'kotlin',
    label: 'Kotlin / Android',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.kt', '.kts', '.gradle', '.properties', '.xml', '.yaml', '.yml'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-kotlin.txt',
      zipOutput: false,
    },
  },
  {
    id: 'swift',
    label: 'Swift / iOS',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.swift', '.plist', '.xcconfig', '.strings', '.json', '.yml'],
      addSeparators: true,
      separatorTemplate: '// --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-swift.txt',
      zipOutput: false,
    },
  },
  {
    id: 'ruby',
    label: 'Ruby / Rails',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.rb', '.rake', '.gemspec', '.ru', '.erb', '.yml', '.yaml'],
      addSeparators: true,
      separatorTemplate: '# --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-ruby.txt',
      zipOutput: false,
    },
  },
  {
    id: 'devops',
    label: 'DevOps / IaC',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.yml', '.yaml', '.tf', '.tfvars', '.hcl', '.json', '.sh', '.ps1'],
      addSeparators: true,
      separatorTemplate: '# --- {{path}} ---',
      newline: '\n',
      outputFileName: 'merged-infra.txt',
      zipOutput: false,
    },
  },
  {
    id: 'docs',
    label: 'Docs / Markdown',
    settingsPatch: {
      includeAllExts: false,
      includeExts: ['.md', '.mdx', '.txt', '.rst', '.adoc', '.html'],
      addSeparators: true,
      separatorTemplate: '<!-- --- {{path}} --- -->',
      newline: '\n',
      outputFileName: 'merged-docs.txt',
      zipOutput: false,
    },
  },
]

function normalizeExtensionList(list: string[]) {
  return [...list].map((value) => value.trim().toLowerCase()).sort()
}

function equalExtensions(left: string[], right: string[]) {
  const a = normalizeExtensionList(left)
  const b = normalizeExtensionList(right)
  if (a.length !== b.length) return false
  return a.every((value, index) => value === b[index])
}

export function resolvePresetId(settings: WorkspaceSettings): MergePresetId | 'custom' {
  for (const preset of MERGE_PRESETS) {
    const patch = preset.settingsPatch
    if ((patch.includeAllExts ?? settings.includeAllExts) !== settings.includeAllExts) continue
    if ((patch.addSeparators ?? settings.addSeparators) !== settings.addSeparators) continue
    if ((patch.separatorTemplate ?? settings.separatorTemplate) !== settings.separatorTemplate) continue
    if ((patch.newline ?? settings.newline) !== settings.newline) continue
    if ((patch.outputFileName ?? settings.outputFileName) !== settings.outputFileName) continue
    if ((patch.zipOutput ?? settings.zipOutput) !== settings.zipOutput) continue

    const presetExts = patch.includeExts ?? settings.includeExts
    if (!equalExtensions(presetExts, settings.includeExts)) continue
    return preset.id
  }

  return 'custom'
}

export function getPresetById(id: MergePresetId) {
  return MERGE_PRESETS.find((preset) => preset.id === id)
}
