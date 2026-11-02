/* ============ 第 1 章　浮力 ============
   節次：3-1 三態判定、3-2 視重法、3-3 沒入比例
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：氣體浮力的計算、表面張力與毛細現象、
     帕斯卡原理、波以耳定律（同單元其他主題，另章處理）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb';
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

  // 箭頭（自己算三角形箭頭，不用 <marker>，避免同頁多張圖 id 打架）
  const ARW = (x1, y1, x2, y2, c, w = 3) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) return '';
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(11, L), hw = 6;
    const bx = x2 - ux * hl, by = y2 - uy * hl;
    return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}" fill="${c}"/>`;
  };

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

  window.DECK.push({
    ch: 1,
    title: '浮力',
    color: C,
    sections: ['3-1 三態判定', '3-2 視重法', '3-3 沒入比例'],
    slides: [

      /* ---------- 三態判定 ---------- */
      {
        sec: '3-1', secName: '三態判定',
        title: '比密度就知道浮沉：物小於液就浮，大於液就沉',
        points: [
          '<span class="k">浮體</span>（\\(D物＜D液\\)）：部分露出，<b>\\(B＝W\\)</b>。',
          '<span class="k">懸浮</span>（\\(D物＝D液\\)）：全沒入不上不下，\\(B＝W\\)。',
          '<span class="k">沉體</span>（\\(D物＞D液\\)）：沉底，\\(B＜W\\)，用視重法。'
        ],
        formula: { label: '阿基米德', tex: 'B=V_{排}\\times D_{液}' },
        visual: (h) => {
          let s = BOX(50, 130, 340, 130, { fill: 'rgba(37,99,235,.10)', stroke: BLU });
          s += TX(220, 122, '水面', { fs: 13, c: BLU, anchor: 'middle' });
          s += `<rect x="80" y="90" width="70" height="60" rx="6" fill="rgba(5,150,105,.35)" stroke="${GRN}" stroke-width="2"/>`;
          s += TX(115, 250, '浮體', { fs: 14, c: GRN, anchor: 'middle' });
          s += `<rect x="185" y="150" width="70" height="60" rx="6" fill="rgba(217,119,6,.30)" stroke="${AMB}" stroke-width="2"/>`;
          s += TX(220, 250, '懸浮', { fs: 14, c: AMB, anchor: 'middle' });
          s += `<rect x="290" y="200" width="70" height="60" rx="6" fill="rgba(225,29,72,.30)" stroke="${RED}" stroke-width="2"/>`;
          s += TX(325, 250, '沉體', { fs: 14, c: RED, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 270', s);
        },
        caption: '綠浮水面、黃懸水中、紅沉水底：位置直接告狀密度關係。',
        example: {
          q: '密度 \\(0.5\\) g/cm\\(^3\\) 的木塊放水中，會如何？浮力多少？',
          steps: ['\\(0.5＜1\\)，是浮體。', '浮體 \\(B＝W\\)（等於木塊重量）。'],
          ans: '漂浮，\\(B＝W\\)'
        }
      },

      /* ---------- 浮沉互動 ---------- */
      {
        sec: '3-1', secName: '三態判定',
        title: '拖密度看浮沉：滑到 1.0 恰懸浮',
        points: [
          '水密度 \\(1.0\\) 當裁判，物密度拖過它就沉。',
          '拖到 <b>\\(1.0\\)</b> 整條方塊停在水中間：不上不下。',
          '問自己：拖到哪個值，方塊恰懸浮？'
        ],
        formula: { label: '判定', tex: 'D_{物}<1\\text{浮}\\;,\\;＝1\\text{懸}\\;,\\;＞1\\text{沉}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>物密度 ＝ <span class="ival" id="dv">0.6</span> g/cm\\(^3\\)</label>
            <input type="range" id="ds" min="2" max="20" step="2" value="6"></div></div>`;
          const draw = () => {
            const v = +h.querySelector('#ds').value, d = v / 10;
            h.querySelector('#dv').textContent = d.toFixed(1);
            const WL = 140, TB = 270, BH = 80, x = 180, w = 80;
            let y, col, st;
            if (v < 10) { y = WL + d * BH - BH; col = GRN; st = '浮體（B＝W）'; }
            else if (v === 10) { y = 185; col = AMB; st = '懸浮（B＝W）'; }
            else { y = TB - BH; col = RED; st = '沉體（B＜W）'; }
            let s = BOX(60, WL, 320, TB - WL, { fill: 'rgba(37,99,235,.10)', stroke: BLU });
            s += TX(220, WL - 8, '水面', { fs: 13, c: BLU, anchor: 'middle' });
            s += `<rect x="${x}" y="${y}" width="${w}" height="${BH}" rx="6" fill="${col}55" stroke="${col}" stroke-width="2.5"/>`;
            s += TX(220, 292, 'D物＝' + d.toFixed(1) + '：' + st, { fs: 15, c: col, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 300', s);
          };
          h.querySelector('#ds').oninput = draw; draw();
        },
        caption: 'v＝10（密度 1.0）時方塊停在水中間：懸浮。',
        example: {
          q: '物密度 \\(1.0\\) g/cm\\(^3\\) 放水中，狀態與浮力？',
          steps: ['\\(D物＝D液\\)，是懸浮。', '懸浮 \\(B＝W\\)。'],
          ans: '懸浮，\\(B＝W\\)'
        }
      },

      /* ---------- 視重法 ---------- */
      {
        sec: '3-2', secName: '視重法',
        title: '沉體求浮力：空氣重減水中重就是浮力',
        points: [
          '沉體 \\(B＜W\\) 不能直接用 \\(B＝W\\)，改用<span class="k">視重法</span>。',
          '<b>\\(B＝W空－W水\\)</b>：彈簧秤少掉的就是浮力。',
          '再除以液密度得體積：\\(V排＝B÷D液\\)。'
        ],
        formula: { label: '視重法', tex: 'B=W_{空}-W_{水}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>水中視重 W水 ＝ <span class="ival" id="wv">70</span>gw</label>
            <input type="range" id="ws" min="0" max="120" step="10" value="70"></div></div>`;
          const draw = () => {
            const w = +h.querySelector('#ws').value;
            h.querySelector('#wv').textContent = w;
            const b = 120 - w;
            // 彈簧秤：掛鉤、秤身、讀數、吊線
            const scale = (x, read, col) =>
              SV.seg(x, 8, x, 22, '#64748b', 2) +
              `<rect x="${x - 20}" y="22" width="40" height="64" rx="6" fill="#fff" stroke="#64748b" stroke-width="2"/>` +
              TX(x, 60, read, { fs: 15, c: col, anchor: 'middle' }) + SV.seg(x, 86, x, 140, '#64748b', 2);
            const block = (x) => `<rect x="${x - 22}" y="140" width="44" height="44" rx="5" fill="rgba(100,116,139,.40)" stroke="#475569" stroke-width="2"/>`;
            let s = scale(100, '120', BLU) + block(100);
            s += TX(100, 214, '空氣中：W空 ＝ 120', { fs: 13, c: BLU, anchor: 'middle' });
            s += `<rect x="225" y="112" width="150" height="122" rx="6" fill="rgba(37,99,235,.14)" stroke="${BLU}" stroke-width="2"/>`;
            s += TX(370, 128, '水', { fs: 12, c: BLU, anchor: 'end' });
            s += scale(300, String(w), RED) + block(300);
            s += ARW(300, 186 + b * 0.35, 300, 188, GRN, 4);
            if (b > 0) s += TX(312, 200 + b * 0.18, 'B ＝ ' + b, { fs: 13, c: GRN });
            s += TX(300, 254, '水中：W水 ＝ ' + w, { fs: 13, c: RED, anchor: 'middle' });
            s += TX(220, 284, 'B ＝ 120－' + w + ' ＝ ' + b + ' gw' + (w === 70 ? '（課本情境：V＝50，D＝2.4）' : ''), { fs: 16, c: GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 296', s);
          };
          h.querySelector('#ws').oninput = draw; draw();
        },
        caption: '拖滑桿：W水＝70 時 B＝50；W水 越小，代表浮力越大。',
        example: {
          q: '一物空重 \\(120\\)gw，水中視重 \\(70\\)gw，求浮力、體積、密度。',
          steps: ['\\(B=120-70=50\\)gw。', '\\(V_{排}=50÷1=50\\)cm\\(^3\\)。', '\\(D_{物}=120÷50=2.4\\) g/cm\\(^3\\)（沉體）。'],
          ans: '\\(B=50\\)gw，\\(D=2.4\\)'
        }
      },

      /* ---------- 沒入比例互動 ---------- */
      {
        sec: '3-3', secName: '沒入比例',
        title: '沒入幾成只看密度比：物密度 0.5 就是沒入一半',
        points: [
          '浮體平衡：<b>沒入比例＝\\(D物÷D液\\)</b>，與大小形狀無關。',
          '拖滑桿：密度越大，沉下去的部分越多。',
          '問自己：密度 0.5 時，沒入幾成？'
        ],
        formula: { label: '沒入比例', tex: '\\frac{V_{沒入}}{V_{總}}=\\frac{D_{物}}{D_{液}}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>物密度 ＝ <span class="ival" id="mv">0.5</span></label>
            <input type="range" id="ms" min="1" max="10" step="1" value="5"></div></div>`;
          const draw = () => {
            const v = +h.querySelector('#ms').value, d = v / 10;
            h.querySelector('#mv').textContent = d.toFixed(1);
            const x = 170, w = 100, top = 40, H = 200, sub = H * d;
            const mo = Math.round(d * 100) / 10, fo = Math.round((1 - d) * 100) / 10;
            const emH = H - sub;
            let s = BOX(x, top, w, H, { fill: '#fff', stroke: C });
            s += `<rect x="${x}" y="${top + H - sub}" width="${w}" height="${sub}" fill="rgba(37,99,235,.25)"/>`;
            if (emH >= 34) s += TX(120, top + emH / 2, '浮出', { fs: 14, c: AMB, anchor: 'middle' });
            s += TX(120, top + H - sub / 2, '沒入', { fs: 14, c: BLU, anchor: 'middle' });
            s += TX(330, top + 30, '沒入 ' + mo + ' 成', { fs: 17, c: C, anchor: 'middle' });
            s += TX(330, top + 60, '浮出 ' + fo + ' 成', { fs: 15, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: 'v＝5（密度 0.5）時藍色恰占一半：沒入 5 成。',
        example: {
          q: '冰密度 \\(0.95\\) 浮水上，浮出占幾分之幾？融化一半後比例變嗎？加鹽呢？',
          steps: ['浮出＝\\(1-0.95=0.05=1/20\\)。', '融化只變大小，密度不變 → 比例不變。', '加鹽液密度大 → 沒入小 → 浮出變大。'],
          ans: '1/20、不變、變大'
        }
      },

      /* ---------- 排水法陷阱 ---------- */
      {
        sec: '3-3', secName: '沒入比例',
        title: '排水法量到的是沉下體積，不是物體真體積',
        points: [
          '石塊全沉：\\(V2－V1＝S\\)（整顆體積）。',
          '浮球只沉一部分：\\(V4－V2＝b\\) 只是<b>沒入部分</b>。',
          '陷阱：把 \\(b\\) 當整顆球體積就中計。'
        ],
        formula: { label: '排水法', tex: 'V_{2}-V_{1}=S\\;,\\;V_{4}-V_{5}=S' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '石塊', tex: 'V_{2}-V_{1}=S', color: BLU, fill: '#eef4ff', border: BLU, size: 18, note: '全沉，整顆體積' },
            { label: '浮球', tex: 'V_{4}-V_{2}=b', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 18, note: '只沉一部分，不是整顆' },
            { label: '答案', tex: 'V_{4}-V_{5}=S', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18, note: '相減消去 b' }
          ]);
        },
        caption: 'V₃ 能代表整顆球，只因細繩把它壓在水下。',
        example: {
          q: '石塊球體積皆 S，球浮時沒入 b，哪個選項等於 S？',
          steps: ['\\(V_{2}-V_{1}=(V_{1}+S)-V_{1}=S\\)。', '\\(V_{4}-V_{5}=(V_{1}+S+b)-(V_{1}+b)=S\\)。'],
          ans: '(C) 兩式皆 S'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '3-3', secName: '沒入比例',
        title: '浮力三個坑：公式用錯、比例隨大小、排水當真體',
        points: [
          '浮體 <span class="k">\\(B＝W\\)</span>，沉體才用視重法，別混用。',
          '沒入比例只看<span class="k">密度比</span>，冰融化一半比例不變。',
          '排水法對浮體只量到沒入部分 \\(b\\)。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['浮體也用 B＝W空－W水', '浮體直接 B＝W；視重法留給沉體'],
            ['冰融化變小，浮出比例變小', '比例只看密度比，大小改變不影響'],
            ['V4－V2＝b 是整顆球體積', 'b 只是沒入部分；整顆要看全沉的量']
          ]);
        },
        caption: '考前看這頁：浮用等、沉用減、比例看密度、排水看沉下。',
        example: {
          q: '船從港口開到鹽分高的大西洋，浮力有何變化？',
          steps: ['仍是浮體 → \\(B＝W\\)，浮力不變。', '液密度大 → 沒入比例小 → 排開體積減少。'],
          ans: '浮力不變，V排減少'
        }
      }

    ]
  });
})();
