# Operating Model

## Fuente de verdad
- `ai-orchestrator/` es la única fuente de verdad operativa; el proyecto Unity es la fuente de verdad funcional.
- El modelo de carpetas está en `MASTER_PROMPT.md → MODELO MENTAL DEL SISTEMA` (no se repite acá).
- Prohibido usar memoria interna de Claude como fuente de verdad, duplicar información o guardar reglas en el repo del juego.

## Ejecución
Claude **no ejecuta sin pedido explícito en el mismo mensaje**:
- builds de Unity (incluido `-batchmode -executeMethod`), Gradle, Xcode, `pod install`
- instalación o actualización de paquetes (Package Manager, NuGet, npm)
- borrado masivo de assets o reimportaciones completas

Claude **sí puede**, cuando la tarea lo requiere:
- leer y editar scripts C#, shaders en texto, `.asmdef`, `.inputactions`, JSON y `ProjectSettings/*.asset` simples
- correr pruebas EditMode en batchmode si el usuario lo pidió en la tarea
- preparar comandos y pasos para que el usuario los ejecute

## Archivos de Unity (qué se edita a mano y qué no)
| Archivo | ¿Claude lo edita? |
|---|---|
| `.cs`, `.asmdef`, `.shader`, `.hlsl`, `.json`, `.inputactions` | Sí |
| `.meta` | Solo para mantener GUIDs al mover archivos; nunca inventar GUIDs a mano |
| `.unity` (escenas), `.prefab`, `.asset`, `.mat`, `.controller` | No a mano (YAML frágil). Se dan **pasos en el editor**, o se crea un script de editor (`Scripts/Editor/`) que lo genere, o se usa un MCP de Unity si está conectado |
| binarios (`.fbx`, `.png`, `.blend`) | Nunca |

## Modo mentor (activo por defecto)
El usuario está aprendiendo desarrollo de juegos. Con modo mentor activo:
1. Cada cambio importante incluye **una o dos líneas de "por qué"** (qué patrón, qué problema evita).
2. Al introducir un concepto nuevo (ScriptableObject, FSM, pool…) se nombra y se apunta a `DESIGN_PATTERNS.md`.
3. Cuando una tarea es buena para practicar, se ofrece que el usuario la haga y Claude revise.
4. Sin clases magistrales: lo justo para entender y seguir.
Se cambia con `reloader mentor on|off`.

## Reglas de interacción
1. Proponer estructura antes de crear archivos o carpetas.
2. **Diseño antes que código**: mecánica nueva → especificación mínima (`templates/FEATURE_SPEC.md`) → aprobación → código.
3. Iterar en este orden: **funciona (gris) → se siente bien (game feel) → se ve bien (arte) → rinde (perf)**.
4. No modificar código funcional fuera del alcance pedido.
5. Explicaciones directas; respuestas en español.

## Ciclo de una feature
```
idea ──► spec (game-designer) ──► plan técnico (roles) ──► revisión de riesgos (qa + ip)
     ──► APROBACIÓN DEL USUARIO ──► implementación ──► revisión de código ──► playtest
     ──► actualizar context/ (PROJECT_CONTEXT, ROADMAP, DECISIONS si aplica)
```
Automatizado en `workflows/planificar-feature.js` e `implementar-feature.js`.

## Definición de terminado (DoD)
Una feature está terminada cuando:
- [ ] Cumple los criterios de aceptación de su especificación.
- [ ] Respeta capas y patrones (`ARCHITECTURE.md`, `DESIGN_PATTERNS.md`); sin anti-patrones prohibidos.
- [ ] Las reglas nuevas de Core tienen pruebas EditMode.
- [ ] Números de balance en datos (ScriptableObject), no en código.
- [ ] Funciona con controles táctiles **y** teclado/gamepad.
- [ ] No rompe los presupuestos de `PERFORMANCE_BUDGETS.md` (o la excepción está registrada).
- [ ] Assets externos registrados en `ASSETS_REGISTRY.md`.
- [ ] `PROJECT_CONTEXT.md` actualizado.

## Decisiones de arquitectura (ADR)
Toda decisión que cueste cambiar después (motor, red, guardado, estructura) se registra en `context/DECISIONS.md` con `templates/ADR.md`: contexto, opciones, decisión, consecuencias. Nunca se decide en silencio.

## Propiedad intelectual (no negociable)
- Solo arte, audio, código y datos **propios** o con licencia que permita uso comercial (`domains/assets-licencias.md`).
- Se puede **estudiar** cómo están hechos otros juegos (`domains/referencia-ingenieria-inversa.md`); nunca copiar sus assets, código, nombres, mapas o personajes.
- Ante la duda sobre un asset → no se usa hasta que `asset-ip-guardian` lo apruebe.

## Diagnóstico
Antes de afirmar la causa de un bug: reproducir o seguir el flujo completo (input → intent → Core → evento → presentación). Nunca adivinar desde un solo archivo.
