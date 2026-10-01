// 쇼릴 영상 임베드 주소 (예: https://www.youtube.com/embed/XXXX 또는 https://player.vimeo.com/video/XXXX)
// 비워두면 썸네일 + 가상 플레이어가 표시됩니다.
const REEL_URL = 'https://www.youtube.com/embed/kjOagqW8L0Q?autoplay=1&rel=0&playsinline=1';

const reel = { title: '쇼릴 2026', client: '유지훈', cat: '하이라이트', dur: '01:31', src: 'assets/쇼릴 썸네일.webp', ph: '쇼릴 영상', isReel: true };

// youtube: 영상 ID (youtu.be/ 뒤의 값). 있으면 카드 클릭 시 실제 영상이 재생돼요.
// role / tools / period / point: 있으면 영상 아래에 작업 정보로 표시돼요. 비워두면 그 줄은 숨겨져요.
// notice: 카드와 상세 화면에 눈에 띄게 표시할 안내 문구 (예: 가상 광고 표시).
// credit: 상세 화면 맨 아래에 작게 표시할 출처 · 참고 문구.
const projects = [
  {
    title: '첫 카메라, 첫 속초', cat: '브이로그', client: '1인 제작', dur: '04:58',
    src: 'assets/속초 썸네일.webp', color: '#2f8cff', youtube: '99FYC_MeHsM',
    role: '기획 · 촬영 · 컷편집 · 자막 · 색보정 · 사운드 (1인 제작)',
    tools: 'Premiere Pro, Photoshop(썸네일)',
    period: '3일',
    point: '계획 없이 떠난 첫 여행의 흐름을 출발부터 해변까지 시간 순으로 엮었고, 속마음을 말하듯 쓴 자막과 반복되는 그림자 컷으로 혼자 떠난 여행의 분위기를 살렸습니다.',
  },
  {
    title: 'umbro 스펙 광고 (가상)', cat: '광고', client: '개인 제작', dur: '00:47',
    src: 'assets/엄브로 썸네일.webp', color: '#7b3cff', youtube: 'VJyeF5GnePU',
    notice: '실제 클라이언트 의뢰가 아닌 개인 제작 가상 광고입니다',
    role: '기획 · 소스 선별 · 컷편집 · 색보정 · 사운드 (1인 제작)',
    tools: 'Premiere Pro, After Effects',
    period: '1일',
    point: '음악 비트에 맞춘 빠른 컷 전환으로 47초 안에 브랜드의 에너지를 압축했습니다.',
  },
  {
    title: 'Osaka', cat: '브이로그', client: '필름로그', dur: '00:28',
    src: 'assets/오사카 썸네일.webp', color: '#ff5a2a', youtube: '0GysLKC-wv0',
    role: '기획 · 촬영 · 컷편집 · 모션그래픽 · 색보정 · 썸네일 (1인 제작)',
    tools: 'Premiere Pro, After Effects, Photoshop',
    period: '1일',
    point: '여행 사진과 영상을 콜라주로 겹쳐 필름 앨범을 넘기는 듯한 무드를 만들고, After Effects로 사진이 쌓이고 타이틀이 등장하는 모션을 더해 정적인 사진도 리듬감 있게 흐르도록 구성했습니다.',
    credit: '일부 사진은 외부 이미지를 활용했습니다',
  },
  {
    title: "oFFe's mind", cat: '모션그래픽', client: '1인 제작', dur: '00:55',
    src: 'assets/마인드 썸네일.webp', color: '#1fb8b0', youtube: 'VBGjqBsETtU',
    role: '기획 · 디자인 · 모션그래픽 (1인 제작)',
    tools: 'After Effects',
    period: '2일',
    point: "빛 입자 하나가 머릿속을 여행하듯 좋아하는 물건들을 차례로 비추고, 마지막에 모든 오브젝트가 로고 주위로 모여드는 구조로 '나'를 소개했습니다. 청록 단색의 홀로그램 톤과 컷 없이 이어지는 카메라 흐름으로 하나의 공간 안에 있는 듯한 몰입감을 만들었습니다.",
  },
].map(p => ({ ...p, ph: p.cat + ' 썸네일' }));

const toSecs = d => { if (!d) return 0; const [m, s] = d.split(':').map(Number); return m * 60 + s; };
const fmt = s => { s = Math.floor(s); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slotHtml = (src, ph, alt) => src
  ? `<img src="${esc(src)}" alt="${esc(alt || '')}" loading="lazy">`
  : '';

/* ---------- marquee ---------- */
const words = ['유튜브 편집', '★', '광고 영상', '★', '컷 편집', '★', '모션그래픽', '★', '색보정', '★', '사운드', '★'];
$('marquee').innerHTML = [...words, ...words].map(w => `<span${w === '★' ? ' class="s"' : ''}>${w}</span>`).join('');

/* ---------- work grid + filters ---------- */
let filter = '전체';
const cats = ['전체', '브이로그', '광고', '모션그래픽'];
const TAG_COLORS = { '브이로그': '#7ee0ff', '광고': '#ffc21a', '모션그래픽': '#5ff0d8' };
const tagColor = cat => TAG_COLORS[cat] || '#f4f2ec';

function renderWork() {
  $('filters').innerHTML = cats.map(c => {
    const n = c === '전체' ? projects.length : projects.filter(p => p.cat === c).length;
    return `<button class="chip${c === filter ? ' on' : ''}" data-cat="${c}">${c} <span class="n">${n}</span></button>`;
  }).join('');

  const shown = projects.map((p, i) => ({ p, i })).filter(({ p }) => filter === '전체' || p.cat === filter);

  $('work-grid').innerHTML = shown
    .map(({ p, i }) => `
      <article class="work-card" data-idx="${i}" tabindex="0">
        <div class="thumb" style="background:${p.color}">
          <div class="slot${p.src ? '' : ' empty on-light'}">${p.src ? slotHtml(p.src, p.ph, p.title) : esc(p.ph)}</div>
          <span class="cat" style="background:${tagColor(p.cat)}">${esc(p.cat)}</span>
          ${p.notice ? '<span class="spec-badge">가상 광고</span>' : ''}
          ${p.dur ? `<span class="dur">${p.dur}</span>` : ''}
        </div>
        <div class="meta">
          <div><div class="title">${esc(p.title)}</div><div class="client">${esc(p.client)}</div>${p.notice ? `<div class="spec-note">${esc(p.notice)}</div>` : ''}</div>
          <span class="arrow">↗</span>
        </div>
      </article>`).join('');
}

$('filters').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]');
  if (b) { filter = b.dataset.cat; renderWork(); }
});
$('work-grid').addEventListener('click', e => {
  const c = e.target.closest('[data-idx]');
  if (c) openItem(projects[c.dataset.idx]);
});
$('work-grid').addEventListener('keydown', e => {
  const c = e.target.closest('[data-idx]');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openItem(projects[c.dataset.idx]); }
});
renderWork();

/* ---------- scroll reveal (animations.css .reveal / .is-in) ---------- */
// 움직임 줄이기 설정이면 아무것도 안 함. 처음부터 화면에 보이는 섹션은 건드리지 않음.
// IntersectionObserver가 기본, 스크롤·리사이즈 때 위치를 직접 확인하는 방식을 예비로 같이 둬서 섹션이 숨은 채로 남지 않게 함.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // 화면 아래쪽 12%를 지나 조금 들어왔을 때 등장 → 실제로 보면서 움직임을 느낄 수 있게
  const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.88 && r.bottom > 0; };
  const pending = new Set();
  // 블록마다 한 번만. 다 나타난 뒤(0.5초 + 차례 지연) 등장용 클래스를 지워서 원래 호버 효과(테두리 색 등)가 그대로 동작하게
  const show = el => {
    el.classList.add('is-in'); pending.delete(el); if (io) io.unobserve(el);
    const wait = 600 + (parseInt(el.style.getPropertyValue('--rd')) || 0);
    setTimeout(() => { el.classList.remove('reveal', 'is-in'); el.style.removeProperty('--rd'); }, wait);
  };
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(en => en.isIntersecting && show(en.target)), { threshold: 0, rootMargin: '0px 0px -12% 0px' })
    : null;
  // 섹션 통째가 아니라 안쪽 블록 단위로 — 스크롤하면서 보이는 순간마다 하나씩 올라옴.
  // 같은 줄(형제)끼리는 0.07초씩 차례로.
  const groups = [
    '#reel > *', '#work .work-head', '#work .work-card',
    '#about > *', '#skills > *', '#skills .tool-group', '.contact-copy', '.contact-link',
  ];
  const targets = [...new Set(groups.flatMap(sel => [...document.querySelectorAll(sel)]))]
    .filter(el => !(el.matches('#skills > .tool-groups'))); // 툴은 그룹 단위로 따로 처리
  targets.forEach(el => {
    if (inView(el)) return; // 처음부터 보이는 부분은 숨기지 않음
    const sibs = [...el.parentElement.children].filter(c => targets.includes(c));
    el.style.setProperty('--rd', Math.min(sibs.indexOf(el) % 3, 3) * 70 + 'ms');
    el.classList.add('reveal');
    pending.add(el);
    if (io) io.observe(el);
  });
  let ticking = false;
  const check = () => { ticking = false; pending.forEach(el => inView(el) && show(el)); };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
}

/* ---------- player modal ---------- */
const modal = $('modal');
let cur = null, playing = false, t = 0, secs = 0;

function paint() {
  const pct = secs ? (t / secs) * 100 + '%' : '0%';
  $('m-fill').style.width = pct;
  $('m-head').style.left = pct;
  $('m-tc').textContent = fmt(t);
  $('m-pp').textContent = playing ? '❚❚' : '▶';
  $('m-screen').classList.toggle('paused', !playing);
}

function openItem(item) {
  cur = item; playing = true; t = 0; secs = toSecs(item.dur);
  $('m-title').textContent = item.title;
  $('m-sub').textContent = `${item.client} · ${item.cat}`;
  $('m-dur').textContent = item.dur;
  $('m-notice').hidden = !item.notice;
  $('m-notice-text').textContent = item.notice || '';

  const reelUrl = REEL_URL.trim();
  const embed = item.youtube
    ? `https://www.youtube.com/embed/${encodeURIComponent(item.youtube)}?autoplay=1&rel=0&playsinline=1`
    : item.isReel && reelUrl;
  const media = $('m-media');
  if (embed) {
    media.className = 'slot';
    media.innerHTML = `<iframe src="${esc(embed)}" title="${esc(item.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
  } else if (item.src) {
    media.className = 'slot';
    media.innerHTML = slotHtml(item.src, item.ph, item.title);
  } else {
    media.className = 'slot empty';
    media.textContent = item.ph;
  }
  $('m-hit').hidden = !!embed;
  $('m-controls').hidden = !!embed;

  const hasInfo = !!(item.role || item.tools || item.period || item.point || item.youtube || item.credit);
  $('m-details').hidden = !hasInfo;
  if (hasInfo) {
    [['role', 'm-role'], ['tools', 'm-tools'], ['period', 'm-period']].forEach(([k, id]) => {
      $(id).textContent = item[k] || '';
      $(id).parentElement.hidden = !item[k];
    });
    $('m-point').textContent = item.point || '';
    $('m-point').parentElement.hidden = !item.point;
    $('m-credit').textContent = item.credit || '';
    $('m-credit').hidden = !item.credit;
    $('m-yt').hidden = !item.youtube;
    if (item.youtube) $('m-yt').href = 'https://youtu.be/' + encodeURIComponent(item.youtube);
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  paint();
  $('m-close').focus();
}

function closeModal() {
  modal.hidden = true;
  playing = false;
  cur = null;
  $('m-media').innerHTML = '';
  document.body.style.overflow = '';
}

const toggle = () => { playing = !playing; paint(); };

document.querySelectorAll('[data-open-reel]').forEach(el => el.addEventListener('click', () => openItem(reel)));
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
$('m-close').addEventListener('click', closeModal);
$('m-hit').addEventListener('click', toggle);
$('m-pp').addEventListener('click', toggle);
$('m-scrub').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * secs;
  paint();
});
document.addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === ' ' && e.target.tagName !== 'BUTTON') { e.preventDefault(); toggle(); }
});

setInterval(() => {
  if (!playing || !cur) return;
  t = t + 0.25 >= secs ? 0 : t + 0.25;
  paint();
}, 250);
