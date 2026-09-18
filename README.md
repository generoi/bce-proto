# BCE Pilarimaailma — prototyypin julkaisurepo

Sivustoprototyyppi ja pilarilaskuri GitHub Pagesissa:
**https://generoi.github.io/bce-proto/**

## Tämä repo on kopio

Lähde on BCE:n työhakemisto (`analytiikka/docs/`). Täällä olevia wireframe-,
laskuri- ja kuvatiedostoja **ei muokata käsin** — seuraava päivitysajo
ylikirjoittaa ne. Repon omat tiedostot ovat vain:

| Tiedosto | Mikä |
|---|---|
| `index.html` | Hakemistosivu. Lukee tokenit `wireframes/bce-v4.css`:stä, ei omia värejä |
| `paivita.sh` | Kopioi prototyypin lähdereposta. Yksi paikka, joka tietää mitä julkaistaan |
| `robots.txt` | Estää indeksoinnin: keskeneräinen proto ei kuulu hakutuloksiin |
| `.nojekyll` | Pages tarjoilee tiedostot sellaisenaan, ei Jekyllin läpi |

## Päivitys

```bash
./paivita.sh                 # oletuslähde ~/Claude/BCE/analytiikka/docs
./paivita.sh /muu/polku/docs # tai annettu lähde
git add -A && git commit -m "Proto päivitetty" && git push
```

Pages rakentaa `main`-haaran juuresta, joten push riittää. Ajo kestää noin minuutin.

## Mitä mukaan tulee, mitä ei

Mukaan tulee se mitä selain lataa. Lähdereposta jää pois:

- **analytiikkadata** (`data/`, `docs/data/`) — GA4- ja Search Console -aineisto on
  asiakkaan liiketoimintadataa eikä kuulu julkiseen repoon
- **dokumentaatio** (`*.md`) — sivukartat, speksit ja työpajamuistiot ovat
  työaineistoa, eivät prototyypin osa
- **lähdekuvat** (`docs/kuvat/`, 52 M) — mukaan kopioidaan vain ne noin 20 tiedostoa
  joihin sivut oikeasti viittaavat, `paivita.sh` hakee listan viittauksista
- **generaattorit ja testit** (`*.py`, `paatospuu.js`, `rules.*.js`) — ne ajetaan
  lähdereposta, eivät selaimessa
- **arkisto ja työtiedostot** (`wireframes/arkisto/`, `_`-alkuiset) — vanha sukupolvi

## Riippuvuus jonka takia rakenne on tämä

`wireframes/bce_paatospuu.html` lataa `../pilarilaskuri/paatospuu.data.js`.
Siksi `wireframes/` ja `pilarilaskuri/` ovat sisaruksia juuressa, kuten lähteessäkin —
hakemistoja ei voi järjestää uusiksi rikkomatta päätöspuuta.
