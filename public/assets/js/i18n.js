/* Lightweight, privacy-friendly localisation. No text leaves the browser. */
const LANGS = ["en", "de", "es", "it"];
const LABELS = { en: "EN", de: "DE", es: "ES", it: "IT" };
const rows = {
  "Home": ["Startseite", "Inicio", "Home"],
  "Products": ["Produkte", "Productos", "Prodotti"],
  "Contact": ["Kontakt", "Contacto", "Contatti"],
  "App Studio": ["App-Studio", "Estudio de apps", "Studio di app"],
  "Independent app studio": ["Unabhängiges App-Studio", "Estudio de apps independiente", "Studio di app indipendente"],
  "Apps worth trying.": ["Apps, die einen Versuch wert sind.", "Apps que vale la pena probar.", "App che vale la pena provare."],
  "Generis Data Base is a one-person studio shipping small, sharp software for macOS, iOS and Android. No bloat, no accounts you didn't ask for — just tools that open fast and do one thing properly.": ["Generis Data Base ist ein Ein-Personen-Studio für kleine, durchdachte Software auf macOS, iOS und Android. Kein Ballast, keine unerwünschten Konten – nur Werkzeuge, die schnell starten und eine Aufgabe richtig erledigen.", "Generis Data Base es un estudio unipersonal que crea software pequeño y preciso para macOS, iOS y Android. Sin funciones innecesarias ni cuentas no solicitadas: solo herramientas rápidas que hacen bien una cosa.", "Generis Data Base è uno studio indipendente che crea software piccolo e mirato per macOS, iOS e Android. Niente funzioni superflue né account indesiderati: solo strumenti veloci che fanno bene una cosa."],
  "Get in touch": ["Kontakt aufnehmen", "Contactar", "Contattaci"],
  "Scroll": ["Scrollen", "Desplazar", "Scorri"],
  "Independent software studio building focused apps for macOS, iOS and Android.": ["Unabhängiges Softwarestudio für fokussierte Apps auf macOS, iOS und Android.", "Estudio de software independiente que crea apps especializadas para macOS, iOS y Android.", "Studio software indipendente che crea app mirate per macOS, iOS e Android."],
  "Studio": ["Studio", "Estudio", "Studio"],
  "Imprint": ["Impressum", "Aviso legal", "Note legali"],
  "Privacy": ["Datenschutz", "Privacidad", "Privacy"],
  "Made in Germany ·": ["Entwickelt in Deutschland ·", "Hecho en Alemania ·", "Realizzato in Germania ·"],
  "Legal notice": ["Rechtliche Hinweise", "Aviso legal", "Note legali"],
  "The catalogue": ["Der Katalog", "El catálogo", "Il catalogo"],
  "In development": ["In Entwicklung", "En desarrollo", "In sviluppo"],
  "In development · macOS": ["In Entwicklung · macOS", "En desarrollo · macOS", "In sviluppo · macOS"],
  "In development · iOS & Android": ["In Entwicklung · iOS & Android", "En desarrollo · iOS y Android", "In sviluppo · iOS e Android"],
  "Available for macOS": ["Für macOS verfügbar", "Disponible para macOS", "Disponibile per macOS"],
  "A multiple-choice quiz app for iOS and Android with a library of roughly": ["Eine Multiple-Choice-Quiz-App für iOS und Android mit einer Bibliothek von rund", "Una app de preguntas para iOS y Android con una biblioteca de unas", "Un'app quiz per iOS e Android con una raccolta di circa"],
  "15,000 questions": ["15.000 Fragen", "15.000 preguntas", "15.000 domande"],
  "spread across 25 categories and five difficulty levels. Every question is written and checked by hand — no scraped trivia dumps.": ["in 25 Kategorien und fünf Schwierigkeitsstufen. Jede Frage wird von Hand geschrieben und geprüft – keine automatisch gesammelten Fragensammlungen.", "repartidas en 25 categorías y cinco niveles de dificultad. Cada pregunta está escrita y revisada a mano, sin recopilaciones automáticas.", "suddivise in 25 categorie e cinque livelli di difficoltà. Ogni domanda è scritta e verificata a mano, senza raccolte automatiche."],
  "◆ 15,000+ hand-written questions": ["◆ Über 15.000 handgeschriebene Fragen", "◆ Más de 15.000 preguntas escritas a mano", "◆ Oltre 15.000 domande scritte a mano"],
  "◆ 25 categories, from geography to internet culture": ["◆ 25 Kategorien, von Geografie bis Internetkultur", "◆ 25 categorías, de geografía a cultura de internet", "◆ 25 categorie, dalla geografia alla cultura di internet"],
  "◆ Five difficulty levels, so it stays fair": ["◆ Fünf Schwierigkeitsstufen für faire Runden", "◆ Cinco niveles de dificultad para partidas equilibradas", "◆ Cinque livelli di difficoltà per partite equilibrate"],
  "◆ Works offline — the whole library ships with the app": ["◆ Funktioniert offline – die gesamte Bibliothek ist in der App", "◆ Funciona sin conexión: toda la biblioteca viene con la app", "◆ Funziona offline: l'intera raccolta è inclusa nell'app"],
  "Explore Qwizzy": ["Qwizzy entdecken", "Descubrir Qwizzy", "Scopri Qwizzy"],
  "Explore Wiksy": ["Wiksy entdecken", "Descubrir Wiksy", "Scopri Wiksy"],
  "Explore BarLingo": ["BarLingo entdecken", "Descubrir BarLingo", "Scopri BarLingo"],
  "Wikipedia without the detour. Hit a global shortcut anywhere in macOS, type a name or a topic, and the article opens in its own floating window — readable, with quick actions to copy a section or open it in your browser.": ["Wikipedia ohne Umweg. Drücke überall in macOS eine globale Tastenkombination, gib einen Namen oder ein Thema ein und der Artikel öffnet sich in einem eigenen schwebenden Fenster – gut lesbar und mit Schnellaktionen zum Kopieren oder Öffnen im Browser.", "Wikipedia sin rodeos. Pulsa un atajo global desde cualquier lugar de macOS, escribe un nombre o tema y el artículo se abre en su propia ventana flotante, con acciones rápidas para copiar una sección o abrirla en el navegador.", "Wikipedia senza deviazioni. Premi una scorciatoia globale ovunque in macOS, digita un nome o un argomento e l'articolo si apre in una finestra mobile, con azioni rapide per copiare una sezione o aprirla nel browser."],
  "◆ Global hotkey from any app": ["◆ Globale Tastenkombination aus jeder App", "◆ Atajo global desde cualquier app", "◆ Scorciatoia globale da qualsiasi app"],
  "◆ Each article opens in its own window": ["◆ Jeder Artikel öffnet sich in einem eigenen Fenster", "◆ Cada artículo se abre en su propia ventana", "◆ Ogni articolo si apre in una finestra separata"],
  "◆ Copy a section or the full article in one click": ["◆ Abschnitt oder ganzen Artikel mit einem Klick kopieren", "◆ Copia una sección o todo el artículo con un clic", "◆ Copia una sezione o l'intero articolo con un clic"],
  "◆ Native, lightweight, launches instantly": ["◆ Nativ, leicht und sofort startbereit", "◆ Nativa, ligera y de inicio inmediato", "◆ Nativa, leggera e immediata"],
  "A native translator that lives in the menu bar and stays out of the way. Press a configurable global shortcut, type or dictate, and translate between 41 languages without an account, API key or setup.": ["Ein nativer Übersetzer in der Menüleiste, der nicht im Weg ist. Drücke eine konfigurierbare globale Tastenkombination, tippe oder diktiere und übersetze zwischen 41 Sprachen – ohne Konto, API-Schlüssel oder Einrichtung.", "Un traductor nativo en la barra de menús que no molesta. Pulsa un atajo global configurable, escribe o dicta y traduce entre 41 idiomas sin cuenta, clave API ni configuración.", "Un traduttore nativo nella barra dei menu che non intralcia. Premi una scorciatoia globale configurabile, scrivi o detta e traduci tra 41 lingue senza account, chiave API o configurazione."],
  "◆ 41 translation languages, including right-to-left support": ["◆ 41 Übersetzungssprachen, inklusive Rechts-nach-links-Unterstützung", "◆ 41 idiomas, incluidos los de escritura de derecha a izquierda", "◆ 41 lingue, incluse quelle da destra a sinistra"],
  "◆ Native dictation and read-aloud on both sides": ["◆ Natives Diktieren und Vorlesen auf beiden Seiten", "◆ Dictado y lectura nativos en ambos lados", "◆ Dettatura e lettura native su entrambi i lati"],
  "◆ 24 interface languages, switchable without restarting": ["◆ 24 Oberflächensprachen, ohne Neustart wechselbar", "◆ 24 idiomas de interfaz, sin reiniciar", "◆ 24 lingue dell'interfaccia, senza riavvio"],
  "◆ Custom window, glass effect, colours and animations": ["◆ Anpassbares Fenster, Glaseffekt, Farben und Animationen", "◆ Ventana, efecto de cristal, colores y animaciones personalizables", "◆ Finestra, effetto vetro, colori e animazioni personalizzabili"],
  "Say hello": ["Sag Hallo", "Saluda", "Scrivici"],
  "Get in touch.": ["Nimm Kontakt auf.", "Ponte en contacto.", "Contattaci."],
  "Bug report, feature request, beta access, or a question about one of the apps — it all lands in the same inbox, and that inbox belongs to the person who writes the code.": ["Fehlermeldung, Funktionswunsch, Beta-Zugang oder eine Frage zu einer App – alles landet im selben Postfach, direkt bei der Person, die den Code schreibt.", "Un error, una sugerencia, acceso beta o una pregunta sobre una app: todo llega al mismo buzón, el de la persona que escribe el código.", "Segnalazioni, richieste di funzioni, accesso beta o domande sulle app: tutto arriva nella stessa casella, gestita da chi scrive il codice."],
  "Message sent.": ["Nachricht gesendet.", "Mensaje enviado.", "Messaggio inviato."],
  "Thanks — you'll get a reply at the address you gave, usually within a couple of days.": ["Danke – normalerweise erhältst du innerhalb weniger Tage eine Antwort an die angegebene Adresse.", "Gracias. Normalmente recibirás una respuesta en la dirección indicada en un par de días.", "Grazie. Di solito riceverai una risposta all'indirizzo indicato entro un paio di giorni."],
  "Back to the home page": ["Zurück zur Startseite", "Volver al inicio", "Torna alla home"],
  "Write another message": ["Weitere Nachricht schreiben", "Escribir otro mensaje", "Scrivi un altro messaggio"],
  "Your name": ["Dein Name", "Tu nombre", "Il tuo nome"],
  "Your email": ["Deine E-Mail-Adresse", "Tu correo electrónico", "La tua e-mail"],
  "What is it about?": ["Worum geht es?", "¿De qué se trata?", "Di cosa si tratta?"],
  "General": ["Allgemein", "General", "Generale"],
  "Bug report": ["Fehlermeldung", "Informe de error", "Segnalazione di errore"],
  "Feature request": ["Funktionswunsch", "Sugerencia", "Richiesta di funzione"],
  "Business": ["Geschäftlich", "Negocios", "Affari"],
  "Your message": ["Deine Nachricht", "Tu mensaje", "Il tuo messaggio"],
  "/ 4000 characters": ["/ 4000 Zeichen", "/ 4000 caracteres", "/ 4000 caratteri"],
  "Send message": ["Nachricht senden", "Enviar mensaje", "Invia messaggio"],
  "Send this message by email instead": ["Stattdessen per E-Mail senden", "Enviar por correo electrónico", "Invia invece via e-mail"],
  "What to expect": ["Was dich erwartet", "Qué puedes esperar", "Cosa aspettarsi"],
  "◆ A real reply, written by a human": ["◆ Eine echte, persönlich geschriebene Antwort", "◆ Una respuesta real, escrita por una persona", "◆ Una risposta reale, scritta da una persona"],
  "◆ Usually within two or three days": ["◆ Normalerweise innerhalb von zwei bis drei Tagen", "◆ Normalmente en dos o tres días", "◆ Di solito entro due o tre giorni"],
  "◆ No newsletter, no follow-up marketing": ["◆ Kein Newsletter und kein nachträgliches Marketing", "◆ Sin boletín ni marketing posterior", "◆ Nessuna newsletter o marketing successivo"],
  "Reporting a bug?": ["Du meldest einen Fehler?", "¿Quieres informar de un error?", "Vuoi segnalare un errore?"],
  "Which app, which version of macOS, iOS or Android, and what you did right before it went wrong. That trio solves most of them.": ["Nenne die App, die macOS-, iOS- oder Android-Version und was du unmittelbar vor dem Fehler getan hast. Diese drei Angaben lösen die meisten Fälle.", "Indica la app, la versión de macOS, iOS o Android y qué hiciste justo antes del error. Esos tres datos resuelven la mayoría de los casos.", "Indica l'app, la versione di macOS, iOS o Android e cosa hai fatto subito prima del problema. Queste tre informazioni risolvono la maggior parte dei casi."],
  "View on GitHub": ["Auf GitHub ansehen", "Ver en GitHub", "Vedi su GitHub"],
  "Open source": ["Open Source", "Código abierto", "Open source"],
  "MIT licensed": ["MIT-lizenziert", "Licencia MIT", "Licenza MIT"],
  "Your shortcut, anywhere": ["Deine Tastenkombination, überall", "Tu atajo, en cualquier lugar", "La tua scorciatoia, ovunque"],
  "Native and private": ["Nativ und privat", "Nativa y privada", "Nativa e privata"],
  "Every article, its own window": ["Jeder Artikel in seinem eigenen Fenster", "Cada artículo en su propia ventana", "Ogni articolo nella propria finestra"],
  "Read it properly, then move on.": ["In Ruhe lesen und direkt weitermachen.", "Léelo con calma y sigue adelante.", "Leggilo con calma e continua."],
  "One at a time, or several": ["Einer oder mehrere zugleich", "Uno o varios a la vez", "Uno o più alla volta"],
  "Make it yours": ["Mach es zu deinem", "Hazlo tuyo", "Personalizzalo"],
  "Start to finish": ["Von Anfang bis Ende", "De principio a fin", "Dall'inizio alla fine"],
  "How it works.": ["So funktioniert es.", "Cómo funciona.", "Come funziona."],
  "Press the shortcut": ["Tastenkombination drücken", "Pulsa el atajo", "Premi la scorciatoia"],
  "Type a name or topic": ["Name oder Thema eingeben", "Escribe un nombre o tema", "Digita un nome o argomento"],
  "It opens in its own window": ["Es öffnet sich im eigenen Fenster", "Se abre en su propia ventana", "Si apre nella propria finestra"],
  "Private by design": ["Von Grund auf privat", "Privada por diseño", "Privacy fin dalla progettazione"],
  "Search without being profiled.": ["Suchen ohne Profilbildung.", "Busca sin crear perfiles.", "Cerca senza profilazione."],
  "A minimalist native translator that lives in the menu bar. Press one shortcut, type or dictate, and get the translation without leaving the app you are working in.": ["Ein minimalistischer nativer Übersetzer in der Menüleiste. Drücke eine Tastenkombination, tippe oder diktiere und erhalte die Übersetzung, ohne deine aktuelle App zu verlassen.", "Un traductor nativo y minimalista en la barra de menús. Pulsa un atajo, escribe o dicta y obtén la traducción sin salir de la app actual.", "Un traduttore nativo e minimalista nella barra dei menu. Premi una scorciatoia, scrivi o detta e ottieni la traduzione senza lasciare l'app corrente."],
  "Translation languages": ["Übersetzungssprachen", "Idiomas de traducción", "Lingue di traduzione"],
  "Interface languages": ["Oberflächensprachen", "Idiomas de interfaz", "Lingue dell'interfaccia"],
  "Opening animations": ["Öffnungsanimationen", "Animaciones de apertura", "Animazioni di apertura"],
  "Minimum macOS version": ["Minimale macOS-Version", "Versión mínima de macOS", "Versione minima di macOS"],
  "Translate without the detour": ["Übersetzen ohne Umweg", "Traduce sin rodeos", "Traduci senza deviazioni"],
  "One shortcut. Two panes. Done.": ["Eine Tastenkombination. Zwei Bereiche. Fertig.", "Un atajo. Dos paneles. Listo.", "Una scorciatoia. Due pannelli. Fatto."],
  "Speak and listen": ["Sprechen und zuhören", "Habla y escucha", "Parla e ascolta"],
  "Dictate it. Hear it back.": ["Diktieren und anhören.", "Dicta y escúchalo.", "Detta e riascolta."],
  "Fits your language and your desktop.": ["Passt zu deiner Sprache und deinem Desktop.", "Se adapta a tu idioma y escritorio.", "Si adatta alla tua lingua e al desktop."],
  "More than translation": ["Mehr als Übersetzen", "Más que traducción", "Più di una traduzione"],
  "Small details that keep you moving.": ["Kleine Details für einen flüssigen Ablauf.", "Pequeños detalles que agilizan tu trabajo.", "Piccoli dettagli che rendono il lavoro più fluido."],
  "Ready immediately": ["Sofort einsatzbereit", "Lista al instante", "Subito pronta"],
  "Your keyboard, your way": ["Deine Tastatur, deine Regeln", "Tu teclado, a tu manera", "La tua tastiera, a modo tuo"],
  "Accessible throughout": ["Durchgehend barrierefrei", "Accesible en todo momento", "Accessibile ovunque"],
  "No account. No profiling.": ["Kein Konto. Keine Profilbildung.", "Sin cuenta. Sin perfiles.", "Nessun account. Nessuna profilazione."],
  "A multiple-choice quiz app with a hand-written question library, sorted into 25 categories and five difficulty levels — so the difficulty rating actually means something.": ["Eine Multiple-Choice-Quiz-App mit handgeschriebenen Fragen in 25 Kategorien und fünf Schwierigkeitsstufen – damit die Schwierigkeitsangabe wirklich etwas bedeutet.", "Una app de preguntas con una biblioteca escrita a mano, organizada en 25 categorías y cinco niveles de dificultad para que la valoración sea realmente útil.", "Un'app quiz con domande scritte a mano, organizzate in 25 categorie e cinque livelli di difficoltà, così la valutazione ha davvero senso."],
  "Built for every kind of quiz night": ["Für jeden Quizabend gemacht", "Para todo tipo de noche de preguntas", "Per ogni tipo di serata quiz"],
  "One question library. Many ways to play.": ["Eine Fragenbibliothek. Viele Spielmöglichkeiten.", "Una biblioteca. Muchas formas de jugar.", "Una raccolta. Tanti modi di giocare."],
  "Five game modes": ["Fünf Spielmodi", "Cinco modos de juego", "Cinque modalità di gioco"],
  "Pick the mood.": ["Wähle die passende Stimmung.", "Elige el ambiente.", "Scegli l'atmosfera."],
  "Play anywhere": ["Überall spielen", "Juega en cualquier lugar", "Gioca ovunque"],
  "Challenge a friend.": ["Fordere jemanden heraus.", "Desafía a un amigo.", "Sfida un amico."],
  "Your quiz. Your look.": ["Dein Quiz. Dein Stil.", "Tu quiz. Tu estilo.", "Il tuo quiz. Il tuo stile."],
  "Questions in the library": ["Fragen in der Bibliothek", "Preguntas en la biblioteca", "Domande nella raccolta"],
  "Categories": ["Kategorien", "Categorías", "Categorie"],
  "Difficulty levels": ["Schwierigkeitsstufen", "Niveles de dificultad", "Livelli di difficoltà"],
  "Platforms at launch": ["Plattformen zum Start", "Plataformas en el lanzamiento", "Piattaforme al lancio"],
  "This page does not exist. It may have been moved or renamed.": ["Diese Seite existiert nicht. Möglicherweise wurde sie verschoben oder umbenannt.", "Esta página no existe. Puede que se haya movido o cambiado de nombre.", "Questa pagina non esiste. Potrebbe essere stata spostata o rinominata."],
  "See the products": ["Produkte ansehen", "Ver los productos", "Scopri i prodotti"]
};

const dictionaries = Object.fromEntries(LANGS.slice(1).map((lang, i) => [lang, Object.fromEntries(Object.entries(rows).map(([key, values]) => [key, values[i]]))]));
const sensitivePage = /\/(imprint|privacy|qwizzy-account-deletion)(?:\.html)?\/?$/.test(location.pathname);
const originalText = new WeakMap();
const originalAttrs = new WeakMap();

function translateNode(node, dict) {
  if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  const source = originalText.get(node);
  const clean = source.trim();
  if (!clean || !dict[clean]) { node.nodeValue = source; return; }
  node.nodeValue = source.replace(clean, dict[clean]);
}

function applyLanguage(lang) {
  if (!LANGS.includes(lang)) lang = "en";
  const dict = dictionaries[lang] || {};
  document.documentElement.lang = lang;
  document.querySelectorAll(".language-select").forEach((el) => { el.value = lang; });
  document.querySelectorAll(".reveal-words").forEach((el) => {
    if (!el.dataset.i18nSource) el.dataset.i18nSource = el.textContent.trim();
    const source = el.dataset.i18nSource;
    el.textContent = dict[source] || source;
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,svg,.reveal-words,[data-i18n-keep-english]")) continue;
    translateNode(node, dict);
  }
  document.querySelectorAll("[placeholder],[aria-label],[title]").forEach((el) => {
    if (el.closest("[data-i18n-keep-english]")) return;
    if (!originalAttrs.has(el)) originalAttrs.set(el, Object.fromEntries(["placeholder","aria-label","title"].filter(a => el.hasAttribute(a)).map(a => [a, el.getAttribute(a)])));
    for (const [attr, source] of Object.entries(originalAttrs.get(el))) el.setAttribute(attr, dict[source] || source);
  });
  if (!sensitivePage) document.title = dict[document.title] || document.title;
  window.dispatchEvent(new CustomEvent("gdb-language-change", { detail: { language: lang } }));
}

function preferredLanguage() {
  const saved = localStorage.getItem("gdb-language");
  if (LANGS.includes(saved)) return saved;
  for (const locale of navigator.languages || [navigator.language]) {
    const lang = String(locale || "").toLowerCase().split("-")[0];
    if (LANGS.includes(lang)) return lang;
  }
  return "en";
}

function addSelector() {
  const wrap = document.createElement("label");
  wrap.className = "language-picker";
  wrap.setAttribute("aria-label", "Language");
  const select = document.createElement("select");
  select.className = "language-select";
  select.setAttribute("aria-label", "Language");
  for (const lang of LANGS) {
    const option = document.createElement("option");
    option.value = lang; option.textContent = LABELS[lang];
    select.appendChild(option);
  }
  select.addEventListener("change", () => {
    localStorage.setItem("gdb-language", select.value);
    applyLanguage(select.value);
  });
  wrap.appendChild(select);
  const tools = document.querySelector(".head-tools");
  if (tools) tools.prepend(wrap);
  else { wrap.classList.add("language-picker-floating"); document.body.appendChild(wrap); }
}

// Legal/privacy and account-deletion content intentionally remains English.
if (sensitivePage) document.querySelector("main")?.setAttribute("data-i18n-keep-english", "");
document.querySelector("#privacy")?.setAttribute("data-i18n-keep-english", "");
document.querySelector("#account-deletion")?.setAttribute("data-i18n-keep-english", "");
addSelector();
applyLanguage(preferredLanguage());
