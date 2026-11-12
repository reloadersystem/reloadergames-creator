# Flow: Cierre de hito

Un hito (`context/ROADMAP.md`) se cierra solo cuando hay un build jugable en dispositivo. Pasos en orden.

### 1. Alcance
Comparar el entregable del hito en `ROADMAP.md` con la tabla de sistemas de `PROJECT_CONTEXT.md`. Todo lo que no llegó al 100 % → se decide con el usuario: se completa o se mueve al hito siguiente (anotarlo).

### 2. Revisión de calidad
Ejecutar `reloader revision` (workflow `revision-calidad`). Hallazgos críticos → se corrigen antes de seguir.

### 3. Rendimiento en dispositivo
`qa-performance` mide la escena de referencia (`knowledge/PERFORMANCE_BUDGETS.md → Cómo se mide`) en los perfiles del hito. Resultado → `PROJECT_CONTEXT.md → Rendimiento`.

### 4. Playtest
Reporte con `templates/PLAYTEST_REPORT.md` guardado en `context/mecanicas-validadas/playtest-<hito>-<fecha>.md`.

### 5. Licencias
`asset-ip-guardian` confirma que `ASSETS_REGISTRY.md` está completo y los créditos actualizados.

### 6. Build
`build-release` genera el build del hito (Android; iOS en Mac) siguiendo `domains/android-build.md` / `ios-build.md`. Versión → `PROJECT_CONTEXT.md → Versiones publicadas`.

### 7. Merge y estado
- Merge `develop` → `main` (solo con pedido explícito del usuario).
- `ROADMAP.md`: hito ✅ y el siguiente 🟡.
- Commit según `flows/cierre-feature.md → paso 6`.
