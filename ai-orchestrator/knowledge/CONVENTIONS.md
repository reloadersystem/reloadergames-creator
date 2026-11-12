# Conventions

## Commits
- Firma obligatoria en todo commit (rama o main): `Authored-By: Reloader - Resembrink Correa`
- Nunca agregar `Co-Authored-By` de Anthropic, Claude ni ninguna IA.
- No hacer commit ni push automáticamente — solo cuando se pide explícitamente.
- Mensajes siempre en español.
- Antes de stagear: mostrar `git status`. Stagear todo en un solo commit, sin preguntar archivo por archivo.
- Antes de commitear un avance de hito/feature: actualizar `context/PROJECT_CONTEXT.md` (y `ROADMAP.md` si cambia el estado del hito).

### Estructura
```
tipo: descripción corta del cambio

- archivo o sistema: qué se hizo y por qué
- archivo o sistema: qué se hizo y por qué

Authored-By: Reloader - Resembrink Correa
```

### Tipos
| Tipo | Uso en el repo del juego | Uso en este repo (orquestador) |
|---|---|---|
| `feat` | mecánica, sistema, contenido nuevo | regla, flujo, rol, arquitectura o contexto nuevo |
| `fix` | corrección de error | corregir una regla mal escrita o contradictoria |
| `art` | modelos, texturas, animaciones, VFX, audio | — |
| `level` | escenas, zonas, encuentros | — |
| `perf` | optimización | — |
| `refactor` | reorganizar sin cambiar comportamiento | — |
| `test` | pruebas | — |
| `build` | configuración de build, plataformas, paquetes | — |
| `docs` | no se usa | no se usa |

## Git en proyectos Unity
- Ramas: `main` (siempre jugable) · `develop` (integración) · `feature/<nombre>` · `art/<nombre>` · `fix/<nombre>`.
- `main` solo recibe merges de `develop` cuando se cierra un hito jugable.
- **Git LFS obligatorio** para binarios: `*.fbx *.blend *.png *.psd *.tga *.exr *.wav *.mp3 *.ogg *.ttf *.otf *.mp4 *.asset` grandes (ver `domains/unity6-urp.md → .gitattributes`).
- Unity: **Asset Serialization = Force Text**, **Version Control = Visible Meta Files**.
- Los `.meta` se commitean **siempre** junto a su archivo. Un `.meta` perdido rompe referencias.
- Escenas y prefabs: una persona por escena a la vez; conflictos de escena se resuelven con UnityYAMLMerge, nunca a mano.
- Nunca se commitea: `Library/ Temp/ Obj/ Build/ Builds/ Logs/ UserSettings/ *.csproj *.sln`, keystores ni certificados.

## Código C#
| Elemento | Convención | Ejemplo |
|---|---|---|
| Namespace | `Game.<Capa>.<Área>` | `Game.Core.Combat` |
| Clases, métodos, propiedades, eventos | PascalCase | `DealDamage()`, `OnDied` |
| Campos privados | `_camelCase` | `_currentHealth` |
| Campos para el Inspector | `[SerializeField] private` | `[SerializeField] private float _speed;` |
| Constantes | PascalCase | `MaxLevel` |
| Interfaces | prefijo `I` | `ISaveService` |
| ScriptableObject de datos | sufijo `Definition` | `AbilityDefinition` |
| Eventos | `On` + pasado | `OnHealthChanged` |
| Archivos | un tipo público por archivo, mismo nombre | `Health.cs` |

- Código y comentarios técnicos en inglés; textos visibles al jugador nunca en el código (tabla de localización).
- `Awake` = referencias propias · `OnEnable/OnDisable` = suscripciones · `Start` = referencias a otros.
- Métodos cortos; si una clase pasa ~300 líneas, revisar si hace más de una cosa.
- Todo número de balance (daño, velocidad, cooldown) sale de datos, nunca hardcodeado.

## Nombres de assets
| Prefijo | Tipo | Ejemplo |
|---|---|---|
| `SM_` | malla estática | `SM_Rock_Large_01` |
| `SK_` | malla con esqueleto | `SK_Hero_Warrior` |
| `M_` | material | `M_Rock_Moss` |
| `T_` + sufijo | textura: `_D` color, `_N` normal, `_MRA` metal/rugosidad/oclusión, `_E` emisión | `T_Rock_Moss_N` |
| `A_` | clip de animación | `A_Hero_Run` |
| `AC_` | Animator Controller | `AC_Hero` |
| `PF_` | prefab | `PF_Enemy_Wolf` |
| `SO_` | instancia ScriptableObject | `SO_Ability_Fireball` |
| `VFX_` | efecto visual | `VFX_Hit_Spark` |
| `SFX_` / `MUS_` | sonido / música | `SFX_Sword_Hit_01` |
| `UI_` | sprite o prefab de UI | `UI_Icon_Potion` |
| `SH_` | shader / Shader Graph | `SH_Water` |

Escenas: `Zone_<Nombre>`, `Sandbox_<Persona>_<Tema>`. Todo en inglés, sin espacios ni tildes.
