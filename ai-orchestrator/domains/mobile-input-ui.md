# Domain — Controles táctiles y UI móvil

## Esquema de controles (RPG de acción en tercera persona)
| Zona de pantalla | Control | Notas |
|---|---|---|
| Mitad izquierda | **Joystick virtual flotante** (aparece donde se toca) | movimiento → `MoveIntent` |
| Mitad derecha (arrastre) | rotar cámara | sensibilidad configurable |
| Abajo a la derecha | **botón de ataque básico** grande + **rueda de habilidades** alrededor | cooldown visible (radial) |
| Arriba a la derecha | minimapa + menú | |
| Arriba a la izquierda | retrato, vida, maná/energía, nivel | |
| Barra rápida | pociones / consumibles | atajos de teclado en PC |
| Toque sobre enemigo | seleccionar objetivo | marco de objetivo arriba al centro |

Todo control táctil tiene **equivalente en teclado/ratón y gamepad** (mismas acciones del Input System, distintos bindings).

## Reglas de UI móvil
- **Safe Area**: todo el HUD dentro de `Screen.safeArea` (muescas, cámaras, barra de gestos).
- Canvas Scaler: *Scale With Screen Size*, referencia 1920×1080, *Match* 0.5.
- Botones táctiles ≥ **9 mm** (~ 80–100 px en referencia 1080p); separación ≥ 2 mm.
- El pulgar alcanza las esquinas inferiores: acciones frecuentes abajo, información arriba.
- Texto mínimo legible: 24 px en referencia 1080p.
- Dividir Canvas por frecuencia de cambio (estático / dinámico) para no reconstruir todo el HUD cada frame.
- Sin `Raycast Target` en elementos decorativos.

## Patrón
- Vistas (MonoBehaviour) solo muestran; Presenters escuchan eventos de gameplay (`DESIGN_PATTERNS.md → MVP`).
- El joystick y los botones **producen intents**; nunca llaman directamente a componentes del jugador.
- Accesibilidad (desde M2): tamaño de HUD, opacidad, zurdo/diestro, vibración on/off.

## Referencia de estudio
El análisis del cliente móvil de un MMORPG (ver `referencia-ingenieria-inversa.md`) usa exactamente este esquema: joystick izquierdo, rueda de habilidades derecha, accesos rápidos de pociones, minimapa arriba a la derecha y chat abajo al centro. Se toma la **idea de diseño**, nunca su arte.
