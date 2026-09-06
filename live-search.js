(() => {
  const SEARCH_API = 'https://api.allorigins.win/get?url=';
  const SOURCES = [
    { name:'Newgrounds', host:'www.newgrounds.com', site:'newgrounds.com/art/view' },
    { name:'DeviantArt', host:'www.deviantart.com', site:'deviantart.com' },
    { name:'Fur Affinity (SFW)', host:'sfw.furaffinity.net', site:'sfw.furaffinity.net' },
    { name:'Wallpapers.com', host:'wallpapers.com', site:'wallpapers.com/wallpapers' }
  ];
  const state = { results:[], query:'', page:1, size:8 };
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const norm = s => String(s ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const proxied = u => SEARCH_API + encodeURIComponent(u);

  function hostAllowed(url){
    try { const h=new URL(url).hostname.toLowerCase(); return SOURCES.some(s=>h===s.host); } catch { return false; }
  }
  function sourceFor(url){
    try { const h=new URL(url).hostname.toLowerCase(); return SOURCES.find(s=>s.host===h)?.name || 'Source'; } catch { return 'Source'; }
  }
  function relevant(title, desc, query){
    const text=norm(`${title} ${desc}`), q=norm(query);
    if(!text.includes('clyde')) return false;
    if(!text.includes('discord') && !text.includes('mascot')) return false;
    if(/furry|anthro|fursona/.test(q) && !/furry|anthro|fur|canine|feline|cat|dog|mascot/.test(text)) return false;
    return true;
  }
  async function fetchText(url){
    const r=await fetch(proxied(url),{headers:{Accept:'application/json'}});
    if(!r.ok) throw new Error(`proxy ${r.status}`);
    const j=await r.json();
    return j.contents || '';
  }
  function parseSearch(xml, query){
    const doc=new DOMParser().parseFromString(xml,'application/xml');
    return [...doc.querySelectorAll('item')].map(item=>({
      title:item.querySelector('title')?.textContent?.trim() || 'Clyde artwork',
      url:item.querySelector('link')?.textContent?.trim() || '',
      note:item.querySelector('description')?.textContent?.replace(/<[^>]+>/g,' ').trim() || '',
      query
    })).filter(x=>x.url && hostAllowed(x.url) && relevant(x.title,x.note,query));
  }
  function meta(html, pageUrl){
    const doc=new DOMParser().parseFromString(html,'text/html');
    const get=(sel,attr='content')=>doc.querySelector(sel)?.getAttribute(attr)?.trim() || '';
    const image=get('meta[property="og:image"]') || get('meta[name="twitter:image"]') || get('meta[property="twitter:image"]');
    const title=get('meta[property="og:title"]') || doc.querySelector('title')?.textContent?.trim() || 'Clyde artwork';
    const desc=get('meta[property="og:description"]') || get('meta[name="description"]') || '';
    const artist=(title.match(/\bby\s+([^|–—-]+)/i)?.[1] || '').trim();
    return { image, title, desc, artist, url:pageUrl };
  }
  async function enrich(result){
    try {
      const html=await fetchText(result.url);
      const m=meta(html,result.url);
      return { id:`live-${result.url.replace(/[^a-z0-9]/gi,'').slice(-40)}`, source:sourceFor(result.url), title:m.title || result.title, artist:m.artist || 'Community artwork', tags:['clyde','discord','live'], url:result.url, image:m.image, note:m.desc || result.note || 'Live result from a verified artwork source.' };
    } catch { return null; }
  }
  function mergeResults(local, live){
    const map=new Map();
    [...local,...live].forEach(x=>{ if(!x?.url) return; const key=x.url.replace(/\/$/,''); if(!map.has(key)) map.set(key,x); });
    return [...map.values()];
  }
  function render(items){
    const grid=$('art-grid'), empty=$('empty-state'), pag=$('pagination');
    if(!grid) return;
    const pages=Math.max(1,Math.ceil(items.length/state.size)); state.page=Math.min(Math.max(state.page,1),pages);
    const visible=items.slice((state.page-1)*state.size,state.page*state.size);
    grid.innerHTML='';
    visible.forEach(item=>{
      const card=document.createElement('article'); card.className='art-card';
      const source=esc(item.source), title=esc(item.title), artist=esc(item.artist), note=esc(item.note);
      const media=item.image
        ? `<button class="art-image-wrap block w-full text-left" type="button"><img class="art-image" src="${esc(item.image)}" alt="${title}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${source}</span></button>`
        : `<a class="no-image" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><strong>Open artwork</strong><small>${source} page</small></div><span class="source-badge">${source}</span></a>`;
      card.innerHTML=`${media}<div class="p-4"><h3 class="font-bold text-white text-sm truncate" title="${title}">${title}</h3><div class="text-xs text-[#b5bac1] mb-2 mt-1">by ${artist}</div><p class="text-xs text-[#949ba4] leading-5 mb-3">${note}</p><div class="flex flex-wrap gap-1.5 mb-3"><span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">live</span><span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${source}</span></div><a class="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ea1ff] hover:text-white" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">View on ${source} ↗</a></div>`;
      if(item.image){
        const img=card.querySelector('img');
        img.addEventListener('error',()=>{ if(!img.dataset.proxy){img.dataset.proxy='1';img.src='https://wsrv.nl/?url='+encodeURIComponent(item.image);} });
        card.querySelector('button').onclick=()=>{
          const lb=$('lightbox'); $('lightbox-img').src=item.image; $('lightbox-img').alt=item.title; $('lightbox-caption').textContent=`${item.title} — ${item.artist}`; lb.classList.remove('hidden'); lb.classList.add('flex');
        };
      }
      grid.appendChild(card);
    });
    if(empty) empty.classList.toggle('hidden',items.length!==0);
    if(pag){
      pag.innerHTML=''; pag.classList.toggle('hidden',pages<=1);
      if(pages>1) for(let p=1;p<=pages;p++){const b=document.createElement('button');b.type='button';b.textContent=p;b.className=`h-9 min-w-9 px-3 rounded-full ring-1 ring-[#3b3d44] ${p===state.page?'bg-[#5865f2] text-white':'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c]'}`;b.onclick=()=>{state.page=p;render(state.results);};pag.appendChild(b);}
    }
  }
  async function liveSearch(query){
    const q=query.trim(); if(!q) return;
    state.query=q; state.page=1;
    const status=$('search-status');
    if(status) status.innerHTML=`Searching <strong>${esc(q)}</strong> across verified artwork sources…`;
    const local=(window.CLYDE_DATA?.verified||[]).filter(x=>relevant(x.title,x.note||'',q));
    const searches=SOURCES.map(s=>`https://www.bing.com/search?format=rss&q=${encodeURIComponent(`site:${s.site} ${q} Clyde Discord`)}`);
    try {
      const xmls=await Promise.all(searches.map(fetchText));
      const candidates=xmls.flatMap((xml,i)=>parseSearch(xml,`${q} ${SOURCES[i].name}`));
      const unique=[...new Map(candidates.map(x=>[x.url,x])).values()].slice(0,20);
      const enriched=[];
      for(let i=0;i<unique.length;i+=4){ const batch=await Promise.all(unique.slice(i,i+4).map(enrich)); enriched.push(...batch.filter(Boolean)); }
      state.results=mergeResults(local,enriched).filter(x=>relevant(x.title,x.note||'',q));
      if(status) status.innerHTML=`Found <strong>${state.results.length}</strong> Clyde-related results across verified sources.`;
      render(state.results);
    } catch(e){
      state.results=local;
      if(status) status.innerHTML=`Live search was unavailable, so the verified local Clyde index is shown instead.`;
      render(state.results);
    }
  }
  window.addEventListener('DOMContentLoaded',()=>{
    const form=$('search-form'), input=$('search-input');
    if(!form || !input) return;
    form.addEventListener('submit',e=>{
      if(!input.value.trim()) return;
      e.preventDefault(); e.stopImmediatePropagation(); liveSearch(input.value);
    },true);
  });
})();
