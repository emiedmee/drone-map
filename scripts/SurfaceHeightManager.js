class SurfaceHeightManager {
  static GEO_API_HEIGHT_VL_URL = "https://geo.api.vlaanderen.be/DHMV/wms?service=WMS&version=1.3.0&request=GetFeatureInfo&feature_count=50&layers=DHMVII_DTM_1m&query_layers=DHMVII_DTM_1m&" + SurfaceHeightManager.encode("crs", "EPSG:31370") + "&" + SurfaceHeightManager.encode("info_format", "application/geo+json");
  static GEO_API_HEIGHT_WA_URL = "https://geoservices.wallonie.be/arcgis/rest/services/RELIEF/WALLONIE_MNS_2021_2022/MapServer/identify?f=json&tolerance=1&sr=31370&layers=top&geometryType=esriGeometryPoint&returnGeometry=false&returnFieldName=false&returnUnformattedValues=false";

  /**
   * Spatial extent
   * @see https://metadata.vlaanderen.be/srv/dut/catalog.search#/metadata/8d25d5a9-3786-4c3c-aa71-f04f19255ac7/formatters/xsl-view?root=div&view=advanced
   */
  static GEO_API_HEIGHT_VL_BBOX = { N: 51.51, E: 5.92, S: 50.68, W: 2.54 };
  /**
   * Spatial extent
   * @see https://metawal.wallonie.be/geonetwork/srv/fre/catalog.search#/metadata/5a4c28fe-d30c-493e-861e-a80ebc703b64/formatters/xsl-view?root=div&view=advanced
   */
  static GEO_API_HEIGHT_WA_BBOX = { N: 50.85, E: 6.50, S: 49.45, W: 2.75 };
  static GEO_API_OFFSET = 25;

  /**
   * Definition EPSG:4326
   * @see https://epsg.io/4326
   */
  static WGS84 = "+proj=longlat +datum=WGS84 +no_defs +type=crs";
  /**
   * Definition EPSG:31370
   * @see https://epsg.io/31370
   */
  static BD72 = "+proj=lcc +lat_0=90 +lon_0=4.36748666666667 +lat_1=51.1666672333333 +lat_2=49.8333339 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs +type=crs";

  constructor(map) {
    this.map = map;
  }

  /**
   * Register callback to show popup with surface height of the location when clicking on the map.
   */
  register() {
    if (this.map) {
      this.map.on("click", this.onClickCallback, this);
    }
  }

  /**
   * Unregister callback to stop showing popup with surface height of the location when clicking on the map.
   */
  unregister() {
    if (this.map) {
      this.map.off("click", this.onClickCallback, this);
    }
  }

  /**
   * Show surface height of the location when clicking on the map.
   * 
   * @param {MouseEvent} event
   */
  onClickCallback(event) {
    if (this.map && event.latlng) {
      const popup = L.popup().setLatLng(event.latlng).setContent("Surface height: ---").openOn(this.map);
      this.getHeight(event.latlng).then(height => {
        if (height) {
          popup.setContent(`Surface height: ${Math.round(height * 100) / 100} m`);
        }
      });
    }
  }

  /**
   * Get the surface height at a given position.
   * 
   * @param {Object} mapLatLng Position in WGS84 coordinates
   * @param {Number} mapLatLng.lat Latitude
   * @param {Number} mapLatLng.lng Longitude
   * @returns Surface height in meters
   */
  async getHeight(mapLatLng) {
    if (this.map && mapLatLng) {
      const location_cp = this.map.latLngToContainerPoint(mapLatLng);

      const ne_cp = {
        x: location_cp.x + SurfaceHeightManager.GEO_API_OFFSET,
        y: location_cp.y - SurfaceHeightManager.GEO_API_OFFSET,
      };
      const sw_cp = {
        x: location_cp.x - SurfaceHeightManager.GEO_API_OFFSET,
        y: location_cp.y + SurfaceHeightManager.GEO_API_OFFSET,
      };

      // const view = {
      //   x: Math.abs(ne_cp.x - sw_cp.x), // 2 x Offset
      //   y: Math.abs(ne_cp.y - sw_cp.y), // 2 x Offset
      // };
      // const position = {
      //   x: view.x / 2, // Offset
      //   y: view.y / 2, // Offset
      // };

      const ne_bd72 = SurfaceHeightManager.WGS84toBD72(this.map.containerPointToLatLng(ne_cp));
      const sw_bd72 = SurfaceHeightManager.WGS84toBD72(this.map.containerPointToLatLng(sw_cp));

      const bbox_bd72 = [sw_bd72.x, sw_bd72.y, ne_bd72.x, ne_bd72.y]; // <xmin>, <ymin>, <xmax>, <ymax>
      const pos_bd72 = SurfaceHeightManager.WGS84toBD72(mapLatLng);

      // Only send request if location is in that part of the country
      var heightVL = null;
      var heightWA = null;
      if (SurfaceHeightManager.isLatLngInsideBbox(mapLatLng, SurfaceHeightManager.GEO_API_HEIGHT_VL_BBOX)) {
        heightVL = await this.getHeightVL(bbox_bd72);
      }
      if (SurfaceHeightManager.isLatLngInsideBbox(mapLatLng, SurfaceHeightManager.GEO_API_HEIGHT_WA_BBOX)) {
        heightWA = await this.getHeightWA(pos_bd72, bbox_bd72);
      }

      if (heightVL !== null) {
        return heightVL;
      } else if (heightWA !== null) {
        return heightWA;
      }
    }
    return null;
  }

  /**
   * Try to get the surface height of a position using geo services from Flanders.
   * 
   * @param {Array<Number>} bbox_bd72 BD72 coordinates of the bbox in BD72 coordinates in order: xmin, ymin, xmax, ymax
   * @returns Surface height in meters if available
   */
  async getHeightVL(bbox_bd72) {
    const url = [
      SurfaceHeightManager.GEO_API_HEIGHT_VL_URL,
      SurfaceHeightManager.encode("bbox", bbox_bd72.join(",")),
      `width=${2 * SurfaceHeightManager.GEO_API_OFFSET}`,
      `height=${2 * SurfaceHeightManager.GEO_API_OFFSET}`,
      `i=${SurfaceHeightManager.GEO_API_OFFSET}`,
      `j=${SurfaceHeightManager.GEO_API_OFFSET}`,
    ];
    const response = await (await fetch(url.join("&"))).json();

    const height = response?.features?.at(0)?.properties["Pixel Value"];
    if (!height || height == undefined || height == "NoData" || parseFloat(height) === NaN) {
      return null;
    } else {
      return parseFloat(height);
    }
  }

  /**
   * Try to get the surface height of a position using geo services from Wallonia.
   * 
   * @param {Object} pos_bd72 BD72 coordinates of the clicked position
   * @param {Number} pos_bd72.x Easting or x
   * @param {Number} pos_bd72.y Northing or y
   * @param {Array<Number>} bbox_bd72 BD72 coordinates of the bbox in BD72 coordinates, in order: xmin, ymin, xmax, ymax
   * @returns Surface height in meters if available
   */
  async getHeightWA(pos_bd72, bbox_bd72) {
    const url = [
      SurfaceHeightManager.GEO_API_HEIGHT_WA_URL,
      SurfaceHeightManager.encode("imageDisplay", `${2 * SurfaceHeightManager.GEO_API_OFFSET},${2 * SurfaceHeightManager.GEO_API_OFFSET},96`),
      SurfaceHeightManager.encode("geometry", `{"x":${pos_bd72.x},"y":${pos_bd72.y}}`),
      SurfaceHeightManager.encode("mapExtent", bbox_bd72.join(",")),
    ];
    const response = await (await fetch(url.join("&"))).json();

    const height = response?.results?.at(0)?.attributes["Stretch.Pixel Value"];
    if (!height || height == undefined || height == "NoData" || parseFloat(height) === NaN) {
      return null;
    } else {
      return parseFloat(height);
    }
  }

  /**
   * Check if a position is inside a bounding box.
   * 
   * @param {Object} latlng Position
   * @param {Number} latlng.lat Latitude
   * @param {Number} latlng.lng Longitude
   * @param {Object} bbox Bounding box
   * @param {Number} bbox.N Max latitude
   * @param {Number} bbox.E Max longitude
   * @param {Number} bbox.S Min latitude
   * @param {Number} bbox.W Min longitude
   */
  static isLatLngInsideBbox(latlng, bbox) {
    return bbox.S <= latlng.lat && latlng.lat <= bbox.N
      && bbox.W <= latlng.lng && latlng.lng <= bbox.E;
  }

  /**
   * Convert `BD72`/`EPSG:31370` coordinates to `WGS84`/`EPSG:4326` using GeoAPI from Vlaanderen.be.
   * 
   * @param {Object} bd72 
   * @param {Number} bd72.x Easting or x
   * @param {Number} bd72.y Northing or y
   */
  static BD72toWGS84(bd72) {
    if (bd72 && bd72.x && bd72.y) {
      const wgs84 = proj4(SurfaceHeightManager.BD72, SurfaceHeightManager.WGS84, [bd72.x, bd72.y]);
      return {
        lat: parseFloat(wgs84[1]),
        lng: parseFloat(wgs84[0]),
      };
    }
    return null;
  }

  /**
   * Convert `WGS84`/`EPSG:4326` coordinates to `BD72`/`EPSG:31370` using GeoAPI from Vlaanderen.be.
   * 
   * @param {Object} wgs84 
   * @param {Number} wgs84.lat Latitude
   * @param {Number} wgs84.lng Longitude
   */
  static WGS84toBD72(wgs84) {
    if (wgs84 && wgs84.lat && wgs84.lng) {
      const bd72 = proj4(SurfaceHeightManager.WGS84, SurfaceHeightManager.BD72, [wgs84.lng, wgs84.lat]);
      return {
        x: parseFloat(bd72[0]),
        y: parseFloat(bd72[1]),
      };
    }
    return null;
  }

  /**
   * Function to URI encode a url parameter.
   * 
   * @param {String} key
   * @param {String} value
   * @returns "key=value"
   */
  static encode(key, value) {
    return `${key}=${encodeURIComponent(value)}`
  }
}
