---
name: handoff-to-figma
description: Взять хендофф-бандл из Claude Design (tar.gz с CSS + JSX + дока-страницей UI-кита) и собрать дизайн-систему в Figma через Figma MCP — Variables (Primitive → Semantic), стили (text/effect/paint), компоненты (ComponentSet с вариантами). Использовать когда есть бандл/описание UI-кита и просят «перенести в Figma», «собрать ДС в Figma», «через MCP воссоздать», «сделать копию плейбука в Figma».
---

# handoff-to-figma — перенос ДС в Figma через MCP

## Среда

`02-design-system/`, строгая изоляция. Перед любой записью в Figma — загрузи
`infra/subskills/figma-mcp`.

Текстовые артефакты до MCP-записей: `02-design-system/foundations/` или `ds/`
внутри среды (`foundation.md`, `components.md`). Публичный выход среды —
`outputs/ds-manifest.md`.

Берёт результат Claude Design (хендофф-бандл) и строит из него **настоящую** дизайн-систему в Figma: переменные, стили, компоненты. Обёртка над глобальным скиллом `figma-ds`. Каждый прогон — **в свежий, пустой Figma-файл** (создать новый через MCP), с нуля под текущий бандл.

## Подготовка
1. Распаковать бандл (`tar xzf`), прочитать `README.md` (хендофф для агентов) и **чаты** (`chats/`) — там интент.
2. Прочитать **источник истины по стилю**: главный CSS (токены + классы) + дока-JSX (компоненты, гейджи, чарты). Файл, открытый при хендоффе, — приоритетный.
3. Распарсить токены в `ds/foundation.md` (Primitive + Semantic) по схеме
   [`_shared/templates/tokens-schema.md`](../../../../../design/_shared/templates/tokens-schema.md) —
   **апрув текста до MCP-записей** (инвариант figma-ds).

## Сборка в Figma (порядок)

> Перед `use_figma` всегда грузить гайд `figma-use` (MCP-ресурс). Работать инкрементально,
> возвращать node ID, проверять скриншотами. Технические грабли — в
> `infra/subskills/figma-mcp/reference.md`.

### Батчи (порядок обязателен)

Id из предыдущего батча нужны для следующего. После **каждого** батча обновляй
[`02-design-system/figma/mirror-map.json`](../../../../../design/02-design-system/figma/mirror-map.json)
(шаблон структуры: [`_shared/templates/figma-mirror-map.json`](../../../../../design/_shared/templates/figma-mirror-map.json)).

| Батч | Что создаём |
|------|-------------|
| 0 | Страницы: `01 — Tokens`, `02 — Components`, `03 — Demo`. Переключиться на Tokens |
| 1 | Variable Collections: Colors (mode Light), Spacing, Radius |
| 2 | Base Color Variables: Brand, Neutral, Accent — hex из foundations |
| 3 | Semantic Color — алиасы `VARIABLE_ALIAS` на base |
| 4 | Spacing и Radius как FLOAT Variables |
| 5 | Text Styles из typography (применять через `setTextStyleIdAsync`) |
| 6 | Effect Styles: тени, subsurface |
| 7+ | Component Sets: atoms → molecules → organisms. Варианты = React props 1:1 |
| Финал | На `03 — Demo` — frame только из инстансов |

**Идемпотентность:** перед созданием искать по имени; совпало → update. Удалять —
только с подтверждением пользователя.

**Token Reference (рекомендуется):** на странице `01 — Tokens` — свотчи, типо-шкала,
spacing, radius, shadows для визуальной проверки.

### Детали по слоям
1. **Variables · Primitive** — все цвета (плоские; альфа в значении), числа (радиусы/отступы/размеры). Scopes выставлять явно.
2. **Variables · Semantic** — алиасы (`VARIABLE_ALIAS`) на Primitive (surface/text/accent/status/radius). Прибитых значений нет.
3. **Стили** (в Variables не живут): TextStyles `DS/*` (включая дот-матричный шрифт для halftone-цифр), EffectStyles `DS/*` (тени + subsurface-свечение через Inner Shadow ×N), PaintStyles `DS/*` (градиенты canvas/карточек/кнопок).
4. **Foundation-секция** — свотчи палитры, типо-шкала, радиусы, тени (видно и проверяемо).
5. **Компоненты** — реальные `ComponentSet`/`Component` (`createComponent` + `combineAsVariants`). Fills/radius — Variables; типографика — TextStyles; тени — Effect/Paint Styles. Имена вариантов `Property=value` (Tone/State/Active/Size).
6. **SVG-графика** (гейджи/чарты) — генерить точную геометрию и `createNodeFromSvg` (dasharray/градиенты/clipPath импортируются корректно).

## Инварианты (из figma-ds CONTRACT)
- Компоненты — настоящие ComponentNode, не фреймы. Auto Layout везде. Semantic → alias к Primitive. Один файл на проект. Никаких MCP-записей до апрува текстовых артефактов. Курсив не использовать.

## Ориентир объёма (типовая ДС)
Полная ДС обычно ≈ несколько десятков Primitive + Semantic переменных, ~7–9 text / effect / paint стилей, ~20–35 компонентов с осями Tone/State/Active/Size. Конкретные числа — из текущего бандла.

## На эфире
Вживую — создать свежий файл, собрать Variables + 1–2 компонента (эффектно и быстро). Полную сборку всех компонентов вживую не гнать (долго) — показать метод на части.

## Выход
- Figma-файл с Variables + стилями + UI-китом.
- `ds/foundation.md`, `ds/components.md`, `ds/CONTRACT.md`.
- Готовность к `ds-to-storybook`.
