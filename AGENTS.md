# AGENTS.md — Punto de Entrada (para cualquier herramienta de IA)

Al iniciar cualquier sesión en este proyecto:

1. Leer `ai-orchestrator/MASTER_PROMPT.md`
2. Aplicar ese modelo sin pedir confirmación
3. Operar bajo ese sistema durante toda la sesión

No duplicar ni redefinir lógica aquí. Todo el comportamiento del sistema está definido en `ai-orchestrator/`.
Los roles del equipo están en `.claude/agents/` (cada archivo es la definición del rol; las herramientas que no soporten subagentes los usan como instrucciones de rol).
