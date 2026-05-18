const seedCards = [
  {
    id: "wuhouci",
    title: "武侯祠",
    subtitle: "青瓦红墙，满目绿意",
    image: "assets/photos/wuhouci.jpg",
    orientation: "portrait",
    front: [
      { text: "成都", size: 30, x: 0, y: 0 },
      { text: "武侯祠", size: 58, x: 0, y: 0 },
      { text: "2026 春", size: 24, x: 0, y: 0 }
    ],
    photoAdjust: { scale: 1, x: 0, y: 0 },
    frontLayout: { x: 0, y: 0, gap: 54 },
    backLayout: { x: 0, y: 0, width: 76, size: 19 },
    textTheme: "hand",
    backMessage: "丞相祠堂何处寻，锦官城外柏森森。\n\n武侯祠除了厚重的文化价值，\n仅作为一个公园它也足够有诗意。\n青瓦红墙，碧竹松柏，\n满目绿意再加一点小雨，别有意境。",
    signature: "于成都武侯祠",
    postal: "610041"
  },
  {
    id: "dufu-01",
    title: "杜甫草堂",
    subtitle: "成都草木与诗意",
    image: "assets/photos/dufu-01.jpg",
    orientation: "portrait",
    front: [
      { text: "成都", size: 30, x: 0, y: 0 },
      { text: "杜甫草堂", size: 56, x: 0, y: 0 },
      { text: "2026 春", size: 24, x: 0, y: 0 }
    ],
    photoAdjust: { scale: 1, x: 0, y: 0 },
    frontLayout: { x: 0, y: 0, gap: 54 },
    backLayout: { x: 0, y: 0, width: 76, size: 19 },
    textTheme: "hand",
    backMessage: "在草堂的竹影里，\n把一路上的好天气和慢时光，\n都写进这一张明信片。",
    signature: "来自成都",
    postal: ""
  },
  {
    id: "dufu-02",
    title: "杜甫草堂 其二",
    subtitle: "留住春日一页",
    image: "assets/photos/dufu-02.jpg",
    orientation: "portrait",
    front: [
      { text: "成都", size: 30, x: 0, y: 0 },
      { text: "杜甫草堂", size: 56, x: 0, y: 0 },
      { text: "2026 春", size: 24, x: 0, y: 0 }
    ],
    photoAdjust: { scale: 1, x: 0, y: 0 },
    frontLayout: { x: 0, y: 0, gap: 54 },
    backLayout: { x: 0, y: 0, width: 76, size: 19 },
    textTheme: "hand",
    backMessage: "一张照片，一段文字，\n让今天不只留在相册里，\n也成为可以送出的心意。",
    signature: "春日留念",
    postal: ""
  }
];

const state = {
  cards: seedCards.map(cloneCard),
  activeId: "wuhouci",
  side: "front",
  zoom: 0.86,
  cropDraft: null,
  toastTimer: null
};

const app = document.getElementById("app");

const textThemes = {
  hand: {
    label: "手写楷体",
    css: "'Kaiti SC', 'STKaiti', 'KaiTi', '楷体', 'FangSong', serif",
    canvas: '"Kaiti SC", STKaiti, KaiTi, SimKai, FangSong, serif',
    weight: 520,
    tracking: "0"
  },
  running: {
    label: "柔和行书",
    css: "'Xingkai SC', 'STXingkai', '华文行楷', 'KaiTi', '楷体', cursive",
    canvas: '"Xingkai SC", STXingkai, 华文行楷, KaiTi, cursive',
    weight: 500,
    tracking: "0"
  },
  serif: {
    label: "典雅宋体",
    css: "'Noto Serif SC', 'STSong', 'SimSun', 'Songti SC', serif",
    canvas: '"Noto Serif SC", STSong, SimSun, serif',
    weight: 700,
    tracking: "0"
  },
  sans: {
    label: "清爽黑体",
    css: "'Microsoft YaHei UI', 'Noto Sans SC', 'PingFang SC', Arial, sans-serif",
    canvas: '"Microsoft YaHei UI", "Noto Sans SC", Arial, sans-serif',
    weight: 720,
    tracking: "0"
  }
};

function cloneCard(card) {
  return {
    ...card,
    front: card.front.map((line) => ({ x: 0, y: 0, ...line })),
    photoAdjust: { scale: 1, x: 0, y: 0, ...(card.photoAdjust || {}) },
    frontLayout: { x: 0, y: 0, gap: 54, ...(card.frontLayout || {}) },
    backLayout: { x: 0, y: 0, width: 76, size: 19, ...(card.backLayout || {}) },
    textTheme: card.textTheme || "hand"
  };
}

function activeCard() {
  const card = state.cards.find((item) => item.id === state.activeId) || state.cards[0];
  return ensureCardControls(card);
}

function ensureCardControls(card) {
  card.photoAdjust = { scale: 1, x: 0, y: 0, ...(card.photoAdjust || {}) };
  card.frontLayout = { x: 0, y: 0, gap: 54, ...(card.frontLayout || {}) };
  card.front = card.front.map((line) => ({ x: 0, y: 0, ...line }));
  card.backLayout = { x: 0, y: 0, width: 76, size: 19, ...(card.backLayout || {}) };
  card.textTheme = card.textTheme || "hand";
  return card;
}

function icon(name) {
  const paths = {
    upload: '<path d="M12 17V5"/><path d="m7 10 5-5 5 5"/><path d="M5 19h14"/>',
    export: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    stamp: '<path d="M5 4h14v16H5z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/>'
  };
  return `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function render() {
  const card = activeCard();
  app.innerHTML = `
    <main class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">${icon("stamp")}</div>
          <div>
            <div class="brand-title">岁月明信片</div>
            <div class="brand-subtitle">照片、文字与祝福的电子明信片工作台</div>
          </div>
        </div>
        <div class="top-actions">
          <button class="ghost-btn" data-action="new-card">${icon("upload")}导入照片</button>
          <button class="primary-btn" data-action="export">${icon("export")}导出图片</button>
        </div>
      </header>

      <section class="workspace">
        ${renderSidebar(card)}
        ${renderCanvas(card)}
        ${renderInspector(card)}
      </section>
    </main>
    ${state.cropDraft ? renderCropModal() : ""}
    <div class="toast" id="toast"></div>
  `;
  bindEvents();
}

function renderSidebar(card) {
  return `
    <aside class="sidebar">
      <p class="rail-title">照片导入</p>
      <label class="upload-zone" id="uploadZone">
        <strong>${icon("upload")} 选择或拖拽照片</strong>
        <span>自动识别横竖版，裁成适合明信片的比例。支持 JPG、PNG。</span>
        <input class="hidden-input" id="fileInput" type="file" accept="image/jpeg,image/png">
      </label>

      <div class="postcard-list">
        <p class="rail-title">作品</p>
        ${state.cards.map((item) => `
          <div class="postcard-item ${item.id === card.id ? "active" : ""}" data-card-id="${item.id}">
            <img class="thumb" src="${item.image}" alt="${item.title}">
            <span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.subtitle)}</p>
            </span>
            <button class="delete-card-btn" data-delete-card="${item.id}" title="删除这个作品">删</button>
          </div>
        `).join("")}
      </div>
    </aside>
  `;
}

function renderCropModal() {
  const draft = state.cropDraft;
  const boxW = draft.orientation === "landscape" ? 420 : 280;
  const boxH = draft.orientation === "landscape" ? 280 : 420;
  return `
    <div class="modal-backdrop">
      <section class="crop-panel">
        <div class="crop-header">
          <div>
            <h2>裁剪照片</h2>
            <p>拖动照片调整位置，用滑杆改变裁剪范围。</p>
          </div>
          <button class="text-btn" data-crop-cancel>取消</button>
        </div>
        <div class="crop-stage" style="--crop-w:${boxW}px; --crop-h:${boxH}px;">
          <img class="crop-image" data-crop-image src="${draft.src}" alt="待裁剪照片" style="--crop-scale:${draft.scale}; --crop-x:${draft.x}px; --crop-y:${draft.y}px;">
          <div class="crop-frame"></div>
        </div>
        <div class="crop-controls">
          ${renderRange("裁剪大小", "cropDraft", "scale", draft.scale, 0.6, 2.6, "x", 0.01)}
          ${renderRange("左右位置", "cropDraft", "x", draft.x, -420, 420, "px")}
          ${renderRange("上下位置", "cropDraft", "y", draft.y, -420, 420, "px")}
          <div class="layout-options">
            <button class="layout-option ${draft.orientation === "portrait" ? "active" : ""}" data-crop-orientation="portrait">竖版裁剪</button>
            <button class="layout-option ${draft.orientation === "landscape" ? "active" : ""}" data-crop-orientation="landscape">横版裁剪</button>
          </div>
        </div>
        <div class="crop-actions">
          <button class="ghost-btn" data-crop-reset>重置裁剪</button>
          <button class="primary-btn" data-crop-apply>确认生成明信片</button>
        </div>
      </section>
    </div>
  `;
}

function renderCanvas(card) {
  const cardClass = `postcard ${card.orientation}`;
  const sideMarkup = state.side === "front" ? renderFront(card) : renderBack(card);
  const zoomLabel = Math.round(getPreviewZoom(card) * 100);
  return `
    <section class="canvas-area">
      <div class="canvas-toolbar">
        <div class="view-switch">
          <div class="segmented">
            <button class="${state.side === "front" ? "active" : ""}" data-side="front">正面</button>
            <button class="${state.side === "back" ? "active" : ""}" data-side="back">背面</button>
          </div>
          <button class="tool-btn" title="重置示例文字" data-action="reset">${icon("reset")}</button>
        </div>
        <div class="zoom-tools">
          <button class="tool-btn" title="缩小预览" data-zoom="-0.08">${icon("minus")}</button>
          <span>${zoomLabel}%</span>
          <button class="tool-btn" title="放大预览" data-zoom="0.08">${icon("plus")}</button>
        </div>
      </div>
      <div class="stage">
        <div class="postcard-frame" style="--zoom:${state.zoom}; --card-w:${card.orientation === "landscape" ? "640px" : "420px"}; --card-h:${card.orientation === "landscape" ? "426px" : "630px"}">
          <article class="${cardClass}" style="--zoom:${state.zoom}; --back-size:${card.backLayout.size}px;">
            ${sideMarkup}
          </article>
        </div>
      </div>
      <div class="statusbar">
        <span>当前作品：${escapeHtml(card.title)} / ${card.orientation === "landscape" ? "横版" : "竖版"}</span>
        <span>快捷操作：编辑文字后会立即同步到画布</span>
      </div>
    </section>
  `;
}

function getPreviewZoom(card) {
  if (window.matchMedia("(max-width: 640px)").matches) {
    return card.orientation === "portrait" ? 0.78 : 0.52;
  }
  return state.zoom;
}

function renderFront(card) {
  const theme = textThemes[card.textTheme] || textThemes.hand;
  return `
    <img class="photo-surface draggable-photo" data-drag-photo src="${card.image}" alt="${card.title}" style="--photo-scale:${card.photoAdjust.scale}; --photo-x:${card.photoAdjust.x}px; --photo-y:${card.photoAdjust.y}px;">
    <div class="photo-vignette"></div>
    <div class="front-copy" style="--front-x:${card.frontLayout.x}px; --front-y:${card.frontLayout.y}px; --front-gap:${card.frontLayout.gap}px; --text-theme:${theme.css}; --text-weight:${theme.weight}; --text-tracking:${theme.tracking};">
      ${card.front.map((line, index) => `
        <div class="${index === 1 ? "main" : ""} draggable-text" data-drag-text="${index}" style="font-size:${line.size}px; --line-x:${line.x}px; --line-y:${line.y}px;">${escapeHtml(line.text)}</div>
      `).join("")}
    </div>
  `;
}

function renderBack(card) {
  const paragraphs = normalizeLines(card.backMessage);
  const theme = textThemes[card.textTheme] || textThemes.hand;
  return `
    <div class="back-face">
      <div class="back-header">
        <span>中 国 邮 政</span>
        <span class="stamp">贴邮票处</span>
      </div>
      <div class="back-message" style="--back-x:${card.backLayout.x}px; --back-y:${card.backLayout.y}px; --back-width:${card.backLayout.width}%; --text-theme:${theme.css}; --text-weight:${theme.weight}; --text-tracking:${theme.tracking};">
        ${paragraphs.map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`).join("")}
        <div class="signature">${escapeHtml(card.signature)}</div>
      </div>
      <div class="postal">邮政编码 ${escapeHtml(card.postal) || "□□□□□□"}</div>
    </div>
  `;
}

function renderInspector(card) {
  return `
    <aside class="inspector">
      <div class="panel-section">
        <div class="panel-title"><h2>文字风格</h2></div>
        <div class="field">
          <label>字体主题</label>
          <select data-field="textTheme">
            ${Object.entries(textThemes).map(([key, theme]) => `
              <option value="${key}" ${card.textTheme === key ? "selected" : ""}>${theme.label}</option>
            `).join("")}
          </select>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-title">
          <h2>正面文字</h2>
          <button class="text-btn" data-side="front">看正面</button>
        </div>
        ${card.front.map((line, index) => `
          <div class="inline-grid">
            <div class="field">
              <label>第 ${index + 1} 行</label>
              <input data-front-text="${index}" value="${escapeAttr(line.text)}">
            </div>
            <div class="field">
              <label>字号</label>
              <input type="number" min="12" max="86" data-front-size="${index}" value="${line.size}">
            </div>
          </div>
          <div class="control-group compact">
            ${renderRange(`第 ${index + 1} 行左右`, "frontLine", `x:${index}`, line.x, -260, 260, "px")}
            ${renderRange(`第 ${index + 1} 行上下`, "frontLine", `y:${index}`, line.y, -260, 260, "px")}
          </div>
        `).join("")}
        <div class="control-group">
          <h3>正面整体辅助</h3>
          ${renderRange("整体左右", "frontLayout", "x", card.frontLayout.x, -260, 260, "px")}
          ${renderRange("整体上下", "frontLayout", "y", card.frontLayout.y, -260, 220, "px")}
          ${renderRange("基础行距", "frontLayout", "gap", card.frontLayout.gap, 20, 110, "px")}
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-title">
          <h2>背面留言</h2>
          <button class="text-btn" data-side="back">看背面</button>
        </div>
        <div class="field">
          <label>留言内容</label>
          <textarea data-field="backMessage">${escapeHtml(card.backMessage)}</textarea>
        </div>
        <div class="field">
          <label>落款</label>
          <input data-field="signature" value="${escapeAttr(card.signature)}">
        </div>
        <div class="field">
          <label>邮政编码</label>
          <input data-field="postal" value="${escapeAttr(card.postal)}" maxlength="10">
        </div>
        <div class="control-group">
          <h3>背面文字位置</h3>
          ${renderRange("字号", "backLayout", "size", card.backLayout.size, 15, 32, "px")}
          ${renderRange("左右", "backLayout", "x", card.backLayout.x, -180, 180, "px")}
          ${renderRange("上下", "backLayout", "y", card.backLayout.y, -180, 220, "px")}
          ${renderRange("宽度", "backLayout", "width", card.backLayout.width, 46, 92, "%")}
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-title"><h2>版式</h2></div>
        <div class="layout-options">
          <button class="layout-option ${card.orientation === "portrait" ? "active" : ""}" data-orientation="portrait">竖版</button>
          <button class="layout-option ${card.orientation === "landscape" ? "active" : ""}" data-orientation="landscape">横版</button>
        </div>
        <div class="control-group" style="margin-top:14px">
          <h3>照片位置</h3>
          ${renderRange("大小", "photoAdjust", "scale", card.photoAdjust.scale, 0.35, 3.2, "x", 0.01)}
          ${renderRange("左右", "photoAdjust", "x", card.photoAdjust.x, -420, 420, "px")}
          ${renderRange("上下", "photoAdjust", "y", card.photoAdjust.y, -420, 420, "px")}
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-title"><h2>输出</h2></div>
        <div class="export-box">
          <strong>导出会生成一张包含正面和背面的 PNG 图片。</strong>
          <span>图片由 Canvas 直接绘制，不依赖外部截图库，适合离线使用和后续部署。</span>
          <button class="primary-btn" data-action="export">${icon("export")}导出双面图片</button>
        </div>
      </div>
    </aside>
  `;
}

function renderRange(label, group, key, value, min, max, unit, step = 1) {
  const display = unit === "x" ? `${Number(value).toFixed(2)}x` : `${Math.round(Number(value))}${unit}`;
  return `
    <div class="range-field">
      <label>${label}</label>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-adjust-group="${group}" data-adjust-key="${key}">
      <span>${display}</span>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-card-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeId = button.dataset.cardId;
      render();
    });
  });

  document.querySelectorAll("[data-delete-card]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteCard(button.dataset.deleteCard);
    });
  });

  document.querySelectorAll("[data-side]").forEach((button) => {
    button.addEventListener("click", () => {
      state.side = button.dataset.side;
      render();
    });
  });

  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      state.zoom = clamp(state.zoom + Number(button.dataset.zoom), 0.48, 1.08);
      render();
    });
  });

  document.querySelectorAll("[data-front-text]").forEach((input) => {
    input.addEventListener("input", () => {
      activeCard().front[Number(input.dataset.frontText)].text = input.value;
      renderCanvasOnly();
    });
  });

  document.querySelectorAll("[data-front-size]").forEach((input) => {
    input.addEventListener("input", () => {
      activeCard().front[Number(input.dataset.frontSize)].size = Number(input.value);
      renderCanvasOnly();
    });
  });

  document.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      activeCard()[input.dataset.field] = input.value;
      if (input.dataset.field === "textTheme") {
        render();
      } else if (state.side === "back") {
        renderCanvasOnly();
      }
    });
  });

  document.querySelectorAll("[data-orientation]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCard().orientation = button.dataset.orientation;
      render();
    });
  });

  document.querySelectorAll("[data-adjust-group]").forEach((input) => {
    input.addEventListener("input", () => {
      const card = activeCard();
      const group = input.dataset.adjustGroup;
      const key = input.dataset.adjustKey;
      if (group === "cropDraft") return;
      if (group === "frontLine") {
        const [lineKey, index] = key.split(":");
        card.front[Number(index)][lineKey] = Number(input.value);
        state.side = "front";
      } else {
        card[group][key] = Number(input.value);
      }
      if (group === "frontLayout" || group === "photoAdjust") state.side = "front";
      if (group === "backLayout") state.side = "back";
      render();
    });
  });

  document.querySelectorAll("[data-action='export']").forEach((button) => {
    button.addEventListener("click", exportPostcard);
  });

  document.querySelectorAll("[data-action='new-card']").forEach((button) => {
    button.addEventListener("click", () => document.getElementById("fileInput").click());
  });

  document.querySelector("[data-action='reset']")?.addEventListener("click", resetActiveCard);
  bindUpload();
  bindCanvasDrag();
  bindCropModal();
}

function deleteCard(id) {
  if (state.cards.length <= 1) {
    showToast("至少保留一个作品");
    return;
  }
  const index = state.cards.findIndex((card) => card.id === id);
  if (index < 0) return;
  state.cards = state.cards.filter((card) => card.id !== id);
  if (state.activeId === id) {
    state.activeId = state.cards[Math.max(0, index - 1)]?.id || state.cards[0].id;
  }
  showToast("作品已删除");
  render();
}

function renderCanvasOnly() {
  const area = document.querySelector(".canvas-area");
  if (!area) return;
  area.outerHTML = renderCanvas(activeCard());
  bindEvents();
}

function bindUpload() {
  const zone = document.getElementById("uploadZone");
  const fileInput = document.getElementById("fileInput");
  if (!zone || !fileInput) return;

  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("is-dragging");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("is-dragging"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-dragging");
    const file = event.dataTransfer.files[0];
    if (file) importPhoto(file);
  });
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) importPhoto(file);
  });
}

function bindCanvasDrag() {
  const postcard = document.querySelector(".postcard");
  if (!postcard || state.side !== "front") return;
  const dragTargets = document.querySelectorAll("[data-drag-photo], [data-drag-text]");
  dragTargets.forEach((target) => {
    target.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const card = activeCard();
      const rect = postcard.getBoundingClientRect();
      const previewScale = rect.width / (card.orientation === "landscape" ? 640 : 420);
      const startX = event.clientX;
      const startY = event.clientY;
      const textIndex = target.dataset.dragText;
      const isPhoto = target.hasAttribute("data-drag-photo");
      const start = isPhoto
        ? { x: card.photoAdjust.x, y: card.photoAdjust.y }
        : { x: card.front[Number(textIndex)].x, y: card.front[Number(textIndex)].y };

      target.setPointerCapture(event.pointerId);
      target.classList.add("is-dragging");

      const onMove = (moveEvent) => {
        const dx = (moveEvent.clientX - startX) / previewScale;
        const dy = (moveEvent.clientY - startY) / previewScale;
        if (isPhoto) {
          card.photoAdjust.x = Math.round(clamp(start.x + dx, -420, 420));
          card.photoAdjust.y = Math.round(clamp(start.y + dy, -420, 420));
          target.style.setProperty("--photo-x", `${card.photoAdjust.x}px`);
          target.style.setProperty("--photo-y", `${card.photoAdjust.y}px`);
        } else {
          const line = card.front[Number(textIndex)];
          line.x = Math.round(clamp(start.x + dx, -260, 260));
          line.y = Math.round(clamp(start.y + dy, -260, 260));
          target.style.setProperty("--line-x", `${line.x}px`);
          target.style.setProperty("--line-y", `${line.y}px`);
        }
      };

      const onUp = () => {
        target.classList.remove("is-dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        render();
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    });
  });
}

function bindCropModal() {
  if (!state.cropDraft) return;

  document.querySelector("[data-crop-cancel]")?.addEventListener("click", () => {
    state.cropDraft = null;
    render();
  });

  document.querySelector("[data-crop-reset]")?.addEventListener("click", () => {
    state.cropDraft.scale = 1;
    state.cropDraft.x = 0;
    state.cropDraft.y = 0;
    render();
  });

  document.querySelector("[data-crop-apply]")?.addEventListener("click", createCardFromCrop);

  document.querySelectorAll("[data-crop-orientation]").forEach((button) => {
    button.addEventListener("click", () => {
      state.cropDraft.orientation = button.dataset.cropOrientation;
      render();
    });
  });

  document.querySelectorAll("[data-adjust-group='cropDraft']").forEach((input) => {
    input.addEventListener("input", () => {
      state.cropDraft[input.dataset.adjustKey] = Number(input.value);
      render();
    });
  });

  const image = document.querySelector("[data-crop-image]");
  if (!image) return;
  image.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const start = { x: state.cropDraft.x, y: state.cropDraft.y };
    image.setPointerCapture(event.pointerId);
    image.classList.add("is-dragging");

    const onMove = (moveEvent) => {
      state.cropDraft.x = Math.round(clamp(start.x + moveEvent.clientX - startX, -420, 420));
      state.cropDraft.y = Math.round(clamp(start.y + moveEvent.clientY - startY, -420, 420));
      image.style.setProperty("--crop-x", `${state.cropDraft.x}px`);
      image.style.setProperty("--crop-y", `${state.cropDraft.y}px`);
    };

    const onUp = () => {
      image.classList.remove("is-dragging");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      render();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  });
}

async function importPhoto(file) {
  if (!file.type.match(/^image\/(jpeg|png)$/)) {
    showToast("请选择 JPG 或 PNG 照片");
    return;
  }
  const dataUrl = await readFile(file);
  const image = await loadImage(dataUrl);
  state.cropDraft = {
    src: dataUrl,
    fileName: file.name,
    orientation: image.naturalWidth > image.naturalHeight ? "landscape" : "portrait",
    scale: 1,
    x: 0,
    y: 0
  };
  render();
}

async function createCardFromCrop() {
  const draft = state.cropDraft;
  if (!draft) return;
  const cropped = await cropImageDataUrl(draft);
  const id = `custom-${Date.now()}`;
  const newCard = {
    id,
    title: draft.fileName.replace(/\.[^.]+$/, "") || "新明信片",
    subtitle: "新导入照片",
    image: cropped.dataUrl,
    orientation: cropped.orientation,
    front: [
      { text: "旅行", size: 30 },
      { text: "我的明信片", size: cropped.orientation === "landscape" ? 48 : 54 },
      { text: "2026", size: 24 }
    ].map((line) => ({ ...line, x: 0, y: 0 })),
    photoAdjust: { scale: 1, x: 0, y: 0 },
    frontLayout: { x: 0, y: 0, gap: 54 },
    backLayout: { x: 0, y: 0, width: 76, size: 19 },
    textTheme: "hand",
    backMessage: "把想说的话写在这里，\n也可以留空后直接导出。",
    signature: "来自我的相册",
    postal: ""
  };
  state.cards = [newCard, ...state.cards];
  state.activeId = id;
  state.side = "front";
  state.cropDraft = null;
  showToast("照片已导入并完成裁剪");
  render();
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function cropImageDataUrl(draft) {
  const image = await loadImage(draft.src);
  const finalW = draft.orientation === "landscape" ? 1200 : 900;
  const finalH = draft.orientation === "landscape" ? 800 : 1350;
  const out = document.createElement("canvas");
  out.width = finalW;
  out.height = finalH;
  const ctx = out.getContext("2d");
  const ratio = Math.max(finalW / image.naturalWidth, finalH / image.naturalHeight) * draft.scale;
  const dw = image.naturalWidth * ratio;
  const dh = image.naturalHeight * ratio;
  const dx = finalW / 2 - dw / 2 + draft.x * (finalW / (draft.orientation === "landscape" ? 420 : 280));
  const dy = finalH / 2 - dh / 2 + draft.y * (finalH / (draft.orientation === "landscape" ? 280 : 420));
  ctx.fillStyle = "#f7f3eb";
  ctx.fillRect(0, 0, finalW, finalH);
  ctx.drawImage(image, dx, dy, dw, dh);
  return { dataUrl: out.toDataURL("image/jpeg", 0.9), orientation: draft.orientation };
}

function detectBounds(data, width, height) {
  const isDark = (index) => data[index] < 22 && data[index + 1] < 22 && data[index + 2] < 22;
  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  for (let y = 0; y < height; y += 1) {
    let dark = 0;
    for (let x = 0; x < width; x += 1) if (isDark((y * width + x) * 4)) dark += 1;
    if (dark < width * 0.94) { top = y; break; }
  }
  for (let y = height - 1; y >= 0; y -= 1) {
    let dark = 0;
    for (let x = 0; x < width; x += 1) if (isDark((y * width + x) * 4)) dark += 1;
    if (dark < width * 0.94) { bottom = y; break; }
  }
  for (let x = 0; x < width; x += 1) {
    let dark = 0;
    for (let y = 0; y < height; y += 1) if (isDark((y * width + x) * 4)) dark += 1;
    if (dark < height * 0.94) { left = x; break; }
  }
  for (let x = width - 1; x >= 0; x -= 1) {
    let dark = 0;
    for (let y = 0; y < height; y += 1) if (isDark((y * width + x) * 4)) dark += 1;
    if (dark < height * 0.94) { right = x; break; }
  }
  return { left, right, top, bottom };
}

async function exportPostcard() {
  try {
    const card = activeCard();
    const size = card.orientation === "landscape" ? { w: 1280, h: 852 } : { w: 840, h: 1260 };
    const gap = 70;
    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h * 2 + gap;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f7f3eb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await drawFront(ctx, card, 0, 0, size.w, size.h);
    ctx.fillStyle = "#8b7660";
    ctx.font = "28px Microsoft YaHei UI, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("正面 / 背面", canvas.width / 2, size.h + 44);
    drawBack(ctx, card, 0, size.h + gap, size.w, size.h);

    const link = document.createElement("a");
    link.download = `岁月明信片-${card.title}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("双面图片已导出");
  } catch (error) {
    showToast("导出受浏览器限制，请用本地 Web 服务打开");
  }
}

async function drawFront(ctx, card, x, y, w, h) {
  const image = await loadImage(card.image);
  const theme = textThemes[card.textTheme] || textThemes.hand;
  drawCoverImage(ctx, image, x, y, w, h, card);
  const gradient = ctx.createLinearGradient(0, y, 0, y + h);
  gradient.addColorStop(0, "rgba(0,0,0,0.03)");
  gradient.addColorStop(1, "rgba(0,0,0,0.24)");
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 5;
  const scale = w / (card.orientation === "landscape" ? 640 : 420);
  const centerX = x + w / 2 + card.frontLayout.x * scale;
  const baseY = y + h / 2 + card.frontLayout.y * scale + (card.orientation === "landscape" ? 48 : 92) * scale;
  card.front.forEach((line, index) => {
    ctx.font = `${index === 1 ? Math.max(theme.weight, 650) : theme.weight} ${line.size * scale}px ${theme.canvas}`;
    ctx.fillText(line.text, centerX + line.x * scale, baseY + index * card.frontLayout.gap * scale + line.y * scale);
  });
  ctx.shadowColor = "transparent";
}

function drawBack(ctx, card, x, y, w, h) {
  const theme = textThemes[card.textTheme] || textThemes.hand;
  ctx.fillStyle = "#fffbf3";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#f1dfc4";
  ctx.lineWidth = 24;
  ctx.strokeRect(x + 12, y + 12, w - 24, h - 24);
  ctx.fillStyle = "rgba(182,74,53,0.08)";
  ctx.fillRect(x, y, w * 0.18, h);
  const scale = w / (card.orientation === "landscape" ? 1280 : 840);
  ctx.fillStyle = "#b64a35";
  ctx.font = `${Math.round(42 * scale)}px STSong, SimSun, serif`;
  ctx.textAlign = "left";
  ctx.fillText("中 国 邮 政", x + 72 * scale, y + 76 * scale);
  ctx.strokeStyle = "rgba(182,74,53,0.58)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x + w - 206 * scale, y + 50 * scale, 132 * scale, 96 * scale);
  ctx.font = `${Math.round(22 * scale)}px Microsoft YaHei UI, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("贴邮票处", x + w - 140 * scale, y + 108 * scale);

  const lines = normalizeLines(card.backMessage);
  ctx.fillStyle = "#3b2b20";
  ctx.font = `${theme.weight} ${Math.round(card.backLayout.size * 2 * scale)}px ${theme.canvas}`;
  ctx.textAlign = "center";
  const lineHeight = card.backLayout.size * 3.7 * scale;
  const centerX = x + w / 2 + card.backLayout.x * scale;
  const lineW = w * card.backLayout.width / 100;
  let textY = y + 210 * scale + card.backLayout.y * scale;
  lines.forEach((line) => {
    ctx.fillText(line, centerX, textY);
    ctx.strokeStyle = "rgba(105,76,48,0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - lineW / 2, textY + 12 * scale);
    ctx.lineTo(centerX + lineW / 2, textY + 12 * scale);
    ctx.stroke();
    textY += lineHeight;
  });
  ctx.textAlign = "right";
  ctx.font = `${theme.weight} ${Math.round((card.backLayout.size * 2 - 2) * scale)}px ${theme.canvas}`;
  ctx.fillText(card.signature, centerX + lineW / 2, textY + 18 * scale);
  ctx.fillStyle = "#786b5e";
  ctx.font = `${Math.round(28 * scale)}px Microsoft YaHei UI, sans-serif`;
  ctx.textAlign = "left";
  ctx.fillText(`邮政编码 ${card.postal || "□□□□□□"}`, x + 72 * scale, y + h - 54 * scale);
}

function drawCoverImage(ctx, image, x, y, w, h, card) {
  const baseW = card.orientation === "landscape" ? 640 : 420;
  const exportScale = w / baseW;
  const ratio = Math.max(w / image.naturalWidth, h / image.naturalHeight);
  const dw = image.naturalWidth * ratio * card.photoAdjust.scale;
  const dh = image.naturalHeight * ratio * card.photoAdjust.scale;
  const dx = x + w / 2 - dw / 2 + card.photoAdjust.x * exportScale;
  const dy = y + h / 2 - dh / 2 + card.photoAdjust.y * exportScale;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(image, dx, dy, dw, dh);
  ctx.restore();
}

function resetActiveCard() {
  const original = seedCards.find((card) => card.id === activeCard().id);
  if (!original) {
    showToast("自定义作品无需重置");
    return;
  }
  state.cards = state.cards.map((card) => card.id === original.id ? cloneCard(original) : card);
  showToast("已恢复示例文字");
  render();
}

function normalizeLines(text) {
  const lines = String(text || "").split("\n").map((line) => line.trim());
  const visible = lines.filter(Boolean);
  return visible.length ? visible : ["", "", ""];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

render();
window.addEventListener("resize", debounce(render, 120));

function debounce(fn, delay) {
  let timer = null;
  return function debounced() {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}
