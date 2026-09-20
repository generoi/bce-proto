/* Asennuskuva: pilarin pää, siihen kierretty tarvike ja siihen tuleva puu.

   Tämä on se kuva, jota TUOTEKUVAT.md:n luku 12 on odottanut ("tarvike pilarin
   päässä, puutavara kiinni — **ei vieläkään ole**") ja jonka puuttumisesta
   bce_tp_spec.html:n lohko 5 on kantanut selittävää kommenttia. Tarvikekuva
   kertoo miltä osa näyttää, yhdistelmäkuva miten päin puu menee siihen — tämä
   kertoo sen, mikä molemmista puuttui: **mihin osa kiinnittyy.**

   Tiedosto ei piirrä yhtään kappaletta itse. Se asettaa kolme olemassa olevaa
   generaattoria samaan kankaaseen:

     tuotekuva.js       pilari, betoni, mitat mittakaavio.js:stä
     yhdistelmakuva.js  tarvike ja siihen kuuluva puu yhtenä kokoonpanona
     (ja sen kautta tarvikekuva.js ja palkkikuva.js)

   Kaikki lukevat kameran tuotekuva.js:stä, joten ne eivät voi olla eri kulmassa.

   ---- Pilarista näkyy vain pää, ja se on tietoinen rajaus -------------------
   Kokonainen TP-400 on 400 mm korkea ja sen pohjalaatta 450 × 450. Samassa
   kuvassa PIK 50-70:n 90 mm:n pohjalevyn kanssa laatta veisi kuvan leveyden ja
   kenkä olisi rivin kuvapaikassa parinkymmenen pikselin kokoinen — eli juuri se
   asia, jota rivi selittää, katoaisi. Siksi kangas rajataan pilarin pään
   ympärille ja pilari jatkuu kuvan alareunan ali. Rajaus on vaakasuora ja osuu
   pilarin akselille korkeudella `nakyva` kosketustasosta alaspäin.

   Pilaria ei lyhennetä geometriasta vaan kankaasta: `tuotekuva.piirra` piirtää
   koko pilarin, ja SVG:n viewBox jättää alaosan näkymättä. Silloin kuvassa
   oleva pää on oikean pilarin pää oikeassa muodossa eikä lyhennetty tynkä,
   jonka kapeneminen olisi väärä.

   ---- Kosketustaso tulee osalta, ei tästä tiedostosta -----------------------
   `tarvikekuva.tieto(osa).pilariZ` on se z, jossa osa lepää pilarin päätä
   vasten: pilarikengillä säätömutterin alapinta, muilla osan oma alapinta.
   Piirtofunktiot käyttävät samaa lukua, joten kenkä ei voi leijua tai upota.

   ---- Kolme asiaa, jotka on varmistettava BCE:ltä --------------------------
   Nämä ovat tämän kuvan omia väitteitä. Parien omat avoimet kohdat (P-PIK:n
   suunta, palkkikengän lautojen määrä, uran mitta) ovat yhdistelmakuva.js:ssä
   eivätkä toistu tässä.

     1  PALKKIKENGÄN KIINNITYS PILARIIN EI NÄY EIKÄ SITÄ OLE PIIRRETTY. A-601
        sanoo kaikista tarvikkeista «ruuvataan min. 25 mm sisään valuankkuriin»,
        mutta tarvikekuva.js:n PAK:ssa ei ole kierretappia eikä säätömutteria.
        Tässä kuvassa se ei näy — tappi olisi pilarin sisällä — mutta kengän
        pohjalevy istuu suoraan pilarin päätä vasten, ja jos välissä on mutteri
        kuten pilarikengässä, kenkä on 16 mm liian alhaalla. Kysyttävä.
     2  PILARIN KOKO ON TP-400, JA SE ON SIVUN VALINTA EIKÄ TUOTETIETO. Tarvike
        käy jokaiseen M20-päiseen pilariin. Perhe ja koko ovat parametreja, ja
        oletus on se, mitä TP-perhesivu näyttää muutenkin.
     3  PILARIN PÄÄ ON LEVEÄMPI KUIN PIENI PILARIKENKÄ. TP-400:n pää on 105 ×
        105 ja PIK 50-70:n pohjalevy 90 × 90, joten pää jää näkyviin kengän
        ympärille. Se on mittojen seuraus eikä piirtäjän valinta, mutta se
        näyttää kuvassa isolta — tarkista mitta ennen kuin kuvaa käytetään
        myyntimateriaalina.

   ---- Mitä tämä kuva ei ratkaise ------------------------------------------
   **Säätömutteri jää yhä piiloon.** TUOTEKUVAT.md luku 12 arveli, että
   asennuskuva näyttäisi sen matalammasta kulmasta. Kamera on kuitenkin yhteinen
   kaikille neljälle generaattorille — se luetaan `tuotekuva.projektio`:sta — ja
   sen laskeminen vain tätä kuvaa varten tarkoittaisi, että sivulla olisi kaksi
   eri kameraa. Mutteri on piirretty oikeaan paikkaansa; tästä kulmasta kengän
   pohjalevy peittää sen. Jos mutteri on saatava näkyviin, se on oma kuvansa ja
   oma kamerapäätöksensä, ei tämän kuvan sivutuote. */
(function () {
  "use strict";

  var PR = (window.tuotekuva && window.tuotekuva.projektio) ||
           {CX: 0.866, CY: 0.42};
  var CX = PR.CX, CY = PR.CY;

  /* Oletuspilari. TP-400 on se koko, jonka TP-perhesivu näyttää muutenkin, ja
     sama koko on terassikuvan oletus — kolme kuvaa samaa pilaria. */
  var OLETUS = {perhe: "TP", koko: 400, nakyva: 170};

  /* ---- Näytepalan pituus ---------------------------------------------------
     Lyhyempi kuin yhdistelmäkuvassa, ja se on rajausvalinta eikä tuotetietoa:
     todellinen palkki jatkuu seuraavalle pilarille asti. Syy on se, että tässä
     kuvassa on mukana pilari. Täysimittainen 270 mm:n palkki projisoituu
     kankaalla ±117 pikselin levyiseksi ja pilarin pää on 105 mm — silloin
     liitos, joka on kuvan aihe, jää kuvan nurkkaan ja palkki on kuvan aihe.
     Mitattu ensimmäisestä vedoksesta 20.9.2026: PAK 270 mm:llä pilari peittyi
     palkin alle lähes kokonaan.

     Pilarikengän luku on tolpan korkeus eikä palkin pituus — sama kenttä, eri
     suunta, koska kenkä kantaa pystytolppaa. */
  var PITUUS = {
    "pik-50-70": 150, "pik-90-140": 190, "p-pik-50x70": 150,
    "pak-100x150": 200, "pak-100x200": 200, "tl-150x150": 210,
    "pik-50-70-terassi": 220, "pak-100x150-terassi": 220,
    "tl-150x150-terassi": 220
  };

  /* ---- Kankaan koko --------------------------------------------------------
     Sama laskenta kuin yhdistelmakuva.js:ssä: kuperan kappaleen kuva on sen
     kulmien kuvan kupera verho, joten laatikoiden kulmat riittävät.

     Pilari antaa laatikoiden sijaan kaksi neliötä — pään ja rajauskohdan
     poikkileikkauksen — koska katkaistun pyramidin kuva on niiden kahden
     yhdiste. Yksi laatikko koko pilarin ympäri veisi kankaalle turhaa ilmaa
     pohjalaatan leveydeltä, ja juuri sitä rajaus on tekemässä. */
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

  /* Pilarin poikkileikkaus korkeudella z pilarin omassa mitassa, laatikoksi
     kirjoitettuna tarvikkeen koordinaatistossa (z = 0 on kosketustaso). */
  function leikkaus(perhe, koko, zPilari, zKuva) {
    var a = window.tuotekuva.puolileveys(perhe, koko, zPilari);
    return {x: [-a, a], y: [-a, a], z: [zKuva, zKuva]};
  }

  /* Kutsujan kuvaus täydennettynä tämän kuvan omalla näytepalan pituudella.
     Kopio eikä muutos paikallaan: sama olio on lohkon 5 rivillä ja menee myös
     tarvikekuvalle, eikä siihen saa jäädä tämän kuvan rajausvalintoja. */
  function kokoonpano(o) {
    var r = {}, avain;
    for (avain in o) r[avain] = o[avain];
    if (r.pituus == null) r.pituus = PITUUS[o.pari];
    return r;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---- Julkinen ------------------------------------------------------------
     Kuvaus on **sama olio kuin lohkon 5 riveillä jo on**: `{pari:"…"}` piirtää
     tarvikkeen ja puun, `{osa:"…"}` pelkän tarvikkeen. Nostokorvalle ei ole
     paria, koska siinä ei ole kiinnitettävää puuta — sama poikkeus ja sama syy
     kuin tarvikesivulla.

       pari | osa   kumpi tahansa, ei molempia
       perhe, koko  pilari; oletus TP-400
       nakyva       montako mm pilaria näkyy kosketustasosta alaspäin
       korkeus      kankaan korkeus pikseleinä (oletus 420)
       skaala       px/mm suoraan; ohittaa korkeuden, kun usea kuva piirretään
                    samaan mittakaavaan
       id           pakollinen kun samalla sivulla on kaksi kuvaa
       koriste, syyt, oksat, rakeisuus, maara, nosto, rajahdys */
  function asennuskuva(o) {
    o = o || {};
    if (!window.tuotekuva || !window.tarvikekuva) return "";
    var perhe = o.perhe || OLETUS.perhe, koko = o.koko || OLETUS.koko;
    var nakyva = o.nakyva == null ? OLETUS.nakyva : o.nakyva;

    /* Kokoonpano: pari antaa tarvikkeen ja puun, pelkkä osa vain tarvikkeen. */
    var KO = o.pari && window.yhdistelmakuva
      ? window.yhdistelmakuva.kappaleet(kokoonpano(o)) : null;
    var osa = KO ? KO.P2.osa : o.osa;
    var T = window.tarvikekuva.tieto(osa);
    if (!T) return "";

    var M = window.tuotekuva.mitat(perhe, koko);
    if (!M) return "";
    var kz = T.pilariZ || 0;              /* kosketustaso tarvikkeen mitassa */

    /* Laatikot: tarvike, puut ja pilarin kaksi poikkileikkausta. Pilarin pää on
       kosketustasossa; rajauskohta on `nakyva` sen alapuolella, ja se on
       pilarin omassa mitassa korkeudella H1 − nakyva. */
    var laatikot = (KO ? window.yhdistelmakuva.laatikot(KO) : [T.laatikko])
      .concat([leikkaus(perhe, koko, M.H1, kz),
               leikkaus(perhe, koko, M.H1 - nakyva, kz - nakyva)]);

    var R = rajat(laatikot), reuna = 18;
    /* Alareuna on rajaus eikä silhuetin reuna: vaakasuora viiva pilarin
       akselilla. Siksi siihen ei tule marginaalia — muuten pilarista näkyisi
       `reuna` pikseliä enemmän kuin pyydettiin ja luku olisi valhe. */
    R.y1 = nakyva - kz;
    var K = o.skaala || (o.korkeus || 420) / (R.y1 - R.y0);
    var CW = Math.round((R.x1 - R.x0) * K + 2 * reuna);
    var CH = Math.round((R.y1 - R.y0) * K + reuna);
    var ox = reuna - R.x0 * K, oy = reuna - R.y0 * K;
    var viiva = Math.max(0.9, Math.min(2, CW / 320));

    var juuri = "as-" + String(o.id || o.pari || o.osa).toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    var hidB = juuri + "-b", hidT = juuri + "-t", hidP = juuri + "-p";
    var out = [];

    /* ---- 1 · pilari ----
       Alimpana ja kauimpana kamerasta, siis ensin. Nollataso on pohjalaatan
       alapinta, joka on kosketustasosta H1 alaspäin — sama sopimus kuin
       terassikuva.js:ssä. Ei varjoa (pilari on kuvassa irti maasta) eikä
       kaiverrettua koodia (se on viisteessä, joka jää rajauksen ulkopuolelle). */
    window.tuotekuva.piirra(out, {
      perhe: perhe, koko: koko, K: K, ox: ox, oy: oy + (M.H1 - kz) * K,
      hid: hidB, viiva: viiva, varjo: false, merkinta: false,
      rakeisuus: o.rakeisuus !== false
    });

    /* ---- 2 · tarvike ja puu ----
       Tarvikkeen nollataso on kankaan piste (ox, oy). Puu tulee tarvikkeen
       piirtokoukusta oikeaan kohtaan piirtojärjestystä, ks. yhdistelmakuva.js. */
    if (KO) {
      window.yhdistelmakuva.piirra(out, {
        kappaleet: KO, K: K, ox: ox, oy: oy, hidT: hidT, hidP: hidP,
        viiva: viiva, piilotaso: kz,
        syyt: o.syyt, oksat: o.oksat, rakeisuus: o.rakeisuus
      });
    } else {
      window.tarvikekuva.piirra(out, {
        osa: osa, K: K, ox: ox, oy: oy, hid: hidT, viiva: viiva, piilotaso: kz
      });
    }

    var nimike = o.nimike || (KO ? KO.P2.otsikko : T.nimi) + " " +
      window.tuotekuva.koodi(perhe, koko) + "-pilarin päässä, havainnekuva";
    var a11y = o.koriste ? ' aria-hidden="true" focusable="false"'
                         : ' role="img" aria-label="' + esc(nimike) + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + ">" +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") +
      window.tuotekuva.defs(hidB, CH, o.rakeisuus !== false) +
      window.tarvikekuva.defs(hidT, CH) +
      (KO ? window.palkkikuva.defs(hidP, CH, o.rakeisuus !== false) : "") +
      out.join("") + "</svg>";
  }

  /* mm-korkeus silhuetille: tarvitaan kun usea asennuskuva piirretään samaan
     mittakaavaan ja jokainen saa oman kankaansa. Sama laskenta kuin
     asennuskuva():ssa, ja siksi sama rajaus — alareuna on rajauskohta. */
  asennuskuva.laajuus = function (o) {
    o = o || {};
    var perhe = o.perhe || OLETUS.perhe, koko = o.koko || OLETUS.koko;
    var nakyva = o.nakyva == null ? OLETUS.nakyva : o.nakyva;
    var KO = o.pari && window.yhdistelmakuva
      ? window.yhdistelmakuva.kappaleet(kokoonpano(o)) : null;
    var T = window.tarvikekuva.tieto(KO ? KO.P2.osa : o.osa);
    if (!T) return 0;
    var M = window.tuotekuva.mitat(perhe, koko), kz = T.pilariZ || 0;
    var R = rajat((KO ? window.yhdistelmakuva.laatikot(KO) : [T.laatikko])
      .concat([leikkaus(perhe, koko, M.H1, kz),
               leikkaus(perhe, koko, M.H1 - nakyva, kz - nakyva)]));
    return (nakyva - kz) - R.y0;
  };

  asennuskuva.oletus = function () {
    return {perhe: OLETUS.perhe, koko: OLETUS.koko, nakyva: OLETUS.nakyva};
  };
  window.asennuskuva = asennuskuva;
})();
