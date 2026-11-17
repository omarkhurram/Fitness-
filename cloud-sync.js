(function(){
'use strict';
const DATA_KEY='trainingHQStandalone_v1',CONFIG_KEY='trainingHQCloudConfig_v1';
let supa=null,user=null,ready=false,busy=false,queued=false,restoring=false;
const el=id=>document.getElementById(id);
function say(message){const n=el('cloudStatus');if(n)n.textContent=message}
function readConfig(){try{return JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}catch(e){return {}}}
function uniqueMerge(remote,local){const out=[],seen=new Set();(Array.isArray(remote)?remote:[]).concat(Array.isArray(local)?local:[]).forEach(item=>{const key=JSON.stringify(item);if(!seen.has(key)){seen.add(key);out.push(item)}});return out}
function merge(local,remote){
 const out=Object.assign({},remote||{},local||{});
 ['logs','measures','recovery','nutrition','activities','waist'].forEach(k=>{if(Array.isArray((remote||{})[k])||Array.isArray((local||{})[k]))out[k]=uniqueMerge((remote||{})[k],(local||{})[k])});
 out.done=Object.assign({},(remote||{}).done||{},(local||{}).done||{});
 out.warmChecks=Object.assign({},(remote||{}).warmChecks||{},(local||{}).warmChecks||{});
 out.settings=Object.assign({},(remote||{}).settings||{},(local||{}).settings||{});
 return out;
}
function getLocal(){try{return JSON.parse(localStorage.getItem(DATA_KEY)||'{}')}catch(e){return {}}}
async function upload(){
 if(!supa||!user||!ready)return;
 if(busy){queued=true;return}
 busy=true;queued=false;
 try{
  const {data:remote,error:readError}=await supa.from('training_hq_data').select('payload').eq('user_id',user.id).maybeSingle();
  if(readError)throw readError;
  const merged=remote?merge(getLocal(),remote.payload||{}):getLocal();
  localStorage.setItem(DATA_KEY,JSON.stringify(merged));
  const {error}=await supa.from('training_hq_data').upsert({user_id:user.id,payload:merged,updated_at:new Date().toISOString()},{onConflict:'user_id'});
  if(error)throw error;
  say('Cloud synced · '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}));
 }catch(e){say('Sync issue: '+e.message+' · Your device copy is still saved.')}
 finally{busy=false;if(queued){queued=false;setTimeout(upload,250)}}
}
async function restoreAndMerge(){
 if(restoring)return;restoring=true;ready=false;say('Checking your cloud history…');
 try{
  const {data,error}=await supa.from('training_hq_data').select('payload,updated_at').eq('user_id',user.id).maybeSingle();
  if(error)throw error;
  const local=getLocal();
  const combined=data?merge(local,data.payload||{}):local;
  localStorage.setItem(DATA_KEY,JSON.stringify(combined));
  state=combined;
  if(typeof draw==='function')draw();
  ready=true;
  await upload();
 }catch(e){say('Could not sync: '+e.message+' · Local records were not changed.');ready=false}
 finally{restoring=false}
}
function ui(){
 const host=el('cloudSyncMount');if(!host)return;
 host.innerHTML='<div class="card" id="cloudCard"><h2>Automatic cloud sync</h2><p class="small">Connect a private Supabase project and sign in by email link. Your current logs stay on this device and are merged with the cloud copy on first sign-in.</p><div id="cloudSetup"><label>Supabase project URL<input id="cloudUrl" type="url" placeholder="https://your-project.supabase.co" autocomplete="url"></label><label>Public anon / publishable key<input id="cloudAnon" type="password" placeholder="Public anon key" autocomplete="off"></label><div class="actions"><button id="cloudConnect" class="primary">Connect cloud</button></div><p class="small">Find these in Supabase → Project Settings → API. Use only the public anon/publishable key—never a service-role or secret key.</p></div><div id="cloudAccount" hidden><label>Email address<input id="cloudEmail" type="email" placeholder="you@example.com" autocomplete="email"></label><div class="actions"><button id="cloudSignIn" class="primary">Send sign-in link</button><button id="cloudSignOut">Sign out</button></div></div><p id="cloudStatus" class="small" aria-live="polite">Not connected.</p><p class="small">Local-first and offline-capable. Changes sync automatically when online. Keep occasional JSON exports as an extra safety net.</p></div>';
 const c=readConfig();el('cloudUrl').value=c.url||'';el('cloudAnon').value=c.anon||'';
 el('cloudConnect').onclick=()=>{
  const url=el('cloudUrl').value.trim().replace(/\/$/,'');const anon=el('cloudAnon').value.trim();
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||anon.length<20){say('Enter a valid Supabase project URL and public anon key.');return}
  localStorage.setItem(CONFIG_KEY,JSON.stringify({url,anon}));loadClient();
 };
 el('cloudSignIn').onclick=async()=>{
  const email=el('cloudEmail').value.trim();if(!email){say('Enter your email address first.');return}
  say('Sending sign-in link…');
  const {error}=await supa.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
  say(error?'Could not send link: '+error.message:'Check your inbox. Open the sign-in link on this device to finish connecting.');
 };
 el('cloudSignOut').onclick=async()=>{if(supa)await supa.auth.signOut();user=null;ready=false;el('cloudAccount').hidden=false;say('Signed out. Local data remains saved here.')};
}
function loadClient(){
 const c=readConfig();if(!c.url||!c.anon)return;
 if(window.supabase){initialize(c);return}
 say('Loading secure cloud client…');
 const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';script.onload=()=>initialize(c);script.onerror=()=>say('Could not load the cloud library. Check your internet connection.');document.head.appendChild(script);
}
function initialize(c){
 try{
  supa=window.supabase.createClient(c.url,c.anon,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  el('cloudSetup').hidden=true;el('cloudAccount').hidden=false;
  supa.auth.onAuthStateChange((event,session)=>{
   user=session&&session.user||null;
   if(user){el('cloudAccount').hidden=true;say('Signed in as '+user.email);Promise.resolve().then(restoreAndMerge)}
   else if(event==='SIGNED_OUT'){ready=false;el('cloudAccount').hidden=false;say('Signed out. Local data remains saved here.')}
  });
  supa.auth.getSession().then(({data,error})=>{if(error)throw error;if(data.session){user=data.session.user;el('cloudAccount').hidden=true;restoreAndMerge()}else say('Cloud connected. Enter your email to sign in.')}).catch(e=>say('Cloud error: '+e.message));
 }catch(e){say('Could not initialize cloud: '+e.message)}
}
window.addEventListener('traininghq:local-save',()=>{
 if(!user||!ready)return;queued=true;clearTimeout(window.trainingHQSyncTimer);window.trainingHQSyncTimer=setTimeout(upload,800);
});
window.addEventListener('online',()=>{if(user&&ready)upload()});
ui();const c=readConfig();if(c.url&&c.anon)loadClient();
})();