/* Тренажёр: лёгкие задания для разминки. Математика и часть английского — генераторы (каждый раз новые числа),
   русский и остальное — списки. Формат задания:
   ["c", вопрос, [варианты], номер_верного, пояснение] | ["i", вопрос, "ответ", пояснение] */
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1)), P = a => a[R(0, a.length - 1)];
  const sh = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
  const sup = n => String(n).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]), sub = n => String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
  const m = n => String(n).replace('-', '−');
  const inp = (q, a, ex) => ['i', q, String(a), ex];
  const ch = (q, ans, wrong, ex) => { const o = sh([...new Set([ans, ...wrong])].slice(0, 4).concat(ans)).filter((x, i, s) => s.indexOf(x) === i); return ['c', q, o, o.indexOf(ans), ex]; };
  const others = (list, i, k) => sh(list.filter((_, j) => j !== i)).slice(0, k);

  const M = {
    mul: () => { const a = R(2, 9), b = R(2, 9); return inp(`${a} × ${b} = ?`, a * b, `${a} × ${b} = ${a * b}`); },
    mul2: () => { const a = R(11, 19), b = R(2, 5); return inp(`${a} × ${b} = ?`, a * b, `${a}·${b} = ${a * b}`); },
    div: () => { const b = R(2, 9), c = R(2, 9); return inp(`${b * c} ÷ ${b} = ?`, c, `${b}·${c} = ${b * c}, значит ${b * c} ÷ ${b} = ${c}.`); },
    add: () => { const a = R(12, 89), b = R(11, 60); return inp(`${a} + ${b} = ?`, a + b, `${a} + ${b} = ${a + b}`); },
    sub: () => { const a = R(50, 99), b = R(11, 39); return inp(`${a} − ${b} = ?`, a - b, `${a} − ${b} = ${a - b}`); },
    neg: () => { const a = -R(1, 9), b = R(2, 12); return inp(`${m(a)} + ${b} = ?`, a + b, `Из ${b} вычитаем ${-a}.`); },
    pct: () => { const p = P([10, 50, 25]), n = P([20, 40, 60, 80, 100, 200]); return inp(`${p}% от ${n} = ?`, n * p / 100, `${p}% — это ${p}/100 от числа.`); },
    frac: () => { const d = P([4, 5, 8, 10]), a = R(1, d - 3), b = R(1, d - 1 - a), r = `${a + b}/${d}`; return ch(`${a}/${d} + ${b}/${d} = ?`, r, [`${a + b}/${2 * d}`, `${a + b + 1}/${d}`, `${a * b}/${d}`], 'Знаменатель не меняем, числители складываем.'); },
    lin1: () => { const x = R(1, 15), a = R(2, 20); return inp(`x + ${a} = ${x + a}. x = ?`, x, `x = ${x + a} − ${a} = ${x}.`); },
    lin2: () => { const x = R(2, 9), a = R(2, 9); return inp(`${a}x = ${a * x}. x = ?`, x, `x = ${a * x} ÷ ${a} = ${x}.`); },
    lin3: () => { const x = R(1, 9), a = R(2, 5), b = R(1, 9); return inp(`${a}x + ${b} = ${a * x + b}. x = ?`, x, `${a}x = ${a * x}, значит x = ${x}.`); },
    sq: () => { const a = R(2, 12); return inp(`${a}² = ?`, a * a, `${a}·${a} = ${a * a}`); },
    sqneg: () => { const a = R(2, 7); return inp(`(−${a})² = ?`, a * a, 'Минус в чётной степени пропадает.'); },
    pw: () => { const a = P([2, 3, 5, 10]), n = R(2, 4); return inp(`${a}${sup(n)} = ?`, a ** n, `${a} умножаем само на себя ${n} раза.`); },
    root: () => { const r = R(2, 12); return inp(`√${r * r} = ?`, r, `${r}·${r} = ${r * r}`); },
    root2: () => { const [a, b, c] = P([[2, 8, 4], [3, 12, 6], [2, 18, 6], [5, 20, 10], [8, 2, 4]]); return inp(`√${a} · √${b} = ?`, c, `√${a}·√${b} = √${a * b} = ${c}.`); },
    xsq: () => { const r = R(2, 10); return ch(`x² = ${r * r}. Корни:`, `${r} и −${r}`, [`${r}`, `−${r}`, `${r * r}`], `Подходят оба: ${r}² и (−${r})² равны ${r * r}.`); },
    disc: () => { const r1 = R(1, 4), r2 = R(r1 + 1, 6); return inp(`D для x² − ${r1 + r2}x + ${r1 * r2} = 0. D = ?`, (r1 - r2) ** 2, `D = b² − 4ac = ${(r1 + r2) ** 2} − ${4 * r1 * r2}.`); },
    vieta: () => { const r1 = R(1, 4), r2 = R(r1 + 1, 6); return inp(`Меньший корень x² − ${r1 + r2}x + ${r1 * r2} = 0`, r1, `Теорема Виета: сумма ${r1 + r2}, произведение ${r1 * r2}.`); },
    prog: () => { const a = R(1, 9), d = R(2, 5), n = R(3, 6); return inp(`Арифм. прогрессия: a₁ = ${a}, d = ${d}. a${sub(n)} = ?`, a + d * (n - 1), `a${sub(n)} = a₁ + ${n - 1}·d.`); },
    log: () => { const b = P([2, 3, 5]), n = R(2, 4); return inp(`log${sub(b)} ${b ** n} = ?`, n, `${b}${sup(n)} = ${b ** n}.`); },
    lg: () => { const n = R(1, 4); return inp(`lg ${10 ** n} = ?`, n, `10${sup(n)} = ${10 ** n}.`); },
    der: () => { const n = R(2, 5), f = k => 'x' + (k > 1 ? sup(k) : ''); return ch(`Производная ${f(n)}`, `${n}${f(n - 1)}`, [`${n - 1}${f(n)}`, f(n - 1), `${n + 1}${f(n + 1)}`], '(xⁿ)′ = n·xⁿ⁻¹.'); },
    trig: () => { const [q, a] = P([['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 90°', '1'], ['cos 0°', '1'], ['tg 45°', '1'], ['sin 0°', '0']]); return ch(`${q} = ?`, a, ['0', '1/2', '1', '√3/2'], 'Табличное значение.'); }
  };
  const MG = { 5: ['mul', 'div', 'add', 'sub', 'mul2'], 6: ['mul', 'div', 'neg', 'pct', 'frac', 'lin1'], 7: ['lin1', 'lin2', 'lin3', 'sq', 'sqneg', 'pw', 'neg'],
    8: ['root', 'root', 'sq', 'root2', 'xsq', 'disc', 'lin3', 'sqneg'], 9: ['xsq', 'vieta', 'prog', 'pw', 'root', 'lin3', 'disc'],
    10: ['lg', 'log', 'trig', 'der', 'pw', 'xsq', 'prog'], 11: ['log', 'der', 'trig', 'lg', 'prog', 'disc'] };

  const VOC = [['house', 'дом'], ['book', 'книга'], ['friend', 'друг'], ['water', 'вода'], ['window', 'окно'], ['teacher', 'учитель'], ['morning', 'утро'], ['apple', 'яблоко'], ['school', 'школа'], ['city', 'город']];
  const PL = [['child', 'children'], ['man', 'men'], ['foot', 'feet'], ['box', 'boxes'], ['city', 'cities'], ['mouse', 'mice'], ['tooth', 'teeth'], ['watch', 'watches']];
  const PS = [['play', 'plays'], ['go', 'goes'], ['watch', 'watches'], ['study', 'studies'], ['like', 'likes'], ['have', 'has'], ['read', 'reads'], ['do', 'does']];
  const PA = [['go', 'went'], ['see', 'saw'], ['eat', 'ate'], ['take', 'took'], ['write', 'wrote'], ['buy', 'bought'], ['come', 'came'], ['make', 'made'], ['run', 'ran'], ['play', 'played'], ['study', 'studied'], ['watch', 'watched']];
  const PP = [['go', 'gone'], ['see', 'seen'], ['eat', 'eaten'], ['take', 'taken'], ['write', 'written'], ['buy', 'bought'], ['come', 'come'], ['make', 'made'], ['do', 'done'], ['give', 'given']];
  const ADV = [[8, 'I ___ this film yesterday.', 'saw', ['have seen', 'see'], 'Yesterday — Past Simple.'], [8, 'She ___ already finished her work.', 'has', ['have', 'had'], 'Present Perfect: has + третья форма.'],
    [8, 'If it rains, we ___ at home.', 'will stay', ['stay', 'stayed'], 'Первый тип условных: if + Present, will + глагол.'], [9, 'I ___ here since 2020.', 'have lived', ['lived', 'live'], 'since — Present Perfect.'],
    [9, 'The book ___ by Tom.', 'was written', ['wrote', 'is write'], 'Passive: was + третья форма.'], [9, 'He said that he ___ tired.', 'was', ['is', 'will be'], 'Косвенная речь: время сдвигается в прошлое.'],
    [10, 'If I ___ you, I would study more.', 'were', ['am', 'will be'], 'Второй тип условных: were.'], [10, 'This is the ___ film I have ever seen.', 'best', ['better', 'good'], 'После the … ever — превосходная степень.'],
    [11, 'She suggested ___ early.', 'leaving', ['to leave', 'leave'], 'suggest + -ing.'], [11, 'By next year she ___ here for ten years.', 'will have worked', ['works', 'will work'], 'Future Perfect.']];
  const E = {
    tobe: () => { const [s, v] = P([['I', 'am'], ['He', 'is'], ['She', 'is'], ['It', 'is'], ['We', 'are'], ['You', 'are'], ['They', 'are']]); return ch(`${s} ___ happy.`, v, ['am', 'is', 'are'], `С ${s} — ${v}.`); },
    vocab: () => { const i = R(0, VOC.length - 1); return ch(`Что значит «${VOC[i][0]}»?`, VOC[i][1], others(VOC, i, 3).map(x => x[1]), `${VOC[i][0]} — ${VOC[i][1]}.`); },
    plural: () => { const i = R(0, PL.length - 1), [s, p] = PL[i]; return ch(`Множественное число: ${s}`, p, [s + 's', s + 'es', s + 'ies'], `${s} → ${p}`); },
    ps: () => { const [b, t] = P(PS), th = Math.random() < .6, s = th ? P(['He', 'She', 'My dad', 'The cat']) : P(['I', 'We', 'They', 'You']); return inp(`${s} ___ (${b}) every day.`, th ? t : b, th ? `С he/she/it в Present Simple глагол меняется: ${t}.` : 'С I/we/you/they глагол без изменений.'); },
    past: () => { const [b, p] = P(PA); return inp(`${P(['Yesterday', 'Last week', 'Two days ago'])} I ___ (${b}).`, p, `${b} → ${p}`); },
    perf: () => { const [b, v] = P(PP), [s, h] = P([['I', 'have'], ['She', 'has'], ['We', 'have'], ['He', 'has']]); return inp(`${s} ${h} already ___ (${b}).`, v, `Present Perfect: ${h} + ${v}.`); },
    adv: g => { const [, q, a, w, ex] = P(ADV.filter(x => x[0] <= g)); return ch(q, a, w, ex); }
  };
  const EG = { 5: ['tobe', 'vocab', 'plural', 'tobe', 'vocab'], 6: ['ps', 'ps', 'plural', 'tobe', 'vocab'], 7: ['ps', 'past', 'past', 'vocab', 'plural'], 8: ['past', 'perf', 'perf', 'ps', 'adv'],
    9: ['perf', 'past', 'adv', 'adv', 'perf'], 10: ['adv', 'adv', 'perf', 'past'], 11: ['adv', 'adv', 'adv', 'perf'] };

  const LET = [['в_сна', 'е', 'вёсны'], ['з_лёный', 'е', 'зелень'], ['г_ра', 'о', 'горы'], ['тр_ва', 'а', 'травы'], ['л_са', 'е', 'леса'], ['в_да', 'о', 'воды'], ['к_рова', 'о', 'словарное слово'], ['с_бака', 'о', 'словарное слово'], ['м_локо', 'о', 'словарное слово'], ['кар_ндаш', 'а', 'словарное слово'], ['п_ртрет', 'о', 'словарное слово']];
  const CON = [['дуб_', 'б', 'дубы'], ['моро_', 'з', 'морозы'], ['гри_', 'б', 'грибы'], ['зу_', 'б', 'зубы'], ['са_', 'д', 'сады'], ['хле_', 'б', 'хлеба']];
  const SOFT = [['ночь', 1], ['мышь', 1], ['дочь', 1], ['рожь', 1], ['мяч', 0], ['плащ', 0], ['нож', 0], ['врач', 0]];
  const COM = [['Я знаю(,) что ты прав.', 1], ['Мама купила хлеб(,) и молоко.', 0], ['Я пришёл(,) и мы начали.', 1], ['Солнце светит(,) и птицы поют.', 1], ['Он взял куртку(,) и шапку.', 0], ['Я хочу(,) чтобы ты пришёл.', 1], ['Мы шли(,) и пели песни.', 0], ['Когда пришла весна(,) всё зацвело.', 1]];
  const STR = [['звонИт', 'звОнит'], ['тОрты', 'тортЫ'], ['красИвее', 'красивЕе'], ['договОр', 'дОговор'], ['квартАл', 'квАртал'], ['срЕдства', 'средствА'], ['каталОг', 'катАлог'], ['облегчИть', 'облЕгчить']];
  const LIT = [['Что такое эпитет?', 'Образное определение', ['Сравнение', 'Повтор']], ['Метафора — это …', 'Скрытое сравнение', ['Преувеличение', 'Повтор слов']], ['Аргумент в сочинении — это …', 'Пример, подтверждающий тезис', ['Пересказ текста', 'Только цитата']]];
  const Q = {
    let: () => { const [w, a, h] = P(LET); return ch(`Какая буква пропущена: ${w}?`, a, ['а', 'о', 'е', 'и'], `Проверка: ${h}.`); },
    cons: () => { const [w, a, h] = P(CON); return ch(`Какая буква пропущена: ${w}?`, a, ['б', 'п', 'д', 'т', 'з', 'с'], `Проверка: ${h}.`); },
    soft: () => { const [w, y] = P(SOFT); return ch(`Нужен ли мягкий знак: ${w.replace(/ь$/, '')}_ ?`, y ? 'Нужен' : 'Не нужен', ['Нужен', 'Не нужен'], 'Существительные женского рода на шипящий — с ь (ночь), мужского — без ь (мяч).'); },
    tsya: () => { const [q, a] = P([['Что делает? Он улыб_ся.', 'тся'], ['Что делать? Хочу улыб_ся.', 'ться'], ['Что делает? Она учи_ся.', 'тся'], ['Что делать? Пора учи_ся.', 'ться']]); return ch(q, a, ['тся', 'ться'], 'Задай вопрос: «что делает?» — ТСЯ, «что делать?» — ТЬСЯ.'); },
    comma: () => { const [q, y] = P(COM); return ch(`${q} Запятая нужна?`, y ? 'Да' : 'Нет', ['Да', 'Нет'], y ? 'Нужна: границы между простыми предложениями.' : 'Не нужна: однородные члены с одиночным «и».'); },
    stress: () => { const [r, w] = P(STR); return ch('Где верное ударение?', r, [w], 'Запомни: ' + r + '.'); },
    lit: () => { const [q, a, w] = P(LIT); return ch(q, a, w, a + '.'); }
  };
  const QG = { 5: ['let', 'let', 'cons', 'soft', 'let'], 6: ['let', 'cons', 'soft', 'tsya', 'comma'], 7: ['let', 'tsya', 'soft', 'comma', 'cons'], 8: ['comma', 'comma', 'tsya', 'let', 'stress'],
    9: ['comma', 'comma', 'stress', 'tsya', 'let'], 10: ['stress', 'stress', 'comma', 'lit', 'let'], 11: ['lit', 'lit', 'stress', 'comma', 'tsya'] };

  const SET = { math: [M, MG], eng: [E, EG], rus: [Q, QG] };
  WU.make = function (id, grade, n) { // n разных заданий для предмета и класса
    const [fn, map] = SET[id], g = Math.max(5, Math.min(11, grade)), out = [], seen = new Set();
    for (let t = 0; out.length < n && t < 80; t++) { const q = fn[P(map[g])](g); if (!seen.has(q[1])) { seen.add(q[1]); out.push(q); } }
    return out;
  };
})();
