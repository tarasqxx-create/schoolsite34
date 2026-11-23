/* Логика огоньков: серия, сгорание, восстановление, значки. */
WU.Streak = {
  DAILY: 3,
  BADGES: [7, 30, 100, 365],
  key(d) { return (d || new Date()).toLocaleDateString('sv'); },
  yest() { const d = new Date(); d.setDate(d.getDate() - 1); return this.key(d); },
  today(s) { return s.streak.days[this.key()] || 0; },
  check(s) { // при открытии: если вчера пропущено — серия сгорает
    const k = s.streak;
    if (k.count > 0 && k.last && k.last !== this.key() && k.last !== this.yest()) { k.lost = k.count; k.count = 0; }
  },
  complete(s) { // после занятия; возвращает список событий
    const k = s.streak, t = this.key(), ev = [];
    k.days[t] = (k.days[t] || 0) + 1;
    if (k.days[t] === 1) { k.count = k.last === this.yest() ? k.count + 1 : 1; k.last = t; ev.push('lit'); }
    if (k.lost > 0 && k.days[t] > this.DAILY) { k.count = k.lost + 1; k.lost = 0; ev.push('restored'); }
    this.BADGES.forEach(n => { if (k.count >= n && !s.badges.includes(n)) { s.badges.push(n); ev.push('badge' + n); } });
    return ev;
  },
  week() {
    const d = new Date(), wd = (d.getDay() + 6) % 7, L = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return L.map((l, i) => { const x = new Date(d); x.setDate(d.getDate() - wd + i); return { l, key: this.key(x), now: i === wd }; });
  }
};
