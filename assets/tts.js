/* 學習小站共用朗讀器：用瀏覽器內建語音（Web Speech API）朗讀頁面上的文字。
 *
 * 為什麼：Neuralreader 個人方案（Personal Pro）生成的 mp3 只能私下收聽，條款明文不得用於網站，
 * 所以網站版不放 mp3，改由使用者自己裝置上的語音朗讀（2026-11-28）。
 *
 * 用法（sync_english_games.py 會自動加到有 tts 設定的頁面）：
 *   <script>window.TTS_CFG = {lang: "en-US", rate: 0.9, replace: ".audio-zone",
 *                             text: function (ctl) { return ctl.closest("article").querySelectorAll(".script p"); }};</script>
 *   <script src="../assets/tts.js"></script>
 * 頁面上每個 <audio>（含之後由 JS 動態產生的）都會換成朗讀控制列；
 * replace 有給時，換掉的是 audio 最近的那個外框。text(ctl) 在按下播放時才計算，回傳元素清單或字串陣列。
 */
(function () {
  var CFG = window.TTS_CFG || {};
  var LANG = CFG.lang || "en-US";
  var ZH = LANG.indexOf("zh") === 0;
  var synth = window.speechSynthesis;
  var current = null;                       // 正在念的控制列狀態

  var css = document.createElement("style");
  css.textContent =
    ".tts-box{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0;padding:8px 10px;border-radius:10px;" +
    "border:1px solid rgba(127,127,127,.35);background:rgba(127,127,127,.08);font-size:14px;line-height:1.4;color:inherit}" +
    ".tts-box button,.tts-box select{font:inherit;font-size:14px;padding:5px 12px;border-radius:8px;cursor:pointer;" +
    "border:1px solid rgba(127,127,127,.5);background:rgba(127,127,127,.12);color:inherit}" +
    ".tts-box button.tts-play{font-weight:700}" +
    ".tts-box .tts-st{font-size:13px;opacity:.8;flex:1 1 160px}" +
    ".tts-reading{background:rgba(250,204,21,.28)!important;border-radius:4px;transition:background .2s}";
  document.head.appendChild(css);

  function pickVoice() {
    if (!synth) return null;
    var vs = synth.getVoices(), want = LANG.toLowerCase().replace("_", "-");
    function norm(v) { return (v.lang || "").toLowerCase().replace("_", "-"); }
    var exact = vs.filter(function (v) { return norm(v) === want; });
    var same = vs.filter(function (v) { return norm(v).indexOf(want.slice(0, 2)) === 0; });
    var pool = exact.length ? exact : same;
    var good = pool.filter(function (v) { return /google|natural|neural|samantha|mei-jia|meijia|hanhan|yating/i.test(v.name); });
    return good[0] || pool[0] || null;
  }

  // 一段文字切成短句（Chrome 念太長的單句會中途停掉）
  function chunks(s) {
    s = s.replace(/\s+/g, " ").trim();
    if (!s) return [];
    var parts = s.match(ZH ? /[^。！？；!?;]+[。！？；!?;」』”）)]*/g : /[^.!?;]+[.!?;"'”’)]*\s*/g) || [s];
    var out = [];
    parts.forEach(function (p) {
      p = p.trim();
      while (p.length > 180) {
        var cut = Math.max(p.lastIndexOf(ZH ? "，" : ", ", 180), p.lastIndexOf(ZH ? "、" : " ", 180));
        if (cut < 40) cut = 180;
        out.push(p.slice(0, cut + 1)); p = p.slice(cut + 1).trim();
      }
      if (p) out.push(p);
    });
    return out;
  }

  function collect(ctl) {
    var got = [];
    try { got = CFG.text ? CFG.text(ctl) : []; } catch (e) { got = []; }
    var items = [];
    Array.prototype.forEach.call(got || [], function (x) {
      var el = typeof x === "string" ? null : x;
      var t = typeof x === "string" ? x : (x.getAttribute && x.getAttribute("data-tts-say")) || x.textContent;
      chunks(t || "").forEach(function (c) { items.push({ el: el, text: c }); });
    });
    return items;
  }

  function mark(st, el) {
    if (st.markEl) st.markEl.classList.remove("tts-reading");
    st.markEl = el || null;
    if (el) el.classList.add("tts-reading");
  }

  function stop(st, keepPos) {
    if (!st) return;
    st.token++;
    if (synth) synth.cancel();
    mark(st, null);
    st.playing = false;
    if (!keepPos) st.pos = 0;
    st.play.textContent = keepPos ? "▶ 繼續" : "▶ 朗讀";
    if (current === st && !keepPos) current = null;
  }

  // 一次把剩下的句子都排進佇列（iOS 只允許在點擊當下開始念）
  function speakFrom(st) {
    var tok = ++st.token, voice = pickVoice(), rate = parseFloat(st.speed.value);
    synth.cancel();
    st.items.slice(st.pos).forEach(function (it, k) {
      var idx = st.pos + k, u = new SpeechSynthesisUtterance(it.text);
      u.lang = LANG; if (voice) u.voice = voice; u.rate = rate;
      u.onstart = function () { if (tok !== st.token) return; st.pos = idx; mark(st, it.el); st.st.textContent = "朗讀中 " + (idx + 1) + "／" + st.items.length; };
      u.onend = function () {
        if (tok !== st.token || idx !== st.items.length - 1) return;
        mark(st, null); st.playing = false; st.pos = 0; st.play.textContent = "▶ 再聽一次"; st.st.textContent = "念完了";
      };
      synth.speak(u);
    });
  }

  function onPlay(st) {
    if (!synth) return;
    if (st.playing) { stop(st, true); st.st.textContent = "已暫停，按「繼續」從這句接著念"; return; }
    if (current && current !== st) stop(current);
    current = st;
    if (!st.pos || !st.items.length) st.items = collect(st.box);
    if (!st.items.length) { st.st.textContent = "找不到要念的文字"; return; }
    st.playing = true; st.play.textContent = "⏸ 暫停";
    speakFrom(st);
  }

  function build(audio) {
    if (audio.getAttribute("data-tts-done")) return;
    audio.setAttribute("data-tts-done", "1");
    try { audio.pause(); audio.removeAttribute("src"); } catch (e) {}
    var target = (CFG.replace && audio.closest(CFG.replace)) || audio;
    var box = document.createElement("div");
    box.className = "tts-box";
    var st = { box: box, items: [], pos: 0, token: 0, playing: false };
    if (!synth || !window.SpeechSynthesisUtterance) {
      box.innerHTML = '<span class="tts-st">這個瀏覽器不支援朗讀，請改用手機或電腦的 Chrome、Safari 開啟。</span>';
      target.parentNode.replaceChild(box, target);
      return;
    }
    st.play = document.createElement("button"); st.play.type = "button"; st.play.className = "tts-play"; st.play.textContent = "▶ 朗讀";
    var again = document.createElement("button"); again.type = "button"; again.textContent = "⏮ 從頭";
    st.speed = document.createElement("select"); st.speed.setAttribute("aria-label", "朗讀速度");
    var def = String(CFG.rate || 1);
    [["0.7", "0.7x 慢"], ["0.85", "0.85x"], ["0.9", "0.9x"], ["1", "1x"], ["1.15", "1.15x 快"]].forEach(function (o) {
      var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; if (o[0] === def) op.selected = true; st.speed.appendChild(op);
    });
    st.st = document.createElement("span"); st.st.className = "tts-st";
    st.st.textContent = ZH ? "用這台裝置內建的語音朗讀，聲音因手機、電腦而不同" : "用這台裝置內建的英文語音朗讀，聲音因手機、電腦而不同";
    st.play.onclick = function () { onPlay(st); };
    again.onclick = function () { stop(st); st.items = []; onPlay(st); };
    st.speed.onchange = function () { if (st.playing) speakFrom(st); };
    box.appendChild(st.play); box.appendChild(again); box.appendChild(st.speed); box.appendChild(st.st);
    target.parentNode.replaceChild(box, target);
  }

  function scan(root) {
    if (root.tagName === "AUDIO") return build(root);
    if (root.querySelectorAll) Array.prototype.forEach.call(root.querySelectorAll("audio"), build);
  }

  function init() {
    scan(document);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) { Array.prototype.forEach.call(m.addedNodes, function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(document.body, { childList: true, subtree: true });
    if (synth) { synth.getVoices(); if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", function () {}); }
    window.addEventListener("pagehide", function () { if (current) stop(current); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
