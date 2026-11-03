/* ============ 第 5 章　時間 ============
   節次：9-1 時間的乘法、9-2 時間的除法、9-3 時間的應用
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：時刻與時間的文字符號換算史、
     24 小時制與 12 小時制的正式定義（只用上下午題目）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#e11d48';
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
    ch: 5,
    title: '時間',
    color: C,
    sections: ['9-1 時間的乘法', '9-2 時間的除法', '9-3 時間的應用'],
    slides: [

      /* ---------- 化小單位再乘 ---------- */
      {
        sec: '9-1', secName: '時間的乘法',
        title: '時間相乘：先化成小單位，乘完再進位',
        points: [
          '2 分 35 秒先化成 <b>155 秒</b>，再乘以 4 得 620 秒。',
          '620 秒＝<span class="k">10 分 20 秒</span>（60 秒進 1 分）。',
          '分秒混著乘會亂：統一單位是唯一的路。'
        ],
        formula: { label: '時間乘', tex: '155\\times4=620\\text{秒}=10\\text{分}20\\text{秒}' },
        visual: (h) => {
          h.innerHTML = CARD('2 分 35 秒的歌連播 4 次。分、秒分開乘：2×4＝8 分、35×4＝140 秒，答案是「8 分 140 秒」嗎？',
            `<label>播 n ＝ <span class="ival" id="nv">1</span> 次</label>
            <input type="range" id="ns" min="1" max="4" step="1" value="1">`);
          let carried = false;
          const U = 34, X0 = 30, COL = ['#fecdd3', '#fde68a', '#bbf7d0', '#bfdbfe'];
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const sec = 155 * n, mm = Math.floor(sec / 60), ss = sec % 60, rawS = 35 * n;
            if (rawS >= 60) carried = true;
            let s = '';
            for (let i = 0; i < n; i++) {
              const x1 = X0 + i * 155 / 60 * U, w = 155 / 60 * U;
              s += `<rect x="${x1}" y="40" width="${w}" height="34" fill="${COL[i]}" stroke="#1f2a37" stroke-width="1.5"/>`;
              s += TX(x1 + w / 2, 62, '第' + (i + 1) + '首', { fs: 11, c: '#172033', anchor: 'middle' });
            }
            s += SV.seg(X0, 90, X0 + 11 * U, 90, '#94a3b8', 2);
            for (let m = 0; m <= 11; m++) {
              s += `<line x1="${X0 + m * U}" y1="84" x2="${X0 + m * U}" y2="96" stroke="#94a3b8" stroke-width="2"/>`;
              s += TX(X0 + m * U, 112, m + '分', { fs: 10, c: '#657187', anchor: 'middle' });
            }
            const xe = X0 + sec / 60 * U;
            s += `<line x1="${xe}" y1="30" x2="${xe}" y2="96" stroke="${RED}" stroke-width="2.5"/>`;
            s += TX(Math.min(xe, 370), 26, mm + ' 分 ' + ss + ' 秒', { fs: 13, c: RED, anchor: 'middle' });
            s += TX(220, 145, '分開乘：' + (2 * n) + ' 分 ' + rawS + ' 秒', { fs: 15, c: '#172033', anchor: 'middle' });
            s += TX(220, 172, rawS >= 60 ? rawS + ' 秒裡有 ' + Math.floor(rawS / 60) + ' 個 60 秒 → 再進 ' + Math.floor(rawS / 60) + ' 分 ＝ ' + mm + ' 分 ' + ss + ' 秒' : '秒還沒滿 60，不用進位',
              { fs: 14, c: rawS >= 60 ? RED : GRN, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 185', s);
            h.querySelector('#aha').innerHTML = AHA('看紅線停在哪：4 首是 <b>10 分 20 秒</b>，不是 8 分 140 秒。秒滿 60 就要換成 1 分；也可以先全部化成秒（155×4＝620 秒）再換回分秒。',
              carried, '多播幾次，看秒數什麼時候超過 60');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '三步曲：化小、相乘、進位，順序不能亂。',
        example: {
          q: '歌曲 2 分 35 秒連播 4 次，共幾分幾秒？',
          steps: ['\\(2\\) 分 \\(35\\) 秒\\(=155\\) 秒。', '\\(155\\times 4=620\\) 秒\\(=10\\) 分 \\(20\\) 秒。'],
          ans: '10 分 20 秒'
        }
      },

      /* ---------- 滿 60 進位（互動） ---------- */
      {
        sec: '9-1', secName: '時間的乘法',
        title: '52 秒×17＝884 秒：滿 60 秒就進 1 分',
        points: [
          '52×17＝884 秒，840 秒是 14 分，餘 44 秒。',
          '答案 <b>14 分 44 秒</b>，不是 884 秒（要進位）。',
          '拖滑桿：52 秒連播 n 次，看分秒怎麼長大。'
        ],
        formula: { label: '進位', tex: '884\\text{秒}=14\\text{分}44\\text{秒}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>次數 n ＝ <span class="ival" id="nv">1</span></label>
            <input type="range" id="ns" min="1" max="17" step="1" value="1"></div></div>`;
          h.innerHTML = GUESS('把秒倒進「1 分鐘杯」，每杯裝滿 60 秒。52 秒倒 17 次，<b>能裝滿幾杯、剩幾秒</b>？') + h.innerHTML + '<div id="aha"></div>';
          let big = false;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const tot = 52 * n, mm = Math.floor(tot / 60), ss = tot % 60;
            if (n >= 10) big = true;
            let s = TX(220, 20, '52 × ' + n + ' ＝ ' + tot + ' 秒', { fs: 16, c: C, anchor: 'middle' });
            for (let i = 0; i <= mm && i < 16; i++) {
              const x = 24 + (i % 8) * 50, y = 34 + Math.floor(i / 8) * 64, f = i < mm ? 1 : ss / 60;
              if (i === mm && ss === 0) break;
              s += `<path d="M${x},${y} L${x + 40},${y} L${x + 36},${y + 50} L${x + 4},${y + 50} Z" fill="#fff" stroke="#1f2a37" stroke-width="1.6"/>`;
              const fy = y + 50 - 50 * f, ins = 4 * (fy - y) / 50;
              s += `<path d="M${x + ins},${fy} L${x + 40 - ins},${fy} L${x + 36},${y + 50} L${x + 4},${y + 50} Z" fill="${i < mm ? '#93c5fd' : '#fdba74'}"/>`;
              s += TX(x + 20, y + 32, i < mm ? '60' : '' + ss, { fs: 11, c: '#172033', anchor: 'middle' });
            }
            s += TX(220, 186, '滿 ' + mm + ' 杯（' + mm + ' 分），剩 ' + ss + ' 秒 ＝ ' + mm + ' 分 ' + ss + ' 秒', { fs: 15, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 198', s);
            h.querySelector('#aha').innerHTML = AHA('藍杯是裝滿的 60 秒（1 分），橘杯是還沒滿的秒數。<b>秒數除以 60：商是分、餘數是秒</b>。884÷60＝14 餘 44，就是 14 分 44 秒。',
              big, '把次數拖大，看杯子怎麼一杯杯裝滿');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝17 時裝滿 14 杯、剩 44 秒：884 秒＝14 分 44 秒。',
        example: {
          q: '\\(52\\) 秒 \\(\\times 17\\) ＝幾分幾秒？',
          steps: ['\\(52\\times 17=884\\) 秒。', '\\(884=840+44\\)，\\(840\\) 秒\\(=14\\) 分。'],
          ans: '14 分 44 秒'
        }
      },

      /* ---------- 餘數化小單位再除 ---------- */
      {
        sec: '9-2', secName: '時間的除法',
        title: '時間相除：分除不盡就化成秒再除',
        points: [
          '26 分 24 秒÷6：分先除，26÷6＝4 餘 <b>2 分</b>。',
          '2 分＋24 秒＝144 秒，144÷6＝<b>24 秒</b>。',
          '答案 4 分 24 秒：餘數化小是唯一的鑰匙。'
        ],
        formula: { label: '時間除', tex: '26\\text{分}24\\text{秒}\\div6=4\\text{分}24\\text{秒}' },
        visual: (h) => {
          h.innerHTML = CARD('6 個人平分 26 分 24 秒。每人先拿 4 分，<b>剩下的 2 分怎麼分</b>？',
            `<label>步驟 <span class="ival" id="tv">1</span>／3</label>
            <input type="range" id="ts" min="1" max="3" step="1" value="1">`);
          let done = false;
          const P = ['#fecdd3', '#fde68a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8'];
          const draw = () => {
            const t = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = t;
            if (t === 3) done = true;
            let s = TX(220, 20, '26 分（每格 1 分）＋ 24 秒', { fs: 13, c: '#657187', anchor: 'middle' });
            for (let i = 0; i < 26; i++) {
              const left = i >= 24, x = 14 + i * 14.5;
              const fill = left ? (t >= 2 ? '#f3f5f9' : '#e2e8f0') : P[Math.floor(i / 4)];
              s += `<rect x="${x}" y="32" width="13" height="30" rx="2" fill="${fill}" stroke="${left ? AMB : '#64748b'}" stroke-width="${left ? 2 : 1}" ${left && t >= 2 ? 'stroke-dasharray="3 2"' : ''}/>`;
            }
            s += `<rect x="${14 + 26 * 14.5 + 2}" y="38" width="22" height="18" rx="2" fill="#e2e8f0" stroke="${AMB}" stroke-width="2"/>`;
            s += TX(14 + 26 * 14.5 + 13, 76, '24秒', { fs: 10, c: AMB, anchor: 'middle' });
            for (let p = 0; p < 6; p++) s += TX(14 + p * 58 + 29, 78, '第' + (p + 1) + '人', { fs: 10, c: '#657187', anchor: 'middle' });
            s += TX(220, 104, '步驟 1：26 ÷ 6 ＝ 4 … 2，每人先拿 4 分，剩 2 分', { fs: 13, c: BLU, anchor: 'middle' });
            if (t >= 2) {
              s += `<rect x="40" y="118" width="${144 * 2.5}" height="26" rx="4" fill="#fde68a" stroke="${AMB}" stroke-width="2"/>`;
              s += TX(220, 136, '2 分 ＝ 120 秒，加 24 秒 ＝ 144 秒', { fs: 13, c: '#172033', anchor: 'middle' });
              s += TX(220, 164, '步驟 2：剩下的分鐘分不下去，換成秒', { fs: 13, c: AMB, anchor: 'middle' });
            }
            if (t >= 3) {
              for (let p = 0; p < 6; p++) {
                s += `<rect x="${40 + p * 60}" y="176" width="60" height="26" fill="${P[p]}" stroke="#1f2a37" stroke-width="1.2"/>`;
                s += TX(70 + p * 60, 194, '24 秒', { fs: 11, c: '#172033', anchor: 'middle' });
              }
              s += TX(220, 224, '步驟 3：144 ÷ 6 ＝ 24 秒 → 每人 4 分 24 秒', { fs: 14, c: GRN, anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 236', s);
            h.querySelector('#aha').innerHTML = AHA('大單位分不完，就<b>把剩下的換成小單位再分</b>（1 分＝60 秒），跟整數除法「餘數往下一位借」是同一個道理。',
              done, '把步驟拖到 3');
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '餘下的 2 分化成 120 秒，加上 24 秒才去除。',
        example: {
          q: '\\(26\\) 分 \\(24\\) 秒摺好 6 隻紙鶴，平均 1 隻要多久？',
          steps: ['化成秒：\\(26\\) 分 \\(24\\) 秒\\(=1584\\) 秒。', '\\(1584\\div 6=264\\) 秒\\(=4\\) 分 \\(24\\) 秒。'],
          ans: '4 分 24 秒'
        }
      },

      /* ---------- 日化小時（互動） ---------- */
      {
        sec: '9-2', secName: '時間的除法',
        title: '1 日＝24 小時：9 日 12 時÷6 先化成 228 時',
        points: [
          '9 日 12 時＝9×24＋12＝<b>228 時</b>，再除以 6。',
          '228÷6＝38 時＝<span class="k">1 日 14 時</span>。',
          '拖滑桿換日數，看商怎麼跟著變。'
        ],
        formula: { label: '日時除', tex: '228\\div6=38\\text{時}=1\\text{日}14\\text{時}' },
        visual: (h) => {
          h.innerHTML = CARD('9 日 12 時分給 6 個展區，直接 9÷6 會卡住（1 日還剩 3 日）。<b>換成什麼單位就分得開</b>？',
            `<label>日數 D ＝ <span class="ival" id="dv">9</span>（D 日 12 時 ÷ 6）</label>
            <input type="range" id="ds" min="5" max="10" step="1" value="9">`);
          const seen = new Set();
          const P = ['#fecdd3', '#fde68a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8'];
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            h.querySelector('#dv').textContent = d;
            seen.add(d);
            const tot = d * 24 + 12, q = tot / 6, sc = 392 / 252, X0 = 24;
            const dd = Math.floor(q / 24), hh = q % 24;
            let s = TX(220, 18, d + ' 日 12 時 ＝ ' + d + '×24＋12 ＝ ' + tot + ' 時', { fs: 14, c: BLU, anchor: 'middle' });
            for (let p = 0; p < 6; p++) {
              s += `<rect x="${X0 + p * q * sc}" y="30" width="${q * sc}" height="30" fill="${P[p]}" stroke="#1f2a37" stroke-width="1.2"/>`;
              s += TX(X0 + (p + 0.5) * q * sc, 50, '第' + (p + 1) + '區', { fs: 10, c: '#172033', anchor: 'middle' });
            }
            s += SV.seg(X0, 74, X0 + tot * sc, 74, '#94a3b8', 2);
            for (let k = 0; k <= d; k++) {
              s += `<line x1="${X0 + 24 * k * sc}" y1="68" x2="${X0 + 24 * k * sc}" y2="80" stroke="#64748b" stroke-width="2"/>`;
              if (k % 2 === 0 || k === d) s += TX(X0 + 24 * k * sc, 94, k + '日', { fs: 10, c: '#657187', anchor: 'middle' });
            }
            s += `<rect x="${X0}" y="104" width="${q * sc}" height="22" fill="${P[0]}" stroke="${RED}" stroke-width="2"/>`;
            s += `<rect x="${X0}" y="104" width="${Math.min(q, 24) * sc}" height="22" fill="none" stroke="${BLU}" stroke-width="2" stroke-dasharray="4 3"/>`;
            s += TX(X0 + q * sc + 8, 120, '每區 ' + tot + '÷6 ＝ ' + q + ' 時', { fs: 13, c: RED });
            s += TX(220, 156, q + ' 時 ＝ ' + (dd ? dd + ' 日（24 時）＋ ' : '') + hh + ' 時 ＝ ' + (dd ? dd + ' 日 ' : '') + hh + ' 時', { fs: 15, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 170', s);
            h.querySelector('#aha').innerHTML = AHA('日分不平均，就<b>全部換成小時</b>（1 日＝24 時）再平分，分完再把 24 時換回 1 日。藍虛線框就是「滿 1 日」的那一段。',
              seen.size >= 2, '換個日數看看');
          };
          h.querySelector('#ds').oninput = draw; draw();
        },
        caption: 'D＝9 時：228÷6＝38 時＝1 日 14 時。',
        example: {
          q: '6 個展區共布置 9 日 12 小時，平均 1 區幾日幾時？',
          steps: ['\\(9\\) 日 \\(12\\) 時\\(=228\\) 時。', '\\(228\\div 6=38\\) 時\\(=1\\) 日 \\(14\\) 時。'],
          ans: '1 日 14 時'
        }
      },

      /* ---------- 間隔數＝次數－1（互動） ---------- */
      {
        sec: '9-3', secName: '時間的應用',
        title: '播放 4 次只有 3 段休息：間隔數永遠少一次',
        points: [
          '影片 1 時 15 分×4＝300 分，休息 15 分×<b>3</b>。',
          '共 345 分＝5 時 45 分，上午 9 時→<b>下午 2 時 45 分</b>。',
          '拖滑桿換次數，看休息段數永遠少一。'
        ],
        formula: { label: '間隔', tex: '\\text{休息段數}=\\text{次數}-1' },
        visual: (h) => {
          h.innerHTML = CARD('影片播 4 次，中間要休息幾次？<b>4 次還是 3 次？</b>先猜，再拖拖看。',
            `<label>播放次數 n ＝ <span class="ival" id="nv">1</span></label>
            <input type="range" id="ns" min="1" max="4" step="1" value="1">`);
          const seen = new Set();
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            seen.add(n);
            let s = TX(220, 40, '播 ' + n + ' 次 → 休息 ' + (n - 1) + ' 次', { fs: 18, c: C, anchor: 'middle' }), x = 40;
            for (let i = 0; i < n; i++) {
              s += BOX(x, 80, 70, 40, { fill: 'rgba(225,29,72,.15)', stroke: C });
              x += 70;
              if (i < n - 1) {
                s += BOX(x, 90, 30, 20, { fill: 'rgba(217,119,6,.25)', stroke: AMB });
                x += 30;
              }
            }
            const tot = n * 75 + (n - 1) * 15;
            const hh = Math.floor(tot / 60), mm = tot % 60;
            s += TX(220, 160, '播放' + n + '次＋休息' + (n - 1) + '段＝' + tot + '分', { fs: 15, c: '#172033', anchor: 'middle' });
            const endH = 9 + hh, clock = (endH < 12 ? '上午 ' + endH : endH === 12 ? '中午 12' : '下午 ' + (endH - 12)) + ' 時' + (mm ? ' ' + mm + ' 分' : '');
            s += TX(220, 190, '上午 9 時＋' + hh + ' 時 ' + mm + ' 分 → ' + clock + '結束', { fs: 15, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 210', s);
            h.querySelector('#aha').innerHTML = AHA('休息夾在兩次播放<b>中間</b>，最後一次播完就結束，不用再休息：所以<b>休息次數＝播放次數－1</b>。種樹、排椅子的「間隔」也是同一個道理。',
              seen.size >= 3, '多拖幾種次數，數數橘色的休息塊（已看 ' + seen.size + ' 種）');
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝4 時紅塊 4 個、橘塊 3 個：下午 2 時 45 分結束。',
        example: {
          q: '影片 1 時 15 分播 4 次、每次中間休息 15 分，上午 9 時開播何時結束？',
          steps: ['播放 \\(75\\times 4=300\\) 分，休息 \\(15\\times 3=45\\) 分。', '共 345 分\\(=5\\) 時 \\(45\\) 分，上午 9 時＋5 時 45 分。'],
          ans: '下午 2 時 45 分'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '9-3', secName: '時間的應用',
        title: '時間三個坑：60 進位、休息少一次、先減再除',
        points: [
          '時間是 <span class="k">60 進位</span>，不是 100 進位。',
          '休息段數＝次數－1，四次播放只休三次。',
          '經過時間先相減，再拿去除（說故事 675÷45＝15）。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['75 分 38 秒當成 100 進位，寫成 0 時 75 分 38 秒', '滿 60 分進 1 時：75 分 38 秒＝1 時 15 分 38 秒'],
            ['影片播 4 次休息算 15×4', '4 次只有 3 段間隔：15×3＝45 分'],
            ['10:00 到 21:15 直接 21÷45', '先減：21 時 15 分－10 時＝675 分，再÷45＝15 場']
          ]);
        },
        caption: '60、少一、先減：三咒語念完再下筆。',
        example: {
          q: '圖書館 10:00 開到 21:15，說故事每場 45 分接連進行，最多幾場？',
          steps: ['\\(21\\) 時 \\(15\\) 分\\(-10\\) 時\\(=11\\) 時 \\(15\\) 分\\(=675\\) 分。', '\\(675\\div 45=15\\)。'],
          ans: '15 場'
        }
      }

    ]
  });
})();
