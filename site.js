const controls = document.querySelector('.pub-controls');
if (controls) setupPublicationFilters(controls);

function setupPublicationFilters(controls) {
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
}

const pdfViewer = document.querySelector('#pdf-viewer');
if (pdfViewer && typeof pdfViewer.showModal === 'function') {
  const pages = pdfViewer.querySelector('.pdf-preview-pages');
  const image = pages.querySelector('img');
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
      if (openPdf) openPdf.href = link.href;
      if (downloadPdf) downloadPdf.href = link.href;
      image.alt = link.dataset.pdfTitle + ' document preview';
      image.src = link.href.replace(/\.pdf$/, '-preview.jpg');
      pdfViewer.showModal();
      pages.scrollTop = 0;
    });
  });

  pdfViewer.addEventListener('close', () => {
    image.removeAttribute('src');
    activeLink?.focus();
  });
}
