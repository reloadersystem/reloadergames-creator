# Domain — Build iOS

## Requisitos
- **Mac** con Xcode (versión exigida por la App Store vigente) y módulo **iOS Build Support** en Unity Hub.
- Cuenta **Apple Developer** (pago anual) para instalar en iPhone real, TestFlight y App Store. El simulador funciona sin cuenta.
- Desde Windows solo se puede **generar** el proyecto Xcode; compilar y firmar exige Mac (o Unity Build Automation / Mac en la nube).

## Configuración (Player Settings → iOS)
| Ajuste | Valor |
|---|---|
| Bundle Identifier | igual criterio que Android: `com.reloadergames.<juego>` |
| Target minimum iOS | revisar al cerrar M1 (según dispositivos objetivo) |
| Scripting Backend | IL2CPP (único disponible) |
| Graphics API | Metal |
| Texture compression | ASTC |
| Orientación | Landscape Left/Right |

## Flujo
1. Unity: Build Profiles → iOS → Build → carpeta `Builds/iOS/` (fuera del control de versiones).
2. Abrir `Unity-iPhone.xcodeproj` en Xcode → Signing & Capabilities → equipo de desarrollo.
3. Simulador para pruebas rápidas; iPhone real para rendimiento.
4. Archive → App Store Connect → TestFlight.

## Diferencias a cuidar respecto de Android
- Memoria más estricta en iPhones viejos: respetar el perfil `Mobile-Low`.
- Safe Area más agresiva (Dynamic Island, barra de inicio).
- Compras dentro de la app y notificaciones requieren capacidades específicas (cuando se agreguen → ADR).
