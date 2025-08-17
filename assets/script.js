// Smooth scroll helper
function scrollToId(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}
document.getElementById('year').textContent = new Date().getFullYear();

/* Toggle panels (About, Works) */
function hidePanels(){
  ['about','works'].forEach(id=>{
    const p = document.getElementById(id);
    if(p){
      p.classList.remove('panel-visible');
      p.classList.add('hide-panel');
      p.setAttribute('aria-hidden','true');
    }
  });
}
function showPanel(panelId){
  hidePanels();
  const target = document.getElementById(panelId);
  if(target){
    target.classList.remove('hide-panel');
    target.classList.add('panel-visible');
    target.setAttribute('aria-hidden','false');
    const h = target.querySelector('h2, h3');
    if(h) h.setAttribute('tabindex','-1'), h.focus({preventScroll:true});
  }
}
document.querySelectorAll('[data-toggle]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const panel = a.getAttribute('data-toggle');
    if(panel === 'about' || panel === 'works'){
      e.preventDefault();
      showPanel(panel);
      scrollToId(panel);
    } else if(panel === 'home'){
      e.preventDefault();
      hidePanels();
      window.scrollTo({top:0, behavior:'smooth'});
    }
  });
});

/* Count-up animation for metrics */
function animateCount(el, target, duration=1200){
  const start = 0;
  const startTime = performance.now();
  function tick(now){
    const t = Math.min(1, (now - startTime)/duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.floor(start + (target - start) * eased);
    el.textContent = String(val).padStart(2, '0');
    if(t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Fetch GitHub repo count and animate Projects */
async function initMetrics(){
  try{
    const username = 'KrexonTX';
    // Years/Clients
    document.querySelectorAll('.metrics .num').forEach(num=>{
      const target = Number(num.getAttribute('data-target') || '0');
      if(num.id !== 'projectsNumHome') animateCount(num, target, 1000);
    });

    // Public repos
    let page = 1, per_page = 100, total = 0;
    while(true){
      const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=${per_page}&page=${page}`);
      const data = await resp.json();
      if(!Array.isArray(data) || data.length === 0) break;
      total += data.length;
      if(data.length < per_page) break;
      page++;
      if(page>10) break;
    }
    const el = document.getElementById('projectsNumHome');
    const fallback = Number(el.getAttribute('data-target') || '0');
    animateCount(el, total || fallback, 1200);
  }catch(e){
    const el = document.getElementById('projectsNumHome');
    const fallback = Number(el.getAttribute('data-target') || '0');
    animateCount(el, fallback, 1200);
  }
}
window.addEventListener('DOMContentLoaded', initMetrics);
