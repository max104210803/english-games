/* ============ 第 4 章　長方體 ============
   節次：7-1 面與透視圖、7-2 表面積
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：體積計算、容積換算、
     展開圖的完整判別（只談面數、垂直平行與表面積）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#d97706';
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

  // 長方體線框（含虛線）：w 寬、h 高、d 斜深
  function cuboid(x, y, w, h, d, o = {}) {
    const c = o.c || C, dash = o.dash || '5 4', dop = o.dop == null ? 1 : o.dop;
    let s = '';
    s += `<polygon points="${x},${y} ${x + w},${y} ${x + w + d},${y - d} ${x + d},${y - d}" fill="rgba(217,119,6,.12)" stroke="${c}" stroke-width="2"/>`;
    s += `<polygon points="${x},${y} ${x},${y + h} ${x + w},${y + h} ${x + w},${y}" fill="rgba(217,119,6,.05)" stroke="${c}" stroke-width="2"/>`;
    s += `<polygon points="${x + w},${y} ${x + w},${y + h} ${x + w + d},${y + h - d} ${x + w + d},${y - d}" fill="rgba(217,119,6,.09)" stroke="${c}" stroke-width="2"/>`;
    s += `<line x1="${x + d}" y1="${y - d}" x2="${x + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    s += `<line x1="${x}" y1="${y + h}" x2="${x + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    s += `<line x1="${x + d}" y1="${y + h - d}" x2="${x + w + d}" y2="${y + h - d}" stroke="${c}" stroke-width="2" stroke-dasharray="${dash}" opacity="${dop}"/>`;
    return s;
  }

  window.DECK.push({
    ch: 4,
    title: '長方體',
    color: C,
    sections: ['7-1 面與透視圖', '7-2 表面積'],
    slides: [

      /* ---------- 幾個面和桌面垂直 ---------- */
      {
        sec: '7-1', secName: '面與透視圖',
        title: '平放桌上：4 個側面和桌面垂直，上下 2 面平行',
        points: [
          '長方體共 <b>6 個面</b>：上下、前後、左右兩兩相對。',
          '平放時 4 個側面站著（<span class="k">垂直</span>桌面）。',
          '上下 2 面躺著（平行桌面），只和側面垂直。'
        ],
        formula: { label: '面數', tex: '6\\text{面：}4\\text{垂直}+2\\text{平行}' },
        visual: (h) => {
          let s = BOX(40, 210, 360, 16, { fill: '#94a3b8', stroke: '#64748b' });
          s += SV.seg(80, 226, 80, 256, '#94a3b8', 7);
          s += SV.seg(360, 226, 360, 256, '#94a3b8', 7);
          s += TX(355, 202, '桌面', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += cuboid(120, 125, 130, 85, 40, {});
          s += TX(308, 105, '站著 4 面', { fs: 14, c: RED });
          s += TX(308, 130, '和桌面垂直', { fs: 14, c: RED });
          s += TX(308, 165, '躺著 2 面平行', { fs: 14, c: BLU });
          h.innerHTML = svg('0 0 440 260', s);
        },
        caption: '站著的都垂直，躺著的才平行：4＋2＝6。',
        example: {
          q: '長方體紙箱平放桌上，幾個面和桌面垂直？',
          steps: ['6 個面中上下 2 面平行桌面。', '剩下 4 個側面都和桌面垂直。'],
          ans: '4 個'
        }
      },

      /* ---------- 透視圖虛線（互動） ---------- */
      {
        sec: '7-1', secName: '面與透視圖',
        title: '透視圖的虛線是被擋住的邊，不是沒有邊',
        points: [
          '看得到的邊畫<span class="k">實線</span>，被擋住的畫虛線。',
          '虛線的邊一樣存在，數邊數面時<b>都要算</b>。',
          '拖滑桿：把虛線調淡，看被擋住的三條邊。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>虛線透明度 ＝ <span class="ival" id="ov">1.0</span></label>
            <input type="range" id="os" min="0" max="10" step="1" value="10"></div></div>`;
          const draw = () => {
            const v = +h.querySelector('#os').value;
            const op = v / 10;
            h.querySelector('#ov').textContent = op.toFixed(1);
            let s = cuboid(130, 70, 120, 85, 40, { dop: op });
            s += TX(300, 100, '虛線 3 條', { fs: 14, c: C });
            s += TX(300, 125, '被後面擋住', { fs: 14, c: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 240', s);
          };
          h.querySelector('#os').oninput = draw; draw();
        },
        caption: '透明度調到 0，虛線消失但邊還在：數面時別漏。',
        example: {
          q: '透視圖中的虛線代表什麼？',
          steps: ['虛線是被立體擋住、看不到的邊。', '它真實存在，計算時一樣要算進去。'],
          ans: '被擋住的邊'
        }
      },

      /* ---------- 表面積公式 ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '表面積＝2×(兩兩相乘的和)：三組相對面各算一次',
        points: [
          '三組面：前後、左右、上下，每組 2 個相同。',
          '公式：<b>2×(長×寬＋長×高＋寬×高)</b>。',
          '正方體更快：\\(6×\\)邊長\\(×\\)邊長（邊長 5→150）。'
        ],
        formula: { label: '表面積', tex: 'S=2(ab+bc+ca)' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '長方體', tex: 'S=2(ab+bc+ca)', color: C, fill: '#fdf6e8', border: AMB, size: 20 },
            { label: '正方體', tex: 'S=6a^2\\;,\\;a=5\\to150', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18, note: '單位是平方公分' }
          ]);
        },
        caption: '三組面各算一次再兩倍，正方體是六倍一面。',
        example: {
          q: '邊長 5 公分的正方體，表面積是多少？',
          steps: ['一面 \\(5\\times 5=25\\)。', '\\(25\\times 6=150\\) 平方公分。'],
          ans: '150 平方公分'
        }
      },

      /* ---------- 蛋糕表面積（互動） ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '蛋糕 18×12×6：表面積 2×(216＋108＋72)＝792',
        points: [
          '三組面：18×12＝216、18×6＝108、12×6＝72。',
          '和＝396，兩倍＝<b>792 平方公分</b>。',
          '拖滑桿：把蛋糕切成 n 份，看總表面積怎麼變。'
        ],
        formula: { label: '蛋糕', tex: 'S=2(216+108+72)=792' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>切成 n 份，n ＝ <span class="ival" id="nv">1</span></label>
            <input type="range" id="ns" min="0" max="3" step="1" value="0"></div></div>`;
          const Ns = [1, 2, 4, 8], Tot = [792, 1224, 1440, 1584];
          const draw = () => {
            const i = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = Ns[i];
            let s = cuboid(60, 90, 150 - i * 18, 80, 40, {});
            s += TX(300, 100, '共 ' + Ns[i] + ' 份', { fs: 16, c: C });
            s += TX(300, 130, '總表面 ' + Tot[i], { fs: 16, c: RED });
            s += TX(300, 160, '差 ' + (Tot[i] - 792), { fs: 14, c: '#172033' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 240', s);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: 'n＝8 時總表面 1584：比原來多 792，切面全是新長出來的。',
        example: {
          q: '蛋糕 18cm×12cm×6cm，表面積幾平方公分？',
          steps: ['\\(2\\times(216+108+72)\\)。', '\\(=2\\times 396=792\\)。'],
          ans: '792 平方公分'
        }
      },

      /* ---------- 切一刀多兩面（互動） ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '切一刀多兩個切面：總表面積只會增加',
        points: [
          '每一刀切開，左右各露一個新面，共 <b>＋2 面</b>。',
          '所以 8 份總和 1584＞原來 792，增加 792。',
          '拖滑桿加平切的刀數，看總面積一次加多少。'
        ],
        formula: { label: '切分', tex: '\\text{總表面}=792+432k' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>刀數 k ＝ <span class="ival" id="kv">1</span></label>
            <input type="range" id="ks" min="0" max="3" step="1" value="1"></div></div>`;
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            h.querySelector('#kv').textContent = k;
            const tot = 792 + 432 * k;
            let s = '';
            for (let i = 0; i <= k; i++) {
              s += SV.seg(60 + i * 80, 80, 60 + i * 80, 180, i === 0 ? '#cbd5e1' : RED, i === 0 ? 2 : 4);
            }
            s += TX(220, 210, 'k 刀 → 總表面 ' + tot + ' 平方公分', { fs: 16, c: RED, anchor: 'middle' });
            s += TX(220, 50, '平切每刀 +2 個 18×12 切面（+432）', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 240', s);
          };
          h.querySelector('#ks').oninput = draw; draw();
        },
        caption: '紅線是平切的刀口：每多一刀，總表面多 432。',
        example: {
          q: '蛋糕平分 8 份後，表面積增加還是減少？差多少？',
          steps: ['8 份每份 198，總和 \\(198\\times 8=1584\\)。', '\\(1584-792=792\\)。'],
          ans: '增加 792 平方公分'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '7-2', secName: '表面積',
        title: '長方體三個坑：單位、切分方向、虛線漏數',
        points: [
          '表面積單位是<span class="k">平方</span>公分，不是立方公分。',
          '切分後總表面積<b>增加</b>，不是減少也不是不變。',
          '數面數邊時虛線也要算，不能當沒看到。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['正方體表面積 150 立方公分', '150 平方公分：表面積是面的大小，一律用平方'],
            ['切 8 份總表面積還是 792', '切開多切面：總和 1584，增加 792'],
            ['透視圖只數實線的面', '虛線的邊和面都存在，6 面一個不能少']
          ]);
        },
        caption: '單位、增減、虛線：三坑填平，長方體滿分。',
        example: {
          q: '每一小塊蛋糕 9cm×6cm×3cm，表面積多少？',
          steps: ['\\(2\\times(54+27+18)\\)。', '\\(=2\\times 99=198\\)。'],
          ans: '198 平方公分'
        }
      }

    ]
  });
})();
