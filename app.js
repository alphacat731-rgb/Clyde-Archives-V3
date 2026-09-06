(() => {
  const ICONS = {
    bot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="4"/><path d="M12 2v3"/><circle cx="8.5" cy="12" r="1"/><circle cx="15.5" cy="12" r="1"/><path d="M8 16h8"/></svg>',
    compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16 8 14 14 8 16 10 10 16 8"/></svg>',
    sparkles:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.7 1.9 1.8.6L19 18l-.7 1.9-.7-1.9-1.8-.6 1.8-.6L19 15z"/></svg>',
    palette:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2-.5-.5-.7-1.1-.7-1.7 0-1.4 1.1-2.5 2.5-2.5H19c1.7 0 3-2.2 3-4.7C22 5.6 17.5 2 12 2Z"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/></svg>',
    smile:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4M8 22h8"/></svg>',
    headphones:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 16v3a2 2 0 0 1-2 2h-2v-6h2a2 2 0 0 1 2 1zM3 16v3a2 2 0 0 0 2 2h2v-6H5a2 2 0 0 0-2 1z"/></svg>',
    settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a1.7 1.7 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3l.1-.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    external:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    chevronLeft:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
    chevronRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
  };

  const DATA = (window.CLYDE_DATA && window.CLYDE_DATA.verified) || [];
  const PAGE_SIZE = 6;
  let currentPage = 1;
  let activeResults = [...DATA];
  let activeTerm = '';
  let activeSource = 'All Sources';

  const $ = id => document.getElementById(id);
  const input = $('search-input'), grid = $('art-grid'), title = $('section-title'), count = $('result-count');
  const clear = $('clear-search'), status = $('search-status'), empty = $('empty-state'), suggestions = $('suggestions');
  const normalize = s => String(s ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paintIcons = () => document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML=ICONS[el.dataset.icon] || '');

  function searchMatches(item, term) {
    const q = normalize(term).split(/\s+/).filter(Boolean);
    if (!q.length) return true;
    const hay = normalize([item.title,item.artist,item.note,...(item.tags||[]),item.source].join(' '));
    return q.every(word => hay.includes(word));
  }

  function applyFilters(){
    activeResults = DATA.filter(item => (activeSource==='All Sources' || item.source===activeSource) && searchMatches(item, activeTerm));
  }

  function renderSourceFilters(){
    let box = $('source-filters');
    if(!box){
      box=document.createElement('div');
      box.id='source-filters';
      box.className='mb-5 flex flex-wrap items-center justify-center gap-2';
      grid.parentElement.insertBefore(box,grid);
    }
    const sources=['All Sources',...new Set(DATA.map(item=>item.source).filter(Boolean))];
    box.innerHTML='';
    sources.forEach(source=>{
      const b=document.createElement('button'); b.type='button'; b.textContent=source;
      b.className=`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-[#3b3d44] transition ${source===activeSource?'bg-[#5865f2] text-white':'bg-[#2b2d31] text-[#b5bac1] hover:bg-[#35373c] hover:text-white'}`;
      b.onclick=()=>{activeSource=source;currentPage=1;applyFilters();renderPage();updateStatus(activeTerm);};
      box.appendChild(b);
    });
  }

  function renderPagination(total){
    const nav=$('pagination'); if(!nav) return;
    nav.innerHTML='';
    const pages=Math.max(1,Math.ceil(total/PAGE_SIZE));
    nav.classList.toggle('hidden',pages<=1);
    if(pages<=1) return;
    const button=(label,disabled,handler,icon='')=>{
      const b=document.createElement('button'); b.type='button'; b.disabled=disabled;
      b.className='h-9 min-w-9 px-3 rounded-full bg-[#2b2d31] text-[#dbdee1] ring-1 ring-[#3b3d44] hover:bg-[#35373c] disabled:opacity-35 disabled:cursor-not-allowed';
      b.innerHTML=icon?`<span class="icon w-4 h-4">${ICONS[icon]}</span>`:label; b.onclick=handler; nav.appendChild(b);
    };
    button('Prev',currentPage===1,()=>goPage(currentPage-1),'chevronLeft');
    const start=Math.max(1,Math.min(currentPage-2,pages-4));
    const end=Math.min(pages,start+4);
    for(let p=start;p<=end;p++){
      const b=document.createElement('button'); b.type='button'; b.textContent=p;
      b.className=`h-9 min-w-9 px-3 rounded-full ring-1 ring-[#3b3d44] ${p===currentPage?'bg-[#5865f2] text-white':'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c]'}`;
      b.onclick=()=>goPage(p); nav.appendChild(b);
    }
    button('Next',currentPage===pages,()=>goPage(currentPage+1),'chevronRight');
  }

  function goPage(page){ currentPage=page; renderPage(); grid.scrollIntoView({behavior:'smooth',block:'start'}); }

  function renderPage(){
    grid.innerHTML='';
    const pages=Math.max(1,Math.ceil(activeResults.length/PAGE_SIZE));
    currentPage=Math.min(Math.max(currentPage,1),pages);
    const start=(currentPage-1)*PAGE_SIZE;
    const visible=activeResults.slice(start,start+PAGE_SIZE);
    empty.classList.toggle('hidden',activeResults.length!==0);
    visible.forEach(item=>{
      const source=escapeHtml(item.source || 'Source');
      const media=item.image
        ? `<button class="art-image-wrap block w-full text-left" type="button" aria-label="Preview ${escapeHtml(item.title)}"><img class="art-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} by ${escapeHtml(item.artist)}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${source}</span><span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span></button>`
        : `<a class="no-image" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><span class="icon w-8 h-8 text-[#8ea1ff]" data-icon="external"></span><strong>Open artwork</strong><small>${source} page</small></div><span class="source-badge">${source}</span></a>`;
      const card=document.createElement('article'); card.className='art-card';
      card.innerHTML=`${media}<div class="p-4"><h3 class="font-bold text-white text-sm truncate" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3><div class="text-xs text-[#b5bac1] mb-2 mt-1">by ${escapeHtml(item.artist)}</div><p class="text-xs text-[#949ba4] leading-5 mb-3">${escapeHtml(item.note)}</p><div class="flex flex-wrap gap-1.5 mb-3">${(item.tags||[]).map(t=>`<span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${escapeHtml(t)}</span>`).join('')}</div><a class="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ea1ff] hover:text-white" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">View on ${source} <span class="icon w-3.5 h-3.5" data-icon="external"></span></a></div>`;
      if(item.image) card.querySelector('button').onclick=()=>openLightbox(item);
      grid.appendChild(card);
    });
    const sourceLabel=activeSource==='All Sources'?'multiple sources':activeSource;
    title.textContent=activeTerm?`Clyde results for “${activeTerm}”`:`Verified Clyde artwork from ${sourceLabel}`;
    count.textContent=`${activeResults.length} result${activeResults.length===1?'':'s'} · page ${currentPage} of ${pages}`;
    clear.classList.toggle('hidden',!activeTerm);
    paintIcons(); renderPagination(activeResults.length); renderSourceFilters();
  }

  function openLightbox(item){ $('lightbox-img').src=item.image; $('lightbox-img').alt=item.title; $('lightbox-caption').innerHTML=`<strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.artist)}<br><a class="text-[#8ea1ff] hover:underline" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">Open source page ↗</a>`; $('lightbox').classList.remove('hidden'); $('lightbox').classList.add('flex'); }
  function closeLightbox(){ $('lightbox').classList.add('hidden'); $('lightbox').classList.remove('flex'); $('lightbox-img').src=''; }
  function updateStatus(term=''){ status.innerHTML=term?`Searching the verified Clyde index across <strong>${escapeHtml(activeSource)}</strong>.`:`Verified image index using direct artwork previews where available; link-only entries open their original source page.`; }
  function runSearch(term){ activeTerm=term.trim(); currentPage=1; applyFilters(); renderPage(); updateStatus(activeTerm); if(!activeResults.length){ suggestions.innerHTML=['Clyde','Discord Clyde','Clyde fanart','anthro Clyde'].map(s=>`<button class="suggestion" type="button" data-suggest="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join(''); suggestions.querySelectorAll('[data-suggest]').forEach(b=>b.onclick=()=>{input.value=b.dataset.suggest;runSearch(b.dataset.suggest);}); } else suggestions.innerHTML=''; }

  $('search-form').addEventListener('submit',e=>{e.preventDefault();runSearch(input.value);});
  clear.addEventListener('click',()=>{input.value='';activeTerm='';activeSource='All Sources';currentPage=1;applyFilters();renderPage();updateStatus();});
  document.querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nav-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');input.value=btn.dataset.category||'';runSearch(btn.dataset.category||'');}));
  $('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))closeLightbox();});
  $('lightbox-close').addEventListener('click',closeLightbox);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});
  paintIcons(); applyFilters(); renderPage(); updateStatus();
})();
