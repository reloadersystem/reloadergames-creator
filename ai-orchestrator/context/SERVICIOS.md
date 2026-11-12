# SERVICIOS — cuentas y servicios externos (sin secretos)

Guía para retomar el proyecto (`reloader retomar`). **Nunca** se escriben aquí contraseñas, tokens, cadenas de conexión con credenciales ni claves de API: solo qué cuenta existe, para qué sirve y dónde se administra.

## Cuentas

| Servicio | Para qué | Cuenta (sin contraseña) | Dónde se administra | Vence / se renueva | Estado |
|---|---|---|---|---|---|
| Unity | editor, licencia Personal, Build Automation | (completar) | Unity Hub / id.unity.com | revisar umbral de ingresos de la licencia | activa en Windows |
| GitHub | repos del orquestador y del juego | `reloaderdev` (gh autenticado en Windows) · org `reloadersystem` | github.com | — | activa |
| Google Play Console | publicar en Android | (por crear) | play.google.com/console | pago único | pendiente |
| Apple Developer | TestFlight / App Store | (por crear) | developer.apple.com | anual | pendiente |
| Azure | backend del ecosistema Reloader | (ver orquestador del Team Leader / REST) | portal.azure.com | según suscripción | activa (ecosistema) |
| Unity Asset Store | assets con licencia estándar | (misma cuenta Unity) | assetstore.unity.com | — | — |
| Mixamo | animaciones | (cuenta Adobe, por crear) | mixamo.com | — | pendiente |

## Recursos que usa el juego

| Recurso | Dónde | Health check | Dueño |
|---|---|---|---|
| API REST del ecosistema | Azure Web App (ver `domains/backend-servicios.md`) | `GET /health` → 200 | agente REST |
| Base de datos `reloader-games-db` | Azure SQL | — (solo vía Team Leader / ReloaderDB) | agente ReloaderDB |
| Repo del orquestador | `reloadersystem/reloadergames-creator` | `git status` / `gh repo view` | este orquestador |
| Repo del juego | (por crear) | — | este orquestador |

## Checklist al retomar (solo lectura)
1. Máquina actual y versión de Unity coinciden con `ENVIRONMENTS.md`.
2. `git status` del orquestador y del repo del juego: ¿hay cambios sin commitear o ramas sin mergear?
3. Health check de la API del ecosistema (cuando ADR-005 esté aprobado).
4. Vencimientos próximos de la tabla de cuentas.
5. `PROJECT_CONTEXT.md`: hito actual y siguiente paso.

Responder: qué está bien, qué está caído o vencido, qué resolver primero.

## Lecciones aprendidas
| Fecha | Lección |
|---|---|
| 2026-11-11 | Un token de GitHub pegado en el chat debe revocarse de inmediato; para operar se usa la sesión autenticada de `gh`, nunca tokens en texto. |
