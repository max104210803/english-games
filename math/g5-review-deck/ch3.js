/* ============ 第 3 章　分數 ============
   節次：6-1 分數比大小、6-2 分數加減、6-3 分數應用
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

  window.DECK.push({
    ch: 3,
    title: '分數',
    color: C,
    sections: ['6-1 分數比大小', '6-2 分數加減', '6-3 分數應用'],
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
      }

    ]
  });
})();
