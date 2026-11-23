/* Micky HQ Presidential Taxes R7: verify production backend BEFORE requesting taxes. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const WORKER='https://lizzyos-notifications.mulaudzimikael73.workers.dev/';
const BUILD='20261123-tax-r7';
const PENDING='mikaelHQTaxPendingR6'; // preserve the previous pending request ID to avoid duplicate taxes
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const api=(action,body={})=>{if(typeof window.MikaelHQApi!=='function')throw Error('HQ API script missing. Install the complete HQ update.');return window.MikaelHQApi('v3_tax_'+action,body);};
const pending=()=>{try{return JSON.parse(sessionStorage.getItem(PENDING)||'null')}catch{return null}};
const savePending=d=>{try{sessionStorage.setItem(PENDING,JSON.stringify(d))}catch{}};
const clearPending=()=>{try{sessionStorage.removeItem(PENDING)}catch{}};
let creating=false, lastCheck=0;
function show(target,msg){if($(target))$(target).textContent=msg;}
function verifyTax(r){if(!r||r.success!==true||!r.tax||typeof r.tax.id!=='string'||!r.tax.id.startsWith('V3T-'))throw Error('Tax receipt missing. The connected Worker is out of date; no verified tax has been issued.');return r.tax;}
async function check(force=false){
 const btn=$('taxIssueBtn');
 if(btn)btn.disabled=true;
 show('taxWorkerState','Checking production tax service…');
 try{
  const url=new URL(WORKER);url.searchParams.set('v3TaxHealth','r7');
  url.searchParams.set('check',String(Date.now()));
  const response=await fetch(url.toString(),{method:'GET',cache:'no-store'});
  const data=await response.json().catch(()=>null);
  if(!response.ok||data?.success!==true||data?.service!=='lizzyos-v3-presidential-tax'||data?.contract!=='r7'||data?.build!==BUILD||!data?.kvBound||data.production!==true)throw Error('This HQ is not connected to the R7 production tax Worker. Deploy R7 to the original notifications Worker and refresh HQ.');
  lastCheck=Date.now();
  show('taxWorkerState','✅ Production tax service connected — '+BUILD);
  if(btn&&!creating)btn.disabled=false;
  return true;
 }catch(e){lastCheck=0;show('taxWorkerState','❌ '+e.message);show('taxResult','Tax creation is safely disabled until the production Worker is verified.');return false;}
}
async function load(){
 const host=$('taxRecords');if(!host)return;
 host.textContent='Checking tax service…';
 if(!await check()){host.textContent='Tax records unavailable because the production Worker version is not verified.';return;}
 try{
  const r=await api('list');if(r?.build!=='V3-TAX-R7'||!Array.isArray(r?.taxes))throw Error('The production Worker returned an incompatible tax list.');
  host.innerHTML=r.taxes.length?r.taxes.map(t=>`<article class="card" style="padding:14px;margin:8px 0"><strong>${esc(t.id)}</strong><p>${esc(t.reason)}</p><div>${Number(t.amount)||0} MB assessed · ${Number(t.appliedAmount)||0} MB collected</div><small>Status: ${esc(t.status)}${t.status==='partial'?` · ${Math.max(0,t.amount-t.appliedAmount)} MB uncollected`:''}${t.status==='refund_due'?` · ${Number(t.refundDue)||0} MB awaiting original device`:''}</small><div style="margin-top:8px">${t.status==='pending'?`<button type="button" data-tax-cancel="${esc(t.id)}">Cancel pending tax</button>`:''} ${['collected','partial'].includes(t.status)&&t.appliedAmount>0?`<button type="button" data-tax-refund="${esc(t.id)}">Refund collected MB</button>`:''}</div></article>`).join(''):'<p>No taxes issued yet.</p>';
  host.querySelectorAll('[data-tax-cancel]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Cancel this pending tax?'))return;btn.disabled=true;try{if(!await check())throw Error('Tax service is unavailable');verifyTax(await api('cancel',{id:btn.dataset.taxCancel}));await load()}catch(e){alert(e.message);btn.disabled=false}});
  host.querySelectorAll('[data-tax-refund]').forEach(btn=>btn.onclick=async()=>{if(!confirm('Authorise a refund to Lizzy’s original V3 browser? Her MB are not credited until that device reconnects.'))return;btn.disabled=true;try{if(!await check())throw Error('Tax service is unavailable');verifyTax(await api('refund',{id:btn.dataset.taxRefund}));await load()}catch(e){alert(e.message);btn.disabled=false}});
 }catch(e){host.textContent='❌ '+e.message}
}
$('taxRefreshBtn')?.addEventListener('click',load);
$('taxIssueBtn')?.addEventListener('click',async()=>{
 if(creating)return;
 const amount=Number($('taxAmount')?.value),reason=String($('taxReason')?.value||'').trim(),btn=$('taxIssueBtn');
 if(!Number.isSafeInteger(amount)||amount<1||amount>1000000000||reason.length<3||reason.length>240){show('taxResult','Enter 1–1,000,000,000 whole MB and a reason (3–240 characters).');return;}
 if(!confirm(`Issue an automatic tax of ${amount} MB?\nReason: ${reason}`))return;
 creating=true;btn.disabled=true;
 try{
  if(!await check())return;
  let p=pending();if(!p||p.amount!==amount||p.reason!==reason){p={amount,reason,requestId:crypto.randomUUID?crypto.randomUUID():'tax-'+Date.now()+'-'+Math.random().toString(36).slice(2)};savePending(p);}
  show('taxResult','Creating tax and independently checking its saved receipt…');
  const tax=verifyTax(await api('create',p));
  // Separate retrieval proves the Worker persisted the same receipt; never assume based on HTTP 200 alone.
  const saved=verifyTax(await api('get',{id:tax.id}));
  if(saved.id!==tax.id||saved.amount!==amount||saved.reason!==reason)throw Error('The saved tax receipt did not match the submitted tax. Retry the saved request; do not create another.');
  clearPending();show('taxResult','✅ Confirmed tax: '+saved.id+' · '+saved.amount+' MB · Pending collection on Lizzy’s original browser.');$('taxReason').value='';await load();
 }catch(e){show('taxResult','❌ '+e.message+' · Your request reference is retained for safe retry.');}
 finally{creating=false;if(Date.now()-lastCheck<120000)btn.disabled=false;}
});
window.MikaelTaxHQ={load,check};
})();
