# PROJECT CONTEXT — Estado del proyecto

## Base

| | Estado |
|---|---|
| Orquestador | `ReloaderGamesCreator` creado 2026-11-11 (repo `reloadersystem/reloadergames-creator`) |
| Motor | Unity 6.4 (`6000.4.1f1`) instalado en Windows — **sin** módulo Android todavía |
| Proyecto Unity del juego | **no creado** — se creará en la Mac (equipo principal, por confirmar especificaciones) |
| Hito actual | **M0 — Preparación** (`ROADMAP.md`) |

## Avance M0
- [x] Ingeniería inversa de referencia → `domains/referencia-ingenieria-inversa.md`
- [x] Prototipo de aprendizaje C++/SDL3 (MiRPG, PC + emulador Android) → `C:\Users\resem\Documents\MiRPG` (solo referencia)
- [x] Elección de motor → ADR-001
- [x] Orquestador con roles, arquitectura y flujos
- [ ] Confirmar Mac como equipo principal (chip, RAM, disco) → `ENVIRONMENTS.md`
- [ ] Instalar Unity Hub + misma versión de Unity en la Mac, con módulos Android e iOS
- [ ] Crear proyecto **Universal 3D** y aplicar checklist de `domains/unity6-urp.md`
- [ ] Crear repo del juego con `.gitignore` de Unity + `.gitattributes` LFS
- [ ] Estructura de carpetas y `.asmdef` de `knowledge/ARCHITECTURE.md`
- [ ] Definir título provisional y pilares en `GAME_DESIGN.md`

## Paquetes instalados en el proyecto
(ninguno todavía)

## Rendimiento (mediciones)
(sin mediciones todavía — ver `knowledge/PERFORMANCE_BUDGETS.md → Cómo se mide`)

## Versiones publicadas
| Plataforma | Versión | Build | Fecha |
|---|---|---|---|
| Android | — | — | — |
| iOS | — | — | — |

## Pendientes conocidos
- Elegir nombre definitivo del juego y package name (`com.reloadergames.<juego>`).
- Decidir uGUI vs UI Toolkit para HUD al cerrar M1 (`ARCHITECTURE.md → Stack técnico`).
