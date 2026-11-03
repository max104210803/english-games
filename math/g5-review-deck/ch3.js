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
          let s = '';
          s += TX(60, 50, '紅 7/3', { fs: 15, c: RED });
          s += BOX(60, 65, 250, 34, { fill: 'rgba(225,29,72,.15)', stroke: RED });
          s += BOX(60, 65, 250, 34, { fill: 'none', stroke: RED });
          s += TX(60, 130, '藍 9/4', { fs: 15, c: BLU });
          s += BOX(60, 145, 241, 34, { fill: 'rgba(37,99,235,.15)', stroke: BLU });
          s += TX(330, 100, '同切 12 格', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(330, 125, '28 格 vs 27 格', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(330, 155, '紅色多', { fs: 18, c: RED, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 210', s);
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>整數部分 w ＝ <span class="ival" id="wv">1</span>（比 w-2/5 和 3/2）</label>
            <input type="range" id="ws" min="1" max="2" step="1" value="1"></div></div>`;
          const draw = () => {
            const w = +h.querySelector('#ws').value;
            h.querySelector('#wv').textContent = w;
            const num = w * 5 + 2, v10 = num * 2;
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(5,150,105,.07)', stroke: C });
            s += TX(220, 95, w + '-2/5 = ' + num + '/5 = ' + v10 + '/10', { fs: 22, c: C, anchor: 'middle' });
            s += TX(220, 135, v10 + '/10 vs 15/10：' + (v10 > 15 ? '超過 3/2' : '3/2 大'), { fs: 16, c: v10 > 15 ? RED : GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
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
          h.innerHTML = SV.fbox([
            { label: '約分', tex: '\\frac{9}{12}=\\frac{3}{4}\\;,\\;\\frac{15}{20}=\\frac{3}{4}', color: C, fill: '#eef7f2', border: '#bfe0d1', size: 18 },
            { label: '相加', tex: '\\frac{3}{4}+\\frac{3}{4}=\\frac{6}{4}=\\frac{3}{2}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20 }
          ]);
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>第二項分子 m ＝ <span class="ival" id="mv">5</span></label>
            <input type="range" id="ms" min="0" max="8" step="1" value="5"></div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m;
            const ssum = 12 + m;
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(37,99,235,.06)', stroke: BLU });
            s += TX(220, 95, '12/16 + ' + m + '/16 = ' + ssum + '/16', { fs: 22, c: BLU, anchor: 'middle' });
            s += TX(220, 135, m === 5 ? '例題：答案 17/16' : '和的分子跟著加 ' + m, { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
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
          '拖滑桿換剪掉的整數部分，看原有怎麼變。'
        ],
        formula: { label: '列式', tex: '\\frac{12}{5}+\\frac{3}{2}=\\frac{39}{10}=3\\frac{9}{10}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>剪掉整數部分 s ＝ <span class="ival" id="sv">2</span></label>
            <input type="range" id="ss" min="0" max="4" step="1" value="2"></div></div>`;
          const draw = () => {
            const s2 = +h.querySelector('#ss').value;
            h.querySelector('#sv').textContent = s2;
            const cut = s2 + 0.4, left = 1.5, all = cut + left;
            let s = '';
            s += SV.seg(50, 120, 50 + cut * 60, 120, RED, 12);
            s += SV.seg(50 + cut * 60, 120, 50 + all * 60, 120, BLU, 12);
            s += TX(50 + cut * 30, 100, '剪 ' + s2 + '-2/5', { fs: 13, c: RED, anchor: 'middle' });
            s += TX(50 + cut * 60 + 52, 100, '剩 1-1/2', { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(220, 170, '原有 = ' + all.toFixed(1) + ' 公尺（s=2 時 3.9）', { fs: 15, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
          h.querySelector('#ss').oninput = draw; draw();
        },
        caption: '紅段變長，總長跟著變長：原有永遠是兩段相加。',
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
