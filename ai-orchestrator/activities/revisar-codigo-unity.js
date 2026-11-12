export const meta = {
  name: 'revisar-codigo-unity',
  description: 'Revisa código C#/Unity por dimensiones y verifica cada hallazgo antes de reportarlo',
  whenToUse: 'Después de implementar algo o antes de un commit/merge. Standalone o desde revision-calidad / implementar-feature.',
  phases: [
    { title: 'Buscar', detail: 'un revisor por dimensión' },
    { title: 'Verificar', detail: 'un escéptico intenta refutar cada hallazgo' },
  ],
}

// args: "ruta o descripción del alcance"  |  { alcance: string, archivos?: string[], conReporte?: boolean }
const input = typeof args === 'string' ? { alcance: args } : (args || {})
const alcance = input.archivos && input.archivos.length
  ? `estos archivos: ${input.archivos.join(', ')}`
  : (input.alcance || 'los cambios sin commitear del repo del juego (git status / git diff en la ruta base activa de ai-orchestrator/context/ENVIRONMENTS.md)')

const FINDINGS = {
  type: 'object',
  properties: {
    hallazgos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          archivo: { type: 'string' },
          linea: { type: 'number' },
          severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
          problema: { type: 'string' },
          porQueImporta: { type: 'string' },
          sugerencia: { type: 'string' },
        },
        required: ['archivo', 'severidad', 'problema', 'porQueImporta', 'sugerencia'],
      },
    },
  },
  required: ['hallazgos'],
}
const VERDICT = {
  type: 'object',
  properties: { refutado: { type: 'boolean' }, razon: { type: 'string' } },
  required: ['refutado', 'razon'],
}

const DIMENSIONES = [
  { key: 'arquitectura', rol: 'gameplay-engineer', foco: 'capas y dependencias (Core puro sin UnityEngine, flechas solo hacia abajo, asmdef), ubicación según ai-orchestrator/knowledge/ARCHITECTURE.md, input como intents, balance en datos y no hardcodeado' },
  { key: 'bugs', rol: 'qa-performance', foco: 'bugs reales: ciclo de vida de MonoBehaviour, eventos sin desuscribir en OnDisable, nulos tras Destroy, estados inconsistentes, casos borde de la mecánica, condiciones de carrera con corrutinas' },
  { key: 'rendimiento', rol: 'qa-performance', foco: 'asignaciones por frame (new, LINQ, strings, closures en Update), GetComponent/Find en runtime, Instantiate/Destroy en ráfagas sin pool, física innecesaria, contra ai-orchestrator/knowledge/PERFORMANCE_BUDGETS.md' },
  { key: 'patrones', rol: 'gameplay-engineer', foco: 'anti-patrones prohibidos de ai-orchestrator/knowledge/DESIGN_PATTERNS.md, convenciones de ai-orchestrator/knowledge/CONVENTIONS.md, reglas de Core sin prueba EditMode' },
]

const resultados = await pipeline(
  DIMENSIONES,
  d => agent(
    `Revisá ${alcance} en la dimensión "${d.key}": ${d.foco}.
Reportá solo problemas concretos con archivo y línea. Nada de estilo subjetivo. Si no hay problemas, devolvé una lista vacía.`,
    { agentType: d.rol, schema: FINDINGS, phase: 'Buscar', label: `buscar:${d.key}` },
  ),
  (r, d) => parallel(((r && r.hallazgos) || []).map(h => () =>
    agent(
      `Intentá REFUTAR este hallazgo de revisión de código Unity. Leé el archivo y su contexto.
Hallazgo (${d.key}, ${h.severidad}): ${h.archivo}${h.linea ? ':' + h.linea : ''} — ${h.problema}
Razón dada: ${h.porQueImporta}
Refutado = true si es falso, ya está manejado en otro lugar, o es solo una preferencia. Ante la duda razonable, refutado = true.`,
      { schema: VERDICT, phase: 'Verificar', label: `verificar:${d.key}`, effort: 'low' },
    ).then(v => (v && !v.refutado ? { ...h, dimension: d.key } : null)),
  )),
)

const confirmados = resultados.flat().filter(Boolean)
const orden = { critica: 0, alta: 1, media: 2, baja: 3 }
confirmados.sort((a, b) => orden[a.severidad] - orden[b.severidad])
if (input.conReporte !== false) log(`Revisión de código: ${confirmados.length} hallazgos confirmados`)
return { alcance, hallazgos: confirmados }
