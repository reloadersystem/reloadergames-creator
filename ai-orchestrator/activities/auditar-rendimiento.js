export const meta = {
  name: 'auditar-rendimiento',
  description: 'Contrasta código, assets y ajustes del proyecto Unity contra los presupuestos de rendimiento móvil',
  whenToUse: 'Al cerrar una feature con arte o efectos, antes de un build de prueba o al cerrar un hito.',
  phases: [{ title: 'Auditar', detail: 'un auditor por área: scripts, assets, ajustes URP' }],
}

// args: "alcance"  |  { alcance?: string, perfil?: 'Mobile-Low'|'Mobile-High'|'PC', conReporte?: boolean }
const input = typeof args === 'string' ? { alcance: args } : (args || {})
const perfil = input.perfil || 'Mobile-High'
const alcance = input.alcance || 'todo Assets/_Project del proyecto en la ruta base activa (ai-orchestrator/context/ENVIRONMENTS.md)'

const FINDINGS = {
  type: 'object',
  properties: {
    hallazgos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          archivo: { type: 'string' },
          severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
          metrica: { type: 'string', description: 'qué presupuesto se excede o arriesga' },
          medido: { type: 'string' },
          presupuesto: { type: 'string' },
          sugerencia: { type: 'string' },
          verificarEnDispositivo: { type: 'boolean' },
        },
        required: ['archivo', 'severidad', 'metrica', 'sugerencia'],
      },
    },
  },
  required: ['hallazgos'],
}

const AREAS = [
  { key: 'scripts', rol: 'qa-performance', foco: 'scripts C#: asignaciones por frame, Update innecesarios, búsquedas en runtime, falta de pools, física y raycasts por frame' },
  { key: 'assets', rol: 'technical-artist', foco: 'import settings en los .meta: tamaño y compresión de texturas (ASTC), mipmaps, triángulos y LODs de modelos, cantidad de materiales, configuración de animaciones' },
  { key: 'ajustes', rol: 'technical-artist', foco: 'URP Assets y Quality settings: sombras, cascadas, MSAA, HDR, resolución de render, postprocesado, luces en tiempo real, Volumes' },
]

phase('Auditar')
const resultados = await parallel(AREAS.map(a => () =>
  agent(
    `Auditá ${alcance} en el área "${a.key}": ${a.foco}.
Compará contra ai-orchestrator/knowledge/PERFORMANCE_BUDGETS.md para el perfil ${perfil}.
Leé archivos de texto (.cs, .meta, .asset de configuración); no abras binarios.
Lo que solo se puede confirmar con el Profiler en dispositivo, marcalo verificarEnDispositivo = true.`,
    { agentType: a.rol, schema: FINDINGS, phase: 'Auditar', label: `rendimiento:${a.key}` },
  ).then(r => ((r && r.hallazgos) || []).map(h => ({ ...h, area: a.key }))),
))

const hallazgos = resultados.filter(Boolean).flat()
if (input.conReporte !== false) log(`Auditoría de rendimiento (${perfil}): ${hallazgos.length} hallazgos`)
return { perfil, alcance, hallazgos }
