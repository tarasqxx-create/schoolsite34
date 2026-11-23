window.WU = window.WU || {};
/* Хранилище в браузере (localStorage). Для настоящего продукта заменяется на запросы к серверу. */
WU.Store = {
  key: 'warmup.v1',
  def() { return { user: null, theme: 'matcha', grade: null, subjects: [], levels: {}, xp: 0,
    streak: { count: 0, last: null, lost: 0, days: {} }, badges: [] }; },
  load() { try { return Object.assign(this.def(), JSON.parse(localStorage.getItem(this.key))); } catch (e) { return this.def(); } },
  save(s) { try { localStorage.setItem(this.key, JSON.stringify(s)); } catch (e) {} },
  reset() { try { localStorage.removeItem(this.key); } catch (e) {} }
};
