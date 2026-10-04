const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

document.title = `${SITE.name} — Roblox Creative Portfolio`;

$$('[data-site-name]').forEach(el => el.textContent = SITE.name);
$$('[data-hero-description]').forEach(el => el.textContent = SITE.heroDescription);
$$('[data-about]').forEach(el => el.textContent = SITE.about);

$$('[data-x-link]').forEach(el => {
  el.href = SITE.x;
  el.target = '_blank';
  el.rel = 'noopener';
});

$$('[data-instagram-link]').forEach(el => {
  el.href = SITE.instagram;
  el.target = '_blank';
  el.rel = 'noopener';
});

$$('[data-email-link]').forEach(el => {
  el.href = `mailto:${SITE.email}`;
});

$('#year').textContent = new Date().getFullYear();

$$('[data-stat-projects]').forEach(el => {
  el.textContent = `${PROJECTS.length.toString().padStart(2, '0')}+`;
});

const filters = ['ALL', ...new Set(PROJECTS.map(p => p.category))];
const filterWrap = $('#filters');
const searchInput = $('#project-search');

let activeFilter = 'ALL';
let searchQuery = '';

function renderFilters() {
  filterWrap.innerHTML = filters.map(f =>
    `<button class="filter ${f === activeFilter ? 'active' : ''}" data-filter="${f}">${f}</button>`
  ).join('');

  $$('.filter').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderProjects();
    });
  });
}

function imageMarkup(project) {
  return `
    <img src="${project.image}" alt="${project.title}" loading="lazy"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='grid'">
    <div class="project-placeholder" style="display:none">${project.category}</div>
  `;
}

function renderProjects() {
  const query = searchQuery.trim().toLowerCase();

  const visible = PROJECTS.filter(project => {
    const matchesFilter = activeFilter === 'ALL' || project.category === activeFilter;

    const searchableText = [
      project.title,
      project.category,
      project.description
    ].join(' ').toLowerCase();

    const matchesSearch = query === '' || searchableText.includes(query);
    return matchesFilter && matchesSearch;
  });

  $('#project-grid').innerHTML = visible.length
    ? visible.map((p, i) => `
      <article class="project reveal" style="--delay:${Math.min(i * 70, 350)}ms" data-index="${PROJECTS.indexOf(p)}">
        <div class="project-image">
          ${imageMarkup(p)}
          <div class="project-overlay"></div>
          <div class="project-blue-sheen"></div>
        </div>
        <div class="project-info">
          <div>
            <h3 class="project-title">${p.title}</h3>
            <div class="project-meta">${p.category}</div>
          </div>
          <div class="project-arrow">↗</div>
        </div>
      </article>
    `).join('')
    : `
      <div class="no-results">
        <h3>No projects found</h3>
        <p>Try a different search or category.</p>
      </div>
    `;

  $$('.project').forEach(card => {
    card.addEventListener('click', () => openModal(Number(card.dataset.index)));
  });

  observeReveals();
}

let modalMedia = [];
let activeMediaIndex = 0;

function getProjectMedia(project) {
  if (Array.isArray(project.media) && project.media.length) {
    return project.media.map(item => {
      if (typeof item === "string") {
        return { type: /\.(mp4|webm|ogg)(\?.*)?$/i.test(item) ? "video" : "image", src: item };
      }
      return {
        type: item.type || (/\.(mp4|webm|ogg)(\?.*)?$/i.test(item.src || "") ? "video" : "image"),
        src: item.src
      };
    }).filter(item => item.src);
  }
  return project.image ? [{ type: "image", src: project.image }] : [];
}

function showMedia(index) {
  if (!modalMedia.length) return;
  activeMediaIndex = (index + modalMedia.length) % modalMedia.length;

  const item = modalMedia[activeMediaIndex];
  const image = $("#modal-image");
  const video = $("#modal-video");
  const multiple = modalMedia.length > 1;

  video.pause();
  video.removeAttribute("src");
  video.load();

  if (item.type === "video") {
    image.hidden = true;
    video.hidden = false;
    video.src = item.src;
    video.load();
  } else {
    video.hidden = true;
    image.hidden = false;
    image.src = item.src;
    image.alt = $("#modal-title").textContent;
  }

  $("#media-prev").hidden = !multiple;
  $("#media-next").hidden = !multiple;
  $("#media-counter").textContent = multiple ? `${activeMediaIndex + 1} / ${modalMedia.length}` : "";
  $("#media-dots").innerHTML = multiple
    ? modalMedia.map((_, i) => `<button class="media-dot ${i === activeMediaIndex ? "active" : ""}" type="button" data-media-index="${i}" aria-label="Show slide ${i + 1}" aria-current="${i === activeMediaIndex ? "true" : "false"}"></button>`).join("")
    : "";

  $$(".media-dot").forEach(dot => {
    dot.addEventListener("click", () => showMedia(Number(dot.dataset.mediaIndex)));
  });
}

function openModal(index) {
  const p = PROJECTS[index];
  modalMedia = getProjectMedia(p);

  $("#modal-category").textContent = p.category;
  $("#modal-title").textContent = p.title;
  $("#modal-description").textContent = p.description;

  const link = $("#modal-link");
  link.href = p.link || "#";
  link.style.display = p.link && p.link !== "#" ? "inline-block" : "none";

  showMedia(0);
  $("#project-modal").classList.add("open");
  $("#project-modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $('#project-modal').classList.remove('open');
  $('#project-modal').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$("#media-prev").addEventListener("click", () => showMedia(activeMediaIndex - 1));
$("#media-next").addEventListener("click", () => showMedia(activeMediaIndex + 1));

$$('[data-close-modal]').forEach(el => {
  el.addEventListener('click', closeModal);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

const glow = $('.cursor-glow');

window.addEventListener('pointermove', e => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value;
  renderProjects();
});

let revealObserver;

function observeReveals() {
  if (!revealObserver) return;

  $$('.reveal:not(.reveal-ready)').forEach(el => {
    el.classList.add('reveal-ready');
    revealObserver.observe(el);
  });
}

if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
} else {
  document.documentElement.classList.add('no-reveal');
}

renderFilters();
renderProjects();
observeReveals();
