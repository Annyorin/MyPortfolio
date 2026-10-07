# Отчёт: caption→картинка gap 16 на InnoDragon `--scroll`

**Задача:** тот же flex-col `gap: 16px` между caption и hscroll, что уже был у InnoPhish.  
**Коммит:** не делался.

## Правка

Файл: `portfolio/css/case.css`

Селектор caption→frames расширен на dragon (phish hug/crop overrides не трогались):

```css
body.case-page[data-case-id="phish"] .case-page__picture--scroll,
body.case-page[data-case-id="dragon"] .case-page__picture--scroll {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}
```

Тесты: assert на общий селектор в `tests/test_portfolio_case_dragon.mjs` и `tests/test_portfolio_case_phish.mjs`.

## Проверка в браузере

URL: http://localhost:5173/portfolio/case-dragon.html

| Что | Результат |
|---|---|
| Dragon `--scroll` computed | `display:flex`, `gap:16px` |
| Dragon UX captions | на `--inline` (уже `gap:16`); `caption→img = 16` |
| Dragon `--scroll` с caption | в контенте сейчас нет (context scroll без подписи); правило готово |
| Phish UX scroll + caption | `captionToHscroll = 16` (без регрессии) |

## Тесты

```
node --test tests/test_portfolio_case_dragon.mjs tests/test_portfolio_case_phish.mjs
→ 17 pass, 0 fail
```

## Изменённые файлы

- `portfolio/css/case.css`
- `tests/test_portfolio_case_dragon.mjs`
- `tests/test_portfolio_case_phish.mjs`
- `artifacts/reports/test_report_case_dragon_caption_scroll_gap.md`
