/* Tarvikekuva: BCE:n kiinnitystarvikkeet kolmiulotteisena, samasta kulmasta kuin
   pilarit. Kamera luetaan tuotekuva.js:stä, jotta pilari ja siihen kiertyvä tarvike
   eivät voi olla eri kulmassa.

   Materiaali on eri, ja siksi valo on eri. Betoni luetaan pehmeistä sävyeroista;
   kuumasinkitty teräs luetaan kovista heijastuksista. Siksi tässä on kaksisävyinen
   cel-varjostus terävällä rajalla ja kirkas kiiltojuova särmän vieressä — ei sama
   pehmeä liuku kuin pilarikuvissa. Se on tyylivalinta, ja se on tehty siksi, että
   ohutlevy näyttäisi ohutlevyltä eikä harmaalta pahvilta.

   Lähteet
     nimet ja mitat   bcepilarimaailma.fi/pilarien-kiinnitystarvikkeet/ 18.9.2026
                      + docs/pilari-tarvike-matriisi.md. Nimessä oleva mitta on aina
                      tosi (PIK 50-70 = 50–70 mm lankku, TL 150×150×8 = laatan koko)
     muoto            BCE:n omat tuotekuvat samalta sivulta
     pintakäsittely   kuumasinkitty (tarvikesivun tekninen rivi)

   ⚠️ Nimessä olevien mittojen ulkopuolella lähes kaikki mitta on luettu tuotekuvasta:
   levyjen korkeudet, reikien määrä ja sijainti, levyn paksuus, mutterin koko. Ne on
   kirjattu OSAT-taulukkoon kentällä `arvio: true`. Piirros näyttää tuotteen oikean
   muotoisena ja oikeassa kokoluokassa, muttei ole mittapiirustus.

   ⚠️ Kierteen pituus on ristiriitainen kolmessa lähteessä: asennusopas sanoo M20×50,
   jälleenmyyjät M20×70 ja nykysivuston otsikot M20×100. Piirroksessa on 70 mm.
   Tämä on sama avoin kohta, joka on jo tarvikesivun speksissä. */
(function () {
  "use strict";

  var PR = (window.tuotekuva && window.tuotekuva.projektio) ||
           {CX: 0.866, CY: 0.42, katse: [1, 1, 0.84]};
  var CX = PR.CX, CY = PR.CY, KATSE = PR.katse, RT2 = Math.SQRT2;

  /* Pinta näkyy kun sen ulkonormaali osoittaa katsojaan. Tämä yksi funktio korvaa
     kaiken käsin päättelyn siitä, mikä levyn reuna piirretään ja mikä ei. */
  function nakyy(n) {
    return n[0] * KATSE[0] + n[1] * KATSE[1] + n[2] * KATSE[2] > 1e-9;
  }

  /* Syvyys katsesuunnassa. Isompi = lähempänä. Tarvitaan piirtojärjestykseen:
     koska kamera on ylhäällä, KORKEAMPI z on lähempänä, eli osat piirretään
     alhaalta ylös — kierretappi ennen kenkää, ei toisin päin. */
  function syvyys(p) {
    return p[0] * KATSE[0] + p[1] * KATSE[1] + p[2] * KATSE[2];
  }

  /* Valo ylävasemmalta edestä. Sävy lasketaan pinnan normaalista neljänä portaana
     — ei liukuna. Tämä on se, mikä tekee kuvasta sarjakuvamaisen ja samalla se,
     mikä saa ohutlevyn taitokset erottumaan: sama levy saa eri sävyn joka
     taitteessa ilman että sitä tarvitsee kertoa piirtokoodissa. */
  var VALO = (function () {
    var v = [0.15, 0.55, 0.82], L = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / L, v[1] / L, v[2] / L];
  })();

  function T(nimi, fb) { return "var(--" + nimi + "," + fb + ")"; }
  var M = {
    yla:   T("met-yla", "#dfe3e6"),     /* valoon kääntyvä pinta */
    sivu:  T("met-sivu", "#c3c9ce"),    /* neutraali kylki */
    varjo: T("met-varjo", "#9aa2a9"),   /* varjopuoli */
    syva:  T("met-syva", "#6e767d"),    /* reiät, urat, sisäpinnat */
    tumma: T("met-tumma", "#555c62"),   /* takorengas ja kierteen pohja */
    viiva: T("met-viiva", "#6b7278")    /* särmä. Viileä, ei betonin lämmin */
  };

  function savy(n) {
    var L = Math.hypot(n[0], n[1], n[2]) || 1;
    var d = (n[0] * VALO[0] + n[1] * VALO[1] + n[2] * VALO[2]) / L;
    return d > 0.70 ? M.yla : d > 0.32 ? M.sivu : d > -0.15 ? M.varjo : M.tumma;
  }

  /* Tasot. Levy määritellään tasokoordinaateissa (u,v), ja taso kertoo miten ne
     kiinnittyvät maailmaan sekä mihin suuntaan paksuus kasvaa.
       xy  vaakalevy,  u→x  v→y  paksuus +z
       xz  pystylevy,  u→x  v→z  paksuus +y
       yz  pystylevy,  u→y  v→z  paksuus +x   */
  var TASO = {
    xy: {pt: function (u, v, w, s) { return [u, v, s + w]; },
         n:  function (nu, nv) { return [nu, nv, 0]; }, kansi: [0, 0, 1]},
    xz: {pt: function (u, v, w, s) { return [u, s + w, v]; },
         n:  function (nu, nv) { return [nu, 0, nv]; }, kansi: [0, 1, 0]},
    yz: {pt: function (u, v, w, s) { return [s + w, u, v]; },
         n:  function (nu, nv) { return [0, nu, nv]; }, kansi: [1, 0, 0]}
  };

  function N(v) { return Math.round(v * 100) / 100; }

  /* ---- Piirtokonteksti ---------------------------------------------------- */
  function piirto(out, K, ox, oy, hid, lev) {
    var C = {};

    function P(p) {
      return [ox + (p[0] - p[1]) * CX * K, oy + (p[0] + p[1]) * CY * K - p[2] * K];
    }
    C.P = P;

    function poly(pts, fill, viivoita) {
      out.push('<polygon points="' +
        pts.map(function (p) { return N(p[0]) + "," + N(p[1]); }).join(" ") +
        '" fill="' + (fill || "none") + '"' +
        (viivoita ? ' stroke="' + M.viiva + '" stroke-width="' + lev +
                    '" stroke-linejoin="round"' : "") + "/>");
    }

    /* Metallipinta: sävy, cel-raja, kiiltojuova, särmä. Cel-raja ja kiilto ovat
       kovareunaisia liukuja koko kankaan yli — ei pintakohtaisia, jotta valo tulee
       kaikkialla samasta suunnasta. */
    C.pinta = function (pts3, vari) {
      var pts = pts3.map(P);
      poly(pts, vari);
      poly(pts, "url(#" + hid + "-cel)");
      poly(pts, "url(#" + hid + "-kiilto)");
      poly(pts, "none", true);
    };

    /* ---- Levy: suulakepuristettu monikulmio ----
       reuna on (u,v)-pisteitä. Reunapinnat piirretään vain niiltä sivuilta, jotka
       kääntyvät katsojaan; kansi viimeisenä, koska se on lähinnä. */
    C.levy = function (reuna, taso, s, paksuus, vari) {
      var TT = TASO[taso], i, n = reuna.length;
      var cu = 0, cv = 0;
      for (i = 0; i < n; i++) { cu += reuna[i][0] / n; cv += reuna[i][1] / n; }

      for (i = 0; i < n; i++) {
        var a = reuna[i], b = reuna[(i + 1) % n];
        var du = b[0] - a[0], dv = b[1] - a[1];
        var nu = dv, nv = -du, L = Math.hypot(nu, nv) || 1;
        nu /= L; nv /= L;
        /* ulospäin = poispäin keskipisteestä */
        if (nu * ((a[0] + b[0]) / 2 - cu) + nv * ((a[1] + b[1]) / 2 - cv) < 0) {
          nu = -nu; nv = -nv;
        }
        var n3 = TT.n(nu, nv);
        if (!nakyy(n3)) continue;
        C.pinta([TT.pt(a[0], a[1], 0, s), TT.pt(b[0], b[1], 0, s),
                 TT.pt(b[0], b[1], paksuus, s), TT.pt(a[0], a[1], paksuus, s)],
                vari || savy(n3));
      }
      C.pinta(reuna.map(function (p) { return TT.pt(p[0], p[1], paksuus, s); }),
              vari || savy(TT.kansi));
    };

    /* ---- Ympyrä mielivaltaisessa pääsuuntaisessa tasossa ----
       Ympyrä projisoituu ellipsiksi, joka ei ole akselien suuntainen muissa kuin
       vaakatasossa. Yksikköympyrä + matriisi hoitaa kaikki kolme tapausta samalla
       koodilla: matrix(a b c d e f) kuvaa (cosθ, sinθ) → näyttökoordinaatiksi. */
    C.ympyra = function (taso, keskus, r, fill, viivoita, lisa) {
      var c = P(keskus), a, b, cc, d;
      if (taso === "xy") { a =  CX * r * K; b = CY * r * K; cc = -CX * r * K; d = CY * r * K; }
      else if (taso === "xz") { a = CX * r * K; b = CY * r * K; cc = 0; d = -r * K; }
      else { a = -CX * r * K; b = CY * r * K; cc = 0; d = -r * K; }
      out.push('<circle r="1" transform="matrix(' + N(a) + " " + N(b) + " " + N(cc) +
        " " + N(d) + " " + N(c[0]) + " " + N(c[1]) + ')" fill="' + (fill || "none") + '"' +
        (viivoita ? ' stroke="' + M.viiva + '" stroke-width="' + N(lev) +
                    '" vector-effect="non-scaling-stroke"' : "") +
        (lisa || "") + "/>");
    };

    /* Reikä: tumma aukko ja sen alareunassa vaalea kaari, joka lukee sisäseinäksi. */
    C.reika = function (taso, keskus, r) {
      C.ympyra(taso, keskus, r, M.syva, true);
      C.ympyra(taso, keskus, r * 0.74, M.tumma, false);
    };

    /* ---- Pystytanko ----
       Pyörähdyskappaleen siluetti on suorakaide, jonka puolileveys on saman
       ympyrän vaakasuuntainen puoliakseli. Päät ovat ellipsejä. */
    C.tanko = function (x, y, z0, z1, r, vari, kansi) {
      var rx = RT2 * CX * r * K, ry = RT2 * CY * r * K;
      var ala = P([x, y, z0]), yla = P([x, y, z1]);
      C.ympyra("xy", [x, y, z0], r, M.tumma, true);                 /* alapää */
      var runko = [[ala[0] - rx, ala[1]], [ala[0] + rx, ala[1]],
                   [yla[0] + rx, yla[1]], [yla[0] - rx, yla[1]]];
      poly(runko, vari || M.sivu);
      poly(runko, "url(#" + hid + "-cel)");
      poly(runko, "url(#" + hid + "-kiilto)");
      out.push('<line x1="' + N(ala[0] - rx) + '" y1="' + N(ala[1]) + '" x2="' +
        N(yla[0] - rx) + '" y2="' + N(yla[1]) + '" stroke="' + M.viiva +
        '" stroke-width="' + lev + '"/>');
      out.push('<line x1="' + N(ala[0] + rx) + '" y1="' + N(ala[1]) + '" x2="' +
        N(yla[0] + rx) + '" y2="' + N(yla[1]) + '" stroke="' + M.viiva +
        '" stroke-width="' + lev + '"/>');
      if (kansi !== false) C.ympyra("xy", [x, y, z1], r, savy([0, 0, 1]), true);
      return {rx: rx, ry: ry, ala: ala, yla: yla};
    };

    /* Kierre: vinot vedot tangon yli. Ei todellista kierrettä vaan sen konventio —
       sama merkintätapa kuin konepiirustuksessa, ja se luetaan heti. */
    C.kierre = function (x, y, z0, z1, r) {
      var t = C.tanko(x, y, z0, z1, r, M.sivu, false);
      var nousu = 6, n = Math.max(3, Math.round((z1 - z0) / nousu));
      out.push('<clipPath id="' + hid + '-k' + N(z0) + '"><rect x="' +
        N(t.ala[0] - t.rx) + '" y="' + N(t.yla[1]) + '" width="' + N(2 * t.rx) +
        '" height="' + N(t.ala[1] - t.yla[1]) + '"/></clipPath>');
      out.push('<g clip-path="url(#' + hid + '-k' + N(z0) + ')" stroke="' + M.viiva +
        '" stroke-width="' + N(lev * 0.8) + '" opacity=".75">');
      for (var i = 0; i <= n; i++) {
        var yy = t.yla[1] + (t.ala[1] - t.yla[1]) * i / n;
        out.push('<line x1="' + N(t.ala[0] - t.rx) + '" y1="' + N(yy) + '" x2="' +
          N(t.ala[0] + t.rx) + '" y2="' + N(yy - t.ry * 0.9) + '"/>');
      }
      out.push("</g>");
      C.ympyra("xy", [x, y, z1], r, M.yla, true);                   /* yläpää */
      return t;
    };

    /* Kuusiomutteri = kuusikulmainen levy vaakatasossa. Avainväli on se mitta,
       joka mutterista tunnetaan, joten säde johdetaan siitä. */
    C.mutteri = function (x, y, z, avainvali, korkeus) {
      var R = avainvali / Math.sqrt(3), i, kuusi = [];
      for (i = 0; i < 6; i++) {
        var a = Math.PI / 6 + i * Math.PI / 3;
        kuusi.push([x + R * Math.cos(a), y + R * Math.sin(a)]);
      }
      C.levy(kuusi, "xy", z, korkeus, M.yla);
    };

    /* Takorengas pystytasossa: paksu veto ellipsin ympäri. Torus piirtyy tällä
       tavalla luotettavammin kuin pintoina, ja kiilto tulee toisella ohuemmalla
       vedolla saman polun päälle. */
    C.rengas = function (taso, keskus, r, paksuus) {
      /* Vedon leveys on tässä *todellinen mitta* (renkaan paksuus), ei hiusviiva.
         Siksi se ei saa olla non-scaling-stroke: se pitäisi leveyden vakiona
         ruudulla, jolloin kuva olisi oikein vain omassa vientikoossaan ja
         muuttuisi 84 pikselin tuoterivillä yhdeksi harmaaksi möykyksi.
         ympyra() piirtää yksikköympyrän matriisilla, joka skaalaa r·K-kertaiseksi,
         joten leveys jaetaan samalla kertoimella — silloin veto skaalautuu kuvan
         mukana kuten kaikki muukin. */
      var sk = r * K, w = paksuus * K / sk, e = "";
      /* Takorengas on paksu veto ellipsin ympäri: kolme vetoa samalle polulle —
         särmä, runko ja katkoviivainen kiilto. Pintoina piirrettynä torus vaatisi
         kymmeniä nelikulmioita eikä näyttäisi paremmalta. */
      C.ympyra(taso, keskus, r, "none", false,
        ' stroke="' + M.viiva + '" stroke-width="' + N(w + 2 * lev / sk) + '"' + e);
      C.ympyra(taso, keskus, r, "none", false,
        ' stroke="' + M.sivu + '" stroke-width="' + N(w) + '"' + e);
      C.ympyra(taso, keskus, r, "none", false,
        ' stroke="' + M.yla + '" stroke-width="' + N(w * 0.3) +
        '" stroke-dasharray="' + N(w * 0.9) + " " + N(w * 3.4) + '" opacity=".85"' + e);
    };

    C.varjo = function (laatikko) {
      var x = laatikko.x, y = laatikko.y;
      var p = [[x[0], y[0], 0], [x[1], y[0], 0], [x[1], y[1], 0], [x[0], y[1], 0]].map(P);
      out.push('<g filter="url(#' + hid + '-sumu)" opacity=".15">');
      poly(p.map(function (q) { return [q[0] + 7 * K * CX, q[1] + 4 * K * CX]; }), M.viiva);
      out.push("</g>");
    };

    /* ---- Puun paikka piirtojärjestyksessä ----
       Yhdistelmäkuvassa (yhdistelmakuva.js) lauta tai tolppa on tarvikkeen
       *sisällä*: pilarikengän urassa etulevyn takana, palkkikengän satulassa,
       teräslaatan päällä. Kumpi levy on puun edessä, ei ole pääteltävissä
       kuvasta jälkikäteen — sen tietää vain osan oma piirtofunktio, ja siksi
       koukku on tässä eikä siellä. Ilman puuta se ei tee mitään. */
    C.puu = function () {};

    return C;
  }

  /* ---- Tuotteet -----------------------------------------------------------
     `arvio: true` tarkoittaa, että mitta on luettu tuotekuvasta eikä lähteestä.
     Nimessä oleva mitta on aina tosi. */
  /* M20 × 50. Ratkaistu 18.9.2026: pilariesite 2023 (s. 11) ja Rakentajan opas 2025
     (s. 5) sanovat molemmat M20×50 kaikkien kolmen teräslaatan koodissa. Nykysivuston
     otsikoiden M20×100 on sivuston oma virhe, ja jälleenmyyjien M20×70 sen kanssa
     ristiriidassa. Piirroksissa oli 70. */
  var KIERRE = 50;
  var TAPPI = 10;         /* M20, säde */

  var OSAT = {
    "pik-50-70": {
      nimi: "Pieni pilarikenkä PIK 50-70", koodi: "PIK 50-70", ryhma: "Pilarikengät",
      /* ura 70 = nimen suurin lankkukoko. Muu on tuotekuvasta. */
      ura: 70, lev: 90, kork: 100, t: 5, pohja: 90, av: 30, arvio: "levyn koko, reikäjako",
      laatikko: {x: [-50, 50], y: [-50, 50], z: [-KIERRE - 24, 100 + 5]},
      piirra: function (C, o) { kenka(C, o, false); }
    },
    "pik-90-140": {
      nimi: "Pilarikenkä PIK 90-140", koodi: "PIK 90-140", ryhma: "Pilarikengät",
      ura: 140, lev: 130, kork: 135, t: 6, pohja: 130, av: 30, laatta: 110,
      arvio: "levyn koko, reikäjako, pyöreän laatan halkaisija",
      laatikko: {x: [-80, 80], y: [-75, 75], z: [-KIERRE - 30, 135 + 6]},
      piirra: function (C, o) { kenka(C, o, true); }
    },
    "p-pik-50x70": {
      nimi: "Pieni L-mallinen pilarikenkä P-PIK 50×70", koodi: "P-PIK 50×70",
      ryhma: "Pilarikengät",
      ura: 70, lev: 70, kork: 100, t: 5, jalka: 70, av: 30,
      arvio: "levyn korkeus, jalan pituus, reikäjako",
      laatikko: {x: [-40, 80], y: [-40, 40], z: [-KIERRE - 24, 100 + 5]},
      piirra: function (C, o) { ppik(C, o); }
    },
    "pak-100x150": {
      nimi: "Palkkikenkä PAK-100×150", koodi: "PAK-100×150", ryhma: "Palkkikengät",
      palkki: 100, kork: 150, t: 3, syvyys: 70, laippa: 35,
      arvio: "levyn paksuus, syvyys, laipan pituus, reikäjako",
      laatikko: {x: [-90, 90], y: [-50, 50], z: [0, 150]},
      piirra: function (C, o) { pak(C, o); }
    },
    "pak-100x200": {
      nimi: "Palkkikenkä PAK-100×200", koodi: "PAK-100×200", ryhma: "Palkkikengät",
      palkki: 100, kork: 200, t: 3, syvyys: 70, laippa: 35,
      arvio: "levyn paksuus, syvyys, laipan pituus, reikäjako",
      laatikko: {x: [-90, 90], y: [-50, 50], z: [0, 200]},
      piirra: function (C, o) { pak(C, o); }
    },
    "tl-100x100": {
      nimi: "Teräslaatta TL 100×100×6", koodi: "TL 100×100×6 M20×50", ryhma: "Teräslaatat",
      a: 100, b: 100, t: 6, reiat: "vastakkaiset", rr: 4.5,
      arvio: "reikien etäisyys nurkasta",
      laatikko: {x: [-55, 55], y: [-55, 55], z: [-KIERRE, 6]},
      piirra: function (C, o) { laatta(C, o); }
    },
    "tl-150x150": {
      nimi: "Teräslaatta TL 150×150×8", koodi: "TL 150×150×8 M20×50", ryhma: "Teräslaatat",
      a: 150, b: 150, t: 8, reiat: "nelja", rr: 4.5,
      arvio: "reikien etäisyys nurkasta. Paksuus 6 vai 8 on avoin (speksi, luku 8)",
      laatikko: {x: [-80, 80], y: [-80, 80], z: [-KIERRE, 8]},
      piirra: function (C, o) { laatta(C, o); }
    },
    "tl-100x175": {
      nimi: "Teräslaatta TL 100×175×6", koodi: "TL 100×175×6 M20×50", ryhma: "Teräslaatat",
      a: 175, b: 100, t: 6, reiat: "nelja", rr: 4.5,
      arvio: "reikien etäisyys nurkasta",
      laatikko: {x: [-95, 95], y: [-55, 55], z: [-KIERRE, 6]},
      piirra: function (C, o) { laatta(C, o); }
    },
    "nostokorva-m20": {
      nimi: "Nostokorva M20", koodi: "Nostokorva M20", ryhma: "Nostokorva",
      rengas: 25, tuubi: 7, kaulus: 17, kh: 12,
      arvio: "kaikki mitat paitsi M20-kierre",
      laatikko: {x: [-20, 20], y: [-20, 20], z: [-38, 78]},
      piirra: function (C, o) { nostokorva(C, o); }
    }
  };

  /* ---- Piirtofunktiot ----------------------------------------------------- */

  /* Pilarikenkä: kaksi pystylevyä uran molemmin puolin, pohjalevy, mutteri ja
     kierretappi. Uran suunta on y, joten levyt ovat kohtisuorassa x:ää vastaan ja
     katsoja näkee etummaisen levyn ulkopinnan ja takimmaisen sisäpinnan — silloin
     ura lukee urana eikä umpinaisena palana. */
  function kenka(C, o, pyorea) {
    var g = o.ura / 2, h = o.kork, sy = o.lev / 2, t = o.t, p = o.pohja / 2;
    var laattaH = pyorea ? 8 : 0;
    var mz = -o.t - laattaH - 16;

    /* Alhaalta ylös: kamera on ylhäällä, joten korkeampi osa on lähempänä ja
       piirtyy päälle. Kierretappi on kauimpana, kengän levyt lähimpänä.

       Säätömutteri piirretään, vaikka se jää tästä kulmasta pohjalevyn taakse.
       Se ei ole virhe eikä sitä siirretä näkyviin: mutteri on oikeasti heti
       pohjalevyn alla, ja 23 asteen katselukulmasta 90 mm:n levy peittää sen.
       Jos kamera joskus lasketaan, mutteri ilmestyy oikeaan paikkaan. Sama
       koskee PIK 90-140:n pyöreää säätölaattaa. */
    C.kierre(0, 0, mz - KIERRE, mz, TAPPI);
    C.mutteri(0, 0, mz, o.av, 16);
    if (pyorea) C.tanko(0, 0, -o.t - laattaH, -o.t, o.laatta / 2, null);
    C.levy([[-p, -p], [p, -p], [p, p], [-p, p]], "xy", -o.t, o.t);

    /* Kaksi pystylevyä uran molemmin puolin. Ura on y-suuntainen, joten katsoja
       näkee etummaisen levyn ulkopinnan ja takimmaisen sisäpinnan — vasta silloin
       ura lukee urana eikä umpinaisena palana. Takimmainen ensin. */
    [-1, 1].forEach(function (s2) {
      /* Tolppa uraan takalevyn jälkeen: etulevy jää sen eteen, ja juuri siitä
         kuva kertoo, että puu on urassa eikä kengän vieressä. */
      if (s2 === 1) C.puu();
      var x = s2 > 0 ? g : -g - t;
      var reuna = [[-sy, 0], [sy, 0], [sy, h - 20], [sy - 22, h], [-sy, h]];
      C.levy(reuna, "yz", x, t);
      /* Reiät käyvät levyn läpi, joten ne näkyvät kummallakin. */
      for (var r = 0; r < 3; r++) for (var c = 0; c < 2; c++) {
        C.reika("yz", [x + t, -sy / 2.4 + c * sy / 1.2, 24 + r * (h - 48) / 2], 4);
      }
    });
  }

  /* P-PIK: puolikas kenkä. Yksi pystylevy ja siitä sivulle taittuva jalka. */
  function ppik(C, o) {
    var sy = o.lev / 2, h = o.kork, t = o.t, jx = o.jalka;
    var tx = t + jx * 0.34;
    C.kierre(tx, 0, -16 - KIERRE, -16, TAPPI);
    C.mutteri(tx, 0, -16, o.av, 16);
    /* Tolppa on pystylevyn takana (x < 0) ja jalka sen edessä (x > 0), joten
       puu piirtyy jalan ja pystylevyn väliin — ei kummankaan päälle. */
    C.puu();
    /* jalka lähtee pystylevyn juuresta sivulle: siitä tunnistaa puolikkaan kengän */
    C.levy([[t, -sy], [t + jx, -sy], [t + jx, sy], [t, sy]], "xy", 0, t);
    C.reika("xy", [t + jx * 0.72, 0, t], 4.5);
    C.levy([[-sy, 0], [sy, 0], [sy, h - 20], [sy - 20, h], [-sy, h]], "yz", 0, t);
    for (var r = 0; r < 3; r++) for (var c = 0; c < 2; c++) {
      C.reika("yz", [t, -sy / 2.4 + c * sy / 1.2, 24 + r * (h - 48) / 2], 4);
    }
  }

  /* Palkkikenkä: U-satula palkille, kaksi korkeaa selkälevyä ja niiden yläpäässä
     ulospäin taittuvat laipat. Ohutlevyä, joten t on pieni ja särmiä on paljon —
     juuri siitä osan tunnistaa. */
  function pak(C, o) {
    var pb = o.palkki / 2, h = o.kork, t = o.t, sy = o.syvyys / 2, la = o.laippa;

    /* pohja on alimpana ja siksi kauimpana kamerasta */
    C.levy([[-pb, -sy], [pb, -sy], [pb, sy], [-pb, sy]], "xy", 0, t);

    [-1, 1].forEach(function (s2) {
      /* Palkki satulaan takalevyn ja sen laipan jälkeen. Palkki työntyy ulos
         satulasta y:n suuntaan, mutta ulostyöntyvä pää ei osu näytöllä
         etulevyn kanssa päällekkäin, joten yksi piirtojärjestys riittää. */
      if (s2 === 1) C.puu();
      var x = s2 > 0 ? pb : -pb - t;
      C.levy([[-sy, 0], [sy, 0], [sy, h], [-sy, h]], "yz", x, t);
      /* naulareiät: kaksi saraketta koko korkeudelle, kuten tuotekuvassa */
      for (var r = 0; r < 4; r++) for (var c = 0; c < 2; c++) {
        C.reika("yz", [x + t, -sy / 2 + c * sy, 24 + r * (h - 52) / 3], 4);
      }
      /* yläpään laippa taittuu ulospäin */
      var x0 = s2 > 0 ? pb : -pb - t - la;
      C.levy([[x0, -sy], [x0 + la + t, -sy], [x0 + la + t, sy], [x0, sy]], "xy", h, t);
      C.reika("xy", [s2 * (pb + la * 0.62), 0, h + t], 5);
    });
  }

  /* Teräslaatta: laatta vaakatasossa, kierretappi keskeltä alas. Reiät ovat se,
     mikä laatat erottaa toisistaan, joten ne piirretään tarkasti nimen mukaan. */
  function laatta(C, o) {
    var a = o.a / 2, b = o.b / 2, t = o.t, r = 11, rr = o.rr;
    /* Nurkat viistetty. Kaari ei näy tässä koossa, joten kahdeksankulmio riittää —
       ja se on kierrettävä yhteen suuntaan, muuten monikulmio leikkaa itsensä. */
    var reuna = [[-a + r, -b], [a - r, -b], [a, -b + r], [a, b - r],
                 [a - r, b], [-a + r, b], [-a, b - r], [-a, -b + r]];
    /* Kierretappi ensin: se on laatan alla, eli kauempana kamerasta. */
    C.kierre(0, 0, -KIERRE, 0, TAPPI);
    C.levy(reuna, "xy", 0, t);
    var d = 17;
    var kohdat = o.reiat === "vastakkaiset"
      ? [[-a + d, -b + d], [a - d, b - d]]
      : [[-a + d, -b + d], [a - d, -b + d], [a - d, b - d], [-a + d, b - d]];
    kohdat.forEach(function (p) { C.reika("xy", [p[0], p[1], t], rr); });
    /* Hitsauspullistuma tapin juuressa. Yläpinnan sävyllä, jotta se lukee
       kohoumaksi eikä reiäksi — tumma ympyrä laatan keskellä näyttäisi reiältä,
       ja juuri reikien määrä erottaa laatat toisistaan. */
    C.ympyra("xy", [0, 0, t], TAPPI * 1.35, M.yla, true);
    /* Puu laatan päälle, siis kaikkein viimeisenä: laatta on tasainen alusta. */
    C.puu();
  }

  /* Nostokorva: takorengas pystytasossa, kaulus ja M20-kierre. Ainoa tarvike joka
     ei jää rakenteeseen — se on asennuksen apuväline. */
  function nostokorva(C, o) {
    C.kierre(0, 0, -38, 0, TAPPI);
    C.tanko(0, 0, 0, o.kh, o.kaulus, null);
    C.rengas("yz", [0, 0, o.kh + o.rengas + o.tuubi], o.rengas, o.tuubi * 2);
  }

  /* ---- Defs ---------------------------------------------------------------
     Cel-varjostus ja kiilto ovat kovareunaisia liukuja: kaksi stoppia samassa
     kohdassa tekee terävän rajan, ja juuri se erottaa metallin betonista. */
  function defs(hid, CH) {
    return '<defs>' +
      '<linearGradient id="' + hid + '-cel" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + CH + '" y2="' + CH + '">' +
        '<stop offset="0" stop-color="#ffffff" stop-opacity=".16"/>' +
        '<stop offset=".52" stop-color="#ffffff" stop-opacity=".16"/>' +
        '<stop offset=".52" stop-color="#1d2226" stop-opacity=".07"/>' +
        '<stop offset="1" stop-color="#1d2226" stop-opacity=".13"/></linearGradient>' +
      '<linearGradient id="' + hid + '-kiilto" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="' + CH + '" y2="' + CH + '">' +
        '<stop offset=".18" stop-color="#ffffff" stop-opacity="0"/>' +
        '<stop offset=".22" stop-color="#ffffff" stop-opacity=".58"/>' +
        '<stop offset=".26" stop-color="#ffffff" stop-opacity="0"/>' +
        '<stop offset=".62" stop-color="#ffffff" stop-opacity="0"/>' +
        '<stop offset=".655" stop-color="#ffffff" stop-opacity=".34"/>' +
        '<stop offset=".69" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
      '<filter id="' + hid + '-sumu" x="-40%" y="-40%" width="180%" height="180%">' +
        '<feGaussianBlur stdDeviation="6"/></filter>' +
      '</defs>';
  }

  /* ---- Julkinen ------------------------------------------------------------
       id      pakollinen kun samalla sivulla on kaksi kuvaa (defs-id:t)
       korkeus kankaan korkeus pikseleinä
       skaala  px/mm suoraan. Kun annettu, korkeus ohitetaan — näin usea tarvike
               piirtyy samaan mittakaavaan ja kokoerot ovat tosia */
  function tarvikekuva(o) {
    o = o || {};
    var avain = o.osa, T2 = OSAT[avain];
    if (!T2) return "";
    var L = T2.laatikko, reuna = 18;

    /* silhuetin laatikko: kahdeksan kulmaa projisoituna */
    var xs = [], ys = [], i, j, k;
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) {
      xs.push((L.x[i] - L.y[j]) * CX);
      ys.push((L.x[i] + L.y[j]) * CY - L.z[k]);
    }
    var mmLev = Math.max.apply(null, xs) - Math.min.apply(null, xs);
    var mmKor = Math.max.apply(null, ys) - Math.min.apply(null, ys);

    var K = o.skaala || (o.korkeus || 300) / mmKor;
    var CW = Math.round(mmLev * K + 2 * reuna), CH = Math.round(mmKor * K + 2 * reuna);
    var ox = reuna - Math.min.apply(null, xs) * K;
    var oy = reuna - Math.min.apply(null, ys) * K;
    var lev = o.viiva || Math.max(0.9, Math.min(2, CW / 300));

    var hid = "tv-" + String(o.id || avain).toLowerCase().replace(/[^a-z0-9-]/g, "");
    var out = [];
    var C = piirto(out, K, ox, oy, hid, lev);
    /* Varjo ei ole oletus: tarvike ei seiso maassa vaan kiertyy pilarin päähän,
       joten kontaktivarjo väittäisi alustaa jota ei ole. */
    if (o.varjo === true) C.varjo(L);
    T2.piirra(C, T2);

    var nimike = o.nimike || T2.nimi + ", havainnekuva vinosti ylhäältä";
    var a11y = o.koriste ? ' aria-hidden="true" focusable="false"'
                         : ' role="img" aria-label="' + nimike.replace(/"/g, "&quot;") + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + '>' +
      (o.koriste ? "" : "<title>" + nimike + "</title>") +
      defs(hid, CH) + out.join("") + "</svg>";
  }

  /* mm-korkeus silhuetille: tarvitaan kun usea tarvike piirretään samaan
     mittakaavaan ja jokainen saa oman kankaansa. */
  tarvikekuva.laajuus = function (avain) {
    var L = OSAT[avain].laatikko, ys = [], i, j, k;
    for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) for (k = 0; k < 2; k++) {
      ys.push((L.x[i] + L.y[j]) * CY - L.z[k]);
    }
    return Math.max.apply(null, ys) - Math.min.apply(null, ys);
  };
  /* ---- Siluetti: litteä ikoni ----------------------------------------------
     Eri tehtävä kuin tuotekuvalla, ja siksi eri piirtotapa. Tuotekuva jättää
     muistijäljen muodosta 200 pikselissä; ikoni erottaa neljä ryhmää toisistaan
     24 pikselissä. Kolmiulotteinen kuva ei tee sitä: mitattuna 8 ikonia
     tuotekuvina on noin 82 kB merkkausta ja 68 kB generaattoria joka sivulle,
     eikä se lue siinä koossa (CLAUDE.md: ikoni joka ei ole konventio ei lue
     34 pikselissä). Siluetti on 200–400 tavua ja seuraa tekstin väriä.

     Kolme sääntöä, jotka tekevät tästä ikonin eivätkä pienoiskuvan:

       Suorasta edestä, ei aksonometriasta. Kamerakulma on tuotekuvan asia;
       ikonissa se veisi puolet pinta-alasta eikä toisi tunnistetta.

       Mittasuhteet osan omista mitoista, paksuudet ruudukosta. Uran ja levyn
       suhde luetaan OSAT-taulukosta, mutta 5 mm:n levy olisi 24 pikselissä
       0,7 px eli näkymätön — siksi jokaisella osalla on alaraja. Ikoni ei ole
       mitta, ja tämä on se kohta jossa se lakkaa olemasta.

       Reikä on aito aukko (fill-rule evenodd), ei vaaleampi täplä. Silloin
       ikoni toimii myös tummalla pohjalla, ja teräslaatan tunnistaa rei'istä.

     Ryhmä ratkaisee muodon, ei yksittäinen nimike: valikossa on neljä ryhmää.
     Pilarikenkä on U ja sen alla kierretappi, palkkikenkä on U jonka yläpäässä
     laipat kääntyvät ulos eikä alla ole tappia, teräslaatta on palkki rei'illä
     ja tappi, nostokorva on rengas. Ne neljä eivät voi mennä sekaisin. */
  function siluetti(avain, korkeus) {
    var T = OSAT[avain];
    if (!T) return "";
    var G = 24;                       /* ikoniruudukko: korkeus on aina 24 yksikköä */
    var ohuin = 2.4;                  /* ohuin osa, jonka 24 px:n ikoni vielä näyttää */
    var d = [], W;

    function suorakaide(x, y, w, h) {
      d.push("M" + N(x) + " " + N(y) + "h" + N(w) + "v" + N(h) + "h" + N(-w) + "z");
    }
    function ympyra(cx, cy, r) {
      d.push("M" + N(cx - r) + " " + N(cy) +
             "a" + N(r) + " " + N(r) + " 0 1 0 " + N(2 * r) + " 0" +
             "a" + N(r) + " " + N(r) + " 0 1 0 " + N(-2 * r) + " 0z");
    }
    /* Kierretappi: sama osa kaikissa, joten sama muoto ja sama paikka. */
    function tappi(keskiX, y, kork) {
      suorakaide(keskiX - 1.7, y, 3.4, kork);
    }

    if (T.ryhma === "Pilarikengät") {
      /* U ja sen alla tappi. P-PIK on puolikas: yksi levy ja jalka sivulle. */
      var puoli = T.jalka != null;
      W = puoli ? 20 : 20;
      var seina = Math.max(ohuin, W * T.t / (T.pohja || T.lev));
      var pohjaY = 15, pohjaH = 3;
      if (puoli) {
        suorakaide(0, 0, seina + 1, pohjaY + pohjaH);          /* pystylevy */
        suorakaide(seina + 1, pohjaY, W - seina - 1, pohjaH);  /* jalka sivulle */
        tappi(seina + 1 + (W - seina - 1) * 0.55, pohjaY + pohjaH, G - pohjaY - pohjaH);
      } else {
        suorakaide(0, 0, seina, pohjaY);                       /* vasen levy */
        suorakaide(W - seina, 0, seina, pohjaY);               /* oikea levy */
        suorakaide(0, pohjaY, W, pohjaH);                      /* pohjalevy */
        tappi(W / 2, pohjaY + pohjaH, G - pohjaY - pohjaH);
      }
    } else if (T.ryhma === "Palkkikengät") {
      /* U, jonka yläpäässä laipat kääntyvät ulos. Ei tappia — siitä sen
         erottaa pilarikengästä yhdellä silmäyksellä. */
      /* Laipan pituus tulee osan mitoista, seinämä ruudukosta: 3 mm:n ohutlevy
         olisi tässä koossa 0,7 px. Ohut seinämä ja pitkä laippa ovat myös se,
         mistä satula tunnistetaan — paksu seinämä teki siitä kirjaimen. */
      var lai = Math.min(5, Math.max(3, 24 * T.laippa / (T.palkki + 2 * T.laippa)));
      var sein2 = ohuin;
      W = 24;
      var satulaX = lai, satulaW = W - 2 * lai;
      suorakaide(0, 0, lai + sein2, sein2);                          /* vasen laippa */
      suorakaide(W - lai - sein2, 0, lai + sein2, sein2);            /* oikea laippa */
      suorakaide(satulaX, sein2, sein2, G - sein2);                  /* vasen levy */
      suorakaide(satulaX + satulaW - sein2, sein2, sein2, G - sein2); /* oikea levy */
      suorakaide(satulaX, G - 3, satulaW, 3);                        /* pohja */
    } else if (T.ryhma === "Teräslaatat") {
      /* Palkki, kaksi tai neljä reikää ja tappi. Reiät ovat aitoja aukkoja:
         juuri niistä laatan tunnistaa, ja niiden määrä erottaa laatat. */
      W = 24;
      var paksu = 6, yl = 5;
      suorakaide(0, yl, W, paksu);
      var reikia = T.reiat === "vastakkaiset" ? 2 : 4;
      var rR = 1.6, marg = 3.2;
      for (var i = 0; i < reikia; i++) {
        var x = reikia === 2 ? (i ? W - marg : marg)
              : marg + i * (W - 2 * marg) / (reikia - 1);
        ympyra(x, yl + paksu / 2, rR);
      }
      tappi(W / 2, yl + paksu, G - yl - paksu);
    } else {
      /* Nostokorva: rengas, kaulus ja tappi. Renkaan aukko on se tunniste. */
      W = 18;
      var rUlko = 7.4, rSisa = Math.max(2.6, rUlko * T.tuubi / (T.rengas * 0.9));
      ympyra(W / 2, rUlko, rUlko);
      ympyra(W / 2, rUlko, rSisa);
      suorakaide(W / 2 - 3, 2 * rUlko - 0.5, 6, 4);
      tappi(W / 2, 2 * rUlko + 3.5, G - 2 * rUlko - 3.5);
    }

    var kork = korkeus || 24;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + N(W) + " " + G +
      '" width="' + N(kork * W / G) + '" height="' + N(kork) +
      '" focusable="false" aria-hidden="true">' +
      '<path d="' + d.join("") + '" fill="currentColor" fill-rule="evenodd"/></svg>';
  }

  /* ---- Julkinen: matala taso ----------------------------------------------
     Yhdistelmäkuva piirtää tarvikkeen ja puun samaan kankaaseen, joten se
     tarvitsee osan piirron ilman omaa SVG-kuorta ja omaa mittakaavaa.
       out  taulukko johon SVG-palat työnnetään
       o    osa · K · ox · oy · hid · viiva · puu (koukku, ks. C.puu)
     Palauttaa piirtokontekstin, jotta kutsuja voi tarvittaessa jatkaa samalla. */
  tarvikekuva.piirra = function (out, o) {
    var T2 = OSAT[o.osa];
    if (!T2) return null;
    var C = piirto(out, o.K, o.ox, o.oy, o.hid || "tv", o.viiva ||
                   Math.max(0.9, Math.min(2, o.K * 90)));
    if (o.puu) C.puu = o.puu;
    T2.piirra(C, T2);
    return C;
  };
  tarvikekuva.defs = defs;
  tarvikekuva.siluetti = siluetti;
  tarvikekuva.osat = function () { return Object.keys(OSAT); };
  tarvikekuva.tieto = function (avain) { return OSAT[avain]; };
  window.tarvikekuva = tarvikekuva;
})();
