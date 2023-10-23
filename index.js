const ARCGIS_LIMIT = "" // empty: no limit
const GEOZONE_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_validated_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=geojson&outFields=*&returnGeometry=true&spatialRel=esriSpatialRelIntersects&where=status%3D%27validated%27";
// notamId%2Ccode%2Cname%2ClowerLimit%2CupperLimit%2ClowerAltitudeUnit%2CupperAltitudeUnit%2Creason%2Crestriction%2COtherReasonInfo%2CShape__Area
const NOTAM_URL = "https://services3.arcgis.com/om3vWi08kAyoBbj3/ArcGIS/rest/services/Geozone_Notam_View_Prod/FeatureServer/0/query?resultRecordCount=" + ARCGIS_LIMIT + "&f=json&outFields=*&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=status%20%3D%20%27validated%27%20AND%20last_version%20%3D%20%27yes%27";
// notamId%2Cfir%2Clocation%2CactivityStart%2CvalidityEnd%2Cschedule%2CnotamText%2ClowerLimit%2CupperLimit%2ClowerLimitUnit%2CupperLimitUnit

const RAILWAY_URL = "https://opendata.infrabel.be/api/explore/v2.1/catalog/datasets/lijnsecties/exports/geojson";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const BIPT_URL = "https://www.sites.bipt.be/ajaxinterface.php"; // method: POST; body: action=getSites&latfrom=51.02670680117774&latto=51.06863331870643&longfrom=3.6838944547166808&longto=3.8242276303758604&LangSiteTable=sitesnl

const BBOX_1 = "50.741655,2.639454,51.385570,5.773308"; // flanders
const BBOX_2 = "50.488948,3.243720,50.741655,6.111214"; // wallonia 1
const BBOX_3 = "50.320909,3.685905,50.488948,6.349983"; // wallonia 2
const BBOX_4 = "50.021824,4.169082,50.320909,5.899796"; // wallonia 3
const BBOX_5 = "49.791904,4.872416,50.021824,5.800807"; // wallonia 4
const BBOX_6 = "49.530545,5.215733,49.791904,5.872159"; // wallonia 5


function buildOverpassQuery(n, k, v) {
    const q = "[maxsize:16Mi];("
        + `${n}["${k}"="${v}"](${BBOX_1});`
        + `${n}["${k}"="${v}"](${BBOX_2});`
        + `${n}["${k}"="${v}"](${BBOX_3});`
        + `${n}["${k}"="${v}"](${BBOX_4});`
        + `${n}["${k}"="${v}"](${BBOX_5});`
        + `${n}["${k}"="${v}"](${BBOX_6});`
        + ");out geom;";

    return "data=" + encodeURIComponent(q);
}


function renderGeoZone(geozone) {
    // script return the correct symbology for the geozones
    const fp = geozone.properties;

    // get the feature fields - and their split list
    var d = fp.TimeField;
    var s = d.split(';');

    var startingPoint = fp.writtenStartTimeGeneral;
    if (startingPoint.length == 0 || startingPoint == null)
        startingPoint = "000000";
    var sP_split = startingPoint.split(';');

    var endingPoint = fp.writtenEndTimeGeneral;
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
            // and is in the futur
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

function filterGeozone(geozone, layer) {
    var show = false;

    if (geozone.properties) {
        const f_p = geozone.properties;

        // Filter out geozones with lower limit above 1200 ft / 400 m OR 410 ft / 125 m
        if (f_p.lowerAltitudeUnit) {
            if (f_p.lowerAltitudeUnit == "ft") {
                if (f_p.lowerLimit <= 410) // ft
                    show = true;
            } else {
                if (f_p.lowerLimit <= 125) // m
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
        //                 if (n_a.notamText && f_p.name.includes(n_a.notamText.split('-')[0].trim()))
        //                     return true; // early return because geozone is active by NOTAM
        //             } else {
        //                 if (n_a.location && f_p.code && n_a.location == f_p.code)
        //                     return true; // early return because geozone is active by NOTAM
        //             }
        //         }
        //     });
        // }
    }

    return show;
}

function onEachGeozone(feature, layer) {
    if (feature.properties) {
        const f_p = feature.properties;
        layer.bindPopup(`${f_p.name}<br>Lower limit: ${parseInt(f_p.lowerLimit).toFixed(0)} ${f_p.lowerAltitudeUnit}<br>`
            + `Upper limit: ${parseInt(f_p.upperLimit).toFixed(0)} ${f_p.upperAltitudeUnit}`);
        // TODO: order based on Shape__Area
        // layer.setZIndex(f_p.Shape__Area);
    }
}

function styleGeozone(feature) {
    switch (renderGeoZone(feature)) {
        case "Active": return styleGeozoneActive;
        case "Become active today": return styleGeozoneBecomeActive;
        case "Non Active": return styleGeozoneNonActive;
    }
}

// function pointToLayerTurbine(geoJsonPoint, latlng) {
//     return L.marker(latlng, { icon: windTurbineIcon });
// }

// function pointToLayerCellTower(geoJsonPoint, latlng) {
//     return L.marker(latlng, { icon: cellTowerIcon });
// }

// function pointToLayerChimney(geoJsonPoint, latlng) {
//     return L.marker(latlng, { icon: chimneyIcon });
// }

function pointToLayerMulti(geoJsonPoint, latlng) {
    if (geoJsonPoint.properties) {
        const g_p = geoJsonPoint.properties;
        if (g_p["generator:source"] && g_p["generator:source"] == "wind") {
            // wind turbine
            return L.marker(latlng, { icon: windTurbineIcon });
        } else if (g_p.man_made && g_p.man_made == "chimney") {
            // chimney
            return L.marker(latlng, { icon: chimneyIcon });
        } else if (g_p.Adres) {
            // cell tower
            return L.marker(latlng, { icon: cellTowerIcon });
        }
    }

    return L.marker(latlng);
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

}

async function getHighVoltageLines() {
    const q = buildOverpassQuery("way", "power", "line");
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    lineLayer.addData(geojson);

    return geojson;
}

async function getWindTurbines() {
    const q = buildOverpassQuery("node", "generator:source", "wind");
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    turbineLayer.addData(geojson);

    return geojson;
}

async function getCellTowers() {
    // TODO
    var q = "action=getSites&latfrom=50.568300114956294&latto=50.73743144242077&longfrom=4.368285909920697&longto=4.929618612557416&LangSiteTable=sitesnl";
    var response;
    const res = await (await fetch(BIPT_URL, { method: "POST", body: q })).text();
    // response = res.body;
    // console.log(res);
    // console.log(res.blob());

    // return Promise.reject("getCellTowers() not yet implemented");
    return res;
}

async function getChimneys() {
    const q = buildOverpassQuery("node", "man_made", "chimney");
    const response = await (await fetch(OVERPASS_URL, { method: "POST", body: q })).text();

    const geojson = osm2geojson(response);
    chimneyLayer.addData(geojson);

    return geojson;
}


// Create custom icons
const cellTowerIcon = L.icon({
    iconUrl: 'img/cell_tower.svg',
    iconSize: [60, 60],
    iconAnchor: [29.5, 55],
    popupAnchor: [0, -45]
});
const chimneyIcon = L.icon({
    iconUrl: 'img/chimney.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const communicationTowerIcon = L.icon({
    iconUrl: 'img/communication_tower.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const mastIcon = L.icon({
    iconUrl: 'img/mast.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const mastCommunicationIcon = L.icon({
    iconUrl: 'img/mast_communication.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const towerIcon = L.icon({
    iconUrl: 'img/tower.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const towerCommunicationIcon = L.icon({
    iconUrl: 'img/tower_communication.svg',
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56]
});
const windTurbineIcon = L.icon({
    iconUrl: 'img/wind_turbine.svg',
    iconSize: [35, 60],
    iconAnchor: [23, 60],
    popupAnchor: [0, -60]
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

    "color": "rgb(255, 0, 0)",
    "weight": "2"
};
const styleHighVoltage = {
    "fill": false,

    "color": "rgb(0, 0, 255)",
    "weight": "2"
};


// Define base tile layers
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
var osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr">OpenStreetMap France</a>'
});
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0">CC-BY-SA</a>)'
});

// Define overlay layers
var geozoneLayer = L.geoJSON([], {
    filter: filterGeozone,
    onEachFeature: onEachGeozone,
    style: styleGeozone
});
var railwayLayer = L.geoJSON([], {
    style: styleRailway
});
var lineLayer = L.geoJSON([], {
    style: styleHighVoltage
});
var cellTowerLayer = L.geoJSON([], {
    pointToLayer: pointToLayerMulti // pointToLayerCellTower
});
var turbineLayer = L.geoJSON([], {
    pointToLayer: pointToLayerMulti // pointToLayerTurbine
});
var chimneyLayer = L.geoJSON([], {
    pointToLayer: pointToLayerMulti // pointToLayerChimney
});


// Initialize the map + set active overlays
var map = L.map('map', { layers: [osm, geozoneLayer, railwayLayer, lineLayer, cellTowerLayer, turbineLayer, chimneyLayer] }).fitWorld();

// Request location of device and set view to location
map.locate({ setView: true, maxZoom: 16 });
map.on('locationfound', (e) => { console.log('Found location:', e.latlng); });
map.on('locationerror', (e) => { console.log(e.message); map.setView([50.848, 4.357], 11); });


// Create layer controls
var baseMaps = {
    "OpenStreetMap": osm,
    "Humanitarian": osmHOT,
    "OpenTopoMap": openTopoMap
};
var overlayMaps = {
    "Railways": railwayLayer,
    "No-Fly Zones": geozoneLayer,
    "High-Voltage Lines": lineLayer,
    "Cell Towers": cellTowerLayer,
    "Wind Turbines": turbineLayer,
    "Chimneys": chimneyLayer,
};
var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);


// Create items for turbine layer
var turbine = L.marker([51.5, -0.08], { icon: cellTowerIcon });
turbine.bindPopup("I'm a wind turbine!");

turbineLayer.addLayer(turbine);


// Get NOTAM warnings and No-Fly zones
var NOTAMS;
getNotams().then(
    (value) => { console.log("Successfully got NOTAMS"); NOTAMS = value; },
    (error) => { console.log("Error getting NOTAMS:", error); }
);
getGeoZones().then(
    (value) => { console.log("Successfully got no-fly zones"); },
    (error) => { console.log("Error getting no-fly zones:", error); }
);

// Create items for Railway lines
getRailways().then(
    (value) => { console.log("Successfully got railways"); },
    (error) => { console.log("Error getting railways:", error); }
);

// Create items for High-voltage lines
getHighVoltageLines().then(
    (value) => { console.log("Successfully got high-voltage lines"); },
    (error) => { console.log("Error getting high-voltage lines:", error); }
);

// Create items for Cell towers
getCellTowers().then(
    (value) => { console.log("Successfully got cell towers"); console.log(value); },
    (error) => { console.log("Error getting cell towers:", error); }
);

// Create items for Wind turbines
getWindTurbines().then(
    (value) => { console.log("Successfully got wind turbines"); },
    (error) => { console.log("Error getting wind turbines:", error); }
);

// Create items for Chimneys
getChimneys().then(
    (value) => { console.log("Successfully got chimneys"); },
    (error) => { console.log("Error getting chimneys:", error); }
);

/*
tower:type=communication
    man_made=tower
    man_made=mast
 
man_made=antenna
man_made=chimney
    chimney.svg
man_made=communications_tower
    communication_tower.svg
    (man_made=mast + tower:type=communication)
    (man_made=tower + tower:type=communication)
man_made=mast
    mast.svg
man_made=tower
    tower.svg
*/


//////////
var info = document.getElementById("info");
info.textContent = "info text";
map.on('move', function (e) {
    info.textContent = e.target.getCenter() + " " + e.target.getZoom();
    // console.log(e);
});
//////////
