# Reloader Games Creator

Orquestador de IA para **desarrollo de juegos**: un estudio virtual con roles especializados, arquitectura de juego, patrones de diseño, flujos de trabajo ejecutables y estado vivo del proyecto.

Pensado para Claude Code y un juego en **Unity 6 + URP (C#)** con destino **Android e iOS**.

## Cómo se usa
1. Abrir Claude Code en esta carpeta (lee `CLAUDE.md` automáticamente).
2. Escribir `reloader sesion` → modo orquestador activo, con la ruta del juego según la máquina (`ai-orchestrator/context/ENVIRONMENTS.md`).
3. Trabajar con los triggers:

| Trigger | Qué hace |
|---|---|
| `reloader sesion` | activa el orquestador |
| `reloader estado` | hito actual, avance y próximo paso |
| `reloader feature <idea>` | diseña y planifica una feature con todos los roles → especificación para aprobar |
| `reloader implementar <feature>` | implementa una especificación aprobada, la revisa y prepara el playtest |
| `reloader revision [alcance]` | revisión de código + rendimiento + licencias |
| `reloader gdd` | trabajar el documento de diseño del juego |
| `reloader mentor on/off` | explicaciones de aprendizaje en cada cambio |
| `reloader build android/ios` | verificar configuración y preparar el build |

## Estructura
```
CLAUDE.md                     entrada
.claude/agents/               roles del estudio (subagentes)
ai-orchestrator/
├── MASTER_PROMPT.md          rol, flujo de decisión, triggers, prohibiciones
├── BOOTSTRAP.md              inicialización
├── knowledge/                arquitectura, patrones, convenciones, modelo operativo, roles, presupuestos
├── domains/                  Unity/URP, UI móvil, Android, iOS, Blender, multijugador, licencias, referencia
├── context/                  estado, máquinas, GDD, roadmap, decisiones (ADR), registro de assets, features
├── templates/                especificación de feature, ADR, reporte de playtest
├── workflows/                flows: planificar-feature, implementar-feature, revision-calidad
└── activities/               activities: disenar-mecanica, revisar-codigo-unity, auditar-rendimiento, verificar-licencias
```

## El equipo
Game Designer · Gameplay Engineer · Technical Artist · Level Designer · UI/UX Mobile · Network Engineer · QA & Performance · Build & Release · Asset & IP Guardian — coordinados por el orquestador (productor/director técnico). Detalle en `ai-orchestrator/knowledge/ROLES.md`.

## Principios
- Diseño antes que código; prototipo gris antes que arte.
- Reglas del juego en C# puro + input como intents → listo para un servidor autoritativo.
- Datos en ScriptableObjects, composición sobre herencia, desacople por eventos.
- Mobile-first con presupuestos de rendimiento medidos.
- Solo assets propios o con licencia comercial registrada.
- El repo del juego nunca contiene archivos de IA.
