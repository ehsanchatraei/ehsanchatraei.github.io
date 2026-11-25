const controls = document.querySelector('.pub-controls');
const papers = [...document.querySelectorAll('.pub-list li')];
const count = document.querySelector('.pub-count');
const empty = document.querySelector('.pub-empty');
const query = controls.elements.query;
const year = controls.elements.year;
const searchText = papers.map(paper => `${paper.textContent} ${paper.dataset.keywords}`.toLowerCase());

function filterPapers() {
  const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  let visible = 0;

  papers.forEach((paper, index) => {
    const matchesYear = !year.value || paper.dataset.year === year.value;
    const matchesQuery = terms.every(term => searchText[index].includes(term));
    paper.hidden = !(matchesYear && matchesQuery);
    if (!paper.hidden) visible += 1;
  });

  count.textContent = `Showing ${visible} of ${papers.length} papers`;
  empty.hidden = visible !== 0;
}

controls.addEventListener('submit', event => event.preventDefault());
query.addEventListener('input', filterPapers);
year.addEventListener('change', filterPapers);
filterPapers();
controls.hidden = false;
count.hidden = false;



const pdfViewer = document.querySelector('#pdf-viewer');
if (pdfViewer && typeof pdfViewer.showModal === 'function') {
  const frame = pdfViewer.querySelector('iframe');
  const title = pdfViewer.querySelector('h2');
  const openPdf = pdfViewer.querySelector('.pdf-open');
  const downloadPdf = pdfViewer.querySelector('.pdf-download');
  let activeLink;

  document.querySelectorAll('.pdf-link').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activeLink = link;
      title.textContent = link.dataset.pdfTitle;
      openPdf.href = link.href;
      downloadPdf.href = link.href;
      frame.src = link.href;
      frame.title = link.dataset.pdfTitle;
      pdfViewer.showModal();
    });
  });

  pdfViewer.addEventListener('close', () => {
    frame.removeAttribute('src');
    activeLink?.focus();
  });
}
