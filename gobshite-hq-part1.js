/* Daily Gobshite Editorial Desk — part of EXISTING Mikael HQ newspaper screen. */
(()=>{'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const api=(action,body={})=>{if(typeof window.MikaelHQApi!=='function')throw Error('Unlock Mikael HQ first.');return window.MikaelHQApi(action,body)};
let state=null,notice='',drafts={},connection='Checking the LizzyOS Worker…',lastChecked='';
function node(){let n=document.getElementById('gobPart1Desk');if(n)return n;const parent=document.getElementById('mickyNewsMount');if(!parent)return null;n=document.createElement('div');n.id='gobPart1Desk';parent.prepend(n);return n;}
const nl=v=>esc(v).replaceAll('\n','<br>');
function orderCard(o){const d=drafts[o.id]||{};return `<article class="gobHQOrder"><div class="gobHQOrderTop"><span class="gobHQTag">${o.type==='headline'?'HEADLINE · 75 MB':'GUEST COLUMN · 70 MB'}</span><small>${esc(o.status.replaceAll('_',' '))}</small></div><h4>${esc(o.title)}</h4>${o.type==='column'?`<p><em>By ${esc(o.byline)}</em></p>`:''}${o.body?`<p>${nl(o.body)}</p>`:''}<div class="gobHQMeta">${esc(o.id)} · ${esc(o.createdAt.slice(0,10))}</div>
 ${o.status==='review'||o.status==='revision_requested'?`<div class="gobHQActions"><label>Publication date<input type="date" data-gob-date="${esc(o.id)}" min="${esc(state.day)}" value="${esc(d.day||state.day)}"></label><button data-gob-decision="publish" data-id="${esc(o.id)}">Publish to newspaper</button><button data-gob-decision="edit" data-id="${esc(o.id)}" class="secondary">Suggest edits</button><button data-gob-decision="revise" data-id="${esc(o.id)}" class="secondary">Ask for revision</button><button data-gob-decision="refund" data-id="${esc(o.id)}" class="warn">Decline + refund</button><label>Editor's note (optional)<textarea rows="2" data-gob-feedback="${esc(o.id)}" placeholder="Why is a change necessary?"></textarea></label></div>
 <details class="gobHQEdit"><summary>Prepare an edited version</summary><label>Suggested title<input data-gob-title="${esc(o.id)}" maxlength="145" value="${esc(d.title??o.title)}"></label><label>Suggested body<textarea data-gob-body="${esc(o.id)}" rows="5">${esc(d.body??o.body)}</textarea></label><p>Use “Suggest edits” above to send your changes to Lizzy for approval.</p></details>`:''}
 ${o.status==='awaiting_lizzy_approval'?`<p class="gobHQAlert">Waiting for Lizzy to approve the revised wording.</p><details><summary>Review proposed edit</summary><h5>${esc(o.editedTitle)}</h5><p>${nl(o.editedBody)}</p></details>`:''}
 ${o.feedback?`<p class="gobHQFeedback">${esc(o.feedback)}</p>`:''}
 ${o.status==='published'?`<p class="gobHQGood">Scheduled for ${esc(o.day)}. It is visible on or after that date.</p>`:''}
 ${o.status==='refunded'?'<p class="gobHQGood">Refund approved; LizzyOS V3 credits Lizzy’s original browser wallet when she opens the newspaper.</p>':''}</article>`}
function render(){const root=node();if(!root)return;const all=state?.orders||[],pending=all.filter(o=>['review','revision_requested','awaiting_lizzy_approval'].includes(o.status)),finished=all.filter(o=>!pending.includes(o));const p=state?.poll;
 root.innerHTML=`<section class="gobHQDesk"><div class="gobHQHeading"><small>MIKAEL HQ · DAILY GOBSHITE · EDITORIAL REPAIR R3</small><h2>👑 Editorial Desk</h2><button data-gob-hq="refresh" type="button">↻ Refresh submissions</button><p>Review Lizzy's paid headlines and guest columns, publish them in the real LizzyOS V3 paper, or refund declined submissions.</p><p class="gobHQConnection" role="status">${esc(connection)} ${lastChecked?`· Checked: ${esc(lastChecked)}`:''}</p></div>${notice?`<p class="gobHQNotice" role="status">${esc(notice)}</p>`:''}
 <div class="gobHQNumbers"><div><b>${pending.length}</b><span>Awaiting review</span></div><div><b>${finished.length}</b><span>Completed</span></div><div><b>1</b><span>Main daily poll</span></div></div>
 <div class="gobHQArea"><h3>📝 Submissions awaiting your decision</h3>${pending.length?pending.map(orderCard).join(''):'<p>No confirmed submissions are waiting in this LizzyOS Worker. If Lizzy paid for a headline, open LizzyOS V3 → Daily News → Purchases waiting to reach Mikael HQ, and use the saved-receipt retry (no second payment). Then refresh this screen.</p>'}</div>
 <div class="gobHQArea"><h3>🔎 Find a headline or guest-column receipt</h3><p>Paste the GOB receipt shown in LizzyOS V3, or the GOB order ID. This checks whether the purchase reached the same Cloudflare Worker as HQ.</p><div class="gobHQLookup"><input id="gobHQFindReceipt" placeholder="GOB… receipt or order ID" autocomplete="off"><button data-gob-hq="lookup" type="button">Find submission</button></div><p id="gobHQFindResult" class="gobHQNote" role="status"></p></div>
 <div class="gobHQArea"><h3>🗳️ Main Article Poll</h3><p>There is exactly one poll each day, tied to the featured article. View Lizzy's real vote and edit the poll using the Main Article Poll panel below.</p></div>
 <div class="gobHQArea"><details><summary><strong>📚 Published & refunded submission archive (${finished.length})</strong></summary>${finished.length?finished.map(orderCard).join(''):'<p>No completed submissions yet.</p>'}</details></div>
 </section>`;
 root.querySelectorAll('[data-gob-decision]').forEach(x=>x.addEventListener('click',()=>decide(x.dataset.gobDecision,x.dataset.id)));
 root.querySelectorAll('[data-gob-hq]').forEach(x=>x.addEventListener('click',()=>handle(x.dataset.gobHq)));
}
async function load(){
 try{connection='Connecting…';const r=await api('gob_p1_hq_state');state=r;notice='';lastChecked=new Date().toLocaleTimeString();
  connection=r.build?.includes('EDITORIAL-RECEIPT-REPAIR')?`✅ Connected to LizzyOS Worker · ${r.build} · ${r.orderCount??r.orders?.length??0} total recorded submissions`:
  '⚠️ Connected, but the LizzyOS Worker is outdated or does not identify the current editorial update. Do not ask Lizzy to buy again.';
  render();
 }catch(e){connection='❌ LizzyOS Worker unavailable or HQ key rejected. The Editorial Desk cannot see purchases until its API connects.';notice='Cannot load editor: '+e.message;render();}}

async function decide(decision,id){const root=node(),o=state?.orders?.find(x=>x.id===id);if(!o)return;
 const date=root.querySelector(`[data-gob-date="${(window.CSS?.escape?CSS.escape(id):id.replace(/[^a-zA-Z0-9_-]/g,''))}"]`)?.value||state.day,feedback=root.querySelector(`[data-gob-feedback="${(window.CSS?.escape?CSS.escape(id):id.replace(/[^a-zA-Z0-9_-]/g,''))}"]`)?.value||'',title=root.querySelector(`[data-gob-title="${(window.CSS?.escape?CSS.escape(id):id.replace(/[^a-zA-Z0-9_-]/g,''))}"]`)?.value||o.title,body=root.querySelector(`[data-gob-body="${(window.CSS?.escape?CSS.escape(id):id.replace(/[^a-zA-Z0-9_-]/g,''))}"]`)?.value??o.body;
 if(decision==='refund'&&!confirm(`Decline this ${o.price} MB submission and return Lizzy’s money?`))return;
 if(decision==='publish'&&!confirm(`Publish “${o.title}” to the LizzyOS V3 Daily Gobshite on ${date}?`))return;
 try{const r=await api('gob_p1_hq_decide',{decision,id,day:date,feedback,title,body});notice=`${esc(o.title)}: ${r.order.status.replaceAll('_',' ')}.`;const next=await api('gob_p1_hq_state');state=next;render();}catch(e){notice=e.message;render();}
}
async function handle(a){
 if(a==='refresh'){await load();return;}
 if(a==='lookup'){
  const ref=node()?.querySelector('#gobHQFindReceipt')?.value.trim();const target=node()?.querySelector('#gobHQFindResult');
  if(!target)return;if(!ref){target.textContent='Enter the GOB receipt or order reference from LizzyOS V3 first.';return;}
  target.textContent='Checking the LizzyOS Worker…';try{const r=await api('gob_p1_hq_lookup',{receipt:ref});target.textContent=r.found?
  `✅ Found: ${r.order.title} · ${r.order.price} MB · ${r.order.status} · ${r.order.id}. Refresh to review it.`:
  `Not in the current LizzyOS Worker. Lizzy should retry the saved purchase receipt on LizzyOS V3 without spending MB again.`;}
  catch(e){target.textContent='Cannot look up receipt: '+e.message;}return;
 }
 if(a==='savepoll'){const q=document.getElementById('gobHQQuestion')?.value||'',options=[...node().querySelectorAll('[data-poll-opt]')].map(x=>x.value.trim()).filter(Boolean);try{await api('gob_p1_hq_poll',{question:q,options});await load();}catch(e){notice=e.message;render();}return;}
 if(a==='vote'){const options=state?.poll?.options||[];if(!options.length)return;const text=options.map((s,i)=>`${i+1}: ${s}`).join('\n');const pick=prompt(`Your HQ vote (choose a number):\n${text}`);if(pick===null)return;const num=Number(pick);if(!Number.isInteger(num)||num<1||num>options.length){notice='Choose a valid answer number.';render();return;}try{await api('gob_p1_hq_vote',{choice:num-1});await load();}catch(e){notice=e.message;render();}}
}
function mount(){if(!node())return;render();load();}
window.GobshiteEditorialHQ={mount,load};
// Repair: the editorial controls must remain visible even if optional holiday/University code fails.
document.querySelectorAll('[data-view="mickynews"]').forEach(button=>button.addEventListener('click',()=>setTimeout(mount,150)));

})();
