export const meta = {
  name: 'verificar-licencias',
  description: 'Audita assets externos contra ASSETS_REGISTRY.md y la política de propiedad intelectual',
  whenToUse: 'Al incorporar assets externos, antes de cerrar un hito y antes de cualquier publicación.',
  phases: [{ title: 'Licencias', detail: 'asset-ip-guardian recorre ThirdParty y Art/Audio' }],
}

// args: "alcance"  |  { alcance?: string, conReporte?: boolean }
const input = typeof args === 'string' ? { alcance: args } : (args || {})
const alcance = input.alcance || 'Assets/ThirdParty, Assets/_Project/Art y Assets/_Project/Audio del proyecto en la ruta base activa (ai-orchestrator/context/ENVIRONMENTS.md)'

const RESULT = {
  type: 'object',
  properties: {
    hallazgos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          ruta: { type: 'string' },
          severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
          problema: { type: 'string', description: 'sin registrar, sin LICENSE, licencia no comercial, posible material de otro juego, crédito faltante' },
          accion: { type: 'string' },
        },
        required: ['ruta', 'severidad', 'problema', 'accion'],
      },
    },
    registrados: { type: 'number' },
    sinRegistrar: { type: 'number' },
  },
  required: ['hallazgos'],
}

phase('Licencias')
const r = await agent(
  `Auditá ${alcance} aplicando ai-orchestrator/domains/assets-licencias.md.
Compará cada paquete/carpeta externa con ai-orchestrator/context/ASSETS_REGISTRY.md.
Buscá: carpetas sin LICENSE, assets no registrados, licencias NC o "uso personal", créditos CC-BY faltantes,
nombres o formatos que sugieran material extraído de juegos comerciales.
No modifiques archivos: solo reportá. Si el proyecto aún no existe o no hay assets externos, devolvé hallazgos vacíos.`,
  { agentType: 'asset-ip-guardian', schema: RESULT, phase: 'Licencias', label: 'licencias' },
)

const res = r || { hallazgos: [] }
if (input.conReporte !== false) log(`Licencias: ${res.hallazgos.length} hallazgos`)
return res
