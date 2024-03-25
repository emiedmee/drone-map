const ARCGIS_LIMIT = "" // empty: no limit
const GEOZONE_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_validated_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=geojson&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&where=status%3D%27validated%27";
// notamId%2Ccode%2Cname%2ClowerLimit%2CupperLimit%2ClowerAltitudeUnit%2CupperAltitudeUnit%2Creason%2Crestriction%2COtherReasonInfo%2CShape__Area
const NOTAM_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_Notam_View_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=json&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=status%20%3D%20%27validated%27%20AND%20last_version%20%3D%20%27yes%27";
// notamId%2Cfir%2Clocation%2CactivityStart%2CvalidityEnd%2Cschedule%2CnotamText%2ClowerLimit%2CupperLimit%2ClowerLimitUnit%2CupperLimitUnit

const RAILWAY_URL = "https://opendata.infrabel.be/api/explore/v2.1/catalog/datasets/lijnsecties/exports/geojson";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const BIPT_URL = "https://www.sites.bipt.be/ajaxinterface.php"; // method: POST; body: action=getSites&latfrom=51.02670680117774&latto=51.06863331870643&longfrom=3.6838944547166808&longto=3.8242276303758604&LangSiteTable=sitesnl

// Create custom icons
const iconCellTower = L.divIcon({
    iconSize: [60, 60],
    iconAnchor: [31, 50],
    popupAnchor: [0, -45],
    className: "",
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m7.3 14.7 1.2-1.2c-1-1-1.5-2.3-1.5-3.5 0-1.3.5-2.6 1.5-3.5L7.3 5.3c-1.3 1.3-2 3-2 4.7s.7 3.4 2 4.7zM19.1 2.9l-1.2 1.2c1.6 1.6 2.4 3.8 2.4 5.9 0 2.1-.8 4.3-2.4 5.9l1.2 1.2c2-2 2.9-4.5 2.9-7.1 0-2.6-1-5.1-2.9-7.1z"></path><path d="M6.1 4.1 4.9 2.9C3 4.9 2 7.4 2 10c0 2.6 1 5.1 2.9 7.1l1.2-1.2c-1.6-1.6-2.4-3.8-2.4-5.9 0-2.1.8-4.3 2.4-5.9zm10.6 10.6c1.3-1.3 2-3 2-4.7-.1-1.7-.7-3.4-2-4.7l-1.2 1.2c1 1 1.5 2.3 1.5 3.5 0 1.3-.5 2.6-1.5 3.5l1.2 1.2zM14.5 10c0-1.38-1.12-2.5-2.5-2.5S9.5 8.62 9.5 10c0 .76.34 1.42.87 1.88L7 22h2l.67-2h4.67l.66 2h2l-3.37-10.12c.53-.46.87-1.12.87-1.88zm-4.17 8L12 13l1.67 5h-3.34z"></path></svg>'
});
const iconWindTurbine = L.divIcon({
    iconSize: [35, 60],
    iconAnchor: [23, 55],
    popupAnchor: [0, -60],
    className: "",
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 646"><g><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 275.3125 217.898438 C 275.3125 232.601562 263.386719 244.515625 248.675781 244.515625 C 233.960938 244.515625 222.035156 232.601562 222.035156 217.898438 C 222.035156 203.199219 233.960938 191.285156 248.675781 191.285156 C 263.386719 191.285156 275.3125 203.199219 275.3125 217.898438 Z M 275.3125 217.898438 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 294.621094 191.046875 C 367.789062 59.125 380.304688 6.507812 373.273438 2.453125 C 366.265625 -1.597656 326.921875 35.496094 249.238281 164.679688 C 268.589844 164.886719 285.449219 175.433594 294.621094 191.046875 Z M 294.621094 191.046875 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 195.390625 217.898438 C 195.390625 208.363281 197.9375 199.425781 202.34375 191.675781 C 51.757812 194.339844 0 209.800781 0 217.898438 C 0 225.992188 51.75 241.460938 202.332031 244.117188 C 197.9375 236.375 195.390625 227.441406 195.390625 217.898438 Z M 195.390625 217.898438 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 294.675781 244.675781 C 285.53125 260.308594 268.691406 270.875 249.328125 271.109375 C 326.960938 400.136719 366.257812 437.207031 373.285156 433.15625 C 380.304688 429.101562 367.808594 376.515625 294.675781 244.675781 Z M 294.675781 244.675781 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 222.035156 277.371094 L 222.035156 643.835938 L 275.320312 643.835938 L 275.320312 361.949219 C 260.035156 339.375 242.40625 311.578125 222.035156 277.371094 Z M 222.035156 277.371094 "/></g></svg>'
});
const iconChimney = L.divIcon({
    iconSize: [56, 56],
    iconAnchor: [32, 50],
    popupAnchor: [0, -56],
    className: "",
    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path id="rect4495" d="M 10.318359 0 A 1.741594 1.2970195 0 0 0 8.6601562 0.90039062 A 1.1655669 0.92076844 0 0 0 8.2539062 0.84179688 A 1.1655669 0.92076844 0 0 0 7.0898438 1.7617188 A 1.1655669 0.92076844 0 0 0 7.0917969 1.7851562 A 0.82779479 0.70560503 0 0 0 7 1.7792969 A 0.82779479 0.70560503 0 0 0 6.171875 2.484375 A 0.82779479 0.70560503 0 0 0 7 3.1894531 A 0.82779479 0.70560503 0 0 0 7.8125 2.6152344 A 1.1655669 0.92076844 0 0 0 8.2539062 2.6835938 A 1.1655669 0.92076844 0 0 0 9.2050781 2.2929688 A 1.741594 1.2970195 0 0 0 10.318359 2.59375 A 1.741594 1.2970195 0 0 0 12.058594 1.296875 A 1.741594 1.2970195 0 0 0 10.318359 0 z M 6.1289062 4.59375 L 5.7421875 14 L 8.2578125 14 L 7.859375 4.59375 L 6.1289062 4.59375 z " style="fill:#555555;fill-opacity:1;stroke:none"/></svg>'
});

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
    "weight": "2"
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
//     filter: whether to show a feature or not
//     style: for general styling of the features
//     onEachFeature: for attaching events and popups
//     pointToLayer: for adding a custom marker
// });

// Functions to render Geozone features
/* filterGeozone(feature, layer) */
function filterGeozone(feature, layer) {
    var show = false;

    if (feature.properties) {
        const props = feature.properties;

        // Filter out geozones with lower limit above 1200 ft / 400 m OR 410 ft / 125 m
        if (props.lowerAltitudeUnit) {
            if (props.lowerAltitudeUnit == "ft") {
                if (props.lowerLimit <= 410) // ft
                    show = true;
            } else {
                if (props.lowerLimit <= 125) // m
                    show = true;
            }
        }

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
        //     NOTAMS.features.forEach(notam => {
        //         if (notam.attributes) {
        //             const n_a = notam.attributes;
        //             if (n_a.location && n_a.location == "EBBU") {
        //                 if (n_a.notamText && props.name.includes(n_a.notamText.split('-')[0].trim()))
        //                     return true; // early return because geozone is active by NOTAM
        //             } else {
        //                 if (n_a.location && props.code && n_a.location == props.code)
        //                     return true; // early return because geozone is active by NOTAM
        //             }
        //         }
        //     });
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
    var s = d.split(';');

    var startingPoint = props.writtenStartTimeGeneral;
    if (startingPoint.length == 0 || startingPoint == null)
        startingPoint = "000000";
    var sP_split = startingPoint.split(';');

    var endingPoint = props.writtenEndTimeGeneral;
    if (endingPoint.length == 0 || endingPoint == null)
        endingPoint = "235959";
    var eP_split = endingPoint.split(';');

    // get the 'now' time (utc) in all its necessary form
    var now = new Date();
    //var now = Date(2022, 04, 05, 00, 00, 00);
    var minute = now.getUTCMinutes();
    if (minute < 10)
        minute = 0 + '' + minute;

    var hour = now.getUTCHours();
    if (hour < 10)
        hour = 0 + '' + hour;

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

    var nowNumber = hour + '' + minute;
    var nowNumberWithDays = year + '' + month + '' + day + '/' + hour + '' + minute;
    var nowNumberFull = nowNumber + '' + second;

    // Param
    var onlyAfterEndTime = false;
    var countingInterval = 0;
    var intervalInWindow = false;

    // Assign the correct symbology to the geozone
    // Check if timeField is empty 
    if (d.length == 0 || d == null || d == "Non Active")
        return "Non Active";
    // check if nowTime is over the last end time
    if (nowNumberFull > eP_split)//[eP_split.length - 1])
        return "Non Active";

    // If geozone permanent: 
    // either in 'large window' (Active)
    // Will get to it later in the day (Become Active)

    if (d == "permanent") {
        // check if nowTime is in one of the interval
        for (var sp in sP_split) {
            var sp_temp = sP_split[sp];
            var ep_temp = eP_split[sp];

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
        var begin = st.split('-')[0];
        var end = st.split('-')[1];

        var NowNumberToUseStart = nowNumber;
        if (begin.length == 11) {
            NowNumberToUseStart = nowNumberWithDays;
        }
        var NowNumberToUseEnd = nowNumber;
        if (end.length == 11) {
            NowNumberToUseEnd = nowNumberWithDays;
        }

        // check if interval is in a window
        for (var sp in sP_split) {
            var sp_temp = sP_split[sp];
            var ep_temp = eP_split[sp];

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
function onEachGeozone(feature, layer) {
    if (feature.properties) {
        const props = feature.properties;
        layer.bindPopup(`${props.name}<br>Lower limit: ${parseInt(props.lowerLimit).toFixed(0)} ${props.lowerAltitudeUnit}<br>`
            + `Upper limit: ${parseInt(props.upperLimit).toFixed(0)} ${props.upperAltitudeUnit}`);
        // TODO: order based on Shape__Area
        // layer.setZIndex(props.Shape__Area);
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

        text += "<br/>Operators:";
        for (var key in props) {
            if (key.startsWith("ref:BE:") && key != "ref:BE:BIPT") {
                text += `<br>- ${key.slice(7)}`
            }
        }
    }

    layer.bindPopup(text);
}
/* pointToLayerCellTower(feature, latlng) */
function pointToLayerCellTower(feature, latlng) {
    // return L.marker(latlng, { icon: cellTowerIcon });
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
    // return L.marker(latlng, { icon: iconWindTurbine });
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
    // return L.marker(latlng, { icon: iconChimney });
    return L.circleMarker(latlng, markerOptionsChimney);
}


// Functions to get datasets
function buildOverpassQuery(nwr, filter) {
    const q = "[maxsize:16Mi][timeout:30];"
        + 'area["name"="België / Belgique / Belgien"]->.belgie;'
        + `${nwr}${filter}(area.belgie);`
        + "out geom;";

    return "data=" + encodeURIComponent(q);
}

async function getNotams() {
    const response = await (await fetch(NOTAM_URL)).json();

    return response;
}

async function getGeoZones() {
    const response = await (await fetch(GEOZONE_URL)).json();
    geozoneLayer.addData(response);

    return response;
}

async function getRailways() {
    const response = await (await fetch(RAILWAY_URL)).json();
    railwayLayer.addData(response);

    return response;
}

async function getHighVoltageLines() {
    const q = buildOverpassQuery("way", '["power"="line"]');
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    highVoltageLineLayer.addData(geojson);

    return geojson;
}

async function getCellTowers() {
    const q = buildOverpassQuery("node", '["ref:BE:BIPT"]');
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    cellTowerLayer.addData(geojson);

    return geojson;
    // // TODO
    // var q = "action=getSites&latfrom=50.568300114956294&latto=50.73743144242077&longfrom=4.368285909920697&longto=4.929618612557416&LangSiteTable=sitesnl";
    // var response;
    // const res = await (await fetch(BIPT_URL, { method: "POST", body: q })).text();
    // // response = res.body;
    // // console.log(res);
    // // console.log(res.blob());

    // // return Promise.reject("getCellTowers() not yet implemented");
    // return res;
}

async function getWindTurbines() {
    const q = buildOverpassQuery("node", '["generator:source"="wind"]');
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    windTurbineLayer.addData(geojson);

    return geojson;
}

async function getChimneys() {
    const q = buildOverpassQuery("node", '["man_made"="chimney"]');
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    chimneyLayer.addData(geojson);

    return geojson;
}


// Define overlay layers
var geozoneLayer = L.geoJSON([], {
    filter: filterGeozone,
    style: styleGeozone,
    onEachFeature: onEachGeozone
});
var railwayLayer = L.geoJSON([], {
    style: styleRailway,
    onEachFeature: onEachRailway
});
var highVoltageLineLayer = L.geoJSON([], {
    style: styleHighVoltageLine
});
var cellTowerLayer = L.geoJSON([], {
    onEachFeature: onEachCellTower,
    pointToLayer: pointToLayerCellTower
});
var windTurbineLayer = L.geoJSON([], {
    onEachFeature: onEachWindTurbine,
    pointToLayer: pointToLayerWindTurbine
});
var chimneyLayer = L.geoJSON([], {
    onEachFeature: onEachChimney,
    pointToLayer: pointToLayerChimney
});


// Define base tile layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 9,
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    minZoom: 9,
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr">OpenStreetMap France</a>'
});
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    minZoom: 9,
    maxZoom: 16,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0">CC-BY-SA</a>)'
});


// Initialize the map + set active overlays
var map = L.map('map', { layers: [osm, geozoneLayer, railwayLayer, highVoltageLineLayer, windTurbineLayer, chimneyLayer] }).fitWorld();

// Request location of device and set view to location
map.locate({ setView: true, maxZoom: 16 });
map.on('locationfound', (e) => { console.log('Found location:', e.latlng); });
map.on('locationerror', (e) => { console.log(e.message); map.setView([50.848, 4.357], 11); });


// Create layer controls
var baseMaps = {
    "OpenStreetMap": osm,
    "Humanitarian": osmHOT,
    "OpenTopoMap": openTopoMap,
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

// Get NOTAM warnings and No-Fly zones
var NOTAMS;
getNotams().then(
    (value) => { console.log("Successfully got NOTAMS"); console.debug(value); NOTAMS = value; },
    (error) => { console.log("Error getting NOTAMS:", error); }
);
getGeoZones().then(
    (value) => { console.log("Successfully got no-fly zones"); console.debug(value); },
    (error) => { console.log("Error getting no-fly zones:", error); }
);

// Create items for Railway lines
getRailways().then(
    (value) => { console.log("Successfully got railways"); console.debug(value); },
    (error) => { console.log("Error getting railways:", error); }
);

// Create items for High-voltage lines
getHighVoltageLines().then(
    (value) => { console.log("Successfully got high-voltage lines"); console.debug(value); },
    (error) => { console.log("Error getting high-voltage lines:", error); }
);

// Create items for Cell towers
getCellTowers().then(
    (value) => { console.log("Successfully got cell towers"); console.debug(value); },
    (error) => { console.log("Error getting cell towers:", error); }
);

// Create items for Wind turbines
getWindTurbines().then(
    (value) => { console.log("Successfully got wind turbines"); console.debug(value); },
    (error) => { console.log("Error getting wind turbines:", error); }
);

// Create items for Chimneys
getChimneys().then(
    (value) => { console.log("Successfully got chimneys"); console.debug(value); },
    (error) => { console.log("Error getting chimneys:", error); }
);


// //////////
// var info = document.getElementById("info");
// info.textContent = "info text";
// map.on('move', function (e) {
//     info.textContent = e.target.getCenter() + " " + e.target.getZoom();
//     // console.log(e);
// });
// //////////
