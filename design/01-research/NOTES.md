---
type: notes
env: 01-research
updated: 2026-09-30
---

# Рабочие заметки

Прогресс длинных задач этой среды. Читается и дополняется только внутри среды.

## Активная задача
1. Сводный дашборд программы «А» (InnoPhish) — исследование 0–5 **done**. Дайджест `outputs/research-digest.md` не перезаписывать.
2. InnoDragon, уведомления — **обновлено 2026-09-30**: полевое интервью SOC (L1–L3+DFIR, NIST, alert≠инцидент) → `sources/interview-ib-notifications.md`; sync digest + brief + `copy/innodragon.md`.

## InnoDragon (2026-09-16 → 2026-09-30)
| Фаза | Статус | Артефакт |
|------|--------|----------|
| 0 scope | done | `briefs/innodragon-00-scope.md` (+ интервью в границах) |
| 1 brief + ЦА | done | `briefs/innodragon-01-brief.md` (sync с интервью) |
| 2 competitors | done | `competitors/innodragon/*` + `_matrix.md` |
| интервью SOC | done | `sources/interview-ib-notifications.md` (n=1, 2026-09-30) |
| digest | ready | `outputs/research-digest-innodragon.md` |
| living copy | ready | `../03-content/copy/innodragon.md` |
| 3–5 | skip | не подменять PRD программы «А» |

## Сделано 2026-09-30
- Полевое интервью SOC → замена синтетики в `sources/interview-ib-notifications.md`
- Sync: digest, brief, scope, `copy/innodragon.md` (NIST, alert≠инцидент, роли L1–L3+DFIR)
- **InnoPhish график:** отказ от TIP-A/когорты в hover; серия обучения + легенда; вертикаль → список атак → `sources/decision-chart-index-2026-09-30.md` (+ wireframes, digest §5, `_matrix.md`)
- **InnoPhish IA + UF:** `04-prototype/flows/dashboard-ia.md`, `dashboard-user-flows.md`; FigJam страница Phish — [UF-Portfolio](https://www.figma.com/board/apRL892T8oK9XfD7YvbCRe/UF-Portfolio?node-id=1-2); sync `copy/innophish.md`, insights

## Сделано 2026-09-29
- `competitors/_matrix-attacks-reactions-training.md` — матрица **без «Мы»**: прямые / гибрид (EALP) / косвенные; §1–3 атаки·реакции·обучение SA; **§4** РФ LMS (iSpring, WebTutor, Mirapolis, Equeo, Teachbase, Moodle) + Excel + кандидаты Secure-T / RED SA
- `competitors/lms-ru.md`, `competitors/ealp.md` — кластер LMS и гибрид SA+LMS
- `competitors/_matrix.md` — матрица фич дашборда InnoPhish в формате как у InnoDragon (легенда ✅◐❌?, белые пятна, паттерны / анти-паттерны); добавлены строки графика LITE, ховера, когорты, реакций, repeat clickers.

## Прогресс фаз
| Фаза | Статус | Артефакт |
|------|--------|----------|
| 0 scope | done | `briefs/00-research-scope.md` |
| 1 brief + аудитория | done | `briefs/01-product-brief.md` |
| 2 competitors | done | `competitors/*` + `_matrix.md` |
| insights (коротко) | done | `insights/dashboard-audience-and-patterns.md` |
| Решения человека | done | brief, digest, matrix |
| 3 insight-synthesis | **done** | `insights/jtbd.md`, `pains.md`, `opportunities.md` |
| 4 hypotheses | **done** | `insights/hypotheses.md`, `assumptions.md` |
| 5 research-to-prd | **done** | `outputs/prd.md` (`status: ready`) |
| digest | **ready** | `outputs/research-digest.md` |

## Топ-3 гипотезы для первой проверки
1. **H2** — страница актуального среза сокращает время сборки сводки ≥50% (timed task).
2. **H3** — экспорт закрывает CISO-зрителей без dual-mode.
3. **H4** — ФИО-топ + CTA ускоряет назначение обучения.

## Открытые вопросы
Не блокируют старт IA primary-сводки:
- Формула Risk Score (A3)
- Дефолт: последняя кампания vs org-срез
- PDF vs schedule экспорта
- «Частые инциденты» для SOC без SIEM (A4)
- Матрица ролей / комплаенс ФИО (A2) — риск релиза

## Решения
- Конкуренты: Hoxhunt + Solar SA (7 прямых).
- **2026-09-15:** без 3–6–12 на первом экране; без порога «плохо»; v1 HR/SOC срезы; ФИО на сводке.
- Фазы 3–5 выполнены 2026-09-15; IA/wireframe — не в этой среде.
