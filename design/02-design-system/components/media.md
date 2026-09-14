---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:11477"
updated: 2026-09-14
---

# Media

## Назначение
Медиа-ассеты витрины: фоны, фото-блоки, портрет, девайс-мок, cover кейсов и декоративные стикеры About.

## Анатомия
Растровый / fill-фрейм или SVG-стикер фиксированного размера.

## Варианты
| Вариант | node-id | Размер | Когда |
|---------|---------|--------|-------|
| IMG_BG | `41:11477` | 345×230 | фон |
| IMG_1 | `41:11479` | 345×230 | фото 1 (атом Ui kit; продукт `img-1.png` = Dragon cover) |
| IMG_2 | `41:11478` | 345×230 | фото 2 (атом Ui kit; продукт `img-2.png` = Phish cover) |
| IMG_3 | `41:11476` | 345×345 | фото квадрат |
| Comp | `41:11511` | ~160×120 | композитный превью-блок |
| me | `105:11564` | 254×254 | портрет / about |
| Macbook | `248:17115` | **388×283** | девайс-мок + стикеры (было `247:16308`) |
| SityBike | `164:11800` | 308×190 | cover CityBike — см. `sitybike.md` |
| Dragon | `232:16826` | 308×190 | cover InnoDragon — см. `dragon.md` |
| Phish | `232:16829` | 308×190 | cover InnoPhish — см. `phish.md` |
| anime | `244:17347` | ~100×91 | стикер About |
| books | `244:17349` | ~84×73 | стикер About |
| create | `244:17346` | ~62×62 | стикер About |
| question | `244:17348` | ~59×69 | стикер About |
| seal | `244:17350` | 144×60 | стикер About |
| sport | `245:17642` | ~102×87 | стикер About |

### Стикеры (точные bbox из design_context)
| Имя | node-id | W×H | Ассет |
|-----|---------|-----|-------|
| anime | `244:17347` | 99.946×90.718 | `stickers/anime.svg` |
| books | `244:17349` | 83.733×72.658 | `stickers/books.svg` |
| create | `244:17346` | 62.35×62.352 | `stickers/create.svg` |
| question | `244:17348` | 58.546×69.452 | `stickers/question.svg` |
| seal | `244:17350` | 144×60 | `stickers/seal.svg` |
| sport | `245:17642` | 101.749×87.114 | `stickers/sport.svg` |

## Состояния
default

## Токены
| Свойство | Токен |
|----------|-------|
| — | контентные ассеты, не color-tokens |

## Правила применения
Подставлять в Card / макеты / About; не использовать как интерактивные контролы.
На сцене Портфолио · Главная (`41:1416`) размер **Comp** и bbox **Macbook** сверять по bbox сцены, не только atomic витрины (см. drift в `figma/sync-log.md`).
**SityBike** — `sitybike.md`. **Dragon** / **Phish** — отдельные карточки cover (как SityBike).
Стикеры — декоратив для About / Macbook composition; в Ui kit также вложены в Macbook `248:17115`.
На Портфолио · Главная стикеры Macbook — **PNG** (`macbook.sticker.*`) поверх `macbook.lid`; SVG остаются для витрины DS.

## Чем не является
Не Card (Card = интерактивная композиция вокруг медиа).
