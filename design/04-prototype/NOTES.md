---
type: notes
env: 04-prototype
updated: 2026-09-06
---

# Рабочие заметки

Прогресс длинных задач этой среды. Читается и дополняется только внутри среды.

## Активная задача
Портфолио.Главная задокументирована (зеркало **0.1.2**, `screens/portfolio-home.md`, flow, SCREEN-MAP, build-log). Canvas-спека + Storybook coverage noted. `use_figma` не вызывался — эталон `41:1416`.

## Открытые вопросы
_нет_

## Решения
- Эталон продукта = `41:1416` (1024×609); витрина DS = `41:11646` (reference).
- Comp/Stiker — bbox сцены, не atomic витрины (Stiker на сцене ~87×63 vs 81×32).
- Три Card = один демо InnoDragon из content-package.
- Canvas: zoom 25–400%, Tapper world; pan clamp AABB+1×viewport; contacts без URL; focus-visible.
- Storybook inventory coverage only — код вне design/.
