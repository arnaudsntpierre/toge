/* ══════════════════════════════════════════════════════════════
   TŌGE — Engine
   Shared helpers, navigation, and reader logic
   ══════════════════════════════════════════════════════════════ */

// === CONTENT HELPERS ===
// These generate the HTML blocks for chapter content.
// Every chapter file calls these to build its page.

const I = (src, cap, cls) =>
  `<div class="manga-panel ${cls || 'manga-wide'}"><img src="${src}" alt="${cap}" loading="lazy"><div class="mp-cap">${cap}</div></div>`;

const D = (s, p) =>
  `<div class="dlg${p ? ' ' + p : ''}">${s}</div>`;

const S = (n, t) =>
  `<div class="dlg-s">${n}</div><p>${t}</p>`;

const P = t =>
  `<div class="pm"><span>${t}</span></div>`;

const N = t =>
  `<p class="nar">${t}</p>`;

const T = t =>
  `<div class="tht"><p>${t}</p></div>`;

const TM = (t) =>
  `<div class="tht">${t.map(x => '<p>' + x + '</p>').join('')}</div>`;

const M = (t, b) =>
  `<div class="mom"><p>${t}</p>${b ? '<span class="big">' + b + '</span>' : ''}</div>`;

const A = (i, t, d) =>
  `<div class="aph"><div class="aph-i">${i}</div><div class="aph-t">${t}</div>${d ? '<div class="aph-d">' + d + '</div>' : ''}</div>`;

const ST = t =>
  `<p class="stg">${t}</p>`;

const SP = () =>
  `<div class="sep"><span>◆</span></div>`;

// === CHAPTER RENDERER ===
// Call this from each chapter page with the chapter data object.
function renderChapter(chapter) {
  const root = document.getElementById('chapter-content');
  if (!root) return;
  root.innerHTML = chapter.content;

  // Set header info
  const numEl = document.getElementById('ch-num');
  const titleEl = document.getElementById('ch-title');
  const dayEl = document.getElementById('ch-day');
  if (numEl) numEl.textContent = chapter.num;
  if (titleEl) titleEl.textContent = chapter.title;
  if (dayEl) {
    if (chapter.day) {
      dayEl.textContent = chapter.day;
      dayEl.style.display = '';
    } else {
      dayEl.style.display = 'none';
    }
  }

  // Build end-of-chapter navigation
  const endNav = document.getElementById('ch-end-nav');
  if (endNav) {
    let navHtml = '';
    if (chapter.prev) {
      navHtml += `<a href="${chapter.prev}">← Previous</a>`;
    } else {
      navHtml += `<a href="./">Contents</a>`;
    }
    if (chapter.next) {
      navHtml += `<a href="${chapter.next}">Next →</a>`;
    } else {
      navHtml += `<a href="./">Complete →</a>`;
    }
    endNav.innerHTML = navHtml;
  }

  // Set end-of-chapter text
  const endTitle = document.getElementById('ch-end-title');
  const endText = document.getElementById('ch-end-text');
  if (endTitle) endTitle.textContent = `${chapter.num} — ${chapter.title} — End`;
  if (endText) endText.textContent = chapter.endText || '';
}

// === NAVIGATION ===
function initNav() {
  const nav = document.getElementById('nav');
  const prog = document.getElementById('prog');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const d = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('v', s > 300);
    if (prog && d > 0) {
      prog.style.width = (s / d * 100) + '%';
    }
  });

  // Chapter dropdown
  const csBtn = document.getElementById('csBtn');
  const dd = document.getElementById('dd');
  if (csBtn && dd) {
    csBtn.addEventListener('click', e => { e.stopPropagation(); dd.classList.toggle('open'); });
    document.addEventListener('click', () => dd.classList.remove('open'));
    dd.querySelectorAll('a').forEach(a => a.addEventListener('click', () => dd.classList.remove('open')));
  }
}

// === MANGA PANEL OBSERVER ===
// Fade-in panels as they enter the viewport.
function initPanelObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  setTimeout(() => {
    document.querySelectorAll('.manga-panel').forEach(p => obs.observe(p));
  }, 100);
}

// === KEYBOARD NAVIGATION ===
function initKeyNav(prevUrl, nextUrl) {
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && prevUrl) {
      window.location.href = prevUrl;
    } else if (e.key === 'ArrowRight' && nextUrl) {
      window.location.href = nextUrl;
    }
  });
}

// === INIT ===
// Call from every page after DOM is ready.
function initToge() {
  initNav();
  initPanelObserver();
}

document.addEventListener('DOMContentLoaded', initToge);
