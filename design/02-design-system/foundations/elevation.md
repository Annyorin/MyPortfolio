---
type: foundation
group: elevation
env: 02-design-system
status: synced
source: figma
figma-node: "41:11646"
updated: 2026-09-06
---

# Радиусы и тени

## Shadow

| Токен | CSS | Значение | Применение |
|-------|-----|----------|------------|
| Shadow | `--Shadow` | `0 5px 9px #BBBBBD40` | Card hover, Sidebar |

Figma Effect: `DROP_SHADOW`, color `#BBBBBD40`, offset `(0, 5)`, radius `9`, spread `0`.

## Не привязывать

| Эффект | Значение (Figma) | Правило |
|--------|------------------|---------|
| вв | `4px 9px 18.7px #B1B3BB40` | **Не** привязывать к Card. Отдельный эффект в файле; для Card hover / Sidebar использовать только `Shadow`. |

## Радиусы

Отдельной коллекции радиусов в Ui kit нет — значения живут на компонентах (см. карточки).
