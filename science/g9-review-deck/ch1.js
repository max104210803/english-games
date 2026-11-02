/* ============ 第 1 章　力與運動 ============
   節次：2-1 慣性與第一定律、2-2 第二定律與v-t圖、2-3 第三定律作用反作用、2-4 圓周運動與萬有引力
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：動量與衝量、角動量、轉動慣量、簡諧運動、微積分、
     第一章直線運動的定量計算（另章處理，Ch1 直線運動待補 ch3）。
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
    ch: 1,
    title: '力與運動',
    color: C,
    sections: ['2-1 慣性與第一定律', '2-2 第二定律與v-t圖', '2-3 第三定律作用反作用', '2-4 圓周運動與萬有引力'],
    slides: [

      /* ---------- 2-1 慣性 ---------- */
      {
        sec: '2-1', secName: '慣性與第一定律',
        title: '質量越大慣性越大：滿載購物車最難推動也最難停',
        points: [
          '靜止想靜止、運動想等速直線前進，這種性質叫<span class="k">慣性</span>。',
          '慣性大小只看<span class="k">質量</span>，和速度快慢無關。',
          '空車好推好停；滿載車難推動，跑起來也難停下。'
        ],
        formula: { label: '慣性', tex: 'm\\text{越大} \\Longrightarrow \\text{慣性越大}' },
        visual: (h) => {
          let s = BOX(30, 60, 170, 150, { fill: 'rgba(5,150,105,.08)', stroke: GRN });
          s += TX(115, 90, '空車', { fs: 16, c: GRN, anchor: 'middle' });
          s += TX(115, 120, '輕輕一推', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(115, 145, '就動了', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(115, 175, '慣性小', { fs: 14, c: GRN, anchor: 'middle' });
          s += BOX(240, 60, 170, 150, { fill: 'rgba(37,99,235,.08)', stroke: BLU });
          s += TX(325, 90, '滿載車', { fs: 16, c: BLU, anchor: 'middle' });
          s += TX(325, 120, '用力推才動', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(325, 145, '跑了難停下', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(325, 175, '慣性大', { fs: 14, c: BLU, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 260', s);
        },
        caption: '同樣的推法，空車一下就動，滿載車要很用力：差別在質量，也就是慣性。',
        example: {
          q: '同樣的力推 5 kg 空車與 50 kg 滿載車，哪一輛難改變運動狀態？',
          steps: ['慣性只看質量，50 kg 慣性大。', '滿載車難推動，跑起來也難停下。'],
          ans: '滿載車難改變'
        }
      },
      {
        sec: '2-1', secName: '慣性與第一定律',
        title: '合力為零有兩種命運：靜止不動或等速直線前進',
        points: [
          '不受外力或<span class="k">合力為零</span>時，靜者恆靜、動者等速直線。',
          '速度含快慢與方向：變快、變慢、轉彎都有合力在作用。',
          '等速前進時推力與摩擦力等大反向，互相平衡。'
        ],
        formula: { label: '第一定律', tex: '\\text{合力}=0 \\Longleftrightarrow \\text{靜止或等速直線}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '靜止', tex: '\\text{合力}=0,\\;v=0', color: BLU, fill: '#eef4ff', border: BLU, size: 18, note: '放在桌上的書' },
            { label: '等速直線', tex: '\\text{合力}=0,\\;v\\text{不變}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 18, note: '等速前進的箱子' },
            { label: '改變', tex: '\\text{合力}\\ne 0 \\Longrightarrow a\\ne 0', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 18, note: '變快變慢轉彎都有合力' }
          ]);
        },
        caption: '合力為零不一定靜止，也可能是等速直線運動：兩種狀態都要認得。',
        example: {
          q: '以 20 N 水平力推箱子，箱子等速前進，摩擦力多大？',
          steps: ['等速代表合力為零。', '摩擦力與推力等大反向。'],
          ans: '\\(20\\) N'
        }
      },
      {
        sec: '2-1', secName: '慣性與第一定律',
        title: '斜面越緩球滾越遠：另一側放平，球就永遠滾下去',
        points: [
          '球從斜面滑下，會爬回另一側的<span class="k">同樣高度</span>。',
          '另一側越緩，球要滑越遠才回得到原高度。',
          '拖滑桿看三步：讓球停下的是摩擦力，不是力用完了。'
        ],
        visual: (h) => {
          const ground = SV.seg(40, 250, 400, 250, '#94a3b8', 2);
          const leftSlope = SV.seg(90, 130, 200, 250, BLU, 3.5);
          const startBall = SV.dot(90, 130, RED, 6) + TX(90, 108, '從這裡放手', { fs: 13, c: RED, anchor: 'middle' });
          const highLine = SV.seg(90, 130, 370, 130, GRN, 2, '6 4') + TX(372, 134, '原高度', { fs: 13, c: GRN });
          SV.stepper(h, '0 0 440 300', [
            { t: '第 1 步：球從左側滑下，沿較陡右斜面爬回原高度', d: k => ground + leftSlope + startBall + highLine + SV.seg(200, 250, 290, 130, BLU, 3.5) + SV.dot(290, 130, RED, 6) + TX(290, 108, '回到原高度', { fs: 13, c: RED, anchor: 'middle' }) },
            { t: '第 2 步：右斜面放緩，球要滑更遠才回到原高度', d: k => ground + leftSlope + startBall + highLine + SV.seg(200, 250, 360, 130, AMB, 3.5) + SV.dot(360, 130, RED, 6) + TX(322, 108, '滑更遠', { fs: 13, c: AMB, anchor: 'middle' }) },
            { t: '第 3 步：右側放平，球到不了原高度，一直等速前進', d: k => ground + leftSlope + startBall + highLine + SV.seg(200, 250, 400, 250, GRN, 3.5) + SV.dot(340, 250, GRN, 6) + `<polygon points="362,250 352,244 352,256" fill="${GRN}"/><polygon points="382,250 372,244 372,256" fill="${GRN}"/>` + TX(340, 228, '永遠滾下去', { fs: 13, c: GRN, anchor: 'middle' }) + TX(250, 108, '到不了原高度', { fs: 13, c: RED, anchor: 'middle' }) }
          ], { acc: false });
        },
        caption: '伽利略的結論：維持運動不需要力，讓球停下的是摩擦力等外力。',
        example: {
          q: '快速抽桌巾，杯盤留在原處，用什麼解釋？',
          steps: ['摩擦作用時間太短，杯盤保持靜止。', '這正是慣性：維持原狀的性質。'],
          ans: '慣性（第一定律）'
        }
      },
      {
        sec: '2-1', secName: '慣性與第一定律',
        title: '慣性三個坑：維持要力、越快越大、停下也是慣性',
        points: [
          '等速直線<span class="k">不需要</span>合力；要力的是改變運動。',
          '慣性只看質量：跑得快難停，是要改變的速度多。',
          '轉彎時東西被甩出，是它保持原方向，車子自己轉走了。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['運動需要力來維持', '等速直線不需要合力；改變運動才要'],
            ['速度越快慣性越大', '慣性只看質量，和快慢無關'],
            ['腳踏車不踩會停，是慣性', '停下是摩擦力造成的；慣性是保持原狀'],
            ['轉彎有向外的力把東西甩出', '沒有向外的力，是東西沿原方向前進']
          ]);
        },
        caption: '考前看這頁：維持不用力、慣性看質量、停下是外力、甩出是慣性。',
        example: {
          q: '客運由北向南行駛，緊急煞車時杯中飲料往哪傾斜？',
          steps: ['飲料因慣性想繼續向南運動。', '飲料往前（南）湧，南側液面較高。'],
          ans: '向南傾斜'
        }
      },

      /* ---------- 2-2 第二定律 ---------- */
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: '先算合力再代 F 等於 ma：加速方向就是合力方向',
        points: [
          '公式的 F 一定是<span class="k">合力</span>：同向相加、反向相減。',
          '質量固定：合力越大加速度越大；合力固定：質量越大加速度越小。',
          '合力與運動同向變快，反向變慢：方向先看對。'
        ],
        formula: { label: '第二定律', tex: 'F=ma,\\;a=\\frac{\\Delta v}{t}' },
        visual: (h) => {
          let s = SV.seg(50, 250, 50, 100, '#94a3b8', 2) + `<polygon points="50,90 44,104 56,104" fill="#94a3b8"/>`;
          s += TX(36, 102, 'y', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += SV.seg(50, 210, 405, 210, '#94a3b8', 2) + `<polygon points="415,210 401,204 401,216" fill="#94a3b8"/>`;
          s += TX(423, 227, 'x', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += BOX(200, 160, 70, 50, { fill: 'rgba(37,99,235,.08)', stroke: C });
          s += TX(235, 190, '5 kg', { fs: 16, c: C, anchor: 'middle' });
          s += SV.seg(80, 172, 200, 172, BLU, 4) + `<polygon points="200,172 188,166 188,178" fill="${BLU}"/>`;
          s += TX(140, 156, '推力 30 N', { fs: 14, c: BLU, anchor: 'middle' });
          s += SV.seg(320, 192, 270, 192, RED, 4) + `<polygon points="270,192 282,186 282,198" fill="${RED}"/>`;
          s += TX(295, 182, '摩擦 10 N', { fs: 13, c: RED, anchor: 'middle' });
          s += SV.seg(140, 240, 240, 240, GRN, 4.5) + `<polygon points="240,240 228,234 228,246" fill="${GRN}"/>`;
          s += TX(190, 262, '合力 20 N，a＝4', { fs: 14, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 280', s);
        },
        caption: '推 30 N、摩擦 10 N，合力 20 N：5 kg 木塊的加速度就是 4 m/s²。',
        example: {
          q: '5 kg 木塊靜止，受 30 N 水平推力，摩擦力 10 N，求加速度。',
          steps: ['合力 \\(=30-10=20\\) N。', '\\(a=20 \\div 5=4\\) m/s²。'],
          ans: '\\(4\\) m/s²'
        }
      },
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: '推力減摩擦才是合力：拖滑桿看加速度怎麼變',
        points: [
          '有摩擦時：合力＝推力<span class="k">減</span>摩擦力。',
          '拖滑桿：摩擦越大，合力越小，加速度越小。',
          '問自己：摩擦多大時，加速度剛好歸零？'
        ],
        formula: { label: '合力', tex: 'F_{合}=F_{推}-f,\\;a=F_{合}\\div m' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>摩擦力 f ＝ <span class="ival" id="fv">10</span> N（推力 30 N、質量 5 kg）</label>
            <input type="range" id="fs" min="0" max="30" step="5" value="10"></div></div>`;
          const draw = () => {
            const f = +h.querySelector('#fs').value;
            h.querySelector('#fv').textContent = f;
            const a = (30 - f) / 5, n = 30 - f;
            let s = BOX(40, 24, 360, 76, { fill: 'rgba(37,99,235,.07)', stroke: BLU });
            s += TX(220, 58, 'a ＝ (30－' + f + ') ÷ 5 ＝ ' + a, { fs: 24, c: BLU, anchor: 'middle' });
            s += TX(220, 84, f === 30 ? '合力為零：靜止或等速，不加速' : '合力向前，加速前進', { fs: 14, c: '#172033', anchor: 'middle' });
            s += SV.seg(50, 262, 50, 128, '#94a3b8', 2) + `<polygon points="50,118 44,132 56,132" fill="#94a3b8"/>`;
            s += TX(36, 130, 'y', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += SV.seg(50, 220, 405, 220, '#94a3b8', 2) + `<polygon points="415,220 401,214 401,226" fill="#94a3b8"/>`;
            s += TX(423, 237, 'x', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += BOX(200, 170, 70, 50, { fill: 'rgba(37,99,235,.08)', stroke: C });
            s += TX(235, 200, '5 kg', { fs: 15, c: C, anchor: 'middle' });
            s += SV.seg(80, 182, 200, 182, BLU, 4) + `<polygon points="200,182 188,176 188,188" fill="${BLU}"/>`;
            s += TX(140, 166, '推力 30 N', { fs: 14, c: BLU, anchor: 'middle' });
            const M = f * 4;
            s += SV.seg(270 + M, 200, 270, 200, RED, 4) + `<polygon points="270,200 282,194 282,206" fill="${RED}"/>`;
            s += TX(270 + M / 2, 190, '摩擦 ' + f, { fs: 13, c: RED, anchor: 'middle' });
            if (n === 0) {
              s += TX(235, 250, '合力＝0', { fs: 16, c: GRN, anchor: 'middle' });
            } else {
              s += SV.seg(140, 250, 140 + n * 4, 250, GRN, 4.5) + `<polygon points="${140 + n * 4},250 ${140 + n * 4 - 12},244 ${140 + n * 4 - 12},256" fill="${GRN}"/>`;
              s += TX(140 + n * 2, 268, '合力 ' + n + ' N', { fs: 14, c: GRN, anchor: 'middle' });
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#fs').oninput = draw; draw();
        },
        caption: 'f＝10 時 a＝4：推力箭頭長、摩擦箭頭短；拖到 f＝30，合力箭頭消失、加速度歸零。',
        example: {
          q: '拉力 30 N、摩擦 10 N、質量 5 kg，加速度多少？摩擦變 30 N 呢？',
          steps: ['\\((30-10) \\div 5=4\\) m/s²。', '摩擦 30 N 時合力為零，加速度為 0。'],
          ans: '\\(4\\) m/s²；\\(0\\)'
        }
      },
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: 'x-t看位置、v-t看快慢：v-t斜率接上F等於ma',
        points: [
          'x-t 圖管位置：斜率是<span class="k">速度</span>，越陡跑越快。',
          'v-t 圖管快慢：斜率是<span class="k">加速度</span>，越陡合力越大。',
          '水平線意義不同：x-t 水平是靜止，v-t 水平是等速。',
          'v-t 讀出 \\(a\\) 再乘 \\(m\\) 就是合力：一圖一式串起來。'
        ],
        formula: { label: '兩圖一式', tex: '\\text{x-t斜率}=v,\\;\\text{v-t斜率}=a' },
        visual: (h) => {
          let s = SV.seg(40, 250, 40, 60, '#94a3b8', 2) + SV.seg(40, 250, 200, 250, '#94a3b8', 2);
          s += TX(28, 66, 'x', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += TX(205, 268, 't', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += SV.seg(55, 230, 185, 120, BLU, 3.5) + SV.dot(185, 120, BLU);
          s += TX(120, 100, '斜率＝v', { fs: 13, c: BLU, anchor: 'middle' });
          s += TX(120, 268, 'x-t 圖', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += SV.seg(250, 250, 250, 60, '#94a3b8', 2) + SV.seg(250, 250, 410, 250, '#94a3b8', 2);
          s += TX(238, 66, 'v', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += TX(415, 268, 't', { fs: 15, c: '#64748b', anchor: 'middle' });
          s += SV.seg(265, 230, 395, 120, RED, 3.5) + SV.dot(395, 120, RED);
          s += TX(330, 100, '斜率＝a', { fs: 13, c: RED, anchor: 'middle' });
          s += TX(330, 268, 'v-t 圖', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += TX(220, 292, 'a × m ＝ 合力', { fs: 14, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '左圖斜率報速度，右圖斜率報加速度；a 乘 m 得合力。',
        example: {
          q: '某車 v-t 圖是斜直線，斜率 2 m/s²，質量 3 kg，合力多大？若 x-t 圖是水平線呢？',
          steps: ['\\(a=2\\) m/s²，合力 \\(F=3 \\times 2=6\\) N。', 'x-t 水平代表位置不變，即靜止。'],
          ans: '\\(6\\) N；靜止'
        }
      },
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: '等速是斜直配水平，加速是變彎配上斜',
        points: [
          '等速：x-t 是<span class="k">斜直線</span>（斜率＝v），v-t 是水平線。',
          '加速：x-t 變<span class="k">拋物線</span>（越來越陡），v-t 往上斜。',
          '拖滑桿：a＝0 左斜直右水平；a 調大右變陡、左變彎。',
          '減速反過來：v-t 往下斜，x-t 曲線漸緩（以上指往正方向運動）。'
        ],
        formula: { label: '判讀', tex: 'x-t\\text{看彎直},\\;v-t\\text{看斜平}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>加速度 a ＝ <span class="ival" id="gv">0</span> m/s²（初速 4 m/s）</label>
            <input type="range" id="gs" min="0" max="4" step="2" value="0"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#gs').value;
            h.querySelector('#gv').textContent = a;
            const v0 = 4, T = 5, xmax = 70, vmax = 24;
            let xt = [], vt = [];
            for (let i = 0; i <= 10; i++) {
              const t = T * i / 10;
              const x = v0 * t + 0.5 * a * t * t, v = v0 + a * t;
              xt.push([Math.round((55 + (t / T) * 130) * 10) / 10, Math.round((240 - (x / xmax) * 160) * 10) / 10]);
              vt.push([Math.round((265 + (t / T) * 130) * 10) / 10, Math.round((240 - (v / vmax) * 160) * 10) / 10]);
            }
            let s = SV.seg(40, 250, 40, 60, '#94a3b8', 2) + SV.seg(40, 250, 200, 250, '#94a3b8', 2);
            s += TX(28, 66, 'x', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += TX(205, 268, 't', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += `<polyline points="${xt.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${BLU}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
            s += TX(120, 92, a === 0 ? '斜直線：等速' : '拋物線：加速', { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(120, 268, 'x-t 圖', { fs: 13, c: '#64748b', anchor: 'middle' });
            s += SV.seg(250, 250, 250, 60, '#94a3b8', 2) + SV.seg(250, 250, 410, 250, '#94a3b8', 2);
            s += TX(238, 66, 'v', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += TX(415, 268, 't', { fs: 15, c: '#64748b', anchor: 'middle' });
            s += `<polyline points="${vt.map(p => p[0] + ',' + p[1]).join(' ')}" fill="none" stroke="${RED}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
            s += TX(330, 92, a === 0 ? '水平線：等速' : '往上斜：加速', { fs: 13, c: RED, anchor: 'middle' });
            s += TX(330, 268, 'v-t 圖', { fs: 13, c: '#64748b', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#gs').oninput = draw; draw();
        },
        caption: 'a＝0：左斜直、右水平；a＝2、4：左變彎、右變陡，起點都相同。',
        example: {
          q: '某車 x-t 圖是拋物線、v-t 圖往上斜，是等速還是加速？v-t 水平＋x-t 斜直呢？',
          steps: ['拋物線配上斜 → 加速運動。', '斜直配水平 → 等速運動，合力為零。'],
          ans: '加速；等速'
        }
      },
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: '要停下同樣的速度：時間越長，受力越小',
        points: [
          '同樣的減速，花越久時間，加速度越小、<span class="k">受力越小</span>。',
          '安全氣囊、氣墊、海綿包柱都是延長作用時間。',
          '接球手往後收，也是同一招。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['停下越快越安全', '時間越長受力越小：氣囊就是拖時間'],
            ['斜率變緩就是在減速', '往上但變緩仍在加速，只是合力變小'],
            ['靜止或等速可以直接代 F＝ma', '先判合力為零，不必硬算']
          ]);
        },
        caption: '考前看這頁：看斜率判合力，看時間判受力。',
        example: {
          q: '同樣速度撞上，包海綿的柱子比較不痛，為什麼？',
          steps: ['海綿延長減速時間。', '時間長則加速度小，人受力小。'],
          ans: '延長作用時間'
        }
      },

      /* ---------- 2-3 第三定律 ---------- */
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '力一定成對出現：等大反向，分屬兩個物體',
        points: [
          '甲推乙的同時，乙也推甲：<span class="k">同時出現、同時消失</span>。',
          '兩力等大、反向、一直線，但作用在<span class="k">不同物體</span>。',
          '靜止加速壓壞都一樣大：受力同，加速度看質量。'
        ],
        formula: { label: '第三定律', tex: 'F_{甲對乙}=-F_{乙對甲}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '大小', tex: '\\text{永遠相等}', color: BLU, fill: '#eef4ff', border: BLU, size: 18, note: '靜止加速都一樣大' },
            { label: '方向', tex: '\\text{相反，一直線}', color: VIO, fill: '#f1eafe', border: VIO, size: 18, note: '甲乙互相指向對方' },
            { label: '對象', tex: '\\text{兩個不同物體}', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 18, note: '不能互相抵消' }
          ]);
        },
        caption: '記三個關鍵：等大、反向、分屬兩物體，所以永遠抵消不掉。',
        example: {
          q: '60 kg 大人與 40 kg 小孩冰上互推，推力 120 N，兩人加速度各多少？',
          steps: ['兩人受力都是 120 N，方向相反。', '大人 \\(120 \\div 60=2\\)，小孩 \\(120 \\div 40=3\\) m/s²。'],
          ans: '大人 \\(2\\)，小孩 \\(3\\) m/s²'
        }
      },
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '主詞受詞對調：書壓桌，桌就撐書',
        points: [
          '找反作用力：把「A 對 B 的力」<span class="k">主詞受詞對調</span>。',
          '桌撐書的反作用力是書壓桌；地球吸書的反作用是書吸地球。',
          '拖滑桿看三步：重量配支撐是平衡力，不是第三定律那一對。'
        ],
        visual: (h) => {
          SV.stepper(h, '0 0 440 300', [
            { t: '第 1 步：地球吸書（書的重量），反作用是書吸地球', d: k => BOX(150, 120, 140, 40, { fill: 'rgba(37,99,235,.08)', stroke: BLU }) + TX(220, 147, '書', { fs: 16, c: BLU, anchor: 'middle' }) + SV.seg(220, 120, 220, 60, RED, 3) + SV.vlabel(230, 80, '地球吸書') },
            { t: '第 2 步：桌面撐書（支撐力），反作用是書壓桌面', d: k => SV.seg(150, 170, 290, 170, AMB, 4) + SV.vlabel(220, 195, '桌面') + SV.seg(220, 170, 220, 120, GRN, 3) + SV.vlabel(230, 140, '桌撐書') },
            { t: '第 3 步：重量與支撐都作用在書上，是平衡力那一對', d: k => TX(220, 250, '重量配支撐：在同一物體＝平衡力', { fs: 15, c: RED, anchor: 'middle' }) }
          ]);
        },
        caption: '都在書上的是平衡力；跨在兩物體上的才是作用反作用。',
        example: {
          q: '20 kgw 書桌上靜置 5 kgw 石塊，地面撐起書桌多少？',
          steps: ['石塊壓桌面 5 kgw（支撐力的反作用）。', '地面要撐 \\(20+5=25\\) kgw。'],
          ans: '\\(25\\) kgw'
        }
      },
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '第三定律四個坑：抵消、配錯對、推不動、火箭推空氣',
        points: [
          '分屬兩物體<span class="k">不能抵消</span>；加速時兩力仍相等（8N提4N書，書壓手仍8N）。',
          '重量配支撐是平衡力；推不動是摩擦力在擋。',
          '火箭推的是自己噴出的氣體，沒有空氣也能飛。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['作用反作用互相抵消，合力為零', '分屬不同物體，不能抵消'],
            ['書的重量配桌面支撐是第三定律', '兩力都在書上，是平衡力'],
            ['推不動是反作用力太大', '兩力等大；推不動是摩擦力平衡'],
            ['火箭靠推空氣前進', '推的是自己噴出的氣體']
          ]);
        },
        caption: '考前看這頁：先看作用在幾個物體，再判斷是哪一對。',
        example: {
          q: '115 會考：水滴撞石英板，F–t 圖最高點處，石英板給水滴的力 F′ 如何？',
          steps: ['F′ 是 F 的反作用力，每一刻都等大。', 'F 最大處，F′ 也最大。'],
          ans: 'F′ 最大'
        }
      },

      /* ---------- 2-4 圓周與萬有引力 ---------- */
      {
        sec: '2-4', secName: '圓周運動與萬有引力',
        title: '只轉彎、快慢不變也要力：方向一直在變就是加速度',
        points: [
          '等速率圓周：快慢不變、<span class="k">方向一直變</span>，所以有加速度。',
          '速度方向是該點的<span class="k">切線</span>，加速度與向心力指向圓心。',
          '向心力由拉力、摩擦力或萬有引力擔任；消失就切線飛出。'
        ],
        formula: { label: '切線', tex: 'v\\text{沿切線},\\;F_{向}\\text{指向圓心}' },
        visual: (h) => {
          let s = `<circle cx="220" cy="160" r="90" fill="rgba(37,99,235,.06)" stroke="${C}" stroke-width="2.5"/>`;
          s += SV.dot(220, 160, '#94a3b8') + TX(220, 185, '圓心', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += SV.dot(310, 160, RED, 6);
          s += SV.seg(310, 160, 310, 70, RED, 3.5) + `<polygon points="310,58 302,74 318,74" fill="${RED}"/>`;
          s += TX(330, 90, '切線 v', { fs: 14, c: RED, anchor: 'middle' });
          s += SV.seg(310, 160, 235, 160, GRN, 3.5) + `<polygon points="223,160 239,152 239,168" fill="${GRN}"/>`;
          s += TX(270, 148, '向心力', { fs: 14, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '紅點在正東方逆時針轉：切線朝北，向心力指向圓心。',
        example: {
          q: '小球每秒 2 圈，3 秒後回到正東方且逆時針轉，速度朝哪？（會考 110）',
          steps: ['\\(2 \\times 3=6\\) 圈是整數圈，回到正東。', '逆時針在正東往前走，朝北。'],
          ans: '朝北'
        }
      },
      {
        sec: '2-4', secName: '圓周運動與萬有引力',
        title: '引力看乘積除以距離平方：距離 2 倍，剩下 4 分之 1',
        points: [
          '兩物互相吸引，大小和<span class="k">質量乘積</span>成正比。',
          '和距離<span class="k">平方</span>成反比：2 倍遠剩 4 分之 1。',
          '拖滑桿：互吸的兩力永遠一樣大，只是地球幾乎不動。'
        ],
        formula: { label: '萬有引力', tex: 'F\\propto\\frac{m_{1}m_{2}}{r^{2}}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>距離變為原來的 <span class="ival" id="rv">2</span> 倍</label>
            <input type="range" id="rs" min="1" max="4" step="1" value="2"></div></div>`;
          const draw = () => {
            const r = +h.querySelector('#rs').value;
            h.querySelector('#rv').textContent = r;
            const frac = r === 1 ? '1（不變）' : '1/' + (r * r);
            const xA = 50, xB = 50 + 92 * r, y = 95, L = 22 / (r * r), W = 300;
            let s = TX(220, 30, 'F 變為原來 ' + frac + ' 倍', { fs: 22, c: VIO, anchor: 'middle' });
            s += `<circle cx="${xA}" cy="${y}" r="30" fill="rgba(37,99,235,.18)" stroke="${BLU}" stroke-width="2.5"/>`;
            s += TX(xA, y + 5, 'M', { fs: 16, c: BLU, anchor: 'middle' });
            s += `<circle cx="${xB}" cy="${y}" r="14" fill="rgba(217,119,6,.22)" stroke="${AMB}" stroke-width="2.5"/>`;
            s += TX(xB, y + 5, 'm', { fs: 13, c: AMB, anchor: 'middle' });
            s += ARW(xA + 30, y, xA + 30 + L, y, RED, 4) + ARW(xB - 14, y, xB - 14 - L, y, RED, 4);
            s += SV.seg(xA, 140, xB, 140, '#64748b', 2) + SV.seg(xA, 132, xA, 148, '#64748b', 2) + SV.seg(xB, 132, xB, 148, '#64748b', 2);
            s += TX((xA + xB) / 2, 164, '距離 ' + r + ' 倍', { fs: 14, c: '#64748b', anchor: 'middle' });
            s += TX(70, 186, '引力大小', { fs: 13, c: RED, anchor: 'end' });
            s += BOX(80, 174, W, 18, { fill: 'rgba(148,163,184,.12)', stroke: '#cbd5e1', r: 6 });
            s += BOX(80, 174, W / (r * r), 18, { fill: RED, stroke: RED, r: 6 });
            s += TX(220, 222, '紅箭頭＝互相吸引的力：兩邊一樣大，方向相反', { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 235', s);
          };
          h.querySelector('#rs').oninput = draw; draw();
        },
        caption: '拖到 3 倍剩 9 分之 1，4 倍剩 16 分之 1：平方在分母。',
        example: {
          q: '兩物體質量各變 2 倍，距離也變 2 倍，引力變原來幾倍？',
          steps: ['分子 \\(2 \\times 2=4\\) 倍，分母 \\(2^{2}=4\\) 倍。', '\\(4 \\div 4=1\\)，維持不變。'],
          ans: '不變（\\(1\\) 倍）'
        }
      },
      {
        sec: '2-4', secName: '圓周運動與萬有引力',
        title: '質量不變重量會變：月球上重量只剩 6 分之 1',
        points: [
          '質量是物質多寡，<span class="k">不隨地點改變</span>；重量是地球引力。',
          '離地心越遠重量越小；月球上約地球的 <span class="k">6 分之 1</span>。',
          '互吸的力一樣大：地球吸我等於我吸地球。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['等速率圓周是等速度運動', '方向一直變，速度在變，有加速度'],
            ['繩斷後球沿半徑往外飛', '沿斷掉瞬間的切線方向飛出'],
            ['地球吸我的力比我吸地球大', '一樣大；地球質量大所以幾乎不動'],
            ['距離 2 倍引力剩 2 分之 1', '平方反比，剩 4 分之 1'],
            ['到月球質量變小', '質量不變，變的是重量'],
            ['向心力是一種新的力', '由拉力摩擦力萬有引力擔任']
          ]);
        },
        caption: '考前看這頁：速率看切線、引力看平方、質量重量分清楚。',
        example: {
          q: '質量 60 kg 的人到月球（重力約地球 6 分之 1），質量與重量各多少？',
          steps: ['質量不變，仍是 60 kg。', '重量 \\(60 \\div 6=10\\) kgw。'],
          ans: '60 kg；10 kgw'
        }
      },

      /* ---------- 三定律生活例 ---------- */
      {
        sec: '2-1', secName: '慣性與第一定律',
        title: '拉環會說話：鉛直是等速，前偏就是煞車',
        points: [
          '等速時拉環<span class="k">鉛直下垂</span>：重力與繩拉力平衡，合力為零。',
          '煞車時下端往前偏：車停了，拉環想繼續前進。',
          '0.2 kg 拉環等速時 \\(T＝0.2×10＝2\\) N，恰等於重量。'
        ],
        formula: { label: '等速平衡', tex: 'T=W=mg' },
        visual: (h) => {
          let s = BOX(30, 50, 175, 200, { fill: 'rgba(5,150,105,.06)', stroke: GRN });
          s += TX(117, 80, '等速行駛', { fs: 15, c: GRN, anchor: 'middle' });
          s += SV.seg(60, 220, 175, 220, '#94a3b8', 2);
          s += SV.seg(117, 110, 117, 175, '#64748b', 3);
          s += `<circle cx="117" cy="190" r="13" fill="#fff" stroke="#64748b" stroke-width="2.5"/>`;
          s += TX(117, 240, 'T＝W，鉛直', { fs: 13, c: GRN, anchor: 'middle' });
          s += BOX(235, 50, 175, 200, { fill: 'rgba(225,29,72,.05)', stroke: RED });
          s += TX(322, 80, '煞車瞬間', { fs: 15, c: RED, anchor: 'middle' });
          s += SV.seg(265, 220, 380, 220, '#94a3b8', 2);
          s += SV.seg(310, 110, 335, 175, '#64748b', 3);
          s += `<circle cx="340" cy="190" r="13" fill="#fff" stroke="#64748b" stroke-width="2.5"/>`;
          s += SV.seg(280, 130, 350, 130, RED, 3.5) + `<polygon points="350,130 338,124 338,136" fill="${RED}"/>`;
          s += TX(315, 116, '慣性往前', { fs: 13, c: RED, anchor: 'middle' });
          s += TX(322, 240, '下端往前偏', { fs: 13, c: RED, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '鉛直＝等速或靜止；偏向哪邊，慣性就想往哪邊去。',
        example: {
          q: '0.2 kg 拉環，捷運等速行駛時繩拉力多大？煞車瞬間拉環往哪偏？',
          steps: ['等速合力零，\\(T＝W＝0.2 \\times 10＝2\\) N。', '拉環想繼續前進，下端往車行方向偏。'],
          ans: '\\(2\\) N；往車行方向偏'
        }
      },
      {
        sec: '2-2', secName: '第二定律與v-t圖',
        title: '超載貨車煞不住：同樣煞車力，質量大加速度小',
        points: [
          '煞車合力 6000 N：空車 1000 kg 得 a＝6，滿載 3000 kg 只剩 a＝2。',
          '初速 20 m/s：空車約 33 m 停住，滿載要 100 m。',
          '拖滑桿：載越重越早煞車，這就是第二定律。'
        ],
        formula: { label: '煞停距離', tex: 's=\\frac{v^{2}}{2a}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>載重質量 m ＝ <span class="ival" id="mv">1000</span> kg（煞車合力 6000 N、初速 20 m/s）</label>
            <input type="range" id="ms" min="1000" max="3000" step="1000" value="1000"></div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            h.querySelector('#mv').textContent = m;
            const a = 6000 / m, sr = Math.round(400 / (2 * a)), len = Math.round(400 / (2 * a)) * 3;
            let s = BOX(30, 24, 380, 60, { fill: 'rgba(37,99,235,.07)', stroke: BLU });
            s += TX(220, 60, 'a ＝ ' + a + ' m/s²，煞停約 ' + sr + ' m', { fs: 22, c: BLU, anchor: 'middle' });
            s += TX(60, 128, '空車', { fs: 14, c: '#172033', anchor: 'middle' });
            s += BOX(120, 112, 100, 28, { fill: 'rgba(5,150,105,.20)', stroke: GRN });
            s += TX(232, 132, '33 m', { fs: 13, c: GRN });
            s += TX(60, 188, '你的車', { fs: 14, c: '#172033', anchor: 'middle' });
            s += BOX(120, 172, len, 28, { fill: 'rgba(37,99,235,.20)', stroke: BLU });
            s += TX(120 + len / 2, 216, '約 ' + sr + ' m', { fs: 13, c: BLU, anchor: 'middle' });
            s += SV.seg(220, 106, 220, 216, '#94a3b8', 2, '5 4');
            s += TX(220, 232, '空車線', { fs: 12, c: '#64748b', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 260', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '拖到 3000 kg：a 剩 2，煞停 100 m，是空車 3 倍遠。',
        example: {
          q: '煞車合力 6000 N，空車 1000 kg、滿載 3000 kg，a 各多少？20 m/s 煞停各多遠？',
          steps: ['\\(a＝6000 \\div 1000＝6\\)，\\(6000 \\div 3000＝2\\) m/s²。', 's＝400÷12 約 33 m；400÷4＝100 m。'],
          ans: '6、2 m/s²；約 33 m、100 m'
        }
      },
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '起跑蹬地 400 N：地也用 400 N 把你往前推',
        points: [
          '腳向後下方蹬地 400 N，地<span class="k">同時</span>向前推腳 400 N。',
          '60 kg 跑者：\\(a＝400÷60\\) 約 6.7 m/s²，向前衝出去。',
          '兩力分屬腳與地面：等大反向，不能抵消。'
        ],
        formula: { label: '蹬地', tex: 'F_{地對人}=F_{人對地},\\;a=F\\div m' },
        visual: (h) => {
          const ax1 = 250, ay1 = 180, ax2 = 216, ay2 = 232;
          const L1 = Math.hypot(ax2 - ax1, ay2 - ay1), ux1 = (ax2 - ax1) / L1, uy1 = (ay2 - ay1) / L1;
          const bx1 = ax2 - 14 * ux1, by1 = ay2 - 14 * uy1, wx1 = -uy1 * 5, wy1 = ux1 * 5;
          const ax3 = 224, ay3 = 232, ax4 = 272, ay4 = 180;
          const L2 = Math.hypot(ax4 - ax3, ay4 - ay3), ux2 = (ax4 - ax3) / L2, uy2 = (ay4 - ay3) / L2;
          const bx2 = ax4 - 14 * ux2, by2 = ay4 - 14 * uy2, wx2 = -uy2 * 5, wy2 = ux2 * 5;
          let s = SV.seg(40, 235, 400, 235, '#64748b', 3);
          s += BOX(185, 195, 55, 40, { fill: 'rgba(37,99,235,.10)', stroke: BLU });
          s += TX(212, 219, '腳', { fs: 14, c: BLU, anchor: 'middle' });
          s += SV.seg(ax1, ay1, ax2, ay2, BLU, 4) + `<polygon points="${ax2},${ay2} ${Math.round(bx1 + wx1)},${Math.round(by1 + wy1)} ${Math.round(bx1 - wx1)},${Math.round(by1 - wy1)}" fill="${BLU}"/>`;
          s += TX(150, 190, '人蹬地 400 N', { fs: 13, c: BLU, anchor: 'middle' });
          s += SV.seg(ax3, ay3, ax4, ay4, RED, 4) + `<polygon points="${ax4},${ay4} ${Math.round(bx2 + wx2)},${Math.round(by2 + wy2)} ${Math.round(bx2 - wx2)},${Math.round(by2 - wy2)}" fill="${RED}"/>`;
          s += TX(312, 196, '地推人 400 N', { fs: 13, c: RED, anchor: 'middle' });
          s += TX(220, 262, 'a ＝ 400÷60 約 6.7 m/s²', { fs: 15, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 280', s);
        },
        caption: '同一直線、等大反向、分屬兩物：跑者得 a，地球幾乎不動。',
        example: {
          q: '60 kg 跑者起跑蹬地 400 N，地給人的推力多大？跑者加速度？',
          steps: ['反作用力也是 400 N，方向向前。', '\\(a＝400 \\div 60\\) 約 6.7 m/s²。'],
          ans: '400 N；約 6.7 m/s²'
        }
      },
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '慣性不是力，作用反作用是真實的力：數有幾個物體',
        points: [
          '慣性是<span class="k">性質</span>不是力：單一物體維持原狀，只看質量。',
          '作用反作用是<span class="k">真實的力</span>：兩物互推，等大反向分兩物。',
          '抽桌巾留杯盤：同一物體維持原狀，沒有第二個力。',
          '火箭升空：噴氣與火箭互推，兩物體才有第三定律。'
        ],
        formula: { label: '一句話分辨', tex: '\\text{一物維持原狀}=\\text{慣性},\\;\\text{兩物互推}=\\text{第三定律}' },
        visual: (h) => {
          h.innerHTML = xo([
            ['杯盤被「慣性力」拉住才不動', '慣性不是力；是杯盤自己維持靜止'],
            ['轉彎有離心力把人往外推', '沒有向外的力；是身體沿原方向前進'],
            ['書壓桌、桌撐書互相抵消', '兩力分屬不同物體，不能抵消'],
            ['火箭靠推空氣前進', '推的是自己噴出的氣體：兩物互推']
          ]);
        },
        caption: '先數物體：一個維持原狀想慣性，兩個互推找第三定律。',
        example: {
          q: '快速抽桌巾杯盤不動，和火箭升空，分別用哪個定律解釋？',
          steps: ['杯盤：單一物體維持靜止 → 慣性（第一定律）。', '火箭：氣體與火箭互推 → 作用反作用（第三定律）。'],
          ans: '慣性；第三定律'
        }
      },
      {
        sec: '2-3', secName: '第三定律作用反作用',
        title: '馬拉車拆開看：500N對500N，加速看各自合力',
        points: [
          '馬拉車 500N，車拉馬 500N：這一對<span class="k">永遠相等</span>。',
          '看車：500N拉力減300N摩擦＝合力200N向左，加速。',
          '看馬：地面推馬大於500N拉回，馬也前進。',
          '結論：加速度看<span class="k">同一物體</span>的合力，不比跨物體的兩力。'
        ],
        formula: { label: '車的合力', tex: 'F_{合}=500-300=200' },
        visual: (h) => {
          let s = SV.seg(30, 258, 410, 258, '#94a3b8', 2);
          s += BOX(50, 185, 95, 55, { fill: 'rgba(37,99,235,.08)', stroke: BLU });
          s += TX(97, 218, '馬', { fs: 16, c: BLU, anchor: 'middle' });
          s += BOX(295, 185, 95, 55, { fill: 'rgba(217,119,6,.08)', stroke: AMB });
          s += TX(342, 218, '車', { fs: 16, c: AMB, anchor: 'middle' });
          s += `<circle cx="308" cy="250" r="8" fill="#fff" stroke="#64748b" stroke-width="2"/><circle cx="334" cy="250" r="8" fill="#fff" stroke="#64748b" stroke-width="2"/>`;
          s += SV.seg(145, 205, 295, 205, '#64748b', 2.5);
          s += SV.seg(295, 188, 155, 188, BLU, 4) + `<polygon points="155,188 167,182 167,194" fill="${BLU}"/>`;
          s += TX(220, 172, '馬拉車 500 N', { fs: 13, c: BLU, anchor: 'middle' });
          s += SV.seg(145, 222, 285, 222, RED, 4) + `<polygon points="285,222 273,216 273,228" fill="${RED}"/>`;
          s += TX(220, 238, '車拉馬 500 N', { fs: 13, c: RED, anchor: 'middle' });
          s += SV.seg(348, 250, 392, 250, RED, 3.5) + `<polygon points="392,250 380,244 380,256" fill="${RED}"/>`;
          s += TX(370, 292, '車受摩擦 300 N', { fs: 12, c: RED, anchor: 'middle' });
          s += SV.seg(100, 246, 30, 246, GRN, 3.5) + `<polygon points="30,246 42,240 42,252" fill="${GRN}"/>`;
          s += TX(65, 272, '地推馬', { fs: 12, c: GRN, anchor: 'middle' });
          s += TX(290, 274, '車合力 200 N 向左', { fs: 13, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '500N 對 500N 永遠相等；車加速看車的合力 200N（向左），馬前進看馬的合力。',
        example: {
          q: '馬拉車 500N、車受摩擦 300N，車的合力？車拉馬多大？馬為何也前進？',
          steps: ['車合力 \\(500-300=200\\) N 向前，加速。', '車拉馬仍是 500N；地面推馬更大，所以馬也前進。'],
          ans: '200N；500N；地面推馬更大'
        }
      }

    ]
  });
})();
