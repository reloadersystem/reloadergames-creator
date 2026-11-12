# Domain — Referencia de estudio: cliente móvil de un MMORPG (ingeniería inversa)

Análisis hecho el 2026-11-11 sobre el APK de un servidor privado de un MMORPG de PC portado a Android.
**Solo conocimiento técnico.** Ningún asset, código, nombre ni dato de ese juego se usa en nuestros proyectos (`assets-licencias.md`).

## Qué encontramos
| Aspecto | Hallazgo |
|---|---|
| Motor | **Propio en C++** sobre SDL3 (no Unity/Unreal). Java mínimo: `SDLActivity` + un servicio en primer plano |
| Gráficos | Vulkan con respaldo OpenGL ES 3; ~50 FPS en celular |
| Contenido | Reutiliza los archivos originales del juego de PC (mapas, modelos, texturas, animaciones) descargados por un parcheador |
| Red | Cliente TCP propio con RSA + zlib contra el servidor existente |
| Ciclo de vida | Servicio en primer plano mantiene la sesión al minimizar; al cerrar estando en el mundo hace logout limpio con espera de 15 s |
| Herramientas de desarrollo | Variables de entorno para host, puerto, resolución, semilla aleatoria y medidor de rendimiento; capturas automáticas por tiempo |
| Controles | Joystick izquierdo, rueda de habilidades derecha, accesos rápidos de pociones, minimapa, chat |
| Build | Publicado con `debuggable=true` (error de seguridad) |

## Lecciones aplicadas a nuestra arquitectura
1. **El contenido es el 90 % de un MMORPG.** Ellos heredaron 20 años de contenido; nosotros empezamos pequeño (vertical slice) y escalamos contenido con datos (ScriptableObjects, Addressables).
2. **Motor propio = meses de trabajo** solo para llegar a donde Unity ya está. Por eso usamos Unity (ADR-001).
3. **Herramientas de desarrollo desde el día uno**: configuración por entorno, medidor de FPS/ms, capturas automáticas → en nuestro proyecto: menú de depuración + `Scripts/Editor/`.
4. **Logout limpio y sesión en segundo plano** son requisitos reales del online móvil → anotados para M3 (`multiplayer.md`).
5. **Mejorar gráficos = nuevo renderer sobre datos existentes.** Nuestra versión: arte producido para el perfil alto y perfiles URP que degradan (`ARCHITECTURE.md → Principio 7`).
6. **Nunca publicar builds `debuggable`** → checklist de `android-build.md`.

## Material de estudio local (solo en la PC Windows, fuera de los repos)
`C:\Users\resem\Documents\ShaiyaDecompose\` — notas del análisis (README.md, manifest decodificado, Java decompilado).
