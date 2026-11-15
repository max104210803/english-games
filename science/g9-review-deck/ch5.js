/* ============ 第 5 章　直線運動 ============
   節次：1-1 時間的測量、1-2 位置路徑長與位移、1-3 速率與速度、1-4 加速度與自由落體（課本第 1 章）
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：單擺週期公式、三角函數、相對速度的向量合成、拋體運動的定量計算、微積分。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#e11d48';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GRY = '#64748b';

  // 標準 SVG 包裝：一定要用這個，圖才會自適應欄寬
  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  // 箭頭（自己算三角形箭頭，不用 <marker>，避免同頁多張圖 id 打架）
  const ARW = (x1, y1, x2, y2, c, w = 3) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) return '';
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(11, L), hw = 6;
    const bx = x2 - ux * hl, by = y2 - uy * hl;
    return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}" fill="${c}"/>`;
  };
  const DASH = (x1, y1, x2, y2, c = GRY) => SV.seg(x1, y1, x2, y2, c, 1.5, '5 4');
  const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1));
  // 座標軸（原點 x0,y0；往右 w、往上 h）
  const AXES = (x0, y0, w, h, xl, yl) =>
    ARW(x0, y0, x0 + w, y0, INK, 2) + ARW(x0, y0, x0, y0 - h, INK, 2) +
    TX(x0 + w, y0 + 18, xl, { fs: 12, c: GRY, anchor: 'end' }) + TX(x0 - 6, y0 - h + 4, yl, { fs: 12, c: GRY, anchor: 'end' });

  // 易錯對照表（HTML，左右兩欄）
  function xo(rows) {
    // class 名（xo／xo-bad／xo-good／xo-h／xo-t）供 theme-dark.css 深色模式覆蓋行內色
    return `<div class="xo" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:8px">` +
      rows.map(r => `<div style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-bad" style="flex:1;background:#fdeef2;border:1.5px solid #f3c4d0;border-radius:12px;padding:7px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:2px">✗ 常見錯誤</div>
          <div class="xo-t" style="font-size:13.5px;color:#172033;line-height:1.55">${r[0]}</div></div>
        <div class="xo-good" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:7px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:2px">✓ 正確想法</div>
          <div class="xo-t" style="font-size:13.5px;color:#172033;line-height:1.55">${r[1]}</div></div>
      </div>`).join('') + `</div>`;
  }

  window.DECK.push({
    ch: 5,
    title: '直線運動',
    color: C,
    sections: ['1-1 時間的測量', '1-2 位置路徑長與位移', '1-3 速率與速度', '1-4 加速度與自由落體'],
    slides: [

      /* ---------- 1-1 時間的測量 ---------- */
      {
        sec: '1-1', secName: '時間的測量',
        title: '單擺的週期只看擺長：擺長 4 倍，週期才 2 倍',
        points: [
          '擺動一次 ＝ <span class="k">來回一趟</span>；週期 ＝ 總時間 ÷ 擺動次數。',
          '週期只看<b>擺長</b>：擺錘輕重、擺角（不大時）都不影響。',
          '拖滑桿改擺長：擺長 4 倍週期 2 倍，擺長 9 倍週期 3 倍。'
        ],
        visual: (h) => {
          const Ls = [25, 49, 100, 144, 225];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>擺長 ＝ <span class="ival" id="lv">100</span> cm</label>
            <input type="range" id="ls" min="0" max="4" step="1" value="2"></div></div>`;
          const draw = () => {
            const L = Ls[+h.querySelector('#ls').value], T = 0.2 * Math.sqrt(L);
            h.querySelector('#lv').textContent = L;
            const px = 130, py = 30, len = L * 0.95, a = 15 * Math.PI / 180;
            let s = `<rect x="${px - 50}" y="${py - 10}" width="100" height="10" fill="#94a3b8"/>`;
            [-a, a].forEach(t => {
              const bx = px + len * Math.sin(t), by = py + len * Math.cos(t);
              s += DASH(px, py, bx, by) + `<circle cx="${bx}" cy="${by}" r="12" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>`;
            });
            s += SV.seg(px, py, px, py + len, INK, 2.5) + `<circle cx="${px}" cy="${py + len}" r="13" fill="${C}" stroke="#fff" stroke-width="2"/>`;
            s += SV.seg(px - 66, py, px - 66, py + len, BLU, 2) + TX(px - 72, py + len / 2, `${L} cm`, { fs: 12, c: BLU, anchor: 'end' });
            s += BOX(262, 60, 168, 150, { r: 14, fill: '#fff7f9', stroke: '#f3c4d0' });
            s += TX(346, 92, '週期約', { fs: 14, c: GRY, anchor: 'middle' });
            s += TX(346, 128, `${fmt(T)} 秒`, { fs: 28, c: C, anchor: 'middle' });
            s += TX(346, 162, `擺長 × ${fmt(L / 25)}（比 25 cm）`, { fs: 12, c: INK, anchor: 'middle' });
            s += TX(346, 186, `週期 × ${fmt(T)}`, { fs: 12, c: INK, anchor: 'middle' });
            s += TX(346, 250, '擺錘換重一倍：週期不變', { fs: 13, c: GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ls').oninput = draw; draw();
        },
        caption: '數字是實驗的近似值。擺鐘走太快 → 週期太短 → 把擺長調長。',
        example: {
          q: '擺長 36 cm 的單擺週期約 1.2 s。擺長改成 144 cm，週期約多少？',
          steps: ['擺長變成 \\(144\\div36=4\\) 倍。', '週期變 2 倍：\\(1.2\\times2=2.4\\) s。'],
          ans: '約 \\(2.4\\) s'
        }
      },
      {
        sec: '1-1', secName: '時間的測量',
        title: '數時間先數「間隔」：連拍 7 張照片只有 6 段時間',
        points: [
          '連拍照片、閃光攝影、敲鐘、打點：<span class="k">時間間隔數 ＝ 個數 − 1</span>。',
          '單擺的閃光照片：從一端擺到另一端只有<b>半個</b>週期。',
          '每 0.2 秒拍一張。拖滑桿改照片張數，數數看中間有幾段。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>照片 <span class="ival" id="nv">7</span> 張</label>
            <input type="range" id="ns" min="2" max="10" step="1" value="7"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value, gap = 360 / 9;
            h.querySelector('#nv').textContent = n;
            const x0 = 220 - gap * (n - 1) / 2;
            let s = '';
            for (let i = 0; i < n; i++) {
              const x = x0 + gap * i;
              s += BOX(x - 15, 90, 30, 40, { r: 5, fill: '#e0f2fe', stroke: '#0284c7' }) + TX(x, 116, i + 1, { fs: 13, c: '#0369a1', anchor: 'middle' });
              if (i < n - 1) {
                const m = x + gap / 2;
                s += `<path d="M ${x + 3} 146 Q ${m} 172 ${x + gap - 3} 146" fill="none" stroke="${C}" stroke-width="2.5"/>`;
                s += TX(m, 188, '0.2', { fs: 11, c: C, anchor: 'middle' });
              }
            }
            s += TX(220, 60, `${n} 張照片`, { fs: 18, c: '#0369a1', anchor: 'middle' });
            s += TX(220, 232, `中間只有 ${n - 1} 段`, { fs: 18, c: C, anchor: 'middle' });
            s += TX(220, 262, `總時間 ＝ ${n - 1} × 0.2 ＝ ${fmt((n - 1) * 0.2)} 秒`, { fs: 16, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '同樣的坑：植樹問題、打點計時器的點數，第 1 聲到第 9 聲也只有 8 段。',
        example: {
          q: '鐘樓敲鐘，第 1 聲到第 13 聲共 36 秒，每兩聲相隔幾秒？',
          steps: ['13 聲之間有 \\(13-1=12\\) 段。', '\\(36\\div12=3\\) 秒。'],
          ans: '\\(3\\) 秒'
        }
      },
      {
        sec: '1-1', secName: '時間的測量',
        title: '1-1 五個坑：一次、質量、倍數、調擺長、只測一次',
        points: [
          '先蓋住右欄，自己說說看錯在哪裡。',
          '單擺題先問：題目說的「一次」是來回，還是單程？',
          '週期和擺長的關係不是正比：擺長要 4 倍，週期才 2 倍。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['從左端擺到右端算擺動一次', '要<b>來回</b>一趟才算一次，單程只有半次'],
            ['擺錘越重，週期越長', '週期和擺錘質量無關，看<b>擺長</b>'],
            ['擺長 2 倍，週期就 2 倍', '擺長要 <b>4 倍</b>，週期才 2 倍'],
            ['擺鐘走太快，把擺長調短', '走太快 ＝ 週期太短 → 擺長<b>調長</b>'],
            ['只測一次擺動就當週期', '測 <b>10 次</b>以上的總時間再除，減少反應時間誤差']
          ]);
        },
        caption: '第四條最容易反過來：先想「快」代表週期變長還是變短。',
        example: {
          q: '擺鐘每天慢 5 分鐘，擺長要怎麼調？',
          steps: ['慢 → 擺得太慢 → 週期太長。', '週期要變短 → 擺長調短。'],
          ans: '把擺長調短'
        }
      },

      /* ---------- 1-2 位置路徑長與位移 ---------- */
      {
        sec: '1-2', secName: '位置路徑長與位移',
        title: '位移只看頭尾：中間繞多遠，路徑長會變，位移不變',
        points: [
          '<span class="k">位移</span> ＝ 末位置 − 初位置，有正負（方向）；<span class="k">路徑長</span>是走過的總長，只會增加。',
          '從 \\(x=+2\\) 出發，往東走到折返點，再往西走到 \\(x=-3\\)。拖滑桿改折返點。',
          '「A 對 B 的位置」＝ A 的位置 − B 的位置，等於以 B 當原點看 A。'
        ],
        formula: { label: '位移', tex: '\\Delta x=x_{\\text{末}}-x_{\\text{初}}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>折返點 x ＝ <span class="ival" id="pv">6</span> m</label>
            <input type="range" id="ps" min="3" max="9" step="1" value="6"></div></div>`;
          const X = (m) => 40 + (m + 4) * 27;
          const draw = () => {
            const P = +h.querySelector('#ps').value;
            h.querySelector('#pv').textContent = P;
            let s = SV.seg(28, 170, 426, 170, INK, 2);
            for (let m = -4; m <= 10; m++) s += SV.seg(X(m), 165, X(m), 175, INK, 1.5) + TX(X(m), 192, m, { fs: 11, c: m === 0 ? INK : GRY, anchor: 'middle' });
            s += TX(426, 156, '東 →', { fs: 12, c: GRY, anchor: 'end' });
            s += ARW(X(2), 112, X(P), 112, GRN, 3.5) + TX((X(2) + X(P)) / 2, 102, `${P - 2} m`, { fs: 12, c: GRN, anchor: 'middle' });
            s += ARW(X(P), 140, X(-3), 140, AMB, 3.5) + TX((X(P) + X(-3)) / 2, 158, `${P + 3} m`, { fs: 12, c: AMB, anchor: 'middle' });
            s += SV.dot(X(2), 170, BLU, 6) + TX(X(2), 84, '起點', { fs: 12, c: BLU, anchor: 'middle' });
            s += ARW(X(2), 214, X(-3), 214, RED, 4);
            s += TX(220, 42, `路徑長 ＝ ${P - 2} ＋ ${P + 3} ＝ ${2 * P + 1} m`, { fs: 17, c: AMB, anchor: 'middle' });
            s += TX(220, 246, '位移 ＝ (−3) − (+2) ＝ −5 m', { fs: 17, c: RED, anchor: 'middle' });
            s += TX(220, 270, '（向西 5 m，和折返點無關）', { fs: 13, c: GRY, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 282', s);
          };
          h.querySelector('#ps').oninput = draw; draw();
        },
        caption: '不管折返點在哪，位移都是向西 5 m；路徑長一定 ≥ 位移的大小。',
        example: {
          q: '甲在原點東方 8 m，乙在原點西方 3 m。「甲對乙的位置」是什麼？',
          steps: ['以東為正：甲 \\(+8\\)、乙 \\(-3\\)。', '甲對乙 \\(=8-(-3)=+11\\) m。'],
          ans: '在乙的東方 \\(11\\) m'
        }
      },
      {
        sec: '1-2', secName: '位置路徑長與位移',
        title: '繞著圓走：路徑長是弧長，位移是起點到終點的那條弦',
        points: [
          '半徑 10 m 的圓形跑道，從 S 點出發沿圓周跑。拖滑桿改跑過的角度。',
          '跑 60°：位移剛好等於<b>半徑</b>；跑 90°：位移 ＝ √2 × 半徑；跑半圈：位移 ＝ <b>直徑</b>。',
          '跑一整圈回到起點：路徑長 \\(2\\pi r\\)，位移 <b>0</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>跑過 <span class="ival" id="tv">60</span>°</label>
            <input type="range" id="ts" min="0" max="12" step="1" value="2"></div></div>`;
          const draw = () => {
            const th = +h.querySelector('#ts').value * 30, t = th * Math.PI / 180;
            h.querySelector('#tv').textContent = th;
            const cx = 140, cy = 150, R = 100, Sx = cx + R, Sy = cy;
            const Px = cx + R * Math.cos(t), Py = cy - R * Math.sin(t);
            const arc = 2 * Math.PI * 10 * th / 360, chord = 20 * Math.sin(t / 2);
            let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#cbd5e1" stroke-width="10"/>`;
            if (th === 360) s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${AMB}" stroke-width="5"/>`;
            else if (th > 0) s += `<path d="M ${Sx} ${Sy} A ${R} ${R} 0 ${th > 180 ? 1 : 0} 0 ${Px} ${Py}" fill="none" stroke="${AMB}" stroke-width="5"/>`;
            if (th > 0 && th < 360) {
              s += DASH(cx, cy, Sx, Sy) + DASH(cx, cy, Px, Py);
              s += ARW(Sx, Sy, Px, Py, RED, 3.5);
            }
            s += SV.dot(cx, cy, GRY, 3) + SV.dot(Sx, Sy, BLU, 6) + TX(Sx + 10, Sy + 5, 'S', { fs: 15, c: BLU });
            if (th > 0 && th < 360) s += SV.dot(Px, Py, RED, 6);
            const note = { 60: '＝ 半徑', 90: '＝ √2 × 半徑', 180: '＝ 直徑', 360: '回到起點' }[th] || '';
            s += TX(268, 92, `跑過 ${th}°`, { fs: 16, c: INK });
            s += TX(268, 130, `路徑長 ${fmt(arc)} m`, { fs: 15, c: AMB });
            s += TX(268, 166, `位移 ${fmt(chord)} m`, { fs: 15, c: RED });
            if (note) s += TX(268, 194, note, { fs: 14, c: RED });
            s += TX(268, 236, 'π 取 3.14…', { fs: 12, c: GRY });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '60° 時，圓心、起點、終點連成正三角形，所以位移剛好等於半徑 10 m。',
        example: {
          q: '半徑 5 m 的圓形水池，小華沿池邊走了半圈。路徑長和位移的大小各是多少？（π 取 3.14）',
          steps: ['路徑長 ＝ 半圓周 \\(=3.14\\times5=15.7\\) m。', '位移 ＝ 直徑 \\(=10\\) m。'],
          ans: '路徑長 \\(15.7\\) m，位移 \\(10\\) m'
        }
      },
      {
        sec: '1-2', secName: '位置路徑長與位移',
        title: '1-2 五個坑：走多遠、方向、半圈、相減順序、誰對誰',
        points: [
          '先蓋住右欄，自己說說看錯在哪裡。',
          '位移題一律先畫數線或圖，標出<b>起點</b>和<b>終點</b>。',
          '相減一律是「後面的 − 前面的」：末 − 初、A 對 B ＝ A − B。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['位移就是走了多遠', '那是路徑長；位移只看<b>起點到終點</b>'],
            ['位移不用寫方向', '位移一定要有<b>方向</b>（正負號）'],
            ['跑半圈的位移是半圓周 πr', '半圈的位移是<b>直徑 2r</b>'],
            ['位移 ＝ 初位置 − 末位置', '<b>末</b>位置 − <b>初</b>位置'],
            ['「A 對 B 的位置」＝ B − A', '＝ <b>A − B</b>，以 B 為原點看 A']
          ]);
        },
        caption: '路徑長只會越走越多；位移可以變小，甚至回到 0。',
        example: {
          q: '繞 400 m 的操場跑 2 圈回到起點，路徑長和位移各是多少？',
          steps: ['路徑長 \\(=400\\times2=800\\) m。', '回到起點 → 位移 \\(=0\\)。'],
          ans: '\\(800\\) m；\\(0\\)'
        }
      },

      /* ---------- 1-3 速率與速度 ---------- */
      {
        sec: '1-3', secName: '速率與速度',
        title: '來回的平均速率：總路程 ÷ 總時間，不能把兩個速率直接平均',
        points: [
          '<span class="k">平均速率</span> ＝ 總路徑長 ÷ 總時間；<span class="k">平均速度</span> ＝ 總位移 ÷ 總時間。',
          '去程 120 km、時速 60；回程走同一條路。拖滑桿改回程時速。',
          '慢的那段花的時間比較久，平均值會被拉向<b>慢</b>的那一邊。'
        ],
        formula: { label: '平均速率', tex: '\\bar v=\\frac{\\text{總路徑長}}{\\text{總時間}}' },
        visual: (h) => {
          const V = [20, 30, 40, 60, 80, 120];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>回程時速 <span class="ival" id="vv">40</span> km/h</label>
            <input type="range" id="vs" min="0" max="5" step="1" value="2"></div></div>`;
          const draw = () => {
            const v2 = V[+h.querySelector('#vs').value], t2 = 120 / v2, T = 2 + t2, avg = 240 / T;
            h.querySelector('#vv').textContent = v2;
            const x0 = 70, K = 45;
            let s = TX(x0 - 8, 72, '去程', { fs: 13, c: BLU, anchor: 'end' }) + BOX(x0, 56, 2 * K, 24, { r: 6, fill: '#dbeafe', stroke: BLU });
            s += TX(x0 + K, 73, '2 h', { fs: 12, c: BLU, anchor: 'middle' });
            s += TX(x0 - 8, 118, '回程', { fs: 13, c: AMB, anchor: 'end' }) + BOX(x0 + 2 * K, 102, t2 * K, 24, { r: 6, fill: '#fef3c7', stroke: AMB });
            s += TX(x0 + 2 * K + t2 * K / 2, 119, `${fmt(t2)} h`, { fs: 12, c: AMB, anchor: 'middle' });
            s += SV.seg(x0, 146, x0 + 8 * K, 146, INK, 1.5);
            for (let i = 0; i <= 8; i++) s += SV.seg(x0 + i * K, 142, x0 + i * K, 150, INK, 1.5) + TX(x0 + i * K, 166, i, { fs: 11, c: GRY, anchor: 'middle' });
            s += TX(x0 + 8 * K, 184, '時間 (h)', { fs: 11, c: GRY, anchor: 'end' });
            s += TX(220, 212, `總時間 ＝ 2 ＋ ${fmt(t2)} ＝ ${fmt(T)} h`, { fs: 15, c: INK, anchor: 'middle' });
            s += TX(220, 238, `平均速率 ＝ 240 ÷ ${fmt(T)} ＝ ${fmt(avg)} km/h`, { fs: 16, c: GRN, anchor: 'middle' });
            s += TX(220, 262, v2 === 60 ? '兩段一樣快，直接平均也對' : `直接平均 (60＋${v2})÷2 ＝ ${fmt((60 + v2) / 2)} ✗`, { fs: 14, c: v2 === 60 ? GRY : RED, anchor: 'middle' });
            s += TX(220, 284, '回到出發點：平均速度 ＝ 0', { fs: 13, c: VIO, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 294', s);
          };
          h.querySelector('#vs').oninput = draw; draw();
        },
        caption: '回程時速 40：平均 48 km/h，不是 50。只有兩段花的<b>時間</b>相同，才能直接平均。',
        example: {
          q: '沿同一條山路，上山時速 30 km、下山時速 60 km，來回的平均速率是多少？',
          steps: ['設單程 60 km：上山 2 h、下山 1 h。', '\\(120\\div3=40\\) km/h（不是 45）。'],
          ans: '\\(40\\) km/h'
        }
      },
      {
        sec: '1-3', secName: '速率與速度',
        title: 'x–t 圖：斜率是速度，兩條線相交就是追上',
        points: [
          '<span class="k">x–t 圖</span>的斜率 ＝ 速度：越陡越快，水平線 ＝ <b>靜止</b>。',
          '甲從原點以 10 m/s 出發；乙同時在前方 60 m 處，以 5 m/s 同向前進。拖滑桿看時間。',
          '兩線交點：同一時刻、同一位置 → <b>追上</b>（相遇）。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>t ＝ <span class="ival" id="tv">6</span> s</label>
            <input type="range" id="ts" min="0" max="15" step="1" value="6"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value, xa = 10 * t, xb = 60 + 5 * t;
            h.querySelector('#tv').textContent = t;
            const x0 = 60, y0 = 184, KX = 20, KY = 0.9, P = (tt, x) => [x0 + tt * KX, y0 - x * KY];
            let s = AXES(x0, y0, 345, 160, 't (s)', 'x (m)');
            [0, 5, 10, 15].forEach(v => s += TX(x0 + v * KX, y0 + 16, v, { fs: 11, c: GRY, anchor: 'middle' }));
            [50, 100, 150].forEach(v => s += TX(x0 - 6, y0 - v * KY + 4, v, { fs: 11, c: GRY, anchor: 'end' }) + DASH(x0, y0 - v * KY, x0 + 300, y0 - v * KY, '#e2e8f0'));
            s += SV.seg(...P(0, 0), ...P(15, 150), C, 3) + SV.seg(...P(0, 60), ...P(15, 135), BLU, 3);
            s += TX(...P(15.3, 150), '甲', { fs: 13, c: C }) + TX(...P(15.3, 132), '乙', { fs: 13, c: BLU });
            s += SV.dot(...P(12, 120), GRN, 6) + TX(P(12, 120)[0] - 8, P(12, 120)[1] - 12, '追上 (12 s, 120 m)', { fs: 12, c: GRN, anchor: 'end' });
            s += DASH(...P(t, 0), ...P(t, 150), VIO) + SV.dot(...P(t, xa), C, 5) + SV.dot(...P(t, xb), BLU, 5);
            // 下方道路
            const R = (x) => 60 + x * 2;
            s += SV.seg(R(0), 236, R(150), 236, '#94a3b8', 8);
            s += `<circle cx="${R(xa)}" cy="226" r="7" fill="${C}"/>` + `<circle cx="${R(xb)}" cy="246" r="7" fill="${BLU}"/>`;
            const msg = xa < xb ? `乙在前 ${xb - xa} m` : xa === xb ? '追上了！' : `甲在前 ${xa - xb} m`;
            s += TX(220, 280, `甲 ${xa} m、乙 ${xb} m：${msg}`, { fs: 15, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 292', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '甲的線比較陡 ＝ 比較快；12 s 時兩線相交，甲在 120 m 處追上乙。',
        example: {
          q: '甲從原點以 4 m/s 出發，乙同時從 \\(x=30\\) m 處以 1 m/s 同向前進。何時、何處甲追上乙？',
          steps: ['\\(4t=30+t\\)，\\(t=10\\) s。', '位置 \\(x=4\\times10=40\\) m。'],
          ans: '\\(10\\) s 時在 \\(x=40\\) m'
        }
      },
      {
        sec: '1-3', secName: '速率與速度',
        title: '鳴笛聽回聲：聲音的路程加上車子的路程，等於 2 倍距離',
        points: [
          '車子朝山壁開，按喇叭後聲音跑去再彈回來；這段時間車子也往前開了。',
          '畫線段圖：<span class="k">聲程 ＋ 車程 ＝ 2L</span>（L 是按喇叭時離山壁的距離）。',
          '車子遠離山壁時改成：聲程 − 車程 ＝ 2L。'
        ],
        formula: { label: '朝山壁前進', tex: 'v_{\\text{聲}}\\,t+v_{\\text{車}}\\,t=2L' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>按喇叭後 <span class="ival" id="tv">2</span> 秒</label>
            <input type="range" id="ts" min="0" max="8" step="1" value="4"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value / 2, go = 340 * t, car = 20 * t;
            h.querySelector('#tv').textContent = fmt(t);
            const X = (m) => 40 + m * 0.5, back = go > 720;
            const xs = back ? 720 - (go - 720) : go;
            let s = `<rect x="${X(720)}" y="40" width="22" height="190" fill="#a8a29e" stroke="#57534e" stroke-width="2"/>`;
            s += TX(X(720) + 11, 254, '山壁', { fs: 12, c: INK, anchor: 'middle' });
            s += SV.seg(X(0), 210, X(720), 210, '#94a3b8', 6);
            s += SV.seg(X(0), 70, X(Math.min(go, 720)), 70, BLU, 3) + TX(X(0), 60, '聲音去程', { fs: 12, c: BLU });
            if (back) s += SV.seg(X(720), 100, X(xs), 100, BLU, 3) + TX(X(720) - 4, 120, '彈回', { fs: 12, c: BLU, anchor: 'end' });
            if (t > 0) s += `<path d="M ${X(xs) + (back ? -6 : 6)} 132 q ${back ? -10 : 10} 18 0 36" fill="none" stroke="${BLU}" stroke-width="3"/>`;
            s += SV.seg(X(0), 186, X(car), 186, C, 4);
            s += BOX(X(car) - 16, 192, 32, 16, { r: 5, fill: C, stroke: '#9f1239' }) + TX(X(car), 182, '車', { fs: 11, c: C, anchor: 'middle' });
            const hit = Math.abs(xs - car) < 1e-9 && back;
            s += TX(220, 278, hit ? '聽到回聲！ 1360 ＋ 80 ＝ 1440 ＝ 2 × 720' : `聲程 ${fmt(go)} m、車程 ${fmt(car)} m`, { fs: 15, c: hit ? GRN : INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '車速 20 m/s、聲速 340 m/s，按喇叭時離山壁 720 m：4 秒後聲音剛好碰到車子。',
        example: {
          q: '汽車以 10 m/s 朝山壁開去，按喇叭後 2 秒聽到回聲（聲速 340 m/s）。按喇叭時離山壁多遠？',
          steps: ['聲程 \\(340\\times2=680\\) m，車程 \\(10\\times2=20\\) m。', '\\(2L=700\\)，\\(L=350\\) m。'],
          ans: '\\(350\\) m'
        }
      },
      {
        sec: '1-3', secName: '速率與速度',
        title: '1-3 五個坑：平均、水平線、交點、繞圈、單位',
        points: [
          '先蓋住右欄，自己說說看錯在哪裡。',
          '看圖先看縱軸：是 x（位置）還是 v（速度），意思完全不同。',
          '比快慢前先統一單位：km/h ÷ 3.6 ＝ m/s。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['平均速率 ＝ 各段速率相加除以 2', '<b>總路徑長 ÷ 總時間</b>'],
            ['x–t 圖的水平線是等速', 'x–t 水平線是<b>靜止</b>；v–t 水平線才是等速'],
            ['x–t 圖兩線交點代表速度相同', '代表同時同地 ＝ <b>相遇</b>'],
            ['繞圈的等速率運動是等速度運動', '方向一直在變 → 速度在變'],
            ['72 km/h 比 25 m/s 快', '72 ÷ 3.6 ＝ 20 m/s，比 25 m/s <b>慢</b>']
          ]);
        },
        caption: '速度有方向、速率沒有：南下和北上的兩輛車可以速率相同、速度不同。',
        example: {
          q: '把 90 km/h 換成 m/s。',
          steps: ['km/h ÷ 3.6 ＝ m/s。', '\\(90\\div3.6=25\\) m/s。'],
          ans: '\\(25\\) m/s'
        }
      },

      /* ---------- 1-4 加速度與自由落體 ---------- */
      {
        sec: '1-4', secName: '加速度與自由落體',
        title: 'v–t 圖：斜率是加速度，圖下面的面積是位移',
        points: [
          '<span class="k">加速度</span> ＝ 速度變化 ÷ 時間，在 v–t 圖上就是直線的<b>斜率</b>。',
          '圖線和時間軸圍出的<b>面積</b> ＝ 位移；等加速度時是梯形面積。',
          '初速 4 m/s、加速度 2 m/s²。拖滑桿看速度和面積怎麼長大。'
        ],
        formula: { label: '等加速度', tex: 'v=v_{0}+at,\\quad \\Delta x=\\frac{v_{0}+v}{2}\\times t' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>t ＝ <span class="ival" id="tv">5</span> s</label>
            <input type="range" id="ts" min="0" max="6" step="1" value="5"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value, v = 4 + 2 * t, A = (4 + v) / 2 * t;
            h.querySelector('#tv').textContent = t;
            const x0 = 60, y0 = 250, KX = 50, KY = 12, P = (tt, vv) => [x0 + tt * KX, y0 - vv * KY];
            let s = AXES(x0, y0, 330, 220, 't (s)', 'v (m/s)');
            for (let i = 0; i <= 6; i++) s += TX(x0 + i * KX, y0 + 16, i, { fs: 11, c: GRY, anchor: 'middle' });
            [4, 8, 12, 16].forEach(vv => s += TX(x0 - 6, y0 - vv * KY + 4, vv, { fs: 11, c: GRY, anchor: 'end' }));
            if (t > 0) s += SV.poly([P(0, 0), P(0, 4), P(t, v), P(t, 0)], 'rgba(225,29,72,.16)', C, 1.5);
            s += SV.seg(...P(0, 4), ...P(6, 16), C, 3);
            if (t > 0) s += DASH(...P(0, v), ...P(t, v)) + SV.dot(...P(t, v), C, 5) + TX(P(t, v)[0] + 8, P(t, v)[1] + 4, `${v}`, { fs: 13, c: C });
            s += TX(x0 + 16, 40, `v ＝ 4 ＋ 2 × ${t} ＝ ${v} m/s`, { fs: 15, c: INK });
            s += TX(x0 + 16, 64, `面積 ＝ (4 ＋ ${v}) ÷ 2 × ${t} ＝ ${fmt(A)} m`, { fs: 15, c: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '面積的單位：(m/s) × s ＝ m，所以 v–t 圖下的面積就是位移。',
        example: {
          q: '車子以 6 m/s 行駛，煞車後以 1.5 m/s² 減速到停止。要幾秒？煞車距離多長？',
          steps: ['\\(t=6\\div1.5=4\\) s。', 'v–t 圖是三角形：\\(6\\times4\\div2=12\\) m。'],
          ans: '\\(4\\) s；\\(12\\) m'
        }
      },
      {
        sec: '1-4', secName: '加速度與自由落體',
        title: '由靜止開始等加速：每一秒走的距離是 1：3：5：7',
        points: [
          '由靜止出發的等加速度運動：第 1、2、3… 秒<b>內</b>的位移比 ＝ <span class="k">1：3：5：7…</span>',
          '前 1、2、3… 秒<b>共</b>走的距離比 ＝ 1：4：9：16…（平方）。',
          '加速度 2 m/s²。拖滑桿看第 n 秒內走幾公尺、前 n 秒共走幾公尺。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>第 <span class="ival" id="nv">3</span> 秒</label>
            <input type="range" id="ns" min="1" max="5" step="1" value="3"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const x0 = 60, y0 = 160, KX = 56, KY = 11, P = (tt, vv) => [x0 + tt * KX, y0 - vv * KY];
            let s = AXES(x0, y0, 310, 130, 't (s)', 'v');
            for (let i = 0; i <= 5; i++) s += TX(x0 + i * KX, y0 + 15, i, { fs: 11, c: GRY, anchor: 'middle' });
            for (let k = 1; k <= n; k++) {
              s += SV.poly([P(k - 1, 0), P(k - 1, 2 * (k - 1)), P(k, 2 * k), P(k, 0)], k === n ? 'rgba(225,29,72,.3)' : (k % 2 ? 'rgba(37,99,235,.14)' : 'rgba(37,99,235,.26)'), '#94a3b8', 1);
              s += TX(P(k - 0.5, 0)[0], y0 - 8, 2 * k - 1, { fs: 13, c: k === n ? C : BLU, anchor: 'middle' });
            }
            s += SV.seg(...P(0, 0), ...P(5, 10), INK, 2.5);
            // 下方軌道：位置 k² m
            const R = (m) => 60 + m * 12;
            s += SV.seg(R(0), 220, R(25), 220, '#94a3b8', 4);
            for (let k = 0; k <= n; k++) {
              s += SV.dot(R(k * k), 220, k === n ? C : BLU, 6) + (k ? TX(R(k * k), 242, k * k, { fs: 11, c: GRY, anchor: 'middle' }) : TX(R(0) - 10, 224, '起點', { fs: 11, c: GRY, anchor: 'end' }));
              if (k > 0) s += TX((R(k * k) + R((k - 1) * (k - 1))) / 2, 208, 2 * k - 1, { fs: 11, c: k === n ? C : BLU, anchor: 'middle' });
            }
            s += TX(220, 274, `第 ${n} 秒內走 ${2 * n - 1} m；前 ${n} 秒共走 ${n * n} m`, { fs: 16, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '每一秒的梯形面積就是那一秒走的距離。這個比例只對「由靜止出發」成立。',
        example: {
          q: '物體由靜止做等加速度運動，第 1 秒內走 2 m。第 4 秒內走多少？前 4 秒共走多少？',
          steps: ['第 4 秒內：比例 7 → \\(2\\times7=14\\) m。', '前 4 秒：比例 16 → \\(2\\times16=32\\) m。'],
          ans: '\\(14\\) m；\\(32\\) m'
        }
      },
      {
        sec: '1-4', secName: '加速度與自由落體',
        title: '自由落體：不計空氣阻力，羽毛和鐵球同時落地',
        points: [
          '<span class="k">自由落體</span>：由靜止開始、只受重力落下，加速度 g ≈ 9.8 m/s²（常取 10）。',
          '每秒速度增加 10 m/s；落下的距離和時間的<b>平方</b>成正比（5、20、45 m）。',
          '真空中輕重不同的物體<b>同時</b>落地；平常羽毛慢，是空氣阻力的影響。'
        ],
        formula: { label: '由靜止落下（g 取 10）', tex: 'v=g\\,t,\\quad h=\\frac{0+v}{2}\\times t' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>落下 <span class="ival" id="tv">2</span> 秒</label>
            <input type="range" id="ts" min="0" max="3" step="1" value="2"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value, d = 5 * t * t, v = 10 * t;
            h.querySelector('#tv').textContent = t;
            const Y = (m) => 36 + m * 5;
            let s = BOX(110, 20, 120, 252, { r: 16, fill: 'rgba(226,232,240,.4)', stroke: '#94a3b8' }) + TX(170, 290, '真空管', { fs: 12, c: GRY, anchor: 'middle' });
            [0, 1, 2, 3].forEach(k => {
              const m = 5 * k * k;
              s += DASH(96, Y(m), 244, Y(m), '#cbd5e1') + TX(90, Y(m) + 4, `${m} m`, { fs: 11, c: GRY, anchor: 'end' });
            });
            s += `<circle cx="145" cy="${Y(d)}" r="11" fill="#475569"/>`;
            s += `<path d="M 195 ${Y(d) - 14} q 14 14 0 28 q -8 -14 0 -28 Z" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>`;
            s += TX(145, Y(d) - 16, '鐵球', { fs: 11, c: INK, anchor: 'middle' }) + TX(214, Y(d) + 4, '羽毛', { fs: 11, c: AMB });
            if (t > 0) s += ARW(268, Y(d) - 14, 268, Y(d) - 14 + v * 1.4, C, 4);
            s += BOX(296, 70, 136, 120, { r: 14, fill: '#fff7f9', stroke: '#f3c4d0' });
            s += TX(364, 100, `t ＝ ${t} s`, { fs: 16, c: INK, anchor: 'middle' });
            s += TX(364, 134, `v ＝ ${v} m/s`, { fs: 16, c: C, anchor: 'middle' });
            s += TX(364, 168, `落下 ${d} m`, { fs: 16, c: BLU, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 298', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '每一秒落下 5、15、25 m，也是 1：3：5。',
        example: {
          q: '石頭從 45 m 高處自由落下（g 取 10，不計空氣阻力），幾秒落地？落地速度多大？',
          steps: ['平均速度 × 時間：\\(\\frac{10t}{2}\\times t=45\\)，\\(t^{2}=9\\)。', '\\(t=3\\) s，\\(v=10\\times3=30\\) m/s。'],
          ans: '\\(3\\) s；\\(30\\) m/s'
        }
      },
      {
        sec: '1-4', secName: '加速度與自由落體',
        title: 'v–t 圖的交點只是「速度一樣」：那時兩車離最遠，還沒追上',
        points: [
          '甲由靜止以 2 m/s² 加速，乙同時同地以 10 m/s 等速前進。',
          '速度相同（t ＝ 5 s）以前乙比較快，距離越拉越大；之後甲比較快，開始追近。',
          '追上要看<b>面積</b>（位移）相等：t ＝ 10 s。拖滑桿比較兩塊面積。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>t ＝ <span class="ival" id="tv">5</span> s</label>
            <input type="range" id="ts" min="0" max="12" step="1" value="5"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value, xa = t * t, xb = 10 * t;
            h.querySelector('#tv').textContent = t;
            const x0 = 60, y0 = 180, KX = 25, KY = 5, P = (tt, vv) => [x0 + tt * KX, y0 - vv * KY];
            let s = AXES(x0, y0, 330, 150, 't (s)', 'v (m/s)');
            [0, 5, 10].forEach(v => s += TX(x0 + v * KX, y0 + 15, v, { fs: 11, c: GRY, anchor: 'middle' }));
            [10, 20].forEach(v => s += TX(x0 - 6, y0 - v * KY + 4, v, { fs: 11, c: GRY, anchor: 'end' }));
            if (t > 0) {
              s += SV.poly([P(0, 0), P(0, 10), P(t, 10), P(t, 0)], 'rgba(37,99,235,.15)', 'none', 0);
              s += SV.poly([P(0, 0), P(t, 2 * t), P(t, 0)], 'rgba(225,29,72,.2)', 'none', 0);
            }
            s += SV.seg(...P(0, 10), ...P(12, 10), BLU, 3) + SV.seg(...P(0, 0), ...P(12, 24), C, 3);
            s += TX(...P(12.2, 9), '乙', { fs: 13, c: BLU }) + TX(...P(12.2, 24), '甲', { fs: 13, c: C });
            s += SV.dot(...P(5, 10), GRN, 6) + TX(P(5, 10)[0], P(5, 10)[1] - 12, '速度相同', { fs: 12, c: GRN, anchor: 'middle' });
            s += DASH(...P(t, 0), ...P(t, 25), VIO);
            const R = (m) => 60 + m * 2;
            s += SV.seg(R(0), 226, R(144), 226, '#94a3b8', 8);
            s += `<circle cx="${R(xa)}" cy="216" r="7" fill="${C}"/>` + `<circle cx="${R(xb)}" cy="236" r="7" fill="${BLU}"/>`;
            const msg = xa < xb ? `乙在前 ${xb - xa} m` : xa === xb ? (t ? '追上了！' : '同時出發') : `甲在前 ${xa - xb} m`;
            s += TX(220, 272, `甲 ${xa} m、乙 ${xb} m：${msg}`, { fs: 15, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 284', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: 'x–t 圖的交點才是相遇；v–t 圖的交點是速度相同，常是「相距最遠」或「最近」的時刻。',
        example: {
          q: '甲由靜止以 4 m/s² 加速，乙同時同地以 12 m/s 等速同向前進。何時相距最遠？相距多少？',
          steps: ['速度相同時最遠：\\(4t=12\\)，\\(t=3\\) s。', '乙 \\(12\\times3=36\\) m，甲 \\(\\frac{12}{2}\\times3=18\\) m，相距 \\(18\\) m。'],
          ans: '\\(3\\) s 時，相距 \\(18\\) m'
        }
      },
      {
        sec: '1-4', secName: '加速度與自由落體',
        title: '1-4 六個坑：快與加速、零速度、輕重、圖形、位移、正負號',
        points: [
          '先蓋住右欄，自己說說看錯在哪裡。',
          '加速度看的是速度「改變」，不是速度大小。',
          '算位移不要用末速度，用平均速度或 v–t 圖面積。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['速度越大，加速度越大', '加速度看速度<b>改變</b>的快慢；等速時 a ＝ 0'],
            ['速度為 0，加速度也是 0', '上拋到最高點 v ＝ 0，但 a 仍是 <b>g</b>'],
            ['重的物體落得比較快', '不計空氣阻力時<b>同時</b>落地'],
            ['等加速度的 x–t 圖是直線', 'x–t 是<b>曲線</b>；v–t 才是斜直線'],
            ['位移 ＝ 末速度 × 時間', '用<b>平均速度</b> × 時間（v–t 圖面積）'],
            ['加速度是負的，就是在減速', 'a 和 v <b>同號</b>加速、<b>異號</b>減速']
          ]);
        },
        caption: '最後一條：規定的正方向不同，正負號就不同，要和速度的正負一起看。',
        example: {
          q: '球鉛直上拋到最高點的瞬間，速度和加速度各是多少？（g 取 10）',
          steps: ['最高點速度 \\(=0\\)。', '仍只受重力：加速度 \\(=10\\) m/s²，向下。'],
          ans: '\\(v=0\\)，\\(a=10\\) m/s² 向下'
        }
      }
    ]
  });
})();
