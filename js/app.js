(function(){
  const elTemp = document.getElementById('weather-temp');
  const elMeta = document.getElementById('weather-meta');
  const elIcon = document.getElementById('weather-icon');
  const elForecast = document.getElementById('weather-forecast');

  function codeToSVG(code){
    const stroke = 'currentColor';
    // clearer, slightly larger icons (sun, sun-cloud, cloud, rain, snow, storm)
    if (code === 0) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="9" fill="var(--accent)" />
        <g stroke="${stroke}" stroke-width="1.6" stroke-linecap="round">
          <path d="M24 4v6"/>
          <path d="M24 38v6"/>
          <path d="M4 24h6"/>
          <path d="M38 24h6"/>
          <path d="M8 8l4 4"/>
          <path d="M36 36l4 4"/>
          <path d="M8 40l4-4"/>
          <path d="M36 12l4-4"/>
        </g>
      </svg>`;
    if ([1,2].includes(code)) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="6" fill="var(--accent)" />
        <path d="M30 20a6 6 0 0 0-6-6H22a8 8 0 0 0-8 8 6 6 0 0 0 6 6h12a6 6 0 0 0 0-12z" fill="var(--bg-dark)" opacity="0.08" stroke="${stroke}" stroke-width="1.4"/>
      </svg>`;
    if (code === 3) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 30a8 8 0 0 1 8-8h12a6 6 0 0 1 0 12H14" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>`;
    if ([45,48].includes(code)) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 28h32" stroke="${stroke}" stroke-width="1.4" opacity="0.6"/>
        <path d="M12 20h24" stroke="${stroke}" stroke-width="1.2" opacity="0.35"/>
      </svg>`;
    if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22a8 8 0 0 1 8-8h10a6 6 0 0 1 0 12H16" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <g stroke="${stroke}" stroke-width="1.8" stroke-linecap="round">
          <path d="M18 34v4"/>
          <path d="M24 34v6"/>
          <path d="M30 34v4"/>
        </g>
      </svg>`;
    if ([71,73,75,77,85,86].includes(code)) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22a8 8 0 0 1 8-8h10a6 6 0 0 1 0 12H16" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <g stroke="${stroke}" stroke-width="1.4" stroke-linecap="round">
          <path d="M24 30l0 4"/>
          <path d="M20 30l8 0"/>
        </g>
      </svg>`;
    if ([95,96,99].includes(code)) return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22a8 8 0 0 1 8-8h10a6 6 0 0 1 0 12H16" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M20 30l6-10" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/>
      </svg>`;
    return `
      <svg class="icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="8" fill="var(--accent)" />
      </svg>`;
  }

  function showError(msg){
    if (elTemp) elTemp.textContent = '—';
    if (elMeta) elMeta.textContent = msg;
    if (elIcon) elIcon.innerHTML = '❓';
    if (elForecast) elForecast.innerHTML = '';
  }

  if (!navigator.geolocation){
    showError('Geolocation not supported');
    return;
  }

  if (elMeta) elMeta.textContent = 'Locating…';

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    try {
      // No reverse geocoding — avoid CORS issues. Show status in meta.
      if (elMeta) elMeta.textContent = 'Fetching weather…';

      // Get current + daily forecast
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const w = data.current_weather;
      if (!w) throw new Error('No current weather');
      if (elTemp) elTemp.textContent = Math.round(w.temperature) + '°F';
      if (elIcon) elIcon.innerHTML = codeToSVG(w.weathercode);

      // Render 5-day forecast
      if (data.daily && data.daily.time){
        elForecast.innerHTML = '';
        const times = data.daily.time;
        const codes = data.daily.weathercode || [];
        const tMax = data.daily.temperature_2m_max || [];
        const tMin = data.daily.temperature_2m_min || [];
        for (let i=0;i<Math.min(5,times.length);i++){
          const date = new Date(times[i]);
          const day = date.toLocaleDateString(undefined,{weekday:'short'});
          const icon = codeToSVG(codes[i]);
          const node = document.createElement('div');
          node.className = 'forecast-day';
          node.innerHTML = `<div class="day">${day}</div><div class="icon">${icon}</div><div class="t">${Math.round(tMax[i])}°/${Math.round(tMin[i])}°</div>`;
          elForecast.appendChild(node);
        }
      }

    } catch (e){
      console.error(e);
      showError('Unable to load weather');
    }
  }, (err) => {
    console.warn(err);
    showError('Enable location to see your weather');
  }, { timeout: 10000 });
})();
