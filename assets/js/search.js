
(function(){
  const input = document.getElementById('searchInput');
  const results = document.getElementById('results');
  const count = document.getElementById('resultCount');
  const data = window.CLOUDFORM_SEARCH_INDEX || [];

  function escapeHtml(str){
    return String(str || '').replace(/[&<>"']/g, ch => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'
    }[ch]));
  }

  function card(item){
    return `
      <a class="searchResultCard" href="${item.url}">
        <div class="searchResultTop">
          <span class="metaPill">${escapeHtml(item.category)}</span>
        </div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description || 'Open this Cloudform page.')}</p>
      </a>
    `;
  }

  function run(){
    const q = (input ? input.value : '').trim().toLowerCase();

    if(!q){
      results.innerHTML = data.slice(0, 8).map(card).join('');
      count.textContent = 'Showing popular Cloudform pages.';
      return;
    }

    const terms = q.split(/\s+/).filter(Boolean);
    const ranked = data.map(item => {
      const hay = `${item.title} ${item.description} ${item.category} ${item.keywords}`.toLowerCase();
      let score = 0;
      terms.forEach(term => {
        if(item.title.toLowerCase().includes(term)) score += 5;
        if(item.category.toLowerCase().includes(term)) score += 3;
        if(hay.includes(term)) score += 1;
      });
      return { item, score };
    }).filter(x => x.score > 0).sort((a,b) => b.score - a.score).map(x => x.item);

    results.innerHTML = ranked.length ? ranked.map(card).join('') : `
      <div class="searchEmpty">
        <h2>No results found</h2>
        <p>Try searching for Altyx, Ciryx, store, careers, news, games, or events.</p>
      </div>
    `;

    count.textContent = ranked.length ? `${ranked.length} result${ranked.length === 1 ? '' : 's'} found.` : 'No results found.';
  }

  if(input){
    input.addEventListener('input', run);
    input.focus();
  }

  run();
})();
