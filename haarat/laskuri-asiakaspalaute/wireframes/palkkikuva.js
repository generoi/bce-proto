/* Palkkikuva: sahatavaraa kolmiulotteisena, samasta kulmasta kuin tuotekuva.js.

   Laskurin kysymys «Minkä kokoista palkkia käytät?» on kolme lukuparia
   allekkain (48 × 123, 48 × 148, 48 × 198). Numeropari ei kerro kenellekään,
   miltä se näyttää pinossa rautakaupassa. Tämän kuvan koko tehtävä on olla
   tunnistettava lauta: päätypuu vuosirenkaineen, syykuvio lappeella, oksa,
   pyöristetty särmä. Ei mittaviivoja — ne olisivat eri tehtävä.

   Mitat luetaan kokotunnuksesta, ei taulukosta. «48x148» ON mitat, joten tässä
   tiedostossa ei ole toista kopiota luvuista: laskuri antaa saman merkkijonon
   kuin sen oma state.beam (bce-pilarilaskuri.html, rPalkki). Jos kokoluettelo
   muuttuu siellä, tänne lisätään vain uusi tunnus.

   Lähteet
     koot     bce-pilarilaskuri.html, palkkivalinta 18.9.2026 (lähde KESTOPUU:
              tukien väli palkkikoon mukaan, C18). Poikkileikkaus on suoraan
              tunnuksessa: 48 mm paksu, 123 / 148 / 198 mm korkea
     asento    palkki piirretään syrjällään, kuten se asennetaan — korkeus on se
              mitta, jonka käyttäjä valitsee, ja sen on oltava kuvan pystymitta
     muoto     mitallistettu havusahatavara: särmät pyöristetty, lape tasainen,
              pää sahattu poikki

   Kolme kohtaa on tulkintaa. Ne eivät ole tuotetietoa, ja ne on syytä tietää
   ennen kuin kuvia käytetään muualla kuin valinnan havainnollistamiseen:
     pituus     480 mm on näytepalan pituus, ei tuotteen pituus. Sama kaikissa
                koissa, jotta ainoa ero kuvien välillä on poikkileikkaus —
                juuri se, minkä käyttäjä valitsee
     kyllästys  piirretty kuivana sahapintana ilman kyllästysväriä. Kestopuuta
                myydään sekä vihreänä (AB) että ruskeana, eikä laskuri kysy
                kumpaa; väärä väri väittäisi valinnan, jota ei ole tehty
     syykuvio   vuosirenkaiden väli (n. 5,5 mm) ja ytimen sijainti palan
                ulkopuolella ovat tavanomaista suomalaista kuusi- ja
                mäntytavaraa, eivät mittaustulos

   Värit tulevat tokeneista (bce-v4.css, --puu-*). Kuva on läpinäkyvä: taustaa ei
   piirretä, jotta se istuu sille pinnalle jolle se asetetaan. */
(function () {
  "use strict";

  /* ---- Projektio ----------------------------------------------------------
     Kamera luetaan tuotekuva.js:stä samalla tavalla kuin tarvikekuva.js:ssä, eikä
     siihen ole vaihtoehtoa: palkki, pilari ja tarvike näkyvät samassa kuvassa,
     joten ne eivät voi olla eri kulmassa. Fallback on mukana, jotta tämä tiedosto
     toimii yksinään. Aksonometria, ei perspektiiviä — pystymitat 1:1, joten 198 on
     kuvassa täsmälleen 1,61 kertaa 123. */
  var PR = (window.tuotekuva && window.tuotekuva.projektio) ||
           {CX: 0.866, CY: 0.42, katse: [1, 1, 0.84]};
  var CX = PR.CX, CY = PR.CY, KATSE = PR.katse;

  /* Pinta näkyy kun sen ulkonormaali osoittaa katsojaan. */
  function nakyy(n) {
    return n[0] * KATSE[0] + n[1] * KATSE[1] + n[2] * KATSE[2] > 1e-9;
  }

  /* ---- Asento --------------------------------------------------------------
     Kappaleella on omat akselinsa: u pituus, v paksuus (b), w korkeus (h).
     `akselit` kertoo mihin maailman akseliin kukin niistä osoittaa, ja se on
     ainoa ero vaakapalkin, pystytolpan ja lappeellaan makaavan laudan välillä.
     Kaikki kolme osoittavat aina positiiviseen suuntaan, jolloin sekä päätypuu
     (+u) että molemmat koristellut pinnat (+v, +w) ovat aina katsojaan päin.

       "xyz"  vaakapalkki syrjällään, pituus oikealle   (oletus, yksinäiskuvat)
       "yxz"  sama toisin päin — palkkikengän satulassa palkki kulkee y:n suuntaan
       "zxy"  pystytolppa — pilarikengän ura on y:n suuntainen, tolppa nousee z:ssä
       "xzy"  lappeellaan makaava lauta — paksuus pystyssä, leveys vaakatasossa */
  var IX = {x: 0, y: 1, z: 2};

  /* Näytepalan pituus ja särmän viiste millimetreinä. Viiste on mitallistetun
     sahatavaran pyöristys; piirretty tasoviisteenä, koska kaari ei erotu tässä
     mittakaavassa mutta särmän kirkas kaistale erottuu. */
  var PITUUS = 480, VIISTE = 3;

  /* Kokoluettelo on sama ja samassa järjestyksessä kuin laskurin rPalkki:ssa. */
  var KOOT = ["48x123", "48x148", "48x198"];

  /* ---- Väri ----------------------------------------------------------------
     Yksi valo ylävasemmalta, kuten betonissa. Päätypuu on erikseen: se on
     himmeämpi kuin lape, koska syyt ovat poikki eikä pinta heijasta samalla
     tavalla. Fallback on mukana, jotta erilleen viety SVG renderöityy ilman
     sivun tyylejä. */
  function T(nimi, fb) { return "var(--" + nimi + "," + fb + ")"; }
  var V = {
    yla:     T("puu-yla", "#e7d7b6"),
    viiste:  T("puu-viiste", "#eee2c8"),
    sivuA:   T("puu-sivu-a", "#dcc9a4"),
    sivuB:   T("puu-sivu-b", "#c6b189"),
    paa:     T("puu-paa", "#d2bd97"),
    syy:     T("puu-syy", "#9b7c4c"),
    oksa:    T("puu-oksa", "#6e5432"),
    viiva:   T("puu-viiva", "#5d4a33"),
    muste:   T("ink", "#252425")
  };

  /* Sahapinnan karheus. Kiinteä pistejoukko eikä satunnaisuus: sama kuva
     piirtyy kahdesti samanlaisena, jolloin vietyä PNG:tä voi verrata
     edelliseen. Sama joukko kuin betonilla — karheus on karheutta. */
  var RAE = [[5,7,.55,.10],[17,4,.40,.08],[29,11,.65,.09],[41,6,.45,.07],
             [9,19,.75,.07],[23,23,.50,.09],[37,18,.40,.08],[49,27,.55,.09],
             [3,33,.45,.09],[15,38,.70,.06],[31,36,.50,.09],[45,43,.40,.09],
             [11,48,.60,.08],[25,53,.45,.09],[39,50,.55,.07],[51,13,.45,.08],
             [7,58,.40,.09],[21,63,.65,.07],[35,60,.45,.09],[47,68,.50,.08],
             [13,72,.55,.07],[27,77,.40,.09],[43,75,.60,.08],[55,35,.45,.09]];

  /* ---- Mitat --------------------------------------------------------------
     Tunnus on mitat. «48x148», «48 × 148» ja «48X148» tarkoittavat samaa. */
  function mitat(koko) {
    var m = /^\s*(\d+)\s*[x×*]\s*(\d+)\s*$/.exec(String(koko || ""));
    if (!m) return null;
    return {b: +m[1], h: +m[2], koko: m[1] + "x" + m[2], nimi: m[1] + " × " + m[2]};
  }
  function nimi(koko) { var M = mitat(koko); return M ? M.nimi : String(koko); }

  function N(v) { return Math.round(v * 100) / 100; }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Toistettava arvonta. Syykuvio ei saa olla käsin aseteltu (kolme kokoa,
     kolme kertaa työtä) muttei myöskään aidosti satunnainen (sama kuva
     piirtyisi joka kerta erilaisena eikä vietyä tiedostoa voisi verrata).
     Siemen on palkin korkeus, joten jokainen koko saa oman kuvionsa ja sama
     koko saa aina saman. */
  function arpoja(siemen) {
    var s = (siemen * 2654435761) % 4294967296;
    return function () {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }

  /* Kuvan koko mm-avaruudessa ennen skaalausta. Vinossa kuvassa pituus kasvattaa
     sekä leveyttä että korkeutta: kauas menevä pää nousee ylös ja lähin kulma
     laskee alas. Siksi korkeuteen kuuluu palkin korkeuden lisäksi koko
     lattiapinta-alan pystyprojektio. */
  function laajuus(M, pit) {
    var s = (pit || PITUUS) + M.b;
    return {lev: s * CX, kor: s * CY + M.h, ala: s * CY / 2};
  }

  /* ---- Yhden palkin piirto -------------------------------------------------
     Palkki on suora särmiö, jonka poikkileikkauksen kulmat on katkaistu.
     Poikkileikkaus on (y, z)-tasossa ja se pursotetaan x:n suuntaan:
       x   pituus, −L…L        (näytepalan pituus)
       y   paksuus, −b…b       (48 mm)
       z   korkeus, 0…h        (123 / 148 / 198 mm)
     Katsoja on suunnassa +x +y, joten näkyviä ovat lape y = +b, pää x = +L ja
     yläsyrjä z = h. Kumpi pinta on näkyvissä, ei ole arvattu vaan laskettu:
     pinnan ulkonormaali pisteellä katselusuuntaan. Niin viisteet tulevat
     oikein ilman, että niitä tarvitsee erikseen päätellä. */
  function palkki(out, M, K, ox, oy, hid, o, osa) {
    /* Kuvio ja valo ovat koko kankaan yhteisiä (hid), mutta leikkausmaskit ovat
       palakohtaisia: rivikuvassa on kolme lautaa samassa dokumentissa, ja kolme
       samannimistä clipPathia tarkoittaa, että kahden viimeisen syyt rajautuvat
       ensimmäisen lappeeseen — eli katoavat. */
    var cid = hid + (osa || "");
    var hl = (o.pituus || PITUUS) / 2, hb = M.b / 2, h = M.h;
    var c = Math.min(VIISTE, M.b * 0.1);
    var lev = o.viiva;
    /* Siemen on korkeus, joten sama koko saa aina saman kuvion. Yhdistelmä-
       kuvassa vierekkäin on kaksi samankokoista lautaa, ja ilman siirrettyä
       siementä ne olisivat sama lauta kahdesti — oksa samassa kohdassa. */
    var rnd = arpoja(h + (o.siemen || 0));

    /* Paikallinen (u,v,w) maailmaan ja siitä kankaalle. Piirtokoodi alempana
       puhuu pelkkää paikallista kieltä, joten asennon vaihto ei kosketa siihen
       riviäkään — se on koko refaktoroinnin idea. */
    var AK = (o.akselit || "xyz").toLowerCase();
    var SII = o.siirto || [0, 0, 0];
    function W(u, v, w) {
      var q = [0, 0, 0];
      q[IX[AK[0]]] = u; q[IX[AK[1]]] = v; q[IX[AK[2]]] = w;
      return [q[0] + SII[0], q[1] + SII[1], q[2] + SII[2]];
    }
    function WN(nu, nv, nw) {
      var n = [0, 0, 0];
      n[IX[AK[0]]] = nu; n[IX[AK[1]]] = nv; n[IX[AK[2]]] = nw;
      return n;
    }
    function P(u, v, w) {
      var q = W(u, v, w);
      return [ox + (q[0] - q[1]) * CX * K, oy + (q[0] + q[1]) * CY * K - q[2] * K];
    }
    function d(pts) {
      return pts.map(function (p) { return N(p[0]) + "," + N(p[1]); }).join(" ");
    }
    function poly(pts, fill, stroke) {
      out.push('<polygon points="' + d(pts) + '" fill="' + (fill || "none") + '"' +
        /* Särmä on läpikuultava: täysi tumma viiva tekee laudasta piirroksen
           laudasta. Ohuella ja vaalealla särmä pysyy terävänä ja puu puuna. */
        (stroke ? ' stroke="' + V.viiva + '" stroke-width="' + lev +
                  '" stroke-opacity=".7" stroke-linejoin="round"' : "") + "/>");
    }
    /* Puupinta: sävy, karheus, koko kuvan läpi kulkeva valo, ääriviiva. */
    function pinta(pts, vari) {
      poly(pts, vari);
      if (o.rakeisuus) poly(pts, "url(#" + hid + "-rae)");
      poly(pts, "url(#" + hid + "-valo)");
      poly(pts, "none", true);
    }
    function viiva(pts, vari, paksuus, peitto) {
      out.push('<polyline points="' + d(pts) + '" fill="none" stroke="' + vari +
        '" stroke-width="' + N(paksuus) + '" stroke-linecap="round"' +
        ' stroke-linejoin="round" opacity="' + peitto + '"/>');
    }
    /* Ellipsi mielivaltaisella tasolla: pisteet lasketaan tason omissa
       koordinaateissa ja projisoidaan yksitellen. Näin oksa makaa lappeella
       eikä kellu sen päällä. */
    function soikio(taso, u0, v0, ru, rv, kulma) {
      var pts = [], i, a, cu = Math.cos(kulma || 0), su = Math.sin(kulma || 0);
      for (i = 0; i < 28; i++) {
        a = i / 28 * 2 * Math.PI;
        pts.push(taso(u0 + ru * Math.cos(a) * cu - rv * Math.sin(a) * su,
                      v0 + ru * Math.cos(a) * su + rv * Math.sin(a) * cu));
      }
      return pts;
    }

    /* Poikkileikkaus vastapäivään (v oikealle, w ylös), kulmat katkaistuna. */
    var PL = [[hb - c, 0], [hb, c], [hb, h - c], [hb - c, h],
              [-hb + c, h], [-hb, h - c], [-hb, c], [-hb + c, 0]];

    /* Pinnan sävy **maailman** normaalista, ei paikallisesta: kun sama kappale
       voi olla vaakapalkki tai pystytolppa, valo ei saa kääntyä sen mukana.
       Neljä porrasta yhdestä valosta ylävasemmalta edestä — vino pinta on
       kirkkain, alaspäin kääntyvä viiste jää varjoon. Rajat on valittu niin,
       että vaakapalkki (akselit "xyz") saa täsmälleen samat sävyt kuin ennen. */
    var VALO = [0.28, 0.52, 0.81];
    function savy(n) {
      var L = Math.hypot(n[0], n[1], n[2]) || 1;
      var d = (n[0] * VALO[0] + n[1] * VALO[1] + n[2] * VALO[2]) / L;
      return d > 0.88 ? V.viiste : d > 0.70 ? V.yla : d > 0.40 ? V.sivuA : V.sivuB;
    }

    /* ---- varjo: kontakti alustaan, ei irrallinen levy ----
       Siirto on isompi kuin pilarilla, koska palkki on matala: pienellä
       siirrolla varjo jää kokonaan kappaleen alle eikä lauta lepää millään. */
    if (o.varjo) {
      var jalki = [P(-hl, -hb, 0), P(hl, -hb, 0), P(hl, hb, 0), P(-hl, hb, 0)];
      out.push('<g filter="url(#' + hid + '-sumu)" opacity=".17">');
      poly(jalki.map(function (p) {
        return [p[0] + 16 * K * CX, p[1] + 13 * K * CX];
      }), V.muste);
      out.push("</g>");
    }

    /* ---- pituussuuntaiset pinnat ---- */
    var i, p, q, ny, nz, pit, nn;
    for (i = 0; i < PL.length; i++) {
      p = PL[i]; q = PL[(i + 1) % PL.length];
      pit = Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]));
      ny = (q[1] - p[1]) / pit; nz = -(q[0] - p[0]) / pit;   /* ulkonormaali */
      nn = WN(0, ny, nz);
      if (!nakyy(nn)) continue;                              /* takapuoli */
      pinta([P(-hl, p[0], p[1]), P(hl, p[0], p[1]),
             P(hl, q[0], q[1]), P(-hl, q[0], q[1])], savy(nn));
    }

    /* ---- pää ---- */
    pinta(PL.map(function (r) { return P(hl, r[0], r[1]); }), V.paa);

    /* ---- päätypuun vuosirenkaat ----
       Ydin on palan ulkopuolella alapuolella: niin se on lähes aina, kun
       48 × 148 sahataan tukista sivulaudaksi, ja siksi renkaat näkyvät
       loivina kaarina eivätkä ympyröinä. Kaaret piirretään pään omassa
       tasossa ja rajataan pään reunaan, jotta ne eivät vuoda lappeelle. */
    if (o.syyt) {
      var PAA = function (y, z) { return P(hl, y, z); };
      out.push('<clipPath id="' + cid + '-paa"><polygon points="' +
        d(PL.map(function (r) { return PAA(r[0], r[1]); })) + '"/></clipPath>');
      out.push('<g clip-path="url(#' + cid + '-paa)">');
      var yd = -0.42 * h;                      /* ytimen etäisyys alareunasta */
      var r = Math.abs(yd), raja = h - yd, pts, j, yy, paksu = false;
      while (r < raja) {
        pts = [];
        for (j = 0; j <= 20; j++) {
          yy = -hb + (2 * hb) * j / 20;
          if (Math.abs(yy) >= r) continue;
          pts.push(PAA(yy, yd + Math.sqrt(r * r - yy * yy)));
        }
        if (pts.length > 1) {
          /* Kesäpuu ohuena, kevätpuu paksuna ja tummempana joka toinen rengas:
             juuri se vuorottelu tekee päädystä puuta eikä viivoitusta. */
          viiva(pts, V.syy, Math.max(0.6, (paksu ? 2.1 : 1.1) * K),
                (paksu ? 0.42 : 0.24) + rnd() * 0.12);
        }
        r += (5.0 + rnd() * 3.6);              /* renkaan väli 5,0–8,6 mm */
        paksu = !paksu;
      }
      /* Yksi kuivumishalkeama ytimen suunnasta. Tuoreessa sahatavarassa niitä
         on, ja se on se yksityiskohta, josta pää tunnistetaan sahatuksi. */
      var hy = (rnd() - 0.5) * hb * 0.8;
      viiva([PAA(hy, h), PAA(hy + hb * 0.12, h - h * 0.26),
             PAA(hy + hb * 0.04, h - h * 0.42)], V.viiva, Math.max(0.5, 1.1 * K), 0.30);
      out.push("</g>");
    }

    /* ---- lappeen syykuvio ----
       Lape on lapeleikattu: syyt kulkevat pituussuuntaan ja taipuvat
       katedraalikuvioksi siellä, missä leikkaus osuu lähelle ydintä. Kuvio
       tehdään yhdellä Gaussin kumpareella, jonka ympärillä viivat nousevat
       sitä korkeammalle mitä lähempänä kuvion keskiviivaa ne ovat — se on
       juuri se muoto, jonka silmä lukee puuksi. */
    var LAPE = function (u, v) { return P(u, hb, v); };

    /* Oksan paikka lasketaan ennen syitä, koska syyt kiertävät sen. Se on koko
       yksityiskohdan idea: irrallinen soikio lappeen päällä näyttää reiältä,
       mutta kun syyt kaartuvat sen ympäri, silmä lukee oksan. */
    var OK = null;
    if (o.oksat) {
      OK = {u: (rnd() - 0.5) * hl * 1.15,
            v: c + (h - 2 * c) * (0.30 + rnd() * 0.38),
            r: Math.min(h * 0.10, 14)};
    }
    function taivu(u, z) {
      if (!OK) return 0;
      var du = (u - OK.u) / (OK.r * 2.6), dv = (z - OK.v) / (OK.r * 2.2);
      return (z >= OK.v ? 1 : -1) * OK.r * 1.15 * Math.exp(-(du * du + dv * dv));
    }

    /* Lappeen rajaus on yhteinen syille ja oksalle, joten se määritellään
       kerran: kumpikin voi olla päällä ilman toista. */
    if (o.syyt || o.oksat) {
      out.push('<clipPath id="' + cid + '-lape"><polygon points="' +
        d([LAPE(-hl, c), LAPE(hl, c), LAPE(hl, h - c), LAPE(-hl, h - c)]) +
        '"/></clipPath>');
    }
    if (o.syyt) {
      out.push('<g clip-path="url(#' + cid + '-lape)">');
      var kesk = (0.3 + rnd() * 0.4) * h;       /* katedraalin keskiviiva */
      var u0 = (rnd() - 0.5) * hl * 1.1;        /* kumpareen paikka pituudella */
      var vale = hl * (0.32 + rnd() * 0.18);    /* kumpareen leveys */
      var n = 13, k, z0, ampl, s2, ll;
      for (k = 0; k < n; k++) {
        /* Väli vaihtelee selvästi: tasavälinen viivasto lukee kankaana. */
        z0 = c + (h - 2 * c) * (k + 0.5) / n + (rnd() - 0.5) * (h / n) * 0.8;
        ampl = (h * 0.30) * Math.exp(-Math.pow((z0 - kesk) / (h * 0.42), 2)) *
               (z0 > kesk ? 1 : -0.35);
        ll = [];
        for (j = 0; j <= 40; j++) {
          var u = -hl + 2 * hl * j / 40;
          s2 = ampl * Math.exp(-Math.pow((u - u0) / vale, 2))
             + h * 0.012 * Math.sin(u / hl * 3.1 + k);
          ll.push(LAPE(u, z0 + s2 + taivu(u, z0 + s2)));
        }
        viiva(ll, V.syy, Math.max(0.6, (0.8 + rnd() * 1.3) * K), 0.16 + rnd() * 0.24);
      }
      out.push("</g>");
    }

    /* ---- oksat ----
       Yksi oksa lappeella ja pieni kuiva oksa yläsyrjässä. Enempää ei
       piirretä: kuva on tuotekuva, ja kolmen oksan lauta näyttäisi väitteeltä
       laatuluokasta. Lappeen oksa on hieman pituussuuntaan venynyt, koska
       leikkaus osuu oksaan vinosti. */
    if (o.oksat) {
      /* Oksa kolmena kehänä: tummuva vyöhyke ympärillä, oksan oma puu ja sen
         omat vuosirenkaat keskellä. Ääriviiva on ohut ja vaalea — paksu musta
         reunus tekisi siitä reiän, ja reikä on eri tuote. */
      var osk = 0.22;                                  /* oksan kallistus */
      out.push('<g clip-path="url(#' + cid + '-lape)">');
      out.push('<polygon points="' + d(soikio(LAPE, OK.u, OK.v, OK.r * 1.7, OK.r * 1.25, osk)) +
        '" fill="' + V.syy + '" opacity=".28"/>');
      out.push('<polygon points="' + d(soikio(LAPE, OK.u, OK.v, OK.r * 1.15, OK.r * 0.8, osk)) +
        '" fill="' + V.oksa + '" opacity=".72"/>');
      out.push('<polygon points="' + d(soikio(LAPE, OK.u, OK.v, OK.r * 0.62, OK.r * 0.42, osk)) +
        '" fill="' + V.oksa + '" opacity=".55"/>');
      out.push('<polygon points="' + d(soikio(LAPE, OK.u, OK.v, OK.r * 1.15, OK.r * 0.8, osk)) +
        '" fill="none" stroke="' + V.viiva + '" stroke-width="' + N(lev * 0.55) +
        '" opacity=".45"/>');
      out.push("</g>");

      /* Pieni kuiva oksa yläsyrjässä. Kaksi oksaa riittää: kolmen oksan lauta
         väittäisi laatuluokasta, eikä laskuri kysy sitä. */
      var SYRJA = function (u, y) { return P(u, y, h); };
      var sr = Math.min(hb * 0.34, 7);
      /* Paikka rajataan niin, ettei oksa valu pään yli: yläsyrjä on kapea ja
         sen päät ovat viistettyjä. */
      var su = Math.max(-hl + sr * 3, Math.min(hl - sr * 3, (rnd() - 0.5) * hl * 1.2));
      var sy0 = (rnd() - 0.5) * (hb - c - sr * 1.4);
      out.push('<polygon points="' + d(soikio(SYRJA, su, sy0, sr * 2.0, sr * 1.3, 0)) +
        '" fill="' + V.syy + '" opacity=".26"/>');
      out.push('<polygon points="' + d(soikio(SYRJA, su, sy0, sr * 1.3, sr * 0.85, 0)) +
        '" fill="' + V.oksa + '" opacity=".6"/>');
    }

    /* ---- yläsyrjän syyt ----
       Kapea pinta, joten viivoja on vähän ja ne ovat lähes suoria: syrjässä
       leikkaus on säteen suuntainen eikä katedraalia synny. */
    if (o.syyt) {
      var SYRJA2 = function (u, y) { return P(u, y, h); };
      for (k = 0; k < 4; k++) {
        var y0 = -hb + c + (2 * hb - 2 * c) * (k + 0.5) / 4;
        ll = [];
        for (j = 0; j <= 14; j++) {
          var uu = -hl + 2 * hl * j / 14;
          ll.push(SYRJA2(uu, y0 + hb * 0.10 * Math.sin(uu / hl * 2.3 + k * 1.7)));
        }
        viiva(ll, V.syy, Math.max(0.5, 0.8 * K), 0.16);
      }
    }

    /* ---- leima ----
       Kestopuussa on lappeella painettu leima. Ei oletuksena: laskurissa koko
       lukee kuvan vieressä, ja leima kertoisi laatuluokan, jota kukaan ei ole
       vahvistanut. Mukana siksi, että katalogissa voi näyttää miltä se näyttäisi. */
    if (o.merkinta) {
      var a = LAPE(-hl * 0.2, h * 0.5);
      var ux = CX * K, uy = CY * K;                    /* pituussuunta */
      var vx = 0, vy = K;                              /* korkeussuunta alaspäin */
      out.push('<text transform="matrix(' + N(ux) + " " + N(uy) + " " + N(vx) + " " +
        N(vy) + " " + N(a[0]) + " " + N(a[1]) + ')" x="0" y="0"' +
        ' text-anchor="middle" font-family="Oswald,Raleway,system-ui,sans-serif"' +
        ' font-size="' + N(Math.min(30, M.h * 0.15)) + '" font-weight="600"' +
        ' letter-spacing=".08em" fill="' + V.muste + '" opacity=".30">' +
        esc(o.leima || M.nimi) + "</text>");
    }
  }

  /* ---- Yhteiset defs -------------------------------------------------------
     Valo on yksi koko kankaan mittainen liuku, ei pintakohtainen. Siksi sama
     pinta on ylhäältä vaaleampi ja alhaalta tummempi riippumatta siitä, monenko
     palkin kuvasta on kyse. */
  function defs(hid, CH, rakeisuus) {
    var d = ["<defs>"];
    if (rakeisuus) {
      d.push('<pattern id="' + hid + '-rae" width="60" height="82" patternUnits="userSpaceOnUse">');
      RAE.forEach(function (r) {
        d.push('<circle cx="' + r[0] + '" cy="' + r[1] + '" r="' + r[2] +
               '" fill="#3d2f1c" opacity="' + r[3] + '"/>');
      });
      d.push("</pattern>");
    }
    d.push('<linearGradient id="' + hid + '-valo" gradientUnits="userSpaceOnUse"' +
      ' x1="0" y1="0" x2="0" y2="' + CH + '">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity=".30"/>' +
      '<stop offset=".5" stop-color="#ffffff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#252425" stop-opacity=".10"/></linearGradient>');
    d.push('<filter id="' + hid + '-sumu" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feGaussianBlur stdDeviation="7"/></filter>');
    d.push("</defs>");
    return d.join("");
  }

  function kuori(sisus, CW, CH, o, nimike) {
    var a11y = o.koriste
      ? ' aria-hidden="true" focusable="false"'
      : ' role="img" aria-label="' + esc(nimike) + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + ">" +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") + sisus + "</svg>";
  }

  function asetukset(o) {
    return {
      varjo:     o.varjo !== false,
      syyt:      o.syyt !== false,
      oksat:     o.oksat !== false,
      rakeisuus: o.rakeisuus !== false,
      merkinta:  !!o.merkinta,
      koriste:   !!o.koriste,
      leima:     o.leima || null,
      pituus:    o.pituus || PITUUS,
      viiva:     o.viiva || 0,
      /* Asento ja paikka. Yksinäiskuvissa oletus; yhdistelmäkuvassa nämä ovat
         se, mikä laittaa laudan kengän uraan eikä sen viereen. */
      akselit:   o.akselit || "xyz",
      siirto:    o.siirto || null,
      siemen:    o.siemen || 0
    };
  }

  function nimike(M) {
    return M.nimi + " mm -palkki, havainnekuva vinosti ylhäältä: pää, lape ja yläsyrjä";
  }

  /* ---- Julkinen: yksi koko -------------------------------------------------
       koko     "48x148" — sama tunnus kuin laskurin state.beam
       korkeus  kankaan korkeus pikseleinä (oletus 300)
       kiintea  true (oletus) = mittakaava lasketaan suurimmasta koosta, jolloin
                48 × 123 piirtyy matalammaksi samaan kankaaseen. false = kuva
                täyttää kankaan koosta riippumatta
       varjo, syyt, oksat, rakeisuus, merkinta, koriste, pituus, id */
  function palkkikuva(o) {
    o = o || {};
    var M = mitat(o.koko || KOOT[1]);
    if (!M) return "";
    var opt = asetukset(o);
    var iso = o.kiintea === false ? laajuus(M, opt.pituus)
                                  : laajuus(mitat(KOOT[KOOT.length - 1]), opt.pituus);
    var oma = laajuus(M, opt.pituus);
    var reuna = 16;
    var K = (o.korkeus || 300) / iso.kor;
    var CW = Math.round(iso.lev * K + 2 * reuna);
    var CH = Math.round(iso.kor * K + 2 * reuna);
    opt.viiva = opt.viiva || Math.max(0.9, Math.min(2.2, CW / 340));

    var hid = "pk-" + String(o.id || M.koko).toLowerCase().replace(/[^a-z0-9-]/g, "");
    var out = [];
    /* Kaikki koot lepäävät samalla tasolla: alareuna on kiinteä, kuten pinossa. */
    palkki(out, M, K, CW / 2, CH - reuna - oma.ala * K, hid, opt, "");
    return kuori(defs(hid, CH, opt.rakeisuus) + out.join(""), CW, CH, opt,
      o.nimike || nimike(M));
  }

  /* ---- Julkinen: kaikki koot rinnakkain ------------------------------------
     Sama mittakaava, sama alataso, sama pituus. Tämä on se kuva, joka vastaa
     kysymykseen «paljonko isompi 198 oikeasti on» ilman että kukaan lukee
     lukuja — ja se on laskurin kysymys. */
  function rivikuva(o) {
    o = o || {};
    var koot = (o.koot || KOOT).map(mitat).filter(Boolean);
    if (!koot.length) return "";
    var opt = asetukset(o);
    var iso = laajuus(koot[koot.length - 1], opt.pituus);
    var reuna = 16, vali = o.vali == null ? 26 : o.vali;
    var K = (o.korkeus || 300) / iso.kor;
    var yksi = iso.lev * K;
    var CW = Math.round(yksi * koot.length + vali * (koot.length - 1) + 2 * reuna);
    var CH = Math.round(iso.kor * K + 2 * reuna);
    opt.viiva = opt.viiva || Math.max(0.9, Math.min(2.2, yksi / 340));

    var hid = "pk-rivi";
    var out = [], x = reuna;
    koot.forEach(function (M, i) {
      var oma = laajuus(M, opt.pituus);
      palkki(out, M, K, x + yksi / 2, CH - reuna - oma.ala * K, hid, opt, "-" + i);
      x += yksi + vali;
    });
    return kuori(defs(hid, CH, opt.rakeisuus) + out.join(""), CW, CH, opt,
      o.nimike || "Palkkikoot samassa mittakaavassa: " +
        koot.map(function (M) { return M.nimi; }).join(", ") + " mm");
  }

  /* ---- Julkinen: matala taso ----------------------------------------------
     Yhdistelmäkuva (yhdistelmakuva.js) piirtää puun ja tarvikkeen samaan
     kankaaseen, joten se tarvitsee pääsyn yhden kappaleen piirtoon ilman omaa
     SVG-kuorta. Tämä on ainoa tapa, jolla lauta voi olla kahdessa kuvassa ilman
     että siitä on kaksi kopiota.

       out    taulukko, johon SVG-palat työnnetään
       o      koko · akselit · siirto · pituus · K · ox · oy · hid · cid · viiva
              sekä samat syyt/oksat/rakeisuus/varjo-liput kuin yksinäiskuvassa */
  function piirraOsa(out, o) {
    var M = mitat(o.koko);
    if (!M) return false;
    var opt = asetukset(o);
    opt.viiva = o.viiva || 1.4;
    palkki(out, M, o.K, o.ox, o.oy, o.hid || "pk", opt, o.cid || "");
    return true;
  }

  /* Kappaleen ulottuvuus maailman millimetreinä: yhdistelmäkuva laskee kankaan
     koon puun ja tarvikkeen laatikoiden yhdisteestä. */
  function laatikko(o) {
    var M = mitat(o.koko);
    if (!M) return null;
    var hl = (o.pituus || PITUUS) / 2, hb = M.b / 2;
    var AK = (o.akselit || "xyz").toLowerCase(), SII = o.siirto || [0, 0, 0];
    var vali = {u: [-hl, hl], v: [-hb, hb], w: [0, M.h]};
    var L = {x: null, y: null, z: null}, nimet = ["u", "v", "w"];
    nimet.forEach(function (nimi, i) {
      var akseli = AK[i], d = SII[IX[akseli]];
      L[akseli] = [vali[nimi][0] + d, vali[nimi][1] + d];
    });
    return L;
  }

  window.palkkikuva = palkkikuva;
  window.palkkikuva.rivi = rivikuva;
  window.palkkikuva.koot = function () { return KOOT.slice(); };
  window.palkkikuva.mitat = mitat;
  window.palkkikuva.nimi = nimi;
  window.palkkikuva.laajuus = function (koko, pit) { return laajuus(mitat(koko), pit); };
  window.palkkikuva.piirra = piirraOsa;
  window.palkkikuva.defs = defs;
  window.palkkikuva.laatikko = laatikko;
  window.palkkikuva.projektio = {CX: CX, CY: CY, katse: KATSE};
})();
