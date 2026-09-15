/**

 * Content Map (architecture §4.1 / §4.2).

 * Canonical demo strings and AssetRef keys for Storybook and Portfolio.

 * Orthography from Figma/content-package is preserved; hanging prepositions use NBSP (shared/typography.js).

 */



/** @typedef {{ pathFromDsRoot: string, intrinsicWidth?: number, intrinsicHeight?: number }} AssetRef */



/**

 * @type {Record<string, string> & {

 *   chipVariants: Record<string, "active" | "default">,

 *   contactUrls: Record<string, string>,

 *   assets: Record<string, AssetRef>

 * }}

 */

export const contentMap = {

  "profile.name": "Аня Ясинская",

  "profile.role": "Продуктовый дизайнер",

  "sidebar.bio":

    "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.",

  "chip.b2b": "B2B",

  "chip.b2c": "B2C",

  "chip.design_system": "Design System",

  "chip.ai_prototyping": "AI-prototyping",

  "chip.sample.default": "B2B",

  "chip.sample.active": "B2B",

  "contact.cv": "Резюме",

  "contact.telegram": "Написать",

  "contact.linkedin": "LinkedIn",

  "contact.behance": "Behance",

  "contact.mail": "Почта",

  "sidebar.copyright": "Annyorina © 2026",

  "link.sample": "Link",

  "stiker.label": "Обо мне",

  "hint.create": "Всегда пробую что-то новое в\u00A0творчестве))",

  "hint.question": "Мне нравится участвовать в\u00A0различных квизах",

  "hint.sport": "Я люблю танцевать!",

  "hint.anime": "Фанат аниме со\u00A0стажем более 15 лет)",

  "hint.seal": "Обожаю байкальских нерп, они очень милые:)",

  "hint.books": "Люблю читать книги:) От\u00A0психологии до\u00A0фентези с\u00A0комиксами",

  "hover.label": "Behance",

  /* CursorHover on case cards (InnoDragon / InnoPhish); Figma 260:24115 */
  "hover.label.view": "Посмотреть",

  "card.title": "CityBike",

  "card.meta": "· 2024",

  "card.description":
    "Приложение для аренды электрических велосипедов. Удобный и экологичный транспорт по доступным ценам. Экономия времени в одно касание.",

  "card.url":
    "https://www.behance.net/gallery/211908269/E-bike-Rental-Mobile-App-for-Android",

  /* Figma Card Property 1=default 40:1208 — DS showcase / Storybook kit sample */
  "card.kit.title": "Title",
  "card.kit.meta": "· 2024-2026",
  "card.kit.description":
    "Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени.",
  "card.kit.chip": "B2C",

  "card.a.title": "InnoDragon",
  "card.a.meta": "· 2024-2026",
  "card.a.description":
    "Система управления безопасностью. Позволяет организациям эффективно защищать свои сети и активы в реальном времени.",
  "card.a.chip": "B2B",
  "card.a.url": "case-dragon.html",

  "case.dragon.period_label": "Период выполнения",
  "case.dragon.period_value": "2024–2026 год",
  "case.dragon.platforms_label": "Платформы",
  "case.dragon.platforms_value": "Desktop",
  "case.dragon.role_label": "Моя роль",
  "case.dragon.team_label": "Команда",
  "case.dragon.context_title": "Контекст задачи",
  "case.dragon.context_body":
    "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.",
  "case.dragon.intro_title": "Вводные",
  "case.dragon.intro_body":
    "Создаю чистые интерфейсы. Благодаря бэкграунду программиста легко нахожу общий язык с разработкой и стейкхолдерами. Ответственно решаю продуктовые задачи и постоянно развиваюсь.",
  "case.dragon.contact_heading": "Свяжитесь со мной",
  "case.dragon.contact_sub":
    "Буду рада познакомиться и обсудить новые проекты",
  "case.dragon.next_label": "Далее",
  "case.dragon.next_url": "case-phish.html",
  "case.dragon.toolbar_title": "InnoDragon",
  "case.dragon.header_brand": "Аня Ясинская · Портфолио",
  "toolbar.back": "Назад",

  "card.b.title": "InnoPhish",
  "card.b.meta": "· 2024–2026",
  "card.b.description":
    "Для\u00A0ИБ — сводка обучения и\u00A0атак в\u00A0одном дашборде вместо Excel-склейки.",
  "card.b.chip": "B2B",
  "card.b.url": "case-phish.html",

  "case.phish.period_label": "Период выполнения",
  "case.phish.period_value": "2024–2026",
  "case.phish.platforms_label": "Платформы",
  "case.phish.platforms_value": "Desktop",
  "case.phish.role_label": "Моя роль",
  "case.phish.role_value":
    "UX/UI дизайнер. Зона: UX-исследование, макеты в\u00A0Figma, согласование с\u00A0руководством, дизайн-ревью, тестирование на\u00A0пользователях.",
  "case.phish.team_label": "Команда",
  "case.phish.team_value": "4 фронта, 4 бэка +\u00A0дизайнер",
  "case.phish.context_title": "Контекст задачи",
  "case.phish.context_body":
    "Делали пробные рассылки через EvilGo и\u00A0собирали статистику через него. В\u00A0наблюдаемой кампании ~60% переходов по\u00A0ссылкам — сигнал уязвимости аудитории до\u00A0сводного дашборда, не\u00A0эффект редизайна. Org-сводки «обучение +\u00A0атаки» не\u00A0было.\n\nСпециалист по\u00A0социнженерии и\u00A0руководитель анализа не\u00A0могут за\u00A0один заход собрать актуальную картину обучения и\u00A0атак: метрики разнесены, связки атака↔обучение нет, сигнала риска на\u00A0сводке нет.\n\nВремя до\u00A0сводки уходит в\u00A0Excel-склейку. Исследование и\u00A0продуктовое решение вынесли отдельную страницу сводной аналитики InnoPhish. ФИО топа — на\u00A0сводке с\u00A0PII-ограничением.",
  "case.phish.intro_title": "Вводные",
  "case.phish.intro_body":
    "InnoPhish — awareness и\u00A0устойчивость к\u00A0социнженерии / фишингу. В\u00A0кейсе — сводный дашборд Desktop (2024–2026), не\u00A0весь продукт.\n\nМиссия: получить актуальную картину «обучение +\u00A0атаки» для\u00A0доклада, назначения курсов и\u00A0оценки эффекта — без\u00A0склейки в\u00A0Excel и\u00A0без\u00A0dual-mode.\n\nРезультат: as-is EvilGo → сводный дашборд InnoPhish; вкладки «Атаки» / «Обучение»; сигнал риска и\u00A0PDF по\u00A0кнопке. Макет → прод; повторно не\u00A0замерили.",
  "case.phish.analysis_title": "Анализ",
  "case.phish.analysis_body":
    "Primary: социнженер и\u00A0руководитель анализа. Зрители: CISO, CTO, директор ИБ. JTBD: когда нужна сводка по\u00A0awareness / фишингу, хочу единую актуальную картину «обучение +\u00A0атаки», чтобы сделать доклад, назначить курсы и\u00A0оценить эффект — без\u00A0Excel и\u00A0без\u00A0dual-mode.\n\nМетоды: интервью специалистов ИБ; конкурентный разбор (KnowBe4, Hoxhunt, Proofpoint и\u00A0др.); тест чернового макета. Метрик продукта на\u00A0входе не\u00A0было.\n\nИнсайты: сводку клеят в\u00A0Excel; руководству нужен сигнал риска на\u00A0сводке; без\u00A0связки атака↔обучение нельзя быстро решить, кого учить; топ без\u00A0ФИО тормозит назначение; тест одной страницы с\u00A0атаками и\u00A0обучением дал перегруз.",
  "case.phish.hypotheses_title": "Гипотезы и\u00A0решения",
  "case.phish.hypotheses_body":
    "Взяли: сводка ≠ «Отчёты»; актуальный срез / последняя кампания; вкладки «Атаки» / «Обучение»; сигнал риска на\u00A0сводке (без формулы); ФИО топа; срезы HR/SOC; PDF по\u00A0кнопке.\n\nНе стали: dual-mode ролей; тренд 3–6–12 на\u00A0первом экране; всё без\u00A0табов; traffic-light; schedule PDF; формула Risk Score в\u00A0кейсе.",
  "case.phish.hypotheses_body_long":
    "Решение про вкладки: черновой макет с\u00A0атаками и\u00A0обучением на\u00A0одной странице читался как перегруз. Вкладки — тип метрик внутри одной сводки, не\u00A0dual-mode ролей. Отдельная страница сводки закрывает ежедневный доклад; «Отчёты» — регламент и\u00A0файл.",
  "case.phish.conclusions_title": "Выводы",
  "case.phish.conclusions_body":
    "As-is EvilGo без\u00A0org-сводки → сводный дашборд InnoPhish; после теста — вкладки «Атаки» / «Обучение»; на\u00A0сводке — сигнал риска, ФИО, HR/SOC, PDF по\u00A0кнопке. Дальше — в\u00A0прод.\n\nДоказательство: ~60% переходов в\u00A0EvilGo — до\u00A0дашборда. Тест: перегруз первой версии → табы. После макета повторно не\u00A0замерили.\n\nЗабрала: сначала «сводка или отчёт» и\u00A0«срез или тренд»; потом — не\u00A0класть два типа метрик одной простынёй без\u00A0проверки на\u00A0людях.",
  "case.phish.contact_heading": "Свяжитесь со\u00A0мной",
  "case.phish.contact_sub":
    "Буду рада познакомиться и\u00A0обсудить новые проекты",
  "case.phish.next_label": "Далее",
  "case.phish.next_url": "case-dragon.html",
  "case.phish.toolbar_title": "InnoPhish",
  "case.phish.header_brand": "Аня Ясинская · Портфолио",

  "card.c.title": "CityBike",
  "card.c.meta": "· 2024",
  "card.c.description":
    "Приложение для аренды электрических велосипедов. Удобный и экологичный транспорт по доступным ценам. Экономия времени в одно касание.",
  "card.c.chip": "B2C",
  "card.c.url":
    "https://www.behance.net/gallery/211908269/E-bike-Rental-Mobile-App-for-Android",
  /* CityBike: CursorHover Behance (Figma 260:24098) */
  "card.c.hover.label": "Behance",

  "tapper.zoom_out": "Отдалить",

  "tapper.zoom_in": "Приблизить",

  "tooltip.zoom_out": "Отдалить",

  "tooltip.zoom_in": "Приблизить",

  "button.home": "На\u00A0главную",

  "header.title": "Аня Ясинская · Портфолио",

  "segments.long": "Длинная версия",

  "segments.short": "Короткая версия",

  "sidenav.context": "Контекст",

  "sidenav.analysis": "Анализ",

  "sidenav.hypotheses": "Гипотезы и решения",

  "sidenav.conclusions": "Выводы",

  "sidenav.contacts": "Контакты",

  "foundations.swatch_labels":

    "Primary, Primary_hover, Secondary, Gray_dark, Gray_text, Black, White",

  "typography.labels": "Заголовок 1, Заголовок 2, Текст 1, Текст 2, Подписи",



  contactUrls: {

    "contact.cv": "assets/cv.pdf",

    "contact.telegram": "https://t.me/Annyorina",

    "contact.linkedin": "https://www.linkedin.com/in/anna-yasinskaya-b67798236",

    "contact.behance": "https://www.behance.net/annyorin",

    "contact.mail": "mailto:annyorin@gmail.com",

  },


  chipVariants: {

    "chip.b2b": "active",

    "chip.b2c": "active",

    "chip.design_system": "default",

    "chip.ai_prototyping": "default",

  },



  assets: {

    avatar: { pathFromDsRoot: "images/avatar.png" },

    "card.image": {
      pathFromDsRoot: "images/card-default.png",
      intrinsicWidth: 924,
      intrinsicHeight: 516,
    },

    "card.image.a": { pathFromDsRoot: "images/img-1.png", intrinsicWidth: 924, intrinsicHeight: 570 },

    "case.dragon.hero": { pathFromDsRoot: "images/case-dragon-hero.png" },

    "case.phish.hero": { pathFromDsRoot: "images/phish.png" },

    "card.image.b": { pathFromDsRoot: "images/img-2.png", intrinsicWidth: 924, intrinsicHeight: 570 },

    "card.image.c": {
      pathFromDsRoot: "images/card-citybike.png",
      intrinsicWidth: 924,
      intrinsicHeight: 516,
    },

    img_bg: { pathFromDsRoot: "images/img-bg.png" },

    img_1: { pathFromDsRoot: "images/img-1.png" },

    img_2: { pathFromDsRoot: "images/img-2.png" },

    img_3: { pathFromDsRoot: "images/img-3.png" },

    comp: { pathFromDsRoot: "images/comp.png" },

    me: { pathFromDsRoot: "images/me.png" },

    macbook: { pathFromDsRoot: "images/macbook-248-17115.png" },

    "macbook.lid": { pathFromDsRoot: "images/macbook-lid.png" },

    dragon: { pathFromDsRoot: "images/dragon.png", intrinsicWidth: 924, intrinsicHeight: 570 },

    phish: { pathFromDsRoot: "images/phish.png", intrinsicWidth: 924, intrinsicHeight: 570 },

    anime: { pathFromDsRoot: "images/stickers/anime.svg" },

    books: { pathFromDsRoot: "images/stickers/books.svg" },

    create: { pathFromDsRoot: "images/stickers/create.svg" },

    question: { pathFromDsRoot: "images/stickers/question.svg" },

    seal: { pathFromDsRoot: "images/stickers/seal.svg" },

    sport: { pathFromDsRoot: "images/stickers/sport.svg" },

    "macbook.sticker.anime": { pathFromDsRoot: "images/stickers/anime.png" },

    "macbook.sticker.books": { pathFromDsRoot: "images/stickers/books.png" },

    "macbook.sticker.create": { pathFromDsRoot: "images/stickers/create.png" },

    "macbook.sticker.question": { pathFromDsRoot: "images/stickers/question.png" },

    "macbook.sticker.seal": { pathFromDsRoot: "images/stickers/seal.png" },

    "macbook.sticker.sport": { pathFromDsRoot: "images/stickers/sport.png" },

    "icons.close": { pathFromDsRoot: "icons/close.svg" },

    "icons.plus": { pathFromDsRoot: "icons/plus.svg" },

    "icons.plus.hover": { pathFromDsRoot: "icons/plus-hover.svg" },

    "icons.minus": { pathFromDsRoot: "icons/minus.svg" },

    "icons.minus.hover": { pathFromDsRoot: "icons/minus-hover.svg" },

    "icons.arrow-right": { pathFromDsRoot: "icons/arrow-right.svg" },

    "icons.arrow-left": { pathFromDsRoot: "icons/arrow-left.svg" },

    "icons.burger-menu": { pathFromDsRoot: "icons/burger-menu.svg" },

    "icons.telegram": { pathFromDsRoot: "icons/telegram.svg" },

    "icons.cv": { pathFromDsRoot: "icons/cv.svg" },

    "icons.behance": { pathFromDsRoot: "icons/behance.svg" },

    "icons.mail": { pathFromDsRoot: "icons/mail.svg" },

    "icons.linkedin": { pathFromDsRoot: "icons/linkedin.svg" },

    "icons.cursor-figma": { pathFromDsRoot: "icons/cursor-figma.png" },

  },

};


