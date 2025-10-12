// ===== Countdown a 2026-04-25 15:00 (UTC-3) =====
const TARGET_ISO = "2026-04-25T15:00:00-03:00";

function pad2(n){ return String(n).padStart(2,"0"); }

function tick(){
  const now = new Date();
  const target = new Date(TARGET_ISO);
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff = 0;

  const sec = Math.floor(diff / 1000) % 60;
  const min = Math.floor(diff / (1000*60)) % 60;
  const hrs = Math.floor(diff / (1000*60*60)) % 24;
  const days = Math.floor(diff / (1000*60*60*24));

  const byId = id => document.getElementById(id);
  byId("days").textContent    = days;
  byId("hours").textContent   = pad2(hrs);
  byId("minutes").textContent = pad2(min);
  byId("seconds").textContent = pad2(sec);
}
tick();
setInterval(tick, 1000);

// ===== HERO VIDEO: ajuste de aspect-ratio para evitar recortes en móviles =====
(function(){
  const v = document.getElementById('heroVideo');

  function updateFit(){
    if (!v) return;
    if (!v.videoWidth || !v.videoHeight){
      const vw = window.innerWidth, vh = window.innerHeight;
      const screenAR = vw / vh;
      const videoAR = 16/9;
      if (screenAR < videoAR * 0.9 || screenAR > videoAR * 1.2){
        v.classList.add('fit-contain');
      } else {
        v.classList.remove('fit-contain');
      }
      return;
    }
    const videoAR  = v.videoWidth / v.videoHeight;
    const screenAR = window.innerWidth / window.innerHeight;
    if (screenAR < videoAR){ v.classList.add('fit-contain'); }
    else { v.classList.remove('fit-contain'); }
  }

  v?.addEventListener('loadedmetadata', updateFit, { once:true });
  window.addEventListener('resize', updateFit);
  setTimeout(updateFit, 1200);
})();

// ===== Layout responsive del countdown (modo compacto <= 420px) =====
(function(){
  const el = document.getElementById('countdown');
  if (!el) return;

  function applyLayout(){
    if (window.innerWidth <= 420){
      el.classList.add('compact');
    } else {
      el.classList.remove('compact');
    }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout);
})();

// ===== Modales (Datos bancarios IMG + Más info PDF) por delegación =====
(function(){
  const body = document.body;
  const modalBanco = document.getElementById('modal-banco');
  const modalInfo  = document.getElementById('modal-info');

  function openModal(modal){
    if (!modal) return;
    modal.classList.add('is-open');
    body.classList.add('body--lock');
    modal.querySelector('.modal__close')?.focus();
  }
  function closeModal(modal){
    if (!modal) return;
    modal.classList.remove('is-open');
    if (!document.querySelector('.modal.is-open')) {
      body.classList.remove('body--lock');
    }
  }

  document.addEventListener('click', async (e) => {
    const openBanco = e.target.closest('[data-open="banco"]');
    if (openBanco) { e.preventDefault(); openModal(modalBanco); return; }

    const openInfo = e.target.closest('[data-open="info"]');
    if (openInfo) { e.preventDefault(); openModal(modalInfo); return; }

    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) { e.preventDefault(); closeModal(closeBtn.closest('.modal')); return; }

    const dl = e.target.closest('[data-download]');
    if (dl) {
      const href = dl.getAttribute('data-href');
      const filename = dl.getAttribute('download') || 'archivo';
      const supportsDownload = 'download' in HTMLAnchorElement.prototype;
      if (!supportsDownload) {
        e.preventDefault();
        try {
          const resp = await fetch(href, { mode: 'cors' });
          const blob = await resp.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = filename;
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error('No se pudo descargar el archivo:', err);
          alert('No pudimos iniciar la descarga en este navegador. Usá “Abrir en nueva pestaña” o “Guardar como…”.');
        }
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modalBanco?.classList.contains('is-open')) closeModal(modalBanco);
    if (modalInfo?.classList.contains('is-open'))  closeModal(modalInfo);
  });
})();

// ===== Botón calendario (placeholder hasta que pases el link/ICS) =====
// document.getElementById("btn-cal")?.addEventListener("click",(e)=>{
//  const href = e.currentTarget.getAttribute("href");
//  if (href === "#") {
//    e.preventDefault();
//    alert("Pronto añadiremos el enlace para agendar en tu calendario.");
//  }
//});