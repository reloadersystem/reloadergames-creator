export const meta = {
  name: 'implementar-feature',
  description: 'Implementa una especificación aprobada → revisión de código → corrección → checklist de playtest',
  whenToUse: 'Trigger "reloader implementar <feature>". Solo con una especificación aprobada en context/features/.',
  phases: [
    { title: 'Implementación', detail: 'gameplay-engineer (y ui-ux-mobile si hay UI) escriben el código' },
    { title: 'Revisión', detail: 'activity revisar-codigo-unity sobre los archivos tocados' },
    { title: 'Corrección', detail: 'hasta 2 rondas para hallazgos críticos/altos' },
    { title: 'Playtest', detail: 'qa-performance prepara checklist y pruebas' },
  ],
}

// args: "ai-orchestrator/context/features/<slug>.md"  |  { spec: string (ruta o texto), conUI?: boolean }
const input = typeof args === 'string' ? { spec: args } : (args || {})
if (!input.spec) throw new Error('implementar-feature: falta args.spec (ruta en context/features/ o texto de la especificación)')

const CAMBIOS = {
  type: 'object',
  properties: {
    archivos: { type: 'array', items: { type: 'string' }, description: 'rutas creadas o modificadas' },
    pasosEnEditor: { type: 'array', items: { type: 'string' } },
    notas: { type: 'string' },
  },
  required: ['archivos'],
}

// ---------- Implementación (secuencial: evita que dos agentes pisen los mismos archivos) ----------
phase('Implementación')
const core = await agent(
  `Implementá la especificación aprobada: ${input.spec}
Trabajá en la ruta base activa del juego (ai-orchestrator/context/ENVIRONMENTS.md).
Hacé SOLO tus tareas del "Plan técnico" (Core, Gameplay, AI, Input, datos), en el orden indicado.
Reglas de Core con prueba EditMode. No edites .unity/.prefab/.asset a mano: listá los pasos en el editor.
No ejecutes builds ni instales paquetes.`,
  { agentType: 'gameplay-engineer', schema: CAMBIOS, phase: 'Implementación', label: 'implementar:gameplay' },
)
if (!core) throw new Error('implementar-feature: la implementación de gameplay no terminó')

let ui = null
if (input.conUI !== false) {
  ui = await agent(
    `Implementá las tareas de UI/HUD/controles de la especificación: ${input.spec}
El gameplay ya está implementado en: ${core.archivos.join(', ')}. Usá sus eventos; no cambies su lógica.
Si la especificación no tiene tareas de UI, devolvé archivos vacíos.`,
    { agentType: 'ui-ux-mobile', schema: CAMBIOS, phase: 'Implementación', label: 'implementar:ui' },
  )
}
const archivos = [...core.archivos, ...((ui && ui.archivos) || [])]
log(`Implementación: ${archivos.length} archivos`)

// ---------- Revisión + corrección (hasta 2 rondas) ----------
let revision = null
for (let ronda = 1; ronda <= 2; ronda++) {
  phase('Revisión')
  revision = await workflow(
    { scriptPath: 'ai-orchestrator/activities/revisar-codigo-unity.js' },
    { archivos, conReporte: false },
  )
  const graves = revision.hallazgos.filter(h => h.severidad === 'critica' || h.severidad === 'alta')
  log(`Revisión ronda ${ronda}: ${revision.hallazgos.length} hallazgos (${graves.length} graves)`)
  if (!graves.length) break

  phase('Corrección')
  await agent(
    `Corregí estos hallazgos confirmados sin cambiar el comportamiento especificado:\n${JSON.stringify(graves, null, 2)}`,
    { agentType: 'gameplay-engineer', phase: 'Corrección', label: `corregir:ronda${ronda}` },
  )
}

// ---------- Playtest ----------
phase('Playtest')
const playtest = await agent(
  `Prepará el playtest de la feature ${input.spec}:
1. Escribí o completá las pruebas EditMode/PlayMode que falten para sus reglas de Core.
2. Devolvé un checklist en Markdown basado en ai-orchestrator/templates/PLAYTEST_REPORT.md con sus criterios de aceptación,
   los pasos para probar en el editor y en el emulador, y qué medir de rendimiento.
Archivos de la feature: ${archivos.join(', ')}`,
  { agentType: 'qa-performance', phase: 'Playtest', label: 'playtest' },
)

return {
  archivos,
  pasosEnEditor: [...(core.pasosEnEditor || []), ...((ui && ui.pasosEnEditor) || [])],
  hallazgosPendientes: revision ? revision.hallazgos : [],
  playtest,
}
