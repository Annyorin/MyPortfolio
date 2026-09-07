---
name: git-github-check
description: Проверка и настройка Git и GitHub для метасреды — одна команда на полный health-check. Использовать на «проверь git», «проверь github», «git github check», «настрой git», «подключение к github», «работает ли репозиторий».
---

# Git & GitHub: проверка подключения

Единая процедура health-check для версионирования метасреды. Работает в корне проекта,
не привязана к подсреде `01`–`05`.

**Триггер одной командой:** «проверь git и github» / `git github check`.

## Ожидаемое состояние проекта

| Параметр | Значение |
|----------|----------|
| Репозиторий | `product-design-metasystem` |
| Remote | `https://github.com/Annyorin/product-design-metasystem.git` |
| Ветка | `main` |
| Актуальный тег | `v0.3.0` (растёт с релизами) |

Если remote или имя репо другие — зафиксируй фактические значения в отчёте, не
перезаписывай без запроса пользователя.

## Порядок проверки

Выполни шаги **последовательно**. При критическом сбое на шаге 1–3 останови цепочку
и выдай инструкцию по исправлению; шаги 4–7 — диагностика.

### 1. Git установлен

```powershell
& "C:\Program Files\Git\cmd\git.exe" --version
```

- **ОК** — версия в отчёте.
- **FAIL** — установить [Git for Windows](https://git-scm.com/download/win), перезапустить терминал.

### 2. Идентификация коммитов

```powershell
& "C:\Program Files\Git\cmd\git.exe" config user.name
& "C:\Program Files\Git\cmd\git.exe" config user.email
```

Проверь глобальный конфиг, если локальный пуст:

```powershell
& "C:\Program Files\Git\cmd\git.exe" config --global user.name
& "C:\Program Files\Git\cmd\git.exe" config --global user.email
```

- **ОК** — имя и email заданы.
- **WARN** — предложи один раз настроить (не меняй `git config` без явной просьбы):

```powershell
git config --global user.name "Имя"
git config --global user.email "email@example.com"
```

### 3. Репозиторий и рабочее дерево

Из корня метасреды:

```powershell
Set-Location -LiteralPath "<корень проекта>"
& "C:\Program Files\Git\cmd\git.exe" rev-parse --is-inside-work-tree
& "C:\Program Files\Git\cmd\git.exe" branch --show-current
& "C:\Program Files\Git\cmd\git.exe" status -sb
& "C:\Program Files\Git\cmd\git.exe" log -1 --oneline
```

- **ОК** — внутри work-tree, ветка `main`, последний коммит виден.
- **FAIL (не репо)** — `git init`, первый коммит по `CHANGELOG.md`.
- **WARN (незакоммиченные изменения)** — перечисли файлы; предложи commit, не коммить сам.

### 4. Remote origin

```powershell
& "C:\Program Files\Git\cmd\git.exe" remote -v
& "C:\Program Files\Git\cmd\git.exe" ls-remote --heads origin main
```

- **ОК** — `origin` указывает на GitHub, `main` доступен.
- **FAIL (нет origin)** — после `gh auth login`:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" repo create product-design-metasystem --private --source=. --remote=origin --push
```

- **FAIL (auth)** — см. шаг 6, затем повтори `ls-remote`.

### 5. Теги версий

```powershell
& "C:\Program Files\Git\cmd\git.exe" tag -l "v*"
& "C:\Program Files\Git\cmd\git.exe" ls-remote --tags origin
```

- **ОК** — локальные теги `v*` есть; на remote совпадают или remote новее.
- **WARN (теги только локально)** — `git push origin --tags`.

### 6. GitHub CLI и авторизация

На Windows `gh` может отсутствовать в PATH — используй полный путь:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" --version
& "C:\Program Files\GitHub CLI\gh.exe" auth status
```

- **ОК** — залогинен, аккаунт и scope `repo` в отчёте.
- **FAIL (не установлен)** — `winget install GitHub.cli`, перезапустить терминал.
- **FAIL (не залогинен)** — интерактивно в терминале пользователя:

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" auth login --hostname github.com --git-protocol https --web
```

Агент **не** может завершить OAuth за пользователя — дождись подтверждения в браузере.

### 7. Доступ к репозиторию на GitHub

```powershell
& "C:\Program Files\GitHub CLI\gh.exe" repo view --json name,visibility,url,defaultBranchRef
```

- **ОК** — репо существует, `private`, URL в отчёте.
- **FAIL** — создать репо (шаг 4) или проверить права аккаунта.

## Формат отчёта

Выдай компактную таблицу:

| Проверка | Статус | Детали |
|----------|--------|--------|
| Git | ✅ / ❌ / ⚠️ | версия |
| Identity | ✅ / ⚠️ | name, email |
| Work-tree | ✅ / ⚠️ | ветка, uncommitted N |
| Remote | ✅ / ❌ | URL |
| Tags | ✅ / ⚠️ | последний v* |
| gh auth | ✅ / ❌ | аккаунт |
| GitHub repo | ✅ / ❌ | visibility, URL |

**Итог:** одна строка — «всё готово к commit/push» или список действий по приоритету.

## Типовые сценарии после проверки

| Ситуация | Действие |
|----------|----------|
| Всё ✅, есть изменения | `git add -A` → commit → `git push` |
| Новая стабильная версия | обновить `CHANGELOG.md` → commit → `git tag -a v0.x.0` → `git push && git push origin v0.x.0` |
| Откат к тегу (только просмотр) | `git checkout v0.3.0` → вернуться `git checkout main` |
| Клон на другой машине | `git clone https://github.com/Annyorin/product-design-metasystem.git` |

## Границы

- Не меняй `git config` без явной просьбы пользователя.
- Не делай commit/push без запроса.
- Не публикуй токены и коды OAuth из `auth status`.
- Секреты (`.env`) не коммитить — сверь с `.gitignore`.
