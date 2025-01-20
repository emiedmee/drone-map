/*
 * -------------------------------------------------------
 *  Specifications for converting between Leaflet and KML
 * -------------------------------------------------------
 * 
 * Shapes for Flight zones, Contingency zones and Buffer zones are in 3 separate layer groups.
 * Each [layer group] will be converted to a Document in KML.
 * The Document.name in KML will indicate it are Flight zones, Contingency zones or Buffer zones.
 * All 3 Documents will be contained in a parent Document.
 * The 3 Documents contain their own used styles, the parent Document should contain no styles.
 * 
 * [Name] of a shape is in the shape.options for Leaflet and in the Placemark.name for KML.
 * 
 * [Style] options of a shape are converted to simplestyle-spec and added to ExtendedData in KML.
 * When converting back to Leaflet, this can be ignored because the layer styles are already defined.
 * 
 * The [altitudeMode] and [extrude] options are set on geometries in KML when converting to KML.
 * When converting back to Leaflet, one of each should be taken to detect these settings.
 * 
 * [Heights] are added to the coordinates when converting to KML (coordinate format: lng,lat,alt).
 * When converting back to Leaflet, one coordinate of each zone group should be taken to
 * detect the height settings for the zone groups, because all heights in a zone group are the same.
 * When there is no height detected, the height should be set to 0.
 * 
 * [Offsets] are set/updated when updating a flight zone shape and generating new buffer shapes.
 * They are saved in the shape.options for Leaflet and in the ExtendedData in KML.
 * When converting back to Leaflet, one offset for each zone groups should be taken
 * to detect the offset settings for the zone groups.
 * 
 * Leaflet [Circle] is converted to a polygon when converting to KML.
 * The [radius] and [center] coordinates of the circle will be added to ExtendedData in KML.
 * When converting back to Leaflet, if a radius and center is present in ExtendedData,
 * this means this polygon is in fact a circle.
 * 
 * Leaflet [Rectangle] will be converted to polygon in KML.
 * When converting back to Leaflet, it will stay a polygon, but this is fine.
 */

const SETTINGS = {
  /**
   * Name of file when exporting.
   * @type {String}
   */
  fileName: "flight plan",

  /**
   * File type to export.
   * @type {"kml" | "kmz"}
   */
  fileType: "kml",

  // When converting to KML
  /**
   * Extend outline-fill to be drawn to the ground or not.
   * @type {Boolean}
   */
  extendToGround: true,
  /**
   * Reference of height values
   * @type {"absolute" | "relativeToGround" | "relativeToSeaFloor"}
   */
  heightReference: "relativeToGround",

  // When converting to GeoJson
  /**
   * Height of the flight zone (meters).
   * @type {Number}
   */
  heightFlight: 60,
  /**
   * Height of the contingency zone (meters).
   * @type {Number}
   */
  heightContingency: 90,
  /**
   * Height of the buffer zone (meters).
   * @type {Number}
   */
  heightBuffer: 120,

  // When drawing
  /**
   * Width of the contingency zone (meters).
   * The distance from the edge of the flight zone to the edge of the contingency zone.
   * @example radiusContingencyZone = radiusFlightZone + widthContingency // For a Circle
   * @type {Number}
   */
  widthContingency: 50,
  /**
   * Width of the buffer zone (meters).
   * The distance from the edge of the contingency zone to the edge of the buffer zone.
   * @example radiusBufferZone = radiusFlightZone + widthContingency + widthBuffer
   * @type {Number}
   */
  widthBuffer: 50,
};

/*
 ***********************************
 *         LINKED FEATURES         *
 ***********************************
 */

// These must be defined before map is created
L.PolylineLinked = L.Polyline.extend({
  initialize: function (latlngs, options) {
    L.setOptions(this, options);
    L.Polyline.prototype.initialize.call(this, latlngs, options);

    // Add reference to the layers for the buffer features
    this.contingencyLayer = (options && options.contingencyLayer) ? options.contingencyLayer : contingencyZoneLayer;
    this.bufferLayer = (options && options.bufferLayer) ? options.bufferLayer : bufferZoneLayer;

    // Create buffer features
    this.contingency = L.polygon([]).addTo(this.contingencyLayer);
    this.buffer = L.polygon([]).addTo(this.bufferLayer);

    // Add reference to the buffer features pointing to this feature
    this.contingency.parent = this;
    this.buffer.parent = this;

    // Set styles
    this.setStyle(styleFlightZone);
    this.contingency.setStyle(styleContingencyZone);
    this.buffer.setStyle(styleBufferZone);

    // Don't fill line
    this.setStyle({ fill: false });
  },

  onAdd: function (map) {
    L.Polyline.prototype.onAdd.call(this, map);
    return this.redraw();
  },

  remove: function () {
    // Remove buffer features
    this.contingency.remove();
    this.buffer.remove();

    return L.Polyline.prototype.remove.call(this);
  },

  redraw: function () {
    // Update names once
    if (this.options && !this.options.name) {
      this.options.name = "Flight zone " + this._leaflet_id;
      this.contingency.options.name = "Contingency zone " + this._leaflet_id;
      this.buffer.options.name = "Buffer zone " + this._leaflet_id;
    }

    // Update contingency zone
    var newContingency = createBuffer(this, SETTINGS.widthContingency);
    this.contingency.setLatLngs(newContingency.getLatLngs());

    // Update buffer zone
    var newBuffer = createBuffer(this, SETTINGS.widthContingency + SETTINGS.widthBuffer);
    this.buffer.setLatLngs(newBuffer.getLatLngs());

    // Add any custom options from the created buffers to the buffer features
    Object.assign(this.contingency.options, newContingency.options);
    Object.assign(this.buffer.options, newBuffer.options);

    return L.Polyline.prototype.redraw.call(this);
  },
});

L.PolygonLinked = L.Polygon.extend({
  initialize: function (latlngs, options) {
    L.setOptions(this, options);
    L.Polygon.prototype.initialize.call(this, latlngs, options);

    // Add reference to the layers for the buffer features
    this.contingencyLayer = (options && options.contingencyLayer) ? options.contingencyLayer : contingencyZoneLayer;
    this.bufferLayer = (options && options.bufferLayer) ? options.bufferLayer : bufferZoneLayer;

    // Create buffer features
    this.contingency = L.polygon([]).addTo(this.contingencyLayer);
    this.buffer = L.polygon([]).addTo(this.bufferLayer);

    // Add reference to the buffer features pointing to this feature
    this.contingency.parent = this;
    this.buffer.parent = this;

    // Set styles
    this.setStyle(styleFlightZone);
    this.contingency.setStyle(styleContingencyZone);
    this.buffer.setStyle(styleBufferZone);
  },

  onAdd: function (map) {
    L.Polygon.prototype.onAdd.call(this, map);
    return this.redraw();
  },

  remove: function () {
    // Remove buffer features
    this.contingency.remove();
    this.buffer.remove();

    return L.Polygon.prototype.remove.call(this);
  },

  redraw: function () {
    // Update names once
    if (this.options && !this.options.name) {
      this.options.name = "Flight zone " + this._leaflet_id;
      this.contingency.options.name = "Contingency zone " + this._leaflet_id;
      this.buffer.options.name = "Buffer zone " + this._leaflet_id;
    }

    // Update contingency zone
    var newContingency = createBuffer(this, SETTINGS.widthContingency);
    this.contingency.setLatLngs(newContingency.getLatLngs());

    // Update buffer zone
    var newBuffer = createBuffer(this, SETTINGS.widthContingency + SETTINGS.widthBuffer);
    this.buffer.setLatLngs(newBuffer.getLatLngs());

    // Add any custom options from the created buffers to the buffer features
    Object.assign(this.contingency.options, newContingency.options);
    Object.assign(this.buffer.options, newBuffer.options);

    return L.Polygon.prototype.redraw.call(this);
  },
});

L.RectangleLinked = L.Rectangle.extend({
  initialize: function (latlngs, options) {
    L.setOptions(this, options);
    L.Rectangle.prototype.initialize.call(this, latlngs, options);

    // Add reference to the layers for the buffer features
    this.contingencyLayer = (options && options.contingencyLayer) ? options.contingencyLayer : contingencyZoneLayer;
    this.bufferLayer = (options && options.bufferLayer) ? options.bufferLayer : bufferZoneLayer;

    // Create buffer features
    this.contingency = L.polygon([]).addTo(this.contingencyLayer);
    this.buffer = L.polygon([]).addTo(this.bufferLayer);

    // Add reference to the buffer features pointing to this feature
    this.contingency.parent = this;
    this.buffer.parent = this;

    // Set styles
    this.setStyle(styleFlightZone);
    this.contingency.setStyle(styleContingencyZone);
    this.buffer.setStyle(styleBufferZone);
  },

  onAdd: function (map) {
    L.Rectangle.prototype.onAdd.call(this, map);
    return this.redraw();
  },

  remove: function () {
    // Remove buffer features
    this.contingency.remove();
    this.buffer.remove();

    return L.Rectangle.prototype.remove.call(this);
  },

  redraw: function () {
    // Update names once
    if (this.options && !this.options.name) {
      this.options.name = "Flight zone " + this._leaflet_id;
      this.contingency.options.name = "Contingency zone " + this._leaflet_id;
      this.buffer.options.name = "Buffer zone " + this._leaflet_id;
    }

    // Update contingency zone
    var newContingency = createBuffer(this, SETTINGS.widthContingency);
    this.contingency.setLatLngs(newContingency.getLatLngs());

    // Update buffer zone
    var newBuffer = createBuffer(this, SETTINGS.widthContingency + SETTINGS.widthBuffer);
    this.buffer.setLatLngs(newBuffer.getLatLngs());

    // Add any custom options from the created buffers to the buffer features
    Object.assign(this.contingency.options, newContingency.options);
    Object.assign(this.buffer.options, newBuffer.options);

    return L.Rectangle.prototype.redraw.call(this);
  },
});

L.CircleLinked = L.Circle.extend({
  initialize: function (latlngs, options) {
    L.setOptions(this, options);
    L.Circle.prototype.initialize.call(this, latlngs, options);

    // Add reference to the layers for the buffer features
    this.contingencyLayer = (options && options.contingencyLayer) ? options.contingencyLayer : contingencyZoneLayer;
    this.bufferLayer = (options && options.bufferLayer) ? options.bufferLayer : bufferZoneLayer;

    // Create buffer features
    this.contingency = L.circle([0, 0], { radius: 0 }).addTo(this.contingencyLayer);
    this.buffer = L.circle([0, 0], { radius: 0 }).addTo(this.bufferLayer);

    // Add reference to the buffer features pointing to this feature
    this.contingency.parent = this;
    this.buffer.parent = this;

    // Set styles
    this.setStyle(styleFlightZone);
    this.contingency.setStyle(styleContingencyZone);
    this.buffer.setStyle(styleBufferZone);
  },

  onAdd: function (map) {
    L.Circle.prototype.onAdd.call(this, map);
    return this.redraw();
  },

  remove: function () {
    // Remove buffer features
    this.contingency.remove();
    this.buffer.remove();

    return L.Circle.prototype.remove.call(this);
  },

  redraw: function () {
    // Update names once
    if (this.options && !this.options.name) {
      this.options.name = "Flight zone " + this._leaflet_id;
      this.contingency.options.name = "Contingency zone " + this._leaflet_id;
      this.buffer.options.name = "Buffer zone " + this._leaflet_id;
    }

    // Update contingency zone
    var newContingency = createBuffer(this, SETTINGS.widthContingency);
    this.contingency.setLatLng(newContingency.getLatLng());
    this.contingency.setRadius(newContingency.getRadius());

    // Update buffer zone
    var newBuffer = createBuffer(this, SETTINGS.widthContingency + SETTINGS.widthBuffer);
    this.buffer.setLatLng(newBuffer.getLatLng());
    this.buffer.setRadius(newBuffer.getRadius());

    // Add any custom options from the created buffers to the buffer features
    Object.assign(this.contingency.options, newContingency.options);
    Object.assign(this.buffer.options, newBuffer.options);

    return L.Circle.prototype.redraw.call(this);
  },
});


/*
 ***********************************
 *               MAP               *
 ***********************************
 */

const MIN_ZOOM = 3;
const MAX_ZOOM = 19;

const styleFlightZone = {
  fill: true,
  fillColor: "#33ff33", // #33ff33
  fillOpacity: 0.5,

  stroke: true,
  color: "#33ff33", // #33ff33
  weight: 3,
};
const styleContingencyZone = {
  fill: true,
  fillColor: "#ffff00", // #ffff00
  fillOpacity: 0.25,

  stroke: true,
  color: "#ffff00", // #ffff00
  weight: 3,
};
const styleBufferZone = {
  fill: true,
  fillColor: "#ff0000", // #ff0000
  fillOpacity: 0.5,

  stroke: true,
  color: "#ff0000", // #ff0000
  weight: 3,
};

// Define base tile layers
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
});

const flightZoneLayer = L.featureGroup();
const contingencyZoneLayer = L.featureGroup();
const bufferZoneLayer = L.featureGroup();

// Initialize the map + set visible layers
const layers = [
  osm,
  flightZoneLayer,
  contingencyZoneLayer,
  bufferZoneLayer,
];
const map = L.map("map", {
  layers: layers,
  editable: true,
  editOptions: {
    featuresLayer: flightZoneLayer,
    polylineClass: L.PolylineLinked,
    polygonClass: L.PolygonLinked,
    rectangleClass: L.RectangleLinked,
    circleClass: L.CircleLinked,
  },
}).setView([50.848, 4.357], 13);

L.control.scale().addTo(map);

// Make sure layers are ordered correctly
flightZoneLayer.on("layeradd", () => {
  flightZoneLayer.bringToFront();
});
contingencyZoneLayer.on("layeradd", () => {
  contingencyZoneLayer.bringToFront();
  flightZoneLayer.bringToFront();
});
bufferZoneLayer.on("layeradd", () => {
  bufferZoneLayer.bringToFront();
  contingencyZoneLayer.bringToFront();
  flightZoneLayer.bringToFront();
});

contingencyZoneLayer.bringToBack();
bufferZoneLayer.bringToBack();


/*
 ***********************************
 *        CIRCLE EXTENSION         *
 ***********************************
 */

/**
 * @see https://github.com/geoman-io/leaflet-geoman/blob/master/src/js/helpers/index.js
 * @param {L.LatLng} latlng coordinate
 * @param {Number} brng Current bearing/rotation at this coordinate
 * @param {Number} dist Distance to this point
 * @returns {L.LatLng}
*/
function destinationVincenty(latlng, brng, dist) {
  // Code from https://stackoverflow.com/a/24153998/8283938
  // rewritten to work with leaflet
  const VincentyConstants = {
    a: 6378137,
    b: 6356752.3142,
    f: 1 / 298.257223563
  };

  const { a, b, f } = VincentyConstants;
  const lon1 = latlng.lng;
  const lat1 = latlng.lat;
  const s = dist;
  const pi = Math.PI;
  const alpha1 = brng * pi / 180; // converts brng degrees to radius
  const sinAlpha1 = Math.sin(alpha1);
  const cosAlpha1 = Math.cos(alpha1);
  const tanU1 = (1 - f) * Math.tan((lat1 * pi) / 180 /* converts lat1 degrees to radius */);
  const cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1);
  const sinU1 = tanU1 * cosU1;
  const sigma1 = Math.atan2(tanU1, cosAlpha1);
  const sinAlpha = cosU1 * sinAlpha1;
  const cosSqAlpha = 1 - sinAlpha * sinAlpha;
  const uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
  const A = 1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  let sigma = s / (b * A);
  let sigmaP = 2 * Math.PI;

  let cos2SigmaM;
  let sinSigma;
  let cosSigma;
  while (Math.abs(sigma - sigmaP) > 1e-12) {
    cos2SigmaM = Math.cos(2 * sigma1 + sigma);
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    const deltaSigma = (
      B *
      sinSigma *
      (cos2SigmaM +
        (B / 4) *
        (cosSigma *
          (-1 + 2 * cos2SigmaM * cos2SigmaM) -
          (B / 6) *
          cos2SigmaM *
          (-3 + 4 * sinSigma * sinSigma) *
          (-3 + 4 * cos2SigmaM * cos2SigmaM)
        )
      )
    );
    sigmaP = sigma;
    sigma = s / (b * A) + deltaSigma;
  }
  const tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
  const lat2 = Math.atan2(
    sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
    (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
  );
  const lambda = Math.atan2(
    sinSigma * sinAlpha1,
    cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
  );
  const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
  const lam = (
    lambda -
    (1 - C) *
    f *
    sinAlpha *
    (sigma +
      C *
      sinSigma *
      (cos2SigmaM +
        C *
        cosSigma *
        (-1 + 2 * cos2SigmaM * cos2SigmaM)
      )
    )
  );
  // const revAz = Math.atan2(sinAlpha, -tmp);  // final bearing
  const lng_lamFunc = lon1 + (lam * 180) / pi; // converts lam radius to degrees
  const lat_lat2a = (lat2 * 180) / pi; // converts lat2a radius to degrees

  return L.latLng(lat_lat2a, lng_lamFunc);
}

/**
 * Create a geodesic polygon representation for a circle.
 * 
 * @see https://github.com/geoman-io/leaflet-geoman/blob/master/src/js/helpers/index.js
 * @param {L.LatLng} origin Center of the circle
 * @param {Number} radius Radius of the circle
 * @param {Number} sides Number of sides to use for converting the circle
 * @param {Number} rotation Used to offset the rotation, noticable when number of sides is low
 * @returns {Array<L.LatLng>}
 */
function createGeodesicPolygon(origin, radius, sides, rotation) {
  let angle;
  let newLatLng;
  let geomPoint;
  const points = [];

  for (let i = 0; i < sides; i += 1) {
    angle = (i * 360 / sides) + rotation;
    newLatLng = destinationVincenty(origin, angle, radius);
    geomPoint = L.latLng(newLatLng.lat, newLatLng.lng);
    points.push(geomPoint);
  }

  return points;
}

L.Circle.include({
  /**
   * Convert a Circle to a Polygon with a certain number of sides.
   * 
   * @see https://github.com/geoman-io/leaflet-geoman/blob/master/src/js/L.PM.Utils.js
   * @param {Number} sides number of sides, higher = smoother
   * @returns 
   */
  toPolygon: function (sides = 60) {
    const origin = this.getLatLng();
    const radius = this.getRadius();
    const polys = createGeodesicPolygon(origin, radius, sides, 0); // these are the points that make up the circle
    const polygon = [];
    for (let i = 0; i < polys.length; i += 1) {
      const geometry = [polys[i].lat, polys[i].lng];
      polygon.push(geometry);
    }
    return L.polygon(polygon, this.options);
  },

  toGeoJSON: function (precision) {
    var polygon = this.toPolygon(360);
    return polygon.toGeoJSON(precision);
  },
});


/*
 ***********************************
 *             DRAWING             *
 ***********************************
 */

// Basic drawing controls
L.EditControl = L.Control.extend({
  options: {
    position: "topleft",
    callback: null,
    kind: "",
    html: "",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-control leaflet-bar");
    L.DomEvent.disableClickPropagation(container); // Prevent drawing when clicking on control

    var link = L.DomUtil.create("a", "", container);

    link.href = "#";
    link.title = "Create a new " + this.options.kind;
    link.innerHTML = this.options.html;

    L.DomEvent.on(link, "click", function (event) {
      L.DomEvent.stop(event);
      if (this.options.callback) {
        this.options.callback.call(map.editTools);
      }
    }, this);

    return container;
  },
});

L.NewLineControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startPolyline,
    kind: "line",
    html: "\\/\\",
  },
});

L.NewCircleControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startCircle,
    kind: "circle",
    html: "⬤",
  },
});

L.NewPolygonControl = L.EditControl.extend({
  options: {
    position: "topleft",
    callback: map.editTools.startPolygon,
    kind: "polygon",
    html: "▰",
  },
});

map.addControl(new L.NewLineControl());
map.addControl(new L.NewCircleControl());
map.addControl(new L.NewPolygonControl());

map.editTools.on("editable:enable", function (event) {
  if (this.currentPolygon) {
    this.currentPolygon.disableEdit();
  }
  this.currentPolygon = event.layer;
  // Only do Polygon-specific drawing stuff when starting to draw a Polygon
  if (this.currentPolygon instanceof L.Polygon) {
    this.fire("editable:enabled");
  }
});
map.editTools.on("editable:disable", function (event) {
  delete this.currentPolygon;
});


// Double-click shape (or buffers) toggles editing of shape
function onToggleEdit(event) {
  if (event.layer instanceof L.Path) {
    event.layer.on("dblclick", L.DomEvent.stop).on("dblclick", event.layer.toggleEdit);

    if (event.layer.contingency) {
      event.layer.contingency.on("dblclick", L.DomEvent.stop).on("dblclick", function (ev) {
        ev.target.parent.toggleEdit();
      });
    }

    if (event.layer.buffer) {
      event.layer.buffer.on("dblclick", L.DomEvent.stop).on("dblclick", function (ev) {
        ev.target.parent.toggleEdit();
      });
    }
  }
}

function offToggleEdit(event) {
  if (event.layer instanceof L.Path) {
    event.layer.off("dblclick", L.DomEvent.stop).off("dblclick", event.layer.toggleEdit);
  }

  if (event.layer.contingency) {
    event.layer.contingency.off("dblclick", L.DomEvent.stop).off("dblclick", function (ev) {
      ev.target.parent.toggleEdit();
    });
  }

  if (event.layer.buffer) {
    event.layer.buffer.off("dblclick", L.DomEvent.stop).off("dblclick", function (ev) {
      ev.target.parent.toggleEdit();
    });
  }
}

flightZoneLayer.on("layeradd", onToggleEdit);
flightZoneLayer.on("layerremove", offToggleEdit);


// Ctrl + click polygon enables drawing hole in polygon
function drawNewHole(event) {
  if ((event.originalEvent.ctrlKey || event.originalEvent.metaKey) && event.target.editEnabled()) {
    event.target.editor.newHole(event.latlng);
  }
}

function onDrawNewHole(event) {
  if (event.layer instanceof L.Polygon) {
    event.layer.on("click", L.DomEvent.stop).on("click", drawNewHole);
  }
}

function offDrawNewHole(event) {
  if (event.layer instanceof L.Polygon) {
    event.layer.off("click", L.DomEvent.stop).off("click", drawNewHole);
  }
}

flightZoneLayer.on("layeradd", onDrawNewHole);
flightZoneLayer.on("layerremove", offDrawNewHole);


// Ctrl + click on end of line continues drawing the line
function continueLine(event) {
  event.vertex.continue();
}

map.on("editable:vertex:ctrlclick editable:vertex:metakeyclick", continueLine);


// Shift + click shape (or buffers) to delete shape, while editing shape
function deleteShape(event) {
  if (event.originalEvent.shiftKey && event.target.editEnabled()) {
    event.target.remove();
    stopDrawing();
  }
}

function onDeleteShape(event) {
  if (event.layer instanceof L.Path) {
    event.layer.on("click", L.DomEvent.stop).on("click", deleteShape);

    if (event.layer.contingency) {
      event.layer.contingency.on("click", L.DomEvent.stop).on("click", function (ev) {
        ev.target = ev.target.parent;
        deleteShape(ev);
      });
    }

    if (event.layer.buffer) {
      event.layer.buffer.on("click", L.DomEvent.stop).on("click", function (ev) {
        ev.target = ev.target.parent;
        deleteShape(ev);
      });
    }
  }
}

function offDeleteShape(event) {
  if (event.layer instanceof L.Path) {
    event.layer.off("click", L.DomEvent.stop).off("click", deleteShape);
  }

  if (event.layer.contingency) {
    event.layer.contingency.off("click", L.DomEvent.stop).off("click", function (ev) {
      ev.target = ev.target.parent;
      deleteShape(ev);
    });
  }

  if (event.layer.buffer) {
    event.layer.buffer.off("click", L.DomEvent.stop).off("click", function (ev) {
      ev.target = ev.target.parent;
      deleteShape(ev);
    });
  }
}

flightZoneLayer.on("layeradd", onDeleteShape);
flightZoneLayer.on("layerremove", offDeleteShape);


// Esc to cancel drawing
function stopDrawing() {
  map.editTools.stopDrawing();
  map.fire("editable:drawing:end");
}

map.on("keydown", function (event) {
  if (event.originalEvent.key == "Escape" && map.editTools.currentPolygon) {
    stopDrawing();
  }
});


// Tooltip while drawing
const tooltip = L.DomUtil.get("tooltip");
function addTooltip() {
  L.DomEvent.on(document, "mousemove", moveTooltip);
  if (map.editTools.currentPolygon instanceof L.Polygon) {
    // Polygon
    tooltip.innerHTML = "Click on the map to start a polygon.";
  } else if (map.editTools.currentPolygon instanceof L.Circle) {
    // Circle
    tooltip.innerHTML = "Click and drag on the map to draw a circle.";
  } else {
    // Line - default
    tooltip.innerHTML = "Click on the map to start a line.";
  }
  tooltip.style.display = "block";
}

function removeTooltip() {
  tooltip.innerHTML = "";
  tooltip.style.display = "none";
  L.DomEvent.off(document, "mousemove", moveTooltip);
}

function moveTooltip(event) {
  tooltip.style.left = event.clientX + 20 + "px";
  tooltip.style.top = event.clientY - 10 + "px";
}

function updateTooltip(event) {
  if (map.editTools.currentPolygon instanceof L.Polygon) {
    // Polygon
    if (event.layer.editor._drawnLatLngs.length < event.layer.editor.MIN_VERTEX - 1) {
      tooltip.innerHTML = "Click on the map to continue polygon.";
    } else {
      tooltip.innerHTML = "Click on first/last point to finish polygon.";
    }
  } else if (map.editTools.currentPolygon instanceof L.Circle) {
    // Circle
  } else {
    // Line - default
    if (event.layer.editor._drawnLatLngs.length < event.layer.editor.MIN_VERTEX - 1) {
      tooltip.innerHTML = "Click on the map to continue line.";
    } else {
      tooltip.innerHTML = "Click on last point to finish line.";
    }
  }
}

map.on("editable:drawing:start", addTooltip);
map.on("editable:drawing:end", removeTooltip);
map.on("editable:drawing:click", updateTooltip);


// Drawing info box
L.DrawingInfoControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "control-drawing-info leaflet-bar");
    L.DomEvent.disableClickPropagation(container);

    this.infoContentShow = "";
    this.infoContentShow = "<b>Drawing information:</b>";
    this.infoContentShow += "<br>&nbsp;\u2022 Click one of the icons to start drawing.";
    this.infoContentShow += "<br>&nbsp;\u2022 Press <kbd>esc</kbd> to cancel drawing.";
    this.infoContentShow += "<br>&nbsp;\u2022 Double click on shape to toggle editing.";

    this.infoContentShow += "<br><b>While editing:</b>";
    this.infoContentShow += "<br>&nbsp;\u2022 Drag shape to move it.";
    this.infoContentShow += "<br>&nbsp;\u2022 Drag point to change the shape.";
    this.infoContentShow += "<br>&nbsp;\u2022 Click point to remove point from shape.";
    this.infoContentShow += "<br>&nbsp;\u2022 Click middle point to insert point in line of shape.";
    this.infoContentShow += "<br>&nbsp;\u2022 <kbd>Ctrl</kbd>+click polygon to create hole in polygon.";
    this.infoContentShow += "<br>&nbsp;\u2022 <kbd>Ctrl</kbd>+click on end of line to continue drawing.";
    this.infoContentShow += "<br>&nbsp;\u2022 <kbd>Shift</kbd>+click on shape to delete it.";

    this.infoContentHidden = '<center><b>Draw<br>Info</b></center>';

    this.info = L.DomUtil.create("label", "", container);
    this.info.innerHTML = this.infoContentHidden;

    this.show = false;
    L.DomEvent.on(container, "click", function (event) {
      this.show = !this.show;
      if (this.show) {
        this.info.innerHTML = this.infoContentShow;
      } else {
        this.info.innerHTML = this.infoContentHidden;
      }
    }, this);

    return container;
  },
});

map.addControl(new L.DrawingInfoControl({ position: "bottomright" }));


/*
 ***********************************
 *             OFFSET              *
 ***********************************
 */

// https://github.com/junmer/clipper-lib
// https://sourceforge.net/p/jsclipper/wiki/Home%206/
// https://stackoverflow.com/questions/13248896/offsetting-polygons-in-javascript

function latlngs2paths(latlngs) {
  var paths = [];
  if (latlngs instanceof Array) {
    latlngs.forEach(latlng => paths.push(latlngs2paths(latlng)));
  } else {
    var point = map.latLngToContainerPoint(latlngs);
    paths = { X: point.x, Y: point.y };
  }
  return paths;
}

function paths2latlngs(paths) {
  var latlngs = [];
  if (paths instanceof Array) {
    paths.forEach(path => latlngs.push(paths2latlngs(path)));
  } else {
    var latlng = map.containerPointToLatLng({ x: paths.X, y: paths.Y });
    latlngs = { lat: latlng.lat, lng: latlng.lng };
  }
  return latlngs;
}

/**
 * Given a distance in meters, returns the offset used for ClipperOffset delta.
 * 
 * @param {Number} distance_m distance in meters
 * @returns distance in pixels to be used for ClipperOffset delta
 */
function distanceToOffset(distance_m) {
  // https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level/31266377
  // https://wiki.openstreetmap.org/wiki/Zoom_levels

  function metersPerPixel() {
    // https://stackoverflow.com/questions/27545098/leaflet-calculating-meters-per-pixel-at-zoom-level/31266377#31266377
    const EarthCircumference_m = 40075016.686;
    return EarthCircumference_m * Math.abs(Math.cos(map.getCenter().lat * Math.PI / 180)) / Math.pow(2, map.getZoom() + 8);
  }

  return distance_m / metersPerPixel();
}

/**
 * Checks if an array is an array of coordinates. Coordinates should be on the first level of the array.
 * A coordinate can be a `L.LatLng` object and must have `lat` and `lng` and optional `alt`.
 * A coordinate can be a `Point` object and must have `x`/`X` and `y`/`Y`.
 * A coordinate can be a `Number[]` with `Number` 2-3 items, in format [lng, lat, alt?].
 * 
 * @param {Array} array
 * @returns {Boolean}
 */
function isCoordsArray(array) {
  if (array instanceof Array && array.length > 0) {
    if (array[0] instanceof Array) { // [lng, lat, alt?]
      return (array[0].length >= 2 && typeof array[0][0] === "number" && typeof array[0][1] === "number");
    } else if (array[0] instanceof Object) { // LatLng or Point
      return ((!!array[0].lat && !!array[0].lng) || ((!!array[0].x || !!array[0].X) && (!!array[0].y || !!array[0].Y)));
    }
  }
  return false;
}

/**
 * Offset a shape to create a buffer, by inflating or deflating the shape.
 * 
 * @param {L.Polyline | L.Polygon | L.Rectangle | L.Circle} layerShape to be offset
 * @param {Number} offset_m Offset in meters
 * @returns {L.Polygon | L.Circle | null} Offset shape
 */
function createBuffer(layer, offset_m) {
  if (!offset_m || !layer || !(layer instanceof L.Polyline || layer instanceof L.Circle)) {
    console.warn("Provided shape is not a rectangle, polygon, polyline or circle");
    return null;
  }

  var buffer = null;
  if (layer instanceof L.Polyline) { // Polyline, Polygon, Rectangle
    buffer = createBufferPoly(layer, offset_m);
  } else if (layer instanceof L.Circle) { // Circle
    buffer = createBufferCircle(layer, offset_m);
  }

  // Add additional properties
  if (buffer && buffer.options) {
    buffer.options.offset = offset_m;
  }

  return buffer;
}

/**
 * Offset a poly shape to create a buffer, by inflating or deflating the shape.
 * 
 * @see https://sourceforge.net/p/jsclipper/wiki/Home%206/
 * @param {L.Polyline | L.Polygon | L.Rectangle} layer Poly shape to be offset
 * @param {Number} offset_m Offset in meters
 * @returns {L.Polygon | null} Offset poly shape
 */
function createBufferPoly(layer, offset_m) {
  if (!offset_m || !layer || !(layer instanceof L.Polyline)) {
    console.warn("Provided shape is not a rectangle, polygon or polyline");
    return null;
  }

  // B1. Include library

  // B2. Create path
  var paths = latlngs2paths(layer.getLatLngs());

  // B3. Scale up polygon coordinates
  //  Because Clipper library uses "integer" coordinates, we have to scale up coordinates to maintain precision
  const scale = 100;
  if (paths[0] instanceof Array) { // MultiShape
    ClipperLib.JS.ScaleUpPaths(paths, scale);
  } else { // Single shape
    ClipperLib.JS.ScaleUpPath(paths, scale);
  }

  // B4.1 Simplifying
  //  Remove self-intersections from polygons
  //  ClipperLib.PolyFillType = { pftEvenOdd: 0, pftNonZero: 1, pftPositive: 2, pftNegative: 3 };
  if (layer instanceof L.Polygon) { // Polygon, Rectangle
    if (paths[0] instanceof Array) { // MultiShape
      paths = ClipperLib.Clipper.SimplifyPolygons(paths, ClipperLib.PolyFillType.pftEvenOdd);
    } else { // Single shape
      paths = ClipperLib.Clipper.SimplifyPolygon(paths, ClipperLib.PolyFillType.pftEvenOdd);
    }
  } else { // Polyline
    // Don't simplify lines
  }

  // B4.2 Cleaning
  //  Prevent distortions after ofsetting caused by too-near points
  const cleanDelta = 0.1;
  paths = ClipperLib.JS.Clean(paths, cleanDelta * scale);

  // B5. Create an instance of ClipperOffset object
  //  Used for inflating/deflating
  const miterLimit = 2;
  const arcTolerance = 0.25;
  var co = new ClipperLib.ClipperOffset(miterLimit, arcTolerance);

  // Determine joinType and endType base on the type of shape
  //  ClipperLib.JoinType = { jtSquare: 0, jtRound: 1, jtMiter: 2 };
  //  ClipperLib.EndType = { etOpenSquare: 0, etOpenRound: 1, etOpenButt: 2, etClosedPolygon: 3, etClosedLine: 4 };
  var joinType, endType;
  if (layer instanceof L.Polygon) { // Polygon, Rectangle
    joinType = ClipperLib.JoinType.jtSquare;
    endType = ClipperLib.EndType.etClosedPolygon;
  } else { // Polyline
    joinType = ClipperLib.JoinType.jtSquare;
    endType = ClipperLib.EndType.etOpenSquare;
  }

  // B6. Add paths
  if (paths[0] instanceof Array) { // MultiShape
    co.AddPaths(paths, joinType, endType);
  } else { // Single shape
    co.AddPath(paths, joinType, endType);
  }

  // Convert offset in meters to offset in pixels
  var offset_px = distanceToOffset(offset_m);

  // B7. Create an empty solution and execute the offset operation
  //  Inflate with positive offset, deflate with negative offset
  var offsetted_paths = new ClipperLib.Paths();
  co.Execute(offsetted_paths, offset_px * scale);

  // Before drawing, the coordinates have to be scaled down by the scale factor
  ClipperLib.JS.ScaleDownPaths(paths, scale);
  ClipperLib.JS.ScaleDownPaths(offsetted_paths, scale);

  // B8. Drawing offsetted polygons
  var latlngs = paths2latlngs(offsetted_paths);
  if (layer instanceof L.Polygon) { // Polygon, Rectangle
    return L.polygon(latlngs);
  } else { // Polyline
    return L.polygon([latlngs]);
  }
}

/**
 * Offset a circle to create a buffer, by increasing or decreasing the circle radius.
 * 
 * @see https://sourceforge.net/p/jsclipper/wiki/Home%206/
 * @param {L.Circle} layer Circle to be offset
 * @param {Number} offset_m Offset in meters
 * @returns {L.Circle | null} Offset circle
 */
function createBufferCircle(layer, offset_m) {
  if (!offset_m || !layer || !(layer instanceof L.Circle)) {
    console.warn("Provided shape is not a circle");
    return null;
  }

  var center = layer.getLatLng();
  var radius = layer.getRadius();

  return L.circle({ lat: center.lat, lng: center.lng }, { radius: radius + offset_m });
}


/*
 ***********************************
 *          EXPORT TO KML          *
 ***********************************
 */

/**
 * Add style options to the properties of a GeoJson Feature, according to the simplestyle-spec.
 * 
 * @see https://github.com/mapbox/simplestyle-spec
 * @param {Object} style Style options
 * @param {Object} properties Properties from GeoJson Feature
 */
function addSimpleStyleProperties(style, properties) {
  /*
   * https://github.com/mapbox/simplestyle-spec
   * 
   * OPTIONAL: default ""
   * A title to show when this item is clicked or
   * hovered over
   *  "title": "A title",
   * 
   * OPTIONAL: default ""
   * A description to show when this item is clicked or
   * hovered over
   *  "description": "A description",
   * 
   * OPTIONAL: default "medium"
   * specify the size of the marker. sizes
   * can be different pixel sizes in different
   * implementations
   * Value must be one of
   * "small"
   * "medium"
   * "large"
   *  "marker-size": "medium",
   * 
   * OPTIONAL: default ""
   * a symbol to position in the center of this icon
   * if not provided or "", no symbol is overlaid
   * and only the marker is shown
   * Allowed values include
   * - Icon ID
   * - An integer 0 through 9
   * - A lowercase character "a" through "z"
   *  "marker-symbol": "bus",
   * 
   * OPTIONAL: default "7e7e7e"
   * the marker's color
   * 
   * value must follow COLOR RULES
   *  "marker-color": "#fff",
   * 
   * OPTIONAL: default "555555"
   * the color of a line as part of a polygon, polyline, or
   * multigeometry
   * 
   * value must follow COLOR RULES
   *  "stroke": "#555555",
   * 
   * OPTIONAL: default 1.0
   * the opacity of the line component of a polygon, polyline, or
   * multigeometry
   * 
   * value must be a floating point number greater than or equal to
   * zero and less or equal to than one
   *  "stroke-opacity": 1.0,
   * 
   * OPTIONAL: default 2
   * the width of the line component of a polygon, polyline, or
   * multigeometry
   * 
   * value must be a floating point number greater than or equal to 0
   *  "stroke-width": 2,
   * 
   * OPTIONAL: default "555555"
   * the color of the interior of a polygon
   * 
   * value must follow COLOR RULES
   *  "fill": "#555555",
   * 
   * OPTIONAL: default 0.6
   * the opacity of the interior of a polygon. Implementations
   * may choose to set this to 0 for line features.
   * 
   * value must be a floating point number greater than or equal to
   * zero and less or equal to than one
   *  "fill-opacity" 0.5
   */


  /*
   * https://leafletjs.com/reference.html#path
   * stroke       Boolean true      Whether to draw stroke along the path. Set it to false to disable borders on polygons or circles.
   * color        String  '#3388ff' Stroke color
   * weight       Number  3         Stroke width in pixels
   * opacity      Number  1.0       Stroke opacity
   * lineCap      String  'round'   A string that defines shape to be used at the end of the stroke.
   * lineJoin     String  'round'   A string that defines shape to be used at the corners of the stroke.
   * dashArray    String  null      A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers.
   * dashOffset   String  null      A string that defines the distance into the dash pattern to start the dash. Doesn't work on Canvas-powered layers in some old browsers.
   * fill         Boolean depends   Whether to fill the path with color. Set it to false to disable filling on polygons or circles.
   * fillColor    String  *         Fill color. Defaults to the value of the color option
   * fillOpacity  Number  0.2       Fill opacity.
   * fillRule     String  'evenodd' A string that defines how the inside of a shape is determined.
   */

  if (style && properties) {
    var stroke = Object.keys(style).includes("stroke") ? style["stroke"] : false;
    var fill = Object.keys(style).includes("fill") ? style["fill"] : false;

    Object.keys(style).forEach(key => {
      switch (key) {
        case "color":
          if (stroke) properties["stroke"] = style["color"];
          break;
        case "weight":
          if (stroke) properties["stroke-width"] = style["weight"];
          break;
        case "opacity":
          if (stroke) properties["stroke-opacity"] = style["opacity"];
        case "fillColor":
          if (fill) properties["fill"] = style["fillColor"];
          break;
        case "fillOpacity":
          if (fill) properties["fill-opacity"] = style["fillOpacity"];
          break;
        case "stroke":
        case "lineCap":
        case "lineJoin":
        case "dashArray":
        case "dashOffset":
        case "fill":
        case "fillRule":
        default:
          break;
      }
    });
  }
}

/**
 * Converts a Leaflet layer to GeoJson Feature and add style according to the simplestyle-spec.
 * 
 * @param {L.Marker | L.Polyline | L.CircleMarker} layer
 * @returns {Feature | null}
 */
function getGeoJson(layer) {
  if (layer) {
    var geojson = layer.toGeoJSON();
    addSimpleStyleProperties(layer.options, geojson.properties);

    // Add additional properties that will be added to ExtendedData
    if (layer instanceof L.Circle) {
      var center = layer.getLatLng();
      // Format: lng,lat,alt
      geojson.properties.center = `${center.lng},${center.lat},${center.alt ? center.alt : 0}`;

      geojson.properties.radius = layer.getRadius();
    }
    if (layer.options.offset) {
      geojson.properties.offset = layer.options.offset;
    }
    return geojson;
  }
  return null;
}

/**
 * Adds altitude to all coordinates in a list of coordinates.
 * The list of coordinates will be modified in place.
 * 
 * @param {Array} coordinates List of coordinates, will be modified in place
 * @param {Number} altitude Altitude to add to ALL coordinates
 */
function addAltitudeToCoordinates(coordinates, altitude) {
  if (altitude && coordinates && coordinates instanceof Array) {
    if (isCoordsArray(coordinates)) {
      coordinates.forEach(coord => {
        if (coord instanceof Array) { // [lng, lat, alt?]
          coord[2] = altitude;
        } else if (coord instanceof Object) { // LatLng or Point
          coord.alt = altitude;
        }
      });
    } else {
      coordinates.forEach(coord => addAltitudeToCoordinates(coord, altitude));
    }
  }
}

/**
 * Add extrude and altitudeMode to a Point, LineString or Polygon tags inside a KML file.
 * The KML file should only contain one single instance of that tag.
 * 
 * @param {String} kml KML file as a string
 * @param {"absolute" | "relativeToGround" | "relativeToSeaFloor"} altitudeMode optional
 * @param {Boolean} extrude optional
 */
function insertAltitudeExtrudeToGeometryTag(kml, altitudeMode = "relativeToGround", extrude = true) {
  var tagName;
  if (kml.includes("<Point>")) {
    tagName = "Point";
  } else if (kml.includes("<LineString>")) {
    tagName = "LineString";
  } else if (kml.includes("<Polygon>")) {
    tagName = "Polygon";
  }

  if (kml && tagName) {
    var parts = kml.split(`<${tagName}>`);
    if (parts && parts.length > 1) {
      var ret = [parts[0]];

      // Loop in case of multiple of the same geometry tag
      for (var i = 1; i < parts.length; i++) {
        ret.push(`<${tagName}>`); // Opening tag
        ret.push(`<extrude>${extrude ? 1 : 0}</extrude>`);
        ret.push(`<altitudeMode>${altitudeMode}</altitudeMode>`);
        ret.push(parts[i]); // Contains closing tag and the rest
      }

      return ret.join("");
    }
  }
  return kml;
}

/**
 * Insert name and/or description to a tag inside a KML file.
 * The KML file should only contain one single instance of that tag.
 * 
 * @param {String} kml KML file as a string
 * @param {String} tagName Name of the tag where to insert
 * @param {String} name optional
 * @param {String} description optional
 */
function insertNameDescriptionToTag(kml, tagName, name = "", description = "") {
  if (kml && tagName) {
    var parts = kml.split(`<${tagName}>`);
    if (parts && parts.length > 1) {
      var ret = [parts[0]];

      ret.push(`<${tagName}>`); // Opening tag
      if (name) {
        ret.push(`<name>${name}</name>`);
      }
      if (description) {
        ret.push(`<description>${description}</description>`);
      }
      ret.push(parts[1]); // Contains closing tag and the rest

      return ret.join("");
    }
  }
  return kml;
}

/**
 * Extract a tag from a KML file. Only the first occurance of the tag will be returned.
 * Includes the opening and closing tags.
 * 
 * @param {String} kml KML file as a string
 * @param {String} tagName Tag name
 */
function getTagFromKml(kml, tagName) {
  if (kml && tagName) {
    tagName = tagName.replaceAll("<", "").replaceAll("/", "").replaceAll(">", "").trim();
    if (kml.includes(`<${tagName}>`) && kml.includes(`</${tagName}>`)) {
      var part = kml.split(`<${tagName}>`)[1];
      var content = part.split(`</${tagName}>`)[0];
      return `<${tagName}>${content}</${tagName}>`;
    }
  }
}

/**
 * Converts a Leaflet layer or layerGroup to individual KMLs.
 * Include style and optional name and description of individual layers.
 * 
 * @param {L.Marker | L.Polyline | L.CircleMarker} layer
 * @param {"flight" | "contingency" | "buffer"} layerType optional
 * @returns {Array<String>} List of KMLs for each layer
 */
function layerToPartialKMLs(layer, layerType = "flight") {
  var kmls = [];
  if (layer) {
    if (layer instanceof L.LayerGroup) {
      layer.getLayers().forEach(_layer => kmls.push(layerToPartialKMLs(_layer, layerType)));
    } else {
      // Convert layer to GeoJson and add some style and additional properties
      var geojson = getGeoJson(layer);

      // Add altitude to coordinates, also set altitude in options in case only circles
      if (geojson && geojson.geometry && geojson.geometry.coordinates) {
        switch (layerType) {
          case "flight":
            addAltitudeToCoordinates(geojson.geometry.coordinates, SETTINGS.heightFlight);
            break;
          case "contingency":
            addAltitudeToCoordinates(geojson.geometry.coordinates, SETTINGS.heightContingency);
            break;
          case "buffer":
            addAltitudeToCoordinates(geojson.geometry.coordinates, SETTINGS.heightBuffer);
            break;
          default:
            break;
        }
      }

      kmls = tokml(geojson, { simplestyle: true });

      // Add altitudeMode and extrude to geometry tag
      kmls = insertAltitudeExtrudeToGeometryTag(kmls, SETTINGS.heightReference, SETTINGS.extendToGround);

      // Add name and description to Placemark tag
      kmls = insertNameDescriptionToTag(kmls, "Placemark", layer.options.name, layer.options.description);
    }
  }
  return kmls;
}

const KmlStart = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2">';

const styleRegex = /<(?:StyleMap|Style) id="(.+?)">.+?<\/(?:StyleMap|Style)>/g;

/**
 * Converts a Leaflet layer or layer group to KML. Adds style according to the simplestyle-spec.
 * Inserts name and description to individual layers if they are present in the layer options.
 * Adds name and description of the document if provided.
 * 
 * @param {L.Marker | L.Polyline | L.CircleMarker | L.LayerGroup} layer
 * @param {"flight" | "contingency" | "buffer"} layerType optional
 * @param {String} documentName optional
 * @param {String} documentDescription optional
 */
function layerToKML(layer, layerType = "flight", documentName = "", documentDescription = "") {
  var kmls = layerToPartialKMLs(layer, layerType);

  if (kmls && kmls.length > 0) {
    // Convert single string to array
    if (typeof kmls === "string") {
      kmls = [kmls];
    }

    // Construct start of KML
    var documentKml = [KmlStart, "<Document>"];
    if (documentName) {
      documentKml.push(`<name>${documentName}</name>`);
    }
    if (documentDescription) {
      documentKml.push(`<description>${documentDescription}</description>`);
    }

    var styles = {};
    var placemarks = [];

    // Extract styles and Placemarks
    kmls.forEach(kml => {
      kml = kml.replaceAll("\n", " ")
        .replaceAll("\r", " ")
        .replaceAll("\t", " ")
        .replaceAll("  ", " ");

      // Get al style matches
      var styleMatches = kml.match(new RegExp(styleRegex));
      if (styleMatches) {
        styleMatches.forEach(match => {
          // Get id and full style
          var matches = (new RegExp(styleRegex)).exec(match);
          if (matches.length > 1) {
            // Don't add duplicates
            if (!Object.keys(styles).includes(matches[1])) {
              styles[matches[1]] = matches[0];
            }
          }
        });
      }

      // Only keep Placemark
      var placemark = getTagFromKml(kml, "Placemark");

      // Remove styles from placemark (should not be the case since styles are at same level as Placemark in Document)
      Object.keys(styles).forEach(key => {
        placemark.replaceAll(styles[key], "");
      });

      placemarks.push(placemark);
    });

    // Insert styles
    Object.keys(styles).forEach(key => documentKml.push(styles[key]));

    // Insert placemarks
    placemarks.forEach(placemark => documentKml.push(placemark));

    // Add end
    documentKml.push("</Document></kml>");

    return documentKml.join("");
  }
}

const FLIGHT_ZONES_DOCUMENT_NAME = "Flight zones";
const CONTINGENCY_ZONES_DOCUMENT_NAME = "Contingency zones";
const BUFFER_ZONES_DOCUMENT_NAME = "Buffer zones";

/**
 * Exports the flight zone layers, contingency zone layers and buffer zone layers
 * to 3 KML documents inside 1 KML file.
 * 
 * @param {String} documentName optional
 * @param {String} documentDescription optional
 */
function exportToKML(documentName = "", documentDescription = "") {
  // Export flightZoneLayer to KML document
  var kmlFlightZone = layerToKML(flightZoneLayer, "flight", FLIGHT_ZONES_DOCUMENT_NAME);

  // Export contingencyZoneLayer to KML document
  var kmlContingencyZone = layerToKML(contingencyZoneLayer, "contingency", CONTINGENCY_ZONES_DOCUMENT_NAME);

  // Export bufferZoneLayer to KML document
  var kmlBufferZone = layerToKML(bufferZoneLayer, "buffer", BUFFER_ZONES_DOCUMENT_NAME);

  // Join the 3 documents together inside 1 parent KML document
  var documentKml = [KmlStart, "<Document>"];
  if (documentName) {
    documentKml.push(`<name>${documentName}</name>`);
  }
  if (documentDescription) {
    documentKml.push(`<description>${documentDescription}</description>`);
  }

  var kmls = [kmlFlightZone, kmlContingencyZone, kmlBufferZone];
  kmls.forEach(kml => documentKml.push(getTagFromKml(kml, "Document")));

  documentKml.push("</Document></kml>");
  return documentKml.join("");
}


/*
 ***********************************
 *        SETTINGS SIDEBAR         *
 ***********************************
 */

L.SettingsSidebarControl = L.Control.extend({
  options: {
    position: "topright",
  },

  open: true,

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "control-settings-sidebar leaflet-bar");
    L.DomEvent.disableClickPropagation(container);

    this.link = L.DomUtil.create("a", "", container);
    this.link.href = "#";
    this.link.title = "Close sidebar";

    this.img = L.DomUtil.create("img", "", this.link);
    this.img.src = "../img/gear.svg";
    this.img.alt = "Close";

    L.DomEvent.on(this.link, "click", function (event) {
      L.DomEvent.stop(event);

      if (this.open) {
        // Close the sidebar
        document.getElementById("sidebar").classList.add("hidden");
        document.documentElement.style.setProperty("--sidebar-width", "0px");
        this.link.title = "Open sidebar";
        this.img.alt = "Open";
      } else {
        // Open the sidebar
        document.getElementById("sidebar").classList.remove("hidden");
        document.documentElement.style.removeProperty("--sidebar-width");
        this.link.title = "Close sidebar";
        this.img.alt = "Close";
      }
      this.open = !this.open;
      map.invalidateSize();
    }, this);

    return container;
  },
});

const settingsSidebarControl = new L.SettingsSidebarControl();
map.addControl(settingsSidebarControl);

// Sidebar close button
const sidebarClose = document.getElementById("sidebarClose");
sidebarClose.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  settingsSidebarControl.link.click();
});

// If small screen size, start with sidebar closed
if (window.screen.width <= 450) {
  sidebarClose.click();
}

// Input elements of the import form
const fileSelect = document.getElementById("fileSelect");
const fileElem = document.getElementById("fileElem");

// Input elements of the export form
const filename = document.getElementById("filename");
const filetype = document.getElementById("filetype");
const widthContingency = document.getElementById("widthContingency");
const widthBuffer = document.getElementById("widthBuffer");
const heightFlight = document.getElementById("heightFlight");
const heightContingency = document.getElementById("heightContingency");
const heightBuffer = document.getElementById("heightBuffer");
const refRelativeToGround = document.getElementById("refRelativeToGround");
const refRelativeToSeaFloor = document.getElementById("refRelativeToSeaFloor");
const refAbsolute = document.getElementById("refAbsolute");
const extendToGround = document.getElementById("extendToGround");
const exportBtn = document.getElementById("exportButton");

/**
 * Set export form content based on `SETTINGS`.
 */
function updateExportForm() {
  filename.value = SETTINGS.fileName;
  filetype.value = SETTINGS.fileType;
  widthContingency.value = SETTINGS.widthContingency;
  widthBuffer.value = SETTINGS.widthBuffer;
  heightFlight.value = SETTINGS.heightFlight;
  heightContingency.value = SETTINGS.heightContingency;
  heightBuffer.value = SETTINGS.heightBuffer;
  if (SETTINGS.heightReference === "relativeToGround") refRelativeToGround.checked = true;
  if (SETTINGS.heightReference === "relativeToSeaFloor") refRelativeToSeaFloor.checked = true;
  if (SETTINGS.heightReference === "absolute") refAbsolute.checked = true;
  extendToGround.checked = SETTINGS.extendToGround;
  exportBtn.value = "Export to " + SETTINGS.fileType.toUpperCase();
}

function validNumberValue(value) {
  var newValue = parseFloat(value);
  if (newValue != null && newValue != Number.NaN && newValue >= 0) {
    return newValue
  }
  return 0; // fallback value
}

/**
 * Generate KML/KMZ file and download it.
 */
async function exportToFile() {
  // Generate KML file
  var kml = exportToKML(SETTINGS.fileName);
  var file = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });

  if (SETTINGS.fileType === "kml") {
    // Create ObjectURL and click it to download the KML file
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = SETTINGS.fileName + "." + SETTINGS.fileType;
    a.click();
    URL.revokeObjectURL(a.href);
  } else { // SETTINGS.fileType === "kmz"
    // Zip KML and create KMZ file
    var zipWrite = new zip.ZipWriter(new zip.BlobWriter("application/vnd.google-earth.kmz"));
    await zipWrite.add("doc.kml", new zip.TextReader(kml));
    var zipFile = await zipWrite.close();

    // Create ObjectURL and click it to download the KMZ file
    var a = document.createElement("a");
    a.href = URL.createObjectURL(zipFile);
    a.download = SETTINGS.fileName + "." + SETTINGS.fileType;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}

// Handle interactions with the import form
fileSelect.addEventListener("click", (event) => {
  if (fileElem) {
    fileElem.click();
  }
});
fileElem.addEventListener("change", (event) => {
  console.warn(`Trying to import form file "${event.target.value}", but this functionality is not yet implemented!`);
  alert("Importing from file is not yet implemented!");
});

// Handle interactions with the export form, update the value in `SETTINGS` that was changed in the form
filename.addEventListener("change", (event) => {
  SETTINGS.fileName = event.target.value;
});
filetype.addEventListener("change", (event) => {
  if (!(event.target.value === "kml" || event.target.value === "kmz")) {
    event.target.value = "kml"; // Set default value
  }
  SETTINGS.fileType = event.target.value;
  exportBtn.value = "Export to " + event.target.value.toUpperCase();
});
widthContingency.addEventListener("input", (event) => {
  SETTINGS.widthContingency = validNumberValue(event.target.value);
  event.target.value = SETTINGS.widthContingency; // Update input in case of default value
  flightZoneLayer.eachLayer((layer) => layer.redraw()); // Trigger redraw() on all flight zone shapes
});
widthBuffer.addEventListener("input", (event) => {
  SETTINGS.widthBuffer = validNumberValue(event.target.value);
  event.target.value = SETTINGS.widthBuffer; // Update input in case of default value
  flightZoneLayer.eachLayer((layer) => layer.redraw()); // Trigger redraw() on all flight zone shapes
});
heightFlight.addEventListener("change", (event) => {
  SETTINGS.heightFlight = validNumberValue(event.target.value);
  event.target.value = SETTINGS.heightFlight; // Update input in case of default value
});
heightContingency.addEventListener("change", (event) => {
  SETTINGS.heightContingency = validNumberValue(event.target.value);
  event.target.value = SETTINGS.heightContingency; // Update input in case of default value
});
heightBuffer.addEventListener("change", (event) => {
  SETTINGS.heightBuffer = validNumberValue(event.target.value);
  event.target.value = SETTINGS.heightBuffer; // Update input in case of default value
});
refRelativeToGround.addEventListener("change", (event) => {
  if (event.target.checked) {
    SETTINGS.heightReference = "relativeToGround";
  }
});
refRelativeToSeaFloor.addEventListener("change", (event) => {
  if (event.target.checked) {
    SETTINGS.heightReference = "relativeToSeaFloor";
  }
});
refAbsolute.addEventListener("change", (event) => {
  if (event.target.checked) {
    SETTINGS.heightReference = "absolute";
  }
});
extendToGround.addEventListener("change", (event) => {
  SETTINGS.extendToGround = event.target.checked;
});
exportBtn.addEventListener("click", exportToFile);

// Set form content based on initial option values
updateExportForm();
