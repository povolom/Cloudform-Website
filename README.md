# Cloudform website

The website for Cloudform, the game-development and early software company I co-founded and led as CEO from 2021 to 2026. This is the last version of the site I built (version 41).

**Live:** https://cloudform.marcantoniopovolo.com · [About the project](https://marcantoniopovolo.com/projects/cloudform)

## What it is

A multi-page company site: a home page, a section per division (Ciryx for games, Altyx for software), Explore pages (About, News, Careers, Events), a store preview and a mobile menu. The store and cart are a demo: no products are for sale and nothing is collected at checkout.

Plain HTML, CSS and JavaScript with no build step. I iterated it across more than 40 versions.

## How it's served

The Cloudform site's own files are kept exactly as they were. Two additions sit next to them:

| Path | What it is |
|---|---|
| `project/` | `project/frame/` shows my portfolio's top bar above the Cloudform site. `project/index.html` forwards to the project page on [marcantoniopovolo.com](https://marcantoniopovolo.com/projects/cloudform) |
| `worker.js` | A small Cloudflare Worker: when someone opens a page directly, it sends the top bar with the page in a frame below; the frame then loads the original page |
| `wrangler.jsonc`, `.assetsignore` | Cloudflare settings, and files that shouldn't be served |

To publish, run `npx wrangler deploy` in this folder.

## Note

Photos on the site have had their location data removed.
