/* ============ 第 3 章　分數 ============
   節次：6-1 分數比大小、6-2 分數加減、6-3 分數應用、6-4 異分母加減進階
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：分數乘除法、約分的短除法、
     小數與分數互換（本章只做同分母化與加減應用）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#059669';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  // 標準 SVG 包裝：一定要用這個，圖才會自適應欄寬
  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  // 常用小工具：SVG 文字 / 圓角方塊
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || '#172033'}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"/>`;

  // 啟發式圖卡：上方「先猜」提問，下方「發現」在學生拖出規律後才解鎖
  const GUESS = (t) => `<div style="width:96%;margin:30px auto 8px;font-size:13.5px;font-weight:800;line-height:1.55;color:#5b21b6;background:#f4effe;border:1.5px dashed #c4b0f3;border-radius:10px;padding:7px 11px;text-align:left">🤔 先猜：${t}</div>`;
  const AHA = (t, on, hint) => on
    ? `<div style="width:96%;margin:8px auto 0;font-size:13.5px;font-weight:800;line-height:1.55;color:#047857;background:#e8f7ef;border:1.5px solid #9fd8bd;border-radius:10px;padding:7px 11px;text-align:left">💡 發現：${t}</div>`
    : `<div style="width:96%;margin:8px auto 0;font-size:13px;font-weight:700;line-height:1.55;color:#7c879b;background:#f3f5f9;border:1.5px dashed #dce3ee;border-radius:10px;padding:7px 11px;text-align:left">🔒 ${hint || '拖拖看，找到規律就會解鎖發現'}</div>`;
  // 圖卡骨架：先猜 → 圖 → 滑桿 → 發現
  const CARD = (q, ctrl) => GUESS(q) + `<div style="width:100%"><div id="fig"></div>${ctrl ? `<div class="ictrl">${ctrl}</div>` : ''}<div id="aha"></div></div>`;
  const CIRC = (x, y, r, fill, stroke) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke || '#1f2a37'}" stroke-width="1.5"/>`;

  // 易錯對照表（HTML，左右兩欄）
  function xo(rows) {
    // class 名（xo／xo-bad／xo-good／xo-h／xo-t）供 theme-dark.css 深色模式覆蓋行內色
    return `<div class="xo" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:9px">` +
      rows.map(r => `<div style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-bad" style="flex:1;background:#fdeef2;border:1.5px solid #f3c4d0;border-radius:12px;padding:8px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:3px">✗ 常見錯誤</div>
          <div class="xo-t" style="font-size:14px;color:#172033;line-height:1.6">${r[0]}</div></div>
        <div class="xo-good" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:8px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:3px">✓ 正確寫法</div>
          <div class="xo-t" style="font-size:14px;color:#172033;line-height:1.6">${r[1]}</div></div>
      </div>`).join('') + `</div>`;
  }


  // 6-4 數字：全部自編（不沿用原卷），已用 Python 驗算
  const P64 = {
    borrow: { A: [6, 3, 4], B: [2, 5, 6] },
    paren: { A: [5, 3, 4], C: [5, 6], E: [1, 4] },
    between: { lo: [2, 3], hi: [4, 5], N: 60 },
    unit: { T: [5, 6], A: [1, 2], C: [1, 12] },
    tele: { s: 4, e: 19 },
    op: { da: 3, db: 4, x: 30, y: 8, z: 4 },
    clock: { fast: [4, 1, 6], slow: [1, 3, 4] }
  };

  /* ======== 6-4 異分母加減進階：7 頁共用產生器（數字全部由 P64 決定）======== */
  // 分數小工具：約分、帶分數、TeX／純文字兩種寫法
  const GCD = (a, b) => (b ? GCD(b, a % b) : Math.abs(a));
  const LCM = (a, b) => a / GCD(a, b) * b;
  const RED64 = (n, d) => { const g = GCD(n, d); return [n / g, d / g]; };
  const MX = (w, n, d) => [w * d + n, d];                       // 帶分數 → 假分數
  const ADD = (p, q) => RED64(p[0] * q[1] + q[0] * p[1], p[1] * q[1]);
  const SUB = (p, q) => RED64(p[0] * q[1] - q[0] * p[1], p[1] * q[1]);
  const TF = (n, d) => {                                         // TeX：自動化成帶分數
    [n, d] = RED64(n, d);
    const w = Math.floor(n / d), r = n - w * d;
    if (r === 0) return `${w}`;
    return w ? `${w}\\frac{${r}}{${d}}` : `\\frac{${r}}{${d}}`;
  };
  const PF = (n, d) => {                                         // 純文字（標題、SVG）
    [n, d] = RED64(n, d);
    const w = Math.floor(n / d), r = n - w * d;
    if (r === 0) return `${w}`;
    return w ? `${w}又${r}/${d}` : `${r}/${d}`;
  };
  const TW = (w, n, d) => `${w}\\frac{${n}}{${d}}`;              // 不約分的帶分數 TeX（通分過程用）
  const GUESS64 = (t) => `<div style="width:96%;margin:26px auto 8px;font-size:13.5px;font-weight:800;line-height:1.55;color:#5b21b6;background:#f4effe;border:1.5px dashed #c4b0f3;border-radius:10px;padding:7px 11px;text-align:left">🤔 先猜：${t}</div>`;
  const AHA64 = (t, on, hint) => on
    ? `<div style="width:96%;margin:8px auto 0;font-size:13.5px;font-weight:800;line-height:1.55;color:#047857;background:#e8f7ef;border:1.5px solid #9fd8bd;border-radius:10px;padding:7px 11px;text-align:left">💡 發現：${t}</div>`
    : `<div style="width:96%;margin:8px auto 0;font-size:13px;font-weight:700;line-height:1.55;color:#7c879b;background:#f3f5f9;border:1.5px dashed #dce3ee;border-radius:10px;padding:7px 11px;text-align:left">🔒 ${hint}</div>`;
  const CARD64 = (q, ctrl) => GUESS64(q) + `<div style="width:100%"><div id="fig"></div><div class="ictrl">${ctrl}</div><div id="aha"></div></div>`;
  const S64 = '6-4', N64 = '異分母加減進階';

  function build64(P) {
    const out = [];

    /* ---------- 1. 帶分數相減要借 1（互動） ---------- */
    {
      const [w1, a1, b1] = P.borrow.A, [w2, a2, b2] = P.borrow.B;
      const L = LCM(b1, b2), n1 = a1 * L / b1, n2 = a2 * L / b2;
      const ans = SUB(MX(w1, a1, b1), MX(w2, a2, b2));
      out.push({
        sec: S64, secName: N64,
        title: `${PF(...MX(w1, a1, b1))}－${PF(...MX(w2, a2, b2))}：分數部分不夠減，先借 1`,
        points: [
          `先通分：\\(${TW(w1, a1, b1)}=${TW(w1, n1, L)}\\)，\\(${TW(w2, a2, b2)}=${TW(w2, n2, L)}\\)。`,
          `分數部分 \\(\\frac{${n1}}{${L}}<\\frac{${n2}}{${L}}\\) 不夠減，<span class="k">從整數借 1</span>：1 ＝ \\(\\frac{${L}}{${L}}\\)。`,
          `\\(${TW(w1, n1, L)}=${TW(w1 - 1, n1 + L, L)}\\)，再整數減整數、分數減分數。`
        ],
        formula: { label: '借 1', tex: `${TW(w1 - 1, n1 + L, L)}-${TW(w2, n2, L)}=${TF(...ans)}` },
        visual: (h) => {
          h.innerHTML = CARD64(`分數部分 ${n1}/${L} 比 ${n2}/${L} 少，可以直接「反過來減」嗎？拖拖看「借 1」。`,
            `<label>從整數借 1：<span class="ival" id="bv">不借</span></label>
            <input type="range" id="bs" min="0" max="1" step="1" value="0">`);
          let seen = false;
          const draw = () => {
            const b = +h.querySelector('#bs').value;
            if (b) seen = true;
            h.querySelector('#bv').textContent = b ? '借了' : '不借';
            const cw = 360 / L, X = 40;
            const bar = (y, cells, col, fill, txt) => {
              let s = `<rect x="${X}" y="${y}" width="${cw * cells}" height="22" fill="${fill}"/>`;
              for (let k = 1; k < L; k++) s += `<line x1="${X + k * cw}" y1="${y}" x2="${X + k * cw}" y2="${y + 22}" stroke="${col}" stroke-width="0.6" opacity="0.6"/>`;
              s += `<rect x="${X}" y="${y}" width="360" height="22" fill="none" stroke="${col}" stroke-width="1.8"/>`;
              return s + TX(X, y - 5, txt, { fs: 12.5, c: col });
            };
            let s = '';
            if (b) s += bar(26, L, BLU, '#bfdbfe', `借來的 1 ＝ ${L}/${L}（整數 ${w1} 變 ${w1 - 1}）`);
            s += bar(80, n1, GRN, '#bbf7d0', `被減數的分數部分 ${n1}/${L}`);
            s += bar(134, n2, RED, '#fecdd3', `減數的分數部分 ${n2}/${L}`);
            const msg = b
              ? `${L + n1}/${L} － ${n2}/${L} ＝ ${L + n1 - n2}/${L}；整數 ${w1 - 1} － ${w2} ＝ ${w1 - 1 - w2}`
              : `${n1} 格不夠拿走 ${n2} 格！`;
            s += TX(220, 186, msg, { fs: 14, c: b ? GRN : RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
            h.querySelector('#aha').innerHTML = AHA64(`借 1 就是把 1 個整數拆成 ${L}/${L}，分數部分變成 ${L + n1}/${L} 就夠減了。答案 ${PF(...ans)}。反過來減（${n2}－${n1}）是錯的。`,
              seen, '把滑桿拉到「借了」');
          };
          h.querySelector('#bs').oninput = draw; draw();
        },
        caption: '借 1＝拆成一整條：整數少 1，分數多一個分母。',
        example: {
          q: `計算 \\(${TW(w1, a1, b1)}-${TW(w2, a2, b2)}\\)。`,
          steps: [`通分：\\(${TW(w1, n1, L)}-${TW(w2, n2, L)}\\)。`, `借 1：\\(${TW(w1 - 1, n1 + L, L)}-${TW(w2, n2, L)}=${TW(w1 - 1 - w2, n1 + L - n2, L)}\\)。`],
          ans: `\\(${TF(...ans)}\\)`
        }
      });
    }

    /* ---------- 2. 去括號要變號（互動：分步驟） ---------- */
    {
      const [W, a, b] = P.paren.A, [c, d] = P.paren.C, [e, f] = P.paren.E;
      const A = MX(W, a, b), Cc = [c, d], E = [e, f];
      const AE = ADD(A, E), ans = SUB(AE, Cc);
      out.push({
        sec: S64, secName: N64,
        title: `減掉括號：－(${c}/${d}－${e}/${f}) 拆開變成 －${c}/${d}＋${e}/${f}`,
        points: [
          '括號前面是減號，拆掉括號時，括號裡的<span class="k">減號要變加號</span>。',
          `\\(${TW(W, a, b)}+\\frac{${e}}{${f}}\\) 剛好湊成整數 \\(${TF(...AE)}\\)，再減 \\(\\frac{${c}}{${d}}\\) 最快。`,
          '連續減兩個數，也可以先把兩數加起來再一次減掉。'
        ],
        formula: { label: '去括號', tex: `a-(b-c)=a-b+c` },
        visual: (h) => {
          h.innerHTML = CARD64(`「減掉 (${c}/${d}－${e}/${f})」和「減掉 ${c}/${d}」比，哪一個減得比較多？`,
            `<label>步驟 <span class="ival" id="sv">1</span> / 3</label>
            <input type="range" id="ss" min="1" max="3" step="1" value="1">`);
          let seen = false;
          const draw = () => {
            const st = +h.querySelector('#ss').value;
            if (st === 3) seen = true;
            h.querySelector('#sv').textContent = st;
            const S = A[0] / A[1], cv = c / d, ev = e / f, X0 = 400, U = 300;
            const x = (v) => X0 - (S - v) * U;
            let s = `<line x1="20" y1="120" x2="425" y2="120" stroke="#94a3b8" stroke-width="2"/>`;
            s += `<circle cx="${x(S)}" cy="120" r="5" fill="${BLU}"/>` + TX(x(S), 146, PF(...A), { fs: 13, c: BLU, anchor: 'middle' });
            const arrow = (x1, x2, y, col, txt) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${col}" stroke-width="3"/>` +
              `<polygon points="${x2},${y} ${x2 + (x2 < x1 ? 9 : -9)},${y - 6} ${x2 + (x2 < x1 ? 9 : -9)},${y + 6}" fill="${col}"/>` + TX((x1 + x2) / 2, y - 8, txt, { fs: 13, c: col, anchor: 'middle' });
            if (st >= 2) s += arrow(x(S), x(S - cv), 70, RED, `先減 ${c}/${d}（減太多了）`);
            if (st >= 3) s += arrow(x(S - cv), x(S - cv + ev), 100, GRN, `補回 ${e}/${f}`);
            if (st >= 3) s += `<circle cx="${x(S - cv + ev)}" cy="120" r="6" fill="${GRN}"/>` + TX(x(S - cv + ev), 168, '答案 ' + PF(...ans), { fs: 14, c: GRN, anchor: 'middle' });
            if (st === 1) s += TX(220, 60, `原式：${PF(...A)} －（${c}/${d} － ${e}/${f}）`, { fs: 15, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 185', s);
            h.querySelector('#aha').innerHTML = AHA64(`括號裡是「${c}/${d} 少掉 ${e}/${f}」，所以只該減這麼少；先減整個 ${c}/${d} 就多減了 ${e}/${f}，要<b>加回來</b>。`,
              seen, '拉到第 3 步');
          };
          h.querySelector('#ss').oninput = draw; draw();
        },
        caption: '減掉一個差＝先減大的，再把多減的加回來。',
        example: {
          q: `計算 \\(${TW(W, a, b)}-\\left(\\frac{${c}}{${d}}-\\frac{${e}}{${f}}\\right)\\)。`,
          steps: [`去括號：\\(${TW(W, a, b)}-\\frac{${c}}{${d}}+\\frac{${e}}{${f}}\\)。`, `先湊整：\\(${TW(W, a, b)}+\\frac{${e}}{${f}}=${TF(...AE)}\\)，\\(${TF(...AE)}-\\frac{${c}}{${d}}=${TF(...ans)}\\)。`],
          ans: `\\(${TF(...ans)}\\)`
        }
      });
    }

    /* ---------- 3. 兩個分數之間有幾個（互動） ---------- */
    {
      const [p, q] = P.between.lo, [r, s0] = P.between.hi, N = P.between.N;
      const lo = p * N / q, hi = r * N / s0;
      out.push({
        sec: S64, secName: N64,
        title: `比 ${p}/${q} 大、比 ${r}/${s0} 小，分母 ${N} 的分數有 ${hi - lo - 1} 個`,
        points: [
          `兩個分數都通分成分母 ${N}：\\(\\frac{${p}}{${q}}=\\frac{${lo}}{${N}}\\)，\\(\\frac{${r}}{${s0}}=\\frac{${hi}}{${N}}\\)。`,
          `分子要在 ${lo} 和 ${hi} 之間，<span class="k">不含兩端</span>：${lo + 1}、${lo + 2}、…、${hi - 1}。`,
          `個數 ＝ ${hi - 1} － ${lo + 1} ＋ 1 ＝ ${hi - lo - 1}。`
        ],
        formula: { label: '數格子', tex: `\\frac{${lo}}{${N}}<\\frac{k}{${N}}<\\frac{${hi}}{${N}}` },
        visual: (h) => {
          h.innerHTML = CARD64(`分母換成 ${2 * N}，中間的分數會變多還是一樣多？`,
            `<label>分母 ＝ <span class="ival" id="nv">${N}</span></label>
            <input type="range" id="ns" min="1" max="3" step="1" value="1">`);
          let seen = false;
          const draw = () => {
            const m = +h.querySelector('#ns').value, D = N * m;
            if (m > 1) seen = true;
            h.querySelector('#nv').textContent = D;
            const L0 = lo * m, H0 = hi * m, cnt = H0 - L0 - 1, X = 40, Wd = 360, step = Wd / (H0 - L0);
            let s = `<line x1="${X}" y1="100" x2="${X + Wd}" y2="100" stroke="#94a3b8" stroke-width="2"/>`;
            for (let k = L0; k <= H0; k++) {
              const xx = X + (k - L0) * step, end = (k === L0 || k === H0);
              s += `<line x1="${xx}" y1="92" x2="${xx}" y2="108" stroke="${end ? RED : GRN}" stroke-width="${end ? 2.5 : 1.5}"/>`;
              if (!end) s += `<circle cx="${xx}" cy="100" r="${Math.min(4, step / 3)}" fill="${GRN}"/>`;
            }
            s += `<circle cx="${X}" cy="100" r="6" fill="#fff" stroke="${RED}" stroke-width="2.5"/><circle cx="${X + Wd}" cy="100" r="6" fill="#fff" stroke="${RED}" stroke-width="2.5"/>`;
            s += TX(X - 14, 135, `${p}/${q}＝${L0}/${D}`, { fs: 13, c: RED, anchor: 'start' });
            s += TX(X + Wd + 14, 135, `${r}/${s0}＝${H0}/${D}`, { fs: 13, c: RED, anchor: 'end' });
            s += TX(220, 60, `中間的綠點：分子 ${L0 + 1}～${H0 - 1}，共 ${cnt} 個`, { fs: 15, c: GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 160', s);
            h.querySelector('#aha').innerHTML = AHA64(`分母變大，格子切得更細，中間的分數就變多。題目指定分母 ${N}，所以答案是 ${hi - lo - 1} 個；兩端的紅圈不算（「比…大、比…小」不含等於）。`,
              seen, '把分母拉大看看');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '先通分成指定的分母，再數兩端之間的分子（不含兩端）。',
        example: {
          q: `比 \\(\\frac{${p}}{${q}}\\) 大、比 \\(\\frac{${r}}{${s0}}\\) 小，分母是 ${N} 的分數有幾個？`,
          steps: [`\\(\\frac{${p}}{${q}}=\\frac{${lo}}{${N}}\\)，\\(\\frac{${r}}{${s0}}=\\frac{${hi}}{${N}}\\)。`, `分子 ${lo + 1}～${hi - 1}：\\(${hi - 1}-${lo + 1}+1=${hi - lo - 1}\\)。`],
          ans: `${hi - lo - 1} 個`
        }
      });
    }

    /* ---------- 4. 求 1/甲：扣掉已知的部分（互動） ---------- */
    {
      const Tt = P.unit.T, Aa = P.unit.A, Cc = P.unit.C;
      const L = LCM(LCM(Tt[1], Aa[1]), Cc[1]);
      const nT = Tt[0] * L / Tt[1], nA = Aa[0] * L / Aa[1], nC = Cc[0] * L / Cc[1];
      const rest = RED64(nT - nA - nC, L), jia = rest[1] / rest[0];
      out.push({
        sec: S64, secName: N64,
        title: `${Tt[0]}/${Tt[1]}＝${Aa[0]}/${Aa[1]}＋1/甲＋${Cc[0]}/${Cc[1]}：扣掉已知的，剩下的就是 1/甲`,
        points: [
          `全部 ＝ 三塊加起來，所以 \\(\\frac{1}{甲}=\\frac{${Tt[0]}}{${Tt[1]}}-\\frac{${Aa[0]}}{${Aa[1]}}-\\frac{${Cc[0]}}{${Cc[1]}}\\)。`,
          `通分成分母 ${L}：\\(\\frac{${nT}}{${L}}-\\frac{${nA}}{${L}}-\\frac{${nC}}{${L}}=\\frac{${nT - nA - nC}}{${L}}=\\frac{${rest[0]}}{${rest[1]}}\\)。`,
          `\\(\\frac{1}{甲}=\\frac{1}{${jia}}\\)，所以 <span class="k">甲 ＝ ${jia}</span>（分子是 1 時，甲就是分母）。`
        ],
        formula: { label: '扣掉已知', tex: `\\frac{1}{甲}=\\frac{${nT}-${nA}-${nC}}{${L}}=\\frac{${rest[0]}}{${rest[1]}}` },
        visual: (h) => {
          h.innerHTML = CARD64(`一條 ${Tt[0]}/${Tt[1]} 長的彩帶剪成三段，已知兩段，第三段是幾分之一？`,
            `<label>扣掉第 <span class="ival" id="kv">0</span> 段已知</label>
            <input type="range" id="ks" min="0" max="2" step="1" value="0">`);
          let seen = false;
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            if (k === 2) seen = true;
            h.querySelector('#kv').textContent = k;
            const cw = 360 / L, X = 40, y = 70;
            let s = `<rect x="${X}" y="${y}" width="360" height="30" fill="none" stroke="#94a3b8" stroke-width="1.5"/>`;
            for (let i = 0; i < nT; i++) {
              let fill = '#bbf7d0';
              if (k >= 1 && i < nA) fill = '#e2e8f0';
              if (k >= 2 && i >= nT - nC) fill = '#e2e8f0';
              s += `<rect x="${X + i * cw}" y="${y}" width="${cw}" height="30" fill="${fill}" stroke="#fff" stroke-width="0.8"/>`;
            }
            s += TX(X, y - 10, `塗色 ${nT}/${L} ＝ ${Tt[0]}/${Tt[1]}（全部）`, { fs: 13, c: GRN });
            if (k >= 1) s += TX(X + nA * cw / 2, y + 52, `${Aa[0]}/${Aa[1]}＝${nA}格`, { fs: 12.5, c: '#64748b', anchor: 'middle' });
            if (k >= 2) s += TX(X + (nT - nC / 2) * cw, y + 52, `${Cc[0]}/${Cc[1]}`, { fs: 12.5, c: '#64748b', anchor: 'middle' });
            if (k >= 2) s += TX(220, 160, `剩 ${nT - nA - nC} 格 ＝ ${nT - nA - nC}/${L} ＝ 1/${jia} → 甲 ＝ ${jia}`, { fs: 15, c: GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 175', s);
            h.querySelector('#aha').innerHTML = AHA64(`剩下的 ${nT - nA - nC}/${L} 約分成 1/${jia}，所以甲 ＝ ${jia}。「${jia} 的倒數是 1/${jia}」：倒數就是分子分母上下對調。`,
              seen, '把兩段已知都扣掉');
          };
          h.querySelector('#ks').oninput = draw; draw();
        },
        caption: '全部－已知的兩段＝未知的那段，約分成 1/□ 就讀出甲。',
        example: {
          q: `已知 \\(\\frac{${Tt[0]}}{${Tt[1]}}=\\frac{${Aa[0]}}{${Aa[1]}}+\\frac{1}{甲}+\\frac{${Cc[0]}}{${Cc[1]}}\\)，甲是多少？`,
          steps: [`\\(\\frac{1}{甲}=\\frac{${nT}}{${L}}-\\frac{${nA}}{${L}}-\\frac{${nC}}{${L}}=\\frac{${nT - nA - nC}}{${L}}\\)。`, `\\(\\frac{${nT - nA - nC}}{${L}}=\\frac{1}{${jia}}\\)，甲 ＝ ${jia}。`],
          ans: `${jia}`
        }
      });
    }

    /* ---------- 5. 拆項相消（互動，進階） ---------- */
    {
      const a0 = P.tele.s, e0 = P.tele.e;
      const fin = SUB([1, a0], [1, e0 + 1]);
      out.push({
        sec: S64, secName: N64,
        title: `進階：1/(${a0}×${a0 + 1})＋…＋1/(${e0}×${e0 + 1}) 拆開後中間全部消掉`,
        points: [
          `相鄰兩數相乘的分數可以拆：\\(\\frac{1}{${a0}\\times${a0 + 1}}=\\frac{1}{${a0}}-\\frac{1}{${a0 + 1}}\\)（通分驗算：\\(\\frac{${a0 + 1}-${a0}}{${a0 * (a0 + 1)}}\\)）。`,
          '每一項都拆開後，前一項的「減」和後一項的「加」互相抵消。',
          `最後只剩頭尾：\\(\\frac{1}{${a0}}-\\frac{1}{${e0 + 1}}=${TF(...fin)}\\)。`
        ],
        formula: { label: '拆項', tex: `\\frac{1}{n\\times(n+1)}=\\frac{1}{n}-\\frac{1}{n+1}` },
        visual: (h) => {
          h.innerHTML = CARD64(`加了這麼多項，算到最後會剩下幾個分數？`,
            `<label>加到 1/(m×(m+1))，m ＝ <span class="ival" id="mv">${a0 + 2}</span></label>
            <input type="range" id="ms" min="${a0}" max="${e0}" step="1" value="${a0 + 2}">`);
          let seen = false;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            if (m === e0) seen = true;
            h.querySelector('#mv').textContent = m;
            const res = SUB([1, a0], [1, m + 1]);
            let s = '', y = 40;
            const show = Math.min(m - a0 + 1, 3);
            for (let i = 0; i < show; i++) {
              const n = a0 + i;
              s += TX(40, y, `1/(${n}×${n + 1})`, { fs: 13.5, c: '#172033' });
              s += TX(150, y, '＝', { fs: 13.5, c: '#172033' });
              s += TX(175, y, `1/${n}`, { fs: 13.5, c: i === 0 ? BLU : '#94a3b8' });
              s += TX(225, y, `－ 1/${n + 1}`, { fs: 13.5, c: (m === n) ? RED : '#94a3b8' });
              if (i > 0) s += `<line x1="172" y1="${y - 5}" x2="210" y2="${y - 5}" stroke="${RED}" stroke-width="2"/>`;
              if (n < m) s += `<line x1="238" y1="${y - 5}" x2="290" y2="${y - 5}" stroke="${RED}" stroke-width="2"/>`;
              y += 30;
            }
            if (m - a0 + 1 > 3) {
              s += TX(175, y, '⋮（中間全部互相抵消）', { fs: 13, c: '#94a3b8' }); y += 30;
              s += TX(40, y, `1/(${m}×${m + 1})`, { fs: 13.5, c: '#172033' });
              s += TX(150, y, '＝', { fs: 13.5, c: '#172033' });
              s += TX(175, y, `1/${m}`, { fs: 13.5, c: '#94a3b8' });
              s += `<line x1="172" y1="${y - 5}" x2="210" y2="${y - 5}" stroke="${RED}" stroke-width="2"/>`;
              s += TX(225, y, `－ 1/${m + 1}`, { fs: 13.5, c: RED });
              y += 30;
            }
            s += TX(220, y + 12, `總和 ＝ 1/${a0} － 1/${m + 1} ＝ ${PF(...res)}`, { fs: 16, c: GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg(`0 0 440 ${y + 30}`, s);
            h.querySelector('#aha').innerHTML = AHA64(`不管加幾項，都只剩<b>藍色的頭</b>和<b>紅色的尾</b>。加到 1/(${e0}×${e0 + 1}) 時：1/${a0} － 1/${e0 + 1} ＝ ${PF(...fin)}。`,
              seen, `把 m 拉到最後一項 ${e0}`);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '拆開、抵消、剩頭尾：一長串加法變成一次減法。',
        example: {
          q: `\\(\\frac{1}{${a0}\\times${a0 + 1}}+\\frac{1}{${a0 + 1}\\times${a0 + 2}}+\\cdots+\\frac{1}{${e0}\\times${e0 + 1}}=?\\)`,
          steps: [`拆開：\\(\\left(\\frac{1}{${a0}}-\\frac{1}{${a0 + 1}}\\right)+\\left(\\frac{1}{${a0 + 1}}-\\frac{1}{${a0 + 2}}\\right)+\\cdots\\)`, `剩頭尾：\\(\\frac{1}{${a0}}-\\frac{1}{${e0 + 1}}=${TF(...fin)}\\)。`],
          ans: `\\(${TF(...fin)}\\)`
        }
      });
    }

    /* ---------- 6. 自訂符號：由內而外照規則代 ---------- */
    {
      const { da, db, x, y, z } = P.op;
      const inner = SUB([x, da], [y, db]), innerV = inner[0] / inner[1];
      const outer = SUB([innerV * 1, da], [z, db]);
      out.push({
        sec: S64, secName: N64,
        title: `自訂符號 甲×乙＝甲/${da}－乙/${db}：先算括號，再把結果當新的甲`,
        points: [
          '題目自己定義的「×」不是乘法，<span class="k">只照規則代數字</span>。',
          `先算括號：\\(${x}\\times${y}=\\frac{${x}}{${da}}-\\frac{${y}}{${db}}=${TF(...inner)}\\)。`,
          `括號的結果 ${TF(...inner)} 當新的甲：\\(${TF(...inner)}\\times${z}=\\frac{${innerV}}{${da}}-\\frac{${z}}{${db}}=${TF(...outer)}\\)。`
        ],
        formula: { label: '規則', tex: `甲\\times乙=\\frac{甲}{${da}}-\\frac{乙}{${db}}` },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '① 括號', tex: `${x}\\times${y}=\\frac{${x}}{${da}}-\\frac{${y}}{${db}}=${TF(...inner)}`, color: BLU, fill: '#eef4ff', border: '#c7d7fb', size: 18 },
            { label: '② 外層', tex: `${TF(...inner)}\\times${z}=\\frac{${innerV}}{${da}}-\\frac{${z}}{${db}}=${TF(...outer)}`, color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18 }
          ]);
        },
        caption: '甲放在第一格、乙放在第二格，位置不能交換。',
        example: {
          q: `假設 甲×乙 ＝ \\(\\frac{甲}{${da}}-\\frac{乙}{${db}}\\)，求 \\((${x}\\times${y})\\times${z}\\)。`,
          steps: [`\\(${x}\\times${y}=${TF(...inner)}\\)。`, `\\(${TF(...inner)}\\times${z}=\\frac{${innerV}}{${da}}-\\frac{${z}}{${db}}=${TF(...outer)}\\)。`],
          ans: `\\(${TF(...outer)}\\)`
        }
      });
    }

    /* ---------- 7. 易錯對照 ---------- */
    {
      const [w1, a1, b1] = P.borrow.A, [w2, a2, b2] = P.borrow.B;
      const L = LCM(b1, b2), n1 = a1 * L / b1, n2 = a2 * L / b2;
      const [W, a, b] = P.paren.A, [c, d] = P.paren.C, [e, f] = P.paren.E;
      const [fw, fa, fb] = P.clock.fast, [sw, sa, sb] = P.clock.slow;
      const gap = ADD(MX(fw, fa, fb), MX(sw, sa, sb));
      const [p, q] = P.between.lo, [r, s0] = P.between.hi, N = P.between.N;
      const lo = p * N / q, hi = r * N / s0;
      out.push({
        sec: S64, secName: N64,
        title: '進階四個坑：反過來減、去括號沒變號、快慢相減、數到兩端',
        points: [
          '帶分數相減，分數部分不夠減要<span class="k">借 1</span>，不能反過來減。',
          '括號前是減號，拆括號後裡面的減號要變加號。',
          '一個快、一個慢，兩錶差距是<b>加起來</b>；「比…大、比…小」不含兩端。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            [`${w1}又${n1}/${L}－${w2}又${n2}/${L}：分數部分寫 ${n2 - n1}/${L}`, `借 1：${w1 - 1}又${L + n1}/${L}－${w2}又${n2}/${L}＝${w1 - 1 - w2}又${L + n1 - n2}/${L}`],
            [`${W}又${a}/${b}－(${c}/${d}－${e}/${f}) 寫成 －${c}/${d}－${e}/${f}`, `變號：－${c}/${d}＋${e}/${f}`],
            [`一天快 ${fw}又${fa}/${fb} 秒、慢 ${sw}又${sa}/${sb} 秒，相差用減的`, `一快一慢要相加：${PF(...gap)} 秒`],
            [`分子從 ${lo} 數到 ${hi}`, `不含兩端：${lo + 1}～${hi - 1}，共 ${hi - lo - 1} 個`]
          ]);
        },
        caption: '借 1、變號、看方向、去兩端：寫完答案再檢查一次。',
        example: {
          q: `甲錶每天快 \\(${TW(fw, fa, fb)}\\) 秒，乙錶每天慢 \\(${TW(sw, sa, sb)}\\) 秒，對準後一天相差幾秒？`,
          steps: ['一快一慢，方向相反，差距要相加。', `\\(${TW(fw, fa, fb)}+${TW(sw, sa, sb)}=${TF(...gap)}\\)。`],
          ans: `\\(${TF(...gap)}\\) 秒`
        }
      });
    }
    return out;
  }

  window.DECK.push({
    ch: 3,
    title: '分數',
    color: C,
    sections: ['6-1 分數比大小', '6-2 分數加減', '6-3 分數應用', '6-4 異分母加減進階'],
    slides: [

      /* ---------- 通分比大小 ---------- */
      {
        sec: '6-1', secName: '分數比大小',
        title: '分母不同先通分：7/3 和 9/4 通成 28/12 和 27/12',
        points: [
          '分母不同不能直接比，先找<span class="k">公分母</span>通分。',
          '\\(7/3＝28/12\\)，\\(9/4＝27/12\\)，28＞27。',
          '所以紅色緞帶（7/3 公尺）比藍色長。'
        ],
        formula: { label: '通分', tex: '\\frac{7}{3}=\\frac{28}{12}\\;,\\;\\frac{9}{4}=\\frac{27}{12}' },
        visual: (h) => {
          h.innerHTML = CARD('紅緞帶 7/3 公尺、藍緞帶 9/4 公尺，差一點點看不出來。每公尺要切成<b>幾等份</b>，兩條才都能數成「整格」來比？',
            `<label>每公尺切 <span class="ival" id="dv">3</span> 等份</label>
            <input type="range" id="ds" min="0" max="4" step="1" value="0">`);
          const DEN = [3, 4, 6, 8, 12], U = 110, X0 = 30;
          let hit12 = false;
          const bar = (y, len, col, fill, den) => {
            let s = `<rect x="${X0}" y="${y}" width="${len * U}" height="30" rx="4" fill="${fill}" stroke="${col}" stroke-width="2"/>`;
            const cells = len * den, whole = Math.abs(cells - Math.round(cells)) < 1e-9;
            for (let k = 1; k < cells - 1e-9; k++) s += `<line x1="${X0 + k * U / den}" y1="${y}" x2="${X0 + k * U / den}" y2="${y + 30}" stroke="${col}" stroke-width="1"/>`;
            if (!whole) {
              const xs = X0 + Math.floor(cells) * U / den;
              s += `<rect x="${xs}" y="${y}" width="${X0 + len * U - xs}" height="30" fill="url(#hatch)" stroke="none"/>`;
            }
            return [s, cells, whole];
          };
          const draw = () => {
            const den = DEN[+h.querySelector('#ds').value];
            h.querySelector('#dv').textContent = den;
            if (den === 12) hit12 = true;
            let s = `<defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#fff7ed"/><line x1="0" y1="0" x2="0" y2="6" stroke="${AMB}" stroke-width="2.5"/></pattern></defs>`;
            const [r, rc, rw] = bar(40, 7 / 3, RED, '#fecdd3', den);
            const [b, bc, bw] = bar(110, 9 / 4, BLU, '#bfdbfe', den);
            s += r + b;
            s += TX(X0, 32, '紅 7/3 公尺：' + (rw ? Math.round(rc) + ' 格' : Math.floor(rc) + ' 格又一小段'), { fs: 13, c: RED });
            s += TX(X0, 102, '藍 9/4 公尺：' + (bw ? Math.round(bc) + ' 格' : Math.floor(bc) + ' 格又一小段'), { fs: 13, c: BLU });
            for (let m = 0; m <= 2; m++) {
              s += `<line x1="${X0 + m * U}" y1="148" x2="${X0 + m * U}" y2="158" stroke="#657187" stroke-width="2"/>`;
              s += TX(X0 + m * U, 174, m + ' 公尺', { fs: 11, c: '#657187', anchor: 'middle' });
            }
            s += TX(220, 200, rw && bw ? '兩條都是整格：' + Math.round(rc) + ' 格 ＞ ' + Math.round(bc) + ' 格，紅色長' : '有一條數不成整格（斜線是零碎的一小段）',
              { fs: 14, c: rw && bw ? GRN : AMB, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 212', s);
            h.querySelector('#aha').innerHTML = AHA('切 3 份紅色剛好、藍色零碎；切 4 份反過來。<b>切 12 份兩條都剛好</b>，因為 12 同時是 3 和 4 的倍數。這就是「通分」：找兩個分母的公倍數當新分母。',
              hit12, '換換看每公尺切幾份，找出兩條都剛好的切法');
          };
          h.querySelector('#ds').oninput = draw; draw();
        },
        caption: '切成一樣細（分母 12）再數格子，28 格贏 27 格。',
        example: {
          q: '比較 \\(\\frac{7}{3}\\) 和 \\(\\frac{9}{4}\\) 的大小。',
          steps: ['通分：\\(\\frac{7}{3}=\\frac{28}{12}\\)，\\(\\frac{9}{4}=\\frac{27}{12}\\)。', '\\(28>27\\)，所以 \\(\\frac{7}{3}\\) 大。'],
          ans: '\\(\\frac{7}{3}\\) 大（紅色緞帶長）'
        }
      },

      /* ---------- 帶分數化假分數（互動） ---------- */
      {
        sec: '6-1', secName: '分數比大小',
        title: '帶分數先化成假分數再比：1-2/5 就是 7/5',
        points: [
          '帶分數不能直接比：整數部分先乘分母再加分子。',
          '\\(1\\)-\\(2/5＝(5＋2)/5＝7/5\\)，再和 3/2 通分。',
          '拖滑桿換整數部分，看何時會追過 3/2。'
        ],
        formula: { label: '化假', tex: '1\\frac{2}{5}=\\frac{7}{5}=\\frac{14}{10}<\\frac{15}{10}=\\frac{3}{2}' },
        visual: (h) => {
          h.innerHTML = CARD('1-2/5 和 3/2 的整數部分<b>都是 1</b>，那誰比較大？只看整數夠不夠？',
            `<label>整數部分 w ＝ <span class="ival" id="wv">1</span></label>
            <input type="range" id="ws" min="1" max="2" step="1" value="1">
            <label style="margin-left:10px">畫 1/10 格線 <input type="checkbox" id="gk"></label>`);
          const U = 125, X0 = 30;
          let gridOn = false;
          const draw = () => {
            const w = +h.querySelector('#ws').value, gk = h.querySelector('#gk').checked;
            h.querySelector('#wv').textContent = w;
            if (gk) gridOn = true;
            const num = w * 5 + 2, v10 = num * 2, red = w + 0.4;
            let s = '';
            s += `<rect x="${X0}" y="40" width="${red * U}" height="28" rx="4" fill="#fecdd3" stroke="${RED}" stroke-width="2"/>`;
            s += `<rect x="${X0}" y="104" width="${1.5 * U}" height="28" rx="4" fill="#bfdbfe" stroke="${BLU}" stroke-width="2"/>`;
            s += TX(X0, 32, '紅 ' + w + '-2/5 ＝ ' + num + '/5' + (gk ? ' ＝ ' + v10 + '/10' : ''), { fs: 13, c: RED });
            s += TX(X0, 96, '藍 3/2' + (gk ? ' ＝ 15/10' : ''), { fs: 13, c: BLU });
            if (gk) for (let k = 1; k < 30; k++) {
              const x = X0 + k * U / 10;
              if (k / 10 < red) s += `<line x1="${x}" y1="40" x2="${x}" y2="68" stroke="${RED}" stroke-width="1"/>`;
              if (k / 10 < 1.5) s += `<line x1="${x}" y1="104" x2="${x}" y2="132" stroke="${BLU}" stroke-width="1"/>`;
            }
            s += SV.seg(X0, 160, X0 + 3 * U, 160, '#94a3b8', 2);
            for (let k = 0; k <= 30; k++) {
              const x = X0 + k * U / 10, big = k % 10 === 0;
              s += `<line x1="${x}" y1="${big ? 152 : 156}" x2="${x}" y2="${big ? 168 : 164}" stroke="#94a3b8" stroke-width="${big ? 2 : 1}"/>`;
              if (big) s += TX(x, 184, '' + k / 10, { fs: 12, c: '#657187', anchor: 'middle' });
            }
            s += `<line x1="${X0 + red * U}" y1="68" x2="${X0 + red * U}" y2="160" stroke="${RED}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
            s += `<line x1="${X0 + 1.5 * U}" y1="132" x2="${X0 + 1.5 * U}" y2="160" stroke="${BLU}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
            s += TX(220, 208, gk ? v10 + ' 格 ' + (v10 > 15 ? '＞' : '＜') + ' 15 格 → ' + (v10 > 15 ? '紅色大' : '藍色 3/2 大') : '勾選格線，數數看各有幾格', { fs: 14, c: gk ? (v10 > 15 ? RED : BLU) : '#657187', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 220', s);
            h.querySelector('#aha').innerHTML = AHA('整數一樣時，要比「多出來的那一段」：2/5＝4/10，1/2＝5/10，藍色多 1 格。<b>化成假分數再通分</b>，兩條就能一格一格比。',
              gridOn, '勾選「畫 1/10 格線」');
          };
          h.querySelector('#gk').onchange = draw;
          h.querySelector('#ws').oninput = draw; draw();
        },
        caption: 'w＝1 時 14/10＜15/10；w＝2 時 24/10 反超。',
        example: {
          q: '比較 \\(\\frac{3}{2}\\) 和 \\(1\\frac{2}{5}\\)。',
          steps: ['\\(1\\frac{2}{5}=\\frac{7}{5}=\\frac{14}{10}\\)。', '\\(\\frac{3}{2}=\\frac{15}{10}\\)，\\(15>14\\)。'],
          ans: '\\(\\frac{3}{2}\\) 大'
        }
      },

      /* ---------- 先約分再加減 ---------- */
      {
        sec: '6-2', secName: '分數加減',
        title: '先約分再算：9/12＋15/20 就是 3/4＋3/4',
        points: [
          '兩個分數都能約分時，<b>先約再加</b>數字最小。',
          '\\(9/12＝3/4\\)，\\(15/20＝3/4\\)，和＝6/4＝3/2。',
          '同理 \\(24/9－14/21＝8/3－2/3＝2\\)。'
        ],
        formula: { label: '先約分', tex: '\\frac{9}{12}+\\frac{15}{20}=\\frac{3}{4}+\\frac{3}{4}=\\frac{3}{2}' },
        visual: (h) => {
          h.innerHTML = CARD('9/12 和 15/20 長得不一樣，塗色的部分<b>會不會一樣多</b>？把小格子「幾格併成一格」看看。',
            `<label>9/12 每 <span class="ival" id="av">1</span> 格併一格</label>
            <input type="range" id="as" min="1" max="4" step="1" value="1">
            <label style="margin-left:10px">15/20 每 <span class="ival" id="bv">1</span> 格併一格</label>
            <input type="range" id="bs" min="1" max="5" step="1" value="1">`);
          let okA = false, okB = false;
          const W = 360, X0 = 40;
          const bar = (y, num, den, g, col, fill) => {
            const ok = num % g === 0 && den % g === 0;
            const parts = ok ? den / g : den, shade = ok ? num / g : num;
            let s = `<rect x="${X0}" y="${y}" width="${W * num / den}" height="30" fill="${fill}"/>`;
            for (let k = 1; k < parts; k++) s += `<line x1="${X0 + k * W / parts}" y1="${y}" x2="${X0 + k * W / parts}" y2="${y + 30}" stroke="${col}" stroke-width="${ok && g > 1 ? 2.5 : 1}"/>`;
            s += `<rect x="${X0}" y="${y}" width="${W}" height="30" fill="none" stroke="${col}" stroke-width="2"/>`;
            const label = g === 1 ? num + '/' + den : ok ? num + '/' + den + ' ＝ ' + shade + '/' + parts + '（上下同除以 ' + g + '）' : num + ' 和 ' + den + ' 不能都被 ' + g + ' 分完，併不起來';
            s += TX(X0, y - 8, label, { fs: 13, c: ok ? col : RED });
            return [s, ok && g > 1];
          };
          const draw = () => {
            const a = +h.querySelector('#as').value, b = +h.querySelector('#bs').value;
            h.querySelector('#av').textContent = a;
            h.querySelector('#bv').textContent = b;
            const [sa, ra] = bar(36, 9, 12, a, C, '#bbf7d0');
            const [sb, rb] = bar(106, 15, 20, b, BLU, '#bfdbfe');
            if (ra) okA = true;
            if (rb) okB = true;
            let s = sa + sb;
            const both = ra && rb;
            s += `<line x1="${X0 + W * 0.75}" y1="30" x2="${X0 + W * 0.75}" y2="146" stroke="${RED}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
            s += TX(220, 176, both ? '兩條都變成 3/4：3/4 ＋ 3/4 ＝ 6/4 ＝ 3/2' : '紅虛線是兩條塗色的終點：對齊了嗎？', { fs: 14, c: both ? GRN : '#657187', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 190', s);
            h.querySelector('#aha').innerHTML = AHA('塗色的長度一直沒變，只是格子變大了：<b>約分就是分子、分母同除以一個公因數</b>（9/12 用 3、15/20 用 5），變成 3/4 後加起來數字最小。',
              okA && okB, '9/12 和 15/20 都找到能併的格數（' + (okA ? '✓' : '　') + '9/12　' + (okB ? '✓' : '　') + '15/20）');
          };
          h.querySelector('#as').oninput = draw;
          h.querySelector('#bs').oninput = draw; draw();
        },
        caption: '約分是瘦身：數字越小，加減越不會算錯。',
        example: {
          q: '計算 \\(\\frac{24}{9}-\\frac{14}{21}\\)。',
          steps: ['\\(\\frac{24}{9}=\\frac{8}{3}\\)，\\(\\frac{14}{21}=\\frac{2}{3}\\)。', '\\(\\frac{8}{3}-\\frac{2}{3}=\\frac{6}{3}=2\\)。'],
          ans: '\\(2\\)'
        }
      },

      /* ---------- 通分加法（互動） ---------- */
      {
        sec: '6-2', secName: '分數加減',
        title: '3/4＋5/16：把 3/4 擴分成 12/16 再加',
        points: [
          '分母 4 和 16，公分母取 16，只擴前者。',
          '\\(3/4＝12/16\\)，\\(12/16＋5/16＝17/16\\)。',
          '拖滑桿換第二項分子，看和怎麼跟著走。'
        ],
        formula: { label: '通分加', tex: '\\frac{3}{4}+\\frac{5}{16}=\\frac{12}{16}+\\frac{5}{16}=\\frac{17}{16}' },
        visual: (h) => {
          h.innerHTML = CARD('一個方塊切成 16 小格。3/4 個方塊要塗<b>幾小格</b>？再加上 m/16，會不會塗超過一整個？',
            `<label>再塗 m ＝ <span class="ival" id="mv">2</span> 格（m/16）</label>
            <input type="range" id="ms" min="0" max="8" step="1" value="2">`);
          let over = false;
          const square = (x0, from, to, k) => {
            let s = '';
            for (let i = 0; i < 16; i++) {
              const r = Math.floor(i / 4), c = i % 4, idx = k * 16 + i;
              const fill = idx < 12 ? '#93c5fd' : idx < to ? '#fdba74' : '#fff';
              s += `<rect x="${x0 + c * 34}" y="${40 + r * 34}" width="34" height="34" fill="${fill}" stroke="#94a3b8" stroke-width="1"/>`;
            }
            s += `<rect x="${x0}" y="40" width="136" height="136" fill="none" stroke="#1f2a37" stroke-width="2.5"/>`;
            s += `<line x1="${x0}" y1="${40 + 68}" x2="${x0 + 136}" y2="${40 + 68}" stroke="${BLU}" stroke-width="1" stroke-dasharray="3 3" opacity=".5"/>`;
            return s;
          };
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m;
            const sum = 12 + m;
            if (sum > 16) over = true;
            let s = square(40, 0, sum, 0) + square(250, 0, sum, 1);
            s += TX(108, 30, '第 1 個方塊', { fs: 12, c: '#657187', anchor: 'middle' });
            s += TX(318, 30, '第 2 個方塊', { fs: 12, c: '#657187', anchor: 'middle' });
            s += TX(220, 202, '藍 3/4 ＝ 12/16，橘 ' + m + '/16，共 ' + sum + '/16' + (sum > 16 ? ' ＝ 1 又 ' + (sum - 16) + '/16' : sum === 16 ? ' ＝ 1' : ''),
              { fs: 14, c: sum > 16 ? RED : '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 215', s);
            h.querySelector('#aha').innerHTML = AHA('3/4 就是 4 排塗 3 排＝<b>12 小格</b>，所以 3/4＝12/16。格子一樣大才能直接數著加；超過 16 格就滿 1 個，跑到第 2 個方塊。',
              over, '把 m 拖大，看看塗到第 2 個方塊會怎樣');
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: 'm＝5 時回到例題：12/16＋5/16＝17/16。',
        example: {
          q: '計算 \\(\\frac{3}{4}+\\frac{5}{16}\\)。',
          steps: ['\\(\\frac{3}{4}=\\frac{12}{16}\\)。', '\\(\\frac{12}{16}+\\frac{5}{16}=\\frac{17}{16}\\)。'],
          ans: '\\(\\frac{17}{16}\\)（即 \\(1\\frac{1}{16}\\)）'
        }
      },

      /* ---------- 線段圖列式（互動） ---------- */
      {
        sec: '6-3', secName: '分數應用',
        title: '線段圖決定加減：剪掉＋剩下＝原有',
        points: [
          '繩子題：<b>剪掉 2-2/5＋剩下 1-1/2＝原有</b>。',
          '用掉題反過來：原有－剩下＝用掉，要用減的。',
          '拖滑桿換「問哪一段」，看算式什麼時候用加、什麼時候用減。'
        ],
        formula: { label: '列式', tex: '\\frac{12}{5}+\\frac{3}{2}=\\frac{39}{10}=3\\frac{9}{10}' },
        visual: (h) => {
          h.innerHTML = CARD('同一條繩子，題目可以問「原有多長」，也可以問「剪掉多少」「剩下多少」。<b>什麼時候用加、什麼時候用減？</b>',
            `<label>題目問第 <span class="ival" id="qv">1</span> 種</label>
            <input type="range" id="qs" min="1" max="3" step="1" value="1">`);
          const seen = new Set();
          const U = 90, X0 = 40, Y = 110;
          const Q = [
            { ask: '原有', eq: '原有 ＝ 剪掉 ＋ 剩下 ＝ 2-2/5 ＋ 1-1/2 ＝ 3-9/10 公尺', op: '加' },
            { ask: '剪掉', eq: '剪掉 ＝ 原有 － 剩下 ＝ 3-9/10 － 1-1/2 ＝ 2-2/5 公尺', op: '減' },
            { ask: '剩下', eq: '剩下 ＝ 原有 － 剪掉 ＝ 3-9/10 － 2-2/5 ＝ 1-1/2 公尺', op: '減' }
          ];
          const draw = () => {
            const q = +h.querySelector('#qs').value;
            h.querySelector('#qv').textContent = q;
            seen.add(q);
            const cut = 2.4, all = 3.9, P = Q[q - 1];
            const seg = (x1, x2, col, unk) => unk
              ? `<line x1="${x1}" y1="${Y}" x2="${x2}" y2="${Y}" stroke="${col}" stroke-width="12" stroke-dasharray="10 6" opacity=".55"/>`
              : SV.seg(x1, Y, x2, Y, col, 12);
            let s = seg(X0, X0 + cut * U, RED, P.ask === '剪掉') + seg(X0 + cut * U, X0 + all * U, BLU, P.ask === '剩下');
            s += TX(X0 + cut * U / 2, Y - 18, P.ask === '剪掉' ? '剪掉 ？' : '剪掉 2-2/5', { fs: 13, c: RED, anchor: 'middle' });
            s += TX(X0 + (cut + all) * U / 2, Y - 18, P.ask === '剩下' ? '剩下 ？' : '剩下 1-1/2', { fs: 13, c: BLU, anchor: 'middle' });
            s += `<path d="M${X0},${Y + 16} L${X0},${Y + 26} L${X0 + all * U},${Y + 26} L${X0 + all * U},${Y + 16}" fill="none" stroke="#1f2a37" stroke-width="1.8"/>`;
            s += TX(X0 + all * U / 2, Y + 46, P.ask === '原有' ? '原有 ？' : '原有 3-9/10', { fs: 13, c: '#172033', anchor: 'middle' });
            s += TX(220, 30, '問的是「' + P.ask + '」→ 用' + P.op + '的', { fs: 16, c: P.op === '加' ? GRN : AMB, anchor: 'middle' });
            s += TX(220, 196, P.eq, { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 210', s);
            h.querySelector('#aha').innerHTML = AHA('<b>整條＝兩段相加</b>。問整條（原有）就把兩段加起來；問其中一段，就用整條減掉另一段。先畫線段圖，看「？」在哪裡，就知道加還是減。',
              seen.size === 3, '三種問法都看看（已看 ' + seen.size + ' 種）');
          };
          h.querySelector('#qs').oninput = draw; draw();
        },
        caption: '虛線是題目要問的那一段：問整條用加，問其中一段用減。',
        example: {
          q: '繩子剪掉 \\(2\\frac{2}{5}\\) 公尺，剩 \\(1\\frac{1}{2}\\) 公尺，原有多長？',
          steps: ['\\(\\frac{12}{5}+\\frac{3}{2}=\\frac{24}{10}+\\frac{15}{10}\\)。', '\\(=\\frac{39}{10}=3\\frac{9}{10}\\)。'],
          ans: '\\(3\\frac{9}{10}\\) 公尺'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '6-3', secName: '分數應用',
        title: '分數三個坑：直接加減、帶分數直比、加減搞反',
        points: [
          '分母不同時，分子分母<span class="k">不能</span>直接加減。',
          '帶分數比大小要先化假分數，不能只比整數。',
          '應用題先看線段圖：求原有加、求用掉減。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['3/4＋5/16＝8/20', '先通分：12/16＋5/16＝17/16'],
            ['1-2/5 比 3/2 大（只看整數 1）', '化假再通分：14/10＜15/10，3/2 大'],
            ['果汁題求用掉卻用加的', '原有－剩下＝用掉：20/3－11/4＝47/12']
          ]);
        },
        caption: '通分、化假、看圖，三步驟做完再下筆。',
        example: {
          q: '果汁原有 \\(6\\frac{2}{3}\\) 瓶，剩 \\(2\\frac{3}{4}\\) 瓶，喝掉幾瓶？',
          steps: ['\\(\\frac{20}{3}-\\frac{11}{4}=\\frac{80}{12}-\\frac{33}{12}\\)。', '\\(=\\frac{47}{12}=3\\frac{11}{12}\\)。'],
          ans: '\\(3\\frac{11}{12}\\) 瓶'
        }
      },

      ...build64(P64)

    ]
  });
})();
