(() => {
  /* V4.1 live-search rebuild
     Important: this is a static GitHub Pages app, so source pages are fetched through public CORS proxies.
     We never try to bypass login/maturity restrictions; if a source does not expose a public preview, the card stays link-only.
  */
  const SOURCES = [
    { name:'Newgrounds', host:'www.newgrounds.com', searchHost:'newgrounds.com', path:'art/view' },
    { name:'DeviantArt', host:'www.deviantart.com', searchHost:'deviantart.com', path:'art' },
    { name:'Fur Affinity (SFW)', host:'sfw.furaffinity.net', searchHost:'sfw.furaffinity.net', path:'view' },
    { name:'Wallpapers.com', host:'wallpapers.com', searchHost:'wallpapers.com', path:'wallpapers' }
  ];

  const PROXIES = [
    u => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
  ];

  const state = { results:[], query:'', page:1, size:8, searching:false };
  const $ = id => document.getElementById(id);
  const norm = s => String(s ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const esc = s => String(s ?? '').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function sourceFor(url){
    try {
      const host = new URL(url).hostname.toLowerCase();
      return SOURCES.find(s => s.host === host)?.name || 'Source';
    } catch { return 'Source'; }
  }

  function allowedPage(url){
    try {
      const host = new URL(url).hostname.toLowerCase();
      return SOURCES.some(s => host === s.host);
    } catch { return false; }
  }

  function searchText(item){
    return norm([item.title,item.artist,item.note,item.source,...(item.tags||[])].join(' '));
  }

  function relevant(item, query){
    const text = searchText(item);
    const q = norm(query).trim();
    if (!q) return true;

    // The old filter required BOTH "clyde" AND "discord" to occur in the result text.
    // That silently discarded good Clyde results when the page only mentioned Clyde in its title/tags.
    if (!text.includes('clyde')) return false;

    const words = q.split(/\s+/).filter(Boolean);
    const furryWords = ['furry','furries','fur','anthro','anthropomorphic','fursona','kemono','fox','wolf','cat','dog','goat','dragon'];
    const wantsFurry = words.some(w => furryWords.includes(w));
    if (wantsFurry && !furryWords.some(w => text.includes(w))) return false;

    // For explicit Discord searches, require Discord-related evidence.
    if (words.includes('discord') || words.includes('mascot')) {
      if (!/(discord|mascot|clyde)/.test(text)) return false;
    }

    // Match the remaining meaningful query terms, but allow "clyde" itself to be implied by the rule above.
    for (const word of words) {
      if (word === 'clyde' || word === 'discord' || furryWords.includes(word) || word === 'art' || word === 'artwork' || word === 'fanart') continue;
      if (!text.includes(word)) return false;
    }
    return true;
  }

  async function fetchThroughProxy(url){
    let lastError;
    for (const makeProxy of PROXIES) {
      try {
        const response = await fetch(makeProxy(url), { headers:{Accept:'application/json,text/plain,*/*'} });
        if (!response.ok) throw new Error(`proxy ${response.status}`);
        const raw = await response.text();
        if (!raw) throw new Error('empty response');
        try {
          const json = JSON.parse(raw);
          if (typeof json.contents === 'string') return json.contents;
        } catch {}
        return raw;
      } catch (e) { lastError = e; }
    }
    throw lastError || new Error('all proxies failed');
  }

  function searchUrls(source, query){
    const encoded = encodeURIComponent(query);
    const site = encodeURIComponent(`site:${source.searchHost}/${source.path}`);
    return [
      `https://www.bing.com/search?format=rss&count=20&q=${site}%20%22Clyde%22%20%22Discord%22%20${encoded}`,
      `https://www.bing.com/search?format=rss&count=20&q=${site}%20%22Clyde%22%20${encoded}`,
      `https://www.google.com/search?udm=14&q=${site}%20%22Clyde%22%20%22Discord%22%20${encoded}`
    ];
  }

  function parseSearch(raw, query, source){
    const doc = new DOMParser().parseFromString(raw,'application/xml');
    const items = [...doc.querySelectorAll('item')];
    return items.map(item => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Clyde artwork';
      const url = item.querySelector('link')?.textContent?.trim() || '';
      const note = item.querySelector('description')?.textContent?.replace(/<[^>]+>/g,' ').trim() || '';
      return { title, url, note, source:source.name, query };
    }).filter(x => x.url && allowedPage(x.url) && relevant(x,query));
  }

  function absolutize(url, pageUrl){
    if (!url) return '';
    try { return new URL(url,pageUrl).href; } catch { return ''; }
  }

  function extractMeta(html,pageUrl){
    const doc = new DOMParser().parseFromString(html,'text/html');
    const meta = (selectors) => {
      for (const selector of selectors) {
        const value = doc.querySelector(selector)?.getAttribute('content')?.trim();
        if (value) return value;
      }
      return '';
    };
    const title = meta(['meta[property="og:title"]','meta[name="twitter:title"]']) || doc.querySelector('title')?.textContent?.trim() || 'Clyde artwork';
    const desc = meta(['meta[property="og:description"]','meta[name="description"]','meta[name="twitter:description"]']);
    const image = absolutize(meta(['meta[property="og:image"]','meta[name="twitter:image"]','meta[property="twitter:image"]','meta[itemprop="image"]']),pageUrl);
    const artist = (title.match(/\bby\s+([^|–—-]+)/i)?.[1] || '').trim();
    return { title, desc, image, artist };
  }

  async function enrich(candidate){
    try {
      const html = await fetchThroughProxy(candidate.url);
      const meta = extractMeta(html,candidate.url);
      const item = {
        id:`live-${btoa(unescape(encodeURIComponent(candidate.url))).replace(/[^a-z0-9]/gi,'').slice(-48)}`,
        source:sourceFor(candidate.url),
        title:meta.title || candidate.title,
        artist:meta.artist || 'Community artwork',
        tags:['clyde','discord','live'],
        url:candidate.url,
        image:meta.image || '',
        note:meta.desc || candidate.note || 'Live result from a verified artwork source.'
      };
      return relevant(item,state.query) ? item : null;
    } catch { return null; }
  }

  function mergeResults(local,live){
    const map = new Map();
    [...local,...live].forEach(item => {
      if (!item?.url) return;
      const key = item.url.replace(/\/$/,'').toLowerCase();
      if (!map.has(key)) map.set(key,item);
    });
    return [...map.values()];
  }

  function render(items){
    const grid=$('art-grid'), empty=$('empty-state'), pag=$('pagination');
    if(!grid) return;
    const pages=Math.max(1,Math.ceil(items.length/state.size));
    state.page=Math.min(Math.max(state.page,1),pages);
    const visible=items.slice((state.page-1)*state.size,state.page*state.size);
    grid.innerHTML='';

    visible.forEach(item=>{
      const source=esc(item.source || 'Source'), title=esc(item.title || 'Clyde artwork'), artist=esc(item.artist || 'Community artwork'), note=esc(item.note || '');
      const card=document.createElement('article');
      card.className='art-card';
      const media=item.image
        ? `<button class="art-image-wrap block w-full text-left" type="button" aria-label="Preview ${title}"><img class="art-image" src="${esc(item.image)}" alt="${title}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${source}</span><span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span></button>`
        : `<a class="no-image" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><span class="icon w-8 h-8 text-[#8ea1ff]" data-icon="external"></span><strong>Open artwork</strong><small>${source} page</small></div><span class="source-badge">${source}</span></a>`;
      card.innerHTML=`${media}<div class="p-4"><h3 class="font-bold text-white text-sm truncate" title="${title}">${title}</h3><div class="text-xs text-[#b5bac1] mb-2 mt-1">by ${artist}</div><p class="text-xs text-[#949ba4] leading-5 mb-3">${note}</p><div class="flex flex-wrap gap-1.5 mb-3"><span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${source}</span>${(item.tags||[]).filter(t=>t!=='live').slice(0,4).map(t=>`<span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${esc(t)}</span>`).join('')}</div><a class="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ea1ff] hover:text-white" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">View on ${source} <span class="icon w-3.5 h-3.5" data-icon="external"></span></a></div>`;

      if(item.image){
        const img=card.querySelector('img');
        img.addEventListener('error',()=>{
          // Do not loop forever. A source that blocks embedding simply becomes link-only.
          card.querySelector('.art-image-wrap').outerHTML=`<a class="no-image" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><span class="icon w-8 h-8 text-[#8ea1ff]" data-icon="external"></span><strong>Open artwork</strong><small>Preview unavailable</small></div><span class="source-badge">${source}</span></a>`;
          if(window.paintIcons) window.paintIcons();
        },{once:true});
        card.querySelector('button').onclick=()=>openLightbox(item);
      }
      grid.appendChild(card);
    });

    if(empty) empty.classList.toggle('hidden',items.length!==0);
    if(pag){
      pag.innerHTML=''; pag.classList.toggle('hidden',pages<=1);
      if(pages>1){
        const add=(label,disabled,fn)=>{const b=document.createElement('button');b.type='button';b.disabled=disabled;b.textContent=label;b.className='h-9 min-w-9 px-3 rounded-full bg-[#2b2d31] text-[#dbdee1] ring-1 ring-[#3b3d44] hover:bg-[#35373c] disabled:opacity-35';b.onclick=fn;pag.appendChild(b);};
        add('‹',state.page===1,()=>{state.page--;render(state.results);});
        for(let p=1;p<=pages;p++){const b=document.createElement('button');b.type='button';b.textContent=p;b.className=`h-9 min-w-9 px-3 rounded-full ring-1 ring-[#3b3d44] ${p===state.page?'bg-[#5865f2] text-white':'bg-[#2b2d31] text-[#dbdee1] hover:bg-[#35373c]'}`;b.onclick=()=>{state.page=p;render(state.results);};pag.appendChild(b);}
        add('›',state.page===pages,()=>{state.page++;render(state.results);});
      }
    }
  }

  async function liveSearch(query){
    const q=query.trim(); if(!q || state.searching) return;
    state.query=q; state.page=1; state.searching=true;
    const status=$('search-status');
    if(status) status.innerHTML=`Searching <strong>${esc(q)}</strong> across verified Clyde sources…`;

    const local=(window.CLYDE_DATA?.verified||[]).filter(item=>relevant(item,q));
    const candidates=[];
    const jobs=[];
    for(const source of SOURCES){
      for(const url of searchUrls(source,q)) jobs.push({source,url});
    }

    // Run in small groups so one flaky proxy/search endpoint cannot kill the entire search.
    for(let i=0;i<jobs.length;i+=3){
      const batch=await Promise.allSettled(jobs.slice(i,i+3).map(async job=>({source:job.source,raw:await fetchThroughProxy(job.url)})));
      for(const result of batch){
        if(result.status==='fulfilled') candidates.push(...parseSearch(result.value.raw,q,result.value.source));
      }
    }

    const unique=[...new Map(candidates.map(x=>[x.url,x])).values()].slice(0,32);
    const enriched=[];
    for(let i=0;i<unique.length;i+=4){
      const batch=await Promise.all(unique.slice(i,i+4).map(enrich));
      enriched.push(...batch.filter(Boolean));
    }

    state.results=mergeResults(local,enriched).filter(item=>relevant(item,q));
    state.searching=false;
    if(status){
      status.innerHTML=state.results.length
        ? `Found <strong>${state.results.length}</strong> Clyde-related result${state.results.length===1?'':'s'} across verified sources.`
        : `No verified Clyde results found for <strong>${esc(q)}</strong>. Try <strong>furry Clyde</strong>, <strong>Discord Clyde</strong>, or <strong>Clyde fanart</strong>.`;
    }
    render(state.results);
  }

  window.addEventListener('DOMContentLoaded',()=>{
    const form=$('search-form'), input=$('search-input'), clear=$('clear-search');
    if(!form || !input) return;
    form.addEventListener('submit',e=>{
      if(!input.value.trim()) return;
      e.preventDefault(); e.stopImmediatePropagation(); liveSearch(input.value);
    },true);
    clear?.addEventListener('click',()=>{input.value='';state.query='';state.page=1;state.results=[...(window.CLYDE_DATA?.verified||[])];render(state.results);const s=$('search-status');if(s)s.textContent='';});
  });
})();
