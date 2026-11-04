/* ============ 第 3 章　槓桿與簡單機械：題型攻略 ============
   節次：3-3 力矩與槓桿題型、3-4 簡單機械題型（接續第 2 章「功與能」的觀念頁，這章專攻題型）
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：三角函數、力的分解計算、轉動慣量、角動量、機械效率百分比、摩擦係數。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#059669';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GRY = '#64748b';

  // 標準 SVG 包裝：一定要用這個，圖才會自適應欄寬
  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  // 常用小工具：SVG 文字 / 圓角方塊
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

  // 支點三角形
  const PIV = (x, y, s = 14) => SV.poly([[x, y], [x - s, y + s * 1.6], [x + s, y + s * 1.6]], '#cbd5e1', '#475569', 2);
  // 掛著的砝碼／物體
  const MASS = (x, y, w, label, fill) =>
    `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${w * 0.8}" rx="5" fill="${fill || '#fde68a'}" stroke="#92400e" stroke-width="2"/>` +
    TX(x, y + w * 0.5, label, { fs: 12, anchor: 'middle', c: '#78350f' });
  const fmt = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1));

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
    ch: 3,
    title: '槓桿與簡單機械：題型攻略',
    color: C,
    sections: ['3-3 力矩與槓桿題型', '3-4 簡單機械題型'],
    slides: [

      /* ---------- 3-3 力矩與槓桿題型 ---------- */
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '給我一根夠長的棒子：力臂拉長，小孩也撬得動大石頭',
        points: [
          '挑戰：120 kgw 的石頭離支點 0.5 m，你最多只出得了 <b>30 kgw</b>。',
          '拖滑桿把手往外移，直到撬得動：<span class="k">施力 × 施力臂 ＝ 抗力 × 抗力臂</span>。',
          '先猜：力變小了，你付出的代價是什麼？看看手要壓多深。'
        ],
        formula: { label: '槓桿原理', tex: 'F_{1}\\times d_{1}=F_{2}\\times d_{2}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>手握在離支點 <span class="ival" id="dv">1.0</span> m</label>
            <input type="range" id="ds" min="1" max="6" step="1" value="2"></div></div>`;
          const draw = () => {
            const d = +h.querySelector('#ds').value * 0.5, F = 120 * 0.5 / d, ok = F <= 30;
            h.querySelector('#dv').textContent = d.toFixed(1);
            const px = 120, by = 140, U = 95, hx = px + U * d;
            let s = TX(220, 28, ok ? `只要 ${fmt(F)} kgw，撬得動！` : `要 ${fmt(F)} kgw，太重了…`, { fs: 21, c: ok ? GRN : RED, anchor: 'middle' });
            // 石頭
            s += `<path d="M38 ${by - 6} Q40 ${by - 66} 80 ${by - 70} Q112 ${by - 64} 110 ${by - 6} Z" fill="#a8a29e" stroke="#57534e" stroke-width="2.5"/>`;
            s += TX(74, by - 32, '120 kgw', { fs: 13, c: '#fff', anchor: 'middle' });
            // 棒子與支點
            s += `<rect x="${px - U * 0.5 - 14}" y="${by - 6}" width="${U * 0.5 + 14 + U * 3 + 8}" height="12" rx="6" fill="#b45309" stroke="#78350f" stroke-width="2"/>`;
            s += PIV(px, by + 6, 16);
            s += SV.seg(20, by + 32, 430, by + 32, GRY, 2);
            // 抗力臂、施力臂
            s += SV.seg(px - U * 0.5, by + 48, px, by + 48, BLU, 2.5) + TX(px - U * 0.25, by + 66, '0.5 m', { fs: 12, c: BLU, anchor: 'middle' });
            s += SV.seg(px, by + 48, hx, by + 48, VIO, 2.5) + TX((px + hx) / 2, by + 66, d.toFixed(1) + ' m', { fs: 12, c: VIO, anchor: 'middle' });
            // 手與施力
            s += `<circle cx="${hx}" cy="${by - 16}" r="10" fill="${VIO}" stroke="#fff" stroke-width="2"/>`;
            const fl = Math.min(F * 0.7, 84);                    // 箭頭長度和施力成正比
            s += ARW(hx, by - 28 - fl, hx, by - 28, RED, 4) + TX(hx + 10, by - 34 - fl / 2, 'F', { fs: 15, c: RED });
            // 代價：手要壓下的距離（石頭抬 5 cm）
            const press = 5 * d / 0.5;
            s += TX(220, 252, `石頭抬高 5 cm，手要壓下 ${fmt(press)} cm`, { fs: 15, c: AMB, anchor: 'middle' });
            s += TX(220, 274, `力 ÷ ${fmt(d / 0.5)}，距離 × ${fmt(d / 0.5)}：省力就費距離`, { fs: 13, c: GRY, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ds').oninput = draw; draw();
        },
        caption: '握到 2 m 才剛好 30 kgw；代價是手要壓下 20 cm，石頭才抬起 5 cm。',
        example: {
          q: '石頭 150 kgw 離支點 0.4 m，你只出得了 50 kgw，手至少要握在離支點多遠？',
          steps: ['抗力矩 \\(150\\times0.4=60\\) kgw·m。', '\\(50\\times d=60\\)，\\(d=1.2\\) m。'],
          ans: '\\(1.2\\) m'
        }
      },
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '斜著推最吃虧：力臂是支點到「作用線」的垂直距離',
        points: [
          '力臂不是桿長：從支點畫一條<span class="k">垂直於作用線</span>的線段，才是力臂。',
          '拖滑桿改變推門的角度：垂直推力臂最長，順著門推，作用線穿過門軸，推不動。',
          '題目出現斜向的力、直角三角形時，力臂就是那條垂直虛線。'
        ],
        formula: { label: '力矩', tex: 'M=F\\times d_{\\perp}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>推力和門的夾角 ＝ <span class="ival" id="av">90</span>°</label>
            <input type="range" id="as" min="0" max="6" step="1" value="6"></div></div>`;
          const draw = () => {
            const deg = +h.querySelector('#as').value * 15, t = deg * Math.PI / 180;
            h.querySelector('#av').textContent = deg;
            const Hx = 50, Hy = 120, L = 290, Ex = Hx + L, Ey = Hy;
            const ux = -Math.cos(t), uy = Math.sin(t);           // 推力方向
            const tt = L * Math.cos(t), Px = Ex + ux * tt, Py = Ey + uy * tt;  // 垂足
            const d = Math.sin(t);                                // 門寬 1 m 時的力臂（m）
            let s = '';
            s += TX(220, 26, `力臂 ≈ ${d.toFixed(2)} m，力矩 ≈ ${(10 * d).toFixed(1)} N·m`, { fs: 18, c: d < 0.01 ? RED : VIO, anchor: 'middle' });
            // 牆、門軸、門（俯視）
            s += SV.seg(Hx - 40, Hy, Hx - 6, Hy, '#94a3b8', 8);
            s += `<rect x="${Hx}" y="${Hy - 7}" width="${L}" height="14" rx="4" fill="#d6b88a" stroke="#8a6a3a" stroke-width="2"/>`;
            s += SV.dot(Hx, Hy, INK, 7) + TX(Hx, Hy + 30, '門軸', { fs: 12, c: INK, anchor: 'middle' });
            s += TX(Ex - 4, Hy + 26, '門寬 1 m', { fs: 12, c: '#8a6a3a', anchor: 'end' });
            // 作用線（延長虛線）與力臂
            if (deg > 0) {
              s += SV.seg(Ex, Ey, Px, Py, '#94a3b8', 2, '6 5');
              s += SV.seg(Hx, Hy, Px, Py, BLU, 3.5);
              if (deg < 90) {                                     // 垂足的直角小方框
                const la = Math.hypot(Hx - Px, Hy - Py), ax = (Hx - Px) / la * 10, ay = (Hy - Py) / la * 10, bx = -ux * 10, by2 = -uy * 10;
                s += `<polyline points="${Px + ax},${Py + ay} ${Px + ax + bx},${Py + ay + by2} ${Px + bx},${Py + by2}" fill="none" stroke="${BLU}" stroke-width="2"/>`;
              }
              s += TX((Hx + Px) / 2 - 8, (Hy + Py) / 2 + 20, '力臂', { fs: 13, c: BLU, anchor: 'end' });
            } else {
              s += SV.seg(Hx, Hy - 16, Ex, Ey - 16, '#94a3b8', 2, '6 5');
              s += TX(220, Hy - 24, '作用線穿過門軸 → 力臂 0', { fs: 13, c: RED, anchor: 'middle' });
            }
            // 推力 10 N（畫在門外側，指向門）
            s += ARW(Ex - ux * 80, Ey - uy * 80, Ex - ux * 4, Ey - uy * 4, RED, 4);
            s += TX(Ex - ux * 80 - 8, Ey - uy * 80 + 4, 'F ＝ 10 N', { fs: 13, c: RED, anchor: 'end' });
            // 力矩長條
            s += BOX(80, 252, 280, 16, { r: 8, fill: '#eef2f7', stroke: '#cbd5e1' });
            s += `<rect x="80" y="252" width="${280 * d}" height="16" rx="8" fill="${VIO}"/>`;
            s += TX(76, 265, '力矩', { fs: 12, c: VIO, anchor: 'end' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '同樣 10 N：垂直推力矩 10 N·m；夾角 30° 只剩 5 N·m；順著門推是 0。',
        example: {
          q: '桿長 10 cm，20 gw 的力斜著拉在桿端，支點到作用線的垂直距離是 6 cm，力矩多少？',
          steps: ['力臂用垂直距離 6 cm，不是桿長 10 cm。', '\\(20\\times6=120\\) gw·cm。'],
          ans: '\\(120\\) gw·cm'
        }
      },
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '合力矩像記帳：順時鐘一欄、逆時鐘一欄，最後算差額',
        points: [
          '每個力先問兩件事：<span class="k">力矩多大</span>、讓桿子往哪邊轉。',
          '同方向相加、反方向相減，差額的方向就是桿子轉的方向。',
          '拖滑桿移動右邊 3 kgw 的砝碼，找出剛好平衡的位置。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>3 kgw 掛在支點右邊 <span class="ival" id="xv">4</span> cm</label>
            <input type="range" id="xs" min="1" max="10" step="1" value="4"></div></div>`;
          const draw = () => {
            const x = +h.querySelector('#xs').value;
            h.querySelector('#xv').textContent = x;
            const cw = 1 * 4 + 3 * x, ccw = 2 * 8 + 2 * 3, net = cw - ccw;
            const ang = Math.max(-11, Math.min(11, net * 0.9));
            const P = 220, Y = 120, U = 17;
            let g = `<rect x="${P - 11 * U}" y="${Y - 5}" width="${22 * U}" height="10" rx="5" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>`;
            for (let i = -10; i <= 10; i++) g += SV.seg(P + i * U, Y - 5, P + i * U, Y + 1, '#475569', 1.2);
            g += ARW(P - 8 * U, Y + 6, P - 8 * U, Y + 56, BLU, 3.5) + TX(P - 8 * U, Y + 74, '2 kgw', { fs: 12, c: BLU, anchor: 'middle' });
            g += ARW(P - 4 * U, Y - 6, P - 4 * U, Y - 36, RED, 3.5) + TX(P - 4 * U, Y - 42, '1 kgw', { fs: 12, c: RED, anchor: 'middle' });
            g += ARW(P + 3 * U, Y - 6, P + 3 * U, Y - 46, BLU, 3.5) + TX(P + 3 * U, Y - 52, '2 kgw', { fs: 12, c: BLU, anchor: 'middle' });
            g += ARW(P + x * U, Y + 6, P + x * U, Y + 64, RED, 3.5) + TX(P + x * U, Y + 82, '3 kgw', { fs: 12, c: RED, anchor: 'middle' });
            let s = `<g transform="rotate(${ang} ${P} ${Y})">${g}</g>` + PIV(P, Y + 5, 13);
            s += TX(P - 8 * U, 24, '左8', { fs: 11, c: GRY, anchor: 'middle' }) + TX(P - 4 * U, 24, '左4', { fs: 11, c: GRY, anchor: 'middle' }) + TX(P + 3 * U, 24, '右3', { fs: 11, c: GRY, anchor: 'middle' });
            // 記帳長條（紅＝順時鐘、藍＝逆時鐘）
            const bx = 110, K = 5;
            s += TX(bx - 8, 232, '順時鐘', { fs: 12, c: RED, anchor: 'end' }) + `<rect x="${bx}" y="220" width="${cw * K}" height="15" rx="6" fill="${RED}"/>` + TX(bx + cw * K + 6, 232, `1×4＋3×${x}＝${cw}`, { fs: 12, c: RED });
            s += TX(bx - 8, 256, '逆時鐘', { fs: 12, c: BLU, anchor: 'end' }) + `<rect x="${bx}" y="244" width="${ccw * K}" height="15" rx="6" fill="${BLU}"/>` + TX(bx + ccw * K + 6, 256, '2×8＋2×3＝22', { fs: 12, c: BLU });
            const msg = net === 0 ? '收支打平 → 平衡！' : net > 0 ? `順時鐘多 ${net} → 往右倒` : `逆時鐘多 ${-net} → 往左倒`;
            s += TX(220, 280, msg, { fs: 15, c: net === 0 ? GRN : INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#xs').oninput = draw; draw();
        },
        caption: '左邊向上的力是順時鐘、右邊向上的力是逆時鐘：先看位置再看方向。',
        example: {
          q: '支點在中央：左 5 cm 處 4 kgw 向下、右 2 cm 處 3 kgw 向上、右 6 cm 處 2 kgw 向下，合力矩多少？',
          steps: ['逆時鐘：\\(4\\times5+3\\times2=26\\)。', '順時鐘：\\(2\\times6=12\\)。', '\\(26-12=14\\)，逆時鐘多。'],
          ans: '\\(14\\) kgw·cm，逆時鐘'
        }
      },
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '風鈴式吊掛：從最下層往上算，一層一層打包',
        points: [
          '最下層先平衡，整串的總重再當成上一層的<span class="k">一個物體</span>。',
          '靠近支點的<span class="k">短臂</span>，要掛比較重的那邊。',
          '拖滑桿一步一步看：甲乙丙丁的重量比怎麼算出來。'
        ],
        visual: (h) => {
          const U = 40;
          const scene = (hi, val) => {
            const hl = (n) => (hi === n ? AMB : '#94a3b8');
            let s = SV.seg(170, 14, 430, 14, '#475569', 5);
            // 最上層：吊點 300，左臂 1、右臂 3
            s += SV.seg(300, 14, 300, 56, GRY, 2) + `<rect x="${300 - U}" y="56" width="${4 * U}" height="7" rx="3" fill="${hl(2)}"/>`;
            s += TX(300 - U / 2, 50, '1', { fs: 13, c: INK, anchor: 'middle' }) + TX(300 + 1.5 * U, 50, '3', { fs: 13, c: INK, anchor: 'middle' });
            s += SV.seg(300 + 3 * U, 63, 300 + 3 * U, 96, GRY, 2) + MASS(300 + 3 * U, 96, 34, val.丁 || '丁', '#bfdbfe');
            // 中層：吊點 260，左臂 1、右臂 2
            s += SV.seg(260, 63, 260, 116, GRY, 2) + `<rect x="${260 - U}" y="116" width="${3 * U}" height="7" rx="3" fill="${hl(1)}"/>`;
            s += TX(260 - U / 2, 110, '1', { fs: 13, c: INK, anchor: 'middle' }) + TX(260 + U, 110, '2', { fs: 13, c: INK, anchor: 'middle' });
            s += SV.seg(260 + 2 * U, 123, 260 + 2 * U, 158, GRY, 2) + MASS(260 + 2 * U, 158, 34, val.丙 || '丙', '#fecaca');
            // 最下層：吊點 220，左臂 2（甲）、右臂 1（乙）
            s += SV.seg(220, 123, 220, 182, GRY, 2) + `<rect x="${220 - 2 * U}" y="182" width="${3 * U}" height="7" rx="3" fill="${hl(0)}"/>`;
            s += TX(220 - U, 176, '2', { fs: 13, c: INK, anchor: 'middle' }) + TX(220 + U / 2, 176, '1', { fs: 13, c: INK, anchor: 'middle' });
            s += SV.seg(220 - 2 * U, 189, 220 - 2 * U, 222, GRY, 2) + MASS(220 - 2 * U, 222, 34, val.甲 || '甲', '#bbf7d0');
            s += SV.seg(220 + U, 189, 220 + U, 222, GRY, 2) + MASS(220 + U, 222, 34, val.乙 || '乙', '#bbf7d0');
            if (hi === 1) s += BOX(120, 168, 150, 92, { r: 10, fill: 'none', stroke: AMB, sw: 2.5, dash: '6 4' }) + TX(126, 280, '這整串 ＝ 6', { fs: 12, c: AMB });
            if (hi === 2) s += BOX(116, 104, 262, 160, { r: 10, fill: 'none', stroke: AMB, sw: 2.5, dash: '6 4' }) + TX(122, 284, '這整串 ＝ 6 ＋ 3 ＝ 9', { fs: 12, c: AMB });
            return s;
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '最下層：甲在長臂 2、乙在短臂 1 → 甲 × 2 ＝ 乙 × 1。設甲 ＝ 2，乙就是 4。', d: () => scene(0, { 甲: '2', 乙: '4' }) },
            { t: '中層：左邊短臂 1 掛「甲＋乙 ＝ 6」整串，右邊長臂 2 掛丙 → 6 × 1 ＝ 丙 × 2，丙 ＝ 3。', d: () => scene(1, { 甲: '2', 乙: '4', 丙: '3' }) },
            { t: '最上層：左邊短臂 1 掛「6 ＋ 3 ＝ 9」，右邊長臂 3 掛丁 → 9 × 1 ＝ 丁 × 3，丁 ＝ 3。', d: () => scene(2, { 甲: '2', 乙: '4', 丙: '3', 丁: '3' }) },
            { t: '答案：甲：乙：丙：丁 ＝ 2：4：3：3。發現了嗎？每一層都是短臂那邊比較重。', d: () => scene(-1, { 甲: '2', 乙: '4', 丙: '3', 丁: '3' }) }
          ], { acc: false });
        },
        caption: '從上往下算會卡住：上層的左邊是「一整串」，不先算下層就不知道多重。',
        example: {
          q: '一根桿子吊點左右臂長 1：3，左邊掛 12 gw，右邊要掛多重才平衡？',
          steps: ['短臂掛重的：\\(12\\times1=W\\times3\\)。', '\\(W=4\\) gw。'],
          ans: '\\(4\\) gw'
        }
      },
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '平衡後兩邊各外移 1 格：比較重的那邊會沉下去',
        points: [
          '平衡時，<span class="k">比較重的物體一定離支點比較近</span>。',
          '兩邊各外移 d：多出來的力矩是 W × d，誰重誰多。',
          '拖滑桿往外移，再試試往內移：這次會往哪邊倒？'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>兩邊一起移動：<span class="ival" id="mv">原位</span></label>
            <input type="range" id="ms" min="-3" max="3" step="1" value="0"></div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m === 0 ? '原位' : (m > 0 ? '外移 ' + m + ' 格' : '內移 ' + (-m) + ' 格');
            const a = 4 + m, b = 6 + m, L = 3 * a, R = 2 * b, net = R - L;
            const ang = Math.max(-10, Math.min(10, net * 2.5));
            const P = 220, Y = 120, U = 21;
            let g = `<rect x="${P - 9.5 * U}" y="${Y - 5}" width="${19 * U}" height="10" rx="5" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>`;
            for (let i = -9; i <= 9; i++) g += SV.seg(P + i * U, Y - 5, P + i * U, Y + 1, '#475569', 1.2);
            g += SV.seg(P - a * U, Y + 5, P - a * U, Y + 30, GRY, 2) + MASS(P - a * U, Y + 30, 40, '3 kgw', '#bfdbfe');
            g += SV.seg(P + b * U, Y + 5, P + b * U, Y + 30, GRY, 2) + MASS(P + b * U, Y + 30, 32, '2 kgw', '#fecaca');
            let s = `<g transform="rotate(${ang} ${P} ${Y})">${g}</g>` + PIV(P, Y + 5, 13);
            s += TX(110, 34, `左：3 × ${a} ＝ ${L}`, { fs: 16, c: BLU, anchor: 'middle' }) + TX(330, 34, `右：2 × ${b} ＝ ${R}`, { fs: 16, c: RED, anchor: 'middle' });
            const msg = net === 0 ? '兩邊相等 → 平衡' : net < 0 ? `左邊多 ${-net} → 左邊沉（逆時鐘）` : `右邊多 ${net} → 右邊沉（順時鐘）`;
            s += TX(220, 250, msg, { fs: 17, c: net === 0 ? GRN : INK, anchor: 'middle' });
            s += TX(220, 274, m === 0 ? '重 3 kgw 的放 4 格、輕 2 kgw 的放 6 格' : `多出來：左 3 × ${m}、右 2 × ${m}`, { fs: 13, c: GRY, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '外移時重的那邊沉，內移時輕的那邊沉——不用算原本的力矩也能判斷。',
        example: {
          q: '支點在中央，左 6 cm 掛 2 gw、右 4 cm 掛 3 gw 平衡。兩邊同時往外移 2 cm 會怎樣？',
          steps: ['左 \\(2\\times8=16\\)，右 \\(3\\times6=18\\)。', '右邊力矩大 → 右邊下沉（順時鐘）。'],
          ans: '右邊下沉'
        }
      },
      {
        sec: '3-3', secName: '力矩與槓桿題型',
        title: '推球上臺階：支點不在球心，在臺階的邊角',
        points: [
          '球要翻上去的瞬間，只剩<span class="k">臺階邊角</span>撐著，那裡就是支點。',
          '重力的力臂是水平距離、水平推力的力臂是高度差，都從邊角量。',
          '拖滑桿加高臺階：為什麼臺階一高，推力就暴增？'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>臺階高 <span class="ival" id="hv">4</span> cm（球半徑 10 cm、重 6 kgw）</label>
            <input type="range" id="hs" min="1" max="9" step="1" value="4"></div></div>`;
          const draw = () => {
            const hc = +h.querySelector('#hs').value, R = 10, dv = R - hc, dh = Math.sqrt(R * R - dv * dv), F = 6 * dh / dv;
            h.querySelector('#hv').textContent = hc;
            const K = 11, gy = 262, cx = 190, cy = gy - R * K, kx = cx + dh * K, ky = gy - hc * K;
            let s = TX(220, 26, `推力至少 F ＝ 6 × ${dh.toFixed(1)} ÷ ${dv} ≈ ${F.toFixed(1)} kgw`, { fs: 17, c: F > 15 ? RED : VIO, anchor: 'middle' });
            s += SV.seg(10, gy, 430, gy, '#475569', 3);
            s += `<rect x="${kx}" y="${ky}" width="${430 - kx}" height="${gy - ky}" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>`;
            s += `<circle cx="${cx}" cy="${cy}" r="${R * K}" fill="rgba(37,99,235,.18)" stroke="${BLU}" stroke-width="2.5"/>`;
            s += SV.dot(cx, cy, INK, 4) + SV.dot(kx, ky, AMB, 6) + TX(kx + 10, ky + 20, '支點', { fs: 12, c: AMB });
            // 重力與它的力臂（水平距離）
            s += ARW(cx, cy, cx, cy + 60, GRN, 3.5) + TX(cx - 6, cy + 76, '6 kgw', { fs: 12, c: GRN, anchor: 'end' });
            s += SV.seg(cx, ky, kx, ky, GRN, 3) + SV.seg(cx, cy + 60, cx, ky, GRN, 1.5, '4 4');
            s += TX((cx + kx) / 2, ky + 16, dh.toFixed(1) + ' cm', { fs: 12, c: GRN, anchor: 'middle' });
            // 推力與它的力臂（高度差）
            s += ARW(cx - R * K - 10 - Math.min(F * 4, 110), cy, cx - R * K - 4, cy, RED, 4) + TX(cx - R * K - 14, cy - 10, 'F', { fs: 15, c: RED, anchor: 'end' });
            s += SV.seg(kx, cy, cx, cy, '#94a3b8', 1.5, '4 4') + SV.seg(kx, ky, kx, cy, RED, 3);
            s += TX(kx + 6, (ky + cy) / 2 + 4, dv + ' cm', { fs: 12, c: RED });
            h.querySelector('#fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#hs').oninput = draw; draw();
        },
        caption: '臺階越高，推力的力臂（高度差）越短、重力的力臂越長，兩頭吃虧。',
        example: {
          q: '球半徑 13 cm、重 10 kgw，臺階高 8 cm，水平推過球心的力至少多大？',
          steps: ['高度差 \\(13-8=5\\)，水平距 \\(\\sqrt{13^{2}-5^{2}}=12\\)。', '\\(F\\times5=10\\times12\\)，\\(F=24\\) kgw。'],
          ans: '\\(24\\) kgw'
        }
      },

      /* ---------- 3-4 簡單機械題型 ---------- */
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '先找誰在中間：抗力在中間必省力，施力在中間必費力',
        points: [
          '<span class="k">抗力點在中間</span>：開瓶器、裁紙刀、釘書機 → 省力費時。',
          '<span class="k">施力點在中間</span>：筷子、鑷子、麵包夾、掃把 → 費力省時。',
          '支點在中間（剪刀、蹺蹺板）就要再比力臂。拖滑桿切換三種。'
        ],
        visual: (h) => {
          const kinds = [
            { n: '支點在中間', p: 200, w: 80, f: 380, fd: 1, tool: '✂️ 剪刀・蹺蹺板・天平', tag: '看力臂：可省力也可省時' },
            { n: '抗力在中間', p: 60, w: 160, f: 400, fd: -1, tool: '🍾 開瓶器・裁紙刀・釘書機', tag: '必定省力（費時）' },
            { n: '施力在中間', p: 60, w: 400, f: 160, fd: -1, tool: '🥢 筷子・鑷子・麵包夾', tag: '必定費力（省時）' }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>種類：<span class="ival" id="kv">支點在中間</span></label>
            <input type="range" id="ks" min="0" max="2" step="1" value="0"></div></div>`;
          const draw = () => {
            const k = kinds[+h.querySelector('#ks').value], Y = 130;
            h.querySelector('#kv').textContent = k.n;
            const dw = Math.abs(k.w - k.p), df = Math.abs(k.f - k.p), r = dw / df;
            let s = TX(220, 30, k.tool, { fs: 17, c: INK, anchor: 'middle' });
            s += `<rect x="40" y="${Y - 6}" width="370" height="12" rx="6" fill="#d6b88a" stroke="#8a6a3a" stroke-width="2"/>`;
            s += PIV(k.p, Y + 6, 14) + TX(k.p, Y + 46, '支點', { fs: 12, c: '#475569', anchor: 'middle' });
            s += ARW(k.w, Y + 8, k.w, Y + 68, BLU, 4) + TX(k.w, Y + 86, '抗力', { fs: 13, c: BLU, anchor: 'middle' });
            const fl = Math.min(150, 60 * r);
            s += k.fd > 0 ? ARW(k.f, Y + 8, k.f, Y + 8 + fl, RED, 4) : ARW(k.f, Y - 8, k.f, Y - 8 - fl, RED, 4);
            s += TX(k.f + 10, k.fd > 0 ? Y + 30 : Y - 30, '施力', { fs: 13, c: RED });
            s += SV.seg(k.p, Y + 100, k.f, Y + 100, RED, 2) + TX((k.p + k.f) / 2, Y + 116, '施力臂', { fs: 12, c: RED, anchor: 'middle' });
            s += SV.seg(k.p, Y + 124, k.w, Y + 124, BLU, 2) + TX((k.p + k.w) / 2, Y + 140, '抗力臂', { fs: 12, c: BLU, anchor: 'middle' });
            s += TX(220, 286, `${k.tag}：施力 ≈ 抗力 × ${r.toFixed(2)}`, { fs: 14, c: r < 1 ? GRN : r > 1 ? RED : INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 296', s);
          };
          h.querySelector('#ks').oninput = draw; draw();
        },
        caption: '支點在一端時不用量：抗力在中間 → 施力臂一定比較長；施力在中間 → 一定比較短。',
        example: {
          q: '開瓶器、筷子、裁紙刀、鑷子中，哪些一定省力？',
          steps: ['開瓶器、裁紙刀：抗力點在中間 → 施力臂較長 → 省力。', '筷子、鑷子：施力點在中間 → 費力省時。'],
          ans: '開瓶器、裁紙刀'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '指甲刀藏著兩根槓桿：上面那根省力，下面那根費力',
        points: [
          '上方壓桿：支點在左端 C、手壓右端 A、往下頂 B → <span class="k">省力</span>。',
          '下方刀臂：支點在尾端鉚釘、B 在中間、刀口在最前面 → <span class="k">費力</span>。',
          '想讓它更好剪：壓桿加長、刀口離受力點近一點（X 縮短）。'
        ],
        visual: (h) => {
          const Cx = 110, Bx = 170, Ax = 400, Dx = 60, Rx = 400;
          const base = (hu, hl) => {
            let s = `<rect x="${Dx}" y="186" width="${Rx - Dx + 10}" height="12" rx="5" fill="${hl ? '#fde68a' : '#cbd5e1'}" stroke="#475569" stroke-width="2"/>`;
            s += `<rect x="${Dx}" y="214" width="${Rx - Dx + 10}" height="12" rx="5" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>`;
            s += SV.seg(Dx, 198, Dx, 214, '#475569', 3) + TX(Dx - 6, 210, 'D', { fs: 14, c: INK, anchor: 'end' });
            s += SV.seg(Bx, 150, Bx, 186, '#475569', 4);
            s += `<polygon points="${Cx},146 ${Ax},96 ${Ax + 6},106 ${Cx + 2},158" fill="${hu ? '#fde68a' : '#cbd5e1'}" stroke="#475569" stroke-width="2"/>`;
            s += SV.dot(Cx, 152, INK, 5) + TX(Cx - 8, 146, 'C', { fs: 14, c: INK, anchor: 'end' });
            s += SV.dot(Bx, 150, INK, 5) + TX(Bx + 4, 140, 'B', { fs: 14, c: INK });
            s += TX(Ax + 4, 90, 'A', { fs: 14, c: INK }) + SV.dot(Rx, 206, INK, 6) + TX(Rx + 14, 210, '鉚釘', { fs: 12, c: INK });
            return s;
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '先認位置：上方壓桿 C—B—A，下方刀臂從刀口 D 一路到尾端鉚釘。', d: () => base(false, false) + TX(220, 40, '一支指甲刀 ＝ 兩根槓桿接力', { fs: 17, c: VIO, anchor: 'middle' }) },
            { t: '上方壓桿：支點 C、受阻力的 B 在中間、手壓 A → 施力臂 CA 遠大於抗力臂 CB → 省力，B 處的壓力約是手力的 4.8 倍。', d: () => base(true, false) + PIV(Cx, 160, 10) + ARW(Ax, 50, Ax, 92, RED, 4) + TX(Ax - 8, 46, '手力', { fs: 13, c: RED, anchor: 'end' }) + ARW(Bx, 186, Bx, 160, BLU, 3) + TX(220, 40, '施力臂 290 ÷ 抗力臂 60 ≈ 4.8', { fs: 16, c: GRN, anchor: 'middle' }) },
            { t: '下方刀臂：支點是尾端鉚釘，B 往下壓在中間，刀口 D 在最前面 → 施力點在中間 → 費力，刀口的力只剩 B 處的 0.68 倍。', d: () => base(false, true) + ARW(Bx, 156, Bx, 184, RED, 4) + ARW(Dx + 4, 236, Dx + 4, 204, BLU, 3) + SV.seg(Dx, 250, Bx, 250, AMB, 2.5) + TX((Dx + Bx) / 2, 268, 'X', { fs: 14, c: AMB, anchor: 'middle' }) + SV.seg(Bx, 250, Rx, 250, VIO, 2.5) + TX((Bx + Rx) / 2, 268, 'Y', { fs: 14, c: VIO, anchor: 'middle' }) + TX(220, 40, '施力臂 Y ÷ 抗力臂（X＋Y）＝ 230 ÷ 340', { fs: 15, c: RED, anchor: 'middle' }) },
            { t: '接力起來：4.8 × 0.68 ≈ 3.3 倍，整支還是省力。想更省力：加長 AC、縮短 BC、縮短 X；縮短 Y 反而更費力。', d: () => base(true, true) + TX(220, 40, '整支：手力 × 4.8 × 0.68 ≈ 3.3 倍', { fs: 17, c: GRN, anchor: 'middle' }) + TX(220, 274, '✓ AC 加長　✓ BC 縮短　✓ X 縮短　✗ Y 縮短', { fs: 14, c: INK, anchor: 'middle' }) }
          ], { acc: false });
        },
        caption: '同一個工具裡可以同時有省力和費力的槓桿，判斷時要先拆開，一根一根看。',
        example: {
          q: '下方刀臂若 X ＝ 1 cm、Y ＝ 4 cm，B 處壓力 10 kgw，刀口的力多大？',
          steps: ['支點在尾端：\\(10\\times4=F\\times(1+4)\\)。', '\\(F=8\\) kgw。'],
          ans: '\\(8\\) kgw'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '滑輪看繩子：有幾段繩撐住動滑輪，力就分成幾份',
        points: [
          '定滑輪只改方向；動滑輪兩段繩一起撐，力剩<span class="k">一半</span>，繩要拉 2 倍長。',
          '動滑輪自己也有重量，要連它一起拉上去。',
          '拖滑桿切換四種裝置，比較手的力、手拉的繩長和作功。'
        ],
        visual: (h) => {
          const st = [
            { n: '定滑輪', F: 10, S: 1, W: 10, pw: 0 },
            { n: '動滑輪', F: 5, S: 2, W: 10, pw: 0 },
            { n: '滑輪組', F: 5, S: 2, W: 10, pw: 0 },
            { n: '動滑輪重 1 kgw', F: 5, S: 2, W: 9, pw: 1 }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>裝置：<span class="ival" id="pv">定滑輪</span></label>
            <input type="range" id="ps" min="0" max="3" step="1" value="0"></div></div>`;
          const wheel = (x, y, c) => `<circle cx="${x}" cy="${y}" r="24" fill="${c}" stroke="#475569" stroke-width="2.5"/>` + SV.dot(x, y, '#334155', 4);
          const rope = (x1, y1, x2, y2) => SV.seg(x1, y1, x2, y2, '#a16207', 2.5);
          const draw = () => {
            const i = +h.querySelector('#ps').value, k = st[i];
            h.querySelector('#pv').textContent = k.n;
            let s = SV.seg(30, 24, 280, 24, '#475569', 6);
            if (i === 0) {
              s += SV.seg(150, 24, 150, 70, GRY, 3) + rope(126, 70, 126, 200) + rope(174, 70, 174, 170) + wheel(150, 70, '#bfdbfe');
              s += MASS(126, 200, 40, '10 kgw') + ARW(174, 170, 174, 170 + k.F * 7, RED, 4) + TX(184, 210, 'F', { fs: 15, c: RED });
            } else if (i === 1 || i === 3) {
              s += rope(126, 24, 126, 180) + rope(174, 180, 174, 100) + wheel(150, 180, i === 3 ? '#fbcfe8' : '#bbf7d0');
              s += ARW(174, 100, 174, 100 - k.F * 7, RED, 4) + TX(184, 76, 'F', { fs: 15, c: RED });
              s += SV.seg(150, 180, 150, 212, GRY, 2) + MASS(150, 212, 40, k.W + ' kgw');
              if (i === 3) s += TX(96, 184, '輪重 1', { fs: 12, c: '#be185d', anchor: 'end' });
            } else {
              s += rope(116, 24, 116, 180) + rope(164, 180, 164, 70) + rope(212, 70, 212, 170) + wheel(140, 180, '#bbf7d0');
              s += SV.seg(188, 24, 188, 70, GRY, 3) + wheel(188, 70, '#bfdbfe');
              s += SV.seg(140, 180, 140, 212, GRY, 2) + MASS(140, 212, 40, '10 kgw') + ARW(212, 170, 212, 170 + k.F * 7, RED, 4) + TX(222, 210, 'F', { fs: 15, c: RED });
            }
            const work = k.F * 10 * k.S, gain = k.W * 10 * 1;
            s += BOX(270, 60, 162, 168, { r: 12, fill: '#f8fafc', stroke: '#cbd5e1' });
            s += TX(282, 88, `手的力 F ＝ ${k.F} kgw`, { fs: 14, c: RED });
            s += TX(282, 116, `物體升 1 m`, { fs: 13, c: INK }) + TX(282, 138, `手要拉 ${k.S} m 繩`, { fs: 14, c: AMB });
            s += TX(282, 166, `手作功 ${work} J`, { fs: 14, c: VIO });
            s += TX(282, 190, `物體得 ${gain} J`, { fs: 13, c: GRN });
            if (k.pw) s += TX(282, 212, `另 ${work - gain} J 抬滑輪`, { fs: 13, c: '#be185d' });
            s += TX(220, 280, i === 0 ? '不省力，只是把「往上拉」變成「往下拉」' : i === 3 ? '(9 ＋ 1) ÷ 2 ＝ 5：滑輪的重量也要分攤' : '兩段繩一起撐 → 力減半、繩拉 2 倍', { fs: 14, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#ps').oninput = draw; draw();
        },
        caption: '不管哪一種裝置，手作的功都是 100 J（g ＝ 10）：滑輪換來的是「力」和「距離」的交換。',
        example: {
          q: '一個動滑輪重 2 kgw，吊起 18 kgw 的物體，手至少要多大的力？物體升 3 m，手要拉多長的繩？',
          steps: ['連滑輪一起：\\((18+2)\\div2=10\\) kgw。', '兩段繩都要縮短 3 m：\\(3\\times2=6\\) m。'],
          ans: '\\(10\\) kgw；\\(6\\) m'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '輪軸是會轉的槓桿：施力在輪省力，施力在軸省時',
        points: [
          '轉軸就是支點，<span class="k">輪半徑、軸半徑</span>就是兩個力臂。',
          '施力在輪：F ＝ W × r ÷ R；施力在軸：反過來費力，但物體跑得快。',
          '水龍頭、螺絲起子是施力在輪；擀麵棍、直升機旋翼是施力在軸。'
        ],
        formula: { label: '施力在輪', tex: 'F\\times R=W\\times r' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>輪：軸 ＝ <span class="ival" id="rv">3</span>：1</label>
            <input type="range" id="rs" min="1" max="5" step="1" value="3">
            <label>手拉 <span class="ival" id="mv">輪</span></label>
            <input type="range" id="ms" min="0" max="1" step="1" value="0"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#rs').value, onAxle = +h.querySelector('#ms').value === 1;
            h.querySelector('#rv').textContent = n;
            h.querySelector('#mv').textContent = onAxle ? '軸' : '輪';
            const W = 12, F = onAxle ? W * n : W / n;
            const cx = 160, cy = 92, r = 18, R = r * n;
            let s = SV.seg(cx, 10, cx, cy, '#475569', 4) + SV.seg(cx - 60, 10, cx + 60, 10, '#475569', 6);
            s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fed7aa" stroke="#c2410c" stroke-width="2.5"/>`;
            s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e2e8f0" stroke="#475569" stroke-width="2.5"/>` + SV.dot(cx, cy, INK, 4);
            const xr = cx + R, xl = cx - r;                       // 輪的繩在右、軸的繩在左
            s += SV.seg(xr, cy, xr, 178, '#a16207', 2.5) + SV.seg(xl, cy, xl, 178, '#a16207', 2.5);
            const fx = onAxle ? xl : xr, wx = onAxle ? xr : xl;
            s += MASS(wx, 178, 40, W + ' kgw');
            s += ARW(fx, 182, fx, 182 + Math.min(F * 2.2, 100), RED, 4) + TX(fx + (onAxle ? -8 : 8), 214, 'F', { fs: 15, c: RED, anchor: onAxle ? 'end' : 'start' });
            const hand = onAxle ? 10 / n : 10 * n;               // 物體升 10 cm 時手拉的長度
            s += BOX(286, 40, 148, 150, { r: 12, fill: '#f8fafc', stroke: '#cbd5e1' });
            s += TX(296, 68, `F ＝ ${fmt(F)} kgw`, { fs: 16, c: onAxle ? RED : GRN });
            s += TX(296, 96, onAxle ? `是物重的 ${n} 倍` : `是物重的 1/${n}`, { fs: 13, c: INK });
            s += TX(296, 128, '物體升 10 cm，', { fs: 13, c: INK }) + TX(296, 150, `手拉 ${fmt(hand)} cm`, { fs: 14, c: AMB });
            s += TX(296, 176, onAxle ? '費力，但省時' : '省力，但費時', { fs: 14, c: onAxle ? RED : GRN });
            s += TX(220, 280, onAxle ? '🚁 旋翼：引擎轉中間的軸，翼尖飛快' : '🚰 水龍頭：手轉大的把手，輕鬆打開', { fs: 14, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#rs').oninput = draw; h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '輪與軸是同一塊、一起轉一圈；繩子移動的距離和半徑成正比，所以省力就費距離。',
        example: {
          q: '輪半徑 30 cm、軸半徑 6 cm，物體 40 kgw 掛在軸上，手拉輪，至少要多大的力？',
          steps: ['\\(F\\times30=40\\times6\\)。', '\\(F=8\\) kgw。'],
          ans: '\\(8\\) kgw'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '斜面越緩越省力：螺紋其實是捲起來的斜面',
        points: [
          '推物體上斜面（光滑）：<span class="k">F × L ＝ W × H</span>，L 越長 F 越小。',
          '把斜面捲在圓柱上就是螺紋：斜面越長，螺紋越<span class="k">密</span>、螺距越小。',
          '拖滑桿拉長斜面（高度不變），看右邊的螺絲怎麼變。'
        ],
        formula: { label: '斜面', tex: 'F=W\\times\\dfrac{H}{L}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>斜面長 L ＝ <span class="ival" id="lv">3</span> m（高 1 m）</label>
            <input type="range" id="ls" min="2" max="8" step="1" value="3"></div></div>`;
          const draw = () => {
            const L = +h.querySelector('#ls').value, F = 60 / L;
            h.querySelector('#lv').textContent = L;
            const K = 30, base = Math.sqrt(L * L - 1) * K, x0 = 22, y0 = 230, x1 = x0 + base, y1 = y0 - K * 1;
            let s = TX(150, 30, `推力 F ＝ 60 × 1 ÷ ${L} ＝ ${fmt(F)} kgw`, { fs: 16, c: VIO, anchor: 'middle' });
            s += SV.poly([[x0, y0], [x1, y0], [x1, y1]], '#d1fae5', GRN, 2.5);
            s += SV.seg(x1 + 10, y0, x1 + 10, y1, GRY, 2) + TX(x1 + 14, y0 - 8, 'H', { fs: 12, c: GRY });
            const mx = x0 + base * 0.45, my = y0 - K * 0.45, ux = base / (L * K), uy = -1 / L;
            s += `<g transform="translate(${mx} ${my}) rotate(${Math.atan2(uy, ux) * 180 / Math.PI})"><rect x="-14" y="-24" width="28" height="22" rx="3" fill="#fde68a" stroke="#92400e" stroke-width="2"/></g>`;
            s += ARW(mx + 10 * ux, my - 12 + 10 * uy, mx + (16 + F * 3) * ux, my - 12 + (16 + F * 3) * uy, RED, 3.5);
            s += TX(x0 + base / 2, y0 + 22, `L ＝ ${L} m`, { fs: 13, c: GRN, anchor: 'middle' });
            // 螺絲：斜面越長，繞的圈數越多（螺距越小）
            const sx = 340, top = 56, bot = 250, wdt = 34, turns = L * 2, pitch = (bot - top) / turns;
            s += `<rect x="${sx - wdt / 2}" y="${top}" width="${wdt}" height="${bot - top}" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>`;
            s += `<polygon points="${sx - 30},${top - 14} ${sx + 30},${top - 14} ${sx + wdt / 2},${top} ${sx - wdt / 2},${top}" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>`;
            for (let i = 0; i < turns; i++) {
              const y = top + i * pitch;
              s += SV.seg(sx - wdt / 2 - 5, y + pitch * 0.15, sx + wdt / 2 + 5, y + pitch * 0.65, '#334155', 2.2);
            }
            s += TX(sx, 284, pitch < 18 ? '螺紋密 → 省力' : '螺紋疏 → 費力', { fs: 14, c: pitch < 18 ? GRN : RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 292', s);
          };
          h.querySelector('#ls').oninput = draw; draw();
        },
        caption: '60 kgw 的物體：斜面 2 m 要 30 kgw，8 m 只要 7.5 kgw；但要推的距離也變 4 倍。',
        example: {
          q: '光滑斜面長 30 cm，用彈簧秤把 200 gw 的小車等速拉上去，讀數 50 gw，斜面高多少？',
          steps: ['\\(50\\times30=200\\times H\\)。', '\\(H=7.5\\) cm。'],
          ans: '\\(7.5\\) cm'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '組合機械像疊打折券：從物體往手的方向，一張一張乘',
        points: [
          '從物體出發，每經過一個機械就乘上它的<span class="k">倍率</span>。',
          '定滑輪 ×1、動滑輪 ×½、輪軸（施力在輪）× r/R、斜面 × H/L。',
          '物體都是 36 kgw，輪軸 3：1、斜面高：長 ＝ 1：3。先猜，再拖滑桿。'
        ],
        visual: (h) => {
          const sets = [
            { n: '甲 定滑輪', c: [['定滑輪', 1, '×1']] },
            { n: '乙 定＋動滑輪', c: [['動滑輪', 1 / 2, '×½'], ['定滑輪', 1, '×1']] },
            { n: '丙 動滑輪＋輪軸', c: [['動滑輪', 1 / 2, '×½'], ['輪軸 3:1', 1 / 3, '×⅓']] },
            { n: '丁 斜面＋輪軸', c: [['斜面 1:3', 1 / 3, '×⅓'], ['輪軸 3:1', 1 / 3, '×⅓']] }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>組合：<span class="ival" id="sv">甲 定滑輪</span></label>
            <input type="range" id="ss" min="0" max="3" step="1" value="0"></div></div>`;
          const draw = () => {
            const k = sets[+h.querySelector('#ss').value];
            h.querySelector('#sv').textContent = k.n;
            let v = 36, x = 18;
            let s = TX(220, 34, '🎟 機械打折券', { fs: 18, c: C, anchor: 'middle' });
            const node = (x, val, lab, col) => BOX(x, 104, 76, 60, { r: 14, fill: col, stroke: '#94a3b8' }) +
              TX(x + 38, 128, lab, { fs: 12, c: INK, anchor: 'middle' }) + TX(x + 38, 152, fmt(val) + ' kgw', { fs: 15, c: INK, anchor: 'middle' });
            s += node(x, v, '物體', '#fde68a'); x += 76;
            k.c.forEach(([nm, f, lab]) => {
              s += ARW(x + 4, 134, x + 30, 134, GRY, 2.5);
              s += BOX(x + 32, 112, 66, 44, { r: 8, fill: '#ecfdf5', stroke: C, sw: 2, dash: '5 4' });
              s += TX(x + 65, 130, lab, { fs: 16, c: C, anchor: 'middle' }) + TX(x + 65, 149, nm, { fs: 10, c: GRY, anchor: 'middle' });
              x += 98; v *= f;
            });
            s += ARW(x + 4, 134, x + 30, 134, GRY, 2.5);
            s += node(x + 32, v, '手', '#fecaca');
            s += TX(220, 220, `手只要出 ${fmt(v)} kgw`, { fs: 22, c: RED, anchor: 'middle' });
            s += TX(220, 252, `＝ 36 × ${k.c.map(c => c[2].slice(1)).join(' × ')}`, { fs: 15, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ss').oninput = draw; draw();
        },
        caption: '甲 36、乙 18、丙 6、丁 4：定滑輪那張券是「×1」，不打折只改方向。',
        example: {
          q: '48 kgw 的物體掛在動滑輪上，動滑輪的繩繞在輪軸的軸上（輪：軸 ＝ 4：1），手拉輪，至少要多大的力？',
          steps: ['動滑輪：\\(48\\times\\frac12=24\\)。', '輪軸：\\(24\\times\\frac14=6\\)。'],
          ans: '\\(6\\) kgw'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '機械不能省功：力 × 距離的長方形，面積永遠一樣大',
        points: [
          '把「力」當高、「手移動的距離」當寬畫長方形，<span class="k">面積就是功</span>。',
          '拖滑桿換機械：長方形變扁或變高，格子數永遠是 20 格。',
          '省力一定費距離，省距離一定費力——機械沒有白吃的午餐。'
        ],
        formula: { label: '不計摩擦', tex: 'F\\times S=W\\times h' },
        visual: (h) => {
          const M = [
            { n: '直接抬', F: 20, S: 1 },
            { n: '動滑輪', F: 10, S: 2 },
            { n: '輪軸 4:1', F: 5, S: 4 },
            { n: '斜面長 5 m', F: 4, S: 5 },
            { n: '費力槓桿', F: 40, S: 0.5 }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>機械：<span class="ival" id="nv">直接抬</span></label>
            <input type="range" id="ns" min="0" max="4" step="1" value="0"></div></div>`;
          const draw = () => {
            const k = M[+h.querySelector('#ns').value];
            h.querySelector('#nv').textContent = k.n;
            const x0 = 70, y0 = 250, KF = 5.2, KS = 62, w = k.S * KS, hh = k.F * KF;
            let s = SV.seg(x0, y0, 420, y0, INK, 2) + SV.seg(x0, y0, x0, 24, INK, 2);
            s += TX(432, y0 + 22, 'S (m)', { fs: 12, c: GRY, anchor: 'end' }) + TX(x0 - 6, 22, 'F (kgw)', { fs: 12, c: GRY, anchor: 'end' });
            s += `<rect x="${x0}" y="${y0 - 20 * KF}" width="${KS}" height="${20 * KF}" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="5 4"/>`;
            s += `<rect x="${x0}" y="${y0 - hh}" width="${w}" height="${hh}" fill="rgba(5,150,105,.22)" stroke="${C}" stroke-width="2.5"/>`;
            // 格子：每格 ＝ 1 kgw·m（依形狀切成 20 格）
            const cols = k.S >= 1 ? k.S : 1, rows = 20 / cols;
            for (let i = 1; i < cols; i++) s += SV.seg(x0 + w * i / cols, y0, x0 + w * i / cols, y0 - hh, C, 1);
            for (let j = 1; j < rows; j++) s += SV.seg(x0, y0 - hh * j / rows, x0 + w, y0 - hh * j / rows, C, 0.8);
            s += TX(x0 + w + 8, y0 - hh + 14, `F ＝ ${k.F}`, { fs: 14, c: RED });
            s += TX(x0 + w / 2, y0 + 20, `S ＝ ${k.S}`, { fs: 14, c: AMB, anchor: 'middle' });
            s += TX(300, 60, `面積 ＝ ${k.F} × ${k.S} ＝ 20`, { fs: 17, c: C, anchor: 'middle' });
            s += TX(300, 84, '（20 kgw·m，就是 200 J）', { fs: 13, c: GRY, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '虛線框是「直接抬」：20 kgw 的物體升 1 m。每種機械只是把同一塊面積換個形狀。',
        example: {
          q: '用動滑輪把 30 kgw 的物體升高 2 m（g ＝ 10），手作功多少？直接抬呢？',
          steps: ['動滑輪：\\(150\\text{ N}\\times4\\text{ m}=600\\) J。', '直接抬：\\(300\\text{ N}\\times2\\text{ m}=600\\) J，一樣。'],
          ans: '都是 \\(600\\) J'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '直升機為什麼要長尾巴？為了抵消旋翼的反作用力矩',
        points: [
          '旋翼把空氣往下推，空氣把直升機往上推：<span class="k">作用力與反作用力</span>。',
          '引擎扭著旋翼轉，旋翼也反過來扭機身；尾旋翼的推力負責把機身扭回來。',
          '拖滑桿調尾旋翼推力（由上往下看）：兩個力矩剛好抵消，機頭才穩。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>尾旋翼推力 ＝ <span class="ival" id="tv">0</span> 單位</label>
            <input type="range" id="ts" min="0" max="8" step="1" value="0"></div></div>`;
          const draw = () => {
            const T = +h.querySelector('#ts').value, twist = 24, tail = 6 * T, net = twist - tail;
            h.querySelector('#tv').textContent = T;
            const cx = 160, cy = 150, ang = Math.max(-30, Math.min(30, net * 1.25));
            let g = `<ellipse cx="${cx}" cy="${cy}" rx="58" ry="30" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2.5"/>`;
            g += `<rect x="${cx + 50}" y="${cy - 6}" width="100" height="12" rx="6" fill="#93c5fd" stroke="#1e3a8a" stroke-width="2"/>`;
            g += SV.seg(cx + 146, cy - 18, cx + 146, cy + 18, '#334155', 4);
            g += `<ellipse cx="${cx - 34}" cy="${cy}" rx="16" ry="20" fill="#e0f2fe" stroke="#1e3a8a" stroke-width="2"/>`;
            if (T > 0) g += ARW(cx + 146, cy - 22, cx + 146, cy - 22 - T * 7, RED, 4);
            let s = `<circle cx="${cx}" cy="${cy}" r="112" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 6"/>`;
            // 旋翼轉向（逆時鐘）與機身被反扭的方向（順時鐘）
            s += `<path d="M ${cx + 79} ${cy - 79} A 112 112 0 0 0 ${cx - 79} ${cy - 79}" fill="none" stroke="${VIO}" stroke-width="3"/>` + ARW(cx - 70, cy - 87, cx - 82, cy - 76, VIO, 3);
            s += TX(cx, cy - 120, '旋翼（逆時鐘轉）', { fs: 12, c: VIO, anchor: 'middle' });
            s += `<g transform="rotate(${ang} ${cx} ${cy})">${g}</g>`;
            s += BOX(316, 196, 120, 82, { r: 10, fill: '#f8fafc', stroke: '#cbd5e1' });
            s += TX(324, 218, `反扭：順 ${twist}`, { fs: 13, c: INK }) + TX(324, 240, `尾翼：逆 6×${T}＝${tail}`, { fs: 13, c: RED });
            const msg = net === 0 ? '穩住了 ✓' : net > 0 ? '機身被扭著轉' : '扭過頭了';
            s += TX(324, 266, msg, { fs: 15, c: net === 0 ? GRN : AMB });
            h.querySelector('#fig').innerHTML = svg('0 0 440 286', s);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '停在空中救援時：升力 ＝ 重力（同一物體上的平衡力）、往前推力 ＝ 0，尾旋翼仍要一直出力。',
        example: {
          q: '直升機停在空中吊掛救人，升力和重力是作用力與反作用力嗎？往前的推力要多大？',
          steps: ['升力、重力都作用在直升機上 → 是一對平衡力，不是作用與反作用。', '不前進 → 往前的推力為 0。'],
          ans: '是平衡力；推力為 0'
        }
      },
      {
        sec: '3-4', secName: '簡單機械題型',
        title: '機械題六個坑：力臂、吊掛、滑輪、輪軸、省功、平衡力',
        points: [
          '每個坑都出現在段考與會考題裡，先蓋住右欄自己說說看。',
          '判斷題先找<span class="k">支點</span>，再量<span class="k">垂直距離</span>。',
          '任何機械都只是把力和距離交換，功不會變少。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['力臂 ＝ 支點到施力點的桿長', '力臂 ＝ 支點到<b>作用線</b>的垂直距離'],
            ['吊掛時，比例數字小的那邊掛輕的', '短臂（靠近支點）要掛<b>比較重</b>的'],
            ['動滑輪越大越省力', '動滑輪永遠省一半；它的<b>自重</b>要算進去'],
            ['輪軸施力在軸比較省力', '施力在<b>輪</b>才省力；在軸是費力省時'],
            ['斜面、螺絲、滑輪組能省功', '任何機械都<b>不能省功</b>'],
            ['升力和重力是作用力與反作用力', '兩力作用在<b>同一物體</b> → 平衡力']
          ]);
        },
        caption: '最常錯的是第一條：題目畫了斜的力，就去找那條垂直虛線。',
        example: {
          q: '支點在一端、物體在中間的槓桿，有可能費力嗎？',
          steps: ['施力在最外端 → 施力臂 ＞ 抗力臂。', '所以一定省力，不可能費力。'],
          ans: '不可能，一定省力'
        }
      }
    ]
  });
})();
