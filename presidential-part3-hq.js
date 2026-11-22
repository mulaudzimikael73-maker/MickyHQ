/* Mikael HQ Part 3: Bank disputes, last reported share totals, Office Hours and cross-feature activity. */
(()=>{'use strict';const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const api=(a,b={})=>window.MikaelHQApi(a,b);let state=null,notice='',officeNotice='',bankNotice='',bankLoading=false,bankSubmitting=false;const draftReplies={};let submitting=false;
function mountPoints(){for(const [id,parent] of [['part3HQFinance','world'],['part3HQOffice','university'],['part3HQBank','bank']]){if(document.getElementById(id))continue;const node=document.getElementById(parent);if(!node)continue;const el=document.createElement('section');el.id=id;el.className='p3hqSection';node.appendChild(el);}}
function finance(){const root=document.getElementById('part3HQFinance');if(!root)return;const s=state||{},disputes=s.disputes||[],trades=s.stocks||[],act=s.activity||[],reports=Object.values(s.marketReports||{}).sort((a,b)=>b.at.localeCompare(a.at));root.innerHTML=`<header><small>MIKAEL HQ · BANKING</small><h2>🏦 Bank Requests & Share Receipts</h2><p class="p3hqNotice">${esc(notice||'Connected to LizzyOS V3 Bank of Micky · Refresh to check new disputes')}</p><p>Shares and wallet totals are verified client-side snapshots, not a server-controlled wallet. Confirmed purchases generate a detailed Telegram event.</p><button type="button" data-p3-refresh>↻ Refresh finance</button></header>${notice?`<p class="p3hqNotice">${esc(notice)}</p>`:''}<div class="p3hqPanel"><h3>📈 Latest reported portfolio</h3>${reports.length?`<p>Shares: <b>${reports[0].totalShares}</b> · Portfolio: <b>${reports[0].portfolioValue} MB</b> · Wallet: <b>${reports[0].walletRemaining} MB</b> · Reported ${esc(reports[0].at)}</p>`:'<p>Awaiting a successful share purchase on LizzyOS V3.</p>'}<details><summary>Share-purchase receipts (${trades.length})</summary>${trades.map(t=>`<p><b>${esc(t.company)}</b> · Bought ${t.quantity} × ${t.unitPrice} MB = ${t.total} MB · Company holdings ${t.companyShares} · Overall ${t.totalShares} · Telegram: ${esc(t.telegram)} ${t.telegram==='sent'?'':`<button type="button" data-p3-retry-stock="${esc(t.receipt)}">Retry share alert</button>`}</p>`).join('')}</details></div><div class="p3hqPanel"><h3>🔗 Connected LizzyOS activity</h3><p>Private letter text and investigation details are not published here.</p>${act.length?act.slice(0,20).map(x=>`<p><b>${esc(x.kind.replaceAll('_',' '))}</b> — ${esc(x.title)} <small>${esc(x.at)}</small></p>`).join(''):'<p>No linked activity yet.</p>'}</div>`;
 root.querySelector('[data-p3-refresh]')?.addEventListener('click',load);root.querySelectorAll('[data-p3-retry-stock]').forEach(b=>b.onclick=async()=>{try{await api('p3_hq_stock_retry',{receipt:b.dataset.p3RetryStock});await load();}catch(e){notice=e.message;finance();}});}

function bank(){
 const root=document.getElementById('part3HQBank');if(!root)return;
 const disputes=state?.disputes||[];
 const pending=disputes.filter(x=>x.status==='pending');
 const resolved=disputes.filter(x=>x.status!=='pending');
 const counter=document.getElementById('hqBankPendingBadge');
 if(counter){counter.hidden=!pending.length;counter.textContent=pending.length>99?'99+':String(pending.length);}
 
 const item=x=>`<article class="p3hqCase" data-bank-case="${esc(x.id)}">
   <div class="p3hqCaseHead"><b>${esc(x.description||'Bank of Micky charge')}</b><span class="p3hqTag p3hqTag-${esc(x.status)}">${x.status==='pending'?'Awaiting decision':x.status==='refunded'?'Refund approved':'Dispute rejected'}</span></div>
   <p><strong>${Math.abs(Number(x.amount))} MB</strong> · <small>Case ${esc(x.id)} · Submitted ${esc(x.createdAt||'')}</small></p>
   <p class="p3hqReason"><strong>Lizzy's dispute:</strong> ${esc(x.reason)}</p>
   ${x.status==='pending'?`<label for="bankComment-${esc(x.id)}"><strong>Your decision and explanation</strong></label><textarea id="bankComment-${esc(x.id)}" data-bank-reply="${esc(x.id)}" rows="3" placeholder="Explain your decision to Lizzy. Minimum 6 characters."></textarea>
     <div class="p3hqDecisionButtons"><button type="button" data-bank-decision="refund" data-id="${esc(x.id)}" ${bankSubmitting?'disabled':''}>✓ Approve refund · ${Math.abs(Number(x.amount))} MB</button><button type="button" data-bank-decision="uphold" data-id="${esc(x.id)}" ${bankSubmitting?'disabled':''}>✕ Reject dispute</button></div>`:
     `<p class="p3hqDecision"><strong>Presidential response:</strong> ${esc(x.decision||'No explanation provided')}</p><p>${x.status==='upheld'?'✕ Charge remains unchanged.':x.refundCreditedAt?'✓ Refund credited into Lizzy’s browser wallet · '+esc(x.refundCreditedAt):'⏳ Refund authorised · awaiting credit confirmation from Lizzy’s original browser.'}</p>`}
 </article>`;
 root.innerHTML=`<div class="p3hqBankHead"><div><h3>⚖️ Dispute Decisions</h3><p>Review charges submitted from LizzyOS V3. Approved refunds are credited only when Lizzy's original browser applies them.</p></div><button type="button" data-p3-bank-refresh ${bankLoading?'disabled':''}>↻ Refresh disputes</button></div>
 <div class="p3hqBankStats"><div><strong>${pending.length}</strong><small>Awaiting your decision</small></div><div><strong>${resolved.length}</strong><small>Decided disputes</small></div><div><strong>${disputes.filter(x=>x.status==='refunded'&&!x.refundCreditedAt).length}</strong><small>Approved, awaiting wallet credit</small></div></div>
 <p id="p3BankNoticeHQ" role="status" aria-live="polite" class="p3hqNotice">${esc(bankNotice||notice||(state?'Connected to LizzyOS V3 Bank of Micky.':'Loading dispute records…'))}</p>
 <h3>🕒 Pending (${pending.length})</h3>${pending.length?pending.map(item).join(''):'<p class="p3hqEmpty">No disputes awaiting a decision.</p>'}
 <details class="p3hqHistory"><summary>Decision history (${resolved.length})</summary>${resolved.length?resolved.map(item).join(''):'<p>No decisions yet.</p>'}</details>`;
 root.querySelector('[data-p3-bank-refresh]')?.addEventListener('click',load);
 root.querySelectorAll('[data-bank-reply]').forEach(t=>{const id=t.dataset.bankReply;if(draftReplies[id]!=null)t.value=draftReplies[id];t.addEventListener('input',()=>{draftReplies[id]=t.value;});});
 root.querySelectorAll('[data-bank-decision]').forEach(b=>b.addEventListener('click',()=>decide(b.dataset.id,b.dataset.bankDecision)));
}

function university(){const root=document.getElementById('part3HQOffice');if(!root)return;const qs=state?.office||[];root.innerHTML=`<header><small>MIKAEL HQ · UNIVERSITY</small><h2>🎓 Lecturer Office Hours</h2><p class="p3hqNotice" role="status">${esc(officeNotice||notice||'Questions submitted in enrolled courses appear here.')}</p><p>Reply personally to questions from courses Lizzy has taken. No grades or tuition changes.</p><button type="button" data-p3-refresh>↻ Refresh Office Hours</button></header>${qs.length?qs.map(x=>`<article class="p3hqItem"><b>${esc(x.courseId)} · ${esc(x.courseTitle)}</b><p>Lizzy: ${esc(x.question)}</p>${x.status==='pending'?`<textarea data-office-reply="${esc(x.id)}" rows="4" placeholder="Write a course-specific answer in your lecturer's voice"></textarea><button type="button" data-office-send="${esc(x.id)}" ${submitting?'disabled':''}>Send lecturer reply</button>`:`<p>🎓 Lecturer: ${esc(x.answer)}</p>`}</article>`).join(''):'<p>No Office Hours questions yet.</p>'}`;
 root.querySelectorAll('[data-office-reply]').forEach(t=>{const id=t.dataset.officeReply;if(draftReplies[id]!=null)t.value=draftReplies[id];t.addEventListener('input',()=>{draftReplies[id]=t.value;});});
 root.querySelector('[data-p3-refresh]')?.addEventListener('click',load);root.querySelectorAll('[data-office-send]').forEach(b=>b.onclick=()=>reply(b.dataset.officeSend));}
async function load(){
 mountPoints();
 if(bankLoading)return;
 bankLoading=true;
 try{const result=await api('p3_hq_state');if(!result.success||!Array.isArray(result.disputes))throw Error('Bank records were not returned by the production Worker.');state=result;notice='';if(bankNotice.startsWith('Could not retrieve'))bankNotice='';}
 catch(e){state=null;notice='Could not retrieve Bank/University records: '+e.message;bankNotice=notice;}
 finally{bankLoading=false;bank();finance();university();}
}
async function decide(id,decision){
 if(bankSubmitting)return;
 const textarea=[...document.querySelectorAll('[data-bank-reply]')].find(x=>x.dataset.bankReply===id);
 const comment=(textarea?.value||draftReplies[id]||'').trim();
 if(comment.length<6){bankNotice='Please write an explanation of at least 6 characters before deciding.';bank();return;}
 const expectedStatus=decision==='refund'?'refunded':'upheld';
 const existing=(state?.disputes||[]).find(x=>x.id===id);
 if(!existing||existing.status!=='pending'){bankNotice='This dispute is no longer pending. Refresh the Bank to see the latest decision.';bank();return;}
 if(decision==='refund'&&!window.confirm('Approve a '+Math.abs(Number(existing.amount))+' MB refund? This authorises payment to Lizzy’s original browser.'))return;
 bankSubmitting=true;bankNotice='Submitting your decision…';bank();
 try{
  const result=await api('p3_hq_dispute',{id,decision,comment});
  if(result.dispute?.id!==id||result.dispute?.status!==expectedStatus||result.dispute?.decision!==comment)throw Error('The server did not confirm the expected decision.');
  let verified=false;
  try{const v=await api('p3_hq_dispute_verify',{id});verified=v.success===true&&v.dispute?.status===expectedStatus&&v.dispute?.decision===comment;}catch{}
  // Preserve the server-acknowledged decision even if a subsequent eventually consistent KV read is stale.
  if(state){const index=state.disputes.findIndex(x=>x.id===id);if(index>=0)state.disputes[index]=result.dispute;}
  delete draftReplies[id];
  bankNotice=verified?(decision==='refund'?'✓ Refund approved and verified. Awaiting wallet credit from Lizzy’s original browser.':'✓ Dispute rejected, charge upheld and decision verified.'):'✓ Decision accepted by the server. Final synchronisation is still pending.';
  await load();
  if(state){const index=state.disputes.findIndex(x=>x.id===id);if(index>=0&&state.disputes[index].status==='pending')state.disputes[index]=result.dispute;}
 }catch(e){bankNotice='✕ Decision not confirmed: '+e.message+'. Your written explanation has been saved on this page.';}
 finally{bankSubmitting=false;bank();}
}
async function reply(id){
 if(submitting)return;
 const entry=document.querySelector('[data-office-reply="'+id+'"]');
 const answer=entry?.value?.trim()||'';
 if(answer.length<20){officeNotice='Please write a full lecturer response of at least 20 characters.';university();return;}
 submitting=true;officeNotice='Sending lecturer response…';university();
 try{
  const result=await api('p3_hq_office_reply',{id,answer});
  if(result.question?.id!==id||result.question?.status!=='answered')throw Error('The Worker did not confirm the reply.');
  let checked=false;
  try{const v=await api('p3_hq_office_verify',{id});checked=v.status==='answered'&&v.id===id;}catch(e){}
  delete draftReplies[id];
  await load();
  // If a stale KV read arrives after the write, keep the confirmed response visible.
  state=state||{};state.office=Array.isArray(state.office)?state.office:[];
  const i=state.office.findIndex(q=>q.id===id);
  if(i>=0)state.office[i]=result.question;else state.office.unshift(result.question);
  officeNotice=checked?'✅ Lecturer answer delivered and verified · '+id:'✅ Lecturer answer accepted by the server · '+id+' — pending final synchronisation.';
 }catch(e){officeNotice='❌ Reply not delivered: '+e.message+'. Your response draft is retained.';}
 finally{submitting=false;university();}
}
window.MikaelPart3HQ={mount:load,load};
setInterval(()=>{const bank=document.getElementById('part3HQFinance'),office=document.getElementById('part3HQOffice');const dedicated=document.getElementById('part3HQBank');if(((bank&&bank.offsetParent!==null)||(office&&office.offsetParent!==null)||(dedicated&&dedicated.offsetParent!==null))&&!document.querySelector('textarea:focus'))load();},16000);
document.querySelectorAll('[data-view="world"],[data-view="university"],[data-view="bank"]').forEach(b=>b.addEventListener('click',()=>setTimeout(load,260)));
})();
