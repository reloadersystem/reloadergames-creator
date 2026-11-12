# Design Patterns — catálogo para desarrollo de juegos

Cada patrón: **problema que resuelve → cuándo usarlo → dónde vive en el proyecto → error típico a evitar**.
Antes de inventar una estructura, buscar acá. Si se adopta un patrón nuevo, agregarlo a este archivo.

---

## 1. Component (composición)
- **Problema:** jerarquías de herencia profundas (`Character → Enemy → FlyingEnemy → Boss`) que no se pueden combinar.
- **Cuándo:** siempre, para cualquier entidad de la escena.
- **Dónde:** `Gameplay/Characters/` — `Health`, `Mover`, `AbilityCaster`…
- **Evitar:** el "God MonoBehaviour" de 2000 líneas que hace todo (`Player.cs` con movimiento, combate, inventario y UI).

## 2. State / Máquina de estados (FSM, jerárquica si crece)
- **Problema:** `if` anidados con banderas (`isAttacking && !isDead && isGrounded…`) que se contradicen.
- **Cuándo:** IA de enemigos, estados del jugador (Idle/Move/Cast/Stunned/Dead), estado global del juego.
- **Dónde:** base genérica en `Core/StateMachine/`; estados concretos en `AI/` y `Gameplay/Player/`.
- **Evitar:** estados que se conocen entre todos; las transiciones se declaran en un solo lugar.

## 3. Command / Intents
- **Problema:** el input modifica el mundo directamente y no se puede reproducir, deshacer ni enviar por red.
- **Cuándo:** todo input del jugador; acciones que deban ir al servidor; repeticiones (replays) y pruebas automáticas.
- **Dónde:** intents en `Core/Intents/`; lectura en `Input/`; ejecución en `Gameplay/Player/`.
- **Evitar:** leer `Input` dentro de componentes de gameplay. Solo `Input/` toca el Input System.

## 4. Observer / Canales de eventos
- **Problema:** la vida del jugador cambia y hay que avisar a HUD, sonido, cámara y logros sin que `Health` los conozca.
- **Cuándo:** comunicación entre sistemas de capas distintas o que no deben conocerse.
- **Dónde:** eventos C# (`event Action<…>`) dentro de una entidad; **canales ScriptableObject** (`Data/Events/`) para eventos globales (ej. `OnPlayerDied`).
- **Evitar:** olvidar desuscribirse (`OnEnable`/`OnDisable` siempre en pareja); eventos por string (`SendMessage`, `BroadcastMessage`).

## 5. Flyweight con ScriptableObjects (datos compartidos)
- **Problema:** 200 lobos con los mismos datos duplicados en cada prefab; balancear obliga a tocar todos.
- **Cuándo:** toda definición estática: ítems, habilidades, enemigos, clases, tablas de nivel, loot.
- **Dónde:** clases `*Definition` en Core/Gameplay; instancias `.asset` en `Data/`.
- **Evitar:** guardar estado de partida dentro de un ScriptableObject (en el editor persiste y contamina datos). Definición = inmutable en runtime.

## 6. Strategy
- **Problema:** cada habilidad o comportamiento con su propio `switch` gigante.
- **Cuándo:** habilidades (proyectil, área, curación, buff), comportamientos de IA (agresivo, cobarde, a distancia), fórmulas intercambiables.
- **Dónde:** `Gameplay/Abilities/` (`IAbilityEffect` + implementaciones referenciadas desde `AbilityDefinition`).
- **Evitar:** heredar habilidades entre sí; combinar efectos componiendo una lista de estrategias.

## 7. Object Pool
- **Problema:** `Instantiate`/`Destroy` constante → picos del recolector de basura (GC) → tirones en el celular.
- **Cuándo:** proyectiles, números de daño, partículas, enemigos que reaparecen, elementos de listas largas.
- **Dónde:** `UnityEngine.Pool.ObjectPool<T>` dentro del sistema que lo usa.
- **Evitar:** objetos del pool que no reinician su estado al reutilizarse.

## 8. Composition Root / Service Locator acotado
- **Problema:** singletons en todos lados (`GameManager.Instance.Player.Inventory…`) imposibles de testear.
- **Cuándo:** servicios globales: guardado, audio, carga de escenas, red, plataforma.
- **Dónde:** `Bootstrap/` crea y registra servicios por **interfaz** (definidas en Core). Los consumidores reciben la interfaz.
- **Evitar:** que cualquier clase pida cualquier servicio en cualquier momento; pedir servicios solo al inicializar.

## 9. MVP para UI (Model–View–Presenter)
- **Problema:** scripts de UI que calculan reglas del juego.
- **Cuándo:** toda pantalla o widget con datos.
- **Dónde:** `UI/<Área>/` — `View` (solo muestra, MonoBehaviour), `Presenter` (escucha eventos del modelo, formatea, actualiza la vista).
- **Evitar:** que la vista lea directo de componentes de gameplay en `Update()`.

## 10. Factory / Spawner
- **Problema:** crear entidades configuradas correctamente desde muchos lugares.
- **Cuándo:** aparición de enemigos, jugadores remotos, drops.
- **Dónde:** `Gameplay/World/` — `EnemySpawner` usa `EnemyDefinition` + pool.
- **Evitar:** `Instantiate` + configuración manual repetida en cada script.

## 11. Dirty flag y cálculo bajo demanda
- **Problema:** recalcular stats totales cada frame.
- **Cuándo:** stats con modificadores (equipo, buffs), caminos de IA, textos de UI.
- **Dónde:** `Core/Stats/` — recalcula solo cuando cambia un modificador.

## 12. Partición espacial / gestión de interés (para online)
- **Problema:** en un MMORPG cada cliente no puede recibir ni procesar a todos los jugadores del mundo.
- **Cuándo:** desde M3 (online).
- **Dónde:** servidor + `Infrastructure/Networking/`.
- **Nota:** se diseña cuando se elija la tecnología de red (`domains/multiplayer.md`).

---

## Anti-patrones prohibidos (en código runtime)

| Prohibido | Usar en su lugar |
|---|---|
| `FindObjectOfType` / `GameObject.Find` en runtime | referencia serializada o servicio inyectado |
| `GetComponent` en `Update` | cachear en `Awake` |
| `SendMessage`, tags y nombres como string | eventos tipados, componentes, capas |
| Lógica de juego en la UI | Presenter + reglas en Core |
| Singletons para todo | Composition Root (#8) |
| `Instantiate`/`Destroy` en ráfagas | Object Pool (#7) |
| Asignaciones de memoria (`new`, LINQ, strings) en `Update` | cachear, pools, `StringBuilder` |
| Campos `public` para exponer al Inspector | `[SerializeField] private` |
| Corrutinas para todo el flujo del juego | máquina de estados; corrutinas solo para secuencias locales |
