#!/bin/bash
#
#  GDB Website — lokale Vorschau
#
#  Doppelklick startet den Vorschau-Server und öffnet die Seite im Browser.
#  Zum Beenden einfach in diesem Fenster Ctrl+C drücken oder das Fenster schliessen.
#
set -u

SITE_DIR="$HOME/Desktop/gdb-website"
PORT=5173
URL="http://localhost:$PORT"

printf '\033]0;GDB Website Vorschau\007'
clear
cat <<'BANNER'

   ┌──────────────────────────────────────────────┐
   │                                              │
   │        G D B   ·   Generis Data Base         │
   │             Website — Vorschau               │
   │                                              │
   └──────────────────────────────────────────────┘

BANNER

if [ ! -f "$SITE_DIR/serve.py" ]; then
  echo "   ✗ Der Ordner »gdb-website« liegt nicht auf dem Schreibtisch."
  echo
  echo "     Erwartet:  $SITE_DIR"
  echo
  echo "   Verschiebe den Ordner zurück auf den Schreibtisch und starte neu."
  echo
  read -r -p "   [Enter] zum Schliessen "
  exit 1
fi

cd "$SITE_DIR" || exit 1

# python3 kann je nach Umgebung woanders liegen
PY="$(command -v python3 || true)"
[ -x "/usr/bin/python3" ] && PY="/usr/bin/python3"
if [ -z "$PY" ]; then
  echo "   ✗ python3 wurde nicht gefunden."
  read -r -p "   [Enter] zum Schliessen "
  exit 1
fi

# Läuft schon eine Vorschau? Dann nur den Browser öffnen.
if curl -s -o /dev/null --max-time 1 "$URL/"; then
  echo "   • Die Vorschau läuft bereits — öffne nur den Browser."
  echo
  open "$URL"
  echo "   Fenster kann geschlossen werden."
  echo
  exit 0
fi

echo "   • Server startet …"
"$PY" serve.py "$PORT" &
SERVER_PID=$!

cleanup() {
  echo
  echo "   • Vorschau beendet."
  kill "$SERVER_PID" 2>/dev/null
  exit 0
}
trap cleanup INT TERM HUP

for _ in $(seq 1 40); do
  curl -s -o /dev/null --max-time 1 "$URL/" && break
  sleep 0.25
done

if ! curl -s -o /dev/null --max-time 1 "$URL/"; then
  echo "   ✗ Der Server ließ sich nicht starten (siehe Meldungen oben)."
  read -r -p "   [Enter] zum Schliessen "
  cleanup
fi

open "$URL"

cat <<BANNER2

   ✓ Die Website läuft unter  $URL

     Seiten:
       /            Startseite
       /products    Alle drei Apps
       /qwizzy      Qwizzy + Button zum Editor
       /editor      Frageneditor
       /review      Community-Board
       /contact     Kontaktformular
       /admin       Deine Konsole
       /setup       Selbsttest

   Zum Beenden:  Ctrl+C  oder dieses Fenster schliessen.

BANNER2

wait "$SERVER_PID"
