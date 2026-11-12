# Domain — Backend y servicios del ecosistema Reloader

Cómo se conecta el juego con el backend existente del ecosistema (`MASTER_PROMPT.md → ECOSISTEMA RELOADER`).
Dueño: `backend-engineer`. Estado: **integración no aprobada todavía** (ADR-005 propuesta) — hasta entonces, solo lectura y diseño.

---

## Qué ya existe (verificado 2026-11-11, solo lectura)

| Pieza | Tecnología | Estado |
|---|---|---|
| Base de datos `reloader-games-db` | SQL Server en Azure, migraciones Flyway (repo ReloaderDB) | activa, V000 en adelante |
| API REST | Jakarta EE 10 (Payara 6), JAX-RS, Java 17 | activa en Azure Web App, health check `/health` |
| Microservicios | Kotlin + Ktor: `auth-service`, `supplier-service` | activos (Docker) |
| Entorno local | Docker: SQL Server + contenedor REST + microservicios | flow `reloader docker` del Team Leader |
| Automatización | n8n + WhatsApp (YCloud) | activa |
| Deploy | GitHub Actions → Azure Container Registry → Web App (push a `main`) | activo |

### Esquemas de la base útiles para el juego
| Esquema | Contiene | Uso en el juego |
|---|---|---|
| `auth` | usuarios, roles, perfiles | cuenta del jugador, login |
| `core` | jugador, personaje, facción, clase, gremio, rangos | selección y persistencia del personaje, gremios (M4) |
| `catalog` | ítems, tipos, ranuras, clases permitidas, stats de ítem, gemas y sus efectos | catálogo de equipo |
| `build` | stats base, asignados y finales del personaje | progresión |
| `equipment` | equipo actual, ranuras de gemas, gemas engarzadas | equipo del personaje |
| `market` | mercado (en construcción) | comercio (M4) |

## Dos tipos de servidor (no confundir)
| | Servicios de datos (este backend) | Servidor de juego en tiempo real |
|---|---|---|
| Qué hace | cuentas, personajes, inventario, catálogo, gremios, tienda, mercado | movimiento, combate, IA, estado del mundo |
| Frecuencia | pedidos puntuales (HTTP/REST) | 20–30 actualizaciones por segundo (UDP/TCP) |
| Existe | **sí** (ecosistema Reloader) | **no** — se diseña en M3 (`multiplayer.md`) |
| Rol | `backend-engineer` | `network-engineer` |

El servidor de juego **lee y guarda** en los servicios de datos (al entrar a una zona, al subir de nivel, al recibir botín); el cliente Unity nunca escribe directo en la base.

## Cómo consume el juego el backend (cuando se apruebe)
- Cliente HTTP en `Scripts/Infrastructure/Backend/` detrás de una interfaz de Core (`IAccountService`, `ICharacterRepository`, `ICatalogService`).
- DTOs del contrato REST separados de los modelos de Core (se mapean en Infrastructure).
- Implementación **offline** de las mismas interfaces para desarrollo sin servidor (patrón Composition Root en `Bootstrap/`).
- Autenticación: token emitido por el backend, guardado en el almacenamiento seguro de cada plataforma; nunca en `PlayerPrefs` en texto plano.
- URLs por entorno (local Docker / producción Azure) en configuración, nunca hardcodeadas.

## Catálogo: estructura sí, contenido original
El **esquema** de catálogo (ítems, ranuras, gemas, facciones, stats) es genérico y reutilizable.
El **contenido** que use el juego (nombres de ítems, facciones, sistemas, imágenes) debe ser **original** y pasar por `asset-ip-guardian` antes de cargarse. Datos de catálogo heredados de otros juegos no entran al juego.

## Versionado de datos
Regla general en `knowledge/OPERATING_MODEL.md → Versionado de datos`. En el backend aplica la disciplina del agente ReloaderDB: **una migración abierta a la vez**, se cierra solo con confirmación del usuario, y a producción solo con la frase explícita "esto va a producción".

## Pedir cambios al backend
Nunca editando sus repos. `backend-engineer` arma la solicitud para el Team Leader (`MASTER_PROMPT.md → Reglas del ecosistema`):
```
# Plan: <funcionalidad del juego que lo necesita>
## Agentes afectados
- ReloaderDB: <tabla/SP>
- REST: <endpoint, request, response>
## Pasos en orden
1. ReloaderDB → … → entregable
2. REST → … → entregable
3. Game → consumir el contrato
## Dependencias
- Paso 3 depende del contrato del Paso 2: <campos exactos>
```
