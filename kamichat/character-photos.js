/** 三生花 KAMICHAT · Existing original character portraits, never regenerated. */
(function(){
'use strict';
const ORIGINAL='https://mijonjaelog.github.io/samsaenghwa/parts/';
const NAMES=['류서겸','위무진','문지후','서문령','한소담','신윤서'];
const cards=new Map();
for(const card of document.querySelectorAll('#characters .person, #cast .card')){
  const title=card.querySelector('h3');
  if(title && NAMES.includes(title.textContent.trim())) cards.set(title.textContent.trim(),card);
}
if(!cards.size) return;
const sheet=document.createElement('style');
sheet.id='samsaenghwa-original-portrait-styles';
sheet.textContent=`
.person-photo-ready{display:grid!important;grid-template-columns:minmax(118px,39%) minmax(0,1fr)!important;gap:0!important;padding:0!important;overflow:hidden;min-height:268px;align-items:stretch}
.person-photo-ready .portrait-image{display:block;min-height:268px;width:100%;background-color:#e6d5da;background-size:cover;background-position:center 12%;position:relative}
.person-photo-ready .portrait-image::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(41,27,37,.23),transparent 58%);pointer-events:none}
.person-photo-ready .portrait-text{padding:20px 19px;min-width:0;display:flex;flex-direction:column;justify-content:center}
.person-photo-ready .person-index{display:none}
.person-photo-ready .portrait-text h3{font-size:18px;margin:0 0 5px}
.person-photo-ready .portrait-text blockquote{margin-top:13px}
@media(max-width:850px){.person-photo-ready{grid-template-columns:minmax(110px,39%) minmax(0,1fr)!important}.person-photo-ready .portrait-text{padding:15px 14px}}
@media(max-width:490px){.person-photo-ready{grid-template-columns:minmax(110px,42%) minmax(0,1fr)!important}.person-photo-ready .portrait-image{min-height:245px}.person-photo-ready .portrait-text{padding:15px 13px}.person-photo-ready .portrait-text h3{font-size:16px}.person-photo-ready .portrait-text blockquote{font-size:11px;line-height:1.55}}
`;
document.head.appendChild(sheet);
const partFiles=Array.from({length:28},(_,i)=>ORIGINAL+'part-'+String(i+1).padStart(2,'0')+'.htmlpart');
Promise.all(partFiles.map(async path=>{
  const resp=await fetch(path,{cache:'force-cache'});
  if(!resp.ok)throw Error('Original photo data unavailable: '+resp.status);
  return resp.text();
})).then(parts=>{
  const original=new DOMParser().parseFromString(parts.join(''),'text/html');
  let attached=0;
  for(const sourceCard of original.querySelectorAll('article.character-card')){
    const heading=sourceCard.querySelector('.character-copy h3');
    const asset=sourceCard.querySelector('.character-asset');
    if(!heading || !asset)continue;
    const rawName=Array.from(heading.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE)
      .map(n=>n.textContent.trim()).find(Boolean)||heading.textContent.trim();
    const name=NAMES.find(n=>rawName===n||rawName.startsWith(n+' '));
    if(!name||!cards.has(name))continue;
    const image=asset.style.backgroundImage;
    if(!image||!image.includes('data:image/'))continue;
    const target=cards.get(name);
    const pic=document.createElement('div');
    pic.className='portrait-image';
    pic.setAttribute('role','img');
    pic.setAttribute('aria-label',name+' 원본 캐릭터 이미지');
    pic.style.backgroundImage=image;
    const copy=document.createElement('div');
    copy.className='portrait-text';
    while(target.firstChild)copy.appendChild(target.firstChild);
    target.append(pic,copy);
    target.classList.add('person-photo-ready');
    attached++;
  }
  if(attached!==cards.size)console.warn('[삼생화] 일부 원본 사진 누락:',attached,'/',cards.size);
}).catch(error=>console.warn('[삼생화] 원본 캐릭터 사진 로딩 실패:',error));
})();