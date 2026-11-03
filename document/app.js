(() => {
  const PAGE_SIZE = 20;
  const state = { documents: [], filtered: [], page: 1, selected: null };
  const elements = {
    library: document.getElementById("library-view"),
    viewer: document.getElementById("document-viewer"),
    tableBody: document.getElementById("document-table-body"),
    count: document.getElementById("document-count"),
    search: document.getElementById("document-search"),
    category: document.getElementById("category-filter"),
    empty: document.getElementById("empty-state"),
    pagination: document.getElementById("pagination"),
    viewerBack: document.getElementById("viewer-back"),
    viewerTitle: document.getElementById("viewer-title"),
    viewerCategory: document.getElementById("viewer-category"),
    viewerDate: document.getElementById("viewer-date"),
    viewerPath: document.getElementById("viewer-path"),
    viewerSourceLink: document.getElementById("viewer-source-link"),
    viewerLoading: document.getElementById("viewer-loading"),
    viewerContent: document.getElementById("viewer-content"),
  };

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  function inlineMarkdown(value) {
    return value
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>")
      .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function renderMarkdown(source) {
    const lines = escapeHtml(source.replaceAll("\r\n", "\n")).split("\n");
    const output = [];
    let paragraph = [];
    let listType = "";
    let inCode = false;
    let codeLanguage = "";
    let codeLines = [];

    const flushParagraph = () => {
      if (!paragraph.length) return;
      output.push(`<p>${inlineMarkdown(paragraph.join("<br>"))}</p>`);
      paragraph = [];
    };
    const closeList = () => {
      if (!listType) return;
      output.push(`</${listType}>`);
      listType = "";
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const fence = line.match(/^```\s*([^\s]*)/);
      if (fence) {
        flushParagraph();
        closeList();
        if (!inCode) {
          inCode = true;
          codeLanguage = fence[1] || "text";
          codeLines = [];
        } else {
          output.push(`<pre><code data-language="${escapeHtml(codeLanguage)}">${codeLines.join("\n")}</code></pre>`);
          inCode = false;
        }
        continue;
      }
      if (inCode) {
        codeLines.push(line);
        continue;
      }
      if (!line.trim()) {
        flushParagraph();
        closeList();
        continue;
      }
      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        flushParagraph();
        closeList();
        output.push("<hr>");
        continue;
      }
      const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph();
        const nextListType = unordered ? "ul" : "ol";
        if (listType !== nextListType) {
          closeList();
          output.push(`<${nextListType}>`);
          listType = nextListType;
        }
        output.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        continue;
      }
      const quote = line.match(/^&gt;\s?(.*)$/);
      if (quote) {
        flushParagraph();
        closeList();
        output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
        continue;
      }
      paragraph.push(line.trim());
    }
    if (inCode) output.push(`<pre><code data-language="${escapeHtml(codeLanguage)}">${codeLines.join("\n")}</code></pre>`);
    flushParagraph();
    closeList();
    return output.join("\n");
  }

  function setDocumentQuery(id = "") {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("doc", id);
    else url.searchParams.delete("doc");
    window.history.pushState({ documentId: id }, "", url);
  }

  function renderCategories() {
    const categories = [...new Set(state.documents.map((documentItem) => documentItem.category))]
      .sort((a, b) => a.localeCompare(b, "ko"));
    elements.category.append(...categories.map((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      return option;
    }));
  }

  function filterDocuments() {
    const search = elements.search.value.trim().toLocaleLowerCase("ko");
    const category = elements.category.value;
    state.filtered = state.documents.filter((documentItem) => {
      const matchesSearch = !search || `${documentItem.title} ${documentItem.sourcePath}`.toLocaleLowerCase("ko").includes(search);
      return matchesSearch && (!category || documentItem.category === category);
    });
    state.page = 1;
    renderList();
  }

  function renderList() {
    const pageCount = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    state.page = Math.min(state.page, pageCount);
    const pageItems = state.filtered.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE);
    elements.tableBody.replaceChildren(...pageItems.map((documentItem) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><span class="document-title">${escapeHtml(documentItem.title)}</span><span class="document-path">${escapeHtml(documentItem.sourcePath)}</span></td>
        <td><span class="category-badge">${escapeHtml(documentItem.category)}</span></td>
        <td><time class="updated-date" datetime="${documentItem.updatedAt}">${documentItem.updatedAt}</time></td>
        <td><button class="view-button" type="button" data-document-id="${documentItem.id}">보기</button></td>`;
      row.querySelector("button").addEventListener("click", () => openDocument(documentItem.id, true));
      return row;
    }));
    elements.empty.hidden = state.filtered.length > 0;
    elements.count.textContent = `전체 ${state.documents.length.toLocaleString("ko-KR")}개 · 검색 결과 ${state.filtered.length.toLocaleString("ko-KR")}개`;
    renderPagination(pageCount);
  }

  function renderPagination(pageCount) {
    elements.pagination.replaceChildren();
    if (pageCount <= 1) return;
    const visiblePages = new Set([1, pageCount]);
    for (let page = Math.max(1, state.page - 2); page <= Math.min(pageCount, state.page + 2); page += 1) visiblePages.add(page);
    let previous = 0;
    [...visiblePages].sort((a, b) => a - b).forEach((page) => {
      if (previous && page - previous > 1) {
        const gap = document.createElement("span");
        gap.textContent = "…";
        gap.setAttribute("aria-hidden", "true");
        elements.pagination.append(gap);
      }
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `${page}페이지`);
      if (page === state.page) button.setAttribute("aria-current", "page");
      button.addEventListener("click", () => {
        state.page = page;
        renderList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      elements.pagination.append(button);
      previous = page;
    });
  }

  async function openDocument(id, updateHistory = false) {
    const documentItem = state.documents.find((candidate) => candidate.id === id);
    if (!documentItem) return showLibrary(updateHistory);
    state.selected = documentItem;
    elements.library.hidden = true;
    elements.viewer.hidden = false;
    elements.viewerTitle.textContent = documentItem.title;
    elements.viewerCategory.textContent = documentItem.category;
    elements.viewerDate.textContent = `업데이트 ${documentItem.updatedAt}`;
    elements.viewerDate.dateTime = documentItem.updatedAt;
    elements.viewerPath.textContent = documentItem.sourcePath;
    elements.viewerSourceLink.href = documentItem.contentUrl;
    elements.viewerLoading.hidden = false;
    elements.viewerContent.hidden = true;
    elements.viewerContent.replaceChildren();
    document.title = `${documentItem.title} · Promo Web Builder`;
    if (updateHistory) setDocumentQuery(id);
    window.scrollTo({ top: 0, behavior: "instant" });
    try {
      const response = await fetch(documentItem.contentUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      elements.viewerContent.innerHTML = renderMarkdown(source);
      elements.viewerContent.hidden = false;
      elements.viewerLoading.hidden = true;
    } catch (error) {
      elements.viewerLoading.textContent = `문서를 불러오지 못했습니다. (${error.message})`;
    }
  }

  function showLibrary(updateHistory = false) {
    state.selected = null;
    elements.library.hidden = false;
    elements.viewer.hidden = true;
    document.title = "문서 라이브러리 · Promo Web Builder";
    if (updateHistory) setDocumentQuery();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  async function initialize() {
    try {
      const response = await fetch("/document/manifest.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      state.documents = manifest.documents;
      state.filtered = [...state.documents];
      renderCategories();
      renderList();
      const requestedDocument = new URLSearchParams(window.location.search).get("doc");
      if (requestedDocument) await openDocument(requestedDocument);
    } catch (error) {
      elements.count.textContent = "문서 목록을 불러오지 못했습니다.";
      elements.empty.textContent = `문서 라이브러리 오류: ${error.message}`;
      elements.empty.hidden = false;
    }
  }

  elements.search.addEventListener("input", filterDocuments);
  elements.category.addEventListener("change", filterDocuments);
  elements.viewerBack.addEventListener("click", () => showLibrary(true));
  window.addEventListener("popstate", () => {
    const id = new URLSearchParams(window.location.search).get("doc");
    if (id) openDocument(id);
    else showLibrary();
  });
  initialize();
})();
