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
| `reloader retomar` | chequeo de salud solo lectura: máquina, repos, backend, cuentas |
| `reloader feature <idea>` | diseña y planifica una feature con todos los roles → especificación para aprobar |
| `reloader implementar <feature>` | implementa una especificación aprobada, la revisa y prepara el playtest |
| `reloader revision [alcance]` | revisión de código + rendimiento + licencias |
| `reloader cierre` | ritual de cierre de feature antes del commit (incluye % de avance) |
| `reloader gdd` | trabajar el documento de diseño del juego |
| `reloader mentor on/off` | explicaciones de aprendizaje en cada cambio |
| `reloader build android/ios` | verificar configuración y preparar el build |

## Estructura
```
CLAUDE.md / AGENTS.md         entrada (Claude Code / cualquier otra IA)
.claude/agents/               roles del estudio (subagentes)
ai-orchestrator/
├── MASTER_PROMPT.md          rol, capas, flujo de decisión, triggers, prohibiciones
├── BOOTSTRAP.md              inicialización
├── knowledge/                arquitectura, patrones, convenciones, modelo operativo, roles, presupuestos
├── domains/                  Unity/URP, UI móvil, Android, iOS, Blender, multijugador, licencias, referencia
├── context/                  estado y % por sistema, máquinas, GDD, roadmap, ADR, assets,
│                             features (lo planeado), mecanicas-validadas (lo jugado), flujos-sistema
├── templates/                especificación de feature, ADR, reporte de playtest
├── flows/                    procedimientos .md: setup del proyecto, cierre de feature, cierre de hito (+ reservados)
├── skills/                   recetas .md atómicas (reservadas, se llenan con el uso)
├── scripts/                  comandos que ejecuta el usuario (reservados)
├── workflows/                automatizados .js: planificar-feature, implementar-feature, revision-calidad
└── activities/               automatizados .js: disenar-mecanica, revisar-codigo-unity, auditar-rendimiento, verificar-licencias
```

Los archivos vacíos son **capas reservadas**: indican dónde va ese conocimiento para que el orquestador lo ubique y lo complete a medida que el proyecto avanza.

## El equipo
Game Designer · Gameplay Engineer · Technical Artist · Level Designer · UI/UX Mobile · Network Engineer · Backend Engineer · QA & Performance · Build & Release · Asset & IP Guardian — coordinados por el orquestador (productor/director técnico). Detalle en `ai-orchestrator/knowledge/ROLES.md`.

## Ecosistema
El orquestador es el agente **Game** del ecosistema Reloader, bajo el Team Leader `ReloaderCore`, junto a ReloaderDB, REST, Microservicios y Mobile. Reutiliza los servicios de datos existentes (cuentas, personajes, catálogo) y pide cambios de backend al Team Leader; nunca modifica repos de otros agentes.

## Principios
- Diseño antes que código; prototipo gris antes que arte.
- Reglas del juego en C# puro + input como intents → listo para un servidor autoritativo.
- Datos en ScriptableObjects, composición sobre herencia, desacople por eventos.
- Mobile-first con presupuestos de rendimiento medidos.
- Solo assets propios o con licencia comercial registrada.
- El repo del juego nunca contiene archivos de IA.
