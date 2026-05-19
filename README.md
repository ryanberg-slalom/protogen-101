Ryan Berg — Personal Site
=========================

A small, static personal website (HTML/CSS/JS) showcasing work and a browser-powered weather widget.

Quick start
-----------

Serve the site locally and open it in your browser:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Notes
-----
- No build tools required — plain HTML/CSS/JS.
- Weather widget uses the Open‑Meteo Forecast API (no API key) and the browser's Geolocation API. Allow location in the browser to see current conditions and a 5‑day forecast.
- If location is denied, the widget shows a fallback message.

Files
-----
- `index.html` — Homepage and weather widget container.
- `css/style.css` — Shared stylesheet (global + weather styles).
- `js/app.js` — Weather widget logic (geolocation + Open‑Meteo fetch + SVG icons).
- `work/` — Featured work pages.
- `about/` — About page.

Testing tips
------------
- Use the local server above to test geolocation/fetch behavior.
- If the weather doesn't load, check the browser console for network/geolocation errors.

License
-------
Personal project.
