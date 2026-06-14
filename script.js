
const state = { category: 'Все', q: '', limit: 24 };

const categoryGrid = document.getElementById('categoryGrid');
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const showMore = document.getElementById('showMore');

function money(v){
  if(!v) return 'по запросу';
  return String(v).replace('.', ',') + ' ₽';
}
function renderCategories(){
  categoryGrid.innerHTML = CATEGORIES.map(cat => `
    <article class="category-card" data-category="${cat.name}">
      <img src="${cat.image}" alt="${cat.name}">
      <div class="category-info">
        <h3>${cat.name}</h3>
        <p>${cat.description}</p>
        <span class="count">${cat.count} позиций</span>
      </div>
    </article>`).join('');
  document.querySelectorAll('.category-card').forEach(card=>{
    card.addEventListener('click',()=>{
      state.category = card.dataset.category;
      categorySelect.value = state.category;
      state.limit = 24;
      renderProducts();
      document.querySelector('.products-section').scrollIntoView({behavior:'smooth'});
    });
  });
}
function renderSelect(){
  categorySelect.innerHTML = '<option>Все</option>' + CATEGORIES.map(c=>`<option>${c.name}</option>`).join('');
}
function filtered(){
  const q = state.q.toLowerCase().trim();
  return PRODUCTS.filter(p=>{
    const okCat = state.category === 'Все' || p.category === state.category;
    const okQ = !q || [p.name,p.code,p.category].join(' ').toLowerCase().includes(q);
    return okCat && okQ;
  });
}
function renderProducts(){
  const arr = filtered();
  const list = arr.slice(0,state.limit);
  productGrid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="cat">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="meta">
        <span>Код: <b>${p.code || '—'}</b></span>
        <span>Ед.: <b>${p.unit || '—'}</b></span>
        <span>Остаток: <b>${p.stock || '—'}</b></span>
        <span>№: <b>${p.num}</b></span>
      </div>
      <div class="price">${money(p.price)}</div>
      <a href="#request" class="btn secondary" style="margin-top:12px;width:100%">Запросить наличие</a>
    </article>
  `).join('');
  showMore.style.display = arr.length > state.limit ? 'flex' : 'none';
}
searchInput.addEventListener('input', e=>{ state.q=e.target.value; state.limit=24; renderProducts(); });
categorySelect.addEventListener('change', e=>{ state.category=e.target.value; state.limit=24; renderProducts(); });
showMore.addEventListener('click', ()=>{ state.limit += 24; renderProducts(); });
renderCategories(); renderSelect(); renderProducts();
