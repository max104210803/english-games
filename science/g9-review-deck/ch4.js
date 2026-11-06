/* ============ 第 4 章　板塊運動與地球歷史 ============
   節次：6-1 地球構造與板塊運動、6-2 岩層記錄的地球歷史、6-3 臺灣的板塊和地震（課本第 6 章）
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：地震波種類與波速計算、放射性定年、古地磁、地震規模的計算公式、轉形斷層。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#d97706';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#b45309';
  const INK = '#172033', GRY = '#64748b';
  // 地科配色
  const CRUST = '#b08968', MANT = '#fb923c', CORE = '#facc15', SEA = '#bae6fd', OCEAN = '#64748b', MAGMA = '#ef4444';
  const LAY = ['#e7c58f', '#c9925b', '#9c6b43', '#d6b88a', '#a3a38a'];

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || INK}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  const ARW = (x1, y1, x2, y2, c, w = 3) => {
    const L = Math.hypot(x2 - x1, y2 - y1);
    if (L < 1) return '';
    const ux = (x2 - x1) / L, uy = (y2 - y1) / L, hl = Math.min(11, L), hw = 6;
    const bx = x2 - ux * hl, by = y2 - uy * hl;
    return `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<polygon points="${x2},${y2} ${bx - uy * hw},${by + ux * hw} ${bx + uy * hw},${by - ux * hw}" fill="${c}"/>`;
  };
  const PG = (pts, fill, stroke = 'none', w = 0) =>
    `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const PL = (pts, stroke, w = 2, dash) =>
    `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  let uid = 0;
  const nid = (p) => `${p}${++uid}`;
  // 滑桿頁共用骨架
  const slider = (h, lab, id, min, max, val, vb, draw) => {
    h.innerHTML = `<div style="width:100%"><div id="fig"></div>
      <div class="ictrl"><label>${lab}<span class="ival" id="${id}v"></span></label>
      <input type="range" id="${id}" min="${min}" max="${max}" step="1" value="${val}"></div></div>`;
    const go = () => {
      const v = +h.querySelector('#' + id).value;
      const r = draw(v);
      h.querySelector('#' + id + 'v').textContent = r.label;
      h.querySelector('#fig').innerHTML = svg(vb, r.svg);
    };
    h.querySelector('#' + id).oninput = go; go();
  };
  function xo(rows) {
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

  // 一塊水平岩層剖面（給斷層、地層偵探用）：layers 每一項是 [上緣 y, 下緣 y, 顏色]
  const strata = (x0, x1, layers) => layers.map(l =>
    `<rect x="${x0}" y="${l[0]}" width="${x1 - x0}" height="${l[1] - l[0]}" fill="${l[2]}" stroke="#57534e" stroke-width="1"/>`).join('');

  window.DECK.push({
    ch: 4,
    title: '板塊運動與地球歷史',
    color: C,
    sections: ['6-1 地球構造與板塊運動', '6-2 岩層記錄的地球歷史', '6-3 臺灣的板塊和地震'],
    slides: [

      /* ---------- 6-1 地球構造與板塊運動 ---------- */
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '人類最深的洞只挖了 12 公里：地球內部要靠地震波「照」',
        points: [
          '地球半徑約 <b>6370 km</b>，越往深處溫度越高、壓力越大，鑽井到不了。',
          '科學家分析<span class="k">地震波</span>在地球內部的反射、折射和速度變化，推出內部構造。',
          '拖滑桿往下鑽：由外而內是<span class="k">地殼 → 地函 → 地核</span>，密度越來越大。'
        ],
        visual: (h) => {
          const stops = [
            [0, '地表'], [12, '最深的鑽井'], [40, '大陸地殼底部'], [100, '岩石圈底部'],
            [1000, '地函中段'], [2900, '地函底部'], [4500, '地核裡面'], [6370, '地心']
          ];
          slider(h, '往下 ', 'dp', 0, 7, 1, '0 0 440 290', (i) => {
            const [d, nm] = stops[i];
            const layer = d <= 40 ? ['地殼', '岩石；密度最小', CRUST] : d <= 2900 ? ['地函', '岩石；上部有可流動的軟流圈', MANT] : ['地核', '鐵和鎳等金屬；密度最大', CORE];
            const O = [34, 284], R = 218, rc = R * 3470 / 6370;
            const sec = (r, f) => `<path d="M${O[0]} ${O[1]} L${O[0]} ${O[1] - r} A${r} ${r} 0 0 1 ${O[0] + r} ${O[1]} Z" fill="${f}" stroke="#78350f" stroke-width="1.2"/>`;
            let s = sec(R, CRUST) + sec(R - 5, MANT) + sec(rc, CORE);
            s += TX(O[0] + 92, O[1] - 128, '地函', { fs: 15, c: '#7c2d12' }) + TX(O[0] + 36, O[1] - 36, '地核', { fs: 15, c: '#713f12' });
            s += TX(O[0] + 160, O[1] - 196, '地殼（放大畫）', { fs: 11, c: '#78350f' });
            // 探針（沿 45° 方向）
            const r = R * (1 - d / 6370), px = O[0] + r * Math.SQRT1_2, py = O[1] - r * Math.SQRT1_2;
            s += SV.seg(O[0] + R * Math.SQRT1_2, O[1] - R * Math.SQRT1_2, px, py, INK, 2.5, '5 4') + SV.dot(px, py, RED, 6);
            // 右側放大柱：上方 200 km
            const zx = 330, zy = 40, K = 1.05;
            s += TX(zx + 35, zy - 12, '上方 200 km 放大', { fs: 11, c: GRY, anchor: 'middle' });
            s += `<rect x="${zx}" y="${zy}" width="70" height="${40 * K}" fill="${CRUST}"/><rect x="${zx}" y="${zy + 40 * K}" width="70" height="${160 * K}" fill="${MANT}"/>`;
            s += SV.seg(zx - 4, zy + 100 * K, zx + 74, zy + 100 * K, INK, 1.5, '4 3') + TX(zx + 76, zy + 100 * K + 4, '100', { fs: 10, c: INK });
            s += TX(zx + 76, zy + 40 * K + 4, '40', { fs: 10, c: INK }) + TX(zx + 76, zy + 16 * K, '12', { fs: 10, c: GRY });
            s += SV.seg(zx + 20, zy, zx + 20, zy + 12 * K, '#334155', 3);
            if (d <= 200) s += SV.dot(zx + 35, zy + d * K, RED, 6);
            else s += ARW(zx + 35, zy + 200 * K - 22, zx + 35, zy + 200 * K + 4, RED, 3) + TX(zx + 35, zy + 200 * K + 20, '更深', { fs: 11, c: RED, anchor: 'middle' });
            s += TX(10, 22, `深度 ${d} km：${layer[0]}`, { fs: 18, c: C }) + TX(10, 44, layer[1], { fs: 13, c: INK });
            s += TX(330, 284, `只占半徑 ${(d / 6370 * 100).toFixed(d < 100 ? 2 : 0)}%`, { fs: 12, c: GRY });
            return { label: `${d} km（${nm}）`, svg: s };
          });
        },
        caption: '12 km 的鑽井只占半徑約 0.2%；圖上的地殼其實薄到畫不出來，只能放大畫。',
        example: {
          q: '人類最深的鑽井約 12 km，約占地球半徑 6370 km 的百分之幾？',
          steps: ['\\(12\\div6370\\approx0.0019\\)。', '換成百分比約 \\(0.19\\%\\)，連千分之二都不到。'],
          ans: '約 \\(0.2\\%\\)'
        }
      },
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '兩套分層別混：看成分是地殼與地函，看軟硬是岩石圈與軟流圈',
        points: [
          '<span class="k">岩石圈</span>＝地殼＋地函最上部，約 100 km 厚，是堅硬的岩石。',
          '<span class="k">軟流圈</span>在岩石圈下方、屬於地函，溫度接近岩石熔點，可塑、極緩慢流動。',
          '海洋地殼較薄（約 7 km）、較密；大陸地殼較厚（約 40 km）、較輕。'
        ],
        visual: (h) => {
          const K = 0.62, y0 = 52, X1 = 70, X2 = 260;
          const Y = (km) => y0 + km * K;
          SV.stepper(h, '0 0 440 290', [
            { t: '<b>看成分</b>：大陸地殼約 40 km、海洋地殼約 7 km，下面都是地函（也是岩石）。', d: () =>
              TX(X1 + 55, 34, '看成分', { fs: 15, c: AMB, anchor: 'middle' }) +
              `<rect x="${X1}" y="${y0}" width="110" height="${(300) * K}" fill="${MANT}"/>` +
              `<rect x="${X1}" y="${y0}" width="55" height="${40 * K}" fill="${CRUST}"/><rect x="${X1 + 55}" y="${y0}" width="55" height="${7 * K + 1}" fill="#78716c"/>` +
              TX(X1 + 27, y0 + 16, '大陸', { fs: 11, c: '#fff', anchor: 'middle' }) + TX(X1 + 82, y0 + 18, '海洋', { fs: 11, c: '#57534e', anchor: 'middle' }) +
              TX(X1 + 55, Y(160), '地函', { fs: 15, c: '#7c2d12', anchor: 'middle' }) +
              TX(X1 - 6, Y(40) + 4, '40', { fs: 10, c: INK, anchor: 'end' }) + TX(X1 - 6, Y(0) + 4, '0 km', { fs: 10, c: INK, anchor: 'end' })
            },
            { t: '<b>看軟硬</b>：上面約 100 km 是硬的岩石圈，下面是會慢慢流動的軟流圈。', d: () =>
              TX(X2 + 55, 34, '看軟硬', { fs: 15, c: BLU, anchor: 'middle' }) +
              `<rect x="${X2}" y="${y0}" width="110" height="${100 * K}" fill="#94a3b8"/>` +
              `<rect x="${X2}" y="${Y(100)}" width="110" height="${200 * K}" fill="#fda4af"/>` +
              [0, 1].map(i => `<path d="M${X2 + 10} ${Y(140 + i * 50)} q 22 -10 45 0 t 45 0" fill="none" stroke="#be123c" stroke-width="2"/>`).join('') +
              TX(X2 + 55, Y(55), '岩石圈（硬）', { fs: 13, c: '#fff', anchor: 'middle' }) + TX(X2 + 55, Y(250), '軟流圈（可塑）', { fs: 13, c: '#9f1239', anchor: 'middle' }) +
              TX(X2 + 116, Y(100) + 4, '100', { fs: 10, c: INK })
            },
            { t: '<b>疊起來看</b>：岩石圈比地殼厚，包含了地殼和地函最上部（斜線區）。軟流圈只是地函的一部分。', d: () =>
              `<rect x="${X1}" y="${Y(40)}" width="110" height="${60 * K}" fill="url(#hatch4)" />` +
              `<defs><pattern id="hatch4" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${MANT}"/><line x1="0" y1="0" x2="0" y2="7" stroke="#475569" stroke-width="3"/></pattern></defs>` +
              SV.seg(X1 + 112, Y(100), X2 - 2, Y(100), INK, 1.8, '5 4') + SV.seg(X1 + 112, y0, X2 - 2, y0, INK, 1.8, '5 4') +
              TX((X1 + 112 + X2) / 2, Y(52), '＝', { fs: 26, c: INK, anchor: 'middle' }) +
              TX(220, 282, '岩石圈 ＝ 地殼 ＋ 地函最上部', { fs: 15, c: GRN, anchor: 'middle' })
            }
          ]);
        },
        caption: '考題愛問「岩石圈就是地殼嗎？」→ 不是，岩石圈比地殼厚。',
        example: {
          q: '某處海洋地殼厚 7 km，岩石圈厚 100 km。這裡的岩石圈有幾公里屬於地函？',
          steps: ['岩石圈 ＝ 地殼 ＋ 地函最上部。', '\\(100-7=93\\) km。'],
          ans: '\\(93\\) km'
        }
      },
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '熱對流是輸送帶：上升處板塊分開，下降處板塊相撞',
        points: [
          '軟流圈受地球內部熱能驅動緩慢<span class="k">對流</span>，帶著上面的板塊移動。',
          '熱對流<b>上升</b>處：板塊分離，海底形成<span class="k">中洋脊</span>，陸地形成裂谷。',
          '熱對流<b>下降</b>處：板塊推擠，密度大的海洋地殼<span class="k">隱沒</span>形成海溝；兩塊大陸相撞則隆起成高山。'
        ],
        visual: (h) => {
          const names = ['分離（中洋脊）', '海洋＋大陸推擠', '大陸＋大陸推擠'];
          slider(h, '交界：', 'bd', 0, 2, 0, '0 0 440 290', (k) => {
            let s = `<rect x="10" y="40" width="420" height="240" rx="10" fill="#fff7ed"/>`;
            const conv = (cx, up) => {         // 兩個對流胞：up=true 中間上升
              const a = up ? 1 : -1;
              return `<path d="M${cx} 262 Q ${cx} 200 ${cx + 90} 200 Q ${cx + 170} 200 ${cx + 170} 262" fill="none" stroke="#fb7185" stroke-width="2.5"/>` +
                `<path d="M${cx} 262 Q ${cx} 200 ${cx - 90} 200 Q ${cx - 170} 200 ${cx - 170} 262" fill="none" stroke="#fb7185" stroke-width="2.5"/>` +
                ARW(cx, 240, cx, 240 - 26 * a, '#e11d48', 3) + ARW(cx + 90 - 16 * a, 200, cx + 90 + 16 * a, 200, '#e11d48', 3) + ARW(cx - 90 + 16 * a, 200, cx - 90 - 16 * a, 200, '#e11d48', 3) +
                TX(cx + 6, 276, up ? '熱對流上升' : '熱對流下降', { fs: 12, c: '#be123c' });
            };
            if (k === 0) {
              s += `<rect x="10" y="40" width="420" height="58" fill="${SEA}"/>`;
              s += PG([ [10, 112], [205, 104], [218, 92], [218, 132], [10, 140] ], OCEAN, '#334155', 1.5);
              s += PG([ [430, 112], [235, 104], [222, 92], [222, 132], [430, 140] ], OCEAN, '#334155', 1.5);
              s += PG([ [211, 175], [229, 175], [224, 96], [216, 96] ], MAGMA);
              s += ARW(170, 80, 110, 80, INK, 3) + ARW(270, 80, 330, 80, INK, 3);
              s += TX(220, 62, '中洋脊', { fs: 15, c: RED, anchor: 'middle' }) + TX(60, 160, '海洋地殼', { fs: 12, c: INK }) ;
              s += conv(220, true);
              s += TX(220, 24, '例：大西洋中洋脊、冰島；陸地上是東非大裂谷', { fs: 13, c: INK, anchor: 'middle' });
            } else if (k === 1) {
              s += `<rect x="10" y="40" width="250" height="58" fill="${SEA}"/>`;
              s += PG([ [10, 98], [240, 98], [300, 180], [285, 192], [228, 120], [10, 120] ], OCEAN, '#334155', 1.5);
              s += PG([ [252, 98], [290, 70], [330, 52], [360, 62], [430, 72], [430, 140], [300, 140] ], CRUST, '#78350f', 1.5);
              s += PG([ [312, 60], [326, 42], [340, 58] ], '#78716c', '#44403c', 1) + PG([ [324, 46], [329, 46], [314, 150], [302, 150] ], MAGMA);
              s += ARW(90, 84, 160, 84, INK, 3) + ARW(420, 60, 380, 60, INK, 3);
              s += TX(244, 116, '海溝', { fs: 13, c: RED, anchor: 'end' }) + TX(360, 112, '大陸地殼', { fs: 12, c: '#fff' }) + TX(60, 113, '海洋地殼', { fs: 12, c: '#fff' });
              s += TX(346, 52, '火山', { fs: 12, c: RED });
              s += TX(250, 200, '密度大 → 往下隱沒', { fs: 12, c: INK, anchor: 'end' });
              s += conv(270, false);
              s += TX(220, 24, '例：安地斯山脈（海洋＋大陸）；海溝也出現在海洋＋海洋處', { fs: 12.5, c: INK, anchor: 'middle' });
            } else {
              s += PG([ [10, 100], [190, 100], [215, 60], [228, 36], [240, 58], [256, 40], [270, 100], [430, 100], [430, 150], [10, 150] ], CRUST, '#78350f', 1.5);
              s += SV.seg(222, 100, 236, 150, '#78350f', 2, '5 4');
              s += ARW(60, 84, 130, 84, INK, 3) + ARW(390, 84, 320, 84, INK, 3);
              s += TX(268, 52, '高山', { fs: 13, c: RED }) + TX(70, 130, '大陸地殼', { fs: 12, c: '#fff' }) + TX(320, 130, '大陸地殼', { fs: 12, c: '#fff' });
              s += TX(220, 175, '兩邊都輕、都不沉 → 擠到地殼增厚、隆起', { fs: 12, c: INK, anchor: 'middle' });
              s += conv(225, false);
              s += TX(220, 24, '例：喜馬拉雅山脈（印澳板塊撞歐亞板塊）', { fs: 13, c: INK, anchor: 'middle' });
            }
            return { label: names[k], svg: s };
          });
        },
        caption: '推擠和分離的交界都有地震和火山；全球地震帶和火山分布幾乎重疊在板塊交界上。',
        example: {
          q: '東非大裂谷、安地斯山脈、喜馬拉雅山脈，哪一個是板塊互相分離造成的？',
          steps: ['裂谷 ＝ 陸地上的分離交界。', '安地斯（海洋＋大陸）、喜馬拉雅（大陸＋大陸）都是推擠。'],
          ans: '東非大裂谷'
        }
      },
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '海底像兩條反向的輸送帶：離中洋脊越遠，海洋地殼越老',
        points: [
          '中洋脊湧出的玄武岩質岩漿冷卻，變成<span class="k">新的海洋地殼</span>，再被往兩側推開。',
          '所以中洋脊旁的岩石最年輕，越往外越老，<b>兩側對稱</b>。',
          '拖滑桿讓時間前進，看 X、Y、Z 三個點的年齡怎麼排。'
        ],
        formula: { label: '移動距離', tex: '\\text{距離}=\\text{速率}\\times\\text{時間}' },
        visual: (h) => {
          const U = 34, M = 220;
          const col = (age) => ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8'][Math.min(age, 5)];
          slider(h, '經過 ', 'tm', 1, 5, 3, '0 0 440 290', (t) => {
            let s = `<rect x="10" y="40" width="420" height="70" fill="${SEA}"/>`;
            for (let a = 0; a < t; a++) {       // 離脊第 a 格，是 a～a＋1 百萬年前形成的：越外面越老
              s += `<rect x="${M + a * U}" y="110" width="${U}" height="34" fill="${col(a)}" stroke="#334155" stroke-width="1"/>`;
              s += `<rect x="${M - (a + 1) * U}" y="110" width="${U}" height="34" fill="${col(a)}" stroke="#334155" stroke-width="1"/>`;
            }
            s += `<rect x="10" y="144" width="420" height="80" fill="#fecaca"/>` + TX(26, 206, '軟流圈', { fs: 12, c: '#9f1239' });
            s += PG([ [M - 6, 158], [M + 6, 158], [M + 3, 108], [M - 3, 108] ], MAGMA) + TX(M, 100, '中洋脊', { fs: 13, c: RED, anchor: 'middle' });
            s += ARW(M + 40, 76, M + 100, 76, INK, 3) + ARW(M - 40, 76, M - 100, 76, INK, 3);
            // X、Y、Z 三點（固定在離脊 0.5、2.5、4.5 格處）
            [ ['X', 0.5], ['Y', 2.5], ['Z', 4.5] ].forEach(([n, g]) => {
              if (g < t) {
                const x = M + g * U;
                s += SV.dot(x, 127, INK, 5) + TX(x, 166, n, { fs: 14, c: INK, anchor: 'middle' });
                s += TX(x, 182, `約 ${g} 百萬年`, { fs: 10.5, c: INK, anchor: 'middle' });
              }
            });
            s += TX(220, 24, `每邊已推出約 ${30 * t} km（每年約 3 cm 的示意速率）`, { fs: 13, c: INK, anchor: 'middle' });
            s += TX(220, 254, '顏色：紅＝最年輕（剛冒出來）→ 藍＝最老', { fs: 12, c: GRY, anchor: 'middle' });
            s += TX(220, 278, t >= 5 ? '年齡：X ＜ Y ＜ Z（離脊越遠越老）' : '再往後拉，Z 處的地殼也會出現', { fs: 14, c: t >= 5 ? GRN : AMB, anchor: 'middle' });
            return { label: `${t} 百萬年`, svg: s };
          });
        },
        caption: '這就是「海底擴張」：讓海底變大的新地殼來自中洋脊，老地殼則在海溝隱沒回地函。',
        example: {
          q: '某中洋脊每邊每年把海洋地殼推開約 3 cm，200 萬年後，最早形成的那條地殼離中洋脊大約多遠？',
          steps: ['\\(3\\text{ cm}\\times2000000=6000000\\text{ cm}\\)。', '\\(6000000\\text{ cm}=60\\text{ km}\\)。'],
          ans: '約 \\(60\\) km'
        }
      },
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '南美洲和非洲曾經拼在一起：大陸漂移的拼圖證據',
        points: [
          '南美洲東岸和非洲西岸的海岸線像拼圖，可以大致接合。',
          '兩岸有相同的<span class="k">爬蟲類化石</span>（不會長距離游泳），還有相同年代的岩層與山脈。',
          '炎熱的低緯度地區卻有 2 億多年前的<span class="k">冰河遺跡</span>：大陸以前不在現在的位置。'
        ],
        visual: (h) => {
          const seam = [ [0, 0], [10, 28], [16, 58], [6, 90], [-6, 122], [-16, 154], [-30, 186] ];
          const SA = [ [-100, 10], [-45, -14] ].concat(seam, [ [-58, 236], [-74, 196], [-96, 132], [-112, 64] ]);
          const AF = [ [0, 0], [62, -22], [140, -12], [168, 40], [150, 104], [114, 150], [84, 214], [52, 226] ].concat(seam.slice().reverse());
          const yrs = ['2 億年前', '1.5 億年前', '1 億年前', '5 千萬年前', '今天'];
          slider(h, '時間：', 'dr', 0, 4, 0, '0 0 440 290', (k) => {
            const g = k * 21, O = [214, 36];
            const tr = (P, dx) => P.map(p => [p[0] + O[0] + dx, p[1] + O[1] ]);
            const sa = tr(SA, -g), af = tr(AF, g * 0.45);
            let s = `<rect x="0" y="0" width="440" height="290" rx="10" fill="${k ? SEA : '#f8fafc'}"/>`;
            s += PG(sa, '#86efac', '#166534', 2) + PG(af, '#fde68a', '#92400e', 2);
            const mark = (P, dx, c, t) => { const x = P[0] + O[0] + dx, y = P[1] + O[1]; return `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="#fff" stroke-width="2"/>` + TX(x, y + 4, t, { fs: 9, c: '#fff', anchor: 'middle' }); };
            s += mark([-22, 60], -g, VIO, '化') + mark([22, 60], g * 0.45, VIO, '化');
            s += mark([-30, 150], -g, BLU, '冰') + mark([8, 150], g * 0.45, BLU, '冰');
            s += TX(O[0] - 60 - g, O[1] + 110, '南美洲', { fs: 14, c: '#14532d', anchor: 'middle' }) + TX(O[0] + 80 + g * 0.45, O[1] + 90, '非洲', { fs: 14, c: '#78350f', anchor: 'middle' });
            if (k >= 2) s += TX(O[0] - 6 - g * 0.275, O[1] + 190, '大西洋', { fs: 13, c: BLU, anchor: 'middle' });
            s += TX(14, 22, k ? `大西洋正在變寬（今天每年約 2.5 cm）` : '盤古大陸：兩塊大陸接在一起', { fs: 13, c: INK });
            s += TX(14, 282, '紫＝相同的爬蟲類化石　藍＝冰河遺跡（示意）', { fs: 11, c: GRY });
            return { label: yrs[k], svg: s };
          });
        },
        caption: '韋格納提出大陸漂移學說時說不出「陸地怎麼移動」；後來海底擴張和板塊構造學說才補上答案。',
        example: {
          q: '若大西洋每年變寬約 2.5 cm，經過 2 億年，大約變寬多少公里？',
          steps: ['\\(2.5\\text{ cm}\\times200000000=500000000\\text{ cm}\\)。', '\\(500000000\\text{ cm}=5000\\text{ km}\\)。'],
          ans: '約 \\(5000\\) km'
        }
      },
      {
        sec: '6-1', secName: '地球構造與板塊運動',
        title: '6-1 六個坑：岩石圈、地核、中洋脊、隱沒、交界、火山',
        points: [
          '先蓋住右欄，自己說出每一句錯在哪裡。',
          '判斷板塊題的口訣：<span class="k">上升分離、下降推擠、密度大的往下沉</span>。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['岩石圈就是地殼', '岩石圈 ＝ 地殼 ＋ <b>地函最上部</b>，比地殼厚'],
            ['地核由鈾、鈽等放射性元素組成', '地核主要是<b>鐵和鎳</b>，密度最大'],
            ['中洋脊在熱對流下降處', '中洋脊在熱對流<b>上升</b>處（板塊分離）'],
            ['大陸地殼和海洋地殼相撞，大陸地殼往下沉', '密度大的<b>海洋地殼</b>隱沒，形成海溝'],
            ['板塊交界就是海岸線', '交界和海陸界線<b>不一定</b>重疊'],
            ['火山只出現在板塊推擠處', '分離處（中洋脊、冰島）岩漿活動<b>也很頻繁</b>']
          ]);
        },
        caption: '喜馬拉雅山脈是「大陸＋大陸」，安地斯山脈才是「海洋＋大陸」——別配錯。',
        example: {
          q: '馬里亞納海溝是地表最深處，它位於哪一種板塊交界？',
          steps: ['海溝 ＝ 板塊隱沒的地方。', '隱沒發生在熱對流下降、板塊互相推擠處。'],
          ans: '板塊互相推擠處'
        }
      },

      /* ---------- 6-2 岩層記錄的地球歷史 ---------- */
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '褶皺：深處的岩層被擠一擠，彎成波浪',
        points: [
          '地下深處高溫高壓，岩層可塑；受<span class="k">擠壓力</span>就彎曲，不是熔化。',
          '往上凸起叫<span class="k">背斜</span>，往下凹叫<span class="k">向斜</span>。',
          '沒倒轉時，下面的岩層先堆積：向斜<b>外圈</b>（原本最下層）最老。'
        ],
        visual: (h) => {
          slider(h, '擠壓程度：', 'fd', 0, 4, 2, '0 0 440 290', (k) => {
            const w = 330 - 22 * k, xl = 220 - w / 2, xr = 220 + w / 2, A = 11 * k, lam = w * 0.8;
            const base = [96, 136, 176, 216, 256];
            const curve = (b) => { const p = []; for (let i = 0; i <= 40; i++) { const x = xl + w * i / 40; p.push([x, b - A * Math.cos(2 * Math.PI * (x - 220) / lam)]); } return p; };
            let s = '';
            for (let j = 0; j < 4; j++) {
              const top = curve(base[j]), bot = curve(base[j + 1]).reverse();
              s += PG(top.concat(bot), LAY[j], '#57534e', 1.2);
            }
            s += TX(xr + 6, base[3] + 26, '最老', { fs: 11, c: INK }) + TX(xr + 6, base[0] + 22, '最新', { fs: 11, c: INK });
            if (k) s += ARW(xl - 50, 176, xl - 8, 176, RED, 4) + ARW(xr + 50, 176, xr + 8, 176, RED, 4);
            if (k >= 2) {
              s += TX(220, base[0] - A - 10, '背斜', { fs: 14, c: BLU, anchor: 'middle' });
              s += TX(220 - lam / 2, base[0] + A + 20, '向斜', { fs: 14, c: VIO, anchor: 'middle' }) + TX(220 + lam / 2, base[0] + A + 20, '向斜', { fs: 14, c: VIO, anchor: 'middle' });
            }
            s += TX(220, 28, k ? '擠壓 → 彎曲，但岩層的上下順序沒變' : '原本：沉積岩一層層水平堆積', { fs: 14, c: INK, anchor: 'middle' });
            return { label: ['沒擠', '一點', '中等', '很多', '最多'][k], svg: s };
          });
        },
        caption: '課本開頭祕魯彩虹山的斜斜條紋，就是原本水平的沉積岩被擠彎、再被侵蝕露出來。',
        example: {
          q: '沒有倒轉的向斜由外圈到內圈是 A、B、C、D 四層，哪一層最老？',
          steps: ['向斜外圈原本在最下面。', '下面的先堆積 → 外圈最老。'],
          ans: 'A 層'
        }
      },
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '斷層實驗室：拉開會掉下去，擠壓會爬上來',
        points: [
          '斷層面通常是斜的：斜面<b>上方</b>那塊叫<span class="k">上盤</span>，下方那塊叫<span class="k">下盤</span>。',
          '<b>拉張力</b> → 上盤相對往下 ＝ <span class="k">正斷層</span>；<b>擠壓力</b> → 上盤相對往上 ＝ <span class="k">逆斷層</span>。',
          '<b>水平錯動力</b> → 兩側只水平移動 ＝ <span class="k">平移斷層</span>。看柵欄有沒有錯開。'
        ],
        visual: (h) => {
          const nm = ['拉張力 → 正斷層', '擠壓力 → 逆斷層', '水平錯動 → 平移斷層'];
          slider(h, '受力：', 'ft', 0, 2, 0, '0 0 440 290', (k) => {
            let s = '';
            const layers = (dy) => [ [90 + dy, 130 + dy, LAY[0] ], [130 + dy, 170 + dy, LAY[1] ], [170 + dy, 210 + dy, LAY[2] ], [210 + dy, 250 + dy, LAY[3] ]];
            const fence = (x, y) => [0, 1, 2, 3].map(i => SV.seg(x + i * 10, y, x + i * 10, y - 14, '#78350f', 2)).join('') + SV.seg(x - 3, y - 9, x + 33, y - 9, '#78350f', 2);
            if (k < 2) {
              const F1 = [200, 90], F2 = [280, 250], L = Math.hypot(80, 160), u = [80 / L, 160 / L];
              const sh = k === 0 ? 30 : -30, dx = u[0] * sh, dy = u[1] * sh;
              const idL = nid('fl'), idR = nid('fr');
              const left = [ [60, 90], F1, F2, [60, 250] ], right = [F1, [380, 90], [380, 250], F2];
              s += `<defs><clipPath id="${idL}"><polygon points="${left.join(' ')}"/></clipPath><clipPath id="${idR}"><polygon points="${right.join(' ')}"/></clipPath></defs>`;
              s += `<g clip-path="url(#${idL})">${strata(60, 380, layers(0))}</g>` + fence(110, 90);
              s += `<g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)})"><g clip-path="url(#${idR})">${strata(60, 380, layers(0))}</g>${fence(300, 90)}</g>`;
              s += SV.seg(F1[0] - u[0] * 40, F1[1] - u[1] * 40, F2[0] + u[0] * 20, F2[1] + u[1] * 20, RED, 3);
              s += TX(120, 236, '下盤', { fs: 15, c: '#fff' }) + TX(300 + dx, 236 + dy, '上盤', { fs: 15, c: '#fff' });
              // 上盤沿斷層面的相對移動
              s += ARW(256 + dx * 0.2, 196 - (k === 0 ? 24 : -24), 256 + u[0] * (k === 0 ? 26 : -26), 196 + u[1] * (k === 0 ? 26 : -26) - (k === 0 ? 24 : -24), '#fff', 3);
              // 外力
              if (k === 0) s += ARW(52, 170, 14, 170, BLU, 4) + ARW(392, 170, 430, 170, BLU, 4);
              else s += ARW(14, 170, 52, 170, BLU, 4) + ARW(430, 170, 392, 170, BLU, 4);
              s += TX(220, 30, k === 0 ? '上盤順著斷層面往下滑' : '上盤逆著重力往上推', { fs: 16, c: INK, anchor: 'middle' });
              s += TX(220, 278, '剖面圖：紅線是斷層面', { fs: 12, c: GRY, anchor: 'middle' });
            } else {
              // 俯視圖：一條路被水平錯開
              s += `<rect x="60" y="50" width="160" height="210" fill="#bbf7d0" stroke="#166534"/><rect x="220" y="50" width="160" height="210" fill="#bbf7d0" stroke="#166534"/>`;
              s += `<rect x="60" y="130" width="160" height="30" fill="#94a3b8"/><rect x="220" y="100" width="160" height="30" fill="#94a3b8"/>`;
              s += SV.seg(60, 145, 220, 145, '#fff', 2, '10 8') + SV.seg(220, 115, 380, 115, '#fff', 2, '10 8');
              s += SV.seg(220, 40, 220, 270, RED, 3);
              s += ARW(150, 220, 150, 250, BLU, 4) + ARW(290, 250, 290, 220, BLU, 4);
              s += TX(220, 30, '俯視圖：沒有上下，只有水平錯開', { fs: 16, c: INK, anchor: 'middle' });
              s += TX(140, 200, '道路', { fs: 12, c: INK, anchor: 'middle' });
            }
            return { label: nm[k], svg: s };
          });
        },
        caption: '臺灣受板塊擠壓，主要斷層多為逆斷層，走向大致南北（例：921 地震的車籠埔斷層）。',
        example: {
          q: '某斷層的上盤相對下盤往上移動，這是哪一種斷層？岩層受到什麼力？',
          steps: ['上盤往上 ＝ 逆著重力 ＝ 逆斷層。', '逆斷層由擠壓力造成。'],
          ans: '逆斷層，擠壓力'
        }
      },
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '地層偵探：被切穿的比較老，切穿別人的比較晚',
        points: [
          '三條規則：沉積岩原本<span class="k">水平</span>；沒倒轉時<span class="k">下面先堆積</span>；<span class="k">切穿別人的比較晚</span>。',
          '岩脈、斷層、侵蝕面都會「切」到岩層，所以都比被切到的岩層晚。',
          '拖滑桿一步步重建這裡的歷史，最後排出先後順序。'
        ],
        visual: (h) => {
          const F1 = [205, 108], F2 = [295, 262], L = Math.hypot(90, 154), u = [90 / L, 154 / L], off = 26;
          const lay = [ [110, 150, LAY[0], '丙'], [150, 200, LAY[1], '乙'], [200, 262, LAY[2], '甲'] ];
          const ero = () => { const p = [ [40, 138] ]; for (let x = 40; x <= 400; x += 20) p.push([x, 140 + 5 * Math.sin(x / 23)]); p.push([400, 138]); return p; };
          const scene = (n) => {
            const idL = nid('dl'), idR = nid('dr'), idE = nid('de');
            const left = [ [40, 60], [F1[0] - u[0] * 30, F1[1] - u[1] * 30], F2, [40, 262] ], right = [ [F1[0] - u[0] * 30, F1[1] - u[1] * 30], [400, 60], [400, 262], F2];
            const eroP = ero(), below = eroP.slice(1, -1).concat([ [400, 262], [40, 262] ]);
            let body = lay.map(l => `<rect x="40" y="${l[0]}" width="360" height="${l[1] - l[0]}" fill="${l[2]}" stroke="#57534e" stroke-width="1"/>`).join('');
            if (n >= 1) body += `<rect x="252" y="110" width="15" height="152" fill="${MAGMA}" stroke="#7f1d1d" stroke-width="1"/>`;
            const sh = n >= 2 ? off : 0;
            let s = `<defs><clipPath id="${idL}"><polygon points="${left.join(' ')}"/></clipPath><clipPath id="${idR}"><polygon points="${right.join(' ')}"/></clipPath>` +
              `<clipPath id="${idE}"><polygon points="${below.map(p => p.join(',')).join(' ')}"/></clipPath></defs>`;
            const blocks = n < 2 ? body : `<g clip-path="url(#${idL})">${body}</g><g transform="translate(${(u[0] * sh).toFixed(1)} ${(u[1] * sh).toFixed(1)})"><g clip-path="url(#${idR})">${body}</g></g>`;
            const idB = nid('db');
            s += `<defs><clipPath id="${idB}"><rect x="40" y="60" width="360" height="202"/></clipPath></defs>`;
            s += `<g clip-path="url(#${idB})">${n >= 3 ? `<g clip-path="url(#${idE})">${blocks}</g>` : blocks}</g>`;
            if (n >= 2) s += SV.seg(F1[0] + u[0] * (n >= 3 ? 20 : 0), F1[1] + u[1] * (n >= 3 ? 20 : 0), F2[0], F2[1], '#111827', 2.5);
            if (n >= 3) s += PL(eroP.slice(1, -1), '#7c2d12', 2.5, '6 4');
            if (n >= 4) s += PG([ [40, 92] ].concat(eroP.slice(1, -1), [ [400, 92] ]), LAY[3], '#57534e', 1.2) + TX(70, 112, '丁', { fs: 15, c: INK });
            s += TX(408, 134, '丙', { fs: 14, c: INK }) + TX(408, 180, '乙', { fs: 14, c: INK }) + TX(408, 236, '甲', { fs: 14, c: INK });
            if (n >= 1) s += TX(270, 270 - 6, '岩脈', { fs: 12, c: RED });
            if (n >= 3) s += TX(44, 158, '侵蝕面', { fs: 11, c: '#7c2d12' });
            return s;
          };
          SV.stepper(h, '0 0 440 290', [
            { t: '① 甲 → 乙 → 丙 依序<b>水平沉積</b>（下面先堆積）。', d: () => scene(0) },
            { t: '② 岩漿<b>侵入</b>，切穿甲乙丙，冷卻成岩脈 → 岩脈比甲乙丙都晚。', d: () => scene(1) },
            { t: '③ 發生<b>斷層</b>：連岩脈都被錯開 → 斷層比岩脈晚。右邊是上盤、往下滑，是正斷層。', d: () => scene(2) },
            { t: '④ 地表受<b>侵蝕</b>，削出凹凸不平的侵蝕面（左邊的丙幾乎被削光）。', d: () => scene(3) },
            { t: '⑤ 丁 沉積在侵蝕面上，沒有被岩脈或斷層切到 → 丁最晚。<br>順序：甲乙丙 → 岩脈 → 斷層 → 侵蝕 → 丁。', d: () => scene(4) }
          ], { acc: false });
        },
        caption: '判斷「誰比較晚」只要找：誰切穿了誰、誰蓋在誰上面。',
        example: {
          q: '某地火山灰層約 500 萬年前形成；它上面的頁岩被一條約 300 萬年前形成的岩脈切穿。頁岩形成於何時？',
          steps: ['頁岩在火山灰層上面 → 比 500 萬年前晚。', '頁岩被岩脈切穿 → 比 300 萬年前早。'],
          ans: '約 300～500 萬年前之間'
        }
      },
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '化石有兩種用法：推當時的環境，也推岩層的年代',
        points: [
          '推環境：珊瑚礁化石 → 當時是淺海；海中生物換成陸上動物 → 海變成陸地。',
          '推年代：只在某段時間大量生存的<span class="k">指標化石</span>，能判斷岩層的地質年代。',
          '三葉蟲＝<b>古生代</b>；菊石、恐龍＝<b>中生代</b>；長毛象等哺乳類＝<b>新生代</b>。'
        ],
        visual: (h) => {
          const L = [
            ['三葉蟲', '古生代', '海洋', '#d6d3d1'],
            ['菊石', '中生代', '海洋', '#e7c58f'],
            ['恐龍', '中生代', '陸地', '#c9925b'],
            ['長毛象', '新生代', '陸地', '#a3a38a']
          ];
          const icon = (i, x, y) => {
            if (i === 0) return `<ellipse cx="${x}" cy="${y}" rx="11" ry="16" fill="#57534e"/>` + [-8, -2, 4, 10].map(d => SV.seg(x - 11, y + d, x + 11, y + d, '#d6d3d1', 1.2)).join('');
            if (i === 1) return [14, 9, 4.5].map(r => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#57534e" stroke-width="2.5"/>`).join('');
            if (i === 2) return `<rect x="${x - 14}" y="${y - 3}" width="28" height="6" rx="3" fill="#f5f5f4" stroke="#57534e"/>` + [-14, 14].map(d => `<circle cx="${x + d}" cy="${y - 4}" r="4" fill="#f5f5f4" stroke="#57534e"/><circle cx="${x + d}" cy="${y + 4}" r="4" fill="#f5f5f4" stroke="#57534e"/>`).join('');
            return `<path d="M${x - 14} ${y - 8} Q ${x + 6} ${y + 18} ${x + 16} ${y - 6}" fill="none" stroke="#f5f5f4" stroke-width="5" stroke-linecap="round"/>`;
          };
          slider(h, '看第 ', 'fo', 0, 3, 0, '0 0 440 290', (k) => {
            let s = '';
            L.forEach((l, i) => {
              const y = 230 - i * 50;
              s += `<rect x="40" y="${y}" width="170" height="50" fill="${l[3]}" stroke="${i === k ? RED : '#57534e'}" stroke-width="${i === k ? 4 : 1}"/>`;
              s += icon(i, 85, y + 25) + icon(i, 160, y + 27);
            });
            s += TX(20, 270, '舊', { fs: 12, c: GRY }) + TX(20, 44, '新', { fs: 12, c: GRY }) + ARW(26, 250, 26, 56, GRY, 2);
            const l = L[k];
            s += BOX(232, 70, 192, 160, { r: 14, fill: '#fff7ed', stroke: C, sw: 2 });
            s += TX(328, 102, `${l[0]}化石`, { fs: 20, c: C, anchor: 'middle' });
            s += TX(248, 142, `年代：${l[1]}`, { fs: 16, c: INK }) + TX(248, 174, `環境：${l[2]}`, { fs: 16, c: l[2] === '海洋' ? BLU : GRN });
            s += TX(248, 206, k < 2 ? '海裡的生物' : '陸上的動物', { fs: 13, c: GRY });
            s += TX(220, 26, '由下往上讀：由海洋逐漸變成陸地', { fs: 15, c: INK, anchor: 'middle' });
            return { label: `${k + 1} 層（由下往上）`, svg: s };
          });
        },
        caption: '兩地找到相同的指標化石，就能把兩地的岩層對成「同一時期」。',
        example: {
          q: '某岩層發現許多菊石化石，這層岩石最可能在哪個地質年代、什麼環境形成？',
          steps: ['菊石是中生代的指標化石。', '菊石生活在海中 → 當時是海洋。'],
          ans: '中生代、海洋'
        }
      },
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '把 46 億年壓成一天：人類在最後一分鐘才出現',
        points: [
          '地球約有 <b>46 億年</b>歷史，科學家把它分成古生代、中生代、新生代等<span class="k">地質年代</span>。',
          '把 46 億年當成 24 小時：生命大量出現已經是晚上 9 點多。',
          '拖滑桿看重大事件幾點發生：恐龍滅絕在 23:39，直立人在 23:59 之後。'
        ],
        formula: { label: '換算', tex: '\\text{時刻}=24\\text{ 時}\\times\\left(1-\\frac{\\text{距今年數}}{46\\text{ 億年}}\\right)' },
        visual: (h) => {
          const E = [
            [4600, '地球形成', '00:00:00'],
            [541, '生命大量出現（寒武紀）', '21:10:38'],
            [485, '魚類出現（奧陶紀）', '21:28:10'],
            [252, '古生代結束、三葉蟲滅絕', '22:41:06'],
            [66, '恐龍、菊石滅絕', '23:39:20'],
            [2.6, '直立人出現', '23:59:11']
          ];
          slider(h, '事件：', 'ck', 0, 5, 4, '0 0 440 290', (k) => {
            const cx = 140, cy = 150, R = 110;
            const pt = (frac, r) => [cx + r * Math.sin(2 * Math.PI * frac), cy - r * Math.cos(2 * Math.PI * frac)];
            let s = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#334155" stroke-width="3"/>`;
            for (let i = 0; i < 24; i++) { const a = pt(i / 24, R - 2), b = pt(i / 24, R - (i % 6 ? 8 : 16)); s += SV.seg(a[0], a[1], b[0], b[1], '#334155', i % 6 ? 1.5 : 3); }
            [ [0, '0'], [6, '6'], [12, '12'], [18, '18'] ].forEach(([i, t]) => { const p = pt(i / 24, R - 30); s += TX(p[0], p[1] + 5, t, { fs: 13, c: GRY, anchor: 'middle' }); });
            const f = 1 - E[k][0] / 4600, end = pt(f, R - 4), big = f > 0.5 ? 1 : 0;
            if (k) s += `<path d="M${cx} ${cy} L${cx} ${cy - R + 4} A${R - 4} ${R - 4} 0 ${big} 1 ${end[0].toFixed(1)} ${end[1].toFixed(1)} Z" fill="rgba(217,119,6,.22)"/>`;
            E.forEach((e, i) => { const p = pt(1 - e[0] / 4600, R + 8); s += SV.dot(p[0], p[1], i === k ? RED : '#94a3b8', i === k ? 6 : 4); });
            const hand = pt(f, R - 22);
            s += SV.seg(cx, cy, hand[0], hand[1], RED, 4) + SV.dot(cx, cy, INK, 5);
            s += BOX(270, 86, 162, 120, { r: 14, fill: '#fff7ed', stroke: C, sw: 2 });
            s += TX(351, 128, E[k][2], { fs: 24, c: RED, anchor: 'middle' });
            s += TX(351, 158, E[k][1].length > 9 ? E[k][1].slice(0, 9) : E[k][1], { fs: 12.5, c: INK, anchor: 'middle' });
            if (E[k][1].length > 9) s += TX(351, 176, E[k][1].slice(9), { fs: 12.5, c: INK, anchor: 'middle' });
            s += TX(351, 196, k ? `距今約 ${E[k][0]} 百萬年` : '距今約 46 億年', { fs: 11, c: GRY, anchor: 'middle' });
            s += TX(220, 284, '最後不到 3 小時才有大量生物；人類只占最後不到 1 分鐘', { fs: 12, c: GRY, anchor: 'middle' });
            return { label: E[k][1], svg: s };
          });
        },
        caption: '時刻依地質年代表的約略年代換算（地球 46 億年 ＝ 24 小時）。',
        example: {
          q: '中生代約從 2.52 億年前到 0.66 億年前。在「地球一天」裡，中生代大約占多少分鐘？',
          steps: ['中生代長 \\(2.52-0.66=1.86\\) 億年。', '\\(\\frac{1.86}{46}\\times24\\times60\\approx58\\) 分鐘。'],
          ans: '約 \\(58\\) 分鐘'
        }
      },
      {
        sec: '6-2', secName: '岩層記錄的地球歷史',
        title: '6-2 六個坑：褶皺、斷層、順序、化石、沉積、向斜',
        points: [
          '先蓋住右欄，自己說出每一句錯在哪裡。',
          '受力口訣：<span class="k">擠壓 → 褶皺、逆斷層；拉張 → 正斷層</span>。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['褶皺是高溫高壓讓岩石熔化', '岩石沒熔化，是可塑的岩層受<b>擠壓</b>彎曲'],
            ['正斷層是受擠壓力', '正斷層受<b>拉張力</b>，上盤相對往下'],
            ['發生逆斷層時，上盤往下移動', '逆斷層的上盤相對<b>往上</b>'],
            ['在上面的一定比較晚形成', '岩脈從下往上鑽，要看<b>誰切穿誰</b>'],
            ['三葉蟲是中生代的指標化石', '三葉蟲是<b>古生代</b>；菊石、恐龍才是中生代'],
            ['沉積岩層原本是垂直或傾斜堆積', '原本<b>水平</b>堆積，傾斜、彎曲是後來受力']
          ]);
        },
        caption: '看到岩層傾斜或彎曲，就是「曾經受力」的證據。',
        example: {
          q: '珊瑚礁化石出現在高山上的岩層裡，可以推論什麼？',
          steps: ['珊瑚生長在溫暖的淺海。', '現在在高山 → 這裡曾是淺海，後來被抬升。'],
          ans: '曾是淺海，後來抬升成陸地'
        }
      },

      /* ---------- 6-3 臺灣的板塊和地震 ---------- */
      {
        sec: '6-3', secName: '臺灣的板塊和地震',
        title: '臺灣是被擠出來的島，而且現在還在長高',
        points: [
          '約六百萬年前，<span class="k">菲律賓海板塊</span>帶著呂宋火山島弧，往西北撞上<span class="k">歐亞板塊</span>。',
          '大陸邊緣厚厚的泥沙被擠壓隆起、露出水面，成為臺灣島。',
          '兩板塊仍在推擠，每年約 7～8 cm，所以臺灣<b>持續抬升</b>、地震頻繁。'
        ],
        visual: (h) => {
          slider(h, '', 'tw', 0, 6, 0, '0 0 440 290', (k) => {
            const ax = 340 - 10 * k, sea = 132;
            let s = `<rect x="0" y="${sea}" width="440" height="40" fill="${SEA}"/>`;
            s += `<rect x="0" y="172" width="440" height="110" fill="#fecaca"/>`;
            // 歐亞板塊（大陸邊緣＋泥沙）
            s += PG([ [0, 150], [190, 150], [250, 172], [250, 214], [0, 214] ], CRUST, '#78350f', 1.5);
            const mx = 175 + 6 * k, top = sea + 30 - 16 * k;
            s += PG([ [110, 150], [mx - 70, 150], [mx, top], [mx + 40, 150], [ax - 30, 160], [ax - 40, 172], [150, 172] ], LAY[0], '#a16207', 1.5);
            // 菲律賓海板塊＋島弧（只畫碰撞，不畫隱沒方向）
            s += PG([ [ax - 40, 172], [440, 172], [440, 204], [ax - 40, 204] ], OCEAN, '#334155', 1.5);
            s += PG([ [ax - 30, 172], [ax - 10, sea - 12], [ax + 10, sea + 4], [ax + 30, sea - 6], [ax + 50, 172] ], '#78716c', '#44403c', 1.5);
            s += ARW(ax + 110, 188, ax + 60, 188, '#fff', 3);
            s += TX(20, 200, '歐亞板塊', { fs: 13, c: '#fff' }) + TX(430, 228, '菲律賓海板塊', { fs: 13, c: INK, anchor: 'end' });
            s += TX(ax + 10, sea - 22, '呂宋島弧', { fs: 11, c: '#44403c', anchor: 'middle' });
            if (top < sea - 4) s += TX(mx, top - 8, k >= 5 ? '中央山脈' : '露出水面！', { fs: 13, c: GRN, anchor: 'middle' });
            if (k >= 4) s += TX(ax - 30, sea - 34, '花東縱谷', { fs: 11, c: RED, anchor: 'middle' }) + ARW(ax - 30, sea - 30, ax - 30, sea - 6, RED, 2);
            s += TX(14, 24, k ? `已往西北推進約 ${80 * k} km（每年約 8 cm）` : '約 600 萬年前：還沒有臺灣島', { fs: 14, c: INK });
            if (k === 6) s += TX(14, 258, '今天：交界在花東縱谷，東邊的海岸山脈原本是島弧', { fs: 12, c: AMB });
            s += TX(14, 282, '示意圖，不按比例', { fs: 11, c: GRY });
            return { label: k === 6 ? '今天' : `${6 - k} 百萬年前`, svg: s };
          });
        },
        caption: '板塊推擠方向接近西北—東南，所以臺灣的山脈、岩石分布和主要斷層都呈南北走向。',
        example: {
          q: '若菲律賓海板塊每年往西北推進約 8 cm，600 萬年共推進多遠？',
          steps: ['\\(8\\text{ cm}\\times6000000=48000000\\text{ cm}\\)。', '\\(48000000\\text{ cm}=480\\text{ km}\\)。'],
          ans: '約 \\(480\\) km'
        }
      },
      {
        sec: '6-3', secName: '臺灣的板塊和地震',
        title: '從臺灣海峽走到太平洋：三大岩類由西到東排好隊',
        points: [
          '交界在<span class="k">花東縱谷</span>：西邊是歐亞板塊，東邊的<b>海岸山脈</b>屬於菲律賓海板塊。',
          '<b>沉積岩</b>主要在中央山脈西翼；<b>變質岩</b>在中央山脈東翼；<b>火成岩</b>在海岸山脈和北部陽明山。',
          '拖滑桿由西往東走，看腳下是哪一種岩石。'
        ],
        visual: (h) => {
          const R = [
            ['臺灣海峽', '海', '歐亞板塊', SEA, 30],
            ['西部平原', '河流帶來的沖積層（沉積物）', '歐亞板塊', '#fef3c7', 90],
            ['中央山脈西翼', '沉積岩', '歐亞板塊', '#fde68a', 160],
            ['中央山脈東翼', '變質岩', '歐亞板塊', '#93c5fd', 225],
            ['花東縱谷', '板塊交界', '兩板塊交界', '#fecaca', 268],
            ['海岸山脈', '火成岩（原本的火山島弧）', '菲律賓海板塊', '#fca5a5', 305],
            ['太平洋', '海', '菲律賓海板塊', SEA, 380]
          ];
          slider(h, '走到：', 'ew', 0, 6, 3, '0 0 440 290', (k) => {
            const prof = [ [0, 170], [40, 170], [60, 166], [110, 162], [140, 140], [180, 90], [205, 60], [225, 70], [250, 120], [262, 150], [275, 150], [292, 118], [310, 108], [328, 130], [345, 170], [440, 170] ];
            let s = `<rect x="0" y="120" width="440" height="50" fill="${SEA}" opacity=".6"/>`;
            s += PG(prof.concat([ [440, 240], [0, 240] ]), '#e5e7eb', '#475569', 2);
            // 地表岩類色帶
            s += PG([ [60, 166], [110, 162], [140, 140], [180, 90], [205, 60], [205, 240], [60, 240] ], '#fde68a', 'none');
            s += PG([ [205, 60], [225, 70], [250, 120], [262, 150], [262, 240], [205, 240] ], '#93c5fd', 'none');
            s += PG([ [275, 150], [292, 118], [310, 108], [328, 130], [345, 170], [345, 240], [275, 240] ], '#fca5a5', 'none');
            s += PG([ [40, 170], [60, 166], [110, 162], [110, 240], [40, 240] ], '#fef3c7', 'none');
            s += PL(prof, '#475569', 2);
            s += SV.seg(268, 150, 300, 260, RED, 3, '7 5') + TX(300, 276, '板塊交界', { fs: 11, c: RED, anchor: 'middle' });
            s += TX(110, 222, '歐亞板塊', { fs: 13, c: INK }) + TX(350, 222, '菲律賓海板塊', { fs: 13, c: INK });
            s += ARW(420, 204, 372, 204, BLU, 3);
            const r = R[k], x = r[4];
            s += `<path d="M${x} 20 L${x - 8} 6 L${x + 8} 6 Z" fill="${RED}"/>` + SV.seg(x, 20, x, 48, RED, 2);
            s += BOX(10, 248, 420, 38, { r: 10, fill: '#fff7ed', stroke: C });
            s += TX(20, 272, `${r[0]}｜${r[1]}｜${r[2]}`, { fs: 14, c: INK });
            s += TX(8, 116, '西', { fs: 13, c: GRY }) + TX(424, 116, '東', { fs: 13, c: GRY });
            return { label: r[0], svg: s };
          });
        },
        caption: '中央山脈是被擠出來的山，不是交界；交界在它東邊的花東縱谷。',
        example: {
          q: '海岸山脈屬於哪一個板塊？主要是哪一類岩石？',
          steps: ['花東縱谷是交界，海岸山脈在它東邊 → 菲律賓海板塊。', '海岸山脈原本是火山島弧 → 火成岩。'],
          ans: '菲律賓海板塊、火成岩'
        }
      },
      {
        sec: '6-3', secName: '臺灣的板塊和地震',
        title: '震源、震央、震源深度：震央在斷層面「斜下去」的那一側',
        points: [
          '<span class="k">震源</span>：岩層開始斷裂的位置；<span class="k">震央</span>：震源垂直往上到地表的點。',
          '<span class="k">震源深度</span>＝震源到震央的距離。淺層地震破裂帶靠近地表，最容易造成重大災害。',
          '震源在斜的斷層面上，所以震央通常不在斷層的地表裂縫上。拖滑桿改變震源深度。'
        ],
        visual: (h) => {
          slider(h, '震源深度 ', 'hd', 1, 5, 2, '0 0 440 290', (k) => {
            const d = 10 * k, S = 4, G = 64, T = 100;
            const Hx = T + 0.75 * d * S, Hy = G + d * S;
            let s = `<rect x="0" y="${G}" width="440" height="${290 - G}" fill="#e7c58f"/><rect x="0" y="0" width="440" height="${G}" fill="#f0f9ff"/>`;
            s += SV.seg(0, G, 440, G, '#166534', 4);
            s += SV.seg(T, G, T + 0.75 * 56 * S, G + 56 * S, '#7c2d12', 3) + TX(T + 0.75 * 50 * S + 12, G + 50 * S, '斷層面', { fs: 12, c: '#7c2d12' });
            [18, 34, 50].forEach(r => { s += `<circle cx="${Hx}" cy="${Hy}" r="${r}" fill="none" stroke="#f97316" stroke-width="1.5" opacity="${1 - r / 70}"/>`; });
            s += SV.seg(Hx, G, Hx, Hy, BLU, 2.5, '6 4') + SV.dot(Hx, Hy, RED, 7) + TX(Hx + 10, Hy + 5, '震源', { fs: 14, c: RED });
            s += `<path d="M${Hx} ${G - 4} l -7 -12 h 14 z" fill="${RED}"/>` + TX(Hx, G - 22, '震央', { fs: 14, c: RED, anchor: 'middle' });
            s += TX(Hx + 8, (G + Hy) / 2 + 4, `${d} km`, { fs: 13, c: BLU });
            s += SV.seg(T, G + 10, Hx, G + 10, VIO, 2.5) + TX((T + Hx) / 2, G + 28, `${fmt(0.75 * d)} km`, { fs: 12, c: VIO, anchor: 'middle' });
            s += TX((T + Hx) / 2 - 18, (G + Hy) / 2 + 22, `${fmt(1.25 * d)} km`, { fs: 12, c: '#7c2d12', anchor: 'end' });
            s += TX(40, G - 8, '甲', { fs: 14, c: INK }) + TX(Math.min(Hx + 30, 420), G - 8, '乙', { fs: 14, c: INK });
            s += TX(220, 22, `震源深度 ${d} km → ${d <= 30 ? '極淺地震' : d <= 70 ? '淺層地震' : '中層地震'}`, { fs: 15, c: INK, anchor: 'middle' });
            s += TX(230, 282, '從地表往下鑽：只有震央這一側（乙）鑽得到斷層面', { fs: 11.5, c: GRY, anchor: 'middle' });
            return { label: `${d} km`, svg: s };
          });
        },
        caption: '藍線（深度）、紫線（震央到斷層裂縫）和斷層面三條線圍成直角三角形，是 3：4：5 的比例。',
        example: {
          q: '震源深度 20 km，震央到斷層地表裂縫 15 km，則震源沿斷層面到地表裂縫多遠？',
          steps: ['三條線圍成直角三角形，斜邊在斷層面上。', '\\(\\sqrt{15^2+20^2}=\\sqrt{625}=25\\) km。'],
          ans: '\\(25\\) km'
        }
      },
      {
        sec: '6-3', secName: '臺灣的板塊和地震',
        title: '規模只有一個，震度到處不同',
        points: [
          '<span class="k">地震規模</span>表示震源釋放的能量：一次地震只有一個數字，有小數點、<b>沒有單位</b>。',
          '<span class="k">震度</span>是各地搖晃、破壞的程度：分 0～7 級，5、6 級再分強弱。',
          '通常離震央越遠，震度越小；但規模不會變。拖滑桿把你家搬遠一點。'
        ],
        visual: (h) => {
          const lv = (km) => km < 20 ? ['6弱', '#7f1d1d'] : km < 45 ? ['5強', '#b91c1c'] : km < 75 ? ['5弱', '#ef4444'] : km < 110 ? ['4級', '#f97316'] : km < 150 ? ['3級', '#facc15'] : km < 200 ? ['2級', '#84cc16'] : ['1級', '#bbf7d0'];
          slider(h, '你家離震央 ', 'mi', 0, 6, 2, '0 0 440 290', (k) => {
            const km = k * 40, cx = 150, cy = 150, P = 0.62;
            let s = `<rect x="0" y="0" width="440" height="290" rx="10" fill="${SEA}"/>`;
            [210, 160, 120, 85, 55, 30, 10].forEach(r => { s += `<circle cx="${cx}" cy="${cy}" r="${r * P}" fill="${lv(r - 1)[1]}" opacity=".85"/>`; });
            s += `<path d="M${cx} ${cy - 11} l 3 8 h 9 l -7 6 l 3 9 l -8 -5 l -8 5 l 3 -9 l -7 -6 h 9 z" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
            const hx = cx + km * P, hy = cy;
            s += `<path d="M${hx - 10} ${hy} l10 -11 l10 11 v11 h-20 z" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
            s += SV.seg(cx, cy + 22, hx, cy + 22, INK, 1.5, '4 3');
            const v = lv(km);
            s += BOX(286, 40, 146, 74, { r: 12, fill: '#fff', stroke: '#cbd5e1' });
            s += TX(359, 66, '地震規模', { fs: 13, c: GRY, anchor: 'middle' }) + TX(359, 100, '6.4', { fs: 28, c: INK, anchor: 'middle' });
            s += BOX(286, 130, 146, 74, { r: 12, fill: '#fff', stroke: v[1], sw: 3 });
            s += TX(359, 156, '你家的震度', { fs: 13, c: GRY, anchor: 'middle' }) + TX(359, 190, v[0], { fs: 28, c: v[1] === '#bbf7d0' ? GRN : v[1], anchor: 'middle' });
            s += TX(359, 230, '規模：全臺都一樣', { fs: 12, c: INK, anchor: 'middle' }) + TX(359, 250, '震度：隨地點改變', { fs: 12, c: INK, anchor: 'middle' });
            s += TX(14, 282, '震度分布為示意；實際還受地質、地形影響', { fs: 11, c: GRY });
            return { label: `${km} km`, svg: s };
          });
        },
        caption: '寫法要分清楚：「規模 6.4」不加級；「震度 4 級」「震度 5 強」不寫小數。',
        example: {
          q: '同一次地震，甲城震度 5 強、乙城震度 3 級。兩城測得的地震規模哪個大？',
          steps: ['同一次地震，震源釋放的能量只有一個。', '震度不同只是因為距離、地質不同。'],
          ans: '一樣大'
        }
      },
      {
        sec: '6-3', secName: '臺灣的板塊和地震',
        title: '6-3 六個坑，外加地震來時的三個動作',
        points: [
          '地震時立刻「<span class="k">趴下、掩護、穩住</span>」，保護頭部和頸部。',
          '旁邊有桌子就躲到桌下抓穩桌腳；沒有桌子就遠離玻璃窗、吊燈、大型家具。',
          '家中準備緊急避難包，裝 1～3 天的食物、飲水、藥品，每半年檢查一次。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['地震發生的位置叫震央', '岩層開始斷裂處是<b>震源</b>；震央在它正上方地表'],
            ['芮氏規模 6.4 級', '規模<b>沒有單位</b>：寫「規模 6.4」'],
            ['離震央越近，測到的規模越大', '同一次地震<b>規模都一樣</b>，變的是震度'],
            ['臺灣的板塊交界在中央山脈', '交界在<b>花東縱谷</b>'],
            ['臺灣的斷層多為正斷層', '臺灣受擠壓，多為<b>逆斷層</b>'],
            ['地震時躲到靠窗的牆角', '要<b>遠離玻璃窗</b>，躲桌下抓穩桌腳']
          ]);
        },
        caption: '目前還無法準確預測地震的時間、地點和規模，所以事先防備最重要。',
        example: {
          q: '「臺灣常發生地震，是因為大量超抽地下水造成地層下陷。」這句話對嗎？',
          steps: ['超抽地下水會造成地層下陷，但不是地震的主因。', '主因是臺灣位於歐亞板塊與菲律賓海板塊推擠的交界。'],
          ans: '不對'
        }
      }
    ]
  });

  function fmt(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1); }
})();
