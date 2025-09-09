let playlist = [];
let idx = 0; let timer = null;
let names = Array.from({length:9}, (_,i)=>`Huyệt ${i+1}`);

const listEl = document.getElementById('nameList');
const imgEl = document.getElementById('img');
const thumbsEl = document.getElementById('thumbs');
const progressEl = document.getElementById('progress');

function render(i){
  if(!playlist[i]){ imgEl.removeAttribute('src'); return; }
  imgEl.src = playlist[i].dataURL;
  highlightThumb(i);
  progressEl.style.width = '0%';
}

function renderThumbs(){
  thumbsEl.innerHTML = '';
  playlist.forEach((p,i)=>{
    const wrap = document.createElement('div'); wrap.className='thumb';
    const im = new Image(); im.src = p.dataURL; im.title = names[i] || p.name; im.onclick=()=>{ idx=i; render(idx); };
    wrap.appendChild(im);
    thumbsEl.appendChild(wrap);
  });
  highlightThumb(idx);
}
function highlightThumb(i){
  [...thumbsEl.children].forEach((el,k)=> el.classList.toggle('active',k===i));
}

function renderNameList(){
  listEl.innerHTML = '';
  for(let i=0;i<names.length;i++){
    const row = document.createElement('div'); row.className='row'; row.dataset.i=i; row.draggable=true;
    const num = document.createElement('div'); num.className='num'; num.textContent=i+1; row.appendChild(num);
    const textarea=document.createElement('textarea'); textarea.value=names[i]; row.appendChild(textarea);
    textarea.addEventListener('input',()=>{ names[i]=textarea.value; });
    row.addEventListener('click',(e)=>{ if(e.target===textarea) return; idx=i; render(idx); });
    listEl.appendChild(row);
  }
}

function filesToPlaylist(files){
  playlist=[]; idx=0;
  const readers=Array.from(files).map(file=>new Promise(resolve=>{
    const fr=new FileReader();
    fr.onload=e=>resolve({name:file.name,dataURL:e.target.result});
    fr.onerror=()=>resolve(null);
    fr.readAsDataURL(file);
  }));
  Promise.all(readers).then(list=>{
    playlist=list.filter(Boolean);
    renderNameList();
    renderThumbs();
    render(idx);
  });
}

// ==== Playback controls ====
function play(){
  clearTimeout(timer);
  if(!playlist.length) return;
  render(idx);
  const seconds=Math.max(1,Number(document.getElementById('dur').value)||5);
  const startAt=performance.now();
  function tick(now){
    const t=Math.min(1,(now-startAt)/(seconds*1000));
    progressEl.style.width=(t*100)+'%';
    if(t<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  timer=setTimeout(()=>{ if(document.getElementById('autoChk').checked) next(); },seconds*1000);
}
function pause(){ clearTimeout(timer); }
function next(){ idx=(idx+1)%playlist.length; play(); }
function prev(){ idx=(idx-1+playlist.length)%playlist.length; play(); }

// ==== Event bindings ====
document.getElementById('fileInput').addEventListener('change',e=>filesToPlaylist(e.target.files));
document.getElementById('btnPlay').onclick=play;
document.getElementById('btnPause').onclick=pause;
document.getElementById('btnNext').onclick=()=>{pause();next();};
document.getElementById('btnPrev').onclick=()=>{pause();prev();};
document.getElementById('durMinus').onclick=()=>{
  let v=Math.max(1,Number(document.getElementById('dur').value)||1);
  document.getElementById('dur').value=Math.max(1,v-1);
};
document.getElementById('durPlus').onclick=()=>{
  let v=Math.max(1,Number(document.getElementById('dur').value)||1);
  document.getElementById('dur').value=v+1;
};

// ==== Save/Load/Export ====
const LS_KEY='huyet_playlist_v1';
const LS_NAMES='huyet_names_v1';
document.getElementById('btnSaveLocal').onclick=()=>{
  localStorage.setItem(LS_KEY,JSON.stringify(playlist));
  localStorage.setItem(LS_NAMES,JSON.stringify(names));
  alert('Đã lưu vào trình duyệt.');
};
document.getElementById('btnLoadLocal').onclick=()=>{
  const p=JSON.parse(localStorage.getItem(LS_KEY)||'[]');
  const n=JSON.parse(localStorage.getItem(LS_NAMES)||'[]');
  if(!p.length){alert('Chưa có dữ liệu lưu');return;}
  playlist=p; if(Array.isArray(n)&&n.length) names=n;
  idx=0; renderNameList(); renderThumbs(); render(idx);
};

// Xuất HTML vĩnh viễn
function exportHtml(){
  const payload={playlist,names};
  const tpl=`<!DOCTYPE html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>30 ngày bye bye mỡ bụng (bản lưu)</title>
  <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;padding:20px}img{max-width:100%%;border-radius:12px} .wrap{max-width:960px;margin:0 auto}</style>
  </head><body><div class='wrap'><h2>Bản lưu vĩnh viễn</h2><p>Mở file này bằng trình duyệt để xem lại danh sách ảnh và tên huyệt.</p><div id='viewer'></div><script>const BOOTSTRAP=${JSON.stringify(payload)};<\/script><script>(function(){const v=document.getElementById('viewer');if(!BOOTSTRAP||!BOOTSTRAP.playlist||!BOOTSTRAP.playlist.length){v.innerHTML='<p>Không có dữ liệu.</p>';return;}for(let i=0;i<BOOTSTRAP.playlist.length;i++){const h=document.createElement('h3');h.textContent=(BOOTSTRAP.names&&BOOTSTRAP.names[i])||BOOTSTRAP.playlist[i].name||('Ảnh '+(i+1));const img=new Image();img.src=BOOTSTRAP.playlist[i].dataURL;v.appendChild(h);v.appendChild(img);}})();<\/script></div></body></html>`;
  const blob=new Blob([tpl],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.getElementById('exportLink');
  a.href=url; a.download='30ngay-huyet.html'; a.style.display='inline-block';
}
document.getElementById('btnExportHtml').onclick=exportHtml;

renderNameList();