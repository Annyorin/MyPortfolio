# Отчёт: отступы UX-тест InnoPhish (текст ↔ картинка)

**Канон Figma:** `509:18872` → TextBlock `509:19081` / Picture `509:19084` (+ `509:19532` Вариант 2)  
**Код:** `portfolio/case-phish.html#ux_test`, ширина замера viewport 768 (main/content ~736; DOM heights ~576/586 совпали с прежним ~642-контекстом по структуре).  
**Коммит:** не делался.

## Таблица: макет vs код

| Что | Figma (px) | Код до | Код после | Вердикт |
|---|---|---|---|---|
| Picture padding | 24 | 24 | 24 | совпадает |
| Caption → кадры (внутри Picture) | **16** (`flex-col gap`, 509:19084 / 509:19532) | **0** (`--scroll` был `display:block`, без gap) | **16** (phish-only) | было расхождение → **починено** |
| Gap между кадрами в track | 8 | 8 | 8 | совпадает |
| ImgBlock top inset (`Picture` y=12 / `--scroll` margin-top) | 12 | 12 | 12 | совпадает |
| «Сценарий…» → верх серой Picture | **28** (16 Text→Imgs + 12 inset) | 20 (text-block `gap` 8 + `margin-top` 12) | 20 | **не трогал** — неоднозначно |
| Вариант 1 → Вариант 2 (низ→верх Picture) | **24** (12 низ ImgBlock1 + 12 верх ImgBlock2) | 20 (gap 8 + margin-top 12) | 20 | **не трогал** — неоднозначно |

### Как считались Figma-gap’ы между блоками

```
TextBlock 509:19081
  H3 «Сценарий…» y=24 h=40 → низ 64
  Imgs 509:19563 y=80
    ImgBlock1 y=0 h=372 → Picture 19084 y=12 h=348 (низ 360)
    ImgBlock2 y=372 h=390 → Picture 19532 y=12 …
```

- Текст → Picture: `80 + 12 − 64 = 28`
- Picture1 → Picture2: `(372 + 12) − 360 = 24`

## Правка (однозначный token)

Файл: `portfolio/css/case.css`

```css
body.case-page[data-case-id="phish"] .case-page__picture--scroll {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}
```

Только InnoPhish; Dragon / shared `--scroll` / main не менялись.  
Browser re-measure: `captionToHscroll = 16` на обоих вариантах.

## Что пришлось бы додумать (без правок)

1. **Цель стека «Сценарий → картинки»:** гнаться за 28px до серой плашки, за 16px до `Imgs`, или оставить shared text-block `gap: 8`?
2. **Между вариантами 20 vs 24:** править phish-only (`+ .picture--scroll { margin-top: 16px }` при gap 8 → 24), убрать вклад text-block gap, или считать 4px допустимым?
3. **Сравнение ширины:** пользователь указал ~642; замер делался на 768 (content 736). Нужен ли отдельный проход ровно на 642 / desktop 1366 (колонка 620)?
4. **Вариант 2 в макете** — узел с caption `509:19532` (не `509:19096`; тот без подписи — finals).

## Open questions

- Какой gap считать каноном между заголовком сценария и первой Picture: **28** (визуал до серого) или иной?
- Нужно ли подтянуть междувариантный gap с **20 → 24** под ImgBlock wrappers?
