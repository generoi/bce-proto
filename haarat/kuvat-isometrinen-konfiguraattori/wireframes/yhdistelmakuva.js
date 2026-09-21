/* Yhdistelmäkuva: tarvike ja siihen kuuluva puu samassa kuvassa.

   Erillinen tarvikekuva kertoo miltä osa näyttää. Se ei kerro sitä, mikä
   asiakkaan kysymys oikeasti on: **miten päin puu menee siihen kiinni.**
   Pilarikengän ura on 70 mm eikä 70 mm mitään — kuvassa siinä on 70 × 70 tolppa,
   ja silloin uran mitta lakkaa olemasta luku ja alkaa olla asia.

   Tämä tiedosto ei piirrä mitään itse. Se vain asettaa kaksi olemassa olevaa
   generaattoria samaan kankaaseen:
     tarvikekuva.js   teräs, cel-varjostus, osan geometria
     palkkikuva.js    puu, syykuvio, päätypuu
   Molemmat lukevat kameran tuotekuva.js:stä, joten kolme generaattoria on
   väistämättä samassa kulmassa.

   ---- Piirtojärjestys on koko juttu ----
   Puu on tarvikkeen *sisällä*: kengän urassa etulevyn takana, satulassa
   levyjen välissä, laatan päällä. Sitä ei voi piirtää tarvikkeen päälle (silloin
   puu on kengän edessä) eikä alle (silloin takalevy piirtyy puun päälle).
   Siksi tarvikekuva.js kutsuu `C.puu()`-koukkua siinä kohtaa piirtoa, johon puu
   kuuluu — sen tietää vain osan oma piirtofunktio.

   ---- Puun paikka lasketaan tarvikkeen mitoista ----
   Yhtään sijoituslukua ei ole kirjoitettu käsin. `siirto` johdetaan
   `tarvikekuva.tieto(osa)`:n arvoista (ura, palkki, kork, t, syvyys), joten jos
   tarvikkeen mitta korjataan, puu seuraa perässä eikä jää leijumaan.

   ---- Neljä asiaa, jotka on varmistettava BCE:ltä ----
   Nämä ovat kuvan väitteitä, eivät tuotetietoa. Ensimmäinen on eri luokkaa kuin
   muut: siinä lähteet ovat keskenään ristiriidassa, ja kuva on toisen puolella.

     0  P-PIK: PIILOKIINNIKE VAI EI. Tarvikesivu, laskurin tuotetieto ja laskurin
        oma sääntö sanovat kaikki, että P-PIK on piilokiinnike. Silti sen
        geometriassa levy on tolpan kyljessä, jolloin se näkyy. Jos levy kuuluu
        tolpan päähän sahattuun uraan, tämä kuva on väärin päin. Älä käytä paria
        ennen vastausta.

     1  PALKKIKENKÄÄN PIIRRETTY KAKSI LAUTAA. PAK-100×150:n satula on 100 mm
        leveä ja laskurin palkki on 48 mm. Kaksi lautaa vierekkäin on 96 mm, ja
        se täyttää satulan; yksi 48 mm:n lauta jättäisi 52 mm ilmaa. Kuva siis
        olettaa kaksoispalkin. Jos BCE tarkoittaa yhtä lautaa, vaihda
        `maara: 1` — vaihtoehto on koodissa valmiina, ja silloin kuvasta tulee
        kysymys eikä ohje.
     2  TOLPPA ON PIIRRETTY URAN SUURIMPAAN MITTAAN. PIK 50-70:ssä on 70 × 70 ja
        PIK 90-140:ssä 140 × 140. Alaraja on yhtä oikea, mutta väljä tolppa
        näyttäisi väärin asennetulta.
     3  TERÄSLAATAN PÄÄLLÄ LAUTA LAPPEELLAAN. Matriisin suositussarake on tyhjä
        (`docs/pilari-tarvike-matriisi.md`, luku 4): laatta on «tasainen alusta»,
        muttei sano minkä alusta. 48 × 148 lappeellaan osuu 150 × 150 -laattaan
        niin, että kaikki neljä ruuvinreikää jäävät laudan alle — se on syy,
        miksi juuri tämä pari on piirretty, ei vahvistus siitä että näin tehdään.

   Puun pituus on aina näytepalan pituus, ei tuotteen pituus (ks. palkkikuva.js). */
(function () {
  "use strict";

  var PR = (window.tuotekuva && window.tuotekuva.projektio) ||
           {CX: 0.866, CY: 0.42};
  var CX = PR.CX, CY = PR.CY;

  /* ---- Parit ---------------------------------------------------------------
     `puut` saa tarvikkeen oman tietueen ja palauttaa puukappaleet maailman
     millimetreinä. Muista, miten palkkikuva.js:n akselit toimivat:
       akselit[0] = pituus u   (keskitetty siirron ympärille)
       akselit[1] = paksuus v  (keskitetty)
       akselit[2] = korkeus w  (alkaa siirrosta, ei keskitetty)
     Siksi w:n suunnassa siirtoon tulee −h/2 kun kappale halutaan keskelle. */
  var PARIT = {
    "pik-50-70": {
      osa: "pik-50-70", otsikko: "PIK 50-70 ja 70 × 70 tolppa",
      selite: "Tolppa nousee uran pohjalta levyjen välistä. Etulevy jää tolpan " +
              "eteen, ja ruuvit menevät levyn reikien läpi tolppaan molemmilta " +
              "puolilta.",
      puut: function (T, p) { return [tolppa(T, p || 190)]; }
    },
    "pik-90-140": {
      osa: "pik-90-140", otsikko: "PIK 90-140 ja 140 × 140 tolppa",
      selite: "Sama liitos isompana: katoksen kannatintolppa. Kengän pohjassa on " +
              "pyöreä säätölaatta, jolla tolpan korkeus säädetään ennen kiristystä.",
      puut: function (T, p) { return [tolppa(T, p || 240)]; }
    },
    "p-pik-50x70": {
      osa: "p-pik-50x70", otsikko: "P-PIK 50×70 ja 70 × 70 tolppa",
      selite: "Puolikas kenkä: yksi levy ja jalka pilarin päälle. Kuvassa levy on " +
              "tolpan kyljessä, mutta tuote on kaikkialla muualla nimetty " +
              "piilokiinnikkeeksi — ristiriita on kesken, ks. alla.",
      /* ⚠️ TÄMÄ PARI ON RISTIRIIDASSA LÄHTEIDENSÄ KANSSA, EIKÄ SITÄ SAA KÄYTTÄÄ
         ENNEN KUIN BCE VASTAA.
         Kolme lähdettä neljästä sanoo P-PIK:n olevan piilokiinnike:
           tarvikesivun copy   "Piilokiinnike silloin kun kiinnikkeitä ei haluta
                               näkyviin", tagit 50-70 + piilo
           laskurin tuotetieto "kiinnike ei näy ulospäin"
           laskurin sääntö     fixing='piilo' → P-PIK (näkyvä on PIK 50-70)
         Neljäs, pilari-tarvike-matriisin luku 4, sanoo "näkyvät liitokset".
         Piilossa oleva levy tarkoittaa, että levy uppoaa tolpan päähän sahattuun
         uraan eikä ole sen kyljessä. Silloin tämä kuva on väärin päin: tolpan
         pitäisi niellä levy, ja näkyviin jäisi vain jalka ja tapit.
         Kuva ei kuitenkaan piirrä uraa arvaukselta, koska tarvikekuva.js:n
         geometria (luettu BCE:n tuotekuvasta) on yksi 5 mm:n levy ilman uraa —
         eli geometria ja tuoteteksti ovat eri mieltä. Toinen niistä on väärä.
         Kysyttävä BCE:ltä: uppoaako P-PIK:n levy tolpan uraan vai ruuvataanko
         tolppa levyn kylkeen? */
      avoin: "Kolme lähdettä sanoo P-PIK:n olevan piilokiinnike, mutta " +
             "tarvikekuvan geometriassa levy on tolpan kyljessä. Kuva noudattaa " +
             "geometriaa. Jos levy uppoaa tolpan uraan, kuva on väärin päin.",
      /* Pystylevy on x-välillä 0…t, joten tolppa on sen takana (x < 0). */
      puut: function (T, pit) {
        var p = tolppa(T, pit || 190);
        p.siirto[0] = -T.ura / 2;
        return [p];
      }
    },
    "pak-100x150": {
      osa: "pak-100x150", otsikko: "PAK-100×150 ja 2 × 48 × 148",
      selite: "Palkki lasketaan satulaan ja naulataan levyjen reikien läpi. " +
              "148 mm mahtuu 150 mm:n satulaan; 198 mm ei mahdu, ja siihen on " +
              "PAK-100×200.",
      puut: function (T, p) { return palkit(T, "48x148", 2, p || 270); }
    },
    "pak-100x200": {
      osa: "pak-100x200", otsikko: "PAK-100×200 ja 2 × 48 × 198",
      selite: "Sama kenkä korkeampana. Satulan korkeus on se mitta, joka " +
              "ratkaisee palkkikoon — 198 mm mahtuu tähän, ei 150:een.",
      puut: function (T, p) { return palkit(T, "48x198", 2, p || 270); }
    },
    /* ---- Kolme täyttä liitosta: kiinnike, palkki ja lauta samassa kuvassa ----
       Nämä vastaavat eri kysymykseen kuin pelkkä pari. Pari kertoo miten päin
       puu menee kiinnikkeeseen; täysi liitos kertoo mihin se johtaa — että
       tästä tulee terassin pinta. Sama kolmikerroksinen rakenne kuin
       terassikuva.js:ssä, mutta yhden liitoksen kohdalta. */
    "pik-50-70-terassi": {
      osa: "pik-50-70", otsikko: "PIK 50-70, runkopalkki 48 × 148 ja laudoitus",
      selite: "Runkopalkki lasketaan kengän uraan ja ruuvataan levyjen läpi " +
              "molemmilta puolilta. Terassilauta tulee palkin päälle poikittain.",
      /* ⚠️ TÄMÄ KUVA OLETTAA, ETTÄ PIK 50-70:EEN TULEE VAAKAPALKKI, ja se on
         eri oletus kuin parilla «pik-50-70», jossa on pystytolppa. Lähteet
         sanovat molempia:
           laskurin sääntö   fixing='nakyva' + palkki 48×148 → PIK 50-70,
                             perusteluteksti «tarkoitettu yhdelle lankulle»
           tarvikesivun kortti «Terassin runkopalkki — ohuemmat runkopalkit ja
                             välilankut, 50–70 mm»
           TP-sivun rivi     «Pystytolpalle. Puutolppa asetetaan kengän sisään»
         Ura on 70 mm kummassakin luennassa, eikä geometria ratkaise asiaa:
         70 × 70 tolppa ja 48 mm:n palkki mahtuvat molemmat.
         Kysyttävä BCE:ltä: onko PIK 50-70 tolpalle vai runkopalkille — vai
         molemmille? Siihen asti molemmat kuvat ovat olemassa eikä kumpaakaan
         ole valittu toisen puolesta. */
      avoin: "Laskuri ja tarvikesivu sanovat PIK 50-70:n olevan runkopalkille, " +
             "TP-sivun rivi pystytolpalle. Tämä kuva noudattaa ensimmäistä, " +
             "pari «pik-50-70» jälkimmäistä.",
      puut: function (T, p) { return palkit(T, "48x148", 1, p || 300); },
      nosto: 95,
      paalla: function (T) {
        var M = window.palkkikuva.mitat("48x148");
        return laudoitus(T.t + M.h, 230, 3);
      }
    },
    "pak-100x150-terassi": {
      osa: "pak-100x150", otsikko: "PAK-100×150, niskapalkki ja laudoitus",
      selite: "Niskapalkki lasketaan satulaan ja naulataan levyjen reikien läpi. " +
              "Terassilauta tulee palkin päälle poikittain — tästä liitoksesta " +
              "tulee terassin pinta.",
      puut: function (T, p) { return palkit(T, "48x148", 2, p || 300); },
      nosto: 95,
      paalla: function (T) {
        var M = window.palkkikuva.mitat("48x148");
        return laudoitus(T.t + M.h, 230, 3);
      }
    },
    "tl-150x150-terassi": {
      osa: "tl-150x150", otsikko: "TL 150×150×8, palkki ja laudoitus",
      selite: "Laatta on tasainen alusta: palkki ruuvataan sen päälle laatan " +
              "neljästä reiästä, ja laudoitus tulee palkin päälle. Kiinnikettä " +
              "ei tarvita, kun rakenne lepää suoralla tukipinnalla.",
      /* Palkki on syrjällään laatan päällä, ei lappeellaan kuten parissa
         «tl-150x150»: lappeellaan makaava lauta ei kanna laudoitusta, ja juuri
         laudoitus on tämän kuvan aihe.

         Myös palkki on räjäytetty irti laatasta. Ilman sitä 48 mm leveä ja
         148 mm korkea palkki peittää 150 × 150 -laatan tästä kulmasta lähes
         kokonaan — sama havainto kuin parissa «tl-150x150», jossa lauta
         peittäisi koko tarvikkeen. Kenkäpareissa palkkia ei räjäytetä, koska
         siellä koko asia on se, että palkki on urassa. */
      rajahdys: 85,
      puut: function (T, p) {
        return [{koko: "48x148", akselit: "yxz", siirto: [0, 0, T.t],
                 pituus: p || 300, siemen: 11}];
      },
      nosto: 95,
      paalla: function (T) {
        var M = window.palkkikuva.mitat("48x148");
        return laudoitus(T.t + M.h, 230, 3);
      }
    },
    "tl-150x150": {
      osa: "tl-150x150", otsikko: "TL 150×150×8 ja 48 × 148 lappeellaan",
      selite: "Laatta on tasainen alusta: lauta lasketaan sen päälle ja " +
              "ruuvataan kiinni laatan neljästä reiästä alakautta. 148 mm:n " +
              "lape peittää kaikki neljä reikää — ja juuri siksi tämä on " +
              "ainoa pari, joka on piirretty räjäytettynä: paikalleen " +
              "laskettuna lauta peittäisi koko tarvikkeen.",
      /* Nostettu 75 mm ja katkoviiva kokoonpanon suuntana. Ilman räjäytystä
         kuvassa näkyisi lauta ja sen alta kierretapin kärki. */
      rajahdys: 75,
      puut: function (T, p) { return [lappeellaan(T, "48x148", p || 300)]; }
    }
  };

  /* Pystytolppa pilarikengän uraan. Paksuus = uran mitta, jolloin tolppa täyttää
     uran; poikkileikkaus on neliö, koska kenkä ei kanna litteää lautaa. */
  function tolppa(T, pit) {
    return {
      koko: T.ura + "x" + T.ura,
      akselit: "zxy",                 /* pituus ylös, paksuus x, leveys y */
      siirto: [0, -T.ura / 2, pit / 2],
      pituus: pit
    };
  }

  /* Palkit palkkikengän satulaan. Satulan pohjalevy on paksuudeltaan T.t, joten
     palkin alapinta on sen päällä — ei kengän nollatasossa. */
  function palkit(T, koko, maara, pit) {
    var M = window.palkkikuva.mitat(koko), lista = [], i;
    var leveys = maara * M.b, alku = -leveys / 2 + M.b / 2;
    for (i = 0; i < maara; i++) {
      lista.push({
        koko: koko,
        akselit: "yxz",               /* pituus y:n suuntaan satulan läpi */
        siirto: [alku + i * M.b, 0, T.t],
        pituus: pit,
        siemen: i * 37                /* eri lauta, ei sama lauta kahdesti */
      });
    }
    return lista;                     /* kauimmainen ensin: pienin x piirtyy ensin */
  }

  /* ---- Laudoitus palkin päälle --------------------------------------------
     Kolme terassilautaa poikittain palkin yli. Kolme eikä yksi, koska yksi lauta
     lukee kappaleena ja kolme lukee lattiana — ja juuri se on kuvan väite: tähän
     liitokseen tulee terassin pinta. Enempää ei piirretä, koska neljäs lauta
     peittäisi liitoksen, joka on kuvan aihe.

     Laudat kulkevat x:n suuntaan, palkit y:n — samoin päin kuin terassikuvassa,
     jotta sama rakenne ei ole kahdessa kuvassa eri päin.

     Piirretään tarvikkeen JÄLKEEN eikä sen puu-koukusta: lauta on liitoksen
     päällä eikä sen sisällä, joten se kuuluu piirtojärjestyksen loppuun. Puu
     kengän urassa on eri asia ja tulee edelleen koukusta. */
  var LAUTA = "28x120", RAKO = 4;

  function laudoitus(zYla, pit, maara, koko) {
    var M = window.palkkikuva.mitat(koko || LAUTA), lista = [], i;
    var jako = M.h + RAKO;
    var alku = -((maara || 3) * jako - RAKO) / 2;
    for (i = 0; i < (maara || 3); i++) {
      lista.push({
        koko: M.koko,
        akselit: "xzy",              /* pituus x, paksuus pystyyn, leveys y */
        siirto: [0, alku + i * jako, zYla + M.b / 2],
        pituus: pit,
        siemen: 60 + i * 23          /* eri lauta, ei sama lauta kolmesti */
      });
    }
    return lista;
  }

  /* Lauta lappeellaan teräslaatan päällä: paksuus pystyssä, leveys vaakatasossa. */
  function lappeellaan(T, koko, pit) {
    var M = window.palkkikuva.mitat(koko);
    return {
      koko: koko,
      akselit: "xzy",                 /* pituus x, paksuus pystyyn, leveys y */
      siirto: [0, -M.h / 2, T.t + M.b / 2],
      pituus: pit
    };
  }

  /* ---- Kankaan koko --------------------------------------------------------
     Silhuetti lasketaan tarvikkeen ja jokaisen puukappaleen laatikon yhdisteestä.
     Kahdeksan kulmaa per laatikko projisoituna riittää, koska projektio on
     lineaarinen: kuperan kappaleen kuva on sen kulmien kuvan kupera verho. */
  function rajat(laatikot) {
    var xs = [], ys = [];
    laatikot.forEach(function (L) {
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) for (var k = 0; k < 2; k++) {
        xs.push((L.x[i] - L.y[j]) * CX);
        ys.push((L.x[i] + L.y[j]) * CY - L.z[k]);
      }
    });
    return {x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
            y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys)};
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- Julkinen ------------------------------------------------------------
       pari      "pak-100x150" — avain PARIT-taulukkoon
       korkeus   kankaan korkeus pikseleinä (oletus 420)
       skaala    px/mm suoraan; ohittaa korkeuden, kun usea pari piirretään
                 samaan mittakaavaan
       maara     ohittaa lautojen määrän palkkikengässä (ks. avoin kohta 1)
       id        pakollinen kun samalla sivulla on kaksi kuvaa
       koriste, syyt, oksat, rakeisuus */
  function yhdistelma(o) {
    o = o || {};
    var KO = kappaleet(o);
    if (!KO) return "";

    var R = rajat(laatikot(KO)), reuna = 18;
    var K = o.skaala || (o.korkeus || 420) / (R.y1 - R.y0);
    var CW = Math.round((R.x1 - R.x0) * K + 2 * reuna);
    var CH = Math.round((R.y1 - R.y0) * K + 2 * reuna);
    var ox = reuna - R.x0 * K, oy = reuna - R.y0 * K;
    var viiva = Math.max(0.9, Math.min(2, CW / 320));

    var juuri = "yh-" + String(o.id || o.pari).toLowerCase().replace(/[^a-z0-9-]/g, "");
    var hidT = juuri + "-t", hidP = juuri + "-p";
    var out = [];
    piirraKappaleet(out, KO, o, K, ox, oy, hidT, hidP, viiva);

    var nimike = o.nimike || KO.P2.otsikko + ", havainnekuva vinosti ylhäältä";
    var a11y = o.koriste ? ' aria-hidden="true" focusable="false"'
                         : ' role="img" aria-label="' + esc(nimike) + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + ">" +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") +
      window.tarvikekuva.defs(hidT, CH) +
      window.palkkikuva.defs(hidP, CH, o.rakeisuus !== false) +
      out.join("") + "</svg>";
  }

  /* ---- Kokoonpano: mitä kuvassa on ja missä --------------------------------
     Eriytetty omaksi funktiokseen 20.9.2026, kun asennuskuva.js alkoi tarvita
     saman parin pilarin pään päälle. Kokoonpano lasketaan yhdessä paikassa ja
     piirretään toisessa, jotta kaksi kuvaa ei voi olla eri mieltä siitä, missä
     lauta on. */
  function kappaleet(o) {
    var P2 = PARIT[o.pari];
    if (!P2 || !window.tarvikekuva || !window.palkkikuva) return null;
    var T = window.tarvikekuva.tieto(P2.osa);
    /* `pituus` on näytepalan pituus, ei tuotteen pituus (ks. palkkikuva.js).
       Asennuskuva pyytää lyhyempää palaa kuin pari: siinä kuvassa on mukana myös
       pilari, ja täysimittainen palkki vie kuvan leveyden niin, että liitos —
       kuvan aihe — jää nurkkaan. Parin oma oletus säilyy, kun lukua ei anna. */
    var puut = P2.puut ? P2.puut(T, o.pituus) : [];
    /* Liitoksen päälle tuleva laudoitus. Eri lista kuin `puut`, koska
       piirtojärjestys on eri: puu on tarvikkeen sisällä ja tulee koukusta,
       laudoitus sen päällä ja tulee viimeisenä. */
    var paalla = P2.paalla ? P2.paalla(T, o.pituus) : [];
    /* Laudoitus nostetaan irti palkista. Ilman nostoa se peittää juuri sen
       liitoksen, joka on kuvan aihe — sama havainto ja sama ratkaisu kuin
       parissa «tl-150x150». Nosto on pystysuora eikä muuta mitään muuta:
       mitat, asento ja keskitys ovat samat kuin paikalleen laskettuna. */
    var nosto = o.nosto == null ? (P2.nosto || 0) : o.nosto;
    if (o.maara && puut.length > 1) puut = puut.slice(0, o.maara);
    /* Räjäytys nostaa puun pystysuoraan irti tarvikkeesta. Se ei muuta mitään
       muuta: mitat, asento ja keskitys ovat samat kuin paikalleen laskettuna. */
    var raj = o.rajahdys == null ? (P2.rajahdys || 0) : o.rajahdys;
    if (raj) puut = puut.map(nostettu(raj));
    /* Laudoitus nousee palkin räjäytyksen PÄÄLTÄ, ei sen sijaan: muuten
       kolmiportaisessa liitoksessa (laatta · palkki · lauta) lauta laskeutuisi
       palkin sisään heti kun palkkia nostetaan. */
    if (raj + nosto) paalla = paalla.map(nostettu(raj + nosto));
    return {P2: P2, T: T, puut: puut, paalla: paalla, nosto: nosto, raj: raj};
  }

  function nostettu(dz) {
    return function (q) {
      var r = {}, avain;
      for (avain in q) r[avain] = q[avain];
      r.siirto = [q.siirto[0], q.siirto[1], q.siirto[2] + dz];
      return r;
    };
  }

  /* Silhuetin laatikot maailman millimetreinä: tarvike ja jokainen puukappale. */
  function laatikot(KO) {
    return [KO.T.laatikko]
      .concat(KO.puut.map(window.palkkikuva.laatikko))
      .concat(KO.paalla.map(window.palkkikuva.laatikko));
  }

  /* ---- Piirto annettuun kohtaan kangasta -----------------------------------
     (ox, oy) on tarvikkeen nollataso eli se piste, jossa tarvike kohtaa pilarin
     pään. Sama sopimus kuin tuotekuva.piirra:lla, palkkikuva.piirra:lla ja
     tarvikekuva.piirra:lla. */
  function piirraKappaleet(out, KO, o, K, ox, oy, hidT, hidP, viiva) {
    var T = KO.T, puut = KO.puut, paalla = KO.paalla;

    /* Puu piirtyy koukusta, eli tarvikkeen sisältä oikeaan kohtaan
       piirtojärjestystä. Kappaleet järjestyksessä kauimmaisesta lähimpään. */
    window.tarvikekuva.piirra(out, {
      osa: KO.P2.osa, K: K, ox: ox, oy: oy, hid: hidT, viiva: viiva,
      piilotaso: o.piilotaso,
      puu: function () {
        puut.forEach(function (spec, i) {
          window.palkkikuva.piirra(out, {
            koko: spec.koko, akselit: spec.akselit, siirto: spec.siirto,
            pituus: spec.pituus, siemen: spec.siemen || 0,
            K: K, ox: ox, oy: oy, hid: hidP, cid: "-" + i, viiva: viiva,
            varjo: false,                     /* ei alustaa: tarvike ei seiso maassa */
            syyt: o.syyt !== false, oksat: o.oksat !== false,
            rakeisuus: o.rakeisuus !== false, merkinta: false
          });
        });
      }
    });

    /* Laudoitus viimeisenä: se on liitoksen päällä, joten se on myös lähimpänä
       kameraa. Pienin y piirtyy ensin, kuten terassikuvassa. */
    paalla.forEach(function (spec, i) {
      window.palkkikuva.piirra(out, {
        koko: spec.koko, akselit: spec.akselit, siirto: spec.siirto,
        pituus: spec.pituus, siemen: spec.siemen || 0,
        K: K, ox: ox, oy: oy, hid: hidP, cid: "-l" + i, viiva: viiva,
        varjo: false,
        syyt: o.syyt !== false, oksat: o.oksat !== false,
        rakeisuus: o.rakeisuus !== false, merkinta: false
      });
    });

    /* Kokoonpanon suunta katkoviivana: pilarin kierretapin akseli, joka on myös
       se suunta, jossa osat menevät yhteen. Piirretään päälle, koska se on
       merkintä eikä kappale. */
    if (KO.nosto && paalla.length) {
      /* Kaksi viivaa eikä yksi: laudoitus on levy, ja yksi viiva sen keskellä
         lukisi tapiksi. Viivat ovat laudoituksen reunoilla, jolloin ne lukevat
         laskusuuntana. */
      var lz = paalla[0].siirto[2];
      var lA = window.palkkikuva.mitat(paalla[0].koko);
      [-1, 1].forEach(function (sn) {
        var px = sn * 70;
        var b0 = [ox + px * CX * K, oy + px * CY * K - (lz - KO.nosto - lA.b / 2) * K];
        var b1 = [ox + px * CX * K, oy + px * CY * K - (lz - lA.b / 2) * K];
        out.push('<line x1="' + b0[0] + '" y1="' + b0[1] + '" x2="' + b1[0] +
          '" y2="' + b1[1] + '" stroke="var(--ink-3,#6f6d6b)" stroke-width="' +
          (viiva * 0.9) + '" stroke-dasharray="' + (viiva * 3) + " " + (viiva * 3) +
          '" opacity=".6"/>');
      });
    }

    if (KO.raj) {
      var a0 = [ox + 0, oy - T.t * K], a1 = [ox + 0, oy - (T.t + KO.raj) * K];
      out.push('<line x1="' + a0[0] + '" y1="' + a0[1] + '" x2="' + a1[0] +
        '" y2="' + a1[1] + '" stroke="var(--ink-3,#6f6d6b)" stroke-width="' +
        (viiva * 0.9) + '" stroke-dasharray="' + (viiva * 3) + " " + (viiva * 3) +
        '" opacity=".7"/>');
    }
  }

  /* mm-korkeus silhuetille: tarvitaan kun usea pari piirretään samaan
     mittakaavaan ja jokainen saa oman kankaansa. */
  yhdistelma.laajuus = function (avain) {
    var KO = kappaleet({pari: avain});
    if (!KO) return 0;
    var R = rajat(laatikot(KO));
    return R.y1 - R.y0;
  };
  yhdistelma.parit = function () { return Object.keys(PARIT); };
  yhdistelma.tieto = function (avain) { return PARIT[avain]; };

  /* ---- Julkinen: matala taso ----------------------------------------------
     Asennuskuva (asennuskuva.js) asettaa pilarin pään, tarvikkeen ja puun samaan
     kankaaseen, joten se tarvitsee parin piirron ilman omaa SVG-kuorta ja omaa
     mittakaavaa. Sama kuvio kuin tuotekuva.piirra, tarvikekuva.piirra ja
     palkkikuva.piirra — tämä oli neljäs generaattori, jolta se puuttui.

       kappaleet   pari · nosto · rajahdys · maara → kokoonpano maailman mm:nä
       laatikot    kokoonpano → silhuetin laatikot, kankaan kokoa varten
       piirra      out · kappaleet · K · ox · oy · hidT · hidP · viiva
     (ox, oy) on tarvikkeen nollataso, eli se piste jossa tarvike kohtaa pilarin. */
  yhdistelma.kappaleet = kappaleet;
  yhdistelma.laatikot = function (KO) { return laatikot(KO); };
  yhdistelma.piirra = function (out, o) {
    var KO = o.kappaleet || kappaleet(o);
    if (!KO) return null;
    piirraKappaleet(out, KO, o, o.K, o.ox, o.oy, o.hidT || "yh-t",
                    o.hidP || "yh-p", o.viiva || 1.2);
    return KO;
  };
  window.yhdistelmakuva = yhdistelma;
})();
