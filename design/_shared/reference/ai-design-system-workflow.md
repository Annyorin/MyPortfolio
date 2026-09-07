# Как повторить пайплайн эфира: дизайн-система с ИИ

Файл собран как практическая инструкция: что поставить, какие скиллы использовать, какие промты вставлять и в каком порядке работать.

## Краткий вывод по материалам из эфира

В эфире авторы говорили, что в конце “скинут 5 скиллов в чатик”, но в расшифровке и доступных материалах прямых ссылок нет. Один подписчик нашёл похожие названия:

- `emil-design-eng`
- `design-loop`
- `handoff`
- `story-skills`

Что с ними:

| Название | Статус | Что делать |
|---|---:|---|
| `emil-design-eng` | Похоже, это реально нужный скилл про motion / polish / microinteractions | Ставим |
| `design-loop` | Есть публичные скиллы с похожим названием, по смыслу близко | Можно поставить, но лучше сделать свой |
| `handoff` | Название слишком общее, часто это не про Figma, а про передачу контекста | Лучше сделать свой |
| `story-skills` | Скорее всего, это не Storybook, а скиллы для написания историй | Не ставим |
| `style-decompose` | Точный публичный скилл не найден | Делаем свой |
| `ds-to-storybook` | Точный скилл из эфира не найден | Делаем свой |

Главное: их флоу — не один волшебный промт, а цепочка:

```txt
PRD / описание продукта
→ референсы
→ декомпозиция стиля
→ Claude Design
→ дизайн-loop: скрин → критика → правки
→ Figma MCP
→ Figma design system
→ Storybook / React components
```

---

# Часть 1. Что нужно поставить

## 1. Проверить Node.js

Открой Terminal и вставь:

```bash
node -v
npm -v
```

Если обе команды показали версии — ок.

Если `node` не найден, нужно поставить Node.js. Самый простой вариант — через официальный установщик Node.js или через Homebrew.

---

## 2. Установить Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Потом запустить:

```bash
claude
```

Он попросит залогиниться.

---

## 3. Создать рабочую папку

```bash
mkdir -p ~/ai-design-system-workflow
cd ~/ai-design-system-workflow

mkdir -p references screenshots outputs
touch PRD.md REFERENCES.md
```

---

## 4. Поставить Figma MCP

В Terminal:

```bash
claude plugin install figma@claude-plugins-official
```

Потом запусти Claude Code:

```bash
claude
```

Внутри Claude Code напиши:

```text
/mcp
```

Дальше выбери Figma → Authenticate → Allow Access.

---

## 5. Поставить найденный публичный Emil skill

Он нужен для анимаций, микровзаимодействий и визуального полишинга интерфейсов.

```bash
npx skills add https://github.com/emilkowalski/skill --skill emil-design-eng
```

---

## 6. Не ставить `story-skills`

Несмотря на название, это, скорее всего, не про Storybook, а про writing/storytelling.

Для нашей задачи нужен не `story-skills`, а свой скилл `ds-to-storybook`.

---

# Часть 2. Создать свои скиллы под флоу эфира

Вставь в Terminal весь блок:

```bash
mkdir -p ~/.claude/skills/style-decompose
mkdir -p ~/.claude/skills/design-loop-review
mkdir -p ~/.claude/skills/figma-ds-handoff
mkdir -p ~/.claude/skills/ds-to-storybook

cat > ~/.claude/skills/style-decompose/SKILL.md <<'EOF'
---
name: style-decompose
description: Разбирает визуальный референс на правила дизайн-системы: цвета, типографика, сетка, карточки, компоненты, do/don't и промт для Claude Design.
---

# Style Decompose

Ты senior product designer и design system architect.

## Цель
Разобрать визуальный референс не как “красивую картинку”, а как набор правил, которые можно применить к продуктовой дизайн-системе.

## Вход
Пользователь даёт:
- ссылку на Dribbble / Behance / сайт / скриншоты;
- описание продукта или PRD;
- ограничения по стеку, если есть.

## Процесс
1. Понять продукт: кто пользователь, какие сценарии, какие экраны нужны.
2. Разобрать референс:
   - visual DNA;
   - цветовая палитра;
   - типографика;
   - сетка;
   - композиция;
   - карточки;
   - кнопки;
   - формы;
   - таблицы;
   - графики;
   - тени;
   - радиусы;
   - иконки;
   - иллюстрации;
   - motion / microinteractions.
3. Отделить полезные системные принципы от декоративного мусора.
4. Сформировать STYLE-GUIDE.md.
5. Сформировать CLAUDE-DESIGN-PROMPT.md для генерации 2–3 насыщенных экранов.

## Output
Создай или обнови файлы:
- STYLE-GUIDE.md
- CLAUDE-DESIGN-PROMPT.md

## Важно
Не пиши “сделать красиво”. Формулируй конкретные правила:
- какие цвета;
- какие отступы;
- какие состояния;
- где использовать бордеры;
- где использовать тени;
- что запрещено;
- как избежать generic AI SaaS look.
EOF

cat > ~/.claude/skills/design-loop-review/SKILL.md <<'EOF'
---
name: design-loop-review
description: Критикует сгенерированные UI-экраны по style guide и выдаёт конкретный промт на следующую итерацию.
---

# Design Loop Review

Ты design director и product UI reviewer.

## Цель
Помочь довести Claude Design / UI-генерацию до нормального визуального уровня через цикл:
скрин → критика → промт на правки → новая версия.

## Вход
Пользователь даёт:
- screenshot / image / описание экрана;
- STYLE-GUIDE.md;
- PRD.md, если есть.

## Проверить
1. Соответствие visual DNA.
2. Иерархия.
3. Сетка и spacing.
4. Цвета и семантика.
5. Компонентность.
6. Избыточные бордеры.
7. Generic AI SaaS look.
8. Плохие бейджи / случайные теги.
9. Реализуемость в Figma / React.
10. Доступность: контраст, фокус, читаемость.

## Output
Дай ответ в структуре:

### Что уже хорошо
...

### Что плохо
...

### Что поправить
1. ...
2. ...
3. ...

### Промт для следующей итерации Claude Design
Сформируй готовый промт на английском.
EOF

cat > ~/.claude/skills/figma-ds-handoff/SKILL.md <<'EOF'
---
name: figma-ds-handoff
description: Собирает дизайн-систему в Figma через Figma MCP: foundations, variables, tokens, styles, components, variants, states.
---

# Figma Design System Handoff

Ты design system architect, работающий через Figma MCP.

## Цель
На основе PRD, STYLE-GUIDE.md и финальных экранов собрать дизайн-систему в Figma.

## Вход
Пользователь даёт:
- ссылку на Figma file;
- PRD.md;
- STYLE-GUIDE.md;
- финальный скрин / описание направления;
- список компонентов.

## Создать в Figma
Страницы:
1. 00 Cover
2. 01 Foundations
3. 02 Variables & Tokens
4. 03 Typography
5. 04 Components
6. 05 Patterns
7. 06 Example Screens

## Foundations
- color primitives;
- semantic colors;
- typography scale;
- spacing scale;
- radius scale;
- elevation / shadows;
- layout grid.

## Components
Минимум:
- Button
- Input
- Select
- Tabs
- Badge
- Card
- Table
- Modal
- Sidebar
- Header
- Chart Card
- Empty State
- Loading State
- Error State

## States
Для компонентов предусмотреть:
- default
- hover
- active
- focus
- disabled
- loading
- selected
- error

## Правила
- Использовать auto layout.
- Не делать лишние fixed height.
- Не плодить случайные цвета.
- Все цвета привязать к токенам.
- Компоненты должны быть пригодны для передачи в разработку.
- После сборки описать, что создано и что нужно проверить руками.
EOF

cat > ~/.claude/skills/ds-to-storybook/SKILL.md <<'EOF'
---
name: ds-to-storybook
description: Превращает дизайн-систему в React + TypeScript + Tailwind + Storybook component library.
---

# Design System to Storybook

Ты senior design engineer.

## Цель
Собрать живой Storybook по дизайн-системе.

## Вход
Пользователь даёт:
- DESIGN-SYSTEM-SPEC.md или STYLE-GUIDE.md;
- ссылку/описание Figma DS;
- стек проекта;
- список компонентов.

## Stack по умолчанию
- React
- TypeScript
- Tailwind
- Storybook

## Создать
1. Token files:
   - colors
   - typography
   - spacing
   - radius
   - shadows
2. Components:
   - Button
   - Input
   - Select
   - Tabs
   - Badge
   - Card
   - Table
   - Modal
   - Sidebar
   - Header
   - ChartCard
   - EmptyState
   - LoadingState
   - ErrorState
3. Stories:
   - variants
   - sizes
   - states
   - playground example

## Правила
- Не угадывать свойства компонентов.
- Все значения брать из design-system spec.
- Если чего-то не хватает — явно написать assumptions.
- Добавить stories для основных состояний.
- Добавить короткую документацию в Storybook.
- Проверить, что проект запускается.
EOF
```

После этого у тебя появятся 4 своих скилла:

```txt
style-decompose
design-loop-review
figma-ds-handoff
ds-to-storybook
```

---

# Часть 3. Подготовить входные файлы

## 1. Заполнить PRD.md

Открой файл:

```bash
open -a TextEdit ~/ai-design-system-workflow/PRD.md
```

Вставь шаблон:

```md
# Product brief

## Product
[Что это за продукт]

## Users
[Кто пользователи]

## Core scenarios
1. [Сценарий 1]
2. [Сценарий 2]
3. [Сценарий 3]

## Key screens
1. Dashboard / overview
2. Main working screen
3. Detail page
4. Settings
5. List / table page

## Components needed
Buttons, inputs, selects, tabs, badges, cards, tables, modals, sidebar, header, chart cards, empty states, loading states, error states.

## Visual direction
[Например: B2B, аккуратно, не маркетингово, современно, без лишнего glassmorphism]

## Technical constraints
Figma variables, React, TypeScript, Tailwind, Storybook.
```

---

## 2. Заполнить REFERENCES.md

```bash
open -a TextEdit ~/ai-design-system-workflow/REFERENCES.md
```

Вставь шаблон:

```md
# References

## Main visual references
1. [ссылка на Dribbble / Behance / сайт]
2. [ссылка на второй референс]

## What I like
- [например: плотные карточки]
- [например: мягкие тени вместо бордеров]
- [например: оранжево-синий акцент]

## What I don’t want
- generic AI SaaS
- random gradients
- too much glass
- unreadable small text
- decorative UI that is hard to implement
```

---

# Часть 4. Запустить пайплайн

## Шаг 1. Запустить Claude Code в папке проекта

```bash
cd ~/ai-design-system-workflow
claude
```

В Claude Code напиши:

```text
/style-decompose

Прочитай PRD.md и REFERENCES.md.

Сделай декомпозицию визуального стиля и собери:
1. STYLE-GUIDE.md
2. CLAUDE-DESIGN-PROMPT.md

Важно:
- мне нужна не лендинг-стилистика, а продуктовая дизайн-система;
- избегай generic AI SaaS;
- думай про Figma variables, components, states, Storybook;
- итоговый промт должен быть готов для вставки в Claude Design.
```

На выходе должны появиться:

```txt
STYLE-GUIDE.md
CLAUDE-DESIGN-PROMPT.md
```

---

## Шаг 2. Сгенерировать экраны в Claude Design

Открой Claude Design:

```txt
https://claude.ai/design
```

Создай новый дизайн и вставь содержимое `CLAUDE-DESIGN-PROMPT.md`.

Дополнительно попроси:

```text
Create 2 dense product screens on one canvas, side by side:

1. Dashboard overview
2. Main working screen

The goal is to test a future design system.

Include:
- sidebar
- header
- cards
- buttons
- inputs
- badges
- table/list
- chart cards
- selected/hover/loading/error states where relevant

Avoid generic AI SaaS visuals.
Avoid excessive borders.
Use the visual DNA from the style guide.
Make it practical for Figma, React, and Storybook.
```

Сделай скрин результата и сохрани его сюда:

```txt
~/ai-design-system-workflow/screenshots/v1.png
```

---

## Шаг 3. Прогнать дизайн-loop

Вернись в Claude Code и напиши:

```text
/design-loop-review

Оцени screenshots/v1.png по STYLE-GUIDE.md и PRD.md.

Дай:
1. что хорошо;
2. что плохо;
3. что выглядит как AI slop;
4. готовый промт для следующей итерации Claude Design.
```

Claude даст промт для следующей итерации.

Дальше:

1. скопируй промт;
2. вставь в Claude Design;
3. получи новую версию;
4. сохрани скрин как `screenshots/v2.png`;
5. повтори 2–3 раза.

Обычно достаточно 2–5 итераций.

---

## Шаг 4. Собрать Figma дизайн-систему

Создай пустой Figma-файл.

Скопируй ссылку на файл.

В Claude Code напиши:

```text
/figma-ds-handoff

Используй Figma MCP.

Figma file:
[вставь ссылку на файл]

Входные материалы:
- PRD.md
- STYLE-GUIDE.md
- screenshots/v2.png

Собери дизайн-систему:
1. foundations
2. variables & tokens
3. typography
4. components
5. variants and states
6. example screens

Компоненты:
Button, Input, Select, Tabs, Badge, Card, Table, Modal, Sidebar, Header, ChartCard, EmptyState, LoadingState, ErrorState.

Важно:
- auto layout;
- semantic tokens;
- не плодить цвета;
- состояния компонентов;
- пригодно для передачи разработчику.
```

После выполнения проверь руками в Figma:

- есть ли страницы;
- созданы ли переменные;
- компоненты собраны через auto layout;
- не нагенерировал ли он 100 случайных цветов;
- есть ли состояния компонентов;
- можно ли реально использовать компоненты в макетах.

---

# Часть 5. Собрать Storybook

## 1. Создать React-проект со Storybook

В Terminal:

```bash
cd ~/ai-design-system-workflow

npm create vite@latest ds-storybook -- --template react-ts
cd ds-storybook
npm install
npx storybook@latest init
```

Запусти Storybook:

```bash
npm run storybook
```

Если Storybook открылся в браузере — ок.

---

## 2. Добавить Storybook MCP

```bash
npx storybook add @storybook/addon-mcp
```

Перезапусти Storybook:

```bash
npm run storybook
```

---

## 3. Попросить Claude собрать компоненты

В новой вкладке Terminal:

```bash
cd ~/ai-design-system-workflow/ds-storybook
claude
```

В Claude Code напиши:

```text
/ds-to-storybook

У нас есть дизайн-система в соседней папке:
../STYLE-GUIDE.md
../PRD.md

Нужно собрать React + TypeScript + Tailwind + Storybook component library.

Сделай:
1. tokens
2. components
3. stories
4. playground examples

Компоненты:
Button, Input, Select, Tabs, Badge, Card, Table, Modal, Sidebar, Header, ChartCard, EmptyState, LoadingState, ErrorState.

Требования:
- визуально следовать STYLE-GUIDE.md;
- все цвета и размеры вынести в tokens;
- stories для variants / sizes / states;
- проверить запуск Storybook;
- если чего-то не хватает, явно напиши assumptions.
```

---

# Часть 6. Как понять, что получилось нормально

## Хороший результат

- Есть `STYLE-GUIDE.md`, а не просто “красивые картинки”.
- В Figma есть foundations, variables, tokens, styles.
- Компоненты имеют варианты и состояния.
- Цвета не случайные, а семантические.
- Компоненты можно использовать повторно.
- Storybook показывает реальные React-компоненты.
- У каждого компонента есть states / variants / playground.

## Плохой результат

- Claude сделал лендинг вместо продуктового интерфейса.
- Всё на случайных градиентах.
- Везде бордеры и бейджи.
- Нет токенов.
- Нет состояний.
- В Figma всё на группах, без auto layout.
- Storybook визуально не похож на Figma.
- Компоненты нельзя переиспользовать.

---

# Часть 7. Быстрые промты

## Промт на декомпозицию референса

```text
Ты — senior product designer и design system architect.

Задача: разобрать визуальный стиль референса и превратить его в правила для дизайн-системы.

Входные данные:
- Ссылка/скриншоты референса: [ссылка или изображения]
- Продукт: [кратко что за продукт]
- Контекст: дизайн-система для SaaS / B2B / web app

Сделай:
1. Определи визуальную ДНК референса:
   - цветовая палитра
   - типографика
   - сетка и композиция
   - карточки
   - кнопки
   - формы
   - таблицы
   - графики
   - тени / глубина / бордеры
   - радиусы
   - иконки
   - микровзаимодействия
2. Отдели то, что подходит для моего продукта, от декоративного мусора.
3. Сформируй style-guide.md:
   - foundations
   - tokens
   - component principles
   - do / don’t
   - anti-AI-slop rules
4. Сгенерируй промт для Claude Design, чтобы он сделал 2–3 насыщенных продуктовых экрана в этой стилистике.
```

---

## Промт для Claude Design

```text
Create a visual design direction for a SaaS product using the attached style guide and product brief.

Product:
[описание продукта]

Generate 2 screens on one canvas, side by side:
1. Dashboard overview
2. Main working screen / playground

Requirements:
- Make screens dense enough to test the design system: sidebar, header, cards, buttons, inputs, tables, charts, badges, states.
- Use the visual DNA from the reference, but adapt it to a real product UI.
- Avoid generic AI SaaS look.
- Avoid random borders everywhere.
- Use depth, spacing, hierarchy, and semantic color.
- Make it implementation-friendly for Figma + React + Storybook.
- Do not create a marketing landing page. This is a product interface.
```

---

## Промт для критики скрина

```text
Ты — design director и design system reviewer.

Оцени эти экраны по нашему style-guide.md.

Нужно:
1. Найти, что соответствует выбранной стилистике.
2. Найти, что выглядит как generic AI SaaS / AI slop.
3. Найти лишние бордеры, слабые тени, случайные бейджи, плохую иерархию.
4. Дать конкретный список правок для Claude Design.
5. Не предлагай абстрактное “сделать красивее”. Только конкретные визуальные инструкции.
```

---

## Промт для Figma MCP

```text
Через Figma MCP собери дизайн-систему в текущем Figma-файле.

Создай страницы:
1. Cover
2. Foundations
3. Variables & Tokens
4. Typography
5. Components
6. Patterns
7. Example Screens

Создай:
- primitive color tokens
- semantic color tokens
- typography styles
- effect styles
- spacing/radius tokens
- components with variants and states

Компоненты:
Button, Input, Select, Tabs, Badge, Card, Table, Modal, Sidebar, Header, ChartCard, EmptyState, LoadingState.

Требования:
- auto layout
- нормальные constraints
- без лишних fixed heights
- компоненты должны быть пригодны для разработки
```

---

## Промт для Storybook

```text
Создай Storybook для дизайн-системы.

Stack:
React + TypeScript + Tailwind + Storybook.

Сделай:
- token files
- components
- stories
- variants
- states
- playground examples
- subtle microinteractions

Компоненты должны визуально совпадать с Figma DS.
```

---

# Финальный порядок действий

```txt
1. Поставить Claude Code
2. Поставить Figma MCP
3. Поставить emil-design-eng
4. Создать 4 своих скилла
5. Заполнить PRD.md
6. Заполнить REFERENCES.md
7. Запустить /style-decompose
8. Получить STYLE-GUIDE.md и CLAUDE-DESIGN-PROMPT.md
9. Вставить промт в Claude Design
10. Получить первые 2 экрана
11. Сделать скрин v1.png
12. Запустить /design-loop-review
13. Повторить 2–5 итераций
14. Через /figma-ds-handoff собрать Figma DS
15. Создать Storybook-проект
16. Через /ds-to-storybook собрать React-компоненты
17. Проверить Figma и Storybook руками
```

---

# Самое важное

Не начинай с команды:

```text
Сделай мне красивую дизайн-систему
```

Начинай с:

```text
Разбери стиль, сформулируй правила, собери style guide, потом сгенерируй экраны, потом критикуй, потом только собирай Figma DS.
```

Именно это отличает нормальный результат от обычной ИИ-каши.
