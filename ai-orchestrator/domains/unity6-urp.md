# Domain — Unity 6 + URP

## Versión
- Unity **6.x LTS** (instalada en Windows: `6000.4.1f1`). Toda máquina del equipo usa la **misma versión exacta**; cambiar de versión es una decisión (ADR) y se hace en una rama.
- Plantilla al crear el proyecto: **Universal 3D** (URP).

## Checklist de configuración inicial (M0)
| Ajuste | Dónde | Valor |
|---|---|---|
| Serialización de assets | Project Settings → Editor | **Force Text** |
| Archivos meta | Project Settings → Version Control | **Visible Meta Files** |
| Espacio de color | Player → Other Settings | **Linear** |
| Input | Player → Active Input Handling | **Input System Package (New)** |
| Scripting backend | Player → Android/iOS | **IL2CPP** |
| Arquitecturas Android | Player → Android | **ARM64** (+ **x86_64** para probar en emulador del PC) |
| API gráfica Android | Player → Android | **Vulkan** + OpenGLES3 de respaldo |
| Nivel de API .NET | Player | .NET Standard 2.1 |
| Calidad | Project Settings → Quality | perfiles `Mobile-Low`, `Mobile-High`, `PC`, cada uno con su URP Asset |
| Enter Play Mode | Editor | sin recarga de dominio (más rápido) cuando el código lo soporte |

## Paquetes base (Package Manager)
Input System · Cinemachine · TextMeshPro · AI Navigation · Unity Test Framework · Addressables (desde M2) · Shader Graph y VFX Graph (vienen con URP; VFX Graph solo en dispositivos con compute).
Agregar un paquete es una decisión: se anota en `PROJECT_CONTEXT.md`.

## URP por perfiles
- Un **URP Asset + Renderer** por perfil en `Assets/_Project/Settings/`.
- Mobile: Forward+, MSAA 2× (High) / sin MSAA (Low), HDR solo en High, Depth/Opaque Texture solo si un efecto lo necesita.
- Postprocesado con **Volumes** (`Settings/Volumes/`): perfil global + perfiles por zona.
- Iluminación: 1 direccional en tiempo real + iluminación horneada (Adaptive Probe Volumes o lightmaps) + Reflection Probes.

## `.gitignore` y `.gitattributes` del repo del juego
- `.gitignore`: usar la plantilla oficial de Unity de GitHub (`Library/`, `Temp/`, `Obj/`, `Build*/`, `Logs/`, `UserSettings/`, `*.csproj`, `*.sln`…).
- `.gitattributes` (LFS):
```
*.fbx filter=lfs diff=lfs merge=lfs -text
*.blend filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.tga filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.exr filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text
*.ttf filter=lfs diff=lfs merge=lfs -text
*.otf filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.unity merge=unityyamlmerge eol=lf
*.prefab merge=unityyamlmerge eol=lf
*.asset merge=unityyamlmerge eol=lf
*.meta eol=lf
*.cs diff=csharp text eol=lf
```

## MCP de Unity (opcional)
Si se conecta un servidor MCP para el editor de Unity, Claude puede crear GameObjects, escenas y prefabs sin editar YAML a mano. Hasta entonces: pasos en el editor o scripts de editor (`OPERATING_MODEL.md → Archivos de Unity`).
