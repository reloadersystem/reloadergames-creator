# ROADMAP — hitos

Cada hito termina con algo **jugable** y se mergea a `main`. No se empieza un hito sin cerrar el anterior.

| Hito | Objetivo | Entregable jugable | Estado |
|---|---|---|---|
| **M0 — Preparación** | entorno, arquitectura, orquestador | proyecto Unity vacío con estructura, compila en Android | 🟡 en curso |
| **M1 — Vertical slice offline** | demostrar el juego en pequeño | 1 zona, 1 clase, 4 habilidades, 3 enemigos + jefe, niveles 1–5, HUD táctil, en emulador y celular | ⚪ |
| **M2 — Contenido y pulido** | que se sienta un juego | 2–3 zonas, inventario y equipo, misiones simples, guardado, Addressables, perfiles de calidad medidos | ⚪ |
| **M3 — Prototipo online** | jugar con otros | ADR de red, servidor autoritativo de 1 zona, cuentas, 2–10 jugadores juntos | ⚪ |
| **M4 — Alpha** | probar con jugadores reales | grupos, chat, comercio básico, telemetría, prueba cerrada (TestFlight / prueba interna de Play) | ⚪ |

## M1 desglosado (orden sugerido)
1. Personaje se mueve con joystick y teclado + cámara en tercera persona (Cinemachine).
2. Prototipo gris de la zona (blockout) con NavMesh.
3. Stats + Health + ataque básico + un enemigo con FSM.
4. HUD (vida, maná, objetivo) + números de daño (pool).
5. Habilidades (Strategy + ScriptableObjects) y rueda táctil.
6. Experiencia, niveles y botín simple.
7. Los otros 2 enemigos + jefe.
8. Arte: personajes y entorno (CC0 primero, propio después), iluminación y postprocesado.
9. Medición de rendimiento en dispositivo + ajustes.
10. Build Android (y iOS en Mac) → cierre de M1.
