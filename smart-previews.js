(() => {
  /* V4.3 resilient preview loader
     Goal: keep source-page links intact while trying several safe preview paths.
     We never bypass login/maturity restrictions; if no public preview can be obtained,
     the card remains link-only.
  */
  const META_API = 'https://api.microlink.io/';
  const IMAGE_PROXY = [
    url => `https://wsrv.nl/?url=${encodeURIComponent(url)}`,
    url => `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
  ];
  const ALLOWED_HOSTS = new Set([
    'newgrounds.com','www.newgrounds.com',
    'deviantart.com','www.deviantart.com',
    'wallpapers.com','www.wallpapers.com',
    'sfw.furaffinity.net'
  ]);
  const pending = new Set();

  const escapeAttr = s => String(s || '').replace(/[&<>\"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'
  }[c]));

  function previewCandidates(original) {
    if (!original) return [];
    const list = [original, ...IMAGE_PROXY.map(make => make(original))];
    return [...new Set(list)];
  }

  function installFallback(img) {
    if (!img || img.dataset.fallbackInstalled) return;
    img.dataset.fallbackInstalled = '1';
    img.dataset.previewIndex = '0';
    img.dataset.previewCandidates = JSON.stringify(previewCandidates(img.dataset.originalSrc || img.src));

    img.addEventListener('error', () => {
      let candidates = [];
      try { candidates = JSON.parse(img.dataset.previewCandidates || '[]'); } catch (_) {}
      let index = Number(img.dataset.previewIndex || 0) + 1;
      while (index < candidates.length && candidates[index] === img.currentSrc) index++;

      if (index < candidates.length) {
        img.dataset.previewIndex = String(index);
        img.src = candidates[index];
        return;
      }

      // Last resort: keep the source page usable instead of leaving a broken image.
      const card = img.closest('.art-card');
      const wrap = card?.querySelector('.art-image-wrap');
      if (!card || !wrap || wrap.dataset.previewFailed) return;
      wrap.dataset.previewFailed = '1';
      const pageUrl = card.dataset.sourcePage || '';
      const source = card.dataset.sourceName || 'Source';
      if (pageUrl) {
        wrap.outerHTML = `<a class="no-image" href="${escapeAttr(pageUrl)}" target="_blank" rel="noopener noreferrer"><div class="no-image-inner"><span class="icon w-8 h-8 text-[#8ea1ff]" data-icon="external"></span><strong>Open artwork</strong><small>Preview unavailable</small></div><span class="source-badge">${escapeAttr(source)}</span></a>`;
        if (window.paintIcons) window.paintIcons();
      }
    });
  }

  async function getPreview(pageUrl) {
    const host = new URL(pageUrl).hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) return '';
    const endpoint = `${META_API}?url=${encodeURIComponent(pageUrl)}&meta=true`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`metadata ${response.status}`);
    const json = await response.json();
    return json?.data?.image || json?.data?.logo || '';
  }

  function makePreview(card, pageUrl, imageUrl, source) {
    if (!imageUrl || !card?.isConnected) return;
    const title = card.querySelector('h3')?.textContent || 'Clyde artwork';
    const artist = card.querySelector('.text-xs.text-\\[\\#b5bac1\\]')?.textContent || '';
    const old = card.querySelector('.no-image, .art-image-wrap');
    const html = `<button class="art-image-wrap block w-full text-left" type="button" aria-label="Preview ${escapeAttr(title)}"><img class="art-image" data-original-src="${escapeAttr(imageUrl)}" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(title)}${artist ? ' by ' + escapeAttr(artist) : ''}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">${escapeAttr(source)}</span><span class="art-overlay"><span class="icon h-5 w-5 text-white" data-icon="eye"></span></span></button>`;
    if (old) old.outerHTML = html;

    card.dataset.sourcePage = pageUrl;
    card.dataset.sourceName = source;
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
      // Keep the link-only fallback when extraction is unavailable.
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
