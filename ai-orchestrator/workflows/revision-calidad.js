export const meta = {
  name: 'revision-calidad',
  description: 'Revisión integral: código, rendimiento y licencias en paralelo, con resumen priorizado',
  whenToUse: 'Trigger "reloader revision [alcance]". Antes de merge a develop/main o al cerrar un hito.',
  phases: [
    { title: 'Revisiones', detail: 'revisar-codigo-unity + auditar-rendimiento + verificar-licencias' },
    { title: 'Resumen', detail: 'priorización y plan de acción' },
  ],
}

// args: "alcance"  |  { alcance?: string, perfil?: string }
const input = typeof args === 'string' ? { alcance: args } : (args || {})

phase('Revisiones')
// Barrera justificada: el resumen prioriza cruzando las tres revisiones.
const [codigo, rendimiento, licencias] = await parallel([
  () => workflow({ scriptPath: 'ai-orchestrator/activities/revisar-codigo-unity.js' }, { alcance: input.alcance, conReporte: false }),
  () => workflow({ scriptPath: 'ai-orchestrator/activities/auditar-rendimiento.js' }, { alcance: input.alcance, perfil: input.perfil, conReporte: false }),
  () => workflow({ scriptPath: 'ai-orchestrator/activities/verificar-licencias.js' }, { conReporte: false }),
])

const total = {
  codigo: (codigo && codigo.hallazgos) || [],
  rendimiento: (rendimiento && rendimiento.hallazgos) || [],
  licencias: (licencias && licencias.hallazgos) || [],
}
const fallidas = ['codigo', 'rendimiento', 'licencias'].filter((k, i) => ![codigo, rendimiento, licencias][i])
if (fallidas.length) log(`Atención: no terminaron las revisiones de ${fallidas.join(', ')} (no se incluyen)`)
log(`Hallazgos — código: ${total.codigo.length}, rendimiento: ${total.rendimiento.length}, licencias: ${total.licencias.length}`)

phase('Resumen')
const resumen = await agent(
  `Con estos hallazgos de revisión de un proyecto Unity móvil, armá un resumen en Markdown para el usuario (en español):
1. Veredicto: ¿se puede mergear / cerrar el hito? (sí / sí con condiciones / no)
2. Tabla priorizada (crítica → baja) con: área, archivo, problema, acción.
3. Los 3 primeros pasos recomendados.
Hallazgos: ${JSON.stringify(total, null, 2)}
${fallidas.length ? `Revisiones que no terminaron (mencionarlo): ${fallidas.join(', ')}` : ''}`,
  { phase: 'Resumen', label: 'resumen', effort: 'low' },
)

return { ...total, revisionesFallidas: fallidas, resumen }
