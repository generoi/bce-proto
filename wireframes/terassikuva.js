/* Terassikuva: koko rakenne räjäytettynä, samasta kamerasta kuin tuotekuvat.

   Vanha versio tästä kuvasta (docs/kuvat/konfiguraattori-isometric-*.png,
   rakenna.py) piirsi jokaisen kappaleen litteänä laatikkona: pilari oli harmaa
   suunnikas, terassi ruskea levy jossa oli viivoja. Se kertoi kokoonpanon mutta
   ei yhtään tuotetta. Sen jälkeen on kirjoitettu kolme generaattoria, jotka
   piirtävät oikeat kappaleet oikeista mitoista — ja tämä tiedosto asettaa ne
   samaan näkymään.

   Tämä tiedosto ei piirrä yhtään tuotetta itse. Se piirtää vain maan, johon ei
   ole generaattoria, ja kokoonpanon merkinnät. Kaikki muu tulee muualta:

     tuotekuva.js     pilari, betoni, mitat mittakaavio.js:stä
     tarvikekuva.js   pilarikenkä, kuumasinkitty teräs
     palkkikuva.js    palkki ja terassilauta, syykuvio ja päätypuu

   Kaikki neljä lukevat kameran tuotekuva.js:stä, joten ne eivät voi olla eri
   kulmassa. Aksonometria, ei perspektiiviä: pystymitat 1:1, joten kuvasta voi
   mitata ja kaksi terassikokoa on keskenään vertailukelpoinen.

   ---- Mistä ruudukko tulee ------------------------------------------------
   Pilarien määrä ja väli eivät ole piirtäjän valinta vaan laskurin sääntö
   (`../pilarilaskuri/bce-pilarilaskuri.html`, `gridFor`): sarakkeita on
   `ceil(leveys / jako) + 1` ja rivejä vastaavasti, ja väli jaetaan tasan.
   Kaava on toistettu tässä, koska sitä ei saa luettua HTML-sivun sisältä —
   mutta **taulukkoa ei ole toistettu**. `jako` on kutsujan parametri, ja sen
   oletus 1600 mm on laskurin oma luku palkille 48 × 148 (`R.spacingByBeam`,
   lähde KESTOPUU, taulukon alaraja). Jos taulukko muuttuu, tänne muuttuu yksi
   luku eikä taulukkoa tarvitse kopioida.

   Oletusterassi 4 × 3 m + 48 × 148 antaa 4 × 3 = 12 pilaria, eli täsmälleen
   saman ruudukon kuin vanhassa kuvassa oli — mutta nyt se on laskettu eikä
   piirretty.

   ---- Mitä kuva väittää, ja mitä se ei väitä -------------------------------
   Nämä eivät ole tuotetietoa. Ne on tiedettävä ennen kuin kuvaa käytetään
   muuhun kuin kokoonpanon havainnollistamiseen:

     1  PILARIT SEISOVAT MAAN PÄÄLLÄ. Todellisuudessa TP-400 jää lähes kokonaan
        täytön alle: A-601 olettaa 500 mm täyttöä pohjalaatan päällä, jolloin
        400 mm:n pilarista ei jää näkyviin mitään. Kuva näyttää **asennus-
        järjestyksen**, ei asennussyvyyttä. Syvyyden näyttää `asennus-tp-b.png`,
        ja ristiriita itsessään on kirjattu `docs/kuvat/README.md`:hen.
     2  LAUDAT ON PIIRRETTY SUORAAN PALKKIEN PÄÄLLE. Laskurin ruudukko jättää
        palkkien väliin 1333 mm, ja se on enemmän kuin 28 mm:n terassilauta
        kantaa — oikeassa rakenteessa palkkien päälle tulee koolaus k600.
        Laskuri ei kysy koolausta eikä sitä siksi ole piirretty: kuva näyttää
        sen mitä laskuri sanoo. Tämä on kysymys laskurille, ei kuvalle.
     3  TERASSILAUTA 28 × 120 EI TULE MISTÄÄN LÄHTEESTÄ. Laskuri kysyy palkin
        koon muttei laudan. 28 × 120 on tavallisin suomalainen terassilauta;
        se on parametri (`lauta`), ei vakio.

   Neljäs, lievempi: kenkä on PIK 50-70, koska laskuri valitsee sen kun
   kiinnike saa näkyä (`fixing:'nakyva'`). Piilokiinnike P-PIK on kuvassa väärin
   päin ennen kuin BCE vastaa — ks. yhdistelmakuva.js — joten sitä ei käytetä
   tässä.

   Värit tokeneista: tuotteet omistaan, maa `--maa-*`:sta (bce-v4.css). Kuva on
   läpinäkyvä, eikä taustalaattaa piirretä. */
(function () {
  "use strict";

  var PR = (window.tuotekuva && window.tuotekuva.projektio) ||
           {CX: 0.866, CY: 0.42};
  var CX = PR.CX, CY = PR.CY;

  function T(nimi, fb) { return "var(--" + nimi + "," + fb + ")"; }
  var V = {
    sora:    [T("maa-sora-yla", "#e8e2d6"), T("maa-sora-sivu-a", "#dbd4c2"),
              T("maa-sora-sivu-b", "#cec6b4")],
    xps:     [T("maa-xps-yla", "#c4d0d2"), T("maa-xps-sivu-a", "#b1bfc1"),
              T("maa-xps-sivu-b", "#9fadb0")],
    murske:  [T("maa-murske-yla", "#c9c1b1"), T("maa-murske-sivu-a", "#b8af9d"),
              T("maa-murske-sivu-b", "#ada492")],
    viiva:   T("maa-viiva", "#8d8577"),
    merkki:  T("ink-3", "#6f6d6b"),
    teksti:  T("ink", "#252425"),
    aksentti: T("accent", "#e25d25"),
    muste:   T("ink", "#252425")
  };

  /* Maakerrosten paksuudet ovat asennus.py:stä, joka lukee ne A-601:stä:
     murske 400 mm pohjalaatan alla, XPS-routaeriste 90 mm. Tasaussora 60 mm on
     tulkinta — piirustus ei nimeä sitä, mutta pilari ei asetu murskeen päälle
     ilman tasausta. Kolme kerrosta myös erottuvat toisistaan kuvassa, ja se on
     kerroksen ainoa tehtävä tässä. */
  var MAA = [
    {avain: "murske", nimi: "Kantava murske", paksuus: 400, vari: V.murske},
    {avain: "xps",    nimi: "Routaeristys XPS", paksuus: 90, vari: V.xps},
    {avain: "sora",   nimi: "Tasaussora", paksuus: 60, vari: V.sora}
  ];

  var OLETUS = {
    leveys: 4000, pituus: 3000,
    /* Tukien väli millimetreinä. 1600 = laskurin R.spacingByBeam['48x148'],
       lähde KESTOPUU, taulukon alaraja. Ei taulukkoa tässä tiedostossa. */
    jako: 1600,
    perhe: "TP", koko: 400,
    palkki: "48x148",
    lauta: "28x120", rako: 4,
    kenka: "pik-50-70",
    ylitys: 200,          /* terassin ulkonema pilariruudukon ulkopuolelle */
    maareuna: 500,        /* maapedin ulkonema terassin ulkopuolelle */
    /* Kerrosten väli räjäytyksessä; 0 = koottu rakenne. 1800 mm ei ole
       makuasia: pohjan oma kuvakorkeus on (leveys + pituus) · CY ≈ 2900 mm,
       ja sitä pienemmällä välillä ylempi kerros laskeutuu alemman päälle
       ruudulla vaikka ne ovat maailmassa erillään. Ensimmäinen versio käytti
       700:aa, ja siinä palkit jäivät kokonaan laudoituksen alle. Täyteen
       erilleen ei pääse: leveän ja matalan rakenteen kerrokset menevät aina
       osittain päällekkäin, koska pohja itse on kuvassa korkea. */
    rajahdys: 2400,
    leveysPx: 1680,
    /* Animaatio: kerrokset laskeutuvat paikoilleen ja nousevat takaisin.
       Ks. kerrosanimaatio() — projektio tekee tästä yhden translateY:n. */
    animaatio: false,
    porras: 0.035,        /* porrastus palojen välillä, s */
    matka: 1.25,          /* yhden palan laskeutumisaika, s */
    tauko: 1.2,           /* pito koottuna, s */
    kesto: null,          /* koko kierros, s. null = lasketaan osista */
    /* Vierityksen mukaan ajettu animaatio kellon sijaan. Ks. tyylit(). */
    vieritys: false,
    /* Käänteinen suunta: alaspäin vierittäminen AVAA räjäytyksen sen sijaan
       että kokoaisi rakenteen. Vain vieritystilassa — kellon kanssa suunta on
       aikajanassa eikä sitä tarvitse kääntää erikseen. */
    kaanteinen: false,
    /* Kun sivu itse julistaa vierityksen aikajanan (`view-timeline-name`),
       kuva ei julista omaansa vaan viittaa siihen nimellä. Tarvitaan aina kun
       kuva on sticky-elementin sisällä: silloin sen oma kulku ruudun läpi
       pysähtyy juuri siksi ajaksi, jonka pitäisi olla animaation ydin. */
    ulkoinenAikajana: false,
    fonttikerroin: 1
  };

  /* Laskurin gridFor, sanasta sanaan (bce-pilarilaskuri.html). Kaava, ei data. */
  function ruudukko(w, l, sp) {
    var sar = Math.max(2, Math.ceil(w / sp) + 1);
    var riv = Math.max(2, Math.ceil(l / sp) + 1);
    return {sarakkeet: sar, rivit: riv, n: sar * riv,
            valiX: w / (sar - 1), valiY: l / (riv - 1)};
  }

  function N(v) { return Math.round(v * 100) / 100; }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function metri(mm) {
    return (Math.round(mm / 100) / 10).toFixed(1).replace(".", ",") + " m";
  }

  /* ---- Kokoonpano ----------------------------------------------------------
     Yksi funktio, joka kertoo missä mikäkin kerros on. Kaikki pystymitat
     johdetaan tuotteiden omista mitoista — yhtään korkeutta ei ole kirjoitettu
     käsin, joten pilarikoon vaihto siirtää kaiken sen päällä olevan. */
  function kokoonpano(o) {
    var PM = window.tuotekuva.mitat(o.perhe, o.koko);
    var TK = window.tarvikekuva.tieto(o.kenka);
    var PK = window.palkkikuva.mitat(o.palkki);
    var LA = window.palkkikuva.mitat(o.lauta);
    var R = o.rajahdys;

    /* Kengän nollataso on sen pohjalevyn yläpinta: levy on paikallisesti
       −t…0, joten pilarin päälle laskettuna nolla on H1 + t. Palkki lepää
       tuolla tasolla uran pohjassa, ja lauta palkin yläsyrjällä.

       Kolme kerrosta, ei neljää: kenkä ja palkki nousevat yhdessä. Ensin niitä
       kokeiltiin erillisinä, ja silloin kenkä jäi leijumaan tyhjään — 90 mm:n
       teräsosa 4000 mm:n näkymässä ei lue omana kerroksenaan, ja se vei kuvasta
       kolmanneksen korkeutta. Palkin urassa se lukee heti: se on se osa, joka
       pitää palkin pilarin päällä. */
    var kenkaZ = PM.H1 + TK.t;
    return {
      PM: PM, TK: TK, PK: PK, LA: LA,
      pilariZ: 0,
      kenkaZ: kenkaZ + R,
      palkkiZ: kenkaZ + R,
      lautaZ: kenkaZ + PK.h + 2 * R,
      /* Paljonko kukin kerros laskeutuu, maailman millimetreinä. Animaatio
         kertoo nämä mittakaavalla ja siirtää kerrosta ruudulla alaspäin. */
      nostoKenka: R,
      nostoLauta: 2 * R
    };
  }

  /* ---- Kappaleluettelo ----------------------------------------------------
     Erotettu piirrosta, koska kankaan koko on tiedettävä ennen kuin mitään
     piirretään. Sama luettelo ajetaan kahdesti: kerran laatikoiden laskemiseen
     ja kerran piirtoon. */
  function osat(o) {
    var G = ruudukko(o.leveys, o.pituus, o.jako);
    var A = kokoonpano(o);
    var i, j;

    /* Pilarit ja kengät: ruudukon solmut, takaa eteen (x + y kasvaa). */
    var solmut = [];
    for (j = 0; j < G.rivit; j++) for (i = 0; i < G.sarakkeet; i++) {
      solmut.push([i * G.valiX, j * G.valiY]);
    }
    solmut.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });

    /* Palkit kulkevat y:n suuntaan pilarisarakkeiden päällä. Suunta ei ole
       vapaa: pilarikengän ura on tarvikekuva.js:ssä y:n suuntainen, eikä
       tarviketta käännetä — käännetty kenkä olisi eri kuva samasta osasta. */
    var palkit = [];
    for (i = 0; i < G.sarakkeet; i++) {
      palkit.push({x: i * G.valiX, pituus: o.pituus + 2 * o.ylitys});
    }

    /* Laudat kulkevat x:n suuntaan palkkien poikki, lappeellaan. */
    var jakoL = A.LA.h + o.rako, laudat = [];
    var y0 = -o.ylitys, y1 = o.pituus + o.ylitys;
    var nL = Math.max(1, Math.floor((y1 - y0 + o.rako) / jakoL));
    /* Rivi keskitetään, jotta molemmille reunoille jää sama kaista: muuten
       terassin toinen reuna on aina vajaa lauta ja se lukee virheeksi. */
    var lev = nL * jakoL - o.rako;
    var alkuY = y0 + (y1 - y0 - lev) / 2;
    for (i = 0; i < nL; i++) laudat.push({y: alkuY + i * jakoL});

    return {G: G, A: A, solmut: solmut, palkit: palkit, laudat: laudat,
            lautaPituus: o.leveys + 2 * o.ylitys,
            maa: {x0: -o.ylitys - o.maareuna, x1: o.leveys + o.ylitys + o.maareuna,
                  y0: -o.ylitys - o.maareuna, y1: o.pituus + o.ylitys + o.maareuna}};
  }

  /* Kappaleiden laatikot maailman millimetreinä. Projektio on lineaarinen,
     joten kuperan kappaleen kuva mahtuu sen kulmien kuvan sisään. */
  function laatikot(o, S) {
    var L = [], A = S.A;
    var maaAla = 0;
    MAA.forEach(function (k) { maaAla -= k.paksuus; });
    L.push({x: [S.maa.x0, S.maa.x1], y: [S.maa.y0, S.maa.y1], z: [maaAla, 0]});
    S.solmut.forEach(function (p) {
      L.push({x: [p[0] - A.PM.D1 / 2, p[0] + A.PM.D1 / 2],
              y: [p[1] - A.PM.D1 / 2, p[1] + A.PM.D1 / 2],
              z: [0, A.PM.H1]});
      var k = A.TK.laatikko;
      L.push({x: [p[0] + k.x[0], p[0] + k.x[1]], y: [p[1] + k.y[0], p[1] + k.y[1]],
              z: [A.kenkaZ + k.z[0], A.kenkaZ + k.z[1]]});
    });
    S.palkit.forEach(function (p) {
      L.push(window.palkkikuva.laatikko({koko: o.palkki, akselit: "yxz",
        siirto: [p.x, o.pituus / 2, A.palkkiZ], pituus: p.pituus}));
    });
    S.laudat.forEach(function (p) {
      L.push(window.palkkikuva.laatikko({koko: o.lauta, akselit: "xzy",
        siirto: [o.leveys / 2, p.y, A.lautaZ + A.LA.b / 2],
        pituus: S.lautaPituus}));
    });
    return L;
  }

  function rajat(L) {
    var xs = [], ys = [];
    L.forEach(function (B) {
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) for (var k = 0; k < 2; k++) {
        xs.push((B.x[i] - B.y[j]) * CX);
        ys.push((B.x[i] + B.y[j]) * CY - B.z[k]);
      }
    });
    return {x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs),
            y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys)};
  }

  /* ---- Piirtoapurit --------------------------------------------------------
     Maa on ainoa kappale, jolle ei ole generaattoria, ja se on tässä
     tarkoituksella yksinkertainen: kolme suorakulmaista särmiötä. Maa on
     taustaa, ja jos se saa saman yksityiskohdan kuin tuotteet, tuotteet
     katoavat siihen. */
  function piirtaja(out, K, ox, oy, hid, lev) {
    function P(x, y, z) {
      return [ox + (x - y) * CX * K, oy + (x + y) * CY * K - z * K];
    }
    function d(pts) {
      return pts.map(function (p) { return N(p[0]) + "," + N(p[1]); }).join(" ");
    }
    function poly(pts, fill, viivoita, paksuus) {
      out.push('<polygon points="' + d(pts) + '" fill="' + (fill || "none") + '"' +
        (viivoita ? ' stroke="' + V.viiva + '" stroke-width="' + N(paksuus || lev) +
                    '" stroke-opacity=".55" stroke-linejoin="round"' : "") + "/>");
    }
    function pinta(pts, vari, rakeisuus) {
      poly(pts, vari);
      if (rakeisuus) poly(pts, "url(#" + hid + "-rae)");
      poly(pts, "url(#" + hid + "-valo)");
      poly(pts, "none", true);
    }
    return {
      P: P, d: d, poly: poly,
      /* Särmiö: takasivut eivät näy, joten piirretään +x, +y ja yläpinta.
         Yläpinta viimeisenä, koska se on lähimpänä kameraa. */
      laatikko: function (b, z0, z1, vari, rakeisuus) {
        pinta([P(b.x1, b.y0, z1), P(b.x1, b.y1, z1), P(b.x1, b.y1, z0),
               P(b.x1, b.y0, z0)], vari[2], rakeisuus);
        pinta([P(b.x0, b.y1, z1), P(b.x1, b.y1, z1), P(b.x1, b.y1, z0),
               P(b.x0, b.y1, z0)], vari[1], rakeisuus);
        pinta([P(b.x0, b.y0, z1), P(b.x1, b.y0, z1), P(b.x1, b.y1, z1),
               P(b.x0, b.y1, z1)], vari[0], rakeisuus);
      },
      viiva: function (a, b, vari, paksuus, katko, peitto) {
        out.push('<line x1="' + N(a[0]) + '" y1="' + N(a[1]) + '" x2="' + N(b[0]) +
          '" y2="' + N(b[1]) + '" stroke="' + vari + '" stroke-width="' + N(paksuus) +
          '" stroke-linecap="round"' +
          (katko ? ' stroke-dasharray="' + katko + '"' : "") +
          (peitto ? ' opacity="' + peitto + '"' : "") + "/>");
      },
      teksti: function (p, s, koko, vari, ankkuri, paino) {
        out.push('<text x="' + N(p[0]) + '" y="' + N(p[1]) + '" font-size="' +
          N(koko) + '" font-family="Raleway,system-ui,sans-serif" font-weight="' +
          (paino || 500) + '" text-anchor="' + (ankkuri || "middle") + '" fill="' +
          vari + '">' + esc(s) + "</text>");
      }
    };
  }

  /* ---- Kerrosanimaatio -----------------------------------------------------
     Yksi asia tekee tästä helppoa, ja se on projektion ominaisuus eikä temppu:
     ruutupiste on `y = (X + Y)·CY − Z`, joten **kappaleen laskeminen maailmassa
     on täsmälleen pystysuora siirto ruudulla.** Mitään ei tarvitse projisoida
     uudelleen — kerros piirretään räjäytettyyn paikkaansa ja siirretään
     `translateY(nosto · K)`:lla siihen, missä se on koottuna. Pysähdyskuva on
     geometrisesti sama kuin `rajahdys:0`, ei likiarvo siitä.

     ---- Paluu on ajassa käännetty lasku, ei toinen lasku ----
     Tämä oli ensimmäisessä versiossa väärin kahdella tavalla, ja kumpikaan ei
     näy koodista vaan vasta kuvasta:

       1  SAMA EASING MOLEMPIIN SUUNTIIN EI OLE KÄÄNTEINEN. Jos lasku on
          `cubic-bezier(.33,0,.2,1)`, nousu ei ole sama käyrä vaan sen
          peilaus: käyrän `f` aikakäännös on `1 − f(1 − t)`, jonka
          kontrollipisteet ovat `(1−x2, 1−y2, 1−x1, 1−y1)` eli
          `cubic-bezier(.8,0,.67,1)`. Samalla käyrällä lasku pehmenee loppua
          kohti ja nousu pehmenee loppua kohti — eli molemmat jarruttavat, mikä
          on juuri se mitä käänteisyys *ei* ole.
       2  PORRASTUS EI KÄÄNTYNYT. `animation-delay` siirtää palan koko
          aikajanaa, joten ensimmäisenä laskeutunut lähti myös ensimmäisenä
          nousemaan. Käänteisessä liikkeessä viimeisenä laskeutunut nousee
          ensimmäisenä. Siksi viive ei voi olla `animation-delay`, vaan sen on
          oltava keyframe-prosenteissa: laskuviive `d`, nousuviive `dmax − d`.

     Siitä seuraa, ettei yksi jaettu `@keyframes` riitä, vaan sääntöjä on yksi
     per eri viive (noin 30 kpl). Se on halpaa — sääntö on ~180 tavua kuvassa,
     joka on megatavu.

     Aikajana rakennetaan sekunneista eikä prosenteista, jolloin porrastus
     mahtuu aina: `t0` pito räjäytettynä · lasku `dmax + matka` · `tauko`
     koottuna · nousu `dmax + matka` · `tloppu`. Kierroksen pituus on näiden
     summa, ellei `kesto` ohita sitä (silloin kaikki skaalautuu samassa
     suhteessa eivätkä prosentit muutu).

     `prefers-reduced-motion` pysäyttää kaiken räjäytettyyn asentoon, joka on
     kuvan oma staattinen tila — ei siis erillistä varakuvaa. */
  var ALAS = "cubic-bezier(.33,0,.2,1)";
  var YLOS = "cubic-bezier(.8,0,.67,1)";   /* ALAS ajassa käännettynä */

  function aikajana(o, viiveet) {
    var i, dmax = 0;
    for (i = 0; i < viiveet.length; i++) if (viiveet[i] > dmax) dmax = viiveet[i];
    dmax = dmax / 1000;
    var t0 = 0.8, tloppu = 0.5, vaihe = dmax + o.matka;
    var Tn = t0 + vaihe + o.tauko + vaihe + tloppu;
    return {dmax: dmax, t0: t0, tloppu: tloppu, vaihe: vaihe, Tn: Tn,
            T: o.kesto || Tn};
  }

  function tyylit(juuri, o, viiveet) {
    var J = aikajana(o, viiveet), r = [], i, d, A, B, C, D;
    /* Neljä desimaalia eikä kahta: prosentin sadasosa on 7,9 s:n kierroksella
       0,8 ms, ja se riitti rikkomaan peilauksen 0,19 pikselillä. Mitattuna
       neljällä desimaalilla lasku ja sen peilikuva ovat samat alle 0,01 px:n
       tarkkuudella. Tavut ovat halpoja, epäsymmetria ei. */
    function p(t) { return Math.round(t / J.Tn * 1e6) / 1e4; }
    for (i = 0; i < viiveet.length; i++) {
      d = viiveet[i] / 1000;
      A = J.t0 + d;                                  /* lasku alkaa */
      B = A + o.matka;                               /* koottuna */
      C = J.t0 + J.vaihe + o.tauko + (J.dmax - d);   /* nousu alkaa, käänteinen */
      D = C + o.matka;
      r.push("@keyframes " + juuri + "-k" + i + "{" +
        "0%," + p(A) + "%{transform:translateY(0);animation-timing-function:" + ALAS + "}" +
        p(B) + "%{transform:translateY(var(--d));animation-timing-function:linear}" +
        p(C) + "%{transform:translateY(var(--d));animation-timing-function:" + YLOS + "}" +
        p(D) + "%,100%{transform:translateY(0)}}");
      r.push("." + juuri + "-k" + i + "{animation:" + juuri + "-k" + i + " " +
        N(J.T) + "s linear infinite both}");
    }
    /* Katkoviivat häipyvät laskun ajaksi ja palaavat nousun mukana. Sama
       aikajana ja sama peilaus kuin kappaleilla, jotta ne eivät irtoa. */
    r.push("@keyframes " + juuri + "-h{" +
      "0%," + p(J.t0) + "%{opacity:1;animation-timing-function:" + ALAS + "}" +
      p(J.t0 + J.vaihe) + "%{opacity:0;animation-timing-function:linear}" +
      p(J.t0 + J.vaihe + o.tauko) + "%{opacity:0;animation-timing-function:" + YLOS + "}" +
      p(J.Tn - J.tloppu) + "%,100%{opacity:1}}");
    r.push("." + juuri + "-h{animation:" + juuri + "-h " + N(J.T) +
      "s linear infinite both}");
    /* ---- Vieritys aikajanana ----
       Sama animaatio, eri kello: `animation-timeline` korvaa ajan kuvan omalla
       kulkemisella ruudun läpi. Keyframet eivät muutu lainkaan — porrastus,
       tauot ja käänteinen paluu tulevat sellaisenaan mukaan, ja siksi
       vierittäminen ylöspäin purkaa rakenteen täsmälleen käänteisessä
       järjestyksessä kuin alaspäin vierittäminen kokosi sen.

       Aikajana nimetään kuvan juuressa (`view-timeline-name`) eikä lueta
       `view()`-funktiolla suoraan palasta: `<g>` ei ole korvattu elementti eikä
       sillä ole omaa laatikkoa, jonka kulkua ruudun läpi voisi mitata. Juuri-SVG
       on, ja nimetyn aikajanan löytää jokainen sen jälkeläinen.

       `@supports` on tässä oikea työkalu eikä varmuuden vuoksi -ehto: selain,
       joka ei tunne vierityksen aikajanoja, jää kellon varaan ja kuva toimii
       yhä. Vähennettyä liikettä pyytävälle ei kumpikaan — vierityskin on
       liikettä. */
    if (o.vieritys) {
      /* Vierityksessä aikajanassa ei ole paluuta lainkaan: rakenne kootaan ja
         se jää kootuksi. Ylöspäin vierittäminen purkaa sen käänteisesti ilman
         että sitä tarvitsee kirjoittaa — vieritysajettu animaatio on kelaus,
         ja kelaus on symmetrinen määritelmän nojalla. Koko easing-peilaus,
         joka kellon kanssa piti laskea käsin, katoaa tässä tilassa itsestään.

         Siksi omat keyframet: kellon aikajanassa loppu palaa räjäytettyyn, ja
         se tarkoittaisi vierityksessä, että rakenne hajoaa uudelleen kun lohko
         poistuu ruudulta. CTA:ssa se on väärä loppu. */
      /* Suunta. Kappaleet piirretään aina räjäytettyyn paikkaansa, joten
         `translateY(var(--d))` on koottu asento ja `translateY(0)` räjäytetty.
         Kokoava suunta menee siis 0 → --d ja avaava --d → 0.

         Porrastus kääntyy mukana: kootessa laudat tulevat viimeisenä (suurin
         viive), avatessa ne lähtevät ensimmäisenä. Ilman kääntöä rakenne
         purkautuisi alhaalta ylös, mikä ei ole minkään purkamisen näköistä. */
      var Tv = J.t0 + J.vaihe + 1.0, i2, d2, A2, B2, kaanto = !!o.kaanteinen;
      var alkuT = kaanto ? "translateY(var(--d))" : "translateY(0)";
      var loppuT = kaanto ? "translateY(0)" : "translateY(var(--d))";
      function pv(t) { return Math.round(t / Tv * 1e6) / 1e4; }
      for (i2 = 0; i2 < viiveet.length; i2++) {
        d2 = viiveet[i2] / 1000;
        A2 = J.t0 + (kaanto ? (J.dmax - d2) : d2);
        B2 = A2 + o.matka;
        r.push("@keyframes " + juuri + "-v" + i2 + "{" +
          "0%," + pv(A2) + "%{transform:" + alkuT + ";animation-timing-function:" +
            ALAS + "}" +
          pv(B2) + "%,100%{transform:" + loppuT + "}}");
      }
      /* Katkoviivat kertovat kokoonpanon suunnasta, joten ne näkyvät
         räjäytetyssä asennossa ja katoavat kootussa — kummassa päässä
         aikajanaa se sitten onkin. */
      r.push("@keyframes " + juuri + "-hv{" +
        "0%," + pv(J.t0) + "%{opacity:" + (kaanto ? "0" : "1") +
          ";animation-timing-function:" + ALAS + "}" +
        pv(J.t0 + J.vaihe) + "%,100%{opacity:" + (kaanto ? "1" : "0") + "}}");

      r.push("@supports (animation-timeline:view()){" +
        (o.ulkoinenAikajana ? "" :
          "." + juuri + "-svg{view-timeline-name:--" + juuri +
          ";view-timeline-axis:block}") +
        "[class*=\"" + juuri + "-k\"],." + juuri + "-h{" +
          "animation-duration:auto;" +
          "animation-iteration-count:1;" +
          "animation-fill-mode:both;" +
          "animation-timeline:--" + juuri + ";" +
          /* Alue on lohkon kiinnijäämisen sisällä. Lohko on 250 svh korkea
             vieritysmatka, jonka sisällä sisältö on sticky ja täyttää ruudun:
             se kiinnittyy kun cover-eteneminen on ~29 % ja irtoaa ~71 %:ssa.
             Alue 34–68 % alkaa siis vasta kun lohko on asettunut ruutuun ja
             päättyy ennen kuin se lähtee — koko liike tapahtuu paikallaan
             pysyvässä kuvassa.

             Samalla liike hidastui: 250 svh:n matkasta 34 % on noin 1,3 ruudun
             verran vierittämistä, kun aiemmin koko animaatio mahtui 0,4
             ruutuun. Vieritysajetussa animaatiossa «hitaampi» on nimenomaan
             pidempi matka — kestoa ei ole, on vain matka.

             Kolme hylättyä: `8 … 62 %` oli ohi ennen kuin lohkosta näkyi
             puoltakaan, `30 … 88 %` valmistui vasta 400 px snap-kohdan jälkeen,
             ja `8 … 52 %` oli 95-prosenttisesti ohi jo snap-hetkellä. */
          "animation-range:cover 34% cover 68%}");
      for (i2 = 0; i2 < viiveet.length; i2++) {
        r.push("." + juuri + "-k" + i2 + "{animation-name:" + juuri + "-v" + i2 + "}");
      }
      r.push("." + juuri + "-h{animation-name:" + juuri + "-hv}}");
    }
    r.push("@media(prefers-reduced-motion:reduce){[class*=\"" + juuri +
      "-k\"],." + juuri + "-h{animation:none}}");
    return "<style>" + r.join("") + "</style>";
  }

  /* ---- Julkinen ------------------------------------------------------------
       leveys, pituus  terassin mitat millimetreinä
       jako            tukien suurin väli mm (laskurin R.spacingByBeam)
       perhe, koko     pilari, esim. "TP" ja 400
       palkki, lauta   palkkikuva.js:n kokotunnukset
       kenka           tarvikekuva.js:n osatunnus
       rajahdys        kerrosten väli mm. 0 = koottu rakenne
       selitteet       true = kerrosten nimet kuvan reunaan
       mitat           false = ei mittaviivoja
       leveysPx        kankaan leveys pikseleinä
       koriste, syyt, oksat, rakeisuus, id */
  function terassikuva(valinnat) {
    if (!window.tuotekuva || !window.tarvikekuva || !window.palkkikuva) return "";
    var o = {}, avain;
    for (avain in OLETUS) o[avain] = OLETUS[avain];
    for (avain in (valinnat || {})) o[avain] = valinnat[avain];

    var S = osat(o), A = S.A, G = S.G;
    var R = rajat(laatikot(o, S));
    var reuna = o.selitteet ? 30 : 22;
    /* Selitekaista on osuus kankaasta eikä kiinteä pikselimäärä: sama kuva
       piirretään sivulle 1000 px:n levyisenä ja vientiin 2000 px:n levyisenä,
       ja kiinteä kaista veisi ensimmäisestä kolmanneksen ja toisesta kuudesosan. */
    var selitetila = o.selitteet ? Math.round(o.leveysPx * 0.22) : 0;
    var K = (o.leveysPx - 2 * reuna - selitetila) / (R.x1 - R.x0);
    var CW = Math.round(o.leveysPx);
    var CH = Math.round((R.y1 - R.y0) * K + 2 * reuna);
    var ox = reuna + selitetila - R.x0 * K, oy = reuna - R.y0 * K;
    var viiva = Math.max(0.6, Math.min(1.8, CW / 1400));
    var fontti = Math.max(10.5, CW / 88) * (o.fonttikerroin || 1);

    var selitePohja = 0;
    var juuri = "te-" + String(o.id || "terassi").toLowerCase().replace(/[^a-z0-9-]/g, "");
    var hT = juuri + "-t", hV = juuri + "-v", hP = juuri + "-p", hM = juuri + "-m";
    var out = [];
    var C = piirtaja(out, K, ox, oy, hM, viiva);

    function paikka(x, y, z) {
      return {ox: ox + (x - y) * CX * K, oy: oy + (x + y) * CY * K - z * K};
    }

    /* Kääri juuri piirretyt palat laskeutuvaksi kerrokseksi. `nosto` on
       maailman millimetrejä ja `viive` sekunteja. Ilman animaatiota tämä ei tee
       mitään, jolloin sama koodi tuottaa staattisen kuvan — kerroksia ei siis
       ole kahta versiota.

       Viive ei ole `animation-delay` vaan luokka, koska nousun on oltava laskun
       käänteinen: viive siirtäisi koko aikajanaa, jolloin ensin laskeutunut myös
       nousisi ensin. Ks. tyylit(). */
    var viiveet = [];
    function viiveLuokka(viive) {
      var avain = Math.round(viive * 1000), i;
      for (i = 0; i < viiveet.length; i++) if (viiveet[i] === avain) return i;
      viiveet.push(avain);
      return viiveet.length - 1;
    }
    function kerros(nosto, viive, piirto) {
      if (!o.animaatio || !o.rajahdys) { piirto(); return; }
      var alku = out.length;
      piirto();
      var palat = out.splice(alku).join("");
      out.push('<g class="' + juuri + "-k" + viiveLuokka(viive) +
        '" style="--d:' + N(nosto * K) + 'px">' + palat + "</g>");
    }

    /* ---- 1 · maa ----
       Kerrokset alhaalta ylös. Ylin kerros piirtyy viimeisenä ja peittää
       alempien yläpinnat, joten kerrosraja näkyy vain kyljessä — niin kuin
       kaivannossa. */
    var z = 0;
    for (var m = MAA.length - 1; m >= 0; m--) z -= MAA[m].paksuus;
    MAA.forEach(function (kerros) {
      C.laatikko(S.maa, z, z + kerros.paksuus, kerros.vari, o.rakeisuus !== false);
      z += kerros.paksuus;
    });

    /* Terassin varjo maassa. Räjäytetyssä kuvassa se on ainoa asia, joka
       kertoo kuinka iso terassi pilarien päälle on tulossa. */
    if (o.rajahdys) {
      out.push('<g filter="url(#' + hM + '-sumu)" opacity=".13">');
      C.poly([C.P(-o.ylitys, -o.ylitys, 4), C.P(o.leveys + o.ylitys, -o.ylitys, 4),
              C.P(o.leveys + o.ylitys, o.pituus + o.ylitys, 4),
              C.P(-o.ylitys, o.pituus + o.ylitys, 4)], V.muste);
      out.push("</g>");
    }

    /* ---- 2 · mittaviivat maan pinnalla ----
       Ennen pilareita, jotta pilari peittää viivan eikä toisin päin: viiva on
       maassa ja pilari sen päällä. */
    if (o.mitat !== false) {
      /* ulos-vektori osoittaa poispäin ruudukosta: luku menee maapedin reunan
         yli eikä pilarien päälle. Ensimmäisessä versiossa se osoitti sisään,
         ja «3,0 m» jäi etummaisen pilarin taakse. */
      mitta(C, [0, S.maa.y1 - 240, 6], [o.leveys, S.maa.y1 - 240, 6],
            [0, 1, 0], metri(o.leveys), K, fontti);
      mitta(C, [S.maa.x1 - 240, o.pituus, 6], [S.maa.x1 - 240, 0, 6],
            [1, 0, 0], metri(o.pituus), K, fontti);
    }

    /* ---- 3 · pilarit ----
       Takaa eteen. Jokainen on tuotekuva.js:n oma piirto, eli sama kappale
       kuin tuotekuvastossa — ei yksinkertaistettu versio siitä. */
    S.solmut.forEach(function (p) {
      var q = paikka(p[0], p[1], 0);
      window.tuotekuva.piirra(out, {
        perhe: o.perhe, koko: o.koko, K: K, ox: q.ox, oy: q.oy, hid: hT,
        viiva: viiva, merkinta: false, rakeisuus: o.rakeisuus !== false,
        varjo: o.varjot !== false
      });
    });

    /* ---- 4 · kokoonpanon suunnat ----
       Katkoviiva pilarin päästä ylimmän kerroksen alapintaan. Sama merkintä
       kuin yhdistelmakuva.js:ssä: se on merkintä eikä kappale, mutta se
       piirretään ennen yläkerroksia, jotta kappaleet katkaisevat sen. */
    if (o.rajahdys) {
      if (o.animaatio) out.push('<g class="' + juuri + '-h" style="--o:1">');
      S.solmut.forEach(function (p) {
        var a = paikka(p[0], p[1], A.PM.H1), b = paikka(p[0], p[1], A.lautaZ);
        C.viiva([a.ox, a.oy], [b.ox, b.oy], V.merkki, viiva * 1.1,
                N(viiva * 4) + " " + N(viiva * 4), 0.55);
      });
      if (o.animaatio) out.push("</g>");
    }

    /* ---- 5 · palkit ----
       Kauimmainen ensin: pienin x on kauimpana kamerasta. */
    S.palkit.forEach(function (p, i) {
      kerros(A.nostoKenka, i * o.porras, function () {
      window.palkkikuva.piirra(out, {
        koko: o.palkki, akselit: "yxz",
        siirto: [p.x, o.pituus / 2, A.palkkiZ], pituus: p.pituus,
        siemen: i * 31, K: K, ox: ox, oy: oy, hid: hP, cid: "-p" + i,
        viiva: viiva, varjo: false,
        syyt: o.syyt !== false, oksat: o.oksat !== false,
        rakeisuus: o.rakeisuus !== false, merkinta: false
      });
      });
    });

    /* ---- 6 · pilarikengät ----
       Palkkien jälkeen, koska kengän etulevy on palkin edessä: uran levyt ovat
       x-välillä ±35…40 ja palkki ±24, joten lähempi levy kuuluu päälle. Takalevy
       piirtyy samalla palkin päälle, mutta se on 5 mm eli yksi kuvapiste — ja se
       piste lukee kengän kaulukseksi palkin ympäri, ei virheeksi. Erillinen
       piirtojärjestys levyä kohden ei ole tämän arvoinen. */
    S.solmut.forEach(function (p, i) {
      kerros(A.nostoKenka, (i % S.G.sarakkeet) * o.porras, function () {
        var q = paikka(p[0], p[1], A.kenkaZ);
        window.tarvikekuva.piirra(out, {
          osa: o.kenka, K: K, ox: q.ox, oy: q.oy, hid: hV, viiva: viiva
        });
      });
    });

    /* ---- 7 · laudat ----
       Pienin y kauimpana. Jokaisella oma siemen, muuten koko terassi on sama
       lauta kaksikymmentä kertaa — ja sen huomaa heti. */
    S.laudat.forEach(function (p, i) {
      /* Laudat lähtevät liikkeelle vasta kun palkit ovat paikallaan, ja
         porrastuvat takaa eteen — siitä syntyy se aaltoliike, joka kertoo
         että ne asennetaan yksi kerrallaan eikä levynä. */
      kerros(A.nostoLauta, 0.55 + i * o.porras, function () {
      window.palkkikuva.piirra(out, {
        koko: o.lauta, akselit: "xzy",
        siirto: [o.leveys / 2, p.y, A.lautaZ + A.LA.b / 2],
        pituus: S.lautaPituus,
        siemen: i * 17 + 3, K: K, ox: ox, oy: oy, hid: hP, cid: "-l" + i,
        viiva: viiva, varjo: false,
        syyt: o.syyt !== false, oksat: o.oksat !== false,
        rakeisuus: o.rakeisuus !== false, merkinta: false
      });
      });
    });

    /* ---- 8 · selitteet ----
       Vasempaan reunaan, koska siellä on tyhjää: projektiossa vasen laita on
       y:n suurin arvo, ja terassi kapenee sinne päin. Teksti on pystyssä eikä
       kuvatasossa — vino teksti on luettavaa mittapiirustuksessa, muttei
       kerrosselitteessä, jossa lukija ei tiedä mistä aloittaa. */
    if (o.selitteet) {
      /* Rivi = mihin osoitetaan (ankkuri maailman millimetreinä), mitä lukee, ja
         **mihin kerrokseen se kuuluu**. Viimeinen on se, joka ensimmäisestä
         versiosta puuttui: selite piirrettiin paikalleen ja jäi leijumaan, kun
         kerros laskeutui sen alta pois. Nyt selite on kerroksen sisällä ja
         liikkuu sen mukana — johtoviiva osoittaa samaan kohtaan koko ajan. */
      /* Maakerrosten ankkurit levitetään maapedin etusärmää (+y-pinta) pitkin
         eikä pinota samaan nurkkaan. Syy on mittasuhteissa: kerrokset ovat 60,
         90 ja 400 mm, eli ruudulla muutaman pikselin päässä toisistaan, kun
         näkymä on 4000 mm leveä. Samaan nurkkaan osoitettuna kolme johtoviivaa
         päätyy yhteen pisteeseen eikä lukija tiedä kumpi osoittaa mihin, vaikka
         tekstirivit onkin eroteltu. Särmää pitkin siirretty ankkuri pysyy oman
         kerroksensa pinnalla — se on sama kerros, eri kohta samaa särmää. */
      function maaAnkkuri(k) {
        /* Ylin kerros ei ala aivan nurkasta: siellä sen 60 mm:n kaistale on
           kahden särmän välissä ja osoitin lukisi yhtä hyvin yläpinnaksi. */
        return S.maa.x0 + (S.maa.x1 - S.maa.x0) * (0.05 + 0.16 * k);
      }
      var maaZ = [-MAA[2].paksuus / 2,
                  -MAA[2].paksuus - MAA[1].paksuus / 2,
                  -MAA[2].paksuus - MAA[1].paksuus - MAA[0].paksuus / 2];
      var rivit = [
        {p: [-o.ylitys, o.pituus + o.ylitys, A.lautaZ + A.LA.b],
         nosto: A.nostoLauta, viive: 0.55,
         t: "Terassilauta " + A.LA.nimi, alt: S.laudat.length + " kpl"},
        {p: [0, o.pituus + o.ylitys, A.palkkiZ + A.PK.h],
         nosto: A.nostoKenka, viive: 0,
         t: "Palkki " + A.PK.nimi,
         alt: S.palkit.length + " kpl · tuenta " + Math.round(G.valiY) + " mm"},
        {p: [-A.TK.lev / 2, o.pituus, A.kenkaZ + A.TK.kork * 0.6],
         nosto: A.nostoKenka, viive: 0,
         t: A.TK.koodi, alt: G.n + " kpl · palkki urassa"},
        {p: [0, o.pituus + A.PM.D1 / 2, A.PM.H1 * 0.55], nosto: 0, viive: 0,
         t: window.tuotekuva.koodi(o.perhe, o.koko),
         alt: G.n + " kpl · " + G.sarakkeet + " × " + G.rivit},
        {p: [maaAnkkuri(0), S.maa.y1, maaZ[0]], nosto: 0, viive: 0, t: MAA[2].nimi,
         alt: MAA[2].paksuus + " mm"},
        {p: [maaAnkkuri(1), S.maa.y1, maaZ[1]], nosto: 0, viive: 0, t: MAA[1].nimi,
         alt: MAA[1].paksuus + " mm"},
        {p: [maaAnkkuri(2), S.maa.y1, maaZ[2]], nosto: 0, viive: 0, t: MAA[0].nimi,
         alt: MAA[0].paksuus + " mm"}
      ];

      /* ---- Rivien asettelu lasketaan KOOTUSTA asennosta ----
         Maakerrokset ovat 60, 90 ja 400 mm paksuja, eli kaksi ylintä osuvat
         ruudulla lähes samaan kohtaan; samoin palkki ja kenkä, jotka nousevat
         samassa vaiheessa. Rivi työnnetään siis alaspäin kunnes väli riittää.

         Törmäyksenesto ajetaan **kootussa** asennossa eikä räjäytetyssä, ja se
         on ainoa järjestys joka toimii molemmissa: laskeutuminen siirtää ylempiä
         rivejä alaspäin kohti alempia, joten kootun asennon välit ovat aina
         tiukemmat. Kun ne riittävät, räjäytetyn asennon välit riittävät myös —
         ne ovat nostojen erotuksen verran suuremmat. Toisin päin laskettuna
         selitteet menisivät päällekkäin juuri siinä asennossa, jossa kuva
         pysähtyy. */
      var rivivali = fontti * (o.selitevali || 2.3);
      var edellinen = null;
      rivit.forEach(function (rivi) {
        var a = paikka(rivi.p[0], rivi.p[1], rivi.p[2]);
        rivi.ax = a.ox;
        rivi.ay = a.oy;                          /* räjäytetty ankkuri */
        var koottu = a.oy + rivi.nosto * K;      /* sama ankkuri koottuna */
        var ty = edellinen == null ? koottu : Math.max(koottu, edellinen + rivivali);
        edellinen = ty;
        rivi.ty = ty - rivi.nosto * K;           /* piirretään räjäytettyyn */
      });

      var xR = reuna + selitetila - 40;
      rivit.forEach(function (rivi) {
        /* Kankaan korkeus on laskettu kappaleiden laatikoista, eivätkä
           selitteet ole kappaleita: väljällä rivivälillä alin rivi valuu
           kankaan alapuolelle ja sen mm-luku katoaa. Siksi alin käytetty
           kohta kirjataan ja kangas venytetään lopuksi. */
        selitePohja = Math.max(selitePohja,
          rivi.ty + rivi.nosto * K + fontti * 2.2);
        kerros(rivi.nosto, rivi.viive, function () {
          /* Kolmiosainen johtoviiva: vaakapätkä tekstistä, kaarto ankkurin
             korkeudelle, vaakapätkä ankkuriin. */
          var taite = xR + (rivi.ax - xR) * 0.42;
          out.push('<polyline points="' + N(xR + 10) + "," + N(rivi.ty) + " " +
            N(taite) + "," + N(rivi.ty) + " " + N(taite + 22) + "," + N(rivi.ay) +
            " " + N(rivi.ax) + "," + N(rivi.ay) +
            '" fill="none" stroke="' + V.merkki + '" stroke-width="' + N(viiva * 0.9) +
            '" stroke-linejoin="round" opacity=".45"/>');
          out.push('<circle cx="' + N(rivi.ax) + '" cy="' + N(rivi.ay) + '" r="' +
            N(viiva * 1.8) + '" fill="' + V.merkki + '" opacity=".6"/>');
          C.teksti([xR, rivi.ty + fontti * 0.34], rivi.t, fontti, V.teksti, "end", 600);
          C.teksti([xR, rivi.ty + fontti * 1.42], rivi.alt, fontti * 0.8,
                   V.merkki, "end", 400);
        });
      });
    }

    var nimike = o.nimike || ("Terassi " + metri(o.leveys) + " × " + metri(o.pituus) +
      (o.rajahdys ? ", räjäytyskuva" : ", koottu rakenne") + ": " + G.n + " " +
      window.tuotekuva.koodi(o.perhe, o.koko) + "-pilaria, " + A.TK.koodi +
      ", palkki " + A.PK.nimi + " ja terassilauta " + A.LA.nimi);
    var a11y = o.koriste ? ' aria-hidden="true" focusable="false"'
                         : ' role="img" aria-label="' + esc(nimike) + '"';
    var svgLuokka = (o.animaatio && o.rajahdys && o.vieritys && !o.ulkoinenAikajana)
      ? ' class="' + juuri + '-svg"' : "";
    /* Kangas venytetään selitteiden alle, jos ne ulottuvat kappaleita alemmas. */
    CH = Math.max(CH, Math.ceil(selitePohja + reuna));

    /* ---- Vastaliike: sommittelu pysyy keskellä molemmissa päissä ----
       Kangas on mitoitettu räjäytettyyn asentoon, joten kootussa asennossa
       sisältö painuu sen alalaitaan ja yläpuolelle jää puolet kankaasta tyhjää.
       Mitä isompi räjäytys, sitä pahempi — ja korkeutta tarvitaan juuri siihen,
       että räjäytys mahtuu.

       Korjaus on yksi kääntäen liikkuva kääre koko sisällön ympärille. Se
       siirtää kaiken — myös maan — ylös puolella laudan matkasta silloin kun
       rakenne on koottu, ja nollaan kun se on auki. Siirto on yhteinen, joten
       se ei muuta minkään kappaleen suhdetta toiseen: pysähdyskuva on yhä
       geometrisesti sama kuin `rajahdys:0`, vain eri kohdassa kangasta.

       Viive on porrastuksen keskikohta, jolloin kääre liikkuu sisällön mukana
       eikä sen edellä tai perässä. */
    if (o.animaatio && o.rajahdys) {
      var siirtyma = -A.nostoLauta * K / 2;
      var keskiViive = viiveet.length
        ? Math.max.apply(null, viiveet) / 2000 : 0;
      out = ['<g class="' + juuri + "-k" + viiveLuokka(keskiViive) +
        '" style="--d:' + N(siirtyma) + 'px">' + out.join("") + "</g>"];
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + CW + " " + CH +
      '" width="' + CW + '" height="' + CH + '"' + svgLuokka + a11y + ">" +
      (o.koriste ? "" : "<title>" + esc(nimike) + "</title>") +
      (o.animaatio && o.rajahdys ? tyylit(juuri, o, viiveet) : "") +
      window.tuotekuva.defs(hT, CH, o.rakeisuus !== false) +
      window.tarvikekuva.defs(hV, CH) +
      window.palkkikuva.defs(hP, CH, o.rakeisuus !== false) +
      window.tuotekuva.defs(hM, CH, o.rakeisuus !== false) +
      out.join("") + "</svg>";
  }

  /* Mittaviiva maan pinnassa: jana, päätypoikit ja luku. Luku on pystyssä eikä
     kuvatasossa, koska se luetaan kuvan vierestä eikä maasta. */
  function mitta(C, a, b, ulos, teksti, K, fontti) {
    var t = 110;                                   /* poikin puolikas, mm */
    var A = C.P(a[0], a[1], a[2]), B = C.P(b[0], b[1], b[2]);
    C.viiva(A, B, V.aksentti, Math.max(1.2, K * 9), null, 1);
    [a, b].forEach(function (p) {
      var p0 = C.P(p[0] + ulos[0] * t, p[1] + ulos[1] * t, p[2]);
      var p1 = C.P(p[0] - ulos[0] * t, p[1] - ulos[1] * t, p[2]);
      C.viiva(p0, p1, V.aksentti, Math.max(1.2, K * 9), null, 1);
    });
    var k = C.P((a[0] + b[0]) / 2 + ulos[0] * 260,
                (a[1] + b[1]) / 2 + ulos[1] * 260, a[2]);
    C.teksti([k[0], k[1] + fontti * 0.36], teksti, fontti, V.aksentti, "middle", 600);
  }

  /* ---- Konfiguraattorilohkon kuva ------------------------------------------
     Sama `.cfg`-lohko on kuudella sivulla, joten asetukset ovat tässä eivätkä
     kuudessa paikassa. Kolme valintaa, jotka eivät ole makuasioita:

       terassi 3 × 2,4 m   laskurin sääntö antaa 3 × 3 = 9 pilaria. Isompi
                           terassi ei mahdu 550 px:n palstaan luettavana, ja
                           lohko puhuu määrästä eikä koosta
       ei koristeita       syykuvio, oksat ja rakeisuus eivät erotu tässä
                           koossa mutta kolminkertaistavat merkkauksen
                           (1017 kB → 299 kB mitattuna). Muoto kantaa yksin
       ei mittaviivoja     «3,0 m» piirtyisi seitsemän pikselin korkuisena

     Kuva on inline-SVG eikä `<img>`, ja se on vierityksen ehto: aikajana ei
     ylety toisen dokumentin sisään, joten erillisenä tiedostona sitä ei voi
     ajaa sivun vierityksellä. Hinta on ~230 kB merkkausta per sivu. */
  terassikuva.cfg = function (nimike) {
    return terassikuva({
      leveys: 3000, pituus: 2400, rajahdys: 700, leveysPx: 1500,
      animaatio: true, vieritys: true, kaanteinen: true,
      /* Aikajana on lohkolla (.cfg), ei kuvalla: kuva on sticky ja pysyy
         paikallaan juuri sen ajan, jonka animaation pitäisi kestää.
         Nimi --te-cfg johdetaan id:stä «cfg» ja se on bce-v4.css:ssä. */
      ulkoinenAikajana: true,
      selitteet: true, selitevali: 2.6, fonttikerroin: 1.35,
      mitat: false, syyt: false, oksat: false, rakeisuus: false,
      nimike: nimike, id: "cfg"
    });
  };

  terassikuva.ruudukko = function (o) {
    o = o || {};
    return ruudukko(o.leveys || OLETUS.leveys, o.pituus || OLETUS.pituus,
                    o.jako || OLETUS.jako);
  };
  terassikuva.oletus = function () {
    var k = {}, a;
    for (a in OLETUS) k[a] = OLETUS[a];
    return k;
  };
  window.terassikuva = terassikuva;
})();
