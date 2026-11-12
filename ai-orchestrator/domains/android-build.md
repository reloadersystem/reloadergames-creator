# Domain — Build Android

## Requisitos
- Módulo **Android Build Support** + **OpenJDK** + **Android SDK & NDK Tools** instalados desde Unity Hub (Unity usa sus propias versiones; no mezclar con el SDK de Android Studio).
- Android Studio solo se usa para el **emulador** y, opcionalmente, para abrir el proyecto Gradle exportado.

## Configuración (Player Settings → Android)
| Ajuste | Valor |
|---|---|
| Package Name | `com.reloadergames.<juego>` (definitivo antes de la primera subida a Play) |
| Minimum API Level | Android 8.0 (API 26) — revisar al cerrar M1 |
| Target API Level | el más alto exigido por Google Play |
| Scripting Backend | IL2CPP |
| Target Architectures | ARM64 (+ x86_64 solo para builds de prueba en emulador) |
| Graphics APIs | Vulkan, OpenGLES3 |
| Texture compression | ASTC |
| Orientación | Landscape Left/Right |

## Tipos de build
| Build | Para qué | Opciones |
|---|---|---|
| Desarrollo | probar en emulador/dispositivo con Profiler | Development Build + Autoconnect Profiler + Script Debugging |
| Release interno | pruebas de jugadores | APK, sin Development Build |
| Tienda | Google Play | **AAB** (App Bundle), firmado con keystore de release |

## Firma
- El **keystore de release** se crea una sola vez y se guarda **fuera de todo repo** (gestor de contraseñas + copia de seguridad). Perderlo = no poder actualizar el juego en Play.
- Nunca se commitea `.keystore`/`.jks` ni sus contraseñas.

## Probar en el emulador
1. Iniciar el emulador desde Android Studio (Device Manager).
2. Unity: File → Build Profiles → Android → **Run Device** = el emulador → *Build And Run*.
3. Logs: `adb logcat -s Unity`.

## Versionado
`Version` visible (`1.2.3`) + `Bundle Version Code` entero que **siempre sube en 1**. Se registra en `PROJECT_CONTEXT.md`.
