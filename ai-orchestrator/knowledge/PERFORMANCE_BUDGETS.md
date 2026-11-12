# Performance Budgets — presupuestos de rendimiento

Valores **iniciales de referencia** para un RPG 3D en celulares. Se ajustan con mediciones reales en dispositivo (Profiler + Frame Debugger) y cada cambio se anota en `context/DECISIONS.md`.
Superar un presupuesto exige una excepción registrada, no un "después lo optimizamos".

## Niveles de dispositivo (perfiles URP)

| Perfil | Dispositivo de referencia | FPS objetivo | Resolución de render |
|---|---|---|---|
| `Mobile-Low` | gama de entrada (3–4 GB RAM) | 30 | 0.7× |
| `Mobile-High` | gama media-alta (6–8 GB RAM) | 60 (30 en escenas densas) | 0.85–1.0× |
| `PC` | escritorio con GPU dedicada | 60+ | 1.0× + efectos extra |

## Por frame (Mobile-High, zona típica)

| Métrica | Presupuesto |
|---|---|
| Tiempo de CPU | ≤ 12 ms (para 60 FPS con margen térmico) |
| Draw calls / SetPass (batches) | ≤ 150 / ≤ 60 |
| Triángulos visibles | ≤ 300 k (Low: ≤ 150 k) |
| Luces en tiempo real | 1 direccional + luces horneadas / light probes |
| Sombras | 1 cascada (Low) – 2 cascadas (High), distancia ≤ 40 m |
| Asignación de memoria GC | **0 bytes por frame** en gameplay estable |
| Postprocesado | Bloom + tonemapping + color grading (High); solo tonemapping (Low) |

## Por asset

| Asset | Triángulos (LOD0) | Texturas | Notas |
|---|---|---|---|
| Personaje del jugador | 15–25 k | 2048 (High) / 1024 (Low) | 1 material ideal, máx. 2 |
| Enemigo común | 5–10 k | 1024 | LOD1 al 50 % |
| NPC | 5–8 k | 1024 | |
| Prop chico | 200–2 k | atlas compartido | GPU instancing / batching |
| Edificio | 5–20 k | 1024–2048 trim sheets | LODs obligatorios |
| Terreno | — | capas ≤ 4 por tile | |

- Compresión de texturas: **ASTC** (Android e iOS). Normal maps a resolución ≤ color.
- Animaciones: compresión Optimal; huesos por personaje ≤ 60; **4 huesos por vértice** máximo.
- Partículas: ≤ 500 vivas en pantalla; sin luces en partículas en Mobile.

## Memoria y tamaño
| Métrica | Presupuesto |
|---|---|
| RAM total del juego | ≤ 1.2 GB (Low) / ≤ 2 GB (High) |
| Tamaño de instalación inicial | ≤ 150 MB (contenido extra por Addressables desde M2) |
| Variantes de shader | eliminar variantes no usadas (shader stripping) |

## Cómo se mide
1. Siempre en **dispositivo real o emulador de rendimiento similar**, build de desarrollo con Profiler conectado.
2. Escena de referencia: la zona más cargada con 10 enemigos en combate.
3. `qa-performance` registra el resultado en `context/PROJECT_CONTEXT.md → Rendimiento`.
