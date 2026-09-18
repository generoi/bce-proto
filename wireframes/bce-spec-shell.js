/* Kuori spec 1.0:n mukaan. Ilmoituspalkki, navigaatio + haku + kieli, footer.
   SPECSHELL(E) renderöi kuoren ilman murupolkua (etusivu).
   SPECSHELL(E,{crumb:[[teksti,href],...],active:"Pilarit"}) lisää murupolun ja
   merkitsee aktiivisen valikkokohdan. Alasivut käyttävät jälkimmäistä muotoa. */
window.SPEC={
  logo:"BCE-logo",
  home:"bce_etusivu_spec.html",
  menu:"Valikko",
  crumbLabel:"Murupolku",
  /* Navigaatio sivukartan luvun 0.1 mukaan.

     17.9.2026: Tuotteet palasi valikkotasoksi, mutta ei URLina. 15.9. poistettiin
     /tuotteet/-sivu, ja samalla katosi vahingossa myös ryhmä — ne ovat eri asia.
     Uusi kategoriasivu olisi asettunut sivuston vahvimman sivun päälle
     (/bce-pilarit/, 153 513 näyttöä, CTR 6,1 %, sijainti 4,5), mutta valikkoryhmä
     ei kilpaile yhdestäkään hausta. Tuoteperheitä on kolme — pilarit 9 306
     klikkiä, tarvikkeet 1 364, JeKi-sokkeli 269 — ja rinnakkain päävalikossa ne
     olisivat kolme irrallista kohtaa, jolloin valikkoon tulisi seitsemän kohtaa.

     Rivi on [nimike, osoite, lapset]. Osoite null tarkoittaa, ettei sivua ole:
     "Tuotteet" ja "Sokkelit" ovat ryhmiä, ja ne renderöityvät painikkeeksi ja
     ryhmäotsikoksi. Tämä on ainoa poikkeus sääntöön "vanhempi on itsekin linkki",
     ja poikkeus on olemassa nimenomaan siksi, ettei sivua tehdä vain siksi että
     valikko kaipaa linkkiä.

     Tuotteet-pudotuksessa lapsilla on omat lapsensa, jolloin se renderöityy
     kolmeksi ryhmäksi. Muut pudotukset ovat yhä yksi sarake. Kuvia, promolohkoja
     tai neljättä saraketta ei tule: kolme saraketta tekstilinkkejä on valikko,
     ei laskeutumissivu. Mobiilissa (80,9 % istunnoista) koko rakenne on sisennetty
     lista heti auki, joten sarakkeet koskevat vain työpöytää.

     Tarvikkeiden neljä kohtaa ovat ankkureita samalle sivulle (#pilarikengat …),
     koska tarvikkeet ovat yhdellä sivulla eivätkä omilla URLeillaan (15.9.2026).
     Nimet ovat tarvikesivun ryhmäotsikot, eivät kahdeksan nimikkeen lista.

     Sokkeleilla ei ole koontisivua eikä /sokkelit/-polkua: JeKi on ainoa tuote,
     ja sen osoite /jeki-sokkeli/ pysyy ennallaan. Kysyntä on brändättyä ja
     tarkkaa — "jeki sokkeli" CTR 57,1 %, pelkkä "sokkeli" 0,1 % (1 347 näyttöä,
     2 klikkiä) — joten uudelleenohjaus maksaisi enemmän kuin hubi toisi. */
  nav:[["Tuotteet",null,[
          ["Pilarit","/bce-pilarit/",[
            ["KP-pilari","/bce-pilarit/kp-pilari/"],
            ["TP-pilari","/bce-pilarit/tp-pilari/"],
            ["PP-pilari","/bce-pilarit/pp-pilari/"],
            ["AP-pilari","/bce-pilarit/ap-pilari/"]]],
          ["Tarvikkeet","/pilarien-kiinnitystarvikkeet/",[
            ["Pilarikengät","/pilarien-kiinnitystarvikkeet/#pilarikengat"],
            ["Palkkikengät","/pilarien-kiinnitystarvikkeet/#palkkikengat"],
            ["Teräslaatat","/pilarien-kiinnitystarvikkeet/#teraslaatat"],
            ["Nostokorva","/pilarien-kiinnitystarvikkeet/#nostokorva"]]],
          ["Sokkelit",null,[
            ["JeKi-sokkeli","/jeki-sokkeli/"]]]]],
       ["Perustuksen teko","/pilariperustus/",[
          ["Terassi","/kayttokohde/terassin-pilariperustus/"],
          ["Autokatos","/kayttokohde/autokatoksen-pilariperustukset/"],
          ["Sauna","/kayttokohde/saunan-pilariperustus/"],
          ["Mökki","/kayttokohde/mokkien-pilariperustukset/"],
          ["Piharakennus","/kayttokohde/piharakennuksen-pilariperustus/"],
          ["Parakki","/kayttokohde/parakkien-pilariperustukset/"]]],
       ["Ohjeet","/ohjeet/",[
          ["Asennus","/ohjeet/asennus/"],
          ["Mitoitus","/ohjeet/mitoitus/"],
          ["Usein kysytyt","/ohjeet/usein-kysytyt/"],
          ["Suunnittelijalle","/ohjeet/suunnittelijalle/"],
          ["Oppaat","/ohjeet/oppaat/"]]],
       ["Referenssit","/referenssit/"],
       ["Mistä ostat","/mista-ostat/"]],
  /* Jälleenmyyjät, yksi lähde (17.9.2026). Sama neljä ketjua samassa järjestyksessä
     joka sivulla, tasapuolisesti. url on BCE:n brändisivu ketjun verkkokaupassa, tp on
     TP-kokojen omat tuotesivut siellä missä ne ovat: perhesivun ostolaatikko linkittää
     valittuun kokoon. Kaikki osoitteet tarkistettu 17.9.2026 (HTTP 200). Soraterminaalin
     verkkokauppa on grusterminalen.fi eikä siellä ole BCE-sivua, joten linkki vie
     Perustuspilarit-kategoriaan, jossa TP- ja KP-koot ovat omina tuotteinaan. Hartmanin TP-400-
     ja Starkin TP-500-tuotesivua ei löytynyt (404), ne putoavat brändisivulle. */
  dealers:[
    {n:"Hartman", url:"https://www.hartman.fi/fi/tuotemerkki/bce-perustus",
     tp:{"TP-200":"https://www.hartman.fi/fi/bce-perustuspilari-tp200-125-450-20kn-ix73",
         "TP-300":"https://www.hartman.fi/fi/bce-perustuspilari-tp300-125-450-20kn-co72",
         "TP-500":"https://www.hartman.fi/fi/bce-perustuspilari-tp500-125-450-20kn-cp04",
         "TP-600":"https://www.hartman.fi/fi/bce-perustuspilari-tp600-125-450-20kn-cp06"}},
    {n:"K-Rauta", url:"https://www.k-rauta.fi/tuotemerkit/bce",
     tp:{"TP-200":"https://www.k-rauta.fi/tuote/perustuspilari-bce-tp-200-125450-43kg/6438313674849",
         "TP-300":"https://www.k-rauta.fi/tuote/perustuspilari-bce-tp-300-125450-49kg/6438313536819",
         "TP-400":"https://www.k-rauta.fi/tuote/perustuspilari-bce-tp-400-125450-55kg/6438313536154",
         "TP-500":"https://www.k-rauta.fi/tuote/perustuspilari-bce-tp-500-125450-61kg/6438313536161",
         "TP-600":"https://www.k-rauta.fi/tuote/perustuspilari-bce-tp-600-125450-67kg/6438313536802"}},
    {n:"Soraterminaali", url:"https://grusterminalen.fi/fi/tuotteet/perustuspilarit",
     tp:{"TP-200":"https://grusterminalen.fi/fi/tuotteet/perustuspilarit/terassipilari-tp-200",
         "TP-300":"https://grusterminalen.fi/fi/tuotteet/perustuspilarit/perustuspilari-tp-300",
         "TP-400":"https://grusterminalen.fi/fi/tuotteet/perustuspilarit/perustuspilari-tp-400",
         "TP-500":"https://grusterminalen.fi/fi/tuotteet/perustuspilarit/terassipilari-tp-500",
         "TP-600":"https://grusterminalen.fi/fi/tuotteet/perustuspilarit/perustuspilari-tp-600"}},
    {n:"Stark", url:"https://www.stark-suomi.fi/br%C3%A4ndit/bce",
     tp:{"TP-200":"https://www.stark-suomi.fi/tuote/perustuspilari-bce-tp-200-125-450-43kg-oc30",
         "TP-300":"https://www.stark-suomi.fi/tuote/perustuspilari-bce-tp-300-125-450-49kg-92ap",
         "TP-400":"https://www.stark-suomi.fi/tuote/perustuspilari-bce-tp-400-125-450-55kg-92as",
         "TP-600":"https://www.stark-suomi.fi/tuote/perustuspilari-bce-tp-600-125-450-67kg-92dp"}}],
  dealerLogo:"Logo", dealerGo:"Osta verkkokaupasta", dealerNew:"avautuu uuteen välilehteen",
  util:["Yhteystiedot","/yhteystiedot/"],
  /* 16.9.2026: konfiguraattorilla on yksi nimi joka paikassa (hero-oppi 3). Spec 1.0:n
     "Löydä sopiva pilari" vaihdettiin lopputuloksen nimeävään muotoon, sama kuin sivuilla.
     Poikkeama specistä, kerrotaan asiakkaalle. Mobiilissa kuoren painike piilotetaan
     (.hdr-cta), koska sivun oma toiminto on alapalkissa. */
  navCta:["Laske pilarien määrä","/konfiguraattori/","cta_konfiguraattori"],
  /* Mobiilin kiinteä alapalkki, sama joka sivulla jolla on ensisijainen toiminto:
     ensisijainen toiminto ja ostopaikka. SPECSHELL(E,{bar:false}) jättää pois,
     {bar:"ostat"} kääntää järjestyksen sivulla jonka ensisijainen on ostopaikka. */
  bar:[["Laske pilarien määrä","/konfiguraattori/","cta_konfiguraattori"],
       ["Mistä ostat","/mista-ostat/","cta_mista_ostat"]],
  search:"Hae tuotteella, koodilla tai käyttökohteella",
  langs:[["FI",true],["SV",false],["EN",false]],
  foot:{
    addr:"BCE-Perustus, Långmossantie 6, 68530 Lepplax",
    contact:"[TÄYTETTÄVÄ]",   /* ei löydy nykysivustolta ilman erillistä sivua */
    cols:[
      ["Sivusto",[["Perustuksen teko","/pilariperustus/"],["Ohjeet","/ohjeet/"],
        ["Referenssit","/referenssit/"],["Mistä ostat","/mista-ostat/"],
        ["Yhteystiedot","/yhteystiedot/"],["Tietosuojaseloste","/tietosuojaseloste/"]]],
      ["Tuotteet",[["Pilarit","/bce-pilarit/"],["Tarvikkeet","/pilarien-kiinnitystarvikkeet/"],
        ["JeKi-sokkeli","/jeki-sokkeli/"],["Konfiguraattori","/konfiguraattori/"],
        ["Usein kysytyt","/ohjeet/usein-kysytyt/"]]],
      ["Käyttökohteet",[["Terassi","/kayttokohde/terassin-pilariperustus/"],
        ["Autokatos","/kayttokohde/autokatoksen-pilariperustukset/"],
        ["Sauna","/kayttokohde/saunan-pilariperustus/"],
        ["Mökki","/kayttokohde/mokkien-pilariperustukset/"],
        ["Piharakennus","/kayttokohde/piharakennuksen-pilariperustus/"],
        ["Parakki","/kayttokohde/parakkien-pilariperustukset/"]]]],
    certs:["CE-merkitty","AAA-luottoluokitus","[TÄYTETTÄVÄ]"],
    social:["Facebook","YouTube","Instagram"],
    end:"© 2026 BCE-Perustus"}
};
/* Tuotanto-URL → prototyyppitiedosto. Sivut kirjoittavat oikeat osoitteet, ja
   tämä taulu tekee prototyypistä kävelykelpoisen. Kun sivusta syntyy oma
   prototyyppi, riville vaihdetaan sen tiedostonimi — muuta ei tarvita. */
window.SPEC.map={
  "/":"bce_etusivu_spec.html",
  "/konfiguraattori/":"bce_sivu_spec.html?s=konfiguraattori",
  "/bce-pilarit/":"bce_pilarit_spec.html",
  "/bce-pilarit/kp-pilari/":"bce_sivu_spec.html?s=kp",
  "/bce-pilarit/tp-pilari/":"bce_tp_spec.html",
  "/bce-pilarit/pp-pilari/":"bce_sivu_spec.html?s=pp",
  "/bce-pilarit/ap-pilari/":"bce_sivu_spec.html?s=ap",
  "/pilarien-kiinnitystarvikkeet/":"bce_tarvikkeet_spec.html",
  "/jeki-sokkeli/":"bce_jeki_spec.html",
  "/pilariperustus/":"bce_sivu_spec.html?s=perustus",
  /* Osoite on ehdotus: sivukartan luku 0.1 tuntee /pilariperustus/-sivun mutta ei
     tätä lasta. Vahvistettava asiakkaalta ennen kuin sivu linkitetään valikosta. */
  "/pilariperustus/perustustavat/":"bce_perustustavat_spec.html",
  "/kayttokohde/terassin-pilariperustus/":"bce_sivu_spec.html?s=k-terassi",
  "/kayttokohde/autokatoksen-pilariperustukset/":"bce_autokatos_spec.html",
  "/kayttokohde/saunan-pilariperustus/":"bce_sivu_spec.html?s=k-sauna",
  "/kayttokohde/mokkien-pilariperustukset/":"bce_sivu_spec.html?s=k-mokki",
  "/kayttokohde/piharakennuksen-pilariperustus/":"bce_sivu_spec.html?s=k-piharakennus",
  "/kayttokohde/parakkien-pilariperustukset/":"bce_sivu_spec.html?s=k-parakki",
  "/ohjeet/":"bce_sivu_spec.html?s=ohjeet",
  "/ohjeet/asennus/":"bce_sivu_spec.html?s=asennus",
  "/ohjeet/mitoitus/":"bce_sivu_spec.html?s=mitoitus",
  "/ohjeet/usein-kysytyt/":"bce_sivu_spec.html?s=ukk",
  "/ohjeet/suunnittelijalle/":"bce_sivu_spec.html?s=suunnittelijalle",
  "/ohjeet/oppaat/":"bce_sivu_spec.html?s=oppaat",
  "/referenssit/":"bce_sivu_spec.html?s=referenssit",
  /* Referenssin detalji-URL on yksikössä (/referenssi/{slug}) ja se PYSYY: sivu tekee
     429 klikkiä sijainnilla 3,6, ja sivukartan ehdotus /referenssit/{kohde}/ olisi
     viisi uudelleenohjausta ilman hyötyä. Päätös ../post-tyypit-ja-sisaltomalli.md
     luku 3. Yksi ilmentymä on prototyyppinä, muut päätyvät listaussivulle. */
  "/referenssi/alan-pitkalla-kokemuksella-oli-helppo-tehda-perustusvalinta-saaristomokkiin/":"bce_referenssi_spec.html",
  "/mista-ostat/":"bce_mista-ostat_spec.html",
  "/yhteystiedot/":"bce_sivu_spec.html?s=yhteystiedot",
  "/yhteystiedot/tarjouspyynto/":"bce_sivu_spec.html?s=tarjous",
  "/tietosuojaseloste/":"bce_sivu_spec.html?s=tietosuoja"
};
/* Referenssien detaljisivut päätyvät toistaiseksi listaussivulle. Ankkuri
   irrotetaan ennen hakua ja liitetään takaisin, koska tarvikkeiden valikkokohdat
   ovat ankkureita samalle sivulle (/pilarien-kiinnitystarvikkeet/#pilarikengat). */
window.SPECLINK=function(u){
  if(!u) return u;
  const i=u.indexOf("#"), path=i<0?u:u.slice(0,i), hash=i<0?"":u.slice(i);
  if(SPEC.map[path]) return SPEC.map[path]+hash;
  if(path.indexOf("/referenssit/")===0) return SPEC.map["/referenssit/"]+hash;
  if(path.indexOf("/referenssi/")===0) return SPEC.map["/referenssit/"]+hash;
  return u;
};

/* Jälleenmyyjälohko, sama joka paikassa: logo, toiminnon nimi ja ulos-merkki.
   Linkki on aito ja vie ketjun verkkokauppaan uuteen välilehteen. o.size ("TP-400")
   valitsee koon tuotesivun, jos ketjulla on sellainen; muuten brändisivu.
   o.cls lisää luokan (dealers-4), o.sijainti täyttää data-sijainti-parametrin. */
window.SPECDEALERS=function(E,o){
  o=o||{};
  return '<div class="dealers'+(o.cls?" "+o.cls:"")+'">'+SPEC.dealers.map(function(d){
    const u=(o.size&&d.tp&&d.tp[o.size])||d.url;
    return '<a href="'+E(u)+'" target="_blank" rel="noopener" data-event="klikkaus_jalleenmyyja" data-dealer="'+E(d.n)+'"'+
      (o.sijainti?' data-sijainti="'+E(o.sijainti)+'"':"")+(o.size&&d.tp&&d.tp[o.size]?' data-koko="'+E(o.size)+'"':"")+'>'+
      '<span class="dlogo">'+E(SPEC.dealerLogo)+": "+E(d.n)+"</span>"+
      '<span class="dgo">'+E(SPEC.dealerGo)+'<span aria-hidden="true">↗</span><span class="sr">, '+E(SPEC.dealerNew)+"</span></span></a>";
  }).join("")+"</div>";
};
/* Vaihtaa olemassa olevan jälleenmyyjälohkon linkit kokoon (TP-sivun kokovalinta). */
window.SPECDEALERSIZE=function(root,size){
  [...root.querySelectorAll(".dealers a")].forEach(function(a,i){
    const d=SPEC.dealers[i]; if(!d) return;
    const u=(size&&d.tp&&d.tp[size])||d.url;
    a.setAttribute("href",u);
    if(size&&d.tp&&d.tp[size]) a.setAttribute("data-koko",size); else a.removeAttribute("data-koko");
  });
};
/* Päävalikko. Rivi on [nimike, osoite, lapset]; osoite null on ryhmä ilman sivua.
   Aktiivinen kohta merkitään myös silloin kun sivu on lapsi tai lapsenlapsi, jotta
   Pilarit-sivulla korostuu Tuotteet ja pudotuksessa Pilarit. */
/* IKONIT-ALKU — koneen kirjoittama, älä muokkaa käsin.
   Lähde: tarvikekuva.siluetti(). Uusi ajo: node docs/kuvat/nav-ikonit.cjs
   Avain on navigaation ankkuri, arvo on 24 px korkea siluetti,
   joka seuraa linkin väriä (currentColor). */
SPEC.ikonit = {
  "kp-pilari": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.4 24\" width=\"14.4\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M0 24L14.4 24L14.04 21.12L10.02 19.92L9.02 0.36L8.64 0L5.76 0L5.38 0.36L4.38 19.92L0.36 21.12Z\" fill=\"currentColor\"/></svg>",
  "tp-pilari": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.4 24\" width=\"14.4\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M1.8 24L12.6 24L12.48 22.32L9.24 21.24L8.7 9.84L8.46 9.6L5.94 9.6L5.7 9.84L5.16 21.24L1.92 22.32Z\" fill=\"currentColor\"/></svg>",
  "pp-pilari": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.4 24\" width=\"14.4\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M1.8 24L12.6 24L12.48 22.32L9.67 21.46L9.02 9.96L8.64 9.6L5.76 9.6L5.38 9.96L4.73 21.46L1.92 22.32ZM6.2 9.6h1.99v-6h-1.99z\" fill=\"currentColor\"/></svg>",
  "ap-pilari": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 14.4 24\" width=\"14.4\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M3.24 24L11.16 24L11.06 22.32L8.88 21.72L8.4 14.64L8.16 14.4L6.24 14.4L6 14.64L5.52 21.72L3.34 22.32Z\" fill=\"currentColor\"/></svg>",
  "pilarikengat": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 24\" width=\"20\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M0 0h2.4v15h-2.4zM17.6 0h2.4v15h-2.4zM0 15h20v3h-20zM8.3 18h3.4v6h-3.4z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>",
  "palkkikengat": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M0 0h7.34v2.4h-7.34zM16.66 0h7.34v2.4h-7.34zM4.94 2.4h2.4v21.6h-2.4zM16.66 2.4h2.4v21.6h-2.4zM4.94 21h14.12v3h-14.12z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>",
  "teraslaatat": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M0 5h24v6h-24zM1.6 8a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0zM7.47 8a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0zM13.33 8a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0zM19.2 8a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0zM10.3 11h3.4v13h-3.4z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>",
  "nostokorva": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 18 24\" width=\"18\" height=\"24\" focusable=\"false\" aria-hidden=\"true\"><path d=\"M1.6 7.4a7.4 7.4 0 1 0 14.8 0a7.4 7.4 0 1 0 -14.8 0zM6.4 7.4a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0zM6 14.3h6v4h-6zM7.3 18.3h3.4v5.7h-3.4z\" fill=\"currentColor\" fill-rule=\"evenodd\"/></svg>"
};
/* IKONIT-LOPPU */

window.SPECNAV=function(E,active){
  const on=function(n){ return active ? (n[0]===active || !!(n[2]&&n[2].some(on))) : false; };
  /* Nuoli vain päätasolla: pudotuksen sisällä se lupaisi kolmannen tason. */
  const chev='<span class="chev" aria-hidden="true">▾</span>';
  /* Ikoni pudotuksen tuoteriveille. Avain on **ankkuri tai polun viimeinen osa**
     (#pilarikengat, kp-pilari) — ei nimike, koska nimike vaihtuu käännöksessä.
     Ankkuri on sama kuin tarvikesivun .tgroup-id ja polku sama kuin sivukartassa.
     Rivi saa ikonin vain jos avaimella on sellainen, joten uusi valikkokohta ei
     riko mitään. Ikoni on koriste: nimi on vieressä, joten se on aria-hidden
     (sen tekee siluetti itse). Ikoni ei kasvata riviä — rivi on jo 48 px. */
  const ikoni=function(osoite){
    const s2=String(osoite||""), a=s2.split("#")[1];
    const avain=a||(s2.split("#")[0].split("/").filter(Boolean).pop()||"");
    return (SPEC.ikonit&&SPEC.ikonit[avain])?'<span class="navik">'+SPEC.ikonit[avain]+"</span>":"";
  };
  const link=function(n,cls,kärki){
    return '<a'+(cls?' class="'+cls+'"':"")+' href="'+E(SPECLINK(n[1]))+'"'+
      (n[0]===active?' aria-current="page"':"")+">"+ikoni(n[1])+E(n[0])+(kärki?chev:"")+"</a>";
  };
  return SPEC.nav.map(function(n){
    const top = n[1] ? link(n,null,!!n[2])
      : '<button class="navtop" type="button" aria-expanded="false"'+
        (on(n)?' aria-current="true"':"")+">"+E(n[0])+(n[2]?chev:"")+"</button>";
    if(!n[2]) return top;
    const ryhmat=n[2].some(function(x){ return !!x[2]; });
    const sisalto=ryhmat
      ? n[2].map(function(g){
          return '<span class="sgroup">'+(g[1]?link(g,"sh"):'<span class="sh">'+E(g[0])+"</span>")+
            (g[2]||[]).map(function(x){ return link(x); }).join("")+"</span>";
        }).join("")
      : n[2].map(function(x){ return link(x); }).join("");
    return '<span class="hassub'+(on(n)?" on":"")+'">'+top+
      '<span class="sub'+(ryhmat?" grid":"")+'">'+sisalto+"</span></span>";
  }).join("");
};

window.SPECSHELL=function(E,o){
  o=o||{};
  const q=s=>document.querySelector(s);
  /* Ilmoituspalkki poistettu 11.9.2026. Kuori siivoaa elementin niiltäkin sivuilta,
     joiden rungossa se vielä on. Tarjouspyyntöön pääsee yhä footerista ja
     "Isompi kohde" -lohkosta. */
  const ab=q(".abar"); if(ab) ab.remove();
  document.querySelector("header.site").classList.add("spec-head");
  q(".urow .w").innerHTML=
    '<span class="search"><span class="mag" aria-hidden="true">⌕</span>'+
      '<input type="search" aria-label="'+E(SPEC.search)+'" placeholder="'+E(SPEC.search)+'"></span>'+
    '<a class="ulink" href="'+E(SPECLINK(SPEC.util[1]))+'">'+E(SPEC.util[0])+"</a>"+
    '<span class="lang" role="group" aria-label="Kieli">'+
      SPEC.langs.map(l=>'<a href="#"'+(l[1]?' aria-current="true"':"")+">"+E(l[0])+"</a>").join("")+"</span>";
  q("header.site .w").innerHTML='<a class="logo" href="'+E(SPECLINK("/"))+'">'+E(SPEC.logo)+"</a>"+
    '<button class="menu-btn" id="menub" type="button" aria-expanded="false" aria-controls="mainnav">'+
      '<span class="ic" aria-hidden="true"><i></i><i></i><i></i></span>'+E(SPEC.menu)+"</button>"+
    '<nav id="mainnav" aria-label="'+E(SPEC.menu)+'">'+SPECNAV(E,o.active)+"</nav>"+
    '<span class="tools">'+
      '<a class="btn btn-1 btn-s hdr-cta" href="'+E(SPECLINK(SPEC.navCta[1]))+'" data-event="'+E(SPEC.navCta[2])+'" data-sijainti="kuori">'+E(SPEC.navCta[0])+"</a>"+
    "</span>";
  const b=q("#menub"),n=q("#mainnav");
  b.addEventListener("click",()=>{const o2=n.getAttribute("data-open")==="true";
    n.setAttribute("data-open",String(!o2));b.setAttribute("aria-expanded",String(!o2));});
  /* Ryhmä ilman sivua ("Tuotteet") on painike, ei linkki. Työpöydällä osoitin ja
     näppäimistöfokus avaavat pudotuksen, klikkaus jättää sen auki ja klikkaus muualle
     sulkee. Mobiilissa lista on jo auki, joten painike ei kerro sulkevansa mitään. */
  const kapea=window.matchMedia("(max-width:980px)");
  [...document.querySelectorAll("#mainnav .navtop")].forEach(function(bt){
    const w=bt.parentNode;
    const sync=function(){
      bt.setAttribute("aria-expanded", kapea.matches||w.getAttribute("data-open")==="true" ? "true":"false");
    };
    bt.addEventListener("click",function(e){
      if(kapea.matches) return;
      e.stopPropagation();
      w.setAttribute("data-open", w.getAttribute("data-open")==="true" ? "false":"true");
      sync();
    });
    kapea.addEventListener("change",sync);
    sync();
    document.addEventListener("click",function(e){
      if(kapea.matches||w.contains(e.target)) return;
      w.setAttribute("data-open","false"); sync();
    });
    w.addEventListener("keydown",function(e){
      if(e.key!=="Escape") return;
      w.setAttribute("data-open","false"); sync(); bt.focus();
    });
  });
  if(o.crumb){
    const c=q(".crumb");
    c.setAttribute("aria-label",SPEC.crumbLabel);
    q(".crumb .w").innerHTML=o.crumb.map(function(x,i){
      const sep=i?'<span class="sep" aria-hidden="true">›</span>':"";
      return sep+(x[1]?'<a href="'+E(SPECLINK(x[1]))+'">'+E(x[0])+"</a>":'<span aria-current="page">'+E(x[0])+"</span>");
    }).join("");
  } else { q(".crumb").remove(); }
  if(o.bar!==false){
    /* Palkin ensisijainen on sama kuin sivun ensisijainen. Tarvikesivulla se on
       ostopaikka (kortti 4), joten sivu kutsuu {bar:"ostat"} ja järjestys kääntyy.

       17.9.2026: sivu voi antaa myös oman parin, {bar:[[teksti,osoite,tapahtuma],...]}.
       Se on tarkoitettu sivulle, jonka toimintoa kuoren oletuspari ei tunne — JeKi-
       sokkelisivulla konfiguraattori laskee pilarien määrän, ei sokkelielementtejä,
       joten oletuspari lupaisi toiminnon jota ei ole. Pari kirjoitetaan silloin
       sivun omista toiminnoista, ei uutena copyna: palkki ja sivu sanovat saman. */
    const bar=Array.isArray(o.bar)?o.bar:(o.bar==="ostat"?[SPEC.bar[1],SPEC.bar[0]]:SPEC.bar);
    document.body.classList.add("has-bar");
    document.body.insertAdjacentHTML("beforeend",'<div class="bar">'+
      '<a class="btn btn-1" href="'+E(SPECLINK(bar[0][1]))+'" data-event="'+E(bar[0][2])+'" data-sijainti="alapalkki">'+E(bar[0][0])+"</a>"+
      '<a class="btn btn-2" href="'+E(SPECLINK(bar[1][1]))+'" data-event="'+E(bar[1][2])+'" data-sijainti="alapalkki">'+E(bar[1][0])+"</a></div>");
  }
  q("footer .w").innerHTML=
    '<div class="cols"><div><h3>Yhteystiedot</h3><p class="addr">'+E(SPEC.foot.addr)+"</p>"+
      '<p class="addr"><span class="tbd">'+E(SPEC.foot.contact)+"</span></p>"+
      '<div class="social">'+SPEC.foot.social.map(s=>'<a href="#">'+E(s)+"</a>").join("")+"</div></div>"+
      SPEC.foot.cols.map(c=>"<div><h3>"+E(c[0])+"</h3><ul>"+
        c[1].map(l=>'<li><a href="'+E(SPECLINK(l[1]))+'">'+E(l[0])+"</a></li>").join("")+"</ul></div>").join("")+
      '<div><h3>Sertifikaatit</h3><div class="certrow">'+
        SPEC.foot.certs.map(c=>"<span>"+E(c)+"</span>").join("")+"</div></div>"+
    '</div><div class="end">'+E(SPEC.foot.end)+"</div>";
};
