/**
 * SwissMap is an object to control a SVG map
 *
 * @param html node wrapperElement HTML element than wrap the map.
 * @param object mapData        JSON with the different region
 * @param string initialPlaceID  the first place to load
 * @param string placeID        Place to load initially
 */
function SwissMap(wrapperElement, mapData, initialPlaceID, options){
  this.mapData = mapData;
  this.wrapperElement = wrapperElement;
  this.initialPlaceID = initialPlaceID;

  this.svg_map = null;
  this.currentSVG = null;
  this.currentRegionID = null;
  this.overRegionID = null;
  var self = this;

  // Default options
  this.options = {
    "overColor" : "#B3D259",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#8DB63F",
    "mosueClickCallback" : null,
    "mouseOnCallback" : null,
    "mouseOutCallback" : null,
    "mapsRootPath" : 'maps',
    'overLabel' : null,
    'backButton' : null,
    'currentTitle' : null
  };

  // Overwrite default value
  for(var item in options) {
    this.options[item] = options[item];
  }

  // If we don't have element for label and title
  // Put some defaultf
  if(this.options.overLabel === null){
    this.options.overLabel = this.wrapperElement.querySelector('.swissmapMouseOverLabel');
  }
  if(this.options.backButton === null){
    this.options.backButton = this.wrapperElement.querySelector('.swissmapBack');
  }
  if(this.options.currentTitle === null){
    this.options.currentTitle = this.wrapperElement.querySelector('.swissmapCurrentTitle');
  }

  //event listener for back button
  this.options.backButton.addEventListener('click',function(e){
    e.preventDefault();
    self.unZoom(e);
  },false);
}

/**
 * Fire!
 */
SwissMap.prototype.init = function(){
  if(this.options.initialPlaceID  !== null){
    this.loadRegionSVG(this.initialPlaceID);
  }
};

SwissMap.prototype.loadRegionSVG = function(regionID){
  this.currentRegionID = regionID;
  this.loadSVG(this.mapData[regionID].file);
};

/**
 * Load SVG
 *
 * @param  string currentSVG  SVG to load
 */
SwissMap.prototype.loadSVG = function(currentSVG){
  this.currentSVG = currentSVG;
  var currentSVGObject = document.createElement('object', true);
  currentSVGObject.setAttribute('type', 'image/svg+xml');
  currentSVGObject.setAttribute('data', this.options.mapsRootPath + '/' + this.currentSVG);
  var self = this;
  currentSVGObject.addEventListener('SVGLoad' ,function(e) {
      self.svgLoaded(e,this);
    }, false);
  //remove old svg files
  this.removeSVGObjects();
  //Create new one
  this.svg_map = svgweb.appendChild(currentSVGObject, this.wrapperElement);
};

/**
 * Remove any old SVG objects that might be around
 */
SwissMap.prototype.removeSVGObjects = function(){
  var childNodeNb = this.wrapperElement.childNodes.length;
  for (var i = 0; i < childNodeNb ; i++) {
    var child = this.wrapperElement.childNodes[i];
    if (child.nodeType === 1 && (child.className.indexOf('embedssvg') !== -1 || child.getAttribute('type') === 'image/svg+xml')) {
      try {
        svgweb.removeChild(child, this.wrapperElement);
      } catch (exp) {
        console.log('Error removing child: ' + (exp.message || exp));
      }
    }
  }
};

SwissMap.prototype.unZoom = function(){
  this.loadRegionSVG(this.currentRegionID);
};


SwissMap.prototype.updateLabel = function(){
  var textLabel = this.mapData[this.overRegionID].name;
  var label = document.createTextNode(textLabel);
  this.options.overLabel.innerHTML = textLabel;
};


/**
 * Listener of SVGLoad, fired when an svg is loaded
 * @param  event e
 * @param  svg object svgInstance the svg than was loaded
 * @see SwissMap.prototype.loadSVG
 */
SwissMap.prototype.svgLoaded = function(e, svgInstance){
  //get the content of the SVG
  this.svg_map = svgInstance.contentDocument;
  //bind event
  this.bindEventToSVG();
};


/**
 * We bind event listener on SVG element than was find in the mapData (match on ID)
 */
SwissMap.prototype.bindEventToSVG = function(){
  var self = this;
  var mapElement;
  for(var id in this.mapData){
    if(this.mapData[id].file === this.currentSVG){
      mapElement = this.svg_map.getElementById(id);
      if(mapElement !== null){
        mapElement.addEventListener('mouseup', function(e) {
          self.onMouseUp(e);
        }, false);
        mapElement.addEventListener('mouseover', function(e) {
          self.onMouseOver(e);
        }, false);
        mapElement.addEventListener('mouseout', function(e) {
          self.onMouseOut(e);
        }, false);
    }
    }
  }
};

//---Event listeners

SwissMap.prototype.onMouseUp = function(e){
  var data = this.mapData[e.target.id];
  // Load as a children SVG if specified in the element
  if(typeof data.children_file  !== undefined){
    this.loadSVG(data.children_file);
  }

  if(typeof this.mosueClickCallback === "function") {
    this.mosueClickCallback.call(this, e.target.id, e.target, data);
  }
};
SwissMap.prototype.onMouseOver = function(e){
  this.overRegionID = e.target.id;
  e.target.setAttribute('fill', this.options.overColor);
  this.updateLabel();
  if(typeof this.mouseOnCallback === "function") {
    this.mouseOnCallback.call(this, e.target.id, e.target, data);
  }
};

SwissMap.prototype.onMouseOut = function(e){
  e.target.setAttribute('fill', this.options.normalColor);
  if(typeof this.mouseOutCallback === "function") {
    this.mouseOutCallback.call(this, e.target.id, e.target, data);
  }
};


//start after svgweb is ready
window.onsvgload = function(){
  makeMyMap();
};


function makeMyMap(){

  var mapData = {
    "swiss": { "name" : "Suisse", "type": "country","file":"suisse.svg" },

    // Cantons
    "VS": { "name" : "Valais", "type": "canton","file":"suisse.svg", "children_file": 'district_VS.svg'},
    "GE": { "name" : "Geneva", "type": "canton", "file":"suisse.svg", "children_file": 'district_GE.svg'},
    "BE": { "name" : "Bern", "type": "canton", "file":"suisse.svg", "children_file": 'district_BE.svg'},
    "VD": { "name" : "Vaud", "type": "canton", "file":"suisse.svg", "children_file": 'district_VD.svg'},
    "FR": { "name" : "Fribourg", "type": "canton", "file":"suisse.svg", "children_file": 'district_FR.svg'},
    "JU": { "name" : "Jura", "type": "canton", "file":"suisse.svg", "children_file": 'district_JU.svg'},
    "TI": { "name" : "Tessin", "type": "canton", "file":"suisse.svg", "children_file": 'district_TI.svg'},
    "NE": { "name" : "Neuchâtel", "type": "canton", "file":"suisse.svg", "children_file": 'district_NE.svg'},
    "SA": { "name" : "Suisse Alémanique", "type": "canton", "file":"suisse.svg", "children_file": 'district_SA.svg'},

    // District VS
    "ofsnbr_2306" : { "name" : "Bezirk Leuk ", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2309" : { "name" : "Bezirk Raron", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2303" : { "name" : "District d'Entremont", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2301" : { "name" : "Bezirk Brig", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2305" : { "name" : "District d'Hérens", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2304" : { "name" : "Bezirk Goms", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2310" : { "name" : "District de Saint-Maurice", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2307" : { "name" : "District de Martigny", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2308" : { "name" : "District de Monthey", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2312" : { "name" : "District  de Sion", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2302" : { "name" : "District de Conthey", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2313" : { "name" : "Bezirk Visp", "file": 'district_VS.svg', 'parent' : 'VS'},
    "ofsnbr_2311" : { "name" : "District de Sierre", "file": 'district_VS.svg', 'parent' : 'VS'},

    // District GE
    "ofsnbr_2500" : { "name" : "District de Genève", "file": 'district_GE.svg', 'parent' : 'GE'},

    // District VD
    "ofsnbr_2222" : { "name" : "District de la Broye-Vully", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2223" : { "name" : "District du Gros-de-Vaud", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2227" : { "name" : "District de Morges", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2228" : { "name" : "District de Nyon", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2229" : { "name" : "District de l'Ouest lausannois", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2224" : { "name" : "District du Jura-Nord vaudois", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2225" : { "name" : "District de Lausanne", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2230" : { "name" : "District de la Riviera-Pays-d'Enhaut", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2221" : { "name" : "District d'Aigle", "file": 'district_VD.svg', 'parent' : 'VD'},
    "ofsnbr_2226" : { "name" : "District de Lavaux-Oron", "file": 'district_VD.svg', 'parent' : 'VD'},

    // District FR
    "ofsnbr_1001" : { "name" : "District de la Broye", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1002" : { "name" : "District de la Glâne", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1007" : { "name" : "District de la Veveyse", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1003" : { "name" : "District de la Gruyère", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1004" : { "name" : "District de la Sarine", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1006" : { "name" : "Bezirk Sense", "file": 'district_FR.svg', 'parent' : 'FR'},
    "ofsnbr_1005" : { "name" : "District du Lac", "file": 'district_FR.svg', 'parent' : 'FR'},

    // Distric JU
    "ofsnbr_2602" : { "name" : "District des Franches-Montagne", "file": 'district_JU.svg', 'parent' : 'JU'},
    "ofsnbr_2603" : { "name" : "District de Porrentruy", "file": 'district_JU.svg', 'parent' : 'JU'},
    "ofsnbr_2601" : { "name" : "District de Delémont", "file": 'district_JU.svg', 'parent' : 'JU'},

    // Distric NE
    "ofsnbr_2404" : { "name" : "District de Neuchâtel", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr_2405" : { "name" : "District du Val-de-Ruz", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr_2401" : { "name" : "District de Boudry", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr_2406" : { "name" : "District du Val-de-Travers", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr_2403" : { "name" : "District du Locle", "file": 'district_NE.svg', 'parent' : 'NE'},
    "ofsnbr_2402" : { "name" : "District de la Chaux-de-Fonds", "file": 'district_NE.svg', 'parent' : 'NE'}

  };

  var options = {
    "overColor" : "#c1aa5b",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#8DB63F",
    "selectedCallback" : null,
    "mapsRootPath" : 'maps'
  };

  var mapWrapper = document.getElementById('swissmap');
  var myMap = new SwissMap(mapWrapper, mapData, 'swiss' ,options);

  myMap.init();

}





