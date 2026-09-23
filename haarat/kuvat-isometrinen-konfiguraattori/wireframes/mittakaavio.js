/* Mittakaavio: pilari halkaistuna sivulta, mitat H1, H2, H3, D1, D2, B1 ja U.
   Yksi lähde: tämä tiedosto piirtää kaavion sekä perhesivulle että
   varianttivertailuun, ja docs/kuvat/mittakaavio.py vie siitä SVG:n ja PNG:n.

   Piirros skaalautuu valitun korkeuden mukaan: kangas mitoitetaan perheen
   suurimmasta koosta, ja pilari kasvaa kiinteältä alareunalta. Siksi TP-200
   näyttää matalalta ja TP-600 korkealta, kuten ne oikeastikin ovat.

   Lähteet
     muoto   TP/A-601 FI, Insinööritoimisto Kronqvist 8.4.2026, leikkaus 1:10
             + tuotekuvat bcepilarimaailma.fi (tp-200.png, bce-family-flip)
     mitat   bcepilarimaailma.fi/bce-pilarit/ mittataulukot 15.9.2026
     muoto, W, D1Y, D2, D3 ja VK
             asiakkaan CAD-tiedostot TP.dwg, KP.dwg ja PP.dwg (18.9.2026, mitattu
             1:1 mm-koordinaateista, ks. ../aineisto-taustamatskut-2026-09-18.md
             luku 4). Koko siluetti on nyt luettu CAD:ista eikä tuotekuvista

   H2, H3 ja D1 täsmäävät CAD:iin: TP 65 / 115 / 450, KP 120 / 170 / 600.

   W oli aiemmin arvaus tuotekuvista, yksi luku per perhe. CAD osoittaa, ettei se
   ole vakio: viisteen yläpää levenee pilarin korkeuden mukana, koska runko on
   kartio ja jalkaosa on yhtä korkea kaikilla koolla. Siksi W on nyt kokokohtainen.

   Kolme muuta piirteetä luettiin CAD:ista vasta toisella kierroksella. Kaikki
   kolme olivat piirroksessa väärin, eikä yhtäkään näe mittataulukosta:

     VK, D3  **rungon päässä on viiste**, jota piirros ei tuntenut lainkaan: pää
             ei ole terävä vaan katkaistu. TP 10 mm (D2 → D2−20), KP ja PP 15 mm
             (152 → 120). Piirros päätti rungon suoraan D2:een, eli se väitti
             pilarin pään teräväksi särmäksi. Kolme perhettä kolmesta mitatusta
             osoitti saman viisteen, joten se on tuotteen piirre eikä koon

     D2      ei ole TP:llä perheen vakio sen paremmin kuin W: CAD antaa 135 mm
             koolle 200 ja 300, 125 mm koolle 400–600. Mittataulukon 125 on siis
             tosi vain kolmelle koolle viidestä. KP:llä 151,5 ≈ taulukon 152, ja
             esitteen 150 on pyöristys eikä eri mitta

     D1Y     **jalkalaatan kyljessä on päästö**: laatta kapenee ylöspäin, TP ja PP
             450 → 440, KP 600 → 570, eli KP:llä 15 mm per kylki. Piirros piirsi
             laatan suorakulmiona. KP:n laatassa ero näkyy paljaalla silmällä

   Kaksi kohtaa on yhä varmistettava BCE:ltä:
     H2 / H3  nimet ovat tulkintaa: mikään lähde ei nimeä mittoja kaaviossa.
              Luvut ovat CAD:ista
     U        valuankkurin syvyys. Mittataulukko sanoo 110 mm, CAD piirtää TP:lle
              Ø27 × 60 mm (paitsi TP-200: Ø27 × 130 mm) ja KP:lle joka koossa
              Ø27 × 35 mm + Ø20 × 35 mm eli 70 mm. Taulukon luku on säilytetty,
              koska se on julkaistu arvo — ero on kysyttävä. Tämä on ainoa kohta,
              jossa piirros tietoisesti seuraa taulukkoa eikä CAD:ia

   AP on ainoa perhe ilman CAD-tiedostoa, eikä sille ole tulossakaan: asiakkaan
   toimituksessa ovat KP, KP+, TP ja PP. Sen D1Y, D3 ja VK ovat siksi päättelyä —
   samat suhteet kuin TP:llä, koska AP-300 on muuten TP:n mittainen (H2 65, H3 115,
   D1 450). Merkitty alla erikseen. */
(function () {
  "use strict";

  /* Mitat vaihtelevat koon mukaan kaikissa kolmessa perheessä, ei vain AP:ssa.
     W ja TP:n D2 ovat kokokohtaisia (CAD 18.9.2026), muut ovat perheen vakioita.

     Siluetti on viisi pistettä eikä neljä, ja kolmella niistä ei ole saraketta
     mittataulukossa — ne ovat muotoa, eivät ilmoitettuja mittoja:
       D1   jalkalaatan alareuna, laatta on neliö
       D1Y  jalkalaatan yläreuna, korkeudella H2. Kylki on kalteva, ei pysty
       W    viisteen yläpää eli rungon juuri, korkeudella H3
       D2   rungon yläpää, korkeudella H1 − VK
       D3   pilarin pää, korkeudella H1. Rungon ja pään välissä on VK:n viiste */
  var PERHEET = {
    TP: {kt:[200,300,400,500,600], H2:65, H3:115, D1:450, D1Y:440, D2:125, D3:105,
         VK:10, W:150, B1:"M20", U:110,
         poikkeus:{200:{D2:135, D3:115}, 300:{D2:135, D3:115},
                   500:{W:160}, 600:{W:170}}},
    /* AP:lle ei ole CAD-tiedostoa, joten sen W on yhä arvaus tuotekuvista ja
       D1Y, D3 ja VK ovat päättelyä TP:n suhteista. Se on ainoa perhe, jonka
       muotoa ei ole mitattu — ks. tiedoston alun huomautus. */
    AP: {kt:[200,300,400], H2:48, H3:84, D1:330, D1Y:322, D2:100, D3:80, VK:10,
         W:140, B1:"M20", U:110,
         poikkeus:{200:{U:130}, 300:{H2:65, H3:115, D1:450, D1Y:440, W:160}}},
    KP: {kt:[400,500,600,700,800,900,1000], H2:120, H3:170, D1:600, D1Y:570,
         D2:152, D3:120, VK:15, W:174, B1:"M20", U:110,
         poikkeus:{500:{W:185}, 600:{W:195}, 700:{W:205}, 800:{W:215}, 900:{W:225},
                   1000:{W:235}}}
    /* PP-600 puuttuu tarkoituksella: sen pää on istukka eikä M20-kierre, ja se
       tarvitsee oman piirroksen. Mitat ovat tuotekuva.js:n PP-taulukossa.
       CAD 18.9.2026: jalkalaatta 450 × 450 × 65 (yläreuna 440), viisteen yläpää
       206 mm korkeudella 106, rungon yläpää 152 mm korkeudella 585, pää 120 mm
       eli 15 mm:n viiste kuten KP:llä. Istukka on kartio: suuaukko 80 mm, pohja
       40 mm, syvyys 386 mm — eli mittataulukon U 387 mm on juuri tämä.
       Kiristysrenkaan detaljipiirros on 82 mm leveä, mikä vahvistaa
       tarvikematriisin luvun. */
  };

  var INK = "#252425", DIM = "#e25d25", HATCH = "#cfcac3",
      FILL = "#f2f0ec", PAPER = "#faf9f7", MYKKA = "#a9a49d",
      FF = "Oswald,Raleway,system-ui,-apple-system,sans-serif";

  var KORKEUS = 300;   /* perheen suurin koko tässä pikselikorkeudessa */
  var SIVU = 150;      /* mittaviivojen ja tekstien tila pilarin kummallakin puolella */
  var MERKKI = 12;     /* merkin arvioitu leveys, kun H1:n arvo on vaihteluväli */

  /* Tekstikoot. Kaavion kirjaimet ovat sen koko sisältö — ne ovat se, mikä sitoo
     piirroksen taulukon sarakkeisiin — eivätkä siksi pienoistekstiä. Ensimmäinen
     versio piirsi ne 15 pikselillä, eli pienempänä kuin viereisen taulukon 16 px,
     ja kaavio luki alaviitteenä sille taulukolle jota sen on tarkoitus selittää.
     Korotettu 18.9.2026 Ollin huomiosta: periaate oli oikea, koko väärä.

     Luvut ovat SVG:n käyttäjäkoordinaatteja: kangas skaalautuu palstan leveyteen,
     joten renderöity koko on aina mitattava selaimesta eikä luettava tästä. */
  var FS_TUNNUS = 20,  /* kirjain yksin (H1, D2, …) */
      FS_ARVO   = 21,  /* pelkkä millimetriluku, kun käyttäjä on valinnut koon */
      FS_PARI_T = 17,  /* kirjain silloin kun sen alla on luku */
      FS_PARI_A = 20;  /* luku kirjaimen alla */

  function mitat(perhe, koko) {
    var P = PERHEET[perhe], m = {}, k;
    for (k in P) if (k !== "poikkeus" && k !== "kt") m[k] = P[k];
    var p = P.poikkeus && P.poikkeus[koko];
    if (p) for (k in p) m[k] = p[k];
    m.H1 = koko;
    return m;
  }

  /* Piirtää kaavion ja palauttaa SVG-merkkijonon.
       perhe    "TP" | "AP" | "KP"
       koko     valittu H1. Ilman valintaa piirretään perheen keskikoko ja H1:n
                kohdalle kirjoitetaan koko vaihteluväli — kaavio ei saa väittää
                käyttäjän valinneen kokoa, jota hän ei ole valinnut.
       luvut    true = kirjaimen perässä myös millimetriluku
       kiintea  true = kangas on aina saman kokoinen valinnasta riippumatta, jolloin
                mittakaava ja tekstikoko eivät muutu kun kokoa vaihdetaan
       vainLuvut true = pelkkä millimetriluku ilman kirjainta (vaatii luvut:true).
                Käytetään kun käyttäjä on valinnut koon: silloin kirjain on turha
                välivaihe lukijan ja mitan välissä.
       korosta  mitan tunnus ("H1", "D2", …). Muut vaimennetaan harmaaksi.
       id       yksilöivä pääte kuvioiden id:lle, kun sivulla on monta kaaviota */
  function mittakaavio(o) {
    o = o || {};
    var perhe = o.perhe || "TP", P = PERHEET[perhe];
    if (!P) return "";
    var hmax = P.kt[P.kt.length - 1];
    var valittu = !!o.koko;
    var koko = o.koko || P.kt[Math.floor(P.kt.length / 2)];
    var h1teksti = valittu ? koko : P.kt[0] + "\u2013" + hmax;
    var M = mitat(perhe, koko);
    var luvut = !!o.luvut, kor = o.korosta || null, vainLuvut = !!o.vainLuvut;
    var kiintea = !!o.kiintea;
    var hid = "bet-" + (o.id || perhe).toLowerCase().replace(/[^a-z0-9-]/g, "");

    var K = KORKEUS / hmax;
    var d1 = M.D1 / 2, d1y = (M.D1Y || M.D1) / 2, d2 = M.D2 / 2, w = M.W / 2;
    var d3 = (M.D3 || M.D2) / 2, vk = M.VK || 0;
    /* H1 on ainoa mitta oikealla, ja valitsematta sen arvo on vaihteluväli
       ("200–600"). Kangas levenee sen verran kuin teksti tarvitsee, muuten
       merkintä leikkautuu reunaan. */
    /* kiintea: kangas mitoitetaan aina laveimman tapauksen mukaan, jolloin se on
       saman kokoinen riippumatta siitä onko koko valittu ja mikä koko se on. Näin
       piirroksen mittakaava — ja tekstien koko — pysyy vakiona valinnasta toiseen,
       ja pilarien keskinäiset mittasuhteet näkyvät oikein: TP-200 on matala ja
       TP-600 korkea samassa kuvassa. */
    var levein = kiintea ? P.kt[0] + "\u2013" + hmax : h1teksti;
    var lisa = (luvut || kiintea) ? Math.max(0, (String(levein).length - 3) * MERKKI) : 0;
    var CW = Math.round(2 * d1 * K + 2 * SIVU + lisa);
    /* Ylätila mitoitetaan suurimman koon mukaan: D2:n merkintä on pilarin pään
       yläpuolella, ja luvun kanssa se vie rivin enemmän. */
    var YLA = (luvut || kiintea) ? 104 : 72;
    var CH = Math.round(KORKEUS + 60 + YLA);
    var CX = d1 * K + SIVU, BASE = CH - 60;

    var o$ = [];
    function X(mm) { return CX + mm * K; }
    function Y(mm) { return BASE - mm * K; }
    function N(v) { return (Math.round(v * 100) / 100) + ""; }

    /* korostustila: null = ei korostusta, muuten tämä mitta erottuu muista */
    function vari(tunnus) {
      if (!kor) return DIM;
      return kor === tunnus ? DIM : MYKKA;
    }
    function paksuus(tunnus) { return kor && kor === tunnus ? 2 : 1.3; }

    function viiva(x1, y1, x2, y2, st, lev, kat, lap) {
      o$.push('<line x1="' + N(x1) + '" y1="' + N(y1) + '" x2="' + N(x2) + '" y2="' + N(y2) +
        '" stroke="' + st + '" stroke-width="' + N(lev) + '"' +
        (kat ? ' stroke-dasharray="' + kat + '"' : "") +
        (lap ? ' opacity="' + lap + '"' : "") + ' stroke-linecap="round"/>');
    }
    function teksti(x, y, s, ankkuri, tayte, koko2) {
      o$.push('<text x="' + N(x) + '" y="' + N(y) + '" font-family="' + FF +
        '" font-size="' + (koko2 || FS_TUNNUS) + '" font-weight="600" letter-spacing=".08em"' +
        ' text-anchor="' + (ankkuri || "middle") + '" fill="' + (tayte || INK) + '">' + s + "</text>");
    }
    /* Kirjain ja luku samaan merkintään: luku on se mitä työmaalla luetaan,
       kirjain se mikä sitoo merkinnän taulukon sarakkeeseen. */
    function merkinta(x, y, tunnus, arvo, ankkuri) {
      var vaim = kor && kor !== tunnus;
      if (!luvut || arvo == null) { teksti(x, y, tunnus, ankkuri, vaim ? MYKKA : INK); return; }
      /* vainLuvut: kun käyttäjä on valinnut koon, kaaviossa lukee pelkkä mitta.
         Kirjain on tarpeen vain silloin kun arvoa ei ole — muuten lukija joutuu
         pitämään kirjaimen mielessä ja etsimään sen arvon taulukosta. Taulukon
         sarakeotsikot säilyvät, ja valitsematta kaavio selittää kirjaimet. */
      if (vainLuvut) { teksti(x, y + 12, arvo, ankkuri, vaim ? MYKKA : DIM, FS_ARVO); return; }
      teksti(x, y, tunnus, ankkuri, vaim ? MYKKA : INK, FS_PARI_T);
      teksti(x, y + 22, arvo, ankkuri, vaim ? MYKKA : DIM, FS_PARI_A);
    }

    function pystymitta(x, ya, yb, tunnus, arvo, suunta, apu) {
      var c = vari(tunnus);
      viiva(x, ya, x, yb, c, paksuus(tunnus));
      [ya, yb].forEach(function (yy) {
        viiva(x - 4, yy + 4 * suunta, x + 4, yy - 4 * suunta, c, paksuus(tunnus));
        if (apu) viiva(apu[0], yy, apu[1], yy, c, 1, "2 3", "0.55");
      });
      merkinta(x + 17 * suunta, (ya + yb) / 2 + (luvut ? -3 : 7), tunnus, arvo,
        suunta > 0 ? "start" : "end");
    }
    function vaakamitta(y, xa, xb, tunnus, arvo, apu, yl) {
      var c = vari(tunnus);
      viiva(xa, y, xb, y, c, paksuus(tunnus));
      [xa, xb].forEach(function (xx) {
        viiva(xx - 4, y + 4, xx + 4, y - 4, c, paksuus(tunnus));
        if (apu) viiva(xx, apu[0], xx, apu[1], c, 1, "2 3", "0.55");
      });
      merkinta((xa + xb) / 2, yl != null ? yl : y - (luvut ? 33 : 13), tunnus, arvo);
    }

    /* ---- pilarin poikkileikkaus ----
       Viisi pistettä: laatan alareuna, laatan yläreuna (kalteva kylki),
       viisteen yläpää, rungon yläpää ja pilarin pää. Kaksi viimeistä eroavat
       toisistaan VK:n verran — pää on katkaistu, ei terävä. */
    var reuna = [[d1,0],[d1y,M.H2],[w,M.H3],[d2,koko-vk],[d3,koko]];
    var aaret = reuna.slice().reverse().map(function (p) { return [-p[0], p[1]]; }).concat(reuna);
    var rata = aaret.map(function (p) { return N(X(p[0])) + "," + N(Y(p[1])); }).join(" ");

    o$.push('<defs><pattern id="' + hid + '" width="9" height="9" ' +
      'patternUnits="userSpaceOnUse" patternTransform="rotate(45)">' +
      '<line x1="0" y1="0" x2="0" y2="9" stroke="' + HATCH + '" stroke-width="1"/></pattern></defs>');
    o$.push('<polygon points="' + rata + '" fill="' + FILL + '"/>');
    o$.push('<polygon points="' + rata + '" fill="url(#' + hid + ')"/>');
    o$.push('<polygon points="' + rata + '" fill="none" stroke="' + INK +
      '" stroke-width="2" stroke-linejoin="round"/>');

    /* keskiviiva ennen ankkuria: ankkurin aukko peittää sen, jolloin reikä on tyhjä */
    viiva(CX, Y(koko) - 30, CX, Y(0) + 22, HATCH, 1, "12 4 3 4");

    /* Valuankkuri. Pilari on halkaistu, joten ankkurikin on leikattu: se on avoin
       reikä päässä eikä piiloviiva, ja aukko puhkaisee rungon yläreunan. */
    var au = koko - M.U, ar = 9;
    if (au < M.H3) au = M.H3;                 /* matalimmalla koolla ei puhkaista jalkaa */
    o$.push('<rect x="' + N(X(-ar) - 1) + '" y="' + N(Y(koko) - 2) + '" width="' +
      N(2 * ar * K + 2) + '" height="' + N((koko - au) * K + 2) + '" fill="' + PAPER + '"/>');
    [-ar, ar].forEach(function (sx) { viiva(X(sx), Y(koko) - 1, X(sx), Y(au), INK, 1.6); });
    viiva(X(-ar), Y(au), X(ar), Y(au), INK, 1.6);
    for (var i = 1; i < 8; i++) {             /* sisäkierteen rihlat, B1 */
      var yy = Y(koko) + (koko - au) * K * i / 8;
      viiva(X(-ar), yy, X(-ar) + 4, yy + 2, INK, 1);
      viiva(X(ar), yy, X(ar) - 4, yy + 2, INK, 1);
    }

    /* ---- mitoitukset ---- */
    var ylin = Y(koko), alin = Y(0), oikea = X(d1), vasen = X(-d1);
    pystymitta(oikea + 96, alin, ylin, "H1", h1teksti, 1, [X(d2) + 8, oikea + 96]);
    pystymitta(vasen - 30, alin, Y(M.H2), "H2", M.H2, -1, [vasen - 30, vasen - 4]);
    pystymitta(vasen - 74, alin, Y(M.H3), "H3", M.H3, -1, [vasen - 74, X(-w) - 4]);
    vaakamitta(alin + 44, vasen, oikea, "D1", M.D1, [alin + 6, alin + 44], alin + 34);
    /* D2 on rungon yläpää korkeudella H1 − VK, ei pilarin pää: apuviivat
       lähtevät siltä korkeudelta, muuten mitta osoittaisi viisteen ohi. */
    vaakamitta(ylin - 40, X(-d2), X(d2), "D2", M.D2, [Y(koko - vk) - 6, ylin - 40],
      ylin - (luvut ? 66 : 50));

    /* U: apuviivat läpäisevät leikkauksen — muuten mitta ei mahdu ankkurin ja
       rungon reunan väliin. */
    var ux = oikea + 30, cu = vari("U");
    viiva(ux, Y(koko), ux, Y(au), cu, paksuus("U"));
    [Y(koko), Y(au)].forEach(function (yy) {
      viiva(ux - 4, yy + 4, ux + 4, yy - 4, cu, paksuus("U"));
      viiva(X(ar), yy, ux, yy, cu, 1, "2 3", "0.55");
    });
    merkinta(ux + 12, (Y(koko) + Y(au)) / 2 + (luvut ? -2 : 5), "U", M.U, "start");

    /* B1: sisäkierre, osoitinviiva päästä ylös vasemmalle */
    var bx = X(-ar) + 3, by = Y(koko) + 16, cb = vari("B1");
    viiva(bx, by, bx - 40, by - 36, cb, paksuus("B1"));
    viiva(bx - 40, by - 36, bx - 66, by - 36, cb, paksuus("B1"));
    o$.push('<circle cx="' + N(bx) + '" cy="' + N(by) + '" r="2.6" fill="' + cb + '"/>');
    merkinta(bx - 72, by - 31, "B1", M.B1, "end");

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '" focusable="false" aria-hidden="true">' +
      o$.join("") + "</svg>";
  }

  /* Pelkkä siluetti ilman mitoituksia: kokovalitsimen painikkeisiin, joissa
     viiden koon keskinäinen ero näkyy yhdellä silmäyksellä. */
  function siluetti(perhe, koko, lev) {
    var P = PERHEET[perhe];
    if (!P) return "";
    var hmax = P.kt[P.kt.length - 1], M = mitat(perhe, koko);
    var K = 1, d1 = M.D1 / 2;
    var CW = M.D1, CH = hmax;
    var reuna = [[d1,0],[(M.D1Y || M.D1)/2,M.H2],[M.W/2,M.H3],
                 [M.D2/2,koko-(M.VK||0)],[(M.D3 || M.D2)/2,koko]];
    var aaret = reuna.slice().reverse().map(function (p) { return [-p[0], p[1]]; }).concat(reuna);
    var rata = aaret.map(function (p) {
      return (CW / 2 + p[0] * K) + "," + (CH - p[1] * K);
    }).join(" ");
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + (lev || 44) + '" focusable="false" aria-hidden="true">' +
      '<polygon points="' + rata + '" fill="currentColor"/></svg>';
  }

  window.mittakaavio = mittakaavio;
  window.mittakaavio.siluetti = siluetti;
  window.mittakaavio.perheet = PERHEET;
  window.mittakaavio.mitat = mitat;
})();
