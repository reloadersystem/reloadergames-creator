# ENVIRONMENTS — máquinas y rutas

Al inicializar (`reloader sesion`) el orquestador detecta el sistema operativo y usa la fila correspondiente como **ruta base activa**.

| Máquina | SO | Rol | Orquestador | Proyecto Unity (ruta base activa) | Unity |
|---|---|---|---|---|---|
| PC HP OMEN | Windows 11 | secundaria: modelado 3D / pruebas | `C:\Users\resem\Documents\GitHub\ReloaderGamesCreator` | `C:\Users\resem\Documents\UnityProjects\<Juego>` (por crear) | `6000.4.1f1` |
| Mac | macOS | **principal** (Android + iOS) — por confirmar | `~/Documents/GitHub/ReloaderGamesCreator` (por confirmar) | `~/Documents/UnityProjects/<Juego>` (por crear) | misma versión exacta que Windows |

## Reglas
- Las dos máquinas usan **la misma versión exacta de Unity**.
- El proyecto se sincroniza solo por **Git** (nunca copiando carpetas; `Library/` se regenera en cada máquina).
- Al confirmar una ruta, reemplazar "(por crear)" / "(por confirmar)" en esta tabla.

## Herramientas por máquina
| Herramienta | Windows | Mac |
|---|---|---|
| Unity Hub + Unity 6 | instalado (sin módulo Android) | pendiente |
| Android Studio + emulador | instalado (emulador `Pixel_7`, x86_64) | pendiente |
| Xcode | — (no disponible) | pendiente |
| Blender | pendiente | pendiente |
| VS Code + extensión C# Dev Kit / Unity | VS Code instalado; extensión pendiente | pendiente |
| Git + `gh` | instalado y autenticado | pendiente |
