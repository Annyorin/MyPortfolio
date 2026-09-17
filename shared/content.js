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

  "stiker.label": "Обо мне",

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
  "case.dragon.period_value": "2024–2026",
  "case.dragon.platforms_label": "Платформы",
  "case.dragon.platforms_value": "Desktop",
  "case.dragon.role_label": "Моя роль",
  "case.dragon.role_value":
    "UX/UI дизайнер: исследование и макеты. Код и бэклог — не мои.",
  "case.dragon.team_label": "Команда",
  "case.dragon.team_value": "4 фронта, 4 бэка +\u00A0дизайнер",
  "case.dragon.context_title": "Контекст задачи",
  "case.dragon.context_body":
    "Человек открывает одно модальное окно. Вкладки — это каналы: система, почта, Telegram. На каждой вкладке одно и то же дерево: уязвимости, активы, технологии, инциденты. Чекбокса на группу нет. Он прокликивает пункты, переключается на почту, повторяет, потом Telegram. Между вкладками легко забыть, что уже включил. И забыть сохранить.\n\nНа это уходит время смены. Цена — либо пропущенный критичный инцидент в Telegram, либо одинаковый спам во все каналы. Настройку откладывают.\n\nAll-in-one бесполезен, если сигнал не доходит до дежурного. Поэтому кейс про этот кусок, не про сканер.\n\nКонструктор правил «триггер → действие» не брала. Каталог событий уже закрыт. Нужна матрица, не мастер правил.",
  "case.dragon.intro_title": "Вводные",
  "case.dragon.intro_body":
    "InnoDragon — система управления безопасностью для организаций: активы, уязвимости, инциденты, агенты EDR. Кейс — настройки уведомлений, не весь продукт.\n\n## Цель\nСобрать политику оповещений за один заход. Системные, почта и Telegram без повторного проклика одних и тех же событий.\n\n## Аудитория\nСпециалист ИБ, который решает, что уйдёт в дежурство. Руководитель, которому нужен сигнал, а не шум.\n\n## Критерии успеха\nГруппа событий включается целиком. Каналы видны рядом, не прячутся во вкладках. Одно сохранение. Макет ушёл в прод. На записи прогона есть среднее время закрытия задачи и путь. Секунды в кейс ещё не вынесла.",
  "case.dragon.analysis_title": "Исследование",
  "case.dragon.analysis_body":
    "## Бенчмарки\nСмотрела MaxPatrol VM, R-Vision VM, Security Vision VM, Kaspersky Security Center, KUMA и MDR, Qualys VMDR, Tenable и Rapid7 InsightVM. Паттерны складывала в Weeek.\n\nНа рынке событие отдельно от канала доставки. Slack, PagerDuty, почта — действие правила, не копия всего дерева. В Kaspersky MDR почта и Telegram сидят на одном экране. Во вкладках Email и SMS у Security Center дерево приходится дублировать.\n\nБелые пятна у нас: закрытый каталог событий и три канала на одном экране, с чекбоксом на группу. Telegram из коробки, без скрипта.\n\n## Метод\nДесять человек. Задача: подключить активы в Telegram — как и куда пойдёте. Запись экрана: первый клик, путь, среднее время закрытия действия. Говорили вслух. Это не сплит в бою и не опрос рынка.\n\n## Выводы\nГлавная работа: когда нужно, чтобы события по активам ушли в Telegram, сразу понять куда идти и включить группу, не прокликивать одно и то же трижды.\n\nЦенят: критичное сразу в мессенджер, дайджест на почту, системное — в консоли.\n\nМешает: вкладки-каналы с копией дерева, нет чекбокса группы, нет одного сохранения.\n\nНе копировать: вкладки доставки как в Security Center. Конструктор Qualys на каждый тип события. Кнопку «скопировать с соседней вкладки».",
  "case.dragon.hypotheses_title": "Гипотезы и решения",
  "case.dragon.hypotheses_body":
    "Сначала хотела только добавить чекбокс на группу и оставить вкладки. Рассинхрон каналов бы остался. Собрала один экран: группы событий с чекбоксом на группу, каналы — колонки рядом. Сохранение одно.\n\nНа десяти людях дала задачу: подключить активы в Telegram, как и куда пойдёте. Смотрела запись: первый клик, путь и среднее время закрытия действия. Говорили вслух.\n\nКонструктор правил «триггер → действие» не делала. Для закрытого каталога он длиннее матрицы.",
  "case.dragon.hypotheses_body_long":
    "Подключение каналов вынесла отдельно: адрес почты, бот Telegram. Системные уведомления всегда в продукте. Это не вкладки с деревом событий.\n\nНе стала делать «скопировать настройки с вкладки Почта». Это снова два состояния, которые разъедутся.",
  "case.dragon.conclusions_title": "Выводы",
  "case.dragon.conclusions_body":
    "Макет ушёл в прод. Целилась во время закрытия задачи «активы → Telegram». Смотрела среднее на записи десяти человек. Секунды в кейс не выношу, пока не сниму с видео. В бою после запуска не переснимала.\n\nПровал, который закрыла до прода: чекбокс группы при тех же вкладках. Каналы всё равно разъехались бы.\n\nДальше раньше решу, какие каналы видны по роли. И положу пресет «только критичное в Telegram».",
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
    "Программа для\u00A0повышения осведомлённости\nсотрудников в\u00A0области ИБ\u00A0и\u00A0укрепления\nих устойчивости к\u00A0кибератакам, основанным\nна\u00A0социальной инженерии.",
  "card.b.chip": "B2B",
  "card.b.url": "case-phish.html",

  "case.phish.period_label": "Период выполнения",
  "case.phish.period_value": "2024–2026",
  "case.phish.platforms_label": "Платформы",
  "case.phish.platforms_value": "Desktop",
  "case.phish.role_label": "Моя роль",
  "case.phish.role_value":
    "UX/UI дизайнер: исследование и макеты. Код и бэклог — не мои.",
  "case.phish.team_label": "Команда",
  "case.phish.team_value": "4 фронта, 4 бэка + дизайнер",
  "case.phish.context_title": "Контекст задачи",
  "case.phish.context_body":
    "Перед докладом атаки живут в EvilGo, обучение отдельно. Цифры склеивают в Excel, потом уносят в Word и PDF. В одной кампании около 60% перешли по ссылке. Это про аудиторию, не про экран.\n\nЧасы ИБ уходят на каждый доклад. Курсы ставят по устаревшему срезу. Руководство просит второй экран. Я оставила одну сводку и файл.\n\nИмена в топе оставила. Матрица ролей ещё не закрыта.",
  "case.phish.intro_title": "Вводные",
  "case.phish.intro_body":
    "InnoPhish учит сотрудников не вестись на фишинг. Кейс — сводная страница для ИБ, не весь продукт.\n\n## Цель\nЗакрыть доклад без Excel и ставить курсы с актуального среза.\n\n## Аудитория\nСпециалист, который клеит сводку. CISO, которому нужен риск без консоли.\n\n## Критерии успеха\nДоклад без склейки. Курс с топа. PDF по кнопке. После запуска время доклада не замерила.",
  "case.phish.analysis_title": "Исследование",
  "case.phish.analysis_body":
    "## Бенчмарки\nСмотрела KnowBe4, Proofpoint, Phishman, Антифишинг, Kaspersky ASAP, Hoxhunt, Solar, Gophish и корпоративные LMS. На рынке уже есть индекс риска, атаки рядом с обучением, именной топ и PDF.\n\nБелые пятна у нас: путь «провалил → научили → завершил» на сводке, явные срезы HR и SOC, замена Excel.\n\n## Интервью\nГоворила с двумя специалистами ИБ. Это направление, не рынок.\n\n## Выводы\nГлавная работа: когда нужна сводка по программе, увидеть обучение и атаки в одном срезе, чтобы не клеить Excel.\n\nКонтекст: атаки в EvilGo, обучение отдельно, доклад руками.\n\nЦенят: все метрики атаки с первого экрана, индекс риска, топ с именами, файл для CISO, курс с топа.\n\nМешает: нет одного экрана, нет связки «кликнул → назначили → завершил», CISO не живёт в консоли.\n\nНе копировать: два режима на одной странице, подмену сводки «Отчётами», тренд 3–6–12 на первом экране, светофор «плохо» по подразделениям.",
  "case.phish.hypotheses_title": "Гипотезы и решения",
  "case.phish.hypotheses_body":
    "Сначала вывела всё на один экран — так должна была уйти склейка. На тесте структуру не поняли. Разделила атаки и обучение вкладками. Это одна сводка, не два продукта.\n\nВторой экран для руководства не делала. CISO забирает PDF по кнопке.",
  "case.phish.hypotheses_body_long":
    "Сводку в готовые «Отчёты» не встраивала. Отчёт — файл к дате. Сводка — что делать сегодня.\n\nНа первом экране последний срез, не тренд за год. Со сводки можно открыть топ с именами и назначить курс. Место под сигнал риска есть. Формулу в кейсе не раскрываю.\n\nСрезы для HR и SOC заложены. Как они сидят на вкладках, ещё не зафиксировали.",
  "case.phish.conclusions_title": "Выводы",
  "case.phish.conclusions_body":
    "Макет ушёл в прод. Целилась в скорость доклада и уход от Excel. После запуска не замерила: есть тест первой версии, не бой.\n\nПровал — страница без вкладок: не все поняли структуру. Имена на сводке оставляю спорными, пока нет матрицы ролей.\n\nДальше разделю типы цифр до показа целого экрана. И раньше решу, это ежедневная сводка или отчёт в файл.",
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


