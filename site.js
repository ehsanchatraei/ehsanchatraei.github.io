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
  const zoom = pdfViewer.querySelector('.preview-zoom');
  let activeButton;

  function updateZoom(expanded) {
    pdfViewer.classList.toggle('preview-zoomed', expanded);
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.textContent = expanded ? 'Fit to window' : 'Zoom in';
    if (!expanded) pages.scrollLeft = 0;
  }

  const buttons = document.querySelectorAll('.document-preview-link');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      activeButton = button;
      title.textContent = button.dataset.previewTitle;
      image.alt = button.dataset.previewTitle + ' document preview';
      image.src = button.dataset.previewSrc;
      const mode = button.dataset.previewMode;
      pdfViewer.classList.toggle('poster-viewer', Boolean(button.closest('#field-outreach')));
      pdfViewer.classList.toggle('visual-preview', mode === 'visual');
      pdfViewer.classList.toggle('cv-preview', mode === 'cv');
      if (zoom) {
        zoom.hidden = mode !== 'visual' && mode !== 'cv';
        updateZoom(false);
      }
      pdfViewer.showModal();
      pages.scrollTop = 0;
    });
  });

  zoom?.addEventListener('click', () => updateZoom(zoom.getAttribute('aria-pressed') !== 'true'));

  pdfViewer.addEventListener('close', () => {
    image.removeAttribute('src');
    activeButton?.focus();
  });

  const previewLinks = { '#academic-cv': 'curriculum-vitae', '#curriculum-vitae': 'curriculum-vitae', '#academic-timeline': 'academic-timeline' };
  document.getElementById(previewLinks[location.hash])?.click();
}
