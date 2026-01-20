const ERAS = ["삼국", "고려", "조선", "근현대"];

const EVENTS = [
  {
    id: "e-001",
    era: "삼국",
    year: 57,
    title: "신라 건국",
    summary: "박혁거세를 시조로 한 신라의 성립(전승 포함).",
    tags: ["국가형성", "고대"],
    points: [
      "삼국 성립기의 흐름을 이해하는 기준점",
      "고대 국가 형성 과정과 왕권 구조"
    ],
    why: "시대 구분과 국가 성립 흐름을 잡는 데 핵심."
  },
  {
    id: "e-002",
    era: "삼국",
    year: 372,
    title: "고구려 소수림왕 불교 공인",
    summary: "불교 수용과 제도 정비(태학 설립 등).",
    tags: ["제도", "종교", "교육"],
    points: [
      "중앙집권 강화와 이념/교육 체계",
      "불교의 국가적 수용 의미"
    ],
    why: "제도·사상·교육이 한 번에 묶이는 사건."
  },
  {
    id: "e-010",
    era: "고려",
    year: 918,
    title: "고려 건국",
    summary: "왕건이 고려를 세우고 후삼국 통일 기반을 마련.",
    tags: ["통일", "왕건"],
    points: [
      "호족 연합과 왕권의 균형",
      "후삼국 통일 과정의 시작"
    ],
    why: "고려 전 시기의 출발점."
  },
  {
    id: "e-020",
    era: "조선",
    year: 1443,
    title: "훈민정음 창제",
    summary: "세종대왕이 백성을 위한 문자(훈민정음)를 창제.",
    tags: ["세종", "문화", "언어"],
    points: [
      "문해력 향상과 사회 변화",
      "지식 접근성의 혁신"
    ],
    why: "한국사에서 가장 큰 ‘접근성 혁신’ 사건."
  },
  {
    id: "e-021",
    era: "조선",
    year: 1592,
    title: "임진왜란 발발",
    summary: "일본의 침략으로 시작된 전쟁. 동아시아 국제질서 변화.",
    tags: ["전쟁", "이순신"],
    points: [
      "전쟁이 국가 시스템에 미치는 영향",
      "전후 복구와 군제·재정 변화"
    ],
    why: "조선 사회 구조 변화의 분기점."
  },
  {
    id: "e-030",
    era: "근현대",
    year: 1919,
    title: "3·1 운동",
    summary: "전국적 독립운동 확산과 임시정부 수립으로 연결.",
    tags: ["독립운동", "민족"],
    points: [
      "대중 운동의 확산",
      "국제 여론과 독립운동 네트워크"
    ],
    why: "현대 한국 정체성 형성의 핵심 사건."
  },
];

let activeEra = null;
let query = "";

const $ = (sel) => document.querySelector(sel);

function renderChips() {
  const chips = $("#chips");
  chips.innerHTML = "";
  ERAS.forEach((era) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = era;
    b.setAttribute("aria-pressed", String(activeEra === era));
    b.addEventListener("click", () => {
      activeEra = (activeEra === era) ? null : era;
      render();
    });
    chips.appendChild(b);
  });
}

function matches(e) {
  const q = query.trim().toLowerCase();
  if (activeEra && e.era !== activeEra) return false;
  if (!q) return true;

  const blob = [
    e.era, e.year, e.title, e.summary, (e.tags || []).join(" "),
    (e.points || []).join(" "), e.why || ""
  ].join(" ").toLowerCase();

  return blob.includes(q);
}

function renderList(items) {
  const list = $("#list");
  list.innerHTML = "";

  items
    .sort((a,b) => (a.year ?? 0) - (b.year ?? 0))
    .forEach((e) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="cardTop">
          <div>
            <div class="badge">${e.era} · ${e.year}</div>
            <h2 class="title">${escapeHtml(e.title)}</h2>
          </div>
        </div>
        <p class="desc">${escapeHtml(e.summary)}</p>
        <div class="tags">
          ${(e.tags || []).slice(0,4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      `;
      card.addEventListener("click", () => openModal(e));
      list.appendChild(card);
    });
}

function setCount(n) {
  $("#count").textContent = `표시 중: ${n}개 사건` + (activeEra ? ` (필터: ${activeEra})` : "");
}

function openModal(e) {
  $("#modalBody").innerHTML = `
    <h3>${escapeHtml(e.title)}</h3>
    <p class="sub">${escapeHtml(e.era)} · ${e.year}</p>

    <div class="sectionTitle">요약</div>
    <p class="desc" style="margin:0">${escapeHtml(e.summary)}</p>

    <div class="sectionTitle">핵심 포인트</div>
    <ul class="bul">
      ${(e.points || []).map(p => `<li>${escapeHtml(p)}</li>`).join("")}
    </ul>

    <div class="sectionTitle">왜 중요한가</div>
    <p class="desc" style="margin:0">${escapeHtml(e.why || "")}</p>

    <div class="source">데이터는 MVP용 샘플입니다. 이후 사건/출처를 확장합니다.</div>
  `;
  const m = $("#modal");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const m = $("#modal");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function render() {
  renderChips();
  const items = EVENTS.filter(matches);
  setCount(items.length);
  renderList(items);
}

$("#q").addEventListener("input", (e) => {
  query = e.target.value;
  render();
});

$("#reset").addEventListener("click", () => {
  activeEra = null;
  query = "";
  $("#q").value = "";
  render();
});

$("#closeBtn").addEventListener("click", closeModal);
$("#closeBackdrop").addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

render();
