(() => {
  const STORAGE_KEY = 'clyde-archives-custom-pages-v1';
  const MICROLINK_ENDPOINT = 'https://api.microlink.io/';
  const SAFE_HOSTS = new Set([
    'newgrounds.com', 'www.newgrounds.com',
    'deviantart.com', 'www.deviantart.com',
    'artstation.com', 'www.artstation.com',
    'behance.net', 'www.behance.net'
  ]);

  const normalizeHost = host => host.toLowerCase().replace(/^www\./, '');
  const readItems = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  };
  const writeItems = items => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  function hostAllowed(url) {
    try { return SAFE_HOSTS.has(normalizeHost(new URL(url).hostname)); }
    catch { return false; }
  }

  function buildCard(item) {
    const el = document.createElement('article');
    el.className = 'art-card';
    const media = item.image
      ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="art-image-wrap block w-full"><img class="art-image" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">CUSTOM · ${esc(item.source)}</span></a>`
      : `<a class="no-image" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><strong>Open artwork</strong><small>Preview unavailable</small></div><span class="source-badge">CUSTOM · ${esc(item.source)}</span></a>`;
    el.innerHTML = `${media}<div class="p-4"><div class="flex items-start justify-between gap-2"><div class="min-w-0"><h3 class="font-bold text-white text-sm truncate" title="${esc(item.title)}">${esc(item.title)}</h3><div class="text-xs text-[#b5bac1] mb-2 mt-1">${esc(item.source)}</div></div><button type="button" data-remove="${esc(item.id)}" class="text-xs text-[#949ba4] hover:text-white" title="Remove">Remove</button></div><p class="text-xs text-[#949ba4] leading-5 mb-3">Added from your custom page.</p><a class="inline-flex items-center gap-1.5 text-xs font-bold text-[#8ea1ff] hover:text-white" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Open source <span>↗</span></a></div>`;
    el.querySelector('[data-remove]').onclick = () => {
      writeItems(readItems().filter(x => x.id !== item.id));
      render();
    };
    return el;
  }

  function render() {
    const grid = document.getElementById('custom-art-grid');
    const count = document.getElementById('custom-count');
    if (!grid) return;
    const items = readItems();
    grid.innerHTML = '';
    items.forEach(item => grid.appendChild(buildCard(item)));
    count.textContent = `${items.length} custom ${items.length === 1 ? 'page' : 'pages'}`;
    document.getElementById('custom-empty').classList.toggle('hidden', items.length !== 0);
  }

  async function extractPage(url) {
    const api = `${MICROLINK_ENDPOINT}?url=${encodeURIComponent(url)}&data.title.selector=title&meta=true`;
    const response = await fetch(api, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Preview service returned ${response.status}`);
    const payload = await response.json();
    if (!payload.data) throw new Error('No page metadata was returned.');
    return {
      title: payload.data.title || new URL(url).hostname,
      image: payload.data.image || payload.data.logo?.url || '',
      source: normalizeHost(new URL(url).hostname)
    };
  }

  async function addPage(url) {
    const status = document.getElementById('custom-status');
    const button = document.getElementById('custom-add');
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) throw new Error('Use an http:// or https:// URL.');
      if (!hostAllowed(url)) throw new Error('This source is not enabled for Custom Pages yet. Use one of the supported art sites shown above.');
      button.disabled = true;
      button.textContent = 'Loading…';
      status.textContent = 'Reading the page and looking for its title and preview image…';
      const meta = await extractPage(url);
      const items = readItems();
      if (items.some(x => x.url === url)) throw new Error('That page is already in your custom gallery.');
      items.unshift({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, url, ...meta });
      writeItems(items.slice(0, 50));
      document.getElementById('custom-url').value = '';
      status.textContent = meta.image ? 'Added — preview image found.' : 'Added — the page works, but no safe preview image was exposed.';
      render();
    } catch (error) {
      status.textContent = error?.message || 'Could not add that page.';
    } finally {
      button.disabled = false;
      button.textContent = 'Add page';
    }
  }

  function init() {
    const form = document.getElementById('custom-form');
    if (!form) return;
    render();
    form.addEventListener('submit', e => {
      e.preventDefault();
      const value = document.getElementById('custom-url').value.trim();
      if (value) addPage(value);
    });
  }

  window.addEventListener('DOMContentLoaded', init);
})();
