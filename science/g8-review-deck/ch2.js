/* ============ 第 2 章　壓力 ============
   節次：2-1 固體壓力、2-2 大氣與氣體壓力
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：浮力（ch1 已做）、帕斯卡原理與液壓機械、
     查理定律、表面張力與毛細現象。
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
    ch: 2,
    title: '壓力',
    color: C,
    sections: ['2-1 固體壓力', '2-2 大氣與氣體壓力'],
    slides: [

      /* ---------- 固體壓力 ---------- */
      {
        sec: '2-1', secName: '固體壓力',
        title: '固體壓力看重量除面積：等高同材圓柱壓力全相等',
        points: [
          '<span class="k">\\(P＝F÷A\\)</span>：固體壓力＝重量除以底面積。',
          '等高同材圓柱：\\(P＝ρhg\\)，<b>面積約掉</b>。',
          '粗細不同也一樣：a＝b＝c。'
        ],
        formula: { label: '固體壓力', tex: 'P=\\frac{W}{A}=\\rho hg' },
        visual: (h) => {
          let s = `<rect x="40" y="220" width="360" height="10" rx="4" fill="#94a3b8"/>`;
          const cols = [[90, 40], [190, 80], [310, 120]];
          const names = ['a', 'b', 'c'];
          cols.forEach((c, i) => {
            s += `<rect x="${c[0]}" y="${220 - 110}" width="${c[1]}" height="110" rx="4" fill="rgba(124,58,237,.15)" stroke="${VIO}" stroke-width="2"/>`;
            s += TX(c[0] + c[1] / 2, 250, names[i], { fs: 16, c: VIO, anchor: 'middle' });
          });
          s += TX(220, 90, '同高同材 → P 相等', { fs: 15, c: C, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 265', s);
        },
        caption: '一樣高、一樣重料：底面積在除法裡自己消掉。',
        example: {
          q: '同材質等高圓柱 a、b、c 粗細不同，對桌面壓力關係？',
          steps: ['\\(P=W/A=(\\rho Ahg)/A=\\rho hg\\)。', '\\(\\rho\\)、\\(h\\) 相同 → 與 A 無關。'],
          ans: 'a＝b＝c'
        }
      },

      /* ---------- 壓力互動 ---------- */
      {
        sec: '2-1', secName: '固體壓力',
        title: '面積小兩倍，壓力大兩倍：1200gw 壓給你看',
        points: [
          '重量固定 \\(1200\\)gw，只換底面積，看壓力怎麼變。',
          '面積 \\(120→60\\)（小兩倍），壓力 \\(10→20\\)（大兩倍）。',
          '問自己：面積剩三分之一時，壓力幾倍？'
        ],
        formula: { label: '反比', tex: 'P=\\frac{1200}{A}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>底面積 A ＝ <span class="ival" id="av">120</span></label>
            <input type="range" id="as" min="0" max="5" step="1" value="0"></div></div>`;
          const As = [120, 60, 40, 30, 24, 20];
          const draw = () => {
            const i = Math.min(Math.max(+h.querySelector('#as').value, 0), As.length - 1), A = As[i], P = 1200 / A;
            h.querySelector('#av').textContent = A;
            // 同一塊 1200 gw 的磚換方向放：底面寬度和面積成正比
            const bw = A * 2.2, bh = 6000 / bw, x = 220 - bw / 2, gy = 185;
            let s = TX(220, 26, 'P ＝ 1200 ÷ ' + A + ' ＝ ' + P, { fs: 22, c: C, anchor: 'middle' });
            s += `<rect x="${x}" y="${gy - bh}" width="${bw}" height="${bh}" rx="4" fill="rgba(124,58,237,.30)" stroke="${C}" stroke-width="2"/>`;
            s += bw >= 80 ? TX(220, gy - bh / 2 + 5, '1200 gw', { fs: 12, c: '#172033', anchor: 'middle' })
              : TX(x + bw + 10, gy - bh / 2 + 5, '1200 gw', { fs: 12, c: '#172033' });
            s += SV.seg(30, gy, 410, gy, '#64748b', 3);
            // 地面受到的壓力：箭頭長度和壓力成正比
            const n = Math.max(2, Math.round(bw / 26));
            for (let j = 0; j < n; j++) { const ax = x + bw * (j + 0.5) / n; s += ARW(ax, gy + 4, ax, gy + 4 + P * 0.9, RED, 3); }
            s += TX(220, 270, '重量一樣，面積越小，每塊地面被壓得越用力', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 282', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '拉到最右（A＝20）時 P＝60：面積剩 1/6，壓力 6 倍。',
        example: {
          q: '重量 \\(1200\\)gw，底面積由 \\(60\\) 變 \\(20\\)，壓力變幾倍？',
          steps: ['原 \\(P=1200÷60=20\\)。', '後 \\(P=1200÷20=60\\)，\\(60÷20=3\\) 倍。'],
          ans: '3 倍'
        }
      },

      /* ---------- 大氣壓力 ---------- */
      {
        sec: '2-2', secName: '大氣與氣體壓力',
        title: '大氣壓＝管內氣體＋水銀柱：75－38＝37',
        points: [
          '托里切利：大氣撐起水銀柱，<b>管內若有氣就幫忙撐</b>。',
          '\\(1020÷13.6＝75\\) cm-Hg：當天大氣可撐 75cm。',
          '管內水銀 38cm → 管內氣體 \\(75－38＝37\\)。'
        ],
        formula: { label: '氣壓平衡', tex: 'P_{大氣}=P_{管內}+P_{水銀柱}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '大氣', tex: '1020\\div13.6=75\\text{cm-Hg}', color: BLU, fill: '#eef4ff', border: BLU, size: 18 },
            { label: '水銀柱', tex: '38\\text{cm}', color: AMB, fill: '#fdf6e8', border: AMB, size: 18 },
            { label: '管內氣體', tex: '75-38=37\\text{cm-Hg}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20 }
          ]);
        },
        caption: '38 不是答案：先扣掉水銀柱，剩的才是管內氣體。',
        example: {
          q: '大氣 \\(1020\\)gw/cm\\(^2\\)，水銀 \\(13.6\\)，管內水銀高 \\(38\\)cm，求管內氣壓。',
          steps: ['大氣＝\\(1020÷13.6=75\\) cm-Hg。', '管內＝\\(75-38=37\\) cm-Hg。'],
          ans: '37 cm-Hg（A）'
        }
      },

      /* ---------- 波以耳互動 ---------- */
      {
        sec: '2-2', secName: '大氣與氣體壓力',
        title: '體積壓成一半，壓力變兩倍：76→152',
        points: [
          '定溫密閉：<b>\\(P1V1＝P2V2\\)</b>，體積小壓力大。',
          '拖滑桿把氣柱壓小，看壓力成倍長大。',
          '問自己：體積剩 1/4 時，壓力是多少？'
        ],
        formula: { label: '波以耳', tex: 'P_{1}V_{1}=P_{2}V_{2}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>體積剩 <span class="ival" id="nv">1</span>/1（初 76cmHg）</label>
            <input type="range" id="ns" min="1" max="4" step="1" value="1"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = '1/' + n;
            const P = 76 * n, w = 320 / n, x0 = 60, y0 = 64, H = 80;
            let s = TX(220, 30, 'P ＝ 76 × ' + n + ' ＝ ' + P + ' cmHg', { fs: 20, c: C, anchor: 'middle' });
            // 左端封閉的筒子
            s += SV.seg(x0, y0, 400, y0, '#334155', 3) + SV.seg(x0, y0 + H, 400, y0 + H, '#334155', 3) + SV.seg(x0, y0, x0, y0 + H, '#334155', 4);
            s += `<rect x="${x0}" y="${y0}" width="${w}" height="${H}" fill="rgba(124,58,237,.12)"/>`;
            // 氣體分子固定 12 顆：空間變小就變擠
            const pts = [[.15, .2], [.4, .15], [.7, .25], [.9, .12], [.25, .5], [.55, .45], [.8, .6], [.1, .8], [.35, .82], [.62, .78], [.88, .88], [.48, .65]];
            pts.forEach(([u, v]) => { s += SV.dot(x0 + 8 + u * (w - 16), y0 + 10 + v * (H - 20), C, 5); });
            // 活塞與推桿
            s += `<rect x="${x0 + w}" y="${y0 + 3}" width="14" height="${H - 6}" rx="3" fill="#64748b"/>`;
            s += SV.seg(x0 + w + 14, y0 + H / 2, 420, y0 + H / 2, '#64748b', 6);
            s += TX(x0 + w / 2, y0 + H + 24, '體積 1/' + n, { fs: 14, c: C, anchor: 'middle' });
            s += TX(220, 202, n === 1 ? '原本：76 cmHg' : '同樣多的分子擠在 1/' + n + ' 的空間：撞牆變 ' + n + ' 倍', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 215', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝4（體積剩 1/4）時 P＝304：四倍奉還。',
        example: {
          q: '定溫下氣柱由 \\(20\\)cm 被壓成 \\(10\\)cm，初壓 \\(76\\)cmHg，求末壓。',
          steps: ['\\(76×20=P_{2}×10\\)。', '\\(P_{2}=152\\) cmHg（2 倍）。'],
          ans: '152 cmHg'
        }
      },

      /* ---------- 波以耳題型 ---------- */
      {
        sec: '2-2', secName: '大氣與氣體壓力',
        title: '量筒壓水銀：末體積是 (10＋x)，不是 x',
        points: [
          '初：整筒 \\(20\\)cm，\\(76\\) cmHg。',
          '末：密封端到筒內水銀面＝<b>\\(10＋x\\)</b> cm。',
          '\\(76×20＝P2×(10＋x)\\) → 選 (D)。'
        ],
        formula: { label: '量筒', tex: 'P_{2}=\\frac{76\\times20}{x+10}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '初', tex: '76\\times20', color: BLU, fill: '#eef4ff', border: BLU, size: 18 },
            { label: '末', tex: 'P_{2}\\times(10+x)', color: AMB, fill: '#fdf6e8', border: AMB, size: 18 },
            { label: '答案', tex: 'P_{2}=20\\div(x+10)\\times76', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18, note: '選 (D)' }
          ]);
        },
        caption: '氣柱長從密封端量到筒內水銀面：10＋x，不是 x。',
        example: {
          q: '接上題情境，筒內壓力以 x 表示為何？',
          steps: ['初體積（氣柱長）\\(20\\)，末 \\(10+x\\)。', '\\(P_{2}=76×20÷(10+x)\\)。'],
          ans: '(D)'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '2-2', secName: '大氣與氣體壓力',
        title: '壓力三個坑：看粗細、漏管內氣、量錯氣柱',
        points: [
          '等高同材只看 <span class="k">ρh</span>，粗細是煙霧彈。',
          '托里切利先問：管頂有沒有氣？有就扣掉。',
          '波以耳體積用<span class="k">氣柱長</span>，不是筒高。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['圓柱粗的壓力大', '等高同材 P＝ρhg，面積約掉，全相等'],
            ['管內水銀 38cm 就是答案', '大氣＝管內氣＋水銀柱，答案是 75－38＝37'],
            ['末體積直接用 x', '從密封端量到筒內水銀面：10＋x']
          ]);
        },
        caption: '三坑填平：約面積、扣管氣、量氣柱。',
        example: {
          q: '三圓柱同材等高、粗細 a＞b＞c，桌面壓力比？',
          steps: ['\\(P=\\rho hg\\)，與底面積無關。', '三者 ρ、h 相同。'],
          ans: 'a＝b＝c'
        }
      }

    ]
  });
})();
