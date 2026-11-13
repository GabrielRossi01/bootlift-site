// Gerado por scripts/sync-engine.mjs a partir de bootlift@v1.0.1. Não edite.
import { detectProject } from './project'
import {
  computeScore,
  countBySeverity,
  runRules,
  sortFindings
} from './rules/engine'
import { checkProperties } from './rules/properties'
import { checkVersions } from './rules/versions'
import type { Finding, ProjectInfo, Severity, SourceFile } from './types'

export interface Analysis {
  project: ProjectInfo
  /** Todos os achados do repositório, ordenados por severidade, arquivo e linha. */
  findings: Finding[]
  /** Nota de 0 a 100 do repositório inteiro. */
  score: number
  counts: Record<Severity, number>
}

/** Junta as três famílias de regras sobre os arquivos lidos pelo scanner. */
export function analyze(files: SourceFile[]): Analysis {
  const project = detectProject(files)
  const findings = sortFindings([
    ...runRules(files),
    ...checkVersions(project),
    ...checkProperties(files)
  ])
  return {
    project,
    findings,
    score: computeScore(findings),
    counts: countBySeverity(findings)
  }
}
