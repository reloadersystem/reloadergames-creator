# Flujo de sistema — Combate
> Estado: **diseño** (aún no implementado) · Hito: M1 · Actualizar al implementar y al pasar a online (M3)

---

## Participantes

| Pieza | Capa / assembly | Rol en el flujo |
|---|---|---|
| `PlayerInputReader` + joystick / rueda táctil | `Game.Input` | lee toques/teclas → produce intents |
| `PlayerController` | `Game.Gameplay` | valida el intent (rango, cooldown, maná) y llama a Core |
| `CombatRules` / `DamageCalculator` | `Game.Core` | calcula daño, crítico, mitigación (C# puro, con tests) |
| `Health`, `AbilityCaster`, `CharacterStats` | `Game.Gameplay` | aplican el resultado y emiten eventos |
| `EnemyBrain` | `Game.Gameplay` (AI) | reacciona al daño (agro) por eventos |
| HUD, números de daño, VFX, audio, Animator | `Game.UI` / presentación | escuchan eventos; nunca deciden |
| `AbilityDefinition`, `EnemyDefinition`, `ClassDefinition` | `Data/` (ScriptableObjects) | todos los números del flujo |

---

## Resumen visual

```
Toque en enemigo / botón de habilidad
  │
  ├─ 1. Game.Input        → SelectTargetIntent / UseAbilityIntent { abilityId, targetId }
  │
  ├─ 2. Game.Gameplay     → PlayerController valida: ¿objetivo vivo? ¿en rango? ¿cooldown? ¿maná?
  │                          ├─ no → evento AbilityRejected(motivo) → HUD muestra aviso
  │                          └─ sí → AbilityCaster inicia casteo (Animator: Cast)
  │
  ├─ 3. Game.Core         → DamageCalculator.Compute(atacanteStats, defensorStats, abilityDef, rng)
  │                          = { damage, isCritical, isMiss }
  │
  ├─ 4. Game.Gameplay     → Health.Apply(result) en el objetivo
  │                          ├─ evento DamageTaken(result)   → número de daño (pool), VFX, sonido
  │                          ├─ evento HealthChanged(hp,max) → barra de vida / marco de objetivo
  │                          └─ hp ≤ 0 → evento Died(killer) → XP + botín (Progression en Core)
  │
  └─ 5. Presentación      → solo escucha eventos (MVP); nunca modifica estado
```

---

## Datos que viajan

| Paso | Dato | Origen de los valores |
|---|---|---|
| 1 | `UseAbilityIntent { abilityId, targetId }` | input del jugador |
| 2 | rango, cooldown, costo | `AbilityDefinition` |
| 3 | stats de ataque y defensa | `CharacterStats` ← `ClassDefinition` / `EnemyDefinition` + modificadores |
| 3 | fórmula de daño | `Game.Core.Combat` (parámetros en datos) |
| 4 | `DamageResult { damage, isCritical, isMiss, sourceId, targetId }` | Core |
| 4 | XP otorgada | `EnemyDefinition` + tabla de `Progression` |

---

## En online (M3) — qué cambia
```
Cliente: paso 1 igual → intent viaja al servidor
Servidor: pasos 2–4 con el MISMO Game.Core → difunde DamageResult / Died a los clientes cercanos
Cliente: paso 5 igual (presentación) + predicción solo de la animación de casteo
```
Lo único que se mueve es **dónde corren los pasos 2–4**. Por eso Core no puede depender de Unity (ADR-002).

---

## Dónde depurar
| Síntoma | Mirar primero |
|---|---|
| El botón no hace nada | paso 1 (¿se produce el intent?) → paso 2 (¿AbilityRejected y por qué?) |
| El daño es incorrecto | paso 3: test EditMode de `DamageCalculator` con esos stats |
| La barra no baja | paso 4: ¿se emite HealthChanged? ¿el Presenter está suscrito (OnEnable)? |
| Tirones al pegar | números de daño/VFX sin pool (`DESIGN_PATTERNS.md → Object Pool`) |
