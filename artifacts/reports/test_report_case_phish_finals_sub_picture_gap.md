# Отчёт: InnoPhish `#finals` gap picture → «Синк с разработкой»

## Задача
20px между `div.case-page__picture--inline.case-page__picture--center` и соседним `h3.case-page__text-sub` «Синк с разработкой».

## Измерение (до)
- DOM-порядок: picture **перед** h3 (не после).
- `text-block` flex `gap: 8px`; у `--inline` был только `margin-top: 12px`, `margin-bottom: 0`.
- Layout gap picture → Sync: **8px** (collapse нет — flex).
- У Dragon уже `margin-bottom: 12px` → layout gap **20px**.

## Правка
`portfolio/css/case.css` — то же `margin-bottom: 12px` для phish `#finals` `.case-page__picture--inline` (рядом с dragon).

## Verify
| Страница | Пара | Layout gap |
|----------|------|------------|
| phish `#finals` | inline-center → «Синк…» | **20** |
| phish `#finals` | body→scroll, scroll→inline | 20 (без регрессии) |
| dragon `#finals` | inline → «Синк…» | **20** |
| dragon `#finals` | inline → inline | **24** |

URL: http://localhost:5173/portfolio/case-phish.html#finals

Коммит не делался.
