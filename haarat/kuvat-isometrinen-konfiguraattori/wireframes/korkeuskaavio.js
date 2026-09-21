/* Korkeuskaavio: mistä lattian korkeus maasta koostuu, ja mihin sillä yltää.

   Laskuri sanoo tämän sanoina: «Pilarin korkeus valitaan lattian korkeudesta
   maasta: siitä vähennetään palkin korkeus ja kiinnikkeen osuus. Kiinnikkeen
   säätövara hoitaa loppuerot, ja tontin korkeusero ratkaisee montako eri
   korkeutta samaan rakennukseen tarvitaan.» Kuva laskee saman auki.

   ---- Ensimmäinen versio merkitsi liikaa tuntemattomaksi ----
   Neljä kysymysmerkkiä, joista kolme oli vääriä. Lattiakorkeus ei ole tuntematon
   vaan **asiakkaan valinta**; pilarin näkyvä osa ei ole tuntematon vaan
   **laskettavissa**; upotukselle on **luku** (A-601), avointa on vain sen status.
   Vain kiinnikkeen rakennekorkeus on aidosti mittaamatta. Merkintä on tarkkuutta
   vain kun se on oikeassa paikassa — liika merkintä on oma epätarkkuutensa, ja
   se piilottaa sen mikä oikeasti puuttuu.

   ---- Mitä laskusta seuraa, ja se on iso ----
   Maanpinta on A-601:n mukaan pohjalaatan paksuus + täyttö laatan päällä:
   TP 65 + 500 = 565 mm pilarin pohjasta. Siitä seuraa, että **TP-pilareista vain
   TP-600 nousee maan päälle, ja sekin 35 mm**. TP-200…TP-500 jäävät kokonaan
   maan alle, samoin AP-200 ja AP-300 sekä KP-400…KP-600.

   Lattiakorkeus tulee siis lähes kokonaan palkista ja kiinnikkeestä, ei pilarista.
   Jos kuvastossa pilarien on tarkoitus näkyä maan päällä, joko täyttösyvyys tai
   korkeusvalinta on eri kuin laskelmien oletus. Tämä on sama havainto, joka on
   kirjattu kuvat/README.md:hen asennuspiirroksista — nyt se on laskettu auki
   jokaiselle koolle.

   ---- Kolme varmuustasoa, ja ne näkyvät kuvassa ----
     tiedossa     palkin korkeus (KESTOPUU, laskurin K3), pilarikorkeudet ja
                  pohjalaatan paksuus (mittakaavio.js, CAD 18.9.2026)
     oletus       täyttö pohjalaatan päällä: AP 300, TP ja KP 500 mm (A-601).
                  **Avointa ei ole luku vaan status:** onko se vaatimus vai
                  laskentaoletus (avoin kohta T4)
     arvio        kiinnikkeen rakennekorkeus n. 21 mm (pilarikengän pohjalevy 5 +
                  säätömutteri 16, molemmat luettu tuotekuvasta) ja lattialaudan
                  28 mm, jota laskuri ei kysy. Nämä kaksi ovat ainoat mittaamattomat

   Kierteessä on 25 mm varaa (teräslaatan pultti M20×50 − A-601:n vähintään 25 mm
   sisään). Se on kierteen vara, ei vahvistettu säätövara: pilarikengässä säätö
   tehdään pohjalevyn alla olevalla mutterilla, jonka määrää ei ole missään. */
(function () {
  "use strict";

  var INK = "#252425", DIM = "#e25d25", DIMT = "#b8420f", HATCH = "#cfcac3",
      FILL = "#f2f0ec", MYKKA = "#a9a49d", PUU = "#dcc9a4", MET = "#c3c9ce",
      BET = "#e1ded9",
      FF = "Oswald,Raleway,system-ui,-apple-system,sans-serif";

  var SAATO = 25;                     /* kierteen vara, ks. tiedoston alku */
  var PULTTI = 50, MIN_KIERRE = 25;   /* esite 2023 + opas 2025 · A-601 */
  /* Täyttö pohjalaatan päällä, A-601 taulukko. Luku on, status on auki (T4). */
  var TAYTTO = {AP: 300, TP: 500, KP: 500};
  /* Kaksi arviota, molemmat tuotekuvasta. Nämä ovat ainoat mittaamattomat luvut. */
  var KIINNIKE = 21;                  /* pohjalevy 5 + säätömutteri 16 */
  var LAUTA = 28;                     /* terassilauta, laskuri ei kysy */

  /* Maanpinta pilarin pohjasta: pohjalaatan paksuus + täyttö sen päällä. */
  function maanpinta(perhe) {
    var m = window.mittakaavio, H2 = m && m.perheet[perhe] ? m.perheet[perhe].H2 : 65;
    return H2 + (TAYTTO[perhe] == null ? 500 : TAYTTO[perhe]);
  }

  function N(v) { return Math.round(v * 100) / 100; }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function koot(perhe) {
    var m = window.mittakaavio;
    return m && m.perheet[perhe] ? m.perheet[perhe].kt.slice() : [200, 300, 400, 500, 600];
  }
  function palkinKorkeus(koko) {
    var p = window.palkkikuva && window.palkkikuva.mitat(koko);
    return p ? p.h : 148;
  }

  /* ---- Piirtoapurit --------------------------------------------------------
     Mittaviiva on sama konventio kuin mittakaavio.js:ssä: oranssi viiva,
     poikkiviivat päissä ja luku viivan päällä. Tuntematon on katkoviiva. */
  function piirto(out) {
    var C = {};
    C.laatikko = function (x, y, w, h, vari, o) {
      o = o || {};
      out.push('<rect x="' + N(x) + '" y="' + N(y) + '" width="' + N(w) +
        '" height="' + N(h) + '" fill="' + (vari || "none") + '"' +
        (o.reuna === false ? "" : ' stroke="' + (o.viiva || INK) + '" stroke-width="' +
          (o.lev || 1.4) + '"') +
        (o.katko ? ' stroke-dasharray="6 4"' : "") + "/>");
    };
    C.teksti = function (x, y, s, o) {
      o = o || {};
      out.push('<text x="' + N(x) + '" y="' + N(y) + '" font-family="' + FF +
        '" font-size="' + (o.koko || 17) + '" font-weight="' + (o.paino || 500) +
        '" fill="' + (o.vari || INK) + '"' +
        (o.ankkuri ? ' text-anchor="' + o.ankkuri + '"' : "") +
        (o.kierto ? ' transform="rotate(' + o.kierto + " " + N(x) + " " + N(y) + ')"' : "") +
        ">" + esc(s) + "</text>");
    };
    /* Pystymitta: viiva x:ssä väliltä y1…y2, luku sen vieressä. */
    C.mitta = function (x, y1, y2, teksti, o) {
      o = o || {};
      var vari = o.tuntematon ? MYKKA : DIM;
      out.push('<path d="M' + N(x - 5) + " " + N(y1) + "h10M" + N(x) + " " + N(y1) +
        "V" + N(y2) + "M" + N(x - 5) + " " + N(y2) + 'h10" fill="none" stroke="' +
        vari + '" stroke-width="1.4"' +
        (o.tuntematon ? ' stroke-dasharray="5 4"' : "") + "/>");
      if (teksti != null) {
        C.teksti(x + (o.puoli === "vasen" ? -10 : 10), (y1 + y2) / 2 + 6, teksti,
          {koko: o.koko || 16, vari: o.tuntematon ? MYKKA : DIMT, paino: 600,
           ankkuri: o.puoli === "vasen" ? "end" : "start"});
      }
    };
    /* Kaksipäinen nuoli säätövaralle: se ei ole mitta vaan liikkumavara. */
    C.saatonuoli = function (x, y1, y2) {
      var d = 4;
      out.push('<path d="M' + N(x) + " " + N(y1) + "V" + N(y2) +
        "M" + N(x - d) + " " + N(y1 + d) + "L" + N(x) + " " + N(y1) + "L" + N(x + d) +
        " " + N(y1 + d) + "M" + N(x - d) + " " + N(y2 - d) + "L" + N(x) + " " + N(y2) +
        "L" + N(x + d) + " " + N(y2 - d) + '" fill="none" stroke="' + DIM +
        '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>');
    };
    C.maa = function (x, y, w) {
      out.push('<path d="M' + N(x) + " " + N(y) + "h" + N(w) + '" stroke="' + INK +
        '" stroke-width="1.8" fill="none"/>');
      var i, s = 9;
      var d = [];
      for (i = 0; i < w; i += s) d.push("M" + N(x + i) + " " + N(y + 8) + "l7 -8");
      out.push('<path d="' + d.join("") + '" stroke="' + HATCH +
        '" stroke-width="1.2" fill="none"/>');
    };
    return C;
  }

  function kuori(sisus, CW, CH, o, nimike) {
    var a11y = o.koriste ? ' aria-hidden="true" focusable="false"'
      : ' role="img" aria-label="' + esc(nimike) + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + ">" +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") + sisus + "</svg>";
  }

  /* ---- 1 · Ketju: mistä lattiakorkeus koostuu -----------------------------
       perhe · koko · palkki   mitä pinossa on
       lauta · kiinnike        arviot, voi ohittaa kun BCE antaa luvut
     Kaikki luvut lasketaan. Merkintä kertoo varmuustason, ei sitä puuttuuko luku:
     yhtenäinen = tiedossa, katkoviiva = arvio, A-601-merkintä = laskentaoletus. */
  function ketju(o) {
    o = o || {};
    var perhe = (o.perhe || "TP").toUpperCase();
    var kt = koot(perhe), koko = o.koko || kt[kt.length - 1];
    var pk = palkinKorkeus(o.palkki || "48x148");
    var lauta = o.lauta == null ? LAUTA : o.lauta;
    var kiinnike = o.kiinnike == null ? KIINNIKE : o.kiinnike;
    var mp = maanpinta(perhe);
    var nakyva = koko - mp;                  /* voi olla negatiivinen */
    var lattia = Math.max(0, nakyva) + kiinnike + pk + lauta;

    var K = 0.30, X = 176, LEV = 120, MARG = 30;
    var hLauta = Math.max(7, lauta * K), hPalkki = pk * K;
    var hKiinnike = Math.max(10, kiinnike * K);
    var hNakyva = Math.max(6, nakyva * K);
    var hAlla = Math.min(150, mp * K);       /* maan alla oleva osa, rajattu */

    var yLauta = MARG + 26, yPalkki = yLauta + hLauta, yKiinnike = yPalkki + hPalkki;
    var yMaa = yKiinnike + hKiinnike + (nakyva > 0 ? hNakyva : 0);
    var CH = yMaa + hAlla + 74, CW = 700;
    var out = [], C = piirto(out);

    C.teksti(18, MARG + 4, "Lattia maasta " + lattia + " mm — " + perhe + "-" + koko +
      ", " + pk + " mm palkki", {koko: 17, paino: 600});
    C.maa(18, yMaa, X + LEV + 130);

    /* pilari: näkyvä osa umpiviivalla, maan alla oleva vaaleana */
    if (nakyva > 0) C.laatikko(X + 14, yKiinnike + hKiinnike, LEV - 28, hNakyva, BET, {});
    C.laatikko(X + 14, yMaa, LEV - 28, hAlla - 16, FILL, {viiva: MYKKA});
    C.laatikko(X - 6, yMaa + hAlla - 16, LEV + 12, 16, FILL, {viiva: MYKKA});

    C.laatikko(X + 20, yKiinnike, LEV - 40, hKiinnike, MET, {katko: true, viiva: MYKKA});
    C.laatikko(X, yPalkki, LEV, hPalkki, PUU, {});
    C.laatikko(X - 16, yLauta, LEV + 32, hLauta, PUU, {katko: true, viiva: MYKKA});

    /* Nimet omaan pinoonsa, ei osan keskelle: osat ovat kymmeniä millimetrejä
       ja menisivät päällekkäin. Saateviiva yhdistää nimen siihen osaan, jota se
       koskee — sama tapa kuin mittapiirustuksessa, kun kohde on viivaa pienempi. */
    var XN = X + LEV + 158, rivit2 = [], edY = -99;
    var nimi = function (yy, hh, s2, arvio) {
      var y2 = Math.max(yy + hh / 2, edY + 21);
      edY = y2;
      rivit2.push({y: y2, kohde: yy + hh / 2, teksti: s2, arvio: arvio});
    };
    nimi(yLauta, hLauta, "Lattialauta " + lauta + " mm · arvio", true);
    nimi(yPalkki, hPalkki, "Palkki " + pk + " mm");
    nimi(yKiinnike, hKiinnike, "Kiinnike " + kiinnike + " mm · arvio", true);
    if (nakyva > 0) nimi(yKiinnike + hKiinnike, hNakyva, perhe + "-" + koko +
      ", näkyvä osa " + nakyva + " mm");
    nimi(yMaa, hAlla, "Maan alla " + (koko - Math.max(0, nakyva)) + " mm · A-601", true);
    rivit2.forEach(function (r) {
      out.push('<path d="M' + N(X + LEV + 8) + " " + N(r.kohde) + "H" + N(XN - 8) +
        (Math.abs(r.y - r.kohde) > 1 ? "V" + N(r.y - 4) : "") +
        '" fill="none" stroke="' + HATCH + '" stroke-width="1"/>');
      C.teksti(XN, r.y + 5, r.teksti, {koko: 15, vari: r.arvio ? MYKKA : INK, paino: 500});
    });

    /* Iso mitta vasemmalle ilman tekstiä: luku on otsikossa, koska pino on
       matala eikä kierretty teksti mahdu sen viereen. */
    var XM = 78;
    C.mitta(XM, yLauta, yMaa, null, {});

    var xo = X + LEV + 26;
    C.mitta(xo, yPalkki, yKiinnike, String(pk), {});
    var ys = yKiinnike + hKiinnike / 2, xs = X + LEV + 78;
    C.saatonuoli(xs, ys - SAATO * K / 2 - 7, ys + SAATO * K / 2 + 7);
    C.teksti(xs + 9, ys + 5, SAATO + " mm", {koko: 14, vari: DIMT, paino: 600});

    if (nakyva <= 0) {
      C.teksti(18, CH - 52, perhe + "-" + koko + " ei nouse maan päälle: se jää " +
        (-nakyva) + " mm maanpinnan alle.", {koko: 15, paino: 600, vari: DIMT});
    }
    C.teksti(18, CH - 32,
      "Maanpinta = pohjalaatta + " + TAYTTO[perhe] + " mm täyttöä sen päällä (A-601). " +
      "Onko se vaatimus vai laskentaoletus, on auki.", {koko: 13, vari: MYKKA});
    C.teksti(18, CH - 14,
      "Katkoviiva = arvio tuotekuvasta. " + SAATO + " mm on kierteen vara, ei " +
      "vahvistettu säätövara.", {koko: 13, vari: MYKKA});

    return kuori(out.join(""), CW, CH, o,
      o.nimike || perhe + "-" + koko + ": lattia maasta " + lattia + " mm, josta palkkia " +
      pk + " mm ja pilarin näkyvää osaa " + Math.max(0, nakyva) + " mm");
  }

  /* ---- 2 · Alue: mihin lattiakorkeuksiin perhe yltää ----------------------
     Yksi rivi per pilarikoko. Tämä on se kysymys, johon asiakas haluaa vastauksen
     — ja A-601:n oletuksella vastaus on hämmentävä: useimmat koot eivät nouse
     maan päälle lainkaan, ja lattiakorkeus tulee palkista eikä pilarista. */
  function alue(o) {
    o = o || {};
    var perhe = (o.perhe || "TP").toUpperCase();
    var kt = koot(perhe);
    var pk = palkinKorkeus(o.palkki || "48x148");
    var lauta = o.lauta == null ? LAUTA : o.lauta;
    var kiinnike = o.kiinnike == null ? KIINNIKE : o.kiinnike;
    var mp = maanpinta(perhe);
    var rivit = kt.map(function (k) {
      var n = k - mp;
      return {koko: k, nakyva: n,
              lattia: n > 0 ? n + kiinnike + pk + lauta : null};
    });
    var maxL = 0;
    rivit.forEach(function (r) { if (r.lattia > maxL) maxL = r.lattia; });
    maxL = Math.max(maxL, 1);

    var MARG = 30, X = 132, LEVA = 330, RH = 34;
    var CH = MARG + rivit.length * RH + 110, CW = 600;
    var out = [], C = piirto(out);
    C.teksti(18, MARG - 4, "Lattia maasta, " + perhe + " ja " + pk + " mm palkki",
      {koko: 17, paino: 600});

    rivit.forEach(function (r, i) {
      var y = MARG + 14 + i * RH;
      C.teksti(X - 12, y + 16, perhe + "-" + r.koko,
        {koko: 15, ankkuri: "end", paino: 600, vari: r.lattia ? INK : MYKKA});
      if (r.lattia) {
        var w = LEVA * r.lattia / maxL;
        /* palkki ja lauta ovat sama osa joka koossa: ne piirretään erikseen,
           jotta näkyy kuinka pieni osuus pilarilla on. */
        var wp = LEVA * (pk + lauta) / maxL;
        out.push('<rect x="' + X + '" y="' + (y + 4) + '" width="' + N(wp) +
          '" height="16" fill="' + PUU + '" stroke="' + INK + '" stroke-width="1"/>');
        out.push('<rect x="' + N(X + wp) + '" y="' + (y + 4) + '" width="' + N(w - wp) +
          '" height="16" fill="' + DIM + '" opacity=".9"/>');
        C.teksti(X + w + 10, y + 17, r.lattia + " mm", {koko: 14, paino: 600, vari: DIMT});
      } else {
        out.push('<rect x="' + X + '" y="' + (y + 8) + '" width="' + N(LEVA * 0.34) +
          '" height="8" fill="none" stroke="' + MYKKA +
          '" stroke-width="1.2" stroke-dasharray="5 4"/>');
        C.teksti(X + LEVA * 0.34 + 10, y + 17, "ei nouse maan päälle",
          {koko: 14, vari: MYKKA});
      }
    });

    var y2 = MARG + 14 + rivit.length * RH;
    C.teksti(18, y2 + 22, "Puu " + (pk + lauta) + " mm on sama joka rivillä. " +
      "Oranssi on pilarin näkyvä osa ja kiinnike.", {koko: 13, vari: MYKKA});
    C.teksti(18, y2 + 42,
      "Maanpinta = pohjalaatta + " + TAYTTO[perhe] + " mm täyttöä (A-601).",
      {koko: 13, vari: MYKKA});
    C.teksti(18, y2 + 60,
      "Onko täyttö vaatimus vai laskentaoletus, on auki — ja se ratkaisee koko kuvan.",
      {koko: 13, vari: MYKKA});

    return kuori(out.join(""), CW, CH, o,
      o.nimike || perhe + "-perheen lattiakorkeudet " + pk + " mm palkilla; " +
      rivit.filter(function (r) { return !r.lattia; }).length + " kokoa " + kt.length +
      ":sta ei nouse maan päälle");
  }

  window.korkeuskaavio = {ketju: ketju, alue: alue, saatovara: SAATO};
})();
