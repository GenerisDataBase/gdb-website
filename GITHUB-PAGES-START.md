# Generis Data Base über GitHub Pages veröffentlichen

Die Website ist für `https://generisdatabase.com` vorbereitet. Bei jedem Push auf den
Branch `main` veröffentlicht `.github/workflows/pages.yml` den Ordner `public` und
erzeugt dabei die sauberen URLs wie `/products`, `/wiksy` und `/barlingo`.

## 1. GitHub-Repository

Ein öffentliches Repository in der Organisation `GenerisDataBase` erstellen, zum
Beispiel `gdb-website`. Anschließend diesen Ordner als Repository initialisieren,
committen und auf den Branch `main` pushen.

In GitHub unter **Settings → Pages → Build and deployment** als Quelle
**GitHub Actions** auswählen.

## 2. Domain in GitHub eintragen

Die Domain zuerst in den GitHub-Organisationseinstellungen verifizieren. Danach im
Repository unter **Settings → Pages → Custom domain** eintragen:

```text
generisdatabase.com
```

Sobald GitHub das Zertifikat ausgestellt hat, **Enforce HTTPS** aktivieren.

## 3. DNS beim Domainanbieter

Für die Hauptdomain vier A-Einträge setzen:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Für `www` einen CNAME setzen:

```text
www  CNAME  generisdatabase.github.io
```

DNS-Änderungen und das HTTPS-Zertifikat können einige Zeit benötigen.

## 4. Firebase

In Firebase Authentication `generisdatabase.com` und `www.generisdatabase.com` als
autorisierte Domains eintragen. Cloud Firestore sowie Anonymous Authentication und
Google Authentication aktivieren, sofern die interaktiven Bereiche verwendet werden.

Die Firestore-Regeln und Indizes separat veröffentlichen. Dabei vorher prüfen, ob das
Firebase-Projekt noch von einer anderen App mit eigenen Firestore-Collections genutzt
wird, weil ein Regel-Deployment die Regeln des gesamten Projekts ersetzt.

Nach Veröffentlichung `https://generisdatabase.com/setup` öffnen und alle Prüfungen
durchlaufen lassen.
