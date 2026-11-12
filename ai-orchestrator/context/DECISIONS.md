# DECISIONS — registro de decisiones de arquitectura (ADR)

Formato: `templates/ADR.md`. Las decisiones no se borran; si cambian, se agrega una nueva que reemplaza a la anterior.

---

## ADR-001 — Motor: Unity 6 LTS + URP, lenguaje C#
- **Fecha:** 2026-11-11 · **Estado:** aceptada
- **Contexto:** juego 3D con gráficos modernos, destino móvil (Android + iOS), desarrollador aprendiendo, necesidad de escalar calidad visual con el tiempo y apoyarse en IA.
- **Opciones:** motor propio C++/SDL3 (probado en MiRPG) · Godot 4 · Unreal Engine 5 · Unity 6.
- **Decisión:** Unity 6 LTS con URP.
- **Por qué:** estándar de la industria en móviles; URP da iluminación PBR, sombras, postprocesado y Shader Graph sin programar el render; exporta a Android e iOS desde el mismo proyecto; C# es accesible y muy bien soportado por herramientas de IA. Unreal se reserva para un futuro proyecto de PC/consola; el motor propio quedó como ejercicio de aprendizaje.
- **Consecuencias:** se depende de las licencias de Unity (Personal gratis bajo el umbral de ingresos vigente); la versión se fija por proyecto.

## ADR-002 — Simulación en C# puro + intents (preparado para online)
- **Fecha:** 2026-11-11 · **Estado:** aceptada
- **Decisión:** las reglas del juego viven en `Game.Core` sin dependencias de Unity; el input se expresa como intents.
- **Por qué:** pruebas rápidas sin escena y reutilización en un servidor autoritativo en M3 sin reescribir gameplay.
- **Consecuencias:** un poco más de estructura al inicio (puente Core ↔ Gameplay).

## ADR-003 — Política de propiedad intelectual
- **Fecha:** 2026-11-11 · **Estado:** aceptada
- **Decisión:** solo assets propios o con licencia comercial registrada; se estudian otros juegos pero nunca se reutilizan sus assets, código, nombres ni mapas.
- **Por qué:** el juego debe poder publicarse y monetizarse sin riesgo legal.
- **Consecuencias:** rol `asset-ip-guardian` y `ASSETS_REGISTRY.md` obligatorios.

## ADR-004 — Orquestador separado del repo del juego
- **Fecha:** 2026-11-11 · **Estado:** aceptada
- **Decisión:** reglas, roles y estado en `ReloaderGamesCreator`; el repo del juego no contiene archivos de IA.
- **Por qué:** el repo del juego puede compartirse con otros sin exponer la automatización; el orquestador sirve para varios juegos.
