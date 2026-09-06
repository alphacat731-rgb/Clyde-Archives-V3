(() => {
  const META_API = 'https://api.microlink.io/';
  const ALLOWED_HOSTS = new Set([
    'newgrounds.com','www.newgrounds.com',
    'deviantart.com','www.deviantart.com',
    'wallpapers.com','www.wallpapers.com'
  ]);
  const pending = new Set();

  const escapeAttr = s => String(s || '').replace(/[&<>\"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'
  }[c]));

  function proxy(url) {
    return 'https://wsrv.nl/?url=' + encodeURIComponent(url);
  }

  async function getPreview(pageUrl) {
    const host = new URL(pageUrl).hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) return '';
    const endpoint = `${META_API}?url=${encodeURIComponent(pageUrl)}&meta=true`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`metadata ${response.status}`);
    const json = await response.json();
    return json?.data?.image || '';
  }

  function makePreview(card, pageUrl, imageUrl, source) {
    if (!imageUrl || !card.isConnected) return;
    const title = card.querySelector('h3')?.textContent || 'Clyde artwork';
    const artist = card.querySelector('.text-xs.text-\\[\\#b5bac1\\]')?.textContent || '';
    const wrap = card.querySelector('.no-image');
    const html = `<button class="art-image-wrap block w-full text-left" type="button" aria-label="Preview ${escapeAttr(title)}"><img class="art-image" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(title)}${artist ? ' by ' + escapeAttr(artist) : ''}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${escapeAttr(source)}</span><span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span></button>`;
    if (wrap) wrap.outerHTML = html;
    else {
      const old = card.querySelector('.art-image-wrap');
      if (old) old.outerHTML = html;
    }
    const button = card.querySelector('.art-image-wrap');
    const img = button?.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        if (img.dataset.proxied) return;
        img.dataset.proxied = '1';
        img.src = proxy(imageUrl);
      }, { once: true });
    }
    if (button) button.addEventListener('click', () => window.open(pageUrl, '_blank', 'noopener,noreferrer'));
  }

  async function upgradeLink(link) {
    const pageUrl = link.href;
    if (pending.has(pageUrl)) return;
    pending.add(pageUrl);
    try {
      const image = await getPreview(pageUrl);
      if (image) makePreview(link.closest('.art-card'), pageUrl, image, new URL(pageUrl).hostname.replace(/^www\./,''));
    } catch (_) {
      // Keep the existing Open artwork fallback when extraction is unavailable.
    } finally {
      pending.delete(pageUrl);
    }
  }

  function installImageFallbacks() {
    document.querySelectorAll('#art-grid img.art-image').forEach(img => {
      if (img.dataset.fallbackInstalled) return;
      img.dataset.fallbackInstalled = '1';
      img.addEventListener('error', () => {
        if (img.dataset.proxied) return;
        img.dataset.proxied = '1';
        const original = img.getAttribute('src');
        if (original && !original.startsWith('https://wsrv.nl/')) img.src = proxy(original);
      }, { once: true });
    });
  }

  function scan() {
    document.querySelectorAll('#art-grid a.no-image').forEach(upgradeLink);
    installImageFallbacks();
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(scan, 300);
    const grid = document.getElementById('art-grid');
    if (grid) new MutationObserver(() => setTimeout(scan, 100)).observe(grid, { childList: true, subtree: true });
  });
})();
