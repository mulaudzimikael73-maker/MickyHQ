(()=>{"use strict";const W="https://lizzyos-notifications.mulaudzimikael73.workers.dev/",$=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));let key="",game=null,selected=null;
const api=async(action,body={})=>{const r=await fetch(W+"?action="+encodeURIComponent(action),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...body,hqKey:key}),cache:"no-store"});const d=await r.json().catch(()=>({}));if(!r.ok||d.success===false)throw new Error(d.error||`Request failed (${r.status})`);return d};
function show(v){document.querySelectorAll(".view").forEach(x=>x.classList.add("hidden"));$(v).classList.remove("hidden");$("viewTitle").textContent=v==="letters"?"Letters from Lizzy":v==="annoy"?"😈 Annoy Lizzy":v==="mood"?"💗 My Mood":v==="lessons"?"🧠 Lizzy Lessons":"Mikael × Lizzy Chess";if(v==="letters")loadLetters();else if(v==="annoy")loadAnnoy();else if(v==="mood")loadMood();else if(v==="lessons")loadLessons();else loadChess()}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");show(b.dataset.view)});document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
$("loginBtn").onclick=async()=>{key=$("hqKey").value.trim();if(!key)return;$("loginStatus").textContent="Checking…";try{await api("hq_letters");$("login").classList.add("hidden");$("app").classList.remove("hidden");loadLetters();loadChess()}catch(e){$("loginStatus").textContent=e.message;key=""}};$("hqKey").onkeydown=e=>{if(e.key==="Enter")$("loginBtn").click()};$("logoutBtn").onclick=()=>{key="";$("app").classList.add("hidden");$("login").classList.remove("hidden");$("hqKey").value=""};
async function loadLetters(){try{const d=await api("hq_letters");$("lettersList").innerHTML=d.letters?.length?d.letters.slice().reverse().map(l=>`<article class="letter ${l.status==="unread"?"unread":""}"><h3>💌 ${esc(l.subject||"A letter from Lizzy")}</h3><div class="meta">${esc(l.from||"Lizzy")} · ${new Date(l.createdAt).toLocaleString()}</div><div class="letter-body">${esc(l.text)}</div>${l.reply?`<div class="reply"><b>🖤 Your reply</b><br>${esc(l.reply)}</div>`:`<div class="replyBox"><textarea data-reply="${esc(l.id)}" placeholder="Reply to Lizzy…"></textarea><button class="primary" data-reply-btn="${esc(l.id)}">Send Reply ❤️</button></div>`}</article>`).join(""):`<div class="card empty">No letters yet. When Lizzy writes, her letter will appear here.</div>`;document.querySelectorAll("[data-reply-btn]").forEach(b=>b.onclick=()=>reply(b.dataset.reply));}catch(e){$("lettersList").innerHTML=`<div class="card err">${esc(e.message)}</div>`}}
async function reply(id){const t=document.querySelector(`[data-reply="${CSS.escape(id)}"]`);if(!t?.value.trim())return;try{await api("reply_letter",{id,reply:t.value.trim()});loadLetters()}catch(e){alert(e.message)}}$("refreshLetters").onclick=loadLetters;$("clearLetters").onclick=async()=>{if(!confirm("Clear ALL letters AND Lizzy's replies inbox? This can't be undone."))return;try{await api("clear_letters");await api("clear_messages");loadLetters()}catch(e){alert(e.message)}};
const glyph={p:"♟",r:"♜",n:"♞",b:"♝",q:"♛",k:"♚",P:"♙",R:"♖",N:"♘",B:"♗",Q:"♕",K:"♔"};function render(){const b=$("chessBoard");b.innerHTML="";if(!game)return;const bd=game.board();for(let r=0;r<8;r++)for(let c=0;c<8;c++){const sq=String.fromCharCode(97+c)+(8-r),p=bd[r][c],x=document.createElement("button");x.className="sq "+((r+c)%2?"dark":"light");if(selected===sq)x.classList.add("selected");if(selected)try{if(game.moves({square:selected,verbose:true}).some(m=>m.to===sq))x.classList.add("legal")}catch{}x.textContent=p?(p.color==="w"?glyph[p.type.toUpperCase()]:glyph[p.type]):"";x.onclick=()=>move(sq);b.appendChild(x)}$("chessTurn").textContent=game.turn()==="b"?"🖤 Your turn — choose a black piece":"🌸 Lizzy's turn — waiting for her move";$("moveHistory").textContent=game.pgn()||"No moves yet."}
async function move(sq){if(!game)return;if(!selected){const p=game.get(sq);if(!p||p.color!=="b")return;selected=sq;render();return}try{const m=game.move({from:selected,to:sq,promotion:"q"});if(!m){selected=sq;render();return}selected=null;render();await api("chess_move",{fen:game.fen(),pgn:game.pgn(),turn:game.turn(),lastMove:m.san})}catch(e){alert(e.message);loadChess()}}
async function loadChess(){try{const d=await api("chess_state");game=game||new Chess();if(d.state?.fen&&d.state.fen!=="start")game.load(d.state.fen);else game.reset();selected=null;render();$("helpRequests").innerHTML=d.requests?.length?d.requests.slice().reverse().map(r=>`<div class="request"><b>Lizzy:</b> ${esc(r.text)}<button data-resolve="${esc(r.id)}">Mark handled</button></div>`).join(""):"No requests.";document.querySelectorAll("[data-resolve]").forEach(b=>b.onclick=async()=>{await api("resolve_chess_help",{id:b.dataset.resolve});loadChess()})}catch(e){$("chessBoard").innerHTML=`<div class="empty">${esc(e.message)}</div>`}}
$("resetChess").onclick=async()=>{if(confirm("Start a new chess game?")){await api("chess_reset");game=new Chess();loadChess()}};$("refreshChess").onclick=loadChess;$("sendHint").onclick=async()=>{const text=$("hintText").value.trim();if(!text)return;try{await api("send_chess_hint",{text});$("hintText").value="";alert("Hint sent to Lizzy ❤️")}catch(e){alert(e.message)}};

// Lizzy Lessons — she writes, you grade
async function loadLessons(){
  try{
    const d=await api("hq_lizzy_lessons");
    $("lessonsList").innerHTML=d.lessons?.length?d.lessons.map(l=>`<article class="letter"><h3>🧠 ${esc(l.text)}</h3><div class="meta">${new Date(l.createdAt).toLocaleString()}</div>${l.status==="rated"?`<div class="reply"><b>${l.rating==="helpful"?"👍 Helpful":"👎 Absolutely Useless"}</b>${l.note?`<br>${esc(l.note)}`:""}</div>`:`<div class="replyBox"><textarea data-lesson-note="${esc(l.id)}" placeholder="Optional note to Lizzy…"></textarea><button class="primary" data-rate-helpful="${esc(l.id)}">👍 Helpful</button> <button class="danger" data-rate-useless="${esc(l.id)}">👎 Useless</button></div>`}</article>`).join(""):`<div class="card empty">No lessons yet. When Lizzy writes one, it'll appear here.</div>`;
    document.querySelectorAll("[data-rate-helpful]").forEach(b=>b.onclick=()=>rateLesson(b.dataset.rateHelpful,"helpful"));
    document.querySelectorAll("[data-rate-useless]").forEach(b=>b.onclick=()=>rateLesson(b.dataset.rateUseless,"useless"));
  }catch(e){$("lessonsList").innerHTML=`<div class="card err">${esc(e.message)}</div>`}
}
async function rateLesson(id,rating){
  const t=document.querySelector(`[data-lesson-note="${CSS.escape(id)}"]`);
  try{await api("rate_lizzy_lesson",{id,rating,note:t?.value.trim()||""});loadLessons()}catch(e){alert(e.message)}
}
$("refreshLessons").onclick=loadLessons;
$("clearLessons").onclick=async()=>{if(!confirm("Clear ALL of Lizzy's lessons? This can't be undone."))return;try{await api("clear_lizzy_lessons");loadLessons()}catch(e){alert(e.message)}};

// Annoy Lizzy
function fmtCooldown(until){const ms=new Date(until).getTime()-Date.now();if(ms<=0)return null;const m=Math.ceil(ms/60000);return `${m} minute${m===1?"":"s"}`}
async function loadAnnoy(){
  try{
    const d=await api("annoy_state");
    const left=d.cooldownUntil?fmtCooldown(d.cooldownUntil):null;
    document.querySelectorAll(".annoy-btn").forEach(b=>b.disabled=!!left);
    if(left)$("annoyStatus").textContent=`😤 Lizzy hit STOP ANNOYING ME — locked out for ${left}.`;
    else $("annoyStatus").textContent="✅ Ready. Pick an effect below.";
  }catch(e){$("annoyStatus").textContent=e.message}
}
document.querySelectorAll(".annoy-btn").forEach(b=>b.onclick=async()=>{
  const effect=b.dataset.effect;
  $("annoyResult").textContent="Sending…";
  try{
    const d=await api("annoy_trigger",{effect});
    if(d.cooldown){$("annoyResult").textContent=`😤 On cooldown until ${new Date(d.until).toLocaleTimeString()}.`;loadAnnoy();return}
    $("annoyResult").textContent=`😈 Sent: ${d.effect.replace(/_/g," ")} — it'll fire next time her device polls (a few seconds).`;
  }catch(e){$("annoyResult").textContent=e.message}
});
$("annoyRefreshBtn").onclick=loadAnnoy;
const annoyResetBtn=$("annoyResetBtn");
if(annoyResetBtn)annoyResetBtn.onclick=async()=>{
  if(!confirm("Clear the cooldown Lizzy set with STOP ANNOYING ME?"))return;
  try{await api("annoy_reset");$("annoyResult").textContent="⏱️ Cooldown cleared.";loadAnnoy()}
  catch(e){$("annoyResult").textContent=e.message}
};

// My Mood
/* Keep in sync with MIKAEL_MOOD_OPTIONS in cloudflare-worker.js so the
   quick-pick buttons here match the /mood Telegram buttons. */
const MOOD_OPTIONS=[
  ["happy","😊 Happy","Feeling happy today 😊"],
  ["tired","🥱 Tired","Feeling tired 🥱"],
  ["dramatic","🎭 Dramatic","Feeling dramatic 🎭"],
  ["soft","🥹 Soft","Feeling soft today 🥹"],
  ["annoyed","🙄 Annoyed","Feeling a bit annoyed 🙄"],
  ["missing","🥺 Missing Lizzy","Missing Lizzy 🥺"],
  ["sad","😢 Sad","Feeling sad 😢"],
  ["indifferent","😐 Indifferent","Feeling indifferent 😐"],
  ["emotional","🥹 Emotional","Feeling emotional 🥹"],
  ["bored","🥱 Bored","Feeling bored 🥱"],
  ["batman","🦇 Feeling Like Batman","Feeling like Batman 🦇"],
  ["excited","🤩 Excited","Feeling excited 🤩"],
  ["funky","💃 Funky","Feeling funky 💃"]
];
if($("moodGrid"))$("moodGrid").innerHTML=MOOD_OPTIONS.map(([id,label])=>`<button class="annoy-btn" data-mood="${id}">${label}</button>`).join("");
async function postMood(text){
  const r=await fetch(W,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"mikael_mood_set",text,source:"hq"}),cache:"no-store"});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||d.success===false)throw new Error(d.error||`Request failed (${r.status})`);
  return d;
}
async function loadMood(){
  try{
    const r=await fetch(W+"?mikaelMood=1",{cache:"no-store"});
    const d=await r.json();
    const mood=d?.success?d.mood:null;
    $("moodCurrent").textContent=mood?`Current mood: ${mood.text}`:"No mood set yet.";
  }catch(e){$("moodCurrent").textContent=e.message}
}
document.querySelectorAll("[data-mood]").forEach(b=>b.onclick=async()=>{
  const opt=MOOD_OPTIONS.find(([id])=>id===b.dataset.mood);
  if(!opt)return;
  $("moodResult").textContent="Setting…";
  try{await postMood(opt[2]);$("moodResult").textContent=`💗 Mood set: ${opt[1]}`;loadMood()}
  catch(e){$("moodResult").textContent=e.message}
});
$("moodSendBtn")?.addEventListener("click",async()=>{
  const text=$("moodText").value.trim();
  if(!text)return;
  $("moodResult").textContent="Setting…";
  try{await postMood(text);$("moodText").value="";$("moodResult").textContent="💗 Mood set.";loadMood()}
  catch(e){$("moodResult").textContent=e.message}
});

// ---- MizzyGram Control Room ----
const MG_ACCTS=[["mikael","🖤","#4c4c72","#181828"],["bankofmicky","💰","#2f8f5b","#123322"],["bowlingfederation","🎳","#ffb84c","#e8317f"],["chocolateemergency","🍫","#8a5a2c","#3a220f"],["mickysdailynews","📰","#c9c9d6","#4a4a5a"],["thepresident","🏛️","#2a4a9a","#0b1633"]];
const MG_REACTS=[["love","❤️"],["funny","😂"],["attitude","😈"],["cute","😍"],["fire","🔥"],["bowling","🎳"],["chocolate","🍫"],["suspicious","👀"]];
const MG_R=Object.fromEntries(MG_REACTS);
let mgAcct="mikael",mgAud="everyone",mgSnap=null,mgPhotoData=null,mgReply=null;
const mgInfo=id=>MG_ACCTS.find(a=>a[0]===id)||(id==="lizzy"?["lizzy","💗","#ff8fce","#7a35dc"]:[id,"🙂","#888","#444"]);
const mgAv=id=>{const a=mgInfo(id);return `<span class="mgAva" style="background:linear-gradient(135deg,${a[2]},${a[3]})">${a[1]}</span>`};
const mgTag=t=>esc(t).replace(/#(\w+)/g,'<b class="mgTag">#$1</b>');
const mgAgo=t=>{const s=(Date.now()-t)/1000;return s<60?"now":s<3600?Math.floor(s/60)+"m":s<86400?Math.floor(s/3600)+"h":Math.floor(s/86400)+"d"};
const mgTags=()=>$("mgTags").value.split(/[\s,]+/).filter(Boolean).map(t=>"#"+t.replace(/^#+/,"")).join(" ");
function mgToast(m){let t=$("mgToast");if(!t){t=document.createElement("div");t.id="mgToast";document.body.appendChild(t)}t.textContent=m;t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),2400)}
const mgPush=command=>api("mg_hq_push",{command});
function mgImage(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{const k=Math.min(1,900/Math.max(i.naturalWidth,i.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(i.naturalWidth*k);c.height=Math.round(i.naturalHeight*k);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL("image/jpeg",.8))};i.onerror=()=>rej(new Error("Couldn't read that photo."));i.src=u})}

function mgAccounts(){
  $("mgAccounts").innerHTML=MG_ACCTS.map(a=>`<button class="mgAcct ${a[0]===mgAcct?"on":""}" data-acct="${a[0]}">${mgAv(a[0])}<small>${a[0]==="mikael"?"Mikael":"@"+a[0]}</small></button>`).join("");
}
function mgPreview(){
  const a=mgInfo(mgAcct),cap=($("mgCaption").value+" "+mgTags()).trim(),mood=$("mgMood").value;
  const img=mgPhotoData?`<img src="${mgPhotoData}" alt="">`:`<div class="mgCardArt" style="background:linear-gradient(135deg,${a[2]},${a[3]})"><i>${a[1]}</i><p>${esc(($("mgCaption").value||"Your caption shows up here").slice(0,80))}</p></div>`;
  $("mgPreview").innerHTML=`<div class="mgPH">${mgAv(mgAcct)}<b>${a[0]}</b>${mood?`<small class="mgMood">${esc(mood)}</small>`:""}${mgAud==="lizzy"?`<small class="mgMood">💗 just for Lizzy</small>`:""}<time>now</time></div><div class="mgImg">${img}</div><div class="mgIcons"><span>♡</span><span>💬</span><span>➤</span><span class="r">🔖</span></div><div class="mgCap"><b>${a[0]}</b> ${mgTag(cap)}</div>`;
}
function mgFeed(){
  const posts=mgSnap?.posts||[];
  $("mgLive").textContent=mgSnap?"● synced "+new Date(mgSnap.at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"○ no sync yet";
  $("mgLive").classList.toggle("on",!!mgSnap);
  if(!posts.length){$("mgFeed").innerHTML='<div class="mgEmpty">No posts synced yet.<br>Open MizzyGram on Lizzy\'s device.</div>';return}
  $("mgFeed").innerHTML=posts.slice(0,12).map(p=>{
    const rx=Object.entries(p.rx||{}).map(([r,n])=>`${MG_R[r]||""} ${n}`).join("  "),cs=(p.comments||[]).slice(-6);
    return `<article class="mgPost" data-p="${esc(p.id)}"><div class="mgPH">${mgAv(p.userId)}<b>${esc(p.userId)}</b>${p.mood?`<small class="mgMood">${esc(p.mood)}</small>`:""}<time>${mgAgo(p.createdAt)}</time></div>
      <div class="mgCap">${mgTag(p.caption||"📷 photo")}</div>
      <div class="mgRx">${rx||'<span class="mgDim">No reactions yet</span>'}</div>
      <div class="mgBar"><button class="mgLike ${p.mine==="love"?"on":""}" data-like="${esc(p.id)}">${p.mine==="love"?"❤️ Liked":"🤍 Like"}</button><span class="mgStrip">${MG_REACTS.map(([r,e])=>`<button class="${p.mine===r?"on":""}" data-react="${r}" data-id="${esc(p.id)}" aria-label="${r}">${e}</button>`).join("")}</span></div>
      ${cs.map(c=>`<div class="mgC ${c.parentId?"reply":""}"><span><b>@${esc(c.userId)}</b> ${c.pinned?"📌 ":""}${esc(c.text)}</span><span class="mgCA"><button data-reply="${esc(c.id)}" data-id="${esc(p.id)}" data-u="${esc(c.userId)}">Reply</button><button data-pin="${esc(c.id)}" data-id="${esc(p.id)}">${c.pinned?"Pinned":"📌 Pin"}</button></span></div>`).join("")}
      <form class="mgCmt" data-id="${esc(p.id)}"><input maxlength="300" placeholder="${mgReply&&mgReply.p===p.id?"Replying to @"+esc(mgReply.u)+"…":"Comment as Mikael…"}"><button class="primary">Send</button></form></article>`;
  }).join("");
}
async function mgLoad(){
  try{const s=(await api("mg_snapshot_get")).snapshot;if(s&&(!mgSnap||s.at!==mgSnap.at)){mgSnap=s;if(!document.activeElement.closest?.("#mgFeed"))mgFeed()}else if(!mgSnap)mgFeed()}
  catch(e){$("mgLive").textContent="○ "+e.message}
}
const mgPost=id=>(mgSnap?.posts||[]).find(p=>p.id===id);
mgAccounts();mgPreview();mgFeed();
$("mgMood").innerHTML='<option value="">🙂 Mood: none</option>'+MOOD_OPTIONS.map(([id,l])=>`<option value="${esc(l)}">${esc(l)}</option>`).join("");
$("mgAccounts").onclick=e=>{const b=e.target.closest("[data-acct]");if(b){mgAcct=b.dataset.acct;mgAccounts();mgPreview()}};
$("mgAud").onclick=e=>{const b=e.target.closest("[data-aud]");if(!b)return;mgAud=b.dataset.aud;document.querySelectorAll("#mgAud button").forEach(x=>x.classList.toggle("on",x===b));mgPreview()};
["mgCaption","mgTags","mgMood"].forEach(id=>$(id).addEventListener("input",mgPreview));
$("mgPhoto").onchange=async e=>{const f=e.target.files[0];if(!f){mgPhotoData=null}else{try{mgPhotoData=await mgImage(f)}catch(x){mgToast(x.message)}}$("mgPhotoLbl").textContent=mgPhotoData?"📷 Change photo":"📷 Add a photo";mgPreview()};
$("mgPost").onclick=async()=>{
  const caption=$("mgCaption").value.trim();
  if(!caption&&!mgPhotoData&&!mgTags()){$("mgPostResult").textContent="Add a photo, caption or hashtags first.";return}
  $("mgPostResult").textContent="Sending…";
  try{
    await mgPush({kind:"post",account:mgAcct,image:mgPhotoData,caption,tags:$("mgTags").value,mood:$("mgMood").value,audience:mgAud});
    $("mgPostResult").textContent="";mgToast("✅ Queued — posting as "+mgAcct);
    $("mgCaption").value="";$("mgTags").value="";$("mgPhoto").value="";mgPhotoData=null;$("mgPhotoLbl").textContent="📷 Add a photo";mgPreview();
  }catch(e){$("mgPostResult").textContent=e.message}
};
document.querySelectorAll("[data-mg-event]").forEach(b=>b.onclick=async()=>{
  b.classList.add("fired");setTimeout(()=>b.classList.remove("fired"),700);
  try{await mgPush({kind:"event",event:b.dataset.mgEvent});mgToast("🎬 Triggered: "+b.querySelector("b").textContent)}catch(e){$("mgEvResult").textContent=e.message}
});
$("mgFeed").onclick=async e=>{
  const t=e.target.closest("button");if(!t)return;
  try{
    if(t.dataset.like){await mgPush({kind:"like",postId:t.dataset.like});const p=mgPost(t.dataset.like);if(p)p.mine="love";mgToast("❤️ Sent")}
    else if(t.dataset.react){await mgPush({kind:"react",postId:t.dataset.id,reaction:t.dataset.react});const p=mgPost(t.dataset.id);if(p)p.mine=t.dataset.react;mgToast(MG_R[t.dataset.react]+" Sent")}
    else if(t.dataset.reply){mgReply={p:t.dataset.id,c:t.dataset.reply,u:t.dataset.u}}
    else if(t.dataset.pin){await mgPush({kind:"pin",postId:t.dataset.id,commentId:t.dataset.pin});const p=mgPost(t.dataset.id);p?.comments.forEach(c=>c.pinned=c.id===t.dataset.pin);mgToast("📌 Pinned")}
    else return;
    mgFeed();
  }catch(x){mgToast(x.message)}
};
$("mgFeed").onsubmit=async e=>{
  e.preventDefault();const f=e.target,text=f.querySelector("input").value.trim();if(!text)return;
  const id=f.dataset.id,r=mgReply&&mgReply.p===id?mgReply:null;
  try{
    await mgPush(r?{kind:"reply",postId:id,parentId:r.c,text}:{kind:"comment",postId:id,text});
    const p=mgPost(id);p?.comments.push({id:"tmp"+Date.now(),userId:"mikael",text,parentId:r?r.c:null});
    mgReply=null;mgToast("💬 Sent — lands in ~10s");mgFeed();
  }catch(x){mgToast(x.message)}
};
$("mgRefresh").onclick=()=>{mgSnap=null;mgLoad()};
document.querySelector('[data-view="mizzygram"]').addEventListener("click",()=>{$("viewTitle").textContent="📸 MizzyGram";mgLoad()});
setInterval(()=>{if(!$("mizzygram").classList.contains("hidden")&&!document.hidden)mgLoad()},15000);
})();
