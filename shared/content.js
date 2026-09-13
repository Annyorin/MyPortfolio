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

  "hover.label": "Behance",

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
  "case.dragon.toolbar_title": "InnoDragon",
  "case.dragon.header_brand": "Аня Ясинская· Портфолио",

  "card.b.title": "InnoPhish",
  "card.b.meta": "· 2024-2026",
  "card.b.description":
    "Программа для\u00A0повышения осведомлённости\nсотрудников в\u00A0области ИБ\u00A0и\u00A0укрепления\nих устойчивости к\u00A0кибератакам, основанным\nна\u00A0социальной инженерии.",
  "card.b.chip": "B2B",
  "card.b.action": "modal",

  "card.c.title": "CityBike",
  "card.c.meta": "· 2024",
  "card.c.description":
    "Приложение для аренды электрических велосипедов. Удобный и экологичный транспорт по доступным ценам. Экономия времени в одно касание.",
  "card.c.chip": "B2C",
  "card.c.url":
    "https://www.behance.net/gallery/211908269/E-bike-Rental-Mobile-App-for-Android",

  "tapper.zoom_out": "Отдалить",

  "tapper.zoom_in": "Приблизить",

  "tooltip.zoom_out": "Отдалить",

  "tooltip.zoom_in": "Приблизить",

  "button.home": "На главную",

  "header.title": "Аня Ясинская· Портфолио",

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

    "card.image.a": { pathFromDsRoot: "images/img-1.png", intrinsicWidth: 924, intrinsicHeight: 516 },

    "case.dragon.hero": { pathFromDsRoot: "images/case-dragon-hero.png" },

    "card.image.b": { pathFromDsRoot: "images/img-2.png", intrinsicWidth: 924, intrinsicHeight: 516 },

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

    macbook: { pathFromDsRoot: "images/macbook.png" },

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


