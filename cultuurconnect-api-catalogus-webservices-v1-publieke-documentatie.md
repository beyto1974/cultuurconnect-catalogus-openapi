## Inleiding

| Catalogus webservices v1 | Col2 |
| --- | --- |
| helpdesk@cultuurconnect.be |  |
| helpdesk@cultuurconnect.be |  |
|  |  |
| Framework |  |
| op alle profielen | Er is 1 endpoint (cataloguswebservices.bibliotheek.be) voor alle profielen met als subdirectory het profiel (bv. /wetteren/ ). <br>Voorbeelden zijn meestal van de catalogus van bibliotheek Wetteren, indien anders is dit aangeduid in de opmerkingen. |
| vertaling | Codes in veldwaarden worden waar mogelijk vertaald (bv. materiaalcode naar materiaal, code branch naar Bibliotheekvestiging, taalcode naar taal, enz.). Ook labels worden vertaald met het attribuut @translation) |
| performantie | API zou bij normaal gebruik niet mogen wegen op performantie van de AquaBrowser, bv. throttling en voldoende limiteerbare parameters voorzien in de requests naar de API. We raden afnemers van de API evenwel zoveel mogelijk caching van zoekresultaten aan. |
| https | De webservice is volledig beschikbaar via https |
| key | Elke consumer van de API zal een aparte key krijgen. Deze kan via helpdesk@cultuurconnect.be aangevraagd worden. De key die hier gebruikt wordt is enkel geschikt voor tests. |
| content en rechten | De API wordt aangeboden in twee versies: een rijke API en een vrije API. De key bepaalt of je de rijke of vrije API mag gebruiken.<br>De rijke API geeft ook toegang tot data die Cultuurconnect aankoopt bij derden. Cultuurconnect is dan ook gehouden aan de afspraken die met deze derden worden gemaakt over het al dan niet ter beschikking staan van deze data. Het gebruik van de rijke API is enkel toegestaan voor niet-commerciële applicaties die het publieksbereik van een of meer openbare bibliotheken in Vlaanderen of Brussel bevorderen. Deze eigenschap van de applicatie moet zichtbaar zijn voor het publiek en een belangrijke functie zijn van de applicatie.<br>De vrije API geeft geen toegang tot data die Cultuurconnect aankoopt bij derden. Het gebruik van deze data is vrij.<br>Voorbeelden zijn uitgewerkt met de rijke API. |
| staging | Alle staging-sites zijn ook bereikbaar via het het staging endpoint door /staging/ toe te voegen voorafgaand aan het  profiel bv. cataloguswebservices.bibliotheek.be/staging/wetteren/[endpoint] |
| Welke bibliotheken zitten er in de catalogus? |  |
| <https://www.google.com/maps/d/viewer?mid=z4qdf1AhqnAE.kl2k3H1Vbyjk> |  |
|  |  |
| Voor APIv0: https://docs.google.com/spreadsheets/d/1PnyOzCkxSnEWKqmTk6bsnuorAIk27-8yvD2gKf6zq_4/edit |  |

## Endpoints

| Structuur: url/directory/method | Endpoint (METHOD) | Output | Parameters | Uitleg | Voorbeeld |
| --- | --- | --- | --- | --- | --- |
| [Cataloguswebservices.bibliotheek.be](http://cataloguswebservices.bibliotheek.be/) |  |  |  |  |  |
| /subdirectory-profiel |  |  |  | voor het zoeken in een specifiek profiel wordt de directory gebruikt met daarin de profielnaam, bv. /zbb/search (bibliotheek.be - de union catalogue), bv. /oostvlaanderen/search (Oost-Vlaamse bibliotheken) of /wetteren/search - ook voor staging: /staging/oostvlaanderen/search /staging/waregem |  |
|  | /search (GET) | zoek in de catalogus | q | [zoek met zoektermen of gebruik 1 of meerdere prefixen : https://www.bibliotheek.be/zoektaal](https://www.bibliotheek.be/zoektaal) |  |
|  |  |  | refine | als refine=true worden de verfijningen getoond en kan er met facetten verfijnd worden. | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY&refine=true> |
|  |  |  | branch | enkel resultaten uit deze branch (bibliotheeklocatie) bv. branch=West-Vlaanderen/Kortrijk/Aalbeke<br>in een profiel (zie parameter p) worden verschillende branches samengenomen tot een bibliotheek | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY&branch=Oost-Vlaanderen/Wetteren/Overbeke> |
|  |  |  | page | hoeveelste pagina met zoekresultaten die moet worden getoond | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&page=2> |
|  |  |  | sort | mogelijke sorteermogelijkheden: relevance, year, author, title bv. sort=year | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&sort=year> |
|  |  |  | dedup | false = groepering van edities (op basis FRABL-key) in zoekresultaten uitzetten (standaard is groepering aangezet = true) | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&dedup=false> |
|  |  |  | hith | true = markering van je zoekterm aan zetten (standaard staat hit-highlight uit)<br>In xml worden gematchte termen aangeduid met <exact>Duizend</exact> | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&hith=true> |
|  |  |  | facet | beperken tot facet met deze waarde bv. facet=Format(Book) !! Werkt enkel met refine=true | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&facet=Format(Book)&refine=true> |
|  |  |  | lang | taalkeuze instellen: nl, en, fr, ... (nodig om de juiste verwoording bij codes te krijgen) | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | rctx | contextparameter meegeven. Hierin wordt de zoekhistoriek opgeslagen (bv. verfijningen, zoekterm). Deze parameter is niet sessie-afhankelijk. | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend%20zonnen&rctx=AWXIwQnCQBBA0dlEERErEMFjLrIasAILkc3uEFeTmWSySYi92INHS7EEj5agXhX$5T8F8QwmsBWXD$dNaVvLu23aDShifahPsYJpaTxFMSxd6y9IbnVhIqSfVfHCHwRtU6FUJsdxuhklcLurT9HrEankuVcAc$48cQYAV6WFOejC1613OvMZYdDMTegKY8ihIK0z0$CfiSF7dMKV4550jyF8fdJKAWMq1Bs=&authorization=YOUR_API_KEY> |
|  |  |  | id | een of meer id's opvragen (standaard in de volgorde van de id's, parameter sort mogelijk)<br>let op: altijd in combinatie met parameter q=special:list | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?id=%7Clibrary%2Fmarc%2Fvlacc%7C8842444&id=%7Clibrary%2Fmarc%2Fvlacc%7C9750695&q=special:list&authorization=YOUR_API_KEY> |
|  |  |  | s | subset meegeven, de belangrijkste: s=cover (alleen resultaten met een cover tonen) I s=nieuw enkel de nieuwste items | <https://cataloguswebservices.bibliotheek.be/gent/search/?q=boek&authorization=YOUR_API_KEY&lang=nl&s=nieuw> |
|  |  |  | detaillevel | - minimum => alleen detailpage-link, titel, auteur, coverimage en frabl/id<br>- basic => alles nodig voor het renderen van de resultatenlijst, en niks meer<br>- default => alles zoals het nu is<br>- extended => nog meer output, zoals marc21<br>- librarian => beetje hetzelfde als extended, maar ook enrich-info erbij | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY&refine=true&detaillevel=basic> |
|  |  |  | pagesize | aantal resultaten die worden getoond (default=20, meer kan enkel met api-key met specifieke rechten) | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY&refine=true&pagesize=12> |
|  | /details (GET) | om de details van 1 record te zien | id | details van dit id opvragen, het id kan uit de resultlist afgeleid worden a.d.h.v. de het id-element.<br>bv. <id nativeid="9455180" ds="library/m/vlacc">\|library/marc/vlacc\|9455180</id> | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|10438540&authorization=YOUR_API_KEY](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C10438540&authorization=YOUR_API_KEY) |
|  |  |  | lang | taalkeuze instellen: nl, en, fr  (nodig om de vertaling bij codes te krijgen) | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|10438540&authorization=YOUR_API_KEY&lang=nl](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C10438540&authorization=YOUR_API_KEY&lang=nl) |
|  |  |  | rctx | contextparameter meegeven, dit is belangrijk voor navigatie binnen een resultlist |  |
|  |  |  | librarian | librarian=true toevoegen voor librarianmode |  |
|  |  |  | detaillevel | - minimum <br>- basic <br>- default => alles zoals het nu is<br>- extended => nog meer output, zoals marc21<br>- librarian => beetje hetzelfde als extended, maar ook enrich-info erbij |  |
|  |  |  | frabl | Detail weergeven op basis van frabl-key ipv id. Een frabl-key groepeert de verschillende edities van een werk. De meest relevante editie wordt dan getoond. | <https://cataloguswebservices.bibliotheek.be/wetteren/details/?frabl=61B74575E8F1ACA0&authorization=YOUR_API_KEY> |
|  | /availability (GET) | om de beschikbaarheidsinformatie van een record (en alle edities met zelfde taal en materiaal) te zien | frabl | beschikbaarheid van een frabl opvragen (aan te raden) | <https://cataloguswebservices.bibliotheek.be/wetteren/availability/?frabl=61B74575E8F1ACA0&authorization=YOUR_API_KEY> |
|  |  |  | id | beschikbaarheid op basis van een titel-id opvragen | [https://cataloguswebservices.bibliotheek.be/wetteren/availability/?id=\|library/marc/vlacc\|8343444&authorization=YOUR_API_KEY](https://cataloguswebservices.bibliotheek.be/wetteren/availability/?id=%7Clibrary/marc/vlacc%7C8343444&authorization=YOUR_API_KEY) |
|  |  |  | branch | bezitsgegevens van deze branch (bibliotheeklocatie) staan bovenaan in de <locations> node bv. branch=West-Vlaanderen/ARhus Roeselare/De Munt<br>in een profiel (zie parameter p) worden verschillende bibliotheeklocaties samengenomen tot een bibliotheek | <https://cataloguswebservices.bibliotheek.be/wetteren/availability/?frabl=61B74575E8F1ACA0&authorization=YOUR_API_KEY&branch=West-Vlaanderen/ARhus%20Roeselare/De%20Munt> |
|  |  |  | lang | taalkeuze instellen: nl, en, fr, ... (nodig om de juiste verwoording bij codes te krijgen) | <https://cataloguswebservices.bibliotheek.be/wetteren/refine/?authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | global | global=true, geeft availability van alle aangesloten bibliotheken (dus profiel kan weggelaten worden - werkt alleen op aanvraag) | <https://cataloguswebservices.bibliotheek.be/availability/?frabl=61B74575E8F1ACA0&authorization=YOUR_API_KEY&global=true> |
|  | /refine (GET) | vraag verfijningen (facetten) op op basis van een zoekterm. Deze method kan ook gebruikt worden om alle termen van een index op te zoeken (bv. bekroningen). | Zonder parameters | Krijg alle refine opties | <https://cataloguswebservices.bibliotheek.be/wetteren/refine/?authorization=YOUR_API_KEY&lang=nl> |
|  |  | alle refine opties van een bepaalde context | rctx | met de rctx kan je de zoekcontext van de gebruiker als parameter opgeven om alle facetten te tonen. Default worden per facet max. 5 termen getoond. | <https://cataloguswebservices.bibliotheek.be/wetteren/refine/?authorization=YOUR_API_KEY&rctx=AWXIwQnCQBBA0dkEERErEMGjF9kYsAbLkM3uoKvJTJxsEpI6vHq0AxuwDY@e7UG9KvzLfwriMQxhJW7XHZPC1pbXq7TpUMT6cDrECkaF8QQxzFzteyQ375kI6WdVPPVbQVuVKKXZ4SBNInheo8ddfYpur0gtzhsFMOHGE2cAcFFamIPO@an2Tmc$IwyauQpNbgw5FKRlZir8MzFk9064dNySbjGErw9ryWFAuXoD&lang=nl&count=20> |
|  |  |  | count | Zet maximum aantal termen per facet op een ander maximum dan 5 |  |
|  |  |  | facets | toon alleen maar 1 of meerdere facets door ze op te nemen als parameter | <https://cataloguswebservices.bibliotheek.be/wetteren/refine/?authorization=YOUR_API_KEY&rctx=AWXIwQnCQBBA0dkEERErEMGjF9kYsAbLkM3uoKvJTJxsEpI6vHq0AxuwDY@e7UG9KvzLfwriMQxhJW7XHZPC1pbXq7TpUMT6cDrECkaF8QQxzFzteyQ375kI6WdVPPVbQVuVKKXZ4SBNInheo8ddfYpur0gtzhsFMOHGE2cAcFFamIPO@an2Tmc$IwyauQpNbgw5FKRlZir8MzFk9064dNySbjGErw9ryWFAuXoD&lang=nl&count=15&facets=Format> |
|  |  |  | lang | toon termen in nl, fr of en |  |
|  | /index/all (GET) | lijst alle geconfigureerde indexen en facets op |  |  | <https://cataloguswebservices.bibliotheek.be/index/all/?authorization=> |
|  | /index  (GET) | geeft de ingangen van een specifieke index (maximum 100) | Elk type index kan opgevraagd worden door de subdirectory te gebruiken van het type:<br><br>/author, /awards, /subjects, /language, /format, /targetaudience, /readinglevel, /type, /genre |  | <https://cataloguswebservices.bibliotheek.be/wetteren/index/author/?authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | curpage | hoeveelste pagina met zoekresultaten die moet worden getoond |  |
|  |  |  | pagesize | aantal termen op de pagina (maximum 20) |  |
|  | /resolver (GET) | Geef een id op van een bepaalde aard/bron en krijg de id's uit bibliotheekportalen. | Elk type identifier kan opgevraagd worden door de subdirectory te gebruiken van het type:<br><br>Bibliografische id's:<br>/ean , /isbn , /issn , /frabl<br><br>Id's brondatabanken:<br>/ppn, /admin_doc_number, /bibno, /doc_number, /nativeid, /extid<br><br>met parameter id voor de identifiers, meerdere zijn dus mogelijk van hetzelfde type | De resolver kan identifiers zoals EAN, ISBN matchen op de id waar ze voorkomen.<br>Deze method is geschikt om bv. een boekendatabank met eigen identifiers te resolven om daarna de detailinformatie daarvan op te halen.<br><br>Daarnaast is het ook mogelijk identifiers in databanken van lokale systemen te resolven naar de identifier in bibliotheekportalen.<br><br>Id's brondatabanken:<br>/ppn (niet in gebruik in Vlaanderen)<br>/admin_doc_number (enkel in gebruik in PBS Vlaams-Brabant)<br>/bibno (recordnummer van het record dat als master uit de matching komt)<br>/doc_number (lokaal recordnummer zonder te hoeven weten welk record als master uit de matching is gekomen)<br>/nativeid (recordnummer in AquaBrowser, zonder prefix)<br>/extid (lokaal recordnummer met prefix) | <https://cataloguswebservices.bibliotheek.be/wetteren/resolver/ean/?id=0731454790321&authorization=YOUR_API_KEY> |
|  |  |  | dedup | false = groepering van edities (op basis FRABL-key) in zoekresultaten uitzetten (standaard is groepering aangezet = true) |  |
|  | /holdings (GET) | Geef een lijst van de verschillende branches in een opgegeven profile | profiel = subdirectory van /holdings (zonder profiel: volledige lijst van alle aangesloten bibliotheken) | Laat toe om alle sublocaties op te zoeken door opgave van de profielnaam. Antwoord is verrijkt met openingsuren, adresgegevens en eventueel andere informatie zoals een URL | [https://cataloguswebservices.bibliotheek.be/holdings/Oost-Vlaanderen/Wetteren/?authorization=YOUR_API_KEY<br>http://cataloguswebservices.bibliotheek.be/holdings/root/bibnet/?authorization=xxx](https://cataloguswebservices.bibliotheek.be/holdings/Oost-Vlaanderen/wetteren/?authorization=YOUR_API_KEY) |
|  |  |  | includeparent | includeparent=true geeft ook de parent-holding mee in de response. Sowieso toe te voegen voor bibliotheken die geen onderliggende holdings hebben | [https://cataloguswebservices.bibliotheek.be/holdings/Oost-Vlaanderen/Wetteren/?authorization=xxx&includeparent=true <br>http://cataloguswebservices.bibliotheek.be/holdings/Brussel/Sint-Joost-ten-Node/?authorization=xxx&includeparent=true](https://cataloguswebservices.bibliotheek.be/holdings/Oost-Vlaanderen/Wetteren/?authorization=xxx&includeparent=true) |
|  |  |  | closeinfodays | Default staat dit op 90, aan te passen als je meer of minder sluitingsdagen - over een langere of kortere periode - wenst te verkrijgen | [cataloguswebservices.bibliotheek.be/holdings/root/bibnet/Brussel/?authorization=xxx&closeinfodays=300](http://cataloguswebservices.bibliotheek.be/holdings/root/bibnet/Brussel/?authorization=xxx&closeinfodays=300) |
|  |  |  | show-region-profiles | Default false, indien true komen de profielen van regiosamenwerkingen ook door (bv. Route 42, Dijk92, Bibkwintet ...) maar dit zorgt ervoor dat holdings dubbel voorkomen (want een regio is een combinatie van sublocaties van verschillende bibliotheken) |  |
|  | /locations (GET) |  |  |  | <http://hs.aquabrowser.be/locations/list/?type=json&id=/root/bibnet/Brussel> |
|  | /search-availability (POST) | Beschikbaarheidsinformatie van een reeks titels opvragen, voornamelijk bedoeld om de beschikbaarheid van een hele pagina zoekresultaten op te vragen.<br>De respons geeft available terug zodra 1 aanwezig exemplaar van een titel gevonden wordt. De beschikbaarheid van overige exemplaren wordt dan niet meer gecheckt. Een totaal van alle exemplaren krijg je dus niet terug met dit endpoint | - | form-urlencoded post-body vereist<br><br>Voor de beschikbaarheid van een zoekresultaat kun je vertrekken van de <search-availability-ids> node die deel uitmaakt van de respons op /search.<br>De subnode <post> daarvan bevat quasi 1 op 1 de post-body die je hier nodig hebt.<br><br>De body bevat een reeks met enerzijds het ext-id als linkse parameter, gevolgd door de bijhorende wise titel-id's als rechtse parameter.<br><br>Voorbeeld van een postbody:<br>%7clibrary%2fmarc%2fvlacc%7c9087219:1095592%2c612974<br>%7clibrary%2fmarc%2fvlacc%7c8206475:960412<br>%7clibrary%2fmarc%2fvlacc%7c10114552:1095592%2c612974<br>%7clibrary%2fmarc%2fvlacc%7c3327805:646561<br>%7clibrary%2fmarc%2fvlacc%7c4431538:686489 | <https://cataloguswebservices.bibliotheek.be/wetteren/search-availability/> |
|  |  |  | detaillevel | met 'librarian' detaillevel zie je in de respons ook de achterliggende respons van de Wise-api die gebruikt wordt om de beschikbaarheidsstatus te bepalen. |  |
|  |  |  | branch | zie gelijkaardige parameter bij /search voor syntax; zorgt er voor dat in respons het oogpunt van de branch gekozen wordt en de eerste beschikbaarheidsstatus die is uit perspectief van de branch. |  |

## Search XML

| SEARCH XML | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 | Col9 | Col10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  | Attributen | Uitleg | Opmerkingen | example records API |
| root |  |  |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
| meta |  |  |  |  |  |  |  |  |  |
|  | count |  |  |  |  |  | Aantal resultaten |  |  |
|  | page |  |  |  |  |  | Nummer van de pagina |  |  |
|  | rctx |  |  |  |  |  | Contextparameter |  |  |
| feedbacks |  |  |  |  |  |  | block met alle queryfeedback zoals wikipedia artikels |  |  |
|  | service |  |  |  |  | @name @type @url | bv. <service name="wikipedia-query" type="jscallback" url="https://nl.wikipedia.org/w/api.php?titles=duizend+zonnen&action=query&prop=pageprops\|info\|extracts\|links\|pageimages&redirects&format=json&continue&inprop=url"/> |  |  |
|  | authorpage |  |  |  |  | @search-index @search-term |  |  |  |
|  |  | service |  |  |  | @name @type @url | <service name="wikipedia" type="jscallback" url="https://nl.wikipedia.org/w/api.php?titles=Hugo+Claus&action=query&prop=pageprops\|info\|extracts\|links\|pageimages&redirects&format=json&continue&inprop=url"/> |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=author:Hugo%20Claus&authorization=YOUR_API_KEY&lang=nl> |
|  | noresults |  |  |  |  |  | subelement dat getoond bij minder dan 3 resultaten. Geeft de mogelijkheid om de user te laten doorlinken naar de parent-site. |  |  |
|  |  | parent-sites |  |  |  |  |  |  | <https://cataloguswebservices.bibliotheek.be/waregem/search/?q=author=%22Guido+de+Bruyker%22&lang=nl&authorization=YOUR_API_KEY> |
|  |  |  | parent-site |  |  | @url<br>@profile<br>@translation | URL van de parent-site waarnaar eventueel kan doorgelinkt worden om meer resultaten te vinden met naam van het profiel en label (translation) dat gebruikt kan worden (=@name in holdingsmethod) |  |  |
|  | queryexpansion |  |  |  |  |  | uitbreiding van query indien van toepassing |  |  |
|  |  | with |  |  |  | @term @index @query @count | term=uitbreidingsterm bv. Myanmar indien van toepassing<br>index=index die werd gebruikt indien van toepassing<br>query=query die werd toegevoegd |  | <https://cataloguswebservices.bibliotheek.be/waregem/search/?q=birma&lang=nl&authorization=YOUR_API_KEY> |
|  | userfeedback |  |  |  |  |  | ingesteld bij een aantal bibliotheken, feedback in html op basis van een query |  | <http://westvlaanderen.staging.aquabrowser.be/api/v1/search/?q=Werkingsverslag+bibliotheek+Waregem&authorization=xxxxx&lang=nl&p=waregem> |
|  |  | text |  |  |  |  |  |  |  |
|  | search-availability-ids |  |  |  |  |  | voor gebruik met het /search-availability endpoint |  |  |
|  |  | ids |  |  |  | @extid @cnt | verzameling van de relevante id's ; het extid is een unieke identifier van de catalogus, de id's die in de node zitten zijn Wise titel-id's, dit is een uniek id per uitgave. Bv. een boek dat meerdere keren is uitgegeven (in verschillende jaren) heeft meerdere titel-id's. |  |  |
|  |  | post |  |  |  |  | vertaalde versie van id's, klaar om gebruikt te worden als post-body via /search-availability |  |  |
|  |  |  |  |  |  |  |  |  |  |
| results |  |  |  |  |  |  |  |  |  |
|  | result |  |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  | id |  |  |  | @nativeid @ds | Id met recordnummer en datasource afzonderlijk (ter info) |  |  |
|  |  | frabl |  |  |  |  | Frabl |  |  |
|  |  | detail-page |  |  |  |  | URL om door te linken naar de detailpagina in de AquaBrowser. | Kan in het geval van een beschrijving van een website de URL zijn van de feitelijke website. |  |
|  |  | copyright |  |  |  |  | Disclaimer over de copyright van de data |  |  |
|  |  | coverimages |  |  |  |  |  | Niet beschikbaar in de vrije api. |  |
|  |  |  | coverimage |  |  |  |  | Niet beschikbaar in de vrije api. |  |
|  |  |  |  | url |  |  | URL van de coverafbeelding (default coversize=small, je kan &coversize=large toevoegen voor grotere cover) | Niet beschikbaar in de vrije api. |  |
|  |  |  |  | caption |  |  | Bijschrift van de coverafbeelding, indien van toepassing | Niet beschikbaar in de vrije api. |  |
|  |  | titles |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | title |  |  |  | Publicatietitel |  |  |
|  |  |  | short-title |  |  |  | Verkorte publicatietitel |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=multatuli&authorization=YOUR_API_KEY> |
|  |  |  | original-title |  |  |  | Oorspronkelijke titel |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=leven%20van%20pi&authorization=YOUR_API_KEY> |
|  |  |  | uniform-title |  |  |  | Uniforme titel |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=Mariken%20van%20Nieumeghen&authorization=YOUR_API_KEY> |
|  |  |  | other-title |  |  |  | Andere titel (opm voorbeeld is van profile=Gent) |  | <https://cataloguswebservices.bibliotheek.be/gent/search/?q=einde%20verhaal%20roman&authorization=YOUR_API_KEY> |
|  |  | authors |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | main-author |  |  | @firstname @lastname @deathyear @deathyear-clean @birthyear @birthyear-clean @type @localized-type @creatortype @main @viaf @wikidata @isni | Auteur (omzetting naar 'voornaam familienaam' met lang=nl) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=Portrait%20in%20jazz&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | author |  |  | @firstname @lastname @deathyear @deathyear-clean @birthyear @birthyear-clean @type @localized-type @creatortype @viaf @wikidata @isni @specific-type | Auteur (omzetting naar 'voornaam familienaam' met lang=nl) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=Portrait%20in%20jazz&authorization=YOUR_API_KEY&lang=nl> |
|  |  | formats |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | format |  |  |  | Materiaal (Nederlandse verwoording met lang=nl) |  |  |
|  |  | types |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | type |  |  |  | type publicatie mogelijke waarden zijn: Fictie, Non-Fictie, Muziek, Film (met lang=nl) |  |  |
|  |  | identifiers |  |  |  |  | identificerende nummers attribuut = vrije annotatie (bv. paperback) |  |  |
|  |  |  | isbn-id |  |  | @note | ISBN-nummer |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=leven%20van%20pi&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | ean-id |  |  | @note | EAN-nummer |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=Portrait%20in%20jazz&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | issn-id |  |  | @note | ISSN-nummer |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=eos%20magazine&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | publishernumber-id |  |  |  | Uitgeversnummer |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=blood%20on%20the%20tracks&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | cdr-id |  |  |  | Nummer van Centrale Discotheek Rotterdam |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=blood%20on%20the%20tracks&authorization=YOUR_API_KEY&lang=nl> |
|  |  | publication |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | publishers |  |  |  |  |  |  |
|  |  |  |  | publisher |  | @place @year | Uitgever met plaats en jaar van uitgave |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  |  |  | projected-publication-date |  |  | Verwachte verschijningsdatum |  |  |
|  |  |  | editions |  |  |  |  |  |  |
|  |  |  |  | edition |  |  | Editie |  | TODO |
|  |  | languages |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | language |  |  |  | Taal (taal onbekend 'und' komt niet door) |  |  |
|  |  |  | original-language |  |  |  | Oorspronkelijke taal (taal onbekend 'und' komt niet door) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=leven%20van%20pi&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  | classifications |  |  |  | @translation | classificatie met plaatsingssuggesties |  |  |
|  |  |  | siso-code |  |  |  | block met siso-codes |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=geologie&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  |  | zizo-codes | zizo-code |  | @code |  | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=geologie&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  |  | music-codes | music-code |  |  |  |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=kind%20of%20blue&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | nblc-codes | nblc-code |  |  |  |  |  |
|  |  |  | platform | platform |  |  |  | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=mario%20bros&authorization=YOUR_API_KEY&lang=nl> |
|  |  | subjects |  |  |  | @search-method @search-term @search-type |  |  |  |
|  |  |  | personal-subject |  |  | @type | Onderwerp persoonsnaam |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=miles%20davis&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | corporate-subject |  |  | @type | Onderwerp corporatie |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=cultuurconnect&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | topical-subject |  |  | @type | Onderwerp algemeen |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=miles%20davis&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | local-subject |  |  |  | Onderwerp lokaal |  | nog voorbeeld zoeken |
|  |  | e-resources |  |  |  |  |  |  |  |
|  |  |  | e-resource |  |  | @type @url | URL van een geassocieerde e-resource, meestal website |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=Format:website&authorization=YOUR_API_KEY&lang=nl> |
|  |  | description |  |  |  |  |  |  |  |
|  |  |  | physical-description |  |  |  | Collatie (meestal aantal pagina's) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=kaas&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | playing-time |  |  |  | Speelduur |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=kind%20of%20blue%20cd&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | publication-frequency |  |  |  | Verschijningsfrequentie |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=eos%20magazine&authorization=YOUR_API_KEY&lang=nl> |
|  |  | notes |  |  |  |  |  |  |  |
|  |  |  | note |  |  |  | Annotatie | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=bibno:2795503&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | technical-note |  |  |  | Systeemvereisten | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=mario%20bros&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | contents-note |  |  |  | Bevat-annotatie | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=nieuwe%20geschiedenis%20van%20belgie&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | recording-date-note |  |  |  | Opnamedatum |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=kind%20of%20blue&authorization=YOUR_API_KEY&lang=nl> |
|  |  | genres |  |  |  |  |  |  |  |
|  |  |  | genre |  |  | @type | Genre |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  | summaries |  |  |  |  |  | Niet beschikbaar in de vrije api. |  |
|  |  |  | summary |  |  | @source-name | Samenvatting | Niet beschikbaar in de vrije api. |  |
|  |  | awards |  |  |  |  |  |  |  |
|  |  |  | award |  |  | @year | Bekroning met jaar |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=feest%20van%20het%20begin&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  | target-audiences |  |  |  |  |  |  |  |
|  |  |  | target-audience |  |  |  | doelgroep, bv. volwassenen, maar kan ook 9-11 jaar zijn |  |  |
|  |  | reading-levels |  |  |  |  |  |  |  |
|  |  |  | reading-level |  |  |  | Leesniveau |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=vos%20en%20haas&authorization=YOUR_API_KEY&facet=Format(Book)&lang=nl> |
|  |  | series |  |  |  |  |  |  |  |
|  |  |  | series-title |  |  | @volume | Reeks met volumeaanduiding |  |  |
|  |  | articles |  |  |  | @count @id | subartikels zoals bij een tijdschrift<br>count= aantal subartikels<br>id = id van het tijdschrift |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=eos%20magazine&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | search-link |  |  | @method @value | link naar artikels zoals bij een tijdschrift<br>method = benaming van de index <br>value = id van het tijdschrift |  |  |
|  |  | magazines |  |  |  |  | enkel voor artikels uit tijdschriften |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=relation_article:64&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | magazine |  |  |  |  |  |  |
|  |  |  |  | id |  |  | id van het magazine |  |  |
|  |  |  |  | titles |  |  |  |  |  |
|  |  |  |  |  | titel |  | titel van het magazine |  |  |
|  |  |  |  | custom |  |  |  |  |  |
|  |  |  |  |  | notes |  | annotatie bij magazine bv. Jrg. 7 (1990) nr. 12, p. 19-24 : ill. |  |  |
|  |  | undup-info |  |  |  | @key @cnt @frabl@frabl-global-count @frabl-key1 @frabl-key2 | key= groepeersleutel van alle edities van een bepaald werk (hex bit encoded key1, key2, material, language)<br>frabl-global-count = aantal edities in Vlaanderen<br>workid = hex bit encoded key1 en key2<br>frabl-key1 = titel<br>frabl-key2 = auteur |  |  |
|  |  |  | format |  |  | @text | materiaaltype |  |  |
|  |  |  |  | item |  | @extid @frabl @language @year @globalholdingscount | extid = bibliografisch id voor deze editie<br>frabl = frabl-key<br>language = taal van uitgave<br>year = jaar van uitgave<br>globalholdingscount = aantal holdings |  |  |
|  |  | enrich-info |  |  |  |  | Informatie over gematchete bibliografische id's. |  |  |
|  |  |  | match |  |  | @beid = id <br>@extid = bibliografisch id voor deze editie<br>@criterion = op welk criterium het record werd gematchet<br>@rule= regel waarop matching is  gebaseerd |  |  |  |
|  |  | librarian-info |  |  |  |  | Is enkel als parameter librarian=true wordt gebruikt. Deze node bevat alle broninformatie voor bibliotheken en catalografen over het record. |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=duizend+zonnen&authorization=YOUR_API_KEY&librarian=true&lang=nl> |
|  |  |  | marc |  |  |  |  |  |  |
|  |  |  | meta |  |  |  |  |  |  |
|  |  |  | undup-info |  |  |  |  |  |  |
|  |  |  | enrich-info |  |  |  |  |  |  |
|  |  | tracks |  |  |  |  |  |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=symphonies&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | track |  |  | @number<br>@cdr-id | number=nummer van het album<br>cdr-id=id van de CDR (www.cdr.nl) databank. Hiermee kan doorgelinkt worden naar meer informatie of de cdr-id kan gebruikt worden voor de mini-player van CDR | DOCUMENTATIE player staat op:<br><br>https://media.cdr.nl/AUDIO/docs/html5MiniPlayer/Instructions%20Muziekweb%20miniplayer.pdf<br><br>https://media.cdr.nl/AUDIO/docs/html5MiniPlayer/MiniPlayer.htm |  |
|  |  |  |  | titles |  |  |  |  |  |
|  |  |  |  |  | title |  |  |  |  |
|  |  |  |  | authors |  |  |  |  |  |
|  |  |  |  |  | zie bij results/result/authors voor alle mogelijke velden | zie bij results/result/authors voor alle mogelijke velden | bevat altijd main-author en author |  |  |
|  |  |  |  | identifiers |  |  |  |  |  |
|  |  |  |  |  | cdr-id |  | id van het album |  |  |
|  |  |  |  | eresources |  |  | links naar youtube/spotify | Enkel indien van toepassing (komt niet veel voor) |  |
|  |  |  |  |  | eresource | @type @url | type=aard van de service<br>url=url naar de service |  |  |
|  |  | children |  |  |  |  | record is een parent van een aantal child-records (bv. is het record van een omnibus)<br>elk kind bevat een volledige beschrijving. |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=omnibus&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | child |  |  |  |  |  |  |
|  |  | parents |  |  |  |  |  | is voorbeeld van bibliotheek Aalst | <https://cataloguswebservices.bibliotheek.be/aalst/search/?q=blokken&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | parent |  |  |  | record is gekoppeld aan een parent (bv. bij is een onderdeel van een omnibus)<br>De volledige beschrijving van de parent wordt bij het kind meegegeven |  |  |
|  |  | custom |  |  |  |  |  |  |  |
|  |  |  | roserank |  |  |  | bibliografische relevantie factor (voor ranking van de zoekresultaten) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=blokken&authorization=YOUR_API_KEY&lang=nl> |
|  |  |  | holdings-count |  |  |  | relevantiebooster: aantal bibliotheken dat dit record bezit x aantal edities |  |  |
|  |  |  | luisterpunt |  |  |  | enkel in het profiel Luisterpunt, de bibliotheek voor mensen met een visuele beperking |  |  |
|  |  |  |  | url |  | @translation | url om materialen te reserveren bij Luisterpunt |  |  |
|  |  |  |  | fragment-url |  | @translation | url naar een luisterfragment van de opname van Luisterpunt |  |  |
| facets |  |  |  |  |  |  |  |  |  |
|  | facet |  |  |  |  | @count @id @translation | De facets die verschijnen bij de zoekopdracht<br>count=hoeveel facet voorkomt<br>id=id van het facet<br>translation=vertaling van het facet (bv. book = boek) | is enkel indien refine=true | <https://cataloguswebservices.bibliotheek.be/wetteren/search/?q=blokken&authorization=YOUR_API_KEY&refine=true&lang=nl> |
| sort |  |  |  |  |  |  |  |  |  |
|  | option |  |  |  |  | @id @active @translation | De gebruikte sorteeroptie<br>active= als 'true' is dit de aanduiding van de actieve sortering<br>id=id van de sortering<br>translation=vertaling van het id |  |  |

## Details XML

| DETAILS XML | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | Attributen | Uitleg | Opmerkingen | Voorbeeldrecord in API |
| root |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query |  | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|3121822&authorization=YOUR_API_KEY](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C3121822&authorization=YOUR_API_KEY) |
| meta |  |  |  |  |  |  |  |
|  | rctx |  |  |  | Contextparameter |  | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|3121822&authorization=YOUR_API_KEY](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C3121822&authorization=YOUR_API_KEY) |
| id @nativeid @ds |  |  |  | @nativeid @ds | Id met recordnummer en datasource afzonderlijk (ter info) |  |  |
| frabl |  |  |  |  | frabl van het record |  |  |
| detail-page |  |  |  |  | URL om door te linken naar de detailpagina in de AquaBrowser |  |  |
| copyright |  |  |  |  | Disclaimer over de copyright van de data |  |  |
| ALLE VELDEN VAN SEARCH-XML /results/result met extra velden |  |  |  |  |  |  |  |
| librarian-info |  |  |  |  | Is enkel als parameter librarian=true wordt gebruikt. Deze node bevat alle broninformatie voor bibliotheken en catalografen over het record. |  | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|3121822&authorization=YOUR_API_KEY&librarian=true](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C3121822&authorization=YOUR_API_KEY&librarian=true) |
|  | info |  |  |  |  |  |  |
|  | record |  |  |  |  |  |  |
|  |  | marc |  |  |  |  |  |
|  |  | meta |  |  |  |  |  |
|  |  | undup-info |  |  |  |  |  |
|  |  | enrich-info |  |  |  |  |  |
| branches |  |  |  |  |  |  | [https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=\|library/marc/vlacc\|3121822&authorization=YOUR_API_KEY](https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary/marc/vlacc%7C3121822&authorization=YOUR_API_KEY) |
|  | branch |  |  | @id @translation | Bibliotheeklocatie met code en verwoording (enkel met lang=nl) |  |  |
| ratings |  |  |  |  | Ratings voor multimedia (zoals kijkwijzer) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary%2Fmarc%2Fvlacc%7C8219740&authorization=YOUR_API_KEY> |
|  |  |  |  |  |  |  |  |
|  | kijkwijzer-codes |  |  |  |  |  |  |
|  |  | kijkwijzer-icon |  |  |  |  |  |
|  | pegi-codes |  |  |  | ratings voor games (kunnen verschillende zijn) |  | <https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary%2Fmarc%2Fvlacc%7C9679899&authorization=YOUR_API_KEY> |
|  |  | pegi |  | @icons-src |  |  |  |
| reviews |  |  |  |  |  | Niet beschikbaar in de vrije api. |  |
|  | review |  |  | @name @source @copy @date | recensie<br>name = code bron van de recensie<br>source = verwoording bron van de recensie<br>copy = copyright van de recensie<br>date = datum van publicatie van de recensie | Niet beschikbaar in de vrije api. | <https://cataloguswebservices.bibliotheek.be/wetteren/details/?id=%7Clibrary%2Fmarc%2Fvlacc%7C9679899&authorization=YOUR_API_KEY> |

## Index XML

| INDEX XML | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | Attributen | Uitleg | example records API |
| root |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query | <https://cataloguswebservices.bibliotheek.be/wetteren/index/awards/?authorization=YOUR_API_KEY&lang=nl> |
| meta |  |  |  |  |  | idem |
|  | rctx |  |  |  | Contextparameter | idem |
|  | curpage |  |  |  | Voor paging, hoeveelste pagina met indexingangen er wordt getoond (maximum 20) | idem |
|  |  |  |  | @is-last | @is-last=true als het de laatste pagina is |  |
|  | pagesize |  |  | @enforcedmaximum | Hoeveel indexingangen op de pagina worden getoond<br>enforcedmaximum="100" is het maximum aantal indexingangen dat is toegestaan | idem |
| results |  |  |  | @index @is-dimension | @index is de naam van de gevraagde index<br>@is-dimension is ... | idem |
|  | result |  |  |  | Indexingang | idem |

## Availability XML 

| AVAILABLITY XML RESPONS | AVAILABLITY XML RESPONS | AVAILABLITY XML RESPONS | Col4 | Col5 | Col6 | Col7 | Col8 | Col9 | Col10 | Col11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  | Attributen | Uitleg | example records API |
| root |  |  |  |  |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query | <https://cataloguswebservices.bibliotheek.be/wetteren/availability/?frabl=61B74575E8F1ACA0&authorization=YOUR_API_KEY> |
| meta |  |  |  |  |  |  |  |  |  | idem |
|  | rctx |  |  |  |  |  |  |  | Contextparameter | idem |
|  | id |  |  |  |  |  |  | @nativeid @ds | Id met recordnummer en datasource afzonderlijk (ter info) | idem |
|  | frabl |  |  |  |  |  |  |  | Indien request met frabl, wordt deze frabl herhaald |  |
|  | detail-page |  |  |  |  |  |  |  | URL om door te linken naar de detailpagina in de AquaBrowser | idem |
|  | records |  |  |  |  |  |  |  |  | idem |
|  |  | record |  |  |  |  |  | @nativeid @ds @extid | origineel id uit het bibliotheeksysteem (interne informatie) |  |
|  |  |  | publisher |  |  |  |  |  | Uitgever |  |
|  |  |  | publisher-year |  |  |  |  |  | Jaar van uitgave |  |
|  |  |  | title |  |  |  |  |  | Titel |  |
|  |  |  | author |  |  |  |  |  | Auteur |  |
|  |  |  | retrieved-avail-id |  |  |  |  | @nativeid @ds | Id's gematcht met dit record |  |
|  |  |  | coverimage |  |  |  |  |  | Link naar de afbeelding op de coverserver |  |
| locations |  |  |  |  |  |  |  |  |  | idem |
|  | location |  |  |  |  |  |  | @name @id @available @profile-branch | Locatie op niveau van bibliotheek (@profile-branch=true betekent dat dit profiel geselecteerd is in de URL) | idem |
|  |  | location |  |  |  |  |  | @name @id @available @branch-selected | Locatie op niveau van branch (@branch-selected=true betekent dat deze branch geselecteerd is in de URL) | idem |
|  |  |  | holding |  |  |  |  | @id @name @parent @latitude @longtitude @impala @bios @profiles | Gegevens van de locatie | idem |
|  |  |  |  | closing-info |  |  |  |  |  |  |
|  |  |  |  |  | timespan |  |  | @start @end @reason | Lijst van uitzonderlijke sluitingsdagen komende maand |  |
|  |  |  |  | opening-hours |  |  |  |  |  |  |
|  |  |  |  |  | sunday |  |  |  |  |  |
|  |  |  |  |  |  | timespan |  | @open @close | Openingsuren per dag |  |
|  |  |  |  |  |  | special-closing-day |  | @reason | Aanduiding uitzonderlijke sluitingsdag |  |
|  |  |  |  |  | monday |  |  |  |  |  |
|  |  |  |  |  | tuesday |  |  |  |  |  |
|  |  |  |  |  | wednesday |  |  |  |  |  |
|  |  |  |  |  | thursday |  |  |  |  |  |
|  |  |  |  |  | friday |  |  |  |  |  |
|  |  |  |  |  | saturday |  |  |  |  |  |
|  |  |  |  | address |  |  |  |  |  |  |
|  |  |  |  |  | street |  |  |  | Straat |  |
|  |  |  |  |  | number |  |  |  | Huisnummer |  |
|  |  |  |  |  | city |  |  |  | Gemeente |  |
|  |  |  |  |  | community |  |  |  | Gemeenschap |  |
|  |  |  |  |  | phone |  |  |  | Telefoon |  |
|  |  |  |  |  | email |  |  |  | E-mail |  |
|  |  |  |  |  | postcode |  |  |  | Postcode |  |
|  |  |  |  |  | url |  |  | @linktext | Website |  |
|  |  |  | items |  |  |  |  |  |  | idem |
|  |  |  |  | item |  |  |  | @available @extid @status @count | Informatie per item, @status is de genormaliseerde status: loanedout, notavailable, notonloan, none<br>(none = available), @count is aantal items door deze node beschreven (met zelfde extid en status worden namelijk samengenomen in één item-node) | idem |
|  |  |  |  |  | subloc |  |  |  | Sublocatie (afdeling in de bibliotheek) | idem |
|  |  |  |  |  | shelfmark |  |  |  | Signatuur (wat op het etiket van het item staat bv. eerste letters familienaam auteur) | idem |
|  |  |  |  |  | status |  |  |  | Aanwezig, uitgeleend, in bestelling enz. | idem |
|  |  |  |  |  | returndate |  |  |  | Indien uitgeleend: tot wanneer het item is uitgeleend | idem |
|  |  |  |  |  | placehold |  |  |  | Link om het item te reserveren (indien van toepassing) | idem |
|  |  |  |  |  | volume |  |  |  | Volume (indien van toepassing) | http://zoeken.gent.bibliotheek.be/api/v1/availability/?id=%7Clibrary/marc/vlacc%7C1057647&authorization=YOUR_API_KEY&lang=nl |
|  |  |  |  |  | custom |  |  |  |  |  |
|  |  |  |  |  |  | bibnet |  |  |  |  |
|  |  |  |  |  |  |  | zizo | @code @image | ZIZO-code met als attribuut een URL voor de bijhorende afbeelding (ZIZO is een classificatie voor non-fictie) |  |
|  |  |  |  |  | publication |  |  | @year @publisher |  |  |
|  |  |  |  |  | itemid |  |  |  | uniek exemplaar-id uit het bibliotheeksysteem Wise |  |
|  |  |  |  |  | wiseid |  |  |  | titel-id uit het bibliotheeksysteem Wise, elke uitgave van een zelfde werk krijgt een eigen titel-id. Een titel-id kan aan zich meerdere item/exemplaar-id's gekoppeld hebben |  |
|  |  |  |  |  | wise-branch-id |  |  |  | branch-code uit het bibliotheeksysteem Wise |  |

## Holdings XML 

| HOLDINGS XML RESPONS | HOLDINGS XML RESPONS | HOLDINGS XML RESPONS | HOLDINGS XML RESPONS | Col5 | Col6 | Col7 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | Attributen | Uitleg | example records API |
| aquabrowser |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query |  |
| holding |  |  |  | @id @name @parent @profiles @latitude @longtitude @impala @bios @region-profile @ibl-enabled | Gegevens van de locatie - ! parent-holding op zelfde niveau |  |
|  | opening-hours |  |  |  |  |  |
|  |  | sunday |  | @description | legacy - eerste opmerkingenveld uit Wise bij eerste tijdsslot - gebruik het description-attribuut bij timespan! |  |
|  |  |  | timespan | @open @close | Openingsuren per dag |  |
|  |  |  |  | @description | Opmerkingenveld uit Wise bij tijdsslot |  |
|  |  |  | special-closing-day | @reason | Aanduiding uitzonderlijke sluitingsdag |  |
|  |  | monday |  |  |  |  |
|  |  | tuesday |  |  |  |  |
|  |  | wednesday |  |  |  |  |
|  |  | thursday |  |  |  |  |
|  |  | friday |  |  |  |  |
|  |  | saturday |  |  |  |  |
|  | closing-info |  |  |  |  |  |
|  |  | info |  | @start @end @reason | Lijst van uitzonderlijke sluitingsdagen, standaard komende 90 dagen |  |
|  | address |  |  |  |  |  |
|  |  | street |  |  | Straat |  |
|  |  | number |  |  | Huisnummer |  |
|  |  | city |  |  | Gemeente |  |
|  |  | community |  |  | Gemeenschap |  |
|  |  | phone |  |  | Telefoon |  |
|  |  | email |  |  | E-mail |  |
|  |  | postcode |  |  | Postcode |  |
|  |  | url |  | @linktext | Website |  |

## Search-Availability XML 

| SEARCH-AVAILABLITY XML RESPONS | SEARCH-AVAILABLITY XML RESPONS | SEARCH-AVAILABLITY XML RESPONS | SEARCH-AVAILABLITY XML RESPONS | Col5 | Col6 | Col7 | Col8 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | Attributen | Uitleg | example records API |
| aquabrowser |  |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query |  |
| meta |  |  |  |  |  |  |  |
|  | branch |  |  |  | @original @used @name @wise-id @uses-first-child |  |  |
|  | count |  |  |  |  | aantal resultaten |  |
|  | retrieved |  |  |  |  | aantal resultaten |  |
|  | type |  |  |  |  | Profile of Branch > geeft aan vanuit welk perspectief het endpoint gebruikt werd. De eerste <status> node van elk item is die van dit perspectief. |  |
|  |  |  |  |  |  |  |  |
| items |  |  |  |  |  |  |  |
|  | item |  |  |  | @available @extid | beschikbaarheidsstatus voor het extid; belangrijkste informatie is het @available attribuut |  |
|  |  | status |  |  | @status @location @translation @wise-status @wise-status-translated | beschikbaarheidsstatus voor het gekozen perspectief (profiel of branch) |  |
|  |  | status |  |  | @status @location @translation @wise-status @wise-status-translated | eventuele 2de status, is er enkel als op het gekozen perspectief van de eerste status alle exemplaren uitgeleend zijn. Deze tweede status toont dan de beschikbaarheid op profiel (voor bibs met meerdere filialen/branches) of regio-niveau. Dat regio-niveau is er bovendien enkel bij een beperkte subset van bibliotheken. |  |

## Resolver XML

| Resolver XML | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 | Col9 | Col10 | Col11 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  | Attributen | Uitleg | example records API |
| root |  |  |  |  |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query | <https://cataloguswebservices.bibliotheek.be/wetteren/resolver/ean/?id=8712273105154&authorization=YOUR_API_KEY> |
| meta |  |  |  |  |  |  |  |  |  |  |
|  | rctx |  |  |  |  |  |  |  | rctx-parameter |  |
| results |  |  |  |  |  |  |  |  |  |  |
|  | result |  |  |  |  |  |  | @id | id van de request |  |
|  |  | itemid |  |  |  |  |  | @frabl | reeks van itemid's die de identifier bevatten |  |

## Refine XML

| REFINE XML | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  | Attributen | Uitleg | Voorbeeldrecord |
| root |  |  |  | @version @time-taken | Versie van de api en tijd voor uitvoering query | <https://cataloguswebservices.bibliotheek.be/wetteren/refine/?authorization=YOUR_API_KEY&lang=nl&count=20&rctx=AWWMQQ7BQBRA@7QpEXECkVjayCBxAgeR6cxPDe3@9Tut6F3EHezdwg1snMAa20re5r3FUxAPoQ9Lcdn5sChsbXm9XDVnFLE$HPexgkFhPEEME1f7FslNWyZC6qiKx34raKsSpTQZJqtFBI9rdLurL733M1Kz10Z1LyNuPHEKABelhTno3B9r73TqU8KgmavQ5MaQQ0Gap6bCvyaG7M4Jl45PpE8Ywq@3a8khoVx9AA==> |
| meta |  |  |  |  |  |  |
|  | original-query |  |  |  | Indien query met rctx (context), de query die werd gebruikt. |  |
| facet |  |  |  | @id @translation | id = id van het facet<br>translation = vertaling voor facet in taal van lang |  |
| detail-page | value |  |  | @count @id @translation | count = aantal keren dat term voorkomt<br>id = id van de term<br>translation = vertaling |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |
| FASE 2 |  |  |  |  |  |  |
| branches |  |  |  |  |  |  |
|  | branch |  |  |  | op basis van profiel: enkel holdings van dat profiel |  |
| dates |  |  |  |  |  |  |
|  | dateentered |  |  |  |  |  |
|  | datemutated |  |  |  |  |  |
|  | dateimported |  |  |  |  |  |
| identifiers | M4Bworkid |  |  |  | nog niet in datamodel | [http://zoeken.provant.bibliotheek.be/api/v0/details/?id=\|library/marc/vlacc\|8754839&authorization=YOUR_API_KEY](http://zoeken.provant.bibliotheek.be/api/v0/details/?id=%7Clibrary/marc/vlacc%7C8754839&authorization=YOUR_API_KEY) |
| authors | author |  |  |  | nog attributen nodig: @firstname @lastname @weight(=m/c) @note @function @extrafunction |  |
| id @nativeid @ds |  |  |  |  | nativeid inclusief prefix |  |
| identifiers | vlaccmagazine-id |  |  |  | @note | [http://zoeken.provant.bibliotheek.be/api/v0/details/?id=\|library/marc/vlacc\|846002&authorization=YOUR_API_KEY](http://zoeken.provant.bibliotheek.be/api/v0/details/?id=%7Clibrary/marc/vlacc%7C846002&authorization=YOUR_API_KEY) |
| custom | siso-code |  |  |  | opsplitsen M21 084$a / 084$9 naar @note of zoiets |  |

## Errors

| Errors | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 | Col9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | Uitleg | Voorbeeld |  |  |  |  | Voorbeeldrecord in AquaBrowser |
| Buiten de standaard http-errors zijn er nog applicatie-specifieke errors: |  |  |  |  |  |  |  |  |
| Catalogus Webservices |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |
|  | No result | In dat geval is count = 0 .<br>Respons bevat een extra element feedbacks met als element parent-site/parents . <br>Deze bevat de URL van de bovenliggende catalogus. Deze URL kan gebruikt worden om de query daar te herhalen. | <http://cataloguswebservices.bibliotheek.be/wetteren/search/?q=hfjdqshfsq&authorization=YOUR_API_KEY> |  |  |  |  |  |
|  | Foute autorisatie | Bevat een error-block met een error/code en error /reason-element. | <http://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY> |  |  |  |  |  |
|  | Fout in een waarde van de parameters (bv. lang=not): | Bevat een error-block met een error/code en error /reason-element. | <http://cataloguswebservices.bibliotheek.be/wetteren/search/?q=test&authorization=YOUR_API_KEY&lang=not> |  |  |  |  |  |

## Datafields background

| Formats/format@text | opmerkingen | Description | Vlacc velden (ZBB) | Lookup Index | Lookup Fields | Notes | Vubis velden (Bruno) | Lookup Index (Bruno) | Lookup Fields (Bruno) | Notes (Bruno) | Vubis velden (Limburg) | Lookup Index (Limburg) | Lookup Fields (Limburg) | Notes (Limburg) | Vubis velden (Winob) | Lookup Index (Winob) | Lookup Fields (Winob) | Notes (Winob) | Vubis velden (Ovinob) | Lookup Index (Ovinob) | Lookup Fields (Ovinob) | Notes (Ovinob) | Aleph velden (Vl-Br) | Lookup Index (Vl-Br) | Lookup Fields (Vl-Br) | Notes (Vl-Br) | Brocade velden (Provant) | Lookup Index (Provant) | Lookup Fields (Provant) | Notes (Provant) | Testlink | Bibno |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| id/@extID |  |  | 001 |  |  | extID="\|library/marc/vlacc\|7131638" |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| authors/author/@type @main | primaire auteur: @weight=1<br><br>authors/author/@authorid/key @weight @function @birthdate @deathdate <br>firstname \| lastname \| extrafunction | type=auteursfunctie<br>main=primair | 100, 110 | author | 100abcdq , 110abcd | subveld (\|e) tussen haakjes, leefdata (\|d) tussen haakjes, ($q) tussen haakjes | 700$b a d f q, 702$b a d f q | author | 700badfq, 702badfq | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes, leefdata ($f) tussen haakjes | 700$b a d f q | author | 700badfq | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes, leefdata ($f) tussen haakjes | 700$b a d f q | author | 700badfq | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes, leefdata ($f) tussen haakjes | 700$b a d f q | author | 700badfq | label=$4, subveld ($g) aanvullende functievermelding tussen haakjes, leefdata ($f) tussen haakjes | 100, 110 | author | 100abcdq , 110abcd |  | 100, 110 | author | 100abcdq , 110abcd | nu kunstmatig opgevuld met eerste 'aut' van het record (gevraagd aan Brocade om ongeachte functie eerste auteur te nemen) |  |  |
| authors/author/@type | secundaire auteur: @weight=2<br><br>idem | auteursfunctie (\|4) | 700, 710 | author | 700abcdq , 710abcd | subveld (\|e) tussen haakjes, leefdata (\|d) tussen haakjes, ($q) tussen haakjes | 710$a b d  f, 711$a b d  f, 712$a b d  f | author | 710abdf, 711abdf, 712abdf | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes | 710$a b d  f | author | 710abdf | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes | 710$a b d  f | author | 710abdf | label=$4, subveld ($5) aanvullende functievermelding tussen haakjes | 710$a b d  f | author | 710abdf | label=$4, subveld ($g) aanvullende functievermelding tussen haakjes | 700, 710 | author | 700abcdq , 710abcd |  | 700, 710 | author | 700abcdq , 710abcd | (instrumentennamen ook in $4, $e niet in gebruik) |  |  |
| awards/award | naar notes? | Bekroning | 586\|a, 9 | award | 586a |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 586\|a, 9 | award | 586a |  |  |  |  |  |  |  |
| children/child | lijst id's van children en children xml apart op te halen?<br>ook custom in gebruik voor artikels | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| classifications | hier EN SISO EN ZIZO onderbrengen |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| coverimage/location |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| coverimage/caption |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| custom/kijkwijzer | van custom naar classifications | Kijkwijzer | 091\|a |  |  | icoon bv. bibno:8287569, verschillende iconen naast elkaar plaatsen, tooltip met verwoording uit 091\|9 + eventueel ontdubbelen labels |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien | 091\|a |  |  |  | 091\|a |  |  | indien 650\|2 begint met a::kijk | #REF! | ?itemid=\|library/marc/vlacc\|2926775 |
| custom/mc | van custom naar classifications | Rubriek | 097\|a - 9 |  |  |  |  |  |  | 697 niet tonen, enkel tonen in PK |  |  |  | 697 niet tonen, enkel tonen in PK |  |  |  | 697 niet tonen, enkel tonen in PK |  |  |  | 697 niet tonen, enkel tonen in PK |  |  |  | 097 niet tonen, enkel tonen in PK |  |  |  | 650\|a (indien \|2 begint met a::mcv) niet tonen, enkel tonen in PK | #REF! | ?itemid=\|library/marc/vlacc\|6916471 |
| custom:marc/marcleader |  | MARC leader |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| custom/nblc | van custom naar classifications | nblc | 095\|a - 9 |  |  |  |  |  |  | 693 niet tonen, enkel tonen in PK |  |  |  | 693 niet tonen, enkel tonen in PK |  |  |  | 693 niet tonen, enkel tonen in PK |  |  |  | 693 niet tonen, enkel tonen in PK | 095\|a - 9 |  |  |  | 095\|a - 9 |  |  |  |  |  |
| custom/pegi | van custom naar classifications | PEGI | 092\|a |  |  | icoon bv. bibno:8218348, verschillende iconen naast elkaar plaatsen, tooltip met verwoording uit 092\|9 + eventueel ontdubbelen labels |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien | 092\|a |  |  |  | 092\|a |  |  | indien 650\|2 begint met a::pegi | #REF! | ?itemid=\|library/marc/vlacc\|7889539 |
| custom/platform | naar notes? | Platform | 692\|a | platform | 692\|a |  |  |  |  | nog geen veld voorzien |  |  |  | nog geen veld voorzien | 216$4 |  |  | niet in Winob [PL] | 216$4 |  |  | nog geen veld voorzien | 692\|a | platform | 692\|a |  | 650\|a | platform | 650\|a | indien 650\|2 begint met a::pf | #REF! | ?itemid=\|library/marc/vlacc\|8019246 |
| custom/siso | van custom naar classifications | SISO | 084\|9 a |  |  |  |  |  |  | 690 niet tonen, enkel tonen in PK |  |  |  | 690 niet tonen, enkel tonen in PK |  |  |  | 690 niet tonen, enkel tonen in PK |  |  |  | 690 niet tonen, enkel tonen in PK |  |  |  | 084 niet tonen, enkel tonen in PK |  |  |  | 084\|a (indien \|2 begint met a::sis) niet tonen, enkel tonen in PK |  |  |
| custom/vlaccmagazine | nu niet in output=xml?<br><br>naar identifiers | > | 022\|y article count | link naar artikelen op 022\|y |  | bij tijdschrift |  |  |  | geen artikels in Bruno |  |  |  | geen PBS-records met relatie tijdschrift-artikels, enkel Vlacc tijdschriften-artikels |  |  |  | idem | 011$y article count |  |  | bij tijdschrift |  |  |  | geen PBS-records met relatie tijdschrift-artikels, enkel Vlacc tijdschriften-artikels |  |  |  | geen PBS-records met relatie tijdschrift-artikels, hoeven niet ingeladen te worden | #REF! |  |
| custom/webwijzerrubriek |  | webwijzerrubriek | 691\|a > x > y > z |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 691\|a > x > y > z |  |  |  | 691\|a > x > y > z |  |  |  |  |  |
| custom/zizo | van custom naar classifications | Rubriek | 693\|z of y of x of a | zizocode | 693\|9 | indien $z, $z tonen / indien geen $z en wel $y, $y tonen etc. / indien geen $y en wel $x, $x tonen, ... |  |  |  | 696 niet tonen, enkel tonen in PK |  |  |  | 696 niet tonen, enkel tonen in PK |  |  |  | 696 niet tonen, enkel tonen in PK |  |  |  | 696 niet tonen, enkel tonen in PK |  |  |  | 693 niet tonen, enkel tonen in PK |  |  |  | 084\|a (indien \|2 begint met a::ziz = zizo jeugd)<br>650\|a (indien \|2 begint met a::ziz = zizo volwassenen)<br>niet tonen, enkel tonen in PK | #REF! | ?itemid=\|library/marc/vlacc\|2297913 |
| custom/undupfeedback |  | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| description/pages | naar result list xml zie PDK_API_services |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| description/physicaldescription |  | Kenmerken | 300\|a : b ; c + e |  |  |  | 215$a $i: c ; d g + e |  |  |  | 215$a i: c ; d g + e |  |  |  | 215$a i: c ; d g + e |  |  |  | 215$a i: c ; d g + e |  |  |  | 300\|a : b ; c + e |  |  |  | 300\|a : b ; c + e |  |  |  |  |  |
| description/playingtime |  | Speelduur | 306\|a |  |  |  | 215$f |  |  |  | 215$f |  |  |  | 215$f |  |  |  | 215$f |  |  |  | 306\|a |  |  |  | 306\|a |  |  |  |  |  |
| description/publicationfrequency |  | Verschijnt | 310 |  |  |  | geen |  |  |  | geen |  |  |  | geen |  |  |  | geen |  |  |  | 310 |  |  |  | 310 |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|1580340 |
| formats/format@text | verwoording! |  |  |  |  | bv. Book > Nederlands? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| genres/genre |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| holdingscount |  |  |  |  |  | aantal keer bezit in de AquaBrowser instantie |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| identifiers/ean |  | EAN | 024 (ind1 = 3)\|az (9) |  |  | '$9 tussen haakjes tonen als die er is | 015$a<br>015$z |  |  | !!! er zijn mogelijk records waar voor verschillende EAN's verschillende $a zijn binnen hetzelfde veld | 015$a (d)<br>015$z (d) |  |  |  | 015$a (9)<br>015$z (9)[PL] OK |  |  | !!! er zijn mogelijk records waar voor verschillende EAN's verschillende $a zijn binnen hetzelfde veld | 015$a (9)<br>015$z (9) |  |  |  | 024 (ind1 = 3)\|az (9) |  |  |  | 024 (ind1 = 3)\|az (9) |  |  |  | #REF! |  |
| identifiers/isbn | paperback tussen haakjes veranderen naar een @ | ISBN | 020\|a z (9) | - | - | '$9 tussen haakjes tonen als die er is (wat indien twee keer $9???) | 010$a (b)<br>010$z (b) |  |  | !!! er zijn records waar voor verschillende ISBN's verschillende $a zijn binnen hetzelfde veld | 010$a (d)<br>010$z (d) |  |  |  | 010$a (9)<br>010$z (9)<br>[PL] OK |  |  | !!! er zijn records waar voor verschillende ISBN's verschillende $a zijn binnen hetzelfde veld | 010$a (9)<br>010$z (9) |  |  |  | 020\|a z (9) | - | - |  | 020\|a z (9) | - | - |  | #REF! |  |
| identifiers/ismn |  | ISMN | 024 (ind1 = 2)\|az (9) |  |  | '$9 tussen haakjes tonen als die er is | 013$a<br>013$z |  |  |  | 013$a (d)<br>013$z (d) |  |  |  | 013$a (9)<br>013$z (9)[PL] OK |  |  |  | 013$a (9)<br>013$z (9) |  |  |  | 024 (ind1 = 2)\|az (9) |  |  |  | 024 (ind1 = 2)\|az (9) |  |  |  | #REF! |  |
| identifiers/issn |  | ISSN | 022\|az (9) | - | - | '$9 tussen haakjes tonen als die er is | 011$a (b)<br>011$z (b) |  |  |  | 011$a (d)<br>011$z (d) |  |  |  | 011$a (9)<br>011$z (9)[PL] OK |  |  |  | 011$a (9)<br>011$z (9) |  |  |  | 022\|az (9) | - | - |  | 022\|az (9) | - | - |  | #REF! |  |
| identifiers/publishernumber |  | Uitgeversnummer | 028\|a (9) |  |  | '$9 tussen haakjes tonen als die er is | 071$a |  |  |  | 071$a (d) |  |  |  | 071$a (9)[PL] OK |  |  |  | 071$a (9) |  |  |  | 028\|a (9) |  |  |  | 028\|a (9) |  |  |  | #REF! |  |
| labels/label |  | Etiketveld | 999\| a b c d e f z |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| languages/language | gecodeerd nu bv. eng > we willen verwoording | Taal | 008 pos 35-37 + 041\|a |  |  | indien 008 = mul, wordt 'meertalig' getoond met 041\|a tussen haakjes<br>indien taal 'und' veld niet tonen bv. muziekrecords | 101$a |  |  | veld is herhaalbaar (talen scheiden met komma) | 101$a |  |  | indien meerdere talen scheiden met komma, veld is herhaalbaar (talen scheiden met komma) | 101$a |  |  | veld is herhaalbaar (talen scheiden met komma) | 101$a |  |  | veld is herhaalbaar (talen scheiden met komma) | 008 pos 35-37 + 041\|a |  |  |  | 008 pos 35-37 + 041\|a |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|2926775 |
| languages/language/@from |  | Vertaald uit | 041\|h | - | - |  | 101$b |  |  |  | 101$b |  |  |  | 101$b |  |  |  | 101$b |  |  |  | 041\|h | - | - |  | 041\|h | - | - |  | #REF! | ?itemid=\|library/marc/vlacc\|8094913 |
| mydiscoveries/rating |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| mydiscoveries/reviews |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| mydiscoveries/tags |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| notes/audience@text | verwoording!<br>leeftijdscategorieën herleiden tot nummer (voor age picker) | Doelgroep | 521\|a | age | 521\|a | verwoording zie verfijningen | 698$a |  |  |  | 698$a |  |  |  | 692$4[PL] OK, wordt nu afgehandeld door het dimensie systeem. |  |  | zie mapping tabel tab 'Leeftijden' | 692$4 |  |  | zie mapping tabel tab 'Leeftijden' | 521\|a | age | 521\|a |  | 650\|a | age | 521\|a | indien 650\|2 bestaat en begint met a::dg, anders: 653\|a (zie verfijningen) |  |  |
| notes/categorie | hernoemen: NUR<br>naar classifications | rubriek | 096\|a (9) | nur | 096\|9 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 096\|a (9) | nur | 096\|9 |  |  |  |  |  |  |  |
| notes/note |  | Extra informatie | 500, 510, 546 |  |  |  | 303$a |  |  | allerlei opmerkingen: 'vertaald uit', 'onleend aan', 'een selectie uit', 'eerder verschenen bij' | 303$a |  |  |  | 303$a |  |  |  | 303$a |  |  |  | 500, 510, 546 |  |  |  | 500, 510, 546 |  |  |  | #REF! |  |
| notes/note | hernoemen: contentsnote<br>notes/contentsnote/title \| author (zie author) | Bevat | 505\|a t / r (g) |  |  |  | 327a $t / r (g) |  |  |  | 327$a t / r (g) |  |  |  | 327$a t / r (g) |  |  |  | 327$a t / r (g) |  |  |  | 505\|a t / r (g) |  |  |  | 505\|a t / r (g) |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|3144597 |
| notes/readinglevel | naar classifications | Leesniveau | 090\| |  |  |  | 692$a |  |  |  | 692$a |  |  |  | 694$4[PL] OK check verwoording! |  |  |  | 694$4 |  |  |  | 090\| |  |  |  | 650\|a |  |  | indien 650\|2 begint a::avi (is gevraagd aan Brocade) |  |  |
| notes/recordingdate |  | Opnamedatum | 518 |  |  |  | 305$a |  |  |  | 305$a |  |  |  | 305$a |  |  |  | 305$a |  |  |  | 518 |  |  |  | 518 |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|3183765 |
| notes/targetaudience | is notes/audience geworden |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| notes/technicalinfo |  | Systeemvereisten | 538 |  |  |  | 215$h |  |  |  | 215$h |  |  |  |  |  |  | niet in Winob |  |  |  | 215$f in dubbel gebruik met speelduur | 538 |  |  |  | 538 |  |  |  |  |  |
| notes/type | naar type | type | type (zie verfijning) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | type (zie verfijning) |  |  |  |  |  |  |  |  |  |
| parents/parent @isclassical @ismusic | parent id en parent xml apart op te halen?<br>ook custom ingebruik voor magazine (titles issn custom/magazineinfo) | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| publication/edition |  | Editie | 250\|a | - | - |  | 205$a / f g |  |  |  | 205$a / f g |  |  | Alleen a en f in gebruik | 205$a / f g |  |  | Alleen $a in gebruik | 205$a / f g |  |  | Alleen $a in gebruik | 250\|a | - | - |  | 250\|a | - | - |  | #REF! | ?itemid=\|library/marc/vlacc\|7677400 |
| publication/originalpublisher | publication @originalpublisher | Oorspronkelijke uitgever | 534\|c | publisher | 534c |  | geen |  |  |  | geen |  |  |  | geen |  |  |  | geen |  |  |  | 534\|c | publisher | 534c |  | 534\|c | publisher | 534c |  | #REF! | ?itemid=\|library/marc/vlacc\|8112044 |
| publication/projectedpublicationdate |  | Verschijningsdatum | 263\|a |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|8206244 |
| publication/place : publication/publisher, publication/year |  | Uitgave | 260\|a : b, c | publisher | 260b | hier niets strippen wel [s.l.], [s.n.] en [s.a.] of [s.d.] vervangen door respectievelijk geen plaats van uitgave, geen uitgever, geen jaar van uitgave, zonder rechte haken | 210$a : 4, d | publisher | 210$4 |  | 210$a : 4, d (e, g, h) | publisher | 210$4 | Extra subvelden in gebruik bij speciale collecties: $e (plaats van druk), $g (drukker) en $h (jaar van druk) | 210$a : 4, d | publisher | 210$4 |  | 210$a : 4, d | publisher | 210$4 |  | 260\|a : b, c | publisher | 260b |  | 260\|a : b, c | publisher | 260b |  | #REF! | ?itemid=\|library/marc/vlacc\|8231585 |
| publication/scale |  | Schaal | 255\|a |  |  |  | 205$a |  |  | 215? | 205$a |  | 215? |  | geen |  |  |  | geen |  |  |  | 255\|a |  |  |  | 255\|a |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|2697254 |
| raw/d |  |  |  |  |  | m21 df in <d> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields |  |  |  |  |  | andere velden oa <branches>, metavelden |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields/enriched_info |  | mappen! |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields/branches/branches@key |  |  |  |  |  | @key a=locatiecode<br>rss=dateacquired<br>id=barcode<br>nm=matchingcategorie |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields/branches_t |  |  |  |  |  | branch verwoording bv. Zaventem_Hoofdbibliotheek |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields/dateentered |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| raw/fields/datemutated |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| reviews/review@volume |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| rssdate | zie xml holding | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| series/serie |  | Reeks | 440\|a : b (c). n,  p ; v | series | 440abcnp | enkel 440\|abcnp hyperlinken, \|v niet<br>punt voor $n | 225$a : e (f) h, i ; v | series | 225aefhi |  | 225$a : e (f) h, i ; v | series | 225aefhi |  | 225$a : e (f) h, i ; v | series | 225aefhi |  | 225$a : e (f) h, i ; v | series | 225aefhi |  | 440\|a : b (c)  n,  p ; v | series | 440abcnp |  | 490\|a : b (c)  n,  p ; v | series | 490abcnp |  | #REF! | ?itemid=\|library/marc/vlacc\|1831168 |
| subjects/corporate | @type=vth, vtr, vge, jge, jtr, jth, mge<br>ontdubbeld? |  | 610\|a. b d [c] ; t ; x |  |  | NIET 9=vge of jge of mge |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 610\|a. b d [c] ; t ; x |  |  | NIET 9=vge of jge of mge | 610\|a. b d [c] ; t ; x |  |  | niet |  |  |
| subjects/genre | ontdubbeld? | Genre | 650\|a ; x | subject, genre |  | ALS 9=vge of jge of mge | 634$a | subject, genre | 634a | enkel 'muziektrefwoorden', andere genres zitten tussen de thema's | 634$a<br>691$a<br>695$a | subject, genre | 634a, 691$a, 695$a | 634$a (mge)<br>691$a (vge)<br>695$a (jge) | 634$a, 691$a, 695$a [PL] OK | subject, genre | 634a, 691a, 695a | 634$a (mge)<br>691$a (vge)<br>695$a (jge) | 634$a, 691$a, 695$a | subject, genre | 634a, 691a, 695a | 634$a (mge)<br>691$a (vge)<br>695$a (jge) | 650\|a ; x | subject, genre |  | ALS 9=vge of jge of mge | 650\|a | subject, genre |  | indien 650\|2 begint met a::mgv<br>indien 650\|2 begint met a::gen<br>indien 650\|2 begint met a::jge (is gevraagd aan Brocade) | #REF! | ?itemid=\|library/marc/vlacc\|2910728 |
| subjects/personal | @function (nu (personage) tussen haakjes) - enkel hier bij personal!<br>ontdubbeld? | Onderwerp | 600\|a b d q [c] ; t ; x | subject |  | NIET 9=vge of jge of mge | 630$a<br>631$a<br>632$a<br>633$a<br>699$a | subject | 630a, 631a, 632a, 633a, 699a | 630$a (vtr)<br>631$a (vth)<br>632$a (jtr)<br>633$a (jth)<br>699$a (lokaal veld)<br>geen geledingen, enkel interpunctie (_;_) | 630$a<br>631$a<br>632$a<br>633$a<br>656$a<br>657$a<br>658$a | subject | 630a, 631a, 632a, 633a, 656a, 657a, 658a | 630$a (vtr)<br>631$a (vth)<br>632$a (jtr)<br>633$a (jth)<br>656$a (lokaal vtr of vth)<br>657$a (lokaal jtr of jth)<br>658$a (lokaal mge)<br>geen geledingen, enkel interpunctie (_;_) | 630$a<br>631$a<br>632$a<br>633$a[PL] OK | subject | 630a, 631a, 632a, 633a | 630$a (vtr)<br>631$a (vth)<br>632$a (jtr)<br>633$a (jth)<br>geen geledingen, enkel interpunctie (_;_) | 630$a<br>631$a<br>632$a<br>633$a | subject | 630a, 631a, 632a, 633a | 630$a (vtr)<br>631$a (vth)<br>632$a (jtr)<br>633$a (jth)<br>geen geledingen, enkel interpunctie (_;_) | 600\|a b d q [c] ; t ; x | subject |  | NIET 9=vge of jge of mge | 600\|a b d q [c] ; t ; x |  |  | niet |  |  |
| subjects/topical | ontdubbeld? |  | 650\|a ; x |  |  | NIET 9=vge of jge of mge |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 650\|a ; x<br>690\|a ; x |  | !!! 690 is enige verschil met implementatie zbb | NIET 9=vge of jge of mge | 650\|a | subject |  | indien 650\|2 begint met a::hj (jth)<br>indien 650\|2 begint met a::tj (jtr)<br>indien 650\|2 begint met a::hv (vth)<br>indien 650\|2 begint met a::tv (vtr)<br>geen geledingen, enkel interpunctie (_;_) | #REF! | ?itemid=\|library/marc/vlacc\|2910728 |
| subjects/local | ontdubbeld? | Lokaal onderwerp |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| summaries/summary |  | Samenvatting | 520\|a |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| titles/origintitle | titles/title @origintitle | Oorspronkelijke titel | 534\|a | GEEN |  |  | 334$a |  |  |  | 334$a |  |  |  | 334$a |  |  |  | 334$a |  |  |  | 534\|a |  |  |  | 534\|a |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|7599494 |
| titles/othertitle |  | Andere titel | 246\|a : b. n, p / c | - | - |  | 200$d<br>517$a : e b. h, i |  |  | 200$d parallelle titel, 517 variante titel | 200$d<br>517$a : e b. h, i |  |  | 200$d parallelle titel, 517 variante titel | 202$a : e<br>517$a : e b. h, i<br>[PL] OK |  |  | 202 parallelle titel, 517 variante titel (geen $b) | 202$a : e<br>517$a : e b. h, i |  |  | 202 parallelle titel, 517 variante titel (geen $b) | 246\|a : b. n, p / c | - | - |  | 246\|a : b. n, p / c | - | - |  | #REF! | ?itemid=\|library/marc/vlacc\|6679020 |
| titles/title |  | Titel | 245\|a : b. n, p / c | - | - | [et al.] in de data in \|c vervangen door 'en anderen' | 200$a : e. h, i / f |  |  |  | 200$a : e. h, i / f |  |  |  | 200$a : e. h, i / f |  |  |  | 200$a : e. h, i / f |  |  |  | 245\|a : b. n, p / c | - | - |  | 245\|a : b. n, p | - | - | nu /c dubbelop met auteur, gevraagd aan Brocade om /c te verwijderen in data | #REF! | ?itemid=\|library/marc/vlacc\|6796890 |
| titles/uniformtitle |  | Uniforme titel | 130\|a m n r f g p k o s, 240\|a m n r f g p k o s | utitle | 130, 240 | juiste interpunctie > aanvullen | 500$a r, s u, k, "n". i. l; w (q) | utitle | 500arsuknilwq |  | 500$a r, s u, k, "n". i. l; w (q) | utitle | 500arsuknilwq |  | 500$a r, s u, k, "n". i. l; w (q) | utitle | 500arsuknilwq |  | 500$a r, s u, k, "n". i. l; w (q) | utitle | 500arsuknilwq |  | 130\|a m n r f g p k o s, 240\|a m n r f g p k o s | utitle | 130, 240 |  | 130\|a m n r f g p k o s, 240\|a m n r f g p k o s | utitle | 130, 240 | niet in eigen PBS-records |  |  |
| titles/shorttitle | niet juist = subtitle | Ondertitel | 245$b |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| undup |  | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| websites/website/@url\|@linktext\|@note |  | Website | 856\|y of u |  |  | hyperlink, indien een $y = verwoording tonen, anders gewoon $u | 856$g of u |  |  |  | 856$g of u |  |  |  | 856$g of u |  |  |  | 856$g of u |  |  |  | 856\|y of u |  |  |  | 856\|y of u |  |  |  | #REF! | ?itemid=\|library/marc/vlacc\|7340732 |
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Outside <record> |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| googlebooks/url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| librarything/librarythinginfo@url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| itunes@url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| bibnetwebservice@url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| spotify@url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| meerovermedia@url |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| availability/page |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| socialsharing/facebook |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| socialsharing/twitter |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| socialsharing/email |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| data | ? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| knack |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| librarythingrecommendations |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
