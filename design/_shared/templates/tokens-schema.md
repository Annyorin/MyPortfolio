---
type: template
env: 02-design-system
status: active
updated: 2026-09-02
source: адаптировано из Pixel Perfect / quickstart.md (секция 1.4)
---

# Схема токенов дизайн-системы

Каноническая структура foundations. Используется при создании или импорте токенов
в среде `02-design-system/` и зеркалировании в `05-code/tokens/`.

**Правило:** конкретные hex и размеры — из проекта (Figma, бандл, CSS студента).
Этот файл задаёт **структуру**, не дефолтные значения.

---

## JSON-схема

```json
{
  "color": {
    "brand":    { "<token>": "<hex>" },
    "neutral":  { "<token>": "<hex>" },
    "accent":   { "<token>": "<hex>" },
    "semantic": { "<role>/<state>": "{color.<group>.<token>}" }
  },
  "space":      { "<key>": "<px>" },
  "radius":     { "<key>": "<px>" },
  "shadow":     { "<key>": "<css-shadow>" },
  "typography": {
    "family": { "heading": "<font-stack>", "body": "<font-stack>" },
    "style": {
      "<group>/<size>": {
        "family": "heading|body",
        "size": "<px>",
        "line": "<px>",
        "weight": "<num>",
        "tracking": "<num?>"
      }
    }
  }
}
```

---

## Правила заполнения

### Цвета

Обязательно четыре группы:

| Группа | Содержимое |
|--------|------------|
| `brand` | фирменные цвета (1–3) |
| `neutral` | серая шкала (3–9 ступеней) + black + white |
| `accent` | link, success, danger, warning, info — только используемые |
| `semantic` | **только алиасы** через `{color.group.token}`, без hex |

### Spacing

Сетка **4 pt**. Минимальный набор ключей: `0, 1, 2, 3, 4, 5, 6, 7, 8`
(= 0 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 px). Крупные шаги — по факту, не «на будущее».

### Radius

4–6 ключей: `sm`, `md`, `lg`, `xl`, `2xl`, `full` (`full` = 9999).

### Shadow

2–4 уровня: например `card`, `modal`, `focus`. Значения — валидные CSS `box-shadow`.

### Typography

11 базовых стилей (набор для Text Styles в Figma):

- `heading/3xl`, `heading/2xl`, `heading/xl`, `heading/lg`, `heading/md`, `heading/sm`
- `body/xl`, `body/lg`, `body/md`, `body/sm`
- `caption`

Размеры и line-height — из Figma, бандла или решения дизайнера. Если кастомный шрифт
не зарегистрирован в Figma — fallback на Inter, пометить в `sync-log.md`.

---

## Куда класть в метасреде

| Этап | Путь |
|------|------|
| Описание foundations (текст) | `02-design-system/foundations/` |
| Манифест для соседних сред | `02-design-system/outputs/ds-manifest.md` |
| Код (зеркало) | `05-code/tokens/` — `tokens.css`, `tokens.ts`, `typography.ts` |

Импорт: Figma (`get_variable_defs`), бандл (`handoff-to-figma`), `style-decompose` → `STYLE_GUIDE`.

---

## Semantic → CSS

Семантические цвета — алиасы на base. В CSS:

```css
:root {
  --color-bg-default: var(--color-white);
  --color-text-primary: var(--color-neutral-900);
}
```

В TypeScript — типобезопасный объект, ссылающийся на те же ключи.
