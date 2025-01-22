const MIN_ZOOM = 9;
const MAX_ZOOM = 19;

const GEOZONE_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_validated_Prod/FeatureServer/0/query?&f=geojson&outFields=*&returnGeometry=true&returnExceededLimitFeatures=true&" + encode("where", "status='validated'") + "&orderByFields=Shape__Area";
// Shape__Area%2Cname%2Ccode%2ClowerAltitudeUnit%2CupperAltitudeUnit%2ClowerAltitudeReference%2CupperAltitudeReference%2CTimeField%2ClowerLimit%2CupperLimit%2Ccategories%2CwrittenStartTimeGeneral%2CwrittenEndTimeGeneral
const NOTAM_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_Notam_View_Prod/FeatureServer/0/query?&f=json&outFields=*&returnGeometry=false&returnExceededLimitFeatures=true&" + encode("where", "status='validated' AND last_version='yes'");
// notamId%2Cfir%2Clocation%2CactivityStart%2CvalidityEnd%2Cschedule%2ClowerLimit%2ClowerLimitUnit%2CupperLimit%2CupperLimitUnit%2ClowerLimitRef%2CupperLimitRef%2CnotamText

// https://statbel.fgov.be/nl/open-data/datalab-grid-van-de-bevolking-met-cellen-van-variabele-grootte
const POPULATION_DENSITY_URL = "https://services9.arcgis.com/AxvKXHgzoNemvsVh/ArcGIS/rest/services/Variable_cell_grid_2024_WFL1/FeatureServer/1/query?f=geojson&outFields=ms_pop,pop_dens&returnGeometry=true&returnExceededLimitFeatures=true&" + encode("where", "1=1");

const RAILWAY_URL = "https://opendata.infrabel.be/api/explore/v2.1/catalog/datasets/lijnsecties/exports/geojson";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Cache time in: hours
const NOTAM_DATASET_NAME = "notams";
const NOTAM_CACHE_TIME = 6; // 6 hours
const GEOZONE_DATASET_NAME = "geozones";
const GEOZONE_CACHE_TIME = 6; // 6 hours
const RAILWAY_DATASET_NAME = "railways";
const RAILWAY_CACHE_TIME = 2160; // 3 months
const HIGH_VOLTAGE_LINE_DATASET_NAME = "high-voltage-lines";
const HIGH_VOLTAGE_LINE_CACHE_TIME = 1440; // 2 months
const CELL_TOWER_DATASET_NAME = "cell-towers";
const CELL_TOWER_CACHE_TIME = 720; // 1 month
const WIND_TURBINE_DATASET_NAME = "wind-turbines";
const WIND_TURBINE_CACHE_TIME = 2160; // 3 months
const OBSTACLES_DATASET_NAME = "obstacles";
const OBSTACLES_CACHE_TIME = 2160; // 3 months
const LOCATION_NAME_DATASET_NAME = "location-names";
const LOCATION_NAME_CACHE_TIME = 4320; // 6 months
const POPULATION_DENSITY_DATASET_NAME = "population-density";
const POPULATION_DENSITY_CACHE_TIME = 4320; // 6 months

const PREFERRED_UNIT = "m"; // Options: ft, m

const RAILWAY_FIX = {
  // Gent - Brugge
  "1953": "50D",
  "1969": "50A",
  "2045": "50A",
  "2047": "50D OR 350A", // 50D OR 350A ?
  "2044": "50A",
  "2046": "50A",
  "2020": "50D", // 50D OR 350A ?
  "2037": "50A",
  "2021": "50D",

  // Zedelgem - Lichtervelde
  "893": "66",

  // Lessines - Ollignies
  "1956": "87",
  "1957": "87",

  // Saint-Ghislain - Villerot
  "1977": "100",
  "1978": "100",
  "1979": "100",

  // Mont-sur-Marchienne - Hourpes
  "2032": "130A",

  // Athus
  "2009": "165/1",
  "2010": "165/1",
  "2013": "165/3",
  "2014": "165/3",
  "2015": "165/3",
  "2011": "167",
  "2012": "167",

  // Hasselt
  "1936": "21A",
  "1937": "21A",
  "2041": "35",
  "2042": "35",

  // Tessenderlo
  "1961": "218",

  // Vertrijk - Ezemaal
  "1970": "36",

  // Ottignies - La Hulpe
  "2031": "161D",
  "2003": "161",
  "2058": "161A",

  // Nivelles - Linkebeek
  "2026": "124",
  "2025": "124",
  "2027": "124D",
  "2024": "124",
  "2023": "124",

  // Halle - Linkebeek
  "1966": "26",

  // Denderleeuw - Brussel-Zuid
  "1945": "50A",
  "1942": "50C",
  "1944": "50A",
  "1941": "50C",
  "1946": "50A",
  "2043": "50C",

  // Vorst-Rijtuigen
  "1955": "96B",
  "1959": "96B",

  // Schaarbeek
  "1214": "36",
  "1986": "26",
  "1987": "26",
  "1988": "26B",
  "1989": "26B",

  // Mechelen
  "909": "25",
  "1990": "25N",
  "1991": "25N",
  "1992": "25N",

  // Antwerpen-Berchem
  "1964": "27A",
  "1965": "27A",

  // Antwerpen-Haven
  "1998": "27M/2",
  "1999": "27M/2",
  "1993": "27M/",
  "1943": "10",
  "1974": "211",
  "1972": "211C",
  "1975": "211",
  "1976": "211C",
  "1983": "211",
  "1981": "211C",
  "1982": "211C",
  "1980": "211",
  "2016": "11",
  "2017": "11",
  "748": "11A",
};
const RAILWAY_DELETE = {
  // Y.Oost Driehoek Ledeberg - TW Melle
  "192": "192",
  "1958": "1958",

  // Zeebrugge-Dorp
  "1997": "1997",
  "1994": "1994",
  "1996": "1996",

  // Bundel Pelikaan
  "2053": "2053",
  "2054": "2054",
  "2055": "2055",
  "2056": "2056",
  "2057": "2057",

  // Bundel Ramskapelle
  "2050": "2050",
  "2049": "2049",
  "2048": "2048",
  "2051": "2051",
  "2052": "2052",

  // Monceau
  "175": "175",
  "2006": "2006",
  "294": "294",

  // Châtelet
  "1984": "1984",

  // Jemeppe-Sur-Sambre
  "2007": "2007",

  // Liège
  "2002": "2002",

  // Angleur
  "2029": "2029",

  // Kinkempois
  "1875": "1875",

  // Lanaken
  "1165": "1165",

  // Hasselt
  "1967": "1967",
  "1968": "1968",
  "2022": "2022",
  "2030": "2030",

  // Leuven
  "2001": "2001",
  "2038": "2038",
  "2039": "2039",
  "2040": "2040",

  // Nivelles - Linkebeek
  "56": "56",
  "2028": "2028",

  // Schaarbeek
  "1985": "1985",
  "1973": "1973",
  "1962": "1962",
  "1963": "1963",

  // Antwerpen-Haven
  "2004": "2004",
  "2005": "2005",
  "1995": "1995",
  "2000": "2000",
  "2008": "2008",
};


/*
 ***********************************
 *         TYPE DEFINITIONS        *
 ***********************************
 */

// GeoJson
/**
 * @typedef {{
 *  type: "Point",
 *  coordinates: Array<Number>,
 * }} Point
 */

/**
 * @typedef {{
 *  type: "LineString",
 *  coordinates: Array<Array<Number>>,
 * }} LineString
 */

/**
 * @typedef {{
 *  type: "Polygon",
 *  coordinates: Array<Array<Array<Number>>>,
 * }} Polygon
 */

/**
 * @typedef {{
 *  type: "MultiPoint",
 *  coordinates: Array<Array<Number>>,
 * }} MultiPoint
 */

/**
 * @typedef {{
 *  type: "MultiLineString",
 *  coordinates: Array<Array<Array<Number>>>,
 * }} MultiLineString
 */

/**
 * @typedef {{
 *  type: "MultiPolygon",
 *  coordinates: Array<Array<Array<Array<Number>>>>,
 * }} MultiPolygon
 */

/**
 * @typedef {{
 *  type: "Feature",
 *  geometry: Point | LineString | Polygon | MultiPoint | MultiLineString | MultiPolygon,
 *  properties: Object,
 * }} Feature
 */

/**
 * @typedef {{
 *  type: "FeatureCollection",
 *  features: Array<Feature>,
 * }} FeatureCollection
 */

// IndexedDB
/**
 * @typedef {{
 *  name: String,
 *  validFrom: Number,
 *  validUntil: Number,
 *  value: Object,
 * }} Dataset
 */

// NOTAMS
/**
 * @typedef {{
 *  attributes: Object,
 * }} NotamsFeature
 */

/**
 * @typedef {{
 *  alias: String,
 *  defaultValue: any,
 *  domain: any,
 *  length: Number,
 *  name: String,
 *  sqlType: String,
 *  type: String,
 * }} NotamsField
 */

/**
 * @typedef {{
 *  features: Array<NotamsFeature>,
 *  fields: Array<NotamsField>,
 *  globalIdFieldName: String,
 *  objectIdFieldName: String,
 *  uniqueIdField: Object,
 * }} NotamsResponse
 */


/*
 ***********************************
 *      CONVERSION FUNCTIONS       *
 ***********************************
 */

// 1 foot = 0.3048 metres
/**
 * @param {Number} ft
 */
function ft2m(ft) {
  return ft * 0.3048;
}
/**
 * @param {Number} m
 */
function m2ft(m) {
  return m / 0.3048;
}

// 1 nautical mile = 1.852 kilometres
/**
 * @param {Number} nm
 */
function nm2km(nm) {
  return nm * 1.852;
}
/**
 * @param {Number} km
 */
function km2nm(km) {
  return km / 1.852;
}

// flight levels = hectofeet
/**
 * @param {Number} fl
 */
function fl2ft(fl) {
  return fl * 100;
}
/**
 * @param {Number} ft
 */
function ft2fl(ft) {
  return ft / 100;
}

/**
 * Function to URI encode a url parameter.
 * 
 * @param {String} key
 * @param {String} value
 * @returns "key=value"
 */
function encode(key, value) {
  return `${key}=${encodeURIComponent(value)}`
}


/*
 ***********************************
 *       MAP LAYER RENDERING       *
 ***********************************
 */

/*
 * Properties that are numbers (weight, opacity, fillOpacity) MUST be entered as numbers, without quotes!
 */

// Create styles for GeoJSON layers
const styleGeozoneActive = {
  fill: true,
  fillColor: "#ed5151", // #ed5151
  fillOpacity: "calc(126/255)",

  stroke: false,
};
const styleGeozoneBecomeActive = {
  fill: true,
  fillColor: "#ffff00", // #ffff00
  fillOpacity: "calc(131/255)",

  stroke: false,
};
const styleGeozoneNonActive = {
  fill: false,

  stroke: true,
  color: "#ff0000", // #ff0000
  weight: 0.75,
  dashArray: "4",
};
const styleNotamGeozone = {
  fill: true,
  fillColor: "#1db9de", // #1db9de

  stroke: true,
  color: "#0e718a", // #0e718a
  weight: 2,
  radius: 8,
};
const styleRailway = {
  fill: false,

  stroke: true,
  color: "#ff0000", // #ff0000
  weight: 3,
};
const styleHighVoltageLine = {
  fill: false,

  stroke: true,
  color: "#0000cc", // #0000cc
  weight: 2,

  renderer: L.canvas(),
};
const styleCellTower = {
  fill: true,
  fillColor: "#ff7800", // #ff7800
  fillOpacity: 0.8,

  stroke: true,
  color: "#000000", // #000000
  opacity: 1,
  weight: 1,
  radius: 8,

  renderer: L.canvas(),
};
const styleWindTurbine = {
  fill: true,
  fillColor: "#cccccc", // #cccccc
  fillOpacity: 0.8,

  stroke: true,
  color: "#000000", // #000000
  opacity: 1,
  weight: 1,
  radius: 8,

  renderer: L.canvas(),
};
const styleObstacle = {
  fill: true,
  fillColor: "#555555", // #555555
  fillOpacity: 0.8,

  stroke: true,
  color: "#000000", // 000000
  opacity: 1,
  weight: 1,
  radius: 8,

  renderer: L.canvas(),
};
const stylePopulationDensityBase = {
  fill: true,
  fillColor: "#f2f0f7", // #f2f0f7
  fillOpacity: 0.8,

  stroke: true,
  color: "#6e6e6e", // #6e6e6e
  opacity: 1,
  weight: 0.5,

  renderer: L.canvas(),
};

const styleHighlight = {
  stroke: true,
  color: "#6699ff", // #6699ff
  opacity: 1,
  weight: 4,
};

// var someLayer = L.GeoJSON(geoJsonFeatureData, {
//   filter: whether to show a feature or not
//   style: for general styling of the features
//   onEachFeature: for attaching events and popups
//   pointToLayer: for adding a custom marker
// });

// Functions to render Geozone features
/* filterGeozone(feature) */
/**
 * @param {Feature} feature
 */
function filterGeozone(feature) {
  if (feature.properties) {
    const props = feature.properties;

    // Filter out geozones with lower limit above 410 ft / 125 m
    /**
     * The attributes "lowerLimit" and "upperLimit" seem to always be in "meter",
     *  despite the "lowerAltitudeUnit" and "upperAltitudeUnit" being "ft" most of the times.
     * In the code of https://apps.geocortex.com/webviewer/?app=1062438763fd493699b4857b9872c6c4&locale=en (https://map.droneguide.be/)
     *  they do a hard-coded conversion from meter to feet, regardless of the unit.
     */
    if (props.lowerLimit <= 125) { // m
      return true;
    }
  }

  return false;
}
/* styleGeozone(feature) */
/**
 * @param {Feature} geozone
 */
function renderGeoZone(geozone) {
  // script return the correct symbology for the geozones
  const props = geozone.properties;

  // get the feature fields - and their split list
  var d = props.TimeField;
  var s = null;
  if (d)
    s = d.split(";");

  var startingPoint = props.writtenStartTimeGeneral;
  if (startingPoint == null || startingPoint.length == 0)
    startingPoint = "000000";
  var sP_split = startingPoint.split(";");

  var endingPoint = props.writtenEndTimeGeneral;
  if (endingPoint == null || endingPoint.length == 0)
    endingPoint = "235959";
  var eP_split = endingPoint.split(";");

  // get the "now" time (utc) in all its necessary form
  var now = new Date();

  var hour = now.getUTCHours();
  if (hour < 10)
    hour = 0 + "" + hour;

  var minute = now.getUTCMinutes();
  if (minute < 10)
    minute = 0 + "" + minute;

  var second = now.getUTCSeconds();
  if (second < 10)
    second = 0 + "" + second;

  var year = now.getUTCFullYear().toString().slice(2); // remove the 20 in the year

  var month = now.getUTCMonth() + 1; // months range from 0-11
  if (month < 10)
    month = 0 + "" + month;

  var day = now.getUTCDay();
  if (day < 10)
    day = 0 + "" + day;

  var nowNumberFull = parseInt(hour + "" + minute + "" + second);
  var nowNumberWithDays = parseInt(year + "" + month + "" + day + "" + hour + "" + minute); // year + "" + month + "" + day + "/" + hour + "" + minute;

  // Param
  var countingInterval = 0;
  var intervalInWindow = false;

  // Assign the correct symbology to the geozone
  // Check if timeField is empty 
  if (d == null || d.length == 0 || d == "Non Active")
    return "Non Active";
  // check if nowTime is over the last end time
  if (nowNumberFull > parseInt(eP_split[eP_split.length - 1]))
    return "Non Active";

  // If geozone permanent: 
  // either in "large window" (Active)
  // Will get to it later in the day (Become Active)
  if (d && d == "permanent") {
    // check if nowTime is in one of the interval
    for (var sp in sP_split) {
      var sp_temp = parseInt(sP_split[sp]);
      var ep_temp = parseInt(eP_split[sp]);

      if ((sp_temp <= nowNumberFull) && (nowNumberFull <= ep_temp))
        return "Active";

      // if nowTime is bigger then the end time: "go to next interval" 
      if (nowNumberFull > ep_temp)
        countingInterval = countingInterval + 1;
    }
    // if did not reach the last end interval: "will"
    if (countingInterval < eP_split.length)
      return "Become active today";
  }

  // if the geozone has intervals
  // intervals needs to be in "large windows (sP-eP)"
  // if not : non active
  // if interval in "window" :
  // nowTime in interval: Active
  // otherwise : will become Active
  for (var k in s) {
    // get the variables
    var st = s[k];
    var begin = parseInt(st.split("-")[0]);
    var end = parseInt(st.split("-")[1]);

    var NowNumberToUseStart = nowNumberFull; // nowNumber
    if (begin > 999999) { // begin.length == 11
      NowNumberToUseStart = nowNumberWithDays;
    }
    var NowNumberToUseEnd = nowNumberFull; // nowNumber
    if (end > 999999) { // end.length == 11
      NowNumberToUseEnd = nowNumberWithDays;
    }

    // check if interval is in a window
    for (var sp in sP_split) {
      var sp_temp = parseInt(sP_split[sp]);
      var ep_temp = parseInt(eP_split[sp]);

      // the interval stops after the window starts
      // and start before the window ends
      // and is in the future
      if ((end >= sp_temp) && (begin <= ep_temp) && (nowNumberFull <= end)) {
        intervalInWindow = true;
      }

      // nowTime is in interval and window
      if ((sp_temp <= nowNumberFull && nowNumberFull <= ep_temp) && (NowNumberToUseStart >= begin && NowNumberToUseEnd <= end)) {
        return "Active";
      }
    }
  }

  // never interval in windows?
  if (!intervalInWindow)
    return "Non Active";

  return "Become active today";
}
/**
 * @param {Feature} feature
 */
function styleGeozone(feature) {
  switch (renderGeoZone(feature)) {
    case "Active": return styleGeozoneActive;
    case "Become active today": return styleGeozoneBecomeActive;
    case "Non Active": return styleGeozoneNonActive;
  }
}
/* onEachGeozone(feature, layer) */
/**
 * Convert the given height to the height value in the preferred unit.
 * 
 * @param {String} height the height
 * @param {String} unit current unit of the height
 * @returns height in the preferred unit
 */
function parseHeight(height, unit) {
  if (PREFERRED_UNIT == unit) {
    return `${parseInt(height)} ${PREFERRED_UNIT}`;
  } else {
    if (PREFERRED_UNIT == "ft") {
      if (unit == "FL") {
        return `${parseInt(fl2ft(height))} ${PREFERRED_UNIT}`;
      } else if (unit == "m") {
        return `${parseInt(m2ft(height))} ${PREFERRED_UNIT}`;
      }
    } else if (PREFERRED_UNIT == "m") {
      if (unit == "FL") {
        return `${parseInt(ft2m(fl2ft(height)))} ${PREFERRED_UNIT}`;
      } else if (unit == "ft") {
        return `${parseInt(ft2m(height))} ${PREFERRED_UNIT}`;
      }
    }
  }
}
function parseTimeField(d) {
  function sub(str, start, end, offset) {
    str = str.substring(start, end);
    str = (str - offset) % 24;
    if (str < 10)
      str = "0" + str;
    return str;
  }

  var now = new Date();
  // Hour offset to substract from UTC hours. UTC+2 => getTimezoneOffset() = -120
  var offset = now.getTimezoneOffset() / 60;

  var s = null;
  if (d)
    s = d.split(";");

  if (d == null || d.length == 0 || d == "Non Active")
    return "Non Active";

  if (d && d == "permanent")
    return "Permanent";

  var utc = [];
  var local = [];
  for (var k in s) {
    var st = s[k];
    var begin = st.split("-")[0];
    var end = st.split("-")[1];
    utc.push(`${sub(begin, 0, 2, 0)}:${begin.substring(2, 4)}-${sub(end, 0, 2, 0)}:${end.substring(2, 4)}`);
    local.push(`${sub(begin, 0, 2, offset)}:${begin.substring(2, 4)}-${sub(end, 0, 2, offset)}:${end.substring(2, 4)}`);
  }
  utc = "<br>&nbsp;\u2022 UTC: " + utc.join("; ");
  local = "<br>&nbsp;\u2022 Local: " + local.join("; ");
  return utc + local;
}
/**
 * @param {Object} properties properties of the Feature
 */
function popupContentGeozone(properties) {
  if (properties) {
    /*
     * The attributes "lowerLimit" and "upperLimit" seem to always be in "meter",
     *  despite the "lowerAltitudeUnit" and "upperAltitudeUnit" being "ft" most of the times.
     * In the code of https://apps.geocortex.com/webviewer/?app=1062438763fd493699b4857b9872c6c4&locale=en (https://map.droneguide.be/)
     *  they do a hard-coded conversion from meter to feet, regardless of the unit.
     *    return strings.upperLimit
     *       + ": " + Math.round($q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperLimit] / 0.3048)
     *       + " " + $q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperUnit]
     *       + " (" + $q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperAltitudeReference] + ")";
     */

    var text = `<b>${properties.name}</b>`;
    text += `<br>Lower limit: ${parseHeight(properties.lowerLimit, "m" /* properties.lowerAltitudeUnit */)} ${properties.lowerAltitudeReference}`;
    text += `<br>Upper limit: ${parseHeight(properties.upperLimit, "m" /* properties.upperAltitudeUnit */)} ${properties.upperAltitudeReference}`;
    text += `<br>Schedule: ${parseTimeField(properties.TimeField)}`;

    return text;
  } else {
    return "";
  }
}
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachGeozone(feature, layer) {
  // Highlight geozone when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, false));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(geozoneLayer, e.target));

  // When geozone is clicked, replace popup content to include the height of the clicked location
  layer.on("click", (e) => {
    if (e.sourceTarget?.feature.properties && e.latlng) {
      const baseContent = popupContentGeozone(e.sourceTarget.feature.properties);
      e.sourceTarget.setPopupContent(baseContent
        + '<div class="separator"></div>'
        + "Surface height: ---"
      );
      surfaceHeightManager.getHeight(e.latlng).then(height => {
        if (height) {
          e.sourceTarget.setPopupContent(baseContent
            + '<div class="separator"></div>'
            + `Surface height: ${Math.round(height * 100) / 100} m`
          );
        }
      });
    }
  });

  // Set default popup content
  if (feature.properties) {
    layer.bindPopup(popupContentGeozone(feature.properties));
  }
}
/* pointToLayerGeozone(point, latlng) */

// Functions to render features for Geozones activated by NOTAMS
/* filterNotamActiveGeozone(feature) */
/**
 * Get NOTAMS that are active at the current date for a geozone.
 * 
 * @param {String} geozoneName
 * @param {Date} currentDate
 */
function getActiveNotamsForGeozone(geozoneName, currentDate) {
  /** @type {NotamsFeature[]} */
  var activeNotams = [];

  if (geozoneName && currentDate && notamProcessor && notamProcessor.geozonesActiveByNotams) {
    if (Object.keys(notamProcessor.geozonesActiveByNotams).includes(geozoneName)) {
      var notams = notamProcessor.geozonesActiveByNotams[geozoneName];
      notams.forEach(notam => {
        if (notam.attributes) {
          const props = notam.attributes;

          // Change dates so the hours won't impact filtering on date
          var startDate = (new Date(props.activityStart)).setUTCHours(1, 0, 0);
          var _currentDate = currentDate.setUTCHours(2, 0, 0);
          var endDate = (new Date(props.validityEnd)).setUTCHours(3, 0, 0);

          if (startDate <= _currentDate && _currentDate <= endDate) {
            activeNotams.push(notam);
          }
        }
      });
    }
  }
  return activeNotams;
}
/**
 * @param {Feature} feature
 */
function filterNotamActiveGeozone(feature) {
  if (feature.properties && notamFutureControl) {
    const props = feature.properties;

    var activeNotams = getActiveNotamsForGeozone(props.name, notamFutureControl.getCurrentDate());
    return activeNotams.length > 0;
  }

  return false;
}
/* styleNotamActiveGeozone(feature) */
/* onEachNotamActiveGeozone(feature, layer) */
/**
 * Converts a unix timestamp to the preferred date string.
 * 
 * @param {Number} date
 * @returns UTC date string
 */
function parseNotamDate(date) {
  var _date = new Date(date);
  return _date.getUTCFullYear()
    + "/"
    + String(_date.getUTCMonth() + 1).padStart(2, "0")
    + "/"
    + String(_date.getUTCDate()).padStart(2, "0")
    + " "
    + String(_date.getUTCHours()).padStart(2, "0")
    + ":"
    + String(_date.getUTCMinutes()).padStart(2, "0");
}
/**
 * @param {Object} properties properties of the Feature
 */
function popupContentNotam(properties) {
  if (properties) {
    var text = `<b>NOTAM ${properties.notamId}</b>`;
    text += `<br>Lower limit: ${parseHeight(properties.lowerLimit, properties.lowerLimitUnit)} ${properties.lowerLimitRef}`;
    text += `<br>Upper limit: ${parseHeight(properties.upperLimit, properties.upperLimitUnit)} ${properties.upperLimitRef}`;
    text += `<br>Start: ${parseNotamDate(properties.activityStart)} UTC`;
    text += `<br>End: ${parseNotamDate(properties.validityEnd)} UTC`;
    if (properties.schedule) {
      text += `<br>Schedule: ${properties.schedule}`;
    }
    text += `<br>Text: <i>${properties.notamText}</i>`;

    return text;
  } else {
    return "";
  }
}
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachNotamActiveGeozone(feature, layer) {
  // Highlight geozone when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, false));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(notamActiveGeozoneLayer, e.target));

  // When geozone is clicked, replace popup content to include the height of the clicked location
  layer.on("click", (e) => {
    if (e.sourceTarget?.feature.properties && e.latlng && notamFutureControl) {
      var baseContent = popupContentGeozone(e.sourceTarget.feature.properties);
      var activeNotams = getActiveNotamsForGeozone(e.sourceTarget.feature.properties.name, notamFutureControl.getCurrentDate());
      if (activeNotams.length > 0) {
        var notamTexts = [];
        activeNotams.forEach(notam => {
          notamTexts.push(popupContentNotam(notam.attributes));
        });
        baseContent += '<div class="separator"></div>';
        baseContent += notamTexts.join("<br>");
      }

      e.sourceTarget.setPopupContent(baseContent
        + '<div class="separator"></div>'
        + "Surface height: ---"
      );
      surfaceHeightManager.getHeight(e.latlng).then(height => {
        if (height) {
          e.sourceTarget.setPopupContent(baseContent
            + '<div class="separator"></div>'
            + `Surface height: ${Math.round(height * 100) / 100} m`
          );
        }
      });
    }
  });

  // Set default popup content
  if (feature.properties && notamFutureControl) {
    const props = feature.properties;
    var text = popupContentGeozone(props);

    var activeNotams = getActiveNotamsForGeozone(props.name, notamFutureControl.getCurrentDate());
    if (activeNotams.length > 0) {
      var notamTexts = [];
      activeNotams.forEach(notam => {
        notamTexts.push(popupContentNotam(notam.attributes));
      });
      text += '<div class="separator"></div>';
      text += notamTexts.join("<br>");
    }
    layer.bindPopup(text);
  }
}
/* pointToLayerNotamActiveGeozone(point, latlng) */

// Functions to render features for new Geozones created by NOTAMS
/* filterNotamNewGeozone(feature) */
/**
 * @param {Feature} feature
 */
function filterNotamNewGeozone(feature) {
  if (feature.properties && notamFutureControl) {
    const props = feature.properties;

    // Change dates so the hours won't impact filtering on date
    var startDate = (new Date(props.activityStart)).setUTCHours(1, 0, 0);
    var currentDate = notamFutureControl.getCurrentDate().setUTCHours(2, 0, 0);
    var endDate = (new Date(props.validityEnd)).setUTCHours(3, 0, 0);

    return (startDate <= currentDate && currentDate <= endDate);
  }

  return false;
}
/* styleNotamNewGeozone(feature) */
/* onEachNotamNewGeozone(feature, layer) */
function onEachNotamNewGeozone(feature, layer) {
  // Highlight marker when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, true));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(notamNewGeozoneLayer, e.target));

  // When geozone is clicked, replace popup content to include the height of the clicked location
  layer.on("click", (e) => {
    if (e.sourceTarget?.feature.properties && e.latlng) {
      const baseContent = popupContentNotam(e.sourceTarget.feature.properties);
      e.sourceTarget.setPopupContent(baseContent
        + '<div class="separator"></div>'
        + "Surface height: ---"
      );
      surfaceHeightManager.getHeight(e.latlng).then(height => {
        if (height) {
          e.sourceTarget.setPopupContent(baseContent
            + '<div class="separator"></div>'
            + `Surface height: ${Math.round(height * 100) / 100} m`
          );
        }
      });
    }
  });

  // Set default popup content
  if (feature.properties) {
    layer.bindPopup(popupContentNotam(feature.properties));
  }
}
/* pointToLayerNotamNewGeozone(point, latlng) */
function pointToLayerNotamNewGeozone(point, latlng) {
  if (point.properties.radius) {
    return L.circle(latlng, { radius: point.properties.radius });
  } else {
    return L.circleMarker(latlng, styleNotamGeozone);
  }
}

// Functions to render Railway features
/* filterRailway(feature) */
/* styleRailway(feature) */
/* onEachRailway(feature, layer) */
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachRailway(feature, layer) {
  // Highlight railway when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, true));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(railwayLayer, e.target));

  if (feature.properties) {
    const props = feature.properties;
    layer.bindPopup(`Line: ${props.label}`);
  }
}
/* pointToLayerRailway(point, latlng) */

// Functions to render HighVoltageLine features
/* filterHighVoltageLine(feature) */
/* styleHighVoltageLine(feature) */
/* onEachHighVoltageLine(feature, layer) */
/* pointToLayerHighVoltageLine(point, latlng) */

// Functions to render CellTower features
/* filterCellTower(feature) */
/* styleCellTower(feature) */
/* onEachCellTower(feature, layer) */
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachCellTower(feature, layer) {
  // Highlight marker when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, true));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(cellTowerLayer, e.target));

  var text = "<b>Cell Tower</b>";

  if (feature.properties) {
    const props = feature.properties;

    text += "<br>Operators:";
    if (props["communication:gsm-r"] && props["operator"]) {
      text += `<br>&nbsp;\u2022 ${props.operator}`;
    }
    for (var key in props) {
      if (key.startsWith("ref:BE:") && key != "ref:BE:BIPT") {
        text += `<br>&nbsp;\u2022 ${key.slice(7)}`
      }
    }

    // Add height if it's in the properties
    if (props["height"]) {
      text += `<br>Height: ${props.height}m`;
    }
  }

  layer.bindPopup(text);
}
/* pointToLayerCellTower(point, latlng) */
/**
 * @param {Feature} point
 * @param {L.LatLng} latlng
 */
function pointToLayerCellTower(point, latlng) {
  return L.circleMarker(latlng);
}

// Functions to render WindTurbine features
/* filterWindTurbine(feature) */
/* styleWindTurbine(feature) */
/* onEachWindTurbine(feature, layer) */
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachWindTurbine(feature, layer) {
  // Highlight marker when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, true));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(windTurbineLayer, e.target));

  var text = "<b>Wind Turbine</b>";

  if (feature.properties) {
    const props = feature.properties;

    // Add height if it's in the properties
    if (props["height"]) {
      // The height is from ground to top of the blade
      text += `<br>Height: ${props.height}m`;
    } else if (props["rotor:diameter"]) {
      // Calculate height using the hub height and the radius of the blade
      var rotor_diameter = parseInt(props["rotor:diameter"]);
      if (props["height:hub"]) {
        var height_hub = parseInt(props["height:hub"])
        text += `<br>Height: ${rotor_diameter / 2 + height_hub}m`;
      } else {
        // Estimate the hub height as the radius of the blade
        text += `<br>Height: ${rotor_diameter}m (estimate)`;
      }
    }
  }

  layer.bindPopup(text);
}
/* pointToLayerWindTurbine(point, latlng) */
/**
 * @param {Feature} point
 * @param {L.LatLng} latlng
 */
function pointToLayerWindTurbine(point, latlng) {
  return L.circleMarker(latlng);
}

// Functions to render Obstacle features
/* filterObstacle(feature) */
/* styleObstacle(feature) */
/* onEachObstacle(feature, layer) */
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachObstacle(feature, layer) {
  // Highlight marker when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, true));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(obstacleLayer, e.target));

  var text = "<b>Obstacle</b>";

  if (feature.properties) {
    const props = feature.properties;

    // Decide type name
    if (props["man_made"]) {
      if (props["man_made"] == "tower") text = "<b>Tower</b>";
      if (props["man_made"] == "chimney") text = "<b>Chimney</b>";
      if (props["man_made"] == "crane") text = "<b>Crane</b>";
      if (props["man_made"] == "water_tower") text = "<b>Water tower</b>";
      if (props["man_made"] == "antenna") text = "<b>Antenna</b>";
    }
    if (props["communication:radio"]) text = "<b>Communication tower</b>";
    if (props["communication:television"]) text = "<b>Communication tower</b>";
    if (props["tower:type"]) {
      if (props["tower:type"] == "communication") text = "<b>Communication tower</b>";
      if (props["tower:type"] == "cooling") text = "<b>Cooling tower</b>";
      if (props["tower:type"] == "bell_tower") text = "<b>Bell tower</b>";
    }
    if (props["building"]) {
      if (props["building"] == "water_tower") text = "<b>Water tower</b>";
      if (props["building"] == "church") text = "<b>Church</b>";
      if (props["building"] == "cathedral") text = "<b>Cathedral</b>";
    }

    // Add height if it's in the properties
    if (props["height"]) {
      text += `<br>Height: ${props.height}m`;
    }
  }

  layer.bindPopup(text);
}
/* pointToLayerObstacle(point, latlng) */
/**
 * @param {Feature} point
 * @param {L.LatLng} latlng
 */
function pointToLayerObstacle(point, latlng) {
  return L.circleMarker(latlng);
}

// Functions to render Population density features
/* filterPopulationDensity(feature) */
function getColor(density) {
  if (density > 5000) return "#54278f";
  if (density > 2000) return "#756bb1";
  if (density > 1000) return "#9e9ac8";
  if (density > 250) return "#cbc9e2";
  if (density > 1) return "#f2f0f7";
  return "#ffffff";
}
/**
 * @param {Feature} feature
 */
function stylePopulationDensity(feature) {
  if (feature.properties) {
    return Object.assign({}, stylePopulationDensityBase, {
      fill: (feature.properties.pop_dens > 1),
      fillColor: getColor(feature.properties.pop_dens),
    });
  }
}
/**
 * @param {Object} properties properties of the Feature
 */
function popupContentPopulationDensity(properties) {
  if (properties) {
    var text = "";
    text += `Population: ${properties.ms_pop}`;
    text += `<br>Population density: ${Math.round(properties.pop_dens)}`;
    return text;
  } else {
    return "";
  }
}
/**
 * @param {Feature} feature
 * @param {L.Layer} layer
 */
function onEachPopulationDensity(feature, layer) {
  // Highlight population density square when popup is opened (when it is clicked)
  layer.on("popupopen", (e) => highlightFeature(e.target, false));
  // Remove highlight when popup is closed (when something else is clicked or the popup is closed)
  layer.on("popupclose", (e) => resetHighlight(populationDensityLayer, e.target));

  // When population density square is clicked, replace popup content to include the height of the clicked location
  layer.on("click", (e) => {
    if (e.sourceTarget?.feature.properties && e.latlng) {
      const baseContent = popupContentPopulationDensity(e.sourceTarget.feature.properties);
      e.sourceTarget.setPopupContent(baseContent
        + '<div class="separator"></div>'
        + "Surface height: ---"
      );
      surfaceHeightManager.getHeight(e.latlng).then(height => {
        if (height) {
          e.sourceTarget.setPopupContent(baseContent
            + '<div class="separator"></div>'
            + `Surface height: ${Math.round(height * 100) / 100} m`
          );
        }
      });
    }
  });

  // Set default popup content
  if (feature.properties) {
    layer.bindPopup(popupContentPopulationDensity(feature.properties));
  }
}
/* pointToLayerPopulationDensity(point, latlng) */


/**
 * Highlight the given layer. Option to do layer.bringToFront().
 * This would break the ordering of small polygons on top of large polygons, so give the option to do this.
 * 
 * @param {L.GeoJSON} layer The layer to highlight
 * @param {Boolean} bringToFront Wether to bring the layer to the front
 */
function highlightFeature(layer, bringToFront) {
  layer.setStyle(styleHighlight);

  if (bringToFront) {
    layer.bringToFront();
  }
}

/**
 * Stop highlighting a layer that is part of a GeoJSON layer.
 * With Canvas renderer, resetStyle() does not work, so when resetStyle option is given, apply that style instead to stop the highlighting.
 * 
 * @param {L.GeoJSON} geojson The GeoJSON layer that contains the layer to stop highlighting
 * @param {L.GeoJSON} layer The layer to stop highlighting
 * @param {L.PathOptions | L.StyleFunction<any>} resetStyle Optional, reset style (original style) to use
 */
function resetHighlight(geojson, layer, resetStyle) {
  geojson.resetStyle(layer);

  if (resetStyle) {
    layer.setStyle(resetStyle);
  }
}

/*
 ***********************************
 *               MAP               *
 ***********************************
 */

// Define overlay layers
const geozoneLayer = L.geoJSON([], {
  filter: filterGeozone,
  style: styleGeozone,
  onEachFeature: onEachGeozone,
});
const notamActiveGeozoneLayer = L.geoJSON([], {
  filter: filterNotamActiveGeozone,
  style: styleNotamGeozone,
  onEachFeature: onEachNotamActiveGeozone,
});
const notamNewGeozoneLayer = L.geoJSON([], {
  filter: filterNotamNewGeozone,
  style: styleNotamGeozone,
  onEachFeature: onEachNotamNewGeozone,
  pointToLayer: pointToLayerNotamNewGeozone,
});
const railwayLayer = L.geoJSON([], {
  style: styleRailway,
  onEachFeature: onEachRailway,
});
const highVoltageLineLayer = L.geoJSON([], {
  style: styleHighVoltageLine,
});
const cellTowerLayer = L.geoJSON([], {
  style: styleCellTower,
  onEachFeature: onEachCellTower,
  pointToLayer: pointToLayerCellTower,
});
const windTurbineLayer = L.geoJSON([], {
  style: styleWindTurbine,
  onEachFeature: onEachWindTurbine,
  pointToLayer: pointToLayerWindTurbine,
});
const obstacleLayer = L.geoJSON([], {
  style: styleObstacle,
  onEachFeature: onEachObstacle,
  pointToLayer: pointToLayerObstacle,
});
const populationDensityLayer = L.geoJSON([], {
  style: stylePopulationDensity,
  onEachFeature: onEachPopulationDensity,
});

// Define base tile layers
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
});
const osmHOT = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr" target="_blank">OpenStreetMap France</a>'
});
const openTopoMap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org" target="_blank">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0" target="_blank">CC-BY-SA</a>)'
});
const cartoLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
  minZoom: MIN_ZOOM,
  maxZoom: MAX_ZOOM,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution" target="_blank">CARTO</a>'
});

// Initialize the map + set visible layers
const layers = [
  osm,
  geozoneLayer,
  notamActiveGeozoneLayer,
  notamNewGeozoneLayer,
  railwayLayer,
  highVoltageLineLayer,
];
const map = L.map("map", {
  layers: layers,
  maxBounds: [[51.6, 6.5], [49.5, 2.2]],
});

// Request location of device and set view to location
map.locate({ setView: true, maxZoom: MAX_ZOOM });
map.on("locationfound", (e) => { console.log("Found location:", e.latlng); });
map.on("locationerror", (e) => { console.log(e.message); map.setView([50.848, 4.357], 11); });

// Add scale control
L.control.scale().addTo(map);

// Create layer controls
const baseMaps = {
  "OpenStreetMap": osm,
  "OSM Humanitarian": osmHOT,
  "OpenTopoMap": openTopoMap,
  "Carto Light": cartoLight,
};
const overlayMaps = {
  "No-Fly Zones": geozoneLayer,
  "NOTAMS": notamActiveGeozoneLayer,
  "Railways": railwayLayer,
  "High-Voltage Lines": highVoltageLineLayer,
  "Cell Towers": cellTowerLayer,
  "Wind Turbines": windTurbineLayer,
  "Obstacles": obstacleLayer,
  "Population density": populationDensityLayer,
};
const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Give checkboxes in the overlay menu a custom color
function styleOverlayCheckboxes() {
  document.getElementsByClassName("leaflet-control-layers-overlays")[0].childNodes.forEach(child => {
    switch (child.childNodes[0].childNodes[1].textContent.trim()) {
      case "No-Fly Zones":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #ed5151;");
        break;
      case "NOTAMS":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #1db9de;");
        break;
      case "Railways":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #ff0000;");
        break;
      case "High-Voltage Lines":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #0000ff;");
        break;
      case "Cell Towers":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #ff7800;");
        break;
      case "Wind Turbines":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #cccccc;");
        break;
      case "Obstacles":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #555555;");
        break;
      case "Population density":
        child.childNodes[0].childNodes[0].setAttribute("style", "accent-color: #756bb1;");
        break;
      default:
        break;
    }
  });
}


/*
 ***********************************
 *        CUSTOM MAP THINGS        *
 ***********************************
 */

/* Surface height */

// Show surface height of the location when clicking on the map
const surfaceHeightManager = new SurfaceHeightManager(map);
surfaceHeightManager.register();


/* Event forwarder */

// Add EventForwarder to forward events that would otherwise be blocked/stopped by top Canvas layer
const eventForwarder = new L.eventForwarder({
  map: map,
  events: {
    click: true,
  },
  throttleMs: 100,
  throttleOptions: {
    leading: true,
    trailing: false,
  },
});
eventForwarder.enable();


/* NOTAMS */

// Create instance of NotamProcessor to handle NOTAM messages
const notamProcessor = new NotamProcessor();

// Create Leaflet Control for viewing future NOTAMS
const notamFutureControl = L.control.notamFuture({
  position: 'bottomleft',
  notamProcessor: notamProcessor,
  activeGeozonesLayer: notamActiveGeozoneLayer,
  newGeozonesLayer: notamNewGeozoneLayer,
}).addTo(map);

// Sync notamGeozoneLayer to geozoneOverrideLayer and hide/show NotamFutureControl when layer is hidden/shown
notamActiveGeozoneLayer.on("add", (event) => {
  notamNewGeozoneLayer.addTo(map);
  notamFutureControl.addTo(map);
});
notamActiveGeozoneLayer.on("remove", (event) => {
  notamNewGeozoneLayer.removeFrom(map);
  notamFutureControl.remove();
});

/**
 * Parse the NOTAMS response after getting the data from the API.
 */
async function parseNotams() {
  if (await notamProcessor.parseNotams()) {
    // Always do both to sync notamNewGeozoneLayer to notamActiveGeozoneLayer
    notamActiveGeozoneLayer.addData(notamProcessor.geozones);
    notamNewGeozoneLayer.addData(notamProcessor.geozonesDefinedByNotams);
  }
}


/* Population density */

// Leaflet Control for a legend for the population density layer
L.Control.PopulationDensityLegend = L.Control.extend({
  options: {
    position: "bottomright",
  },

  onAdd: function (map) {
    var div = L.DomUtil.create('div', 'control-population-density-legend info');
    var grades = [1, 250, 1000, 2000, 5000];
    var labels = [];

    // Loop through our density intervals and generate a label with a colored square for each interval
    for (var i = -1; i < grades.length; i++) {
      var from = grades[i];
      var to = grades[i + 1];

      labels.push(`<i style="background: ${getColor(from + 1)};"></i> ${from ? from : '<'}${(from && to) ? "&ndash;" : ""}${to ? to : '+'}`);
    }
    div.innerHTML = labels.join('<br>');
    return div;
  },
});

const populationDensityLegend = new L.Control.PopulationDensityLegend();

// Hide/show PopulationDensityLegend when population density layer is hidden/shown
populationDensityLayer.on("add", (event) => populationDensityLegend.addTo(map));
populationDensityLayer.on("remove", (event) => populationDensityLegend.remove(map));


/*
 ***********************************
 *         DATA AQUISITION         *
 ***********************************
 */

const datasetsDB = new DBDatasets();

// Functions to get datasets
function buildOverpassQuery(filterString) {
  const q = "[out:json][maxsize:32Mi][timeout:45];"
    + 'area["name"="België / Belgique / Belgien"]->.belgie;'
    + filterString
    + "out geom;";

  return encode("data", q);
}

async function getNotams() {
  const response = await (await fetch(NOTAM_URL)).json();

  // Cache fetched data in IndexedDB
  if (response) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: NOTAM_DATASET_NAME,
        validTimeHours: NOTAM_CACHE_TIME,
        value: response,
      },
    });
  }

  return response;
}

async function getGeozones() {
  const response = await (await fetch(GEOZONE_URL)).json();

  // Sort geozones descending by area
  // so the biggest one gets added first and is the bottom element
  /**
   * Geozones are sorted ascending by area by the API when "&orderByFields=Shape__Area" is included in the URL
   *  so only need to reverse the results to get them sorted descending
   */
  if (response) {
    response.features.reverse();
    // response.features.sort((a, b) => b.properties.Shape__Area - a.properties.Shape__Area)
  }

  // Cache fetched data in IndexedDB
  if (response) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: GEOZONE_DATASET_NAME,
        validTimeHours: GEOZONE_CACHE_TIME,
        value: response,
      },
    });
  }

  return response;
}

async function getRailways() {
  const response = await (await fetch(RAILWAY_URL)).json();

  // New object that will contain all the railway sections that are not deleted
  const geojson = { type: "FeatureCollection", features: [] };

  // Fix missing labels for railway sections
  for (let i = 0; i < response.features.length; i++) {
    if (RAILWAY_DELETE[response.features[i].properties["ls_id"]]) {
      // Check first if this section should be deleted
      continue;
    } else if (/\d+.*?L\/\d+/.test(response.features[i].properties["label"])) {
      // Filter out all non-mainline railway sections
      continue;
    } else if (RAILWAY_FIX[response.features[i].properties["ls_id"]]) {
      // Apply fix for missing label
      response.features[i].properties["label"] = RAILWAY_FIX[response.features[i].properties["ls_id"]]
    }
    // Include section in new object if it's not deleted
    geojson.features.push(response.features[i]);
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: RAILWAY_DATASET_NAME,
        validTimeHours: RAILWAY_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getHighVoltageLines() {
  // Fetch data
  const q = buildOverpassQuery('way["power"="line"](area.belgie);');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).json();
  const geojson = osmtogeojson(response, { flatProperties: true });

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = {};
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: HIGH_VOLTAGE_LINE_DATASET_NAME,
        validTimeHours: HIGH_VOLTAGE_LINE_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getCellTowers() {
  // Fetch data
  const q = buildOverpassQuery('( node["ref:BE:BIPT"](area.belgie); node["communication:gsm-r"]["operator"="Infrabel"](area.belgie); node["tower:type"="communication"](area.belgie); );');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).json();
  const geojson = osmtogeojson(response, { flatProperties: true });

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    const gfp = geojson.features[i].properties;

    var new_properties = {};
    if (gfp["operator"]) new_properties["operator"] = gfp["operator"];
    if (gfp["communication:gsm-r"]) new_properties["communication:gsm-r"] = gfp["communication:gsm-r"];
    for (var key in gfp) {
      if (key.startsWith("ref:BE:")) {
        new_properties[key] = "";
      }
    }
    if (gfp["height"]) new_properties["height"] = gfp["height"].replaceAll(' ', '').replaceAll('m', '');

    geojson.features[i].properties = new_properties;
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: CELL_TOWER_DATASET_NAME,
        validTimeHours: CELL_TOWER_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getWindTurbines() {
  // Fetch data
  const q = buildOverpassQuery('node["generator:source"="wind"](area.belgie);');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).json();
  const geojson = osmtogeojson(response, { flatProperties: true });

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    const gfp = geojson.features[i].properties;

    var new_properties = {};
    if (gfp["height"]) new_properties["height"] = gfp["height"].replaceAll(' ', '').replaceAll('m', '');
    if (gfp["height:hub"]) new_properties["height:hub"] = gfp["height:hub"].replaceAll(' ', '').replaceAll('m', '');
    if (gfp["rotor:diameter"]) new_properties["rotor:diameter"] = gfp["rotor:diameter"].replaceAll(' ', '').replaceAll('m', '');

    geojson.features[i].properties = new_properties;
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: WIND_TURBINE_DATASET_NAME,
        validTimeHours: WIND_TURBINE_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getObstacles() {
  // Buildings (offices, appartments) that are tall
  // nw["building"="office"]["building:levels"]["building:levels"!="1"]["building:levels"!="2"]["building:levels"!="3"]["building:levels"!="4"]["building:levels"!="5"]["building:levels"!="6"]["building:levels"!="7"]["building:levels"!="8"]["building:levels"!="9"](area.belgie);
  // nw["building"="apartments"]["building:levels"]["building:levels"!="1"]["building:levels"!="2"]["building:levels"!="3"]["building:levels"!="4"]["building:levels"!="5"]["building:levels"!="6"]["building:levels"!="7"]["building:levels"!="8"]["building:levels"!="9"](area.belgie);

  const rawGeojson = { type: "FeatureCollection", features: [] };
  const geojson = { type: "FeatureCollection", features: [] };

  /**
   * Towers
   */
  // Fetch data
  const q1 = buildOverpassQuery('nw["man_made"="tower"](area.belgie);');
  const response1 = await (await fetch(OVERPASS_URL, { method: "POST", body: q1 })).json();
  const geojson1 = osmtogeojson(response1, { flatProperties: true });

  // Combine individual results
  if (geojson1 && geojson1.features) {
    rawGeojson.features = rawGeojson.features.concat(geojson1.features);
  }

  /**
   * Chimneys, Cranes, Water towers, Antennas, Communication towers
   */
  // Fetch data
  const str2 = [
    '(',
    // Chimneys
    'nw["man_made"="chimney"](area.belgie);',
    // Cranes
    'nw["man_made"="crane"](area.belgie);',
    // Water towers
    'nw["man_made"="water_tower"](area.belgie);',
    'nw["building"="water_tower"](area.belgie);',
    // Antennas
    'nw["man_made"="antenna"][!"ref:BE:BIPT"](area.belgie);',
    // Communication towers
    'nw["tower:type"="communication"][!"ref:BE:BIPT"](area.belgie);',
    'nw["communication:radio"](area.belgie);',
    'nw["communication:television"](area.belgie);',
    ');'
  ];
  const q2 = buildOverpassQuery(str2.join(' '));
  const response2 = await (await fetch(OVERPASS_URL, { method: "POST", body: q2 })).json();
  const geojson2 = osmtogeojson(response2, { flatProperties: true });

  // Combine individual results
  if (geojson2 && geojson2.features) {
    rawGeojson.features = rawGeojson.features.concat(geojson2.features);
  }

  /**
   * Churches, Cathedrals
   */
  // Fetch data
  const q3 = buildOverpassQuery('( nw["building"="church"](area.belgie); nw["building"="cathedral"](area.belgie); );');
  const response3 = await (await fetch(OVERPASS_URL, { method: "POST", body: q3 })).json();
  const geojson3 = osmtogeojson(response3, { flatProperties: true });

  // Combine individual results
  if (geojson3 && geojson3.features) {
    rawGeojson.features = rawGeojson.features.concat(geojson3.features);
  }

  var addedIds = {};

  // We can combine all data before stripping, because we will do the same for all data
  // Strip non-essential data
  for (let i = 0; i < rawGeojson.features.length; i++) {
    const gfid = rawGeojson.features[i].id;
    const gfp = rawGeojson.features[i].properties;

    // Check for duplicates
    if (addedIds[gfid]) {
      continue;
    } else {
      addedIds[gfid] = 1;
    }

    var new_properties = {};
    if (gfp["man_made"]) new_properties["man_made"] = gfp["man_made"];
    if (gfp["building"]) new_properties["building"] = gfp["building"];
    if (gfp["tower:type"]) new_properties["tower:type"] = gfp["tower:type"];
    if (gfp["communication:radio"]) new_properties["communication:radio"] = gfp["communication:radio"];
    if (gfp["communication:television"]) new_properties["communication:television"] = gfp["communication:television"];
    if (gfp["height"]) new_properties["height"] = gfp["height"].replaceAll(' ', '').replaceAll('m', '');

    rawGeojson.features[i].properties = new_properties;

    // Transform "way" features to a point
    if (gfid.startsWith("way/")) {
      /**
       * GeoJson coordinates are [lng, lat] but Leaflet wants L.LatLng ( so [lat, lng] or { lat, lng } )
       * so the coordinates of the bounds and center are the wrong way around
       * (L.getCenter.lat = GeoJson.lng and L.getCenter.lng = GeoJson.lat)
       * We need to flip the lat and lng in the end, because our layer is L.GeoJson
       * so it expects coordinates in [lng, lat], which is [L.getCenter.lat, L.getCenter.lng]
       */
      const layer = L.polygon(rawGeojson.features[i].geometry.coordinates, { stroke: false, fill: false });
      const center = layer.getBounds().getCenter();
      const coordinates = [center.lat, center.lng];

      rawGeojson.features[i].geometry = {
        type: "Point",
        coordinates: coordinates,
      };
    }

    geojson.features.push(rawGeojson.features[i]);
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: OBSTACLES_DATASET_NAME,
        validTimeHours: OBSTACLES_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getLocationNames() {
  /**
   * Town names
   */
  // Fetch data
  const str = [
    '(',
    'node["place"="city"](area.belgie);',
    'node["place"="borough"](area.belgie);',
    'node["place"="suburb"](area.belgie);',
    'node["place"="town"](area.belgie);',
    'node["place"="village"](area.belgie);',
    ');'
  ]
  const q = buildOverpassQuery(str.join(' '));
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).json();
  const geojson = osmtogeojson(response, { flatProperties: true });

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    const gfp = geojson.features[i].properties;
    if (!gfp["name"]) continue;

    var new_properties = {};
    if (gfp["name"]) new_properties["name"] = gfp["name"];
    if (gfp["name:nl"]) new_properties["name:nl"] = gfp["name:nl"];
    if (gfp["name:fr"]) new_properties["name:fr"] = gfp["name:fr"];
    if (gfp["postal_code"]) new_properties["postal_code"] = gfp["postal_code"];

    geojson.features[i].properties = new_properties;
  }

  /**
   * Station names
   */
  // Fetch data
  const q2 = buildOverpassQuery('( node["railway"="halt"]["operator"="NMBS/SNCB"](area.belgie); node["railway"="station"]["operator"="NMBS/SNCB"](area.belgie); );');
  const response2 = await (await fetch(OVERPASS_URL, { method: "POST", body: q2 })).json();
  const geojson2 = osmtogeojson(response2, { flatProperties: true });

  // Strip non-essential data
  for (let i = 0; i < geojson2.features.length; i++) {
    const gfp = geojson2.features[i].properties;
    if (!gfp["name"]) continue;

    var new_properties = {};
    if (gfp["name"]) new_properties["name"] = gfp["name"];
    if (gfp["name:nl"]) new_properties["name:nl"] = gfp["name:nl"];
    if (gfp["name:fr"]) new_properties["name:fr"] = gfp["name:fr"];
    new_properties["railway:ref"] = gfp["railway:ref"] ? gfp["railway:ref"] : "-"; // Always add "railway:ref" to identify stations

    geojson2.features[i].properties = new_properties;

    // Add stripped station feature to location features
    geojson.features.push(geojson2.features[i]);
  }

  // Cache fetched data in IndexedDB
  if (geojson) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: LOCATION_NAME_DATASET_NAME,
        validTimeHours: LOCATION_NAME_CACHE_TIME,
        value: geojson,
      },
    });
  }

  return geojson;
}

async function getPopulationDensity() {
  const data = { type: "FeatureCollection", features: [] };

  var res;
  var offset = 0;
  do {
    res = await (await fetch(POPULATION_DENSITY_URL + "&resultOffset=" + offset)).json();
    if (res?.features.length) {
      offset += res.features.length;
      data.features = data.features.concat(res.features);
    }
  } while (res?.properties?.exceededTransferLimit);

  // Cache fetched data in IndexedDB
  if (data.features.length) {
    datasetsDB.addJob({
      type: EJobType.UpdateDataset,
      params: {
        name: POPULATION_DENSITY_DATASET_NAME,
        validTimeHours: POPULATION_DENSITY_CACHE_TIME,
        value: data,
      },
    });
  }

  return data;
}


/**
 * Get NOTAM warnings.
 * 
 * @param {NotamsResponse} value
 */
function processNotams(value) {
  console.log("Successfully got NOTAMS");
  /* console.debug(value); */

  // Remove all newline and tab characters from the NOTAM messages
  value.features.forEach(notam => {
    notam.attributes.notamText = notam.attributes.notamText
      .replaceAll("\n", " ")
      .replaceAll("\r", " ")
      .replaceAll("\t", " ")
      .replaceAll("  ", " ");
  });

  notamProcessor.notams = value;
  parseNotams();
  styleOverlayCheckboxes();
}

/**
 * Create items for No-Fly zones.
 * 
 * @param {FeatureCollection} value
 */
function processGeozones(value) {
  console.log("Successfully got no-fly zones");
  /* console.debug(value); */

  geozoneLayer.addData(value);
  styleOverlayCheckboxes();

  notamProcessor.geozones = value;
  parseNotams();
  styleOverlayCheckboxes();
}

/**
 * Create items for Railway lines.
 * 
 * @param {FeatureCollection} value
 */
function processRailways(value) {
  console.log("Successfully got railways");
  /* console.debug(value); */

  railwayLayer.addData(value);
  styleOverlayCheckboxes();
}

/**
 * Create items for High-voltage lines.
 * 
 * @param {FeatureCollection} value
 */
function processHighVoltageLines(value) {
  console.log("Successfully got high-voltage lines");
  /* console.debug(value); */

  highVoltageLineLayer.addData(value);
  styleOverlayCheckboxes();
}

/**
 * Create items for Cell towers.
 * 
 * @param {FeatureCollection} value
 */
function processCellTowers(value) {
  console.log("Successfully got cell towers");
  /* console.debug(value); */

  cellTowerLayer.addData(value);
  styleOverlayCheckboxes();
}

/**
 * Create items for Wind turbines.
 * 
 * @param {FeatureCollection} value
 */
function processWindTurbines(value) {
  console.log("Successfully got wind turbines");
  /* console.debug(value); */

  windTurbineLayer.addData(value);
  styleOverlayCheckboxes();
}

/**
 * Create items for Obstacles.
 * 
 * @param {FeatureCollection} value
 */
function processObstacles(value) {
  console.log("Successfully got obstacles");
  /* console.debug(value); */

  obstacleLayer.addData(value);
  styleOverlayCheckboxes();
}

/**
 * Get locations.
 * 
 * @param {FeatureCollection} value
 */
function processLocationNames(value) {
  console.log("Successfully got location names");
  /* console.debug(value); */

  const locationSearchBar = new LocationSearchBar(map, {
    location_search_bar_name: "location-search-bar",
    location_search_clear_name: "location-search-clear",
    location_search_results_name: "location-search-results",
  });
  locationSearchBar.setLocationNames(value);
}

/**
 * Create items for Population density.
 * 
 * @param {FeatureCollection} value
 */
function processPopulationDensity(value) {
  console.log("Successfully got population density");
  /* console.debug(value); */

  populationDensityLayer.addData(value);
  styleOverlayCheckboxes();
}


// Get Notam messages from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: NOTAM_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processNotams(result.value);
    } else {
      getNotams().then(
        (value) => processNotams(value),
        (error) => console.error("Error getting NOTAMS:", error),
      );
    }
  },
});

// Get Geozones from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: GEOZONE_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processGeozones(result.value);
    } else {
      getGeozones().then(
        (value) => processGeozones(value),
        (error) => console.error("Error getting no-fly zones:", error),
      );
    }
  },
});

// Get Railways from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: RAILWAY_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processRailways(result.value);
    } else {
      getRailways().then(
        (value) => processRailways(value),
        (error) => console.error("Error getting railways:", error),
      );
    }
  },
});

// Get High-voltage lines from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: HIGH_VOLTAGE_LINE_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processHighVoltageLines(result.value);
    } else {
      getHighVoltageLines().then(
        (value) => processHighVoltageLines(value),
        (error) => console.error("Error getting high-voltage lines:", error),
      );
    }
  },
});

// Get Cell towers from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: CELL_TOWER_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processCellTowers(result.value);
    } else {
      getCellTowers().then(
        (value) => processCellTowers(value),
        (error) => console.error("Error getting cell towers:", error),
      );
    }
  },
});

// Get Wind turbines from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: WIND_TURBINE_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processWindTurbines(result.value);
    } else {
      getWindTurbines().then(
        (value) => processWindTurbines(value),
        (error) => console.error("Error getting wind turbines:", error),
      );
    }
  },
});

// Get Obstacles from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: OBSTACLES_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processObstacles(result.value);
    } else {
      getObstacles().then(
        (value) => processObstacles(value),
        (error) => console.error("Error getting obstacles:", error),
      );
    }
  },
});

// Get Location names from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: LOCATION_NAME_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processLocationNames(result.value);
    } else {
      getLocationNames().then(
        (value) => processLocationNames(value),
        (error) => console.error("Error getting location names:", error),
      );
    }
  },
});

// Get Population density from cache or from online
datasetsDB.addJob({
  type: EJobType.GetDataset,
  params: {
    name: POPULATION_DENSITY_DATASET_NAME,
  },
  callback: (/** @type {Dataset} */ result) => {
    // Check if the cache is still valid
    if (result && result.validUntil > Date.now()) {
      processPopulationDensity(result.value);
    } else {
      getPopulationDensity().then(
        (value) => processPopulationDensity(value),
        (error) => console.error("Error getting population density:", error),
      );
    }
  },
});
