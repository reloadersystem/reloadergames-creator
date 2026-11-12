# Domain — Pipeline de arte 3D (Blender → Unity)

## Reglas de modelado
- Escala: **1 unidad = 1 metro**. Un humano mide ~1.8 m.
- Origen (pivot) en la base del objeto (pies del personaje, centro inferior del prop).
- Aplicar transformaciones antes de exportar (Ctrl+A → All Transforms).
- Nombres según `CONVENTIONS.md → Nombres de assets` (`SK_`, `SM_`, `A_`…).
- Presupuestos de triángulos y texturas: `PERFORMANCE_BUDGETS.md → Por asset`.
- LODs: sufijo `_LOD0`, `_LOD1`, `_LOD2` en el mismo archivo → Unity arma el LOD Group.

## Exportación
| Formato | Uso | Ajustes clave |
|---|---|---|
| **FBX** | personajes con esqueleto y animaciones | Forward **-Z**, Up **Y**, *Apply Transform*, sin luces ni cámaras, *Add Leaf Bones* desactivado |
| **glTF/GLB** | props estáticos (opcional) | requiere paquete glTFast en Unity |

## Personajes y animación
- Esqueleto compatible con **Humanoid** de Unity → las animaciones se reutilizan entre personajes (retargeting).
- Fuente rápida de animaciones: **Mixamo** (ver condiciones en `assets-licencias.md`).
- Clips mínimos por personaje: Idle, Walk, Run, Attack_01–03, Cast, Hit, Death, Jump (si aplica).
- Animator: Blend Tree de locomoción por velocidad + capas para ataques.

## Texturas y materiales
- Flujo PBR metallic: `_D` (color), `_N` (normal), `_MRA` (metal/rugosidad/oclusión empaquetados).
- Atlas / trim sheets para props y edificios (menos materiales = menos draw calls).
- Import en Unity: ASTC, *Generate Mip Maps* en 3D, sin mipmaps en UI.

## IA y Blender
Se puede conectar Blender con Claude mediante un servidor MCP de la comunidad (Blender MCP) para generar o modificar escenas por instrucciones. Todo lo generado es arte propio; cualquier modelo o textura descargada pasa por `assets-licencias.md`.

## Flujo de un asset
```
concepto/referencia ─► blockout (gris) ─► modelo final ─► UV + texturas ─► rig (si aplica)
   ─► export FBX ─► Assets/_Project/Art/ ─► material URP ─► prefab PF_ ─► prueba en escena + perf
```
Responsable: `technical-artist` (pipeline) con revisión de `qa-performance` (presupuesto).
