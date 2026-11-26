// LeSeft Nigeria concept importer. Creates native editable Figma layers; no network access.
// Content and images are generated into this file by scripts/build-figma-plugin.cjs.
const DATA = __DATA__;
const ASSET_DATA = __ASSETS__;
const C = { ink:'#15352e', forest:'#123b31', deep:'#0b2d25', lime:'#d7e5c4', cream:'#f7f7f1', paper:'#fffefa', muted:'#60716b', line:'#d9e1d7', pale:'#f0f4ed', white:'#ffffff', sage:'#dce8d0', soft:'#a9bfb0' };
const rgb = hex => ({ r: parseInt(hex.slice(1,3),16)/255, g: parseInt(hex.slice(3,5),16)/255, b: parseInt(hex.slice(5,7),16)/255 });
const solid = (hex, opacity=1) => ({ type:'SOLID', color:rgb(hex), opacity });
let FONT_BODY, FONT_BOLD, FONT_SERIF, IMAGE = {};

function frame(parent, name, x, y, w, h, background, clip=true) {
  const n=figma.createFrame(); n.name=name; n.resize(w,h); n.clipsContent=clip; n.fills=background ? [solid(background)] : []; parent.appendChild(n); n.x=x; n.y=y; return n;
}
function box(parent, name, x,y,w,h,color,opacity=1) {
  const n=figma.createRectangle(); n.name=name; n.resize(w,h); n.fills=[solid(color,opacity)]; parent.appendChild(n); n.x=x; n.y=y; return n;
}
function picture(parent,name,x,y,w,h,path) {
  const n=figma.createRectangle(); n.name=name; n.resize(w,h);
  n.fills=IMAGE[path] ? [{type:'IMAGE',scaleMode:'FILL',imageHash:IMAGE[path]}] : [solid(C.sage)];
  parent.appendChild(n); n.x=x; n.y=y; return n;
}
function circle(parent,name,x,y,d,fill,stroke) {
  const n=figma.createEllipse(); n.name=name; n.resize(d,d); n.fills=fill ? [solid(fill)] : []; if(stroke){n.strokes=[solid(stroke)];n.strokeWeight=1;} parent.appendChild(n); n.x=x; n.y=y; return n;
}
function text(parent, name, value, x,y,w,size,color=C.ink, face='body', line=1.32) {
  const n=figma.createText(); n.name=name; n.fontName=face==='serif'?FONT_SERIF:face==='bold'?FONT_BOLD:FONT_BODY; n.fontSize=size; n.lineHeight={unit:'PIXELS',value:size*line}; n.fills=[solid(color)]; n.characters=String(value || ''); n.textAutoResize='HEIGHT'; n.resize(w,Math.max(1,n.height)); parent.appendChild(n); n.x=x; n.y=y; return n;
}
function eyebrow(parent,value,x,y,color='#4f7054',w=500) {
  box(parent,'Eyebrow line',x,y+6,27,1,color); return text(parent,'Eyebrow',value,x+38,y,Math.max(30,Math.min(w-38,parent.width-x-38)),10,color,'bold',1.3);
}
function button(parent,label,x,y,w, light=true) {
  const b=frame(parent,`Button / ${label}`,x,y,w,50,light?C.lime:C.forest);
  text(b,'Button label',label,18,17,w-55,12,light?C.forest:C.white,'bold');
  text(b,'Arrow','↗',w-28,14,18,16,light?C.forest:C.white,'bold'); return b;
}
function mark(parent,x,y,inverse=false) {
  box(parent,'Brand symbol',x,y,34,34,inverse?C.lime:C.forest);
  [11,16,21].forEach((h,i)=>box(parent,'Brand bar',x+6+i*7,y+27-h,5,h,inverse?C.forest:C.lime));
  text(parent,'Wordmark','LeSeft',x+44,y-1,95,22,inverse?C.white:C.ink,'bold',1);
  text(parent,'Brand qualifier','N I G E R I A',x+44,y+22,100,7,inverse?C.white:C.ink,'bold');
}
function header(parent,w,mobile) {
  const top=frame(parent,'01 / Header',0,0,w,112,C.paper);
  box(top,'Top strip',0,0,w,32,C.deep);
  text(top,'Positioning','TRADING HOUSE  /  PROJECT OFFICE',mobile?20:80,10,260,mobile?8:9,C.lime,'bold');
  if(!mobile) text(top,'Preview note','CONCEPT PREVIEW  •  CONTENT SUBJECT TO APPROVAL',w-440,10,380,9,C.lime,'bold');
  mark(top,mobile?20:80,55);
  if(mobile){ text(top,'Menu','☰',w-47,54,28,21,C.ink); }
  else {
    const nav=[['Home',390,55],['About',468,60],['Commodities',550,100],['Equipment & technologies',665,176],['Projects & services',860,142],['For partners',1020,100]];
    nav.forEach(([label,x,width])=>text(top,`Navigation / ${label}`,label,x,65,width,12,C.ink,'bold'));
    const outline=box(top,'Contact button',w-230,50,150,46,C.paper); outline.strokes=[solid('#9aac9e')]; outline.strokeWeight=1;
    text(top,'Contact label','Get in touch    ↗',w-214,64,132,12,C.ink,'bold');
  }
  return 112;
}
function footer(parent,w,y,mobile) {
  const h=mobile?620:340, f=frame(parent,'Footer',0,y,w,h,C.deep), x=mobile?20:80;
  mark(f,x,54,true);
  text(f,'Footer description',DATA.settings.footerSummary,x,110,mobile?300:285,13,C.soft,'body',1.7);
  text(f,'Footer location','●  ABUJA, NIGERIA  /  CONNECTED GLOBALLY',x,mobile?192:198,mobile?330:340,9,C.soft,'bold');
  if(mobile){
    text(f,'Explore label','EXPLORE',x,260,140,10,C.soft,'bold');
    text(f,'Explore links','About us\nCommodities\nEquipment & technologies\nProjects & services',x,288,185,13,C.white,'body',2);
    text(f,'Connect label','CONNECT',212,260,150,10,C.soft,'bold');
    text(f,'Connect links','For partners\nContact us',212,288,150,13,C.white,'body',2);
    text(f,'Find us label','FIND US',x,430,150,10,C.soft,'bold');
    text(f,'Location and contacts','Abuja, Nigeria\nEmail to be confirmed\nPhone to be confirmed',x,458,300,13,C.white,'body',1.8);
    box(f,'Footer divider',x,550,w-40,1,'#47675b');
    text(f,'Copyright','© 2026 LeSeft Nigeria. All rights reserved.',x,569,w-40,10,C.soft);
  } else {
    text(f,'Explore label','EXPLORE',545,60,170,10,C.soft,'bold'); text(f,'Explore links','About us\nCommodities\nEquipment & technologies\nProjects & services',545,91,200,13,C.white,'body',2.1);
    text(f,'Connect label','CONNECT',810,60,150,10,C.soft,'bold'); text(f,'Connect links','For partners\nContact us',810,91,170,13,C.white,'body',2.1);
    text(f,'Find us label','FIND US',1050,60,160,10,C.soft,'bold'); text(f,'Location and contacts','Abuja, Nigeria\nEmail to be confirmed\nPhone to be confirmed',1050,91,230,13,C.white,'body',2.1);
    box(f,'Footer divider',x,276,w-160,1,'#47675b'); text(f,'Copyright','© 2026 LeSeft Nigeria. All rights reserved.',x,294,500,10,C.soft);
    text(f,'Footer positioning','TRADING HOUSE  /  PROJECT OFFICE',w-330,294,260,9,C.soft,'bold');
  }
  return y+h;
}
function cta(parent,w,y,mobile) {
  const h=mobile?255:208, a=frame(parent,'Call to action',0,y,w,h,C.sage), x=mobile?20:80;
  eyebrow(a,"LET'S CONNECT",x,45,'#426649');
  text(a,'CTA title',DATA.settings.ctaTitle,x,76,mobile?w-40:760,mobile?40:52,C.ink,'serif',1.1);
  text(a,'CTA description',DATA.settings.ctaBody,x,mobile?134:145,mobile?w-40:670,14,C.muted);
  button(a,'Start a conversation',mobile?x:w-282,mobile?190:118,202,false);
  return y+h;
}
function internalHero(root,p,w,y,mobile) {
  const h=mobile?700:505, s=frame(root,'02 / Hero',0,y,w,h,C.pale);
  const x=mobile?20:80;
  text(s,'Breadcrumb','HOME  ›  '+p.navLabel.toUpperCase(),x,42,mobile?w-40:600,9,'#7b9182','bold');
  eyebrow(s,p.hero.eyebrow,x,mobile?104:132);
  const head=text(s,'Hero heading',p.hero.heading,x,mobile?139:168,mobile?w-40:570,mobile?48:66,C.ink,'serif',1.05);
  const introY=(mobile?139:168)+head.height+22;
  text(s,'Hero introduction',p.hero.subtitle,x,introY,mobile?w-40:510,15,C.muted,'body',1.7);
  text(s,'Hero marker','○   LESEFT NIGERIA  /  OUR WORLD',x,mobile?350:418,Math.min(380,w-x-20),10,'#7b9182','bold');
  if(mobile){ picture(s,'Hero image, illustrative',0,405,w,295,p.hero.imagePath); }
  else {picture(s,'Hero image, illustrative',720,0,w-720,505,p.hero.imagePath); box(s,'Image tab',w-116,463,116,42,C.sage);text(s,'Image tab label','LESEFT   ↗',w-101,477,92,9,C.ink,'bold');}
  return y+h;
}
function contentSections(root,p,w,y,mobile) {
  for(let i=0;i<p.sections.length;i++){
    const item=p.sections[i], x=mobile?20:80, innerW=mobile?w-40:1280;
    const s=frame(root,`${String(i+3).padStart(2,'0')} / ${item.title}`,0,y,w,900,C.paper,false);
    eyebrow(s,item.eyebrow,x,62);
    const left=text(s,'Section heading',item.title,x,95,mobile?innerW:520,mobile?38:48,C.ink,'serif',1.12);
    const bodyX=mobile?x:760, bodyW=mobile?innerW:600, bodyY=mobile?112+left.height:100;
    const body=text(s,'Section body',item.body,bodyX,bodyY,bodyW,15,C.muted,'body',1.8);
    let cursor=bodyY+body.height+28;
    if(item.items.length){
      box(s,'List top rule',bodyX,cursor,bodyW,1,C.line); cursor+=1;
      item.items.forEach((value,j)=>{
        text(s,`Bullet ${j+1}`,'+',bodyX,cursor+13,18,16,'#789c79','bold');
        const t=text(s,`List item ${j+1}`,value,bodyX+28,cursor+13,bodyW-30,13,C.ink,'bold',1.5);
        cursor+=Math.max(48,t.height+26); box(s,`List divider ${j+1}`,bodyX,cursor,bodyW,1,C.line);
      });
    }
    text(s,'Enquiry link','Discuss this with us  ↗',bodyX,cursor+26,240,12,C.forest,'bold');
    let h=Math.max(mobile?0:310,cursor+90,mobile?left.height+190:0);
    box(s,'Section divider',x,h-1,innerW,1,C.line); s.resize(w,h); y+=h;
  }
  return y;
}
function contactSection(root,p,w,y,mobile) {
  const h=mobile?1320:950, s=frame(root,'03 / Contact form',0,y,w,h,C.paper), x=mobile?20:80, content=p.sections[0];
  eyebrow(s,content.eyebrow,x,75);
  const left=text(s,'Section heading',content.title,x,108,mobile?w-40:480,mobile?38:50,C.ink,'serif',1.13);
  text(s,'Section introduction',content.body,x,120+left.height,mobile?w-40:420,15,C.muted,'body',1.8);
  if(!mobile){
    text(s,'Office label','OUR PRESENCE',x,445,300,10,'#789183','bold'); text(s,'Office city','Abuja, Nigeria\nOffice address to be confirmed for publication.',x,472,420,13,C.ink,'body',1.8);
    text(s,'Contact label','CONTACT DETAILS',x,570,300,10,'#789183','bold'); text(s,'Contact info','Official email to be confirmed.\nOfficial phone number to be confirmed.',x,597,430,13,C.ink,'body',1.8);
  }
  const fx=mobile?20:700, fy=mobile?435:75, fw=mobile?w-40:660, form=frame(s,'Enquiry form',fx,fy,fw,mobile?810:760,'#f2f5ef');
  text(form,'Form heading','Send an enquiry',25,28,fw-50,30,C.ink,'serif');
  text(form,'Form introduction','Tell us a little about your opportunity. Fields marked * are required.',25,72,fw-50,12,C.muted);
  box(form,'Preview notice background',25,104,fw-50,55,'#fff8e8'); text(form,'Preview notice','PREVIEW ONLY: Enquiry delivery and spam protection are not yet configured.',37,115,fw-74,11,'#6b542c','bold',1.5);
  const fields=[['Full name *',''],['Organisation (optional)',''],['Email address *',''],['Phone number (optional)',''],['What is your enquiry about? *','General  ⌄'],['Subject (optional)',''],['Your message *','Tell us about the opportunity or project…']];
  let yy=182;
  if(mobile){
    fields.forEach((field,i)=>{text(form,`Field label / ${field[0]}`,field[0],25,yy,fw-50,10,C.ink,'bold'); const hh=i===6?90:37;box(form,`Field / ${field[0]}`,25,yy+20,fw-50,hh,C.paper); if(field[1])text(form,'Field hint',field[1],34,yy+29,fw-70,11,C.muted); yy+=i===6?130:69;});
    button(form,'Send enquiry',25,yy+3,fw-50,false);
  } else {
    fields.slice(0,4).forEach((field,i)=>{const xx=25+(i%2)*((fw-60)/2+10), row=Math.floor(i/2); const wid=(fw-60)/2; text(form,`Field label / ${field[0]}`,field[0],xx,yy+row*82,wid,11,C.ink,'bold'); box(form,`Field / ${field[0]}`,xx,yy+20+row*82,wid,45,C.paper);});
    yy+=164; fields.slice(4).forEach((field,i)=>{text(form,`Field label / ${field[0]}`,field[0],25,yy,fw-50,11,C.ink,'bold');const hh=i===2?110:45;box(form,`Field / ${field[0]}`,25,yy+20,fw-50,hh,C.paper); if(field[1])text(form,'Field hint',field[1],36,yy+31,fw-70,12,C.muted);yy+=i===2?151:82;});
    button(form,'Send enquiry',25,yy+6,fw-50,false);
  }
  return y+h;
}
function home(root,p,w,y,mobile) {
  const x=mobile?20:80, innerW=mobile?w-40:w-160;
  const heroH=mobile?610:650, hero=frame(root,'02 / Home hero',0,y,w,heroH,C.deep);
  picture(hero,'Hero image, illustrative',0,0,w,heroH,p.hero.imagePath); box(hero,'Image overlay',0,0,w,heroH,C.deep,.68);
  eyebrow(hero,p.hero.eyebrow,x,mobile?88:112,C.lime);
  const title=text(hero,'Hero headline',p.hero.heading,x,mobile?130:155,mobile?w-40:760,mobile?58:94,C.white,'serif',1.02);
  const sy=(mobile?130:155)+title.height+28; text(hero,'Hero introduction',p.hero.subtitle,x,sy,mobile?w-40:500,mobile?15:16,'#e3e9df','body',1.7);
  button(hero,'Discover LeSeft',x,mobile?360:430,180,true); text(hero,'Secondary action','Start a conversation  ↗',x+205,mobile?377:447,mobile?145:220,12,C.white,'bold');
  box(hero,'Hero divider',x,heroH-68,innerW,1,'#91a998'); text(hero,'Hero caption','●  BASED IN ABUJA  /  CONNECTED GLOBALLY',x,heroH-41,Math.min(430,innerW),9,C.white,'bold');
  y+=heroH;
  const ribbon=frame(root,'03 / Positioning ribbon',0,y,w,60,C.sage); text(ribbon,'Positioning points',mobile?'INTERNATIONAL REACH   ✳   LOCAL IMPLEMENTATION':'INTERNATIONAL REACH    ✳    LOCAL IMPLEMENTATION    ✳    SHARED OPPORTUNITY',x,24,innerW,10,C.forest,'bold'); y+=60;
  const intro=p.sections.find(s=>s.key==='intro'), si=frame(root,'04 / Introduction',0,y,w,700,C.paper);
  eyebrow(si,intro.eyebrow,x,80); const it=text(si,'Introduction heading',intro.title,x,115,mobile?innerW:620,mobile?40:58,C.ink,'serif',1.12);
  const iy=mobile?130+it.height:127; const ib=text(si,'Introduction copy',intro.body,mobile?x:760,iy,mobile?innerW:580,15,C.muted,'body',1.8);
  const linkY=Math.max(mobile?0:260,iy+ib.height+25); text(si,'Introduction link','Get to know us   ↗',mobile?x:760,linkY,220,12,C.forest,'bold');
  const hi=Math.max(mobile?430:350,115+it.height+75,linkY+70); si.resize(w,hi); y+=hi;
  const cap=p.sections.find(s=>s.key==='capabilities'), cardH=mobile?435:430, cardsStart=mobile?210:192, hc=cardsStart+cardH*(mobile?3:1)+(mobile?48:0)+90;
  const sc=frame(root,'05 / Capabilities',0,y,w,hc,'#f1f4ed'); eyebrow(sc,cap.eyebrow,x,68); text(sc,'Capabilities heading',cap.title,x,102,mobile?innerW:650,mobile?40:58,C.ink,'serif',1.1);
  if(!mobile) text(sc,'Capabilities introduction',cap.body,970,132,390,15,C.muted,'body',1.8);
  const cw=mobile?innerW:(innerW-40)/3;
  p.cards.forEach((card,i)=>{const xx=mobile?x:x+i*(cw+20), yy=cardsStart+(mobile?i*(cardH+16):0), cf=frame(sc,`Capability card / ${card.title}`,xx,yy,cw,cardH,C.paper);
    picture(cf,'Card image, illustrative',0,0,cw,mobile?220:250,card.imagePath); text(cf,'Card number',card.number,17,16,40,10,C.white,'bold'); box(cf,'Card arrow background',cw-40,mobile?180:210,40,40,C.lime); text(cf,'Card arrow','↗',cw-27,mobile?189:219,20,16,C.forest,'bold');
    const cy=mobile?244:274; text(cf,'Card title',card.title,23,cy,cw-46,26,C.ink,'serif',1.1); text(cf,'Card description',card.description,23,cy+43,cw-46,13,C.muted,'body',1.65); text(cf,'Card link','Explore capability   ↗',23,cardH-40,cw-46,11,C.forest,'bold');
  }); y+=hc;
  const a=p.sections.find(s=>s.key==='approach'), hn=mobile?800:570, sn=frame(root,'06 / Global connections',0,y,w,hn,C.forest); eyebrow(sn,a.eyebrow,x,75,C.lime);
  const at=text(sn,'Connections heading',a.title,x,112,mobile?innerW:570,mobile?40:56,C.white,'serif',1.1);
  const ay=112+at.height+25; const ab=text(sn,'Connections copy',a.body,x,ay,mobile?innerW:520,15,'#c9dbce','body',1.8);
  let listY=ay+ab.height+25; a.items.forEach((v,i)=>{text(sn,`Connection point ${i+1}`,'○   '+v,x,listY+i*27,mobile?innerW:520,13,'#e3e9df');});
  text(sn,'Partners link','How we work with partners   ↗',x,listY+100,mobile?innerW:400,12,C.white,'bold');
  const nx=mobile?x:760, ny=mobile?500:80, nw=mobile?innerW:600, nh=mobile?250:410, art=frame(sn,'Abstract network map',nx,ny,nw,nh,C.forest);
  const border=box(art,'Map border',0,0,nw,nh,C.forest);border.strokes=[solid('#789789')];border.strokeWeight=1;
  text(art,'Map header','CONNECTED BY POSSIBILITY  ↗',20,20,nw-40,9,C.soft,'bold');
  const cx=nw*.5, cy=nh*.54; circle(art,'Outer ring',cx-(mobile?92:155),cy-(mobile?92:155),mobile?184:310,null,'#587d6c'); circle(art,'Inner ring',cx-(mobile?60:105),cy-(mobile?60:105),mobile?120:210,null,'#587d6c');
  [[.17,.63,'ABUJA'],[.5,.3,'EUROPE'],[.82,.42,'ASIA'],[.43,.75,'WEST AFRICA']].forEach(([px,py,label])=>{circle(art,`Map point ${label}`,nw*px,nh*py,8,C.lime);text(art,`Map label ${label}`,label,nw*px-12,nh*py+15,Math.min(130,nw-(nw*px-12)-8),9,C.white,'bold');});
  text(art,'Map footer','ONE WORLD. MANY OPPORTUNITIES.',20,nh-28,nw-40,8,C.soft,'bold'); y+=hn;
  const part=p.sections.find(s=>s.key==='partners'), hp=mobile?610:430, sp=frame(root,'07 / Partners',0,y,w,hp,C.paper); eyebrow(sp,part.eyebrow,x,72); const pt=text(sp,'Partners heading',part.title,x,105,mobile?innerW:600,mobile?40:58,C.ink,'serif',1.1); text(sp,'Partners introduction',part.body,x,120+pt.height,mobile?innerW:470,15,C.muted,'body',1.7); text(sp,'Partners link','Explore partnerships   ↗',x,mobile?315:330,250,12,C.forest,'bold');
  const px=mobile?x:760, py=mobile?380:80, pw=mobile?innerW:600; part.items.forEach((v,i)=>{box(sp,`Partner rule ${i+1}`,px,py+i*52,pw,1,C.line);text(sp,`Partner ${i+1}`,`0${i+1}    ${v}   →`,px,py+17+i*52,pw,13,C.ink,'bold');}); y+=hp;
  y=cta(root,w,y,mobile); return footer(root,w,y,mobile);
}
function createPageDesign(p,index,mobile,originX,originY) {
  const w=mobile?390:1440, root=frame(figma.currentPage,`${String(index+1).padStart(2,'0')} / ${p.navLabel} / ${mobile?'Mobile':'Desktop'}`,originX,originY,w,1000,C.paper,false);
  let y=header(root,w,mobile);
  if(p.pageKey==='home') y=home(root,p,w,y,mobile);
  else { y=internalHero(root,p,w,y,mobile); y=p.pageKey==='contact'?contactSection(root,p,w,y,mobile):contentSections(root,p,w,y,mobile); if(p.pageKey!=='contact')y=cta(root,w,y,mobile); y=footer(root,w,y,mobile); }
  root.resize(w,y); root.clipsContent=true; return root;
}
function designSystem(x,y) {
  const f=frame(figma.currentPage,'00 / Design system / draft',x,y,1440,560,C.paper);
  text(f,'Board title','LeSeft Nigeria / Concept system',80,55,1050,44,C.ink,'serif'); text(f,'Board note','DRAFT: Replace the wordmark, colours, imagery and content with LeSeft-approved assets.',80,113,1100,13,C.muted);
  text(f,'Colour label','COLOUR PALETTE',80,180,300,10,C.muted,'bold');
  [['Deep forest',C.deep],['Forest',C.forest],['Sage',C.sage],['Paper',C.paper],['Muted ink',C.muted]].forEach(([label,col],i)=>{const bx=80+i*205;const b=box(f,`Swatch / ${label}`,bx,210,175,100,col);b.strokes=[solid(C.line)];b.strokeWeight=1;text(f,`Colour / ${label}`,label+'  '+col.toUpperCase(),bx,325,180,12,C.ink,'bold');});
  text(f,'Typography label','TYPOGRAPHY',80,400,300,10,C.muted,'bold'); text(f,'Display example','International perspective.',80,428,650,40,C.ink,'serif'); text(f,'Body example','A calm, clear corporate voice.\nDM Serif Display + DM Sans (or Inter fallback).',830,427,500,14,C.muted,'body',1.6);
  return f;
}
async function main() {
  const all = await figma.listAvailableFontsAsync();
  const pick=(family,style, fallback)=>all.find(f=>f.fontName.family===family&&f.fontName.style===style)?.fontName || fallback;
  const inter={family:'Inter',style:'Regular'};
  FONT_BODY=pick('DM Sans','Regular',inter); FONT_BOLD=pick('DM Sans','Bold',pick('Inter','Bold',inter)); FONT_SERIF=pick('DM Serif Display','Regular',FONT_BODY);
  const unique=Array.from(new Map([FONT_BODY,FONT_BOLD,FONT_SERIF].map(f=>[f.family+'-'+f.style,f])).values());
  for(const font of unique) await figma.loadFontAsync(font);
  for(const [path,bytes] of Object.entries(ASSET_DATA)) IMAGE[path]=figma.createImage(figma.base64Decode(bytes)).hash;
  const existing=figma.currentPage.children;
  const right=existing.reduce((max,n)=>Math.max(max,n.x+n.width),0);
  const x=Math.ceil((right+200)/100)*100;
  const desktops=DATA.pages.map((p,i)=>createPageDesign(p,i,false,x+i*1540,0));
  const maxH=Math.max(...desktops.map(n=>n.height));
  DATA.pages.forEach((p,i)=>createPageDesign(p,i,true,x+i*500,maxH+200));
  designSystem(x,maxH+5700);
  figma.viewport.scrollAndZoomIntoView([desktops[0]]);
  figma.closePlugin('Created 7 desktop and 7 mobile editable concept frames plus a design-system board.');
}
main().catch(error=>{console.error(error);figma.closePlugin('Import stopped: '+(error && error.message ? error.message : String(error)));});
