/* ============ 第 2 章　圓 ============
   節次：2-1 點、直線與圓（位置關係、切線 ⊥ 半徑）、2-1 切線段、2-1 弦與弦心距
   內容：例題數字全部自編並以程式驗算。
   課綱邊界（本章刻意不放）：2-2 圓心角與圓周角（含「直徑所對的角是直角」）、三角比（sin／cos／tan，Ch.3 才教）、
     三角形的內心／外心／重心名稱（3-2 才教，內切圓只說「圓心 O」）、點到直線距離公式、弧度。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706', INK = '#172033', GRY = '#94a3b8';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;

  // ---- 幾何小工具（全部用螢幕座標 [x, y]，y 向下）----
  const f = v => (+v).toFixed(1);
  const CIR = (p, r, c = C, fill = 'rgba(124,58,237,.06)', w = 2.6, dash = '') =>
    `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${fill}" stroke="${c}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
  const L = (a, b, c = INK, w = 2.6, dash = '') => SV.seg(f(a[0]), f(a[1]), f(b[0]), f(b[1]), c, w, dash);
  const D = (p, c = INK, r = 4.5) => SV.dot(f(p[0]), f(p[1]), c, r);
  const LB = (p, t, dx = 0, dy = 0, c = INK, fs = 17) => SV.vlabel(f(p[0] + dx), f(p[1] + dy), t, c, fs);
  const RA = (v, a, b, s = 11, c = '#657187') =>
    SV.rightAngle(v[0], v[1], SV.angleOf(v[0], v[1], a[0], a[1]), SV.angleOf(v[0], v[1], b[0], b[1]), s, c);
  const TK = (a, b, n = 1, c = RED) => SV.ticks(a[0], a[1], b[0], b[1], n, c);
  const PG = (pts, fill, stroke = 'none', w = 0) => SV.poly(pts.map(p => [f(p[0]), f(p[1])]), fill, stroke, w);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const pol = (o, r, deg) => [o[0] + r * Math.cos(deg * Math.PI / 180), o[1] - r * Math.sin(deg * Math.PI / 180)];
  const foot = (p, a, b) => { const d = sub(b, a), t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]); return add(a, mul(d, t)); };
  const tangents = (o, r, p) => { // 圓外點 p 的兩切點（上、下）
    const d = len(o, p), base = Math.atan2(p[1] - o[1], p[0] - o[0]), h = Math.acos(r / d);
    const t1 = [o[0] + r * Math.cos(base - h), o[1] + r * Math.sin(base - h)], t2 = [o[0] + r * Math.cos(base + h), o[1] + r * Math.sin(base + h)];
    return t1[1] < t2[1] ? [t1, t2] : [t2, t1];
  };
  const xline = (p1, p2, p3, p4) => { // 兩直線交點
    const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    const a = p1[0] * p2[1] - p1[1] * p2[0], b = p3[0] * p4[1] - p3[1] * p4[0];
    return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
  };
  const slider = (h, id, label, min, max, step, val) =>
    `<div style="width:100%"><div class="fig"></div><div class="ictrl"><label>${label} <span class="ival" id="${id}v">${val}</span></label>
     <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div></div>`;
  const boxText = (x, y, w, h, lines, c = C) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fff" stroke="${c}" stroke-width="1.6"/>` +
    lines.map((s, i) => TX(x + 10, y + 22 + i * 21, s.t, { fs: s.fs || 14, c: s.c || INK })).join('');

  // ✗ 錯 / ✓ 對　對照列（class 供 theme-dark.css 深色模式覆蓋）
  function xoRows(rows) {
    return `<div class="xo" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:9px">` +
      rows.map(r => `<div style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-bad" style="flex:1;background:#fdeef2;border:1.5px solid #f3c4d0;border-radius:12px;padding:8px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:3px">✗ 常見錯誤</div>
          <div class="xo-t" style="font-size:14px;color:#172033;line-height:1.6">${r.bad}</div></div>
        <div class="xo-good" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:8px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:3px">✓ 正確寫法</div>
          <div class="xo-t" style="font-size:14px;color:#172033;line-height:1.6">${r.good}</div></div>
      </div>`).join('') + `</div>`;
  }

  window.DECK.push({
    ch: 2,
    title: '圓',
    color: C,
    sections: ['2-1 點、直線與圓', '2-1 切線段', '2-1 弦與弦心距'],
    slides: [

      /* ================= 2-1 點、直線與圓 ================= */
      {
        sec: '2-1', secName: '點、直線與圓',
        title: '點在圓內、圓上、圓外：比較 d 和半徑 r',
        points: [
          '<span class="k">d</span>＝點到圓心的距離，只要和半徑 \\(r\\) 比大小。',
          '\\(d<r\\) 在圓內、\\(d=r\\) 在圓上、\\(d>r\\) 在圓外。',
          '有根號時<b>兩邊平方</b>再比，最不會看錯。'
        ],
        formula: { label: '判斷', tex: 'd<r,\\;d=r,\\;d>r' },
        visual: (h) => {
          h.innerHTML = slider(h, 'd', '點 P 到圓心距離 d ＝', 0, 8, 0.5, 5.5);
          const draw = () => {
            const d = +h.querySelector('#d').value; h.querySelector('#dv').textContent = d;
            const O = [125, 150], k = 28, r = 4 * k, P = pol(O, d * k, 25);
            const where = d < 4 ? ['圓內', GRN] : d === 4 ? ['圓上', AMB] : ['圓外', RED];
            let s = CIR(O, r) + L(O, P, where[1], 3, '6 4') + D(O) + LB(O, 'O', -8, -10) + D(P, where[1], 6) + LB(P, 'P', 8, -8, where[1]);
            s += L(O, pol(O, r, 200), GRY, 2) + TX(48, 198, 'r = 4', { fs: 14, c: '#657187' });
            s += boxText(268, 180, 160, 88,[{ t: `d = ${d}，r = 4` }, { t: d < 4 ? 'd < r' : d === 4 ? 'd = r' : 'd > r', c: where[1], fs: 16 }, { t: `P 在${where[0]}`, c: where[1], fs: 16 }], where[1]);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#d').oninput = draw; draw();
        },
        caption: '拖到 d＝4 時，P 剛好落在圓上。',
        example: {
          q: '直徑 8 的圓 O，\\(A、B、C\\) 到 O 的距離分別是 \\(2\\sqrt3、4、3\\sqrt2\\)，各在哪裡？',
          steps: ['\\(r=4\\)，\\(r^2=16\\)。', '平方：\\((2\\sqrt3)^2=12\\)、\\(4^2=16\\)、\\((3\\sqrt2)^2=18\\)。'],
          ans: 'A 在圓內、B 在圓上、C 在圓外'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓',
        title: '直線和圓的交點個數：比較圓心到直線的距離',
        points: [
          '\\(d>r\\)：<b>不相交</b>；\\(d=r\\)：<span class="k">相切</span>，只有一個交點。',
          '\\(d<r\\)：交於兩點，這條直線叫<span class="k">割線</span>。',
          '相切時的交點叫<b>切點</b>，切線和半徑在切點垂直。'
        ],
        formula: { label: '相切', tex: 'd=r' },
        visual: (h) => {
          h.innerHTML = slider(h, 'd', '圓心到直線距離 d ＝', 0, 6, 0.5, 2.5);
          const draw = () => {
            const d = +h.querySelector('#d').value; h.querySelector('#dv').textContent = d;
            const O = [150, 120], k = 25, r = 4 * k, y = O[1] + d * k, F = [O[0], y];
            const n = d < 4 ? 2 : d === 4 ? 1 : 0, col = [RED, AMB, GRN][2 - n];
            let s = CIR(O, r) + L([20, y], [290, y], col, 3) + L(O, F, BLU, 2.4, '6 4') + D(O) + LB(O, 'O', -18, -6);
            if (n === 2) { const w = Math.sqrt(16 - d * d) * k; s += D([O[0] - w, y], col, 6) + D([O[0] + w, y], col, 6); }
            if (n === 1) s += D(F, col, 6) + RA(F, O, [O[0] + 40, y]) + LB(F, '切點', 8, 22, col, 14);
            s += TX(O[0] + 8, (O[1] + y) / 2 + 4, 'd', { c: BLU, fs: 16 });
            s += boxText(300, 40, 130, 88, [{ t: `d = ${d}，r = 4` }, { t: `交點 ${n} 個`, c: col, fs: 16 }, { t: ['不相交', '相切', '割線'][n], c: col, fs: 16 }], col);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#d').oninput = draw; draw();
        },
        caption: '拖到 d＝4：直線剛好碰到圓一點，就是切線。',
        example: {
          q: '圓心在原點、半徑 5。直線 \\(x=-5\\)、\\(y=3\\)、\\(x+y=10\\) 各和圓有幾個交點？',
          steps: ['\\(x=-5\\)：距離 5＝r，相切（1 個）。', '\\(y=3\\)：距離 3＜5，交 2 點。',
            '\\(x+y=10\\) 過 \\((10,0)\\)、\\((0,10)\\)：用面積求高 \\(10\\times10\\div10\\sqrt2=5\\sqrt2>5\\)。'],
          ans: '1 個、2 個、0 個'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓',
        title: '切線垂直於過切點的半徑',
        points: [
          '看到切線，第一步就是<b>連圓心到切點</b>，標直角。',
          '圓心、切點、圓外點形成直角三角形，用<b>畢氏定理</b>。',
          '斜邊是 \\(\\overline{OP}\\)，兩股是半徑和切線段。'
        ],
        formula: { label: '直角三角形', tex: '\\overline{OP}^2=r^2+\\overline{PA}^2' },
        visual: (h) => {
          h.innerHTML = slider(h, 't', '切線段 PA ＝', 2, 12, 1, 12);
          const draw = () => {
            const t = +h.querySelector('#t').value; h.querySelector('#tv').textContent = t;
            const k = 15, O = [95, 175], A = [95, 175 - 5 * k], P = [95 + t * k, A[1]], op = Math.sqrt(25 + t * t);
            let s = CIR(O, 5 * k) + L([30, A[1]], [300, A[1]], INK, 2) + PG([O, A, P], 'rgba(225,29,72,.08)');
            s += L(O, A, GRN, 3) + L(A, P, RED, 3.4) + L(O, P, BLU, 3) + RA(A, O, P, 12);
            s += D(O) + D(A) + D(P) + LB(O, 'O', -20, 6) + LB(A, 'A', -8, -10) + LB(P, 'P', 4, -10);
            s += TX(80, 140, '5', { c: GRN }) + TX((A[0] + P[0]) / 2, A[1] - 8, t, { c: RED, anchor: 'middle' });
            s += boxText(268, 160, 165, 66, [{ t: `OP = √(5² + ${t}²)` }, { t: `= ${Number.isInteger(op) ? op : '√' + (25 + t * t)}`, c: BLU, fs: 16 }], BLU);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#t').oninput = draw; draw();
        },
        caption: '拖到 12：5-12-13，OP 剛好是 13。',
        example: {
          q: '直線 PA 切圓 O 於 A，半徑 5，\\(\\overline{OP}=13\\)，求 \\(\\overline{PA}\\)。',
          steps: ['連 \\(\\overline{OA}\\)，\\(\\overline{OA}\\perp\\overline{PA}\\)。', '\\(\\overline{PA}=\\sqrt{13^2-5^2}=12\\)。'],
          ans: '\\(\\overline{PA}=12\\)'
        }
      },

      {
        sec: '2-1', secName: '點、直線與圓',
        title: '易錯：直徑、根號比大小、切線直角',
        points: [
          '題目給<b>直徑</b>，第一步先除以 2。',
          '根號比大小，平方以後再比。',
          '切線和過切點的半徑<b>一定</b>垂直，直接標直角。'
        ],
        visual: (h) => {
          h.innerHTML = xoRows([
            { bad: '直徑 8 的圓，直接用 \\(r=8\\) 判斷', good: '先算 \\(r=4\\)，再和 d 比' },
            { bad: '\\(2\\sqrt3\\) 和 3.5 用感覺比，說差不多', good: '平方：\\(12<12.25\\)，所以在圓內' },
            { bad: '圖看起來不像直角，就不敢用畢氏', good: '切線 ⊥ 過切點的半徑，不必量圖' },
            { bad: '直線和圓只碰到一點，就叫割線', good: '一點是<b>切線</b>，兩點才是割線' }
          ]);
        },
        caption: '這一節的題目，九成先寫出 \\(r\\) 和 \\(d\\) 就解完了。'
      },

      /* ================= 2-1 切線段 ================= */
      {
        sec: '2-1', secName: '切線段',
        title: '從圓外一點畫兩條切線，兩條切線段等長',
        points: [
          '\\(\\triangle OAP\\cong\\triangle OBP\\)（RHS：直角、\\(\\overline{OP}\\) 共用、半徑相等）。',
          '所以 \\(\\overline{PA}=\\overline{PB}\\)，而且 \\(\\overline{PO}\\) 平分 \\(\\angle APB\\)。',
          '\\(\\overline{PO}\\) 垂直平分 \\(\\overline{AB}\\)。'
        ],
        formula: { label: '切線段等長', tex: '\\overline{PA}=\\overline{PB}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'p', 'OP ＝', 6, 15, 0.5, 10);
          const draw = () => {
            const op = +h.querySelector('#p').value; h.querySelector('#pv').textContent = op;
            const k = 12, O = [95, 145], r = 5 * k, P = [O[0] + op * k, O[1]];
            const [A, B] = tangents(O, r, P), M = foot(A, O, P), pa = Math.sqrt(op * op - 25);
            let s = PG([O, A, P, B], 'rgba(124,58,237,.10)') + CIR(O, r, C, 'none');
            s += L(P, A, RED, 3.4) + L(P, B, RED, 3.4) + TK(P, A, 2) + TK(P, B, 2);
            s += L(O, A, GRN, 2.4, '6 4') + L(O, B, GRN, 2.4, '6 4') + L(O, P, VIO, 2.4) + L(A, B, INK, 2);
            s += RA(A, O, P) + RA(B, O, P) + RA(M, A, P, 9);
            s += D(O) + D(P) + D(A) + D(B) + LB(O, 'O', -20, 6) + LB(P, 'P', 6, 6) + LB(A, 'A', -6, -10) + LB(B, 'B', -6, 22);
            s += boxText(240, 200, 190, 66, [{ t: `PA = PB = √(${op}² − 5²)` }, { t: `約 ${pa.toFixed(2)}（兩條永遠相等）`, c: RED }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#p').oninput = draw; draw();
        },
        caption: '把 P 拉遠拉近，紅色兩段一直一樣長。',
        example: {
          q: '\\(\\overline{PA}\\)、\\(\\overline{PB}\\) 切圓 O 於 A、B，半徑 8，\\(\\overline{OP}=17\\)，求 \\(\\overline{PA}+\\overline{PB}\\)。',
          steps: ['\\(\\overline{PA}=\\sqrt{17^2-8^2}=15\\)。', '切線段等長：\\(\\overline{PB}=15\\)。'],
          ans: '30'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '兩切線的夾角和 ∠AOB 互補：相加 180°',
        points: [
          '四邊形 \\(OAPB\\) 有兩個直角，另兩角相加 \\(180^\\circ\\)。',
          '\\(\\angle APB=60^\\circ\\) 時，\\(\\angle APO=30^\\circ\\)：\\(\\overline{OP}=2r\\)。',
          '\\(\\angle APB=90^\\circ\\) 時，\\(OAPB\\) 是正方形。'
        ],
        formula: { label: '互補', tex: '\\angle AOB+\\angle APB=180^\\circ' },
        visual: (h) => {
          h.innerHTML = slider(h, 'a', '∠APB ＝', 30, 150, 10, 60);
          const draw = () => {
            const a = +h.querySelector('#a').value; h.querySelector('#av').textContent = a + '°';
            const r = 66, O = [88, 130], half = a / 2, op = r / Math.sin(half * Math.PI / 180), P = [O[0] + op, O[1]];
            const [A, B] = tangents(O, r, P);
            let s = PG([O, A, P, B], 'rgba(124,58,237,.10)') + CIR(O, r, C, 'none');
            s += L(P, A, RED, 3) + L(P, B, RED, 3) + L(O, A, GRN, 2.4) + L(O, B, GRN, 2.4) + L(O, P, GRY, 1.8, '5 4');
            s += RA(A, O, P) + RA(B, O, P);
            // 角的文字放在角平分線（虛線）上方一點，避開虛線
            s += SV.angle(P[0], P[1], 30, 180 - half, 180 + half, AMB) + TX(P[0] - 46, P[1] - 7, a + '°', { c: AMB, fs: 15, anchor: 'middle' });
            s += SV.angle(O[0], O[1], 20, 270 + half, 90 - half, BLU) + TX(O[0] + 36, O[1] + 20, (180 - a) + '°', { c: BLU, fs: 15, anchor: 'middle' });
            s += D(O) + D(P) + LB(O, 'O', -20, 6) + LB(P, 'P', 6, 6) + LB(A, 'A', -4, -10) + LB(B, 'B', -4, 22);
            const note = a === 60 ? 'OP = 2r（30°-60°-90°）' : a === 90 ? 'OAPB 是正方形' : `${180 - a}° + ${a}° = 180°`;
            s += boxText(250, 214, 182, 60, [{ t: `∠AOB = ${180 - a}°` , c: BLU }, { t: note, c: a === 60 || a === 90 ? RED : INK }], BLU);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#a').oninput = draw; draw();
        },
        caption: '拖到 60°：P 到圓心的距離剛好是半徑的 2 倍。',
        example: {
          q: '\\(\\angle APB=60^\\circ\\)，半徑 5，\\(\\overline{PO}\\) 交圓於 C，求 \\(\\overline{PA}\\) 與 \\(\\overline{PC}\\)。',
          steps: ['\\(\\angle APO=30^\\circ\\)，30°-60°-90°：\\(\\overline{OP}=2\\times5=10\\)。', '\\(\\overline{PA}=\\sqrt{10^2-5^2}=5\\sqrt3\\)，\\(\\overline{PC}=10-5=5\\)。'],
          ans: '\\(\\overline{PA}=5\\sqrt3\\)，\\(\\overline{PC}=5\\)'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '切線段＋過圓心的割線：設 r，用畢氏列式',
        points: [
          '\\(\\overline{PC}\\) 是圓外的部分，\\(\\overline{OP}=r+\\overline{PC}\\)。',
          '\\(r^2+\\overline{PA}^2=(r+\\overline{PC})^2\\)，\\(r^2\\) 會消掉。',
          '求 \\(\\overline{AB}\\)：面積兩種算法 \\(\\overline{OA}\\times\\overline{PA}=\\overline{OP}\\times\\overline{AM}\\)。'
        ],
        visual: (h) => {
          const k = 5.4, O = [120, 140], r = 15 * k, P = [O[0] + 25 * k, O[1]];
          const [A, B] = tangents(O, r, P), C2 = [O[0] + r, O[1]], M = foot(A, O, P);
          SV.stepper(h, '0 0 440 290', [
            { t: '已知 \\(\\overline{PA}=20\\)、\\(\\overline{PC}=10\\)，求半徑', d: () => CIR(O, r) + L(P, A, RED, 3.2) + L(P, B, RED, 3.2) + L(C2, P, AMB, 3.2) + D(O) + D(P) + D(A) + D(B) + D(C2) + LB(O, 'O', -20, 6) + LB(P, 'P', 6, 6) + LB(A, 'A', -4, -10) + LB(B, 'B', -4, 22) + LB(C2, 'C', 2, 22) + TX((A[0] + P[0]) / 2 + 8, (A[1] + P[1]) / 2 - 6, '20', { c: RED }) + TX(P[0] + 8, P[1] + 26, 'PC = 10', { c: AMB, fs: 14 }) },
            { t: '連 \\(\\overline{OA}\\)，\\(\\overline{OA}\\perp\\overline{PA}\\)；設 \\(\\overline{OA}=\\overline{OC}=r\\)', d: () => L(O, A, GRN, 3) + L(O, C2, GRN, 3) + RA(A, O, P) + TX((O[0] + A[0]) / 2 - 14, (O[1] + A[1]) / 2, 'r', { c: GRN, fs: 17 }) },
            { t: '\\(r^2+20^2=(r+10)^2\\Rightarrow 300=20r\\Rightarrow r=15\\)', d: () => boxText(260, 236, 172, 46, [{ t: 'r = 15，OP = 25', c: GRN, fs: 16 }], GRN) },
            { t: '\\(\\overline{AM}=15\\times20\\div25=12\\)，\\(\\overline{AB}=24\\)', d: () => L(A, B, BLU, 3) + RA(M, A, P, 9) + LB(M, 'M', -18, 18, BLU, 15) + TX(M[0] + 6, M[1] - 14, '12', { c: BLU }) }
          ]);
        },
        caption: '拖滑桿一步一步看：先設 r，再列畢氏，最後用面積求半弦。',
        example: {
          q: '\\(\\overline{PA}\\) 切圓 O 於 A，\\(\\overline{PO}\\) 交圓於 C，\\(\\overline{PA}=6\\)、\\(\\overline{PC}=2\\)，求半徑。',
          steps: ['\\(r^2+6^2=(r+2)^2\\)。', '\\(36=4r+4\\Rightarrow r=8\\)。'],
          ans: '\\(r=8\\)'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '三角形的內切圓：切線長＝半周長 − 對邊',
        points: [
          '從同一頂點出發的兩條切線段等長，設成 \\(x、y、z\\)。',
          '\\(x+y+z\\)＝半周長 \\(s\\)，所以 \\(x=s-\\) 對邊。',
          '「求哪個頂點的切線長，就用 \\(s\\) 減它的對邊」。'
        ],
        formula: { label: '切線長', tex: 'x=s-\\overline{BC}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'ax', '拖動頂點 A：', 90, 330, 10, 160);
          const draw = () => {
            const ax = +h.querySelector('#ax').value; h.querySelector('#axv').textContent = '';
            const A = [ax, 40], B = [40, 250], Cc = [380, 250];
            const a = len(B, Cc), b = len(Cc, A), c = len(A, B), s2 = (a + b + c) / 2;
            const I = [(a * A[0] + b * B[0] + c * Cc[0]) / (a + b + c), (a * A[1] + b * B[1] + c * Cc[1]) / (a + b + c)];
            const area = Math.abs((B[0] - A[0]) * (Cc[1] - A[1]) - (Cc[0] - A[0]) * (B[1] - A[1])) / 2, r = area / s2;
            const Pt = foot(I, A, B), Q = foot(I, B, Cc), R = foot(I, Cc, A);
            const u = 20; // 每 20 像素算 1 單位
            let s = CIR(I, r, BLU, 'rgba(37,99,235,.08)');
            s += L(A, Pt, RED, 3.4) + L(A, R, RED, 3.4) + L(B, Pt, BLU, 3.4) + L(B, Q, BLU, 3.4) + L(Cc, Q, GRN, 3.4) + L(Cc, R, GRN, 3.4);
            s += D(A) + D(B) + D(Cc) + D(I, INK, 3.5) + LB(A, 'A', -6, -8) + LB(B, 'B', -18, 8) + LB(Cc, 'C', 6, 8) + LB(I, 'O', 6, -4, INK, 14);
            s += TX(250, 60, `s = ${(s2 / u).toFixed(1)}，BC = ${(a / u).toFixed(1)}`, { fs: 14 });
            s += TX(250, 82, `x = s − BC = ${((s2 - a) / u).toFixed(1)}`, { fs: 15, c: RED });
            s += TX(250, 104, `量到的 AP = ${(len(A, Pt) / u).toFixed(1)} ✓`, { fs: 14, c: '#657187' });
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#ax').oninput = draw; draw();
        },
        caption: '不管 A 移到哪裡，「s − BC」都等於 A 的切線長（同色兩段一樣長）。',
        example: {
          q: '\\(\\triangle ABC\\) 的內切圓切 \\(\\overline{AB}\\) 於 P，\\(\\overline{AB}=13\\)、\\(\\overline{BC}=14\\)、\\(\\overline{CA}=15\\)，求 \\(\\overline{AP}\\)。',
          steps: ['\\(s=(13+14+15)\\div2=21\\)。', 'A 的對邊是 \\(\\overline{BC}\\)：\\(\\overline{AP}=21-14=7\\)。'],
          ans: '\\(\\overline{AP}=7\\)'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '圓外切四邊形：兩組對邊的和相等',
        points: [
          '四邊都切同一個圓，從每個頂點出發的兩條切線段等長。',
          '\\(\\overline{AB}+\\overline{CD}\\) 和 \\(\\overline{AD}+\\overline{BC}\\) 用到的 8 段完全一樣。',
          '圓外切梯形：兩腰和＝兩底和，周長＝2×(兩腰和)。'
        ],
        formula: { label: '對邊和', tex: '\\overline{AB}+\\overline{CD}=\\overline{AD}+\\overline{BC}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'g', '移動右邊的切點 G：', -15, 25, 1, 5);
          const draw = () => {
            const g = +h.querySelector('#g').value; h.querySelector('#gv').textContent = '';
            const O = [150, 145], r = 72, T = { H: 100, E: 195, F: 275, G: g };
            const P = {}; Object.keys(T).forEach(k2 => { P[k2] = pol(O, r, T[k2]); });
            const tl = k2 => { const p = P[k2], d = [-(p[1] - O[1]), p[0] - O[0]]; return [p, add(p, d)]; };
            const A = xline(...tl('H'), ...tl('E')), B = xline(...tl('E'), ...tl('F')), Cc = xline(...tl('F'), ...tl('G')), Dd = xline(...tl('G'), ...tl('H'));
            const u = 18, ab = len(A, B) / u, bc = len(B, Cc) / u, cd = len(Cc, Dd) / u, ad = len(A, Dd) / u;
            let s = CIR(O, r, C, 'rgba(124,58,237,.07)');
            s += L(A, P.H, RED, 3.2) + L(A, P.E, RED, 3.2) + L(B, P.E, BLU, 3.2) + L(B, P.F, BLU, 3.2) + L(Cc, P.F, GRN, 3.2) + L(Cc, P.G, GRN, 3.2) + L(Dd, P.G, AMB, 3.2) + L(Dd, P.H, AMB, 3.2);
            s += D(A) + D(B) + D(Cc) + D(Dd) + LB(A, 'A', -18, -4) + LB(B, 'B', -18, 14) + LB(Cc, 'C', 6, 14) + LB(Dd, 'D', 6, -4);
            s += boxText(296, 30, 138, 88, [{ t: `AB + CD = ${(ab + cd).toFixed(1)}`, c: BLU }, { t: `AD + BC = ${(ad + bc).toFixed(1)}`, c: GRN }, { t: '永遠相等', c: RED }], C);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#g').oninput = draw; draw();
        },
        caption: '同色的兩段從同一個頂點出發，一定一樣長。',
        example: {
          q: '圓外切四邊形 ABCD 中，\\(\\overline{AB}=7\\)、\\(\\overline{BC}=9\\)、\\(\\overline{CD}=8\\)，求 \\(\\overline{AD}\\)。',
          steps: ['\\(\\overline{AD}+\\overline{BC}=\\overline{AB}+\\overline{CD}=15\\)。', '\\(\\overline{AD}=15-9=6\\)。'],
          ans: '\\(\\overline{AD}=6\\)'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '直徑兩端的兩條切線平行，再加一條切線',
        points: [
          '\\(L\\perp\\overline{AB}\\)、\\(M\\perp\\overline{AB}\\)，所以 \\(L\\parallel M\\)，距離＝直徑。',
          '切線段等長：\\(\\overline{DE}=\\overline{AD}+\\overline{BE}\\)。',
          '補一條垂線成直角三角形，用畢氏求直徑。'
        ],
        visual: (h) => {
          const k = 10, O = [95, 140], r = 6 * k, A = [O[0], O[1] - r], B = [O[0], O[1] + r];
          const Dp = [O[0] + 18 * k, A[1]], E = [O[0] + 2 * k, B[1]], Cp = foot(O, Dp, E), H = [E[0], A[1]];
          SV.stepper(h, '0 0 440 290', [
            { t: 'L、M 切圓 O 於直徑兩端 A、B；N 切圓於 C，交 L、M 於 D、E', d: () => CIR(O, r) + L([30, A[1]], [340, A[1]]) + L([30, B[1]], [340, B[1]]) + L(add(Dp, mul(sub(Dp, E), 0.25)), add(E, mul(sub(E, Dp), 0.25))) + L(A, B, GRY, 1.6, '5 4') + D(O) + D(A) + D(B) + D(Dp) + D(E) + D(Cp) + LB(O, 'O', -20, 6) + LB(A, 'A', -10, -8) + LB(B, 'B', -10, 22) + LB(Dp, 'D', 4, -8) + LB(E, 'E', 6, 22) + LB(Cp, 'C', 8, 4) + LB([340, A[1]], 'L', 6, 5) + LB([340, B[1]], 'M', 6, 5) },
            { t: '\\(\\overline{AD}=18\\)、\\(\\overline{BE}=2\\)；切線段等長 \\(\\overline{DC}=18\\)、\\(\\overline{EC}=2\\)', d: () => L(A, Dp, RED, 3.4) + L(Dp, Cp, RED, 3.4) + L(B, E, BLU, 3.4) + L(E, Cp, BLU, 3.4) + TX((A[0] + Dp[0]) / 2, A[1] - 8, '18', { c: RED, anchor: 'middle' }) + TX((B[0] + E[0]) / 2, B[1] - 7, '2', { c: BLU, anchor: 'middle' }) },
            { t: '\\(\\overline{DE}=20\\)；作 \\(\\overline{EH}\\perp L\\)，\\(\\overline{DH}=18-2=16\\)', d: () => L(E, H, AMB, 3, '6 4') + RA(H, E, Dp) + D(H) + LB(H, 'H', -6, -8) + TX((H[0] + Dp[0]) / 2, A[1] + 20, '16', { c: AMB, anchor: 'middle' }) },
            { t: '\\(\\overline{EH}=\\sqrt{20^2-16^2}=12\\)＝直徑，所以 \\(\\overline{OC}=6\\)', d: () => L(O, Cp, GRN, 3.4) + RA(Cp, O, Dp) + boxText(250, 222, 180, 50, [{ t: '直徑 12，OC = 6', c: GRN, fs: 16 }], GRN) }
          ]);
        },
        caption: '同型題：直角梯形「直徑為一腰、另一腰切圓」，半徑＝(上底＋下底)÷2。',
        example: {
          q: '同上圖，若 \\(\\overline{AD}=12\\)、\\(\\overline{BE}=3\\)，求半徑。',
          steps: ['\\(\\overline{DE}=15\\)，水平差 \\(12-3=9\\)。', '直徑 \\(=\\sqrt{15^2-9^2}=12\\)。'],
          ans: '半徑 6'
        }
      },

      {
        sec: '2-1', secName: '切線段',
        title: '易錯：切線長、角平分線、30-60-90',
        points: [
          '內切圓切線長用<b>對邊</b>，不是鄰邊。',
          '角平分線過圓心，只對「兩條切線」的夾角成立。',
          '圓外切四邊形看<b>對邊</b>和，不是鄰邊和。'
        ],
        visual: (h) => {
          h.innerHTML = xoRows([
            { bad: '求 A 的切線長，寫 \\(s-\\overline{AB}\\)', good: '\\(s-\\overline{BC}\\)（A 的<b>對邊</b>）' },
            { bad: '兩條弦夾角的平分線也會過圓心', good: '只有圓外一點的<b>兩條切線</b>才行；兩弦要等長才過圓心' },
            { bad: '\\(\\angle APB=60^\\circ\\)，以為 \\(\\overline{OP}=r\\)', good: '\\(\\angle APO=30^\\circ\\)，\\(\\overline{OP}=2r\\)' },
            { bad: '圓外切四邊形 \\(\\overline{AB}+\\overline{BC}=\\overline{CD}+\\overline{DA}\\)', good: '<b>對邊</b>和相等：\\(\\overline{AB}+\\overline{CD}=\\overline{AD}+\\overline{BC}\\)' }
          ]);
        },
        caption: '切線段題型的共同起手式：從每個圓外點標出兩條等長的切線段。'
      },

      /* ================= 2-1 弦與弦心距 ================= */
      {
        sec: '2-1', secName: '弦與弦心距',
        title: '弦的中垂線一定通過圓心',
        points: [
          '「過圓心、垂直弦、平分弦」三件事，知道兩件就有第三件。',
          '過圓心且垂直弦 → <b>平分</b>弦；過圓心且平分弦 → <b>垂直</b>弦。',
          '找圓心：作兩條弦的中垂線，交點就是圓心。'
        ],
        visual: (h) => {
          const O = [220, 140], r = 110;
          const A = pol(O, r, 200), B = pol(O, r, 290), Cq = pol(O, r, 335), Dq = pol(O, r, 70);
          const pb = (p, q) => { const m = mul(add(p, q), 0.5), d = sub(q, p), n = [-d[1], d[0]], u = Math.hypot(n[0], n[1]); return [add(m, mul(n, 150 / u)), add(m, mul(n, -150 / u)), m]; };
          const [p1, p2, m1] = pb(A, B), [q1, q2, m2] = pb(Cq, Dq);
          SV.stepper(h, '0 0 440 290', [
            { t: '一個不知道圓心在哪的圓，任取弦 \\(\\overline{AB}\\)', d: () => CIR(O, r) + L(A, B, BLU, 3) + D(A) + D(B) + LB(A, 'A', -18, 6) + LB(B, 'B', -4, 22) },
            { t: '作 \\(\\overline{AB}\\) 的中垂線（垂直＋平分）', d: () => L(p1, p2, BLU, 2, '6 4') + RA(m1, B, O, 9) + TK(A, m1, 1, BLU) + TK(m1, B, 1, BLU) },
            { t: '再取弦 \\(\\overline{CD}\\)，也作中垂線', d: () => L(Cq, Dq, GRN, 3) + D(Cq) + D(Dq) + LB(Cq, 'C', 6, 10) + LB(Dq, 'D', 4, -8) + L(q1, q2, GRN, 2, '6 4') + RA(m2, Dq, O, 9) },
            { t: '兩條中垂線的交點，就是圓心 O', d: () => D(O, RED, 6) + LB(O, 'O', 8, -8, RED, 19) }
          ]);
        },
        caption: '這也是「破掉的圓盤找圓心」的方法。',
        example: {
          q: '圓 O 中，\\(\\overline{OM}\\perp\\) 弦 \\(\\overline{AB}\\) 於 M，\\(\\overline{AB}=10\\)，求 \\(\\overline{AM}\\)。',
          steps: ['過圓心且垂直弦 → 平分弦。', '\\(\\overline{AM}=10\\div2=5\\)。'],
          ans: '\\(\\overline{AM}=5\\)'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '弦心距愈大，弦愈短：弦長＝2√(r²－d²)',
        points: [
          '<span class="k">弦心距</span>：圓心到弦的距離（垂線段 \\(\\overline{OM}\\)）。',
          '直角 \\(\\triangle OMB\\)：\\(r^2=d^2+(\\text{半弦})^2\\)。',
          '同圓中，弦等長 ⇔ 弦心距相等；\\(d=0\\) 時是直徑（最長）。'
        ],
        formula: { label: '弦長', tex: '2\\sqrt{r^2-d^2}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'd', '弦心距 d ＝', 0, 9.5, 0.5, 6);
          const draw = () => {
            const d = +h.querySelector('#d').value; h.querySelector('#dv').textContent = d;
            const k = 12, O = [140, 135], r = 10 * k, half = Math.sqrt(100 - d * d), M = [O[0], O[1] + d * k];
            const A = [O[0] - half * k, M[1]], B = [O[0] + half * k, M[1]];
            let s = CIR(O, r) + PG([O, M, B], 'rgba(225,29,72,.10)') + L(A, B, BLU, 3.4) + L(O, B, GRN, 2.6);
            if (d > 0) s += L(O, M, RED, 3) + RA(M, B, O, 10) + TX(O[0] - 16, (O[1] + M[1]) / 2 + 5, 'd', { c: RED });
            s += D(O) + D(A) + D(B) + LB(O, 'O', -8, -10) + LB(A, 'A', -18, 6) + LB(B, 'B', 6, 6) + TX((O[0] + B[0]) / 2 + 4, (O[1] + B[1]) / 2 - 6, '10', { c: GRN });
            const L2 = 2 * half, nice = Number.isInteger(L2) ? L2 : L2.toFixed(2);
            s += boxText(282, 30, 150, 66, [{ t: `弦長 = 2√(100 − ${d * d})` }, { t: `= ${nice}${d === 0 ? '（直徑）' : ''}`, c: BLU, fs: 16 }], BLU);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#d').oninput = draw; draw();
        },
        caption: '拖到 d＝6：6-8-10，弦長 16；拖到 0 就是直徑 20。',
        example: {
          q: '半徑 10 的圓，弦心距 6，弦長是多少？',
          steps: ['半弦 \\(=\\sqrt{10^2-6^2}=8\\)。', '弦長 \\(=2\\times8=16\\)。'],
          ans: '16'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '弓形高（碗、隧道）：弦心距＝r－高',
        points: [
          '水面是弦，水深是<b>弓形高</b> h，弦心距＝\\(r-h\\)。',
          '設 \\(r\\) 列畢氏：\\(r^2=(\\text{半弦})^2+(r-h)^2\\)。',
          '水面下降：弦心距變大、水面變窄。'
        ],
        formula: { label: '弓形', tex: 'r^2=(\\tfrac{\\ell}{2})^2+(r-h)^2' },
        visual: (h) => {
          h.innerHTML = slider(h, 'w', '水深 h ＝', 1, 10, 1, 4);
          const draw = () => {
            const hh = +h.querySelector('#w').value; h.querySelector('#wv').textContent = hh;
            const k = 12, O = [150, 50], r = 10 * k, dd = 10 - hh, half = Math.sqrt(100 - dd * dd);
            const M = [O[0], O[1] + dd * k], A = [O[0] - half * k, M[1]], B = [O[0] + half * k, M[1]], G = [O[0], O[1] + r];
            const pts = []; for (let t = 0; t <= 60; t++) { const ang = Math.PI * (t / 60); const p = [O[0] + r * Math.cos(ang), O[1] + r * Math.sin(ang)]; if (p[1] >= M[1]) pts.push(p); }
            let s = PG(pts, 'rgba(56,189,248,.35)') + `<path d="M${f(O[0] - r)},${f(O[1])} A${r},${r} 0 0 0 ${f(O[0] + r)},${f(O[1])}" fill="none" stroke="${INK}" stroke-width="3"/>`;
            s += L([O[0] - r, O[1]], [O[0] + r, O[1]], GRY, 1.4, '4 4') + L(A, B, BLU, 3) + L(M, G, RED, 3) + L(O, A, GRN, 2.4);
            if (dd > 0) s += L(O, M, AMB, 2.4, '6 4') + RA(M, B, O, 9);
            s += D(O) + D(A) + D(B) + LB(O, 'O', -6, -8) + LB(G, 'G', 6, 14) + TX(G[0] + 8, (M[1] + G[1]) / 2 + 5, 'h', { c: RED });
            const w = 2 * half;
            s += boxText(292, 190, 140, 80, [{ t: 'r = 10' }, { t: `弦心距 = ${dd}`, c: AMB }, { t: `水面寬 = ${Number.isInteger(w) ? w : w.toFixed(1)}`, c: BLU }], BLU);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#w').oninput = draw; draw();
        },
        caption: '半徑 10 的碗：水深 4 時弦心距 6，水面寬 16。',
        example: {
          q: '半圓形的碗，水面寬 16 公分、水深 4 公分，求碗的半徑。',
          steps: ['半弦 8，弦心距 \\(r-4\\)。', '\\(r^2=8^2+(r-4)^2\\Rightarrow 8r=80\\)。'],
          ans: '\\(r=10\\) 公分'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '兩條平行弦的距離：同側相減、異側相加',
        points: [
          '先各自算出兩條弦的弦心距。',
          '兩弦在圓心同一側：距離＝兩弦心距<b>相減</b>。',
          '在圓心兩側：距離＝兩弦心距<b>相加</b>；沒給圖要寫兩個答案。'
        ],
        visual: (h) => {
          h.innerHTML = slider(h, 's', 'CD 的位置（0＝同側、1＝異側）：', 0, 1, 1, 0);
          const draw = () => {
            const side = +h.querySelector('#s').value; h.querySelector('#sv').textContent = side ? '異側' : '同側';
            const k = 7, O = [140, 145], r = 17 * k, yA = O[1] - 8 * k, yC = side ? O[1] + 15 * k : O[1] - 15 * k;
            let s = CIR(O, r) + L([O[0] - 15 * k, yA], [O[0] + 15 * k, yA], BLU, 3.2) + L([O[0] - 8 * k, yC], [O[0] + 8 * k, yC], RED, 3.2);
            s += L([O[0], yA], O, BLU, 2, '5 4') + L([O[0] + 3, yC], [O[0] + 3, O[1]], RED, 2, '5 4') + D(O) + LB(O, 'O', -22, 6);
            s += TX(O[0] - 60, yA - 8, 'AB = 30', { c: BLU, fs: 13, anchor: 'middle' }) + TX(O[0] - 32, side ? yC - 8 : yC + 18, 'CD = 16', { c: RED, fs: 13, anchor: 'middle' });
            s += TX(O[0] + 8, (yA + O[1]) / 2 + 4, '8', { c: BLU }) + TX(O[0] - 22, (yC + O[1]) / 2 + 4, '15', { c: RED });
            const x = 285; s += L([x, yA], [x, yC], AMB, 4) + TX(x + 8, (yA + yC) / 2 + 5, side ? '15 + 8 = 23' : '15 − 8 = 7', { c: AMB, fs: 16 });
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#s').oninput = draw; draw();
        },
        caption: '半徑 17：AB＝30 的弦心距 8，CD＝16 的弦心距 15。',
        example: {
          q: '半徑 17 的圓，平行弦 \\(\\overline{AB}=30\\)、\\(\\overline{CD}=16\\)，兩弦距離？',
          steps: ['弦心距：\\(\\sqrt{17^2-15^2}=8\\)，\\(\\sqrt{17^2-8^2}=15\\)。', '同側 \\(15-8\\)，異側 \\(15+8\\)。'],
          ans: '7 或 23'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '過圓內一點的弦：垂直 OP 時最短，過圓心時最長',
        points: [
          '過 P 的弦，弦心距最大只能是 \\(\\overline{OP}\\)。',
          '弦 \\(\\perp\\overline{OP}\\) 時弦心距最大 → 弦<b>最短</b>。',
          '弦通過圓心（直徑）時弦心距 0 → 弦<b>最長</b>。'
        ],
        visual: (h) => {
          h.innerHTML = slider(h, 't', '弦的方向轉 ', 0, 180, 5, 45);
          const draw = () => {
            const t = +h.querySelector('#t').value; h.querySelector('#tv').textContent = t + '°';
            const k = 12, O = [140, 140], r = 10 * k, P = [O[0], O[1] + 8 * k];
            const u = [Math.cos(t * Math.PI / 180), -Math.sin(t * Math.PI / 180)];
            const b = (P[0] - O[0]) * u[0] + (P[1] - O[1]) * u[1], cc = len(P, O) ** 2 - r * r, root = Math.sqrt(b * b - cc);
            const E1 = add(P, mul(u, -b + root)), E2 = add(P, mul(u, -b - root)), M = foot(O, E1, E2), Lc = len(E1, E2) / k;
            const col = Math.abs(Lc - 12) < 0.05 ? RED : Math.abs(Lc - 20) < 0.05 ? GRN : BLU;
            let s = CIR(O, r) + L(E1, E2, col, 3.4) + L(O, P, AMB, 2.4) + D(O) + D(P, AMB, 5.5) + LB(O, 'O', -20, -4) + LB(P, 'P', 8, 16, AMB);
            if (len(O, M) > 2) s += L(O, M, GRY, 1.8, '5 4') + RA(M, E1, O, 8);
            s += TX(O[0] + 6, (O[1] + P[1]) / 2 + 4, '8', { c: AMB });
            s += boxText(288, 30, 145, 88, [{ t: 'r = 10，OP = 8' }, { t: `弦長 = ${Number.isInteger(Math.round(Lc * 100) / 100) ? Math.round(Lc) : Lc.toFixed(2)}`, c: col, fs: 16 }, { t: col === RED ? '最短（⊥ OP）' : col === GRN ? '最長（直徑）' : '', c: col }], col);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#t').oninput = draw; draw();
        },
        caption: '轉到 0°（水平，⊥ OP）最短 12；轉到 90°（過圓心）最長 20。',
        example: {
          q: '半徑 10，圓內一點 P，\\(\\overline{OP}=8\\)，過 P 的最短弦與最長弦各多長？',
          steps: ['最短：\\(\\perp\\overline{OP}\\)，半弦 \\(\\sqrt{10^2-8^2}=6\\)，弦長 12。', '最長：過 P 的直徑 20。'],
          ans: '最短 12，最長 20'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '同心圓截弦：圓環面積只看兩個半弦',
        points: [
          '一條直線同時截大圓、小圓，\\(\\overline{OM}\\) 平分兩條弦。',
          '\\(R^2=d^2+(\\text{大半弦})^2\\)，\\(r^2=d^2+(\\text{小半弦})^2\\)。',
          '相減後 \\(d^2\\) 消掉：圓環＝\\(\\pi(\\text{大半弦}^2-\\text{小半弦}^2)\\)。'
        ],
        formula: { label: '圓環', tex: '\\pi(R^2-r^2)' },
        visual: (h) => {
          h.innerHTML = slider(h, 'd', '弦心距 d ＝', 0, 8, 1, 4);
          const draw = () => {
            const d = +h.querySelector('#d').value; h.querySelector('#dv').textContent = d;
            const k = 7.5, O = [140, 125], R2 = d * d + 169, r2 = d * d + 25, Rp = Math.sqrt(R2) * k, rp = Math.sqrt(r2) * k, M = [O[0], O[1] + d * k];
            const A = [O[0] - 13 * k, M[1]], Dd = [O[0] + 13 * k, M[1]], B = [O[0] - 5 * k, M[1]], Cc = [O[0] + 5 * k, M[1]];
            let s = `<circle cx="${f(O[0])}" cy="${f(O[1])}" r="${f((Rp + rp) / 2)}" fill="none" stroke="rgba(124,58,237,.18)" stroke-width="${f(Rp - rp)}"/>`;
            s += CIR(O, Rp, C, 'none', 2.4) + CIR(O, rp, C, 'none', 2.4) + L(A, Dd, INK, 2.6) + L(O, A, GRN, 2.4) + L(O, B, BLU, 2.4);
            if (d > 0) s += L(O, M, RED, 2.6) + RA(M, Dd, O, 8);
            s += D(O) + D(A) + D(B) + D(Cc) + D(Dd) + LB(O, 'O', -6, -10) + LB(A, 'A', -16, 16) + LB(B, 'B', -4, 18) + LB(Cc, 'C', -6, 18) + LB(Dd, 'D', 4, 16);
            s += boxText(292, 30, 140, 88, [{ t: `R² = ${R2}` }, { t: `r² = ${r2}` }, { t: `R² − r² = ${R2 - r2}`, c: RED, fs: 16 }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#d').oninput = draw; draw();
        },
        caption: 'AD＝26、BC＝10：不管 d 是多少，R²－r² 都是 144。',
        example: {
          q: '同心圓中，大圓弦 \\(\\overline{AD}=26\\) 截小圓得 \\(\\overline{BC}=10\\)，求圓環面積。',
          steps: ['半弦 13 和 5。', '\\(R^2-r^2=13^2-5^2=144\\)。'],
          ans: '\\(144\\pi\\)'
        }
      },

      {
        sec: '2-1', secName: '弦與弦心距',
        title: '易錯：半弦、兩解、弦心距寫錯',
        points: [
          '畢氏算出來的是<b>半弦</b>，弦長要再乘 2。',
          '平行弦沒給圖：同側、異側兩個答案。',
          '碗的題目：弦心距＝\\(r-h\\)，不是 h。'
        ],
        visual: (h) => {
          h.innerHTML = xoRows([
            { bad: '\\(\\sqrt{10^2-6^2}=8\\)，答弦長 8', good: '8 是半弦，弦長 \\(=16\\)' },
            { bad: '平行弦距離只寫 7', good: '同側 7、異側 23，兩個都要寫' },
            { bad: '水深 4，把弦心距寫成 4', good: '弦心距 \\(=r-4\\)，再列畢氏' },
            { bad: '過 P 最短的弦是過 P 的直徑', good: '直徑最<b>長</b>；最短的是垂直 \\(\\overline{OP}\\) 的弦' }
          ]);
        },
        caption: '看到圓心和弦，就作垂線、連半徑：直角三角形一出現，題目就解了一半。'
      }

    ]
  });
})();
