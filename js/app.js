'use strict';
const C=window.ITSC, I=window.ICONS;
const icon=name=>(I[name]||I.web).replace('<svg','<svg aria-hidden="true" focusable="false"');
const safeUrl=value=>{try{const u=new URL(value);return ['https:','http:','tel:','mailto:'].includes(u.protocol)?u.href:''}catch{return ''}};
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n};
const wa=number=>/^\d{10,15}$/.test(String(number))?`https://wa.me/${number}`:'';
const external=a=>{if(/^https?:/.test(a.href)){a.target='_blank';a.rel='noopener noreferrer'}};
document.querySelectorAll('[data-icon]').forEach(n=>n.innerHTML=icon(n.dataset.icon));
document.querySelectorAll('[data-link]').forEach(a=>{let key=a.dataset.link,url=key==='telefono'?'tel:'+C.telefono:key==='correo'?'mailto:'+C.correo:C[key];a.href=safeUrl(url);external(a)});
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('contact-email').textContent=C.correo;
document.getElementById('contact-phone').textContent=C.telefono;
document.getElementById('contact-address').textContent=C.direccion;
if(C.logo)document.querySelectorAll('img[src="assets/logo.png"]').forEach(n=>n.src=C.logo);
if(C.fotoPortada){document.documentElement.style.setProperty('--city-photo',`url(${JSON.stringify(new URL(C.fotoPortada,document.baseURI).href)})`)}
const rows=[
 {title:'Facebook',desc:'Noticias y comunidad',icon:'facebook',cat:'Redes sociales',url:C.facebook},
 {title:'TikTok',desc:'@itsc_rm2312',icon:'tiktok',cat:'Redes sociales',url:C.tiktok},
 {title:'TECNO OFICIAL Luis',desc:'+591 74165292',icon:'whatsapp',cat:'Atención',url:wa(C.whatsappLuis),contact:'luis'},
 {title:'Corporativo Tecnológico Santa Cruz',desc:'+591 74165293',icon:'whatsapp',cat:'Atención',url:wa(C.whatsappCorporativo),contact:'corporativo'},
 {title:'Sitio institucional',desc:'www.itsc.edu.bo',icon:'institute',cat:'Institución',url:C.sitioWeb},
 {title:'Cómo llegar',desc:C.direccion,icon:'map',cat:'Institución',url:C.mapa},
 {title:'Correo electrónico',desc:C.correo,icon:'mail',cat:'Atención',url:'mailto:'+C.correo},
 {title:'Teléfono institucional',desc:C.telefono,icon:'phone',cat:'Atención',url:'tel:'+C.telefono},
 ...['instagram','linkedin'].filter(k=>safeUrl(C[k])).map(k=>({title:k==='instagram'?'Instagram':'LinkedIn',desc:'Conecta con nuestra comunidad.',icon:k,cat:'Redes sociales',url:C[k]}))
];
let filter='Todos';const query=document.getElementById('search');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function render(){const grid=document.getElementById('link-grid');grid.replaceChildren();let shown=0;rows.forEach(r=>{if(filter!=='Todos'&&r.cat!==filter)return;if(!normalize(r.title+' '+r.desc+' '+r.cat).includes(normalize(query.value.trim())))return;shown++;const url=safeUrl(r.url);const card=el(url?'a':'button','link-card brand-'+r.icon);if(url){card.href=url;external(card)}else{card.type='button';card.addEventListener('click',()=>contact(r.contact))}const top=el('div','card-top'),ic=el('span','icon-box');if(r.icon==='institute'){const logo=el('img');logo.src=C.logo;logo.alt='';logo.width=64;logo.height=64;ic.append(logo)}else{ic.innerHTML=icon(r.icon);}top.append(ic,el('span','card-category',r.cat));card.append(top,el('strong','',r.title),el('p','',r.desc),el('span','card-arrow','↗'));grid.append(card)});document.getElementById('empty').hidden=shown!==0;document.getElementById('results').textContent=shown+' accesos disponibles'}
function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});render()}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>{query.value='';setFilter(a.dataset.filterLink)}));query.addEventListener('input',render);render();
const nav=document.getElementById('navigation'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú')}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
['facebook','tiktok','instagram','linkedin'].forEach(k=>{if(!safeUrl(C[k]))return;const a=el('a');a.href=C[k];a.setAttribute('aria-label',k==='tiktok'?'TikTok':k[0].toUpperCase()+k.slice(1));a.innerHTML=icon(k);external(a);document.getElementById('contact-socials').append(a)});
const dialog=document.getElementById('contact-dialog');
function contact(area){const links=document.getElementById('dialog-links');links.replaceChildren();const available=[['TECNO OFICIAL Luis · +591 74165292',wa(C.whatsappLuis)],['Corporativo Tecnológico Santa Cruz · +591 74165293',wa(C.whatsappCorporativo)]].filter(x=>x[1]);document.getElementById('dialog-message').textContent=available.length?'Elige el canal de atención para tu consulta.':'El canal de WhatsApp todavía no está disponible en este portal. Puedes comunicarte por teléfono o correo.';available.concat([['Llamar al instituto','tel:'+C.telefono],['Enviar un correo','mailto:'+C.correo]]).forEach(([label,url])=>{const a=el('a','button primary',label+' ↗');a.href=url;external(a);links.append(a)});dialog.showModal()}
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>contact(b.dataset.contact)));document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
(C.noticias||[]).filter(n=>n.publicado===true).forEach(n=>{const article=el('article','news-item');if(n.imagen){const image=el('img');image.src=n.imagen;image.alt=n.alt||'';image.loading='lazy';article.append(image)}if(n.fecha&&/^\d{4}-\d{2}-\d{2}$/.test(n.fecha)){const time=el('time','',new Date(n.fecha+'T12:00:00').toLocaleDateString('es-BO',{year:'numeric',month:'long',day:'numeric'}));time.dateTime=n.fecha;article.append(time)}article.append(el('h3','',n.titulo),el('p','',n.resumen));if(safeUrl(n.enlace)){const a=el('a','text-link','Leer publicación ↗');a.href=n.enlace;external(a);article.append(a)}document.getElementById('news-list').append(article)});
