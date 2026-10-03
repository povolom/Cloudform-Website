// Cloudform app.js

// ---- Hamburger menu ----
(function(){
  var btn = document.querySelector('.hamburgerBtn');
  var nav = document.getElementById('siteNav');
  var backdrop = document.querySelector('.mobileBackdrop');
  if(!btn || !nav) return;

  function close(){
    btn.setAttribute('aria-expanded','false');
    nav.classList.remove('open');
    document.body.classList.remove('navOpen');
    if(backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function(){
    var open = btn.getAttribute('aria-expanded') === 'true';
    if(open){
      close();
    } else {
      btn.setAttribute('aria-expanded','true');
      nav.classList.add('open');
      document.body.classList.add('navOpen');
      if(backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  if(backdrop) backdrop.addEventListener('click', close);

  // Close on nav link click (mobile)
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', close);
  });

  // Dropdown toggle on mobile nav items
  nav.querySelectorAll('.navItem').forEach(function(item){
    var link = item.querySelector('.navLink');
    if(!link || !item.querySelector('.dropdown')) return;
    link.addEventListener('click', function(e){
      if(window.innerWidth <= 780){
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });
})();

// ---- Section bar (pageHub) mobile toggle ----
(function(){
  var hubs = document.querySelectorAll('.pageHubInner');
  hubs.forEach(function(hub){
    var brand = hub.querySelector('.pageHubBrand');
    if(!brand) return;
    brand.addEventListener('click', function(e){
      if(window.innerWidth <= 780){
        e.preventDefault();
        e.stopPropagation();
        var isOpen = hub.classList.toggle('sectionOpen');
        // Blur to prevent :focus-within from interfering with closed state
        if(!isOpen){ brand.blur(); }
      }
    });
  });

  // Close section bar when clicking outside
  document.addEventListener('click', function(e){
    if(window.innerWidth > 780) return;
    hubs.forEach(function(hub){
      if(!hub.contains(e.target)){
        hub.classList.remove('sectionOpen');
      }
    });
  });
})();

// ---- Active nav link highlight ----
(function(){
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navLink').forEach(function(a){
    var href = (a.getAttribute('href')||'').replace('./', '');
    if(href === path) a.classList.add('active');
  });
  // Section bar active
  document.querySelectorAll('.pageHubScroller a').forEach(function(a){
    var href = (a.getAttribute('href')||'').replace('./', '');
    if(href === path) a.classList.add('active');
  });
})();

// ---- Footer year ----
(function(){
  var el = document.getElementById('y');
  if(el) el.textContent = new Date().getFullYear();
})();

// ---- Shards easter egg ----
(function(){
  var TOTAL = 9;
  var found = JSON.parse(localStorage.getItem('cf_shards') || '[]');
  var reward = document.getElementById('shardsReward');

  function save(){ localStorage.setItem('cf_shards', JSON.stringify(found)); }

  document.querySelectorAll('.shardBtn').forEach(function(btn){
    var id = btn.getAttribute('data-shard-id');
    if(found.includes(id)) btn.classList.add('collected');

    btn.addEventListener('click', function(){
      if(!found.includes(id)){
        found.push(id);
        save();
        btn.classList.add('collected');
        if(found.length >= TOTAL && reward){
          setTimeout(function(){ reward.classList.add('open'); reward.removeAttribute('aria-hidden'); }, 400);
        }
      }
    });

    // Mobile positioning
    var mob = btn.getAttribute('data-mobile-style');
    if(mob){
      function applyMob(){
        if(window.innerWidth <= 780){
          mob.split(';').forEach(function(rule){
            var parts = rule.trim().split(':');
            if(parts.length === 2) btn.style[parts[0].trim()] = parts[1].trim();
          });
        } else {
          var desk = btn.getAttribute('style') || '';
          // Restore original - desktop style was set inline originally
        }
      }
      applyMob();
      window.addEventListener('resize', applyMob);
    }
  });

  // Close reward
  document.querySelectorAll('[data-shards-close]').forEach(function(el){
    el.addEventListener('click', function(){
      if(reward){ reward.classList.remove('open'); reward.setAttribute('aria-hidden','true'); }
    });
  });
})();

// ---- Toast helper ----
window.showToast = function(msg, duration){
  var t = document.querySelector('.toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, duration || 2800);
};

// ---- Countdown timers ----
(function(){
  function pad(n){ return String(Math.floor(n)).padStart(2,'0'); }
  
  function runCountdown(panel){
    var target = new Date(panel.getAttribute('data-countdown'));
    if(isNaN(target)) return;
    
    function tick(){
      var now = new Date();
      var diff = target - now;
      
      var dEl = panel.querySelector('[data-cd="d"] b');
      var hEl = panel.querySelector('[data-cd="h"] b');
      var mEl = panel.querySelector('[data-cd="m"] b');
      var sEl = panel.querySelector('[data-cd="s"] b');
      
      if(diff <= 0){
        if(dEl) dEl.textContent = '00';
        if(hEl) hEl.textContent = '00';
        if(mEl) mEl.textContent = '00';
        if(sEl) sEl.textContent = '00';
        return;
      }
      
      var days    = Math.floor(diff / (1000*60*60*24));
      var hours   = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      var minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
      var seconds = Math.floor((diff % (1000*60)) / 1000);
      
      if(dEl) dEl.textContent = pad(days);
      if(hEl) hEl.textContent = pad(hours);
      if(mEl) mEl.textContent = pad(minutes);
      if(sEl) sEl.textContent = pad(seconds);
    }
    
    tick();
    setInterval(tick, 1000);
  }
  
  document.querySelectorAll('[data-countdown]').forEach(runCountdown);
})();


// v37B final section bar dropdown



function initSectionBars(){
  function isMobile(){
    return window.matchMedia('(max-width: 780px)').matches;
  }

  function closeAllSectionBars(){
    document.querySelectorAll('.pageHubInner.sectionOpen').forEach(bar => {
      bar.classList.remove('sectionOpen');
      const brand = bar.querySelector('.pageHubBrand');
      if(brand) brand.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('sectionBarOpen');
  }

  document.querySelectorAll('.pageHubBrand').forEach(brand => {
    brand.setAttribute('aria-expanded', 'false');
    brand.setAttribute('role', 'button');
  });

  document.addEventListener('click', (e) => {
    const brand = e.target.closest('.pageHubBrand');
    if(brand){
      e.preventDefault();
      e.stopPropagation();

      if(!isMobile()){
        return; // Desktop title does nothing except stay visually static.
      }

      const bar = brand.closest('.pageHubInner');
      if(!bar) return;

      const willOpen = !bar.classList.contains('sectionOpen');
      closeAllSectionBars();

      if(willOpen){
        bar.classList.add('sectionOpen');
        brand.setAttribute('aria-expanded', 'true');
        document.body.classList.add('sectionBarOpen');
      }
      return;
    }

    const pageHubLink = e.target.closest('.pageHubScroller a');
    if(pageHubLink && isMobile()){
      closeAllSectionBars();
      return;
    }

    if(isMobile() && !e.target.closest('.pageHubInner')){
      closeAllSectionBars();
    }
  }, true);

  document.querySelectorAll('.pageHubBackdrop').forEach(backdrop => {
    backdrop.addEventListener('click', closeAllSectionBars);
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeAllSectionBars();
  });

  window.addEventListener('resize', () => {
    if(!isMobile()) closeAllSectionBars();
  });
}

document.addEventListener('DOMContentLoaded', initSectionBars);
