const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const STORAGE = {tasks:'zahfa_clouddesk_tasks_v1',notes:'zahfa_clouddesk_notes_v1',theme:'zahfa_clouddesk_theme_v1'};
const todayISO = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
let tasks = JSON.parse(localStorage.getItem(STORAGE.tasks) || 'null') || [
 {id:1,title:'Review cloud computing materials',category:'Study',due:todayISO(),done:false},
 {id:2,title:'Prepare weekly project update',category:'Project',due:todayISO(),done:false},
 {id:3,title:'Organize personal study notes',category:'Personal',due:'',done:true}
];
let notes = JSON.parse(localStorage.getItem(STORAGE.notes) || '[]');
let editingTask = null;
let calendarDate = new Date();
let toastTimer;
const saveTasks = () => localStorage.setItem(STORAGE.tasks,JSON.stringify(tasks));
const saveNotes = () => localStorage.setItem(STORAGE.notes,JSON.stringify(notes));
const escapeHTML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2200);}
function updateClock(){const d=new Date();$('#topClock').textContent=d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});$('#topDate').textContent=d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'});}
function stats(){const total=tasks.length,done=tasks.filter(t=>t.done).length,active=total-done,rate=total?Math.round(done/total*100):0;
 $('#totalTasks').textContent=total;$('#completedTasks').textContent=done;$('#progressTasks').textContent=active;$('#productivity').innerHTML=`${rate}<small>%</small>`;
 $('#analyticsTotal').textContent=total;$('#analyticsDone').textContent=done;$('#analyticsRate').textContent=rate+'%';$('#navTaskCount').textContent=active;
 $('#donutPercent').textContent=rate+'%';$('#donutChart').style.background=`conic-gradient(var(--primary) ${rate*3.6}deg, ${document.body.classList.contains('dark')?'#293750':'#e9edf7'} 0deg)`;
 $('#legendDone').textContent=done;$('#legendPending').textContent=active;
 const bar=$('#barChart');if(bar)bar.innerHTML=[['Completed',done,'#21b887'],['In progress',active,'#4169e1'],['All tasks',total,'#8965e8']].map(([label,n,color])=>`<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${total?Math.max(4,n/total*100):0}%;background:${color}"></div></div><b>${n}</b></div>`).join('');
}
function taskRow(t){return `<div class="task-row"><button class="task-check ${t.done?'checked':''}" data-toggle="${t.id}" aria-label="Ubah status">${t.done?'✓':''}</button><div class="task-main"><strong class="${t.done?'is-done':''}">${escapeHTML(t.title)}</strong><div class="task-meta">${escapeHTML(t.category)}${t.due?' · Due '+new Date(t.due+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short'}):''}</div></div><span class="task-tag ${escapeHTML(t.category)}">${escapeHTML(t.category)}</span><div class="task-actions"><button class="tiny-action" data-edit="${t.id}" title="Edit">✎</button><button class="tiny-action" data-delete="${t.id}" title="Hapus">×</button></div></div>`;}
function renderTasks(){const recent=$('#recentTaskList'),all=$('#allTaskList');const sorted=[...tasks].sort((a,b)=>Number(a.done)-Number(b.done));
 recent.innerHTML=sorted.slice(0,4).map(taskRow).join('')||'<div class="empty-state">No tasks yet. Create your first task!</div>';
 const q=($('#taskSearch')?.value||'').toLowerCase(),filter=$('#taskFilter')?.value||'all';
 const shown=sorted.filter(t=>t.title.toLowerCase().includes(q)&&(filter==='all'||(filter==='completed'?t.done:!t.done)));
 all.innerHTML=shown.map(taskRow).join('')||'<div class="empty-state">No matching tasks found.</div>';
 $('#agendaList').innerHTML=tasks.filter(t=>!t.done).slice(0,3).map((t,i)=>`<div class="agenda-item"><span class="agenda-time">${t.due===todayISO()?'Today':'Plan'}</span><span class="agenda-line"></span><div class="agenda-copy"><strong>${escapeHTML(t.title)}</strong><small>${escapeHTML(t.category)}</small></div></div>`).join('')||'<div class="empty-state">Your agenda is clear. Enjoy your day!</div>';
 stats();
}
function openModal(task=null){editingTask=task?task.id:null;$('#modalTitle').textContent=task?'Edit task':'Create a task';$('#taskTitle').value=task?.title||'';$('#taskCategory').value=task?.category||'Study';$('#taskDue').value=task?.due||'';$('#taskModal').classList.add('show');$('#taskModal').setAttribute('aria-hidden','false');$('#taskTitle').focus();}
function closeModal(){$('#taskModal').classList.remove('show');$('#taskModal').setAttribute('aria-hidden','true');$('#taskForm').reset();editingTask=null;}
$('#taskForm').addEventListener('submit',e=>{e.preventDefault();const data={title:$('#taskTitle').value.trim(),category:$('#taskCategory').value,due:$('#taskDue').value};if(!data.title)return;
 if(editingTask!==null){tasks=tasks.map(t=>t.id===editingTask?{...t,...data}:t);notify('Task updated successfully');}else{tasks.unshift({id:Date.now(),...data,done:false});notify('New task added');}
 saveTasks();renderTasks();closeModal();});
$('#closeModal').onclick=closeModal;$('#cancelModal').onclick=closeModal;$('#taskModal').addEventListener('click',e=>{if(e.target===$('#taskModal'))closeModal();});
$('#quickAddTask').onclick=()=>openModal();$('#addTaskButton').onclick=()=>openModal();
document.addEventListener('click',e=>{const toggle=e.target.closest('[data-toggle]'),edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
 if(toggle){const id=Number(toggle.dataset.toggle);tasks=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);saveTasks();renderTasks();notify('Task status updated');}
 if(edit){const t=tasks.find(x=>x.id===Number(edit.dataset.edit));if(t)openModal(t);}
 if(del){const id=Number(del.dataset.delete);tasks=tasks.filter(t=>t.id!==id);saveTasks();renderTasks();notify('Task deleted');}
 const goto=e.target.closest('[data-goto]');if(goto)showPage(goto.dataset.goto);
});
$('#taskSearch').addEventListener('input',renderTasks);$('#taskFilter').addEventListener('change',renderTasks);
function showPage(name){$$('.page').forEach(p=>p.classList.remove('active-page'));$(`#page-${name}`).classList.add('active-page');$$('.nav-link[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));$('#breadcrumbPage').textContent=name[0].toUpperCase()+name.slice(1);$('#sidebar').classList.remove('open');if(name==='calendar')renderCalendar();if(name==='notes')renderNotes();if(name==='analytics')stats();window.scrollTo({top:0,behavior:'smooth'});}
$$('.nav-link[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
$('#themeToggle').addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem(STORAGE.theme,document.body.classList.contains('dark')?'dark':'light');$('#themeToggle').textContent=document.body.classList.contains('dark')?'☾':'☼';stats();});
if(localStorage.getItem(STORAGE.theme)==='dark'){document.body.classList.add('dark');$('#themeToggle').textContent='☾';}
$('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');
function renderCalendar(){const y=calendarDate.getFullYear(),m=calendarDate.getMonth();$('#monthLabel').textContent=calendarDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate();const names=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];let out=names.map(n=>`<div class="calendar-cell day-name">${n}</div>`).join('');for(let i=0;i<42;i++){let day,muted=false,date;if(i<first){day=prev-first+i+1;muted=true;date=new Date(y,m-1,day);}else if(i>=first+days){day=i-first-days+1;muted=true;date=new Date(y,m+1,day);}else{day=i-first+1;date=new Date(y,m,day);}const iso=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;out+=`<div class="calendar-cell ${muted?'muted':''} ${iso===todayISO()?'today':''}">${day}</div>`;}$('#calendarGrid').innerHTML=out;}
$('#prevMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar();};$('#nextMonth').onclick=()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar();};
$('#saveNote').onclick=()=>{const title=$('#noteTitle').value.trim(),body=$('#noteBody').value.trim();if(!title||!body){notify('Please enter a title and note');return;}notes.unshift({id:Date.now(),title,body,created:new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})});saveNotes();$('#noteTitle').value='';$('#noteBody').value='';renderNotes();notify('Note saved');};
function renderNotes(){$('#notesList').innerHTML=notes.map(n=>`<article class="note-card"><button data-note-delete="${n.id}" title="Delete note">×</button><h3>${escapeHTML(n.title)}</h3><p>${escapeHTML(n.body)}</p><small>${n.created}</small></article>`).join('')||'<div class="empty-state">No notes yet. Save your first idea above.</div>';}
document.addEventListener('click',e=>{const b=e.target.closest('[data-note-delete]');if(b){notes=notes.filter(n=>n.id!==Number(b.dataset.noteDelete));saveNotes();renderNotes();notify('Note deleted');}});
$('#year').textContent=new Date().getFullYear();updateClock();setInterval(updateClock,30000);renderTasks();renderCalendar();renderNotes();
