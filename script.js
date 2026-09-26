const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

document.title = `${SITE.name} — Roblox Creative Portfolio`;

$$("[data-site-name]").forEach(el => el.textContent = SITE.name);
$$("[data-hero-description]").forEach(el => el.textContent = SITE.heroDescription);
$$("[data-about]").forEach(el => el.textContent = SITE.about);

$$("[data-x-link]").forEach(el => {
  el.href = SITE.x;
  el.target = "_blank";
  el.rel = "noopener";
});

$$("[data-instagram-link]").forEach(el => {
  el.href = "https://www.instagram.com/supremeagzgfx/";
  el.target = "_blank";
  el.rel = "noopener";
});

$$("[data-email-link]").forEach(el => {
  el.href = `mailto:${SITE.email}`;
});

$("#year").textContent = new Date().getFullYear();

$$("[data-stat-projects]").forEach(el => {
  el.textContent = `${PROJECTS.length.toString().padStart(2, "0")}+`;
});

const filters = ["ALL", ...new Set(PROJECTS.map(p => p.category))];
const filterWrap = $("#filters");
const searchInput = $("#project-search");

let activeFilter = "ALL";
let searchQuery = "";

function renderFilters() {
  filterWrap.innerHTML = filters.map(f =>
    `<button class="filter ${f === activeFilter ? "active" : ""}" data-filter="${f}">${f}</button>`
  ).join("");

  $$(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
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
    const matchesFilter =
      activeFilter === "ALL" ||
      project.category === activeFilter;

    const searchableText = [
      project.title,
      project.category,
      project.description
    ].join(" ").toLowerCase();

    const matchesSearch =
      query === "" ||
      searchableText.includes(query);

    return matchesFilter && matchesSearch;
  });

  $("#project-grid").innerHTML = visible.length
    ? visible.map(p => `
      <article class="project" data-index="${PROJECTS.indexOf(p)}">
        <div class="project-image">
          ${imageMarkup(p)}
          <div class="project-overlay"></div>
        </div>

        <div class="project-info">
          <div>
            <h3 class="project-title">${p.title}</h3>
            <div class="project-meta">${p.category}</div>
          </div>

          <div class="project-arrow">↗</div>
        </div>
      </article>
    `).join("")
    : `
      <div class="no-results">
        <h3>No projects found</h3>
        <p>Try a different search or category.</p>
      </div>
    `;

  $$(".project").forEach(card => {
    card.addEventListener("click", () => {
      openModal(Number(card.dataset.index));
    });
  });
}

function openModal(index) {
  const p = PROJECTS[index];

  $("#modal-image").src = p.image;
  $("#modal-image").alt = p.title;
  $("#modal-category").textContent = p.category;
  $("#modal-title").textContent = p.title;
  $("#modal-description").textContent = p.description;

  const link = $("#modal-link");
  link.href = p.link || "#";
  link.style.display =
    p.link && p.link !== "#"
      ? "inline-block"
      : "none";

  $("#project-modal").classList.add("open");
  $("#project-modal").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#project-modal").classList.remove("open");
  $("#project-modal").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$$("[data-close-modal]").forEach(el => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal();
  }
});

const glow = $(".cursor-glow");

window.addEventListener("pointermove", e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

renderFilters();
renderProjects();
