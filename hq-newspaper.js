(()=>{'use strict';
const $=id=>document.getElementById(id),KEY='mickyHQV3NewspaperSourceV1';
const input=$('hqV3NewsUrl'),frame=$('hqNewspaperFrame'),status=$('hqNewsStatus');
if(!input||!frame||!status)return;
try{input.value=localStorage.getItem(KEY)||''}catch{}
function viewerUrl(value){
 const u=new URL(String(value||'').trim());
 if(!['https:','http:'].includes(u.protocol))throw Error('Please use your V3 website address starting with https://');
 if(u.protocol==='http:'&&!['localhost','127.0.0.1'].includes(u.hostname))throw Error('Your live V3 address must use HTTPS.');
 // Accept a repo root or index.html; never load a URL outside the pasted V3 origin/folder.
 u.search='';u.hash='';
 if(u.pathname.endsWith('.html'))u.pathname=u.pathname.replace(/[^/]+$/, '');
 else if(!u.pathname.endsWith('/'))u.pathname+='/';
 u.pathname+='daily-news-view.html';
 return u.href;
}
function load(force=false){
 try{
  const base=input.value.trim();if(!base){status.textContent='Paste the URL of Lizzy’s live V3 website, then select Load V3 edition.';frame.removeAttribute('src');return;}
  const src=viewerUrl(base);
  if(force||frame.getAttribute('src')!==src){frame.src=src;}
  localStorage.setItem(KEY,base);
  status.textContent='Showing the newspaper from your live V3 site. Its daily rotation follows Johannesburg time.';
 }catch(e){status.textContent=String(e.message||e);frame.removeAttribute('src')}
}
$('hqNewsConnect')?.addEventListener('click',()=>load(true));
$('hqNewsRefresh')?.addEventListener('click',()=>load(true));
window.MikaelHQNews={load:()=>load(false)};
})();