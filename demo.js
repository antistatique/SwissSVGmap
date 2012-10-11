//start after svgweb is ready
window.onsvgload = function(){
  makeMyMap();
};


function makeMyMap(){

  var mapData = {
    "swiss": { "name" : "Suisse", "type": "country","file":"suisse.svg" },

    // Cantons
    "VS": { "name" : "Valais", "type": "canton","file": 'district_VS.svg', "parent": "swiss"},
    "GE": { "name" : "Geneva", "type": "canton", "file": 'district_GE.svg', "parent": "swiss"},
    "BE": { "name" : "Bern", "type": "canton", "file": 'district_BE.svg', "parent": "swiss"},
    "VD": { "name" : "Vaud", "type": "canton", "file": 'district_VD.svg', "parent": "swiss"},
    "FR": { "name" : "Fribourg", "type": "canton", "file": 'district_FR.svg', "parent": "swiss"},
    "JU": { "name" : "Jura", "type": "canton", "file": 'district_JU.svg', "parent": "swiss"},
    "TI": { "name" : "Tessin", "type": "canton", "file": 'district_TI.svg', "parent": "swiss"},
    "NE": { "name" : "Neuchâtel", "type": "canton", "file": 'district_NE.svg', "parent": "swiss"},
    "SA": { "name" : "Suisse Alémanique", "type": "canton", "file": 'district_SA.svg', "parent": "swiss"},

    // District VS
    "ofsnbr2306" : { "name" : "Bezirk Leuk ", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2309" : { "name" : "Bezirk Raron", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2303" : { "name" : "District d'Entremont", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2301" : { "name" : "Bezirk Brig", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2305" : { "name" : "District d'Hérens", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2304" : { "name" : "Bezirk Goms", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2310" : { "name" : "District de Saint-Maurice", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2307" : { "name" : "District de Martigny", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2308" : { "name" : "District de Monthey", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2312" : { "name" : "District  de Sion", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2302" : { "name" : "District de Conthey", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2313" : { "name" : "Bezirk Visp", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr2311" : { "name" : "District de Sierre", "file": 'district_VS.svg', 'parent' : 'VS'},

    // District GE
    "ofsnbr2500" : { "name" : "District de Genève", "file": 'district_GE.svg', 'parent' : 'GE'},

    // District VD
    "ofsnbr2222" : { "name" : "District de la Broye-Vully", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2223" : { "name" : "District du Gros-de-Vaud", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2227" : { "name" : "District de Morges", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2228" : { "name" : "District de Nyon", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2229" : { "name" : "District de l'Ouest lausannois", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2224" : { "name" : "District du Jura-Nord vaudois", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2225" : { "name" : "District de Lausanne", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2230" : { "name" : "District de la Riviera-Pays-d'Enhaut", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2221" : { "name" : "District d'Aigle", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr2226" : { "name" : "District de Lavaux-Oron", "file": 'district_VD.svg', 'parent' : 'VD'},

    // District FR
    "ofsnbr1001" : { "name" : "District de la Broye", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1002" : { "name" : "District de la Glâne", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1007" : { "name" : "District de la Veveyse", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1003" : { "name" : "District de la Gruyère", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1004" : { "name" : "District de la Sarine", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1006" : { "name" : "Bezirk Sense", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr1005" : { "name" : "District du Lac", "file": 'district_FR.svg', 'parent' : 'FR'},

    // Distric JU
    "ofsnbr2602" : { "name" : "District des Franches-Montagne", "file": 'district_JU.svg', 'parent' : 'JU'},
    "ofsnbr2603" : { "name" : "District de Porrentruy", "file": 'district_JU.svg', 'parent' : 'JU'},
    "ofsnbr2601" : { "name" : "District de Delémont", "file": 'district_JU.svg', 'parent' : 'JU'},

    // Distric NE
    "ofsnbr2404" : { "name" : "District de Neuchâtel", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr2405" : { "name" : "District du Val-de-Ruz", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr2401" : { "name" : "District de Boudry", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr2406" : { "name" : "District du Val-de-Travers", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr2403" : { "name" : "District du Locle", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr2402" : { "name" : "District de la Chaux-de-Fonds", "file": 'district_NE.svg', 'parent' : 'NE'}

  };

  var options = {
    "overColor" : "#c1aa5b",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#e4d9b1",
    "selectedCallback" : null,
    "mapsRootPath" : 'maps',
    //This is just because IE7 don't understand querySelector
    'overLabel' : document.getElementById('swissmapMouseOverLabel'),
    'backButton' : document.getElementById('swissmapBack'),
    'currentTitle' : document.getElementById('swissmapTitle'),
    'breadcrumbEl' : document.getElementById('swissmapBreadcrumb')
  };

  var mapWrapper = document.getElementById('swissmap');
  var myMap = window.myMap = new SwissMap(mapWrapper, mapData, 'ofsnbr2226' ,options);

  myMap.init();

}
