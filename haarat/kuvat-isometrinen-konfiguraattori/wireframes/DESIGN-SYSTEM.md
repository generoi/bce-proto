# Design system, wireframe-taso

**Aloitettu 16.9.2026.** Yksi CSS (`bce-v4.css`), yksi kuori (`bce-spec-shell.js`), yksi
katalogisivu ([`bce_design_system.html`](bce_design_system.html)), joka renderöi jokaisen
komponentin samasta tyylitiedostosta kuin sivut. Tämä dokumentti kertoo säännöt,
tuotantovastineet ja siirtotaulukon; katalogi näyttää miltä komponentti näyttää ja missä
se on käytössä.

Tämä ei ole uusi ilme. `DESIGN.md` (juuressa) päättää värit, fontit ja teeman; tämä
dokumentti päättää **miten ne kootaan komponenteiksi niin, että sama tehtävä saa saman
lohkon joka sivulla.** Syy: viidellä elävällä sivulla oli 16.9.2026 viisi eri
ensimmäistä ruutua, kolme jälleenmyyjälistaa, kolme tarvikeriviä, kuusi selitetyyliä ja
15 kuvapaikkamääritelmää.

## 1 · Tokenit

Kaikki `:root`-lohkossa. Uusi sääntö valitsee arvon asteikolta; vanha pikseliarvo
siirretään asteikolle silloin kun lohko muuten käydään läpi, ei erillisenä kierroksena.

| Ryhmä | Tokenit | Sääntö |
|---|---|---|
| Väri | `--accent --accent-dark --ink --ink-2 --ink-3 --dark --paper --paper-2 --rule --rule-2` | `--accent` vain `.btn-1`:lle ja pilareille piirustuksissa. Kaikki muu oranssi on `--accent-dark` (5,2:1 paperilla). Ei `#000`/`#fff` tekstinä |
| Kirjasin | `--ff` Raleway, `--ff-d` Oswald | Otsikot Oswald 600 versaali, teksti Raleway 400/600 |
| Koot | `--fs-fine 13 · --fs-small 15 · --fs-body 17 · --fs-lede 19 · --fs-h3 18 · --fs-h2 23–30 · --fs-h1 32–52` | Askel ≥ 1,25. Yksi H2-koko per sivu. Rivi ≤ 68 merkkiä |
| Välit | `--s1 4 · --s2 8 · --s3 12 · --s4 16 · --s5 24 · --s6 32 · --s7 48 · --s8 64` | Osio 60 px (mobiili 44), palstaväli 48, kortin sisäväli 24, listarivi 13 |
| Kulmat | `--r-ctl 3px` painikkeet ja kentät, `--r-card 4px` kortit ja paneelit | Ei muita |
| Kosketus | `--tap 44px` | Painikkeet ja irralliset linkit 44 px. Rivilinkit ≥ 24 px osuma-alue paddingilla + negatiivisella marginilla, jotta rivi ei kasva |
| Liike | `--ease cubic-bezier(.22,1,.36,1)` | Vain ease-out, alle 200 ms, ei layout-ominaisuuksia |
| Tuotekuva | `--bet-yla --bet-viiste-a --bet-viiste-b --bet-sivu-a --bet-sivu-b --bet-syva --bet-kiilto --bet-teras --bet-viiva` | Vain `tuotekuva.js`:n betonipinnoille. Yksi valo ylävasemmalta: sama betoni saa sävyn pinnan suunnan mukaan, ja siitä muoto luetaan. **Asteikko on tarkoituksella jyrkempi kuin sivun neutraalit** (18.9.2026): tuotekuva on graafinen esitys, ja litteä sävyero luetaan muodoksi vasta kun portaat ovat riittävän kaukana toisistaan. Aiemmin kolme sävyä oli sidottu `--paper-2`:een, `--rule`:een ja `--rule-2`:een; side purettiin kontrastin takia. `--bet-kiilto` on vain viivana valoa nappaavalla särmällä — betoni on mattaa, joten leveä kiilto näyttäisi muovilta. Särmä on `--bet-viiva`, ei `--ink` |
| Palkkikuva | `--puu-yla --puu-viiste --puu-sivu-a --puu-sivu-b --puu-paa --puu-syy --puu-oksa --puu-viiva` | Vain `palkkikuva.js`:n puupinnoille. Sama valo samasta suunnasta kuin betonissa, joten palkki ja pilari voivat olla samassa kuvassa. `--puu-paa` on päätypuu: himmeämpi kuin lape, koska syyt ovat poikki. Kyllästysväriä ei ole tokenina — sitä ei ole valittu, ks. [`TUOTEKUVAT.md`](TUOTEKUVAT.md) luku 11 |
| Tarvikekuva | `--met-yla --met-sivu --met-varjo --met-syva --met-tumma --met-viiva` | Vain `tarvikekuva.js`:n teräspinnoille. Viileä asteikko, ei betoniasteikon jatke: kuumasinkitty teräs luetaan kovista heijastuksista, betoni pehmeistä sävyeroista. Sävy ei ole valinta vaan se lasketaan pinnan normaalista neljänä portaana |
| Terassikuva | `--maa-sora-yla --maa-sora-sivu-a --maa-sora-sivu-b --maa-xps-yla --maa-xps-sivu-a --maa-xps-sivu-b --maa-murske-yla --maa-murske-sivu-a --maa-murske-sivu-b --maa-viiva` | Vain `terassikuva.js`:n maakerroksille. Sama valo samasta suunnasta kuin muissa kolmessa: `-sivu-a` on +y eli kuvassa vasemmalle kääntyvä kylki (valon puoli), `-sivu-b` on +x. Routaeriste on tarkoituksella viileä — XPS on sinistä, ja juuri siitä kerros tunnistetaan murskeen ja soran välistä. `--maa-viiva` on vaaleampi kuin `--bet-viiva`: maa on taustaa eikä tuote, ja tuotteen on erotuttava siitä |
| Kaavion tekstit | `mittakaavio.js` sisäiset: 20 px kirjain · 21 px mitta · 17 px kirjain luvun päällä | Luvut ovat SVG:n käyttäjäkoordinaatteja ja kangas skaalautuu palstaan, joten **renderöity koko mitataan selaimesta eikä lueta koodista**. Alaraja on `--fs-fine` 13 px: kaavio selittää mittataulukkoa, eikä se saa lukea pienempänä kuin taulukko itse. Korotettu 18.9.2026 (oli 15/16/13 px, renderöityi 15 px työpöydällä ja 9 px mobiilissa); samalla kaavio sai kapealla vieritettävän kehyksen, koska 342 px:n palstassa merkintä jäi 11,9 pikseliin |
| Katkaisu | 980 · 820 · 560 | 980 navigaatio ja kaksipalstaiset yhteen, 820 ruudukot kahteen sarakkeeseen, 560 yhteen. Poikkeus perustellaan kommentissa |

Nykyinen CSS käyttää 15 eri katkaisukohtaa (1160 … 420). Ne eivät ole vääriä, ne ovat
jäljitettävissä lohkon sisältöön, mutta jokainen uusi arvo on paikka jossa kaksi sivua
käyttäytyy eri tavalla samalla ruudulla.

## 2 · Säännöt, jotka koskevat jokaista komponenttia

1. **Yksi tehtävä, yksi luokka.** Ennen uutta luokkaa katso katalogi. Jos tarvittava on
   siellä eri nimellä, käytä sitä. Jos se puuttuu, lisää se katalogiin samalla kun CSS:ään.
2. **Inline `style=""` sivun koodissa tarkoittaa puuttuvaa komponenttia.** Etusivulla oli
   14, lähes kaikki lohkon lopettavan linkin `margin-top`-arvoja; nyt ne ovat `.next`.
   Elävillä sivuilla on nolla inline-tyyliä, ja niin pysyy.
3. **Yksi `.btn-1` per näkymä**, ja se nimeää lopputuloksen. Sama toiminto saa saman
   nimen joka sivulla. Toissijainen toiminto on `.more`-tekstilinkki; `.btn-2` vain kun
   toiminto on aidosti rinnakkainen (alapalkki, hakukenttä).
4. **Toiminto kuittaa itsensä sanoin** (`Kopioi → Kopioitu`, `aria-live`), epäonnistuminen
   kertoo itsestään, mikään ei ole esivalittu, mikään ei vieritä käyttäjän puolesta.
5. **Kosketuskohde mitataan DOMista**, ei paddingista. `.more` on 44 px joka paikassa;
   rivilinkit ≥ 24 px. Jos elementti näyttää painikkeelta, se on `<button>` tai `<a>`.
6. **Kontrasti lasketaan renderöidyistä väreistä.** Valkoinen oranssilla on 3,6:1, joten
   `.btn-1`-teksti on vähintään 19 px. Pienempi oranssi teksti on `--accent-dark`.
7. **Kuvapaikka on `.ph` + kuvasuhde.** Se kertoo mitä kuvassa on, ei miksi. Ei min-heightia.
8. **Selite on `.lbl`.** Kun se on otsikko rakenteessa mutta selite silmälle, `h2.lbl`.
9. **Ei kahta ruudukkoa peräkkäin.** Ruudukko, rivilista, mediapari, ruudukko.
10. **Sama copy kahdella sivulla on toistoa, ei konsistenssia.** Lohko saa toistua, sen
    sisältö ei (etusivu ja hubi jakavat nyt neljä identtistä lohkoa sanasta sanaan).

**Jälleenmyyjätoiminnon sanasto (17.9.2026).** Kolme merkkijonoa, ei kahdeksaa. Sääntö:
linkki sivulle kantaa aina sivun nimen, lohko nimeää toiminnon, painike nimeää teon.

| Rooli | Nimi |
|---|---|
| Sivu, navigaatio, alapalkki, alatunniste ja **jokainen linkki sille sivulle** | **Mistä ostat** |
| Lohkon otsikko ja ostolaatikon selite | **Osta jälleenmyyjältä** |
| Ketjukohtainen toiminto | **Osta verkkokaupasta** (`SPEC.dealerGo`) |

Poistetut muodot: *Osta lähimmältä jälleenmyyjältä · Etsi lähin jälleenmyyjä · Kaikki
jälleenmyyjät ja verkkokaupat · Katso mistä ostat · Katso jälleenmyyjät*. Sana *lähin*
poistui myös siksi, että se lupaa läheisyyttä, jota sivusto ei toteuta.

## 3 · Komponenttikatalogi

Kanoninen luokka on se, jota uusi sivu käyttää. Katalogisivu näyttää jokaisen.

**Tuotantovastine-sarake lisätty 22.9.2026.** Se kertoo mikä komponentista tulee
WordPressissä, ja se on katalogin ja toteutuksen ainoa side: ilman sitä devaaja arvioi
työn kuvista, mikä on kallein tapa arvioida ja se tapa, jolla syntyy 54 lohkoa siellä
missä 14 riittää. Sama sarake on katalogisivun jokaisessa kohdassa
([`bce_design_system.html`](bce_design_system.html)).

Viisi luokkaa, ja jokainen komponentti on tasan yksi niistä:

| Luokka | Mitä | Rivejä |
|---|---|---|
| **core** | ydinlohko sellaisenaan. Ei ylläpidettävää, ei dokumentoitavaa | 16 |
| **ACF** | ACF Composer -lohko: kiinteä rakenne, kysely tai tuotedata | 23 riviä, **14 eri lohkoa** — loput ovat osia niistä |
| **lohkomalli** | ydinlohkoja yhdessä. Synkronoitu, jos sisällön on pysyttävä samana | 6 |
| **teema** | sivupohja tai teeman asetus, ei toimittajan valinta | 5 |
| **ei siirry** | suunnitteluväline: merkinnät, paikanpitäjät, modifierit | 4 |

Neljä päätöstä, joilla luokka valitaan. **Ydinlohko voittaa aina kun se riittää** —
`core/cover`, `core/columns`, `core/media-text`, `core/table`, `core/details` ja
`core/query` eivät maksa mitään ylläpitää. **Oma URL, suodatus tai esiintyminen
useammalla sivulla tarkoittaa sisältötyyppiä**, ei repeateria; väärä valinta korjataan
migraatiolla. **Selattava tai suodatettava arvo on taksonomia**, pelkkä ominaisuus on
kenttä. **Vapaa sisältöalue on NativeBlock**, kiinteä rakenne tai kyselyparametrit ovat
ACF-lohko.

Neljätoista custom-lohkoa ovat `bce/jalleenmyyjat` · `bce/kokovalitsin` ·
`bce/konfiguraattoripaneeli` · `bce/lataus` · `bce/mittakaavio` · `bce/mittataulukko` ·
`bce/ostolaatikko` · `bce/referenssinostot` · `bce/sivuhakemisto` · `bce/tarvikerivit` ·
`bce/tarvikesuodatin` · `bce/tuoteperhekortit` · `bce/ukk` · `bce/vaiheet`.

### Kaksi avointa kysymystä, jotka on ratkaistava ennen toteutusta

**1 · Tarvikedata: repeater vai sisältötyyppi?** Kahdeksan nimikettä ovat yhdellä
sivulla ilman omia URLeja (päätös 15.9.2026), mikä puhuisi repeaterin puolesta. Samaa
dataa tarvitaan kuitenkin kolmessa muussa paikassa: laskurin `ACCESSORIES`-taulukossa,
referenssin `tarvikkeet`-relaatiossa ja ohjeen `kaytetyt_tuotteet`-relaatiossa
([`../post-tyypit-ja-sisaltomalli.md`](../post-tyypit-ja-sisaltomalli.md) luku 5).
**Suositus: piilotettu sisältötyyppi** (`public=false`, `show_in_rest=true`, ei arkistoa,
ei yksittäissivua), koska relaatiokenttä tarvitsee kohteen johon osoittaa. Repeaterina
sama tuotedata syötetään kolmesti ja eriytyy ensimmäisessä muutoksessa.

**2 · Piirretyt tuotekuvat: SVG-tiedosto vai generaattori?** Staattiset kuvat voi viedä
mediakirjastoon (`python3 docs/kuvat/tuotekuva.py kaikki` tuottaa ne), mutta
TP-perhesivun kokovalitsin morffaa kuvaa valinnan mukaan ja mittakaavio skaalautuu
palstaan — ne ovat JS-riippuvuuksia lohkossa, eivät kuvia. **Suositus: mediakirjasto
kaikelle paitsi `bce/kokovalitsin`- ja `bce/mittakaavio`-lohkoille.** Silloin
generaattorit jäävät suunnittelutyökaluiksi ja tuotantoon menee kaksi JS-riippuvuutta
eikä viittä.

| Tehtävä | Kanoninen | Käytössä | Tuotantovastine | Rinnakkaiset (poistuvat) |
|---|---|---|---|---|
| Painike | `.btn .btn-1 .btn-2 .btn-s .wide` | kaikki | **core** · `core/buttons` + `core/button`. `.btn-1` ja `.btn-2` ovat teeman lohkotyylejä | Jälleenmyyjälinkki ei ole `.btn`: se on oma `.dealers a`, jotta oranssi jää sivun yhdelle ensisijaiselle toiminnolle |
| Toissijainen linkki | `.more` (ent. `.hero-2`) | kaikki | **core** · `core/paragraph`, lohkotyyli *more*. Nuoli tulee tyylistä, ei sisällöstä | |
| Painike linkin näköisenä | `.lnk` | A | **core** · `core/button`, lohkotyyli *link* | |
| Kuittaava painike | `.cp` + `.sr[role=status]` | TP, B | **ACF** · ei itsenäinen lohko: osa Ostolaatikkoa ja Mittataulukkoa. Kopioitava arvo on tuotedataa | |
| Selite | `.lbl`, `h2.lbl` | TP, A, B | **core** · `core/heading` tai `core/paragraph`, lohkotyyli *lbl* | `.box .lbl .idx .lbl .dl .ty` (omat marginit ok), `table.data thead th`, `footer h3` |
| Merkinnät | `.tbd .fine code` | kaikki | **ei siirry** · suunnitteluväline. `.fine` siirtyy: `core/paragraph`, lohkotyyli *fine* | `.footnote` (kuollut), `.tbd-l` |
| Kuvapaikka | `.ph .ph-43 .ph-1610 .ph-169 .ph-1` | uudet, käyttökohde (kaikki kuvapaikat) | **ei siirry** · paikanpitäjä. Tuotannossa `core/image`, kuvasuhde lohkotyylinä | `.hero-img .quote .im .case .im .serie .im .side .im .pitem .im .gal .im .tim .plot .im .flow .st .im .pick .im .logos .lg .thumbs button .lgrow span .combo .im` |
| Piirretty kuva kuvapaikassa | `.ph.piirros` `.im.piirros` `.thumbs button.piirros` · `.pick-how .ph.piirros` (alaviiva takaisin) · leveä `figure.figwide > svg` | hubi (perhekortit), tarvikkeet (tuoterivit + suodatinkortit) | **ei siirry** · modifier. Tuotannossa eroa paikanpitäjään ei ole | Lisätty 18.9.2026. Modifier sanoo, että paikassa on aito kuva eikä paikanpitäjää: katkoviiva, `--paper-2`-täyttö ja keskitys pois. `tuotekuva.js` piirtää läpinäkyvälle pohjalle, joten levy kuvan alla lupaisi taustan, jota kuvassa ei ole. Saman lohkon kuvat piirretään **yhdellä `tuotekuva.rivi`-kutsulla**: se antaa niille saman mittakaavan ja saman kankaan, jolloin yksi CSS-sääntö skaalaa ne kaikki samalla kertoimella ja pilarit seisovat samalla tasolla. Eri kokoisilla kankailla jokainen kortti skaalautuisi omalla kertoimellaan heti kun laatikko on kuvaa kapeampi. Nimi on `.piirros` eikä `.tk`, koska `.tcard .tk` on jo tarvikesivun tuotekoodi. Yhteinen kangas tehdään `tuotekuva.kangas()`:lla, joka toimii myös `tarvikekuva`-, `palkkikuva`- ja `yhdistelmakuva`-kuvilla. Jos lohkon kehys on rakennetta eikä paikanpitäjää, se palautetaan omalla säännöllä. Käyttöönotto-ohje on [`TUOTEKUVAT.md`](TUOTEKUVAT.md) |
| Kokovalitsin asteikkona | `.tval-valinnat.tval-asteikko` · `--y` inline | TP-perhesivu, lohko 3 | **ACF** · osa Kokovalitsinta, ei oma lohko | Lisätty 18.9.2026. Vaihtoehto ei ole luettelon rivi vaan piste asteikolla: se asetetaan sille korkeudelle, jonka se tarkoittaa, kuvan H1-mittaviivan viereen. Valittu koko osuu pilarin pään kohdalle ja valitsematta jääneet näyttävät mihin pilari yltäisi. Prosentin antaa `tuotekuva.asteikko()`, ei tyylitiedosto — luku on kuvan mittakaavasta. **Luokan lisää ja poistaa `tuotevalitsin.js` mittaamalla**: jos pienin väli jää alle 48 px:n, valitsin palaa tasaväliseksi luetteloksi. Se ei ole ruudun leveyden kysymys vaan perheen — TP mahtuu, KP:n seitsemän kokoa ja AP:n kolme eivät |
| Kaavio: mittakaavio | `.mk svg` · `.mitoitus .mk` (`mittakaavio.js`) | TP | **ACF** · `bce/mittakaavio` tai esirenderöity SVG mediakirjastoon — avoin kysymys 2 | Selite taulukolle: kirjaimet kaaviossa, luvut taulukossa. Kangas mitoitettu perheen suurimman koon mukaan, joten valinta ei muuta piirroksen eikä tekstin kokoa. Vain TP, AP ja KP — PP tarvitsee oman piirroksen |
| Tuotekuva: pilari | `tuotekuva()` · `.perhe()` · `.rivi()` · `.kangas()` · `.morffi()` | hubi, TP | **ACF** · staattisena SVG mediakirjastoon; morffaava versio vaatii lohkon ja JS:n — avoin kysymys 2 | Muistijälki muodosta, ei mitoitus. Mitat `mittakaavio.js`:stä, betoni `--bet-*` |
| Tuotekuva: tarvike | `tarvikekuva()` · `.osat()` · `.tieto()` · `.laajuus()` | tarvikkeet | **ACF** · staattinen, joten mediakirjasto riittää | Kymmenen nimikettä. Sama kamera kuin pilarilla, eri valo: teräs `--met-*`, sävy pinnan normaalista. Ei `kiintea`-valitsinta — yhteinen mittakaava `laajuus()`-suhteella |
| Tuotekuva: palkki | `palkkikuva()` · `.rivi()` · `.koot()` | **ei yhdelläkään sivulla** | **ei siirry** · laskurin kuva, ei sivuston | Laskurin kolme palkkikokoa. Mitat kokotunnuksesta, puu `--puu-*`. Ei tuotesivuille: BCE myy pilareita, ei sahatavaraa |
| Yhdistelmäkuva | `yhdistelmakuva()` · `.parit()` | tarvikkeet (suodatinkortit) | **ACF** · renderöityy Tarvikesuodattimen sisällä | Tarvike ja siihen kuuluva puu: vastaa kysymykseen miten päin puu menee kiinni. Ei piirrä itse vaan asettaa kaksi generaattoria samaan kankaaseen. P-PIK 50×70:n pari otettiin käyttöön 21.9.2026, kun sen ristiriita ratkesi |
| Kenttä | `.field` | etusivu, hubi | **teema** · haku on teeman oma, lomakekentät lomakeliitännäisestä | `.search input` (kuori, oma mitta), `.acts input` (kuollut) |
| Osion otsake | `.head` (h2 + p) | kaikki | **lohkomalli** · `core/heading` + `core/paragraph` | |
| Lohkon lopetusrivi | `p.next` — sisältönä `a.more` tai lohkon päättävä virke | kaikki | **core** · `core/paragraph`, väli lohkotyylistä | inline `margin-top` (poistettu 16.9.). Luokka on pelkkä väli (24 px); JeKi-sivun *Pilarit vai JeKi* päättyy virkkeeseen eikä linkkiin |
| Mediapari | `.side .side.flip` | etusivu, hubi, TP, A, käyttökohde | **core** · `core/media-text`, tekstipuoli InnerBlocks | `.two .top .build .buy .close .combo` (kuolleet), `.guide` (lomakkeen kanssa, jää) |
| Toimintopaneeli | `.band` | kaikki | **lohkomalli, synkronoitu** · sama teksti ja sama painike (*Pyydä tarjous*) joka sivulla | Painike aina *Pyydä tarjous*. `.aside-box` (kuollut) |
| Konfiguraattoripaneeli | `.cfg` (`div(.head .act) + img.shot`) | kaikki | **ACF** · `bce/konfiguraattoripaneeli`. Oma lohko, koska painike kantaa `data-sijainti`-parametrin | Sama kuva `konfiguraattori-isometric-c.png`. Etusivun vanha rakenne (otsake, kuva ja painike erillisinä lapsina) korjattu 17.9. |
| Kapea nosto | `.pro-strip` | etusivu | **lohkomalli** · `core/group` + `core/columns` | |
| Kuvahero | `.hero`, `.hero.hero-spec` (pitkä H1) | etusivu, hubi, käyttökohde | **core** · `core/cover` + InnerBlocks. Luottamusrivin logot ovat `bce/jalleenmyyjat` | |
| Tuotenäkymä | `.shop` (.gal .box .sizes .sku .dealers .uses) | TP | **ACF** · `bce/ostolaatikko` + `core/gallery`. Arvot tuotedatasta, ei sivulta | |
| Tekstikärki hakemistolla | `.lead` + `.idx` | Tarvikkeet | **ACF** · `bce/sivuhakemisto` generoi linkit H2-otsikoista; kärki itse on lohkomalli | `.topline` (A, kuollut 16.9.) |
| Valintakortti | `.pick .pick-tight .pick-parts` | etusivu, hubi | **core** · `core/query` `kayttokohde`-tyypistä | |
| Tuoteperhekortti | `.series .serie .series-4` | etusivu, hubi | **ACF** · `bce/tuoteperhekortit`. Kysely riittäisi, jos kuva olisi valokuva — avoin kysymys 2 | |
| Väiteruudukko | `.claims .claim .ic` | etusivu, hubi | **lohkomalli** · `core/columns` + `core/group`, ikoni `core/image` | `.claim .no` (numero, poistui kommentissa 4) |
| Väiteruudukko kolmelle | `.claims.claims-3 .claim` | JeKi | **lohkomalli** · sama malli kolmen sarakkeen varianttina | Lisätty 17.9.2026. Perusruudukko on neljä saraketta; kuudella väitteellä se jättäisi toiselle riville kaksi korttia ja kaksi tyhjää saraketta. 980 px kaksi, 560 px yksi |
| Referenssit | `.cases .case`, `.quote` | etusivu, hubi, TP, käyttökohde | **ACF** · `bce/referenssinostot`, suodatus kenttänä (sama `kohdetyyppi` / `pilariperhe` / valitut). Lainaus on `core/quote` | |
| Kuvarivi kolmelle | `.cases.cases-3 .case` (`.ph.ph-1610` + `p`) | käyttökohde | **core** · `core/gallery` kuvateksteillä | Lisätty 17.9.2026 käyttökohdesivun moduulille 2 *Kuvanosto*. Kolme kohdekuvaa rinnakkain, kuvateksti kertoo kohteen koon ja käytetyn mallin — ei otsikkoa eikä linkkiä. Pelkkä `.cases` on kaksipalstainen, jolloin kolmas kuva jäisi riippumaan. 820 px kaksi palstaa, 560 px yksi |
| Videolista työvaiheessa | `.vidlist li` (`a` + `.vt`) | **ei yhdelläkään elävällä sivulla** | **teema** · `ohje`-sivupohja renderöi `vaiheet`-repeaterin video-slotista | Lisätty 17.9.2026. Sivupohjan speksi v2: video renderöityy sen työvaiheen viereen jota se käsittelee (`slot`-kenttä), ei omana lohkonaan. Aihe näkyy tekstinä ilman että videota avataan |
| Ostorivi lohkon lopussa | `.buyrow` (`h3.lbl` + `.dealers` + `.contact` + `p.fine`) | autokatos | **ACF** · `bce/jalleenmyyjat` otsikolla ja yhteystiedoilla | Lisätty 17.9.2026. Sivupohjan moduuli 10 vaatii jakelumallin ja jälleenmyyjät samaan lohkoon; `.cta-block` antaa välin vain yläpuolelleen, joten ilman tätä selite oli 1 px päässä painikkeesta |
| Kohteen lukurivi | `.hero.hero-ref > .herocol` (`.hero-img` + `.kohdefakta > h2.lbl + dl.spec2`) | referenssi | **teema** · `reference`-sivupohja ACF-kentistä (`kohde_label`, `paikkakunta`, `valmistumisvuosi`, `kohteen_koko`, `pilariperhe`, `pilarien_maara`) | Lisätty 18.9.2026. Kortti 10 pyytää kohteen *kuvina ja lukuina*, joten kuva ja arvoparit ovat samassa palstassa eivätkä omina lohkoinaan. `dl.spec2` on tarkoituksella yksipalstainen (päätös 16.9.), joten täysleveänä lohkona kuusi paria jättäisi oikean puolen tyhjäksi. `.hero-ref` on `align-items:start` ja kuva täyttää palstan leveyden, jolloin kuvan ja lukurivin reunat ovat samassa linjassa. Kuusi paria, ei kahdeksan: loput toistavat tarinan |
| Tarinaosuus | `.tarina` (useita `p`-elementtejä) | referenssi | **core** · vapaa `post_content`. Rivin mitta teemasta | Lisätty 18.9.2026. Referenssin leipäteksti on asiakkaan omaa tekstiä eikä speksattua copya, joten kappaleita on 4–8 peräkkäin. Luokka on pelkkä kappaleväli (`--s4`); rivin mitta tulee oletuksesta (`p` 68ch). Ei uutta leiskaa |
| Aito kuva omalla rivillään | `figure.figwide > img` | autokatos | **core** · `core/image`, tasaus wide tai full | Lisätty 17.9.2026. A-601-leikkaus on 2 680 px leveä ja sen numeroselite lukee vasta noin 1 000 px:stä ylöspäin: mediaparin palstassa (552 px) selite renderöityi 5 px:n kokoisena. Kuvapaikka on yhä `.ph`; tämä on aidolle kuvalle |
| Latauskortti | `.dl` | TP, B | **ACF** · `bce/lataus`. Laskeutumissivu ja mitattu tapahtuma, joten paljas linkki ei kelpaa | `.dl-1` (kuollut) |
| Suodatinkortti | `.pick-how a (.ph-1610 .tx b .d)` + `.fstate .lnk` | Tarvikkeet | **ACF** · `bce/tarvikesuodatin`. Aito custom: korostaa, piilottaa, kuittaa ruudunlukijalle. JS-riippuvuus | **Piilottaa sopimattomat** (`.tcard[hidden]`, tyhjä ryhmä `.tgroup[hidden]`), **ei vieritä** — vaimennettu 400 px:n rivi on este, ei tieto. Kaavio kortissa kertoo liitostyypin; 16:10, koska 3:1 on liian matala oikealle kuvalle. Mobiilissa kortti kääntyy vaakaan (kuva 120 px vasemmalla), muuten viisi korttia veisi kaksi ruudullista. **Kuittausrivillä näkyy vain purkupainike ja vain kun valinta on päällä**; määrä jää `.sr[role=status]`-alueeseen ruudunlukijalle. `.fstate .msg`, `.fstate .more`, `.hitlbl`, `.hit` ja `.dim` kuolleet |
| Vaiheet kuvalla | `.flow .st` | etusivu, käyttökohde | **ACF** · `bce/vaiheet`. Askeleet 2–4 Options-sivulta (`shared_steps_2_3_4`), eivät sivulta | |
| Numeroitu lista | `.steps` | hubi, käyttökohde, mistä ostat | **core** · `core/list` numeroituna, lohkotyyli *steps* | `.build li` (kuollut). **Otsikko voi olla linkki 20.9.2026 alkaen** (`.steps b a`): sama käsittely kuin `.flow .st b a`:lla — ei alleviivausta vaan 2 px reunaviiva, ja sama osuma-alueen korotus (`padding:6px 0;margin:-6px 0`, 23 → 41 px ilman rivin kasvua). Askel on toiminto, joten otsikko on se sana jota klikataan; erillistä «lue lisää» ei lisätä. Linkki on opt-in askelkohtaisesti, ei koko listalle |
| Tuoterivi | `.tcard .tgrid .tid .timcol .frs .fr .tgroup` (+ `.sku .sizes-s`) | Tarvikkeet | **ACF** · `bce/tarvikerivit`. Koodi, EAN ja koot tuotedatasta — avoin kysymys 1 | **Variantti 2 palautettu 17.9.**: kaksi kuvaa (asennuskuva 592 px rivin korkuisena, tuotekuva 160 px), B:n koodi, EAN, Kopioi ja kokovalinta mukana. `.plot` jää versiolle B (`bce_tarvikkeet_b_spec.html`), `.pitem` TP:lle; `.tim` kuollut, kuvapaikat ovat `.ph` |
| Pistelista | `.uses` (oranssi piste, linkillä tai ilman), `.alt` (ohjaus) | TP, etusivu, hubi, käyttökohde | **core** · `core/list`, lohkotyyli *uses* | `.sure .fitlist .side .pts` (kuolleet) |
| Kahden haaran ohjaus | `.alt.alt-2` (`.ph.ph-1610` + h3 + p + `.more` vain haarassa joka vie muualle) | JeKi | **lohkomalli** · `core/columns` | Lisätty 17.9.2026 lohkolle *Pilarit vai JeKi*. Perus-`.alt` on kolme saraketta, jolloin kahdella haaralla kolmas jää tyhjäksi ja vertailu näyttää keskeneräiseltä. Ei taulukkoa: yksi kontrasti riittää tällä tasolla |
| Haitari | `details > summary .c + .b`, `.faq` | etusivu, tarvikkeet, käyttökohde | **core** · `core/details`. Jaettu UKK on `bce/ukk` Options-sivulta | Mikään ei ole valmiiksi auki (etusivun `open` poistettu 17.9.) |
| Datataulukko | `table.data .tw .dims .cpc tr[data-pick]` | TP | **ACF** · `bce/mittataulukko`. Luvut ovat tuotedataa, joten `core/table` antaisi kirjoittaa mitat uusiksi | `table.bom .fitt .loads .spec` (kuolleet) |
| Pinoutuva taulukko | `table.data.stack` (`th[scope=row]`, `td[data-lbl]`) | Perustustavat | **core** · `core/table`, lohkotyyli *stack*. Sisältö on sivukohtaista copya | Lisätty 18.9.2026. Alle 560 px otsikkorivi piiloon ja jokainen rivi omaksi lohkokseen; sarakeotsikko tulee `data-lbl`-attribuutista, joka täytetään samasta `C`-objektista kuin `thead`. Käytä kun taulukko on koko sivun tiivistelmä. `.dims` tekee päinvastoin (vaakavieritys), koska ammattilainen etsii yhtä lukua |
| Arvoparit | `dl.spec2`, rivinä `.techrow` (`div(dl.spec2 + p.fine.tech-note) + .ph.tekninen`) | TP, Tarvikkeet, B | **ACF** · tuotedatasta. Osa Ostolaatikkoa ja tuotesivupohjaa | `.facts .codes .code` (kuolleet) |
| Mittataulukon rivi | `.mittarivi` (taulukko + `.mkcol` > `figure.mk` + `p.fine.mkfine`) | TP | **ACF** · Mittataulukko ja Mittakaavio samassa lohkossa | Lisätty 18.9.2026. Kaaviossa ovat kirjaimet (`mittakaavio`-optio `luvut` pois), koska sen tehtävä tässä on selittää sarakeotsikot; millimetrit ovat taulukossa ja valitun koon arvot valitsimen vieressä. Mittataulukko ja sen selittävä kaavio vierekkäin: taulukko luetaan ensin, kaavio vastaa siihen mitä sarakeotsikko tarkoittaa. Taulukon vähimmäisleveys on 620 px (EAN-sarake poistui), kaavio 360 px; alle 1 080 px ne menevät allekkain, koska muuten taulukko vierittyisi vaakaan |
| Mittakaavio | `.mk` + `mittakaavio.js` | TP | **ACF** · ks. *Kaavio: mittakaavio* | `.ph.fig` (poistettu 16.9.) |
| Kokovalinta | `.sizes button[aria-pressed]` + `.sku` | B | **ACF** · osa Ostolaatikkoa | `.sizes-s`. TP käyttää 18.9.2026 alkaen tuotekuvallista valitsinta (alla); ostolaatikon `.sku` jää |
| Kokovalitsin tuotekuvalla | `tuotevalitsin(E,o)` → `.tval` (`.tval-row .tval-kuva .tval-valinnat .tval-koko`) + `.tval-act`, ja arvot erikseen `tuotevalitsin.tiedot(E,o,T)` → `dl.spec2.tval-mitat`. Rivi on `.mitoitus` (`.valitsin` + `.tiedot`), ja `kiinnita()` saa juurekseen rivin, jotta valitsin ja taulukko voivat olla eri soluissa | TP | **ACF** · `bce/kokovalitsin`. JS-riippuvuus ja tuotedata | Lisätty 18.9.2026. Radioryhmä kertoo mitä kokoja on, tuotekuva näyttää mitä ero tarkoittaa: valinta morffaa rungon samaan kankaaseen kiinteässä mittakaavassa, ja viereinen arvotaulukko kirjoittaa saman millimetreinä — koko hahmottuu ilman taulukon selaamista. Vaihtoehto on laatikko samalla tyylillä kuin ostolaatikon `.sizes button` (sama reunus, kulma ja valitun korostus), ja siinä lukee tuotekoodi ja **korkeus** oikeaan reunaan tasattuna: valinta tehdään korkeuden perusteella, eikä sitä saa joutua päättelemään koodin numerosta. Lukurivin järjestys on korkeus, paino, pohjalaatta, pilarin pää — kaksi ensimmäistä vaihtuvat koon mukana, kaksi jälkimmäistä ovat perheen vakioita. Luvut lasketaan `mittakaavio.js`:n taulukosta, sivu antaa vain nimet. Kuvan päällä on CAD-tyyliset mittaviivat (`tuotekuva`-option `mitoitus`) samassa aksonometriassa kuin kappale: korkeus pystysuoraan oikealle, pohjalaatta laatan etureunan suuntaisesti ja pään mitta pään yläpuolelle nostettuna. Ilman valintaa yksikään radio ei ole valittuna, kuva näyttää perheen suurimman koon ja lukurivi vaihteluvälit (heuristiikka 5); purkupainike näkyy vain kun valinta on päällä. Osuma-alue on koko rivi 44 px. Korvaa TP:llä `.koot`-painikkeet ja `.koko-m`-alasvedon, jotka jäävät kuolleiksi luokiksi. **Liukusäädin kokeiltiin ja hylättiin 18.9.**: viisi kokoa on viisi tuotetta eikä jatkumo, ja painot on nähtävä luettelona ilman vetämistä |
| Jälleenmyyjät | `SPECDEALERS(E,{cls,sijainti,size})` → `.dealers a (.dlogo .dgo)`, `.dealers-4` | kaikki, myös heron luottamusrivi | **ACF** · `bce/jalleenmyyjat`. Data ACF Options -sivulta (`shared_retailers`), **ei koskaan sivulta**. Kentät `sijainti` ja `koko` ovat mittauksen ulottuvuuksia | Yksi lähde `SPEC.dealers` (brändisivu + TP-kokojen tuotesivut, tarkistettu 17.9.). Aito linkki ketjun verkkokauppaan uuteen välilehteen, ↗ ja ruudunlukijateksti. `.logos .lg .lgrow` kuolleet 17.9. |
| Pikkukuvat | `.thumbs button` | TP | **core** · `core/gallery` | |
| Mobiilin alapalkki | `.bar` (kuori, `SPEC.bar`) | kaikki paitsi luuranko | **teema** · sivupohja, ei lohko. Pari tulee sivun kentästä | `bar:false` jättää pois, `bar:"ostat"` kääntää järjestyksen kun sivun ensisijainen on ostopaikka (tarvikkeet), **`bar:[[teksti,osoite,tapahtuma],…]` antaa sivun oman parin** (17.9.2026, JeKi: konfiguraattori ei laske sokkelielementtejä, joten oletuspari lupaisi toiminnon jota ei ole). Sivukohtainen palkki poistui TP:ltä 16.9. |
| Kuori | `.urow header.site nav.crumb footer` (`SPECSHELL`) | kaikki | **teema** · Blade-sivupohja. Valikko WP-valikosta; alasvetojen neljä sääntöä ja leveysmitoitus ovat teeman koodia | `.abar` (poistettu 11.9., kuori siivoaa) |

## 4 · Siirtotaulukko

Mitä on tehty, mitä on tekemättä, mikä vaatii päätöksen. Tehdyt on mitattu 390 px:llä
ennen ja jälkeen.

| Kohta | Tila | Huomio |
|---|---|---|
| Token-asteikot `:root`-lohkoon | **tehty 16.9.** | `--s1…--s8 --fs-* --r-* --tap --ease` |
| `.hero-2` → `.more`, 44 px joka paikassa | **tehty 16.9.** | 31 esiintymää viidellä sivulla, 0 jäljellä. `.fine .more` pysyy inline |
| Rivilinkkien osuma-alue ≥ 24 px (murupolku, käyttökohteet, alatunniste, luuranko, kielivalinta, apurivi) | **tehty 16.9.** | Mitattu: murupolku 17→38, käyttökohteet 21→39, alatunniste 18→26, kieli 34→44. Rivikorkeus ei kasvanut |
| Numerointi `--accent` → `--accent-dark` (`.flow .n`, `.steps li::before`) | **tehty 16.9.** | 3,43:1 → 5,2:1 |
| `.ph` kanoninen, `.ph.fig` poistettu | **tehty 16.9.** | Vanha `.ph` kantoi `min-height:280px`, joka venytti laatikot ulos sarakkeesta |
| `.lbl` kanoninen | **tehty 16.9.** | Paino 600 kaikissa; `.box .lbl` oli 400 |
| Hubin jälleenmyyjälogot `#` → `/mista-ostat/` | **tehty 16.9.** | Sama kohde kuin etusivulla |
| Hubin ja tarvikesivun heron `.btn-1` ankkurista sivunlataukseksi | **tehty 16.9.** | Hubi → `/konfiguraattori/`, tarvikkeet → `/mista-ostat/` (kortti 4: ensisijainen on ostopaikka) |
| Jälleenmyyjälinkit aidoiksi verkkokauppalinkeiksi, yksi renderöijä kuoressa | **tehty 17.9.** | Heron logorivi oli spanneja ilman linkkiä, ostolohkot `#` tai /mista-ostat/. Nyt `SPECDEALERS`: logo + *Osta verkkokaupasta* ↗, TP:n kokovalinta vaihtaa linkin koon tuotesivuun. Osoitteet BCE:n brändisivuille K-Raudassa, Starkissa, Hartmanilla ja grusterminalen.fi:n Perustuspilarit-kategoriaan |
| Lohkojen markup yhtenäistetty sivujen välillä (`.cfg`, `.dealers`, `.band`-painike, FAQ) | **tehty 17.9.** | Sama lohko renderöidään samasta rakenteesta joka sivulla; katalogisivu on vertailukohta |
| Hubista etusivun toistot pois | **tehty 16.9.** | `.claims .cases` JeKi `.img-band` poistettu, 657 → 433 sanaa |
| TP: *Hyppää mittoihin* ja *Kaikki jälleenmyyjät* | **ei tehdä** | Audit piti niitä renderöimättä jääneinä kenttinä; Miro-laput (kierros 2) pyysivät molemmat pois. Kentät jäävät C:hen kommentoituina |
| Apurivi 44 px ilman kasvua | **tehty 16.9.** | 49→44 px |
| `.next`-lopetuslinkki ja inline-tyylit pois | **tehty 16.9.** | Inline `style` 22 → 0 viidellä sivulla. Lisäksi `section.tight`, `.pro-strip h2`, `.logos a`, `.guide .ph`. Väli yhtenäistyi 18–28 → 24 px |
| Kuvapaikat → `.ph` lohko kerrallaan | tekemättä | Tehdään kun lohkoa muuten muokataan |
| Kentät → `.field` | **tehty 16.9.** | `.guide input` ja `.find input` korvattu; `.search input` ja kuollut `.acts input` jäävät |
| Kuollut CSS pois (~45 luokkaa, ks. luku 5) | tekemättä | Vasta kun `docs/` on committoitu, samalla kun `arkisto/` poistetaan |
| Katkaisukohdat 15 → 3 | tekemättä | Lohko kerrallaan |
| Jälleenmyyjät etusivulla ja hubilla `.logos` → `.dealers` | **tehty 17.9.** | Sama lohko joka sivulla. Muuttaa hyväksytyn etusivun ostolohkon; näytetään asiakkaalle |
| Alapalkki `.bar` kaikille sivuille joilla on ensisijainen toiminto | **tehty 16.9.** | Kuori renderöi (`SPEC.bar`), `bar:false` jättää pois. `body.has-bar` kantaa paddingin |
| Kuoren CTA mobiilissa piiloon | **tehty 16.9.** | Kuori tulostaa nyt luokan `.hdr-cta`; ylätunniste 123 → 76 px |
| Konfiguraattorin nimi | **tehty 16.9.** | *Laske pilarien määrä* kuoreen, hubiin ja B:hen; tapahtuma `cta_konfiguraattori` + `data-sijainti`. Poikkeama spec 1.0:sta, kerrotaan asiakkaalle |
| Isompi kohde -painike | **tehty 17.9.** | *Pyydä tarjous* joka sivulla (kohde on tarjouspyyntö) |
| Tarvikesivu A vai B | **tehty 16.9.: yhdistelmä** | A:n suodatin (korostaa, ei piilota eikä vieritä) + B:n tuoterivi (koodi, EAN, Kopioi) + yksi tuotedata. `[TÄYTETTÄVÄ]` 37 → 15, Kopioi 0 → 8 |
| JeKi-sokkelisivu `/jeki-sokkeli/` | **tehty 17.9.** | Kymmenen lohkoa asiakkaan copysta. Kaksi uutta varianttia (`.claims-3`, `.alt-2`), kuoreen sivukohtainen alapalkkipari. Ei konfiguraattorilohkoa eikä jälleenmyyjäriviä: kumpikaan ei tunne tätä tuotetta |
| `table.data` läpinäkyväksi oletuksena | **tehty 17.9.** | Valkoinen levy oli oletus, ja `.dims`, `.loads` ja `.spec` kumosivat sen kukin erikseen — oletus oli väärä, ei käyttökohteet. Kolme kumoavaa sääntöä poistettu. Valkoista taulukkoa ei käytä yksikään sivu |
| Jälleenmyyjätoiminnon nimi yhtenäistetty | **tehty 17.9.** | Kahdeksan muotoa → kolme (ks. luku 2). Muutettu seitsemällä sivulla: etusivu, hubi, TP, tarvikkeet, autokatos, käyttökohde, JeKi. Tarkistettu renderöidystä DOMista, ei lähdekoodista. `bce_tarvikkeet_b_spec.html` jätettiin ennalleen jäädytettynä vertailukappaleena |
| Vertailusivu `/pilariperustus/perustustavat/` | **tehty 18.9.** | Kortti 11. Yksi uusi luokka (`table.data.stack`) ja yksi oletuskorjaus: `.uses li` sai `max-width:68ch`, sama mitta kuin kappaleella — listassa on nyt lihavoitu väite ja perustelu samalla rivillä. Ei uusia tapahtumanimiä |
| `.btn-1` teksti alle 19 px | **tehty 16.9.** | `.btn-s.btn-1` ja `.bar .btn-1` pohja `--accent-dark`, 5,5:1. Iso painike säilyy brändioranssina |

## 5 · Kuollut CSS

Määritelty `bce-v4.css`:ssä, ei käytössä millään elävällä sivulla eikä kuoressa
(tarkistettu 16.9.2026, `comm` luokkalistoista):

```
.top .tool .tool-in .tool-key .dot .f .val .result .bom .acts input .build .buy .shops
.sure .rel .two .codes .code .ph.fig .combo .certs .aside-box .close .footnote .perf
.bars .bar-row .bar-track .bar-fill .key .lb .vl .hero-fam .facts .fitlist .spec .loads
.first .fitt .dl-1 .desc .part .note .spec-head
.topline .tcard .tgrid .tid .frs .fr .tim .timcol .ta .tt .tk .tu
```

`.hdr-cta` ja `.jump` eivät ole enää kuolleita: kuori tulostaa `.hdr-cta`-luokan 16.9. lähtien ja
TP:n *Hyppää mittoihin* renderöidään `.jump`-kappaleessa. `.topline` ja `.tcard`-perhe kuolivat
samana päivänä, kun tarvikesivun versio A korvattiin yhdistelmällä.

`.spec-head` lisätään JS:llä (`classList.add`), joten se ei ole kuollut vaan väärä
positiivinen. `.acts input` on elävä vain `.close .acts`-muodossa, joka
on kuollut.

Poistetaan yhdellä kertaa, kun `docs/` on committoitu ja `arkisto/` poistuu: silloin
tiedosto lyhenee arviolta neljänneksen (nyt 535 sääntöä) eikä katalogiin jää luokkia,
joita kukaan ei voi nähdä.

## 6 · Miten komponentti lisätään

1. Tarkista katalogi. Jos tehtävälle on luokka, käytä sitä; jos se ei taivu, korjaa sitä.
2. Kirjoita sääntö `bce-v4.css`:n loppuun oman otsikkonsa alle, arvot tokeneista. Kommentti
   kertoo miksi lohko on olemassa ja mitä se mitattiin (390 px).
3. Lisää kohta `bce_design_system.html`:n oikeaan osioon: nimi, luokka, käyttöpaikat,
   sääntö, demo. Demo käyttää samaa luokkaa, ei kopiota.
4. Lisää rivi tämän dokumentin lukuun 3.
5. Mittaa selaimesta: kosketuskohde, kontrasti, vaakavieritys 390 px:llä.
