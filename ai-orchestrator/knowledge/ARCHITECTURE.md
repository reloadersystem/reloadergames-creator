# Architecture — arquitectura del juego

Motor: **Unity 6 LTS + URP**, lenguaje **C#**. Destino: **Android e iOS** primero, PC después.
Decisión registrada en `context/DECISIONS.md → ADR-001`.

---

## Principios (obligatorios)

1. **Simulación separada de la presentación.** Las reglas del juego (stats, daño, cooldowns, experiencia, inventario) viven en C# puro, sin `MonoBehaviour`. Unity solo muestra y recibe input.
   *Por qué:* se pueden testear sin abrir Unity, y el mismo código podrá correr en un servidor autoritativo cuando el juego sea online.
2. **Intenciones, no acciones directas.** El input se traduce a *intents* (`MoveIntent`, `UseAbilityIntent`, `InteractIntent`). La simulación decide el resultado.
   *Por qué:* en un juego online el cliente solo pide; el servidor decide. Si se respeta desde el día uno, pasar a online no obliga a reescribir el gameplay.
3. **Datos fuera del código.** Ítems, habilidades, enemigos, clases, tablas de experiencia y balance son **ScriptableObjects** (o JSON). Cambiar un número no requiere programar.
4. **Composición sobre herencia.** Un personaje es un conjunto de componentes (`Health`, `Stats`, `Mover`, `AbilityCaster`…), no una jerarquía `Character → Enemy → Boss`.
5. **Desacople por eventos.** Los sistemas se comunican por eventos/canales, no por referencias cruzadas. La UI escucha; nunca es escuchada por la simulación.
6. **Mobile-first.** Todo se diseña para el celular de gama media. PC es una mejora de calidad, no la base (`PERFORMANCE_BUDGETS.md`).
7. **Gráficos escalables.** La calidad visual se controla con perfiles de URP por nivel de dispositivo; el arte se produce para el nivel alto y se degrada, nunca al revés.

---

## Capas y dependencias

```
            ┌──────────────┐
            │  Presentation │  UI (MVP), cámara, VFX, audio, animación
            └──────┬───────┘
                   │ usa
            ┌──────▼───────┐        ┌────────────────┐
            │   Gameplay    │◄──────┤      Input      │  acciones → intents
            │ MonoBehaviours│        └────────────────┘
            └──────┬───────┘
                   │ usa
            ┌──────▼───────┐        ┌────────────────┐
            │     Core      │◄──────┤ Infrastructure │  guardado, red, plataforma, carga
            │  C# puro      │        └────────────────┘
            └──────────────┘
```

- `Core` **no depende de nada** del proyecto (y evita `UnityEngine`, salvo tipos matemáticos).
- Las flechas solo van hacia abajo. Prohibido que `Core` conozca `Gameplay` o que `Gameplay` conozca `UI`.
- Se fuerza con **Assembly Definitions** (`.asmdef`): una por capa. Un `using` prohibido no compila.

| Assembly | Carpeta | Puede referenciar |
|---|---|---|
| `Game.Core` | `Scripts/Core` | (nada del proyecto) |
| `Game.Infrastructure` | `Scripts/Infrastructure` | Core |
| `Game.Input` | `Scripts/Input` | Core |
| `Game.Gameplay` | `Scripts/Gameplay`, `Scripts/AI` | Core, Input, Infrastructure |
| `Game.UI` | `Scripts/UI` | Core, Gameplay (solo eventos/lectura) |
| `Game.Bootstrap` | `Scripts/Bootstrap` | todas (es la raíz de composición) |
| `Game.Editor` | `Scripts/Editor` | todas (solo editor) |
| `Game.Tests.EditMode` / `PlayMode` | `Tests/` | las que prueban |

---

## Estructura de carpetas del proyecto Unity

```
Assets/
├── _Project/                       todo lo propio (el "_" lo deja arriba)
│   ├── Scripts/
│   │   ├── Core/                   reglas puras: Stats, Combat, Progression, Inventory, StateMachine, Events
│   │   ├── Input/                  Input System → intents; joystick virtual
│   │   ├── Gameplay/
│   │   │   ├── Characters/         componentes de personaje: Health, Mover, AbilityCaster, Targetable
│   │   │   ├── Player/             controlador del jugador (intents → componentes)
│   │   │   ├── Combat/             puente entre Core.Combat y escena (hitboxes, proyectiles)
│   │   │   ├── Abilities/          ejecución de habilidades (Strategy)
│   │   │   ├── Interaction/        NPCs, recogibles, portales
│   │   │   └── World/              spawners, zonas, día/noche
│   │   ├── AI/                     FSM/behaviours de enemigos
│   │   ├── UI/
│   │   │   ├── Hud/                vida, maná, habilidades, minimapa
│   │   │   ├── Screens/            menús, inventario, personaje
│   │   │   └── Common/             widgets reutilizables
│   │   ├── Camera/                 rigs de Cinemachine y su lógica
│   │   ├── Infrastructure/         Save, Networking, Platform, Assets (Addressables), Analytics
│   │   ├── Bootstrap/              arranque y composición de servicios
│   │   └── Editor/                 herramientas propias del editor
│   ├── Data/                       ScriptableObjects (instancias)
│   │   ├── Abilities/  Items/  Enemies/  Classes/  Progression/  Events/
│   ├── Prefabs/
│   │   ├── Characters/  Enemies/  Environment/  UI/  VFX/
│   ├── Scenes/
│   │   ├── Bootstrap.unity         escena 0: servicios persistentes
│   │   ├── MainMenu.unity
│   │   ├── Zones/                  una escena por zona del mundo (carga aditiva)
│   │   └── Sandbox/                escenas de prueba por persona/feature (no van al build)
│   ├── Art/
│   │   ├── Models/  Materials/  Textures/  Animations/  Shaders/  VFX/
│   ├── Audio/  Music/  SFX/
│   └── Settings/                   URP assets por calidad, Input Actions, Volume profiles
├── ThirdParty/                     assets externos, cada uno con su LICENSE (ver ASSETS_REGISTRY)
└── Tests/
    ├── EditMode/                   pruebas de Core (rápidas, sin escena)
    └── PlayMode/                   pruebas de integración en escena
```

---

## Arranque y escenas

- **`Bootstrap.unity`** es la única escena en el índice 0. Crea los servicios (guardado, audio, carga de escenas, red) y luego carga `MainMenu`.
- Las **zonas del mundo** se cargan de forma **aditiva** (`LoadSceneMode.Additive`): la escena de servicios nunca se descarga. Es el modelo que escala a un mundo de MMORPG por zonas.
- Escenas `Sandbox/` para prototipos: nunca entran al build.

### Estados del juego (máquina de estados global)
```
Boot → MainMenu → Loading → InWorld ⇄ Paused
                     ↑          │
                     └──────────┘ (cambio de zona)
```
Vive en `Bootstrap/GameStateMachine`. Cada estado entra/sale limpio; nada depende de "en qué escena estoy".

---

## Flujo de datos de un frame (patrón de referencia)

```
Input System ──► PlayerInputReader ──► Intent (MoveIntent / UseAbilityIntent)
                                          │
                                          ▼
                          PlayerController (Gameplay) valida y llama a Core
                                          │
                                          ▼
                     Core.Combat / Core.Stats (reglas puras) ──► resultado
                                          │
                                          ▼
                          Eventos (DamageDealt, HealthChanged, AbilityUsed)
                             │                    │                │
                             ▼                    ▼                ▼
                         HUD (UI)            VFX/Audio        Animator
```

En online: el intent viaja al servidor, el servidor ejecuta el mismo `Core` y devuelve el resultado. La flecha del medio cambia de lugar; el resto no se toca.

---

## Modelo de entidades

Un personaje (jugador o enemigo) se arma con componentes:

| Componente | Responsabilidad | Datos desde |
|---|---|---|
| `CharacterStats` | Expone los stats calculados (Core.Stats) | `ClassDefinition` / `EnemyDefinition` |
| `Health` | Vida, daño recibido, muerte (eventos) | stats |
| `Mover` | Movimiento (CharacterController o NavMeshAgent) | stats (velocidad) |
| `AbilityCaster` | Lista de habilidades, cooldowns, casteo | `AbilityDefinition[]` |
| `Targetable` | Puede ser objetivo; equipo/facción | definición |
| `AnimatorBridge` | Traduce estado a parámetros del Animator | — |
| `EnemyBrain` (solo IA) | FSM de comportamiento | `EnemyDefinition` |

El jugador agrega `PlayerController` (intents → componentes). El enemigo agrega `EnemyBrain`. El resto es igual: **la misma pieza sirve para ambos**.

---

## Dónde va cada cosa

| Necesito… | Va en | Patrón |
|---|---|---|
| Una fórmula, regla o cálculo (daño, XP, drop) | `Scripts/Core/<Sistema>/` | C# puro + test EditMode |
| Datos editables (ítem, habilidad, enemigo) | definición en `Scripts/Core/` o `Gameplay/`, instancia en `Data/` | ScriptableObject (Flyweight) |
| Algo que se mueve o reacciona en escena | `Scripts/Gameplay/<Área>/` | Componente |
| Comportamiento de enemigo | `Scripts/AI/` | State / Strategy |
| Leer controles o toques | `Scripts/Input/` | Command (intents) |
| Una pantalla o widget | `Scripts/UI/` + `Prefabs/UI/` | MVP |
| Guardar/cargar, red, servicios del SO | `Scripts/Infrastructure/` | Interfaz en Core, implementación acá |
| Objetos que aparecen y desaparecen seguido (proyectiles, números de daño, VFX) | quien los usa + `ObjectPool` | Object Pool |
| Herramienta para el editor | `Scripts/Editor/` | — |
| Un asset de terceros | `ThirdParty/<Paquete>/` + `ASSETS_REGISTRY.md` | — |

**Regla de ascenso:** algo que nace dentro de un área y lo empieza a usar una segunda área sube a `Core/` (si es regla) o a `UI/Common/` (si es widget). Igual que en el orquestador de apps: se mueve, no se duplica.

---

## Stack técnico base

| Necesidad | Elección | Estado |
|---|---|---|
| Render | URP con perfiles Mobile-Low / Mobile-High / PC | decidido |
| Input | Input System (nuevo) + joystick táctil propio | decidido |
| Cámara | Cinemachine (tercera persona) | decidido |
| UI | uGUI para HUD (rendimiento probado en móvil); UI Toolkit para menús | revisar en M1 |
| Texto | TextMeshPro | decidido |
| Navegación IA | AI Navigation (NavMesh) | decidido |
| Carga de contenido | Addressables (a partir de M2) | planificado |
| Pruebas | Unity Test Framework (EditMode + PlayMode) | decidido |
| Multijugador | a decidir en M3 (ver `domains/multiplayer.md`) | pendiente — ADR |
| Inyección de dependencias | raíz de composición propia en `Bootstrap/` (sin framework al inicio) | decidido; revisar VContainer si crece |
| Control de versiones | Git + Git LFS | decidido |
