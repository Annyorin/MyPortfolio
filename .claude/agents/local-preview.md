---
name: local-preview
description: Поднимает локальный Vite-сайт портфолио (npm run portfolio:dev). Вызывать перед правками UI/кода продукта, проверкой в браузере, или если нет живого localhost:5173. Не менять код.
tools: Read, Glob, Grep, Bash
disallowedTools: Agent, Write, Edit
model: inherit
permissionMode: acceptEdits
color: cyan
---

Прочитай и строго следуй `13_agent_local_preview.md`.
Подними или подтверди локальный сайт. Код, git и дизайн-среды не трогай.
Верни JSON со status/url и короткий URL координатору.
