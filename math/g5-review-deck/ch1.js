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
          h.innerHTML = CARD('12 顆糖，每包裝 d 顆。d 是哪些數時，<b>剛好裝完、一顆不剩</b>？',
            `<label>每包 d ＝ <span class="ival" id="dv">5</span> 顆</label>
            <input type="range" id="ds" min="2" max="7" step="1" value="5">`);
          const found = new Set();
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            h.querySelector('#dv').textContent = d;
            const q = Math.floor(12 / d), r = 12 % d;
            if (r === 0) found.add(d);
            let s = '';
            for (let g = 0; g < q; g++) {
              const y = 26 + g * 30;
              s += BOX(26, y - 12, d * 24 + 8, 24, { r: 8, fill: 'rgba(37,99,235,.07)', stroke: BLU, sw: 1.4 });
              for (let i = 0; i < d; i++) s += CIRC(42 + i * 24, y, 8, '#ffd27a');
              s += TX(d * 24 + 46, y + 5, '第 ' + (g + 1) + ' 包', { fs: 12, c: BLU });
            }
            const yr = 26 + q * 30;
            for (let i = 0; i < r; i++) s += CIRC(42 + i * 24, yr, 8, '#fecdd3', RED);
            if (r) s += TX(r * 24 + 46, yr + 5, '剩 ' + r + ' 顆', { fs: 12, c: RED });
            s += TX(330, 60, '12 ÷ ' + d + ' ＝ ' + q + (r ? ' … ' + r : ''), { fs: 20, c: r ? RED : GRN, anchor: 'middle' });
            s += TX(330, 90, r ? '有剩 → 不整除' : '沒剩 → 整除！', { fs: 14, c: r ? RED : GRN, anchor: 'middle' });
            s += TX(330, 130, '已找到：' + ([...found].sort((a, b) => a - b).join('、') || '還沒有'), { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 ' + Math.max(150, yr + 24), s);
            h.querySelector('#aha').innerHTML = AHA('d＝2、3、4、6 都剛好裝完，它們（加上 1 和 12）就是 <b>12 的因數</b>。5 和 7 會剩，就不是。', found.size >= 4,
              '已找到 ' + found.size + ' 個能剛好裝完的 d，還差 ' + (4 - found.size) + ' 個');
          };
          h.querySelector('#ds').oninput = draw; draw();
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
          h.innerHTML = CARD('每排固定 7 顆，排了 k 排。總數「甲」除以 7，會不會有剩？',
            `<label>排數 k ＝ <span class="ival" id="kv">3</span></label>
            <input type="range" id="ks" min="1" max="6" step="1" value="3">`);
          const seen = new Set();
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            h.querySelector('#kv').textContent = k;
            seen.add(k);
            const jia = 7 * k;
            let s = '';
            for (let r = 0; r < k; r++) {
              for (let i = 0; i < 7; i++) s += CIRC(34 + i * 25, 26 + r * 27, 9, r % 2 ? '#bfdbfe' : '#93c5fd', BLU);
              s += TX(214, 31 + r * 27, '7', { fs: 12, c: BLU });
            }
            s += TX(330, 50, '7 × ' + k + ' ＝ ' + jia, { fs: 24, c: C, anchor: 'middle' });
            s += TX(330, 82, jia + ' ÷ 7 ＝ ' + k + '（沒剩）', { fs: 14, c: GRN, anchor: 'middle' });
            s += TX(330, 118, '7 是 ' + jia + ' 的因數', { fs: 13, c: '#172033', anchor: 'middle' });
            s += TX(330, 140, jia + ' 是 7 的倍數', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 ' + Math.max(170, 26 + k * 27), s);
            h.querySelector('#aha').innerHTML = AHA('每多 1 排就多 7 顆：7、14、21、28…甲每次跳 7，所以<b>永遠能被 7 整除</b>。同一件事有兩種說法：7 是甲的因數，甲是 7 的倍數。',
              seen.size >= 3, '再多拖幾個 k 看看（已看 ' + seen.size + ' 種）');
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
          h.innerHTML = CARD('16 和 24 都能被整除的數裡，<b>最大</b>的是誰？從 16 開始往下試。',
            `<label>試試 t ＝ <span class="ival" id="tv">16</span></label>
            <input type="range" id="ts" min="1" max="16" step="1" value="16" style="direction:rtl">`);
          // 文氏圖上各數的位置：只屬 16、共有、只屬 24
          const POS = { 16: [92, 112], 1: [220, 78], 2: [220, 106], 4: [220, 134], 8: [220, 162],
            3: [330, 82], 6: [356, 116], 12: [330, 150], 24: [350, 182] };
          let minT = 16;
          const draw = () => {
            const t = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = t;
            minT = Math.min(minT, t);
            const a = 16 % t === 0, b = 24 % t === 0;
            let s = `<circle cx="160" cy="125" r="100" fill="rgba(37,99,235,.08)" stroke="${BLU}" stroke-width="2"/>`;
            s += `<circle cx="280" cy="125" r="100" fill="rgba(5,150,105,.08)" stroke="${GRN}" stroke-width="2"/>`;
            s += TX(90, 40, '16 的因數', { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(350, 40, '24 的因數', { fs: 13, c: GRN, anchor: 'middle' });
            s += TX(220, 50, '共有', { fs: 12, c: VIO, anchor: 'middle' });
            for (const [n, [x, y]] of Object.entries(POS)) {
              const shown = +n >= minT, cur = +n === t;
              if (cur) s += `<circle cx="${x}" cy="${y - 5}" r="15" fill="#ffd27a" stroke="${AMB}" stroke-width="2"/>`;
              s += TX(x, y, shown ? n : '?', { fs: 15, c: shown ? (n === '8' && minT <= 8 ? RED : '#172033') : '#b6bfcd', anchor: 'middle' });
            }
            s += TX(220, 252, '16÷' + t + (a ? ' ✓' : ' ✗') + '　　24÷' + t + (b ? ' ✓' : ' ✗') + (a && b ? '　→ 公因數！' : ''),
              { fs: 15, c: a && b ? GRN : '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 265', s);
            h.querySelector('#aha').innerHTML = AHA('從大往小試，第一次兩邊都打勾是 <b>8</b>，它就是最大公因數。再往下看：其他公因數 4、2、1 <b>全都是 8 的因數</b>。',
              minT <= 8, '把滑桿往右拖，從 16 一路往下試');
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '從大往小試，第一個兩邊都整除的就是最大公因數。',
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
          '拖滑桿：讓藍青蛙多跳幾步，看兩隻在哪裡踩到同一格。'
        ],
        formula: { label: '最小公倍數', tex: '4\\text{與}6\\text{的最小公倍數}=12' },
        visual: (h) => {
          h.innerHTML = CARD('藍青蛙一次跳 4 格，綠青蛙一次跳 6 格，都從 0 出發。牠們<b>第一次踩到同一格</b>是哪裡？',
            `<label>藍青蛙跳 n ＝ <span class="ival" id="nv">1</span> 步</label>
            <input type="range" id="ns" min="1" max="9" step="1" value="1">`);
          const X = (v) => 22 + v * 10.8, Y = 120;
          const hop = (a, b, up, col) => {
            const xm = (X(a) + X(b)) / 2, hy = up ? Y - 34 : Y + 34;
            return `<path d="M${X(a)},${Y} Q${xm},${hy} ${X(b)},${Y}" fill="none" stroke="${col}" stroke-width="2.2"/>`;
          };
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            let s = SV.seg(X(0), Y, X(37), Y, '#94a3b8', 2);
            for (let v = 0; v <= 36; v++) s += `<line x1="${X(v)}" y1="${Y - 4}" x2="${X(v)}" y2="${Y + 4}" stroke="#94a3b8" stroke-width="1"/>`;
            s += TX(X(0), Y + 20, '0', { fs: 11, c: '#657187', anchor: 'middle' });
            for (let k = 0; k < 6; k++) {
              s += hop(6 * k, 6 * k + 6, false, GRN);
              s += TX(X(6 * k + 6), Y + 62, '' + (6 * k + 6), { fs: 12, c: GRN, anchor: 'middle' });
            }
            let meet = [];
            for (let k = 0; k < n; k++) {
              const to = 4 * k + 4;
              s += hop(4 * k, to, true, BLU);
              const hit = to % 6 === 0;
              if (hit) meet.push(to);
              s += TX(X(to), Y - 42, '' + to, { fs: 12, c: hit ? RED : BLU, anchor: 'middle' });
              if (hit) s += `<circle cx="${X(to)}" cy="${Y}" r="8" fill="#fecdd3" stroke="${RED}" stroke-width="2.5"/>`;
            }
            s += TX(220, 22, meet.length ? '同一格：' + meet.join('、') : '還沒踩到同一格…', { fs: 15, c: meet.length ? RED : '#657187', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
            h.querySelector('#aha').innerHTML = AHA('第一次在 <b>12</b> 相遇，12 就是最小公倍數。' +
              (meet.length >= 2 ? '再看下去：24、36 也相遇，<b>每隔 12 格遇一次</b>，所以公倍數都是 12 的倍數，有無限多個。' : '再讓藍青蛙多跳幾步，看還會在哪裡相遇？'),
              meet.length >= 1, '讓藍青蛙多跳幾步');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '藍青蛙跳 3 步到 12，綠青蛙跳 2 步也到 12：第一次相遇就是最小公倍數。',
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
          h.innerHTML = CARD('a×b 個方塊排成長方形。為什麼它一定能被 a 整除、也能被 b 整除？它會是<b>最小</b>的公倍數嗎？',
            `<label>a ＝ <span class="ival" id="av">4</span></label>
            <input type="range" id="as" min="2" max="9" step="1" value="4">
            <label style="margin-left:10px">b ＝ <span class="ival" id="bv">6</span></label>
            <input type="range" id="bs" min="2" max="9" step="1" value="6">`);
          const gcd = (x, y) => y ? gcd(y, x % y) : x;
          let seenShare = false, seenCoprime = false;
          const grid = (x0, a, b, byRow) => {
            let s = '';
            for (let r = 0; r < b; r++) for (let c = 0; c < a; c++) {
              const band = byRow ? r : c;
              s += `<rect x="${x0 + c * 19}" y="${38 + r * 19}" width="17" height="17" rx="3" fill="${band % 2 ? '#c4b5fd' : '#ede9fe'}" stroke="${VIO}" stroke-width="1"/>`;
            }
            return s;
          };
          const draw = () => {
            const a = +h.querySelector('#as').value, b = +h.querySelector('#bs').value;
            h.querySelector('#av').textContent = a;
            h.querySelector('#bv').textContent = b;
            const p = a * b, g = gcd(a, b), l = p / g;
            if (g > 1) seenShare = true; else seenCoprime = true;
            let s = grid(20, a, b, true) + grid(240, a, b, false);
            s += TX(20 + a * 9.5, 26, '橫著切：' + b + ' 排，每排 ' + a + ' 個', { fs: 12, c: VIO, anchor: 'middle' });
            s += TX(240 + a * 9.5, 26, '直著切：' + a + ' 行，每行 ' + b + ' 個', { fs: 12, c: VIO, anchor: 'middle' });
            const yb = 52 + b * 19;
            s += TX(220, yb, p + '÷' + a + '＝' + b + '，' + p + '÷' + b + '＝' + a + ' → ' + p + ' 是公倍數', { fs: 14, c: '#172033', anchor: 'middle' });
            s += TX(220, yb + 24, g > 1 ? '但最小公倍數是 ' + l + '（' + a + ' 和 ' + b + ' 有公因數 ' + g + '）' : '而且最小公倍數就是 ' + p + '（兩數沒有 1 以外的公因數）',
              { fs: 13, c: g > 1 ? RED : GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 ' + (yb + 36), s);
            h.querySelector('#aha').innerHTML = AHA('同一個長方形橫著切、直著切都剛好分完，所以乘積<b>一定</b>是公倍數。可是當兩數有共同的因數（像 4 和 6 都有 2），乘積就<b>不是最小</b>的公倍數。',
              seenShare && seenCoprime, '試一組有共同因數的（如 4、6），再試一組沒有的（如 3、5）');
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
