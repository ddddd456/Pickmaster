import { HEROES as BASE_HEROES, ATTRIBUTES, POSITIONS } from './data.js';

console.log(`✅ Базовых героев: ${BASE_HEROES.length}`);

const STORAGE_KEY = 'pm_custom_heroes';
const IMAGES_KEY  = 'pm_hero_images';
const ITEM_IMG_KEY = 'pm_item_images';
const ADMIN_PASSWORD = 'талант82';

let customHeroes = loadCustomHeroes();
let heroImages   = loadJSON(IMAGES_KEY, {});
let itemImages   = loadJSON(ITEM_IMG_KEY, {});

let currentAttrFilter = 'all';
let currentPosFilter  = 'all';
let searchQuery       = '';
let activeAdminHeroId = null;
let isAdminLoggedIn   = false;

let enemyTeam = [];
let ourPicks = {};
let currentPickerRole = null;
const ROLE_NAMES = {
  1: '① Керри',
  2: '② Мид',
  3: '③ Оффлейн',
  4: '④ Саппорт',
  5: '⑤ Хард Саппорт'
};

const heroGrid = document.getElementById('heroGrid');
const heroCount = document.getElementById('heroCount');
const heroSearch = document.getElementById('heroSearch');

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initHeroGrid();
  initFilters();
  initModal();
  initAdmin();
  initDraft();
});

function initTabs() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');

      if (tabId === 'admin') {
        if (!isAdminLoggedIn) {
          showAdminLogin();
        } else {
          refreshAdminList();
        }
      }

      if (tabId === 'draft') {
        if (typeof initDraft === 'function') initDraft();
        renderDraft();
      }
    });
  });
}

function showAdminLogin() {
  const panel = document.getElementById('adminFormPanel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="admin-login-box" style="padding:40px;text-align:center;">
      <h3 style="font-family:var(--font-display);font-size:22px;margin-bottom:20px;">🔐 Вход в редактор</h3>
      <input type="password" id="adminPasswordInput" placeholder="Введите пароль" style="
        background:var(--bg-base);border:1px solid var(--border);border-radius:var(--radius);
        color:var(--text-primary);padding:10px 14px;width:100%;max-width:300px;font-size:16px;
      ">
      <br><br>
      <button class="btn-primary" id="adminLoginBtn">Войти</button>
      <p style="color:var(--text-muted);font-size:12px;margin-top:12px;">Подсказка: талант82</p>
    </div>
  `;
  document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const input = document.getElementById('adminPasswordInput');
    if (input.value === ADMIN_PASSWORD) {
      isAdminLoggedIn = true;
      restoreAdminPanel();
      refreshAdminList();
    } else {
      alert('Неверный пароль!');
      input.value = '';
    }
  });
}

window.togglePhase = function(element) {
  const body = element.nextElementSibling;
  const arrow = element.querySelector('.phase-arrow');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  } else {
    body.style.display = 'none';
    if (arrow) arrow.style.transform = 'rotate(-90deg)';
  }
};

function getPhaseLabel(phase) {
  const map = { 
    starting: 'Стартовые', 
    early: 'Ранняя игра', 
    mid: 'Середина игры', 
    late: 'Поздняя игра', 
    situational: 'Ситуативные' 
  };
  return map[phase] || phase;
}

function restoreAdminPanel() {
  const panel = document.getElementById('adminFormPanel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="admin-form-empty" id="adminFormEmpty">
      <div class="empty-icon">⚔</div>
      <p>Выбери героя из списка или создай нового</p>
    </div>
    <form class="admin-form hidden" id="adminForm">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
        <h3 id="adminFormTitle" style="font-family:var(--font-display);font-size:20px;font-weight:700;margin:0;">Новый герой</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn-secondary" id="adminExportBtn" style="font-size:12px;">📤 Экспорт</button>
          <button type="button" class="btn-secondary" id="adminImportBtn" style="font-size:12px;">📥 Импорт</button>
          <button type="button" class="btn-secondary" id="adminLogoutBtn" style="font-size:12px;">🚪 Выйти</button>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group"><label>ID</label><input type="text" id="f-id" placeholder="axe" required></div>
        <div class="form-group"><label>Имя</label><input type="text" id="f-name" placeholder="Axe" required></div>
        <div class="form-group"><label>Атрибут</label>
          <select id="f-attr">
            <option value="str">Сила</option><option value="agi">Ловкость</option>
            <option value="int">Интеллект</option><option value="uni">Универсальный</option>
          </select>
        </div>
        <div class="form-group"><label>Тип атаки</label>
          <select id="f-attack"><option value="melee">Ближний</option><option value="ranged">Дальний</option></select>
        </div>
        <div class="form-group full-width"><label>Позиции</label>
          <div class="checkbox-row">
            <label class="check-label"><input type="checkbox" name="pos" value="1"> ① Керри</label>
            <label class="check-label"><input type="checkbox" name="pos" value="2"> ② Мид</label>
            <label class="check-label"><input type="checkbox" name="pos" value="3"> ③ Оффлейн</label>
            <label class="check-label"><input type="checkbox" name="pos" value="4"> ④ Сапп</label>
            <label class="check-label"><input type="checkbox" name="pos" value="5"> ⑤ Хард</label>
          </div>
        </div>
        <div class="form-group full-width"><label>Портрет</label>
          <div class="image-upload-box" id="heroImageBox">
            <div class="img-preview" id="heroImgPreview">
              <div class="img-placeholder-icon">🖼</div><span>Нажми или перетащи PNG/JPG</span>
            </div>
            <input type="file" accept="image/*" id="heroImageInput" style="display:none;">
          </div>
        </div>
        <div class="form-group full-width"><label>Описание</label>
          <textarea id="f-summary" rows="3" placeholder="Краткое описание..."></textarea>
        </div>
      </div>

      <!-- Секции закупа (аккордеон) -->
      <div class="form-section-title">🛒 Закуп предметов</div>
      ${['starting','early','mid','late','situational'].map(phase => `
        <div class="items-phase">
          <div class="items-phase-header" onclick="togglePhase(this)">
            <span style="font-weight:600;font-size:13px;">${getPhaseLabel(phase)}</span>
            <span style="color:var(--text-muted);font-size:12px;transition:transform 0.2s;" class="phase-arrow">▼</span>
          </div>
          <div class="items-phase-body" style="display:block;">
            <div class="items-slots" id="slots-${phase}"></div>
            <button type="button" class="btn-add-item" data-phase="${phase}" style="margin-top:8px;">+ Добавить предмет</button>
          </div>
        </div>
      `).join('')}

      <!-- Скиллбилд (уровни 1-30) -->
      <div class="form-section-title" style="margin-top:20px;">📈 Прокачка (1-30)</div>
      <div class="items-phase">
        <div class="items-phase-header" onclick="togglePhase(this)">
          <span style="font-weight:600;font-size:13px;">Уровни 1-30</span>
          <span style="color:var(--text-muted);font-size:12px;transition:transform 0.2s;" class="phase-arrow">▼</span>
        </div>
        <div class="items-phase-body" style="display:block;max-height:400px;overflow-y:auto;">
          <div class="skill-build-editor" id="skillBuildEditor"></div>
        </div>
      </div>

      <!-- Таланты -->
      <div class="form-section-title" style="margin-top:20px;">⭐ Таланты</div>
      <div class="items-phase">
        <div class="items-phase-header" onclick="togglePhase(this)">
          <span style="font-weight:600;font-size:13px;">Таланты по уровням</span>
          <span style="color:var(--text-muted);font-size:12px;transition:transform 0.2s;" class="phase-arrow">▼</span>
        </div>
        <div class="items-phase-body" style="display:block;">
          <div class="talents-editor" id="talentsEditor">
            <div class="talent-row"><span>Уровень 10:</span><input type="text" id="talent-10-left" placeholder="Лево"><input type="text" id="talent-10-right" placeholder="Право"></div>
            <div class="talent-row"><span>Уровень 15:</span><input type="text" id="talent-15-left" placeholder="Лево"><input type="text" id="talent-15-right" placeholder="Право"></div>
            <div class="talent-row"><span>Уровень 20:</span><input type="text" id="talent-20-left" placeholder="Лево"><input type="text" id="talent-20-right" placeholder="Право"></div>
            <div class="talent-row"><span>Уровень 25:</span><input type="text" id="talent-25-left" placeholder="Лево"><input type="text" id="talent-25-right" placeholder="Право"></div>
          </div>
        </div>
      </div>

      <div class="form-section-title" style="margin-top:20px;">⚔ Контрпики этого героя</div>
      <div class="counters-editor" id="countersEditor"></div>
      <button type="button" class="btn-add-counter" id="addCounterBtn">+ Добавить контрпик</button>

      <div class="form-actions">
        <button type="button" class="btn-danger" id="adminDeleteBtn">Удалить</button>
        <button type="submit" class="btn-primary">💾 Сохранить</button>
      </div>
    </form>
  `;
  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    isAdminLoggedIn = false;
    showAdminLogin();
  });
  document.getElementById('adminNewHero').addEventListener('click', () => openAdminForm(null));
  document.getElementById('adminForm').addEventListener('submit', saveAdminHero);
  document.getElementById('adminDeleteBtn').addEventListener('click', deleteAdminHero);
  document.getElementById('addCounterBtn').addEventListener('click', addCounterChip);
  document.getElementById('adminExportBtn').addEventListener('click', exportData);
  document.getElementById('adminImportBtn').addEventListener('click', importData);
  document.getElementById('heroImageBox').addEventListener('click', () => document.getElementById('heroImageInput').click());
  document.getElementById('heroImageInput').addEventListener('change', handleHeroImageUpload);
  
  document.querySelectorAll('.btn-add-item').forEach(btn => {
    btn.addEventListener('click', () => openItemModal(btn.dataset.phase));
  });
  
  document.getElementById('imCancel').addEventListener('click', closeItemModal);
  document.getElementById('imConfirm').addEventListener('click', confirmItemAdd);
  document.getElementById('itemImageBox').addEventListener('click', () => document.getElementById('itemImageInput').click());
  document.getElementById('itemImageInput').addEventListener('change', handleItemImageUpload);

  document.getElementById('itemModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeItemModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('itemModal');
      if (modal && !modal.classList.contains('hidden')) closeItemModal();
    }
  });
}

function initAdmin() {
  if (!isAdminLoggedIn) {
    showAdminLogin();
  } else {
    restoreAdminPanel();
    refreshAdminList();
  }
}

function refreshAdminList() {
  const list = document.getElementById('adminHeroList');
  if (!list) return;
  const allH = allHeroes();
  list.innerHTML = allH.map(h => {
    const isCustom = customHeroes.some(c => c.id === h.id);
    return `<div class="admin-hero-item${activeAdminHeroId === h.id ? ' active' : ''}"
              data-attr="${h.attr}"
              data-hero-id="${h.id}">
      <div class="item-dot"></div>
      <span>${h.name}</span>
      ${isCustom ? '<span class="item-custom-badge">своё</span>' : ''}
    </div>`;
  }).join('');

  list.querySelectorAll('.admin-hero-item').forEach(item => {
    item.addEventListener('click', () => openAdminForm(item.dataset.heroId));
  });
}

function openAdminForm(heroId) {
  if (!isAdminLoggedIn) return showAdminLogin();
  activeAdminHeroId = heroId;
  refreshAdminList();

  const empty  = document.getElementById('adminFormEmpty');
  const form   = document.getElementById('adminForm');
  const title  = document.getElementById('adminFormTitle');
  const delBtn = document.getElementById('adminDeleteBtn');

  if (!empty || !form || !title || !delBtn) return;

  empty.style.display = 'none';
  form.classList.remove('hidden');

  if (!heroId) {
    title.textContent = 'Новый герой';
    clearAdminForm();
    delBtn.style.display = 'none';
    return;
  }

  const hero = allHeroes().find(h => h.id === heroId);
  if (!hero) return;

  title.textContent = hero.name;
  const isCustom = customHeroes.some(c => c.id === heroId);
  delBtn.style.display = isCustom ? 'block' : 'none';

  document.getElementById('f-id').value   = hero.id;
  document.getElementById('f-name').value = hero.name;
  document.getElementById('f-attr').value = hero.attr;
  document.getElementById('f-attack').value = hero.attackType || 'melee';
  document.getElementById('f-summary').value = hero.summary || '';

  document.querySelectorAll('input[name="pos"]').forEach(cb => {
    cb.checked = (hero.positions || []).includes(+cb.value);
  });

  const preview = document.getElementById('heroImgPreview');
  const imgSrc = heroImages[hero.id];
  if (imgSrc) {
    preview.innerHTML = `<img src="${imgSrc}" style="max-width:80px;max-height:80px;border-radius:6px;object-fit:cover;">`;
  } else {
    preview.innerHTML = `<div class="img-placeholder-icon">🖼</div><span>Нажми или перетащи PNG/JPG</span>`;
  }
  document.getElementById('heroImageBox').dataset.pendingImg = imgSrc || '';

  const items = hero.items || {};
  renderItemChips('starting', items.starting || []);
  renderItemChips('early', items.early || []);
  renderItemChips('mid', items.mid || []);
  renderItemChips('late', items.late || []);
  renderItemChips('situational', items.situational || []);

  renderSkillBuildEditor(hero.skillBuild || []);

  const talents = hero.talents || [];
  const talentMap = {};
  talents.forEach(t => { talentMap[t.level] = t; });
  [10,15,20,25].forEach(lvl => {
    const t = talentMap[lvl] || { left: '', right: '' };
    document.getElementById(`talent-${lvl}-left`).value = t.left || '';
    document.getElementById(`talent-${lvl}-right`).value = t.right || '';
  });

  renderCounterChips(hero.counters || []);
}

function clearAdminForm() {
  document.getElementById('f-id').value      = '';
  document.getElementById('f-name').value    = '';
  document.getElementById('f-attr').value    = 'str';
  document.getElementById('f-attack').value  = 'melee';
  document.getElementById('f-summary').value = '';
  document.querySelectorAll('input[name="pos"]').forEach(cb => cb.checked = false);
  const preview = document.getElementById('heroImgPreview');
  preview.innerHTML = `<div class="img-placeholder-icon">🖼</div><span>Нажми или перетащи PNG/JPG</span>`;
  document.getElementById('heroImageBox').dataset.pendingImg = '';
  ['starting','early','mid','late','situational'].forEach(ph => renderItemChips(ph, []));
  renderSkillBuildEditor([]);
  [10,15,20,25].forEach(lvl => {
    document.getElementById(`talent-${lvl}-left`).value = '';
    document.getElementById(`talent-${lvl}-right`).value = '';
  });
  renderCounterChips([]);
}

function renderSkillBuildEditor(skillBuild) {
  const container = document.getElementById('skillBuildEditor');
  if (!container) return;
  const levels = Array.from({ length: 30 }, (_, i) => i + 1);
  let html = '<div class="skill-build-grid">';
  levels.forEach(lvl => {
    const existing = (skillBuild || []).find(s => s.level === lvl);
    const skill = existing ? existing.skill : '';
    const note = existing ? existing.note : '';
    html += `
      <div class="skill-build-row">
        <span class="skill-lvl-display">${lvl}</span>
        <input type="text" class="skill-name-input" data-level="${lvl}" value="${skill}" placeholder="Способность">
        <input type="text" class="skill-note-input" data-level="${lvl}" value="${note}" placeholder="Заметка">
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function getSkillBuildFromForm() {
  const inputs = document.querySelectorAll('.skill-name-input');
  const result = [];
  inputs.forEach(inp => {
    const level = parseInt(inp.dataset.level);
    const noteInput = document.querySelector(`.skill-note-input[data-level="${level}"]`);
    const skill = inp.value.trim();
    const note = noteInput ? noteInput.value.trim() : '';
    if (skill) {
      result.push({ level, skill, note });
    }
  });
  return result;
}

function getTalentsFromForm() {
  const levels = [10,15,20,25];
  return levels.map(lvl => ({
    level: lvl,
    left: document.getElementById(`talent-${lvl}-left`).value.trim(),
    right: document.getElementById(`talent-${lvl}-right`).value.trim()
  })).filter(t => t.left || t.right);
}

function saveAdminHero(e) {
  e.preventDefault();
  const id   = document.getElementById('f-id').value.trim();
  const name = document.getElementById('f-name').value.trim();
  if (!id || !name) { alert('Заполни ID и имя'); return; }

  const positions = Array.from(document.querySelectorAll('input[name="pos"]:checked')).map(cb => +cb.value);

  const pendingImg = document.getElementById('heroImageBox').dataset.pendingImg;
  if (pendingImg) {
    heroImages[id] = pendingImg;
    saveJSON(IMAGES_KEY, heroImages);
  }

  const items = getFormItems();

  const counters = Array.from(document.querySelectorAll('#countersEditor .counter-chip'))
    .map(chip => {
      const inputs = chip.querySelectorAll('input');
      return { heroId: inputs[0].value.trim(), reason: inputs[1].value.trim() };
    }).filter(c => c.heroId);

  const skillBuild = getSkillBuildFromForm();
  const talents = getTalentsFromForm();

  const hero = {
    id,
    name,
    nameRu: name,
    attr:       document.getElementById('f-attr').value,
    attackType: document.getElementById('f-attack').value,
    positions,
    tags: [],
    summary: document.getElementById('f-summary').value.trim(),
    abilities: [],
    talents,
    skillBuild,
    items,
    counters,
    counterItems: [],
    allies: []
  };

  const idx = customHeroes.findIndex(h => h.id === id);
  if (idx >= 0) {
    customHeroes[idx] = hero;
  } else {
    customHeroes.push(hero);
  }
  saveCustomHeroes();
  renderGrid();
  refreshAdminList();

  const btn = document.querySelector('#adminForm button[type="submit"]');
  if (btn) { btn.textContent = '✓ Сохранено!'; setTimeout(() => { btn.textContent = '💾 Сохранить'; }, 1800); }
}

function deleteAdminHero() {
  const id = document.getElementById('f-id').value;
  const idx = customHeroes.findIndex(h => h.id === id);
  if (idx === -1) {
    alert('Нельзя удалить базового героя!');
    return;
  }
  if (!confirm(`Удалить героя ${id}?`)) return;
  customHeroes.splice(idx, 1);
  delete heroImages[id];
  saveCustomHeroes();
  saveJSON(IMAGES_KEY, heroImages);
  activeAdminHeroId = null;
  renderGrid();
  refreshAdminList();
  document.getElementById('adminFormEmpty').style.display = '';
  document.getElementById('adminForm').classList.add('hidden');
}

function renderItemChips(phase, items) {
  const container = document.getElementById('slots-' + phase);
  if (!container) return;
  container.innerHTML = items.map((item, idx) => {
    const id   = typeof item === 'string' ? item : item.id;
    const name = typeof item === 'string' ? item : item.name;
    const img  = itemImages[id];
    return `<div class="item-chip" data-phase="${phase}" data-idx="${idx}">
      <div class="chip-img">${img ? `<img src="${img}">` : '🎒'}</div>
      <span>${name}</span>
      <button class="item-chip-remove" data-phase="${phase}" data-idx="${idx}" type="button">✕</button>
    </div>`;
  }).join('');
  container.querySelectorAll('.item-chip-remove').forEach(btn => {
    btn.addEventListener('click', () => removeItemChip(btn.dataset.phase, +btn.dataset.idx));
  });
}

function removeItemChip(phase, idx) {
  const heroId = document.getElementById('f-id').value;
  const hero = heroId ? allHeroes().find(h => h.id === heroId) : null;
  if (!hero) return;
  const items = hero.items || {};
  if (!items[phase]) return;
  items[phase].splice(idx, 1);
  hero.items = items;
  renderItemChips(phase, items[phase]);
}

function getFormItems() {
  const phases = ['starting','early','mid','late','situational'];
  const result = {};
  phases.forEach(ph => {
    const container = document.getElementById('slots-' + ph);
    result[ph] = Array.from(container.querySelectorAll('.item-chip')).map(chip => {
      const name = chip.querySelector('span').textContent.trim();
      return { id: name.toLowerCase().replace(/\s/g,'_'), name };
    });
  });
  return result;
}

let pendingPhase = null;

function openItemModal(phase) {
  pendingPhase = phase;
  document.getElementById('im-name').value = '';
  document.getElementById('im-timing').value = '';
  document.getElementById('im-reason').value = '';
  document.getElementById('itemImgPreview').innerHTML = `<div class="img-placeholder-icon">🎒</div><span>PNG/JPG</span>`;
  document.getElementById('itemImageBox').dataset.pendingImg = '';
  document.getElementById('im-timing-group').style.display = phase === 'starting' ? 'none' : 'block';
  const phaseNames = {
    starting: 'Стартовый предмет',
    early: 'Предмет ранней игры',
    mid: 'Предмет середины игры',
    late: 'Предмет поздней игры',
    situational: 'Ситуативный предмет'
  };
  const title = document.querySelector('.item-modal-box h3');
  if (title) title.textContent = `➕ Добавить ${phaseNames[phase] || 'предмет'}`;
  
  document.getElementById('itemModal').classList.remove('hidden');
}

function closeItemModal() {
  document.getElementById('itemModal').classList.add('hidden');
  pendingPhase = null;
}

function confirmItemAdd() {
  const name   = document.getElementById('im-name').value.trim();
  const timing = document.getElementById('im-timing').value.trim();
  const reason = document.getElementById('im-reason').value.trim();
  const imgSrc = document.getElementById('itemImageBox').dataset.pendingImg;
  if (!name) { alert('Введи название предмета'); return; }

  const id = name.toLowerCase().replace(/\s/g,'_');
  if (imgSrc) {
    itemImages[id] = imgSrc;
    saveJSON(ITEM_IMG_KEY, itemImages);
  }

  const phase = pendingPhase;
  const container = document.getElementById('slots-' + phase);
  const idx = container.querySelectorAll('.item-chip').length;

  const chip = document.createElement('div');
  chip.className = 'item-chip';
  chip.dataset.phase = phase;
  chip.dataset.idx = idx;
  chip.innerHTML = `
    <div class="chip-img">${imgSrc ? `<img src="${imgSrc}">` : '🎒'}</div>
    <span>${name}</span>
    ${timing ? `<span style="font-size:10px;color:var(--cyan);margin-left:4px;">${timing}</span>` : ''}
    <button class="item-chip-remove" data-phase="${phase}" data-idx="${idx}" type="button">✕</button>`;
  chip.querySelector('.item-chip-remove').addEventListener('click', () => removeItemChip(phase, idx));
  container.appendChild(chip);

  closeItemModal();
}

function handleHeroImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const imgSrc = ev.target.result;
    const preview = document.getElementById('heroImgPreview');
    preview.innerHTML = `<img src="${imgSrc}" style="max-width:80px;max-height:80px;border-radius:6px;object-fit:cover;">`;
    document.getElementById('heroImageBox').dataset.pendingImg = imgSrc;
  };
  reader.readAsDataURL(file);
}

function handleItemImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const imgSrc = ev.target.result;
    document.getElementById('itemImgPreview').innerHTML = `<img src="${imgSrc}" style="max-width:48px;max-height:48px;border-radius:4px;object-fit:cover;">`;
    document.getElementById('itemImageBox').dataset.pendingImg = imgSrc;
  };
  reader.readAsDataURL(file);
}

function renderCounterChips(counters) {
  const ed = document.getElementById('countersEditor');
  if (!ed) return;
  ed.innerHTML = '';
  counters.forEach(c => addCounterChipData(c.heroId, c.reason));
}

function addCounterChip() {
  addCounterChipData('', '');
}

function addCounterChipData(heroId, reason) {
  const ed = document.getElementById('countersEditor');
  if (!ed) return;
  const chip = document.createElement('div');
  chip.className = 'counter-chip';
  chip.innerHTML = `
    <input type="text" class="small" placeholder="ID героя" value="${heroId}">
    <input type="text" placeholder="Почему контрит..." value="${reason}">
    <button class="counter-chip-remove" type="button">✕</button>`;
  chip.querySelector('.counter-chip-remove').addEventListener('click', () => chip.remove());
  ed.appendChild(chip);
}
function exportData() {
  const data = {
    heroes: allHeroes(),
    heroImages: heroImages,
    itemImages: itemImages
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pickmaster_data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.heroes && Array.isArray(data.heroes)) {
          customHeroes = data.heroes;
          heroImages = data.heroImages || {};
          itemImages = data.itemImages || {};
          saveCustomHeroes();
          saveJSON(IMAGES_KEY, heroImages);
          saveJSON(ITEM_IMG_KEY, itemImages);
          renderGrid();
          refreshAdminList();
          alert('Данные успешно импортированы!');
        } else {
          alert('Неверный формат файла');
        }
      } catch (err) {
        alert('Ошибка чтения файла: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function allHeroes() {
  const merged = [...BASE_HEROES];
  customHeroes.forEach(ch => {
    const idx = merged.findIndex(h => h.id === ch.id);
    if (idx >= 0) merged[idx] = ch;
    else merged.push(ch);
  });
  return merged;
}
function initHeroGrid() { renderGrid(); }

function renderGrid() {
  if (!heroGrid || !heroCount) return;
  const query = searchQuery.toLowerCase();
  const filtered = allHeroes().filter(h => {
    const attrOk = currentAttrFilter === 'all' || h.attr === currentAttrFilter;
    const posOk  = currentPosFilter  === 'all' || (h.positions && h.positions.includes(+currentPosFilter));
    const nameOk = !query || h.name.toLowerCase().includes(query);
    return attrOk && posOk && nameOk;
  });
  heroCount.textContent = filtered.length;
  if (!filtered.length) {
    heroGrid.innerHTML = '<div class="no-results">Герои не найдены.</div>';
    return;
  }
  heroGrid.innerHTML = filtered.map(h => heroCardHTML(h)).join('');
  heroGrid.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('click', () => openHeroModal(card.dataset.heroId));
  });
}

function heroCardHTML(h) {
  const imgSrc = heroImages[h.id];
  const imgHTML = imgSrc
    ? `<img src="${imgSrc}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover;">`
    : `<div class="hero-img-placeholder"><div class="hero-init">${h.name[0]}</div><div class="hero-img-label">нет фото</div></div>`;

  const posTags = (h.positions || []).map(p =>
    `<span class="pos-tag">${POSITIONS[p]?.short || p}</span>`
  ).join('');

  return `
    <div class="hero-card" data-hero-id="${h.id}" data-attr="${h.attr}">
      <div class="hero-card-img">${imgHTML}</div>
      <div class="hero-card-info">
        <div class="hero-card-name">${h.name}</div>
        <div class="hero-card-meta">
          <span class="hero-attr-badge ${h.attr}">${ATTRIBUTES[h.attr]?.label || h.attr}</span>
          <div class="hero-pos-tags">${posTags}</div>
        </div>
      </div>
    </div>`;
}
function initFilters() {
  document.querySelectorAll('.attr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.attr-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAttrFilter = btn.dataset.attr;
      renderGrid();
    });
  });
  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pos-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPosFilter = btn.dataset.pos;
      renderGrid();
    });
  });
  if (heroSearch) {
    heroSearch.addEventListener('input', e => {
      searchQuery = e.target.value;
      renderGrid();
    });
  }
}
function initModal() {
  const overlay = document.getElementById('heroModal');
  const closeBtn = document.getElementById('modalClose');
  if (!overlay || !closeBtn) return;
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openHeroModal(heroId) {
  const hero = allHeroes().find(h => h.id === heroId);
  if (!hero) return;
  const content = document.getElementById('modalContent');
  if (!content) return;
  content.innerHTML = buildModalHTML(hero);
  document.getElementById('heroModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById('mpane-' + btn.dataset.pane);
      if (pane) pane.classList.add('active');
    });
  });
}

function closeModal() {
  const modal = document.getElementById('heroModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function buildModalHTML(h) {
  const imgSrc = heroImages[h.id];
  const portrait = imgSrc
    ? `<img src="${imgSrc}" alt="${h.name}">`
    : `<div class="modal-hero-portrait-placeholder">${h.name[0]}</div>`;

  const tags = (h.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');
  const attrLabel = ATTRIBUTES[h.attr]?.label || h.attr;
  const attackLabel = h.attackType === 'melee' ? '⚔ Ближний бой' : '🏹 Дальний бой';

  return `
    <div class="modal-hero-header" data-attr="${h.attr}">
      <div class="modal-hero-portrait">${portrait}</div>
      <div class="modal-hero-meta">
        <div class="modal-hero-name">${h.name}</div>
        <div class="modal-hero-badges">
          <span class="hero-attr-badge ${h.attr}">${attrLabel}</span>
          <span class="attack-type">${attackLabel}</span>
          ${tags}
        </div>
        <div class="modal-hero-summary">${h.summary || ''}</div>
      </div>
    </div>
    <div class="modal-tabs">
      <button class="modal-tab-btn active" data-pane="items">Закуп</button>
      <button class="modal-tab-btn" data-pane="skills">Прокачка</button>
      <button class="modal-tab-btn" data-pane="abilities">Способности</button>
      <button class="modal-tab-btn" data-pane="counters">Контрпики</button>
      <button class="modal-tab-btn" data-pane="talents">Таланты</button>
    </div>
    <div class="modal-tab-content">
      <div class="modal-tab-pane active" id="mpane-items">${buildItemsPane(h)}</div>
      <div class="modal-tab-pane" id="mpane-skills">${buildSkillBuildPane(h)}</div>
      <div class="modal-tab-pane" id="mpane-abilities">${buildAbilitiesPane(h)}</div>
      <div class="modal-tab-pane" id="mpane-counters">${buildCountersPane(h)}</div>
      <div class="modal-tab-pane" id="mpane-talents">${buildTalentsPane(h)}</div>
    </div>`;
}

function buildItemsPane(h) {
  const items = h.items || {};
  const phaseHTML = (list, label, emoji) => {
    if (!list || !list.length) return '';
    const slots = list.map(item => {
      const img = itemImages[item.id];
      return `<div class="item-slot">
        <div class="item-slot-img">${img ? `<img src="${img}">` : '🎒'}</div>
        <div class="item-slot-info">
          <div class="item-slot-name">${item.name || item}</div>
          ${item.timing ? `<div class="item-slot-timing">${item.timing}</div>` : ''}
          ${item.reason ? `<div class="item-slot-reason">${item.reason}</div>` : ''}
        </div>
      </div>`;
    }).join('');
    return `<div class="items-section">
      <div class="items-section-title">${emoji} ${label}</div>
      <div class="items-row">${slots}</div>
    </div>`;
  };

  let html = '';
  html += phaseHTML(items.starting, 'Стартовые предметы', '🟢');
  html += phaseHTML(items.early, 'Ранняя игра', '🔵');
  html += phaseHTML(items.mid, 'Середина игры', '🟡');
  html += phaseHTML(items.late, 'Поздняя игра', '🔴');
  html += phaseHTML(items.situational, 'Ситуативные', '⚪');
  return html || '<p style="color:var(--text-muted);padding:20px 0;">Данные о закупе отсутствуют.</p>';
}

function buildSkillBuildPane(h) {
  if (!h.skillBuild || !h.skillBuild.length)
    return '<p style="color:var(--text-muted);padding:20px 0;">Данные о прокачке отсутствуют.</p>';
  const rows = h.skillBuild.map(s => `
    <div class="skill-row">
      <div class="skill-lvl">${s.level}</div>
      <div class="skill-name">${s.skill}</div>
      <div class="skill-note">${s.note || ''}</div>
    </div>`).join('');
  return `<div class="skill-build">${rows}</div>`;
}

function buildAbilitiesPane(h) {
  if (!h.abilities || !h.abilities.length)
    return '<p style="color:var(--text-muted);padding:20px 0;">Данные о способностях отсутствуют.</p>';
  const cards = h.abilities.map(ab => {
    const dmgClass = ab.damageType ? `dmg-${ab.damageType}` : '';
    return `<div class="ability-card">
      <div class="ability-header">
        <div class="ability-icon">✨</div>
        <div>
          <div class="ability-name">${ab.name}</div>
          <div class="ability-stats">
            ${ab.cooldown && ab.cooldown !== '—' ? `<span class="ab-stat">КД <span>${ab.cooldown}</span></span>` : ''}
            ${ab.manaCost && ab.manaCost !== '—' ? `<span class="ab-stat">Мана <span>${ab.manaCost}</span></span>` : ''}
            ${ab.range ? `<span class="ab-stat">Дальность <span>${ab.range}</span></span>` : ''}
            ${ab.damageType && ab.damageType !== 'none' ? `<span class="ab-stat ${dmgClass}">Урон <span>${ab.damageType}</span></span>` : ''}
          </div>
        </div>
      </div>
      <div class="ability-desc">${ab.description}</div>
    </div>`;
  }).join('');
  return `<div class="abilities-grid">${cards}</div>`;
}

function buildCountersPane(h) {
  let html = '';
  if (h.counters && h.counters.length) {
    const rows = h.counters.map(c => {
      const counter = allHeroes().find(x => x.id === c.heroId);
      const name    = counter ? counter.name : c.heroId;
      const wr      = c.winrateAgainst;
      return `<div class="counter-hero-row">
        <div class="counter-hero-portrait">${name[0]}</div>
        <div class="counter-info">
          <div class="counter-hero-name">${name}</div>
          <div class="counter-reason">${c.reason}</div>
        </div>
        ${wr ? `<div class="counter-wr bad">${wr}% WR</div>` : ''}
      </div>`;
    }).join('');
    html += `<div style="margin-bottom:24px">
      <div class="items-section-title">⚔ Контрпики (кто сильнее ${h.name})</div>
      <div class="counters-list">${rows}</div>
    </div>`;
  }

  if (h.counterItems && h.counterItems.length) {
    const rows = h.counterItems.map(ci => `
      <div class="counter-hero-row">
        <div class="counter-hero-portrait">🎒</div>
        <div class="counter-info">
          <div class="counter-hero-name">${ci.name}</div>
          <div class="counter-reason">${ci.reason}</div>
        </div>
      </div>`).join('');
    html += `<div style="margin-bottom:24px">
      <div class="items-section-title">🎒 Предметы против ${h.name}</div>
      <div class="counters-list">${rows}</div>
    </div>`;
  }

  if (h.allies && h.allies.length) {
    const rows = h.allies.map(a => {
      const ally   = allHeroes().find(x => x.id === a.heroId);
      const name   = ally ? ally.name : a.heroId;
      return `<div class="counter-hero-row">
        <div class="counter-hero-portrait">${name[0]}</div>
        <div class="counter-info">
          <div class="counter-hero-name">${name}</div>
          <div class="counter-reason">${a.reason}</div>
        </div>
        ${a.winrate ? `<div class="counter-wr good">${a.winrate}% WR</div>` : ''}
      </div>`;
    }).join('');
    html += `<div>
      <div class="items-section-title">🤝 Союзники</div>
      <div class="counters-list">${rows}</div>
    </div>`;
  }

  return html || '<p style="color:var(--text-muted);padding:20px 0;">Данные о контрпиках отсутствуют.</p>';
}

function buildTalentsPane(h) {
  if (!h.talents || !h.talents.length)
    return '<p style="color:var(--text-muted);padding:20px 0;">Данные о талантах отсутствуют.</p>';
  const rows = [...h.talents].reverse().map(t => `
    <tr>
      <td class="talent-option">${t.left}</td>
      <td class="talent-vs">или</td>
      <td class="talent-lvl">уровень ${t.level}</td>
      <td class="talent-vs">или</td>
      <td class="talent-option">${t.right}</td>
    </tr>`).join('');
  return `<table class="talents-table"><tbody>${rows}</tbody></table>`;
}

function loadCustomHeroes() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveCustomHeroes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customHeroes));
}
function loadJSON(key, def) {
  try { return JSON.parse(localStorage.getItem(key)) || def; }
  catch { return def; }
}
function saveJSON(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function initDraft() {
  if (enemyTeam.length === 0) generateEnemyTeam();
  renderEnemyTeam();
  renderOurPicks();

  document.getElementById('newEnemyBtn')?.addEventListener('click', () => {
    generateEnemyTeam();
    renderEnemyTeam();
    resetOurPicks();
    document.getElementById('draftResult').style.display = 'none';
  });

  document.getElementById('evaluateDraftBtn')?.addEventListener('click', evaluateDraft);
  document.getElementById('resetDraftBtn')?.addEventListener('click', resetDraft);

  document.getElementById('pickerModalClose')?.addEventListener('click', closePickerModal);
  document.getElementById('pickerModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePickerModal();
  });

  document.getElementById('pickerSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    renderPickerGrid(query);
  });
}

function generateEnemyTeam() {
  const heroes = allHeroes();
  const roles = [1, 2, 3, 4, 5];
  const newTeam = [];

  roles.forEach(role => {
    const candidates = heroes.filter(h => h.positions && h.positions.includes(role));
    if (candidates.length === 0) {
      const anyHero = heroes[Math.floor(Math.random() * heroes.length)];
      newTeam.push(anyHero);
    } else {
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      newTeam.push(chosen);
    }
  });

  enemyTeam = newTeam;
}

function renderEnemyTeam() {
  const container = document.getElementById('enemyRoles');
  if (!container) return;

  container.innerHTML = enemyTeam.map((hero, index) => {
    const role = index + 1;
    return `
      <div class="enemy-slot">
        <div class="role-label">${ROLE_NAMES[role]}</div>
        <div class="enemy-hero-display">
          ${buildMiniHeroCard(hero, 'enemy')}
        </div>
      </div>
    `;
  }).join('');
}

function buildMiniHeroCard(hero, type = 'our') {
  if (!hero) {
    return `<div class="placeholder">Нет героя</div>`;
  }

  const imgSrc = heroImages[hero.id] || '';
  const attrLabel = ATTRIBUTES[hero.attr]?.label || hero.attr;
  const posLabels = (hero.positions || []).map(p => POSITIONS[p]?.short || p).join(' ');

  return `
    <div class="hero-mini-card">
      <div class="mini-img">
        ${imgSrc ? `<img src="${imgSrc}" alt="${hero.name}">` : '🎭'}
      </div>
      <div class="mini-name">${hero.name}</div>
      <div class="mini-meta">
        <span class="hero-attr-badge ${hero.attr}">${attrLabel}</span>
        <span>${posLabels}</span>
      </div>
    </div>
  `;
}

function renderOurPicks() {
  const container = document.getElementById('ourRoles');
  if (!container) return;

  const roles = [1, 2, 3, 4, 5];
  container.innerHTML = roles.map(role => {
    const heroId = ourPicks[role] || null;
    const hero = heroId ? allHeroes().find(h => h.id === heroId) : null;

    let displayHTML = '';
    if (hero) {
      displayHTML = buildMiniHeroCard(hero, 'our');
    } else {
      displayHTML = `<div class="placeholder">Не выбран</div>`;
    }

    return `
      <div class="our-slot">
        <div class="role-label">${ROLE_NAMES[role]}</div>
        <div class="our-hero-display ${hero ? '' : 'empty'}">
          ${displayHTML}
        </div>
        <button class="btn-pick btn-secondary" data-role="${role}">Выбрать</button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-pick').forEach(btn => {
    btn.addEventListener('click', () => {
      const role = parseInt(btn.dataset.role);
      openPickerModal(role);
    });
  });
}

function openPickerModal(role) {
  currentPickerRole = role;
  const modal = document.getElementById('pickerModal');
  const title = document.getElementById('pickerModalTitle');
  if (title) title.textContent = `Выберите героя для ${ROLE_NAMES[role]}`;
  const search = document.getElementById('pickerSearch');
  if (search) search.value = '';
  renderPickerGrid('');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closePickerModal() {
  const modal = document.getElementById('pickerModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  currentPickerRole = null;
}

function renderPickerGrid(query = '') {
  const grid = document.getElementById('pickerGrid');
  if (!grid) return;

  const role = currentPickerRole;
  if (!role) return;

  const heroes = allHeroes();
  let filtered = heroes.filter(h => h.positions && h.positions.includes(role));

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(h => h.name.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">Нет героев, подходящих на эту роль</div>`;
    return;
  }

  grid.innerHTML = filtered.map(hero => {
    const imgSrc = heroImages[hero.id] || '';
    const attrLabel = ATTRIBUTES[hero.attr]?.label || hero.attr;
    const posLabels = (hero.positions || []).map(p => POSITIONS[p]?.short || p).join(' ');

    return `
      <div class="picker-card" data-hero-id="${hero.id}">
        <div class="card-img">
          ${imgSrc ? `<img src="${imgSrc}" alt="${hero.name}">` : '🎭'}
        </div>
        <div class="card-name">${hero.name}</div>
        <div class="card-attr ${hero.attr}">${attrLabel}</div>
        <div class="card-positions">${posLabels}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.picker-card').forEach(card => {
    card.addEventListener('click', () => {
      const heroId = card.dataset.heroId;
      if (currentPickerRole !== null) {
        ourPicks[currentPickerRole] = heroId;
        renderOurPicks();
        closePickerModal();
        document.getElementById('draftResult').style.display = 'none';
      }
    });
  });
}

function evaluateDraft() {
  const roles = [1, 2, 3, 4, 5];
  const missing = roles.filter(r => !ourPicks[r]);
  if (missing.length > 0) {
    alert(`Выберите героев для ролей: ${missing.map(r => ROLE_NAMES[r]).join(', ')}`);
    return;
  }

  if (enemyTeam.length !== 5) {
    alert('Сначала сгенерируйте вражескую команду!');
    return;
  }

  const heroes = allHeroes();
  let totalScore = 0;
  const maxPerRole = 20;
  const details = [];

  roles.forEach(role => {
    const heroId = ourPicks[role];
    const ourHero = heroes.find(h => h.id === heroId);
    if (!ourHero) return;

    let roleScore = 0;
    let comments = [];

    enemyTeam.forEach(enemy => {
      const enemyCounters = enemy.counters || [];
      const isCounter = enemyCounters.some(c => c.heroId === ourHero.id);
      if (isCounter) {
        roleScore += 5;
        comments.push(`против ${enemy.name} (контр-пик)`);
      }

      const enemyAllies = enemy.allies || [];
      const isAlly = enemyAllies.some(a => a.heroId === ourHero.id);
      if (isAlly) {
        roleScore -= 5;
        comments.push(`против ${enemy.name} (синергия с врагом)`);
      }

      const ourCounters = ourHero.counters || [];
      const isOurCounter = ourCounters.some(c => c.heroId === enemy.id);
      if (isOurCounter) {
        roleScore += 3;
        comments.push(`против ${enemy.name} (обратный контр-пик)`);
      }
    });

    const clampedScore = Math.max(0, Math.min(maxPerRole, roleScore));
    totalScore += clampedScore;

    let commentText = '';
    let status = 'neutral';
    if (clampedScore >= 15) {
      commentText = 'Отлично контрпикнул!';
      status = 'good';
    } else if (clampedScore >= 8) {
      commentText = 'Неплохой пик';
      status = 'neutral';
    } else {
      commentText = 'Слабый пик, можно лучше';
      status = 'bad';
    }

    details.push({
      role,
      heroName: ourHero.name,
      score: clampedScore,
      comment: commentText,
      status,
      details: comments.length ? comments.join('; ') : 'нейтрально'
    });
  });

  const finalScore = Math.round((totalScore / (maxPerRole * 5)) * 100);
  showDraftResult(finalScore, details);
}

function showDraftResult(score, details) {
  const container = document.getElementById('draftResult');
  if (!container) return;
  document.getElementById('scoreNumber').textContent = score;

  let feedback = '';
  if (score >= 80) feedback = '🌟 Отличный драфт! Вы полностью переиграли соперника!';
  else if (score >= 60) feedback = '👍 Хороший драфт! Есть куда расти, но вы на правильном пути.';
  else if (score >= 40) feedback = '🤔 Средний драфт. Попробуйте выбирать более сильные контр-пики.';
  else feedback = '😬 Слабый драфт. Вам нужно лучше изучить контр-пики!';
  document.getElementById('resultFeedback').textContent = feedback;

  let detailsHTML = '';
  details.forEach(d => {
    const statusClass = d.status === 'good' ? 'detail-good' : d.status === 'bad' ? 'detail-bad' : 'detail-neutral';
    const scoreDisplay = d.score > 0 ? `+${d.score}` : d.score;
    detailsHTML += `
      <div class="result-detail-item">
        <span class="detail-role">${ROLE_NAMES[d.role]}</span>
        <span><strong>${d.heroName}</strong> — ${d.comment}</span>
        <span class="${statusClass}" style="margin-left:auto;">${scoreDisplay}</span>
        <span style="font-size:11px;color:var(--text-muted);margin-left:8px;">${d.details}</span>
      </div>
    `;
  });
  document.getElementById('resultDetails').innerHTML = detailsHTML;

  container.style.display = 'block';
}

function resetDraft() {
  resetOurPicks();
  generateEnemyTeam();
  renderEnemyTeam();
  document.getElementById('draftResult').style.display = 'none';
}

function resetOurPicks() {
  ourPicks = {};
  renderOurPicks();
}

function renderDraft() {
  if (enemyTeam.length === 0) generateEnemyTeam();
  renderEnemyTeam();
  renderOurPicks();
}
