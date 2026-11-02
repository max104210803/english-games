/* ============ 第 3 章　有機化學 ============
   節次：5-1 認識有機與燃燒、5-2 生活應用
   內容：觀念整理與例題皆為自編，數字以程式驗算。
   課綱邊界（本章刻意不放）：酸鹼中和的定量計算、電解與電鍍、
     反應速率的定量測定、IUPAC 有機命名、溶液濃度計算（ppm 另章）。
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#059669';
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
    ch: 3,
    title: '有機化學',
    color: C,
    sections: ['5-1 認識有機與燃燒', '5-2 生活應用'],
    slides: [

      /* ---------- 有機定義 ---------- */
      {
        sec: '5-1', secName: '認識有機與燃燒',
        title: '有機＝含碳，但含碳不一定有機',
        points: [
          '現代定義：含<span class="k">碳</span>的化合物；烏勒合成尿素\\(CO(NH_{2})_{2}\\)打破生物說。',
          '例外背起來：\\(CO\\)、\\(CO_{2}\\)、碳酸鹽（如\\(Na_{2}CO_{3}\\)）、氰化物\\(HCN\\)是無機。',
          '乾餾看顏色：砂糖\\(C_{12}H_{22}O_{11}\\)麵粉變黑，食鹽\\(NaCl\\)不變。'
        ],
        formula: { label: '定義', tex: '\\text{有機}＝\\text{含碳}－\\text{例外}' },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '有機', tex: '\\text{砂糖 }C_{12}H_{22}O_{11}\\text{、麵粉、尿素}', color: GRN, fill: '#eef7f2', border: '#bfe0d1', size: 17, note: '尿素 CO(NH₂)₂ 可人工合成' },
            { label: '無機', tex: '\\text{食鹽 }NaCl', color: BLU, fill: '#eef4ff', border: BLU, size: 18, note: '不含碳' },
            { label: '例外', tex: 'CO、CO_{2}\\text{、碳酸鹽、}HCN', color: RED, fill: '#fdeef2', border: '#f3c4d0', size: 18, note: '含碳卻是無機（如碳酸鈉 Na₂CO₃)' }
          ]);
        },
        caption: '例外四天王：氧化物、碳酸鹽、氰化物，看到先打叉。',
        example: {
          q: '乾餾砂糖\\(C_{12}H_{22}O_{11}\\)、麵粉、食鹽\\(NaCl\\)、碳酸鈉\\(Na_{2}CO_{3}\\)，何者不會變黑？',
          steps: ['砂糖麵粉有機 → 變黑。', '食鹽、碳酸鈉（碳酸鹽例外）無機 → 不變。'],
          ans: '食鹽、碳酸鈉'
        }
      },

      /* ---------- 物質判定互動 ---------- */
      {
        sec: '5-1', secName: '認識有機與燃燒',
        title: '滑到第 4 個：含碳卻是無機物的現行犯',
        points: [
          '砂糖麵粉有機，食鹽無碳無機，都好判。',
          '第 4 個碳酸鈉：含碳，但是<b>碳酸鹽例外</b>。',
          '問自己：滑到第幾個是人工合成的有機物？'
        ],
        formula: { label: '判定', tex: '\\text{先看含碳，再查例外}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>物質 <span class="ival" id="mv">1/5</span></label>
            <input type="range" id="ms" min="1" max="5" step="1" value="1"></div></div>`;
          const subs = [
            { n: '砂糖', y: 1, w: 'C₁₂H₂₂O₁₁，乾餾變黑' },
            { n: '麵粉', y: 1, w: '澱粉為主，加熱變黑' },
            { n: '食鹽', y: 0, w: 'NaCl，不含碳' },
            { n: '碳酸鈉', y: 0, w: 'Na₂CO₃，碳酸鹽例外' },
            { n: '尿素', y: 1, w: 'CO(NH₂)₂，人工合成' }
          ];
          const draw = () => {
            const i = Math.min(Math.max(+h.querySelector('#ms').value - 1, 0), subs.length - 1), s0 = subs[i];
            h.querySelector('#mv').textContent = (i + 1) + '/5';
            const col = s0.y ? GRN : RED, tag = s0.y ? '有機' : '無機';
            let s = BOX(40, 60, 360, 120, { fill: s0.y ? 'rgba(5,150,105,.07)' : 'rgba(225,29,72,.07)', stroke: col });
            s += TX(220, 108, s0.n + ' → ' + tag, { fs: 26, c: col, anchor: 'middle' });
            s += TX(220, 145, s0.w, { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 200', s);
          };
          h.querySelector('#ms').oninput = draw; draw();
        },
        caption: '第 4 個碳酸鈉：第 5 個尿素是有機（人工合成）。',
        example: {
          q: '下列何者含碳卻屬無機化合物？（砂糖／碳酸鈉／尿素）',
          steps: ['砂糖有機，尿素有機（人工合成）。', '碳酸鈉是碳酸鹽例外 → 無機。'],
          ans: '碳酸鈉'
        }
      },

      /* ---------- 燃燒碳排 ---------- */
      {
        sec: '5-1', secName: '認識有機與燃燒',
        title: '100 克比碳排：天然氣 275 勝出',
        points: [
          '同樣 100 克：莫耳數×每莫耳 CO₂ 數×44。',
          '天然氣\\(CH_{4}\\)\\(275\\)＞藥用\\(C_{2}H_{5}OH\\)\\(191\\)＞工業\\(CH_{3}OH\\)\\(137\\)。',
          '碳從燃料來：100g含碳 \\(6.25＞4.35＞3.125\\) 莫耳，順序與碳排一致。'
        ],
        formula: { label: '碳排', tex: '275＞191＞137' },
        visual: (h) => {
          let s = '';
          const rows = [['天然氣', 'CH₄', 275, GRN], ['藥用酒精', 'C₂H₅OH', 191, AMB], ['工業酒精', 'CH₃OH', 137, BLU]];
          rows.forEach((r, i) => {
            const y = 60 + i * 60, w = r[2];
            s += TX(40, y + 22, r[0], { fs: 14, c: '#172033' });
            s += `<rect x="140" y="${y}" width="${w}" height="28" rx="6" fill="${r[3]}55" stroke="${r[3]}" stroke-width="2"/>`;
            s += TX(140 + w - 8, y + 22, '' + r[2] + 'g ' + r[1], { fs: 13, c: '#172033', anchor: 'end' });
          });
          h.innerHTML = svg('0 0 440 250', s);
        },
        caption: '條長＝100g裡的碳原子總數：6.25＞4.35＞3.125 莫耳碳。',
        example: {
          q: '天然氣、工業酒精、藥用酒精各 \\(100\\) 克燃燒，順序？（CH₄=16，CH₃OH=32，C₂H₅OH=46）',
          steps: ['天然氣\\(CH_{4}\\) \\(100÷16×44=275\\)。', '藥用\\(C_{2}H_{5}OH\\) \\(≈191\\)，工業\\(CH_{3}OH\\) \\(137.5\\)。'],
          ans: '天然氣＞藥用＞工業（B）'
        }
      },

      /* ---------- 皂化鹽析 ---------- */
      {
        sec: '5-2', secName: '生活應用',
        title: '皂化＋鹽析：油變肥皂浮上來',
        points: [
          '三叉被剪：NaOH 把 3 條脂肪酸剪下，剩的柄就是甘油\\(C_{3}H_{8}O_{3}\\)。',
          '鹽析是被擠出來：鹽水已滿，肥皂待不住只好浮上來。',
          '去汙靠雙面人：一手抓油一手抓水（乳化），不是溶解。'
        ],
        formula: { label: '皂化', tex: '\\text{油脂}＋NaOH→\\text{肥皂}＋C_{3}H_{8}O_{3}' },
        visual: (h) => {
          let s = TX(70, 30, '油脂三叉', { fs: 13, c: C, anchor: 'middle' });
          s += SV.seg(55, 40, 55, 100, RED, 4);
          [50, 70, 90].forEach(yy => { s += SV.seg(55, yy, 105, yy, AMB, 4); });
          s += TX(140, 70, 'NaOH剪', { fs: 13, c: RED, anchor: 'middle' });
          s += TX(140, 100, '→', { fs: 22, c: RED, anchor: 'middle' });
          [55, 80, 105].forEach(yy => { s += SV.seg(185, yy, 250, yy, AMB, 4); });
          s += TX(217, 128, '肥皂×3', { fs: 12, c: '#172033', anchor: 'middle' });
          s += SV.seg(285, 60, 285, 110, GRN, 5);
          s += TX(285, 128, '甘油柄', { fs: 12, c: GRN, anchor: 'middle' });
          s += TX(365, 60, '鹽水已滿', { fs: 12, c: BLU, anchor: 'middle' });
          s += `<rect x="315" y="76" width="100" height="40" rx="8" fill="rgba(37,99,235,.15)" stroke="${BLU}" stroke-width="2"/>`;
          s += `<rect x="325" y="64" width="80" height="14" rx="7" fill="rgba(5,150,105,.4)" stroke="${GRN}" stroke-width="1.5"/>`;
          s += TX(365, 132, '肥皂浮出待不住', { fs: 12, c: GRN, anchor: 'middle' });
          h.innerHTML = svg('0 0 440 150', s);
        },
        caption: '剪三條得肥皂，剩柄得甘油；鹽水滿了肥皂只好浮。',
        example: {
          q: '冷卻後的皂化液倒入飽和食鹽水，會看到什麼？',
          steps: ['肥皂難溶於飽和食鹽水\\(NaCl\\)。', '固體肥皂析出、浮在上層。'],
          ans: '肥皂浮出'
        }
      },

      /* ---------- 聚合物互動 ---------- */
      {
        sec: '5-2', secName: '生活應用',
        title: '滑到第 4 個：油脂是酯，不是聚合物',
        points: [
          '聚合物＝單體重複聚合：纖維素澱粉（葡萄糖）、蛋白質（胺基酸）。',
          '油脂＝甘油 C₃H₈O₃＋3脂肪酸：<b>三條即止</b>，不是接龍。',
          '問自己：滑到第幾個不是聚合物？'
        ],
        formula: { label: '聚合物', tex: '\\text{單體重複聚合}' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>物質 <span class="ival" id="pv">1/4</span></label>
            <input type="range" id="ps" min="1" max="4" step="1" value="1"></div></div>`;
          const subs = [
            { n: '纖維素', m: '單體葡萄糖 C₆H₁₂O₆', y: 1 },
            { n: '澱粉', m: '單體葡萄糖 C₆H₁₂O₆', y: 1 },
            { n: '蛋白質', m: '單體胺基酸', y: 1 },
            { n: '油脂', m: '甘油 C₃H₈O₃＋3脂肪酸（酯化）', y: 0 }
          ];
          const draw = () => {
            const i = Math.min(Math.max(+h.querySelector('#ps').value - 1, 0), subs.length - 1), s0 = subs[i];
            h.querySelector('#pv').textContent = (i + 1) + '/4';
            const col = s0.y ? GRN : RED, tag = s0.y ? '是聚合物' : '不是聚合物';
            let g = TX(110, 22, '聚合：單體接龍', { fs: 13, c: GRN, anchor: 'middle' });
            for (let k = 0; k < 5; k++) {
              const cx = 30 + k * 34;
              if (k > 0) g += SV.seg(30 + (k - 1) * 34 + 13, 70, cx - 13, 70, GRN, 2.5);
              g += `<circle cx="${cx}" cy="70" r="13" fill="rgba(5,150,105,.15)" stroke="${GRN}" stroke-width="2"/>`;
            }
            g += TX(212, 75, '…', { fs: 16, c: GRN });
            g += TX(110, 108, '單體×N，可無限接', { fs: 12, c: '#172033', anchor: 'middle' });
            g += SV.seg(240, 15, 240, 115, '#dce3ee', 1.5);
            g += TX(340, 22, '油脂：三叉即止', { fs: 13, c: RED, anchor: 'middle' });
            g += SV.seg(300, 35, 300, 105, RED, 4);
            [45, 70, 95].forEach(yy => { g += SV.seg(300, yy, 360, yy, AMB, 4); });
            g += TX(292, 50, '甘油', { fs: 11, c: '#172033', anchor: 'end' });
            g += TX(365, 74, '脂肪酸×3', { fs: 11, c: '#172033' });
            g += TX(340, 122, '三條即止', { fs: 12, c: '#172033', anchor: 'middle' });
            let s = BOX(40, 60, 360, 120, { fill: s0.y ? 'rgba(5,150,105,.07)' : 'rgba(225,29,72,.07)', stroke: col });
            s += TX(220, 108, s0.n + ' → ' + tag, { fs: 24, c: col, anchor: 'middle' });
            s += TX(220, 145, s0.m, { fs: 14, c: '#172033', anchor: 'middle' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 130', g) + svg('0 0 440 200', s);
          };
          h.querySelector('#ps').oninput = draw; draw();
        },
        caption: '看上圖：左邊能無限接龍，右邊三條即止——酯不是聚合。',
        example: {
          q: '下列有關聚合物的敘述何者錯誤？（纖維素／澱粉／蛋白質／油脂）',
          steps: ['前三者皆由單體重複聚合。', '油脂是酯化產物，不是聚合物。'],
          ans: '(D) 油脂是聚合物（錯）'
        }
      },

      /* ---------- 易錯對照 ---------- */
      {
        sec: '5-2', secName: '生活應用',
        title: '有機三個坑：含碳即有機、肥皂溶油、油脂聚合',
        points: [
          '含碳先查<span class="k">例外</span>：CO₂、碳酸鹽、HCN 是無機。',
          '肥皂去汙靠<span class="k">乳化</span>，不是把油溶解掉。',
          '油脂是<span class="k">酯</span>，不是聚合物。'
        ],
        visual: (h) => {
          h.innerHTML = xo([
            ['含碳就是有機化合物', '先查例外：CO、CO₂、碳酸鹽、HCN 屬無機'],
            ['肥皂把油汙溶解掉', '親油端親水端乳化帶走，非真正溶解'],
            ['油脂由脂肪酸聚合而成', '油脂是甘油＋3脂肪酸酯化，無重複單元']
          ]);
        },
        caption: '三坑填平：查例外、認乳化、辨酯與聚合。',
        example: {
          q: '碳酸鈉（Na₂CO₃）是有機物嗎？為什麼？',
          steps: ['含碳，但屬碳酸鹽類。', '碳酸鹽是無機例外。'],
          ans: '不是，是無機物'
        }
      }

    ]
  });
})();
