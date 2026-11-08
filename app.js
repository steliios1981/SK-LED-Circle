'use strict';
let mode='circle';
const el=id=>document.getElementById(id);
const fmt=x=>x.toLocaleString('el-GR',{minimumFractionDigits:2,maximumFractionDigits:2});
const num=id=>Number(el(id).value.trim().replace(',','.'));
function switchMode(next){mode=next;el('circleTab').classList.toggle('active',mode==='circle');el('stripTab').classList.toggle('active',mode==='strip');el('circleField').classList.toggle('hide',mode!=='circle');el('stripField').classList.toggle('hide',mode!=='strip');el('results').classList.add('hide');}
el('circleTab').onclick=()=>switchMode('circle');el('stripTab').onclick=()=>switchMode('strip');
el('calc').onclick=()=>{
const out=el('results');out.classList.remove('hide');
const source=mode==='circle'?'diameter':'length';
const input=num(source),wpm=num('wpm'),cableLen=num('cableLen'),v=num('voltage'),margin=num('margin')/100,area=num('cable');
if(!Number.isFinite(input)||input<=0||!el(source).value.trim()||!Number.isFinite(wpm)||wpm<=0||!el('wpm').value.trim()||!Number.isFinite(cableLen)||cableLen<0||!el('cableLen').value.trim()){out.innerHTML='<p class="error">Συμπλήρωσε σωστά τα θετικά εκατοστά και W/m και μη αρνητικό μήκος καλωδίου.</p>';return;}
const cm=mode==='circle'?Math.PI*input:input;
const meters=cm/100,watts=meters*wpm,amps=watts/v,required=watts*(1+margin);
const sizes=[10,15,20,30,40,50,60,75,80,100,120,150,200,250,300,350,400,500,600,800,1000];
const commercial=sizes.find(n=>n>=required);
const drop=amps*0.0175*(2*cableLen)/area,dropPct=drop/v*100;
const dropLabel=cableLen===0?'Δεν δόθηκε διαδρομή':dropPct<=3?'Χαμηλή εκτιμώμενη πτώση':dropPct<=5?'Χρειάζεται έλεγχος εφαρμογής':'Μεγάλη πτώση — εξέτασε μεγαλύτερη διατομή / μικρότερη διαδρομή';
out.innerHTML=`<h2>Αποτελέσματα</h2><p>${mode==='circle'?'Περίμετρος κύκλου':'Μήκος LED'}: <strong>${fmt(cm)} cm (${fmt(meters)} m)</strong></p><p>Συνολική ισχύς</p><div class="big">${fmt(watts)} W</div><p>Ρεύμα στα ${v}V: <strong>${fmt(amps)} A</strong></p><p>Ισχύς τροφοδοτικού με ${fmt(margin*100)}% περιθώριο: <strong>${fmt(required)} W</strong></p><p>Ενδεικτικό εμπορικό τροφοδοτικό: <strong>${commercial?commercial+' W':'πάνω από 1000 W — απαιτείται ειδικός σχεδιασμός'}</strong>, σταθερής τάσης ${v}V</p><p>Εκτιμώμενη πτώση καλωδίου: <strong>${fmt(drop)} V (${fmt(dropPct)}%)</strong></p><p class="${dropPct>5?'warn':''}">${dropLabel}</p><p class="muted">Η διατομή δεν πιστοποιείται αυτόματα ως ασφαλής από αυτόν τον υπολογισμό. Έλεγξε επιτρεπόμενο ρεύμα, μήκος, προστασία και τυχόν ανάγκη τροφοδοσίας σε περισσότερα σημεία.</p>`;
};
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
