// https://ops.skeyes.be/oper-preflight-briefing
const AIRODROME_MAPPING = {
  EBBU: ["brussels fir", "fir brussels"],
  "brussels fir": ["EBBU"],
  "fir brussels": ["EBBU"],

  EBAM: ["amougies"],
  "amougies": ["EBAM"],
  EBAW: ["antwerpen", "deurne"],
  "antwerpen": ["EBAW"],
  "deurne": ["EBAW"],
  EBBR: ["brussels", "brussels-national"],
  "brussels": ["EBBR"],
  "brussels-national": ["EBBR"],
  EBBT: ["brasschaat"],
  "brasschaat": ["EBBT"],
  EBBX: ["bertrix", "jehonville"],
  "bertrix": ["EBBX"],
  "jehonville": ["EBBX"],
  EBCF: ["cerfontaine"],
  "cerfontaine": ["EBCF"],
  EBCI: ["charleroi", "brussels south"],
  "charleroi": ["EBCI"],
  "brussels south": ["EBCI"],
  EBDT: ["diest", "schaffen"],
  "diest": ["EBDT"],
  "schaffen": ["EBDT"],
  EBFN: ["koksijde"],
  "koksijde": ["EBFN"],
  EBGB: ["grimbergen", "lint"],
  "grimbergen": ["EBGB"],
  "lint": ["EBGB"],
  EBGG: ["geraardsbergen", "overboelare"],
  "geraardsbergen": ["EBGG"],
  "overboelare": ["EBGG"],
  EBHN: ["hoevenen"],
  "hoevenen": ["EBHN"],
  EBKH: ["balen", "keiheuvel"],
  "balen": ["EBKH"],
  "keiheuvel": ["EBKH"],
  EBKT: ["kortrijk", "wevelgem"],
  "kortrijk": ["EBKT"],
  "wevelgem": ["EBKT"],
  EBLE: ["leopoldsburg", "beverlo"],
  "leopoldsburg": ["EBLE"],
  "beverlo": ["EBLE"],
  EBLG: ["liege"],
  "liege": ["EBLG"],
  EBMO: ["moorsele"],
  "moorsele": ["EBMO"],
  EBNM: ["namur", "suarlée", "suarlee"],
  "namur": ["EBNM"],
  "suarlée": ["EBNM"],
  "suarlee": ["EBNM"],
  EBOS: ["oostende", "oostende-brugge"],
  "oostende": ["EBOS"],
  "oostende-brugge": ["EBOS"],
  EBSG: ["saint-ghislain"],
  "saint-ghislain": ["EBSG"],
  EBSH: ["saint-hubert"],
  "saint-hubert": ["EBSH"],
  EBSP: ["spa", "la sauveniere", "sauveniere"],
  "spa": ["EBSP"],
  "la sauveniere": ["EBSP"],
  "sauveniere": ["EBSP"],
  EBST: ["sint-truiden", "brustem"],
  "sint-truiden": ["EBST"],
  "brustem": ["EBST"],
  EBTN: ["goetsenhoven"],
  "goetsenhoven": ["EBTN"],
  EBTX: ["herviers", "theux"],
  "herviers": ["EBTX"],
  "theux": ["EBTX"],
  EBTY: ["tournai", "maubray"],
  "tournai": ["EBTY"],
  "maubray": ["EBTY"],
  EBUL: ["ursel"],
  "ursel": ["EBUL"],
  EBWE: ["weelde"],
  "weelde": ["EBWE"],
  EBZH: ["hasselt", "kiewit"],
  "hasselt": ["EBZH"],
  "kiewit": ["EBZH"],
  EBZR: ["zoersel", "oostmalle"],
  "zoersel": ["EBZR"],
  "oostmalle": ["EBZR"],
  EBZW: ["genk", "zwartberg"],
  "genk": ["EBZW"],
  "zwartberg": ["EBZW"],

  EDDL: ["düsseldorf", "dusseldorf"],
  "düsseldorf": ["EDDL"],
  "dusseldorf": ["EDDL"],
  EDKA: ["aachen"],
  "aachen": ["EDKA"],
  EDKV: ["dahlemer", "binz"],
  "dahlemer": ["EDKV"],
  "binz": ["EDKV"],
  EDLN: ["mönchengladbach", "mnchengladbach"],
  "mönchengladbach": ["EDLN"],
  "monchengladbach": ["EDLN"],
  EDRJ: ["saarlouis", "düren", "duren"],
  "saarlouis": ["EDRJ"],
  "düren": ["EDRJ"],
  "duren": ["EDRJ"],
  EDRT: ["trier", "fohren"],
  "trier": ["EDRT"],
  "fohren": ["EDRT"],

  EHBD: ["weert"],
  "weert": ["EHBD"],
  EHBK: ["maastricht"],
  "maastricht": ["EHBK"],
  EHEH: ["eindhoven"],
  "eindhoven": ["EHEH"],
  EHMZ: ["middelburg", "midden-zeeland"],
  "middelburg": ["EHMZ"],
  "midden-zeeland": ["EHMZ"],
  EHSE: ["hoeven", "seppe"],
  "hoeven": ["EHSE"],
  "seppe": ["EHSE"],

  ELLX: ["luxembourg"],
  "luxembourg": ["ELLX"],
  ELNT: ["noertrange"],
  "noertrange": ["ELNT"],
  ELUS: ["useldange"],
  "useldange": ["ELUS"],

  LFAC: ["calais", "dunkerque"],
  "calais": ["LFAC"],
  "dunkerque": ["LFAC"],
  LFAT: ["le touquet paris plage"],
  "le touquet paris plage": ["LFAT"],
  LFAV: ["valenciennes", "denain"],
  "valenciennes": ["LFAV"],
  "denain": ["LFAV"],
  LFQJ: ["maubeuge", "elesmes"],
  "maubeuge": ["LFQJ"],
  "elesmes": ["LFQJ"],
  LFQO: ["lille marcq en baroeul"],
  "lille marcq en baroeul": ["LFQO"],
  LFQQ: ["lille lesquin"],
  "lille lesquin": ["LFQQ"],
  LFQV: ["charleville", "mezieres"],
  "charleville": ["LFQV"],
  "mezieres": ["LFQV"],
  LFSJ: ["sedan", "douzy"],
  "sedan": ["LFSJ"],
  "douzy": ["LFSJ"],
};

/**
 * Matches list of coordinates from first latitude to last longitude
 */
const allCoordinatesRegex = new RegExp(/\d+[\.,]?\d*[NS].+\d+[\.,]?\d*[EW]/g);

/**
 * Matches the individual parts of a coordinate to parse it
 */
const coordinatesRegex = new RegExp(/^(\d+[\.,]?\d*)([NS])\s*(\d+[\.,]?\d*)([EW])$/g);

/**
 * Matches the radius of a circle
 */
const radiusRegex = new RegExp(/RAD(?:IUS)?\s*(\d+[\.,]?\d*)\s?NM/g);

/**
 * Matches certain keywords/patterns that indicate a geozone is included in the notam message
 */
const geoTypesRegex = new RegExp(/(\b((EB)|(ED)|(EH)|(EL)|(LF))[A-Z]{2}\b)|(((EBR)|(RMZ)|(HTA)|(LFA)|(TMA)|(CTA)|(TSA)|(TRA))\d+[A-Z]?)/g);

/**
 * Matches certain keyword/pattern that indicates a CTR is included in the notam message
 */
const ctrRegex = new RegExp(/[a-zA-Z]+ CTR/g);


class NotamProcessor {
  /**
   * @param {L.GeoJSON} activeGeozonesLayer Layer on which geozones will be added that are active because of NOTAMS
   * @param {L.GeoJSON} newGeozonesLayer Layer on which new geozones will be added that are created by NOTAMS
   */
  constructor() {
    /**
     * @type {NotamsResponse}
     */
    this.notams = null;

    /**
     * @type {FeatureCollection}
     */
    this.geozones = null;

    /**
     * Geozones that have NOTAMS that make them active at some point
     * @type {Object.<string, NotamsFeature[]>}
     */
    this.geozonesActiveByNotams = null;

    /**
     * New geozones that are created by NOTAMS
     * @type {FeatureCollection}
     */
    this.geozonesDefinedByNotams = null;
  }

  // Main functions
  /**
   * Get a dictionary of geozones with a list of all the NOTAMS that cause these geozones to become active.
   * 
   * @param {NotamsResponse} notams
   */
  async getGeozonesActiveByNotams(notams) {
    if (notams && notams.features) {
      /** @type {Object.<string, NotamsFeature[]>} */
      var dictionary = {};

      notams.features.forEach(notam => {
        var geozones = this.findGeozonesInNotam(notam.attributes.notamText);
        if (geozones && geozones.length > 0) {
          geozones.forEach(geozone => {
            if (Object.keys(dictionary).includes(geozone)) {
              dictionary[geozone].push(notam);
            } else {
              dictionary[geozone] = [notam];
            }
          });
        }
      });

      return dictionary;
    }
    return null;
  }

  /**
   * Get all new geozones that are created by NOTAMS.
   * 
   * @param {NotamsResponse} notams
   */
  async getGeozonesDefinedByNotams(notams) {
    if (notams && notams.features) {
      /** @type {FeatureCollection} */
      var geozones = { type: "FeatureCollection", features: [] };

      notams.features.forEach(notam => {
        if (notam.attributes) {
          /** @type {Array<String>} */
          var coordinates = notam.attributes.notamText.match(allCoordinatesRegex);
          /** @type {Array<String>} */
          var radius = notam.attributes.notamText.match(radiusRegex);

          if (coordinates) {
            coordinates = coordinates[0].split("-")
              .map(coordinate => coordinate.trim())
              .filter(coordinate => coordinate.match(coordinatesRegex));

            if (coordinates.length == 1) {
              if (radius) {
                // Circle
                notam.attributes["radius"] = this.parseNotamRadius(radius[0]);
                geozones.features.push({
                  type: "Feature",
                  id: notam.attributes.OBJECTID,
                  properties: notam.attributes,
                  geometry: {
                    type: "Point",
                    coordinates: this.latlngswap(this.parseNotamCoordinates(coordinates[0])),
                  },
                });
              } else {
                // Point
                geozones.features.push({
                  type: "Feature",
                  id: notam.attributes.OBJECTID,
                  properties: notam.attributes,
                  geometry: {
                    type: "Point",
                    coordinates: this.latlngswap(this.parseNotamCoordinates(coordinates[0])),
                  },
                });
              }
            } else {
              // Polygon
              geozones.features.push({
                type: "Feature",
                id: notam.attributes.OBJECTID,
                properties: notam.attributes,
                geometry: {
                  type: "Polygon",
                  coordinates: [coordinates.map(c => this.latlngswap(this.parseNotamCoordinates(c)))],
                },
              });
            }
          }
        }
      });

      return geozones;
    }
    return null;
  }

  // Utility and conversion functions
  /**
   * Searches for any possible (existing) geozones in the NOTAM message.
   * 
   * @param {String} notamText
   * @returns {Array<String>}
   */
  findGeozonesInNotam(notamText) {
    function strip(text = "") {
      return text
        .replaceAll('-', '')
        .replaceAll('_', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll("'", '')
        .replaceAll('/', '')
        .replaceAll('.', '')
        .replaceAll(' ', '');
    }
    function substr(text = "") {
      return text.length >= 5 ? text.substring(2) : text;
    }

    var notamStripped = strip(notamText);
    var notamStrippedSub = substr(notamStripped);
    var notamPossibleGeozone = notamText.match(geoTypesRegex);
    var notamPossibleCtr = notamText.match(ctrRegex);
    if (!notamPossibleGeozone && notamPossibleCtr) {
      var airodrome = notamPossibleCtr[0].substring(0, notamPossibleCtr[0].length - 4)
      if (Object.keys(AIRODROME_MAPPING).includes(airodrome.toLowerCase())) {
        notamPossibleGeozone = [AIRODROME_MAPPING[airodrome.toLowerCase()][0]];
      }
    }

    if (notamProcessor && notamProcessor.geozones) {
      return notamProcessor.geozones.features
        .filter(geozone => {
          var geozoneStripped = strip(geozone.properties.name);
          var geozoneStrippedSub = substr(geozoneStripped);

          return (notamPossibleGeozone && geozoneStripped.includes(notamPossibleGeozone[0]))
            || notamStripped.includes(geozoneStripped)
            || notamStripped.includes(geozoneStrippedSub)
            || notamStrippedSub.includes(geozoneStripped)
            || notamStrippedSub.includes(geozoneStrippedSub)
        })
        .map(geozone => geozone.properties.name);
    } else {
      return [];
    }
  }

  /**
   * Returns the Decimal Degree value of latitude and longitude, if valid.
   * 
   * @param {String} coordinates string containing "Latitude Longitude" from a NOTAM message
   * @returns {[Number, Number] | null} coordinates in format [lat, lng]
   */
  parseNotamCoordinates(coordinates) {
    /*
     * Coordinates in NOTAM message are DMS (not DD)
     *  DDMMSS[.SS] N
     * DDDMMSS[.SS] E
     * 
     * DD = deg + (min/60) + (sec/3600)
     * 
     * Sometimes SS and even MM are left out, which means they are 0
     * 
     * Non-standard coordinate examples
     * 5029N     50 29 00
     * 00555E     5 55 00
     * 051803E    5 18 03
     * 5029N     50 29 00
     * 00457E     4 56 00
     */
    var matches = (new RegExp(coordinatesRegex)).exec(coordinates.replaceAll(",", "."));
    if (matches && matches.length > 4) {
      // Latitude
      /*
       * LATITUDE (DDMMSS[.SS] N)
       * 
       * 112233.44N 11 22 33.44
       * (split on "." first)
       * 
       * + 112233N  11 22 33    6   DD MM SS
       * + 012233N   1 22 33    6   DD MM SS
       * - 12233N    1 22 33    5    D MM SS
       * 
       * + 1122N    11 22 00    4   DD MM
       * + 0122N     1 22 00    4   DD MM
       * - 122N      1 22 00    3    D MM
       * 
       * + 11N      11 00 00    2   DD
       * + 01N       1 00 00    2   DD
       * - 1N        1 00 00    1    D
       */
      var lat_parts = matches[1].split(".");
      var _lat = lat_parts[0];

      var _lat_deg = "0";
      var _lat_min = "0";
      var _lat_sec = "0";
      var _lat_ms = lat_parts.length > 1 ? lat_parts[1] : "0";

      switch (_lat.length) {
        // DDMMSS
        case 6:
          _lat_deg = _lat.slice(0, 2);
          _lat_min = _lat.slice(2, 4);
          _lat_sec = _lat.slice(4, 6);
          break;
        //  DMMSS
        case 5:
          _lat_deg = _lat.slice(0, 1);
          _lat_min = _lat.slice(1, 3);
          _lat_sec = _lat.slice(3, 4);
          break;
        // DDMM
        case 4:
          _lat_deg = _lat.slice(0, 2);
          _lat_min = _lat.slice(2, 4);
          break;
        //  DMM
        case 3:
          _lat_deg = _lat.slice(0, 1);
          _lat_min = _lat.slice(1, 3);
          break;
        // DD
        case 2:
          _lat_deg = _lat.slice(0, 2);
          break;
        //  D
        case 1:
          _lat_deg = _lat.slice(0, 1);
          break;
        default:
          return null;
      }

      var lat_deg = parseInt((matches[2] == "S" ? "-" : "") + _lat_deg);
      var lat_min = parseInt(_lat_min);
      var lat_sec = parseFloat(_lat_sec + "." + _lat_ms);
      var lat = lat_deg + (lat_min / 60) + (lat_sec / 3600);

      // Longitude
      /*
       * LONGITUDE (DDDMMSS[.SS] E)
       * 
       * 1112233.44E  111 22 33.44
       * (split on "." first)
       * 
       * + 1112233E 111 22 33   7   DDD MM SS
       * + 0112233E  11 22 33   7   DDD MM SS
       * + 0012233E   1 22 33   7   DDD MM SS
       * - 112233E   11 22 33   6    DD MM SS
       * - 012233E    1 22 33   6    DD MM SS
       * - 12233E     1 22 33   5     D MM SS   <-- same length as a good one, will be treated as DDDMM
       * 
       * + 11122E   111 22 00   5   DDD MM
       * + 01122E    11 22 00   5   DDD MM
       * + 00122E     1 22 00   5   DDD MM
       * - 1122E     11 22 00   4    DD MM
       * - 0122E      1 22 00   4    DD MM
       * - 122E       1 22 00   3     D MM   <-- same length as a good one, will be treated as DDD
       * 
       * + 111E     111 00 00   3   DDD
       * + 011E      11 00 00   3   DDD
       * + 001E       1 00 00   3   DDD
       * - 11E       11 00 00   2    DD
       * - 01E        1 00 00   2    DD
       * - 1E         1 00 00   1     D
       */
      var lng_parts = matches[3].split(".");
      var _lng = lng_parts[0];

      var _lng_deg = "0";
      var _lng_min = "0";
      var _lng_sec = "0";
      var _lng_ms = lng_parts.length > 1 ? lng_parts[1] : "0";

      switch (_lng.length) {
        // DDDMMSS
        case 7:
          _lng_deg = _lng.slice(0, 3);
          _lng_min = _lng.slice(3, 5);
          _lng_sec = _lng.slice(5, 7);
          break;
        //  DDMMSS
        case 6:
          _lng_deg = _lng.slice(0, 2);
          _lng_min = _lng.slice(2, 4);
          _lng_sec = _lng.slice(4, 6);
          break;
        // DDDMM
        case 5:
          _lng_deg = _lng.slice(0, 3);
          _lng_min = _lng.slice(3, 5);
          break;
        //  DDMM
        case 4:
          _lng_deg = _lng.slice(0, 2);
          _lng_min = _lng.slice(2, 4);
          break;
        // DDD
        case 3:
          _lng_deg = _lng.slice(0, 3);
          break;
        //  DD
        case 2:
          _lng_deg = _lng.slice(0, 2);
          break;
        //   D
        case 1:
          _lng_deg = _lng.slice(0, 1);
          break;
        default:
          return null;
      }

      var lng_deg = parseInt((matches[4] == "W" ? "-" : "") + _lng_deg);
      var lng_min = parseInt(_lng_min);
      var lng_sec = parseFloat(_lng_sec + "." + _lng_ms);
      var lng = lng_deg + (lng_min / 60) + (lng_sec / 3600);

      return [lat, lng];
    }
    return null;
  }

  /**
   * Returns the radius value in meters, if valid.
   * 
   * @param {String} radius string containing a radius in nautical miles from a NOTAM message
   * @returns radius in meter
   */
  parseNotamRadius(radius) {
    function nm2km(nm) {
      // 1 nautical mile = 1.852 kilometres
      return nm * 1.852;
    }

    var matches = (new RegExp(radiusRegex)).exec(radius.replaceAll(",", "."));
    if (matches && matches.length > 1) {
      var radius_nm = parseFloat(matches[1]);
      return nm2km(radius_nm) * 1000;
    }
    return null;
  }

  /**
   * Swaps the latitude and longitude from place inside the array.
   * 
   * @param {[Number, Number]} coordinates coordinates to swap: (1) [lat, lng] coordinates - (2) [lng, lat] coordinates
   * @returns {[Number, Number] | null} swapped coordinates: (1) [lng, lat] coordinates - (2) [lat, lng] coordinates
   */
  latlngswap(coordinates) {
    if (coordinates && coordinates.length > 1) {
      return [coordinates[1], coordinates[0]];
    } else {
      return null;
    }
  }
}

/**
 * Leaflet Control for viewing future NOTAMS
 */
L.Control.NotamFuture = L.Control.extend({
  /**
   * @typedef {{
   *  notamProcessor: NotamProcessor,
   *  activeGeozonesLayer: L.GeoJSON,
   *  newGeozonesLayer: L.GeoJSON,
   * }} NotamFutureOptions
   */

  /**
   * Constructor function
   * 
   * @param {NotamFutureOptions} options
   */
  initialize: function (options) {
    if (options && options.notamProcessor && options.activeGeozonesLayer && options.newGeozonesLayer) {
      this._currentDate = new Date();
      /**
       * Contains object that holds all relevant data for NOTAMS
       */
      this._notamProcessor = options.notamProcessor;
      /**
       * Layer on which geozones will be added that are active because of NOTAMS
       */
      this._activeGeozonesLayer = options.activeGeozonesLayer;
      /**
       * Layer on which new geozones will be added that are created by NOTAMS
       */
      this._newGeozonesLayer = options.newGeozonesLayer;

    } else {
      console.warn("L.Control.NotamFuture: One or more required options are missing")
    }

    L.setOptions(this, options);
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "control-notam-future leaflet-bar");

    // Next button
    /** @type {HTMLAnchorElement} */
    var buttonNext = L.DomUtil.create("a", "control-notam-future-next", container);
    this._buttonNext = buttonNext; // Make it available across functions
    buttonNext.href = "#";
    buttonNext.role = "button";
    buttonNext.title = "Next day";
    buttonNext.innerHTML = "Next day";

    L.DomEvent.on(buttonNext, "click", (event) => {
      L.DomEvent.stop(event);

      this._currentDate.setUTCDate(this._currentDate.getUTCDate() + 1);
      this.setCurrentDate();
    });
    L.DomEvent.on(buttonNext, "dblclick", (event) => L.DomEvent.stop(event)); // Prevent rapid clicks from zooming

    // Date button
    /** @type {HTMLAnchorElement} */
    var buttonDate = L.DomUtil.create("a", "control-notam-future-date", container);
    this._buttonDate = buttonDate; // Make it available across functions
    buttonDate.href = "#";
    buttonDate.role = "button";
    buttonDate.title = "Current day - Go to Today";
    this._currentDate = new Date();
    buttonDate.innerHTML = `<b>${this.getDateString(this._currentDate)}</b>`;

    L.DomEvent.on(buttonDate, "click", (event) => {
      L.DomEvent.stop(event);

      this._currentDate = new Date();
      this.setCurrentDate();
    });
    L.DomEvent.on(buttonDate, "dblclick", (event) => L.DomEvent.stop(event)); // Prevent rapid clicks from zooming

    // Previous button
    /** @type {HTMLAnchorElement} */
    var buttonPrevious = L.DomUtil.create("a", "control-notam-future-previous", container);
    this._buttonPrevious = buttonPrevious; // Make it available across functions
    buttonPrevious.href = "#";
    buttonPrevious.role = "button";
    buttonPrevious.title = "Previous day"
    buttonPrevious.innerHTML = "Previous day";

    L.DomEvent.on(buttonPrevious, "click", (event) => {
      L.DomEvent.stop(event);

      this._currentDate.setUTCDate(this._currentDate.getUTCDate() - 1);
      this.setCurrentDate();
    });
    L.DomEvent.on(buttonPrevious, "dblclick", (event) => L.DomEvent.stop(event)); // Prevent rapid clicks from zooming

    return container;
  },

  onRemove: function (map) {
    L.DomEvent.off(this._buttonNext, "click");
    L.DomEvent.off(this._buttonNext, "dblclick");
    L.DomEvent.off(this._buttonDate, "click");
    L.DomEvent.off(this._buttonDate, "dblclick");
    L.DomEvent.off(this._buttonPrevious, "click");
    L.DomEvent.off(this._buttonPrevious, "dblclick");
  },

  /**
   * @param {Date} date
   */
  getDateString: function (date) {
    return date.getUTCFullYear()
      + "/"
      + String(date.getUTCMonth() + 1).padStart(2, "0")
      + "/"
      + String(date.getUTCDate()).padStart(2, "0");
  },

  /**
   * @returns {Date}
   */
  getCurrentDate: function () {
    return this._currentDate;
  },

  /**
   * @param {Date | Number} date
   */
  setCurrentDate: function (date) {
    if (date) {
      if (typeof date === "number") {
        this._currentDate = new Date(date);
      } else if (date.constructor === Date) {
        this._currentDate = date;
      }
    }

    // Update displayed date
    this._buttonDate.innerHTML = `<b>${this.getDateString(this._currentDate)}</b>`;

    // Check if "next" button can be pressed (optional)

    // Check if "previous" button can be pressed (optional)

    // Update layers on the map
    /** @type {NotamProcessor} */
    var notamProcessor = this._notamProcessor;
    if (notamProcessor && notamProcessor.geozones && notamProcessor.geozonesDefinedByNotams
      && this._activeGeozonesLayer && this._newGeozonesLayer) {
      // Always do both to sync both layers
      this._activeGeozonesLayer.clearLayers();
      this._newGeozonesLayer.clearLayers();
      // Always do both to sync both layers
      this._activeGeozonesLayer.addData(notamProcessor.geozones);
      this._newGeozonesLayer.addData(notamProcessor.geozonesDefinedByNotams);
    }
  },
});

/**
 * Leaflet Control for viewing future NOTAMS
 * 
 * @param {NotamFutureOptions} options
 * @returns {L.Control.NotamFuture}
 */
L.control.notamFuture = function (options) {
  return new L.Control.NotamFuture(options);
}
