# Flow: Setup del proyecto Unity (M0)

Crear el proyecto del juego **por fases**. No se avanza a la fase siguiente sin pasar la verificación de la actual.
Al cerrar cada fase → anotar la fase alcanzada en `context/PROJECT_CONTEXT.md`.
**Por qué:** en los proyectos KMP los errores de setup salieron del orden y de las versiones, no del código. Este flujo lo previene desde el inicio.

---

## Fase 0 — Máquina
- Completar `context/ENVIRONMENTS.md` con la máquina (SO, chip, RAM, disco libre ≥ 80 GB).
- **Verificación:** la fila de la máquina no tiene "(por confirmar)".

## Fase 1 — Unity Hub y editor
- Instalar Unity Hub, iniciar sesión, licencia Personal.
- Instalar **la misma versión exacta** registrada en `ENVIRONMENTS.md` + módulos: Android Build Support (OpenJDK, SDK & NDK) y, en Mac, iOS Build Support.
- **Verificación:** en Hub → Installs la versión muestra las etiquetas Android (e iOS en Mac).

## Fase 2 — Crear el proyecto
- Plantilla **Universal 3D**, ubicación según `ENVIRONMENTS.md`, sin AI Assistant ni Unity CLI.
- **Verificación:** el editor abre la escena de ejemplo sin errores en la consola.

## Fase 3 — Configuración base
- Aplicar el checklist de `domains/unity6-urp.md → Checklist de configuración inicial`.
- **Verificación:** Force Text, Visible Meta Files, Linear, Input System activo, IL2CPP + ARM64 (y x86_64 para emulador del PC).

## Fase 4 — Control de versiones
- Crear el repo del juego (privado recomendado), `.gitignore` oficial de Unity, `.gitattributes` con LFS de `domains/unity6-urp.md`, `git lfs install`.
- Bloquear archivos de IA en `.git/info/exclude`: `ai-orchestrator/`, `CLAUDE.md`, `AGENTS.md`, `.claude/`.
- **Verificación:** `git lfs track` lista los patrones; primer commit sin `Library/` ni `Temp/`.

## Fase 5 — Estructura y assemblies
- Crear carpetas de `knowledge/ARCHITECTURE.md → Estructura de carpetas` y las `.asmdef` de la tabla de capas con sus referencias.
- **Verificación:** el proyecto compila; un `using Game.Gameplay` dentro de `Core` **no** compila (prueba de que las capas se respetan).

## Fase 6 — Escena de arranque
- `Bootstrap.unity` en el índice 0 del build, `MainMenu.unity`, carpeta `Zones/` y `Sandbox/`.
- **Verificación:** Play desde Bootstrap carga MainMenu.

## Fase 7 — Perfiles de calidad
- URP Assets `Mobile-Low`, `Mobile-High`, `PC` asignados en Quality (`domains/unity6-urp.md → URP por perfiles`).
- **Verificación:** cambiar de perfil en Quality cambia sombras y resolución en el Game view.

## Fase 8 — Primer build Android
- Seguir `domains/android-build.md` → build de desarrollo al emulador.
- **Verificación:** la app abre en el emulador y `adb logcat -s Unity` no muestra errores.

## Fase 9 — Primer build iOS (solo Mac)
- Seguir `domains/ios-build.md` → simulador.
- **Verificación:** la app abre en el simulador de iPhone.

**M0 cerrado** cuando las fases 0–8 (y 9 en Mac) están verificadas → `ROADMAP.md`: M0 ✅.

---

## Errores → fase que los previene
| Error | Fase |
|---|---|
| _(se completa a medida que aparezcan)_ | |
