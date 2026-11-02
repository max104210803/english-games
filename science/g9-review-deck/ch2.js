/* ============ 第 2 章　功與能 ============
   節次：3-1 功與功率、3-2 動能位能與守恆、3-3 槓桿與靜力平衡、3-4 簡單機械
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：動量與衝量、角動量、轉動慣量、簡諧運動、微積分、
     電能與熱能定量計算（另章處理）。
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
    title: '功與能',
    color: C,
    sections: ['3-1 功與功率', '3-2 動能位能與守恆', '3-3 槓桿與靜力平衡', '3-4 簡單機械'],
    slides: [

      /* ---------- 3-1 功與功率 ---------- */
      {
        sec: '3-1', secName: '功與功率',
        title: '力推著物體走才算作功：舉著不動再痠也是零',
        points: [
          '功＝力<span class="k">沿力方向</span>移動的距離：\\(W＝F×S\\)。',
          '單位焦耳：1 J 就是 1 N 的力推 1 m。',
          '舉重物站著不動、推牆推不動：有力無移動，功是零。'
        ],
        formula: { label: '作功', tex: 'W=F\\times S' },
        visual: (h) => {
          let s = BOX(25, 45, 190, 175, { fill: '#eef7f2', stroke: GRN });
          s += TX(120, 75, '物體帳', { fs: 17, c: GRN, anchor: 'middle' });
          s += TX(120, 105, '動能變化：0', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(120, 130, '位能變化：0', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(120, 160, '拿到 0 J', { fs: 16, c: GRN, anchor: 'middle' });
          s += TX(120, 187, '作功 ＝ 0', { fs: 16, c: GRN, anchor: 'middle' });
          s += BOX(225, 45, 190, 175, { fill: '#fdeef2', stroke: RED });
          s += TX(320, 75, '人體帳', { fs: 17, c: RED, anchor: 'middle' });
          s += TX(320, 105, '化學能：減少', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(320, 130, '熱能：散掉', { fs: 14, c: '#172033', anchor: 'middle' });
          s += TX(320, 160, '人會累、流汗', { fs: 16, c: RED, anchor: 'middle' });
          s += TX(320, 187, '沒交給物體', { fs: 16, c: RED, anchor: 'middle' });
          s += TX(220, 255, '能量是存量，功是轉移量', { fs: 16, c: VIO, anchor: 'middle' });
          s += TX(220, 278, '物理只問：物體拿到多少', { fs: 14, c: '#64748b', anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '三種零功都要認得；人會累是體內能量變熱散掉，沒交給物體。',
        example: {
          q: '把 50 kgw 箱子等速搬到 3 m 高（g 取 10），花 30 秒，求功與功率。',
          steps: ['\\(W=50 \\times 10 \\times 3=1500\\) J。', '\\(P=1500 \\div 30=50\\) W。'],
          ans: '\\(1500\\) J；\\(50\\) W'
        }
      },
      {
        sec: '3-1', secName: '功與功率',
        title: '斜著拉只有分力作功：夾角 60 度時水平分力剩一半',
        points: [
          '斜拉時只有<span class="k">沿移動方向的分力</span>有作功。',
          '拖滑桿：夾角越大，水平分力越小，作功越少。',
          '問自己：夾角幾度時，拉力完全不作功？'
        ],
        formula: { label: '斜拉', tex: 'W=F_{水平}\\times S' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>拉力與水平夾角 ＝ <span class="ival" id="av">60</span> 度（拉力 40 N）</label>
            <input type="range" id="as" min="0" max="90" step="30" value="60"></div></div>`;
          const frac = { 0: '40（全部）', 30: '約 35', 60: '20（一半）', 90: '0（垂直）' };
          const ysub = { 0: '夾角 0 度：繩子全在水平方向', 30: '30 度時水平邊是長股，約 35 N', 60: '60 度時水平邊是短股＝斜邊一半', 90: '90 度垂直：和提水桶走路一樣' };
          const yv = { 0: '0', 30: '約 35', 60: '約 35', 90: '40（全部）' };
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            const r = a * Math.PI / 180;
            const px = Math.round(130 + 120 * Math.cos(r)), py = Math.round(205 - 120 * Math.sin(r));
            const H = px - 130, V = 205 - py;
            let s = TX(220, 36, '水平分力 ＝ ' + frac[a] + ' N', { fs: 25, c: VIO, anchor: 'middle' });
            s += TX(220, 60, ysub[a], { fs: 13.5, c: '#172033', anchor: 'middle' });
            s += SV.seg(30, 255, 410, 255, '#94a3b8', 2);
            s += BOX(60, 205, 70, 50, { fill: '#fff', stroke: '#94a3b8' });
            s += TX(95, 233, '箱子', { fs: 13, c: '#64748b', anchor: 'middle' });
            const ux = (px - 130) / 120, uy = (py - 205) / 120;
            const bx = px - 14 * ux, by = py - 14 * uy, wx = -uy * 5, wy = ux * 5;
            s += SV.seg(130, 205, px, py, BLU, 4) + `<polygon points="${px},${py} ${Math.round(bx + wx)},${Math.round(by + wy)} ${Math.round(bx - wx)},${Math.round(by - wy)}" fill="${BLU}"/>`;
            s += TX(Math.round((130 + px) / 2) + 12, Math.round((205 + py) / 2) - 12, '拉力 40 N', { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(150, 192, a + '°', { fs: 13, c: BLU, anchor: 'middle' });
            if (H >= 2) {
              s += SV.seg(130, 205, px, 205, GRN, 4) + `<polygon points="${px},205 ${px - 12},199 ${px - 12},211" fill="${GRN}"/>`;
              s += TX(Math.max(165, Math.round((130 + px) / 2)), 224, '水平 ' + frac[a], { fs: 13, c: GRN, anchor: 'middle' });
            } else {
              s += TX(165, 224, '水平 0 N', { fs: 13, c: GRN, anchor: 'middle' });
            }
            if (V >= 2) {
              s += SV.seg(px, 205, px, py, RED, 3, '6 4');
              s += TX(px + 10, Math.round((205 + py) / 2), '鉛直 ' + yv[a], { fs: 13, c: RED });
            }
            if (H >= 8 && V >= 8) {
              s += SV.seg(px - 9, 205, px - 9, 196, GRN, 2) + SV.seg(px - 9, 196, px, 196, GRN, 2);
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '繩子是斜邊：60 度時水平邊是短股，恰為斜邊一半；拖滑桿看三角形跟著變。',
        example: {
          q: '40 N 拉力與水平夾 60 度拉箱子走 5 m，作功多少？',
          steps: ['水平分力是拉力的一半：20 N。', '\\(W=20 \\times 5=100\\) J。'],
          ans: '\\(100\\) J'
        }
      },
      {
        sec: '3-1', secName: '功與功率',
        title: '功率是作功的快慢：同樣的功，越快完成功率越大',
        points: [
          '大寫 W 有兩種身分：式子裡是<span class="k">功</span>，數字尾巴是<span class="k">瓦特</span>。',
          '\\(P＝W÷t\\) 的 W 是功；「60 W」的 W 是單位，念瓦特。',
          '等速移動也可用 \\(P＝F×v\\) 直接算，避開 W。',
          '功率大不代表功多：總功還要乘上時間。'
        ],
        formula: { label: '功率 P', tex: 'P=\\frac{W_{功}}{t}=F\\times v' },
        visual: (h) => {
          let s = BOX(30, 60, 170, 150, { fill: 'rgba(5,150,105,.08)', stroke: GRN });
          s += TX(115, 95, '30 N 推車', { fs: 15, c: GRN, anchor: 'middle' });
          s += TX(115, 125, '2 m/s 等速', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(115, 160, 'P＝60 W', { fs: 17, c: GRN, anchor: 'middle' });
          s += BOX(240, 60, 170, 150, { fill: 'rgba(225,29,72,.06)', stroke: RED });
          s += TX(325, 95, '1000 J/分', { fs: 15, c: RED, anchor: 'middle' });
          s += TX(325, 125, '約 16.7 W', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(325, 160, '輸 80 W', { fs: 17, c: RED, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 260', s);
        },
        caption: '功是搬了多少磚，功率是搬多快：1000J花100秒（10W）輸給800J花10秒（80W）。',
        example: {
          q: '30 N 推力讓推車等速 2 m/s 前進，功率多少？',
          steps: ['等速可用 \\(P=F \\times v\\)。', '\\(P=30 \\times 2=60\\) W，尾巴的 W 念瓦特。'],
          ans: '\\(60\\) W'
        }
      },
      {
        sec: '3-1', secName: '功與功率',
        title: '功比總量、功率比快慢：烏龜功多，兔子功率大',
        points: [
          '功是<span class="k">總量</span>：搬了幾塊磚、幾焦耳；功率是<span class="k">快慢</span>：每秒幾焦耳。',
          '烏龜一天搬 10000J，兔子 1 秒搬 100J：龜功多、兔功率大。',
          '電費收總量（度），冷氣噸數、車馬力比快慢。',
          '比快慢先換「每秒」：1000J/分是 16.7W，輸給 80W。'
        ],
        formula: { label: '總量快慢', tex: 'P=\\frac{W}{t},\\;W_{總}=P\\times t' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '烏龜功', tex: '10000J', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20, note: '一天搬的，總量大' },
            { label: '兔子功率', tex: '100W', color: VIO, fill: '#f1eafe', border: VIO, size: 20, note: '每秒 100J，快慢大' },
            { label: '電費單', tex: 'kWh', color: AMB, fill: '#fdf6e8', border: '#e8d5a8', size: 20, note: '收總量（度），不是快慢' }
          ]);
        },
        caption: '龜兔各贏一邊：比總量看焦耳，比快慢看瓦特。',
        example: {
          q: '小明搬 1000J 花 100 秒，小華搬 800J 花 10 秒，誰功多？誰功率大？',
          steps: ['功：1000＞800，小明多。', '功率：\\(1000 \\div 100=10\\)W＜\\(800 \\div 10=80\\)W，小華大。'],
          ans: '小明功多；小華功率大'
        }
      },
      {
        sec: '3-1', secName: '功與功率',
        title: '功與功率五個坑：有力有功、提桶作功、大就多、斜拉全算',
        points: [
          '有力<span class="k">沿方向移動</span>才有功；垂直一律零。',
          '比功率先換每秒；斜拉只算水平分力。',
          'kgw 先換牛頓再乘距離，不然單位全錯。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['有用力就有作功', '沿力的方向有移動才算'],
            ['提水桶水平走也在作功', '力與位移垂直，功為零'],
            ['功率越大作功越多', '功率是快慢；總功要乘時間'],
            ['斜拉直接用拉力乘距離', '只用沿移動方向的分力'],
            ['kgw 直接乘距離當焦耳', '先換牛頓（乘 9.8 或 10）'],
            ['看到 W 就當成功', '式子裡的 W 是功；數字尾巴的 W 是瓦特']
          ]);
        },
        caption: '考前看這頁：看方向、換每秒、取分力、換牛頓。',
        example: {
          q: '提 10 kgw 水桶在水平地面走 20 m，手對水桶作功多少？（會考 111 補考同型）',
          steps: ['手的力向上，移動方向水平。', '互相垂直，作功為 0。'],
          ans: '\\(0\\) J'
        }
      },

      /* ---------- 3-2 動能位能 ---------- */
      {
        sec: '3-2', secName: '動能位能與守恆',
        title: '速率 2 倍動能 4 倍：動能看的是速率平方',
        points: [
          '動能 \\(K＝½mv²\\)：質量 2 倍變 2 倍，<span class="k">速率 2 倍變 4 倍</span>。',
          '只看快慢不看方向；靜止的物體動能為零。',
          '拖滑桿：速率拉高一點，動能衝很快。'
        ],
        formula: { label: '動能', tex: 'K=\\frac{1}{2}mv^{2}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>速率 v ＝ <span class="ival" id="vv">3</span> m/s（質量 2 kg）</label>
            <input type="range" id="vs" min="1" max="6" step="1" value="3"></div></div>`;
          const draw = () => {
            const v = +h.querySelector('#vs').value;
            h.querySelector('#vv').textContent = v;
            const k = 0.5 * 2 * v * v, cs = 22, gx = 280, gy = 40;
            let s = TX(220, 26, 'K ＝ ½ × 2 × ' + v + '² ＝ ' + k + ' J', { fs: 22, c: VIO, anchor: 'middle' });
            // 左：小車與速度箭頭（箭頭長度和 v 成正比）
            s += BOX(20, 80, 70, 40, { fill: 'rgba(37,99,235,.15)', stroke: BLU, r: 6 });
            s += TX(55, 106, '2 kg', { fs: 13, c: BLU, anchor: 'middle' });
            s += `<circle cx="38" cy="126" r="7" fill="#64748b"/><circle cx="72" cy="126" r="7" fill="#64748b"/>`;
            s += SV.seg(10, 133, 262, 133, '#94a3b8', 2);
            s += ARW(95, 100, 95 + 26 * v, 100, BLU, 4);
            s += TX(95 + 13 * v, 88, 'v ＝ ' + v, { fs: 13, c: BLU, anchor: 'middle' });
            // 右：v × v 方格，每格 1 J（質量 2 kg 時 K ＝ v²）
            for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
              const on = i < v && j < v;
              s += `<rect x="${gx + j * cs}" y="${gy + i * cs}" width="${cs - 2}" height="${cs - 2}" rx="3" fill="${on ? 'rgba(124,58,237,.55)' : 'rgba(148,163,184,.12)'}" stroke="${on ? VIO : '#e2e8f0'}"/>`;
            }
            s += TX(gx + 3 * cs, gy + 6 * cs + 22, v + ' × ' + v + ' ＝ ' + k + ' 格（1 格 1 J）', { fs: 13, c: VIO, anchor: 'middle' });
            s += TX(220, 232, v === 6 ? '速率 2 倍（3→6），方格 4 倍（9→36）' : '速率變幾倍，方格的邊就變幾倍：面積是平方', { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 245', s);
          };
          h.querySelector('#vs').oninput = draw; draw();
        },
        caption: 'v＝3 時 9 J，拖到 v＝6 變 36 J：剛好 4 倍。',
        example: {
          q: '2 kg 球以 3 m/s 運動，動能多少？速率變 6 m/s 後是幾倍？',
          steps: ['\\(K=0.5 \\times 2 \\times 9=9\\) J。', '6 m/s 時 \\(K=36\\) J，是原來 4 倍。'],
          ans: '\\(9\\) J；\\(4\\) 倍'
        }
      },
      {
        sec: '3-2', secName: '動能位能與守恆',
        title: '舉越高存越多：重力位能就是重量乘高度',
        points: [
          '重力位能 \\(U＝mgh\\)：<span class="k">重量乘高度</span>，先選基準面。',
          '彈性位能看形變：壓縮拉長越大，存越多。',
          '1 kg 球從 5 m 落下：50 J 位能全變動能，落地 10 m/s。'
        ],
        formula: { label: '位能', tex: 'U=mgh,\\;E=K+U' },
        visual: (h) => {
          let s = BOX(60, 40, 120, 40, { fill: 'rgba(124,58,237,.10)', stroke: VIO });
          s += TX(120, 67, '5 m 高', { fs: 14, c: VIO, anchor: 'middle' });
          s += SV.seg(120, 80, 120, 200, '#94a3b8', 2, '5 4');
          s += BOX(80, 200, 80, 40, { fill: 'rgba(5,150,105,.10)', stroke: GRN });
          s += TX(120, 227, '地面', { fs: 14, c: GRN, anchor: 'middle' });
          s += TX(280, 100, 'U＝50 J', { fs: 17, c: VIO, anchor: 'middle' });
          s += TX(280, 135, '落下變 K', { fs: 15, c: '#172033', anchor: 'middle' });
          s += TX(280, 170, '落地 10 m/s', { fs: 17, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 280', s);
        },
        caption: '不計阻力：50 J 位能全部換成動能，速率只由高度決定。',
        example: {
          q: '1 kg 球從 5 m 高自由落下（g 取 10，不計阻力），落地速率多少？',
          steps: ['位能 \\(=1 \\times 10 \\times 5=50\\) J。', '\\(0.5 \\times v^{2}=50\\)，得 \\(v=10\\) m/s。'],
          ans: '\\(10\\) m/s'
        }
      },
      {
        sec: '3-2', secName: '動能位能與守恆',
        title: '不計阻力總和不變：少掉的力學能都變成了熱',
        points: [
          '力學能＝動能加位能；<span class="k">不計阻力時總和不變</span>。',
          '同高度沿不同光滑路徑滑下：到底速率相同，只看高度。',
          '拖滑桿看三步：落下、上拋、單擺都是同一招。'
        ],
        visual: (h) => {
          SV.stepper(h, '0 0 440 300', [
            { t: '第 1 步：自由落下，位能換動能，越掉越快', d: k => SV.seg(110, 60, 110, 240, BLU, 3) + SV.dot(110, 200, RED, 6) + SV.vlabel(110, 270, 'U 變 K') },
            { t: '第 2 步：上拋，動能換位能，最高點瞬間靜止', d: k => SV.seg(220, 240, 220, 60, AMB, 3) + SV.dot(220, 80, RED, 6) + SV.vlabel(220, 270, 'K 變 U') },
            { t: '第 3 步：有摩擦時少掉的力學能變成熱與聲', d: k => TX(330, 160, '皮球越彈越低', { fs: 14, c: RED, anchor: 'middle' }) + TX(330, 190, '煞車片發燙', { fs: 14, c: RED, anchor: 'middle' }) }
          ]);
        },
        caption: '無阻力看守恆，有阻力看總能量：皮球彈不高是變熱了。',
        example: {
          q: '115 會考：想讓水滴以不同速度撞石英板，最合理的做法？',
          steps: ['撞擊速率只由落下高度決定。', '調整針頭高度，改變垂直落距。'],
          ans: '調整針頭高度'
        }
      },
      {
        sec: '3-2', secName: '動能位能與守恆',
        title: '動能等於位能只在一半高度：時間過一半才落四分之一',
        points: [
          '從高 h 靜止落下：離地幾分之幾 h，<span class="k">位能就佔幾分之幾</span>，剩下是動能。',
          '<span class="k">只有離地 ½h</span> 時動能＝位能；「位能是動能一半」是離地 ⅓h。',
          '陷阱：落下時間過一半只落了 ¼h，動能只有 ¼；相等要等到約 0.71 倍時間。'
        ],
        formula: { label: '比例', tex: 'U:E_k=y:(h-y)' },
        visual: (h) => {
          const Y = [[8, 8], [7, 8], [3, 4], [2, 3], [1, 2], [2, 5], [1, 3], [1, 4], [0, 1]];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>離地高度 ＝ <span class="ival" id="yv">h</span></label>
            <input type="range" id="ys" min="0" max="8" step="1" value="0"></div></div>`;
          const gcd = (a, b) => (b ? gcd(b, a % b) : a);
          const draw = () => {
            const [n, d] = Y[+h.querySelector('#ys').value];
            const y = n / d;
            const fr = (p, q) => (p === 0 ? '0' : p === q ? '1' : p + '/' + q);
            h.querySelector('#yv').textContent = n === d ? 'h' : n === 0 ? '0（地面）' : fr(n, d) + ' h';
            const W = 220, x0 = 200, gy = 200, top = 34, cx = 70;
            // 左：落下的球（高度依實際比例）
            let s = SV.seg(20, gy, 140, gy, '#64748b', 3);
            s += SV.seg(cx, top, cx, gy, '#cbd5e1', 2, '4 3');
            s += SV.seg(cx - 12, top, cx + 12, top, '#64748b', 2) + TX(cx + 18, top + 5, 'h', { fs: 13, c: '#64748b' });
            s += SV.seg(cx - 8, (top + gy) / 2, cx + 8, (top + gy) / 2, RED, 2) + TX(cx + 14, (top + gy) / 2 + 5, '½h', { fs: 13, c: RED });
            const by = gy - (gy - top) * y;
            s += `<circle cx="${cx}" cy="${by - 10}" r="10" fill="${VIO}" stroke="#fff" stroke-width="2"/>`;
            s += TX(cx, gy + 20, '地面', { fs: 12, c: '#64748b', anchor: 'middle' });
            // 右：位能、動能長條
            s += TX(x0, 36, '位能 U', { fs: 14, c: BLU });
            s += BOX(x0, 44, W, 26, { fill: 'rgba(148,163,184,.12)', stroke: '#cbd5e1' });
            if (y > 0) s += BOX(x0, 44, W * y, 26, { fill: BLU, stroke: BLU });
            s += TX(x0, 100, '動能 Ek', { fs: 14, c: AMB });
            s += BOX(x0, 108, W, 26, { fill: 'rgba(148,163,184,.12)', stroke: '#cbd5e1' });
            if (y < 1) s += BOX(x0, 108, W * (1 - y), 26, { fill: AMB, stroke: AMB });
            s += SV.seg(x0 + W / 2, 40, x0 + W / 2, 142, RED, 2, '5 4');
            s += TX(x0 + W / 2, 158, '一半', { fs: 12, c: RED, anchor: 'middle' });
            let ratio;
            if (n === 0) ratio = 'Ek ＝ mgh，U ＝ 0';
            else if (n === d) ratio = 'U ＝ mgh，Ek ＝ 0';
            else { const a = d - n, b = n, g = gcd(a, b); ratio = 'Ek : U ＝ ' + a / g + ' : ' + b / g; }
            s += TX(x0 + W / 2, 190, ratio, { fs: 20, c: VIO, anchor: 'middle' });
            const msg = n * 2 === d ? '剛好一半高度：動能＝位能！'
              : n * 3 === d ? '位能是動能的一半：離地 ⅓h，不是一半高度'
                : n * 4 === d ? '這裡是落下時間過一半的位置（只落了 ¼h）' : '只有一半高度兩者才相等';
            s += TX(220, 236, msg, { fs: 13, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 248', s);
          };
          h.querySelector('#ys').oninput = draw; draw();
        },
        caption: '拖到 ½h 兩條一樣長；拖到 ⅓h 位能剛好是動能的一半。',
        example: {
          q: '5 kg 物體從 30 m 高自由落下，位能為動能一半時離地多高？',
          steps: ['\\(U:E_k=1:2\\)，位能佔總力學能的 \\(\\frac{1}{3}\\)。', '離地高度 \\(=30 \\times \\frac{1}{3}=10\\) m。'],
          ans: '\\(10\\) m'
        }
      },
      {
        sec: '3-2', secName: '動能位能與守恆',
        title: '能量五個坑：正比、消失、彈不高、陡就快、圖都拋物線',
        points: [
          '動能和速率<span class="k">平方</span>成正比；消失的能量變成熱。',
          '光滑斜面只看高度；K 對時間拋物線、對高度直線。',
          '同樣的力推同樣距離，換小質量動能也不變（會考 113）。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['動能與速率成正比', '與速率的平方成正比'],
            ['皮球彈不回原高度，能量不守恆', '總能量守恆；力學能變熱與聲'],
            ['斜面越陡滑到底越快', '光滑時只看高度'],
            ['K-t 與 K-h 圖都是拋物線', '對時間拋物線，對高度是直線']
          ]);
        },
        caption: '考前看這頁：平方、變熱、看高度、t 拋 h 直。',
        example: {
          q: '同樣的 F 推同樣距離 S，想讓動能變 2 倍，改用一半質量可以嗎？（會考 113）',
          steps: ['F、S 不變則作功不變。', '轉成的動能不變，只換質量沒用。'],
          ans: '不行'
        }
      },

      /* ---------- 3-3 槓桿 ---------- */
      {
        sec: '3-3', secName: '槓桿與靜力平衡',
        title: '握越遠越省力：同樣的力矩，力臂長就輕鬆',
        points: [
          '力矩＝力<span class="k">乘力臂</span>：力臂是支點到作用線的垂直距離。',
          '拖滑桿：20 N 握在 0.5 m 處有 10 N·m；握 0.25 m 要 40 N。',
          '問自己：推門推哪裡最省力？為什麼門軸上推不動？'
        ],
        formula: { label: '力矩', tex: 'M=F\\times d' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>握柄位置距螺帽 ＝ <span class="ival" id="dv">0.5</span> m（要 10 N·m）</label>
            <input type="range" id="ds" min="1" max="4" step="1" value="2"></div></div>`;
          const pos = { 1: '0.25', 2: '0.5', 3: '0.75', 4: '1.0' };
          const draw = () => {
            const k = +h.querySelector('#ds').value, d = pos[k], dn = parseFloat(d), need = Math.round(10 / dn);
            h.querySelector('#dv').textContent = d;
            const ox = 60, oy = 120, U = 320, gx = ox + U * dn;
            let s = TX(220, 26, '需施力 ' + need + ' N', { fs: 22, c: VIO, anchor: 'middle' });
            // 力臂：轉軸到施力作用線的距離
            s += SV.seg(ox, 66, gx, 66, BLU, 2.5) + SV.seg(ox, 58, ox, 74, BLU, 2.5) + SV.seg(gx, 58, gx, 74, BLU, 2.5);
            s += TX((ox + gx) / 2, 54, '力臂 d ＝ ' + d + ' m', { fs: 13, c: BLU, anchor: 'middle' });
            s += SV.seg(gx, 74, gx, 106, '#94a3b8', 1.5, '4 3');
            // 扳手柄（1 m 畫成 320 px）
            s += `<rect x="${ox}" y="${oy - 10}" width="${U + 12}" height="20" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>`;
            [0.25, 0.5, 0.75, 1].forEach(m => { const x = ox + U * m; s += SV.seg(x, oy - 10, x, oy - 2, '#64748b', 2); });
            // 螺帽＝轉軸
            const hex = [0, 1, 2, 3, 4, 5].map(i => [ox + 24 * Math.cos(Math.PI / 3 * i), oy + 24 * Math.sin(Math.PI / 3 * i)]);
            s += SV.poly(hex, '#94a3b8', '#334155', 2.5) + SV.dot(ox, oy, '#172033', 4);
            s += TX(ox, oy + 44, '螺帽（轉軸）', { fs: 12, c: '#334155', anchor: 'middle' });
            // 手握的位置與施力（箭頭長度和力成正比）
            s += `<circle cx="${gx}" cy="${oy}" r="9" fill="${VIO}" stroke="#fff" stroke-width="2"/>`;
            s += ARW(gx, oy + 12, gx, oy + 12 + need * 2.2, RED, 4);
            s += TX(gx + (dn > 0.8 ? -12 : 12), oy + 18 + need * 1.1, 'F ＝ ' + need + ' N', { fs: 14, c: RED, anchor: dn > 0.8 ? 'end' : 'start' });
            s += TX(220, 252, '力矩 ＝ ' + need + ' × ' + d + ' ＝ 10 N·m（不變）', { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 264', s);
          };
          h.querySelector('#ds').oninput = draw; draw();
        },
        caption: '握 1 m 只要 10 N，握 0.25 m 要 40 N：力臂差 4 倍。',
        example: {
          q: '20 N 垂直作用在距螺帽 0.5 m 的扳手末端，力矩多少？改握 0.25 m 呢？',
          steps: ['\\(20 \\times 0.5=10\\) N·m。', '同力矩下 \\(10 \\div 0.25=40\\) N。'],
          ans: '\\(10\\) N·m；\\(40\\) N'
        }
      },
      {
        sec: '3-3', secName: '槓桿與靜力平衡',
        title: '順時針等於逆時針：槓桿平衡只認力乘力臂',
        points: [
          '平衡條件：<span class="k">順時針力矩總和等於逆時針</span>。',
          '施力臂長是省力（開瓶器），短是費力（筷子），等長是天平。',
          '靜止要兩個條件：合力零加上<span class="k">合力矩零</span>。'
        ],
        formula: { label: '槓桿平衡', tex: 'F_{1}\\times d_{1}=F_{2}\\times d_{2}' },
        visual: (h) => {
          let s = SV.seg(40, 200, 400, 200, '#64748b', 4);
          s += SV.poly([[220, 200], [205, 250], [235, 250]], 'rgba(100,116,139,.25)', '#64748b', 2);
          s += TX(220, 272, '支點', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += SV.seg(220, 200, 100, 200, BLU, 4) + SV.dot(100, 200, BLU, 6);
          s += TX(100, 178, '40 gw', { fs: 14, c: BLU, anchor: 'middle' });
          s += TX(160, 218, '30 cm', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += SV.seg(220, 200, 320, 200, RED, 4) + SV.dot(320, 200, RED, 6);
          s += TX(320, 178, '60 gw', { fs: 14, c: RED, anchor: 'middle' });
          s += TX(270, 218, '20 cm', { fs: 13, c: '#64748b', anchor: 'middle' });
          s += TX(220, 120, '40×30＝60×20', { fs: 17, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 300', s);
        },
        caption: '左 40 gw 配 30 cm，右 20 cm 要掛 60 gw：兩邊力矩都是 1200。',
        example: {
          q: '支點中央，左 30 cm 掛 40 gw，右 20 cm 掛多重才平衡？兩邊各外移 1 cm 哪邊沉？',
          steps: ['\\(40 \\times 30 \\div 20=60\\) gw。', '左 \\(2 \\times 7=14\\)、右 \\(3 \\times 5=15\\)，右沉。'],
          ans: '\\(60\\) gw；右側下沉'
        }
      },
      {
        sec: '3-3', secName: '槓桿與靜力平衡',
        title: '槓桿五個坑：力臂定義、轉向、相同質量、省功、零合力',
        points: [
          '力臂是到<span class="k">作用線</span>的垂直距離；轉向看順逆時針。',
          '相同質量還要相同距離才平衡（115 會考 22）。',
          '省力必費距離；合力零還要合力矩零才靜止。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['力臂是支點到施力點的距離', '是到作用線的垂直距離'],
            ['支點兩側力反向就抵消', '要看轉向：左上推右下壓都是順時針'],
            ['兩側掛相同質量就平衡', '還要距離相同：重量乘距離'],
            ['省力槓桿也能省功', '省力必費距離，不省功'],
            ['合力為零就不會轉', '還要合力矩為零']
          ]);
        },
        caption: '考前看這頁：找垂直距離、看轉向、乘完再比。',
        example: {
          q: '115 會考 22：支點兩側掛相同質量，槓桿一定平衡嗎？',
          steps: ['平衡要看重量乘距離。', '只有質量相同不夠，還要距離相同。'],
          ans: '不一定'
        }
      },

      /* ---------- 3-4 簡單機械 ---------- */
      {
        sec: '3-4', secName: '簡單機械',
        title: '沒有機械能省功：省力一定費距離',
        points: [
          '不計摩擦與機械重時，施力乘距離等於<span class="k">物重乘距離</span>，兩邊功相等。',
          '定滑輪只<span class="k">改變方向</span>：\\(F＝W\\)。',
          '動滑輪 <span class="k">2F＝W＋滑輪重</span>；不計滑輪重才省一半力，繩拉 2 倍長。',
          '滑輪組數吊住動滑輪的繩段數 n：\\(F＝W÷n\\)（不計滑輪重）。'
        ],
        formula: { label: '功的原理', tex: 'F\\times S_{F}=W\\times S_{W}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '定滑輪', tex: 'F=W', color: BLU, fill: '#eef4ff', border: BLU, size: 20, note: '只改方向，如升旗' },
            { label: '動滑輪', tex: '2F=W+W_{\\text{輪}}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 20, note: '不計輪重才 F＝W÷2' },
            { label: '滑輪組', tex: 'F=W\\div n', color: VIO, fill: '#f1eafe', border: VIO, size: 20, note: 'n 是吊住動滑輪段數' }
          ]);
        },
        caption: '不計滑輪重：60 kgw 吊高 2 m，動滑輪用 30 kgw 拉 4 m，兩邊都是 1200 J。',
        example: {
          q: '用動滑輪把 60 kgw 重物吊高 2 m（不計滑輪重與摩擦，g 取 10），施力、拉繩長與兩邊功各多少？若動滑輪重 4 kgw 呢？',
          steps: ['不計滑輪重：\\(F=60 \\div 2=30\\) kgw，拉 \\(2 \\times 2=4\\) m。', '兩邊功都是 1200 J，沒有省功。', '動滑輪重 4 kgw：\\(2F=60+4\\)，\\(F=32\\) kgw（114 會考 48 同理）。'],
          ans: '30 kgw；4 m；一樣多；有輪重時 32 kgw'
        }
      },
      {
        sec: '3-4', secName: '簡單機械',
        title: '輪軸斜面都是槓桿親戚：半徑比就是施力比',
        points: [
          '輪軸：力施大輪省力，<span class="k">\\(F×輪半徑＝W×軸半徑\\)</span>。',
          '斜面：越緩越省力，\\(F×斜面長＝W×高\\)。',
          '拖滑桿：軸半徑越小，施力越小，繩要在轉軸兩側。'
        ],
        formula: { label: '輪軸斜面', tex: 'F\\times R=W\\times r,\\;F\\times L=W\\times h' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>軸半徑 r ＝ <span class="ival" id="wv2">5</span> cm（輪 30 cm、重物 60 kgw）</label>
            <input type="range" id="ws2" min="2" max="10" step="1" value="5"></div></div>`;
          const draw = () => {
            const r = +h.querySelector('#ws2').value;
            h.querySelector('#wv2').textContent = r;
            const f = Math.round(60 * r / 30), cx = 120, cy = 95, k = 2.6, R = 30 * k, ra = r * k;
            // 輪與軸（同一個中心，依實際半徑比例）
            let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="rgba(124,58,237,.06)" stroke="${VIO}" stroke-width="3"/>`;
            s += `<circle cx="${cx}" cy="${cy}" r="${ra}" fill="rgba(217,119,6,.28)" stroke="${AMB}" stroke-width="3"/>`;
            s += SV.seg(cx, cy, cx + R, cy, VIO, 2.5) + SV.seg(cx, cy, cx - ra, cy, AMB, 2.5) + SV.dot(cx, cy, '#172033', 4);
            // 重物掛在軸的左側，施力拉在輪的右側
            s += SV.seg(cx - ra, cy, cx - ra, 205, '#334155', 2);
            s += BOX(cx - ra - 28, 205, 56, 30, { fill: 'rgba(100,116,139,.30)', stroke: '#475569', r: 5 });
            s += TX(cx - ra, 225, '60 kgw', { fs: 12, c: '#172033', anchor: 'middle' });
            s += SV.seg(cx + R, cy, cx + R, cy + 12, '#334155', 2);
            s += ARW(cx + R, cy + 12, cx + R, cy + 12 + f * 4, RED, 4);
            s += TX(cx + R + 10, cy + 18 + f * 2, 'F', { fs: 15, c: RED });
            // 右側說明
            s += TX(335, 52, 'F × 輪半徑 ＝ W × 軸半徑', { fs: 13, c: '#172033', anchor: 'middle' });
            s += TX(335, 82, 'F × 30 ＝ 60 × ' + r, { fs: 15, c: '#172033', anchor: 'middle' });
            s += TX(335, 124, 'F ＝ ' + f + ' kgw', { fs: 24, c: RED, anchor: 'middle' });
            s += TX(335, 166, '紫：輪半徑 30 cm', { fs: 13, c: VIO, anchor: 'middle' });
            s += TX(335, 188, '橘：軸半徑 ' + r + ' cm', { fs: 13, c: AMB, anchor: 'middle' });
            s += TX(335, 222, r === 5 ? '課本情境：30 配 5，施力 10' : '軸越小越省力，但繩要拉更長', { fs: 12, c: '#64748b', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 245', s);
          };
          h.querySelector('#ws2').oninput = draw; draw();
        },
        caption: 'r＝5 時施力 10 kgw；拖到 r＝2 只要 4 kgw。斜面同理：5 m 長 1 m 高推 50 kgw 只要 10 kgw。',
        example: {
          q: '輪 30 cm、軸 5 cm，軸掛 60 kgw，輪緣施力多少？斜面長 5 m 高 1 m 推 50 kgw 呢？',
          steps: ['\\(F \\times 30=60 \\times 5\\)，得 10 kgw。', '\\(F \\times 5=50 \\times 1\\)，得 10 kgw。'],
          ans: '都是 \\(10\\) kgw'
        }
      },
      {
        sec: '3-4', secName: '簡單機械',
        title: '機械七個坑：省功、定滑輪、輪重、數滑輪、起子釘子、陡緩',
        points: [
          '沒有機械能省功；定滑輪<span class="k">只改方向</span>。',
          '動滑輪要把<span class="k">滑輪重</span>算進去；數吊住動滑輪的段數；力施輪才省力。',
          '起子是輪軸、螺絲釘是斜面；斜面越緩越省力。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['簡單機械省力又省功', '沒有機械能省功'],
            ['定滑輪可以省力', '只能改變方向'],
            ['動滑輪拉力一定是物重一半', '不計滑輪重才是一半；否則 2F＝W＋滑輪重'],
            ['滑輪組看總滑輪數', '數吊住動滑輪的繩段數'],
            ['輪軸有大輪就省力', '力要施在大輪（重物在軸）'],
            ['螺絲起子是斜面', '起子是輪軸；螺絲釘才是斜面'],
            ['斜面越陡越省力', '越緩（越長）越省力']
          ]);
        },
        caption: '考前看這頁：不省功、只改向、算輪重、數段數、看施力邊、緩才省。',
        example: {
          q: '會考 109：輪軸省力抬重物，重物掛哪、手拉哪、兩繩要在轉軸哪側？',
          steps: ['重物掛軸、手拉輪才省力。', '兩繩在轉軸兩側，拉下才能捲起上升。'],
          ans: '掛軸拉輪；兩側'
        }
      }

    ]
  });
})();
