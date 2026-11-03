/* ============ 第 4 章　長方體 ============
   節次：7-1 面與透視圖、7-2 表面積
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：體積計算、容積換算、
     展開圖的完整判別（只談面數、垂直平行與表面積）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#d97706';
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

  // 長方體線框（含虛線）：w 寬、h 高、d 斜深
  function cuboid(x, y, w, h, d, o = {}) {
    const c = o.c || C, dash = o.dash || '5 4', dop = o.dop == null ? 1 : o.dop;
    let s = '';
    s += `<polygon points="${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}" fill="rgba(217,119,6,.12)" stroke="${c}" stroke-width="2"/>`;
    s += `<polygon points="${x},${y} ${x},${y + h} ${x + w},${y + h} ${x + w},${y}" fill="rgba(217,119,6,.05)" stroke="${c}" stroke-width="2"/>`;
    s += `<polygon points="${x + w},${y} ${x + w},${y + h} ${x + w + d},${y + h - d} ${x + w + d},${y - d}" fill="rgba(217,119,6,.09)" stroke="${c}" stroke-width="2"/>`;
    s += `<line x1="${x + d}" y1="${y - d}" x2="${x + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    s += `<line x1="${x}" y1="${y + h}" x2="${x + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    s += `<line x1="${x + d}" y1="${y + h - d}" x2="${x + w + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    return s;
  }

  window.DECK.push({
    ch: 4,
    title: '長方體',
    color: C,
    sections: ['7-1 面與透視圖', '7-2 表面積'],
    slides: [

      /* ---------- 幾個面和桌面垂直 ---------- */
      {
        sec: '7-1', secName: '面與透視圖',
        title: '平放桌上：4 個側面和桌面垂直，上下 2 面平行',
        points: [
          '長方體共 <b>6 個面</b>：上下、前後、左右兩兩相對。',
          '平放時 4 個側面站著（<span class="k">垂直</span>桌面）。',
          '上下 2 面躺著（平行桌面），只和側面垂直。'
        ],
        formula: { label: '面數', tex: '6\\text{面：}4\\text{垂直}+2\\text{平行}' },
        visual: (h) => {
          h.innerHTML = CARD('紙箱平放在桌上，有幾個面是「站著」的（和桌面垂直）？先數再勾選對答案。',
            `<label>塗出站著的面 <input type="checkbox" id="sk"></label>
            <label style="margin-left:10px">塗出躺著的面 <input type="checkbox" id="lk"></label>`);
          let sOn = false, lOn = false;
          const draw = () => {
            const sk = h.querySelector('#sk').checked, lk = h.querySelector('#lk').checked;
            if (sk) sOn = true;
            if (lk) lOn = true;
            let s = BOX(40, 210, 360, 16, { fill: '#94a3b8', stroke: '#64748b' });
            s += SV.seg(80, 226, 80, 256, '#94a3b8', 7);
            s += SV.seg(360, 226, 360, 256, '#94a3b8', 7);
            s += TX(355, 202, '桌面', { fs: 13, c: '#64748b', anchor: 'middle' });
            s += cuboid(120, 125, 130, 85, 40, {});
            if (sk) {
              s += `<polygon points="120,125 250,125 250,210 120,210" fill="rgba(225,29,72,.28)"/>`;
              s += `<polygon points="250,125 290,85 290,170 250,210" fill="rgba(225,29,72,.28)"/>`;
              s += TX(308, 112, '站著：前、右', { fs: 13, c: RED });
              s += TX(308, 132, '＋看不到的後、左', { fs: 13, c: RED });
              s += TX(308, 152, '＝ 4 面垂直', { fs: 14, c: RED });
            }
            if (lk) {
              s += `<polygon points="120,125 250,125 290,85 160,85" fill="rgba(37,99,235,.3)"/>`;
              s += TX(308, 182, '躺著：上、下 2 面', { fs: 13, c: BLU });
              s += TX(200, 236, '↑ 底面貼著桌面（看不到）', { fs: 12, c: BLU, anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 260', s);
            h.querySelector('#aha').innerHTML = AHA('看得到的只有 3 面，但長方體有 <b>6 個面</b>：4 個側面站著（垂直桌面），上下 2 面躺著（平行桌面）。數面時要把看不到的也想出來。',
              sOn && lOn, '兩個都勾勾看');
          };
          h.querySelector('#sk').onchange = draw;
          h.querySelector('#lk').onchange = draw; draw();
        },
        caption: '站著的都垂直，躺著的才平行：4＋2＝6。',
        example: {
          q: '長方體紙箱平放桌上，幾個面和桌面垂直？',
          steps: ['6 個面中上下 2 面平行桌面。', '剩下 4 個側面都和桌面垂直。'],
          ans: '4 個'
        }
      },

      /* ---------- 透視圖虛線（互動） ---------- */
      {
        sec: '7-1', secName: '面與透視圖',
        title: '透視圖的虛線是被擋住的邊，不是沒有邊',
        points: [
          '看得到的邊畫<span class="k">實線</span>，被擋住的畫虛線。',
          '虛線的邊一樣存在，數邊數面時<b>都要算</b>。',
          '拖滑桿：把虛線調淡，看被擋住的三條邊。'
        ],
        visual: (h) => {
          h.innerHTML = CARD('透視圖上有幾條虛線？把虛線調淡到看不見，那些邊<b>真的不見了嗎</b>？',
            `<label>虛線透明度 ＝ <span class="ival" id="ov">1.0</span></label>
            <input type="range" id="os" min="0" max="10" step="1" value="10">`);
          let faded = false;
          const draw = () => {
            const v = +h.querySelector('#os').value;
            const op = v / 10;
            h.querySelector('#ov').textContent = op.toFixed(1);
            if (v < 10) faded = true;
            let s = cuboid(130, 90, 120, 85, 40, { dop: op });
            // 被擋住的頂點：虛線交會處
            s += `<circle cx="170" cy="135" r="5" fill="${RED}" opacity="${Math.max(op, 0.25)}"/>`;
            s += TX(300, 110, '虛線 3 條', { fs: 14, c: C });
            s += TX(300, 135, '交在 1 個', { fs: 14, c: C });
            s += TX(300, 158, '看不到的頂點', { fs: 14, c: C });
            s += TX(220, 222, '實線 9 條 ＋ 虛線 3 條 ＝ 12 條邊', { fs: 15, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 236', s);
            h.querySelector('#aha').innerHTML = AHA('虛線是被前面擋住的邊。調淡了只是「看不到」，邊還在：<b>長方體一定有 12 條邊、8 個頂點、6 個面</b>，數的時候虛線也要算。',
              faded, '把透明度往左拖');
          };
          h.querySelector('#os').oninput = draw; draw();
        },
        caption: '透明度調到 0，虛線消失但邊還在：數面時別漏。',
        example: {
          q: '透視圖中的虛線代表什麼？',
          steps: ['虛線是被立體擋住、看不到的邊。', '它真實存在，計算時一樣要算進去。'],
          ans: '被擋住的邊'
        }
      },

      /* ---------- 表面積公式 ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '表面積＝2×(兩兩相乘的和)：三組相對面各算一次',
        points: [
          '三組面：前後、左右、上下，每組 2 個相同。',
          '公式：<b>2×(長×寬＋長×高＋寬×高)</b>。',
          '正方體更快：\\(6×\\)邊長\\(×\\)邊長（邊長 5→150）。'
        ],
        formula: { label: '表面積', tex: 'S=2(ab+bc+ca)' },
        visual: (h) => {
          h.innerHTML = CARD('長 4、寬 3、高 2 公分的盒子，6 個面要一個一個算嗎？把盒子<b>拆開攤平</b>看看。',
            `<label>步驟 <span class="ival" id="tv">1</span>／3</label>
            <input type="range" id="ts" min="1" max="3" step="1" value="1">`);
          let done = false;
          const u = 22, L = 4, Wd = 3, H = 2;
          const F = { top: '#bfdbfe', fb: '#fecdd3', side: '#bbf7d0' };
          const face = (x, y, w, hh, fill, txt) => `<rect x="${x}" y="${y}" width="${w * u}" height="${hh * u}" fill="${fill}" stroke="#1f2a37" stroke-width="1.6"/>` +
            TX(x + w * u / 2, y + hh * u / 2 + 5, txt, { fs: 12, c: '#172033', anchor: 'middle' });
          const draw = () => {
            const t = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = t;
            if (t === 3) done = true;
            let s = '';
            if (t === 1) {
              s += cuboid(140, 110, L * 36, H * 36, 50, {});
              s += TX(140 + L * 18, 110 + H * 36 + 20, '長 4', { fs: 13, c: C, anchor: 'middle' });
              s += TX(140 + L * 36 + 58, 110 + H * 18 - 10, '高 2', { fs: 13, c: C });
              s += TX(140 + L * 36 + 44, 80, '寬 3', { fs: 13, c: C });
              s += TX(220, 228, '6 個面，看得到 3 個', { fs: 14, c: '#172033', anchor: 'middle' });
            } else if (t === 2) {
              const x0 = 220 - (Wd + L + Wd) * u / 2, xc = x0 + Wd * u;
              s += face(xc, 8, L, H, F.fb, '後 4×2');
              s += face(xc, 8 + H * u, L, Wd, F.top, '上 4×3');
              s += face(xc, 8 + (H + Wd) * u, L, H, F.fb, '前 4×2');
              s += face(xc, 8 + (2 * H + Wd) * u, L, Wd, F.top, '下 4×3');
              s += face(x0, 8 + (H + Wd) * u, Wd, H, F.side, '左 3×2');
              s += face(xc + L * u, 8 + (H + Wd) * u, Wd, H, F.side, '右 3×2');
              s += TX(330, 30, '同顏色的', { fs: 12, c: '#657187', anchor: 'middle' });
              s += TX(330, 48, '一樣大？', { fs: 12, c: '#657187', anchor: 'middle' });
            } else {
              const rows = [['上下', L, Wd, F.top, 12], ['前後', L, H, F.fb, 8], ['左右', Wd, H, F.side, 6]];
              rows.forEach(([nm, w, hh, fill, a], i) => {
                const y = 14 + i * 76;
                s += face(40, y, w, hh, fill, '') + face(40 + w * u + 12, y, w, hh, fill, '');
                s += TX(40 + 2 * w * u + 30, y + hh * u / 2 + 5, nm + '：' + a + ' 平方公分 × 2', { fs: 13, c: '#172033' });
              });
              s += TX(220, 236, '2 ×（12 ＋ 8 ＋ 6）＝ 2 × 26 ＝ 52 平方公分', { fs: 15, c: RED, anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 248', s);
            h.querySelector('#aha').innerHTML = AHA('相對的兩面<b>一模一樣大</b>，所以只要算 3 種面積再 ×2。正方體更簡單：6 面全一樣，算 1 面 ×6 就好。',
              done, '拖到第 3 步');
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '三組面各算一次再兩倍，正方體是六倍一面。',
        example: {
          q: '邊長 5 公分的正方體，表面積是多少？',
          steps: ['一面 \\(5\\times 5=25\\)。', '\\(25\\times 6=150\\) 平方公分。'],
          ans: '150 平方公分'
        }
      },

      /* ---------- 蛋糕表面積（互動） ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '蛋糕 18×12×6：表面積 2×(216＋108＋72)＝792',
        points: [
          '三組面：18×12＝216、18×6＝108、12×6＝72。',
          '和＝396，兩倍＝<b>792 平方公分</b>。',
          '拖滑桿：把蛋糕切成 n 份，看總表面積怎麼變。'
        ],
        formula: { label: '蛋糕', tex: 'S=2(216+108+72)=792' },
        visual: (h) => {
          h.innerHTML = CARD('蛋糕切成好幾塊後，<b>每一塊的表面積加起來</b>，會比原來多、少、還是一樣？',
            `<label>切成 n 份，n ＝ <span class="ival" id="nv">1</span></label>
            <input type="range" id="ns" min="0" max="3" step="1" value="0">`);
          const Ns = [1, 2, 4, 8], Tot = [792, 1224, 1440, 1584];
          const CUT = ['', '平切（+2 個 18×12）', '前後切（+2 個 18×6）', '左右切（+2 個 12×6）'];
          let cut = false;
          const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${RED}" stroke-width="3"/>`;
          const draw = () => {
            const i = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = Ns[i];
            if (i > 0) cut = true;
            // 長 18 → 180、高 6 → 60、寬 12 → 斜深 50
            let s = cuboid(30, 110, 180, 60, 50, {});
            if (i >= 1) s += L(30, 140, 210, 140) + L(210, 140, 260, 90);
            if (i >= 2) s += L(55, 85, 235, 85) + L(235, 85, 235, 145);
            if (i >= 3) s += L(120, 110, 120, 170) + L(120, 110, 170, 60);
            s += TX(120, 200, '18 × 12 × 6 的蛋糕', { fs: 12, c: '#657187', anchor: 'middle' });
            s += TX(345, 70, '共 ' + Ns[i] + ' 塊', { fs: 16, c: C, anchor: 'middle' });
            s += TX(345, 100, '表面積總和 ' + Tot[i], { fs: 15, c: RED, anchor: 'middle' });
            s += TX(345, 126, '比原來多 ' + (Tot[i] - 792), { fs: 13, c: '#172033', anchor: 'middle' });
            for (let k = 1; k <= i; k++) s += TX(345, 140 + k * 20, '第 ' + k + ' 刀：' + CUT[k], { fs: 11, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 220', s);
            h.querySelector('#aha').innerHTML = AHA('紅線是刀口。每切一刀，刀口兩邊各露出一個<b>原本藏在裡面的新面</b>，所以總表面積只會變多。切成 8 塊，多出來的剛好跟原來一樣多（792）。',
              cut, '把 n 拖大，切切看');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝8 時總表面 1584：比原來多 792，切面全是新長出來的。',
        example: {
          q: '蛋糕 18cm×12cm×6cm，表面積幾平方公分？',
          steps: ['\\(2\\times(216+108+72)\\)。', '\\(=2\\times 396=792\\)。'],
          ans: '792 平方公分'
        }
      },

      /* ---------- 切一刀多兩面（互動） ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '切一刀多兩個切面：總表面積只會增加',
        points: [
          '每一刀切開，左右各露一個新面，共 <b>＋2 面</b>。',
          '所以 8 份總和 1584＞原來 792，增加 792。',
          '拖滑桿加平切的刀數，看總面積一次加多少。'
        ],
        formula: { label: '切分', tex: '\\text{總表面}=792+432k' },
        visual: (h) => {
          h.innerHTML = CARD('一直平切下去，每多一刀，表面積總和會多多少？<b>每刀都一樣多嗎？</b>',
            `<label>平切 k ＝ <span class="ival" id="kv">0</span> 刀</label>
            <input type="range" id="ks" min="0" max="3" step="1" value="0">`);
          const seen = new Set();
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            h.querySelector('#kv').textContent = k;
            seen.add(k);
            const tot = 792 + 432 * k, gap = 18, th = (120 - gap * k) / (k + 1);
            let s = TX(130, 22, '側面看：拉開每一層', { fs: 12, c: '#657187', anchor: 'middle' });
            for (let j = 0; j <= k; j++) {
              const y = 36 + j * (th + gap);
              s += `<rect x="40" y="${y}" width="180" height="${th}" rx="3" fill="#fde68a" stroke="${C}" stroke-width="2"/>`;
              if (j > 0) s += `<line x1="40" y1="${y}" x2="220" y2="${y}" stroke="${RED}" stroke-width="4"/>`;
              if (j < k) s += `<line x1="40" y1="${y + th}" x2="220" y2="${y + th}" stroke="${RED}" stroke-width="4"/>`;
              if (j < k) s += TX(232, y + th + gap / 2 + 5, '新 2 面', { fs: 11, c: RED });
            }
            s += TX(345, 70, k + ' 刀 → ' + (k + 1) + ' 層', { fs: 16, c: C, anchor: 'middle' });
            s += TX(345, 102, '新面：' + (2 * k) + ' 個 18×12', { fs: 13, c: RED, anchor: 'middle' });
            s += TX(345, 130, '792 ＋ 432 × ' + k, { fs: 14, c: '#172033', anchor: 'middle' });
            s += TX(345, 156, '＝ ' + tot + ' 平方公分', { fs: 15, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 172', s);
            h.querySelector('#aha').innerHTML = AHA('每一刀都讓刀口的上下各多一個 18×12 的面：<b>每刀固定多 2×216＝432</b>。刀數加 1，總表面積就加 432，像在數倍數一樣規律。',
              seen.size >= 3, '多拖幾個刀數看看（已看 ' + seen.size + ' 種）');
          };
          h.querySelector('#ks').oninput = draw; draw();
        },
        caption: '紅線是平切的刀口：每多一刀，總表面多 432。',
        example: {
          q: '蛋糕平分 8 份後，表面積增加還是減少？差多少？',
          steps: ['8 份每份 198，總和 \\(198\\times 8=1584\\)。', '\\(1584-792=792\\)。'],
          ans: '增加 792 平方公分'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '長方體三個坑：單位、切分方向、虛線漏數',
        points: [
          '表面積單位是<span class="k">平方</span>公分，不是立方公分。',
          '切分後總表面積<b>增加</b>，不是減少也不是不變。',
          '數面數邊時虛線也要算，不能當沒看到。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['正方體表面積 150 立方公分', '150 平方公分：表面積是面的大小，一律用平方'],
            ['切 8 份總表面積還是 792', '切開多切面：總和 1584，增加 792'],
            ['透視圖只數實線的面', '虛線的邊和面都存在，6 面一個不能少']
          ]);
        },
        caption: '單位、增減、虛線：三坑填平，長方體滿分。',
        example: {
          q: '每一小塊蛋糕 9cm×6cm×3cm，表面積多少？',
          steps: ['\\(2\\times(54+27+18)\\)。', '\\(=2\\times 99=198\\)。'],
          ans: '198 平方公分'
        }
      }

    ]
  });
})();
