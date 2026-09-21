/* Tuotevalitsin: kokovalinta radiopainikkeina, tuotekuva morffaa valinnan mukana.

   Tehtävä. Perhesivun lohko 3 vastaa kysymykseen "montako korkeutta ja mitä eroa
   niillä on". Valitsin vastaa kahdella tavalla yhtä aikaa: radiopainikkeet kertovat
   mitä vaihtoehtoja on, ja kuva näyttää eron — kun valinta vaihtuu, pilarin runko
   kasvaa tai kutistuu samassa kankaassa ja samassa mittakaavassa. TUOTEKUVAT.md
   luku 3.5 nimesi tämän generaattorin vahvimmaksi käyttötapaukseksi.

   Valitsin on radioryhmä eikä liukusäädin. Kokoja on viisi, ne ovat tuotteita
   eivätkä pisteitä jatkumolla, ja jokaisen vieressä on paino — luettelo kertoo sen
   yhdellä silmäyksellä, säädin vaatisi vetämään nähdäkseen. Radio vastaa myös
   heuristiikkaan 5: ryhmä saa olla valitsematta, eikä mikään väitä käyttäjän
   päättäneen. Siihen asti kuva näyttää perheen suurimman koon ja lukurivi
   vaihteluvälit.

   Kolme sääntöä, jotka näkyvät koodissa:

     Ei esivalintaa (heuristiikka 5). Yksikään radio ei ole valittuna ennen
     käyttäjän valintaa, ja purkupainike näkyy vain kun valinta on päällä — sama
     tapa kuin tarvikesivun suodattimessa.

     Ei vieritystä käyttäjän puolesta (heuristiikka 6). Valinta ei siirrä sivua.
     Purkamisen jälkeen kohdistus palaa ryhmän ensimmäiseen radioon preventScroll-
     lipulla, jottei se jäisi kadonneen painikkeen kohdalle.

     Toiminto kuittaa itsensä sanoin (heuristiikka 1). Lukurivi kirjoittaa valitun
     koon mitat millimetreinä, ja radio kertoo tilansa itse — siksi kuva on koriste
     (aria-hidden) eikä ruudunlukija kuule kokoa kahdesti.

   Mitat eivät ole tässä tiedostossa. Koot, mitat ja tuotekoodit luetaan
   tuotekuva.js:n kautta mittakaavio.js:n PERHEET-taulukosta (TUOTEKUVAT.md,
   sääntö 1). Sivu antaa vain sen, mikä ei ole geometriaa: tekstit ja painot.

   Käyttö

     <script src="mittakaavio.js"></script>
     <script src="tuotekuva.js"></script>
     <script src="tuotevalitsin.js"></script>

     const V = {perhe:"TP", id:"tp", otsikko:"Valitse korkeus",
                tyhjenna:"Kaikki koot", yks:"mm",
                painot:{"TP-200":"43 kg", …},
                mitat:[["Korkeus","H1"], ["Pohjalaatta","D1","nelio"], …]};
     html = tuotevalitsin(E, V);
     const ohjain = tuotevalitsin.kiinnita(juuri, V, koodi => { … });

   Takaisinkutsu saa tuotekoodin ("TP-400") tai null, kun valinta on purettu. */
(function () {
  "use strict";

  function koot(o) {
    var kt = window.tuotekuva.koot(o.perhe || "TP");
    return kt ? kt.slice().reverse() : [];   /* suurin ylimmäksi, kuten kuvassa */
  }

  /* Lukurivin arvo. Ilman valintaa se on perheen vaihteluväli, valittuna yksi luku.
     Kumpikin lasketaan geometriasta eikä kirjoiteta sivulle, jottei lukurivi voi
     jäädä jälkeen mittataulukosta.

       H1 D1 D2 …  mitta millimetreinä; muoto "nelio" kirjoittaa neliön 450 × 450
       paino       ei ole geometriaa, joten se tulee sivun painot-taulukosta

     Jos mitta vaihtelee perheen sisällä (AP:n pohjalaatta on 330 tai 450), väli
     kirjoitetaan yhtenä lukuparina eikä kahtena neliönä: 330–450 mm. Kaksi neliötä
     rinnakkain näyttäisi mitalta, jota ei ole. */
  function arvo(o, kt, avain, muoto, koko) {
    var perhe = o.perhe || "TP", yks = o.yks || "mm", i;
    if (avain === "paino") {
      var pt = o.painot || {};
      if (koko != null) return pt[window.tuotekuva.koodi(perhe, koko)] || "";
      var a = pt[window.tuotekuva.koodi(perhe, kt[kt.length - 1])] || "";
      var b = pt[window.tuotekuva.koodi(perhe, kt[0])] || "";
      if (a === b) return a;
      var osat = /^([\d\s.,]+)\s*(.*)$/.exec(a);
      return osat ? osat[1].trim() + "–" + b : a + "–" + b;
    }
    if (koko != null) {
      var v = window.tuotekuva.mitat(perhe, koko)[avain];
      return muoto === "nelio" ? v + " × " + v + " " + yks : v + " " + yks;
    }
    var luvut = kt.map(function (k) { return window.tuotekuva.mitat(perhe, k)[avain]; });
    for (i = 0; i < luvut.length; i++) {
      if (luvut[i] !== luvut[0]) {
        return Math.min.apply(null, luvut) + "–" + Math.max.apply(null, luvut) + " " + yks;
      }
    }
    return muoto === "nelio" ? luvut[0] + " × " + luvut[0] + " " + yks
                             : luvut[0] + " " + yks;
  }

  /* Lukurivit: ensin koosta riippuvat (lasketut), sitten sivun omat vakiorivit.
     Ne ovat samassa taulukossa, koska lukija ei erottele niitä — hän lukee
     tuotteen tekniset tiedot. Ero on vain siinä, mistä arvo tulee: lasketut
     mittakaaviosta, vakiot sivun C-objektista (kuormat, materiaali, CE). */
  function rivit(E, o, kt, koko, T) {
    var muotoile = T || E;
    return (o.mitat || []).map(function (m) {
      return "<div><dt>" + E(m[0]) + "</dt><dd>" + E(arvo(o, kt, m[1], m[2], koko)) +
        "</dd></div>";
    }).concat((o.lisatiedot || []).map(function (r) {
      return "<div><dt>" + E(r[0]) + "</dt><dd>" + muotoile(r[1]) + "</dd></div>";
    })).join("");
  }

  function tuotevalitsin(E, o) {
    o = o || {};
    var perhe = o.perhe || "TP", id = "tval-" + (o.id || perhe.toLowerCase());
    var kt = koot(o);

    /* Järjestys on suurin ensin, sama kuin kuvassa: ylhäällä korkein.

       Vaihtoehdossa lukee tuotekoodi ja korkeus millimetreinä — se on se mitä
       valitaan, eikä sitä saa joutua päättelemään koodin numerosta. Paino ei ole
       vaihtoehdossa vaan lukurivillä: valinta tehdään korkeuden perusteella, ja
       kahden luvun rinnastus vaihtoehdossa kysyisi kumpaa verrataan. */
    /* Asteikko: vaihtoehto asetetaan sille korkeudelle, jonka se tarkoittaa.
       Silloin valitsin ei ole luettelo kuvan vieressä vaan sama asteikko, jota
       kuvan H1-mittaviiva merkitsee — 600 mm on molemmissa samalla korkeudella.
       Luvut tulevat tuotekuva.asteikko():sta, ei tästä tiedostosta: marginaalit
       ja mittakaava ovat kuvan asiaa. Prosentti, koska kuva skaalautuu palstan
       mukana; DOM-järjestys on jo suurin ensin, joten se vastaa näkyvää
       järjestystä eikä nuolinäppäin hyppää kuvassa väärään suuntaan. */
    var ast = window.tuotekuva.asteikko(perhe,
      {korkeus: o.korkeus || 420, mitoitus: o.mitoitus !== false});
    var y = {};
    if (ast) ast.kohdat.forEach(function (c) { y[c.koko] = c.pros; });

    var valinnat = kt.map(function (k) {
      var koodi = window.tuotekuva.koodi(perhe, k), rid = id + "-" + k;
      return '<label class="tval-koko"' +
        (y[k] == null ? "" : ' style="--y:' + y[k] + '%"') +
        '><input type="radio" name="' + id + '" id="' + rid +
        '" value="' + E(koodi) + '"><b>' + E(koodi) + "</b><span>" +
        E(window.tuotekuva.mitat(perhe, k).H1 + " " + (o.yks || "mm")) + "</span></label>";
    }).join("");

    return '<div class="tval" data-perhe="' + E(perhe) + '">' +
      '<h3 class="lbl" id="' + id + '-lbl">' + E(o.otsikko) + "</h3>" +
      '<div class="tval-row">' +
        '<div class="tval-kuva" id="' + id + '-kuva"></div>' +
        '<div class="tval-valinnat' + (ast ? " tval-asteikko" : "") +
          '" role="radiogroup" aria-labelledby="' + id + '-lbl">' +
          valinnat + "</div>" +
      "</div>" +
      '<p class="tval-act"><button type="button" class="lnk" hidden>' +
        E(o.tyhjenna) + "</button></p>" +
      "</div>";
  }

  /* Tekniset tiedot omana renderöijänään, koska ne ovat valitsimen vieressä eivätkä
     sen sisällä: lukija valitsee koon vasemmalla ja lukee arvot oikealta. Valitsin
     ja taulukko voivat siis olla eri gridin soluissa, kunhan kiinnita() saa
     juurekseen elementin, jonka sisällä molemmat ovat.
       T  sivun merkintäapuri ([TÄYTETTÄVÄ] keltaiseksi); ilman sitä E riittää */
  tuotevalitsin.tiedot = function (E, o, T) {
    o = o || {};
    return '<dl class="spec2 tval-mitat">' + rivit(E, o, koot(o), null, T) + "</dl>";
  };

  tuotevalitsin.kiinnita = function (juuri, o, onvalinta) {
    o = o || {};
    var perhe = o.perhe || "TP";
    var kt = koot(o);
    var E = function (s) {
      return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };
    var tval = juuri.querySelector(".tval") || juuri;
    var napit = [].slice.call(juuri.querySelectorAll(".tval-valinnat input"));
    var lista = juuri.querySelector(".tval-mitat");
    var T = o.merkitse || null;
    var purku = juuri.querySelector(".tval-act button");
    var kuva = window.tuotekuva.morffi(juuri.querySelector(".tval-kuva"),
      {perhe: perhe, korkeus: o.korkeus || 420, id: o.id || perhe.toLowerCase(),
       /* Mittaviivat kuvan päälle: tässä näkymässä kuva on se mitta, ja luvun on
          oltava siinä missä mittakin. Lukurivi kuvan alla kertoo saman sanoin. */
       mitoitus: o.mitoitus !== false});

    var valittu = null;   /* H1 tai null, kun käyttäjä ei ole valinnut */

    function koodi(k) { return window.tuotekuva.koodi(perhe, k); }

    function nayta() {
      tval.classList.toggle("on", valittu !== null);
      if (lista) lista.innerHTML = rivit(E, o, kt, valittu, T);
      purku.hidden = valittu === null;
      /* Ilman valintaa kuva näyttää perheen suurimman koon: se on perheen mitta
         eikä kenenkään valinta. */
      kuva.aseta(valittu === null ? kt[0] : valittu);
    }

    function valitse(koko) {
      valittu = koko;
      napit.forEach(function (n) { n.checked = koko !== null && n.value === koodi(koko); });
      nayta();
      if (onvalinta) onvalinta(koko === null ? null : koodi(koko));
    }

    napit.forEach(function (n, i) {
      n.addEventListener("change", function () { if (n.checked) valitse(kt[i]); });
    });

    purku.addEventListener("click", function () {
      valitse(null);
      /* Kohdistus ei saa kadota painikkeen mukana, eikä se saa vierittää sivua. */
      if (napit[0]) napit[0].focus({preventScroll: true});
    });

    /* ---- Asteikko purkautuu itse, kun se ei mahdu ----------------------------
       Asteikko on tosi vain jos vaihtoehdot mahtuvat omille korkeuksilleen
       koskematta toisiinsa. Se ei ole ruudun leveyden kysymys vaan perheen: TP:llä
       on viisi kokoa ja KP:llä seitsemän samalla korkeusvälillä, joten sama kuva
       riittää toiselle eikä toiselle. Siksi ehto mitataan eikä arvata — jos pienin
       väli jää alle kosketuskohteen, valitsin palaa tasaväliseksi luetteloksi.
       Päällekkäiset laatikot olisivat huonompi kuin luettelo. */
    var ast2 = window.tuotekuva.asteikko(perhe,
      {korkeus: o.korkeus || 420, mitoitus: o.mitoitus !== false});
    var valinnatEl = juuri.querySelector(".tval-valinnat");

    function sovita() {
      if (!ast2 || !valinnatEl) return;
      var svg = juuri.querySelector(".tval-kuva svg");
      if (!svg) return;
      var kork = svg.getBoundingClientRect().height;
      var pienin = Infinity;
      ast2.kohdat.forEach(function (c, i) {
        if (i) pienin = Math.min(pienin, Math.abs(c.pros - ast2.kohdat[i - 1].pros));
      });
      /* 44 px on kosketuskohteen alaraja (CLAUDE.md, heuristiikka 3); laatikon oma
         korkeus on 48, joten väli mitataan siihen. */
      valinnatEl.classList.toggle("tval-asteikko", pienin / 100 * kork >= 48);
    }

    var ajastin = null;
    window.addEventListener("resize", function () {
      clearTimeout(ajastin);
      ajastin = setTimeout(sovita, 120);
    });

    /* Ensimmäinen piirto ilman siirtymää: sivun latautuessa ei ole mitään, mistä
       morfata. */
    kuva.aseta(kt[0], true);
    nayta();
    sovita();

    return {
      valittu: function () { return valittu === null ? null : koodi(valittu); },
      /* Sivun muu tila voi asettaa tai purkaa valinnan; valitsin pidetään samassa. */
      aseta: function (k) {
        var n = null;
        kt.forEach(function (x) { if (koodi(x) === k) n = x; });
        valitse(n);
      }
    };
  };

  window.tuotevalitsin = tuotevalitsin;
})();
