/* Part 2 — embedded in Mikael HQ's existing Letters page. No Test Lab. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);
const api=async(action,body={})=>{if(typeof window.MikaelHQApi!=='function')throw Error('Unlock Mikael HQ first.');return window.MikaelHQApi(action,body)};
let state=null,notice='',busy=false,updated=0,connection='Waiting for LizzyOS Worker…';
const DRAFT_KEY='mickyHQPart2SessionDraftsV2';
function drafts(){try{return JSON.parse(sessionStorage.getItem(DRAFT_KEY)||'{}')}catch{return {}}}
function saveDrafts(d){try{sessionStorage.setItem(DRAFT_KEY,JSON.stringify(d))}catch{}}
function clearDraft(id){const d=drafts();delete d[id];saveDrafts(d)}
function field(name,label,content='',rows=5){return `<label>${esc(label)}<textarea data-p2hq-field="${esc(name)}" rows="${rows}" placeholder="Write your own response…">${esc(content)}</textarea></label>`;}
function form(o){const old=o.content||{};
 if(o.product===18)return field('defence','Presidential defence',old.defence)+field('ruling','Final case ruling',old.ruling);
 if(o.product===19)return field('title','Letter title',o.fields?.topic||'A Personal Letter',2)+field('body','Write the complete personal letter',old.body,9);
 if(o.product===29)return (o.fields?.questionList||[]).map((q,i)=>`<div class="p2hqQuestion"><b>Question ${i+1}: ${esc(q)}</b>${field('answer'+i,'Your actual answer',old.answers?.[i]||'',4)}</div>`).join('');
 if(o.product===46)return ['Personality','Moods','Communication','Known Weaknesses','Personal Advice'].map((label,i)=>field('chapter'+i,'Chapter '+(i+1)+' · '+label,old.chapters?.[i]||'',5)).join('');
 if(o.product===50)return field('title','Report heading','Confidential Findings',2)+field('body','In-depth, personal report',old.body,9);
 return '';
}
function orderCard(o){return `<article class="p2hqCard" data-p2hq-request="${esc(o.id)}"><div class="p2hqLine"><strong>${esc(o.title)}</strong><small>${esc(o.status)} · ${o.price} MB</small></div><p class="p2hqMuted">${esc(o.id)} · ${esc(o.createdAt||'')}</p>${o.fields?.title?`<p><b>Case:</b> ${esc(o.fields.title)}</p>`:''}${o.fields?.allegation?`<p><b>Allegation:</b> ${esc(o.fields.allegation)}</p>`:''}${o.fields?.evidence?`<p><b>Evidence:</b> ${esc(o.fields.evidence)}</p>`:''}${o.fields?.topic?`<p><b>Requested topic:</b> ${esc(o.fields.topic)}</p>`:''}${o.fields?.tone?`<p><b>Tone:</b> ${esc(o.fields.tone)}</p>`:''}
 ${o.product===29?`<p><b>Questions:</b> ${esc((o.fields?.questionList||[]).join(' / '))}</p>`:''}
 ${o.status==='pending'?`<div class="p2hqForm">${form(o)}<div class="p2hqButtons"><button type="button" data-hqp2="deliver" data-id="${esc(o.id)}">Deliver completed response</button><button type="button" class="p2hqSecondary" data-hqp2="refund" data-id="${esc(o.id)}">Decline + refund ${o.price} MB</button></div></div>`:
 o.status==='delivered'?`<details><summary>Delivered content / status</summary><p>${esc(JSON.stringify(o.content||o.mystery||{},null,2))}</p></details>`:'<p>Refund authorised. Lizzy receives it in her LizzyOS V3 browser wallet.</p>'}</article>`}
function render(){const root=$('presidentialPart2HQ');if(!root)return;const orders=state?.orders||[],pending=orders.filter(o=>o.status==='pending'),done=orders.filter(o=>o.status!=='pending'),questions=state?.questions||[];
 root.innerHTML=`<section class="p2hqShell"><div class="p2hqIntro"><small>MIKAEL HQ · PERSONAL REQUESTS · PRIVATE PRESIDENTIAL REQUESTS</small><h2>👑 Personal Letters & Classified Requests</h2><p>These are the actual submissions purchased in LizzyOS V3's Secret Shelf. Write every answer here in your own words; nothing is fabricated automatically.</p><button data-hqp2="refresh" type="button">↻ Refresh requests</button><p class="p2hqMuted" role="status">${esc(connection)}</p></div>${notice?`<p class="p2hqNotice" role="status">${esc(notice)}</p>`:''}<div class="p2hqCounts"><span><b>${pending.length}</b> awaiting your reply</span><span><b>${questions.filter(q=>q.status==='pending').length}</b> letter questions</span></div><div class="p2hqArea"><h3>📝 Requests requiring your response</h3>${pending.length?pending.map(orderCard).join(''):'<p>No pending requests yet. New purchases automatically appear here.</p>'}</div><div class="p2hqArea"><h3>💬 Letter follow-up questions</h3>${questions.length?questions.map(q=>`<article class="p2hqCard" data-p2hq-request="${esc(q.id)}"><b>${esc(q.letterTitle)}</b><p>${esc(q.question)}</p>${q.status==='pending'?`${field('followup_'+q.id,'Your personal reply','',4)}<button data-hqp2="reply" data-id="${esc(q.id)}">Send answer</button>`:`<p>👑 You answered: ${esc(q.answer)}</p>`}</article>`).join(''):'<p>No questions about letters yet.</p>'}</div><div class="p2hqArea"><details><summary>📁 Delivered / refunded archive (${done.length})</summary>${done.map(orderCard).join('')||'<p>No completed requests yet.</p>'}</details></div></section>`;
 root.querySelectorAll('[data-hqp2]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.hqp2,b.dataset.id,b)));
 const saved=drafts();root.querySelectorAll('[data-p2hq-request]').forEach(card=>{
  const id=card.dataset.p2hqRequest;card.querySelectorAll('[data-p2hq-field]').forEach(x=>{
   const field=x.dataset.p2hqField;if(saved[id]&&Object.prototype.hasOwnProperty.call(saved[id],field))x.value=saved[id][field];
   x.addEventListener('input',()=>{const d=drafts();d[id]=d[id]||{};d[id][field]=x.value;saveDrafts(d)});
  });
 });
}
async function load(){if(busy)return;try{busy=true;state=await api('p2_hq_state');updated=Date.now();notice='';connection=state.build?.includes('SECRET-SHELF')?'✅ Linked to updated LizzyOS Worker · '+state.build:'⚠️ LizzyOS Worker is missing the current Secret Shelf build. Purchases may not reach HQ.';}catch(e){connection='❌ Cannot reach the live Presidential Requests service';notice='Cannot load Presidential Requests: '+e.message;}finally{busy=false;render();}}
function collect(o,button){const section=button.closest('.p2hqCard');const vals=Object.fromEntries([...section.querySelectorAll('[data-p2hq-field]')].map(x=>[x.dataset.p2hqField,x.value.trim()]));
 return{title:vals.title||o.title,body:vals.body||'',defence:vals.defence||'',ruling:vals.ruling||'',answers:(o.fields?.questionList||[]).map((_,i)=>vals['answer'+i]||''),chapters:Array.from({length:5},(_,i)=>vals['chapter'+i]||'')};}
async function action(a,id,btn){
 if(busy)return;
 const button=btn||null;
 try{
  busy=true;if(button){button.disabled=true;button.textContent='Sending…';}
  if(a==='refresh'){busy=false;await load();return;}
  if(a==='deliver'){
   const o=state?.orders?.find(x=>x.id===id);if(!o)throw Error('Order not found. Refresh the Letters page.');
   const content=collect(o,button);
   // The Worker validates required content; never clear the draft until it accepts the delivery.
   const result=await api('p2_hq_deliver',{id,content});
   if(result.order?.id!==id||result.order?.status!=='delivered')throw Error('Delivery was not acknowledged by the server. Your text is saved.');
   clearDraft(id);
   let verified=false;
   try{const check=await api('p2_hq_delivery_verify',{id});verified=check.success===true&&check.status==='delivered'&&check.id===id&&check.product===o.product&&check.device===result.order.device&&JSON.stringify(check.content)===JSON.stringify(result.order.content);}catch(e){/* Acknowledgement is saved; read-back may temporarily be stale. */}
   notice=verified?'✅ Saved and independently verified in LizzyOS V3. Lizzy can read it in Open When after refresh · '+id:'✅ Server saved the letter · '+id+' — final read-back is still pending. Refresh to verify.';
   const next=await api('p2_hq_state').catch(()=>null);
   if(next){state=next;const found=state.orders?.find(x=>x.id===id);if(!found||found.status!=='delivered'){state.orders=state.orders||[];state.orders=state.orders.filter(x=>x.id!==id);state.orders.unshift(result.order);}}
   else{state=state||{orders:[],questions:[]};state.orders=(state.orders||[]).filter(x=>x.id!==id);state.orders.unshift(result.order);}
   return;
  }
  if(a==='refund'){
   const o=state?.orders?.find(x=>x.id===id);if(!o)throw Error('Order not found.');
   if(!confirm('Decline this request and authorise a '+o.price+' MB refund?'))return;
   const r=await api('p2_hq_refund',{id,reason:'This request cannot be fulfilled as submitted.'});
   if(r.order?.status!=='refunded')throw Error('Refund was not acknowledged.');
   clearDraft(id);notice='Refund authorised for '+id+'; the browser wallet must confirm the credit.';
  }
  if(a==='reply'){
   const v=button.closest('.p2hqCard').querySelector('[data-p2hq-field]')?.value.trim();if(!v)throw Error('Write an answer first.');
   const r=await api('p2_hq_reply',{id,answer:v});
   if(r.followup?.status!=='answered')throw Error('The Worker did not confirm the follow-up reply.');
   clearDraft(id);notice='✅ Follow-up answer saved for '+id;
  }
  state=await api('p2_hq_state');
 }catch(e){notice='❌ NOT DELIVERED: '+e.message+' Your draft has been kept.';}
 finally{busy=false;render();}
}
function mount(){if(!$('presidentialPart2HQ'))return;if(!state||Date.now()-updated>5000)load();else render()}
window.MikaelP2HQ={mount,load};
})();
