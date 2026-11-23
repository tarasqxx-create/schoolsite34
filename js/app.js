(function () {
  const { Store, Streak, SUBJECTS } = WU;
  const THEMES = [['matcha', '🍵', 'Матча'], ['beige', '🤎', 'Бежевая'], ['pink', '🌸', 'Розовая'], ['color', '🎨', 'Цветная'], ['mono', '🖤', 'Ч/Б']];
  const FL = (z, c) => `<img class="flame ${c || ''}" src="assets/flame.png" width="${z}" height="${z}" alt="">`;
  const BADGE = { 7: FL(34), 30: '🏅', 100: '🏆', 365: '👑' };
  const $app = document.getElementById('app'), $toast = document.getElementById('toast');
  let S = Store.load(), screen = 'welcome', L = null, draft = [], ev = [];
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
  const norm = t => String(t).trim().toLowerCase().replace(/ё/g, 'е').replace(/−/g, '-').replace(',', '.');
  const level = () => 1 + Math.floor(S.xp / 100);
  const subj = id => SUBJECTS.find(s => s.id === id);
  const save = () => Store.save(S);
  const go = s => { screen = s; render(); window.scrollTo(0, 0); };
  function toast(t) { $toast.textContent = t; $toast.classList.add('show'); setTimeout(() => $toast.classList.remove('show'), 2600); }
  function theme(t) { S.theme = t; document.documentElement.dataset.theme = t; save(); }

  const nav = cur => `<nav class="nav" aria-label="Меню"><button data-a="go" data-v="home" ${cur === 'home' ? 'aria-current="page"' : ''} aria-label="Главная">🏠</button>
    <button class="go" data-a="start" aria-label="Начать занятие">▶</button>
    <button data-a="go" data-v="profile" ${cur === 'profile' ? 'aria-current="page"' : ''} aria-label="Профиль">👤</button></nav>`;

  const V = {
    welcome: () => `<section class="screen hero">
      <div class="blob k2" style="width:170px;height:150px;top:-30px;right:-40px"></div><div class="blob k3" style="width:90px;height:90px;top:120px;left:-30px;animation-delay:-3s"></div>
      <div>${FL(96)}</div>
      <h1 style="margin-top:18px">Разминка для мозга за 5 минут</h1>
      <p class="sub">Математика, английский и русский — каждый день по чуть-чуть. Не пропускай дни, и огонёк будет расти.</p>
      <button class="btn" data-a="go" data-v="${S.user && S.levels && Object.keys(S.levels).length ? 'home' : 'register'}">${S.user ? 'Продолжить' : 'Начать'}</button></section>`,
    register: () => `<section class="screen"><h1>Давай знакомиться</h1><p class="sub">Это займёт полминуты.</p>
      <label class="field">Имя<input id="name" autocomplete="given-name" value="${esc(S.user ? S.user.name : '')}"></label>
      <label class="field">Логин или почта<input id="login" autocomplete="username" value="${esc(S.user ? S.user.login : '')}"></label>
      <label class="field">Пароль<input id="pass" type="password" autocomplete="new-password"></label>
      <p class="hint">В демо-версии всё хранится только в твоём браузере, пароль не сохраняется.</p>
      <button class="btn" data-a="reg">Дальше</button></section>`,
    grade: () => `<section class="screen"><h1>В каком ты классе?</h1><p class="sub">Подберём задания по школьной программе.</p>
      <div class="grid">${[5, 6, 7, 8, 9, 10, 11].map(g => `<button class="chip" data-a="grade" data-v="${g}" aria-pressed="${S.grade === g}">${g}</button>`).join('')}</div>
      <button class="btn" data-a="gradeNext">Дальше</button></section>`,
    subjects: () => `<section class="screen"><h1>Что разминаем?</h1><p class="sub">Выбери один предмет или все.</p>
      ${SUBJECTS.map(s => `<button class="subj ${s.k}" data-a="pick" data-v="${s.id}" aria-pressed="${draft.includes(s.id)}"><span class="e">${s.emoji}</span>${s.name}</button>`).join('')}
      <button class="btn" data-a="subjNext">Пройти входной тест</button></section>`,
    home() {
      const k = S.streak, t = Streak.today(S), w = Streak.week(), next = SUBJECTS.filter(s => S.subjects.includes(s.id));
      const lost = k.lost > 0 ? `<div class="card k2" style="margin-top:12px"><b>Серия сгорела 😢</b><br>Пройди ${Streak.DAILY + 1} занятия сегодня — вернём ${k.lost} дн. + 1.</div>` : '';
      return `<section class="screen"><div class="top"><div><p class="sub" style="margin:0">Привет!</p><h1 style="font-size:26px">${esc(S.user.name)}</h1></div><div class="ava">${esc(S.user.name[0] || '?').toUpperCase()}</div></div>
      <div class="card k1 goal"><b style="font-size:20px">Цель дня</b> <span style="opacity:.7;float:right">${Math.min(t, Streak.DAILY)}/${Streak.DAILY} занятия</span>
        <div class="week">${w.map(d => `<div class="day ${S.streak.days[d.key] ? 'on' : ''} ${d.now ? 'now' : ''}">${S.streak.days[d.key] ? '✓' : d.l}</div>`).join('')}</div></div>
      ${lost}
      <div class="row"><div class="card k2"><div class="big ${ev.includes('lit') ? 'pop' : ''}">${k.count}</div><b>дней подряд</b> ${FL(30, t ? '' : 'off')}</div>
        <div class="card k4"><div class="big">${level()}</div><b>уровень</b><div class="hint" style="color:inherit">${S.xp % 100}/100 XP</div></div></div>
      <h2>Занятия на сегодня</h2>
      ${next.map(s => { const done = (S.done[Streak.key()] || []).includes(s.id); return `<button class="lesson ${done ? 'k3' : s.k}" data-a="start" data-v="${s.id}"><span style="font-size:30px">${s.emoji}</span><span><b>${s.name}</b><small>программа ${S.levels[s.id]} класса · 5 минут</small></span><span class="tick">${done ? '✓' : '▶'}</span></button>`; }).join('')}
      <h2>Награды</h2><div class="badges">${Streak.BADGES.map(n => `<div class="badge ${S.badges.includes(n) ? '' : 'lock'}"><i>${BADGE[n]}</i>${n} дн.</div>`).join('')}</div>
      ${nav('home')}</section>`;
    },
    lesson() {
      if (L.intro) { const j = subj(L.qs[L.i].s), n = S.subjects.indexOf(j.id) + 1; return `<section class="screen hero"><div class="blob ${j.k}" style="width:150px;height:140px;top:-20px;right:-30px"></div><p class="sub">Входной тест · ${n} из ${S.subjects.length}</p><div class="big" style="font-size:80px;margin-top:12px">${j.emoji}</div><h1 style="margin-top:14px">${j.name}</h1><p class="sub">5 простых заданий — по ним подберём твой уровень.</p><button class="btn" data-a="go5">Поехали</button></section>`; }
      const q = L.qs[L.i], d = q.t, sj = subj(q.s);
      let body = '';
      if (d[0] === 'c') body = d[2].map((o, i) => `<button class="opt" data-a="ans" data-v="${i}">${esc(o)}</button>`).join('');
      if (d[0] === 'i') body = `<label class="field"><span class="hint">Впиши ответ</span><input id="ans" autocomplete="off" autocapitalize="off"></label><button class="btn" data-a="ans">Проверить</button>`;
      if (d[0] === 'm') { const opts = shuffle(d[2].map(p => p[1])); body = d[2].map((p, i) => `<div class="pair"><span>${esc(p[0])}</span><select data-i="${i}"><option value="">—</option>${opts.map(o => `<option>${esc(o)}</option>`).join('')}</select></div>`).join('') + `<button class="btn" data-a="ans">Проверить</button>`; }
      return `<section class="screen"><div class="top" style="gap:12px"><button class="ava" data-a="go" data-v="home" aria-label="Закрыть">✕</button><div class="bar"><i style="width:${L.i / L.qs.length * 100}%"></i></div></div>
        <p class="sub">${sj.emoji} ${sj.name}${L.mode === 'test' ? ' · входной тест' : ''}</p><div class="q">${esc(d[1])}</div><div id="body">${body}</div><div id="fb"></div></section>`;
    },
    result() {
      const r = L.res, good = r.ok >= r.total / 2;
      return `<section class="screen hero"><div class="blob k2" style="width:140px;height:130px;top:-20px;right:-30px"></div>
        <div class="big pop" style="font-size:84px">${ev.includes('lit') ? FL(84) : good ? '🎉' : '💪'}</div>
        <h1 style="margin-top:14px">${L.mode === 'test' ? 'Тест пройден!' : good ? 'Отличная разминка!' : 'Хорошее начало!'}</h1>
        <p class="sub">Верно: ${r.ok} из ${r.total} · +${r.ok * 10} XP</p>
        ${L.mode === 'test' ? `<div class="card k2" style="margin-top:16px">${S.subjects.map(id => `<b>${subj(id).emoji} ${subj(id).name}</b> — программа ${S.levels[id]} класса<br>`).join('')}</div>` : ''}
        ${ev.includes('lit') ? `<div class="card k1" style="margin-top:16px"><b>Огонёк горит! Серия: ${S.streak.count} ${FL(22)}</b></div>` : ''}
        ${ev.includes('restored') ? `<div class="card k4" style="margin-top:16px"><b>Серия восстановлена! 🎊</b></div>` : ''}
        <button class="btn" data-a="go" data-v="home">На главный экран</button></section>`;
    },
    profile: () => `<section class="screen"><div class="top"><h1>Профиль</h1><div class="ava">${esc(S.user.name[0] || '?').toUpperCase()}</div></div>
      <p class="sub">${esc(S.user.name)} · ${esc(S.user.login)} · ${S.grade} класс · уровень ${level()}</p>
      <h2>Мои предметы</h2>${S.subjects.map(id => `<div class="card ${subj(id).k}" style="margin-top:8px"><b>${subj(id).emoji} ${subj(id).name}</b> — программа ${S.levels[id]} класса</div>`).join('')}
      <h2>Тема оформления</h2><div class="sw">${THEMES.map(t => `<button class="chip" data-a="theme" data-v="${t[0]}" aria-pressed="${S.theme === t[0]}" title="${t[2]}" aria-label="${t[2]}" style="min-height:62px">${t[1]}</button>`).join('')}</div>
      <h2>Награды</h2><div class="badges">${Streak.BADGES.map(n => `<div class="badge ${S.badges.includes(n) ? '' : 'lock'}"><i>${BADGE[n]}</i>${n} дн.</div>`).join('')}</div>
      <button class="btn ghost" data-a="redo">Сменить класс или предметы</button>
      <button class="btn ghost" data-a="wipe">Стереть все данные</button>${nav('profile')}</section>`
  };

  function render() { ev = screen === 'home' || screen === 'result' ? ev : []; $app.innerHTML = V[screen]() ; if (screen === 'lesson') { const i = document.getElementById('ans'); if (i) i.focus({ preventScroll: true }); } }

  function begin(mode, id) {
    let qs;
    if (mode === 'test') qs = S.subjects.flatMap(x => WU.make(x, S.grade, 5).map(t => ({ s: x, t })));
    else { const dn = S.done[Streak.key()] || []; id = id || S.subjects.find(x => !dn.includes(x)) || S.subjects[Streak.today(S) % S.subjects.length]; qs = WU.make(id, S.levels[id], 5).map(t => ({ s: id, t })); }
    L = { mode, qs, i: 0, ok: 0, per: {}, intro: mode === 'test', locked: false, subj: id }; go('lesson');
  }
  function check(q) {
    const d = q.t, root = document.getElementById('body');
    if (d[0] === 'c') return null;
    if (d[0] === 'i') return norm(document.getElementById('ans').value) === norm(d[2]);
    const sel = [...root.querySelectorAll('select')]; return sel.every((s, i) => s.value === d[2][i][1]);
  }
  function answer(ok) {
    if (L.locked) return; L.locked = true;
    const q = L.qs[L.i], d = q.t, expl = d[0] === 'c' ? d[4] : d[0] === 'i' ? d[3] : d[3];
    if (ok) { L.ok++; L.per[q.s] = (L.per[q.s] || 0) + 1; }
    document.getElementById('fb').innerHTML = `<div class="fb ${ok ? 'good' : 'bad'}"><b>${ok ? 'Верно! 🎉' : 'Почти!'}</b><br>${!ok && d[0] === 'i' ? 'Ответ: ' + esc(d[2]) + '. ' : ''}${esc(expl)}</div><button class="btn" data-a="next">${L.i + 1 < L.qs.length ? 'Дальше' : 'Готово'}</button>`;
    document.querySelectorAll('#body .btn, #body .opt, #body input, #body select').forEach(e => e.disabled = true);
    document.querySelector('#fb .btn').focus();
  }
  function finish() {
    const total = L.qs.length;
    if (L.mode === 'test') { S.subjects.forEach(id => { const n = L.qs.filter(q => q.s === id).length, g = L.per[id] || 0; S.levels[id] = Math.max(5, Math.min(11, S.grade + (g >= n - 1 ? 1 : g <= 1 ? -1 : 0))); }); ev = []; }
    else { S.xp += L.ok * 10; ev = Streak.complete(S); const dk = Streak.key(); S.done[dk] = S.done[dk] || []; if (!S.done[dk].includes(L.subj)) S.done[dk].push(L.subj); ev.filter(e => e.startsWith('badge')).forEach(e => toast('Новая награда: серия ' + e.slice(5) + ' дней! 🏅')); }
    L.res = { ok: L.ok, total }; save(); go('result');
  }

  $app.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, v = b.dataset.v;
    if (a === 'go') go(v);
    else if (a === 'reg') { const n = document.getElementById('name').value.trim(), l = document.getElementById('login').value.trim(); if (!n || !l) return toast('Заполни имя и логин'); S.user = { name: n, login: l }; save(); go('grade'); }
    else if (a === 'grade') { S.grade = +v; render(); }
    else if (a === 'gradeNext') { if (!S.grade) return toast('Выбери класс'); draft = S.subjects.slice(); go('subjects'); }
    else if (a === 'pick') { draft = draft.includes(v) ? draft.filter(x => x !== v) : draft.concat(v); render(); }
    else if (a === 'subjNext') { if (!draft.length) return toast('Выбери хотя бы один предмет'); S.subjects = draft.slice(); save(); begin('test'); }
    else if (a === 'start') { if (!S.subjects.length) return go('grade'); begin('daily', v); }
    else if (a === 'ans') { const q = L.qs[L.i]; if (q.t[0] === 'c') { const i = +v; document.querySelectorAll('.opt').forEach((o, k) => { if (k === q.t[3]) o.classList.add('ok'); else if (k === i) o.classList.add('no'); }); answer(i === q.t[3]); } else answer(check(q)); }
    else if (a === 'next') { L.i++; L.locked = false; if (L.i >= L.qs.length) return finish(); L.intro = L.mode === 'test' && L.qs[L.i].s !== L.qs[L.i - 1].s; render(); }
    else if (a === 'go5') { L.intro = false; render(); }
    else if (a === 'theme') { theme(v); render(); }
    else if (a === 'redo') go('grade');
    else if (a === 'wipe') { if (confirm('Стереть весь прогресс?')) { Store.reset(); S = Store.load(); theme('matcha'); go('welcome'); } }
  });
  $app.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'ans') { const b = document.querySelector('[data-a="ans"]'); if (b) b.click(); } });

  Streak.check(S); save(); theme(S.theme);
  screen = S.user && S.subjects.length && Object.keys(S.levels).length ? 'home' : 'welcome';
  render();
})();
