/* ============ 第 2 章　整數速算 ============
   節次：3-1 乘法速算、3-2 速算應用
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：直式乘除法運算、帶餘除法、
     分數與小數的四則運算（本章只玩整數的拆拼）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
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

  window.DECK.push({
    ch: 2,
    title: '整數速算',
    color: C,
    sections: ['3-1 乘法速算', '3-2 速算應用'],
    slides: [

      /* ---------- 好朋友組合 ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '速算第一步：先背熟三組好朋友',
        points: [
          '<span class="k">好朋友</span>：\\(2×5＝10\\)、\\(4×25＝100\\)、\\(8×125＝1000\\)。',
          '看到 25 就找 4，看到 125 就找 8，看到偶數就找 5。',
          '整十整百湊出來，後面計算全是 0，一路順風。'
        ],
        formula: { label: '好朋友', tex: '2\\times5=10\\;,\\;4\\times25=100\\;,\\;8\\times125=1000' },
        visual: (h) => {
          h.innerHTML = CARD('為什麼偏偏是 <b>25 配 4</b>、<b>125 配 8</b>？把它們畫出來就知道了。',
            `<label>好朋友第 <span class="ival" id="pv">1</span> 組</label>
            <input type="range" id="ps" min="1" max="3" step="1" value="1">`);
          const seen = new Set();
          const QC = ['#bfdbfe', '#ddd6fe', '#bbf7d0', '#fde68a'];
          const draw = () => {
            const p = +h.querySelector('#ps').value;
            h.querySelector('#pv').textContent = p;
            seen.add(p);
            let s = '';
            if (p === 1) {
              s += BOX(70, 50, 300, 120, { r: 10, fill: '#fff', stroke: '#1f2a37' });
              for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) s += CIRC(100 + c * 60, 82 + r * 56, 18, r ? '#93c5fd' : '#bfdbfe', BLU);
              s += TX(220, 30, '2 排 × 每排 5 個 ＝ 湊滿 1 個「十格框」', { fs: 14, c: BLU, anchor: 'middle' });
              s += TX(220, 200, '2 × 5 ＝ 10', { fs: 22, c: BLU, anchor: 'middle' });
            } else if (p === 2) {
              const x0 = 150, y0 = 34, k = 14;
              for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
                const q = (r >= 5 ? 2 : 0) + (c >= 5 ? 1 : 0);
                s += `<rect x="${x0 + c * k}" y="${y0 + r * k}" width="${k}" height="${k}" fill="${QC[q]}" stroke="#fff" stroke-width="1"/>`;
              }
              for (let q = 0; q < 4; q++) s += TX(x0 + 35 + (q % 2) * 70, y0 + 40 + Math.floor(q / 2) * 70, '25', { fs: 16, c: C, anchor: 'middle' });
              s += TX(80, 100, '4 塊', { fs: 15, c: C, anchor: 'middle' });
              s += TX(80, 122, '每塊 5×5', { fs: 12, c: '#657187', anchor: 'middle' });
              s += TX(365, 100, '拼成', { fs: 13, c: '#657187', anchor: 'middle' });
              s += TX(365, 122, '10×10', { fs: 15, c: C, anchor: 'middle' });
              s += TX(220, 200, '4 × 25 ＝ 100', { fs: 22, c: C, anchor: 'middle' });
            } else {
              // 斜投影正方體，三個看得到的面都切成 2×2（共 8 小塊）
              const x = 140, y = 70, a = 120, d = 50;
              s += `<polygon points="${x},${y} ${x + a},${y} ${x + a + d},${y - d} ${x + d},${y - d}" fill="#d1fae5" stroke="${GRN}" stroke-width="2"/>`;
              s += `<polygon points="${x},${y} ${x + a},${y} ${x + a},${y + a} ${x},${y + a}" fill="#bbf7d0" stroke="${GRN}" stroke-width="2"/>`;
              s += `<polygon points="${x + a},${y} ${x + a + d},${y - d} ${x + a + d},${y + a - d} ${x + a},${y + a}" fill="#a7f3d0" stroke="${GRN}" stroke-width="2"/>`;
              const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${GRN}" stroke-width="1.6"/>`;
              s += L(x + a / 2, y, x + a / 2, y + a) + L(x, y + a / 2, x + a, y + a / 2);
              s += L(x + a / 2, y, x + a / 2 + d, y - d) + L(x + d / 2, y - d / 2, x + a + d / 2, y - d / 2);
              s += L(x + a + d / 2, y - d / 2, x + a + d / 2, y + a - d / 2) + L(x + a, y + a / 2, x + a + d, y + a / 2 - d);
              s += TX(70, 110, '8 塊', { fs: 15, c: GRN, anchor: 'middle' });
              s += TX(70, 132, '每塊 125', { fs: 12, c: '#657187', anchor: 'middle' });
              s += TX(380, 160, '10×10×10', { fs: 13, c: GRN, anchor: 'middle' });
              s += TX(220, 218, '8 × 125 ＝ 1000', { fs: 22, c: GRN, anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 230', s);
            h.querySelector('#aha').innerHTML = AHA('25 是 100 的「四分之一塊」、125 是 1000 的「八分之一塊」：<b>湊滿剛好是整十、整百、整千</b>。所以看到 25 就找 4，看到 125 就找 8。',
              seen.size === 3, '三組都看一遍（已看 ' + seen.size + ' 組）');
          };
          h.querySelector('#ps').oninput = draw; draw();
        },
        caption: '三組好朋友是整章的引擎，看到 25、125 先微笑。',
        example: {
          q: '\\(8\\times 125\\) 等於多少？',
          steps: ['好朋友組合：\\(8\\times 125=1000\\)。'],
          ans: '1000'
        }
      },

      /* ---------- 36×25（互動） ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '28×25＝700：把 28 拆出 4，湊出 100',
        points: [
          '28 藏著 4：\\(28＝7×4\\)，4 和 25 是好朋友。',
          '結合律：\\((7×4)×25＝7×(4×25)＝7×100\\)。',
          '拖滑桿：把 28 換成 28 的倍數，看答案怎麼長大。'
        ],
        formula: { label: '28×25', tex: '28\\times25=(7\\times4)\\times25=7\\times100=700' },
        visual: (h) => {
          h.innerHTML = CARD('28 × 25 不用直式也能一眼看出答案。提示：<b>28 裡面藏了幾個 4</b>？',
            `<label>c ＝ <span class="ival" id="cv">1</span>（算 28c × 25）</label>
            <input type="range" id="cs" min="1" max="4" step="1" value="1">`);
          const seen = new Set();
          const draw = () => {
            const c = +h.querySelector('#cs').value;
            h.querySelector('#cv').textContent = c;
            seen.add(c);
            const n = 7 * c, ans = 28 * c * 25;
            let s = TX(220, 22, (28 * c) + ' ＝ ' + n + ' 個 4，每個 4 配一個 25 ＝ 一張「100」', { fs: 13, c: C, anchor: 'middle' });
            for (let i = 0; i < n; i++) {
              const x = 28 + (i % 7) * 56, y = 36 + Math.floor(i / 7) * 46;
              s += BOX(x, y, 48, 38, { r: 7, fill: '#ede9fe', stroke: C, sw: 1.5 });
              s += TX(x + 24, y + 18, '4×25', { fs: 10, c: '#657187', anchor: 'middle' });
              s += TX(x + 24, y + 32, '100', { fs: 13, c: C, anchor: 'middle' });
            }
            const yb = 36 + Math.ceil(n / 7) * 46 + 22;
            s += TX(220, yb, n + ' 張 100 ＝ ' + ans, { fs: 20, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 ' + (yb + 12), s);
            h.querySelector('#aha').innerHTML = AHA('<b>有幾個 4，答案就是幾百</b>：28 有 7 個 4 → 700；56 有 14 個 4 → 1400。把 4 拆出來和 25 配對，就不用直式。',
              seen.size >= 2, '把 c 拖大一點，數數看有幾張 100');
          };
          h.querySelector('#cs').oninput = draw; draw();
        },
        caption: 'c＝1 時：(7×4)×25＝7×100＝700。',
        example: {
          q: '用速算求 \\(28\\times 25\\)。',
          steps: ['\\(28=7\\times 4\\)。', '\\((7\\times 4)\\times 25=7\\times(4\\times 25)\\)。', '\\(7\\times 100=700\\)。'],
          ans: '700'
        }
      },

      /* ---------- 連除變除以乘積 ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '連除並一次：分子不動，分母相乘（125×8＝1000）',
        points: [
          '除法寫成分數：被除數放上面（<span class="k">分子</span>）。',
          '除一次分母多一個：\\(125\\) 再除 \\(8\\) 就是分母相乘。',
          '同理 \\(100×356÷25÷4＝35600÷100＝356\\)。'
        ],
        formula: { label: '連除合併', tex: '\\frac{3720000}{125\\times8}=3720' },
        visual: (h) => {
          h.innerHTML = CARD('3720000 先除以 125、再除以 8，和「一次除以哪個數」一樣？是 125×8 還是 125÷8？',
            `<label>走第 <span class="ival" id="rv">1</span> 條路</label>
            <input type="range" id="rs" min="1" max="3" step="1" value="1">`);
          const seen = new Set();
          const ROUTES = [
            { y: 52, steps: ['÷125', '÷8'], mid: '29760', end: '3720', col: BLU, name: '一步一步除' },
            { y: 122, steps: ['÷(125×8)＝÷1000'], end: '3720', col: GRN, name: '除數先乘起來' },
            { y: 192, steps: ['÷(125÷8)＝÷15.625'], end: '238080', col: RED, name: '除數先除起來' }
          ];
          const arrow = (x1, x2, y, col) => `<line x1="${x1}" y1="${y}" x2="${x2 - 8}" y2="${y}" stroke="${col}" stroke-width="2.5"/>` +
            `<polygon points="${x2},${y} ${x2 - 10},${y - 6} ${x2 - 10},${y + 6}" fill="${col}"/>`;
          const draw = () => {
            const r = +h.querySelector('#rs').value;
            h.querySelector('#rv').textContent = r;
            seen.add(r);
            let s = '';
            ROUTES.forEach((R, i) => {
              const on = seen.has(i + 1), cur = i + 1 === r, op = on ? 1 : 0.25;
              s += `<g opacity="${op}">`;
              s += BOX(8, R.y - 16, 82, 32, { r: 8, fill: '#fff', stroke: '#1f2a37', sw: cur ? 2.5 : 1.4 });
              s += TX(49, R.y + 5, '3720000', { fs: 12, c: '#172033', anchor: 'middle' });
              if (R.mid) {
                s += arrow(92, 196, R.y, R.col) + TX(144, R.y - 8, R.steps[0], { fs: 12, c: R.col, anchor: 'middle' });
                s += BOX(198, R.y - 14, 62, 28, { r: 8, fill: '#fff', stroke: R.col, sw: 1.4 }) + TX(229, R.y + 5, on ? R.mid : '?', { fs: 12, c: '#172033', anchor: 'middle' });
                s += arrow(262, 342, R.y, R.col) + TX(302, R.y - 8, R.steps[1], { fs: 12, c: R.col, anchor: 'middle' });
              } else {
                s += arrow(92, 342, R.y, R.col) + TX(217, R.y - 8, R.steps[0], { fs: 12, c: R.col, anchor: 'middle' });
              }
              s += BOX(344, R.y - 16, 88, 32, { r: 8, fill: on ? (R.end === '3720' ? '#e8f7ef' : '#fdeef2') : '#fff', stroke: R.col, sw: cur ? 2.5 : 1.4 });
              s += TX(388, R.y + 5, on ? R.end : '?', { fs: 14, c: R.col, anchor: 'middle' });
              s += TX(8, R.y + 32, '路 ' + (i + 1) + '：' + R.name, { fs: 11, c: '#657187' });
              s += '</g>';
            });
            h.querySelector('#fig').innerHTML = svg('0 0 440 232', s);
            h.querySelector('#aha').innerHTML = AHA('路 1、路 2 終點都是 3720，路 3 卻跑到 238080！<b>連除兩次＝除以兩數的乘積</b>：除數要「乘起來」，不是「除起來」。',
              seen.size === 3, '三條路都走走看（已走 ' + seen.size + ' 條）');
          };
          h.querySelector('#rs').oninput = draw; draw();
        },
        caption: '分子 3720000 從頭到尾沒動：除數全跑到分母乘起來。',
        example: {
          q: '速算 \\(100\\times 356\\div 25\\div 4\\)。',
          steps: ['\\(100\\times 356=35600\\)。', '\\(35600\\div 25\\div 4=35600\\div 100\\)。'],
          ans: '356'
        }
      },

      /* ---------- 分配律運費（互動） ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '分配律：160×5＋240×5＝(160＋240)×5',
        points: [
          '兩種運費<b>件數相同</b>（都是 5 件）才能合併。',
          '先加後乘：\\((160＋240)×5＝400×5＝2000\\) 元。',
          '勾「配對」看方塊重新分組，再拖滑桿換件數。'
        ],
        formula: { label: '分配律', tex: '160\\times5+240\\times5=(160+240)\\times5' },
        visual: (h) => {
          h.innerHTML = CARD('分開算 160×5、240×5 再相加，和先把一個 160 配一個 240、再乘 5，<b>答案一樣嗎？哪個比較快？</b>',
            `<label>件數 n ＝ <span class="ival" id="nv">5</span></label>
            <input type="range" id="ns" min="1" max="6" step="1" value="5">
            <label style="margin-left:10px">配對 <input type="checkbox" id="pk"></label>`);
          let paired = false;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            const pk = h.querySelector('#pk').checked;
            h.querySelector('#nv').textContent = n;
            if (pk) paired = true;
            let s = '';
            for (let i = 0; i < n; i++) {
              const x = 30 + i * 64;
              const yb = pk ? 40 : 40, yg = pk ? 92 : 132;
              if (pk) s += BOX(x - 5, 32, 58, 124, { r: 10, fill: 'rgba(225,29,72,.06)', stroke: RED, sw: 1.6 });
              s += BOX(x, yb, 48, 44, { r: 6, fill: '#bfdbfe', stroke: BLU, sw: 1.5 }) + TX(x + 24, yb + 28, '160', { fs: 13, c: BLU, anchor: 'middle' });
              s += BOX(x, yg, 48, 58, { r: 6, fill: '#bbf7d0', stroke: GRN, sw: 1.5 }) + TX(x + 24, yg + 34, '240', { fs: 13, c: GRN, anchor: 'middle' });
              if (pk) s += TX(x + 24, 172, '400', { fs: 13, c: RED, anchor: 'middle' });
            }
            s += TX(220, 22, pk ? '每件配成一組：' + n + ' 組 400' : '藍一排 ' + n + ' 件、綠一排 ' + n + ' 件', { fs: 13, c: '#172033', anchor: 'middle' });
            s += TX(220, 210, pk ? '(160＋240)×' + n + '＝400×' + n + '＝' + (400 * n) + ' 元'
              : '160×' + n + '＋240×' + n + '＝' + (160 * n) + '＋' + (240 * n) + '＝' + (400 * n) + ' 元', { fs: 15, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 225', s);
            h.querySelector('#aha').innerHTML = AHA('方塊一個都沒變，只是換個方式分組，總數當然一樣。<b>因為兩種都是 n 件，才能一藍一綠配成對</b>；件數不同就會有落單的，不能合併。',
              paired, '勾選「配對」，看方塊怎麼重新分組');
          };
          h.querySelector('#pk').onchange = draw;
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '一藍一綠配成一組 400：5 組就是 400×5＝2000 元。',
        example: {
          q: '小安寄 160 元包裹 5 件、240 元包裹 5 件，共付多少運費？',
          steps: ['\\(160\\times 5+240\\times 5\\)。', '\\(=(160+240)\\times 5=400\\times 5\\)。'],
          ans: '2000 元'
        }
      },

      /* ---------- 1536×41＝1536×(42－1)（互動） ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '已知 1536×42＝64512，則 1536×41 減一次就好',
        points: [
          '41 比 42 少 1，所以答案比 64512 少一個 1536。',
          '\\(1536×41＝1536×(42－1)＝64512－1536\\)。',
          '拖滑桿：m 從 42 往下走，看答案每次減 1536。'
        ],
        formula: { label: '借力', tex: '1536\\times41=1536\\times(42-1)' },
        visual: (h) => {
          h.innerHTML = CARD('42 格加起來是 64512，每格都是 1536。<b>拿掉 1 格</b>剩多少？要重算直式嗎？',
            `<label>留下 m ＝ <span class="ival" id="mv">42</span> 格</label>
            <input type="range" id="ms" min="39" max="42" step="1" value="42" style="direction:rtl">`);
          let tried = false;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m;
            if (m < 42) tried = true;
            const k = 42 - m, ans = 64512 - 1536 * k;
            let s = TX(220, 20, '每格 ＝ 1536', { fs: 13, c: AMB, anchor: 'middle' });
            for (let i = 0; i < 42; i++) {
              const x = 24 + (i % 7) * 56, y = 32 + Math.floor(i / 7) * 26, gone = i >= m;
              s += BOX(x, y, 50, 22, { r: 5, fill: gone ? '#f3f5f9' : '#fde68a', stroke: gone ? '#cbd5e1' : AMB, sw: 1.3 });
              if (gone) s += `<path d="M${x + 14},${y + 4}L${x + 36},${y + 18}M${x + 36},${y + 4}L${x + 14},${y + 18}" stroke="${RED}" stroke-width="2.5"/>`;
            }
            s += TX(220, 212, '1536 × ' + m + ' ＝ ' + ans, { fs: 20, c: AMB, anchor: 'middle' });
            s += TX(220, 236, m === 42 ? '已知，不用算' : '＝ 64512 － 1536 × ' + k + '（拿掉 ' + k + ' 格）', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 248', s);
            h.querySelector('#aha').innerHTML = AHA('少 1 格就減 1 個 1536，少 2 格就減 2 個。<b>借用已知的答案，只算「差幾格」</b>，比重算直式快很多。',
              tried, '把滑桿往右拖，拿掉幾格');
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: 'm＝41 時：64512－1536＝62976，不必重算直式。',
        example: {
          q: '已知 \\(1536\\times 42=64512\\)，求 \\(1536\\times 41\\)。',
          steps: ['\\(1536\\times 41=1536\\times(42-1)\\)。', '\\(=64512-1536=62976\\)。'],
          ans: '62976'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '速算三個坑：除法合併方向、減法分組、件數相同',
        points: [
          '連除合併是<span class="k">乘</span>起來除，不是除起來除。',
          '連減分組要全包括號，符號一起帶走。',
          '分配律合併前確認：乘的數是否相同？'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['÷125÷8＝÷(125÷8)', '÷125÷8＝÷(125×8)＝÷1000，除數相乘'],
            ['856－128－72＝856－128＋72', '856－128－72＝856－(128＋72)＝656，括號內全加'],
            ['160×5＋240×6 合併成 400×11', '乘數不同（5 和 6）不能合併，先各算再加']
          ]);
        },
        caption: '三個坑都看過一次，考試就穩了。',
        example: {
          q: '\\(358+246+642+754\\) 速算。',
          steps: ['\\((358+642)+(246+754)\\)。', '\\(=1000+1000=2000\\)。'],
          ans: '2000'
        }
      }

    ]
  });
})();
