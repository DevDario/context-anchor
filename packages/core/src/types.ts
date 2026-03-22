export interface ProjectContext {
  name: string
  stack: string[]
  principles: string[]
  conventions: string[]
  raw: string
}

export interface Decision {
  decision: string
  reason: string
  rejected?: string
}

export interface FeatureContext {
  name: string
  decisions: Decision[]
  constraints: string[]
  openQuestions: string[]
  state: {
    done: string[]
    pending: string[]
  }
  raw: string
}

export interface AnchoredContext {
  project: ProjectContext
  feature: FeatureContext | null
  mergedAt: string
}

export interface ContextPaths {
  root: string
  projectDoc: string
  featuresDir: string
  historyDir: string
}