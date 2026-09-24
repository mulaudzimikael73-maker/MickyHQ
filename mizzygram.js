(()=>{"use strict";

/* =====================================================================
   MizzyGram — Phase 7 (Mikael HQ bridge)
   Everything is stored in this browser (IndexedDB) for now.
   To change a user's username / bio / picture / personality, edit
   CONFIG below. To act as Mikael instead of Lizzy, use the "Switch to
   Mikael" button on the Profile tab (own profile).
   ===================================================================== */

/* ---------- tiny generators for the fictional accounts' art ----------
   No real photos exist for these accounts, so their avatars and posts
   are drawn on the fly as little SVG cards — a gradient + an emoji. */
function xesc(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function tileAvatar(emoji,c1,c2){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">`+
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`+
    `<rect width="100" height="100" rx="50" fill="url(#g)"/>`+
    `<text x="50" y="59" font-size="46" text-anchor="middle" dominant-baseline="middle">${xesc(emoji)}</text></svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}
function cardImage(text,emoji,c1,c2){
  const words=String(text).split(" ");let line="",lines=[];
  words.forEach(w=>{if((line+" "+w).trim().length>21){lines.push(line.trim());line=w}else line=(line+" "+w).trim()});
  if(line)lines.push(line.trim());
  const startY=520-(lines.length-1)*32;
  const tspans=lines.map((l,i)=>`<tspan x="60" y="${startY+i*60}">${xesc(l)}</tspan>`).join("");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">`+
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`+
    `<rect width="900" height="900" fill="url(#g)"/>`+
    `<text x="60" y="220" font-size="130">${xesc(emoji)}</text>`+
    `<text font-family="Georgia,'Times New Roman',serif" font-size="50" font-weight="700" fill="#fff">${tspans}</text></svg>`;
  return "data:image/svg+xml;utf8,"+encodeURIComponent(svg);
}

const CONFIG={
  me:"lizzy",           // whose device/browser this normally is
  humans:["lizzy","mikael"],
  users:{
    lizzy:{
      id:"lizzy",
      username:"lizzy",
      name:"Lizzy",
      avatar:"assets/lizzy.png",
      bio:"Little Miss Attitude 💗\nMain character. Mikael is supporting cast."
    },
    mikael:{
      id:"mikael",
      username:"mikael",
      name:"Mikael",
      avatar:"assets/mikael-appears/mikael-1.jpg",
      bio:"Supporting cast, main heart 💫\nHere for Lizzy, always.",
      favReaction:"love",
      posts:["Just here thinking about her again. No updates needed, just facts. 💗"],
      comments:["This one's my favorite so far.","Saving this. Obviously.","She has no idea how much I love this.","This is exactly why I follow this account.","Okay but this is adorable, no notes."]
    },
    mikaelhq:{
      id:"mikaelhq",username:"mikaelhq",name:"Mikael HQ",bot:true,favReaction:"love",
      avatar:tileAvatar("🏢","#4c4c72","#181828"),
      bio:"Private command centre ops. Uptime: eternal.\nFiling reports on one (1) very important girl.",
      tile:["🏢","#4c4c72","#181828"],
      posts:[
        "📋 SYSTEM STATUS: All servers green. Mikael's attention: 100% allocated to Lizzy.",
        "🔧 MAINTENANCE NOTICE: HQ chessboard has been reset. Reason: Lizzy won again.",
        "📈 QUARTERLY REPORT: Letters received from Lizzy this month — all of them. Letters replied to — also all of them. #MrPerfect"
      ],
      comments:["Filed under: reasons HQ exists.","Logging this as a Priority One update.","HQ approves this post. Unanimously.","Forwarding this straight to Mikael's desk."]
    },
    lizzyos:{
      id:"lizzyos",username:"lizzyos",name:"LizzyOS",bot:true,favReaction:"cute",
      avatar:tileAvatar("💻","#ff8fce","#7a35dc"),
      bio:"The system Lizzy lives in. Uptime: since day one.\nRunning on caffeine and main-character energy.",
      tile:["💻","#ff8fce","#7a35dc"],
      posts:[
        "💻 BOOT LOG: Lizzy is online. All systems say 'good.'",
        "🔔 NOTIFICATION: 1 new adorable moment detected. No further action needed, just admire it.",
        "🛠️ UPDATE PATCH v2.0: Added more reasons to smile. Bug fixes: none needed, she's perfect as is. #MizzyGram"
      ],
      comments:["Logged. Cuteness levels rising.","System says: 😍","Running diagnostics… conclusion: iconic.","Saving this to permanent memory."]
    },
    bowlingfederation:{
      id:"bowlingfederation",username:"bowlingfederation",name:"Bowling Federation",bot:true,favReaction:"bowling",
      avatar:tileAvatar("🎳","#ffb84c","#e8317f"),
      bio:"Official-ish authority on all things bowling.\nStrikes only. Gutter balls will be mocked.",
      tile:["🎳","#ffb84c","#e8317f"],
      posts:[
        "🎳 BREAKING: Someone rolled a gutter ball and we are still recovering emotionally.",
        "🏆 ANNOUNCEMENT: The Bowling Federation officially declares today a Strike Day. Act accordingly. #BowlingQueen",
        "📢 REMINDER: Bowling shoes are not a fashion statement. We don't make the rules. Actually we do."
      ],
      comments:["This deserves a 300 score. Perfect game.","STRIKE. That's a strike right there.","The Federation has reviewed this post. Verdict: excellent.","10/10, would high-five."]
    },
    chocolateemergency:{
      id:"chocolateemergency",username:"chocolateemergency",name:"Chocolate Emergency",bot:true,favReaction:"chocolate",
      avatar:tileAvatar("🍫","#8a5a2c","#3a220f"),
      bio:"First responders for chocolate-related crises.\nAvailable 24/7. Bring snacks.",
      tile:["🍫","#8a5a2c","#3a220f"],
      posts:[
        "🚨 CHOCOLATE ALERT 🚨 Supplies are running dangerously low. Please remain calm.",
        "🍫 UPDATE: Emergency chocolate reserves have been located. Crisis averted. For now.",
        "⚠️ PUBLIC SERVICE ANNOUNCEMENT: A chocolate-free day has never been survived. Don't be a statistic."
      ],
      comments:["This is now a Level 1 Chocolate Emergency. Sending backup.","Deploying rescue chocolate to this post immediately.","We've never seen anything this sweet. Dispatching a team to investigate.","Confirmed: chocolate-worthy content."]
    },
    bankofmicky:{
      id:"bankofmicky",username:"bankofmicky",name:"Bank of Micky",bot:true,favReaction:"fire",
      avatar:tileAvatar("💰","#2f8f5b","#123322"),
      bio:"Handling deposits to the Token Jar since forever.\nInterest rates: unreasonably high for good behaviour.",
      tile:["💰","#2f8f5b","#123322"],
      posts:[
        "💰 DEPOSIT NOTICE: One (1) Token Jar contribution has been logged. Balance: growing.",
        "📊 STATEMENT: Affection levels this quarter exceeded all projections. No withdrawals recommended.",
        "🏦 ANNOUNCEMENT: The Bank of Micky now offers 0% interest on apologies and 100% interest on good deeds."
      ],
      comments:["Logging this as a Token Jar deposit. Approved.","This post just increased your account balance significantly.","The Bank of Micky has reviewed this and issued a bonus.","Certified: this is rich (in a good way)."]
    },
    mickysdailynews:{
      id:"mickysdailynews",username:"mickysdailynews",name:"Micky's Daily News",bot:true,favReaction:"suspicious",
      avatar:tileAvatar("📰","#c9c9d6","#4a4a5a"),
      bio:"Covering the Lizzy & Mikael beat, 24 hours a day.\nUnverified sources. Fully biased. Front page always.",
      tile:["📰","#c9c9d6","#4a4a5a"],
      posts:[
        "📰 BREAKING: Local girl posts photo, entire app agrees it's the best one yet. #LittleMissAttitude",
        "🗞️ EXCLUSIVE: Sources confirm Mikael has, once again, been left speechless. #MrPerfect",
        "📸 FRONT PAGE: MizzyGram's most-followed story continues to develop. Stay tuned."
      ],
      comments:["This is going on the front page. No debate.","Sources confirm: adorable. Printing tomorrow's headline now.","Breaking news just dropped and it's this post.","Exclusive coverage incoming. This is huge."]
    },
    thepresident:{
      id:"thepresident",username:"thepresident",name:"The President",bot:true,favReaction:"fire",
      avatar:tileAvatar("🏛️","#2a4a9a","#0b1633"),
      bio:"Head of state. Head of the household.\nSpeaking on behalf of the people (two of them).",
      tile:["🏛️","#2a4a9a","#0b1633"],
      posts:[
        "🏛️ ADDRESS TO THE NATION: The state of the union is strong, affectionate, and slightly dramatic. #StateOfTheUnion",
        "📜 EXECUTIVE ORDER: Bowling nights are now a protected national tradition. Gutter balls will be reviewed by committee.",
        "🎖️ PRESIDENTIAL PARDON: Granted to whoever ate the last chocolate. This time only."
      ],
      comments:["The President has reviewed this post and approves it.","This has been entered into the national record.","A motion to declare this post a national treasure has passed.","The administration is proud of you both."]
    }
  },
  reactions:[
    {id:"love",emoji:"❤️",label:"Love"},
    {id:"funny",emoji:"😂",label:"Funny"},
    {id:"attitude",emoji:"😈",label:"Attitude"},
    {id:"cute",emoji:"😍",label:"Cute"},
    {id:"fire",emoji:"🔥",label:"Fire"},
    {id:"bowling",emoji:"🎳",label:"Bowling"},
    {id:"chocolate",emoji:"🍫",label:"Chocolate"},
    {id:"suspicious",emoji:"👀",label:"Suspicious"}
  ],
  maxImage:1080,      // longest side of an uploaded photo, in px
  quality:.85,        // JPEG quality
  maxCaption:500,
  maxComment:300,
  eventGapMin:3,      // minimum minutes between random events
  memories:[],        // custom On This Day entries, e.g. {month:9,day:24,year:2025,text:"Something happened between Mikael and Lizzy..."}
  storySeconds:5,     // default seconds a photo/text story stays on screen
  storyHours:24,      // stories disappear after this many hours
  storyBgs:["linear-gradient(135deg,#ff4d9a,#7a35dc)","linear-gradient(135deg,#ffb84c,#e8317f)","linear-gradient(135deg,#3a7bd5,#7a35dc)","linear-gradient(135deg,#2f8f5b,#123322)","linear-gradient(135deg,#8a5a2c,#3a220f)","linear-gradient(135deg,#3a3a55,#0e0410)"]
};

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- icons ---------- */
const I={
  heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  comment:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 1 1 21 11.5z"/></svg>',
  photo:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="9" cy="9" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>',
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>',
  grid:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  bookmark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  folder:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><path d="M12 11v6M9 14h6"/></svg>'
};

/* =====================================================================
   Storage layer — the only part that touches the browser's database.
   (When we go multi-device later, this is the piece we swap for the
   Cloudflare Worker.)
   ===================================================================== */
const Store=(()=>{
  let db=null,persistent=false;
  const mem={posts:[],stories:[],meta:{}};
  const open=()=>new Promise(res=>{
    if(!window.indexedDB)return res(false);
    let req;
    try{req=indexedDB.open("mizzygram",2)}catch{return res(false)}
    req.onupgradeneeded=()=>{
      const d=req.result;
      if(!d.objectStoreNames.contains("posts"))d.createObjectStore("posts",{keyPath:"id"});
      if(!d.objectStoreNames.contains("meta"))d.createObjectStore("meta");
      if(!d.objectStoreNames.contains("stories"))d.createObjectStore("stories",{keyPath:"id"});
    };
    req.onsuccess=()=>{db=req.result;res(true)};
    req.onerror=req.onblocked=()=>res(false);
  });
  const run=(store,mode,fn)=>new Promise((res,rej)=>{
    const t=db.transaction(store,mode),r=fn(t.objectStore(store));
    t.oncomplete=()=>res(r&&r.result);
    t.onerror=t.onabort=()=>rej(t.error||new Error("Storage error"));
  });
  return{
    async init(){persistent=await open();return persistent},
    get persistent(){return persistent},
    async allPosts(){return persistent?(await run("posts","readonly",s=>s.getAll()))||[]:[...mem.posts]},
    async savePost(p){
      if(!persistent){const i=mem.posts.findIndex(x=>x.id===p.id);i<0?mem.posts.push(p):mem.posts[i]=p;return}
      await run("posts","readwrite",s=>s.put(p));
    },
    async allStories(){return persistent?(await run("stories","readonly",s=>s.getAll()))||[]:[...mem.stories]},
    async saveStory(s){
      if(!persistent){const i=mem.stories.findIndex(x=>x.id===s.id);i<0?mem.stories.push(s):mem.stories[i]=s;return}
      await run("stories","readwrite",s2=>s2.put(s));
    },
    async getMeta(k,fallback){
      if(!persistent)return k in mem.meta?mem.meta[k]:fallback;
      const v=await run("meta","readonly",s=>s.get(k));
      return v===undefined?fallback:v;
    },
    async setMeta(k,v){
      if(!persistent){mem.meta[k]=v;return}
      await run("meta","readwrite",s=>s.put(v,k));
    }
  };
})();

/* ---------- state ---------- */
const state={
  posts:[],stories:[],view:"home",pending:null,sheet:null,
  activeUser:CONFIG.me,   // who is "using" the app right now (lizzy or mikael)
  profileUser:null,       // whose profile is currently open (null = activeUser's own)
  replyTo:null,           // {id,username} of the comment being replied to
  seenStories:new Set(),  // story ids the active user has already opened
  exploreQuery:"",        // current text in the Explore search box
  hashtag:"",notifs:[],notifFilter:"all",notifHi:new Set(),saved:{},rewards:{},trendDone:[],savedCol:"",storyDraft:null,booting:false,news:[],lastEvent:0              // tag currently being viewed on the #hashtag page
};
const VIEWS=["home","explore","post","notifications","profile","hashtag","saved","news","achievements"];
const userOf=id=>CONFIG.users[id]||{username:"unknown",name:"Unknown",avatar:""};
const newestFirst=()=>state.posts.sort((a,b)=>b.createdAt-a.createdAt);
const reactionOf=id=>CONFIG.reactions.find(r=>r.id===id);
const otherHuman=id=>CONFIG.humans.find(h=>h!==id);

/* ---------- follow graph: { userId: Set(userIds they follow) } ---------- */
function followGraphDefault(){
  const g={lizzy:new Set(),mikael:new Set(["lizzy"])}; // Mikael already follows Lizzy by default 💗
  Object.values(CONFIG.users).forEach(u=>{
    if(!u.bot)return;
    g[u.id]=new Set(["lizzy","mikael"]); // every fictional account already follows both of you
  });
  if(g.mickysdailynews)g.mickysdailynews=new Set(Object.keys(CONFIG.users).filter(id=>id!=="mickysdailynews")); // paparazzi — follows literally everyone
  return g;
}
let followGraph=followGraphDefault();
const isFollowing=(a,b)=>!!(followGraph[a]&&followGraph[a].has(b));
const followingOf=id=>[...(followGraph[id]||[])];
const followersOf=id=>Object.keys(CONFIG.users).filter(u=>followGraph[u]&&followGraph[u].has(id));
async function saveFollowGraph(){
  const plain={};for(const k in followGraph)plain[k]=[...followGraph[k]];
  try{await Store.setMeta("follow-graph",plain)}catch{}
}
async function toggleFollow(targetId){
  const who=state.activeUser;
  if(who===targetId||!CONFIG.users[targetId])return;
  if(!followGraph[who])followGraph[who]=new Set();
  followGraph[who].has(targetId)?followGraph[who].delete(targetId):followGraph[who].add(targetId);
  if(followGraph[who].has(targetId))notify({to:targetId,from:who,kind:"follow",key:"f:"+who+":"+targetId});else unnotify("f:"+who+":"+targetId);
  await saveFollowGraph();
  render(true);renderSheet();
}
async function switchUser(id){
  if(!CONFIG.users[id]||id===state.activeUser)return;
  state.activeUser=id;state.profileUser=null;state.replyTo=null;
  try{await Store.setMeta("active-user",id)}catch{}
  const savedSeen=await Store.getMeta("seen-stories:"+id,[]).catch(()=>[]);
  state.seenStories=new Set(savedSeen);
  toast(`Now using MizzyGram as ${CONFIG.users[id].name} 💫`);
  render(false);
}
function goProfile(id){
  if(!CONFIG.users[id])return;
  state.profileUser=id;
  if(location.hash==="#profile"){state.view="profile";render(false)}
  else location.hash="#profile";
}

function ago(t){
  const s=Math.max(0,(Date.now()-t)/1000);
  if(s<60)return"just now";
  if(s<3600)return Math.floor(s/60)+"m";
  if(s<86400)return Math.floor(s/3600)+"h";
  if(s<604800)return Math.floor(s/86400)+"d";
  return new Date(t).toLocaleDateString([],{day:"numeric",month:"short",year:"numeric"});
}
let toastTimer;
function toast(msg){
  const t=$("toast");t.textContent=msg;t.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600);
}

/* ---------- photo processing ---------- */
function prepareImage(file){
  return new Promise((resolve,reject)=>{
    if(!file||!/^image\//.test(file.type))return reject(new Error("Please choose a photo (JPG, PNG or WebP)."));
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{
      try{
        const scale=Math.min(1,CONFIG.maxImage/Math.max(img.naturalWidth,img.naturalHeight));
        const w=Math.round(img.naturalWidth*scale),h=Math.round(img.naturalHeight*scale);
        const c=document.createElement("canvas");c.width=w;c.height=h;
        const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,w,h);x.drawImage(img,0,0,w,h);
        resolve(c.toDataURL("image/jpeg",CONFIG.quality));
      }catch(e){reject(new Error("Couldn't process that photo."))}
      finally{URL.revokeObjectURL(url)}
    };
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Couldn't read that photo. Try a JPG or PNG."))};
    img.src=url;
  });
}

/* ---------- reactions helpers ---------- */
function reactionCounts(p){
  const buckets={};
  for(const uidKey in p.reactions){
    const rid=p.reactions[uidKey];
    (buckets[rid]||(buckets[rid]=[])).push(uidKey);
  }
  return CONFIG.reactions
    .map(r=>({...r,users:buckets[r.id]||[],count:(buckets[r.id]||[]).length}))
    .filter(g=>g.count>0)
    .sort((a,b)=>b.count-a.count);
}
const totalReactions=p=>Object.keys(p.reactions).length;
function weightedReaction(u){
  if(u.favReaction&&Math.random()<0.7)return u.favReaction;
  return CONFIG.reactions[Math.floor(Math.random()*CONFIG.reactions.length)].id;
}

/* ---------- the community: fictional accounts liking / commenting / following ---------- */
function scheduleCommunityReactions(post){
  if(post.communityScheduled)return;
  post.communityScheduled=true;
  Store.savePost(post).catch(()=>{}); // persist the flag right away so a quick reload can't double-schedule
  const pool=Object.values(CONFIG.users).filter(u=>u.bot&&u.id!==post.userId);
  if(post.userId==="lizzy"&&state.activeUser!=="mikael")pool.push(CONFIG.users.mikael); // Mikael's quiet, passive presence
  shuffle(pool);
  const n=Math.min(pool.length,2+Math.floor(Math.random()*4)); // 2–5 accounts show up
  pool.slice(0,n).forEach((u,i)=>{
    const delay=1400+Math.random()*11000+i*700;
    setTimeout(()=>communityReact(post.id,u.id),delay);
  });
}
async function communityReact(postId,userId){
  const p=state.posts.find(x=>x.id===postId);if(!p)return;
  const u=CONFIG.users[userId];if(!u)return;
  if(!p.reactions[userId]){p.reactions[userId]=weightedReaction(u);reactNotify(p,userId)}
  if(u.comments&&u.comments.length&&Math.random()<0.6){
    const top=p.comments.filter(c=>!c.parentId);
    const replyToExisting=top.length&&Math.random()<0.3;
    const text=u.comments[Math.floor(Math.random()*u.comments.length)];
    const nc={id:uid(),userId,text,createdAt:Date.now(),likes:[],parentId:replyToExisting?top[Math.floor(Math.random()*top.length)].id:null};p.comments.push(nc);notifyComment(p,nc);
  }
  try{await Store.savePost(p)}catch{}
  render(true);renderSheet();
}

/* ---------- one-time seeding of the fictional accounts' posts + stories ---------- */
async function seedCommunityIfNeeded(){
  const seeded=await Store.getMeta("npc-seed-v2",false);
  if(seeded)return;
  const now=Date.now();let t=now-1000*60*60*24*6;
  for(const u of Object.values(CONFIG.users)){
    if(!u.posts)continue;
    for(const caption of u.posts){
      t+=1000*60*60*(5+Math.random()*19);
      const image=u.bot?cardImage(caption,u.tile[0],u.tile[1],u.tile[2]):null;
      if(!image)continue; // (human seed posts need a real photo, so they're skipped here)
      const post={id:uid(),userId:u.id,image,caption,createdAt:Math.min(t,now-60000),reactions:{},comments:[],communityScheduled:true};
      state.posts.push(post);
      try{await Store.savePost(post)}catch{}
    }
  }
  newestFirst();
  try{await Store.setMeta("npc-seed-v2",true)}catch{}
}
async function seedStoriesIfNeeded(){
  const seeded=await Store.getMeta("story-seed-v1",false);
  if(seeded)return;
  const seeds=[
    ["Thinking about her again. No updates needed, just facts.","💭","#ff8fce","#7a35dc"],
    ["HQ is quiet tonight. She's the loudest part of my day, even from here.","🌙","#3a3a55","#171726"]
  ];
  for(const [caption,emoji,c1,c2] of seeds){
    const story={id:uid(),userId:"mikael",image:cardImage(caption,emoji,c1,c2),caption,createdAt:Date.now()};
    state.stories.push(story);
    try{await Store.saveStory(story)}catch{}
  }
  try{await Store.setMeta("story-seed-v1",true)}catch{}
}

/* ---------- hashtags ---------- */
function extractTags(caption){
  const m=String(caption||"").match(/#(\w+)/g)||[];
  return [...new Set(m.map(t=>t.slice(1).toLowerCase()))];
}
function linkifyCaption(text){
  return esc(text).replace(/(^|[^\w#])#(\w+)/g,(m,pre,tag)=>`${pre}<a class="tag" href="#hashtag/${encodeURIComponent(tag.toLowerCase())}">#${tag}</a>`);
}
function hashtagDirectory(){
  const dir={};
  state.posts.forEach(p=>{
    extractTags(p.caption).forEach(tag=>{
      if(!dir[tag])dir[tag]={tag,count:0};
      dir[tag].count++;
    });
  });
  return dir;
}

/* ---------- explore: trending / popular / suggestions / search ---------- */
const engagementScore=p=>totalReactions(p)+p.comments.length;
function trendingPosts(n){
  const now=Date.now();
  return state.posts
    .map(p=>({p,score:engagementScore(p)/Math.max(1,(now-p.createdAt)/86400000+1)}))
    .filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,n).map(x=>x.p);
}
function popularPosts(n){
  return [...state.posts].filter(p=>totalReactions(p)>0).sort((a,b)=>totalReactions(b)-totalReactions(a)).slice(0,n);
}
function suggestedAccounts(n){
  return shuffle(Object.values(CONFIG.users).filter(u=>u.id!==state.activeUser&&!isFollowing(state.activeUser,u.id))).slice(0,n);
}
let badgeCache=null;
function trendingBadges(){
  const now=Date.now();
  const scored=state.posts.map(p=>({
    id:p.id,
    trend:engagementScore(p)/Math.max(1,(now-p.createdAt)/86400000+1),
    liked:(reactionCounts(p).find(r=>r.id==="love")||{count:0}).count,
    commented:p.comments.length,
    reacted:totalReactions(p)
  }));
  const top=key=>[...scored].filter(s=>s[key]>0).sort((a,b)=>b[key]-a[key]).slice(0,3).map(s=>s.id);
  return{trend:new Set(top("trend")),liked:new Set(top("liked")),commented:new Set(top("commented")),reacted:new Set(top("reacted"))};
}
function getBadges(){return badgeCache||(badgeCache=trendingBadges())}
function badgeFor(id){
  const b=getBadges();
  if(b.trend.has(id))return{cls:"trend",label:"🔥 Trending"};
  if(b.liked.has(id))return{cls:"liked",label:"❤️ Most liked"};
  if(b.commented.has(id))return{cls:"commented",label:"💬 Most commented"};
  if(b.reacted.has(id))return{cls:"reacted",label:"😂 Most reacted"};
  return null;
}
function searchUsers(q){return Object.values(CONFIG.users).filter(u=>u.username.toLowerCase().includes(q)||u.name.toLowerCase().includes(q))}
function searchHashtags(q){return Object.values(hashtagDirectory()).filter(h=>h.tag.includes(q)).sort((a,b)=>b.count-a.count)}
function searchPosts(q){return state.posts.filter(p=>(p.caption||"").toLowerCase().includes(q))}
function accountChip(u){
  const isMe=u.id===state.activeUser;
  return `<div class="chipCard">
    <button class="chipUser" data-user="${u.id}"><span class="ava sm"><img src="${esc(u.avatar)}" alt=""></span><b>${esc(u.name)}</b><small>@${esc(u.username)}</small></button>
    ${isMe?"":`<button class="btn ${isFollowing(state.activeUser,u.id)?"ghost":"primary"} sm" data-follow="${u.id}">${isFollowing(state.activeUser,u.id)?"Following":"Follow"}</button>`}
  </div>`;
}
function tileScroll(label,posts){
  return posts.length?`<div class="sectionLabel">${label}</div><div class="tileScroll">${posts.map(tile).join("")}</div>`:"";
}
function defaultExploreHTML(){
  if(!state.posts.length)return emptyState(I.search,"Nothing to explore","When photos get posted, they'll show up here.");
  const suggested=suggestedAccounts(8);
  return tileScroll("🔥 Trending",trendingPosts(6))
    +tileScroll("❤️ Popular",popularPosts(6))
    +(suggested.length?`<div class="sectionLabel">Suggested accounts</div><div class="chipScroll">${suggested.map(accountChip).join("")}</div>`:"")
    +`<div class="sectionLabel">Recent</div><div class="grid">${state.posts.slice(0,24).map(tile).join("")}</div>`;
}
function searchResultsHTML(q){
  const users=searchUsers(q),tags=searchHashtags(q),posts=searchPosts(q);
  if(!users.length&&!tags.length&&!posts.length)return emptyState(I.search,"No results",`Nothing matches "${esc(q)}" yet.`);
  let html="";
  if(users.length)html+=`<div class="sectionLabel">Accounts</div><div class="chipScroll">${users.map(accountChip).join("")}</div>`;
  if(tags.length)html+=`<div class="sectionLabel">Hashtags</div><div class="tagRow">${tags.map(h=>`<a class="tagChip" href="#hashtag/${encodeURIComponent(h.tag)}">#${esc(h.tag)}<span>${h.count}</span></a>`).join("")}</div>`;
  if(posts.length)html+=`<div class="sectionLabel">Posts</div><div class="grid">${posts.map(tile).join("")}</div>`;
  return html;
}
function renderExploreResults(){
  const host=$("exploreResults");if(!host)return;
  const q=state.exploreQuery.trim().toLowerCase();
  host.innerHTML=q?searchResultsHTML(q):defaultExploreHTML();
}
function bindExplore(){
  const inp=$("exploreSearch");if(!inp)return;
  inp.value=state.exploreQuery;
  inp.addEventListener("input",()=>{state.exploreQuery=inp.value;renderExploreResults()});
  renderExploreResults();
}

/* =====================================================================
   Phase 5 — Notifications, Rewards, Saved posts, Sharing, Story tools
   ===================================================================== */
const NOTIF_FILTERS=[["all","All"],["like","❤️ Likes"],["comment","💬 Comments"],["follow","👥 Followers"],["mikael","💗 Mikael"],["trend","🔥 Trending"],["reward","🎁 Rewards"],["event","🚨 Events"],["share","📤 Shared"]];
const CATS={like:"❤️",comment:"💬",follow:"👥",mikael:"💗",trend:"🔥",reward:"🎁",share:"📤",event:"🚨"};
const REWARDS={
  welcome:["👋","Welcome to MizzyGram","You're all set. Post, save, share and collect."],
  first_post:["🌱","First Post","You posted your first photo."],
  first_story:["🎞️","Storyteller","You shared your first story."],
  first_save:["🔖","Collector","You saved your first post."],
  first_share:["📤","Sharer","You shared a post."],
  reactions_10:["❤️","10 Likes","10 reactions on your posts."],
  comments_5:["💬","Conversation Starter","5 comments on your posts."],
  trending:["🔥","Trending","One of your posts hit Trending."],
  viral:["🚀","Viral","A post blew up across MizzyGram."],
  bowling:["🎳","Bowling Influencer","Collected 3 🎳 reactions on your posts."]
};
let svTimer=null;
const storyAlive=x=>x.evergreen||Date.now()-x.createdAt<CONFIG.storyHours*36e5;

/* ----- notifications ----- */
function persistNotifs(){state.notifs=state.notifs.sort((a,b)=>b.createdAt-a.createdAt).slice(0,300);Store.setMeta("notifs",state.notifs).catch(()=>{})}
function notify(n){
  if(!CONFIG.humans.includes(n.to)||n.to===n.from)return;
  n.id=uid();n.createdAt=n.createdAt||Date.now();n.read=!!n.read||state.booting;
  n.cat=({postReact:"like",storyReact:"like",commentLike:"like",comment:"comment",reply:"comment"})[n.kind]||n.kind;
  if(n.from==="mikael"&&n.to==="lizzy"&&["like","comment","follow","share","newpost","pin"].includes(n.cat))n.cat="mikael"; // 💗 Mikael interactions
  if(n.key)state.notifs=state.notifs.filter(x=>x.key!==n.key);
  state.notifs.unshift(n);
  if(n.to===state.activeUser&&state.view==="notifications"&&!n.read){n.read=true;state.notifHi.add(n.id);render(true)}
  persistNotifs();updateBadges();
}
function unnotify(key){state.notifs=state.notifs.filter(x=>x.key!==key);persistNotifs();updateBadges()}
function updateBadges(){
  const c=state.notifs.filter(n=>n.to===state.activeUser&&!n.read).length;
  document.querySelectorAll('.top a[href="#notifications"],.bottom a[data-view="notifications"]').forEach(a=>{
    let b=a.querySelector(".nBadge");
    if(!c){if(b)b.remove();return}
    if(!b){b=document.createElement("i");b.className="nBadge";a.appendChild(b)}
    b.textContent=c>9?"9+":c;
  });
}
function reactNotify(p,who){
  const r=p.reactions[who],key="pr:"+p.id+":"+who;
  if(r)notify({to:p.userId,from:who,kind:"postReact",postId:p.id,emoji:reactionOf(r).emoji,key});else unnotify(key);
  afterActivity();
}
function notifyComment(p,c){
  const par=c.parentId&&p.comments.find(x=>x.id===c.parentId);
  notify({to:p.userId,from:c.userId,kind:par?"reply":"comment",postId:p.id,text:c.text,key:"c:"+c.id});
  if(par&&par.userId!==p.userId)notify({to:par.userId,from:c.userId,kind:"reply",postId:p.id,text:c.text,key:"cr:"+c.id});
  afterActivity();
}
function notifText(n){
  const nm=`<b>${esc(userOf(n.from).name)}</b>`,q=n.text?` “${esc(n.text.slice(0,70))}”`:"";
  switch(n.kind){
    case"postReact":return`${nm} reacted ${n.emoji} to your photo.`;
    case"storyReact":return`${nm} reacted ${n.emoji} to your story.`;
    case"commentLike":return`${nm} liked your comment.${q}`;
    case"comment":return`${nm} commented:${q}`;
    case"reply":return`${nm} replied:${q}`;
    case"follow":return`${nm} started following you.`;
    case"share":return`${nm} sent you a post.${q}`;
    case"event":return esc(n.text);
    case"newpost":return`${nm} posted a new photo.${q}`;
    case"pin":return`${nm} pinned a comment on your post.`;
    case"trend":return"Your post is <b>trending</b> on MizzyGram!";
    case"reward":{const r=REWARDS[n.rewardId];return`Reward unlocked: <b>${esc(r[1])}</b> — ${esc(r[2])}`}
  }
  return"";
}
function notifRow(n){
  const sys=n.from==="system",u=userOf(n.from),p=n.postId&&state.posts.find(x=>x.id===n.postId);
  const ava=sys?`<span class="nIcon">${n.kind==="reward"?REWARDS[n.rewardId][0]:(n.emoji||"🔥")}</span>`:`<span class="nAva"><img src="${esc(u.avatar)}" alt=""><i>${CATS[n.cat]}</i></span>`;
  const fb=n.kind==="follow"&&!isFollowing(state.activeUser,n.from)?`<button class="btn primary sm" data-follow="${n.from}">Follow back</button>`:"";
  return `<div class="nRow ${state.notifHi.has(n.id)?"new":""} ${n.cat==="mikael"?"mikael":""}"><button class="nMain" data-notif="${n.id}">${ava}<span class="nText">${notifText(n)}<small>${ago(n.createdAt)}</small></span>${p?`<img class="nThumb" src="${p.image}" alt="">`:""}</button>${fb}</div>`;
}

/* ----- rewards + trending ----- */
function award(u,id){
  const have=state.rewards[u]||(state.rewards[u]=[]);
  if(have.includes(id)||!REWARDS[id])return;
  have.push(id);Store.setMeta("rewards",state.rewards).catch(()=>{});
  notify({to:u,from:"system",kind:"reward",rewardId:id});
  if(!state.booting&&id!=="welcome")pushNews("🏆","ACHIEVEMENT",userOf(u).name+" unlocked \""+REWARDS[id][1]+"\".");
}
function milestones(){
  badgeCache=null;
  const trend=getBadges().trend;
  CONFIG.humans.forEach(u=>{
    const mine=state.posts.filter(p=>p.userId===u);
    if(mine.length)award(u,"first_post");
    if(mine.reduce((n,p)=>n+Object.keys(p.reactions).filter(k=>k!==u).length,0)>=10)award(u,"reactions_10");
    if(mine.reduce((n,p)=>n+p.comments.filter(c=>c.userId!==u).length,0)>=5)award(u,"comments_5");
    if(mine.some(p=>p.viral||totalReactions(p)>=8))award(u,"viral");
    if(mine.reduce((n,p)=>n+Object.values(p.reactions).filter(r=>r==="bowling").length,0)>=3)award(u,"bowling");
    mine.forEach(p=>{if(trend.has(p.id)&&!state.trendDone.includes(p.id)){
      state.trendDone.push(p.id);Store.setMeta("trend-done",state.trendDone).catch(()=>{});
      notify({to:u,from:"system",kind:"trend",postId:p.id});award(u,"trending");
      pushNews("🔥","TRENDING",userOf(u).name+"'s photo is climbing the Trending charts.",p.id);
    }});
  });
}
const afterActivity=()=>milestones();
async function seedNotifsIfNeeded(){
  if(await Store.getMeta("notif-seed-v1",false))return;
  state.booting=true;
  state.posts.filter(p=>CONFIG.humans.includes(p.userId)).forEach(p=>{
    Object.entries(p.reactions).forEach(([w,r],i)=>{if(w!==p.userId)notify({to:p.userId,from:w,kind:"postReact",postId:p.id,emoji:reactionOf(r).emoji,key:"pr:"+p.id+":"+w,createdAt:Math.min(Date.now(),p.createdAt+6e4*(i+1))})});
    p.comments.forEach(c=>{if(c.userId!==p.userId)notify({to:p.userId,from:c.userId,kind:"comment",postId:p.id,text:c.text,key:"c:"+c.id,createdAt:c.createdAt})});
  });
  notify({to:"lizzy",from:"mikael",kind:"follow",key:"f:mikael:lizzy",createdAt:Date.now()-864e5});
  milestones();
  state.booting=false;
  CONFIG.humans.forEach(u=>award(u,"welcome")); // the one unread item so the badge shows up
  await Store.setMeta("notif-seed-v1",true);
}

/* ----- saved posts + collections ----- */
const DEF_COLS=[["favourites","💗","Favourites"],["bowling","🎳","Bowling"],["funny","😂","Funny"],["suspicious","👀","Suspicious"]];
function savedOf(u){return state.saved[u]||(state.saved[u]={items:{},cols:DEF_COLS.map(([id,emoji,name])=>({id,emoji,name}))})}
const isSaved=(u,id)=>!!savedOf(u).items[id];
const persistSaved=()=>Store.setMeta("saved:"+state.activeUser,savedOf(state.activeUser)).catch(()=>{});
function savedPosts(u,col){
  return Object.entries(savedOf(u).items).filter(([,v])=>col==="all"||v.cols.includes(col)).sort((a,b)=>b[1].at-a[1].at).map(([id])=>state.posts.find(p=>p.id===id)).filter(Boolean);
}
function toggleSave(id){
  const sv=savedOf(state.activeUser);
  if(sv.items[id]){delete sv.items[id];toast("Removed from Saved")}
  else{sv.items[id]={at:Date.now(),cols:[]};award(state.activeUser,"first_save");toast("Saved 🔖")}
  persistSaved();render(true);renderSheet();
}
function toggleInCol(postId,colId){
  const sv=savedOf(state.activeUser),it=sv.items[postId]||(sv.items[postId]={at:Date.now(),cols:[]});
  const i=it.cols.indexOf(colId);i<0?it.cols.push(colId):it.cols.splice(i,1);
  award(state.activeUser,"first_save");persistSaved();render(true);renderSheet(true);
}
function submitColForm(){
  const s=state.sheet,sv=savedOf(state.activeUser),name=$("colName").value.trim();if(!name)return;
  const emoji=Array.from($("colEmoji").value.trim())[0]||"📁";
  let c=s.colId&&sv.cols.find(x=>x.id===s.colId);
  if(c){c.name=name;c.emoji=emoji}
  else{
    c={id:uid(),name,emoji};sv.cols.push(c);
    if(s.postId){const it=sv.items[s.postId]||(sv.items[s.postId]={at:Date.now(),cols:[]});it.cols.push(c.id)}
  }
  persistSaved();
  if(s.postId)openSheet({type:"collect",id:s.postId});else closeSheet();
  render(true);
}
function deleteCollection(id){
  if(!confirm("Delete this collection? The posts stay saved."))return;
  const sv=savedOf(state.activeUser);
  sv.cols=sv.cols.filter(c=>c.id!==id);Object.values(sv.items).forEach(it=>{it.cols=it.cols.filter(c=>c!==id)});
  persistSaved();closeSheet(true);
  if(location.hash==="#saved")render(false);else location.hash="#saved";
}

/* ----- sharing ----- */
function sendShare(){
  const s=state.sheet,p=state.posts.find(x=>x.id===s.id);if(!p||!s.sel.length)return;
  p.shares=p.shares||[];
  s.sel.forEach(to=>{
    p.shares.push({from:state.activeUser,to,at:Date.now()});
    if(CONFIG.humans.includes(to))notify({to,from:state.activeUser,kind:"share",postId:p.id,text:s.note});
    else setTimeout(()=>communityReact(p.id,to),1200+Math.random()*3000); // the community reacts to what you send them
  });
  Store.savePost(p).catch(()=>{});award(state.activeUser,"first_share");
  toast("Sent to "+s.sel.slice(0,2).map(i=>userOf(i).name).join(", ")+(s.sel.length>2?" +"+(s.sel.length-2):"")+" 💌");
  closeSheet();
}
async function shareToStory(){
  const p=state.posts.find(x=>x.id===state.sheet.id);if(!p)return;
  if(await publishStory({kind:"photo",image:p.image,caption:"📌 @"+userOf(p.userId).username+(p.caption?": "+p.caption.slice(0,80):""),duration:6000}))closeSheet();
}

/* ----- stories: create / react / community ----- */
function openStoryComposer(){state.storyDraft={mode:"photo",image:null,text:"",bg:0,secs:CONFIG.storySeconds};openSheet({type:"storyCompose"})}
async function publishStory(f){
  const st={id:uid(),userId:state.activeUser,createdAt:Date.now(),reactions:{},viewers:{},duration:CONFIG.storySeconds*1000,...f};
  try{await Store.saveStory(st)}catch{toast("Couldn't save your story");return false}
  state.stories.push(st);award(state.activeUser,"first_story");
  toast("Added to your story ✨");render(true);scheduleStoryCommunity(st);return true;
}
async function submitStory(){
  const d=state.storyDraft,err=$("stErr");
  if(d.mode==="photo"&&!d.image){err.textContent="Choose a photo first.";return}
  if(d.mode==="text"&&!d.text.trim()){err.textContent="Type something first.";return}
  const f=d.mode==="photo"?{kind:"photo",image:d.image,caption:""}:{kind:"text",text:d.text.trim(),bg:d.bg};
  if(await publishStory({...f,duration:d.secs*1000}))closeSheet();
}
$("sheet").addEventListener("change",async e=>{
  if(e.target.id!=="stPhoto")return;
  try{state.storyDraft.image=await prepareImage(e.target.files&&e.target.files[0]);renderSheet(true)}
  catch(x){const er=$("stErr");if(er)er.textContent=x.message}
});
$("sheet").addEventListener("input",e=>{
  if(e.target.id==="stText"&&state.storyDraft)state.storyDraft.text=e.target.value;
  if(e.target.id==="shareNote"&&state.sheet)state.sheet.note=e.target.value;
});
function svReact(rid){
  const s=state.sheet,st=s.list[s.index],me=state.activeUser,key="sr:"+st.id+":"+me;
  if(st.reactions[me]===rid){delete st.reactions[me];unnotify(key)}
  else{st.reactions[me]=rid;notify({to:st.userId,from:me,kind:"storyReact",storyId:st.id,emoji:reactionOf(rid).emoji,key})}
  Store.saveStory(st).catch(()=>{});
  document.querySelectorAll(".svReact").forEach(b=>b.classList.toggle("on",st.reactions[me]===b.dataset.svReact));
  const f=document.createElement("span");f.className="svFloat";f.textContent=reactionOf(rid).emoji;
  $("sheet").firstElementChild.appendChild(f);setTimeout(()=>f.remove(),900);
}
function scheduleStoryCommunity(st){
  const pool=Object.values(CONFIG.users).filter(u=>u.id!==st.userId); // bots + the other human (Mikael's quiet presence)
  shuffle(pool).slice(0,2+Math.floor(Math.random()*3)).forEach((u,i)=>setTimeout(async()=>{
    st.viewers[u.id]=Date.now();
    if(Math.random()<.75){const r=weightedReaction(u);st.reactions[u.id]=r;notify({to:st.userId,from:u.id,kind:"storyReact",storyId:st.id,emoji:reactionOf(r).emoji,key:"sr:"+st.id+":"+u.id})}
    try{await Store.saveStory(st)}catch{}
  },1500+Math.random()*9000+i*700));
}
const migrateStory=x=>{if(!x.kind){x.kind="photo";x.evergreen=true;x.duration=5000}x.reactions=x.reactions||{};x.viewers=x.viewers||{};return x};
async function seedBotStoriesIfNeeded(){
  if(await Store.getMeta("story-seed-v2",false))return;
  [["chocolateemergency","🚨 Chocolate levels: CRITICAL. Snacks deployed.",4],["bowlingfederation","🎳 Strike Day is still in effect. No gutters. None.",1],["mickysdailynews","📰 BREAKING: you two are still the front page.",5]].forEach(([userId,text,bg],i)=>{
    const st={id:uid(),userId,kind:"text",text,bg,duration:6000,evergreen:true,createdAt:Date.now()-i*36e5,reactions:{},viewers:{}};
    state.stories.push(st);Store.saveStory(st).catch(()=>{});
  });
  await Store.setMeta("story-seed-v2",true);
}

/* =====================================================================
   Phase 6 — News, Random Events, On This Day
   ===================================================================== */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const persistNews=()=>Store.setMeta("news",state.news).catch(()=>{});
function pushNews(emoji,tag,headline,postId,createdAt){
  state.news.unshift({id:uid(),emoji,tag,headline,postId:postId||null,createdAt:createdAt||Date.now()});
  state.news=state.news.slice(0,60);persistNews();
  if(state.view==="news"&&!state.booting)render(true);
}
const newsCard=n=>`<div class="newsCard" ${n.postId?`data-open="${n.postId}"`:""}><div class="newsTag">${n.emoji} ${esc(n.tag)}</div><h3>${esc(n.headline)}</h3><time>${ago(n.createdAt)}</time></div>`;
async function seedNewsIfNeeded(){
  if(await Store.getMeta("news-seed-v1",false))return;
  const h=36e5;
  [["📰","BREAKING NEWS","Lizzy has challenged Mikael to another bowling match.",1],
   ["🎳","BOWLING FEDERATION","Federation denies involvement. Officially.",5],
   ["🍫","CHOCOLATE EMERGENCY","Regional shortage declared. Lizzy 'not worried'.",9],
   ["💗","EXCLUSIVE","Sources: Mikael has not stopped smiling since Tuesday.",20]
  ].forEach(([e,t,l,ago_])=>state.news.push({id:uid(),emoji:e,tag:t,headline:l,postId:null,createdAt:Date.now()-ago_*h}));
  persistNews();await Store.setMeta("news-seed-v1",true);
}
async function botPost(userId,caption,extra){
  const u=CONFIG.users[userId],post={id:uid(),userId,image:cardImage(caption,u.tile[0],u.tile[1],u.tile[2]),caption,createdAt:Date.now(),reactions:{},comments:[],communityScheduled:true,...extra};
  state.posts.push(post);newestFirst();try{await Store.savePost(post)}catch{}
  render(true);return post;
}
async function declassify(id){
  const p=state.posts.find(x=>x.id===id);if(!p)return;
  p.declassified=true;try{await Store.savePost(p)}catch{}
  toast("Declassified 🕵️");render(true);renderSheet();
}
const humanPost=()=>{const mine=state.posts.filter(p=>p.userId===state.activeUser),all=state.posts.filter(p=>CONFIG.humans.includes(p.userId));return pick(mine.length?mine:all.length?all:[null])};
const bots=()=>Object.values(CONFIG.users).filter(u=>u.bot);
const EVENTS={
  breaking:{e:"🚨",tag:"BREAKING NEWS",run(){return{headline:pick(["Lizzy has challenged Mikael to another bowling match.","HQ reports Mikael smiled at his phone for no reason.","Chocolate Emergency confirms supplies are 'fine, mostly'.","Sources say Lizzy is winning. Again."])}}},
  viral:{e:"🔥",tag:"VIRAL MOMENT",run(){
    const p=humanPost();if(!p)return EVENTS.breaking.run();
    p.viral=true;Store.savePost(p).catch(()=>{});
    shuffle(bots()).forEach((u,i)=>setTimeout(()=>communityReact(p.id,u.id),i*450));
    return{headline:userOf(p.userId).name+"'s photo is going viral. The whole community is talking.",postId:p.id};
  }},
  mystery:{e:"👀",tag:"MYSTERY VIEWER",run(){
    const [a,b]=shuffle(bots()).slice(0,2);
    return{headline:"A mystery viewer checked "+userOf(state.activeUser).name+"'s profile 6 times. Suspects: @"+a.username+", @"+b.username+". Allegedly."};
  }},
  mikael:{e:"💗",tag:"MIKAEL SURPRISE",run(){
    const p=state.posts.find(x=>x.userId==="lizzy");
    if(p){communityReact(p.id,"mikael");}
    return{headline:"Mikael left Lizzy a surprise. He says it was 'nothing'. It was not nothing.",postId:p&&p.id};
  }},
  bowling:{e:"🎳",tag:"BOWLING CHALLENGE",run(){
    botPost("bowlingfederation","🎳 CHALLENGE ISSUED: Lizzy vs Mikael. Rematch date TBD. Gutter balls will be mocked. #BowlingQueen");
    return{headline:"Lizzy has challenged Mikael to another bowling match. The Federation is 'watching closely'."};
  }},
  bomb:{e:"😂",tag:"COMMENT BOMB",run(){
    const p=humanPost();if(!p)return EVENTS.breaking.run();
    shuffle(bots().filter(u=>u.comments)).slice(0,5).forEach((u,i)=>setTimeout(()=>{
      const c={id:uid(),userId:u.id,text:pick(u.comments),createdAt:Date.now(),likes:[],parentId:null};
      p.comments.push(c);notifyComment(p,c);Store.savePost(p).catch(()=>{});render(true);renderSheet();
    },i*600));
    return{headline:"The comment section on "+userOf(p.userId).name+"'s post has erupted. 5 comments in seconds.",postId:p.id};
  }},
  classified:{e:"🕵️",tag:"CLASSIFIED POST",run(){
    botPost("mikaelhq","🕵️ CLASSIFIED: ██████ ████ ██ Lizzy ██████. Clearance required.",{classified:true});
    return{headline:"Mikael HQ has filed a classified post. Clearance level: Lizzy."};
  }}
};
function runEvent(kind){
  const ev=EVENTS[kind]||EVENTS[pick(Object.keys(EVENTS))],r=ev.run()||{};
  pushNews(ev.e,ev.tag,r.headline,r.postId);
  CONFIG.humans.forEach(u=>notify({to:u,from:"system",kind:"event",emoji:ev.e,text:ev.tag+": "+r.headline,postId:r.postId||null}));
  toast(ev.e+" "+r.headline);
  state.lastEvent=Date.now();Store.setMeta("event-last",state.lastEvent).catch(()=>{});
}
function startEvents(){
  setInterval(()=>{
    if(document.hidden||state.sheet)return;
    if(Date.now()-state.lastEvent>CONFIG.eventGapMin*6e4&&Math.random()<.5)runEvent();
  },40000);
}

/* ----- On This Day ----- */
function memories(){
  const now=new Date(),out=[];
  state.posts.filter(p=>CONFIG.humans.includes(p.userId)).forEach(p=>{
    const d=new Date(p.createdAt),yrs=now.getFullYear()-d.getFullYear(),days=Math.floor((now-p.createdAt)/864e5);
    if(yrs>=1&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate())out.push({label:yrs+(yrs>1?" years":" year")+" ago",post:p});
    else if([7,30,90].includes(days))out.push({label:days===7?"1 week ago":days===30?"1 month ago":"3 months ago",post:p});
  });
  CONFIG.memories.forEach(m=>{if(m.month===now.getMonth()+1&&m.day===now.getDate())out.push({label:m.year?(now.getFullYear()-m.year)+" years ago":"Today",text:m.text})});
  return out;
}
const memCard=m=>`<div class="memCard" ${m.post?`data-open="${m.post.id}"`:""}>${m.post?`<img src="${m.post.image}" alt="">`:""}<div><div class="memTag">💗 ON THIS DAY · ${m.label}</div><p>${esc(m.post?(m.post.caption||"A photo from "+userOf(m.post.userId).name):m.text)}</p></div></div>`;
function homeExtras(){
  const top=state.news[0],mem=memories().slice(0,2);
  return `<a class="newsBanner" href="#news"><span>📰</span><div><b>MizzyGram News</b><small>${top?esc(top.headline):"Nothing breaking. Yet."}</small></div></a>${mem.map(memCard).join("")}`;
}

/* =====================================================================
   Phase 7 — Mikael HQ bridge (HQ queues commands on the Worker; this
   device polls, applies them, and publishes a small snapshot back)
   ===================================================================== */
const WORKER="https://lizzyos-notifications.mulaudzimikael73.workers.dev/";
const hqPost=body=>fetch(WORKER,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify({type:body.action,...body})}).then(r=>r.json());
async function applyCommand(c){
  const p=c.postId?(c.postId==="latest"?state.posts.find(x=>x.userId==="lizzy"):state.posts.find(x=>x.id===c.postId)):null,save=async()=>{try{await Store.savePost(p)}catch{}};
  switch(c.kind){
    case"post":{
      const u=CONFIG.users[c.account];if(!u)return;
      const tags=String(c.tags||"").split(/[\s,]+/).filter(Boolean).map(t=>"#"+t.replace(/^#+/,"")).join(" ");
      const caption=[String(c.caption||"").slice(0,CONFIG.maxCaption),tags].filter(Boolean).join(" ").trim(),t=u.tile||["💭","#ff8fce","#7a35dc"];
      const post={id:uid(),userId:u.id,image:c.image||cardImage(caption||"…",t[0],t[1],t[2]),caption,mood:c.mood||"",audience:c.audience==="lizzy"?"lizzy":"everyone",createdAt:Date.now(),reactions:{},comments:[],communityScheduled:c.audience==="lizzy"};
      state.posts.push(post);newestFirst();try{await Store.savePost(post)}catch{}
      notify({to:"lizzy",from:u.id,kind:"newpost",postId:post.id,text:post.audience==="lizzy"?"Just for you 💗":""});
      if(u.bot)pushNews("📰","@"+u.username.toUpperCase(),caption.slice(0,90),post.id);
      if(post.audience!=="lizzy")scheduleCommunityReactions(post);
      break}
    case"like":case"react":
      if(p){p.reactions.mikael=reactionOf(c.reaction)?c.reaction:"love";reactNotify(p,"mikael");await save()}break;
    case"comment":case"reply":
      if(p&&c.text){const n={id:uid(),userId:"mikael",text:String(c.text).slice(0,CONFIG.maxComment),createdAt:Date.now(),likes:[],parentId:c.parentId||null};p.comments.push(n);notifyComment(p,n);await save()}break;
    case"pin":
      if(p&&p.comments.some(x=>x.id===c.commentId)){p.comments.forEach(x=>{x.pinned=x.id===c.commentId});notify({to:p.userId,from:"mikael",kind:"pin",postId:p.id});await save()}break;
    case"event":runEvent(c.event);break;
  }
  render(true);renderSheet();
}
let hqBusy=false,snapSig="";
function pushSnapshot(){
  const posts=state.posts.slice(0,25).map(p=>({id:p.id,userId:p.userId,caption:(p.caption||"").slice(0,140),mood:p.mood||"",mine:p.reactions.mikael||null,rx:Object.values(p.reactions).reduce((a,r)=>(a[r]=(a[r]||0)+1,a),{}),createdAt:p.createdAt,comments:p.comments.map(c=>({id:c.id,userId:c.userId,text:c.text.slice(0,80),parentId:c.parentId,pinned:!!c.pinned}))}));
  const sig=JSON.stringify(posts);if(sig===snapSig)return;snapSig=sig;
  hqPost({action:"mg_snapshot_put",snapshot:{at:Date.now(),posts}}).catch(()=>{});
}
async function pollHQ(){
  if(hqBusy||document.hidden||state.activeUser!=="lizzy")return; // only Lizzy's side consumes HQ commands
  hqBusy=true;
  try{
    const d=await (await fetch(WORKER+"?action=mg_queue",{cache:"no-store"})).json();
    const done=new Set(await Store.getMeta("mg-handled",[])),ids=[];
    for(const c of d.commands||[]){ids.push(c.id);if(done.has(c.id))continue;done.add(c.id);try{await applyCommand(c)}catch{}}
    if(ids.length){await Store.setMeta("mg-handled",[...done].slice(-200));hqPost({action:"mg_ack",ids}).catch(()=>{})}
    pushSnapshot();
  }catch{}finally{hqBusy=false}
}
function startHQ(){setInterval(pollHQ,10000);pollHQ()}

async function seedPresidentIfNeeded(){
  // existing installs already ran the community seed, so The President gets his own one-time seed
  if(await Store.getMeta("npc-seed-president-v1",false))return;
  try{await Store.setMeta("npc-seed-president-v1",true)}catch{}
  if(state.posts.some(p=>p.userId==="thepresident"))return;
  const u=CONFIG.users.thepresident;let t=Date.now()-1000*60*60*24*3;
  for(const caption of u.posts){
    t+=1000*60*60*(6+Math.random()*14);
    const post={id:uid(),userId:u.id,image:cardImage(caption,u.tile[0],u.tile[1],u.tile[2]),caption,createdAt:Math.min(t,Date.now()-60000),reactions:{},comments:[],communityScheduled:true};
    state.posts.push(post);try{await Store.savePost(post)}catch{}
  }
  newestFirst();
}

/* =====================================================================
   Views
   ===================================================================== */
function postCard(p){
  const u=userOf(p.userId),mineReact=p.reactions[state.activeUser],total=totalReactions(p);
  const n=p.comments.length;
  const alt=p.caption?`Photo by ${u.username}: ${p.caption.slice(0,100)}`:`Photo by ${u.username}`;
  const groups=reactionCounts(p).slice(0,3).map(g=>g.emoji).join("");
  const badge=badgeFor(p.id),saved=isSaved(state.activeUser,p.id);
  return `<article class="post" data-id="${p.id}">
    <header class="postHead">
      <button class="ava" data-user="${u.id}" aria-label="${esc(u.name)}'s profile"><img src="${esc(u.avatar)}" alt=""></button>
      <button class="uname" data-user="${u.id}">${esc(u.username)}</button>${p.mood?`<small class="mood">${esc(p.mood)}</small>`:""}${p.audience==="lizzy"?`<small class="mood">💗 just for Lizzy</small>`:""}
      <time datetime="${new Date(p.createdAt).toISOString()}">${ago(p.createdAt)}</time>
    </header>
    <div class="photo ${p.classified&&!p.declassified?"classified":""}" data-dbl>${p.classified&&!p.declassified?`<button class="declass" data-declassify="${p.id}">🕵️ CLASSIFIED — tap to declassify</button>`:""}${badge?`<span class="postBadge ${badge.cls}">${badge.label}</span>`:""}<img src="${p.image}" alt="${esc(alt)}"><span class="burst" aria-hidden="true">${mineReact?reactionOf(mineReact).emoji:I.heart}</span></div>
    <div class="actions">
      <div class="likeWrap">
        <button class="act ${mineReact?"on":""}" data-like data-id="${p.id}" aria-pressed="${!!mineReact}" aria-label="${mineReact?"Remove reaction":"Like (hold for more reactions)"}">${mineReact?`<span class="reactEmoji">${reactionOf(mineReact).emoji}</span>`:I.heart}</button>
      </div>
      <button class="act" data-comment aria-label="Comment">${I.comment}</button>
      <button class="act" data-share aria-label="Share">${I.send}</button>
      <span class="spacer"></span>
      ${saved?`<button class="act" data-collect aria-label="Add to collection">${I.folder}</button>`:""}
      <button class="act ${saved?"on":""}" data-save aria-pressed="${saved}" aria-label="${saved?"Unsave":"Save"}">${I.bookmark}</button>
    </div>
    ${total?`<button class="likes" data-reactions="${p.id}">${groups} ${total} ${total===1?"reaction":"reactions"}</button>`:""}
    ${p.caption?`<div class="cap"><b>${esc(u.username)}</b>${linkifyCaption(p.caption)}</div>`:""}
    ${n?`<button class="viewC" data-comment>View ${n===1?"1 comment":`all ${n} comments`}</button>`:""}
  </article>`;
}

function emptyState(icon,title,text,cta){
  return `<div class="empty"><div class="bigIcon">${icon}</div><h2>${title}</h2><p>${text}</p>${cta||""}</div>`;
}

function storiesBar(){
  const me=state.activeUser,byUser={};
  state.stories.filter(storyAlive).forEach(x=>(byUser[x.userId]||(byUser[x.userId]=[])).push(x));
  const order=Object.keys(byUser).filter(id=>id!==me).sort((a,b)=>{
    const ha=CONFIG.humans.includes(a),hb=CONFIG.humans.includes(b);if(ha!==hb)return ha?-1:1;
    return Math.max(...byUser[b].map(x=>x.createdAt))-Math.max(...byUser[a].map(x=>x.createdAt));
  });
  const ring=(id,label,extra)=>{
    const u=userOf(id),unseen=(byUser[id]||[]).some(x=>!state.seenStories.has(x.id));
    return `<div class="storyItem"><button class="storyRing ${unseen?"unseen":""}" data-story-user="${id}"><span class="storyAva"><img src="${esc(u.avatar)}" alt=""></span><span class="storyName">${label}</span></button>${extra||""}</div>`;
  };
  return `<div class="stories">${ring(me,"Your story",`<button class="storyAdd" data-st-add aria-label="Add to your story">+</button>`)}${order.map(id=>ring(id,esc(userOf(id).name))).join("")}</div>`;
}

const renderers={
  home(){
    const bar=storiesBar()+homeExtras();
    if(!state.posts.length)return bar+emptyState(I.photo,"Nothing here yet","Your feed is empty. Share the first photo in Our World.",'<a class="btn primary" href="#post">Post a photo</a>');
    return bar+state.posts.map(postCard).join("");
  },
  explore(){
    return `<h1 class="pageTitle">Explore</h1>
      <div class="searchBar"><span class="searchIcon" aria-hidden="true">${I.search}</span><input id="exploreSearch" type="search" placeholder="Search accounts, #hashtags, or posts" aria-label="Search MizzyGram"></div>
      <div id="exploreResults"></div>`;
  },
  hashtag(){
    const tag=state.hashtag||"";
    const posts=state.posts.filter(p=>extractTags(p.caption).includes(tag));
    return `<div class="hashHead"><a class="backLink" href="#explore" aria-label="Back to Explore">${I.back}</a><h1 class="pageTitle">#${esc(tag)}</h1></div>
      <p class="hashCount">${posts.length} post${posts.length===1?"":"s"}</p>
      ${posts.length?`<div class="grid">${posts.map(tile).join("")}</div>`:emptyState(I.search,"No posts yet",`Nothing's been tagged #${esc(tag)} yet.`)}`;
  },
  post(){
    const pend=state.pending;
    return `<form class="compose" id="composeForm" novalidate>
      <label class="drop">
        <input type="file" id="photoInput" accept="image/*" aria-label="Choose a photo">
        ${pend?`<img src="${pend.image}" alt="Selected photo preview">`:`<span class="dropHint">${I.photo}<b>Choose a photo</b><span>Tap to pick one from your device</span></span>`}
      </label>
      <label class="lbl" for="caption">Caption</label>
      <textarea id="caption" maxlength="${CONFIG.maxCaption}" placeholder="Write a caption…">${esc(pend?pend.caption:"")}</textarea>
      <div class="count" id="capCount">0/${CONFIG.maxCaption}</div>
      <div class="err" id="postErr" role="alert"></div>
      <button class="btn primary block" id="shareBtn" type="submit" ${pend?"":"disabled"}>Post</button>
    </form>`;
  },
  notifications(){
    const f=state.notifFilter,all=state.notifs.filter(n=>n.to===state.activeUser).sort((a,b)=>b.createdAt-a.createdAt),list=f==="all"?all:all.filter(n=>n.cat===f);
    const chips=`<div class="filterRow">${NOTIF_FILTERS.map(([id,l])=>`<button class="fChip ${f===id?"on":""}" data-nfilter="${id}">${l}</button>`).join("")}</div>`;
    const day=new Date().setHours(0,0,0,0);let last="",html="";
    list.forEach(n=>{const g=n.createdAt>=day?"Today":n.createdAt>day-6*864e5?"This week":"Earlier";if(g!==last){html+=`<div class="sectionLabel">${g}</div>`;last=g}html+=notifRow(n)});
    return `<h1 class="pageTitle">Notifications</h1>${chips}${html||emptyState(I.heart,"All quiet","Nothing here yet.")}`;
  },
  news(){
    const mem=memories();
    return `<div class="hashHead"><a class="backLink" href="#home" aria-label="Back to Home">${I.back}</a><h1 class="pageTitle">📰 MizzyGram News</h1></div>
      <div class="newsTools"><button class="btn ghost sm" data-event-now>🎲 Trigger an event</button><a class="btn ghost sm" href="#achievements">🏆 Achievements</a></div>
      ${mem.length?`<div class="sectionLabel">On this day</div>${mem.map(memCard).join("")}`:""}
      <div class="sectionLabel">Latest</div>${state.news.map(newsCard).join("")||emptyState(I.grid,"No news yet","Stay tuned.")}`;
  },
  achievements(){
    const have=state.rewards[state.activeUser]||[],all=Object.entries(REWARDS).filter(([id])=>id!=="welcome");
    return `<div class="hashHead"><a class="backLink" href="#profile" aria-label="Back to profile">${I.back}</a><h1 class="pageTitle">Achievements</h1></div>
      <p class="hashCount">${all.filter(([id])=>have.includes(id)).length} of ${all.length} unlocked</p>
      <div class="achGrid">${all.map(([id,r])=>{const on=have.includes(id);return `<div class="ach ${on?"on":""}"><span>${on?r[0]:"🔒"}</span><b>${esc(r[1])}</b><small>${esc(r[2])}</small></div>`}).join("")}</div>`;
  },
  saved(){
    const u=state.activeUser,sv=savedOf(u),col=state.savedCol;
    if(!col){
      const tl=(id,emoji,name)=>{const ps=savedPosts(u,id),c=ps[0];return `<a class="colTile" href="#saved/${encodeURIComponent(id)}"><span class="colCover">${c?`<img src="${c.image}" alt="">`:`<em>${emoji}</em>`}</span><b>${emoji} ${esc(name)}</b><small>${ps.length} post${ps.length===1?"":"s"}</small></a>`};
      return `<div class="hashHead"><a class="backLink" href="#profile" aria-label="Back to profile">${I.back}</a><h1 class="pageTitle">Saved</h1></div><div class="colGrid">${tl("all","🔖","All posts")}${sv.cols.map(c=>tl(c.id,c.emoji,c.name)).join("")}<button class="colTile" data-colform><span class="colCover"><em>＋</em></span><b>New collection</b></button></div>`;
    }
    const c=sv.cols.find(x=>x.id===col),ps=savedPosts(u,col);
    return `<div class="hashHead"><a class="backLink" href="#saved" aria-label="Back to Saved">${I.back}</a><h1 class="pageTitle">${c?c.emoji+" "+esc(c.name):"All posts"}</h1>${c?`<button class="cLink editCol" data-colform="${c.id}">Edit</button>`:""}</div>${ps.length?`<div class="grid">${ps.map(tile).join("")}</div>`:emptyState(I.bookmark,"Nothing here yet","Tap the bookmark on a post to save it.")}`;
  },
  profile(){
    const viewing=state.profileUser||state.activeUser;
    const u=userOf(viewing),isMe=viewing===state.activeUser;
    const mine=state.posts.filter(p=>p.userId===viewing);
    const followers=followersOf(viewing).length,following=followingOf(viewing).length;
    const other=otherHuman(state.activeUser);
    return `<section class="pHead">
        <div class="pAva"><img src="${esc(u.avatar)}" alt="${esc(u.name)}'s profile picture"></div>
        <div class="stats">
          <div><b>${mine.length}</b><span>Posts</span></div>
          <button class="statBtn" data-stat="followers" data-stat-user="${viewing}"><b>${followers}</b><span>Followers</span></button>
          <button class="statBtn" data-stat="following" data-stat-user="${viewing}"><b>${following}</b><span>Following</span></button>
        </div>
      </section>
      <section class="pInfo">
        <h1 class="pName">${esc(u.name)}${u.bot?' <span class="botTag">bot</span>':""}</h1>
        <div class="pUser">@${esc(u.username)}</div>
        <p class="pBio">${esc(u.bio)}</p>
        ${(state.rewards[viewing]||[]).filter(x=>x!=="welcome").length?`<p class="pBadges" title="Achievements">${state.rewards[viewing].filter(x=>x!=="welcome").map(x=>REWARDS[x][0]).join(" ")}</p>`:""}
        ${isMe
          ?`<button class="btn ghost block" data-switch="${other}">Switch to ${esc(userOf(other).name)}</button><a class="btn ghost block achLink" href="#achievements">🏆 Achievements</a>`
          :`<button class="btn ${isFollowing(state.activeUser,viewing)?"ghost":"primary"} block" data-follow="${viewing}" aria-pressed="${isFollowing(state.activeUser,viewing)}">${isFollowing(state.activeUser,viewing)?"Following":"Follow"}</button>`}
      </section>
      ${isMe?`<div class="pTabs"><span class="on">${I.grid}Posts</span><a href="#saved">${I.bookmark}Saved</a></div>`:`<div class="gridLabel">${I.grid}<span>Posts</span></div>`}
      ${mine.length?`<div class="grid">${mine.map(tile).join("")}</div>`:`<div class="gridEmpty">No posts yet.</div>`}`;
  }
};

const tile=p=>`<button class="tile ${p.classified&&!p.declassified?"blur":""}" data-open="${p.id}" aria-label="Open photo${p.caption?": "+esc(p.caption.slice(0,60)):""}"><img src="${p.image}" alt=""></button>`;

/* ---------- render + routing ---------- */
function render(keepScroll){
  badgeCache=null;
  const v=$("view"),top=v.scrollTop;
  v.innerHTML=renderers[state.view]();
  v.scrollTop=keepScroll?top:0;
  document.querySelectorAll(".bottom a").forEach(a=>{
    const forThis=a.dataset.view===state.view||(a.dataset.view==="explore"&&state.view==="hashtag")||(a.dataset.view==="profile"&&state.view==="saved");
    if(forThis)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
  });
  if(state.view==="post")bindCompose();
  if(state.view==="explore")bindExplore();
  updateBadges();
}
function route(){
  const raw=(location.hash||"#home").slice(1);
  const slash=raw.indexOf("/");
  const base=slash<0?raw:raw.slice(0,slash);
  if(base==="hashtag"){
    state.view="hashtag";
    state.hashtag=decodeURIComponent(slash<0?"":raw.slice(slash+1)).toLowerCase();
  }else if(base==="saved"){
    state.view="saved";state.savedCol=decodeURIComponent(slash<0?"":raw.slice(slash+1));
  }else{
    state.view=VIEWS.includes(base)?base:"home";
  }
  if(state.view==="notifications"){
    state.notifHi=new Set();
    state.notifs.forEach(n=>{if(n.to===state.activeUser&&!n.read){state.notifHi.add(n.id);n.read=true}});
    persistNotifs();
  }
  closeSheet(true);closeReactPicker();
  render(false);
}
window.addEventListener("hashchange",route);
document.querySelector('.bottom a[data-view="profile"]').addEventListener("click",()=>{state.profileUser=null});

/* ---------- create post ---------- */
function bindCompose(){
  const input=$("photoInput"),cap=$("caption"),count=$("capCount"),err=$("postErr"),btn=$("shareBtn");
  const upd=()=>{count.textContent=`${cap.value.length}/${CONFIG.maxCaption}`;if(state.pending)state.pending.caption=cap.value};
  upd();cap.addEventListener("input",upd);
  input.addEventListener("change",async()=>{
    err.textContent="";
    const f=input.files&&input.files[0];if(!f)return;
    try{
      const image=await prepareImage(f);
      state.pending={image,caption:cap.value};
      render(true);$("caption").focus();
    }catch(e){err.textContent=e.message}
  });
  $("composeForm").addEventListener("submit",async e=>{
    e.preventDefault();
    if(!state.pending)return;
    btn.disabled=true;err.textContent="";
    const post={id:uid(),userId:state.activeUser,image:state.pending.image,caption:cap.value.trim(),createdAt:Date.now(),reactions:{},comments:[]};
    try{
      await Store.savePost(post);
      state.posts.push(post);newestFirst();
      award(state.activeUser,"first_post");
      pushNews("📸","NEW POST",userOf(state.activeUser).name+" posts a new photo. The app is \"coping\".",post.id);
      state.pending=null;
      toast("Posted 💗");
      location.hash="#home";
      if(state.view==="home")render(false);
      scheduleCommunityReactions(post);
    }catch(e2){
      err.textContent="Couldn't save that post — your browser may be out of space.";
      btn.disabled=false;
    }
  });
}

/* ---------- likes / reactions ---------- */
async function toggleReaction(id,reactionId){
  const p=state.posts.find(x=>x.id===id);if(!p)return;
  if(p.reactions[state.activeUser]===reactionId)delete p.reactions[state.activeUser];
  else p.reactions[state.activeUser]=reactionId;
  reactNotify(p,state.activeUser);
  try{await Store.savePost(p)}catch{toast("Couldn't save that reaction")}
  render(true);renderSheet();
}
async function forceLove(id){
  const p=state.posts.find(x=>x.id===id);if(!p)return;
  p.reactions[state.activeUser]="love";
  reactNotify(p,state.activeUser);
  try{await Store.savePost(p)}catch{toast("Couldn't save that reaction")}
  render(true);renderSheet();
}

/* ---------- reaction picker (press & hold the like button) ---------- */
let pressTimer=null,longPressed=false;
function showReactPicker(postId,btn){
  closeReactPicker();
  const app=$("app"),pop=document.createElement("div");
  pop.id="reactPop";pop.className="reactPop";pop.setAttribute("role","menu");pop.setAttribute("aria-label","Choose a reaction");
  pop.innerHTML=CONFIG.reactions.map(r=>`<button class="reactOpt" type="button" data-react="${r.id}" data-id="${postId}" role="menuitem" aria-label="${r.label}">${r.emoji}</button>`).join("");
  app.appendChild(pop);
  const aRect=app.getBoundingClientRect(),bRect=btn.getBoundingClientRect();
  const left=Math.min(Math.max(bRect.left-aRect.left+bRect.width/2,110),aRect.width-110);
  pop.style.left=left+"px";
  pop.style.top=Math.max(bRect.top-aRect.top-58,8)+"px";
  requestAnimationFrame(()=>pop.classList.add("show"));
}
function closeReactPicker(){const p=$("reactPop");if(p)p.remove()}
function onPressStart(e){
  const btn=e.target.closest("[data-like]");if(!btn)return;
  longPressed=false;
  clearTimeout(pressTimer);
  pressTimer=setTimeout(()=>{
    longPressed=true;
    showReactPicker(btn.closest("[data-id]").dataset.id,btn);
    if(navigator.vibrate)try{navigator.vibrate(8)}catch{}
  },420);
}
function onPressEnd(){clearTimeout(pressTimer)}
["view","sheet"].forEach(id=>{
  const el=$(id);
  el.addEventListener("pointerdown",onPressStart);
  el.addEventListener("pointerup",onPressEnd);
  el.addEventListener("pointerleave",onPressEnd);
  el.addEventListener("pointercancel",onPressEnd);
});
document.addEventListener("click",e=>{
  const opt=e.target.closest("[data-react]");
  if(opt)return toggleReaction(opt.dataset.id,opt.dataset.react),closeReactPicker();
  if($("reactPop")&&!e.target.closest("#reactPop")&&!e.target.closest("[data-like]"))closeReactPicker();
});

/* ---------- comments ---------- */
async function submitComment(postId,text,parentId){
  const p=state.posts.find(x=>x.id===postId);if(!p)return;
  const nc={id:uid(),userId:state.activeUser,text,createdAt:Date.now(),likes:[],parentId:parentId||null};p.comments.push(nc);notifyComment(p,nc);
  try{await Store.savePost(p)}catch{toast("Couldn't save that comment")}
  state.replyTo=null;
  render(true);renderSheet();
}
async function toggleCommentLike(postId,commentId){
  const p=state.posts.find(x=>x.id===postId);if(!p)return;
  const c=p.comments.find(x=>x.id===commentId);if(!c)return;
  const i=c.likes.indexOf(state.activeUser);
  i<0?c.likes.push(state.activeUser):c.likes.splice(i,1);
  const ck="cl:"+c.id+":"+state.activeUser;
  if(i<0)notify({to:c.userId,from:state.activeUser,kind:"commentLike",postId,text:c.text,key:ck});else unnotify(ck);
  try{await Store.savePost(p)}catch{toast("Couldn't save that")}
  render(true);renderSheet();
}
async function deleteComment(postId,commentId){
  const p=state.posts.find(x=>x.id===postId);if(!p)return;
  const c=p.comments.find(x=>x.id===commentId);
  if(!c||c.userId!==state.activeUser)return;
  if(!confirm("Delete this comment?"))return;
  p.comments=p.comments.filter(x=>x.id!==commentId&&x.parentId!==commentId);
  if(state.replyTo&&state.replyTo.id===commentId)state.replyTo=null;
  try{await Store.savePost(p)}catch{toast("Couldn't delete that comment")}
  render(true);renderSheet();
}
function commentRow(c,isReply){
  const u=userOf(c.userId),liked=c.likes.includes(state.activeUser),canDel=c.userId===state.activeUser;
  return `<div class="cItem ${isReply?"reply":""}">
    <button class="ava sm" data-user="${u.id}" aria-label="${esc(u.name)}'s profile"><img src="${esc(u.avatar)}" alt=""></button>
    <div class="cBody">
      <div><button class="cUname" data-user="${u.id}">${esc(u.username)}</button> ${c.pinned?'<span class="pinTag">📌 Pinned</span> ':""}${esc(c.text)}</div>
      <div class="cMeta">
        <time>${ago(c.createdAt)}</time>
        ${c.likes.length?`<span>${c.likes.length} like${c.likes.length===1?"":"s"}</span>`:""}
        <button class="cLink" data-like-comment="${c.id}">${liked?"Liked":"Like"}</button>
        ${!isReply?`<button class="cLink" data-reply-comment="${c.id}" data-reply-user="${esc(u.username)}">Reply</button>`:""}
        ${canDel?`<button class="cLink danger" data-del-comment="${c.id}">Delete</button>`:""}
      </div>
    </div>
  </div>`;
}

/* ---------- stories ---------- */
function openStoryViewer(userId){
  const list=state.stories.filter(x=>x.userId===userId&&storyAlive(x)).sort((a,b)=>a.createdAt-b.createdAt);
  if(!list.length){if(userId===state.activeUser)openStoryComposer();return}
  openSheet({type:"story",userId,list,index:0});
  markStorySeen(list[0].id);
}
function markStorySeen(id){
  state.seenStories.add(id);
  Store.setMeta("seen-stories:"+state.activeUser,[...state.seenStories]).catch(()=>{});
  const st=state.stories.find(x=>x.id===id);
  if(st&&st.userId!==state.activeUser&&!st.viewers[state.activeUser]){st.viewers[state.activeUser]=Date.now();Store.saveStory(st).catch(()=>{})}
}
function storyNav(dir){
  const s=state.sheet;if(!s||s.type!=="story")return;
  const ni=s.index+dir;
  if(ni<0)return;
  if(ni>=s.list.length)return closeSheet();
  s.index=ni;markStorySeen(s.list[ni].id);renderSheet(true);
}

/* ---------- sheets (comments, post viewer, reactions, follow lists, stories) ---------- */
let lastFocus=null;
function openSheet(s){
  lastFocus=document.activeElement;
  if(s.type==="comments")state.replyTo=null;
  state.sheet=s;renderSheet();
}
function closeSheet(silent){
  if(!state.sheet)return;
  const was=state.sheet.type;
  state.sheet=null;$("sheet").hidden=true;$("sheet").innerHTML="";$("sheet").dataset.type="";clearTimeout(svTimer);
  if(was==="story"&&!silent)render(true);
  if(!silent&&lastFocus&&document.contains(lastFocus))lastFocus.focus();
}
function renderSheet(force){
  const el=$("sheet"),s=state.sheet;
  if(!s){el.hidden=true;return}
  if(!force&&["story","share","storyCompose","colForm"].includes(s.type)&&el.dataset.type===s.type)return; // don't rebuild while typing / mid-story
  el.hidden=false;el.dataset.type=s.type;

  if(s.type==="post"){
    const p=state.posts.find(x=>x.id===s.id);
    if(!p){closeSheet();return}
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Photo">
      <div class="sheetHead"><h2>Photo</h2><button class="act" data-close aria-label="Close">${I.close}</button></div>
      <div class="sheetScroll">${postCard(p)}</div></div>`;
    el.querySelector("[data-close]").focus();

  }else if(s.type==="comments"){
    const p=state.posts.find(x=>x.id===s.id);
    if(!p){closeSheet();return}
    const top=p.comments.filter(c=>!c.parentId).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||a.createdAt-b.createdAt);
    const repliesOf=pid=>p.comments.filter(c=>c.parentId===pid).sort((a,b)=>a.createdAt-b.createdAt);
    const list=top.length
      ?`<div class="cList">${top.map(c=>commentRow(c,false)+repliesOf(c.id).map(r=>commentRow(r,true)).join("")).join("")}</div>`
      :`<div class="cNone">No comments yet. Say something nice 💗</div>`;
    const draft=el.querySelector("#cInput")?el.querySelector("#cInput").value:"";
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Comments">
      <div class="sheetHead"><h2>Comments</h2><button class="act" data-close aria-label="Close">${I.close}</button></div>
      <div class="sheetScroll">${list}</div>
      ${state.replyTo?`<div class="replyBanner"><span>Replying to @${esc(state.replyTo.username)}</span><button type="button" data-cancel-reply aria-label="Cancel reply">${I.close}</button></div>`:""}
      <form class="cForm" id="cForm"><input id="cInput" maxlength="${CONFIG.maxComment}" placeholder="${state.replyTo?"Write a reply…":"Add a comment…"}" aria-label="Add a comment" autocomplete="off" value="${esc(draft)}"><button class="btn primary" type="submit" aria-label="Send comment">${I.send.replace('<svg','<svg width="20" height="20"')}</button></form></div>`;
    const scroller=el.querySelector(".sheetScroll");scroller.scrollTop=scroller.scrollHeight;
    if(!draft||s.focusInput){el.querySelector("#cInput").focus();}

  }else if(s.type==="reactions"){
    const p=state.posts.find(x=>x.id===s.id);
    if(!p){closeSheet();return}
    const groups=reactionCounts(p);
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Reactions">
      <div class="sheetHead"><h2>Reactions</h2><button class="act" data-close aria-label="Close">${I.close}</button></div>
      <div class="sheetScroll">${groups.length?groups.map(g=>`
        <div class="reactGroup">
          <div class="reactGroupHead">${g.emoji} <b>${g.label}</b><span>${g.count}</span></div>
          ${g.users.map(uidKey=>{const u=userOf(uidKey);return `<button class="reactUser" data-user="${uidKey}">
            <span class="ava sm"><img src="${esc(u.avatar)}" alt=""></span><span>${esc(u.name)}</span></button>`}).join("")}
        </div>`).join(""):`<div class="cNone">No reactions yet.</div>`}</div></div>`;

  }else if(s.type==="followList"){
    const ids=s.mode==="followers"?followersOf(s.id):followingOf(s.id);
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="${s.mode==="followers"?"Followers":"Following"}">
      <div class="sheetHead"><h2>${s.mode==="followers"?"Followers":"Following"}</h2><button class="act" data-close aria-label="Close">${I.close}</button></div>
      <div class="sheetScroll">${ids.length?ids.map(uidKey=>{
        const u=userOf(uidKey),isMe=uidKey===state.activeUser;
        return `<div class="followRow">
          <button class="followUser" data-user="${uidKey}"><span class="ava sm"><img src="${esc(u.avatar)}" alt=""></span><span><b>${esc(u.name)}</b><small>@${esc(u.username)}</small></span></button>
          ${isMe?"":`<button class="btn ${isFollowing(state.activeUser,uidKey)?"ghost":"primary"} sm" data-follow="${uidKey}">${isFollowing(state.activeUser,uidKey)?"Following":"Follow"}</button>`}
        </div>`}).join(""):`<div class="cNone">${s.mode==="followers"?"No followers yet.":"Not following anyone yet."}</div>`}</div></div>`;

  }else if(s.type==="story"){
    const st=s.list[s.index],u=userOf(s.userId),own=s.userId===state.activeUser,mine=st.reactions[state.activeUser],dur=st.duration||5000;
    const body=st.kind==="text"?`<div class="svText" style="background:${CONFIG.storyBgs[st.bg||0]}"><p>${esc(st.text)}</p></div>`:`<div class="svImgWrap"><img class="svImg" src="${st.image}" alt=""></div>`;
    const left=own&&!st.evergreen?` · ${Math.max(1,Math.ceil((st.createdAt+CONFIG.storyHours*36e5-Date.now())/36e5))}h left`:"";
    el.innerHTML=`<div class="sheetBody storySheet" role="dialog" aria-modal="true" aria-label="${esc(u.name)}'s story">
      <div class="svBars">${s.list.map((_,i)=>`<span class="${i<s.index?"done":""}"><i ${i===s.index?`class="cur" style="--d:${dur}ms"`:""}></i></span>`).join("")}</div>
      <div class="svHead"><span class="ava sm"><img src="${esc(u.avatar)}" alt=""></span><b>${esc(u.name)}</b><span class="svTime">${ago(st.createdAt)}${left}</span><button class="act" data-close aria-label="Close">${I.close}</button></div>
      ${body}${st.caption?`<div class="svCap">${esc(st.caption)}</div>`:""}
      <button class="svZone left" type="button" data-story-prev aria-label="Previous story"></button>
      <button class="svZone right" type="button" data-story-next aria-label="Next story"></button>
      <div class="svFoot">${own?`<span class="svSeen">👁 ${Object.keys(st.viewers).length} seen · ${Object.keys(st.reactions).length} reactions</span><button class="svAdd" data-st-add>＋ Add</button>`:CONFIG.reactions.map(r=>`<button class="svReact ${mine===r.id?"on":""}" data-sv-react="${r.id}" aria-label="React ${r.label}">${r.emoji}</button>`).join("")}</div>
    </div>`;
    clearTimeout(svTimer);svTimer=setTimeout(()=>storyNav(1),dur);

  }else if(s.type==="storyCompose"){
    const d=state.storyDraft;
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="New story"><div class="sheetHead"><h2>New story</h2><button class="act" data-close aria-label="Close">${I.close}</button></div><div class="sheetScroll stComp">
      <div class="seg">${[["photo","📷 Photo"],["text","✍️ Text"]].map(([m,l])=>`<button class="${d.mode===m?"on":""}" data-st-mode="${m}">${l}</button>`).join("")}</div>
      ${d.mode==="photo"?`<label class="drop stDrop"><input type="file" id="stPhoto" accept="image/*" aria-label="Choose a photo">${d.image?`<img src="${d.image}" alt="Selected photo">`:`<span class="dropHint">${I.photo}<b>Choose a photo</b></span>`}</label>`
      :`<div class="stText" style="background:${CONFIG.storyBgs[d.bg]}"><textarea id="stText" maxlength="140" placeholder="Type something…" aria-label="Story text">${esc(d.text)}</textarea></div><div class="swatches">${CONFIG.storyBgs.map((b,i)=>`<button style="background:${b}" class="${d.bg===i?"on":""}" data-st-bg="${i}" aria-label="Background ${i+1}"></button>`).join("")}</div>`}
      <div class="lbl">Show for</div><div class="seg">${[5,10,15].map(n=>`<button class="${d.secs===n?"on":""}" data-st-secs="${n}">${n}s</button>`).join("")}</div>
      <div class="err" id="stErr" role="alert"></div><button class="btn primary block" data-st-share>Share to story</button></div></div>`;

  }else if(s.type==="collect"){
    const sv=savedOf(state.activeUser),it=sv.items[s.id];
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Save to collection"><div class="sheetHead"><h2>Save to…</h2><button class="act" data-close aria-label="Close">${I.close}</button></div><div class="sheetScroll">${sv.cols.map(c=>{const on=!!(it&&it.cols.includes(c.id));return `<button class="colRow" data-col-toggle="${c.id}" data-post="${s.id}" aria-pressed="${on}"><span>${c.emoji}</span><b>${esc(c.name)}</b><i>${on?"✓":""}</i></button>`}).join("")}<button class="colRow" data-colform data-post="${s.id}"><span>＋</span><b>New collection</b></button>${it?`<button class="colRow danger" data-unsave="${s.id}"><span>✕</span><b>Remove from Saved</b></button>`:""}</div></div>`;

  }else if(s.type==="colForm"){
    const c=s.colId&&savedOf(state.activeUser).cols.find(x=>x.id===s.colId);
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Collection"><div class="sheetHead"><h2>${c?"Edit collection":"New collection"}</h2><button class="act" data-close aria-label="Close">${I.close}</button></div>
      <form class="cForm colForm" id="colForm"><input id="colEmoji" class="emojiIn" maxlength="4" value="${esc(c?c.emoji:"📁")}" aria-label="Emoji"><input id="colName" maxlength="24" placeholder="Collection name" value="${esc(c?c.name:"")}" aria-label="Collection name" autocomplete="off"><button class="btn primary" type="submit">${c?"Save":"Create"}</button></form>
      ${c?`<button class="colRow danger" data-col-del="${c.id}"><span>🗑️</span><b>Delete collection</b></button>`:""}</div>`;
    $("colName").focus();

  }else if(s.type==="share"){
    const p=state.posts.find(x=>x.id===s.id);if(!p){closeSheet();return}
    const targets=[...CONFIG.humans.filter(h=>h!==state.activeUser),...Object.values(CONFIG.users).filter(u=>u.bot).map(u=>u.id)];
    el.innerHTML=`<div class="sheetBody" role="dialog" aria-modal="true" aria-label="Share"><div class="sheetHead"><h2>Share</h2><button class="act" data-close aria-label="Close">${I.close}</button></div><div class="sheetScroll">${targets.map(id=>{const u=userOf(id),on=s.sel.includes(id);return `<button class="colRow" data-share-to="${id}" aria-pressed="${on}"><span class="ava sm"><img src="${esc(u.avatar)}" alt=""></span><b>${esc(u.name)}</b><i>${on?"✓":""}</i></button>`}).join("")}
      <div class="sharePad"><input id="shareNote" class="shareNote" maxlength="120" placeholder="Add a message…" value="${esc(s.note||"")}" aria-label="Message"><button class="btn primary block" data-share-send ${s.sel.length?"":"disabled"}>Send${s.sel.length?" ("+s.sel.length+")":""}</button><button class="btn ghost block" data-share-story>Add to your story</button></div></div></div>`;
  }
}
$("sheet").addEventListener("click",e=>{
  if(e.target.id==="sheet"||e.target.closest("[data-close]"))return closeSheet();
  const t=e.target,d=state.storyDraft;
  if(t.closest("[data-st-add]"))return openStoryComposer();
  const sr=t.closest("[data-sv-react]");if(sr)return svReact(sr.dataset.svReact);
  const sm=t.closest("[data-st-mode]");if(sm){d.mode=sm.dataset.stMode;return renderSheet(true)}
  const sb=t.closest("[data-st-bg]");if(sb){d.bg=+sb.dataset.stBg;return renderSheet(true)}
  const ss=t.closest("[data-st-secs]");if(ss){d.secs=+ss.dataset.stSecs;return renderSheet(true)}
  if(t.closest("[data-st-share]"))return submitStory();
  const ct=t.closest("[data-col-toggle]");if(ct)return toggleInCol(ct.dataset.post,ct.dataset.colToggle);
  const us=t.closest("[data-unsave]");if(us){toggleSave(us.dataset.unsave);return closeSheet()}
  const cf=t.closest("[data-colform]");if(cf)return openSheet({type:"colForm",colId:cf.dataset.colform||null,postId:cf.dataset.post||null});
  const cd=t.closest("[data-col-del]");if(cd)return deleteCollection(cd.dataset.colDel);
  const sh=t.closest("[data-share-to]");if(sh){const a=state.sheet.sel,i=a.indexOf(sh.dataset.shareTo);i<0?a.push(sh.dataset.shareTo):a.splice(i,1);return renderSheet(true)}
  if(t.closest("[data-share-send]"))return sendShare();
  if(t.closest("[data-share-story]"))return shareToStory();
  if(e.target.closest("[data-story-prev]"))return storyNav(-1);
  if(e.target.closest("[data-story-next]"))return storyNav(1);
  const userBtn=e.target.closest("[data-user]");
  if(userBtn)return closeSheet(true),goProfile(userBtn.dataset.user);
  const followBtn=e.target.closest("[data-follow]");
  if(followBtn)return toggleFollow(followBtn.dataset.follow);
  const likeC=e.target.closest("[data-like-comment]");
  if(likeC&&state.sheet)return toggleCommentLike(state.sheet.id,likeC.dataset.likeComment);
  const delC=e.target.closest("[data-del-comment]");
  if(delC&&state.sheet)return deleteComment(state.sheet.id,delC.dataset.delComment);
  const replyC=e.target.closest("[data-reply-comment]");
  if(replyC){state.replyTo={id:replyC.dataset.replyComment,username:replyC.dataset.replyUser};renderSheet();$("cInput")?.focus();return}
  if(e.target.closest("[data-cancel-reply]")){state.replyTo=null;renderSheet();$("cInput")?.focus();return}
  const reactBtn=e.target.closest("[data-reactions]");
  if(reactBtn&&state.sheet)return openSheet({type:"reactions",id:reactBtn.dataset.reactions});
  handlePostClick(e);
});
$("sheet").addEventListener("submit",async e=>{
  e.preventDefault();
  if(e.target.id==="colForm")return submitColForm();
  const s=state.sheet;if(!s||s.type!=="comments")return;
  const inp=$("cInput"),text=inp.value.trim();if(!text)return;
  inp.value="";
  await submitComment(s.id,text,state.replyTo?state.replyTo.id:null);
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){closeReactPicker();closeSheet()}
  if(state.sheet&&state.sheet.type==="story"){
    if(e.key==="ArrowRight")storyNav(1);
    if(e.key==="ArrowLeft")storyNav(-1);
  }
});

/* ---------- click handling ---------- */
function handlePostClick(e){
  const dc=e.target.closest("[data-declassify]");if(dc)return declassify(dc.dataset.declassify);
  const art=e.target.closest("[data-id]");
  if(e.target.closest("[data-like]")&&art){
    if(longPressed){longPressed=false;return}
    return toggleReaction(art.dataset.id,"love");
  }
  if(e.target.closest("[data-share]")&&art)return openSheet({type:"share",id:art.dataset.id,sel:[],note:""});
  if(e.target.closest("[data-save]")&&art)return toggleSave(art.dataset.id);
  if(e.target.closest("[data-collect]")&&art)return openSheet({type:"collect",id:art.dataset.id});
  if(e.target.closest("[data-comment]")&&art)return openSheet({type:"comments",id:art.dataset.id,focusInput:true});
  if(e.target.closest("[data-reactions]")){const btn=e.target.closest("[data-reactions]");return openSheet({type:"reactions",id:btn.dataset.reactions})}
}
$("view").addEventListener("click",e=>{
  if(e.target.closest("[data-event-now]"))return runEvent();
  const nb=e.target.closest("[data-notif]");
  if(nb){const n=state.notifs.find(x=>x.id===nb.dataset.notif);if(!n)return;
    if(n.kind==="follow")return goProfile(n.from);
    if(n.kind==="storyReact")return openStoryViewer(state.activeUser);
    if(n.postId)return openSheet({type:["comment","reply","commentLike"].includes(n.kind)?"comments":"post",id:n.postId});
    return}
  const nf=e.target.closest("[data-nfilter]");if(nf){state.notifFilter=nf.dataset.nfilter;return render(true)}
  if(e.target.closest("[data-st-add]"))return openStoryComposer();
  const cfv=e.target.closest("[data-colform]");if(cfv)return openSheet({type:"colForm",colId:cfv.dataset.colform||null,postId:null});
  const storyBtn=e.target.closest("[data-story-user]");
  if(storyBtn)return openStoryViewer(storyBtn.dataset.storyUser);
  const openBtn=e.target.closest("[data-open]");
  if(openBtn)return openSheet({type:"post",id:openBtn.dataset.open});
  const statBtn=e.target.closest("[data-stat]");
  if(statBtn)return openSheet({type:"followList",id:statBtn.dataset.statUser,mode:statBtn.dataset.stat});
  const followBtn=e.target.closest("[data-follow]");
  if(followBtn)return toggleFollow(followBtn.dataset.follow);
  const switchBtn=e.target.closest("[data-switch]");
  if(switchBtn)return switchUser(switchBtn.dataset.switch);
  const userBtn=e.target.closest("[data-user]");
  if(userBtn)return goProfile(userBtn.dataset.user);
  handlePostClick(e);
});
$("view").addEventListener("dblclick",e=>{
  const ph=e.target.closest("[data-dbl]"),art=e.target.closest("[data-id]");
  if(!ph||!art)return;
  ph.classList.remove("pop");void ph.offsetWidth;ph.classList.add("pop");
  forceLove(art.dataset.id);
});

/* ---------- migration (phase 1/2 -> phase 3 data shape) ---------- */
function migratePost(p){
  if(!p.reactions){
    p.reactions={};
    (p.likes||[]).forEach(uidKey=>{p.reactions[uidKey]="love"});
  }
  delete p.likes;
  p.comments=(p.comments||[]).map(c=>({likes:[],parentId:null,...c}));
  if(p.communityScheduled===undefined)p.communityScheduled=false;
  return p;
}

/* ---------- boot ---------- */
(async function boot(){
  await Store.init();
  try{
    state.posts=(await Store.allPosts()).map(migratePost);newestFirst();
    await seedCommunityIfNeeded();
    await seedPresidentIfNeeded();
    // give the community a chance to catch up on any older posts that never got reactions
    state.posts.filter(p=>!p.communityScheduled&&CONFIG.humans.includes(p.userId)).forEach(scheduleCommunityReactions);
    state.stories=await Store.allStories();
    await seedStoriesIfNeeded();
    await seedBotStoriesIfNeeded();
    state.stories=state.stories.map(migrateStory);
    const savedGraph=await Store.getMeta("follow-graph",null);
    if(savedGraph){
      followGraph=followGraphDefault();
      for(const k in savedGraph)followGraph[k]=new Set(savedGraph[k]);
    }
    state.activeUser=await Store.getMeta("active-user",CONFIG.me);
    if(!CONFIG.users[state.activeUser])state.activeUser=CONFIG.me;
    const savedSeen=await Store.getMeta("seen-stories:"+state.activeUser,[]);
    state.seenStories=new Set(savedSeen);
    state.notifs=await Store.getMeta("notifs",[]);
    state.rewards=await Store.getMeta("rewards",{});
    state.trendDone=await Store.getMeta("trend-done",[]);
    for(const u of CONFIG.humans){const v=await Store.getMeta("saved:"+u,null);if(v)state.saved[u]=v}
    state.news=await Store.getMeta("news",[]);
    state.lastEvent=await Store.getMeta("event-last",Date.now());
    await seedNewsIfNeeded();
    await seedNotifsIfNeeded();
  }catch{}
  route();startEvents();startHQ();
  if(!Store.persistent)toast("Heads up: this browser can't save posts");
})();
})();
