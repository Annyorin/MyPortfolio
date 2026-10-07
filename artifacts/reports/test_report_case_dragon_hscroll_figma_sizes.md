# Отчёт: hscroll кадры → Figma 538:15864

## Задача
Подогнать `.case-page__picture--scroll` / `.case-page__hscroll-img` под канон Figma `538:15864` (530×269, pad 24, gap 8).

## Изменения
- `portfolio/css/case.css` — desktop `530×269` + `aspect-ratio 530/269`; mobile `min(530px, calc(100vw - 32px - 48px))` + height auto; убран override pad 16 у `--scroll` (остаётся 24).
- `tests/test_portfolio_case_dragon.mjs` — assert 530/269, запрет устаревших 349/280.

## Тесты
```
node --test tests/test_portfolio_case_dragon.mjs
→ 7/7 pass
```

## Браузер (localhost:5173, case-dragon `#context`)
| Метрика | Ожидание | Факт |
|---------|----------|------|
| кадр | 530×269 | 530×269 |
| aspect-ratio | 530/269 | 530/269 |
| border-radius кадра | 8 | 8px |
| Picture padding | 24 | 24px |
| Picture radius / bg | 32 / secondary | 32px / `#ededed` |
| track gap | 8 | 8px |
| Picture height | ~317 (24+269+24) | **330** (= 24 + 282 + 24; +13 от thin horizontal scrollbar у `.case-page__hscroll`) |

Scrollbar chrome не трогали (вне scope размеров кадра).

## Статус
completed
