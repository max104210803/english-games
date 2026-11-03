/* ============ 第 1 章　因數與倍數 ============
   節次：2-1 因數倍數定義
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：質因數分解、短除法求最大公因數、
     最小公倍數的短除法、互質的正式定義（只用生活例子）。
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
    title: '因數與倍數',
    color: C,
    sections: ['2-1 因數倍數定義'],
    slides: [

      /* ---------- 整除：餘數是 0 才叫整除 ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '餘數是 0 才叫整除，整除才能談因數倍數',
        points: [
          '<span class="k">整除</span>：被除數、除數、商都是整數且<b>餘數為 0</b>。',
          '有餘數的除法（如 10÷3 餘 1）不能說因數倍數。',
          '看到因數倍數題，先問：整除了嗎？'
        ],
        formula: { label: '整除', tex: 'a\\div b=c\\cdots 0' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '整除', tex: '12\\div 3=4', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20, note: '餘數 0，可以談因數倍數' },
            { label: '不整除', tex: '10\\div 3=3\\cdots 1', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 20, note: '餘數 1，不能談因數倍數' }
          ]);
        },
        caption: '整除是入場券：餘數 0 才能進因數倍數的世界。',
        example: {
          q: '下列哪一組是整除？\\(12\\div 3\\) 還是 \\(10\\div 3\\)？',
          steps: ['\\(12\\div 3=4\\) 餘數 0，是整除。', '\\(10\\div 3=3\\) 餘 1，不是整除。'],
          ans: '\\(12\\div 3\\) 是整除'
        }
      },

      /* ---------- 因數與倍數：同一關係兩種說法（互動） ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '因數和倍數是同一關係的兩種說法',
        points: [
          '<b>甲能被乙整除</b> ⇒ 乙是甲的<span class="k">因數</span>。',
          '同時甲就是乙的<span class="k">倍數</span>，兩句話綁在一起。',
          '拖滑桿：乙固定為 7，看甲怎麼跟著變。'
        ],
        formula: { label: '關係', tex: '7\\times k=\\text{甲}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>k ＝ <span class="ival" id="kv">3</span></label>
            <input type="range" id="ks" min="1" max="6" step="1" value="3"></div></div>`;
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            h.querySelector('#kv').textContent = k;
            const jia = 7 * k;
            let s = BOX(40, 60, 360, 120, { fill: 'rgba(37,99,235,.06)', stroke: C });
            s += TX(220, 110, '7 × ' + k + ' = ' + jia, { fs: 26, c: C, anchor: 'middle' });
            s += TX(220, 150, '7 是 ' + jia + ' 的因數，' + jia + ' 是 7 的倍數', { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 220', s);
          };
          h.querySelector('#ks').oninput = draw; draw();
        },
        caption: 'k 拖到 6 時甲＝42：7 是 42 的因數，42 是 7 的倍數。',
        example: {
          q: '已知 \\(7\\times 6=42\\)，誰是誰的因數？誰是誰的倍數？',
          steps: ['42 能被 7 整除。', '7 是 42 的因數，42 是 7 的倍數。'],
          ans: '7 是因數，42 是倍數'
        }
      },

      /* ---------- 公因數與最大公因數 ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '公因數找最大：兩個數共有的因數中最大的那個',
        points: [
          '16 的因數：1、2、4、8、16，個數<b>有限</b>。',
          '16 和 24 共有的因數是 1、2、4、8，最大是 <b>8</b>。',
          '因數最小是 1、最大是本身，找公因數由大往小試。'
        ],
        formula: { label: '最大公因數', tex: '16\\text{與}24\\text{的最大公因數}=8' },
        visual: (h) => {
          let s = BOX(30, 40, 170, 150, { fill: 'rgba(37,99,235,.07)', stroke: BLU });
          s += TX(115, 65, '16 的因數', { fs: 14, c: BLU, anchor: 'middle' });
          s += TX(115, 95, '1  2  4', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(115, 120, '8  16', { fs: 15, c: '#172033', anchor: 'middle' });
          s += BOX(240, 40, 170, 150, { fill: 'rgba(5,150,105,.07)', stroke: GRN });
          s += TX(325, 65, '24 的因數', { fs: 14, c: GRN, anchor: 'middle' });
          s += TX(325, 95, '1  2  3  4', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(325, 120, '6  8  12  24', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(220, 215, '共有：1、2、4、8，最大是 8', { fs: 15, c: RED, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 240', s);
        },
        caption: '兩邊都有的就是公因數，其中最大的是 8。',
        example: {
          q: '求 16 和 24 的最大公因數。',
          steps: ['16 的因數：1、2、4、8、16。', '24 的因數：1、2、3、4、6、8、12、24。', '共有 1、2、4、8，最大是 8。'],
          ans: '8'
        }
      },

      /* ---------- 公倍數與最小公倍數（互動） ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '公倍數找最小：倍數有無限多個，只找最小的',
        points: [
          '4 的倍數、6 的倍數都寫不完（<b>無限多個</b>）。',
          '共有的倍數中最小的是 12，就是<span class="k">最小公倍數</span>。',
          '拖滑桿：n 放大，看第一個重合的數停在哪裡。'
        ],
        formula: { label: '最小公倍數', tex: '4\\text{與}6\\text{的最小公倍數}=12' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>看到第 n 個 4 的倍數，n ＝ <span class="ival" id="nv">3</span></label>
            <input type="range" id="ns" min="1" max="6" step="1" value="3"></div></div>`;
          const m4 = [4, 8, 12, 16, 20, 24], m6 = [6, 12, 18, 24, 30, 36];
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            let y = 60, s = '';
            for (let i = 0; i < n; i++) {
              const v = m4[i], hit = m6.slice(0, 6).includes(v);
              s += TX(90, y, '' + v, { fs: 17, c: hit ? RED : BLU, anchor: 'middle' });
              y += 30;
            }
            let t = '4 的倍數（前 ' + n + ' 個）';
            s += TX(90, 32, t, { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(300, 32, '6 的倍數：6、12、18、24…', { fs: 13, c: GRN, anchor: 'middle' });
            const first = n >= 3 ? '第一個重合：12（n＝3 時出現）' : '還沒重合，繼續放大 n';
            s += TX(300, 90, first, { fs: 14, c: RED, anchor: 'middle' });
            s += TX(300, 120, '兩數相乘 4×6＝24 也是公倍數', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 240', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝3 時 12 第一次出現：4 和 6 的最小公倍數就是 12。',
        example: {
          q: '求 4 和 6 的最小公倍數。',
          steps: ['4 的倍數：4、8、12、16…。', '6 的倍數：6、12、18…。', '第一個共同的數是 12。'],
          ans: '12'
        }
      },

      /* ---------- 兩數相乘必為公倍數（互動） ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '兩數相乘的積，一定是這兩數的公倍數',
        points: [
          '兩數相乘的積<b>一定是公倍數</b>。',
          '找最小公倍數卡住時，先拿乘積當起點再往小找。',
          '拖滑桿換 a、b，看乘積如何同時被兩數整除。'
        ],
        formula: { label: '性質', tex: 'a\\times b\\text{是}a\\text{與}b\\text{的公倍數}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>a ＝ <span class="ival" id="av">4</span></label>
            <input type="range" id="as" min="2" max="9" step="1" value="4">
            <label style="margin-left:10px">b ＝ <span class="ival" id="bv">6</span></label>
            <input type="range" id="bs" min="2" max="9" step="1" value="6"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value, b = +h.querySelector('#bs').value;
            h.querySelector('#av').textContent = a;
            h.querySelector('#bv').textContent = b;
            const p = a * b;
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(124,58,237,.07)', stroke: VIO });
            s += TX(220, 95, a + ' × ' + b + ' = ' + p, { fs: 26, c: VIO, anchor: 'middle' });
            s += TX(220, 135, p + ' ÷ ' + a + ' = ' + b + '，' + p + ' ÷ ' + b + ' = ' + a, { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
          h.querySelector('#as').oninput = draw;
          h.querySelector('#bs').oninput = draw; draw();
        },
        caption: '乘積同時被 a、b 整除，所以一定是公倍數（未必最小）。',
        example: {
          q: '5 和 7 的公倍數有哪些？先寫一個一定對的。',
          steps: ['5×7＝35，35 同時被 5 和 7 整除。', '35 一定是公倍數（最小的是 35 本身）。'],
          ans: '35 是公倍數'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '2-1', secName: '因數倍數定義',
        title: '最常錯的三件事：有限無限、找大找小、1 的角色',
        points: [
          '因數<span class="k">有限</span>、倍數<span class="k">無限</span>，別說反。',
          '公因數找<span class="k">最大</span>，公倍數找<span class="k">最小</span>。',
          '1 恆為公因數，但它最小，不是最大。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['因數有無限多個', '因數有限：最小 1、最大本身；倍數才無限'],
            ['公倍數找最大的', '公倍數找最小（最小公倍數）；公因數才找最大'],
            ['兩數的公因數最小是 0', '公因數最小是 1（0 不能當除數）']
          ]);
        },
        caption: '考前看這頁：有限找大、無限找小、1 是起點不是終點。',
        example: {
          q: '判斷：一個整數的倍數有無限多個，對嗎？',
          steps: ['倍數可以一直乘下去，沒有盡頭。', '所以一個整數的倍數有無限多個。'],
          ans: '對'
        }
      }

    ]
  });
})();
