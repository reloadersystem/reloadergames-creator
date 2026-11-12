# GAME DESIGN DOCUMENT (vivo)

Dueño: `game-designer`. Cada sección se completa o cambia con aprobación del usuario.
Juego **original**: ningún nombre, personaje, lugar o arte proviene de juegos existentes.

---

## 1. Visión
- **Título provisional:** _(por definir)_
- **Género:** RPG de acción en 3D, fantasía, con proyección a MMORPG.
- **Plataformas:** Android e iOS (principal), PC (después).
- **Frase de venta (una línea):** _(por definir)_

## 2. Pilares (3 como máximo)
1. _(ej. combate ágil y legible en pantalla táctil)_
2. _(ej. progresión de personaje con decisiones reales)_
3. _(ej. mundo que invita a explorar)_

## 3. Ciclo principal (core loop)
```
explorar ──► combatir ──► obtener botín / experiencia ──► mejorar personaje ──► zonas más difíciles
```

## 4. Alcance del vertical slice (M1)
| Elemento | Cantidad | Detalle |
|---|---|---|
| Zonas | 1 | campo inicial con 2–3 áreas y un punto de interés |
| Clases jugables | 1 | cuerpo a cuerpo |
| Habilidades | 4 + ataque básico | 1 de daño, 1 de área, 1 de movilidad, 1 de curación/buff |
| Enemigos | 3 tipos + 1 jefe | distinto comportamiento cada uno |
| Progresión | niveles 1–5 | stats y desbloqueo de habilidades |
| Botín | pociones + 5 piezas de equipo | sin inventario complejo todavía |
| UI | HUD completo, pantalla de personaje simple, menú de pausa | controles táctiles + teclado |

## 5. Personaje
- Atributos base: _(por definir: ej. Fuerza, Destreza, Inteligencia, Vitalidad)_
- Stats derivados: vida, maná/energía, daño, defensa, velocidad de ataque, crítico.
- Fórmulas → `Game.Core.Stats` (con pruebas) y valores en `Data/`.

## 6. Combate
- Tiempo real, selección de objetivo por toque + ataque automático al estar en rango.
- Habilidades con cooldown y costo de maná/energía.
- _(detallar con especificaciones en `context/features/`)_

## 7. Enemigos
| Nombre (original) | Rol | Comportamiento | Nivel |
|---|---|---|---|
| _(por definir)_ | básico cuerpo a cuerpo | patrulla, persigue, vuelve a su zona | 1–2 |
| _(por definir)_ | a distancia | mantiene distancia y dispara | 2–3 |
| _(por definir)_ | tanque | lento, golpe fuerte con aviso | 3–4 |
| _(jefe)_ | jefe | 2 fases | 5 |

## 8. Mundo y estilo visual
- Estilo de arte: _(por definir: ej. estilizado/semi-realista; define el pipeline de arte)_
- Paleta y referencias: _(propias, en una carpeta de referencias fuera del juego)_

## 9. Online (visión M3+)
Zonas compartidas, grupos, chat, comercio. Diseño detallado cuando se cierre M2.

## 10. Monetización (por decidir — no condiciona M1)
_(opciones a evaluar: premium, cosméticos, pase de temporada. Nunca "pagar para ganar" sin decisión explícita.)_
