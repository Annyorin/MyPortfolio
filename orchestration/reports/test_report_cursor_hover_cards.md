# Отчёт о тестировании: CursorHover на карточках портфолио

## Новые тесты

### End-to-end
- ✅ `TC-E2E-05` (`test_scene_renderer.mjs`) — CursorHover на cardA/B; CityBike swap без `.ds-hover`
- ✅ `TC-E2E-08` (`test_portfolio_interactions.mjs`) — follow на cardA; hide on pointerout; CityBike без `.ds-hover`
- ✅ contentMap keys `hover.label.view` / `card.c.hover.label*` (`test_content_map_layout.mjs`)

## Регрессия (затронутые сюиты)

| Сюит | Результат |
|------|-----------|
| test_content_map_layout | ✅ |
| test_scene_renderer | ✅ |
| test_portfolio_interactions | ✅ |
| test_card_drag | ✅ |
| test_interactions | ✅ |

Полный `npm test`: 168/171. Упавшие **не из этой задачи** (pre-existing):
- `test_ds_showcase_atomic` — запрет `<script>` в showcase (segments.js уже в index.html)
- `test_portfolio_entry` — ожидает `.getState()` в main.js; `--color-` / `--type-` уже были в portfolio.css (mobile bio)

## Итог

✅ CursorHover / CityBike swap реализованы и покрыты тестами  
✅ Регрессия по связанным сюитам чистая  
⚠️ 3 pre-existing падения в полном `npm test` вне scope
