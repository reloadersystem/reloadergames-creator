# Flow: Cierre de feature

Antes de hacer commit de una feature (o sistema) terminada, ejecutar este flow en orden.

## Pasos

### 1. Verificar la definición de terminado
Recorrer `knowledge/OPERATING_MODEL.md → Definición de terminado` y marcar cada punto. Un punto sin cumplir → se informa al usuario y se decide: se completa ahora o queda anotado como pendiente en el paso 4.

### 2. Registrar lo validado en juego
Si la feature se probó (editor, emulador o dispositivo), crear o actualizar `context/mecanicas-validadas/<feature>.md`:
- reglas confirmadas en playtest
- valores de balance finales (y por qué cambiaron respecto de la especificación)
- casos borde observados

### 3. Registrar flujo de sistema (si cambió)
Si la feature crea o modifica un sistema transversal (combate, guardado, progresión, red), actualizar su documento en `context/flujos-sistema/`.

### 4. Actualizar estado en `context/PROJECT_CONTEXT.md`
Preguntar al usuario el % de avance y registrarlo en la tabla de sistemas:
```
| Sistema / Feature | X% | Qué quedó hecho · qué falta |
```
Si cambia el estado del hito → actualizar también `context/ROADMAP.md`.

### 5. Registrar assets y decisiones
- Assets externos nuevos → `context/ASSETS_REGISTRY.md` (aprobados por `asset-ip-guardian`).
- Decisión de arquitectura tomada durante la feature → nueva entrada en `context/DECISIONS.md`.
- Especificación en `context/features/<slug>.md` → `Estado: implementada`.

### 6. Recién entonces → commit
`git status` completo, un solo commit con todos los archivos, mensaje en español y firma según `knowledge/CONVENTIONS.md → Commits`. Push solo si el usuario lo pide.
