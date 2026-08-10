# GDB Website — was noch zu tun ist

> **Hosting-Änderung (10. August 2026):** Die Website wird über GitHub Pages auf
> `generisdatabase.com` veröffentlicht, nicht mehr über Firebase Hosting. Die aktuelle
> Anleitung steht in [`GITHUB-PAGES-START.md`](GITHUB-PAGES-START.md). Firebase bleibt
> ausschließlich für Kontaktformular, Firestore und Admin-Anmeldung bestehen. Die
> Firebase-Hosting- und Deployment-Abschnitte weiter unten sind nur noch Altstand.

Die Seite ist fertig gebaut und lokal getestet. Es fehlen genau **drei Klicks in der
Firebase-Konsole** und **ein Befehl im Terminal**, dann ist sie online.

---

## 1. Vorher in Ruhe anschauen

Auf dem Schreibtisch liegt **„GDB Website ansehen.command"** mit dem GDB-Wappen als
Icon. Doppelklick genügt: Ein Terminal-Fenster öffnet sich, der Vorschau-Server
startet, und der Browser springt automatisch auf <http://localhost:5173>.

Zum Beenden im Terminal-Fenster `Ctrl+C` drücken oder das Fenster schliessen.

Falls du es lieber von Hand machst:

```bash
cd ~/Desktop/gdb-website && python3 serve.py
```

> Der Ordner `gdb-website` muss dafür auf dem Schreibtisch bleiben. Wenn du ihn
> verschiebst, sagt dir die Datei beim Start Bescheid — dann einfach den Pfad
> `SITE_DIR` ganz oben in der `.command`-Datei anpassen (Rechtsklick → Öffnen mit →
> TextEdit).

---

## 2. Die vier Klicks in Firebase

Projekt: **qwizzy-c9538** → <https://console.firebase.google.com/project/qwizzy-c9538>

| # | Was | Wo |
|---|-----|-----|
| 1 | **Firestore anlegen** | *Build → Firestore Database → Create database* → Region **eur3** (Europa), **Production mode** |
| 2 | **Authentication starten** | *Build → Authentication → Get started* |
| 3 | **Anonymous aktivieren** | Anbieterliste → *Anonymous* → Enable → Save |
| 4 | **Google aktivieren** | *Add new provider → Google* → Enable → Support-Mail auswählen → Save |

Wofür:

* **Firestore** ist die Datenbank für Fragen, Stimmen und Kontaktnachrichten. Sie
  existiert im Projekt noch **nicht**. Die Region lässt sich später nicht mehr
  ändern — für ein deutsches Unternehmen ist `eur3` die richtige Wahl. Beim Anlegen
  wird automatisch auch die Cloud-Firestore-API eingeschaltet, die der wöchentliche
  Export-Job braucht.
* **Anonymous** gibt jedem Besucher eine anonyme ID. Nur dadurch lässt sich „eine
  Stimme pro Person" überhaupt durchsetzen. Ohne das kann niemand Fragen einreichen
  oder abstimmen.
* **Google** ist ausschließlich für dich: `/admin` lässt nur
  `generisdatabase@gmail.com` rein, alle anderen werden sofort wieder ausgeloggt.

---

## 2b. ⚠️ Vorher prüfen: benutzt die Qwizzy-App selbst Firestore?

`firebase deploy` überschreibt die **Sicherheitsregeln des gesamten Projekts**. Meine
Regeln erlauben gezielt `questions`, `votes` und `messages` — und sperren am Ende alles
andere (`match /{document=**} { allow read, write: if false; }`).

* Wenn deine iOS-/Android-App **keine** Firestore-Collections liest oder schreibt
  (Fragen liegen ja lokal in der App): alles gut, einfach deployen.
* Wenn sie **doch** welche benutzt: sag mir die Namen, dann ergänze ich sie in
  `firestore.rules`, bevor du deployst. Ansonsten stünde die App plötzlich vor einer
  verschlossenen Tür.

Zur Sicherheit kannst du nur die Website hochladen und die Regeln erst später:

```bash
cd ~/Desktop/gdb-website && firebase deploy --only hosting
```

Ohne die Regeln funktionieren Einreichen und Abstimmen allerdings noch nicht.

---

## 3. Deployen

Node.js einmalig installieren (falls noch nicht vorhanden) — <https://nodejs.org> →
LTS-Version, normaler Installer. Danach:

```bash
npm install -g firebase-tools
```

```bash
cd ~/Desktop/gdb-website && firebase login
```

```bash
cd ~/Desktop/gdb-website && firebase deploy
```

Das lädt in einem Rutsch hoch: die Website, die Sicherheitsregeln (`firestore.rules`)
und die Datenbank-Indizes. Danach läuft die Seite auf:

* <https://qwizzy-c9538.web.app>
* <https://qwizzy-c9538.firebaseapp.com>

**Jedes weitere Mal reicht `firebase deploy`.**

---

## 4. Danach: Selbsttest aufrufen

<https://qwizzy-c9538.web.app/setup>

Die Seite prüft live, ob Konfiguration, Anmeldung, Lesen und Schreiben funktionieren,
und sagt bei jedem Fehler genau, welcher Schalter fehlt. Sie ist nirgends verlinkt und
für Suchmaschinen gesperrt.

Wenn der Google-Login auf `/admin` meckert („unauthorized domain"): in
*Authentication → Settings → Authorized domains* die Live-Domain eintragen.

---

## 5. Was du noch ausfüllen musst

### Impressum & Datenschutz — **wichtig**

`public/imprint.html` und `public/privacy.html` enthalten Platzhalter in der Form
`‹...›` (orange dargestellt). Als deutsches Unternehmen brauchst du ein Impressum mit
vollem Namen, Postanschrift **und E-Mail-Adresse** (§ 5 DDG).

> ⚠️ Das kollidiert mit deinem Wunsch, die Mail-Adresse nicht zu zeigen: Im Impressum
> ist eine E-Mail-Adresse gesetzlich Pflicht. Das Kontaktformular selbst zeigt sie
> nirgends — dein Vorschlag funktioniert also überall außer im Impressum. Praktische
> Lösung: dort eine separate Adresse angeben (z. B. `kontakt@deine-domain.de`), die du
> zu `generisdatabase@gmail.com` weiterleitest. Dann bleibt deine private Adresse raus.

### Echte Screenshots

In `public/assets/img/` liegen drei gebaute Mockups:
`mock-qwizzy.svg`, `mock-wiksy.svg`, `mock-barlingo.svg`.

Zum Austauschen einfach eigene Bilder mit **denselben Namen** ablegen (`.png` geht
auch — dann in `products.html`, `qwizzy.html` und `index.html` die Endung im `src`
anpassen). Empfohlen: PNG mit transparentem Hintergrund, ca. 1400 px breit.

---

## 6. Der monatliche Ablauf

1. <https://qwizzy-c9538.web.app/admin> öffnen, mit Google anmelden.
2. Reiter **Questions**, Filter auf *Waiting (pending)*, Sortierung *Best score first*.
   Optional „min. score" hochsetzen, z. B. `3`.
3. **Select all shown** oder einzeln ankreuzen.
4. **Export selected as JSON** → lädt `qwizzy-community-2026-07.json` herunter.
   Das Format ist exakt das deiner App: `{ id, cat, dif, q, a[4], c }`.
5. **Mark selected approved** — dann verschwinden sie aus der Warteschlange und
   bekommen auf dem Community-Board das Abzeichen „Shipped in Qwizzy".
6. Die JSON-Datei in deinen bestehenden Frageneditor importieren oder direkt in die
   App einbauen.

Der Reiter **Inbox** zeigt die Nachrichten aus dem Kontaktformular. „Reply by email"
öffnet dein Mailprogramm mit vorausgefülltem Empfänger und Betreff — die Person sieht
deine Adresse also erst, wenn du antwortest. Genau wie gewünscht.

---

## 7. Die automatische Samstags-Mail einrichten

Jeden Samstag sammelt ein Job alle Fragen mit **mindestens 25 Upvotes**, die
vollständig und fehlerfrei ausgefüllt sind, packt sie in eine `.json` im Qwizzy-Format
und schickt sie dir als Anhang. Danach werden sie auf *approved* gesetzt, kommen also
kein zweites Mal.

Das läuft bei **GitHub Actions** — kostenlos und unabhängig davon, ob dein Mac an ist.

### a) Repository anlegen

Auf <https://github.com/new> ein **privates** Repository erstellen, z. B. `gdb-website`.
Dann im Terminal:

```bash
cd ~/Desktop/gdb-website && git init && git add . && git commit -m "GDB website"
```

```bash
cd ~/Desktop/gdb-website && git branch -M main && git remote add origin https://github.com/DEIN-NAME/gdb-website.git && git push -u origin main
```

> Die `.gitignore` sorgt dafür, dass der Firebase-Admin-Key **niemals** mitgeht.
> Prüf das einmal mit `git status --ignored | grep adminsdk` — die Datei muss unter
> „Ignored files" stehen.

### b) App-Passwort für Gmail erzeugen

Google erlaubt Programmen keinen Zugriff mit deinem normalen Passwort.

1. Zweistufige Bestätigung aktivieren: <https://myaccount.google.com/signinoptions/two-step-verification>
2. App-Passwort erzeugen: <https://myaccount.google.com/apppasswords> — Name z. B. „GDB Export".
3. Google zeigt **16 Buchstaben**. Die einmal kopieren, danach sind sie nicht mehr einsehbar.

### c) Vier Secrets in GitHub hinterlegen

Im Repository: *Settings → Secrets and variables → Actions → New repository secret*

| Name | Inhalt |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | der **komplette Inhalt** von `qwizzy-c9538-firebase-adminsdk-…json` (Datei öffnen, alles markieren, einfügen) |
| `GMAIL_USER` | `generisdatabase@gmail.com` |
| `GMAIL_APP_PASSWORD` | die 16 Buchstaben aus Schritt b (ohne Leerzeichen) |
| `MAIL_TO` | wohin die Mail soll, z. B. `generisdatabase@gmail.com` |

Diese Werte trägst du selbst ein — ich fasse deine Zugangsdaten nicht an.

### d) Einmal von Hand testen

Repository → Reiter **Actions** → *Weekly Qwizzy export* → **Run workflow** →
Häkchen bei *dry run* setzen → starten. Im Protokoll steht dann, welche Fragen
gefunden wurden, ohne dass eine Mail rausgeht oder etwas verändert wird.

### Stellschrauben

In `.github/workflows/weekly-export.yml`:

* `cron: "0 7 * * 6"` — Samstag 07:00 UTC, also 09:00 deutscher Sommerzeit.
  GitHub rechnet immer in UTC und kennt keine Zeitumstellung.
* `MIN_UPVOTES: "25"` — die Schwelle.
* `MIN_SCORE: "0"` — zusätzlich muss `Upvotes − Downvotes` mindestens 0 sein, damit
  eine umstrittene Frage mit 30 Hoch- und 40 Runterstimmen nicht durchrutscht.
  Auf `-9999` setzen, wenn dich nur die Upvotes interessieren.

> Zwei Dinge, die man wissen sollte: GitHub pausiert geplante Workflows in
> Repositories, in denen 60 Tage nichts passiert ist — dann im Actions-Reiter einmal
> „Enable workflow" klicken. Und geplante Läufe starten bei GitHub gern ein paar
> Minuten später als eingetragen, das ist normal.

Gibt es an einem Samstag keine passende Frage, wird **keine Mail** verschickt. Dass der
Job trotzdem gelaufen ist, siehst du im Actions-Reiter.

---

## 8. Eigene Domain (später)

Firebase-Konsole → *Hosting → Add custom domain*, der Assistent nennt die DNS-Einträge.
Danach die Domain zusätzlich in *Authentication → Settings → Authorized domains*
eintragen und in `public/robots.txt` sowie `public/sitemap.xml` die URL ersetzen.

---

## Was wo liegt

```
gdb-website/
├── firebase.json            Hosting- und Firestore-Konfiguration
├── .firebaserc              Projektzuordnung (qwizzy-c9538)
├── .gitignore               hält den Admin-Key aus dem Repository heraus
├── firestore.rules          Sicherheitsregeln — wer darf was
├── firestore.indexes.json   Datenbank-Indizes
├── tools/
│   └── weekly_export.py     sammelt, prüft, verpackt und mailt die Fragen
├── .github/workflows/
│   └── weekly-export.yml    Zeitplan: jeden Samstag
├── serve.py                 lokaler Vorschau-Server
└── public/
    ├── index.html           Startseite
    ├── products.html        alle drei Apps
    ├── qwizzy.html          Qwizzy-Produktseite mit Button zum Editor
    ├── editor.html          Frageneditor (leer, mit Live-Vorschau)
    ├── review.html          Community-Board zum Bewerten
    ├── contact.html         Kontaktformular
    ├── admin.html           deine Konsole (nicht verlinkt, noindex)
    ├── setup.html           Selbsttest (nicht verlinkt, noindex)
    ├── imprint.html         Impressum  ← ausfüllen
    ├── privacy.html         Datenschutz ← ausfüllen
    ├── 404.html
    └── assets/
        ├── css/site.css     komplettes Design-System
        ├── js/config.js     ← die einzige Datei mit Einstellungen
        ├── js/db.js         alle Firestore-Zugriffe
        └── js/fx.js         Animationen, Cursor, Theme-Umschalter
```

**Alle Einstellungen stehen in `public/assets/js/config.js`** — Firebase-Zugangsdaten,
deine Admin-Mail und die 25 Kategorien (Schlüssel identisch zu deiner App, damit die
Export-JSON direkt passt).

---

## Zur Sicherheit

Der Firebase-API-Key in `config.js` ist absichtlich öffentlich — bei Firebase ist das
so vorgesehen. Was wirklich schützt, sind die Regeln in `firestore.rules`:

* Fragen darf jeder Angemeldete anlegen, aber nur in exakt gültiger Form
  (Länge, vier Antworten, Kategorie, Schwierigkeit, Zähler auf 0).
* Stimmen laufen über die Dokument-ID `fragenID_nutzerID` — doppelt abstimmen ist
  technisch unmöglich, nicht nur im Browser verhindert.
* Kontaktnachrichten darf jeder schreiben, aber **nur du** lesen.
* Löschen und Freigeben kann ausschließlich `generisdatabase@gmail.com`.

Zusätzlich hat jedes Formular ein verstecktes Honeypot-Feld gegen simple Bots.

> Der Datei `qwizzy-c9538-firebase-adminsdk-...json` auf deinem Schreibtisch ist ein
> privater Schlüssel mit Vollzugriff auf das Projekt. Der gehört **nicht** in die
> Website und nicht in ein öffentliches Repository — er liegt bewusst außerhalb des
> `gdb-website`-Ordners.
