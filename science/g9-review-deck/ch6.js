/* ============ 第 6 章　珍惜常用的資源 ============
   節次：3-5 珍惜常用的資源（課本第 3 章最後一節：能源、發電、瓦斯、放射線與核反應、節約能源）
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：核反應的能量計算以外的原子物理、半衰期計算、輻射劑量單位、辛烷值細節、發電效率百分比。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#0891b2';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';
  const INK = '#172033', GRY = '#64748b';

  // 標準 SVG 包裝：一定要用這個，圖才會自適應欄寬
  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
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
    return `<div class="xo" style="width:97%;margin:0 auto;display:flex;flex-direction:column;gap:8px">` +
      rows.map(r => `<div style="display:flex;gap:8px;align-items:stretch">
        <div class="xo-bad" style="flex:1;background:#fdeef2;border:1.5px solid #f3c4d0;border-radius:12px;padding:7px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${RED};margin-bottom:2px">✗ 常見錯誤</div>
          <div class="xo-t" style="font-size:13.5px;color:#172033;line-height:1.55">${r[0]}</div></div>
        <div class="xo-good" style="flex:1;background:#eef7f2;border:1.5px solid #bfe0d1;border-radius:12px;padding:7px 11px">
          <div class="xo-h" style="font-size:11.5px;font-weight:900;color:${GRN};margin-bottom:2px">✓ 正確想法</div>
          <div class="xo-t" style="font-size:13.5px;color:#172033;line-height:1.55">${r[1]}</div></div>
      </div>`).join('') + `</div>`;
  }

  window.DECK.push({
    ch: 6,
    title: '珍惜常用的資源',
    color: C,
    sections: ['3-5 珍惜常用的資源'],
    slides: [
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '能源分兩類：用掉就沒有的非再生能源、會一直補回來的再生能源',
        points: [
          '<span class="k">非再生能源</span>：煤、石油、天然氣、鈾礦，存量有限，用掉就補不回來。',
          '<span class="k">再生能源</span>：太陽能、風力、水力、地熱、生質能，可以一直取得。',
          '石油不只是燃料，也是塑膠、合成纖維、醫藥等石化產品的原料。'
        ],
        visual: (h) => {
          const col = (x, title, fill, stroke, items) =>
            BOX(x, 40, 190, 220, { r: 16, fill, stroke, sw: 2 }) + TX(x + 95, 72, title, { fs: 17, c: stroke, anchor: 'middle' }) +
            items.map((it, i) => BOX(x + 18, 90 + i * 32, 154, 26, { r: 13, fill: '#fff', stroke }) + TX(x + 95, 108 + i * 32, it, { fs: 13, c: INK, anchor: 'middle' })).join('');
          h.innerHTML = svg('0 0 440 280',
            col(22, '非再生能源', '#fff1f2', RED, ['煤（主要是碳）', '石油', '天然氣（甲烷）', '鈾礦（核燃料）', '存量有限']) +
            col(228, '再生能源', '#ecfdf5', GRN, ['太陽能', '風力', '水力', '地熱', '生質能（沼氣）']));
        },
        caption: '火力發電燒化石燃料，會排放二氧化碳，也會造成酸雨、煤灰等空氣汙染。',
        example: {
          q: '鈾礦是核能發電的燃料，它屬於再生能源嗎？',
          steps: ['鈾礦是從地下開採的礦物，存量有限。', '用掉就補不回來 → 非再生能源。'],
          ans: '不是，屬於非再生能源'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '各種發電廠比一比：大多是想辦法讓發電機轉起來',
        points: [
          '火力、核能都是先把水<b>燒成蒸汽</b>推動渦輪；差別只在熱從哪裡來。',
          '水力、風力直接用流動的水或風轉動發電機。',
          '太陽能電池例外：<span class="k">光能直接變成電能</span>，不需要發電機。拖滑桿比較。'
        ],
        visual: (h) => {
          const P = [
            { n: '火力', c: ['化學能', '熱能', '動能', '電能'], re: false, gen: true, note: '燒煤、石油、天然氣' },
            { n: '核能', c: ['核能', '熱能', '動能', '電能'], re: false, gen: true, note: '鈾-235 核分裂放出熱' },
            { n: '水力', c: ['重力位能', '動能', '電能'], re: true, gen: true, note: '水從高處流下' },
            { n: '風力', c: ['動能', '電能'], re: true, gen: true, note: '風吹動葉片' },
            { n: '太陽能電池', c: ['光能', '電能'], re: true, gen: false, note: '照光就產生電流' }
          ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>發電方式：<span class="ival" id="pv">火力</span></label>
            <input type="range" id="ps" min="0" max="4" step="1" value="0"></div></div>`;
          const draw = () => {
            const k = P[+h.querySelector('#ps').value], n = k.c.length, w = 78, gap = (400 - n * w) / (n - 1);
            h.querySelector('#pv').textContent = k.n;
            let s = TX(220, 42, `${k.n}發電`, { fs: 20, c: C, anchor: 'middle' }) + TX(220, 66, k.note, { fs: 13, c: GRY, anchor: 'middle' });
            k.c.forEach((e, i) => {
              const x = 20 + i * (w + gap), last = i === n - 1;
              s += BOX(x, 100, w, 52, { r: 12, fill: last ? '#fef9c3' : '#ecfeff', stroke: last ? AMB : C, sw: 2 });
              s += TX(x + w / 2, 132, e, { fs: e.length > 3 ? 13 : 15, c: INK, anchor: 'middle' });
              if (!last) s += ARW(x + w + 4, 126, x + w + gap - 4, 126, GRY, 2.5);
            });
            s += BOX(40, 184, 170, 64, { r: 12, fill: k.gen ? '#eef2ff' : '#fff7ed', stroke: k.gen ? VIO : AMB });
            s += TX(125, 210, '用到發電機？', { fs: 13, c: GRY, anchor: 'middle' }) + TX(125, 236, k.gen ? '要 ✓' : '不用 ✗', { fs: 17, c: k.gen ? VIO : AMB, anchor: 'middle' });
            s += BOX(230, 184, 170, 64, { r: 12, fill: k.re ? '#ecfdf5' : '#fff1f2', stroke: k.re ? GRN : RED });
            s += TX(315, 210, '再生能源？', { fs: 13, c: GRY, anchor: 'middle' }) + TX(315, 236, k.re ? '是 ✓' : '不是 ✗', { fs: 17, c: k.re ? GRN : RED, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', s);
          };
          h.querySelector('#ps').oninput = draw; draw();
        },
        caption: '核能發電不是「燃燒」鈾，而是鈾-235 的原子核分裂，放出的熱把水燒成蒸汽。',
        example: {
          q: '核能發電和火力發電，能量轉換哪一步不同？',
          steps: ['兩者後段都是 熱能 → 動能 → 電能。', '熱的來源不同：核能來自核分裂，火力來自燃料燃燒的化學能。'],
          ans: '第一步不同：核能 vs. 化學能'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '瓦斯偵測器裝高還是低？看漏出來的瓦斯比空氣重還是輕',
        points: [
          '<span class="k">桶裝瓦斯</span>（液化石油氣）主要是丙烷、丁烷，比空氣<b>重</b> → 漏氣沉在下方，偵測器裝低處。',
          '<span class="k">天然氣</span>主要是甲烷，比空氣<b>輕</b> → 往上飄，偵測器裝高處。',
          '瓦斯本來無色無味，加了臭味劑才聞得到；不完全燃燒會產生有毒的一氧化碳。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>家裡用的是：<span class="ival" id="gv">桶裝瓦斯</span></label>
            <input type="range" id="gs" min="0" max="1" step="1" value="0"></div></div>`;
          const draw = () => {
            const lpg = +h.querySelector('#gs').value === 0;
            h.querySelector('#gv').textContent = lpg ? '桶裝瓦斯' : '天然氣';
            let s = BOX(40, 30, 360, 230, { r: 6, fill: '#f8fafc', stroke: '#475569', sw: 3 });
            // 瓦斯爐
            s += BOX(170, 200, 100, 58, { r: 6, fill: '#e2e8f0', stroke: '#475569' }) + TX(220, 236, '瓦斯爐', { fs: 12, c: INK, anchor: 'middle' });
            if (lpg) s += BOX(296, 196, 40, 62, { r: 12, fill: '#93c5fd', stroke: '#1e3a8a' }) + TX(316, 232, '桶', { fs: 12, c: '#1e3a8a', anchor: 'middle' });
            else s += SV.seg(270, 228, 398, 228, '#b45309', 6) + TX(360, 220, '管線', { fs: 11, c: '#b45309', anchor: 'middle' });
            // 瓦斯雲
            const cy = lpg ? 238 : 62, col = lpg ? 'rgba(217,119,6,.28)' : 'rgba(8,145,178,.25)';
            [80, 130, 190, 250, 310, 360].forEach((x, i) => s += `<ellipse cx="${x}" cy="${cy + (i % 2 ? 6 : -4)}" rx="40" ry="18" fill="${col}"/>`);
            s += ARW(220, lpg ? 120 : 180, 220, lpg ? 180 : 120, lpg ? AMB : C, 4);
            s += TX(232, 154, lpg ? '比空氣重，往下沉' : '比空氣輕，往上飄', { fs: 14, c: lpg ? AMB : C });
            // 偵測器
            const dy = lpg ? 222 : 50;
            s += BOX(44, dy, 46, 24, { r: 5, fill: '#fde047', stroke: '#a16207', sw: 2 }) + TX(67, dy + 17, '偵測', { fs: 11, c: '#713f12', anchor: 'middle' });
            s += TX(96, dy + (lpg ? -6 : 40), lpg ? '← 裝在低處' : '← 裝在高處', { fs: 13, c: RED });
            s += TX(220, 284, lpg ? '丙烷、丁烷：比空氣重' : '甲烷：比空氣輕', { fs: 15, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 294', s);
          };
          h.querySelector('#gs').oninput = draw; draw();
        },
        caption: '聞到瓦斯味：先關瓦斯開關、打開門窗通風，不要開關電器或點火。',
        example: {
          q: '家裡用的是管線天然氣，瓦斯偵測器要裝在靠近天花板還是靠近地板？',
          steps: ['天然氣的主要成分是甲烷，比空氣輕。', '漏出來會往上飄 → 裝在靠近天花板。'],
          ans: '靠近天花板'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: 'α、β、γ 三種放射線：一張紙、一片鋁、一塊厚鉛板',
        points: [
          '<span class="k">α</span>：氦原子核，帶正電，穿透力最小，一張紙就擋住。',
          '<span class="k">β</span>：高速電子，帶負電，要薄金屬片才擋得住。',
          '<span class="k">γ</span>：電磁波、不帶電，穿透力最大，要厚鉛板或混凝土。拖滑桿換擋板。'
        ],
        visual: (h) => {
          const B = [
            { n: '沒有擋板', stop: [] },
            { n: '一張紙', stop: ['α'], fill: '#fef9c3', w: 4 },
            { n: '薄鋁片', stop: ['α', 'β'], fill: '#cbd5e1', w: 10 },
            { n: '厚鉛板', stop: ['α', 'β', 'γ'], fill: '#64748b', w: 30 }
          ];
          const R = [ ['α', 80, RED], ['β', 150, BLU], ['γ', 220, VIO] ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>擋板：<span class="ival" id="bv">一張紙</span></label>
            <input type="range" id="bs" min="0" max="3" step="1" value="1"></div></div>`;
          const draw = () => {
            const b = B[+h.querySelector('#bs').value], bx = 230;
            h.querySelector('#bv').textContent = b.n;
            let s = BOX(20, 50, 56, 200, { r: 10, fill: '#fde68a', stroke: '#92400e', sw: 2 }) + TX(48, 156, '放射源', { fs: 11, c: '#78350f', anchor: 'middle' });
            if (b.w) s += `<rect x="${bx}" y="40" width="${b.w}" height="220" fill="${b.fill}" stroke="#334155" stroke-width="1.5"/>`;
            R.forEach(([nm, y, col]) => {
              const blocked = b.stop.includes(nm);
              const end = blocked ? bx - 2 : 420;
              s += ARW(80, y, end, y, col, 4) + TX(96, y - 10, nm, { fs: 16, c: col });
              s += blocked ? TX(bx + (b.w || 0) + 10, y + 5, '✗ 擋住', { fs: 13, c: col }) : TX(410, y - 10, '穿過', { fs: 12, c: col, anchor: 'end' });
            });
            s += TX(220, 286, `${b.n}：${b.stop.length ? '擋住 ' + b.stop.join('、') : '三種都通過'}`, { fs: 15, c: INK, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 296', s);
          };
          h.querySelector('#bs').oninput = draw; draw();
        },
        caption: '放進電場：α 帶正電偏向負極、β 帶負電偏向正極，γ 不帶電直直前進。',
        example: {
          q: '煙霧警報器裡的鋂-241 會放出 α 射線，為什麼用一般外殼就夠安全？',
          steps: ['α 射線的穿透力最小。', '一張紙、薄薄的外殼就能擋住。'],
          ans: 'α 射線穿透力小，外殼就擋得住'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '少一點點質量，換來超大能量：E ＝ Δm × c²',
        points: [
          '核反應後總質量會<b>少一點點</b>（Δm），少掉的質量變成能量：<span class="k">質能互換</span>。',
          'Δm 要換成<b>公斤</b>；光速 c ＝ 3 × 10⁸ m/s，c² ＝ 9 × 10¹⁶。',
          '拖滑桿改 Δm，看放出的能量夠一台 1000 W 的電器連續用多久。'
        ],
        formula: { label: '質能互換', tex: 'E=\\Delta m\\times c^{2}' },
        visual: (h) => {
          const M = [ ['0.001 g', -6, 10], ['0.01 g', -5, 11], ['0.1 g', -4, 12], ['1 g', -3, 13] ];
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>Δm ＝ <span class="ival" id="mv">0.1 g</span></label>
            <input type="range" id="ms" min="0" max="3" step="1" value="2"></div></div>`;
          const draw = () => {
            const [lab, kg, e] = M[+h.querySelector('#ms').value];
            h.querySelector('#mv').textContent = lab;
            const yr = 9 * Math.pow(10, e) / 1000 / (365 * 24 * 3600), ys = yr < 10 ? yr.toFixed(1) : String(Math.round(yr));
            let s = TX(220, 46, `Δm ＝ ${lab} ＝ 10<tspan dy="-7" font-size="11">${kg}</tspan><tspan dy="7"> kg</tspan>`, { fs: 17, c: INK, anchor: 'middle' });
            s += TX(220, 92, `E ＝ 10<tspan dy="-7" font-size="11">${kg}</tspan><tspan dy="7"> × 9 × 10</tspan><tspan dy="-7" font-size="11">16</tspan>`, { fs: 16, c: GRY, anchor: 'middle' });
            s += TX(220, 136, `＝ 9 × 10<tspan dy="-10" font-size="15">${e}</tspan><tspan dy="10"> J</tspan>`, { fs: 26, c: C, anchor: 'middle' });
            // 能量條：每多一個 10 倍，長一格
            for (let i = 0; i < 4; i++) s += BOX(60 + i * 82, 166, 76, 26, { r: 6, fill: i <= e - 10 ? '#67e8f9' : '#f1f5f9', stroke: i <= e - 10 ? C : '#cbd5e1' });
            s += TX(60, 210, '每一格 ＝ 能量 × 10', { fs: 11, c: GRY });
            s += TX(220, 250, `夠 1000 W 的電器連續用約 ${ys} 年`, { fs: 17, c: AMB, anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '核反應不遵守質量守恆，但反應前後質量數、質子數的總和不變（下一頁）。',
        example: {
          q: '某核反應損失了 0.2 g 的質量，放出多少能量？',
          steps: ['\\(0.2\\) g \\(=2\\times10^{-4}\\) kg。', '\\(E=2\\times10^{-4}\\times9\\times10^{16}=1.8\\times10^{13}\\) J。'],
          ans: '\\(1.8\\times10^{13}\\) J'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '核反應式對帳：左上質量數、左下質子數，兩邊總和都相等',
        points: [
          '原子核寫成 \\({}^{A}_{Z}\\mathrm{X}\\)：左上 A ＝ 質量數（質子＋中子），左下 Z ＝ 質子數。',
          '反應前後 A 的總和不變、Z 的總和也不變；中子數 ＝ A − Z。',
          '三種核反應：<span class="k">衰變</span>、<span class="k">核分裂</span>（大核變小核）、<span class="k">核融合</span>（小核變大核）。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: 'α 衰變', tex: '{}^{238}_{92}\\mathrm{U}\\to{}^{234}_{90}\\mathrm{Th}+{}^{4}_{2}\\mathrm{He}', note: '上：238 ＝ 234 ＋ 4　下：92 ＝ 90 ＋ 2', color: RED, border: '#f3c4d0', size: 18 },
            { label: '核分裂（核電廠）', tex: '{}^{1}_{0}\\mathrm{n}+{}^{235}_{92}\\mathrm{U}\\to{}^{92}_{36}\\mathrm{Kr}+{}^{141}_{56}\\mathrm{Ba}+3\\,{}^{1}_{0}\\mathrm{n}', note: '上：1 ＋ 235 ＝ 92 ＋ 141 ＋ 3　下：92 ＝ 36 ＋ 56', color: C, border: '#a5f3fc', size: 17 },
            { label: '核融合（例）', tex: '{}^{2}_{1}\\mathrm{H}+{}^{3}_{1}\\mathrm{H}\\to{}^{4}_{2}\\mathrm{He}+{}^{1}_{0}\\mathrm{n}', note: '上：2 ＋ 3 ＝ 4 ＋ 1　下：1 ＋ 1 ＝ 2 ＋ 0', color: VIO, border: '#ddd6fe', size: 18 }
          ]);
        },
        caption: '例：鋂-241 的質子數是 95，中子數 ＝ 241 − 95 ＝ 146。',
        example: {
          q: '釙-210（\\({}^{210}_{84}\\mathrm{Po}\\)）放出一個 α 粒子後，變成質量數、質子數各多少的原子核？',
          steps: ['α 粒子就是 \\({}^{4}_{2}\\mathrm{He}\\)。', '質量數 \\(210-4=206\\)，質子數 \\(84-2=82\\)。'],
          ans: '質量數 \\(206\\)、質子數 \\(82\\)'
        }
      },
      {
        sec: '3-5', secName: '珍惜常用的資源',
        title: '3-5 六個坑：太陽能電池、瓦斯、γ 射線、核能、質量、汽電共生',
        points: [
          '先蓋住右欄，自己說說看錯在哪裡。',
          '發電題先寫出能量轉換：從第一種能量一路寫到電能。',
          '節約能源：換高效率燈具、隨手關電；<span class="k">綠建築</span>從設計就省能、減少廢棄物。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['太陽能電池也是推動發電機發電', '光能<b>直接</b>變成電能，不用發電機'],
            ['天然氣比空氣重，偵測器裝低處', '天然氣輕 → 裝<b>高處</b>；桶裝瓦斯重 → 裝<b>低處</b>'],
            ['γ 射線帶電，在電場中會偏轉', 'γ 是電磁波、<b>不帶電</b>，直直前進'],
            ['核能發電是燃燒鈾', '是鈾-235 <b>核分裂</b>放出熱'],
            ['核反應遵守質量守恆', '質量會少一點變成能量；<b>質量數、質子數</b>總和不變'],
            ['汽電共生就是用汽油發電', '發電後剩下的<b>蒸汽、廢熱再利用</b>，提高效率']
          ]);
        },
        caption: '送電也會耗能：電從電廠送到家裡，有一部分在電線和變壓器變成熱散掉。',
        example: {
          q: '一般電燈泡只有約 5% 的電能變成光，其餘大多變成什麼？',
          steps: ['燈泡發光時會發燙。', '大部分的能量變成熱能散掉。'],
          ans: '熱能'
        }
      }
    ]
  });
})();
