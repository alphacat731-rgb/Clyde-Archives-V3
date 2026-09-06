# Clyde Archives V4

A static GitHub Pages gallery for Discord Clyde artwork with live multi-source searching.

## Sources

The live search is restricted to verified artwork hosts:

- Newgrounds
- DeviantArt
- Fur Affinity (SFW)
- Wallpapers.com

Searches are sent through a CORS-friendly fetch layer and the resulting artwork pages are inspected for publicly exposed preview metadata. Results that do not expose a reliable image remain link-only.

## Important

The archive does not use Wikimedia Commons or Openverse for artwork discovery.

Fur Affinity results are restricted to its SFW subdomain. The archive does not attempt to bypass age gates, login requirements, or content restrictions.

## Files

- `index.html`
- `app.js`
- `data.js`
- `style.css`
- `smart-previews.js`
- `live-search.js`

## GitHub Pages

This V4 release is on the `V4` branch. In **Settings → Pages**, select:

**Deploy from a branch → `V4` → `/ (root)`**

The project can then be opened at the repository's normal GitHub Pages URL.

## Search behavior

Try searches such as `Clyde`, `Discord Clyde`, `furry Clyde`, or `Clyde fanart`. The search engine queries each verified source separately, removes duplicate pages, checks relevance, and attempts to obtain an image preview before displaying a result.
