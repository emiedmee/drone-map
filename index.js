const ARCGIS_LIMIT = "" // empty: no limit
const GEOZONE_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_validated_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=geojson&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&where=status%3D%27validated%27&orderByFields=Shape__Area";
// Shape__Area%2Cname%2Ccode%2ClowerAltitudeUnit%2CupperAltitudeUnit%2ClowerAltitudeReference%2CupperAltitudeReference%2CTimeField%2ClowerLimit%2CupperLimit%2Ccategories%2CwrittenStartTimeGeneral%2CwrittenEndTimeGeneral
const NOTAM_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_Notam_View_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=json&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=status%3D%27validated%27%20AND%20last_version%3D%27yes%27";
// notamId%2Cfir%2Clocation%2CactivityStart%2CvalidityEnd%2Cschedule%2ClowerLimit%2ClowerLimitUnit%2CupperLimit%2CupperLimitUnit%2ClowerLimitRef%2CupperLimitRef%2CnotamText

const RAILWAY_URL = "https://opendata.infrabel.be/api/explore/v2.1/catalog/datasets/lijnsecties/exports/geojson";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";


const NOTAM_CACHE = "notam-cache";
const NOTAM_CACHE_TIME = 1; // 1D
const GEOZONE_CACHE = "geozone-cache";
const GEOZONE_CACHE_TIME = 1; // 1D
const RAILWAY_CACHE = "railway-cache";
const RAILWAY_CACHE_TIME = 90; // 3M
const HIGH_VOLTAGE_LINE_CACHE = "high-voltage-line-cache";
const HIGH_VOLTAGE_LINE_CACHE_TIME = 60; // 2M
const CELL_TOWER_CACHE = "cell-tower-cache";
const CELL_TOWER_CACHE_TIME = 30; // 1M
const WIND_TURBINE_CACHE = "wind-turbine-cache";
const WIND_TURBINE_CACHE_TIME = 90; // 3M
const CHIMNEY_CACHE = "chimney-cache";
const CHIMNEY_CACHE_TIME = 90; // 3M
const LOCATION_NAMES_CACHE = "location-names-cache";
const LOCATION_NAMES_CACHE_TIME = 180; // 6M

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


/***********************************
 *      CONVERSION FUNCTIONS       *
 ***********************************/

// 1 foot = 0.3048 metres
function ft2m(ft) {
  return ft * 0.3048;
}
function m2ft(m) {
  return m / 0.3048;
}

// 1 nautical mile = 1.852 kilometres
function nm2km(nm) {
  return nm * 1.852;
}
function km2nm(km) {
  return km / 1.852;
}

// flight levels = hectofeet
function fl2ft(fl) {
  return fl * 100;
}
function ft2fl(ft) {
  return ft / 100;
}


/***********************************
 *       MAP LAYER RENDERING       *
 ***********************************/

// Create styles for GeoJSON layers
const styleGeozoneActive = {
  "fillColor": "rgba(237, 81, 81)",
  "fillOpacity": "calc(126/255)",

  "color": "rgba(153, 153, 153)",
  "opacity": "calc(64/255)",
  "weight": "0.75"
};
const styleGeozoneBecomeActive = {
  "fillColor": "rgb(255, 255, 0, 131)",
  "fillOpacity": "calc(131/255)",

  "stroke": false,
};
const styleGeozoneNonActive = {
  "fill": false,

  "color": "rgb(255, 0, 0)",
  "weight": "0.75"
};
const styleRailway = {
  "fill": false,

  "color": "#ff0000",
  "weight": "3"
};
const styleHighVoltageLine = {
  "fill": false,

  "color": "#0000ff",
  "weight": "2"
};
const markerOptionsCellTower = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
const markerOptionsWindTurbine = {
  radius: 8,
  fillColor: "#cccccc",
  color: "#000000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
const markerOptionsChimney = {
  radius: 8,
  fillColor: "#555555",
  color: "#000000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

// var someLayer = L.GeoJSON(geoJsonFeatureData, {
//   filter: whether to show a feature or not
//   style: for general styling of the features
//   onEachFeature: for attaching events and popups
//   pointToLayer: for adding a custom marker
// });

// Functions to render Geozone features
/* filterGeozone(feature, layer) */
function filterGeozone(feature, layer) {
  var show = false;

  if (feature.properties) {
    const props = feature.properties;

    // Filter out geozones with lower limit above 410 ft / 125 m
    /**
     * The attributes "lowerLimit" and "upperLimit" seem to always be in "meter",
     *  despite the "lowerAltitudeUnit" and "upperAltitudeUnit" being "ft" most of the times.
     * In the code of https://apps.geocortex.com/webviewer/?app=1062438763fd493699b4857b9872c6c4&locale=en (https://map.droneguide.be/)
     *  they do a hard-coded conversion from meter to feet, regardless of the unit.
     */
    if (props.lowerLimit && props.lowerLimit <= 125) // m
      show = true;
    // if (props.lowerAltitudeUnit && props.lowerLimit) {
    //   if (props.lowerAltitudeUnit == "ft") {
    //     if (props.lowerLimit <= 410) // ft
    //       show = true;
    //   } else if (props.lowerAltitudeUnit == "m") {
    //     if (props.lowerLimit <= 125) // m
    //       show = true;
    //   }
    // }

    // /**
    //  * For NOTAM:
    //  * If 'location' == "EBBU"
    //  *  - take first part of 'notamText' until the "-"
    //  *  - maybe until first 6/7 characters and trim whitespaces
    //  *  - use that to compare with 'name' LIKE '%.....%' for geozone
    //  * Else:
    //  *  - use 'location' to compare with 'code' for geozone
    //  */
    // if (NOTAMS && NOTAMS.features) {
    //   NOTAMS.features.forEach(notam => {
    //     if (notam.attributes) {
    //       const n_a = notam.attributes;
    //       if (n_a.location && n_a.location == "EBBU") {
    //         if (n_a.notamText && props.name.includes(n_a.notamText.split('-')[0].trim()))
    //           return true; // early return because geozone is active by NOTAM
    //       } else {
    //         if (n_a.location && props.code && n_a.location == props.code)
    //           return true; // early return because geozone is active by NOTAM
    //       }
    //     }
    //   });
    // }
  }

  return show;
}
/* styleGeozone(feature) */
function renderGeoZone(geozone) {
  // script return the correct symbology for the geozones
  const props = geozone.properties;

  // get the feature fields - and their split list
  var d = props.TimeField;
  var s = null;
  if (d)
    s = d.split(';');

  var startingPoint = props.writtenStartTimeGeneral;
  if (startingPoint == null || startingPoint.length == 0)
    startingPoint = "000000";
  var sP_split = startingPoint.split(';');

  var endingPoint = props.writtenEndTimeGeneral;
  if (endingPoint == null || endingPoint.length == 0)
    endingPoint = "235959";
  var eP_split = endingPoint.split(';');

  // get the 'now' time (utc) in all its necessary form
  var now = new Date();

  var hour = now.getUTCHours();
  if (hour < 10)
    hour = 0 + '' + hour;

  var minute = now.getUTCMinutes();
  if (minute < 10)
    minute = 0 + '' + minute;

  var second = now.getUTCSeconds();
  if (second < 10)
    second = 0 + '' + second;

  var year = now.getUTCFullYear().toString().slice(2); // remove the 20 in the year

  var month = now.getUTCMonth() + 1; // months range from 0-11
  if (month < 10)
    month = 0 + '' + month;

  var day = now.getUTCDay();
  if (day < 10)
    day = 0 + '' + day;

  var nowNumberFull = parseInt(hour + '' + minute + '' + second);
  var nowNumberWithDays = parseInt(year + '' + month + '' + day + '' + hour + '' + minute); // year + '' + month + '' + day + '/' + hour + '' + minute;

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
  // either in 'large window' (Active)
  // Will get to it later in the day (Become Active)
  if (d && d == "permanent") {
    // check if nowTime is in one of the interval
    for (var sp in sP_split) {
      var sp_temp = parseInt(sP_split[sp]);
      var ep_temp = parseInt(eP_split[sp]);

      if ((sp_temp <= nowNumberFull) && (nowNumberFull <= ep_temp))
        return "Active";

      // if nowTime is bigger then the end time: 'go to next interval' 
      if (nowNumberFull > ep_temp)
        countingInterval = countingInterval + 1;
    }
    // if did not reach the last end interval: 'will'
    if (countingInterval < eP_split.length)
      return "Become active today";
  }

  // if the geozone has intervals
  // intervals needs to be in 'large windows (sP-eP)'
  // if not : non active
  // if interval in 'window' :
  // nowTime in interval: Active
  // otherwise : will become Active
  for (var k in s) {
    // get the variables
    var st = s[k];
    var begin = parseInt(st.split('-')[0]);
    var end = parseInt(st.split('-')[1]);

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
function styleGeozone(feature) {
  switch (renderGeoZone(feature)) {
    case "Active": return styleGeozoneActive;
    case "Become active today": return styleGeozoneBecomeActive;
    case "Non Active": return styleGeozoneNonActive;
  }
}
/* onEachGeozone(feature, layer) */
function parseHeight(height, unit) {
  /**
   * The attributes "lowerLimit" and "upperLimit" seem to always be in "meter",
   *  despite the "lowerAltitudeUnit" and "upperAltitudeUnit" being "ft" most of the times.
   * In the code of https://apps.geocortex.com/webviewer/?app=1062438763fd493699b4857b9872c6c4&locale=en (https://map.droneguide.be/)
   *  they do a hard-coded conversion from meter to feet, regardless of the unit.
   *    return strings.upperLimit
   *       + ': ' + Math.round($q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperLimit] / 0.3048)
   *       + ' ' + $q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperUnit]
   *       + ' (' + $q_featureGeozone.feature.attributes[$fieldNamesZone.result.upperAltitudeReference] + ')';
   */
  // height unit is always "m"
  if (PREFERRED_UNIT == "ft") {
    return `${parseInt(m2ft(height)).toFixed(0)} ${PREFERRED_UNIT}`;
  } else if (PREFERRED_UNIT == "m") {
    return `${parseInt(height).toFixed(0)} ${PREFERRED_UNIT}`;
  }

  // if (PREFERRED_UNIT == unit) {
  //   return parseInt(height).toFixed(0) + " " + unit;
  // } else {
  //   if (PREFERRED_UNIT == "ft") {
  //     if (unit == "FL") {
  //       return `${parseInt(fl2ft(height)).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     } else if (unit == "ft") {
  //       return `${parseInt(height).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     } else if (unit == "m") {
  //       return `${parseInt(m2ft(height)).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     }
  //   } else if (PREFERRED_UNIT == "m") {
  //     if (unit == "FL") {
  //       return `${parseInt(ft2m(fl2ft(height))).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     } else if (unit == "ft") {
  //       return `${parseInt(ft2m(height)).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     } else if (unit == "m") {
  //       return `${parseInt(height).toFixed(0)} ${PREFERRED_UNIT} (Original: ${height} ${unit})`;
  //     }
  //   }
  // }
}
function parseTimeField(d) {
  function sub(str, start, end, offset) {
    str = str.substring(start, end);
    str = (str - offset) % 24;
    if (str < 10)
      str = '0' + str;
    return str;
  }

  var now = new Date();
  // Hour offset to substract from UTC hours. UTC+2 => getTimezoneOffset() = -120
  var offset = now.getTimezoneOffset() / 60;

  var s = null;
  if (d)
    s = d.split(';');

  if (d == null || d.length == 0 || d == "Non Active")
    return "Non Active";

  if (d && d == "permanent")
    return "Permanent";

  var utc = "";
  var local = "";
  for (var k in s) {
    var st = s[k];
    var begin = st.split('-')[0];
    var end = st.split('-')[1];
    utc += `; ${sub(begin, 0, 2, 0)}:${begin.substring(2, 4)}-${sub(end, 0, 2, 0)}:${end.substring(2, 4)}`;
    local += `; ${sub(begin, 0, 2, offset)}:${begin.substring(2, 4)}-${sub(end, 0, 2, offset)}:${end.substring(2, 4)}`;
  }
  utc = "<br>&nbsp;\u2022 UTC: " + utc.substring(2);
  local = "<br>&nbsp;\u2022 Local: " + local.substring(2);
  return utc + local;
}
function onEachGeozone(feature, layer) {
  if (feature.properties) {
    const props = feature.properties;
    layer.bindPopup(`${props.name}`
      + `<br>Lower limit: ${parseHeight(props.lowerLimit, props.lowerAltitudeUnit)} ${props.lowerAltitudeReference}`
      + `<br>Upper limit: ${parseHeight(props.upperLimit, props.upperAltitudeUnit)} ${props.upperAltitudeReference}`
      + `<br>Schedule: ${parseTimeField(props.TimeField)}`
    );
  }
}
/* pointToLayerGeozone(feature, latlng) */

// Functions to render Railway features
/* filterRailway(feature, layer) */
/* styleRailway(feature) */
/* onEachRailway(feature, layer) */
function onEachRailway(feature, layer) {
  if (feature.properties) {
    const props = feature.properties;
    layer.bindPopup(`Line: ${props.label}`);
  }
}
/* pointToLayerRailway(feature, latlng) */

// Functions to render HighVoltageLine features
/* filterHighVoltageLine(feature, layer) */
/* styleHighVoltageLine(feature) */
/* onEachHighVoltageLine(feature, layer) */
/* pointToLayerHighVoltageLine(feature, latlng) */

// Functions to render CellTower features
/* filterCellTower(feature, layer) */
/* styleCellTower(feature) */
/* onEachCellTower(feature, layer) */
function onEachCellTower(feature, layer) {
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
  }

  layer.bindPopup(text);
}
/* pointToLayerCellTower(feature, latlng) */
function pointToLayerCellTower(feature, latlng) {
  return L.circleMarker(latlng, markerOptionsCellTower);
}

// Functions to render WindTurbine features
/* filterWindTurbine(feature, layer) */
/* styleWindTurbine(feature) */
/* onEachWindTurbine(feature, layer) */
function onEachWindTurbine(feature, layer) {
  var text = "<b>Wind Turbine</b>";

  layer.bindPopup(text);
}
/* pointToLayerWindTurbine(feature, latlng) */
function pointToLayerWindTurbine(feature, latlng) {
  return L.circleMarker(latlng, markerOptionsWindTurbine);
}

// Functions to render Chimney features
/* filterChimney(feature, layer) */
/* styleChimney(feature) */
/* onEachChimney(feature, layer) */
function onEachChimney(feature, layer) {
  var text = "<b>Chimney</b>";

  layer.bindPopup(text);
}
/* pointToLayerWindTurbine(feature, latlng) */
function pointToLayerChimney(feature, latlng) {
  return L.circleMarker(latlng, markerOptionsChimney);
}


/***********************************
 *               MAP               *
 ***********************************/

// Define overlay layers
var geozoneLayer = L.geoJSON([], {
  filter: filterGeozone,
  style: styleGeozone,
  onEachFeature: onEachGeozone,
});
var railwayLayer = L.geoJSON([], {
  style: styleRailway,
  onEachFeature: onEachRailway,
});
var highVoltageLineLayer = L.geoJSON([], {
  style: styleHighVoltageLine,
});
var cellTowerLayer = L.geoJSON([], {
  onEachFeature: onEachCellTower,
  pointToLayer: pointToLayerCellTower,
});
var windTurbineLayer = L.geoJSON([], {
  onEachFeature: onEachWindTurbine,
  pointToLayer: pointToLayerWindTurbine,
});
var chimneyLayer = L.geoJSON([], {
  onEachFeature: onEachChimney,
  pointToLayer: pointToLayerChimney,
});

// Define base tile layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
});
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr" target="_blank">OpenStreetMap France</a>'
});
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 16,
  attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org" target="_blank">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0" target="_blank">CC-BY-SA</a>)'
});
var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution" target="_blank">CARTO</a>'
});

// Initialize the map + set active overlays
var map = L.map('map', { layers: [osm, geozoneLayer, railwayLayer, highVoltageLineLayer, cellTowerLayer, windTurbineLayer, chimneyLayer] }).fitWorld();

// Request location of device and set view to location
map.locate({ setView: true, maxZoom: 16 });
map.on('locationfound', (e) => { console.log('Found location:', e.latlng); });
map.on('locationerror', (e) => { console.log(e.message); map.setView([50.848, 4.357], 11); });

// Add scale control
var scaleControl = L.control.scale().addTo(map);

// Create layer controls
var baseMaps = {
  "OpenStreetMap": osm,
  "OSM Humanitarian": osmHOT,
  "OpenTopoMap": openTopoMap,
  "Carto Light": cartoLight,
};
var overlayMaps = {
  "No-Fly Zones": geozoneLayer,
  "Railways": railwayLayer,
  "High-Voltage Lines": highVoltageLineLayer,
  "Cell Towers": cellTowerLayer,
  "Wind Turbines": windTurbineLayer,
  "Chimneys": chimneyLayer,
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

// Give checkboxes in the overlay menu a custom color
document.getElementsByClassName("leaflet-control-layers-overlays")[0].childNodes.forEach(child => {
  switch (child.childNodes[0].childNodes[1].textContent.trim()) {
    case "No-Fly Zones":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:rgb(237, 81, 81)");
      break;
    case "Railways":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:#ff0000");
      break;
    case "High-Voltage Lines":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:#0000ff");
      break;
    case "Cell Towers":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:#ff7800");
      break;
    case "Wind Turbines":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:#cccccc");
      break;
    case "Chimneys":
      child.childNodes[0].childNodes[0].setAttribute("style", "accent-color:#555555");
      break;
    default:
      break;
  }
});


/***********************************
 *         DATA AQUISITION         *
 ***********************************/

// Functions to get datasets
function buildOverpassQuery(filterString) {
  const q = "[maxsize:16Mi][timeout:30];"
    + 'area["name"="België / Belgique / Belgien"]->.belgie;'
    + filterString
    + "out geom;";

  return "data=" + encodeURIComponent(q);
}

async function getNotams() {
  const response = await (await fetch(NOTAM_URL)).json();

  return response;
}

async function getGeoZones() {
  const response = await (await fetch(GEOZONE_URL)).json();

  // Sort geozones descending by area
  // so the biggest one gets added first and is the bottom element
  /**
   * Geozones are sorted ascending by area by the API when "&orderByFields=Shape__Area" is included in the URL
   *  so only need to reverse the results to get them sorted descending
   */
  response.features.reverse();
  // response.features.sort((a, b) => b.properties.Shape__Area - a.properties.Shape__Area)

  geozoneLayer.addData(response);
  return response;
}

async function getRailways() {
  const response = await (await fetch(RAILWAY_URL)).json();

  // New object that will contain all the railway sections that are not deleted
  var new_response = { "type": "FeatureCollection", "features": [] };

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
    new_response.features.push(response.features[i]);
  }

  railwayLayer.addData(new_response);
  return new_response;
}

async function getHighVoltageLines() {
  // Check if it's cached in localStorage
  var cache = localStorage.getItem(HIGH_VOLTAGE_LINE_CACHE);
  if (cache) {
    var cacheJson = JSON.parse(cache);
    // Check if the cache is still valid
    if (cacheJson && cacheJson.validUntil > Date.now()) {
      highVoltageLineLayer.addData(cacheJson.value);
      return cacheJson.value;
    }
  }

  // Fetch data
  const q = buildOverpassQuery('way["power"="line"](area.belgie);');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();
  const geojson = osm2geojson(response);

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = {};
  }

  // Cache fetched data in localStorage
  if (geojson) {
    var newCache = JSON.stringify({
      validUntil: Date.now() + (1000 * 60 * 60 * 24 * HIGH_VOLTAGE_LINE_CACHE_TIME),
      value: geojson
    });
    try {
      localStorage.setItem(HIGH_VOLTAGE_LINE_CACHE, newCache);
    } catch (error) {
      // Probably QuotaExceededError
      console.error(error);
    }
  }

  highVoltageLineLayer.addData(geojson);
  return geojson;
}

async function getCellTowers() {
  // Check if it's cached in localStorage
  var cache = localStorage.getItem(CELL_TOWER_CACHE);
  if (cache) {
    var cacheJson = JSON.parse(cache);
    // Check if the cache is still valid
    if (cacheJson && cacheJson.validUntil > Date.now()) {
      cellTowerLayer.addData(cacheJson.value);
      return cacheJson.value;
    }
  }

  // Fetch data
  const q = buildOverpassQuery('( node["ref:BE:BIPT"](area.belgie); node["communication:gsm-r"="yes"]["operator"="Infrabel"](area.belgie); node["tower:type"="communication"](area.belgie); );');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();
  const geojson = osm2geojson(response);

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

    geojson.features[i].properties = new_properties;
  }

  // Cache fetched data in localStorage
  if (geojson) {
    var newCache = JSON.stringify({
      validUntil: Date.now() + (1000 * 60 * 60 * 24 * CELL_TOWER_CACHE_TIME),
      value: geojson
    });
    try {
      localStorage.setItem(CELL_TOWER_CACHE, newCache);
    } catch (error) {
      // Probably QuotaExceededError
      console.error(error);
    }
  }

  cellTowerLayer.addData(geojson);
  return geojson;
}

async function getWindTurbines() {
  // Check if it's cached in localStorage
  var cache = localStorage.getItem(WIND_TURBINE_CACHE);
  if (cache) {
    var cacheJson = JSON.parse(cache);
    // Check if the cache is still valid
    if (cacheJson && cacheJson.validUntil > Date.now()) {
      windTurbineLayer.addData(cacheJson.value);
      return cacheJson.value;
    }
  }

  // Fetch data
  const q = buildOverpassQuery('node["generator:source"="wind"](area.belgie);');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();
  const geojson = osm2geojson(response);

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = {};
  }

  // Cache fetched data in localStorage
  if (geojson) {
    var newCache = JSON.stringify({
      validUntil: Date.now() + (1000 * 60 * 60 * 24 * WIND_TURBINE_CACHE_TIME),
      value: geojson
    });
    try {
      localStorage.setItem(WIND_TURBINE_CACHE, newCache);
    } catch (error) {
      // Probably QuotaExceededError
      console.error(error);
    }
  }

  windTurbineLayer.addData(geojson);
  return geojson;
}

async function getChimneys() {
  // Check if it's cached in localStorage
  var cache = localStorage.getItem(CHIMNEY_CACHE);
  if (cache) {
    var cacheJson = JSON.parse(cache);
    // Check if the cache is still valid
    if (cacheJson && cacheJson.validUntil > Date.now()) {
      chimneyLayer.addData(cacheJson.value);
      return cacheJson.value;
    }
  }

  // Fetch data
  const q = buildOverpassQuery('node["man_made"="chimney"](area.belgie);');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();
  const geojson = osm2geojson(response);

  // Strip non-essential data
  for (let i = 0; i < geojson.features.length; i++) {
    geojson.features[i].properties = {};
  }

  // Cache fetched data in localStorage
  if (geojson) {
    var newCache = JSON.stringify({
      validUntil: Date.now() + (1000 * 60 * 60 * 24 * CHIMNEY_CACHE_TIME),
      value: geojson
    });
    try {
      localStorage.setItem(CHIMNEY_CACHE, newCache);
    } catch (error) {
      // Probably QuotaExceededError
      console.error(error);
    }
  }

  chimneyLayer.addData(geojson);
  return geojson;
}

async function getLocationNames() {
  // Check if it's cached in localStorage
  var cache = localStorage.getItem(LOCATION_NAMES_CACHE);
  if (cache) {
    var cacheJson = JSON.parse(cache);
    // Check if the cache is still valid
    if (cacheJson && cacheJson.validUntil > Date.now()) {
      return cacheJson.value;
    }
  }

  /**
   * Town names
   */
  // Fetch data
  const q = buildOverpassQuery('( node["place"="city"](area.belgie); node["place"="borough"](area.belgie); node["place"="suburb"](area.belgie); node["place"="town"](area.belgie); node["place"="village"](area.belgie); );');
  const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();
  const geojson = osm2geojson(response);

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
  const response2 = await (await fetch(OVERPASS_URL, { method: "POST", body: q2 })).text();
  const geojson2 = osm2geojson(response2);

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

  // Cache fetched data in localStorage
  if (geojson) {
    var newCache = JSON.stringify({
      validUntil: Date.now() + (1000 * 60 * 60 * 24 * LOCATION_NAMES_CACHE_TIME),
      value: geojson
    });
    try {
      localStorage.setItem(LOCATION_NAMES_CACHE, newCache);
    } catch (error) {
      // Probably QuotaExceededError
      console.error(error);

      if (error.code == error.QUOTA_EXCEEDED_ERR) {
        try {
          // Try clearing localStorage and saving again
          localStorage.clear();
          localStorage.setItem(LOCATION_NAMES_CACHE, newCache);
        } catch (err) {
          // Probably QuotaExceededError
          console.error(error);
        }
      }
    }
  }

  return geojson;
}

// Get NOTAM warnings and No-Fly zones
var NOTAMS;
getNotams().then(
  (value) => { console.log("Successfully got NOTAMS"); /* console.debug(value); */ NOTAMS = value; },
  (error) => { console.log("Error getting NOTAMS:", error); }
);
getGeoZones().then(
  (value) => { console.log("Successfully got no-fly zones"); /* console.debug(value); */ },
  (error) => { console.log("Error getting no-fly zones:", error); }
);

// Create items for Railway lines
getRailways().then(
  (value) => { console.log("Successfully got railways"); /* console.debug(value); */ },
  (error) => { console.log("Error getting railways:", error); }
);

// Create items for High-voltage lines
getHighVoltageLines().then(
  (value) => { console.log("Successfully got high-voltage lines"); /* console.debug(value); */ },
  (error) => { console.log("Error getting high-voltage lines:", error); }
);

// Create items for Cell towers
getCellTowers().then(
  (value) => { console.log("Successfully got cell towers"); /* console.debug(value); */ },
  (error) => { console.log("Error getting cell towers:", error); }
);

// Create items for Wind turbines
getWindTurbines().then(
  (value) => { console.log("Successfully got wind turbines"); /* console.debug(value); */ },
  (error) => { console.log("Error getting wind turbines:", error); }
);

// Create items for Chimneys
getChimneys().then(
  (value) => { console.log("Successfully got chimneys"); /* console.debug(value); */ },
  (error) => { console.log("Error getting chimneys:", error); }
);

// Get locations
var LOCATION_NAMES;
getLocationNames().then(
  (value) => { console.log("Successfully got location names"); /* console.debug(value); */ LOCATION_NAMES = value; },
  (error) => { console.log("Error getting location names:", error); }
)


/***********************************
 *           SEARCH BAR            *
 ***********************************/

const ICON_NMBS = '<svg xmlns="http://www.w3.org/2000/svg" class="icon-nmbs" viewBox="0 0 64 64"><path d="M32 50.7C17.4 50.7 5.5 42.3 5.5 32S17.4 13.3 32 13.3 58.5 21.7 58.5 32 46.6 50.7 32 50.7m0-39.6C14.3 11.1 0 20.4 0 32s14.3 20.9 32 20.9S64 43.5 64 32 49.7 11.1 32 11.1"></path><path d="M33.4 43h-3.5c-1.1 0-1.7-.5-1.7-1.4v-8c0-.5.2-.7.7-.7h4.5a5.2 5.2 0 0 1 5.2 5.1 4.94 4.94 0 0 1-5.2 5m-5.2-20.4c0-.9.6-1.4 1.7-1.4h2.3a4.31 4.31 0 0 1 4.5 4.3 4.46 4.46 0 0 1-4.5 4.4h-3.3c-.5 0-.7-.2-.7-.7zm14.1 8.9c-.7-.3-.7-.4 0-.8a5.91 5.91 0 0 0 2.8-5.2c0-3.9-5.2-7.8-13.5-7.8a22 22 0 0 0-13.3 4.4c-.7.6-.6.9-.4 1.1l1.2 1.4c.4.4.6.3.8.1.9-.7 1-.3 1 .5V39c0 .8-.1 1.2-1 .5-.2-.2-.4-.3-.8.1l-1.3 1.5c-.2.3-.4.6.4 1.1a24.7 24.7 0 0 0 13.6 4.3c9.3 0 15.1-3.9 15.1-9.1.1-3.5-2.8-5.2-4.6-5.9"></path></svg>';

function OnLocationSearchGotFocus() {
  OnLocationSearch();
}

function OnLocationSearchLostFocus() {
  // Delay the hiding of search results, because when the search results
  //  are clicked, there is some delay as well and the click would be skipped.
  setTimeout(() => {
    location_search_results.classList.add("hidden");
    location_search_results.innerHTML = "";
  }, 150);
}

function OnLocationSearchClear() {
  location_search_bar.value = "";
  if (location_marker) {
    location_marker.removeFrom(map);
    location_marker = null;
  }
  OnLocationSearch();
}

function OnLocationSearch() {
  if (location_search_bar.value.length < 2) {
    location_search_results.classList.add("hidden");
    return;
  }

  // Clear left-over results and show results container
  location_search_results.classList.add("hidden");
  location_search_results.innerHTML = "";

  // Do the actual search
  var results = [];
  for (var i = 0; i < LOCATION_NAMES.features.length; i++) {
    const props = LOCATION_NAMES.features[i].properties;

    // If searchText is included in "name" or "name:nl" or "name:fr" or "postal_code" or "railway:ref", it's a match
    if ((props["name"] && Normalize(props["name"]).includes(Normalize(location_search_bar.value))) ||
      (props["name:nl"] && Normalize(props["name:nl"]).includes(Normalize(location_search_bar.value))) ||
      (props["name:fr"] && Normalize(props["name:fr"]).includes(Normalize(location_search_bar.value))) ||
      (props["postal_code"] && Normalize(props["postal_code"]).includes(Normalize(location_search_bar.value))) ||
      (props["railway:ref"] && Normalize(props["railway:ref"]).includes(Normalize(location_search_bar.value)))
    ) {
      results.push(i);
    }
  }

  // Display the results
  results.forEach(res => {
    if (res < 0 || res >= LOCATION_NAMES.features.length) return;

    const location = LOCATION_NAMES.features[res];

    const item = document.createElement("div");
    item.innerHTML = location.properties["name"];
    if (location.properties["railway:ref"]) {
      item.innerHTML = `${ICON_NMBS}<span class="station">${item.innerHTML}</span>`;
    }
    item.setAttribute("onclick", "OnClickLocationSearchResult(" + res + ")");

    location_search_results.appendChild(item);
  });

  location_search_results.classList.remove("hidden");
}

function OnClickLocationSearchResult(index) {
  // Clear left-over results and hide results container
  location_search_results.classList.add("hidden");
  location_search_results.innerHTML = "";

  // Place the text of the clicked result in the search bar
  const location = LOCATION_NAMES.features[index];
  location_search_bar.value = location.properties["name"];

  // Add marker to the map
  if (location_marker) {
    location_marker.removeFrom(map);
    location_marker = null;
  }
  if (location.geometry.type == "Point") {
    // GeoJson coordinates are [lon, lat] and Leaflet wants [lat, lon].
    // Array.reverse() will change the data itselve, so this can't be used.
    location_marker = L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]]).addTo(map);
    map.flyTo([location.geometry.coordinates[1], location.geometry.coordinates[0]], 13);
  }
}

function Normalize(text) {
  var normalized = "";
  text = ("" + text).trim().toLowerCase();

  for (var i = 0; i < text.length; i++) {
    switch (text[i]) {
      case "á":
      case "à":
      case "â":
      case "ä":
      case "ã":
        normalized += "a";
        break;
      case "é":
      case "è":
      case "ê":
      case "ë":
        normalized += "e";
        break;
      case "í":
      case "ì":
      case "î":
      case "ï":
        normalized += "i";
        break;
      case "ó":
      case "ò":
      case "ô":
      case "ö":
      case "õ":
        normalized += "o";
        break;
      case "ú":
      case "ù":
      case "û":
      case "ü":
        normalized += "u";
        break;
      case " ":
      case "-":
      case "'":
      case "/":
        // remove spaces, dashes, ...
        break;
      default:
        normalized += text[i];
        break;
    }
  }

  return normalized;
}

var location_marker; // Marker for the location search result
var location_search = document.getElementById("location-search");
var location_search_bar = document.getElementById("location-search-bar");
var location_search_clear = document.getElementById("location-search-clear");
var location_search_results = document.getElementById("location-search-results");

location_search_bar.addEventListener("input", OnLocationSearch);
location_search_bar.addEventListener("focus", OnLocationSearchGotFocus);
location_search_bar.addEventListener("blur", OnLocationSearchLostFocus);
location_search_clear.addEventListener("click", OnLocationSearchClear);
