/* Lightweight, privacy-friendly localisation. No text leaves the browser. */
const LANGS = ["en", "de", "es", "it"];
const LABELS = { en: "EN", de: "DE", es: "ES", it: "IT" };
const LANGUAGE_NAMES = { en: "English", de: "Deutsch", es: "Español", it: "Italiano" };
const FLAGS = { en: "🇬🇧", de: "🇩🇪", es: "🇪🇸", it: "🇮🇹" };
const rows = {
  "Home": ["Startseite", "Inicio", "Home"],
  "Products": ["Produkte", "Productos", "Prodotti"],
  "Contact": ["Kontakt", "Contacto", "Contatti"],
  "App Studio": ["App-Studio", "Estudio de apps", "Studio di app"],
  "Independent app studio": ["Unabhängiges App-Studio", "Estudio de apps independiente", "Studio di app indipendente"],
  "Apps worth trying.": ["Apps, die einen Versuch wert sind.", "Apps que vale la pena probar.", "App che vale la pena provare."],
  "Generis Data Base is a one-person studio shipping small, sharp software for macOS, iOS and Android. No bloat, no accounts you didn't ask for — just tools that open fast and do one thing properly.": ["Generis Data Base ist ein Ein-Personen-Studio für kleine, durchdachte Software auf macOS, iOS und Android. Kein Ballast, keine unerwünschten Konten – nur Werkzeuge, die schnell starten und eine Aufgabe richtig erledigen.", "Generis Data Base es un estudio unipersonal que crea software pequeño y preciso para macOS, iOS y Android. Sin funciones innecesarias ni cuentas no solicitadas: solo herramientas rápidas que hacen bien una cosa.", "Generis Data Base è uno studio indipendente che crea software piccolo e mirato per macOS, iOS e Android. Niente funzioni superflue né account indesiderati: solo strumenti veloci che fanno bene una cosa."],
  "Get in touch": ["Kontakt aufnehmen", "Contactar", "Contattaci"],
  "Explore 1,000 badges": ["1.000 Abzeichen entdecken", "Descubrir 1.000 insignias", "Scopri 1.000 badge"],
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
  "Tell me what's on your mind…": ["Schreib mir, worum es geht …", "Cuéntame en qué estás pensando…", "Scrivi ciò che hai in mente…"],
  "Leave this empty": ["Dieses Feld leer lassen", "Deja este campo vacío", "Lascia vuoto questo campo"],
  "Toggle colour theme": ["Farbschema wechseln", "Cambiar tema de color", "Cambia tema colore"],
  "Open menu": ["Menü öffnen", "Abrir menú", "Apri menu"],
  "Choose language": ["Sprache auswählen", "Elegir idioma", "Scegli lingua"],
  "Generis Data Base — home": ["Generis Data Base – Startseite", "Generis Data Base — inicio", "Generis Data Base – home"],

  "A configurable global hotkey opens Wiksy from inside any app — no need to switch to a browser first.": ["Eine frei wählbare globale Tastenkombination öffnet Wiksy aus jeder App heraus – ohne zuerst zum Browser wechseln zu müssen.", "Un atajo global configurable abre Wiksy desde cualquier aplicación, sin tener que cambiar primero al navegador.", "Una scorciatoia globale configurabile apre Wiksy da qualsiasi app, senza dover prima passare al browser."],
  "180+ Wikipedia languages": ["Über 180 Wikipedia-Sprachen", "Más de 180 idiomas de Wikipedia", "Oltre 180 lingue di Wikipedia"],
  "Choose the Wikipedia language you use. Search and article results follow that selection.": ["Wähle deine Wikipedia-Sprache. Suchergebnisse und Artikel folgen automatisch dieser Auswahl.", "Elige el idioma de Wikipedia que utilizas. Los resultados de búsqueda y los artículos seguirán esa selección.", "Scegli la lingua di Wikipedia che utilizzi. I risultati di ricerca e gli articoli seguiranno la selezione."],
  "Four windows or one": ["Vier Fenster oder eines", "Cuatro ventanas o una", "Quattro finestre o una"],
  "Use up to four fixed-corner article windows, or switch to one large reusable reading window.": ["Nutze bis zu vier Artikelfenster in festen Bildschirmecken oder ein einziges großes, wiederverwendbares Lesefenster.", "Utiliza hasta cuatro ventanas de artículos en esquinas fijas o una única ventana de lectura grande y reutilizable.", "Usa fino a quattro finestre per gli articoli negli angoli dello schermo oppure un'unica grande finestra di lettura riutilizzabile."],
  "Built natively for macOS, without advertising or analytics SDKs, and ready when you need it.": ["Nativ für macOS entwickelt, ohne Werbung oder Analyse-SDKs – und sofort bereit, wenn du es brauchst.", "Desarrollada de forma nativa para macOS, sin publicidad ni SDK de análisis, y lista cuando la necesites.", "Sviluppata nativamente per macOS, senza pubblicità né SDK di analisi, e pronta quando serve."],
  "Each article opens in a focused Wikipedia reader with its own text size, width and light or dark reading options. A quick action bar lets you copy the current section, a sub-heading or the full article, reload it, open it in your chosen browser, or close the window and get back to work.": ["Jeder Artikel öffnet sich in einem übersichtlichen Wikipedia-Reader mit eigener Textgröße, Breite sowie hellem oder dunklem Lesemodus. Über die Schnellleiste kannst du den aktuellen Abschnitt, eine Unterüberschrift oder den ganzen Artikel kopieren, neu laden, im gewählten Browser öffnen oder das Fenster schließen und direkt weiterarbeiten.", "Cada artículo se abre en un lector de Wikipedia específico con tamaño de texto, anchura y modo de lectura claro u oscuro. Una barra de acciones rápidas permite copiar la sección actual, un subtítulo o el artículo completo, recargarlo, abrirlo en el navegador elegido o cerrar la ventana y seguir trabajando.", "Ogni articolo si apre in un lettore Wikipedia dedicato, con dimensione del testo, larghezza e modalità chiara o scura. Una barra rapida permette di copiare la sezione corrente, un sottotitolo o l'intero articolo, ricaricarlo, aprirlo nel browser scelto oppure chiudere la finestra e tornare al lavoro."],
  "Four corners, or one large window.": ["Vier Ecken oder ein großes Fenster.", "Cuatro esquinas o una ventana grande.", "Quattro angoli oppure una finestra grande."],
  "Keep up to four articles open at once, each anchored to its own screen corner and closed independently. Prefer more room? Single large window mode reuses one generous reader for every new search.": ["Halte bis zu vier Artikel gleichzeitig offen, jeweils in einer eigenen Bildschirmecke und unabhängig schließbar. Du brauchst mehr Platz? Im Modus mit einem großen Fenster wird derselbe großzügige Reader für jede neue Suche verwendet.", "Mantén abiertos hasta cuatro artículos a la vez, cada uno anclado a una esquina y con cierre independiente. ¿Prefieres más espacio? El modo de ventana grande reutiliza un lector amplio para cada búsqueda nueva.", "Tieni aperti fino a quattro articoli, ciascuno ancorato a un angolo e chiudibile separatamente. Preferisci più spazio? La modalità a finestra grande riutilizza lo stesso ampio lettore per ogni nuova ricerca."],
  "Fits your screen and your workflow.": ["Passt zu deinem Bildschirm und deinem Arbeitsablauf.", "Se adapta a tu pantalla y a tu forma de trabajar.", "Si adatta allo schermo e al tuo flusso di lavoro."],
  "Wiksy stays simple when you use it, but gives you control over how it appears and behaves.": ["Wiksy bleibt in der Bedienung einfach und gibt dir trotzdem Kontrolle über Aussehen und Verhalten.", "Wiksy sigue siendo sencillo de usar, pero te permite controlar su aspecto y comportamiento.", "Wiksy resta semplice da usare, ma ti lascia il controllo su aspetto e comportamento."],
  "Place it precisely": ["Präzise platzieren", "Colócala con precisión", "Posizionala con precisione"],
  "Use a preset — including placement beneath the MacBook notch — or set a custom position and size for the search panel and article windows.": ["Nutze eine Voreinstellung – auch direkt unter der MacBook-Notch – oder lege Position und Größe von Suchfeld und Artikelfenstern selbst fest.", "Usa una posición predefinida, incluida la ubicación bajo la muesca del MacBook, o configura la posición y el tamaño del buscador y las ventanas de artículos.", "Usa una posizione predefinita, anche sotto il notch del MacBook, oppure imposta posizione e dimensioni personalizzate per la ricerca e le finestre degli articoli."],
  "Choose the appearance": ["Darstellung wählen", "Elige la apariencia", "Scegli l'aspetto"],
  "Switch between standard and Liquid Glass styles, then tune transparency and glass intensity to suit your desktop.": ["Wechsle zwischen Standard- und Liquid-Glass-Stil und passe Transparenz und Glasintensität an deinen Desktop an.", "Cambia entre los estilos estándar y Liquid Glass y ajusta la transparencia y la intensidad del cristal a tu escritorio.", "Passa dallo stile standard a Liquid Glass e regola trasparenza e intensità del vetro in base al desktop."],
  "Choose the motion": ["Animation wählen", "Elige el movimiento", "Scegli il movimento"],
  "Select from eleven opening animations, randomise them on each launch and adjust their speed — or keep things restrained.": ["Wähle aus elf Öffnungsanimationen, lass sie bei jedem Start wechseln und passe die Geschwindigkeit an – oder halte alles ganz dezent.", "Elige entre once animaciones de apertura, altérnalas al iniciar y ajusta su velocidad, o mantén un estilo discreto.", "Scegli tra undici animazioni di apertura, rendile casuali a ogni avvio e regolane la velocità, oppure mantieni uno stile sobrio."],
  "Trigger Wiksy from anywhere in macOS with one key combination — no window to find, no app to switch to first.": ["Starte Wiksy überall in macOS mit einer Tastenkombination – ohne ein Fenster suchen oder zuerst die App wechseln zu müssen.", "Activa Wiksy desde cualquier lugar de macOS con una combinación de teclas, sin buscar ventanas ni cambiar antes de aplicación.", "Avvia Wiksy ovunque in macOS con una combinazione di tasti, senza cercare finestre né cambiare prima applicazione."],
  "The floating search bar takes whatever you're looking for — a person, a place, an event.": ["Die schwebende Suchleiste findet, wonach du suchst – eine Person, einen Ort oder ein Ereignis.", "La barra de búsqueda flotante acepta cualquier consulta: una persona, un lugar o un acontecimiento.", "La barra di ricerca mobile accetta qualsiasi cosa tu stia cercando: una persona, un luogo o un evento."],
  "Read it, copy a section or the full article, open it in your browser, or close it — the next search uses the next free corner, or replaces the article when single large window mode is enabled.": ["Lies den Artikel, kopiere einen Abschnitt oder den ganzen Text, öffne ihn im Browser oder schließe ihn. Die nächste Suche nutzt die nächste freie Ecke oder ersetzt im großen Einzelmodus den aktuellen Artikel.", "Lee el artículo, copia una sección o el texto completo, ábrelo en el navegador o ciérralo. La siguiente búsqueda ocupará la próxima esquina libre o sustituirá el artículo en el modo de ventana grande.", "Leggi l'articolo, copia una sezione o il testo completo, aprilo nel browser oppure chiudilo. La ricerca successiva usa il prossimo angolo libero o sostituisce l'articolo nella modalità a finestra grande."],
  "Wiksy sends your search term only to the public Wikipedia API for the language you selected. There are no analytics or advertising SDKs.": ["Wiksy sendet deinen Suchbegriff ausschließlich an die öffentliche Wikipedia-API der gewählten Sprache. Analyse- oder Werbe-SDKs gibt es nicht.", "Wiksy envía tu búsqueda únicamente a la API pública de Wikipedia del idioma elegido. No incluye SDK de análisis ni publicidad.", "Wiksy invia il termine cercato esclusivamente all'API pubblica di Wikipedia per la lingua scelta. Non include SDK di analisi o pubblicità."],
  "Article windows use a non-persistent web session.": ["Artikelfenster verwenden eine nicht dauerhafte Websitzung.", "Las ventanas de artículos usan una sesión web no persistente.", "Le finestre degli articoli usano una sessione web non persistente."],
  "Preferences remain locally on your Mac.": ["Einstellungen bleiben lokal auf deinem Mac.", "Las preferencias permanecen en tu Mac.", "Le preferenze restano sul Mac."],
  "Clipboard access is used only when you copy article text.": ["Auf die Zwischenablage wird nur beim Kopieren von Artikeltext zugegriffen.", "El portapapeles solo se utiliza cuando copias texto de un artículo.", "Gli appunti vengono usati solo quando copi il testo di un articolo."],
  "Global shortcuts require macOS Accessibility permission.": ["Globale Tastenkombinationen benötigen die Bedienungshilfen-Berechtigung von macOS.", "Los atajos globales requieren el permiso de Accesibilidad de macOS.", "Le scorciatoie globali richiedono il permesso Accessibilità di macOS."],
  "BarLingo stays in the menu bar with no Dock icon by default. The configurable global shortcut opens a floating two-pane translator; swap languages, paste or type, then copy the result and return to your work.": ["BarLingo bleibt standardmäßig ohne Dock-Symbol in der Menüleiste. Die frei wählbare globale Tastenkombination öffnet einen schwebenden Übersetzer mit zwei Bereichen: Sprachen tauschen, Text einfügen oder eingeben, Ergebnis kopieren und weiterarbeiten.", "BarLingo permanece en la barra de menús y, por defecto, no muestra icono en el Dock. El atajo global configurable abre un traductor flotante con dos paneles: cambia los idiomas, pega o escribe, copia el resultado y vuelve al trabajo.", "BarLingo resta nella barra dei menu e, per impostazione predefinita, non mostra icone nel Dock. La scorciatoia globale configurabile apre un traduttore mobile a due pannelli: cambia le lingue, incolla o scrivi, copia il risultato e torna al lavoro."],
  "Use native macOS dictation for the source text and read either side aloud with independently selected voices. Keyboard shortcuts keep dictation, clearing, reading and copying within reach.": ["Nutze die native macOS-Diktierfunktion für den Ausgangstext und lass beide Seiten mit getrennt wählbaren Stimmen vorlesen. Tastenkürzel machen Diktieren, Löschen, Vorlesen und Kopieren jederzeit erreichbar.", "Usa el dictado nativo de macOS para el texto original y escucha ambos lados con voces elegidas por separado. Los atajos mantienen al alcance el dictado, borrado, lectura y copiado.", "Usa la dettatura nativa di macOS per il testo di partenza e ascolta entrambi i lati con voci selezionabili separatamente. Le scorciatoie rendono immediati dettatura, cancellazione, lettura e copia."],
  "Choose from 41 translation languages with right-to-left support and use the interface in 24 languages. Adjust position, size, transparency, glass intensity, colour scheme and opening animation — all without restarting.": ["Wähle aus 41 Übersetzungssprachen mit Rechts-nach-links-Unterstützung und nutze die Oberfläche in 24 Sprachen. Position, Größe, Transparenz, Glasintensität, Farbschema und Öffnungsanimation lassen sich ohne Neustart anpassen.", "Elige entre 41 idiomas de traducción, incluidos los de derecha a izquierda, y usa la interfaz en 24 idiomas. Ajusta posición, tamaño, transparencia, intensidad del cristal, colores y animación de apertura sin reiniciar.", "Scegli tra 41 lingue di traduzione, incluse quelle da destra a sinistra, e usa l'interfaccia in 24 lingue. Regola posizione, dimensioni, trasparenza, intensità del vetro, colori e animazione di apertura senza riavviare."],
  "No registration or API key. Google’s public translation endpoint is used first, with MyMemory as an automatic fallback.": ["Keine Registrierung und kein API-Schlüssel. Zuerst wird Googles öffentlicher Übersetzungsdienst verwendet, MyMemory dient automatisch als Ausweichlösung.", "Sin registro ni clave API. Primero se utiliza el servicio público de traducción de Google y MyMemory actúa como alternativa automática.", "Nessuna registrazione o chiave API. Viene usato prima il servizio pubblico di traduzione di Google, con MyMemory come alternativa automatica."],
  "Configure the show-and-hide shortcut and optionally switch to a chosen keyboard input source when the window opens.": ["Lege die Tastenkombination zum Ein- und Ausblenden fest und wechsle beim Öffnen des Fensters auf Wunsch automatisch zu einer ausgewählten Eingabequelle.", "Configura el atajo para mostrar y ocultar la ventana y, si quieres, cambia automáticamente a una fuente de entrada del teclado al abrirla.", "Configura la scorciatoia per mostrare e nascondere la finestra e, se vuoi, passa automaticamente a una sorgente di input della tastiera quando si apre."],
  "VoiceOver, keyboard navigation and localized spoken examples are supported across all 24 interface languages.": ["VoiceOver, Tastaturnavigation und lokalisierte gesprochene Beispiele werden in allen 24 Oberflächensprachen unterstützt.", "VoiceOver, la navegación por teclado y los ejemplos hablados localizados son compatibles con los 24 idiomas de la interfaz.", "VoiceOver, la navigazione da tastiera e gli esempi vocali localizzati sono supportati in tutte le 24 lingue dell'interfaccia."],
  "BarLingo has no analytics or advertising SDKs and no remote backend of its own. Only the text being translated is sent to the translation provider over HTTPS.": ["BarLingo enthält weder Analyse- oder Werbe-SDKs noch ein eigenes externes Backend. Nur der zu übersetzende Text wird verschlüsselt per HTTPS an den Übersetzungsanbieter gesendet.", "BarLingo no incluye SDK de análisis o publicidad ni dispone de un servidor remoto propio. Solo el texto que se traduce se envía al proveedor mediante HTTPS.", "BarLingo non include SDK di analisi o pubblicità e non dispone di un backend remoto proprio. Solo il testo da tradurre viene inviato al fornitore tramite HTTPS."],
  "Local preferences remain on your Mac.": ["Lokale Einstellungen bleiben auf deinem Mac.", "Las preferencias locales permanecen en tu Mac.", "Le preferenze locali restano sul Mac."],
  "Microphone and speech recognition are used only for dictation.": ["Mikrofon und Spracherkennung werden nur zum Diktieren verwendet.", "El micrófono y el reconocimiento de voz solo se usan para el dictado.", "Microfono e riconoscimento vocale vengono usati solo per la dettatura."],
  "Clipboard access is limited to paste and copy actions.": ["Der Zugriff auf die Zwischenablage ist auf Einfügen und Kopieren beschränkt.", "El acceso al portapapeles se limita a pegar y copiar.", "L'accesso agli appunti è limitato alle azioni Incolla e Copia."],
  "Global shortcuts do not require Accessibility permission.": ["Globale Tastenkombinationen benötigen keine Bedienungshilfen-Berechtigung.", "Los atajos globales no requieren el permiso de Accesibilidad.", "Le scorciatoie globali non richiedono il permesso Accessibilità."],
  "Play at your own pace, pass one phone around the room or challenge a friend online. Qwizzy keeps the rules simple and puts the questions first.": ["Spiele in deinem eigenen Tempo, reiche ein Smartphone durch die Runde oder fordere online jemanden heraus. Qwizzy hält die Regeln einfach und stellt die Fragen in den Mittelpunkt.", "Juega a tu ritmo, pasa un teléfono por la sala o desafía a un amigo en línea. Qwizzy mantiene reglas sencillas y pone las preguntas en primer plano.", "Gioca al tuo ritmo, passa uno smartphone tra i partecipanti oppure sfida un amico online. Qwizzy mantiene semplici le regole e mette al centro le domande."],
  "Classic for an endless run, Sudden Death when every answer counts, 3 Hearts for a little breathing room, plus local and online duels.": ["Classic für eine endlose Runde, Sudden Death, wenn jede Antwort zählt, 3 Hearts für etwas Spielraum sowie lokale und Online-Duelle.", "Classic para una partida sin fin, Sudden Death cuando cada respuesta cuenta, 3 Hearts para tener algo de margen y duelos locales y en línea.", "Classic per una partita senza fine, Sudden Death quando ogni risposta conta, 3 Hearts per avere un po' di margine, oltre ai duelli locali e online."],
  "Start an online duel with a code, find a random opponent or continue an open round whenever it suits you.": ["Starte ein Online-Duell mit einem Code, finde einen zufälligen Gegner oder setze eine offene Runde fort, wann immer es für dich passt.", "Inicia un duelo en línea con un código, encuentra un rival al azar o continúa una ronda abierta cuando te venga bien.", "Avvia un duello online con un codice, trova un avversario casuale oppure continua una partita aperta quando preferisci."],
  "Choose colours, arrange the game balloons, switch appearance and language, and decide which categories belong in your round.": ["Wähle Farben, ordne die Spielballons an, ändere Darstellung und Sprache und entscheide, welche Kategorien in deine Runde gehören.", "Elige colores, organiza los globos del juego, cambia la apariencia y el idioma y decide qué categorías formarán parte de la ronda.", "Scegli i colori, disponi i palloncini di gioco, cambia aspetto e lingua e decidi quali categorie includere nella partita."],
  "See the products": ["Produkte ansehen", "Ver los productos", "Scopri i prodotti"]
};

const dictionaries = Object.fromEntries(LANGS.slice(1).map((lang, i) => [lang, Object.fromEntries(Object.entries(rows).map(([key, values]) => [key, values[i]]))]));
const sensitivePage = /\/(imprint|privacy|qwizzy-account-deletion)(?:\.html)?\/?$/.test(location.pathname);
const originalText = new WeakMap();
const originalAttrs = new WeakMap();

function translateNode(node, dict) {
  if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  const source = originalText.get(node);
  const clean = source.trim().replace(/\s+/g, " ");
  if (!clean || !dict[clean]) { node.nodeValue = source; return; }
  const leading = source.match(/^\s*/)?.[0] || "";
  const trailing = source.match(/\s*$/)?.[0] || "";
  node.nodeValue = `${leading}${dict[clean]}${trailing}`;
}

function applyLanguage(lang) {
  if (!LANGS.includes(lang)) lang = "en";
  const dict = dictionaries[lang] || {};
  document.documentElement.lang = lang;
  document.querySelectorAll(".language-picker").forEach((picker) => {
    picker.querySelector(".language-current-flag").textContent = FLAGS[lang];
    picker.querySelector(".language-current-code").textContent = LABELS[lang];
    picker.querySelectorAll(".language-option").forEach((option) => option.setAttribute("aria-checked", String(option.dataset.lang === lang)));
  });
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
  const wrap = document.createElement("div");
  wrap.className = "language-picker";
  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "language-trigger";
  trigger.setAttribute("aria-label", "Choose language");
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-expanded", "false");
  trigger.innerHTML = `<span class="language-flag language-current-flag" aria-hidden="true"></span><span class="language-current-code"></span><svg class="language-chevron" viewBox="0 0 10 6" aria-hidden="true"><path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const menu = document.createElement("div");
  menu.className = "language-menu";
  menu.setAttribute("role", "menu");
  for (const lang of LANGS) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "language-option";
    option.dataset.lang = lang;
    option.setAttribute("role", "menuitemradio");
    option.innerHTML = `<span class="language-flag" aria-hidden="true">${FLAGS[lang]}</span><span>${LANGUAGE_NAMES[lang]}</span><span class="language-option-code">${LABELS[lang]}</span>`;
    option.addEventListener("click", () => {
      localStorage.setItem("gdb-language", lang);
      applyLanguage(lang);
      wrap.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.focus();
    });
    menu.appendChild(option);
  }
  trigger.addEventListener("click", () => {
    const open = wrap.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(open));
  });
  wrap.append(trigger, menu);
  const tools = document.querySelector(".head-tools");
  if (tools) tools.prepend(wrap);
  else { wrap.classList.add("language-picker-floating"); document.body.appendChild(wrap); }

  document.addEventListener("click", (event) => {
    if (wrap.contains(event.target)) return;
    wrap.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !wrap.classList.contains("is-open")) return;
    wrap.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    trigger.focus();
  });
}

// Legal/privacy and account-deletion content intentionally remains English.
if (sensitivePage) document.querySelector("main")?.setAttribute("data-i18n-keep-english", "");
document.querySelector("#privacy")?.setAttribute("data-i18n-keep-english", "");
document.querySelector("#account-deletion")?.setAttribute("data-i18n-keep-english", "");
addSelector();
applyLanguage(preferredLanguage());
