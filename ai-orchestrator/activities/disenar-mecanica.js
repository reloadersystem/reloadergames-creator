export const meta = {
  name: 'disenar-mecanica',
  description: 'Convierte una idea en especificación de mecánica (reglas, parámetros, estados, criterios)',
  whenToUse: 'Antes de programar cualquier mecánica nueva. Standalone o desde planificar-feature.',
  phases: [{ title: 'Diseño', detail: 'game-designer redacta la especificación' }],
}

// args: "idea en texto"  |  { mecanica: string, contexto?: string, conReporte?: boolean }
const input = typeof args === 'string' ? { mecanica: args } : (args || {})
if (!input.mecanica) throw new Error('disenar-mecanica: falta args.mecanica (o un string con la idea)')

const SPEC = {
  type: 'object',
  properties: {
    titulo: { type: 'string' },
    slug: { type: 'string', description: 'kebab-case, sin tildes' },
    objetivoJugador: { type: 'string' },
    reglas: { type: 'array', items: { type: 'string' } },
    parametros: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          nombre: { type: 'string' },
          valorInicial: { type: 'string' },
          unidad: { type: 'string' },
          motivo: { type: 'string' },
        },
        required: ['nombre', 'valorInicial', 'motivo'],
      },
    },
    estados: { type: 'array', items: { type: 'string' } },
    casosBorde: { type: 'array', items: { type: 'string' } },
    controles: { type: 'string', description: 'cómo se juega en táctil y en teclado/gamepad' },
    criteriosAceptacion: { type: 'array', items: { type: 'string' } },
    fueraDeAlcance: { type: 'array', items: { type: 'string' } },
    preguntasAbiertas: { type: 'array', items: { type: 'string' } },
  },
  required: ['titulo', 'slug', 'objetivoJugador', 'reglas', 'parametros', 'criteriosAceptacion'],
}

phase('Diseño')
const spec = await agent(
  `Diseñá esta mecánica para nuestro juego: "${input.mecanica}".
${input.contexto ? `Contexto adicional del usuario: ${input.contexto}\n` : ''}
Leé antes ai-orchestrator/context/GAME_DESIGN.md y ai-orchestrator/context/ROADMAP.md para respetar visión y alcance del hito actual.
Seguí el formato de ai-orchestrator/templates/FEATURE_SPEC.md (secciones 1 a 5, 9, 10 y 11).
- Reglas numeradas y comprobables.
- Todo número es un parámetro de balance con valor inicial, unidad y motivo (irá a un ScriptableObject).
- Pensá primero en pantalla táctil; indicá también teclado/gamepad.
- Incluí casos borde (muerte durante la acción, objetivo que desaparece, recursos insuficientes, etc.).
- Lo que dependa de una decisión del usuario va a preguntasAbiertas.
- Todo original: nada de nombres o mecánicas firmadas de juegos existentes.
No escribas archivos: devolvé la especificación.`,
  { agentType: 'game-designer', schema: SPEC, phase: 'Diseño', label: 'diseño' },
)
if (!spec) throw new Error('disenar-mecanica: el game-designer no devolvió especificación')

if (input.conReporte !== false) log(`Especificación lista: ${spec.titulo} (${spec.reglas.length} reglas, ${spec.parametros.length} parámetros)`)
return spec
