/* ============ 第 2 章　圓 ============
   節次：2-1 點、直線與圓（位置關係、切線 ⊥ 半徑）、2-1 切線段、2-1 弦與弦心距、
         2-2 圓心角與圓周角、2-2 圓內接四邊形與平行弦（2026-11-21 新增）、圖形速查四頁（2-1＋2-2 常見圖案）
   內容：例題數字全部自編並以程式驗算。
   課綱邊界（本章刻意不放）：三角比（sin／cos／tan，Ch.3 才教）、
     三角形的內心／外心／重心名稱（3-2 才教，內切圓只說「圓心 O」）、點到直線距離公式、弧度（radian）。
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

  // ---- 2-2 與圖形速查用小工具（2026-11-21 新增）----
  // 圓上一段弧（數學角度 d0 逆時針到 d1）加粗上色
  const ARC = (o, r, d0, d1, c, w = 6) =>
    `<polyline points="${SV.arcPoints(o[0], o[1], r, d0, d1)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" opacity=".6"/>`;
  // 頂點 v、兩邊指向 a、b 的角度（度）
  const angAt = (v, a, b) => {
    const u = sub(a, v), w = sub(b, v);
    return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / Math.hypot(u[0], u[1]) / Math.hypot(w[0], w[1])))) * 180 / Math.PI;
  };
  // 角弧標記（自動取小於 180° 的那一側）
  const AM = (v, a, b, rr = 22, c = AMB, lab = '', fs = 14) => {
    let a0 = SV.angleOf(v[0], v[1], a[0], a[1]), a1 = SV.angleOf(v[0], v[1], b[0], b[1]);
    if ((a1 - a0 + 360) % 360 > 180) { const t = a0; a0 = a1; a1 = t; }
    return SV.angle(v[0], v[1], rr, a0, a1, c, lab, { fs, lr: 13, w: 2.2 });
  };
  // 圓上點的標籤放在圓外側
  const LBo = (o, p, t, c = INK, dd = 17, fs = 16) => {
    const u = sub(p, o), m = Math.hypot(u[0], u[1]) || 1, q = add(p, mul(u, dd / m));
    return TX(q[0], q[1] + fs * 0.35, t, { anchor: 'middle', fs, c });
  };
  const OL = (o, dy = 22) => TX(o[0], o[1] + dy, 'O', { anchor: 'middle', fs: 16 });
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? (n === 1 ? '' : String(n)) : n + '/' + d; };
  // 速查頁右側結論框
  const QB = (lines, c = RED, y = 40) =>
    boxText(284, y, 152, 13 + lines.length * 21, lines.map(t => typeof t === 'string' ? { t, c, fs: 13 } : t), c);
  const AUX = (a, b) => L(a, b, RED, 2.4, '6 4');   // 輔助線：紅色虛線

  window.DECK.push({
    ch: 2,
    title: '圓',
    color: C,
    sections: ['2-1 點、直線與圓', '2-1 切線段', '2-1 弦與弦心距', '2-2 圓心角與圓周角', '2-2 圓內接四邊形與平行弦', '速查 常見圖形'],
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
      },

      /* ================= 2-2 圓心角與圓周角（2026-11-21 新增） ================= */
      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '圓心角＝弧的度數；弧長和扇形面積才看半徑',
        points: [
          '頂點在<b>圓心</b>的角叫<span class="k">圓心角</span>，它的度數就是所對<b>弧的度數</b>。',
          '整圈 360°、半圓 180°；小於半圓叫<span class="k">劣弧</span>，大於半圓叫<span class="k">優弧</span>。',
          '弧的度數和半徑無關；<b>弧長</b>、<b>扇形面積</b>才要乘上半徑。'
        ],
        formula: { label: '弧長、扇形面積', tex: '2\\pi r\\times\\frac{\\theta}{360},\\quad \\pi r^2\\times\\frac{\\theta}{360}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'th', '圓心角 θ ＝', 20, 340, 10, 80);
          const draw = () => {
            const th = +h.querySelector('#th').value; h.querySelector('#thv').textContent = th + '°';
            const O = [125, 150], r = 100, d0 = 90 - th / 2, d1 = 90 + th / 2, A = pol(O, r, d1), B = pol(O, r, d0);
            const kind = th < 180 ? ['劣弧', GRN] : th === 180 ? ['半圓', AMB] : ['優弧', RED];
            let s = CIR(O, r, GRY, 'none', 2);
            s += `<polygon points="${f(O[0])},${f(O[1])} ${SV.arcPoints(O[0], O[1], r, d0, d1)}" fill="rgba(124,58,237,.14)"/>`;
            s += ARC(O, r, d0, d1, kind[1], 7) + L(O, A, C) + L(O, B, C);
            s += SV.angle(O[0], O[1], 22, d0, d1, VIO, th + '°', { fs: 14, lr: 13, w: 2.2 });
            s += D(O) + D(A) + D(B) + OL(O) + LBo(O, A, 'A') + LBo(O, B, 'B');
            s += boxText(262, 46, 172, 97, [{ t: `θ = ${th}°：${kind[0]}`, c: kind[1], fs: 15 }, { t: '設半徑 r = 6' },
              { t: `弧長 = ${frac(th, 30)}π`, c: VIO, fs: 15 }, { t: `扇形面積 = ${frac(th, 10)}π`, c: VIO, fs: 15 }], VIO);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#th').oninput = draw; draw();
        },
        caption: '拖到 180° 變成半圓；超過 180° 就是優弧。',
        example: {
          q: '半徑 9 的圓，圓心角 80° 的扇形，求弧長和扇形面積。',
          steps: ['弧長 \\(=2\\pi\\times9\\times\\frac{80}{360}=4\\pi\\)。', '扇形面積 \\(=\\pi\\times9^2\\times\\frac{80}{360}=18\\pi\\)。'],
          ans: '弧長 \\(4\\pi\\)，扇形面積 \\(18\\pi\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '圓周角是同弧圓心角的一半：連半徑造等腰',
        points: [
          '頂點在<b>圓上</b>、兩邊都是弦的角叫<span class="k">圓周角</span>。',
          '圓周角＝同一段弧的圓心角的<b>一半</b>。',
          '證明關鍵：<b>連半徑造等腰三角形</b>，再用外角。'
        ],
        formula: { label: '圓周角', tex: '\\angle ACB=\\frac12\\angle AOB' },
        visual: (h) => {
          const O = [165, 150], r = 112, Cc = pol(O, r, 180), B = pol(O, r, 0), A = pol(O, r, 54);
          SV.stepper(h, '0 0 440 290', [
            { t: '圓周角 \\(\\angle ACB\\)：頂點 C 在圓上；這次 \\(\\overline{CB}\\) 剛好是直徑',
              d: () => CIR(O, r) + L(Cc, B) + L(Cc, A) + D(O) + D(A) + D(B) + D(Cc) + OL(O) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C') + AM(Cc, A, B, 36, RED, 'x') },
            { t: '連半徑 \\(\\overline{OA}\\)：\\(\\overline{OA}=\\overline{OC}\\)，等腰 → \\(\\angle OAC=x\\)',
              d: () => L(O, A, BLU, 3) + TK(O, A, 1, BLU) + TK(Cc, O, 1, BLU) + AM(A, Cc, O, 30, RED, 'x') },
            { t: '\\(\\angle AOB\\) 是 \\(\\triangle OAC\\) 的外角：\\(\\angle AOB=x+x=2x\\)',
              d: () => `<polygon points="${f(O[0])},${f(O[1])} ${SV.arcPoints(O[0], O[1], r, 0, 54)}" fill="rgba(124,58,237,.16)"/>` + AM(O, A, B, 26, VIO, '2x') },
            { t: '圓心在角內或角外時，連直徑把角拆成兩塊，相加或相減，結論一樣',
              d: () => boxText(292, 222, 140, 46, [{ t: '圓周角 = ½ 圓心角', c: VIO, fs: 15 }], VIO) }
          ]);
        },
        caption: '連半徑造等腰，是 2-2 最常用的輔助線。',
        example: {
          q: '圓 O 中，\\(\\overline{CB}\\) 是直徑，A 在圓上，\\(\\angle ACB=27^\\circ\\)，求 \\(\\angle AOB\\)。',
          steps: ['\\(\\overline{OA}=\\overline{OC}\\) → \\(\\angle OAC=27^\\circ\\)。', '外角：\\(\\angle AOB=27^\\circ+27^\\circ=54^\\circ\\)。'],
          ans: '\\(\\angle AOB=54^\\circ\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '同一段弧的圓周角都相等：頂點怎麼移都一樣',
        points: [
          'C、D 都在弧 AB 的另一側：\\(\\angle ACB=\\angle ADB\\)。',
          '因為兩個都等於 \\(\\frac12\\angle AOB\\)；等弧所對的圓周角也相等。',
          '看到兩個圓周角夾同一段弧（像<b>領結</b>），角度可以直接搬過去。'
        ],
        formula: { label: '同弧', tex: '\\angle ACB=\\angle ADB=\\frac12\\angle AOB' },
        visual: (h) => {
          h.innerHTML = slider(h, 't', '拖動頂點 C：', 0, 100, 1, 45);
          const draw = () => {
            const t = +h.querySelector('#t').value;
            const O = [140, 148], r = 105, A = pol(O, r, 202), B = pol(O, r, 338), Cc = pol(O, r, -10 + 130 * t / 100), Dd = pol(O, r, 160);
            const ac = Math.round(angAt(Cc, A, B)), ad = Math.round(angAt(Dd, A, B));
            h.querySelector('#tv').textContent = `∠ACB = ${ac}°`;
            let s = CIR(O, r) + ARC(O, r, 202, 338, GRN, 7) + L(O, A, VIO, 2, '6 4') + L(O, B, VIO, 2, '6 4');
            s += L(Cc, A, RED, 2.8) + L(Cc, B, RED, 2.8) + L(Dd, A, BLU, 2.8) + L(Dd, B, BLU, 2.8);
            s += AM(O, A, B, 20, VIO, '136°') + AM(Cc, A, B, 28, RED, ac + '°') + AM(Dd, A, B, 28, BLU, ad + '°');
            s += D(O) + D(A) + D(B) + D(Cc, RED, 6) + D(Dd, BLU, 6) + TX(O[0], O[1] - 12, 'O', { anchor: 'middle', fs: 16 });
            s += LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C', RED) + LBo(O, Dd, 'D', BLU);
            s += boxText(296, 30, 138, 76, [{ t: '∠AOB = 136°', c: VIO }, { t: `∠ACB = ${ac}°`, c: RED }, { t: `∠ADB = ${ad}°`, c: BLU }], VIO);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#t').oninput = draw; draw();
        },
        caption: '拖滑桿：C 跑到哪裡，∠ACB 都是 68°。',
        example: {
          q: '圓 O 中 \\(\\angle AOB=136^\\circ\\)，C、D 都在優弧 AB 上，求 \\(\\angle ACB\\)、\\(\\angle ADB\\)。',
          steps: ['兩個角都對劣弧 AB。', '\\(136^\\circ\\div2=68^\\circ\\)。'],
          ans: '兩個都是 \\(68^\\circ\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '直徑所對的圓周角是直角：看到直徑找直角',
        points: [
          '直徑對的弧是半圓 180°，圓周角＝180°÷2＝<b>90°</b>。',
          '反過來：90° 的圓周角，所對的弦一定是<b>直徑</b>。',
          '口訣：<b>看到直徑找直角，看到直角找直徑</b>，接著用畢氏定理。'
        ],
        formula: { label: '半圓', tex: '\\angle ACB=90^\\circ' },
        visual: (h) => {
          h.innerHTML = slider(h, 'p', '移動 C：', 15, 165, 5, 135);
          const draw = () => {
            const p = +h.querySelector('#p').value;
            const O = [140, 172], k = 16, r = 6.5 * k, A = pol(O, r, 180), B = pol(O, r, 0), Cc = pol(O, r, p);
            const ac = 13 * Math.cos(p * Math.PI / 360), bc = 13 * Math.sin(p * Math.PI / 360);
            h.querySelector('#pv').textContent = `∠ACB = ${Math.round(angAt(Cc, A, B))}°`;
            let s = CIR(O, r) + PG([A, Cc, B], 'rgba(225,29,72,.08)') + L(A, B, BLU, 3) + L(A, Cc, RED, 3) + L(B, Cc, RED, 3) + RA(Cc, A, B, 12, RED);
            s += D(O) + D(A) + D(B) + D(Cc) + OL(O) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C');
            s += TX(O[0] + 52, O[1] + 20, '直徑 13', { anchor: 'middle', fs: 13, c: BLU });
            s += boxText(270, 34, 164, 76, [{ t: `AC ≈ ${ac.toFixed(1)}，BC ≈ ${bc.toFixed(1)}`, fs: 13 },
              { t: `AC² + BC² = ${Math.round(ac * ac + bc * bc)}`, c: RED }, { t: '= 13²（直角三角形）', c: RED, fs: 13 }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#p').oninput = draw; draw();
        },
        caption: '拖滑桿：C 在半圓上怎麼移，∠ACB 都是直角。',
        example: {
          q: '\\(\\overline{AB}\\) 是圓的直徑，長 13；C 在圓上，\\(\\overline{AC}=5\\)，求 \\(\\overline{BC}\\)。',
          steps: ['直徑所對的圓周角：\\(\\angle ACB=90^\\circ\\)。', '\\(\\overline{BC}=\\sqrt{13^2-5^2}=12\\)。'],
          ans: '\\(\\overline{BC}=12\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '優弧陷阱：頂點在劣弧上，對的是對面的優弧',
        points: [
          '圓周角看的是<b>頂點對面</b>那一段弧。',
          '頂點在<b>劣弧</b>上 → 對的是優弧：\\(\\angle ACB=\\dfrac{360^\\circ-\\angle AOB}{2}\\)。',
          '一個頂點在劣弧、一個在優弧，兩個角加起來是 180°。'
        ],
        formula: { label: '頂點在劣弧', tex: '\\angle ACB=180^\\circ-\\frac12\\angle AOB' },
        visual: (h) => {
          h.innerHTML = slider(h, 'th', '∠AOB ＝', 40, 160, 10, 110);
          const draw = () => {
            const th = +h.querySelector('#th').value; h.querySelector('#thv').textContent = th + '°';
            const O = [150, 145], r = 105, A = pol(O, r, th / 2), B = pol(O, r, -th / 2), Cc = pol(O, r, 0), Dd = pol(O, r, 180);
            let s = CIR(O, r, C, 'none') + ARC(O, r, th / 2, 360 - th / 2, RED, 6) + ARC(O, r, -th / 2, th / 2, GRN, 7);
            s += L(O, A, VIO, 2, '6 4') + L(O, B, VIO, 2, '6 4') + L(Cc, A, RED, 2.8) + L(Cc, B, RED, 2.8) + L(Dd, A, GRN, 2.8) + L(Dd, B, GRN, 2.8);
            s += AM(O, A, B, 20, VIO, th + '°') + AM(Cc, A, B, 16, RED, '') + AM(Dd, A, B, 30, GRN, th / 2 + '°');
            s += TX(Cc[0] - 34, Cc[1] + 5, (180 - th / 2) + '°', { anchor: 'middle', fs: 14, c: RED });
            s += D(O) + D(A) + D(B) + D(Cc, RED, 6) + D(Dd, GRN, 6) + TX(O[0] - 16, O[1] + 20, 'O', { anchor: 'middle', fs: 16 });
            s += LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C', RED) + LBo(O, Dd, 'D', GRN);
            s += boxText(282, 196, 152, 76, [{ t: `∠AOB = ${th}°`, c: VIO }, { t: `D 對劣弧：${th / 2}°`, c: GRN }, { t: `C 對優弧：${180 - th / 2}°`, c: RED }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#th').oninput = draw; draw();
        },
        caption: '綠色是 D 對的劣弧，紅色是 C 對的優弧；兩個角永遠相加 180°。',
        example: {
          q: '圓 O 中 \\(\\angle AOB=110^\\circ\\)，C 在劣弧 AB 上，求 \\(\\angle ACB\\)。',
          steps: ['C 在劣弧上，對的是優弧：\\(360^\\circ-110^\\circ=250^\\circ\\)。', '\\(\\angle ACB=250^\\circ\\div2=125^\\circ\\)。'],
          ans: '\\(\\angle ACB=125^\\circ\\)'
        }
      },

      {
        sec: '2-2', secName: '圓心角與圓周角',
        title: '兩條切線＋圓周角：先求圓心角，再除以 2',
        points: [
          '先連 \\(\\overline{OA}\\)、\\(\\overline{OB}\\)：切線 ⊥ 半徑，得兩個直角。',
          '四邊形 PAOB 內角和 360°：\\(\\angle AOB=180^\\circ-\\angle P\\)。',
          'C 在優弧上：\\(\\angle ACB=\\dfrac{180^\\circ-\\angle P}{2}\\)。'
        ],
        formula: { label: '切線＋圓周角', tex: '\\angle ACB=\\frac{180^\\circ-\\angle P}{2}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'p', '∠P ＝', 40, 120, 2, 56);
          const draw = () => {
            const P = +h.querySelector('#p').value; h.querySelector('#pv').textContent = P + '°';
            const O = [118, 138], r = 80, hf = P / 2, Pp = [O[0] + r / Math.sin(hf * Math.PI / 180), O[1]];
            const A = pol(O, r, 90 - hf), B = pol(O, r, hf - 90), Cc = pol(O, r, 180);
            let s = CIR(O, r) + L(Pp, A) + L(Pp, B) + L(O, A, BLU, 2.6) + L(O, B, BLU, 2.6) + RA(A, O, Pp, 10) + RA(B, O, Pp, 10);
            s += L(Cc, A, RED, 2.8) + L(Cc, B, RED, 2.8);
            s += AM(Pp, A, B, 26, AMB, P + '°') + AM(O, A, B, 18, BLU, (180 - P) + '°') + AM(Cc, A, B, 30, RED, (180 - P) / 2 + '°');
            s += D(O) + D(A) + D(B) + D(Pp) + D(Cc) + TX(O[0] - 16, O[1] + 22, 'O', { anchor: 'middle', fs: 16 }) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C') + TX(Pp[0] + 6, Pp[1] - 8, 'P', { fs: 16 });
            s += boxText(232, 230, 202, 55, [{ t: `∠AOB = 180° − ${P}° = ${180 - P}°`, c: BLU, fs: 13 }, { t: `∠ACB = ${180 - P}° ÷ 2 = ${(180 - P) / 2}°`, c: RED, fs: 13 }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#p').oninput = draw; draw();
        },
        caption: '2-1 的切線＋2-2 的圓周角，段考最愛的組合。',
        example: {
          q: 'PA、PB 切圓 O 於 A、B，\\(\\angle P=56^\\circ\\)，C 在優弧 AB 上，求 \\(\\angle ACB\\)。',
          steps: ['\\(\\angle OAP=\\angle OBP=90^\\circ\\) → \\(\\angle AOB=180^\\circ-56^\\circ=124^\\circ\\)。', '\\(\\angle ACB=124^\\circ\\div2=62^\\circ\\)。'],
          ans: '\\(\\angle ACB=62^\\circ\\)'
        }
      },

      /* ================= 2-2 圓內接四邊形與平行弦 ================= */
      {
        sec: '2-2', secName: '圓內接四邊形與平行弦',
        title: '圓內接四邊形：對角互補，外角等於內對角',
        points: [
          '四個頂點都在圓上：<b>對角互補</b>，\\(\\angle A+\\angle C=180^\\circ\\)。',
          '<b>外角＝內對角</b>：延長 \\(\\overline{BC}\\) 到 E，\\(\\angle DCE=\\angle A\\)。',
          '畫得出外接圓的：正方形、長方形、等腰梯形；一般菱形、平行四邊形不行。'
        ],
        formula: { label: '對角互補', tex: '\\angle A+\\angle C=\\angle B+\\angle D=180^\\circ' },
        visual: (h) => {
          h.innerHTML = slider(h, 'd', '移動 D：', 40, 160, 10, 100);
          const draw = () => {
            const d = +h.querySelector('#d').value;
            const O = [140, 148], r = 100, A = pol(O, r, 200), B = pol(O, r, 290), Cc = pol(O, r, 10), Dd = pol(O, r, d);
            const E = add(Cc, mul(sub(Cc, B), 0.45));
            const a = Math.round(angAt(A, B, Dd)), c = Math.round(angAt(Cc, B, Dd)), e = Math.round(angAt(Cc, Dd, E));
            h.querySelector('#dv').textContent = `∠A = ${a}°`;
            let s = CIR(O, r, GRY, 'none', 2) + PG([A, B, Cc, Dd], 'rgba(124,58,237,.10)', C, 2.8) + L(Cc, E, INK, 2.4, '6 4');
            s += AM(A, B, Dd, 26, RED, a + '°') + AM(Cc, B, Dd, 22, BLU, c + '°') + AM(Cc, Dd, E, 34, RED, e + '°');
            s += D(A) + D(B) + D(Cc) + D(Dd) + D(E) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C') + LBo(O, Dd, 'D') + TX(E[0] + 8, E[1], 'E', { fs: 16 });
            s += boxText(284, 160, 150, 97, [{ t: `∠A = ${a}°`, c: RED }, { t: `∠C = ${c}°`, c: BLU }, { t: `∠A + ∠C = ${a + c}°` }, { t: `外角 ∠DCE = ${e}°`, c: RED }], RED);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#d').oninput = draw; draw();
        },
        caption: '拖滑桿：∠A、∠C 一起變，但和永遠是 180°；外角永遠等於 ∠A。',
        example: {
          q: '四邊形 ABCD 內接於圓，\\(\\angle A:\\angle C=3:2\\)，延長 \\(\\overline{BC}\\) 到 E，求 \\(\\angle A\\) 和 \\(\\angle DCE\\)。',
          steps: ['\\(3x+2x=180^\\circ\\) → \\(x=36^\\circ\\)，\\(\\angle A=108^\\circ\\)。', '外角＝內對角：\\(\\angle DCE=\\angle A=108^\\circ\\)。'],
          ans: '\\(\\angle A=108^\\circ\\)，\\(\\angle DCE=108^\\circ\\)'
        }
      },

      {
        sec: '2-2', secName: '圓內接四邊形與平行弦',
        title: '兩條平行弦，中間夾的兩段弧相等',
        points: [
          '\\(\\overline{AB}\\parallel\\overline{CD}\\) → 弧 AC＝弧 BD。',
          '理由：連 \\(\\overline{AD}\\)，內錯角 \\(\\angle BAD=\\angle ADC\\)，兩個圓周角對的弧就相等。',
          '四點連起來是<b>等腰梯形</b>；兩組平行弦可以一直推下去。'
        ],
        formula: { label: '平行弦', tex: '\\overline{AB}\\parallel\\overline{CD}\\Rightarrow\\overset{\\frown}{AC}=\\overset{\\frown}{BD}' },
        visual: (h) => {
          h.innerHTML = slider(h, 'q', '弧 CD ＝', 20, 160, 20, 60);
          const draw = () => {
            const q = +h.querySelector('#q').value, ph = q / 2; h.querySelector('#qv').textContent = q + '°';
            const O = [140, 145], r = 105, A = pol(O, r, 140), B = pol(O, r, 40), Cc = pol(O, r, 270 - ph), Dd = pol(O, r, 270 + ph);
            const side = 130 - ph, mAC = (140 + 270 - ph) / 2, mBD = (270 + ph + 400) / 2;
            let s = CIR(O, r, GRY, 'none', 2) + ARC(O, r, 140, 270 - ph, GRN, 7) + ARC(O, r, 270 + ph, 400, GRN, 7);
            s += L(A, B, INK, 3) + L(Cc, Dd, INK, 3) + L(A, Dd, AMB, 2.4, '6 4');
            s += AM(A, B, Dd, 26, AMB, '') + AM(Dd, Cc, A, 26, AMB, '');
            s += D(A) + D(B) + D(Cc) + D(Dd) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C') + LBo(O, Dd, 'D');
            s += LBo(O, pol(O, r, mAC), side + '°', GRN, 26, 15) + LBo(O, pol(O, r, mBD), side + '°', GRN, 26, 15);
            s += boxText(284, 30, 150, 97, [{ t: '弧 AB = 100°' }, { t: `弧 CD = ${q}°` }, { t: `弧 AC = ${side}°`, c: GRN }, { t: `弧 BD = ${side}°`, c: GRN }], GRN);
            h.querySelector('.fig').innerHTML = svg('0 0 440 290', s);
          };
          h.querySelector('#q').oninput = draw; draw();
        },
        caption: '橘色虛線 AD 造出一對內錯角；左右兩段綠色弧永遠一樣長。',
        example: {
          q: '\\(\\overline{AB}\\parallel\\overline{CD}\\)，弧 AB＝100°、弧 CD＝60°，求弧 AC。',
          steps: ['弧 AC＝弧 BD。', '\\((360^\\circ-100^\\circ-60^\\circ)\\div2=100^\\circ\\)。'],
          ans: '弧 AC＝100°'
        }
      },

      {
        sec: '2-2', secName: '圓內接四邊形與平行弦',
        title: '等弦：BC＝CD 時，OC 垂直平分 BD',
        points: [
          '同圓中：<b>等弦 ⇔ 等弧 ⇔ 等圓心角</b>。',
          'OB＝OD（半徑）、CB＝CD：O、C 都到 B、D 等距，所以 \\(\\overline{OC}\\) 是 \\(\\overline{BD}\\) 的<b>中垂線</b>。',
          '兩個直角三角形共用 \\(\\overline{BM}\\)，列兩次畢氏定理。'
        ],
        visual: (h) => {
          const O = [175, 162], r = 125, t1 = 2 * Math.asin(6 / 18) * 180 / Math.PI;
          const A = pol(O, r, 180), B = pol(O, r, 0), Cc = pol(O, r, t1), Dd = pol(O, r, 2 * t1), M = mul(add(B, Dd), 0.5);
          const mid = (p, q) => mul(add(p, q), 0.5), mL = pol(M, 17, t1 + 90), oL = pol(mid(O, M), 13, t1 - 90);
          SV.stepper(h, '0 0 440 300', [
            { t: '\\(\\overline{AB}\\) 是直徑，\\(\\overline{BC}=\\overline{CD}=12\\)，\\(\\overline{AD}=28\\)，求半徑',
              d: () => CIR(O, r) + L(A, B) + L(B, Cc) + L(Cc, Dd) + L(Dd, A) + TK(B, Cc, 1, RED) + TK(Cc, Dd, 1, RED) + D(O) + D(A) + D(B) + D(Cc) + D(Dd) + OL(O, 20)
                + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cc, 'C') + LBo(O, Dd, 'D') + LBo(O, mid(B, Cc), '12', RED, 14, 14) + LBo(O, mid(Cc, Dd), '12', RED, 14, 14) + LBo(O, mid(A, Dd), '28', INK, 12, 14) },
            { t: 'OB＝OD、CB＝CD → O、C 都在 \\(\\overline{BD}\\) 的中垂線上',
              d: () => L(B, Dd, BLU, 2.4) + L(O, Dd, BLU, 2, '6 4') + AUX(O, Cc) },
            { t: '\\(\\overline{OC}\\perp\\overline{BD}\\) 於中點 M；O、M 是兩邊中點 → \\(\\overline{OM}=\\frac12\\overline{AD}=14\\)',
              d: () => RA(M, Cc, B, 10, RED) + D(M, RED) + TX(mL[0], mL[1] + 5, 'M', { fs: 15, c: RED, anchor: 'middle' }) + TX(oL[0], oL[1] + 5, '14', { fs: 14, c: RED, anchor: 'middle' }) },
            { t: '\\(\\overline{BM}^2=R^2-14^2=12^2-(R-14)^2\\) → \\(R=18\\)',
              d: () => boxText(292, 238, 144, 55, [{ t: 'R² − 14R − 72 = 0', fs: 13 }, { t: 'R = 18，直徑 36', c: GRN, fs: 15 }], GRN) }
          ]);
        },
        caption: 'C 是弧 BD 的中點，和「OC 垂直平分 BD」是同一件事的兩種說法。',
        example: {
          q: '圓 O 中 \\(\\overline{AB}=\\overline{CD}\\)，\\(\\angle AOB=48^\\circ\\)，求 \\(\\angle COD\\) 和弧 CD 的度數。',
          steps: ['等弦 → 等圓心角：\\(\\angle COD=48^\\circ\\)。', '圓心角＝弧的度數：弧 CD＝48°。'],
          ans: '\\(\\angle COD=48^\\circ\\)，弧 CD＝48°'
        }
      },

      {
        sec: '2-2', secName: '圓內接四邊形與平行弦',
        title: '易錯：乘 2 除 2、優弧、外角、外接圓',
        points: [
          '圓周角 → 弧要<b>乘 2</b>；弧 → 圓周角要<b>除以 2</b>。',
          '頂點在劣弧上，對的是<b>優弧</b>。',
          '外角等於<b>不相鄰</b>的那個內角。'
        ],
        visual: (h) => {
          h.innerHTML = xoRows([
            { bad: '圓周角 40°，說所對的弧是 40°', good: '弧的度數＝圓周角×2＝80°' },
            { bad: '頂點在劣弧上，\\(\\angle ACB=\\frac12\\angle AOB\\)', good: '對優弧：\\((360^\\circ-\\angle AOB)\\div2\\)' },
            { bad: '外角 \\(\\angle DCE\\) 等於相鄰的 \\(\\angle B\\)', good: '外角＝<b>內對角</b> \\(\\angle A\\)' },
            { bad: '菱形也能畫外接圓', good: '要對角互補；菱形只有正方形可以' },
            { bad: '兩個圓的弧，度數一樣，弧長就一樣', good: '度數只看圓心角；弧長還要乘半徑' }
          ]);
        },
        caption: '2-2 的題目，先問自己：這個角對的是哪一段弧？'
      },

      /* ================= 圖形速查（2-1、2-2 常見圖案） ================= */
      {
        sec: '速查', secName: '常見圖形',
        title: '圖形速查①：看到切線，先連圓心到切點',
        points: [
          '① 甜筒形：切線段等長、\\(\\angle P+\\angle AOB=180^\\circ\\)。',
          '② 切線＋過圓心的割線：連半徑得直角，設 r 列畢氏。',
          '③ 三角形內切圓：切線長＝半周長－對邊。',
          '④ 圓外切四邊形：兩組對邊的和相等。',
          '⑤ 直角梯形夾著圓：補一條垂線，用畢氏求直徑。'
        ],
        visual: (h) => {
          const cone = () => {
            const O = [110, 145], r = 72, P = [262, 145], tg = tangents(O, r, P), A = tg[0], B = tg[1];
            return CIR(O, r) + L(P, A) + L(P, B) + AUX(O, A) + AUX(O, B) + AUX(O, P) + RA(A, O, P, 10) + RA(B, O, P, 10) + TK(P, A, 1, BLU) + TK(P, B, 1, BLU)
              + D(O) + D(A) + D(B) + D(P) + OL(O, -10) + LBo(O, A, 'A') + LBo(O, B, 'B') + TX(P[0] + 6, P[1] + 5, 'P', { fs: 16 })
              + QB(['PA = PB', '∠P + ∠AOB = 180°', 'OP 平分 ∠P']);
          };
          const secant = () => {
            const O = [100, 150], r = 62, P = [262, 150], A = tangents(O, r, P)[0], Cq = [O[0] + r, O[1]], Dq = [O[0] - r, O[1]];
            return CIR(O, r) + L(P, A) + L(P, Dq) + AUX(O, A) + RA(A, O, P, 10) + D(O) + D(A) + D(P) + D(Cq) + D(Dq)
              + TX(O[0], O[1] + 20, 'O', { anchor: 'middle', fs: 16 }) + LBo(O, A, 'A') + TX(Cq[0] + 4, Cq[1] + 20, 'C', { fs: 16 }) + TX(Dq[0] - 18, Dq[1] + 5, 'D', { fs: 16 }) + TX(P[0] + 6, P[1] + 5, 'P', { fs: 16 })
              + QB(['∠OAP = 90°', 'r² + PA² = OP²', 'OP = r + PC']);
          };
          const incircle = () => {
            const T1 = [30, 262], T2 = [262, 262], T3 = [95, 48], a = len(T2, T3), b = len(T1, T3), c = len(T1, T2), per = a + b + c;
            const I = [(a * T1[0] + b * T2[0] + c * T3[0]) / per, (a * T1[1] + b * T2[1] + c * T3[1]) / per];
            const area = Math.abs((T2[0] - T1[0]) * (T3[1] - T1[1]) - (T3[0] - T1[0]) * (T2[1] - T1[1])) / 2, ri = 2 * area / per;
            const F1 = foot(I, T2, T3), F2 = foot(I, T1, T3), F3 = foot(I, T1, T2);
            return PG([T1, T2, T3], 'none', INK, 2.6) + CIR(I, ri) + TK(T1, F2, 1, RED) + TK(T1, F3, 1, RED) + TK(T2, F1, 2, BLU) + TK(T2, F3, 2, BLU) + TK(T3, F1, 3, GRN) + TK(T3, F2, 3, GRN)
              + D(F1) + D(F2) + D(F3) + TX(T1[0] - 14, T1[1] + 6, 'A', { fs: 16 }) + TX(T2[0] + 4, T2[1] + 6, 'B', { fs: 16 }) + TX(T3[0] - 6, T3[1] - 8, 'C', { fs: 16 })
              + QB(['同色刻記的切線段等長', 'A 的切線長', '= 半周長 − BC']);
          };
          const quad = () => {
            const O = [140, 150], r = 72, th = [60, 150, 235, 320], T = th.map(t => pol(O, r, t));
            const V = (t1, t2) => { const dl = (t2 - t1 + 360) % 360; return pol(O, r / Math.cos(dl / 2 * Math.PI / 180), t1 + dl / 2); };
            const A = V(60, 150), B = V(150, 235), Cq = V(235, 320), Dq = V(320, 60);
            return PG([A, B, Cq, Dq], 'none', INK, 2.6) + CIR(O, r) + T.map(p => D(p)).join('')
              + TK(A, T[0], 1, RED) + TK(A, T[1], 1, RED) + TK(B, T[1], 2, BLU) + TK(B, T[2], 2, BLU) + TK(Cq, T[2], 3, GRN) + TK(Cq, T[3], 3, GRN) + TK(Dq, T[3], 1, AMB) + TK(Dq, T[0], 1, AMB)
              + LBo(O, A, 'A', INK, 14) + LBo(O, B, 'B', INK, 14) + LBo(O, Cq, 'C', INK, 14) + LBo(O, Dq, 'D', INK, 14)
              + QB(['AB + CD', '= AD + BC', '（對邊和相等）']);
          };
          const trap = () => {
            const k = 8, O = [95, 145], r = 6 * k, A = [O[0], O[1] - r], B = [O[0], O[1] + r], Dp = [O[0] + 18 * k, A[1]], E = [O[0] + 2 * k, B[1]], Cp = foot(O, Dp, E), H = [E[0], A[1]];
            return CIR(O, r) + L([30, A[1]], [268, A[1]]) + L([30, B[1]], [268, B[1]]) + L(add(Dp, mul(sub(Dp, E), 0.15)), add(E, mul(sub(E, Dp), 0.2)))
              + L(A, B, GRY, 1.6, '5 4') + AUX(E, H) + RA(H, E, Dp, 10, RED) + D(A) + D(B) + D(Dp) + D(E) + D(Cp) + D(H)
              + LB(A, 'A', -10, -8) + LB(B, 'B', -10, 22) + LB(Dp, 'D', 4, -8) + LB(E, 'E', 6, 22) + LB(Cp, 'C', 8, 4) + LB(H, 'H', -6, -8, RED)
              + QB(['DE = AD + BE', 'DH = AD − BE', 'EH = 直徑（畢氏）']);
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '<b>甜筒形</b>（圓外一點兩條切線）→ 連 \\(\\overline{OA}\\)、\\(\\overline{OB}\\)、\\(\\overline{OP}\\)', d: cone },
            { t: '<b>切線＋過圓心的割線</b> → 連 \\(\\overline{OA}\\) 得直角，設 r 列畢氏', d: secant },
            { t: '<b>三角形外面包著圓</b>（內切圓）→ 每個頂點標兩段等長的切線段', d: incircle },
            { t: '<b>四邊形每一邊都切圓</b> → 四個頂點各有兩段等長的切線段', d: quad },
            { t: '<b>直角梯形夾著圓</b>（直徑兩端的切線）→ 補一條垂線成直角三角形', d: trap }
          ], { acc: false });
        },
        caption: '拖滑桿換圖案；紅色虛線是要補的輔助線。',
        example: {
          q: '從 P 作兩條切線切圓 O 於 A、B，\\(\\angle APB=70^\\circ\\)，求 \\(\\angle AOB\\)。這是哪一個圖案？',
          steps: ['圖案①甜筒形：連 \\(\\overline{OA}\\)、\\(\\overline{OB}\\) 得兩個直角。', '四邊形 PAOB 內角和 360°：\\(\\angle AOB=180^\\circ-70^\\circ=110^\\circ\\)。'],
          ans: '圖案①，\\(\\angle AOB=110^\\circ\\)'
        }
      },

      {
        sec: '速查', secName: '常見圖形',
        title: '圖形速查②：看到弦，先從圓心作弦的垂線',
        points: [
          '① 弦＋圓心：作弦心距，半徑²＝弦心距²＋半弦²。',
          '② 碗、隧道（弓形）：弦心距＝\\(r-h\\)。',
          '③ 兩條平行弦：同側相減、異側相加。',
          '④ 同心圓，大圓的弦切小圓：圓環面積＝π×半弦²。',
          '⑤ 相鄰兩弦等長（BC＝CD）：\\(\\overline{OC}\\) 垂直平分 \\(\\overline{BD}\\)。'
        ],
        visual: (h) => {
          const chord = () => {
            const O = [130, 135], r = 100, A = pol(O, r, 210), B = pol(O, r, 330), M = mul(add(A, B), 0.5);
            return CIR(O, r) + L(A, B, INK, 3) + AUX(O, M) + AUX(O, A) + RA(M, O, B, 10, RED) + D(O) + D(A) + D(B) + D(M, RED)
              + OL(O, -10) + LBo(O, A, 'A') + LBo(O, B, 'B') + TX(M[0] + 4, M[1] + 18, 'M', { fs: 15, c: RED })
              + TX(O[0] + 6, (O[1] + M[1]) / 2 + 4, 'd', { fs: 15, c: RED }) + TX((O[0] + A[0]) / 2 - 4, (O[1] + A[1]) / 2 - 6, 'r', { fs: 15, c: RED })
              + QB(['r² = d² + 半弦²', '弦長 = 2 × 半弦']);
          };
          const bowl = () => {
            const O = [140, 80], r = 120, A = pol(O, r, 205), B = pol(O, r, 335), M = mul(add(A, B), 0.5), Bt = [O[0], O[1] + r];
            return `<polygon points="${SV.arcPoints(O[0], O[1], r, 205, 335)}" fill="rgba(37,99,235,.14)"/>`
              + `<polyline points="${SV.arcPoints(O[0], O[1], r, 180, 360)}" fill="none" stroke="${INK}" stroke-width="3.4"/>`
              + L(A, B, BLU, 3) + L(M, Bt, AMB, 2.8) + TX(M[0] + 6, (M[1] + Bt[1]) / 2 + 5, 'h', { fs: 16, c: AMB })
              + AUX(O, A) + AUX(O, M) + RA(M, O, B, 10, RED) + D(O, RED) + D(A) + D(B) + D(M) + TX(O[0] + 6, O[1] - 6, 'O（補出來）', { fs: 13, c: RED })
              + TX((O[0] + A[0]) / 2 - 10, (O[1] + A[1]) / 2, 'r', { fs: 15, c: RED })
              + QB(['弦心距 = r − h', 'r² = 半弦² + (r − h)²'], RED, 160);
          };
          const para = () => {
            const O = [130, 145], r = 100, d1 = 30, d2 = 78, w1 = Math.sqrt(r * r - d1 * d1), w2 = Math.sqrt(r * r - d2 * d2);
            const M1 = [O[0], O[1] + d1], M2 = [O[0], O[1] + d2];
            return CIR(O, r) + L([O[0] - w1, M1[1]], [O[0] + w1, M1[1]], INK, 3) + L([O[0] - w2, M2[1]], [O[0] + w2, M2[1]], INK, 3)
              + AUX([O[0], O[1] - r], [O[0], O[1] + r]) + RA(M1, O, [O[0] + 30, M1[1]], 9, RED) + RA(M2, O, [O[0] + 30, M2[1]], 9, RED)
              + D(O) + OL(O, -10) + TX(O[0] - 22, O[1] + 20, 'd₁', { fs: 14, c: RED }) + TX(O[0] + 6, M2[1] - 6, 'd₂', { fs: 14, c: RED })
              + QB(['同側：d₁ − d₂', '異側：d₁ + d₂', '沒給圖 → 兩個答案']);
          };
          const ring = () => {
            const O = [130, 145], R = 105, r = 55, w = Math.sqrt(R * R - r * r), T = [O[0], O[1] + r], A = [O[0] - w, T[1]], B = [O[0] + w, T[1]];
            return CIR(O, R) + CIR(O, r, BLU, 'rgba(37,99,235,.06)') + L(A, B, INK, 3) + AUX(O, T) + AUX(O, A) + RA(T, O, B, 9, RED)
              + D(O) + D(T, RED) + D(A) + D(B) + OL(O, -10) + TX(T[0] + 4, T[1] + 18, 'T', { fs: 15, c: RED }) + LBo(O, A, 'A', INK, 12) + LBo(O, B, 'B', INK, 12)
              + QB(['R² − r² = 半弦²', '圓環 = π × 半弦²']);
          };
          const eqc = () => {
            const O = [130, 160], r = 100, t1 = 2 * Math.asin(6 / 18) * 180 / Math.PI, A = pol(O, r, 180), B = pol(O, r, 0), Cq = pol(O, r, t1), Dq = pol(O, r, 2 * t1), M = mul(add(B, Dq), 0.5);
            return CIR(O, r) + L(A, B, GRY, 2) + L(B, Cq) + L(Cq, Dq) + TK(B, Cq, 1, BLU) + TK(Cq, Dq, 1, BLU) + L(B, Dq, INK, 2.4) + AUX(O, Cq) + RA(M, Cq, B, 9, RED)
              + D(O) + D(B) + D(Cq) + D(Dq) + D(M, RED) + OL(O, 20) + LBo(O, B, 'B') + LBo(O, Cq, 'C') + LBo(O, Dq, 'D')
              + QB(['BC = CD', '→ OC 垂直平分 BD', '（C 是弧 BD 中點）']);
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '<b>弦＋圓心</b> → 作弦心距 \\(\\overline{OM}\\)、連半徑 \\(\\overline{OA}\\)', d: chord },
            { t: '<b>碗、隧道（弓形）</b> → 先補出圓心，弦心距＝\\(r-h\\)', d: bowl },
            { t: '<b>兩條平行弦</b> → 過圓心的一條垂線，同時平分兩條弦', d: para },
            { t: '<b>同心圓，大圓的弦切小圓</b> → 連切點和弦的端點', d: ring },
            { t: '<b>相鄰兩弦等長</b>（BC＝CD）→ 連 \\(\\overline{OC}\\)，它垂直平分 \\(\\overline{BD}\\)', d: eqc }
          ], { acc: false });
        },
        caption: '弦的題目幾乎都是同一個動作：圓心作垂線＋連半徑，變成直角三角形。',
        example: {
          q: '半徑 10 的圓，弦 \\(\\overline{AB}=16\\)，求弦心距。這是哪一個圖案？',
          steps: ['圖案①：作 \\(\\overline{OM}\\perp\\overline{AB}\\)，半弦＝8。', '\\(\\overline{OM}=\\sqrt{10^2-8^2}=6\\)。'],
          ans: '圖案①，弦心距 6'
        }
      },

      {
        sec: '速查', secName: '常見圖形',
        title: '圖形速查③：看到圓上的角，先找它對哪一段弧',
        points: [
          '① 直徑＋圓上一點：那個角是 90°。',
          '② 箭頭形：圓周角＝圓心角÷2。',
          '③ 領結形：同一段弧的圓周角相等。',
          '④ 凹進去的角（頂點在劣弧）：對優弧，(360°－圓心角)÷2。',
          '⑤ 兩條半徑夾一條弦：等腰三角形，底角相等。',
          '⑥ 兩切線＋圓上一點：先求 ∠AOB＝180°－∠P。'
        ],
        visual: (h) => {
          const O = [130, 148], r = 100;
          const diam = () => {
            const A = pol(O, r, 180), B = pol(O, r, 0), Cq = pol(O, r, 118);
            return CIR(O, r) + L(A, B, BLU, 3) + L(A, Cq) + L(B, Cq) + RA(Cq, A, B, 12, RED) + D(O) + D(A) + D(B) + D(Cq) + OL(O) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C')
              + QB(['∠ACB = 90°', '看到直角也要找直徑'], RED);
          };
          const arrow = () => {
            const A = pol(O, r, 235), B = pol(O, r, 305), Cq = pol(O, r, 90);
            return CIR(O, r) + ARC(O, r, 235, 305, GRN, 7) + L(Cq, A) + L(Cq, B) + L(O, A, RED, 2.8) + L(O, B, RED, 2.8) + AM(O, A, B, 20, RED, '2x') + AM(Cq, A, B, 34, BLU, 'x')
              + D(O) + D(A) + D(B) + D(Cq) + TX(O[0] - 18, O[1] + 4, 'O', { fs: 16 }) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C')
              + QB(['∠ACB = ½ ∠AOB', '（同一段弧 AB）'], BLU);
          };
          const bow = () => {
            const A = pol(O, r, 220), B = pol(O, r, 320), Cq = pol(O, r, 55), Dq = pol(O, r, 125);
            return CIR(O, r) + ARC(O, r, 220, 320, GRN, 7) + L(Cq, A, RED, 2.6) + L(Cq, B, RED, 2.6) + L(Dq, A, BLU, 2.6) + L(Dq, B, BLU, 2.6)
              + AM(Cq, A, B, 30, RED, 'x') + AM(Dq, A, B, 30, BLU, 'x') + D(A) + D(B) + D(Cq) + D(Dq) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C') + LBo(O, Dq, 'D')
              + QB(['∠ACB = ∠ADB', '（同弧圓周角相等）'], GRN);
          };
          const dent = () => {
            const A = pol(O, r, 50), B = pol(O, r, -50), Cq = pol(O, r, 0);
            return CIR(O, r, C, 'none') + ARC(O, r, 50, 310, RED, 6) + L(Cq, A, RED, 2.8) + L(Cq, B, RED, 2.8) + L(O, A, VIO, 2, '6 4') + L(O, B, VIO, 2, '6 4')
              + AM(Cq, A, B, 14, RED, '') + AM(O, A, B, 20, VIO, '') + D(O) + D(A) + D(B) + D(Cq, RED, 6) + OL(O) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C', RED)
              + QB(['C 對紅色優弧', '∠ACB =', '(360° − ∠AOB) ÷ 2'], RED, 180);
          };
          const iso = () => {
            const A = pol(O, r, 200), B = pol(O, r, 330);
            return CIR(O, r) + L(O, A, BLU, 2.8) + L(O, B, BLU, 2.8) + L(A, B) + TK(O, A, 1, BLU) + TK(O, B, 1, BLU) + AM(A, O, B, 30, RED, 'x') + AM(B, A, O, 30, RED, 'x')
              + D(O) + D(A) + D(B) + OL(O, -10) + LBo(O, A, 'A') + LBo(O, B, 'B')
              + QB(['OA = OB（半徑）', '→ 底角相等'], BLU);
          };
          const tan2 = () => {
            const Q = [110, 145], rr = 70, P = [Q[0] + 140, Q[1]], A = pol(Q, rr, 60), B = pol(Q, rr, -60), Cq = pol(Q, rr, 180);
            return CIR(Q, rr) + L(P, A) + L(P, B) + AUX(Q, A) + AUX(Q, B) + RA(A, Q, P, 9, RED) + RA(B, Q, P, 9, RED) + L(Cq, A, BLU, 2.6) + L(Cq, B, BLU, 2.6)
              + AM(P, A, B, 24, AMB, '') + AM(Q, A, B, 16, RED, '') + AM(Cq, A, B, 28, BLU, '')
              + D(Q) + D(A) + D(B) + D(P) + D(Cq) + OL(Q) + LBo(Q, A, 'A') + LBo(Q, B, 'B') + LBo(Q, Cq, 'C') + TX(P[0] + 6, P[1] + 5, 'P', { fs: 16 })
              + QB(['∠AOB = 180° − ∠P', '∠ACB = ∠AOB ÷ 2'], BLU);
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '<b>直徑＋圓上一點</b> → 那個角是 90°，接著用畢氏', d: diam },
            { t: '<b>箭頭形</b>（圓心角和圓周角對同一段弧）→ 圓周角是一半', d: arrow },
            { t: '<b>領結形</b>（兩個圓周角夾同一段弧）→ 兩個角相等', d: bow },
            { t: '<b>角往圓心凹進去</b>（頂點在劣弧上）→ 它對的是對面的優弧', d: dent },
            { t: '<b>兩條半徑＋一條弦</b> → 等腰三角形，兩個底角相等', d: iso },
            { t: '<b>兩切線＋圓上一點</b> → 連 \\(\\overline{OA}\\)、\\(\\overline{OB}\\)，先求圓心角', d: tan2 }
          ], { acc: false });
        },
        caption: '角的題目只有一條主線：角 → 弧 → 角。',
        example: {
          q: 'A、B、C 在圓 O 上，C 在劣弧 AB 上，\\(\\angle AOB=80^\\circ\\)，求 \\(\\angle ACB\\)。這是哪一個圖案？',
          steps: ['圖案④：C 在劣弧上，對的是 \\(360^\\circ-80^\\circ=280^\\circ\\) 的優弧。', '\\(\\angle ACB=280^\\circ\\div2=140^\\circ\\)。'],
          ans: '圖案④，\\(\\angle ACB=140^\\circ\\)'
        }
      },

      {
        sec: '速查', secName: '常見圖形',
        title: '圖形速查④：看到圓上的四邊形、交叉的線',
        points: [
          '① 圓內接四邊形：對角互補、外角＝內對角。',
          '② 兩條平行弦：中間夾等弧，四點連成等腰梯形。',
          '③ 兩弦在圓內交叉：交角＝兩段弧的和÷2。',
          '④ 兩條割線在圓外交會：夾角＝(遠弧－近弧)÷2。',
          '⑤ 正六邊形：切成 6 個正三角形，邊長＝半徑。'
        ],
        visual: (h) => {
          const O = [130, 148], r = 100;
          const cyc = () => {
            const A = pol(O, r, 200), B = pol(O, r, 290), Cq = pol(O, r, 10), Dq = pol(O, r, 110), E = add(Cq, mul(sub(Cq, B), 0.45));
            return CIR(O, r, GRY, 'none', 2) + PG([A, B, Cq, Dq], 'rgba(124,58,237,.10)', C, 2.8) + L(Cq, E, INK, 2.2, '6 4')
              + AM(A, B, Dq, 26, RED, 'x') + AM(Cq, B, Dq, 20, BLU, '') + AM(Cq, Dq, E, 32, RED, 'x')
              + D(A) + D(B) + D(Cq) + D(Dq) + D(E) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C') + LBo(O, Dq, 'D') + TX(E[0] + 8, E[1], 'E', { fs: 16 })
              + QB(['∠A + ∠C = 180°', '外角 ∠DCE = ∠A'], RED, 180);
          };
          const par = () => {
            const A = pol(O, r, 140), B = pol(O, r, 40), Cq = pol(O, r, 240), Dq = pol(O, r, 300);
            return CIR(O, r, GRY, 'none', 2) + ARC(O, r, 140, 240, GRN, 7) + ARC(O, r, 300, 400, GRN, 7) + L(A, B, INK, 3) + L(Cq, Dq, INK, 3) + L(A, Cq, GRY, 2, '5 4') + L(B, Dq, GRY, 2, '5 4')
              + D(A) + D(B) + D(Cq) + D(Dq) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C') + LBo(O, Dq, 'D')
              + QB(['AB ∥ CD', '→ 弧 AC = 弧 BD', '→ 等腰梯形'], GRN);
          };
          const cross = () => {
            const A = pol(O, r, 125), B = pol(O, r, 55), Cq = pol(O, r, -65), Dq = pol(O, r, -115), E = xline(A, Cq, B, Dq);
            return CIR(O, r, GRY, 'none', 2) + ARC(O, r, 55, 125, GRN, 7) + ARC(O, r, 245, 295, BLU, 7) + L(A, Cq) + L(B, Dq) + AUX(B, Cq)
              + AM(E, A, B, 18, RED, '') + D(A) + D(B) + D(Cq) + D(Dq) + D(E, RED) + LBo(O, A, 'A') + LBo(O, B, 'B') + LBo(O, Cq, 'C') + LBo(O, Dq, 'D') + TX(E[0] + 10, E[1] + 5, 'E', { fs: 15, c: RED })
              + QB(['∠AEB =', '(弧 AB + 弧 CD) ÷ 2', '連 BC，用外角'], RED);
          };
          const outside = () => {
            const Q = [182, 148], rr = 82, A = pol(Q, rr, 50), B = pol(Q, rr, -50), Cq = pol(Q, rr, 165), Dq = pol(Q, rr, 195), P = xline(A, Cq, B, Dq);
            return CIR(Q, rr, GRY, 'none', 2) + ARC(Q, rr, -50, 50, GRN, 7) + ARC(Q, rr, 165, 195, BLU, 7) + L(P, A) + L(P, B) + AUX(A, Dq)
              + AM(P, A, B, 30, RED, '') + D(A) + D(B) + D(Cq) + D(Dq) + D(P) + LBo(Q, A, 'A') + LBo(Q, B, 'B') + LBo(Q, Cq, 'C', INK, 14) + LBo(Q, Dq, 'D', INK, 14) + TX(P[0] - 4, P[1] - 10, 'P', { fs: 16 })
              + QB(['∠P =', '(遠弧 AB − 近弧 CD) ÷ 2', '連 AD，用外角'], RED, 196);
          };
          const hexa = () => {
            const V6 = [0, 60, 120, 180, 240, 300].map(t => pol(O, r, t));
            return CIR(O, r) + PG(V6, 'rgba(37,99,235,.08)', BLU, 2.8) + V6.map(p => AUX(O, p) + D(p)).join('') + D(O) + TK(V6[0], V6[1], 1, BLU) + TK(O, V6[0], 1, BLU) + TK(O, V6[1], 1, BLU)
              + QB(['6 個正三角形', '邊長 = 半徑', '每個內角 120°'], BLU);
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '<b>四個頂點都在圓上</b> → 對角互補、外角＝內對角', d: cyc },
            { t: '<b>兩條平行弦</b> → 中間夾的兩段弧相等', d: par },
            { t: '<b>兩弦在圓內交叉</b> → 連一條弦，用三角形的外角', d: cross },
            { t: '<b>兩條割線在圓外交會</b> → 連 \\(\\overline{AD}\\)，外角相減', d: outside },
            { t: '<b>正六邊形和圓</b> → 圓心連到每個頂點，切成 6 個正三角形', d: hexa }
          ], { acc: false });
        },
        caption: '③、④ 不用背公式：連一條弦，用「三角形外角＝兩內角和」就推得出來。',
        example: {
          q: '兩弦 \\(\\overline{AC}\\)、\\(\\overline{BD}\\) 交於 E，弧 AB＝70°、弧 CD＝50°，求 \\(\\angle AEB\\)。',
          steps: ['圖案③：連 \\(\\overline{BC}\\)，\\(\\angle ACB=35^\\circ\\)、\\(\\angle DBC=25^\\circ\\)。', '\\(\\angle AEB\\) 是 \\(\\triangle EBC\\) 的外角：\\(35^\\circ+25^\\circ=60^\\circ\\)。'],
          ans: '圖案③，\\(\\angle AEB=60^\\circ\\)'
        }
      }

    ]
  });
})();
