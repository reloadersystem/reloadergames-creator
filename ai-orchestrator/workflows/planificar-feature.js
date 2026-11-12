export const meta = {
  name: 'planificar-feature',
  description: 'Diseño → plan técnico por rol → revisión de riesgos → especificación de feature para aprobar',
  whenToUse: 'Trigger "reloader feature <idea>". Para toda feature que cruce más de una disciplina.',
  phases: [
    { title: 'Diseño', detail: 'activity disenar-mecanica (game-designer)' },
    { title: 'Plan técnico', detail: 'cada rol relevante propone sus tareas' },
    { title: 'Riesgos', detail: 'qa-performance, network-engineer y asset-ip-guardian revisan el plan' },
    { title: 'Síntesis', detail: 'especificación final según templates/FEATURE_SPEC.md' },
  ],
}

// args: "idea"  |  { feature: string, contexto?: string }
const input = typeof args === 'string' ? { feature: args } : (args || {})
if (!input.feature) throw new Error('planificar-feature: falta args.feature')

// ---------- Fase 1: diseño (activity) ----------
phase('Diseño')
const spec = await workflow(
  { scriptPath: 'ai-orchestrator/activities/disenar-mecanica.js' },
  { mecanica: input.feature, contexto: input.contexto, conReporte: false },
)
log(`Diseño: ${spec.titulo}`)

// ---------- Fase 2: plan técnico por rol ----------
const PLAN = {
  type: 'object',
  properties: {
    aplica: { type: 'boolean', description: 'false si este rol no tiene trabajo en la feature' },
    tareas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          archivos: { type: 'array', items: { type: 'string' }, description: 'rutas según ARCHITECTURE.md' },
          patron: { type: 'string', description: 'patrón de DESIGN_PATTERNS.md' },
          detalle: { type: 'string' },
          pasosEnEditor: { type: 'string', description: 'lo que el usuario hace en el editor de Unity, si aplica' },
        },
        required: ['titulo', 'detalle'],
      },
    },
    necesitaDeOtrosRoles: { type: 'array', items: { type: 'string' } },
    riesgos: { type: 'array', items: { type: 'string' } },
  },
  required: ['aplica', 'tareas'],
}
const ROLES_PLAN = ['gameplay-engineer', 'technical-artist', 'ui-ux-mobile', 'level-designer']
const specTexto = JSON.stringify(spec, null, 2)

phase('Plan técnico')
// Barrera justificada: la revisión de riesgos y la síntesis necesitan TODOS los planes juntos.
const planes = (await parallel(ROLES_PLAN.map(rol => () =>
  agent(
    `Esta es la especificación aprobable de una feature:\n${specTexto}\n
Como ${rol}, proponé SOLO tus tareas para implementarla, respetando ai-orchestrator/knowledge/ARCHITECTURE.md
(ubicación y capas) y ai-orchestrator/knowledge/DESIGN_PATTERNS.md (patrón por tarea).
Si tu disciplina no tiene trabajo en esta feature, devolvé aplica = false y tareas vacías.
No escribas archivos.`,
    { agentType: rol, schema: PLAN, phase: 'Plan técnico', label: `plan:${rol}` },
  ).then(p => (p ? { rol, ...p } : null)),
))).filter(p => p && p.aplica)
log(`Plan técnico: ${planes.map(p => `${p.rol} (${p.tareas.length})`).join(', ') || 'ningún rol con tareas'}`)

// ---------- Fase 3: revisión de riesgos ----------
const REVIEW = {
  type: 'object',
  properties: {
    riesgos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          riesgo: { type: 'string' },
          impacto: { type: 'string', enum: ['alto', 'medio', 'bajo'] },
          mitigacion: { type: 'string' },
        },
        required: ['riesgo', 'impacto', 'mitigacion'],
      },
    },
    bloqueante: { type: 'boolean' },
  },
  required: ['riesgos', 'bloqueante'],
}
const planTexto = JSON.stringify(planes, null, 2)
const REVISORES = [
  { rol: 'qa-performance', foco: 'testabilidad, criterios de aceptación medibles, presupuestos de PERFORMANCE_BUDGETS.md, anti-patrones' },
  { rol: 'network-engineer', foco: 'preparación para online: reglas en Core, intents, nada que decida el cliente que deba decidir el servidor' },
  { rol: 'asset-ip-guardian', foco: 'assets externos que el plan necesita: licencias, registro, riesgo de usar material de terceros' },
]

phase('Riesgos')
const revisiones = (await parallel(REVISORES.map(r => () =>
  agent(
    `Especificación:\n${specTexto}\n\nPlan técnico por rol:\n${planTexto}\n
Revisá el plan desde tu foco: ${r.foco}. Marcá bloqueante = true solo si el plan no debe aprobarse así.`,
    { agentType: r.rol, schema: REVIEW, phase: 'Riesgos', label: `riesgos:${r.rol}` },
  ).then(v => (v ? { rol: r.rol, ...v } : null)),
))).filter(Boolean)

// ---------- Fase 4: síntesis ----------
phase('Síntesis')
const documento = await agent(
  `Redactá la especificación final de la feature en Markdown siguiendo exactamente ai-orchestrator/templates/FEATURE_SPEC.md,
con Estado: propuesta. Integrá:
- Diseño: ${specTexto}
- Plan técnico por rol: ${planTexto}
- Revisiones de riesgo: ${JSON.stringify(revisiones, null, 2)}
En "Plan técnico" ordená las tareas en el orden en que conviene implementarlas (Core y datos primero, presentación después).
Si alguna revisión fue bloqueante, explicalo al inicio en un bloque "⚠️ Bloqueante".
No escribas archivos: devolvé solo el Markdown.`,
  { phase: 'Síntesis', label: 'síntesis' },
)

return {
  slug: spec.slug,
  titulo: spec.titulo,
  bloqueante: revisiones.some(r => r.bloqueante),
  preguntasAbiertas: spec.preguntasAbiertas || [],
  documento,
}
