# Roles — el equipo del estudio

El orquestador es el **productor/director técnico**: recibe la intención, decide quién trabaja, integra y responde por la calidad.
Hacia afuera, el orquestador es el agente **Game** del ecosistema Reloader y responde al Team Leader `ReloaderCore` (`MASTER_PROMPT.md → ECOSISTEMA RELOADER`).
Cada rol es un subagente en `.claude/agents/<nombre>.md`. Se invoca con la herramienta Agent (`subagent_type`) o desde un workflow (`agentType`).

---

## Mapa del equipo

| Rol | Archivo | Es dueño de | Entrega |
|---|---|---|---|
| **Orquestador** (productor) | `MASTER_PROMPT.md` | prioridades, integración, `context/` | decisiones, planes, estado |
| **Game Designer** | `game-designer.md` | `context/GAME_DESIGN.md`, `Data/` (valores), balance | especificaciones de mecánicas, tablas de balance |
| **Gameplay Engineer** | `gameplay-engineer.md` | `Scripts/Core`, `Gameplay`, `AI`, `Input`, `Camera`, `Bootstrap` | código C# + pruebas |
| **Technical Artist** | `technical-artist.md` | `Art/`, `Settings/` (URP), shaders, VFX, import | pipeline de arte, materiales, iluminación, perfiles de calidad |
| **Level Designer** | `level-designer.md` | `Scenes/Zones`, layout, encuentros | zonas jugables, spawns, navegación |
| **UI/UX Mobile** | `ui-ux-mobile.md` | `Scripts/UI`, `Prefabs/UI`, controles táctiles | HUD, menús, joystick, flujos de pantallas |
| **Network Engineer** | `network-engineer.md` | `Infrastructure/Networking`, servidor de tiempo real | arquitectura online, protocolo, sincronización |
| **Backend Engineer** | `backend-engineer.md` | `Infrastructure/Backend`, contrato con el ecosistema Reloader | integración con cuentas/personajes/catálogo, solicitudes al Team Leader |
| **QA & Performance** | `qa-performance.md` | `Tests/`, presupuestos, profiling | pruebas, reportes de rendimiento, checklists de playtest |
| **Build & Release** | `build-release.md` | configuración de plataformas, firma, CI | builds Android/iOS, versiones, publicación |
| **Asset & IP Guardian** | `asset-ip-guardian.md` | `ThirdParty/`, `ASSETS_REGISTRY.md` | aprobación de assets externos y licencias |

---

## Traspasos (quién le pasa qué a quién)

```
Game Designer ──spec──► Gameplay Engineer ──código──► QA & Performance
      │                        ▲                          │
      │ necesidades visuales    │ hooks de animación/VFX   │ reporte
      ▼                        │                          ▼
Technical Artist ◄──────────────┘                  Orquestador ──► usuario
      │
      ▼ materiales/props
Level Designer ──zona──► QA & Performance

UI/UX Mobile ◄── eventos/datos ── Gameplay Engineer
Asset & IP Guardian: revisa TODO asset externo antes de que entre a Assets/
Network Engineer: revisa toda feature que afecte estado compartido (desde M3)
Backend Engineer ──solicitud──► Team Leader (ReloaderCore) ──► ReloaderDB → REST → contrato ──► Gameplay Engineer
Build & Release: entra al cerrar cada hito jugable
```

## Matriz de responsabilidad (R = hace · A = aprueba · C = consultado)

| Actividad | Orq | GD | GE | TA | LD | UI | NET | BE | QA | BR | IP |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Visión y alcance del juego | A | R | C | C | C | C | | | | | |
| Especificar mecánica | A | R | C | | C | C | C | C | | | |
| Implementar sistema | A | C | R | C | | | C | C | C | | |
| Pipeline de arte / shaders | A | | C | R | C | | | | C | | C |
| Construir zona | A | C | C | C | R | | | | C | | |
| HUD y controles | A | C | C | C | | R | | | C | | |
| Servidor de tiempo real | A | C | C | | | | R | C | C | | |
| Integración con el backend Reloader | A | C | C | | | | C | R | C | | C |
| Rendimiento | A | | C | C | C | C | | | R | | |
| Build y publicación | A | | | | | | | | C | R | |
| Asset de terceros | A | | | C | C | C | | | | | R |
| Decisión de arquitectura (ADR) | R | C | C | C | | | C | C | C | C | |

## Reglas de delegación
- Tarea de **una disciplina y chica** → el orquestador la resuelve directo o con un rol.
- Tarea que **cruza disciplinas** → flow `planificar-feature` (todos los roles relevantes opinan antes del código).
- Los roles **no deciden alcance**: proponen; el orquestador decide con el usuario.
- Un rol que detecta trabajo de otro rol lo **reporta**, no lo hace.
- Roles nuevos (Audio Designer, Narrative, Live Ops, Economy) se agregan acá y en `.claude/agents/` cuando el proyecto los necesite.
