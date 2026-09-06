(() => {
  const META_API = 'https://api.microlink.io/';
  const IMAGE_PROXY = 'https://wsrv.nl/?url=';
  const ALLOWED_HOSTS = new Set([
    'newgrounds.com','www.newgrounds.com',
    'deviantart.com','www.deviantart.com',
    'wallpapers.com','www.wallpapers.com',
    'sfw.furaffinity.net'
  ]);
  const pending = new Set();

  const escapeAttr = s => String(s || '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const proxy = url => IMAGE_PROXY + encodeURIComponent(url);

  async function getPreview(pageUrl) {
    const host = new URL(pageUrl).hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) return '';
    const endpoint = `${META_API}?url=${encodeURIComponent(pageUrl)}&meta=true`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`metadata ${response.status}`);
    const json = await response.json();
    return json?.data?.image || json?.data?.logo || '';
  }

  function installFallback(img) {
    if (!img || img.dataset.fallbackInstalled) return;
    img.dataset.fallbackInstalled = '1';
    img.addEventListener('error', () => {
      if (img.dataset.proxied) return;
      img.dataset.proxied = '1';
      const original = img.getAttribute('data-original-src') || img.getAttribute('src');
      if (original && !original.startsWith(IMAGE_PROXY)) img.src = proxy(original);
    }, { once: true });
  }

  function makePreview(card, pageUrl, imageUrl, source) {
    if (!imageUrl || !card?.isConnected) return;
    const title = card.querySelector('h3')?.textContent || 'Clyde artwork';
    const artist = card.querySelector('.text-xs.text-\\[\\#b5bac1\\]')?.textContent || '';
    const old = card.querySelector('.no-image, .art-image-wrap');
    const html = `<button class="art-image-wrap block w-full text-left" type="button" aria-label="Preview ${escapeAttr(title)}"><img class="art-image" data-original-src="${escapeAttr(imageUrl)}" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(title)}${artist ? ' by ' + escapeAttr(artist) : ''}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${escapeAttr(source)}</span><span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span></button>`;
    if (old) old.outerHTML = html;
    const button = card.querySelector('.art-image-wrap');
    const img = button?.querySelector('img');
    installFallback(img);
    if (button) button.addEventListener('click', () => window.open(pageUrl, '_blank', 'noopener,noreferrer'));
    if (window.paintIcons) window.paintIcons();
  }

  async function upgradeLink(link) {
    const pageUrl = link.href;
    if (pending.has(pageUrl)) return;
    pending.add(pageUrl);
    try {
      const image = await getPreview(pageUrl);
      if (image) makePreview(link.closest('.art-card'), pageUrl, image, new URL(pageUrl).hostname.replace(/^www\./,''));
    } catch (_) {
      // Keep the link-only fallback when the source cannot expose a preview.
    } finally {
      pending.delete(pageUrl);
    }
  }

  function scan() {
    document.querySelectorAll('#art-grid a.no-image').forEach(upgradeLink);
    document.querySelectorAll('#art-grid img.art-image').forEach(installFallback);
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(scan, 350);
    const grid = document.getElementById('art-grid');
    if (grid) new MutationObserver(() => setTimeout(scan, 120)).observe(grid, { childList: true, subtree: true });
  });
})();
