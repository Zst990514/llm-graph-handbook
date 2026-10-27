const sections = [...document.querySelectorAll('section[id], header[id]')];
const navLinks = [...document.querySelectorAll('nav a')];
const progress = document.getElementById('readingProgress');
const backTop = document.getElementById('backTop');
const sidebar = document.getElementById('sidebar');
const menuButton = document.getElementById('menuButton');
const sidebarScrim = document.getElementById('sidebarScrim');

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  backTop.classList.toggle('show', window.scrollY > 700);

  const marker = window.scrollY + 150;
  let activeId = 'top';
  for (const section of sections) {
    if (section.offsetTop <= marker) activeId = section.id;
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
  });
}

function setMenu(open) {
  sidebar.classList.toggle('open', open);
  sidebarScrim.classList.toggle('show', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 820) setMenu(false);
});
menuButton.addEventListener('click', () => setMenu(!sidebar.classList.contains('open')));
sidebarScrim.addEventListener('click', () => setMenu(false));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateScrollState();

const paperSearch = document.getElementById('paperSearch');
const filterButtons = [...document.querySelectorAll('#filterButtons button')];
const papers = [...document.querySelectorAll('#paperLibrary a')];
const noResults = document.getElementById('noResults');
let activeFilter = 'all';

function normalize(value) {
  return value.trim().toLocaleLowerCase('zh-CN');
}

function filterPapers() {
  const query = normalize(paperSearch.value);
  let visible = 0;
  for (const paper of papers) {
    const matchesFilter = activeFilter === 'all' || paper.dataset.tags.split(' ').includes(activeFilter);
    const matchesQuery = !query || normalize(paper.textContent).includes(query);
    const show = matchesFilter && matchesQuery;
    paper.hidden = !show;
    if (show) visible += 1;
  }
  noResults.hidden = visible !== 0;
}

paperSearch.addEventListener('input', filterPapers);
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    filterPapers();
  });
});

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.setAttribute('aria-label', `${link.textContent.trim()}（在新窗口打开）`);
});
