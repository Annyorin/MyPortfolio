import fs from "fs";

const p = "design/04-prototype/wireframes/innophish-dashboard-wireframes.html";
let s = fs.readFileSync(p, "utf8");
const start = s.indexOf("<!-- ── 1. АТАКИ");
const end = s.indexOf("<!-- ── 2. РЕАКЦИИ");
if (start < 0 || end < 0) {
  console.error("markers", start, end);
  process.exit(1);
}

const neu = `<!-- ── 1. АТАКИ ─────────────────────────────────────────────── -->
<section>
  <h2>1. Сводка · вкладка «Атаки»</h2>
  <p>Канон-график индекса + серия обучения; вне графика — волны и дата последней; индекс риска; люди по уровню риска; реакции; самые быстрые реакции; последние атаки.</p>

  <div class="row">

    <div class="cell desk" data-export="01-tab-attacks">
      <div class="desk-frame tall">
        <div class="flows">
          <span class="dot" style="background:var(--f1)">1</span>
        </div>
        <nav class="desk-nav" aria-label="Разделы">
          <div class="brand">InnoPhish</div>
          <span>Пользователи</span>
          <span>Атаки</span>
          <span>Шаблоны</span>
          <span>Обучение</span>
          <span class="on">Сводка</span>
          <span>Отчёты</span>
        </nav>
        <div class="desk-main">
          <div class="desk-header">
            <div class="h-left">
              <div class="h-title">Сводная аналитика</div>
              <div class="note">Вкладка Атаки · org 1 184 · актуальный срез</div>
            </div>
            <div class="h-right">
              <span class="chip on">Атаки</span>
              <span class="chip">Реакции</span>
              <span class="chip">Обучение</span>
              <div class="btn ghost">Период</div>
              <div class="btn pr">Экспорт</div>
            </div>
          </div>

          <div class="meta-chips">
            <div class="meta-chip">
              <div class="ml">Волн обучения за период</div>
              <div class="mv">4</div>
              <div class="ms">янв–сен 2026 · org</div>
            </div>
            <div class="meta-chip">
              <div class="ml">Дата последней волны</div>
              <div class="mv">12 сен</div>
              <div class="ms">«Фишинг базовый» · после кампании</div>
            </div>
            <div class="meta-chip">
              <div class="ml">Последняя атака</div>
              <div class="mv">12 сен</div>
              <div class="ms">«Счёт за услуги» · доставлено 1 142</div>
            </div>
          </div>

          <div class="desk-row">
            <div class="metric risk-big col-1">
              <div class="ml">Индекс защищённости · org</div>
              <div class="mv">71</div>
              <div class="note" style="margin-top:4px">выше = лучше · янв 54</div>
              <div class="delta">▲ +6 к предыдущему месяцу</div>
            </div>
            <div class="desk-panel col-2">
              <div class="pt">Пользователи по уровню риска</div>
              <div class="risk-levels" style="margin-top:6px">
                <div class="metric">
                  <div class="ml">Высокий</div>
                  <div class="mv">38</div>
                  <div class="ms">3%</div>
                </div>
                <div class="metric">
                  <div class="ml">Средний</div>
                  <div class="mv">214</div>
                  <div class="ms">18%</div>
                </div>
                <div class="metric">
                  <div class="ml">Низкий</div>
                  <div class="mv">932</div>
                  <div class="ms">79%</div>
                </div>
              </div>
              <div class="dist-bar" aria-hidden="true"><i class="hi"></i><i class="mid"></i><i class="lo"></i></div>
              <div class="note" style="margin-top:6px">Сумма 1 184. Клик по уровню → список людей.</div>
            </div>
          </div>

          <div class="desk-panel">
            <div class="pt">Индекс защищённости · динамика + обучение</div>
            <div class="note" style="margin-bottom:6px">Канон v1: линия индекса + серия обучения (скрыть в легенде) + │ вертикали стартов атак. Без Ганта на сводке.</div>
            <div class="chart-box">
              <div class="plot">
                <div class="y-axis" aria-hidden="true">
                  <span>40%</span><span>20%</span><span>0</span>
                </div>
                <div class="plot-area" aria-label="Индекс + обучение">
                  <div style="position:absolute; left:26%; width:2px; top:0; bottom:0; background:var(--ink); opacity:.35"></div>
                  <div style="position:absolute; left:50%; width:2px; top:0; bottom:0; background:var(--ink); opacity:.55"></div>
                  <div style="position:absolute; left:74%; width:2px; top:0; bottom:0; background:var(--ink); opacity:.35"></div>
                  <div style="position:absolute; left:96%; width:2px; top:0; bottom:0; background:var(--ink); opacity:.35"></div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polyline fill="none" stroke="#1f1d1a" stroke-width="1.8" vector-effect="non-scaling-stroke"
                      points="2,22 14,28 26,33 38,40 50,62 62,70 74,52 86,60 98,77"/>
                    <polyline fill="none" stroke="#8a857c" stroke-width="1.4" stroke-dasharray="3 2" vector-effect="non-scaling-stroke"
                      points="2,85 14,82 26,78 38,55 50,42 62,38 74,48 86,35 98,30"/>
                  </svg>
                </div>
              </div>
              <div class="x-axis" aria-hidden="true">
                <span>янв</span><span>мар</span><span>май</span><span>июл</span><span>сен</span>
              </div>
              <div class="legend-inline">
                <span class="lg-chip"><i class="sw"></i> индекс</span>
                <span class="lg-chip"><i class="sw train"></i> обучение · вкл (скрыть)</span>
                <span>│ старт атак → список</span>
              </div>
            </div>
            <div class="link-note">Число волн и дата последней — в чипах над графиком, не на оси. Детали курсов → вкладка Обучение.</div>
          </div>

          <div class="desk-panel">
            <div class="pt">Реакции пользователей · кампания «Счёт за услуги» · от 1 142 доставленных</div>
            <div class="metrics-line-5" style="margin-top:6px">
              <div class="metric">
                <div class="ml">Открыли</div>
                <div class="mv">48%</div>
                <div class="ms">548</div>
              </div>
              <div class="metric">
                <div class="ml">Переходы</div>
                <div class="mv">9%</div>
                <div class="ms">103</div>
              </div>
              <div class="metric">
                <div class="ml">Вложения</div>
                <div class="mv">3%</div>
                <div class="ms">34</div>
              </div>
              <div class="metric">
                <div class="ml">Данные</div>
                <div class="mv">2%</div>
                <div class="ms">23</div>
              </div>
              <div class="metric">
                <div class="ml">Фидбэк</div>
                <div class="mv">18%</div>
                <div class="ms">206 · репорт</div>
              </div>
            </div>
            <div class="note" style="margin-top:8px">% от доставленных. Уязвимых уникальных: <b>94</b> (8%). Клик по метрике → раздел Атаки · ещё → вкладка Реакции.</div>
          </div>

          <div class="desk-row">
            <div class="desk-panel col-eq">
              <div class="pt">Самые быстрые реакции на атаки</div>
              <div class="speed-row" style="margin-top:6px">
                <div class="srow head">
                  <span class="c-name">Событие</span>
                  <span class="c-meta">Кто / тип</span>
                  <span class="c-val">Время</span>
                </div>
                <div class="srow">
                  <div class="c-name"><b>Фидбэк</b><br><span class="note">репорт «это фишинг»</span></div>
                  <div class="c-meta">Петрова А. · продажи</div>
                  <div class="c-val">1:42</div>
                </div>
                <div class="srow">
                  <div class="c-name"><b>Фидбэк</b><br><span class="note">репорт</span></div>
                  <div class="c-meta">Ким С. · IT</div>
                  <div class="c-val">2:05</div>
                </div>
                <div class="srow">
                  <div class="c-name"><b>Клик</b><br><span class="note">риск · автопилот</span></div>
                  <div class="c-meta">Иванов И. · продажи</div>
                  <div class="c-val">0:48</div>
                </div>
                <div class="srow">
                  <div class="c-name"><b>Клик</b><br><span class="note">риск</span></div>
                  <div class="c-meta">Сидорова М. · бухг.</div>
                  <div class="c-val">1:12</div>
                </div>
              </div>
              <div class="note" style="margin-top:6px">Быстрый фидбэк — хорошо. Быстрый клик — сигнал риска. Медиана репорта 18 мин · клика 6 мин.</div>
            </div>
            <div class="desk-panel col-eq">
              <div class="pt">Последние атаки (учебные)</div>
              <div class="attack-list" style="margin-top:6px">
                <div class="arow head">
                  <span class="c-name">Кампания</span>
                  <span class="c-meta">Дата</span>
                  <span class="c-val">Click</span>
                </div>
                <div class="arow">
                  <div class="c-name"><b>Счёт за услуги</b><br><span class="note">clickfix · 1 142</span></div>
                  <div class="c-meta">12 сен</div>
                  <div class="c-val">9%</div>
                </div>
                <div class="arow">
                  <div class="c-name"><b>SSO Битрикс</b><br><span class="note">credential · 1 098</span></div>
                  <div class="c-meta">28 авг</div>
                  <div class="c-val">16%</div>
                </div>
                <div class="arow">
                  <div class="c-name"><b>ОС логин</b><br><span class="note">os credential · 1 120</span></div>
                  <div class="c-meta">14 июл</div>
                  <div class="c-val">19%</div>
                </div>
                <div class="arow">
                  <div class="c-name"><b>HR-опрос</b><br><span class="note">survey · 980</span></div>
                  <div class="c-meta">22 мая</div>
                  <div class="c-val">22%</div>
                </div>
              </div>
              <div class="note" style="margin-top:6px">Строка → раздел Атаки. Учебные, не SIEM.</div>
            </div>
          </div>

        </div>
      </div>
      <div class="cap">
        <div class="t">IP-ATT-1 · Сводка · Атаки</div>
        <div class="d">Волны + дата вне графика · индекс + люди по риску · канон-график · реакции · быстрые реакции · последние атаки.</div>
      </div>
    </div>

  </div>
</section>

`;

s = s.slice(0, start) + neu + s.slice(end);
fs.writeFileSync(p, s);
console.log("OK replaced section");
