import { allBadges, series } from "./qwizzy-badge-catalog.mjs";

(() => {
  "use strict";

  const STORAGE_KEY = "qwizzy-badge-checklist-v1";
  const PAGE_SIZE = 64;
  const copy = {
    en:{back:"← Back to Qwizzy",eyebrow:"Permanent achievements",headline:"badges to earn.",intro:"The exact 1,000 permanent achievement badges available in Qwizzy, across eleven progress categories.",localNote:"Your checklist stays private in this browser and does not change your progress in the app.",checked:"checked",open:"still open",progress:"progress",search:"Search achievements",category:"All categories",all:"All",openButton:"Open",done:"Done",results:"achievements",emptyTitle:"Nothing found.",emptyBody:"Try another category or search term.",loadMore:"Show more badges",reach:"Reach",categories:["Accepted questions","Submitted questions","Daily streak","Best correct-answer streak","Longest wrong-answer streak","Sudden Death","3 Hearts","Player level","Correct answers","Wrong answers","50:50 joker uses"]},
    de:{back:"← Zurück zu Qwizzy",eyebrow:"Dauerhafte Erfolge",headline:"Abzeichen zum Erspielen.",intro:"Die exakt 1.000 dauerhaften Erfolgsabzeichen aus Qwizzy, verteilt auf elf Fortschrittskategorien.",localNote:"Deine Checkliste bleibt privat in diesem Browser und verändert deinen Fortschritt in der App nicht.",checked:"abgehakt",open:"noch offen",progress:"Fortschritt",search:"Erfolge suchen",category:"Alle Kategorien",all:"Alle",openButton:"Offen",done:"Erledigt",results:"Erfolge",emptyTitle:"Nichts gefunden.",emptyBody:"Versuche eine andere Kategorie oder einen anderen Suchbegriff.",loadMore:"Mehr Abzeichen anzeigen",reach:"Erreiche",categories:["Angenommene Fragen","Eingereichte Fragen","Tägliche Serie","Beste richtige Serie","Längste falsche Serie","Sudden Death","3 Herzen","Spielerlevel","Richtige Antworten","Falsche Antworten","50:50 Joker eingesetzt"]},
    es:{back:"← Volver a Qwizzy",eyebrow:"Logros permanentes",headline:"insignias por conseguir.",intro:"Las 1.000 insignias de logros permanentes exactas de Qwizzy, repartidas en once categorías de progreso.",localNote:"Tu lista permanece privada en este navegador y no modifica tu progreso en la app.",checked:"marcadas",open:"pendientes",progress:"progreso",search:"Buscar logros",category:"Todas las categorías",all:"Todas",openButton:"Pendientes",done:"Completadas",results:"logros",emptyTitle:"No hay resultados.",emptyBody:"Prueba otra categoría o término de búsqueda.",loadMore:"Mostrar más insignias",reach:"Alcanza",categories:["Preguntas aceptadas","Preguntas enviadas","Racha diaria","Mejor racha correcta","Mayor racha incorrecta","Muerte súbita","3 Corazones","Nivel de jugador","Respuestas correctas","Respuestas incorrectas","Usos del comodín 50:50"]},
    it:{back:"← Torna a Qwizzy",eyebrow:"Traguardi permanenti",headline:"badge da conquistare.",intro:"I 1.000 badge traguardo permanenti esatti di Qwizzy, suddivisi in undici categorie di progresso.",localNote:"La checklist resta privata in questo browser e non modifica i progressi nell'app.",checked:"spuntati",open:"ancora aperti",progress:"progresso",search:"Cerca traguardi",category:"Tutte le categorie",all:"Tutti",openButton:"Aperti",done:"Completati",results:"traguardi",emptyTitle:"Nessun risultato.",emptyBody:"Prova un'altra categoria o un altro termine di ricerca.",loadMore:"Mostra altri badge",reach:"Raggiungi",categories:["Domande accettate","Domande inviate","Serie giornaliera","Migliore serie corretta","Serie errata più lunga","Sudden Death","3 Cuori","Livello giocatore","Risposte corrette","Risposte errate","Usi del jolly 50:50"]}
  };

  let checked;
  try { checked = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")); } catch { checked = new Set(); }
  const validBadgeIds = new Set(allBadges.map(badge => badge.id));
  checked = new Set([...checked].filter(id => validBadgeIds.has(id)));
  const persistChecked = () => {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify([...checked])); } catch (_) {}
  };
  persistChecked();
  let state={search:"",category:"all",status:"all",visible:PAGE_SIZE};
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
    render();
  }

  function matches(badge) {
    const c=currentCopy();
    const haystack=`${badge.value} ${number(badge.value)} ${c.categories[badge.seriesIndex]}`.toLocaleLowerCase(language);
    return (!state.search||haystack.includes(state.search)) && (state.category==="all"||badge.key===state.category) && (state.status==="all"||(state.status==="done")===checked.has(badge.id));
  }

  function render() {
    const c=currentCopy();
    const filtered=allBadges.filter(matches);
    const shown=filtered.slice(0,state.visible);
    el("badge-grid").innerHTML=shown.map(badge=>{
      const done=checked.has(badge.id); const category=c.categories[badge.seriesIndex];
      return `<article class="web-badge-card${done?" is-done":""}" style="--badge-hue:${badge.hue}" data-id="${badge.id}"><div class="badge-card-top"><span class="badge-card-icon">${badge.icon}</span><button class="badge-card-check" type="button" aria-label="${done?c.done:c.openButton}: ${category} ${badge.value}" aria-pressed="${done}">${done?"✓":""}</button></div><strong class="badge-card-value">${number(badge.value)}</strong><h2 class="badge-card-title">${category}</h2><p class="badge-card-description">${c.reach} ${number(badge.value)}</p><div class="badge-card-foot"><span></span><span class="badge-catalog-number">${badge.catalogNumber}/1000</span><span aria-hidden="true"></span></div></article>`;
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
    persistChecked(); render();
  });
  el("badge-search").addEventListener("input",event=>{state.search=event.target.value.trim().toLocaleLowerCase(language);state.visible=PAGE_SIZE;render();});
  el("category-filter").addEventListener("change",event=>{state.category=event.target.value;state.visible=PAGE_SIZE;render();});
  document.querySelector(".badge-status-filter").addEventListener("click",event=>{const button=event.target.closest("button[data-status]");if(!button)return;state.status=button.dataset.status;state.visible=PAGE_SIZE;document.querySelectorAll("[data-status]").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));render();});
  el("load-more-badges").addEventListener("click",()=>{state.visible+=PAGE_SIZE;render();});
  addEventListener("gdb-language-change",event=>setLanguage(event.detail.language));
  addEventListener("storage",event=>{
    if(event.key!==STORAGE_KEY)return;
    try { checked=new Set(JSON.parse(event.newValue||"[]").filter(id=>validBadgeIds.has(id))); render(); } catch (_) {}
  });
  let saved;
  try { saved=localStorage.getItem("gdb-language"); } catch (_) {}
  saved=saved||navigator.language.slice(0,2);
  setLanguage(saved);
})();
