# Domain — Multijugador y servidor

## Estrategia: offline primero, preparado para online
Hasta M3 el juego es de un jugador, pero **escrito como si fuera online**:
- Reglas en `Game.Core` (C# puro, sin Unity) → reutilizables en un servidor .NET.
- Todo input como **intent** (`ARCHITECTURE.md → Flujo de datos`).
- El estado de la partida separado de su representación visual.

## Dos tipos de servidor
Un MMORPG necesita **servicios de datos** (cuentas, personajes, inventario, gremios) y un **servidor de juego en tiempo real** (movimiento, combate). Los servicios de datos **ya existen** en el ecosistema Reloader (`backend-servicios.md`, rol `backend-engineer`); este documento trata el servidor de tiempo real (rol `network-engineer`).

## Opciones para el servidor de tiempo real (decisión en M3 con ADR)
| Opción | Ideal para | A favor | En contra |
|---|---|---|---|
| **Netcode for GameObjects** (Unity) | cooperativo chico (2–10 jugadores) | oficial, integrado | no pensado para MMO |
| **FishNet / Mirror** | sesiones medianas, servidor dedicado | maduros, gratuitos, comunidad grande | escalado MMO requiere trabajo extra |
| **Servidor propio .NET** (reutiliza `Game.Core`) + transporte (LiteNetLib/ENet/WebSocket) | MMO por zonas | control total, mismas reglas cliente/servidor | más trabajo de base |
| **Backend gestionado** (Nakama, PlayFab, etc.) para cuentas, chat, inventario | servicios meta | rápido de integrar | costo y dependencia de proveedor |

Combinación típica de MMO móvil: **servidor de juego autoritativo propio por zona** + **backend de servicios** (cuentas, persistencia, chat, tienda). En nuestro caso el backend de servicios es el del ecosistema Reloader (ADR-005), así que "Backend gestionado" solo se evalúa para lo que el ecosistema no cubra.

## Conceptos que se van a necesitar
- **Servidor autoritativo**: el cliente nunca decide daño, posición final ni drops (anti-trampas).
- **Tick del servidor** (ej. 20–30 Hz) y **interpolación** en el cliente para movimiento suave.
- **Predicción del cliente** solo para el movimiento propio; reconciliación con el servidor.
- **Gestión de interés**: cada cliente recibe solo lo que tiene cerca (`DESIGN_PATTERNS.md → #12`).
- **Persistencia**: base de datos para personajes, inventario, progreso; guardado transaccional.
- **Protocolo**: mensajes binarios versionados; nunca confiar en datos del cliente.

## Responsables
- `network-engineer`: servidor de tiempo real; revisa cualquier feature que toque estado compartido desde que exista el ADR de red.
- `backend-engineer`: servicios de datos del ecosistema y su contrato con el juego.
