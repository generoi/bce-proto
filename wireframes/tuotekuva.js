/* Tuotekuva: BCE-pilari kolmiulotteisena, kolmivarttikulmasta.

   Tehtävä on eri kuin mittakaaviolla. Mittakaavio selittää taulukon sarakkeet;
   tämä jättää muistijäljen tuotteen muodosta. Siksi kuvassa ei ole mittaviivoja
   eikä kirjaimia, vaan betonipinta, jalkaviiste, kapeneva runko ja valuankkuri —
   ne piirteet, joista tuotteen tunnistaa hyllyllä ja kuormalavalla.

   Yksi lähde mitoille: PERHEET on mittakaavio.js:ssä, ja tämä tiedosto lukee sen
   window.mittakaavio.mitat():n kautta. Jos jokin mitta korjataan, se korjataan
   siellä ja molemmat kuvat muuttuvat. PP-600 on tässä tiedostossa, koska se ei
   ole mittakaaviossa (eri pää, eri kiinnitys — ks. PP alla).

   Lähteet
     mitat    bcepilarimaailma.fi/bce-pilarit/ mittataulukot 18.9.2026
              (H1 H2 H3 D1 D2 B1 U, PP:llä lisäksi B2), sama aineisto kuin
              mittakaavio.js:ssä
     kuormat  A-601, Insinööritoimisto Kronqvist 8.4.2026 — pohjalaatat
              330 × 330 / 450 × 450 / 600 × 600 vahvistavat, että laatta on neliö
     muoto    BCE:n omat tuotekuvat bcepilarimaailma.fi:ssä
              (bce-ap-300-flip-isolated, bce-family-flip-updated-2026):
              neliölaatta, pyramidimainen jalkaviiste laatan reunasta rungon
              juureen, ylöspäin kapeneva runko, teräksinen valuankkuri
              yläpinnan keskellä, tuotekoodi kaiverrettuna viisteeseen

   Kolmesta tulkinnasta kaksi ratkesi 18.9.2026 asiakkaan CAD-tiedostoista
   (TP.dwg, KP.dwg, PP.dwg, mitattu 1:1 mm-koordinaateista — ks.
   ../aineisto-taustamatskut-2026-09-18.md luku 4):
     W        mitattu. Ei ole perheen vakio vaan kasvaa koon mukana; luvut ovat
              mittakaavio.js:n PERHEET-taulukossa, josta tämä tiedosto lukee ne.
              AP on ainoa perhe, jolle CAD-tiedostoa ei ole, joten sen W on yhä
              luettu tuotekuvista
     muoto    kappaleita on neljä eikä kolme, ja laatta on katkaistu pyramidi eikä
              laatikko. Molemmat korjattiin CAD:ista samana päivänä toisella
              kierroksella: **pilarin päässä on viiste** (TP 10 mm, KP ja PP
              15 mm), ja **jalkalaatan kylki on kalteva** (TP 450 → 440, KP
              600 → 570). Kuva väitti ennen pilarin pään teräväksi särmäksi ja
              laatan suoraksi laatikoksi; kumpikaan ei pidä paikkaansa. Viiste on
              se, joka näkyy tästä kulmasta eniten — se on pään ainoa valoa
              nappaava pinta, ja ilman sitä pää luki litteänä levynä
     ankkuri  mitattu: näkyvä holkki on Ø27 mm ja kierrereikä Ø20 mm. Syvyys
              vaihtelee perheittäin (TP 60 mm, KP 35 + 35 mm), mutta se ei näy
              tästä kulmasta
     PP       kaapeliaukkojen koko, määrä ja korkeus ovat **yhä auki**, ja CAD
              teki kysymyksestä terävämmän: PP.dwg:ssä ja PP 3D.dwg:ssä ei ole
              aukkoja lainkaan — ei 2D-leikkauksessa eikä 3D-verkossa, jonka
              z-tasot loppuvat runkoon. Joko aukot puuttuvat mallista tai
              tuotekuvan pilari on eri variantti. Piirros noudattaa yhä
              tuotekuvaa, koska se on ainoa lähde, jossa aukko näkyy

   Värit tulevat tokeneista (bce-v4.css, --bet-*). Kuva on läpinäkyvä: taustaa ei
   piirretä, jotta se istuu sille pinnalle jolle se asetetaan. */
(function () {
  "use strict";

  /* ---- Projektio ----------------------------------------------------------
     Aksonometria, ei perspektiiviä: pystymitat ovat 1:1 ja vaakamitat kahdella
     vakiokertoimella, joten kuvasta voi mitata ja saman perheen koot ovat
     keskenään vertailukelpoisia.

     CY 0,42 on hieman matalampi kuin isometrian 0,5. Kulma on mitattu BCE:n
     omasta tuotekuvasta (bce-ap-300-flip-isolated): pohjalaatan vinoneliö on
     siinä noin 0,6 kertaa niin korkea kuin leveä. Matalampaa kameraa kokeiltiin
     (0,34), mutta se ei auta — pilari ei muutu korkeammaksi vaan laatta
     litistyy, ja AP-300 alkaa näyttää lattialaatalta. Yläpinta ja jalkaviiste
     on molemmat nähtävä, koska niistä tuote tunnistetaan. */
  var CX = 0.866, CY = 0.42, RT2 = Math.SQRT2;

  /* ---- PP-600 -------------------------------------------------------------
     Ei ole mittakaavio.js:n PERHEET-taulukossa, koska sen pää ei ole M20-kierre
     vaan holkki: B2 83 mm on istukan halkaisija (mukana tuleva kiristysrengas on
     82 mm 60 mm:n putkelle) ja U 387 mm on tolpan upotussyvyys. B1 45 mm on
     taulukossa mutta ilman selitystä — piirretty kapeampana jatkoreikänä
     istukan pohjassa. Se on tulkinta.
     W 200 on tulkinta samalla tavalla kuin muidenkin perheiden W. */
  /* Muoto mitattu PP.dwg:stä 18.9.2026: H3 on 106 eikä 115 kuten TP:llä, viisteen
     yläpää 206 ja rungon yläpää 152. Pää on KP:n tapaan 15 mm:n viisteen takana:
     152 korkeudella 585, 120 korkeudella 600. Jalkalaatan yläreuna on 440.
     Istukka on kartio, jonka suuaukko on CAD:issa 80 ja pohja 40 — eli taulukon
     B2 83 ja B1 45 ovat samat mitat pyöristettyinä tai kiristysrenkaan kanssa
     mitattuina. Taulukon luvut on säilytetty, koska ne ovat julkaistuja; ero on
     kysyttävä. */
  var PP = {kt: [600], H2: 65, H3: 106, D1: 450, D1Y: 440, D2: 152, D3: 120,
            VK: 15, W: 206, B1: 45, B2: 83, U: 387,
            /* kaapeliaukko: leveys × korkeus, alareuna näin korkealla viisteen
               yläpäästä. Luvut tuotekuvasta, eivät mittataulukosta. */
            aukko: {lev: 90, kork: 110, alaraja: 45}};

  /* ---- Väri ----------------------------------------------------------------
     Yksi valo ylävasemmalta. Sama betoni saa eri sävyn pinnan suunnan mukaan,
     ja siitä muoto luetaan. Tokenit ovat bce-v4.css:ssä; fallback on mukana,
     jotta erilleen viety SVG-tiedosto renderöityy ilman sivun tyylejä. */
  function T(nimi, fb) { return "var(--" + nimi + "," + fb + ")"; }
  var V = {
    yla:      T("bet-yla", "#fdfcfa"),
    viisteA:  T("bet-viiste-a", "#eeeae3"),
    viisteB:  T("bet-viiste-b", "#d5cec2"),
    sivuA:    T("bet-sivu-a", "#cdc6bb"),
    sivuB:    T("bet-sivu-b", "#aca396"),
    syva:     T("bet-syva", "#8e8479"),
    kiilto:   T("bet-kiilto", "#ffffff"),
    teras:    T("bet-teras", "#8e8b87"),
    viiva:    T("bet-viiva", "#6d675e"),
    muste:    T("ink", "#252425")
  };

  /* Betonin rakeisuus. Kiinteä pistejoukko eikä satunnaisuus: sama kuva
     piirtyy kahdesti samanlaisena, jolloin vietyä PNG:tä voi verrata edelliseen. */
  var RAE = [[5,7,.55,.13],[17,4,.40,.10],[29,11,.65,.11],[41,6,.45,.09],
             [9,19,.75,.09],[23,23,.50,.12],[37,18,.40,.10],[49,27,.55,.11],
             [3,33,.45,.12],[15,38,.70,.08],[31,36,.50,.11],[45,43,.40,.12],
             [11,48,.60,.10],[25,53,.45,.11],[39,50,.55,.09],[51,13,.45,.10],
             [7,58,.40,.11],[21,63,.65,.09],[35,60,.45,.12],[47,68,.50,.10],
             [13,72,.55,.09],[27,77,.40,.11],[43,75,.60,.10],[55,35,.45,.11]];

  function KOOT(perhe) {
    if (perhe === "PP") return PP.kt.slice();
    var m = window.mittakaavio;
    return m && m.perheet[perhe] ? m.perheet[perhe].kt.slice() : null;
  }
  function MITAT(perhe, koko) {
    if (perhe === "PP") {
      var m = {}, k;
      for (k in PP) if (k !== "kt") m[k] = PP[k];
      m.H1 = koko || 600;
      return m;
    }
    return window.mittakaavio.mitat(perhe, koko);
  }
  function KOODI(perhe, koko) {
    return perhe === "PP" ? "PP-60-600" : perhe + "-" + koko;
  }

  function N(v) { return Math.round(v * 100) / 100; }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Kuvan koko mm-avaruudessa ennen skaalausta. Silhuetin korkeuteen kuuluu
     pilarin korkeuden lisäksi laatan syvyys alhaalla ja pään syvyys ylhäällä,
     koska kumpikin näkyy vinosti. */
  function laajuus(M) {
    return {lev: 2 * M.D1 * CX,
            kor: M.H1 + M.D1 * CY + (M.D3 || M.D2) * CY,
            ala: M.D1 * CY};
  }

  /* Puolileveys korkeudella z. Sama porrastus kuin pilari():n kappaleissa ja
     luettuna samasta M:stä, joten taperi ei voi olla kahdessa paikassa eri.
     Lisätty 20.9.2026 asennuskuva.js:ää varten: se rajaa kankaan pilarin pään
     ympärille, jolloin pohjalaatta jää kuvan ulkopuolelle eikä sen leveys
     kelpaa kankaan leveydeksi. */
  function puolileveys(M, z) {
    var d1 = M.D1 / 2, d1y = (M.D1Y || M.D1) / 2, w = M.W / 2, d2 = M.D2 / 2;
    var d3 = (M.D3 || M.D2) / 2, HR = M.H1 - (M.VK || 0);
    function v(a, b, z0, z1) {
      return z1 === z0 ? b : a + (b - a) * (z - z0) / (z1 - z0);
    }
    if (z <= 0)     return d1;
    if (z < M.H2)   return v(d1, d1y, 0, M.H2);
    if (z < M.H3)   return v(d1y, w, M.H2, M.H3);
    if (z < HR)     return v(w, d2, M.H3, HR);
    if (z < M.H1)   return v(d2, d3, HR, M.H1);
    return d3;
  }

  /* ---- Yhden pilarin piirto ------------------------------------------------
     Kaikki kappaleet ovat neliöisiä katkaistuja pyramideja päällekkäin:
       laatta    z 0…H2,     puolileveys D1/2 → D1Y/2  (kylki on kalteva)
       viiste    z H2…H3,    puolileveys D1Y/2 → W/2   (näkyvät vinot pinnat)
       runko     z H3…H1−VK, puolileveys W/2  → D2/2
       pääviiste z H1−VK…H1, puolileveys D2/2 → D3/2
     Laatan yläpinta jää kokonaan viisteen alle, joten sitä ei piirretä.
     Piirtojärjestys alhaalta ylös: ylempi kappale ei koskaan peity alempaan. */
  function pilari(out, perhe, koko, K, ox, oy, hid, o) {
    /* o.mitat ohittaa taulukon. Sen antaa morffi: siirtymän väliruudun mitat ovat
       kahden koon väliltä eikä sellaista kokoa ole missään taulukossa. */
    var M = o.mitat || MITAT(perhe, koko);
    var d1 = M.D1 / 2, d1y = (M.D1Y || M.D1) / 2, w = M.W / 2, d2 = M.D2 / 2;
    var d3 = (M.D3 || M.D2) / 2, vk = M.VK || 0;
    var H1 = M.H1, H2 = M.H2, H3 = M.H3, HR = M.H1 - vk;   /* HR = rungon yläpää */
    var lev = o.viiva;

    function P(x, y, z) {
      return [ox + (x - y) * CX * K, oy + (x + y) * CY * K - z * K];
    }
    function poly(pts, fill, stroke, paksuus) {
      out.push('<polygon points="' +
        pts.map(function (p) { return N(p[0]) + "," + N(p[1]); }).join(" ") +
        '" fill="' + (fill || "none") + '"' +
        (stroke ? ' stroke="' + V.viiva + '" stroke-width="' + N(paksuus || lev) +
                  '" stroke-linejoin="round"' : "") + "/>");
    }

    /* Monikulmio kutistettuna keskipistettä kohti. Kiiltoviiva piirretään särmän
       sisäpuolelle, jotta se lukee valon nappaavaksi särmäksi eikä ääriviivaksi. */
    function sisaan(pts, d) {
      var cx = 0, cy = 0, n = pts.length, i;
      for (i = 0; i < n; i++) { cx += pts[i][0] / n; cy += pts[i][1] / n; }
      return pts.map(function (q) {
        var vx = cx - q[0], vy = cy - q[1], L = Math.hypot(vx, vy) || 1;
        return [q[0] + vx / L * d, q[1] + vy / L * d];
      });
    }

    /* Betonipinta: sävy, rakeisuus, valo, ääriviiva.

       Kolme sarjakuvakeinoa, jotka tekivät tarvikekuvista luettavia, on tässä
       sovitettu mattapintaan:
         1. Litteä sävy. Valoliuku on hyvin kevyt, jolloin pinta pysyy yhtenä
            arvona ja muoto luetaan pintojen välisestä erosta — ei liu'usta.
         2. Valoa nappaava särmä. Kiilto on VIIVA särmän sisäpuolella, ei pinta:
            betoni on mattaa, joten leveä kiilto näyttäisi muovilta. Metallilla
            sama keino on leveä juova, ja juuri siinä materiaalit eroavat.
         3. Painava varjoviiva. Varjon puoleiset pinnat saavat paksumman
            ääriviivan, valon puoleiset ohuemman — sama vaihtelevan viivapaksuuden
            konventio kuin sarjakuvassa, ja se antaa muodolle painon ilman että
            sävyjä tarvitsee tummentaa lisää. */
    function pinta(pts, vari, tyyli) {
      tyyli = tyyli || {};
      poly(pts, vari);
      if (o.rakeisuus) poly(pts, "url(#" + hid + "-rae)");
      poly(pts, "url(#" + hid + "-valo)");
      poly(pts, "none", true, tyyli.paksu ? lev * 1.45 : lev);
      if (!tyyli.kiilto) return;
      var k = sisaan(pts, lev * 1.15);
      var d2 = tyyli.kiilto === "ylareuna" ? [k[k.length - 2], k[k.length - 1]] : k;
      out.push('<pol' + (tyyli.kiilto === "ylareuna" ? "yline" : "ygon") +
        ' points="' + d2.map(function (q) { return N(q[0]) + "," + N(q[1]); }).join(" ") +
        '" fill="none" stroke="' + V.kiilto + '" stroke-width="' + N(lev * 1.05) +
        '" stroke-linecap="round" stroke-linejoin="round" opacity="' +
        (tyyli.kiilto === "ylareuna" ? ".7" : "1") + '"/>');
    }
    /* A oikea kulma, B etukulma, C vasen kulma, D takakulma. Katsoja on
       suunnassa +x +y, joten näkyvät pystypinnat ovat x = +a ja y = +a. */
    function nurkat(a, z) {
      return {A: P(a, -a, z), B: P(a, a, z), C: P(-a, a, z), D: P(-a, -a, z)};
    }
    /* Katkaistun pyramidin sivupinnat. Montako niistä näkyy ei ole vakio, vaan se
       lasketaan: pinnan ulkonormaali on (ux·h, uy·h, D), missä h on kappaleen
       korkeus ja D = a0 − a1 se, kuinka paljon kappale kapenee. Pinta näkyy kun
       normaali osoittaa katsojaan, siis kun ux·h + uy·h + 2·CY·D > 0.

       Käytännössä tämä tarkoittaa, että **jalkaviisteestä näkyy kaikki neljä
       sivua.** Viiste kallistuu ylöspäin niin loivasti (TP: kapenee 137 mm ja
       nousee 50 mm), että myös takasivut kääntyvät kameraan — aivan kuten BCE:n
       tuotekuvassa, jossa viisteen pinta kiertää rungon ympäri. Laatasta ja
       rungosta näkyy vain kaksi: laatta ei kapene lainkaan ja runko nousee paljon
       enemmän kuin kapenee. Aiemmin tässä piirrettiin aina kaksi, ja viisteen
       takasivut puuttuivat kuvasta kokonaan.

       Takasivut piirretään ensin: ne ovat kauempana, ja runko peittää niistä sen
       osan, jonka sen pitääkin peittää. */
    function kappale(a0, z0, a1, z1, varit) {
      var n0 = nurkat(a0, z0), n1 = nurkat(a1, z1);
      var h = z1 - z0, D = a0 - a1;
      var sivut = [
        /* û           kulmat            väri            tyyli */
        [[-1, 0], ["C", "D"], varit.takaVasen,  {}],
        [[0, -1], ["D", "A"], varit.takaOikea,  {paksu: true}],
        [[1, 0],  ["A", "B"], varit.oikea,      {paksu: true}],
        [[0, 1],  ["B", "C"], varit.vasen,      {kiilto: "ylareuna"}]
      ];
      sivut.forEach(function (sv) {
        if (sv[0][0] * h + sv[0][1] * h + 2 * CY * D <= 0) return;
        if (!sv[2]) return;
        /* Pinnan viimeiset kaksi pistettä ovat sen yläreuna, ja juuri se särmä on
           valoa vasten — siksi kiilto osaa sinne ilman erillistä geometriaa. */
        pinta([n0[sv[1][0]], n0[sv[1][1]], n1[sv[1][1]], n1[sv[1][0]]], sv[2], sv[3]);
      });
      return n1;
    }
    /* Vaakatasossa oleva ympyrä projisoituu akselien suuntaiseksi ellipsiksi. */
    function ellipsi(z, r, fill, viivoita, dx, dy) {
      var c = P(0, 0, z);
      out.push('<ellipse cx="' + N(c[0] + (dx || 0)) + '" cy="' + N(c[1] + (dy || 0)) +
        '" rx="' + N(RT2 * CX * r * K) + '" ry="' + N(RT2 * CY * r * K) +
        '" fill="' + fill + '"' +
        (viivoita ? ' stroke="' + V.viiva + '" stroke-width="' + lev + '"' : "") + "/>");
    }

    /* ---- varjo: kontakti maahan, ei irrallinen levy ---- */
    if (o.varjo) {
      var vn = nurkat(d1 * 1.04, 0);
      out.push('<g filter="url(#' + hid + '-sumu)" opacity=".17">');
      poly([vn.A, vn.B, vn.C, vn.D].map(function (p) {
        return [p[0] + 9 * K * CX, p[1] + 5 * K * CX];
      }), V.muste);
      out.push("</g>");
    }

    /* ---- runko ---- */
    /* Laatan kylki on kalteva (D1 → D1Y). Päästö on pieni — TP 5 mm kyljelle,
       KP 15 — ja nousee paljon enemmän kuin kapenee, joten takasivut jäävät
       yhä piiloon aivan kuten pystykyljellä. Näkyvä ero on kyljen kallistus. */
    kappale(d1, 0, d1y, H2, {oikea: V.sivuB, vasen: V.sivuA});   /* laatta */
    /* Viisteen takasivut ovat vahvasti ylöspäin kääntyneitä, joten ne saavat
       valoa enemmän kuin pystysivut mutta vähemmän kuin etuviisteet. */
    kappale(d1y, H2, w, H3, {oikea: V.viisteB, vasen: V.viisteA,
                             takaVasen: V.viisteB, takaOikea: V.sivuA}); /* jalkaviiste */
    var ylä = kappale(w, H3, d2, HR, {oikea: V.sivuB, vasen: V.sivuA}); /* kapeneva runko */
    /* Pään viiste. Se on lyhyt mutta kallistuu 45 asteeseen, joten se saa
       enemmän valoa kuin runko — samat sävyt kuin jalkaviisteellä, ja juuri se
       erottaa pään rungosta. Ilman tätä kappaletta pää oli terävä särmä. */
    if (vk) ylä = kappale(d2, HR, d3, H1, {oikea: V.viisteB, vasen: V.viisteA});
    pinta([ylä.D, ylä.A, ylä.B, ylä.C], V.yla, {kiilto: "kaikki"}); /* yläpinta */

    /* ---- pään kiinnitys ---- */
    if (perhe === "PP") {
      /* Istukka: B2 83 mm auki päähän, pohjalla kapeampi jatkoreikä (B1).
         Syvyys näkyy siitä, että istukan sisäseinä jatkuu taakse ylöspäin. */
      var rb = M.B2 / 2;
      out.push('<clipPath id="' + hid + '-istukka"><ellipse cx="' + N(P(0, 0, H1)[0]) +
        '" cy="' + N(P(0, 0, H1)[1]) + '" rx="' + N(RT2 * CX * rb * K) +
        '" ry="' + N(RT2 * CY * rb * K) + '"/></clipPath>');
      ellipsi(H1, rb, V.syva, false);
      out.push('<g clip-path="url(#' + hid + '-istukka)">');
      ellipsi(H1, rb, V.sivuB, false, 0, RT2 * CY * rb * K * 0.5);
      ellipsi(H1, M.B1 / 2, "rgba(37,36,37,.86)", false, 0, RT2 * CY * rb * K * 0.5);
      out.push("</g>");
      ellipsi(H1, rb, "none", true);
    } else {
      /* Valuankkuri: sama M20-osa perheestä riippumatta, joten se näyttää
         suhteessa pienemmältä isossa pilarissa — kuten oikeastikin.
         Halkaisijat CAD:ista 18.9.2026: holkki Ø27 (r 13,5) ja kierrereikä Ø20
         (r 10). Väliin jäävä r 12 on holkin teräsreunan sisäsärmä, ei mitta. */
      ellipsi(H1, 13.5, V.syva, false);
      ellipsi(H1, 12, V.teras, true);
      ellipsi(H1, 10, "rgba(37,36,37,.82)", true);
    }

    /* ---- PP:n kaapeliaukko ----
       Rungon pinta kapenee, joten aukon kulmat lasketaan sillä puolileveydellä,
       joka rungolla on kyseisellä korkeudella. Syvyys tulee siitä, että itse
       aukko piirretään sisäänpäin siirrettynä ja rajataan aukon reunaan: väliin
       jäävä kaistale on aukon sisäseinä.
       Yksi aukko, valon puoleiselle sivulle. Nykysivusto sanoo aukoista vain
       että ne ovat pilarin sivulla — määrä on avoin kysymys, ja kahden aukon
       piirtäminen väittäisi enemmän kuin tiedetään. */
    if (perhe === "PP" && M.aukko) {
      var ak = M.aukko, za = H3 + ak.alaraja, zb = za + ak.kork;
      var pz = [za, za, zb, zb], ps = [-1, 1, 1, -1], reuna = [], i, hy;
      for (i = 0; i < 4; i++) {
        hy = w + (d2 - w) * (pz[i] - H3) / (HR - H3);
        reuna.push(P((ak.lev / 2) * ps[i], hy, pz[i]));
      }
      var sy = 34;                              /* näkyvä sisäseinän syvyys, mm */
      var sisus = reuna.map(function (q) {
        return [q[0] + sy * CX * K, q[1] - sy * CY * K];
      });
      out.push('<clipPath id="' + hid + '-aukko"><polygon points="' +
        reuna.map(function (q) { return N(q[0]) + "," + N(q[1]); }).join(" ") +
        '"/></clipPath>');
      poly(reuna, V.syva);
      out.push('<g clip-path="url(#' + hid + '-aukko)">');
      poly(sisus, "rgba(37,36,37,.80)");
      out.push("</g>");
      poly(reuna, "none", true);
    }

    /* ---- kaiverrettu tuotekoodi ----
       Teksti asetetaan valon puoleiselle jalkaviisteelle, samaan paikkaan kuin
       BCE:n tuotekuvassa. Muunnosmatriisi kääntää tekstin viisteen tasoon:
       u-akseli kulkee x:n suuntaan, v-akseli viistettä alaspäin. */
    if (o.merkinta && (d1 - w) > 40) {
      var dyy = d1 - w, dzz = H3 - H2, L = Math.sqrt(dyy * dyy + dzz * dzz);
      var ux = CX * K, uy = CY * K;
      var vx = -dyy * CX * K / L, vy = (dyy * CY + dzz) * K / L;
      var ank = P(0, w + dyy * 0.66, H2 + dzz * 0.34);
      var koko2 = Math.min(42, Math.max(20, M.D1 * 0.082));
      out.push('<text transform="matrix(' + N(ux) + " " + N(uy) + " " + N(vx) + " " +
        N(vy) + " " + N(ank[0]) + " " + N(ank[1]) + ')" x="0" y="0"' +
        ' text-anchor="middle" font-family="Oswald,Raleway,system-ui,sans-serif"' +
        ' font-size="' + N(koko2) + '" font-weight="600" letter-spacing=".1em"' +
        ' fill="' + V.muste + '" opacity=".26">' + esc(o.koodi || KOODI(perhe, koko)) +
        "</text>");
    }

    /* ---- mittaviivat, valinnainen -------------------------------------------
       Tuotekuvassa ei ole mittaviivoja — se on mittakaavion tehtävä
       (TUOTEKUVAT.md, sääntö 6). Kokovalitsin on poikkeus, ja se on harkittu:
       siinä kuva on se mitta. Käyttäjä katsoo kuvaa kun hän vaihtaa kokoa, ja
       silloin luvun on oltava siinä missä mitta on, ei vain taulukossa.

       Viivat piirretään samaan aksonometriaan kuin kappale. Jokainen mitta
       kulkee sen tason suuntaisesti, jossa mitattava reuna on: korkeus on
       pystysuora, pohjalaatan ja pään leveys seuraavat maan tason suuntaa.
       Siksi mitta näyttää kuuluvan kuvaan eikä olevan sen päällä liimattuna.

       Luvut tulevat kohdekoosta, eivät väliruudun geometriasta: morffauksen
       aikana viiva liikkuu mutta luku on koko ajan se, johon ollaan menossa —
       sama sääntö kuin kaiverretulla koodilla.

       Väri on --accent-dark eikä mittakaavion --accent: sama merkitys (tämä on
       mitta), mutta 5,2:1 paperilla, ja luvut ovat tässä pienempiä kuin
       kaaviossa. */
    if (o.mitoitus) {
      var MK = MITAT(perhe, koko);
      var DV = T("accent-dark", "#b8420f");
      /* Kaikki mitat kertoimen K mukana, jolloin merkinnät ovat samankokoisia
         suhteessa kappaleeseen riippumatta siitä, mihin pikselikorkeuteen kuva on
         pyydetty. */
      var kirj = Math.max(12, Math.min(24, 34 * K));

      var jana = function (a2, b2, lev, kat, lap) {
        out.push('<line x1="' + N(a2[0]) + '" y1="' + N(a2[1]) + '" x2="' + N(b2[0]) +
          '" y2="' + N(b2[1]) + '" stroke="' + DV + '" stroke-width="' + lev + '"' +
          (kat ? ' stroke-dasharray="' + kat + '"' : "") +
          (lap ? ' opacity="' + lap + '"' : "") + ' stroke-linecap="round"/>');
      };
      var yks = function (v) {
        var L = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1;
        return [v[0] / L, v[1] / L];
      };
      var lisaa = function (p, v, t) { return [p[0] + v[0] * t, p[1] + v[1] * t]; };

      /* pa, pb   mitattavan reunan päät kuvassa
         v        suunta, johon mittaviiva siirretään kappaleesta ulos
         t        siirron pituus pikseleinä
         arvo     luku, joka viivan päälle kirjoitetaan
         suorista tosi = viiva suoristetaan v:n suuntaisten apuviivojen päihin.
                  Sitä tarvitaan korkeudella, jonka päät ovat eri etäisyydellä
                  (laatan kulma on ulompana kuin pään kulma). Reunamitoilla se
                  olisi virhe: siirto on tehtävä sellaisenaan, jotta mittaviiva
                  jää reunan suuntaiseksi eikä kallistu pois tasosta. */
      var mitta = function (pa, pb, v, t, arvo, suorista) {
        v = yks(v);
        var a2, b2;
        if (suorista) {
          var sa = pa[0] * v[0] + pa[1] * v[1], sb = pb[0] * v[0] + pb[1] * v[1];
          var s = Math.max(sa, sb) + t;
          a2 = lisaa(pa, v, s - sa);
          b2 = lisaa(pb, v, s - sb);
        } else {
          a2 = lisaa(pa, v, t);
          b2 = lisaa(pb, v, t);
        }
        var rako = 10 * K, yli = 12 * K;
        jana(lisaa(pa, v, rako), lisaa(a2, v, yli), 1, "2 3", ".5");   /* apuviivat */
        jana(lisaa(pb, v, rako), lisaa(b2, v, yli), 1, "2 3", ".5");
        jana(a2, b2, 1.3);
        var u = yks([b2[0] - a2[0], b2[1] - a2[1]]);
        /* Päätemerkki on u:n ja v:n puolittaja: pystymitalla se on 45 asteen
           vinoviiva kuten mittakaaviossa, tasomitalla se kallistuu tason mukana. */
        var pu = yks([u[0] + v[0], u[1] + v[1]]);
        var pit = 11 * K;
        [a2, b2].forEach(function (p) { jana(lisaa(p, pu, -pit), lisaa(p, pu, pit), 1.3); });

        var kesk = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
        var lu = u[0] < 0 ? [-u[0], -u[1]] : u;          /* teksti luetaan vasemmalta */
        var yht = 'font-family="Oswald,Raleway,system-ui,sans-serif" font-size="' +
          N(kirj) + '" font-weight="600" letter-spacing=".06em" fill="' + DV + '"';
        if (Math.abs(lu[0]) < 0.25) {
          /* Pystymitta: luku pysyy vaakasuorassa viivan vieressä, kuten
             mittakaaviossa — kyljelleen käännetty luku on hitaampi lukea. */
          var tp = lisaa(kesk, v, 18 * K);
          out.push('<text x="' + N(tp[0]) + '" y="' + N(tp[1]) + '" ' + yht +
            ' text-anchor="start" dominant-baseline="middle">' + esc(arvo) + "</text>");
        } else {
          /* Tasomitta: luku kääntyy viivan suuntaiseksi ja asettuu sen päälle
             lukusuunnassa — piirtäjän tapa, ja se pitää luvun samassa tasossa kuin
             mitattava reuna. Normaali lasketaan lukusuunnasta eikä siirtosuunnasta,
             jolloin luku on viivan yläpuolella myös silloin kun viiva on nostettu
             kappaleen yläpuolelle. */
          var nrm = [lu[1], -lu[0]];
          var tk = lisaa(kesk, nrm, 6 * K);
          out.push('<text transform="translate(' + N(tk[0]) + " " + N(tk[1]) +
            ") rotate(" + N(Math.atan2(lu[1], lu[0]) * 180 / Math.PI) + ')" x="0" y="0" ' +
            yht + ' text-anchor="middle">' + esc(arvo) + "</text>");
        }
      };

      mitta(P(d1, -d1, 0), P(d3, -d3, H1), [1, 0], 60 * K, MK.H1, true);
      /* Pohjalaatta ja pilarin pää katsojan vasemmalla etusivulla (y = +a).
         Siirtosuunta on saman sivun ulkonormaali, joten mitta jää sen tason
         suuntaiseksi, jossa reuna on. */
      var ulos = [-CX, CY];
      mitta(P(d1, d1, 0), P(-d1, d1, 0), ulos, 52 * K, MK.D1);
      /* Pään mitta nostetaan suoraan ylös eikä viedä sivusuunnassa ulos: samassa
         tasossa ulos vietynä se laskeutuisi matalilla koilla jalkaviisteen päälle,
         koska taso on kallellaan katsojaan päin. Ylös nostettuna viiva pysyy
         reunan suuntaisena ja tyhjän päällä joka koolla. */
      /* D2 mitataan rungon yläpäästä (H1 − VK), ei päästä: pään leveys on D3
         eikä sille ole saraketta mittataulukossa. */
      mitta(P(d2, d2, HR), P(-d2, d2, HR), [0, -1], 46 * K, MK.D2);
    }
  }

  /* ---- Yhteiset defs -------------------------------------------------------
     Valo on yksi koko kankaan mittainen liuku, ei pintakohtainen. Siksi sama
     pinta on ylhäältä vaaleampi ja alhaalta tummempi riippumatta siitä, monenko
     pilarin kuvasta on kyse. */
  function defs(hid, CH, rakeisuus) {
    var d = ['<defs>'];
    if (rakeisuus) {
      d.push('<pattern id="' + hid + '-rae" width="60" height="82" patternUnits="userSpaceOnUse">');
      RAE.forEach(function (r) {
        d.push('<circle cx="' + r[0] + '" cy="' + r[1] + '" r="' + r[2] +
               '" fill="#252425" opacity="' + r[3] + '"/>');
      });
      d.push('</pattern>');
    }
    d.push('<linearGradient id="' + hid + '-valo" gradientUnits="userSpaceOnUse"' +
      ' x1="0" y1="0" x2="0" y2="' + CH + '">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity=".14"/>' +
      '<stop offset=".5" stop-color="#ffffff" stop-opacity="0"/>' +
      '<stop offset="1" stop-color="#252425" stop-opacity=".07"/></linearGradient>');
    d.push('<filter id="' + hid + '-sumu" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feGaussianBlur stdDeviation="7"/></filter>');
    d.push('</defs>');
    return d.join("");
  }

  function kuori(sisus, CW, CH, o, nimike) {
    var a11y = o.koriste
      ? ' aria-hidden="true" focusable="false"'
      : ' role="img" aria-label="' + esc(nimike) + '"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + a11y + '>' +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") + sisus + "</svg>";
  }

  function asetukset(o) {
    return {
      varjo:     o.varjo !== false,
      merkinta:  o.merkinta !== false,
      rakeisuus: o.rakeisuus !== false,
      koriste:   !!o.koriste,
      viiva:     o.viiva || 0,
      /* Morffin kaksi lisäystä. mitat on väliruudun geometria; koodi pysyy koko
         siirtymän ajan kohdekoon koodina, jottei viisteeseen kaiverru "TP-347". */
      mitat:     o.mitat || null,
      koodi:     o.koodi || null,
      /* CAD-tyyliset mittaviivat kuvan päälle. Oletus on pois: tuotekuvan tehtävä
         on muoto, ja mitoitus on mittakaavion tehtävä. Kokovalitsin pyytää tämän
         erikseen, ks. pilari(). */
      mitoitus:  !!o.mitoitus
    };
  }

  /* ---- Julkinen: yksi tuote -----------------------------------------------
       perhe    "AP" | "TP" | "KP" | "PP"
       koko     H1 millimetreinä. Ilman valintaa perheen suurin koko
       korkeus  kankaan korkeus pikseleinä (oletus 460)
       kiintea  true (oletus) = mittakaava lasketaan perheen suurimmasta koosta,
                jolloin TP-200 piirtyy matalaksi ja TP-600 korkeaksi samaan
                kankaaseen. false = kuva täyttää kankaan koosta riippumatta
       mitoitus true = mittaviivat kuvan päälle (H1, D1, D2) samassa
                projektiossa kuin kappale. Kangas levenee merkintöjen verran
       varjo, merkinta, rakeisuus, koriste, id */
  /* ---- Kankaan asettelu ----------------------------------------------------
     Erotettu omaksi funktiokseen, koska kaksi eri asiaa tarvitsee samat luvut:
     kuva itse ja kokovalitsimen asteikko, joka asettaa vaihtoehdot pään
     korkeudelle H1-mittaviivan viereen. Ilman erotusta marginaalit olisivat
     kahdessa paikassa, ja toinen niistä olisi väärässä ensimmäisen muuttuessa.

     Mitoitus tarvitsee tilaa kappaleen ulkopuolelta, ja eri verran eri suuntiin:
     oikealla on korkeuden mittaviiva ja sen luku, vasemmalla ja alhaalla laatan
     ja pään leveydet. Siksi marginaalit eivät ole symmetriset eikä pilari ole
     kankaan keskellä — muuten oikea reuna leikkaisi luvun tai vasemmalle jäisi
     80 px tyhjää. Ylhäällä on tila pään mitalle: suurimmalla koolla pää on
     kankaan ylälaidassa, joten ilman sitä mitta leikkautuisi. */
  function asettelu(perhe, koko, omaM, mitta, o) {
    var iso = laajuus(mitta), oma = laajuus(omaM);
    var reuna = 20;
    var K = (o.korkeus || 460) / iso.kor;
    var oma$ = Math.round(iso.lev * K + 2 * reuna);
    var mV = o.mitoitus ? Math.round(70 * K) : 0;
    var mO = o.mitoitus ? Math.round(150 * K) : 0;
    var mA = o.mitoitus ? Math.round(70 * K) : 0;
    var mY = o.mitoitus ? Math.round(86 * K) : 0;
    return {iso: iso, oma: oma, reuna: reuna, K: K, oma$: oma$,
            mV: mV, mO: mO, mA: mA, mY: mY,
            CW: oma$ + mV + mO,
            CH: Math.round(iso.kor * K + 2 * reuna) + mA + mY};
  }

  function tuotekuva(o) {
    o = o || {};
    var perhe = (o.perhe || "TP").toUpperCase();
    var koot = KOOT(perhe);
    if (!koot) return "";
    var koko = o.koko || koot[koot.length - 1];
    var omaM = o.mitat || MITAT(perhe, koko);
    var mitta = o.kiintea === false ? omaM : MITAT(perhe, koot[koot.length - 1]);
    var A = asettelu(perhe, koko, omaM, mitta, o);
    var iso = A.iso, oma = A.oma, reuna = A.reuna, K = A.K;
    var oma$ = A.oma$, mV = A.mV, mA = A.mA, CW = A.CW, CH = A.CH;
    var opt = asetukset(o);
    opt.viiva = opt.viiva || Math.max(1, Math.min(2.2, oma$ / 340));

    var hid = "tk-" + String(o.id || perhe + koko).toLowerCase().replace(/[^a-z0-9-]/g, "");
    var out = [];
    /* Kaikki koot seisovat samalla tasolla: alareuna on kiinteä, kuten hyllyllä. */
    pilari(out, perhe, koko, K, mV + oma$ / 2, CH - reuna - mA - oma.ala * K, hid, opt);
    return kuori(defs(hid, CH, opt.rakeisuus) + out.join(""), CW, CH, opt,
      o.nimike || (o.koodi || KOODI(perhe, koko)) +
        "-perustuspilari, havainnekuva vinosti ylhäältä");
  }

  /* ---- Julkinen: koko perhe rinnakkain ------------------------------------
     Sama mittakaava kaikille, sama alataso. Tämä on se kuva, joka vastaa
     kysymykseen "montako korkeutta ja miten ne eroavat" ilman taulukkoa. */
  function perhekuva(perhe, o) {
    o = o || {};
    perhe = (perhe || "TP").toUpperCase();
    var koot = KOOT(perhe);
    if (!koot) return "";
    var iso = laajuus(MITAT(perhe, koot[koot.length - 1]));
    var reuna = 20, vali = o.vali == null ? 26 : o.vali;
    var K = (o.korkeus || 380) / iso.kor;
    var opt = asetukset(o);

    var lev = koot.map(function (k) { return laajuus(MITAT(perhe, k)).lev * K; });
    var CW = Math.round(lev.reduce(function (a, b) { return a + b; }, 0) +
                        vali * (koot.length - 1) + 2 * reuna);
    var CH = Math.round(iso.kor * K + 2 * reuna);
    opt.viiva = opt.viiva || Math.max(1, Math.min(2.2, lev[lev.length - 1] / 300));

    var hid = "tk-" + perhe.toLowerCase() + "-perhe";
    var out = [], x = reuna;
    koot.forEach(function (k, i) {
      var oma = laajuus(MITAT(perhe, k));
      pilari(out, perhe, k, K, x + lev[i] / 2, CH - reuna - oma.ala * K, hid, opt);
      x += lev[i] + vali;
    });
    return kuori(defs(hid, CH, opt.rakeisuus) + out.join(""), CW, CH, opt,
      o.nimike || perhe + "-pilarit, " + koot.length + " korkeutta samassa mittakaavassa: " +
      koot.join(", ") + " mm");
  }

  /* ---- Julkinen: morffaava kuva -------------------------------------------
     Kokovalitsin vaihtaa korkeutta, ja kuva seuraa liukuen: TP-300:n runko kasvaa
     TP-400:ksi samassa mittakaavassa. Ero nähdään sen sijaan että se pääteltäisiin
     kahdesta erillisestä kuvasta — sama syy kuin kiinteällä mittakaavalla.

     Siirtymän väliruudut eivät ole tuotteita vaan liikettä. Siksi kaiverrettu koodi
     on koko siirtymän ajan kohdekoon koodi, kuva on koriste (aria-hidden) ja arvon
     kertoo valitsin sanoin: ruudunlukija ei saa kuulla kokoa "TP-347".

     Sekoitettavana ovat kaikki mitat, ei vain H1. AP-200 ja AP-300 eroavat myös
     laatan leveydessä, ja pelkkä korkeuden venytys piirtäisi välivaiheessa pilarin,
     jonka jalka hyppää.

     Kuva piirretään uudestaan joka ruudulla. Se on halvempi kuin miltä kuulostaa
     (noin 40 monikulmiota) ja pitää piirtologiikan yhdessä paikassa: jos
     geometriaa korjataan, morffi korjaantuu mukana.

       el        elementti, jonka sisään SVG piirretään
       perhe     "AP" | "TP" | "KP" | "PP"
       korkeus   kankaan korkeus pikseleinä, sama joka koolla
       kesto     siirtymän kesto millisekunteina (oletus 180, DESIGN-SYSTEM luku 1)
       muut      varjo, rakeisuus, merkinta, id — kuten tuotekuva()

     Palauttaa ohjaimen, jonka aseta(koko, heti) vaihtaa koon. */
  function morffi(el, o) {
    o = o || {};
    var perhe = (o.perhe || "TP").toUpperCase();
    var kesto = o.kesto == null ? 180 : o.kesto;
    var nyt = null, kohde = null, alku = null, t0 = 0, raf = 0;

    /* Vain ease-out, kuten kaikki muukin liike sivustolla. Neljäs potenssi on
       lähellä tokenin cubic-bezier(.22,1,.36,1):tä ilman bezier-ratkaisijaa. */
    function pehmea(t) { return 1 - Math.pow(1 - t, 4); }

    /* Liike pois päältä, jos käyttäjä on sen järjestelmästään pyytänyt. Silloin
       koko vaihtuu yhdellä ruudulla — tieto säilyy, liike katoaa. */
    function levollinen() {
      return window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function sekoita(A, B, t) {
      var m = {}, k;
      for (k in B) {
        m[k] = (typeof A[k] === "number" && typeof B[k] === "number")
          ? A[k] + (B[k] - A[k]) * t : B[k];
      }
      return m;
    }

    function piirra(M) {
      el.innerHTML = tuotekuva({perhe: perhe, koko: kohde, mitat: M,
        koodi: KOODI(perhe, kohde), korkeus: o.korkeus, kiintea: true,
        koriste: true, varjo: o.varjo, rakeisuus: o.rakeisuus,
        merkinta: o.merkinta, mitoitus: o.mitoitus, id: o.id});
    }

    function askel(aika) {
      var t = kesto > 0 ? Math.min(1, (aika - t0) / kesto) : 1;
      nyt = sekoita(alku, MITAT(perhe, kohde), pehmea(t));
      piirra(nyt);
      if (t < 1) { raf = requestAnimationFrame(askel); } else { raf = 0; }
    }

    return {
      aseta: function (koko, heti) {
        if (koko === kohde && nyt) return;
        kohde = koko;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (!nyt || heti || levollinen()) {
          nyt = MITAT(perhe, koko);
          piirra(nyt);
          return;
        }
        alku = nyt;
        t0 = performance.now();
        raf = requestAnimationFrame(askel);
      },
      koko: function () { return kohde; }
    };
  }

  /* ---- Julkinen: monta pilaria yhteiseen mittakaavaan ---------------------
     Yksi kuva per kortti, eri perheistä, mutta yksi mittakaava. Kaksi asiaa on
     tehtävä yhdessä paikassa, tai kuva valehtelee — ja toinen niistä on helppo
     unohtaa, koska se näkyy vasta kapealla ruudulla:

       1  sama kerroin kaikille. Perheet ovat eri taulukoissa, joten kerroin
          lasketaan suurimmasta silhuetista ja jokaisen kankaan korkeus on sen
          oma silhuetti suhteessa siihen.
       2  sama kangas kaikille. Jos kankaat ovat eri kokoisia ja CSS skaalaa ne
          laatikkoonsa, jokainen skaalautuu eri kertoimella ja kohta 1 menee
          hukkaan. Siksi jokainen kuva viedään samalle kankaalle: viewBoxia
          siirretään niin että sisältö on vaakasuunnassa keskellä ja
          pystysuunnassa alareunassa. Kuvat ovat sen jälkeen keskenään
          samankokoisia, eli yksi CSS-sääntö skaalaa ne kaikki samalla
          kertoimella, eikä lohko ole sidottu mihinkään pikselileveyteen.

     Sisältö ei liiku: viewBoxin siirto ei muuta käyttäjäkoordinaatteja, joten
     valoliuku (y 0…CH) ja varjo osuvat samaan paikkaan kuin ennen.

     lista   ["AP","TP",…] (perheen suurin koko) tai [{perhe,koko},…]
     o       korkeus = suurimman silhuetin korkeus pikseleinä (oletus 200),
             sen lisäksi tuotekuvan omat valinnat (varjo, rakeisuus, merkinta,
             koriste, nimike). id on etuliite: jokainen kuva saa siitä oman
             päätteensä, koska samassa dokumentissa ei voi olla kahta samaa
     ←       [{perhe, koko, svg}] samassa järjestyksessä kuin lista */
  function rivikuvat(lista, o) {
    o = o || {};
    var osat = (lista || []).map(function (x) {
      var perhe = String(typeof x === "string" ? x : x.perhe).toUpperCase();
      var koot = KOOT(perhe);
      if (!koot) return null;
      var koko = (typeof x === "string" ? 0 : x.koko) || koot[koot.length - 1];
      return {perhe: perhe, koko: koko, kor: laajuus(MITAT(perhe, koko)).kor};
    }).filter(Boolean);
    if (!osat.length) return [];

    var suurin = Math.max.apply(null, osat.map(function (s) { return s.kor; }));
    var korkeus = o.korkeus || 200, k;
    osat.forEach(function (s) {
      var omat = {};
      for (k in o) if (k !== "korkeus" && k !== "id") omat[k] = o[k];
      omat.perhe = s.perhe;
      omat.koko = s.koko;
      omat.kiintea = false;
      omat.korkeus = korkeus * s.kor / suurin;
      omat.id = (o.id ? o.id + "-" : "") + s.perhe.toLowerCase() + s.koko;
      s.svg = tuotekuva(omat);
      s.mitta = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s.svg);
    });

    var kuvat = yhteinenKangas(osat.map(function (s) { return s.svg; }));
    osat.forEach(function (s, i) { s.svg = kuvat[i]; delete s.mitta; delete s.kor; });
    return osat;
  }

  /* ---- Julkinen: yhteinen kangas -----------------------------------------
     Vie joukon SVG-merkkijonoja samalle kankaalle: sama width, height ja
     viewBoxin koko, sisältö vaakasuunnassa keskellä ja pystysuunnassa
     alareunassa. Sisältö ei liiku — viewBoxin siirto ei muuta
     käyttäjäkoordinaatteja, joten valoliuku ja varjo osuvat samaan paikkaan.

     Tätä tarvitaan aina kun saman lohkon kuvat ovat yhteisessä mittakaavassa:
     mittakaava syntyy generaattorissa, mutta se säilyy vain jos CSS skaalaa
     kuvat samalla kertoimella — ja se vaatii, että kuvat ovat keskenään
     samankokoisia. Eri kokoisilla kankailla mittakaava on oikein työpöydällä ja
     rikki heti kun laatikko on kuvaa kapeampi, eli siellä missä kävijät ovat.

     Toimii minkä tahansa tämän projektion generaattorin tuloksella
     (tuotekuva, tarvikekuva, palkkikuva, yhdistelmakuva), koska se lukee vain
     kuoren viewBoxin. */
  /* tasaus: "ala" (oletus) asettaa kappaleet samalle alatasolle — se on oikein
     silloin kun ne seisovat samassa maassa, kuten pilariperheen koot hyllyllä.
     "keski" keskittää pystysuunnassa, ja se on oikein silloin kun kappaleilla ei
     ole yhteistä alatasoa: teräslaatta, nostokorva ja pilarikenkä eivät seiso
     missään, vaan kukin kiertyy pilarin päähän. Alatasaus jätti ne kortin
     alalaitaan tyhjän yläosan alle, ja se luki huonona rajauksena eikä
     mittakaavana (korjattu 18.9.2026). */
  function yhteinenKangas(kuvat, tasaus) {
    var R = /viewBox="0 0 ([\d.]+) ([\d.]+)"/;
    var osat = (kuvat || []).map(function (svg) {
      var m = R.exec(svg);
      return m ? {svg: svg, m: m, cw: +m[1], ch: +m[2]} : {svg: svg, m: null};
    });
    var kelpo = osat.filter(function (s) { return s.m; });
    if (!kelpo.length) return osat.map(function (s) { return s.svg; });
    var lev = Math.max.apply(null, kelpo.map(function (s) { return s.cw; }));
    var kork = Math.max.apply(null, kelpo.map(function (s) { return s.ch; }));
    return osat.map(function (s) {
      if (!s.m) return s.svg;
      return s.svg
        .replace(s.m[0], 'viewBox="' + N(-(lev - s.cw) / 2) + " " +
                         N(tasaus === "keski" ? -(kork - s.ch) / 2 : -(kork - s.ch)) +
                         " " + lev + " " + kork + '"')
        .replace('width="' + s.cw + '" height="' + s.ch + '"',
                 'width="' + lev + '" height="' + kork + '"');
    });
  }

  window.tuotekuva = tuotekuva;
  window.tuotekuva.perhe = perhekuva;
  window.tuotekuva.rivi = rivikuvat;
  window.tuotekuva.kangas = yhteinenKangas;
  window.tuotekuva.koot = KOOT;
  window.tuotekuva.mitat = MITAT;
  window.tuotekuva.koodi = KOODI;
  /* Silhuetin mitat mm-avaruudessa. Tarvitaan kun eri perheitä piirretään
     samaan mittakaavaan: korkeus jaetaan laajuuksien suhteessa. */
  window.tuotekuva.laajuus = function (perhe, koko) { return laajuus(MITAT(perhe, koko)); };
  window.tuotekuva.puolileveys = function (perhe, koko, z) {
    return puolileveys(MITAT(perhe, koko), z);
  };
  window.tuotekuva.morffi = morffi;
  /* ---- Julkinen: asteikko ---------------------------------------------------
     Missä kohtaa kangasta kunkin koon pää on. Kokovalitsin asettaa vaihtoehdot
     näille korkeuksille, jolloin valitsimesta tulee itse se asteikko, jota
     H1-mittaviiva merkitsee: 600 mm on kuvassa ja luettelossa samalla korkeudella.

     Prosentti eikä pikseli, koska kuva skaalautuu palstan leveyden mukana
     (`width:100%`) — pikseli olisi oikein vain yhdellä ruudun leveydellä.
     Parametrit ovat samat kuin tuotekuva():lla, ja kiintea:true on ehto: eri
     mittakaavassa piirretyillä kuvilla ei ole yhteistä asteikkoa. */
  window.tuotekuva.asteikko = function (perhe, o) {
    o = o || {};
    perhe = (perhe || "TP").toUpperCase();
    var koot = KOOT(perhe);
    if (!koot) return null;
    var iso = MITAT(perhe, koot[koot.length - 1]);
    return {
      kohdat: koot.map(function (k) {
        var M = MITAT(perhe, k);
        var A = asettelu(perhe, k, M, iso, o);
        /* Pään yläpinta: z = 0 -taso miinus korkeus. */
        var y = A.CH - A.reuna - A.mA - A.oma.ala * A.K - M.H1 * A.K;
        return {koko: k, y: y, pros: Math.round(y / A.CH * 1e4) / 100};
      })
    };
  };
  /* ---- Julkinen: matala taso ----------------------------------------------
     Terassikuva (terassikuva.js) piirtää pilarit, kengät, palkit ja laudat
     samaan kankaaseen, joten se tarvitsee yhden pilarin piirron ilman omaa
     SVG-kuorta ja omaa mittakaavaa. Sama kuvio kuin palkkikuva.piirra ja
     tarvikekuva.piirra — tämä oli ainoa kolmesta generaattorista, jolta se
     puuttui. Paikka annetaan kankaan pisteenä (ox, oy), joka on pilarin
     nollataso eli pohjalaatan alapinnan keskipiste.

       out   taulukko, johon SVG-palat työnnetään
       o     perhe · koko · K · ox · oy · hid · viiva sekä samat
             varjo/merkinta/rakeisuus-liput kuin yksinäiskuvassa */
  window.tuotekuva.piirra = function (out, o) {
    var perhe = (o.perhe || "TP").toUpperCase();
    var koot = KOOT(perhe);
    if (!koot) return false;
    var koko = o.koko || koot[koot.length - 1];
    var opt = asetukset(o);
    opt.viiva = o.viiva || 1.4;
    pilari(out, perhe, koko, o.K, o.ox, o.oy, o.hid || "tk", opt);
    return true;
  };
  window.tuotekuva.defs = defs;
  /* ---- Siluetti: litteä ikoni navigaatioon ---------------------------------
     Sama tehtävä ja sama tyyli kuin tarvikekuva.siluetti():lla, mutta ongelma on
     eri. Tarvikkeet eroavat muodosta; pilarit eivät — ne ovat kaikki sama kartio
     laatan päällä, ja ero on koossa. Siksi ikonit piirretään **yhteiseen
     mittakaavaan**: KP-1000 täyttää ruudun, muut ovat siitä osuutensa.

       KP  1000 mm  ruudun korkuinen
       TP   600 mm  60 %
       PP   600 mm  60 %
       AP   400 mm  40 %

     Perhekohtainen normalisointi (mittakaavio.siluetti) ei käy tähän: silloin
     kaikki neljä ovat 24 pikselissä sama muoto, ja ikoni vie tilaa kertomatta
     mitään. Se mitattiin ja se on syy tähän funktioon.

     ---- Koko ei riitä neljänteen, ja se on tässä ratkaistu erikseen ----
     TP-600 ja PP-600 ovat mitoiltaan sama kappale: H1 600, D1 450, H2 65. Ainoa
     ero on pään leveys (125 vs 152), joka on tässä koossa 0,7 px. Yhteinen
     mittakaava erottaa siis KP:n, TP:n ja AP:n muttei PP:tä TP:stä.

     PP:n oikea tunniste ei ole koko vaan **se mitä päähän tulee**: istukka
     60 mm:n putkelle M20-kierteen sijaan. Siksi PP:n ikonissa on pään päältä
     nouseva ohut pylväs. Se on ikonikonventio eikä mitta — pylväs ei ole tuote,
     vaan se kertoo mihin pilari on tarkoitettu. Istukka itsessään olisi 0,2 px.

     Paksuudet on rajattu alhaalta kuten tarvikkeissa: AP on 40 % ruudusta, ja
     sen 48 mm:n jalkalaatta olisi muuten alle pikselin. */
  var IKONI_MAX = 1000;             /* KP-1000, korkein perhe = ruudun korkeus */

  window.tuotekuva.siluetti = function (perhe, korkeus, o) {
    o = o || {};
    perhe = (perhe || "TP").toUpperCase();
    var koot = KOOT(perhe);
    if (!koot) return "";
    var M = MITAT(perhe, o.koko || koot[koot.length - 1]);
    var G = korkeus || 24;
    var K = G / IKONI_MAX;
    var W = Math.round(600 * K * 100) / 100;   /* sama ruutu kaikille: KP:n laatta */
    var ohuin = Math.max(1.6, G * 0.07);

    function y(mm) { return G - mm * K; }      /* mm pohjasta → ruudun y */
    /* Profiili on viisi pistettä, ei neljä: laatan kylki on kalteva (D1 → D1Y) ja
       pään edessä on VK:n viiste (D2 → D3). Molemmat luetaan mitoista eikä
       oleteta — muuten tässä olisi kolmas kopio siluetista, ja kaksi ensimmäistä
       (mittakaavio.js, pilari()) korjattiin CAD:ista 18.9.2026.

       24 pikselissä kumpikin on alle pikselin. Ne ovat silti mukana, koska
       funktio ottaa korkeuden parametrina: sama koodi piirtää ikonin ja
       satapikselisen siluetin, ja jälkimmäisessä ero näkyy. */
    var d1 = M.D1 * K / 2, d1y = (M.D1Y || M.D1) * K / 2;
    var w = M.W * K / 2, d2 = M.D2 * K / 2, d3 = (M.D3 || M.D2) * K / 2;
    var vk = M.VK || 0;
    var h2 = Math.max(ohuin, M.H2 * K), h3 = Math.max(h2 + 0.6, M.H3 * K);
    var cx = W / 2, p = [];
    function P2(x2, yy) { p.push(N(cx + x2) + " " + N(yy)); }
    P2(-d1, G); P2(d1, G);                     /* laatan pohja */
    P2(d1y, G - h2); P2(w, G - h3);            /* laatan yläreuna ja viiste */
    P2(d2, y(M.H1 - vk));                      /* rungon yläpää */
    P2(d3, y(M.H1)); P2(-d3, y(M.H1));         /* pilarin pää, viisteen takana */
    P2(-d2, y(M.H1 - vk));
    P2(-w, G - h3); P2(-d1y, G - h2);

    var d = "M" + p.join("L") + "Z";
    /* PP: istukasta nouseva pylväs. Lyhyempi kuin KP:n korkeus, jotta ikoni ei
       kilpaile korkeimman perheen kanssa — tunniste on ohuus, ei korkeus. */
    if (perhe === "PP") {
      var pw = Math.max(1.4, 83 * K) / 2, py = y(M.H1);
      d += "M" + N(cx - pw) + " " + N(py) + "h" + N(2 * pw) +
           "v" + N(-250 * K) + "h" + N(-2 * pw) + "z";
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + " " + G +
      '" width="' + W + '" height="' + G +
      '" focusable="false" aria-hidden="true">' +
      '<path d="' + d + '" fill="currentColor"/></svg>';
  };
  window.tuotekuva.perheet = ["AP", "TP", "KP", "PP"];
  /* Kamera. Tarvikekuvat lukevat tämän, jotta pilari ja siihen kiertyvä tarvike
     eivät voi olla eri kulmassa. Katsesuunta on se, jota projektio ei näytä:
     x = y ja z = 2·CY·x, siis (1, 1, 2·CY). Pinta näkyy kun sen normaali osoittaa
     sinne päin. */
  window.tuotekuva.projektio = {CX: CX, CY: CY, katse: [1, 1, 2 * CY]};
})();
