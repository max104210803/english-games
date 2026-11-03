/* ============ 第 2 章　整數速算 ============
   節次：3-1 乘法速算、3-2 速算應用
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：直式乘除法運算、帶餘除法、
     分數與小數的四則運算（本章只玩整數的拆拼）。
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
    title: '整數速算',
    color: C,
    sections: ['3-1 乘法速算', '3-2 速算應用'],
    slides: [

      /* ---------- 好朋友組合 ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '速算第一步：先背熟三組好朋友',
        points: [
          '<span class="k">好朋友</span>：\\(2×5＝10\\)、\\(4×25＝100\\)、\\(8×125＝1000\\)。',
          '看到 25 就找 4，看到 125 就找 8，看到偶數就找 5。',
          '整十整百湊出來，後面計算全是 0，一路順風。'
        ],
        formula: { label: '好朋友', tex: '2\\times5=10\\;,\\;4\\times25=100\\;,\\;8\\times125=1000' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '10', tex: '2\\times 5=10', color: BLU, fill: '#eef4ff', border: BLU, size: 20 },
            { label: '100', tex: '4\\times 25=100', color: C, fill: '#f1eafe', border: C, size: 20 },
            { label: '1000', tex: '8\\times 125=1000', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20 }
          ]);
        },
        caption: '三組好朋友是整章的引擎，看到 25、125 先微笑。',
        example: {
          q: '\\(8\\times 125\\) 等於多少？',
          steps: ['好朋友組合：\\(8\\times 125=1000\\)。'],
          ans: '1000'
        }
      },

      /* ---------- 36×25（互動） ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '28×25＝700：把 28 拆出 4，湊出 100',
        points: [
          '28 藏著 4：\\(28＝7×4\\)，4 和 25 是好朋友。',
          '結合律：\\((7×4)×25＝7×(4×25)＝7×100\\)。',
          '拖滑桿：把 28 換成 28 的倍數，看答案怎麼長大。'
        ],
        formula: { label: '28×25', tex: '28\\times25=(7\\times4)\\times25=7\\times100=700' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>c ＝ <span class="ival" id="cv">1</span>（算 28c × 25）</label>
            <input type="range" id="cs" min="1" max="4" step="1" value="1"></div></div>`;
          const draw = () => {
            const c = +h.querySelector('#cs').value;
            h.querySelector('#cv').textContent = c;
            const a = 28 * c, ans = a * 25;
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(124,58,237,.07)', stroke: C });
            s += TX(220, 95, '(' + (7 * c) + '×4)×25 = ' + (7 * c) + '×100', { fs: 22, c: C, anchor: 'middle' });
            s += TX(220, 135, '答案 = ' + ans, { fs: 18, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
          h.querySelector('#cs').oninput = draw; draw();
        },
        caption: 'c＝1 時：(7×4)×25＝7×100＝700。',
        example: {
          q: '用速算求 \\(28\\times 25\\)。',
          steps: ['\\(28=7\\times 4\\)。', '\\((7\\times 4)\\times 25=7\\times(4\\times 25)\\)。', '\\(7\\times 100=700\\)。'],
          ans: '700'
        }
      },

      /* ---------- 連除變除以乘積 ---------- */
      {
        sec: '3-1', secName: '乘法速算',
        title: '連除並一次：分子不動，分母相乘（125×8＝1000）',
        points: [
          '除法寫成分數：被除數放上面（<span class="k">分子</span>）。',
          '除一次分母多一個：\\(125\\) 再除 \\(8\\) 就是分母相乘。',
          '同理 \\(100×356÷25÷4＝35600÷100＝356\\)。'
        ],
        formula: { label: '連除合併', tex: '\\frac{3720000}{125\\times8}=3720' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '原式', tex: '\\frac{3720000}{125}\\div 8', color: C, fill: '#f1eafe', border: C, size: 20, note: '被除數 3720000 是分子' },
            { label: '合併', tex: '=\\frac{3720000}{125\\times 8}', color: AMB, fill: '#fdf6e8', border: AMB, size: 20, note: '除兩次，分母相乘' },
            { label: '答案', tex: '=\\frac{3720000}{1000}=3720', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20 }
          ]);
        },
        caption: '分子 3720000 從頭到尾沒動：除數全跑到分母乘起來。',
        example: {
          q: '速算 \\(100\\times 356\\div 25\\div 4\\)。',
          steps: ['\\(100\\times 356=35600\\)。', '\\(35600\\div 25\\div 4=35600\\div 100\\)。'],
          ans: '356'
        }
      },

      /* ---------- 分配律運費（互動） ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '分配律：160×5＋240×5＝(160＋240)×5',
        points: [
          '兩種運費<b>件數相同</b>（都是 5 件）才能合併。',
          '先加後乘：\\((160＋240)×5＝400×5＝2000\\) 元。',
          '拖滑桿換件數，看總運費怎麼跟著變。'
        ],
        formula: { label: '分配律', tex: '160\\times5+240\\times5=(160+240)\\times5' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>件數 n ＝ <span class="ival" id="nv">5</span></label>
            <input type="range" id="ns" min="1" max="6" step="1" value="5"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const total = 400 * n;
            let s = '';
            s += SV.seg(60, 170, 60 + 40 * n, 170, BLU, 10);
            s += SV.seg(60, 195, 60 + 40 * n, 195, GRN, 10);
            s += TX(60, 150, '160元×' + n, { fs: 14, c: BLU });
            s += TX(60, 225, '240元×' + n, { fs: 14, c: GRN });
            s += TX(320, 180, '共 ' + total + ' 元', { fs: 20, c: RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 250', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝5 時兩條色帶等長疊加：400×5＝2000 元。',
        example: {
          q: '小安寄 160 元包裹 5 件、240 元包裹 5 件，共付多少運費？',
          steps: ['\\(160\\times 5+240\\times 5\\)。', '\\(=(160+240)\\times 5=400\\times 5\\)。'],
          ans: '2000 元'
        }
      },

      /* ---------- 1536×41＝1536×(42－1)（互動） ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '已知 1536×42＝64512，則 1536×41 減一次就好',
        points: [
          '41 比 42 少 1，所以答案比 64512 少一個 1536。',
          '\\(1536×41＝1536×(42－1)＝64512－1536\\)。',
          '拖滑桿：m 從 42 往下走，看答案每次減 1536。'
        ],
        formula: { label: '借力', tex: '1536\\times41=1536\\times(42-1)' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>m ＝ <span class="ival" id="mv">41</span></label>
            <input type="range" id="ms" min="39" max="42" step="1" value="41"></div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m;
            const ans = 64512 - 1536 * (42 - m);
            let s = BOX(40, 50, 360, 120, { fill: 'rgba(217,119,6,.07)', stroke: AMB });
            s += TX(220, 95, '1536 × ' + m + ' = ' + ans, { fs: 24, c: AMB, anchor: 'middle' });
            s += TX(220, 135, m === 42 ? '已知，不用算' : '＝64512－1536×' + (42 - m), { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: 'm＝41 時：64512－1536＝62976，不必重算直式。',
        example: {
          q: '已知 \\(1536\\times 42=64512\\)，求 \\(1536\\times 41\\)。',
          steps: ['\\(1536\\times 41=1536\\times(42-1)\\)。', '\\(=64512-1536=62976\\)。'],
          ans: '62976'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '3-2', secName: '速算應用',
        title: '速算三個坑：除法合併方向、減法分組、件數相同',
        points: [
          '連除合併是<span class="k">乘</span>起來除，不是除起來除。',
          '連減分組要全包括號，符號一起帶走。',
          '分配律合併前確認：乘的數是否相同？'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['÷125÷8＝÷(125÷8)', '÷125÷8＝÷(125×8)＝÷1000，除數相乘'],
            ['856－128－72＝856－128＋72', '856－128－72＝856－(128＋72)＝656，括號內全加'],
            ['160×5＋240×6 合併成 400×11', '乘數不同（5 和 6）不能合併，先各算再加']
          ]);
        },
        caption: '三個坑都看過一次，考試就穩了。',
        example: {
          q: '\\(358+246+642+754\\) 速算。',
          steps: ['\\((358+642)+(246+754)\\)。', '\\(=1000+1000=2000\\)。'],
          ans: '2000'
        }
      }

    ]
  });
})();
