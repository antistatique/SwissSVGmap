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
  this.currentSvgFile = null;
  this.currentRegionID = null;
  this.overRegionID = null;
  this.selectedRegions = {};
  this.originalSvgData = {};
  this.breadCrumbData = [];
  this.initFlag = true;
  var self = this;

  // Default options
  this.options = {
    "overColor" : "#B3D259",
    "normalColor" : "#4D4D4D",
    "selectedColor" : "#8DB63F",
    "mouseClickCallback" : null,
    "mouseOnCallback" : null,
    "mouseOutCallback" : null,
    "mapsRootPath" : 'maps',
    'overLabel' : null,
    'backButton' : null,
    'currentTitle' : null,
    'breadcrumbEl' : null,
    'multipleSelection' : false
  };

  // Overwrite default value
  for(var item in options) {
    this.options[item] = options[item];
  }

  // If we don't have element for label and title
  // Put some default
  if(typeof document.querySelector === 'function'){
    if(this.options.overLabel === null){
      this.options.overLabel = this.wrapperElement.querySelector('.swissmapMouseOverLabel');
    }
    if(this.options.backButton === null){
      this.options.backButton = this.wrapperElement.querySelector('.swissmapBack');
    }
    if(this.options.currentTitle === null){
      this.options.currentTitle = this.wrapperElement.querySelector('.swissmapCurrentTitle');
    }
    if(this.options.breadcrumbEl === null){
      this.options.breadcrumbEl = this.wrapperElement.querySelector('.swissmapBreadcrumb');
    }
  }
  // Old school event so it works on IE7
  this.options.backButton.onclick = function(e){
    self.resetSelection();
    self.unZoom(e);
    return false; //prevendtDefault
  };

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
  this.setCurrentRegionID(regionID);
  this.loadSVG(this.mapData[regionID].file);
};

/**
 * Load SVG
 *
 * @param  string currentSvgFile  SVG to load
 */
SwissMap.prototype.loadSVG = function(currentSvgFile){
  this.currentSvgFile = currentSvgFile;
  var currentSVGObject = document.createElement('object', true);
  currentSVGObject.setAttribute('type', 'image/svg+xml');
  currentSVGObject.setAttribute('data', this.options.mapsRootPath + '/' + this.currentSvgFile);
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

SwissMap.prototype.setCurrentRegionID = function(currentRegionID){
  this.currentRegionID = currentRegionID;
  //@todo make an event
  this.updateBreadCrumb();
  this.renderBreadCrumb();
};

SwissMap.prototype.unZoom = function(){
  this.loadRegionSVG(this.mapData[this.currentRegionID].parent);
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

  //@fixme
  if(this.initFlag === true){
    this.selectToggle(this.currentRegionID);
    this.initFlag = false;
  }
};

SwissMap.prototype.updateBreadCrumb = function(){
  var parents = this.getParentsID(this.currentRegionID);
  var breadCrumbData = [];
  for(var key in parents){
    elementData = this.mapData[parents[key]];
    elementData.id = parents[key];
    breadCrumbData.push(elementData);
  }
  elementData = this.mapData[this.currentRegionID];
  elementData.id = this.currentRegionID;
  breadCrumbData.push(elementData);
  this.breadCrumbData = breadCrumbData;
};


SwissMap.prototype.renderBreadCrumb = function(){
  var self, idRegion, link, breadCrumbDataNbr;

  self = this;

  this.options.breadcrumbEl.innerHTML = '';
  breadCrumbDataNbr = this.breadCrumbData.length - 1;

  for(var i in this.breadCrumbData){
    idRegion = this.breadCrumbData[i].id;
    if(breadCrumbDataNbr == i){
      el = document.createElement('span');
    }else{
      el = document.createElement('a');
      el.setAttribute('href', '#' + idRegion);
      el.setAttribute('data-regionid',  idRegion);
      el.onclick = function(event){
        self.loadRegionSVG(this.getAttribute('data-regionid'));
        return false;
      };
    }
    el.innerHTML = this.breadCrumbData[i].name;

    this.options.breadcrumbEl.appendChild(el);
  }
};
/**
 * Get an array of all parents ID
 * Recursive function...
 */

 SwissMap.prototype.getParentsID = function(regionID,parents){
  if(typeof parents === "undefined"){
    parents = [];
  }
  if(typeof this.mapData[regionID].parent !== "undefined"){
    parents.push(this.mapData[regionID].parent);
    this.getParentsID(this.mapData[regionID].parent,parents);
  }
  parents = parents.reverse();
  return parents;
};

SwissMap.prototype.setSVGAttribut = function(element, attributName, value){
  // Save the old value
  // JS do not help us here...
  if (typeof this.originalSvgData[element.id] === "undefined") {
    this.originalSvgData[element.id] = {};
  }
  // Only save original value if it was not already done (Def of original right?)
  if (typeof this.originalSvgData[element.id][attributName] === "undefined") {
    this.originalSvgData[element.id][attributName] =  element.getAttribute(attributName);
  }

  //set the new value
  element.setAttribute(attributName, value);
};

SwissMap.prototype.resetSVGAttribut = function(element, attributName){
  //get the original value
  var value = this.originalSvgData[element.id][attributName];
  //set it back
  element.setAttribute(attributName, value);
};

/**
 * We bind event listener on SVG element than was find in the mapData (match on ID)
 */
SwissMap.prototype.bindEventToSVG = function(){
  var self = this;
  var mapElement;
  for(var id in this.mapData){
    if(this.mapData[id].file === this.currentSvgFile || this.mapData[id].type === 'canton'){
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

SwissMap.prototype.addRegionToSelection = function(regionID){
  this.setCurrentRegionID(regionID);

  if(this.options.multipleSelection === false){
    this.resetSelection();
  }
  mapElement = this.svg_map.getElementById(regionID);
  this.setSVGAttribut(mapElement, 'fill', this.options.selectedColor);
  this.selectedRegions[regionID] = 'selected';
};

SwissMap.prototype.removeRegionFromSelection = function(regionID){
  this.setCurrentRegionID(this.mapData[regionID].parent);

  mapElement = this.svg_map.getElementById(regionID);
  this.resetSVGAttribut(mapElement, 'fill');
  delete this.selectedRegions[regionID];
};

SwissMap.prototype.isRegionSelected = function(regionID){
  if(this.selectedRegions[regionID] === 'selected'){
    return true;
  }else{
    return false;
  }
};

SwissMap.prototype.resetSelection = function(){
  for(var regionID in this.selectedRegions){
    this.removeRegionFromSelection([regionID]);
  }
  this.selectedRegions = {};
};

SwissMap.prototype.selectionAll = function(){
  //todo
};

SwissMap.prototype.selectToggle = function(regionID){
  var data = this.mapData[regionID];
  // SVG file if specified in the element
  // and the SVG is not the current one
  if(typeof data.file  !== "undefined" && data.file !== this.currentSvgFile){
    this.loadRegionSVG(regionID);
  } else {
    //select/unselect the region
    if(this.isRegionSelected(regionID)){
        this.removeRegionFromSelection(regionID);
    }else{
        this.addRegionToSelection(regionID);
    }
  }
};

//---Event listeners

SwissMap.prototype.onMouseUp = function(e){
  this.selectToggle(e.target.id);

  if(typeof this.mouseClickCallback === "function") {
    this.mouseClickCallback.call(this, e.target.id, e.target, data);
  }
};
SwissMap.prototype.onMouseOver = function(e){
  this.overRegionID = e.target.id;
  if(!this.isRegionSelected(e.target.id)){
    this.setSVGAttribut(e.target, 'fill', this.options.overColor);
  }
  this.updateLabel();
  if(typeof this.mouseOnCallback === "function") {
    this.mouseOnCallback.call(this, e.target.id, e.target, data);
  }
};

SwissMap.prototype.onMouseOut = function(e){
  if(!this.isRegionSelected(e.target.id)){
    this.resetSVGAttribut(e.target,'fill');
  }
  if(typeof this.mouseOutCallback === "function") {
    this.mouseOutCallback.call(this, e.target.id, e.target, data);
  }
};







