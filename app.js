'use strict';

/* ========== Estado y persistencia ========== */
const STORAGE_KEY = 'workdesk:v1';

const STATUSES = {
  pending: 'Pendiente',
  progress: 'En progreso',
  done: 'Completada',
};

const load = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { clients: data?.clients ?? [], orders: data?.orders ?? [] };
  } catch {
    return { clients: [], orders: [] };
  }
};

const state = load();
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

/* ========== Utilidades ========== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const uid = () => crypto.randomUUID();
const TAX_RATE = 19; // IVA Colombia (%)
const money = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n);
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clientName = (id) => state.clients.find((c) => c.id === id)?.name ?? '—';

/* ========== Navegación ========== */
function showView(name) {
  $$('.view').forEach((v) => (v.hidden = v.id !== `view-${name}`));
  $$('.nav__link').forEach((b) => b.classList.toggle('is-active', b.dataset.view === name));
}

$$('.nav__link').forEach((btn) =>
  btn.addEventListener('click', () => showView(btn.dataset.view))
);

/* ========== Clientes ========== */
function renderClients() {
  const list = $('#client-list');
  list.innerHTML = state.clients.length
    ? state.clients
        .map(
          (c) => `
      <li>
        <div>${escapeHtml(c.name)}<small>${escapeHtml(c.email)}${c.phone ? ' · ' + escapeHtml(c.phone) : ''}</small></div>
        <button class="btn btn--danger" data-del-client="${c.id}" aria-label="Eliminar ${escapeHtml(c.name)}">✕</button>
      </li>`
        )
        .join('')
    : '<li>Aún no hay clientes.</li>';

  $('#order-client').innerHTML = state.clients.length
    ? state.clients.map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')
    : '<option value="" disabled selected>Crea un cliente primero</option>';
}

$('#client-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  state.clients.push({
    id: uid(),
    name: f.get('name').trim(),
    email: f.get('email').trim(),
    phone: f.get('phone').trim(),
  });
  save();
  e.target.reset();
  renderAll();
});

$('#client-list').addEventListener('click', (e) => {
  const id = e.target.dataset.delClient;
  if (!id) return;
  if (state.orders.some((o) => o.clientId === id)) {
    alert('Este cliente tiene órdenes asociadas. Elimínalas primero.');
    return;
  }
  state.clients = state.clients.filter((c) => c.id !== id);
  save();
  renderAll();
});

/* ========== Cotizador ========== */
function addLine(desc = '', qty = 1, price = 0) {
  const row = document.createElement('div');
  row.className = 'line';
  row.innerHTML = `
    <input class="l-desc" placeholder="Concepto" value="${escapeHtml(desc)}" aria-label="Concepto">
    <input class="l-qty" type="number" min="1" step="1" value="${qty}" aria-label="Cantidad">
    <input class="l-price" type="number" min="0" step="1" value="${price}" aria-label="Precio unitario">
    <button type="button" class="btn btn--danger" aria-label="Quitar concepto">✕</button>`;
  $('#quote-lines').append(row);
}

function readLines() {
  return $$('.line', $('#quote-lines'))
    .map((row) => ({
      desc: $('.l-desc', row).value.trim(),
      qty: Math.max(0, parseFloat($('.l-qty', row).value) || 0),
      price: Math.max(0, parseFloat($('.l-price', row).value) || 0),
    }))
    .filter((l) => l.desc || l.price);
}

function calcQuote() {
  const subtotal = readLines().reduce((sum, l) => sum + l.qty * l.price, 0);
  const discPct = Math.min(100, Math.max(0, parseFloat($('#q-discount').value) || 0));
  const taxPct = TAX_RATE;
  const discount = subtotal * (discPct / 100);
  const tax = (subtotal - discount) * (taxPct / 100);
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

function renderQuote() {
  const q = calcQuote();
  $('#q-subtotal').textContent = money(q.subtotal);
  $('#q-discount-amt').textContent = '-' + money(q.discount);
  $('#q-tax-amt').textContent = money(q.tax);
  $('#q-total').textContent = money(q.total);
}

$('#add-line').addEventListener('click', () => { addLine(); renderQuote(); });
$('#quote-form').addEventListener('input', renderQuote);
$('#quote-form').addEventListener('submit', (e) => e.preventDefault());
$('#quote-lines').addEventListener('click', (e) => {
  if (e.target.matches('.btn--danger')) {
    e.target.closest('.line').remove();
    renderQuote();
  }
});

$('#save-order-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const items = readLines();
  if (!items.length) return alert('Agrega al menos un concepto.');
  if (!f.get('clientId')) return alert('Selecciona un cliente.');

  state.orders.push({
    id: uid(),
    number: (state.orders.reduce((m, o) => Math.max(m, o.number), 0)) + 1,
    title: f.get('title').trim(),
    clientId: f.get('clientId'),
    items,
    total: calcQuote().total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  save();
  e.target.reset();
  $('#quote-lines').innerHTML = '';
  addLine();
  renderAll();
  showView('orders');
});

/* ========== Órdenes ========== */
function renderOrders() {
  const filter = $('#order-filter').value;
  const orders = state.orders.filter((o) => filter === 'all' || o.status === filter);

  $('#order-body').innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td>${o.number}</td>
      <td>${escapeHtml(o.title)}</td>
      <td>${escapeHtml(clientName(o.clientId))}</td>
      <td>${money(o.total)}</td>
      <td>
        <select data-status="${o.id}" class="badge-${o.status}" aria-label="Estado">
          ${Object.entries(STATUSES)
            .map(([k, v]) => `<option value="${k}" ${k === o.status ? 'selected' : ''}>${v}</option>`)
            .join('')}
        </select>
      </td>
      <td><button class="btn btn--danger" data-del-order="${o.id}" aria-label="Eliminar orden ${o.number}">✕</button></td>
    </tr>`
    )
    .join('');

  $('#order-empty').hidden = orders.length > 0;
}

$('#order-filter').addEventListener('change', renderOrders);

$('#order-body').addEventListener('change', (e) => {
  const id = e.target.dataset.status;
  if (!id) return;
  state.orders.find((o) => o.id === id).status = e.target.value;
  save();
  renderAll();
});

$('#order-body').addEventListener('click', (e) => {
  const id = e.target.dataset.delOrder;
  if (!id || !confirm('¿Eliminar esta orden?')) return;
  state.orders = state.orders.filter((o) => o.id !== id);
  save();
  renderAll();
});

/* ========== Dashboard ========== */
function renderStats() {
  const done = state.orders.filter((o) => o.status === 'done');
  $('#stat-clients').textContent = state.clients.length;
  $('#stat-active').textContent = state.orders.filter((o) => o.status !== 'done').length;
  $('#stat-done').textContent = done.length;
  $('#stat-revenue').textContent = money(done.reduce((s, o) => s + o.total, 0));
}

/* ========== Inicio ========== */
function renderAll() {
  renderClients();
  renderOrders();
  renderStats();
  renderQuote();
}

addLine();
renderAll();
