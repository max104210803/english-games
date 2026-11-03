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
          h.innerHTML = SV.fbox([
            { label: '化小', tex: '2\\text{分}35\\text{秒}=155\\text{秒}', color: BLU, fill: '#eef4ff', border: BLU, size: 18 },
            { label: '相乘', tex: '155\\times4=620\\text{秒}', color: C, fill: '#fdeef2', border: '#f3c4d0', size: 18 },
            { label: '進位', tex: '620\\text{秒}=10\\text{分}20\\text{秒}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18 }
          ]);
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
            <div class="ictrl"><label>次數 n ＝ <span class="ival" id="nv">17</span></label>
            <input type="range" id="ns" min="1" max="17" step="1" value="17"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const tot = 52 * n, mm = Math.floor(tot / 60), ss = tot % 60;
            let s = '';
            const w = Math.min(360, tot / 3);
            s += BOX(40, 90, w, 40, { fill: 'rgba(225,29,72,.15)', stroke: C });
            s += TX(220, 70, '52×' + n + ' = ' + tot + ' 秒', { fs: 18, c: C, anchor: 'middle' });
            s += TX(220, 160, '= ' + mm + ' 分 ' + ss + ' 秒', { fs: 22, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 190', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝17 時長條最長：884 秒＝14 分 44 秒。',
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
          h.innerHTML = SV.fbox([
            { label: '分', tex: '26\\div6=4\\cdots2\\text{分}', color: BLU, fill: '#eef4ff', border: BLU, size: 18 },
            { label: '化秒', tex: '2\\text{分}+24\\text{秒}=144\\text{秒}', color: AMB, fill: '#fdf6e8', border: AMB, size: 18 },
            { label: '秒', tex: '144\\div6=24\\text{秒}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18 }
          ]);
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>日數 D ＝ <span class="ival" id="dv">9</span>（D 日 12 時 ÷ 6）</label>
            <input type="range" id="ds" min="5" max="10" step="1" value="9"></div></div>`;
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            h.querySelector('#dv').textContent = d;
            const tot = d * 24 + 12, q = Math.floor(tot / 6), r = tot % 6;
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(37,99,235,.06)', stroke: BLU });
            s += TX(220, 95, d + '日12時 = ' + tot + '時 ÷ 6', { fs: 20, c: BLU, anchor: 'middle' });
            if (r === 0) {
              const dd = Math.floor(q / 24), hh = q % 24;
              s += TX(220, 135, '= ' + q + '時 = ' + dd + '日' + hh + '時', { fs: 17, c: RED, anchor: 'middle' });
            } else {
              s += TX(220, 135, '= ' + q + '時餘' + r + '時（除不盡）', { fs: 16, c: '#172033', anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>播放次數 n ＝ <span class="ival" id="nv">4</span></label>
            <input type="range" id="ns" min="1" max="4" step="1" value="4"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            let s = '', x = 40;
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
            s += TX(220, 190, '上午9時＋' + hh + '時' + mm + '分', { fs: 16, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 220', s);
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
