/* Tiny Victories in MAIN HQ only. Uses authenticated MikaelHQApi; no production fallback. */
(()=>{'use strict';const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const presets=[['Outstanding Kindness','For making an ordinary day a little brighter.','silver'],['Annoyingly Adorable','For demonstrating utterly unreasonable levels of cuteness.','gold'],['Supreme Waffleologist','For turning absolute nonsense into a believable academic argument.','gold'],['Professional Hater','For sustained excellence in suspiciously unnecessary criticism.','bronze'],['Made My Day','For brightening a difficult day without even trying.','silver'],['Most Dramatic Individual','For elevating the smallest incident to an international emergency.','bronze'],['Batman Dream Guardian','For saving the city and protecting a certain Lady Lady even in her dreams.','gold'],['A National Treasure','For being a remarkable human and a very lovely menace.','gold']];let state=null,view='nominate',busy=false,awardId=null,responseKind=null;const root=()=>document.getElementById('tinyHQMount');async function api(a,d={}){if(typeof window.MikaelHQApi!=='function')throw Error('Unlock MAIN HQ first.');const r=await window.MikaelHQApi(a,d);if(r.success===false)throw Error(r.error||'production Worker error');return r}const rid=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random();const awards=()=>state?.tinyAwards||[];const date=s=>s?new Date(s).toLocaleDateString('en-ZA',{dateStyle:'medium'}):'—';
async function load(){if(!root())return;root().innerHTML='<div class="thqPaper">Loading Tiny Victories…</div>';try{const r=await api('uom_hq_state');state=r.state;render()}catch(e){root().innerHTML='<p class="thqError">'+esc(e.message)+'</p>'}}
function tabs(){return `<div class="thqTabs">${[['nominate','✦ Give an Award'],['mikael','👑 My Cabinet'],['lizzy','💝 Lizzy’s Cabinet'],['both','❤️ Our Victories'],['all','📜 All Awards']].map(([v,l])=>`<button data-thq-tab="${v}" class="${view===v?'current':''}">${l}</button>`).join('')}</div>`}
function form(){return `<section class="thqPaper"><h3>🏅 Issue a Tiny Victory</h3><p>Award Lizzy, yourself or both of you for anything. Awards appear immediately with a full readable certificate. Self-awards carry a <strong>Self-Proclaimed</strong> stamp.</p><div class="thqPresets">${presets.map((p,i)=>`<button data-thq-preset="${i}">${esc(p[0])}</button>`).join('')}</div><form id="thqNomination"><div class="thqGrid"><label>Recipient<select name="recipient"><option value="Lizzy">Lizzy</option><option value="Mikael">Mikael</option><option value="Both">Mikael & Lizzy</option></select></label><label>Recognition level<select name="tier"><option value="bronze">Bronze — Little Win</option><option value="silver">Silver — Lovely Achievement</option><option value="gold">Gold — Presidential Excellence</option></select></label></div><label>Custom title<input name="title" maxlength="100" required placeholder="An Outstanding Lady Lady"></label><label>Official citation<textarea name="reason" rows="4" maxlength="700" required minlength="5" placeholder="Presented for the extraordinary achievement of…"></textarea></label><button class="thqPrimary" type="submit">🎉 Award Immediately</button></form><p>No automatic MB rewards, and no approval queue.</p></section>`}
function list(){const filter=view==='all'?null:view==='both'?'Both':view==='mikael'?'Mikael':'Lizzy';const xs=awards().filter(a=>!filter||a.to===filter).slice().reverse();return `<section class="thqPaper"><h3>🏆 ${view==='all'?'Official Tiny Victories Register':view==='both'?'Our Shared Victories':view==='mikael'?'Mikael’s Presidential Cabinet':'Lizzy’s Tiny Victories'}</h3><p>Open any award to read the full certificate, acceptance speeches and objections.</p><div class="thqAwards">${xs.map(a=>`<button data-thq-read="${esc(a.id)}" class="thqAward"><span>${a.tier==='gold'?'🏆':a.tier==='silver'?'🥈':'🥉'}</span><b>${esc(a.title)}</b><small>${esc(a.to)} · Nominated by ${esc(a.nominatedBy)}<br>${date(a.issuedAt)}</small>${a.selfProclaimed?'<em>SELF-PROCLAIMED</em>':''}${a.disputed?'<em>UNDER DISPUTE</em>':''}${a.endorsedBy?'<em>ENDORSED</em>':''}</button>`).join('')||'<p>Nothing awarded here yet.</p>'}</div></section>`}
function render(){const r=root();if(!r||!state)return;r.innerHTML=`<header class="thqHero"><span>OFFICE OF PRESIDENT MIKAEL · MAIN HQ</span><h2>🏅 Department of Tiny Victories</h2><p>Instant nominations. Outrageous certificates. Optional dramatic acceptance speeches.</p><small>${awards().length} awards awarded · ${awards().filter(a=>a.to==='Mikael').length} in your cabinet · ${awards().filter(a=>a.to==='Lizzy').length} in Lizzy’s</small></header>${tabs()}<p id="tinyHQStatus" role="status"></p>${view==='nominate'?form():list()}`;r.querySelectorAll('[data-thq-tab]').forEach(b=>b.onclick=()=>{view=b.dataset.thqTab;render()});r.querySelectorAll('[data-thq-preset]').forEach(b=>b.onclick=()=>{const p=presets[+b.dataset.thqPreset],f=r.querySelector('#thqNomination');f.elements.title.value=p[0];f.elements.reason.value=p[1];f.elements.tier.value=p[2]});r.querySelector('#thqNomination')?.addEventListener('submit',nominate);r.querySelectorAll('[data-thq-read]').forEach(b=>b.onclick=()=>read(b.dataset.thqRead));}
function status(msg,bad=false){const x=document.getElementById('tinyHQStatus');if(x){x.textContent=msg;x.style.color=bad?'#b32946':'#237042'}}
async function nominate(e){e.preventDefault();if(busy)return;busy=true;const b=e.target.querySelector('[type=submit]');b.disabled=true;try{const p=Object.fromEntries(new FormData(e.target).entries());const d=await api('uom_hq_tv_nominate',{...p,requestId:rid()});state=d.state;view=p.recipient==='Both'?'both':p.recipient.toLowerCase();render();status('Award issued immediately! Stored in the correct cabinet.');read(d.award.id)}catch(ex){status(ex.message,true);b.disabled=false}finally{busy=false}}
function opts(a){
  const x=[];
  if(a.to==='Mikael'||a.to==='Both')x.push(['accept','🎤 Give an Acceptance Speech'],['fight','⚖️ Fight This Award']);
  if(a.selfProclaimed&&a.nominatedBy==='Lizzy')x.push(['endorse','💝 Endorse Lizzy’s Self-Award'],['challenge','⚖️ Challenge Her Claims']);
  return x;
}
function canReply(a,item){
  return item?.id&&item.by==='Lizzy'&&
    (a.nominatedBy==='Mikael'||a.to==='Mikael'||a.to==='Both'||a.selfProclaimed);
}
function replyBlock(a,x){
  const original=a.responses.find(z=>z.id===x.replyToId);
  const quote=original?`<div class="thqReplyContext">↳ In reply to ${esc(original.by)}: “${esc(original.comment.slice(0,160))}”</div>`:'';
  return `<div class="thqReply" id="reply-${esc(x.id)}"><b>${esc(x.by)} · ${esc(x.kind.toUpperCase())}</b><small>${date(x.at)}</small>${quote}<p>${esc(x.comment)}</p>${canReply(a,x)?`<button type="button" class="thqReplyButton" data-thq-reply-to="${esc(x.id)}">💬 Reply to Lizzy</button>`:''}</div>`;
}
function read(id){
  const a=awards().find(x=>x.id===id);if(!a)return;
  awardId=id;responseKind=null;replyToId=null;
  const r=root();
  r.innerHTML=`<div class="thqCertificate"><div class="thqCertHead">♛ THE REPUBLIC OF LIZZYOS ♛</div><p>✦ ─────── ✦ ─────── ✦</p><h2>OFFICIAL CERTIFICATE OF TINY VICTORY</h2><p>Officially presented to</p><h1>${esc(a.to==='Both'?'MIKAEL & LIZZY':a.to.toUpperCase())}</h1><h3>${esc(a.title)}</h3><blockquote>${esc(a.detail)}</blockquote><strong>${a.tier==='gold'?'🏆 GOLD':a.tier==='silver'?'🥈 SILVER':'🥉 BRONZE'} RECOGNITION</strong>${a.selfProclaimed?'<h4 class="thqStamped">SELF-PROCLAIMED EXCELLENCE</h4>':''}${a.endorsedBy?`<p>Officially endorsed by ${esc(a.endorsedBy)}</p>`:''}${a.disputed?'<h4 class="thqStamped">UNDER DISPUTE</h4>':''}<footer>Nominated by ${esc(a.nominatedBy)} · ${date(a.issuedAt)}<br><small>Official reference ${esc(a.id)}</small></footer></div>
    <section class="thqPaper"><h3>🎤 Acceptance Speeches, Replies and Disputes</h3><p id="thqConversationStatus" role="status" aria-live="polite"></p><div class="thqConversation">${(a.responses||[]).map(x=>replyBlock(a,x)).join('')||'<p>There are no official responses yet.</p>'}</div>
    <div class="thqTabs">${opts(a).map(([k,n])=>`<button type="button" data-thq-response="${k}">${n}</button>`).join('')}</div>
    <form id="thqResponse" class="thqHide"><label id="thqResponseTitle">Presidential statement<textarea name="comment" rows="4" maxlength="800" minlength="2" required></textarea></label><div class="thqResponseActions"><button class="thqPrimary" type="submit">Publish Response</button><button type="button" id="thqCancelResponse">Cancel</button></div></form>
    <button type="button" id="thqRefreshConversation">↻ Check for New Replies</button><button type="button" id="thqCounter">🔥 Counter-Award</button><button type="button" id="thqBack">← Back to Cabinet</button></section>`;
  r.querySelectorAll('[data-thq-response]').forEach(b=>b.onclick=()=>selectResponse(b.dataset.thqResponse,null,a));
  r.querySelectorAll('[data-thq-reply-to]').forEach(b=>b.onclick=()=>selectResponse('reply',b.dataset.thqReplyTo,a));
  r.querySelector('#thqResponse').addEventListener('submit',respond);
  r.querySelector('#thqCancelResponse').onclick=()=>{responseKind=null;replyToId=null;r.querySelector('#thqResponse').classList.add('thqHide')};
  r.querySelector('#thqRefreshConversation').onclick=()=>refreshConversation(id);
  r.querySelector('#thqBack').onclick=render;
  r.querySelector('#thqCounter').onclick=()=>{view='nominate';render();const f=root().querySelector('#thqNomination');f.elements.recipient.value=a.nominatedBy==='Mikael'?'Mikael':'Lizzy';f.elements.title.value='Counter-Award: '+a.title.slice(0,60);f.elements.reason.value='In formal response to the questionable award '+a.title+'.';};
}
let replyToId=null;
function selectResponse(kind,toId,a){
  responseKind=kind;replyToId=toId;
  const f=root()?.querySelector('#thqResponse');if(!f)return;
  const target=toId?a.responses.find(x=>x.id===toId):null;
  f.querySelector('#thqResponseTitle').firstChild.textContent=kind==='reply'&&target?'Your reply to '+target.by+':':kind==='accept'?'Your acceptance speech:':kind==='fight'?'Your formal objection:':kind==='endorse'?'Your endorsement:':'Your challenge:';
  f.classList.remove('thqHide');
  f.scrollIntoView({block:'nearest',behavior:'smooth'});
  f.elements.comment.focus({preventScroll:true});
}
async function refreshConversation(id){
  const btn=root()?.querySelector('#thqRefreshConversation');if(btn)btn.disabled=true;
  try{const result=await api('uom_hq_state');state=result.state;read(id);
    conversationStatus('Latest speeches and replies loaded.');}
  catch(e){conversationStatus(e.message,true);if(btn)btn.disabled=false;}
}
function conversationStatus(message,bad=false){
  const el=root()?.querySelector('#thqConversationStatus');if(el){el.textContent=message;el.style.color=bad?'#b32946':'#237042';}
}
async function respond(e){
  e.preventDefault();if(busy||!awardId||!responseKind)return;
  const form=e.currentTarget,button=form.querySelector('[type=submit]');
  const comment=form.elements.comment.value.trim();
  if(comment.length<2){conversationStatus('Write your response before publishing.',true);return;}
  busy=true;button.disabled=true;button.textContent='Publishing…';
  const targetId=awardId,kind=responseKind,replyTarget=replyToId;
  try{
    const payload={awardId:targetId,kind,comment,requestId:rid()};
    if(kind==='reply')payload.replyToId=replyTarget;
    const result=await api(['endorse','challenge','reply'].includes(kind)?'uom_hq_tv_react':'uom_hq_tv_respond',payload);
    state=result.state;read(targetId);
    conversationStatus('✓ Your response was published. Lizzy can read and reply to it.');
  }catch(ex){conversationStatus('Could not publish: '+ex.message,true);button.disabled=false;button.textContent='Publish Response';}
  finally{busy=false;}
}
window.MikaelTinyHQ={load};
document.addEventListener('click',e=>{const quick=e.target.closest('[data-tiny-shortcut]');if(!quick)return;view=quick.dataset.tinyShortcut;if(state&&root()&&!root().closest('.hidden'))render();});document.addEventListener('click',e=>{if(e.target.closest('[data-view="tiny"]'))setTimeout(load,0)});
})();
