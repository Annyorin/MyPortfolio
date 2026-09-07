---
type: invariants
status: active
updated: 2026-09-02
source: адаптировано из Pixel Perfect / quickstart.md (раздел «Что ОБЯЗАТЕЛЬНО держать в голове»)
---

# Инварианты Figma ↔ код

Обязательные правила при работе с дизайн-системой в двух зеркалах: Figma (среда 2, 4)
и код (среда 5). Нарушение любого пункта — технический долг, который нужно закрыть
в той же итерации.

Краткая выжимка для агента — в [`AGENTS.md`](../../AGENTS.md), раздел «Инварианты».

---

## 1. Только токены, без захардкоженных значений

Цвета, размеры, отступы, радиусы и шрифты **не пишутся напрямую** в компонентах.
Единственный источник значений — каталог `05-code/tokens/` (CSS-переменные, TS, конфиг
проекта).

| Где закреплено |
|----------------|
| [`05-code/AGENTS.md`](../../05-code/AGENTS.md) — рабочий цикл, п. 4 |
| [`.cursor/rules/50-code-scope.mdc`](../../.cursor/rules/50-code-scope.mdc) |
| скилл `ds/design-system-sync` — фаза извлечения токенов |

---

## 2. Имена один в один

Компонент в React и в Figma называется **одинаково**. Свойство варианта в Figma =
проп в React. Расхождение имён ломает Code Connect и сверку паритета.

| Где закреплено |
|----------------|
| [`02-design-system/figma/registry.md`](../../02-design-system/figma/registry.md) — реестр имён и node-id |
| [`05-code/outputs/code-manifest.md`](../../05-code/outputs/code-manifest.md) — трассировка к манифесту DS |
| скилл `ds/design-system-sync` — фаза Code Connect |

---

## 3. Синхронизация сразу, без накопления долга

Каждая значимая итерация — **мгновенное зеркалирование**: изменил в Figma → обновил
описание и реестр в среде 2 → отразил в `ds-manifest.md` → при необходимости в коде.
Не откладывать «синк на потом».

| Где закреплено |
|----------------|
| [`02-design-system/AGENTS.md`](../../02-design-system/AGENTS.md) — рабочий цикл |
| [`AGENTS.md`](../../AGENTS.md) — поток данных между средами |
| [`.cursor/rules/20-design-system-isolation.mdc`](../../.cursor/rules/20-design-system-isolation.mdc) — инвариант «текст = Figma» |

---

## 4. Сверка паритета после каждой значимой итерации

После изменения компонента, токена или экрана — **проверка соответствия** Figma и кода
(parity check). Расхождения фиксируются явно, а не замалчиваются.

| Как делать | Где закреплено |
|------------|----------------|
| Скилл `ds/design-system-sync`, фаза 5.1 | [`.cursor/skills/ds/subskills/design-system-sync/SKILL.md`](../../.cursor/skills/ds/subskills/design-system-sync/SKILL.md) |
| Шаблон отчёта | [`_shared/templates/parity-report.md`](parity-report.md) |
| Рабочий файл | `05-code/parity-report.md` или `05-code/reports/parity-YYYY-MM-DD.md` |
| Формальное ревью макета | скилл `quality/design-review` |

---

## 5. Технические ограничения записи в Figma

При создании и правке узлов через Figma MCP:

- **Не вызывать** `resize(W, 0)` на auto-layout — ломает вёрстку.
- **Не создавать** узел TEXT без привязки текстового стиля (`setTextStyleIdAsync`).

| Где закреплено |
|----------------|
| [`.cursor/skills/infra/subskills/figma-mcp/SKILL.md`](../../.cursor/skills/infra/subskills/figma-mcp/SKILL.md) — раздел «Ошибки записи» |
| скиллы `ds/handoff-to-figma`, `build/figma-to-proto` — надстройки над `figma-mcp` |

---

## 6. Перезапуск IDE после настройки MCP

После создания или изменения конфигурации MCP (`.cursor/mcp.json` или аналог в Cursor)
— **перезапустить IDE**, иначе сервер Figma может не подхватиться.

| Где закреплено |
|----------------|
| [`.cursor/skills/infra/subskills/figma-mcp/SKILL.md`](../../.cursor/skills/infra/subskills/figma-mcp/SKILL.md) — первичное подключение |

---

## Карта пересечений (что уже было в метасреде)

| Правило | Было до этого файла | Статус |
|---------|---------------------|--------|
| Только токены | `05-code/AGENTS.md`, `50-code-scope.mdc`, `design-system-sync` | дополнено ссылками |
| Имена 1:1 | частично в `registry.md`, Code Connect | оформлено явно |
| Синк сразу | `02-design-system/AGENTS.md`, инвариант дрейфа | оформлено явно |
| Parity check | дрифт в `design-system-sync` | названо и привязано |
| resize / TEXT style | **не было** | добавлено в `figma-mcp` |
| Рестарт IDE | **не было** | добавлено в `figma-mcp` |
