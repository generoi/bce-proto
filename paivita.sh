#!/usr/bin/env bash
# Kopioi prototyypin analytiikkareposta tähän julkaisurepoon.
#
# Lähde on aina analytiikkarepo — tässä repossa olevia wireframe-tiedostoja ei
# muokata käsin, koska seuraava ajo ylikirjoittaa ne. Ainoat tämän repon omat
# tiedostot ovat index.html, README.md, robots.txt ja tämä skripti.
set -euo pipefail

LAHDE="${1:-$HOME/Claude/BCE/analytiikka/docs}"
# Kohde on oletuksena repon juuri (main julkaistaan juureen). julkaise.sh antaa
# haaroille oman alihakemiston haarat/<haara>, jolloin jokainen haara saa oman
# esikatselu-URLin eivätkä agentit ylikirjoita toistensa julkaisua.
KOHDE="${2:-$(cd "$(dirname "$0")" && pwd)}"
mkdir -p "$KOHDE"

[ -d "$LAHDE/wireframes" ] || { echo "Lähdettä ei löydy: $LAHDE/wireframes" >&2; exit 1; }

# --- wireframet -------------------------------------------------------------
# Pois: arkisto (vanha sukupolvi), md-dokumentaatio, alaviivalla alkavat
# työtiedostot (mittavariantit, layout-luonnos) ja symlink kuvat/.
rm -rf "$KOHDE/wireframes"
mkdir -p "$KOHDE/wireframes/kuvat"
rsync -a \
  --exclude 'arkisto/' --exclude '*.md' --exclude '_*' --exclude 'kuvat' \
  "$LAHDE/wireframes/" "$KOHDE/wireframes/"

# --- pilarilaskuri ----------------------------------------------------------
# Mukaan vain se mitä selain lataa. paatospuu.js on generaattori (node),
# rules.*.js testejä, *.py kuvageneraattoreita — ne jäävät lähdereppuun.
rm -rf "$KOHDE/pilarilaskuri"
mkdir -p "$KOHDE/pilarilaskuri"
cp "$LAHDE/pilarilaskuri/bce-pilarilaskuri.html" \
   "$LAHDE/pilarilaskuri/paatospuu.data.js" \
   "$KOHDE/pilarilaskuri/"

# --- kuvat ------------------------------------------------------------------
# Vain ne joihin sivut oikeasti viittaavat. docs/kuvat on 52 M lähdemateriaalia;
# tässä on se osa jota selain hakee. Lista haetaan viittauksista, ei käsin.
rm -rf "$KOHDE/kuvat"
mkdir -p "$KOHDE/kuvat"
grep -rhoE '\.\./kuvat/[A-Za-z0-9._-]+\.(svg|png|jpg)' \
  "$KOHDE/pilarilaskuri/" "$KOHDE/wireframes/" 2>/dev/null \
  | sed 's#^\.\./kuvat/##' | sort -u \
  | while read -r f; do cp "$LAHDE/kuvat/$f" "$KOHDE/kuvat/$f"; done

grep -rhoE '"kuvat/[A-Za-z0-9._-]+\.(svg|png|jpg)"' "$KOHDE/wireframes/" 2>/dev/null \
  | tr -d '"' | sed 's#^kuvat/##' | sort -u \
  | while read -r f; do cp "$LAHDE/kuvat/$f" "$KOHDE/wireframes/kuvat/$f"; done

echo "Kohde:             $KOHDE"
echo "Wireframe-sivuja:  $(ls "$KOHDE"/wireframes/*.html | wc -l | tr -d ' ')"
echo "Kuvia juuressa:    $(ls "$KOHDE"/kuvat | wc -l | tr -d ' ')"
echo "Kuvia wireframeis: $(ls "$KOHDE"/wireframes/kuvat | wc -l | tr -d ' ')"
echo "Koko:              $(du -sh "$KOHDE/wireframes" "$KOHDE/pilarilaskuri" "$KOHDE/kuvat" | awk '{s+=$1}END{printf "%.1fM\n", s/1024}' 2>/dev/null || echo "?")"
