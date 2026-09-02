(() => {
  "use strict";

  const STORAGE_KEY = "qwizzy-badge-checklist-v1";
  const PAGE_SIZE = 64;
  const common = [1,3,5,10,15,20,25,30,40,50,75,100,150,200,250,500,750,1000,2500,5000];
  const series = [
    ["accepted_questions",25000,91,[1,3,5,10,15,25,50,75,100,150,250,500,750,1000,1500,2500,5000,7500,10000,25000],"✓",158],
    ["submitted_questions",25000,91,[1,3,5,10,15,25,50,75,100,150,250,500,750,1000,1500,2500,5000,7500,10000,25000],"✎",215],
    ["daily_streak",2500,91,[1,3,5,7,10,14,21,30,50,75,100,150,200,250,365,500,750,1000,1500,2500],"🔥",28],
    ["correct_streak",5000,91,common,"✓✓",145],
    ["wrong_streak",5000,91,common,"×",350],
    ["sudden_death_score",5000,91,common,"⚡",266],
    ["three_hearts_score",5000,91,common,"♥",326],
    ["player_level",5000,91,[2,5,10,15,20,25,30,40,50,75,100,150,200,250,500,750,1000,1500,2500,5000],"★",42],
    ["correct_answers",100000,91,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500,5000,7500,10000,25000,50000,100000],"●",172],
    ["wrong_answers",100000,91,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500,5000,7500,10000,25000,50000,100000],"○",3],
    ["fifty_fifty_uses",100000,90,[1,5,10,25,50,75,100,150,250,500,750,1000,1500,2500,5000,7500,10000,25000,50000,100000],"50",190]
  ];

  const copy = {
    en:{back:"← Back to Qwizzy",eyebrow:"The complete collection",headline:"badges to earn.",intro:"From tiny first steps to ridiculous endurance tests. Find your next challenge and tick off what you have already earned.",localNote:"Your checklist stays private in this browser and does not change your progress in the app.",checked:"checked",open:"still open",progress:"progress",search:"Search challenges",category:"All categories",difficulty:"All difficulties",all:"All",openButton:"Open",done:"Done",results:"challenges",emptyTitle:"Nothing found.",emptyBody:"Try another filter or search term.",loadMore:"Show more badges",reach:"Reach",level:["Easy","Playful","Serious","Hard","Legendary"],tone:["A friendly start","Okay, now we are talking","No excuses","For the stubborn ones","Completely unhinged"],categories:["Accepted questions","Submitted questions","Daily streak","Best correct-answer streak","Longest wrong-answer streak","Sudden Death","3 Hearts","Player level","Correct answers","Wrong answers","50:50 joker uses"]},
    de:{back:"← Zurück zu Qwizzy",eyebrow:"Die komplette Sammlung",headline:"Abzeichen zum Erspielen.",intro:"Von kleinen ersten Schritten bis zu völlig verrückten Ausdauertests. Finde deine nächste Herausforderung und hake ab, was du schon geschafft hast.",localNote:"Deine Checkliste bleibt privat in diesem Browser und verändert deinen Fortschritt in der App nicht.",checked:"abgehakt",open:"noch offen",progress:"Fortschritt",search:"Herausforderungen suchen",category:"Alle Kategorien",difficulty:"Alle Schwierigkeiten",all:"Alle",openButton:"Offen",done:"Erledigt",results:"Herausforderungen",emptyTitle:"Nichts gefunden.",emptyBody:"Versuche einen anderen Filter oder Suchbegriff.",loadMore:"Mehr Abzeichen anzeigen",reach:"Erreiche",level:["Leicht","Spielerisch","Ernst","Schwer","Legendär"],tone:["Locker zum Aufwärmen","Jetzt wird es interessant","Keine Ausreden","Für die Hartnäckigen","Komplett verrückt"],categories:["Angenommene Fragen","Eingereichte Fragen","Tägliche Serie","Beste richtige Serie","Längste falsche Serie","Sudden Death","3 Herzen","Spielerlevel","Richtige Antworten","Falsche Antworten","50:50 Joker eingesetzt"]},
    es:{back:"← Volver a Qwizzy",eyebrow:"La colección completa",headline:"insignias por conseguir.",intro:"Desde pequeños primeros pasos hasta pruebas de resistencia absurdas. Encuentra tu próximo reto y marca lo que ya has logrado.",localNote:"Tu lista permanece privada en este navegador y no modifica tu progreso en la app.",checked:"marcadas",open:"pendientes",progress:"progreso",search:"Buscar retos",category:"Todas las categorías",difficulty:"Todas las dificultades",all:"Todas",openButton:"Pendientes",done:"Completadas",results:"retos",emptyTitle:"No hay resultados.",emptyBody:"Prueba otro filtro o término de búsqueda.",loadMore:"Mostrar más insignias",reach:"Alcanza",level:["Fácil","Divertida","Seria","Difícil","Legendaria"],tone:["Un comienzo amable","Ahora se pone interesante","Sin excusas","Para gente tenaz","Completamente absurdo"],categories:["Preguntas aceptadas","Preguntas enviadas","Racha diaria","Mejor racha correcta","Mayor racha incorrecta","Muerte súbita","3 Corazones","Nivel de jugador","Respuestas correctas","Respuestas incorrectas","Usos del comodín 50:50"]},
    it:{back:"← Torna a Qwizzy",eyebrow:"La collezione completa",headline:"badge da conquistare.",intro:"Dai primi piccoli passi a prove di resistenza assurde. Trova la prossima sfida e spunta ciò che hai già conquistato.",localNote:"La checklist resta privata in questo browser e non modifica i progressi nell'app.",checked:"spuntati",open:"ancora aperti",progress:"progresso",search:"Cerca sfide",category:"Tutte le categorie",difficulty:"Tutte le difficoltà",all:"Tutti",openButton:"Aperti",done:"Completati",results:"sfide",emptyTitle:"Nessun risultato.",emptyBody:"Prova un altro filtro o termine di ricerca.",loadMore:"Mostra altri badge",reach:"Raggiungi",level:["Facile","Giocosa","Seria","Difficile","Leggendaria"],tone:["Un inizio tranquillo","Ora si fa interessante","Niente scuse","Per chi non molla","Completamente folle"],categories:["Domande accettate","Domande inviate","Serie giornaliera","Migliore serie corretta","Serie errata più lunga","Sudden Death","3 Cuori","Livello giocatore","Risposte corrette","Risposte errate","Usi del jolly 50:50"]}
  };

  const milestones = ([, maximum, count, mandatory]) => {
    const required = new Set(mandatory);
    const candidates = new Set();
    const samples = count * 40;
    for (let i=0;i<=samples;i++) {
      const value = Math.max(1,Math.min(maximum,Math.round(Math.exp(Math.log(maximum)*i/samples))));
      if (!required.has(value)) candidates.add(value);
    }
    const available = [...candidates].sort((a,b)=>a-b);
    const needed = count-required.size;
    for (let bucket=0;bucket<needed;bucket++) required.add(available[Math.floor(bucket*available.length/needed)]);
    return [...required].sort((a,b)=>a-b);
  };

  const allBadges = series.flatMap((definition, seriesIndex) => milestones(definition).map((value,index,list) => ({
    id:`${definition[0]}:${value}`,key:definition[0],value,index,seriesIndex,icon:definition[4],hue:definition[5],difficulty:Math.min(4,Math.floor(index/list.length*5)),catalogNumber:series.slice(0,seriesIndex).reduce((total,item)=>total+item[2],0)+index+1
  })));
  if (allBadges.length !== 1000) throw new Error(`Expected 1000 badges, got ${allBadges.length}`);

  let checked;
  try { checked = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")); } catch { checked = new Set(); }
  let state={search:"",category:"all",difficulty:"all",status:"all",visible:PAGE_SIZE};
  let language="en";
  const el=(id)=>document.getElementById(id);
  const number=(value)=>new Intl.NumberFormat(language).format(value);
  const currentCopy=()=>copy[language]||copy.en;

  function setLanguage(next) {
    language=copy[next]?next:"en";
    const c=currentCopy();
    document.querySelectorAll("[data-copy]").forEach(node=>{ const value=c[node.dataset.copy]; if(typeof value==="string") node.textContent=value; });
    el("badge-search").placeholder=c.search;
    el("category-filter").innerHTML=`<option value="all">${c.category}</option>`+series.map((s,i)=>`<option value="${s[0]}">${c.categories[i]}</option>`).join("");
    el("category-filter").value=state.category;
    el("difficulty-filter").innerHTML=`<option value="all">${c.difficulty}</option>`+c.level.map((label,i)=>`<option value="${i}">${label}</option>`).join("");
    el("difficulty-filter").value=state.difficulty;
    render();
  }

  function matches(badge) {
    const c=currentCopy();
    const haystack=`${badge.value} ${c.categories[badge.seriesIndex]} ${c.tone[(badge.index+badge.seriesIndex)%c.tone.length]} ${c.level[badge.difficulty]}`.toLocaleLowerCase(language);
    return (!state.search||haystack.includes(state.search)) && (state.category==="all"||badge.key===state.category) && (state.difficulty==="all"||badge.difficulty===Number(state.difficulty)) && (state.status==="all"||(state.status==="done")===checked.has(badge.id));
  }

  function render() {
    const c=currentCopy();
    const filtered=allBadges.filter(matches);
    const shown=filtered.slice(0,state.visible);
    el("badge-grid").innerHTML=shown.map(badge=>{
      const done=checked.has(badge.id); const category=c.categories[badge.seriesIndex]; const tone=c.tone[(badge.index+badge.seriesIndex)%c.tone.length];
      return `<article class="web-badge-card${done?" is-done":""}" style="--badge-hue:${badge.hue}" data-id="${badge.id}"><div class="badge-card-top"><span class="badge-card-icon">${badge.icon}</span><button class="badge-card-check" type="button" aria-label="${done?c.done:c.openButton}: ${category} ${badge.value}" aria-pressed="${done}">${done?"✓":""}</button></div><strong class="badge-card-value">${number(badge.value)}</strong><h2 class="badge-card-title">${tone}</h2><p class="badge-card-description">${c.reach} ${number(badge.value)} · ${category}</p><div class="badge-card-foot"><span>${c.level[badge.difficulty]}</span><span class="badge-catalog-number">${badge.catalogNumber}/1000</span><span aria-hidden="true"></span></div></article>`;
    }).join("");
    el("result-count").textContent=number(filtered.length);
    el("empty-badges").hidden=filtered.length!==0;
    el("load-more-badges").hidden=shown.length>=filtered.length;
    el("checked-count").textContent=number(checked.size);
    el("open-count").textContent=number(allBadges.length-checked.size);
    const percent=Math.round(checked.size/allBadges.length*100);
    el("percent-count").textContent=`${percent}%`;
    el("progress-bar").style.width=`${percent}%`;
  }

  el("badge-grid").addEventListener("click",event=>{
    const button=event.target.closest(".badge-card-check"); if(!button)return;
    const id=button.closest(".web-badge-card").dataset.id;
    checked.has(id)?checked.delete(id):checked.add(id);
    localStorage.setItem(STORAGE_KEY,JSON.stringify([...checked])); render();
  });
  el("badge-search").addEventListener("input",event=>{state.search=event.target.value.trim().toLocaleLowerCase(language);state.visible=PAGE_SIZE;render();});
  el("category-filter").addEventListener("change",event=>{state.category=event.target.value;state.visible=PAGE_SIZE;render();});
  el("difficulty-filter").addEventListener("change",event=>{state.difficulty=event.target.value;state.visible=PAGE_SIZE;render();});
  document.querySelector(".badge-status-filter").addEventListener("click",event=>{const button=event.target.closest("button[data-status]");if(!button)return;state.status=button.dataset.status;state.visible=PAGE_SIZE;document.querySelectorAll("[data-status]").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));render();});
  el("load-more-badges").addEventListener("click",()=>{state.visible+=PAGE_SIZE;render();});
  addEventListener("gdb-language-change",event=>setLanguage(event.detail.language));
  const saved=localStorage.getItem("gdb-language")||navigator.language.slice(0,2);
  setLanguage(saved);
})();
