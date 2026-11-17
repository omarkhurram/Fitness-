(function(){
'use strict';
var $=function(id){return document.getElementById(id)}, esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var originalDraw=draw;
state.settings=state.settings||{calorieTarget:2300,proteinTarget:130};
/* Use the Smith variation for the higher-rep hypertrophy chest day. */
days.C.items[0][0]='Smith-machine bench press';
days.T.items.push(['Farmer carry',2,30,45,'seconds']);
var warm={
 A:['3–5 min easy walk, bike or row','Arm circles: 10 each direction','Scapular push-ups: 8–10','Light band pull-aparts: 10–15'],
 B:['3–5 min easy walk, bike or row','Arm circles: 10 each direction','Scapular push-ups: 8–10','Light band pull-aparts: 10–15'],
 L:['3–4 min easy bike or treadmill','Ankle rocks: 10 each side','Leg swings: 10 forward/back + 10 lateral per leg','Bodyweight squats: 8','Reverse lunges: 6 each leg','Easy low pogos: 2 × 10','Progressive practice jumps: 60%, 75%, 85%'],
 C:['3–5 min easy walk, bike or row','Arm circles: 10 each direction','Scapular push-ups: 8–10','Light band pull-aparts: 10–15'],
 T:['2–3 min easy movement','Shoulder circles: 10 each way','Wrist circles and gentle forearm opening/closing: 10 each']
};
var specific={
 'Bench press':['Empty bar × 10','~50% work weight × 5','~70% × 3','~85% × 1–2'],
 'Bench press (volume)':['Empty bar × 10','~50% work weight × 5','~70% × 3'],
 'Smith-machine bench press':['Light Smith bar × 10; ~50% work load × 5; ~70% × 3'],
 'Farmer carry':['One short, easy practice carry'],
 'Chest-supported row':['Very light × 10; moderate × 5'],
 'Incline dumbbell press':['Light DBs × 10; moderate × 4–5'],
 'Cable lateral raise':['Light × 12 each side'],
 'EZ-bar preacher curl':['Light × 10; moderate × 4'],
 'Pull-up / assisted pull-up':['Scapular pulls × 5; easy assisted reps × 3–5'],
 'Seated cable row':['Light × 12; moderate × 5'],
 'Machine shoulder press':['Light × 10; moderate × 4'],
 'Reverse pec deck':['Light × 12'],
 'Rope triceps pushdown':['Light × 12'],
 'Smith-machine squat':['Empty/light bar × 10; ~50% × 5; ~70% × 3'],
 'Dumbbell Romanian deadlift':['Light DBs × 8; moderate × 4'],
 'Bulgarian split squat':['Bodyweight × 5 each leg'],
 'Standing calf raise':['Light × 10'],
 'Hanging knee raise':['Easy knee raises × 5 if needed'],
 'Kneeling cable crunch':['Light × 10'],
 'Lat pulldown':['Light × 12; moderate × 5'],
 'Pec deck fly':['Very light × 12; moderate × 5'],
 'Overhead cable triceps extension':['Light × 12'],
 'Dumbbell shrugs':['Light × 10'],
 'Hammer curls':['Light × 10'],
 'Cable crunch (optional)':['Light × 10']
};
state.warmChecks=state.warmChecks||{};state.recovery=state.recovery||[];state.nutrition=state.nutrition||[];state.activities=state.activities||[];state.waist=state.waist||[];
function checked(k){return state.warmChecks[k]?'checked':''}
function enhanceWorkout(){
 var key=today()+day, html='<div class="card warm-card"><h3>Daily general warm-up</h3><p class="small">Complete before working sets. These prep steps are checklists only—not logged sets or training volume.</p>';
 (warm[day]||[]).forEach(function(x,i){var k=key+'-g'+i;html+='<label class="warmcheck"><input type="checkbox" data-warmkey="'+k+'" '+checked(k)+'> '+esc(x)+'</label>'});
 html+='</div>'; $('exercises').insertAdjacentHTML('afterbegin',html);
 document.querySelectorAll('[data-warmkey]').forEach(function(el){el.onchange=function(){state.warmChecks[el.dataset.warmkey]=el.checked;save()}});
 document.querySelectorAll('#exercises .exercise').forEach(function(card,i){
  var title=card.querySelector('b');if(!title)return;var name=title.textContent,items=specific[name]||['One light acclimation set × 8–12; add another ramp-up set if the load jump is large'];
  var block='<div class="warm-specific"><b>Exercise-specific ramp-up · not working sets</b>';
  items.forEach(function(x,j){var k=key+'-e'+i+'-'+j;block+='<label class="warmcheck"><input type="checkbox" data-warmkey="'+k+'" '+checked(k)+'> '+esc(x)+'</label>'});
  block+='<p class="small">Ramp-up sets should feel easy and prepare you for the work weight. They are excluded from set volume and progression.</p></div>';
  card.insertAdjacentHTML('beforeend',block);
 });
 document.querySelectorAll('[data-warmkey]').forEach(function(el){el.onchange=function(){state.warmChecks[el.dataset.warmkey]=el.checked;save()}});
 document.querySelectorAll('#exercises .setrow').forEach(function(el){el.style.display='none'});
 document.querySelectorAll('#exercises .log').forEach(function(el){el.style.display='none'});
 document.querySelectorAll('#exercises .exercise').forEach(function(card,i){
  var name=card.querySelector('b').textContent,ex=days[day].items[i],n=ex[1],last=state.logs.filter(function(l){return l.name===name}).slice(-1)[0];
  var rows='<div class="worksets"><b>Working sets · logged individually</b>';
  for(var s=1;s<=n;s++){var prev=state.logs.filter(function(l){return l.name===name}).slice(-n)[s-1];rows+='<div class="setrow-v2"><span>Set '+s+'</span><label>Load<input type="number" step=".5" data-v2load="'+s+'" placeholder="'+(prev?esc(prev.load):'Load')+'"></label><label>Reps<input type="number" min="1" data-v2reps="'+s+'" placeholder="Reps"></label><label>RIR<input type="number" min="0" max="10" data-v2rir="'+s+'" placeholder="RIR"></label><button class="v2save" data-v2set="'+s+'">Save set</button></div>'}
  rows+='</div>';card.insertAdjacentHTML('beforeend',rows);
  card.querySelectorAll('.v2save').forEach(function(btn){btn.onclick=function(){
   var s=+btn.dataset.v2set,load=card.querySelector('[data-v2load="'+s+'"]').value,reps=+card.querySelector('[data-v2reps="'+s+'"]').value,rir=card.querySelector('[data-v2rir="'+s+'"]').value;
   if(load===''||!reps||rir===''||+rir<0||+rir>10){alert('Enter load, reps and RIR for this working set.');return}
   var old=state.logs.findIndex(function(l){return l.date===today()&&l.day===day&&l.name===name&&l.set===s&&!l.warmup});
   var item={date:today(),day:day,name:name,set:s,load:+load,reps:reps,rir:+rir,unit:ex[4],warmup:false};
   if(old>=0)state.logs[old]=item;else state.logs.push(item);save();btn.textContent='Saved';drawProgress();updateVolume();
  }});
  var rest=(name.indexOf('jump')>=0||name.indexOf('Jump')>=0)?120:((name.indexOf('press')>=0||name.indexOf('squat')>=0||name.indexOf('row')>=0||name.indexOf('Pull')>=0)?150:75);
  card.insertAdjacentHTML('beforeend','<button class="rest-v2" data-rest="'+rest+'">Start '+rest+'s rest timer</button>');
 });
 document.querySelectorAll('.rest-v2').forEach(function(b){b.onclick=function(){startRest(+b.dataset.rest)}});
}
draw=function(){originalDraw();enhanceWorkout()};
function startRest(s){clearInterval(window.trainingRest);var left=s;var out=$('restClock');if(!out){out=document.createElement('div');out.id='restClock';out.className='rest-clock';document.body.appendChild(out)}function tick(){out.textContent='REST · '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(left<=0){clearInterval(window.trainingRest);out.textContent='REST COMPLETE';if(navigator.vibrate)navigator.vibrate([150,80,150]);return}left--}tick();window.trainingRest=setInterval(tick,1000)}
function addTabs(){
 var nav=document.querySelector('nav'),main=document.querySelector('main');
 var tabs=[['recovery','Recovery'],['nutrition','Nutrition'],['activity','Hybrid activity']];
 tabs.forEach(function(t){var b=document.createElement('button');b.className='tab';b.dataset.view=t[0];b.textContent=t[1];nav.appendChild(b);b.onclick=function(){document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('active',x===b)});document.querySelectorAll('.view').forEach(function(x){x.classList.toggle('active',x.id===t[0])})}});
 var recovery=document.createElement('section');recovery.id='recovery';recovery.className='view';recovery.innerHTML='<div class="card"><h2>Recovery check-in</h2><div class="fields"><label>Sleep (hours)<input id="rSleep" type="number" step=".25"></label><label>Energy (1–5)<input id="rEnergy" type="number" min="1" max="5"></label><label>Soreness (1–5)<input id="rSore" type="number" min="1" max="5"></label><label>Motivation (1–5)<input id="rMotivation" type="number" min="1" max="5"></label></div><label>Notes<input id="rNotes"></label><button id="saveRecovery" class="primary">Save recovery</button><div id="recoveryHistory"></div></div><div class="card"><h3>Deload guidance</h3><p class="small">If performance declines across sessions alongside poor sleep, low energy or persistent soreness, reduce working sets by roughly half for a week and keep 3–4 RIR. Skip Saturday tune-ups when recovery is poor.</p></div>';
 var nutrition=document.createElement('section');nutrition.id='nutrition';nutrition.className='view';nutrition.innerHTML='<div class="card"><h2>Nutrition & cut</h2><p class="small">Track daily calories and protein against editable targets. Use weekly average bodyweight and waist trend—not single weigh-ins—to judge the cut.</p><div class="fields"><label>Calorie target<input id="calTarget" type="number" value="2300"></label><label>Protein target (g)<input id="proTarget" type="number" value="130"></label></div><label>Meal<input id="mealName" placeholder="Meal"></label><div class="fields"><label>Calories<input id="mealCal" type="number"></label><label>Protein (g)<input id="mealPro" type="number"></label></div><button id="addMeal" class="primary">Add meal</button><p id="nutritionSummary" class="small"></p><div id="mealHistory"></div></div>';
 var activity=document.createElement('section');activity.id='activity';activity.className='view';activity.innerHTML='<div class="card"><h2>Hybrid activity log</h2><p class="small">Log actual duration for gym walks, volleyball, basketball and zone 2. Your walk to the gym counts as useful low-intensity activity; no distance or calorie burn is assumed.</p><label>Activity<select id="activityType"><option>Walk to/from gym</option><option>Volleyball</option><option>Basketball</option><option>Zone 2 cardio</option><option>Other</option></select></label><div class="fields"><label>Minutes<input id="activityMinutes" type="number" min="1"></label><label>Intensity<select id="activityIntensity"><option>Easy</option><option>Moderate</option><option>Hard</option></select></label></div><label>Notes<input id="activityNotes"></label><button id="addActivity" class="primary">Log activity</button><div id="activityHistory"></div><p class="small">Keep most added cardio conversational. Volleyball and basketball already contribute substantial intermittent running and jumping. Add conditioning gradually so it does not compromise jump quality or lower-body recovery.</p></div>';
 main.appendChild(recovery);main.appendChild(nutrition);main.appendChild(activity);
 document.querySelectorAll('.tab').forEach(function(b){b.onclick=function(){document.querySelectorAll('.tab').forEach(function(x){x.classList.toggle('active',x===b)});document.querySelectorAll('.view').forEach(function(x){x.classList.toggle('active',x.id===b.dataset.view)})}});
}
function drawExtra(){
 $('recoveryHistory').innerHTML=state.recovery.slice(-7).reverse().map(function(x){return '<p class="small">'+esc(x.date)+' · sleep '+esc(x.sleep)+'h · energy '+esc(x.energy)+'/5 · soreness '+esc(x.sore)+'/5 · motivation '+esc(x.motivation)+'/5</p>'}).join('');
 var meals=state.nutrition.filter(function(x){return x.date===today()}),cal=meals.reduce(function(a,x){return a+x.cal},0),pro=meals.reduce(function(a,x){return a+x.pro},0);
 $('nutritionSummary').textContent='Today: '+cal+' / '+$('calTarget').value+' kcal · '+pro+' / '+$('proTarget').value+' g protein';
 $('mealHistory').innerHTML=meals.map(function(x){return '<p class="small">'+esc(x.name)+' · '+x.cal+' kcal · '+x.pro+'g protein</p>'}).join('');
 $('activityHistory').innerHTML=state.activities.slice(-12).reverse().map(function(x){return '<p class="small">'+esc(x.date)+' · '+esc(x.type)+' · '+esc(x.minutes)+' min · '+esc(x.intensity)+'</p>'}).join('');
}
function addBodyCompAndPRs(){
 var fields=document.querySelector('#progress .fields');
 if(fields&&!$('waist')){
  var lab=document.createElement('label');lab.textContent='Waist (in)';var inp=document.createElement('input');inp.id='waist';inp.type='number';inp.step='.1';lab.appendChild(inp);fields.appendChild(lab);
 }
 var guide=document.querySelector('#guide .card');
 if($('saveMeasure'))$('saveMeasure').onclick=function(){state.measures.push({date:$('md').value||today(),weight:$('weight').value,waist:$('waist')?$('waist').value:'',jump:$('jump').value,sleep:$('sleep').value,notes:$('notes').value});save();drawMeasures()};
 if(guide&&!$('hybridNotes')){var note=document.createElement('div');note.id='hybridNotes';note.innerHTML='<h3>Hybrid physique notes</h3><p class="small">The hypertrophy chest day uses the Smith machine for stable, controlled volume. Farmer carries are included in the optional tune-up alongside shrugs and hammer curls. Walking to the gym is useful low-intensity activity; log the actual duration under Hybrid activity.</p><p class="small">Forearm vascularity is influenced heavily by genetics and overall leanness. Farmer carries, hammer curls and occasional wrist flexion/extension can develop forearm musculature, but cannot guarantee visible veins. Avoid dehydration or extreme dieting. Neck work is optional and should be very light, controlled and pain-free; skip it if unsure.</p><p class="small">For visible abs, keep direct core work consistent and track waist/bodyweight trends. Two focused sessions per week is a reasonable starting point; daily ab training is not required.</p>';guide.appendChild(note)}
}
function drawPersonalRecords(){
 var box=$('progressList');if(!box)return;
 var prior=$('personalRecords');if(prior)prior.remove();
 var grouped={};state.logs.filter(function(x){return !x.warmup&&x.unit==='lb'&&x.reps>0&&x.reps<=12}).forEach(function(x){var est=x.load*(1+x.reps/30);if(!grouped[x.name]||est>grouped[x.name].est)grouped[x.name]={est:est,entry:x}});
 var names=Object.keys(grouped);if(!names.length)return;
 var html='<div id="personalRecords" class="card"><h3>Best logged strength estimates</h3><p class="small">Estimated from logged working sets (Epley formula); use as trend markers, not tested maxes.</p>';
 names.forEach(function(n){var x=grouped[n];html+='<p class="small">'+esc(n)+': <b>'+x.est.toFixed(1)+' lb estimated 1RM</b> · '+x.entry.load+' × '+x.entry.reps+'</p>'});
 html+='</div>';box.appendChild(document.createRange().createContextualFragment(html));
}
function updateVolume(){
 var box=$('progressList');if(!box)return;var previous=$('weeklyVolume');if(previous)previous.remove();var groups={Chest:['bench','incline','pec deck'],Back:['row','pull','pulldown'],Shoulders:['lateral','shoulder','reverse'],Arms:['curl','triceps','hammer'],Legs:['squat','deadlift','split','calf'],Abs:['raise','crunch']},html='<div class="card"><h3>Weekly working-set volume (logged only)</h3>';
 Object.keys(groups).forEach(function(g){var n=state.logs.filter(function(x){return !x.warmup&&x.date>=week()&&groups[g].some(function(t){return x.name.toLowerCase().indexOf(t)>=0})}).length;html+='<p class="small">'+g+': <b>'+n+' logged sets</b></p>'});html+='</div>';box.insertAdjacentHTML('beforeend',html);
}
function bindExtra(){
 $('saveRecovery').onclick=function(){state.recovery.push({date:today(),sleep:+$('rSleep').value,energy:+$('rEnergy').value,sore:+$('rSore').value,motivation:+$('rMotivation').value,notes:$('rNotes').value});save();drawExtra()};
 $('addMeal').onclick=function(){if(!$('mealName').value||$('mealCal').value===''||$('mealPro').value===''){alert('Enter meal, calories and protein.');return}state.nutrition.push({date:today(),name:$('mealName').value,cal:+$('mealCal').value,pro:+$('mealPro').value});save();$('mealName').value='';$('mealCal').value='';$('mealPro').value='';drawExtra()};
 $('addActivity').onclick=function(){if(+$('activityMinutes').value<=0){alert('Enter activity duration in minutes.');return}state.activities.push({date:today(),type:$('activityType').value,minutes:+$('activityMinutes').value,intensity:$('activityIntensity').value,notes:$('activityNotes').value});save();$('activityMinutes').value='';$('activityNotes').value='';drawExtra()};
  $('calTarget').onchange=function(){state.settings.calorieTarget=+$('calTarget').value;save();drawExtra()}; $('proTarget').onchange=function(){state.settings.proteinTarget=+$('proTarget').value;save();drawExtra()};
}
addTabs();addBodyCompAndPRs();$('calTarget').value=state.settings.calorieTarget;$('proTarget').value=state.settings.proteinTarget;bindExtra();drawExtra();updateVolume();
var oldDrawProgress=drawProgress;drawProgress=function(){oldDrawProgress();updateVolume();drawPersonalRecords()};drawPersonalRecords();
})();