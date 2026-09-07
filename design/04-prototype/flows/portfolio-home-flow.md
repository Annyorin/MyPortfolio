---
type: flow
env: 04-prototype
status: built
mirror-version: 0.1.2
updated: 2026-09-06
---

# Flow: Портфолио.Главная

Один продуктовый экран + жесты камеры (не отдельные экраны).

```
                    ┌─────────────────────────────────┐
                    │  Портфолио.Главная · 41:1416    │
                    │  frame 1024×609 · canvas world  │
                    └─────────────────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
   Zoom (Tapper −/+,         Pan (Space+drag→           UI states
    bare +/−, Shift+0,        grab/grabbing;             (Card hover,
    Ctrl/Cmd =/+/−/0,         over Card/Link/Contacts    contacts no URL,
    Shift+1 fit AABB,         pan wins, no click;        focus-visible,
    Ctrl/Cmd+wheel→cursor;    wheel pan + optional       broken-image:
    step ~10–25%; 25%…400%;   MMB; preventDefault)       keep slot geom)
    preventDefault;           narrow start: zoom-to-fit
    Tapper=world)
```

| Узел | Спецификация | node-id | Роль |
|------|--------------|---------|------|
| Портфолио.Главная | [`../screens/portfolio-home.md`](../screens/portfolio-home.md) | `41:1416` | единственный экран flow |
| DS Showcase (reference) | [`../screens/ds-showcase.md`](../screens/ds-showcase.md) | `41:11646` | витрина DS / Storybook inventory — не продуктовая навигация |

## Жесты камеры (кратко)

| Жест | Результат |
|------|-----------|
| Tapper − / +; bare +/−; Ctrl/Cmd =/+/−/0; Shift+0 → 100%; Shift+1 fit | zoom; шаг ~10–25%; 25%…400%; pivot 100% = центр viewport; fit = AABB Sidebar+3×Card+Comp+Stiker+Tapper |
| Ctrl/Cmd+wheel | zoom к курсору; `preventDefault` на холсте |
| Space+drag (grab→grabbing); wheel; optional MMB+drag | pan; **UC-04 A1:** над интерактивами pan приоритетнее клика, пока Space зажат; `preventDefault` на wheel pan |
| Viewport &lt; 1024×609 | старт = **zoom-to-fit**; эталон сверки ≥1024×609 |
| Битый image | слот не схлопывается; warn; сцена жива |

Межэкранных переходов нет. Storybook-каталог покрывает инвентарь DS и реализуется вне `design/`.
