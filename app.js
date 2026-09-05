(() => {
  const ICONS = {
    bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="4"/><path d="M12 2v3"/><circle cx="8.5" cy="12" r="1"/><circle cx="15.5" cy="12" r="1"/><path d="M8 16h8"/></svg>',
    compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16 8 14 14 8 16 10 10 16 8"/></svg>',
    sparkles:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.7 1.9 1.8.6L19 18l-.7 1.9-.7-1.9-1.8-.6 1.8-.6L19 15z"/></svg>',
    palette:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.7-1.1-.7-1.7 0-1.4 1.1-2.5 2.5-2.5H19c1.7 0 3-2.2 3-4.7C22 5.6 17.5 2 12 2Z"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/></svg>',
    smile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/></svg>',
    headphones:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 16v3a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 1zM3 16v3a2 2 0 0 0 2 2h2v-6H5a2 2 0 0 0-2 1z"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    external:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
  };

  const DATA = (window.CLYDE_DATA && window.CLYDE_DATA.verified) || [];
  const $ = (id) => document.getElementById(id);
  const input = $('search-input'), grid = $('art-grid'), title = $('section-title'), count = $('result-count');
  const clear = $('clear-search'), status = $('search-status'), empty = $('empty-state'), suggestions = $('suggestions');

  const normalize = (s) => String(s ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paintIcons = () => document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = ICONS[el.dataset.icon] || '');

  function searchMatches(item, term) {
    const hay = normalize([item.title, item.artist, ...(item.tags || []), item.note].join(' '));
    return normalize(term).split(/\s+/).filter(Boolean).every(word => hay.includes(word));
  }

  function openLiveSearch(term) {
    const q = (term || 'Clyde Discord').trim();
    const url = new URL('https://www.newgrounds.com/search/conduct/art');
    url.searchParams.set('q', q);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }

  function render(items, term = '') {
    grid.innerHTML = '';
    empty.classList.toggle('hidden', items.length !== 0);

    items.forEach((item) => {
      const media = item.image
        ? `<button class="art-image-wrap block w-full text-left" type="button">
             <img class="art-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} by ${escapeHtml(item.artist)}" loading="lazy" referrerpolicy="no-referrer">
             <span class="source-badge">NEWGROUNDS</span>
             <span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span>
           </button>`
        : `<a class="no-image" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
             <div class="no-image-inner"><span class="icon w-8 h-8 text-[#8ea1ff]" data-icon="external"></span><strong>Open artwork</strong><small>Newgrounds page</small></div>
             <span class="source-badge">NEWGROUNDS</span>
           </a>`;

      const card = document.createElement('article');
      card.className = 'art-card';
      card.innerHTML = `${media}
        <div class="p-4">
          <div class="flex items-center justify-between gap-2 mb-1">
            <h3 class="font-bold text-white text-sm truncate" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
          </div>
          <div class="text-xs text-[#b5bac1] mb-2">by ${escapeHtml(item.artist)}</div>
          <p class="text-xs text-[#949ba4] leading-5 mb-3">${escapeHtml(item.note)}</p>
          <div class="flex flex-wrap gap-1.5 mb-3">${(item.tags || []).map(tag => `<span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${escapeHtml(tag)}</span>`).join('')}</div>
          <a class="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ea1ff] hover:text-white" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
            View on Newgrounds <span class="icon w-3.5 h-3.5" data-icon="external"></span>
          </a>
        </div>`;

      if (item.image) {
        card.querySelector('button').addEventListener('click', () => openLightbox(item));
      }
      grid.appendChild(card);
    });

    title.textContent = term ? `Clyde results for “${term}”` : 'Verified Clyde artworks from Newgrounds';
    count.textContent = `${items.length} result${items.length === 1 ? '' : 's'}`;
    clear.classList.toggle('hidden', !term);
    paintIcons();
  }

  function openLightbox(item) {
    $('lightbox-img').src = item.image;
    $('lightbox-img').alt = item.title;
    $('lightbox-caption').innerHTML = `<strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.artist)}<br><a class="text-[#8ea1ff] hover:underline" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open on Newgrounds ↗</a>`;
    $('lightbox').classList.remove('hidden');
    $('lightbox').classList.add('flex');
  }

  function closeLightbox() {
    $('lightbox').classList.add('hidden');
    $('lightbox').classList.remove('flex');
    $('lightbox-img').src = '';
  }

  function updateStatus(term = '') {
    status.innerHTML = `Source: <strong>Newgrounds</strong>. Search the live art index <button id="live-search" class="underline text-white hover:text-[#d8ddff]" type="button">here ↗</button>.`;
    $('live-search').onclick = () => openLiveSearch(term);
  }

  $('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const term = input.value.trim();
    const results = DATA.filter(item => !term || searchMatches(item, term));
    render(results, term);
    updateStatus(term);
    if (!results.length) {
      suggestions.innerHTML = ['furry Clyde','anthro Clyde','Clyde Discord','Clyde fanart'].map(s => `<button class="suggestion" type="button" data-suggest="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join('');
      suggestions.querySelectorAll('[data-suggest]').forEach(btn => btn.addEventListener('click', () => {
        input.value = btn.dataset.suggest;
        $('search-form').requestSubmit();
      }));
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    status.textContent = '';
    render(DATA);
  });

  document.querySelectorAll('[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const term = btn.dataset.category || '';
      input.value = term;
      const results = DATA.filter(item => !term || searchMatches(item, term));
      render(results, term);
      updateStatus(term);
    });
  });

  $('lightbox').addEventListener('click', event => {
    if (event.target === $('lightbox')) closeLightbox();
  });
  $('lightbox-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });

  paintIcons();
  render(DATA);
  updateStatus();
})();