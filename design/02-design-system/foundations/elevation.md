---
type: foundation
group: elevation
env: 02-design-system
status: synced
source: figma
figma-node: "41:11646"
updated: 2026-09-13
---

# Радиусы и тени

## Shadow

| Токен | CSS | Значение | Применение |
|-------|-----|----------|------------|
| Shadow | `--shadow` | `0 5px 9px #BBBBBD40` | Card default + hover, Sidebar, SegmentsControl active pill |
| Mobile | `--shadow-mobile` | `0 3px 9px #8B8B8E40` | MenuMobile |

Figma Effect Shadow: `DROP_SHADOW`, color `#BBBBBD40`, offset `(0, 5)`, radius `9`, spread `0`.  
Figma Effect Mobile (MenuMobile `245:17643`): offset `(0, 3)`, radius `9`, color `#8B8B8E40`.

## Не привязывать

| Эффект | Значение (Figma) | Правило |
|--------|------------------|---------|
| вв | `4px 9px 18.7px #B1B3BB40` | **Не** привязывать к Card. Отдельный эффект в файле; для Card (default и hover) / Sidebar / SegmentsControl pill использовать только `Shadow`. |

## Радиусы

Отдельной коллекции радиусов в Ui kit нет — значения живут на компонентах (см. карточки).
