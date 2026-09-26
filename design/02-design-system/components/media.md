---
type: ds-component
env: 02-design-system
status: synced
figma-node: "41:11477"
updated: 2026-09-26
---

# Media

## Назначение
Медиа-ассеты витрины: фоны, фото-блоки, портрет, девайс-мок, cover кейсов, композит About me и декоративные стикеры About.

## Анатомия
Растровый / fill-фрейм или SVG-стикер фиксированного размера.
**About me** — композит из трёх инстансов (не плоский растр).
**MacbookPng** — один растровый прямоугольник (крышка со стикерами).

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
| **About me** | `391:22957` | **209.61×116.01** | композит: me + Macbook (−10°) + Stiker «Обо мне» |
| **MacbookPng** | `391:22958` | **310×226** | плоский прелоад: одна картинка крышки со стикерами |
| SityBike | `164:11800` | 308×190 | cover CityBike — см. `sitybike.md` |
| Dragon | `232:16826` | 308×190 | cover InnoDragon — см. `dragon.md` |
| Phish | `232:16829` | 308×190 | cover InnoPhish — см. `phish.md` |
| anime | `248:17091` | ~100×92 | стикер About (в Macbook `248:17115`) |
| books | `248:17095` | ~99×85 | стикер About |
| create | `248:17099` | ~61×60 | стикер About |
| question | `248:17103` | ~40×48 | стикер About |
| seal | `248:17111` | 144×60 | стикер About |
| sport | `248:17104` | ~122×104 | стикер About |

### About me (`391:22957`)
Композитный символ Ui kit. Home instance: **`391:22959`**. Класс продукта: **`.ds-about-me`** (локальная геометрия ниже).

Frame (Plugin API): **209.61×116.01**. Paint order: **me → Macbook → Stiker**.

| Слой | instance / node | Роль | Локальная геометрия (rel. About me) | Ассет |
|------|-----------------|------|-------------------------------------|-------|
| me | `391:22897` ← `105:11564` | портрет | x **0**, y **10.2**, **83.45×83.45**, rot **+12.596°** | `images/me.png` |
| Macbook | `391:22898` ← `248:17115` | крышка + стикеры | x **84.98**, y **5**, **126×92**, rot **−10°** | layered: `macbook-lid.png` + `stickers/*`; collapsed flat: **MacbookPng** |
| Stiker | `391:22899` ← `41:1517` | бейдж «Обо мне» | x **29**, y **78**, **81×32**, rot **0** | компонент Stiker (не растр) |

#### Роли light / dark
| Роль | light | dark |
|------|-------|------|
| surface (фон секции / холст вокруг композита) | `--White` `#FEFEFE` | `--Black` product `#232323` |
| stiker fill | White `#FEFEFE` | **остаётся White `#FEFEFE`** (не remap на surface `#232323`) |
| stiker text | Primary `#2D97F7` | Primary `#2D97F7` (на белом fill) |

Stiker на home dark (`386:20585`) **не** перекрашивается в product Black — только surface вокруг композита.

### MacbookPng (`391:22958`)
Плоский прелоад / collapsed preview: **одна** картинка крышки уже со стикерами. Без me и без Stiker.

| Поле | Значение |
|------|----------|
| Figma | rounded-rectangle `391:22958` · **310×226** |
| Ассет | `images/macbook-png.png` |
| Product keys | `macbook` и `macbook.png` → оба на `macbook-png.png` |
| Supersedes | `macbook-248-17115.png` и старый About Macbook AABB **140.61×111.01** |
| Отличие от Macbook | layered `248:17115` = lid + stickers отдельно; MacbookPng = baked raster |

### Стикеры (точные bbox из design_context Macbook `248:17115`)
| Имя | node-id | W×H | Ассет |
|-----|---------|-----|-------|
| anime | `248:17091` | 100.027×91.717 | `stickers/anime.svg` |
| books | `248:17095` | 99×85 | `stickers/books.svg` |
| create | `248:17099` | 61×60 | `stickers/create.svg` |
| question | `248:17103` | 40×48 | `stickers/question.svg` |
| seal | `248:17111` | 144×60 | `stickers/seal.svg` |
| sport | `248:17104` | 122×104 | `stickers/sport.svg` |

## Состояния
default

## Токены
| Свойство | Токен |
|----------|-------|
| media fills | контентные ассеты (`me.png`, `macbook-lid.png`, stickers, `macbook-png.png`) |
| About me surface | `--White` / `--Black` (product) по теме light/dark |
| About me stiker fill | White `#FEFEFE` в light и dark |
| About me stiker text | Primary `#2D97F7` |

## Правила применения
Подставлять в Card / макеты / About; не использовать как интерактивные контролы.
**About me** — канон живой композиции About; класс `.ds-about-me` = локальная геометрия Plugin API выше.
**MacbookPng** — только прелоад / collapsed flat без слоёв me/Stiker; keys `macbook` / `macbook.png`.
На сцене Портфолио · Главная instance **`391:22959`** сверять с компонентом `391:22957`, не с atomic Macbook **388×283**.
**SityBike** — `sitybike.md`. **Dragon** / **Phish** — отдельные карточки cover (как SityBike).
Стикеры — декоратив для About / Macbook composition; в Ui kit также вложены в Macbook `248:17115`.
На Портфолио · Главная стикеры Macbook (expanded) — **PNG** (`macbook.sticker.*`) поверх `macbook.lid`; SVG остаются для витрины DS.

## Чем не является
Не Card (Card = интерактивная композиция вокруг медиа).
About me ≠ MacbookPng (композит ≠ плоский растр).
MacbookPng ≠ Macbook layered (`248:17115`).
