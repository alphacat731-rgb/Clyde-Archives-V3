(() => {
  const META_API = 'https://api.microlink.io/';
  const ALLOWED_HOSTS = new Set(['newgrounds.com', 'www.newgrounds.com', 'deviantart.com', 'www.deviantart.com']);
  const pending = new Set();
  const normalizedHost = host => host.toLowerCase();
  const escapeAttr = s => String(s || '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

  async function getPreview(pageUrl) {
    const host = normalizedHost(new URL(pageUrl).hostname);
    if (!ALLOWED_HOSTS.has(host)) return '';
    const endpoint = `${META_API}?url=${encodeURIComponent(pageUrl)}&meta=true`;
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`metadata ${response.status}`);
    const json = await response.json();
    return json?.data?.image || '';
  }

  async function upgradeLink(link) {
    const pageUrl = link.href;
    if (pending.has(pageUrl)) return;
    pending.add(pageUrl);
    try {
      const image = await getPreview(pageUrl);
      if (!image || !link.isConnected) return;
      const title = link.closest('.art-card')?.querySelector('h3')?.textContent || 'Clyde artwork';
      link.className = 'art-image-wrap block w-full text-left';
      link.innerHTML = `<img class="art-image" src="${escapeAttr(image)}" alt="${escapeAttr(title)}" loading="lazy" referrerpolicy="no-referrer"><span class="source-badge">Newgrounds</span>`;
      link.addEventListener('click', event => {
        event.preventDefault();
        window.open(pageUrl, '_blank', 'noopener,noreferrer');
      });
    } catch (_) {
      // Keep the existing "Open artwork" fallback when a source blocks preview extraction.
    } finally {
      pending.delete(pageUrl);
    }
  }

  function scan() {
    document.querySelectorAll('#art-grid a.no-image').forEach(upgradeLink);
  }

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(scan, 700);
    const grid = document.getElementById('art-grid');
    if (grid) new MutationObserver(() => setTimeout(scan, 150)).observe(grid, { childList: true, subtree: true });
  });
})();
