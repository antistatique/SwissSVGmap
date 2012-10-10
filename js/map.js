/**
 * SwissMap is an object to control a SVG map
 *
 * @param html node wrapperElement HTML element than wrap the map.
 * @param object mapData        JSON with the different region
 * @param string defaultSVG     the SVG we load first or when none is specified in the place
 * @param string placeID        Place to load initially
 */
function SwissMap(wrapperElement, mapData, defaultSVG, options){
  this.mapData = mapData;
  this.defaultSVG = defaultSVG;
  this.wrapperElement = wrapperElement;

  this.svg_map = null;
  this.currentSVG = null;

  // Default options
  this.options = {
    "overColor" : "#B3D259",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#8DB63F",
    "mosueClickCallback" : null,
    "mouseOnCallback" : null,
    "mouseOutCallback" : null,
    "mapsRootPath" : 'maps',
    "initialPlaceID" : null,
    'overLabel' : null //dom element where we want to add the over information
  };

  // Overwrite default value
  for(var item in options) {
    this.options[item] = options[item];
  }
}

/**
 * Fire!
 */
SwissMap.prototype.init = function(){
  if(this.options.initialPlaceID  === null){
    this.loadSVG(this.defaultSVG);
  }else{
    this.loadSVG(this.options.initialPlaceID);
  }
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
  //currentSVGObject.setAttribute('svgName', svgName);
  /*if (TODO.width !== undefined) {
    currentSVGObject.setAttribute('width', TODO.width);
  }
  if (TODO.height !== undefined) {
    currentSVGObject.setAttribute('height', TODO.height);
  }*/
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

SwissMap.prototype.updateLabel = function(){

}


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
};

//---Event listeners

SwissMap.prototype.onMouseUp = function(e){
  var data = this.mapData[e.target.id];
  if(typeof data.children_file  !== undefined){
    this.loadSVG(data.children_file);
  }

  if(typeof this.mosueClickCallback === "function") {
    this.mosueClickCallback.call(this, e.target.id, e.target, data);
  }
};
SwissMap.prototype.onMouseOver = function(e){
  e.target.setAttribute('fill', this.options.overColor);
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
    // Cantons
    "VS": { "name" : "Valais", "type": "canton","file":"canton_tous.svg", "children_file": 'district_VS.svg'},
    "GE": { "name" : "Geneva", "type": "canton", "file":"canton_tous.svg", "children_file": 'district_GE.svg'},
    "BE": { "name" : "Bern", "type": "canton", "file":"canton_tous.svg", "children_file": 'district_BE.svg'},
    "VD": { "name" : "Vaud", "type": "canton", "file":"canton_tous.svg", "children_file": 'district_VD.svg'},

    // District VS
    "2303" : { "name" : "District d'Entremont", "file": 'district_VS.svg', 'parent' : 'VS'}
  };

  var options = {
    "overColor" : "#B3D259",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#8DB63F",
    "selectedCallback" : null,
    "mapsRootPath" : 'maps'
  };

  var mapWrapper = document.getElementById('swissmap');
  var myMap = new SwissMap(mapWrapper, mapData,'canton_tous.svg',options);

  myMap.init();

}





