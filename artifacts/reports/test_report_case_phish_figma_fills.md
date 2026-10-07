# Отчёт: InnoPhish Figma fills + hscroll

## Задача
Обновить body-картинки кейса InnoPhish по Figma `509:18872`; orphan `business` удалить; UX/finals — отдельные fills + `imgscroll` как Dragon; lightbox `*-full` для слотов кейса. Главную (`phish.png` / card pipeline) не трогать.

## Изменённые / новые файлы

### Код / контент
- `shared/content.js` — маркеры `imgscroll` для test_2tabs / test_3tabs / final_1; assets без `business`; hero → `case-phish-hero.png`; fulls для ia/flow/test_*/final_*
- `portfolio/js/case.js` — optional caption у `[[imgscroll:…|caption]]`
- `portfolio/case-phish.html` — hero src → `case-phish-hero.png`

### Ассеты (`ds-showcase/assets/images/`)
**Заменены / добавлены:**  
`case-phish-hero.png`, `case-phish-hero-full.png`, `case-phish-competitors.png`+`-full`, `case-phish-ia.png`+`-full`, `case-phish-flow.png`+`-full`, `case-phish-test-2tabs.png`+`-2` (+fulls), `case-phish-test-3tabs.png`+`-2`+`-3` (+fulls), `case-phish-final-1.png`+`-2` (+fulls), `case-phish-final-2.png`+`-full`

**Удалены:** `case-phish-business.png` (+ ключ `case.phish.business`)

**Не тронуты:** `phish.png`, `card-innophish.png`, `img-2.png`, `lq/phish.webp`, `lq/card-innophish.webp`, `main.html`

### Тесты / docs
- `tests/test_portfolio_case_phish.mjs`
- `tests/test_card_image_quality.mjs`
- `portfolio/.AGENTS.md`, `ds-showcase/assets/.AGENTS.md`, `tests/.AGENTS.md`

## Как работает hscroll
Маркеры `[[imgscroll:key1,key2[,key3]|caption?]]` → `.case-page__picture--scroll` + `.case-page__hscroll` (кадры 530×269, `object-fit: cover`, gap 8). При overflow — класс `is-scrollable`, drag и кнопка «Открыть экраны в просмотре» (lightbox strip). Подпись UX-вариантов — caption в маркере.

| Слот | Маркер | Кадры |
|------|--------|-------|
| UX 2 tabs | imgscroll + caption | test_2tabs, test_2tabs_2 |
| UX 3 tabs | imgscroll + caption | test_3tabs, _2, _3 |
| final_1 | imgscroll | final_1, final_1_2 |
| final_2 | img (center) | final_2 |

Примечание: fill `586:15616` в Figma отдаёт сломанный crop (~19×160); display `test-3tabs-3` собран cover-crop из raw fill сверху (514×320), full — исходный raw.

## Тесты

### Запущено
```
node --test tests/test_portfolio_case_phish.mjs tests/test_portfolio_case_dragon.mjs tests/test_card_image_quality.mjs
```
### Итог: 27/27 PASSED, 0 failed

## Браузер
URL: http://localhost:5173/portfolio/case-phish.html

- Hero: `case-phish-hero.png` / full `case-phish-hero-full.png`
- Inline fulls: competitors, ia, flow, final_2
- 3× `.case-page__picture--scroll` (2tabs / 3tabs / final_1); 3tabs `is-scrollable` при широкой галерее
- `business` в DOM отсутствует

## Итог
✅ Задача выполнена  
✅ Коммит не создавался
