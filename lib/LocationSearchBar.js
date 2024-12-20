const ICON_NMBS = '<svg xmlns="http://www.w3.org/2000/svg" class="icon-nmbs" viewBox="0 0 64 64"><path d="M32 50.7C17.4 50.7 5.5 42.3 5.5 32S17.4 13.3 32 13.3 58.5 21.7 58.5 32 46.6 50.7 32 50.7m0-39.6C14.3 11.1 0 20.4 0 32s14.3 20.9 32 20.9S64 43.5 64 32 49.7 11.1 32 11.1"></path><path d="M33.4 43h-3.5c-1.1 0-1.7-.5-1.7-1.4v-8c0-.5.2-.7.7-.7h4.5a5.2 5.2 0 0 1 5.2 5.1 4.94 4.94 0 0 1-5.2 5m-5.2-20.4c0-.9.6-1.4 1.7-1.4h2.3a4.31 4.31 0 0 1 4.5 4.3 4.46 4.46 0 0 1-4.5 4.4h-3.3c-.5 0-.7-.2-.7-.7zm14.1 8.9c-.7-.3-.7-.4 0-.8a5.91 5.91 0 0 0 2.8-5.2c0-3.9-5.2-7.8-13.5-7.8a22 22 0 0 0-13.3 4.4c-.7.6-.6.9-.4 1.1l1.2 1.4c.4.4.6.3.8.1.9-.7 1-.3 1 .5V39c0 .8-.1 1.2-1 .5-.2-.2-.4-.3-.8.1l-1.3 1.5c-.2.3-.4.6.4 1.1a24.7 24.7 0 0 0 13.6 4.3c9.3 0 15.1-3.9 15.1-9.1.1-3.5-2.8-5.2-4.6-5.9"></path></svg>';

class LocationSearchBar {
  /**
   * @param {L.Map} map Reference to the map
   * @param {Object} options Options to configure the search bar
   * @param {String} options.location_search_bar_name ID of the HTML element that is the search text input field
   * @param {String} options.location_search_clear_name ID of the HTML element that is the clear button
   * @param {String} options.location_search_results_name ID of the HTML element that contains the search results
   */
  constructor(map, options) {
    /** @type {L.Map} */
    this._map = map;

    this._locationNames = {
      type: "FeatureCollection",
      /** @type {FeatureCollection<GeometryObject, any>} */
      features: [],
    };

    /** @type {L.Marker | null} */
    this._location_marker = null;

    this._location_search_bar = document.getElementById(options.location_search_bar_name || "location-search-bar");
    this._location_search_clear = document.getElementById(options.location_search_clear_name || "location-search-clear");
    this._location_search_results = document.getElementById(options.location_search_results_name || "location-search-results");

    this._location_search_bar.addEventListener("input", () => this.onLocationSearch());
    this._location_search_bar.addEventListener("focus", () => this.onLocationSearchGotFocus());
    this._location_search_bar.addEventListener("blur", () => this.onLocationSearchLostFocus());
    this._location_search_clear.addEventListener("click", () => this.onLocationSearchClear());
  }

  getLocationNames() {
    return this._locationNames;
  }

  setLocationNames(value) {
    this._locationNames = value;
  }

  onLocationSearchGotFocus() {
    this.onLocationSearch();
  }

  onLocationSearchLostFocus() {
    // Delay the hiding of search results, because when the search results
    //  are clicked, there is some delay as well and the click would be skipped.
    setTimeout(() => {
      this._location_search_results.classList.add("hidden");
      this._location_search_results.innerHTML = "";
    }, 150);
  }

  onLocationSearchClear() {
    this._location_search_bar.value = "";
    if (this._location_marker) {
      this._location_marker.removeFrom(map);
      this._location_marker = null;
    }
    this.onLocationSearch();
  }

  onLocationSearch() {
    if (this._location_search_bar.value.length < 2) {
      this._location_search_results.classList.add("hidden");
      return;
    }

    // Clear left-over results and show results container
    this._location_search_results.classList.add("hidden");
    this._location_search_results.innerHTML = "";

    // Do the actual search
    var results = [];
    for (var i = 0; i < this._locationNames.features.length; i++) {
      const props = this._locationNames.features[i].properties;

      // If searchText is included in "name" or "name:nl" or "name:fr" or "postal_code" or "railway:ref", it's a match
      if ((props["name"] && this.normalize(props["name"]).includes(this.normalize(this._location_search_bar.value))) ||
        (props["name:nl"] && this.normalize(props["name:nl"]).includes(this.normalize(this._location_search_bar.value))) ||
        (props["name:fr"] && this.normalize(props["name:fr"]).includes(this.normalize(this._location_search_bar.value))) ||
        (props["postal_code"] && this.normalize(props["postal_code"]).includes(this.normalize(this._location_search_bar.value))) ||
        (props["railway:ref"] && this.normalize(props["railway:ref"]).includes(this.normalize(this._location_search_bar.value)))
      ) {
        results.push(i);
      }
    }

    // Display the results
    results.forEach(res => {
      if (res < 0 || res >= this._locationNames.features.length) return;

      const location = this._locationNames.features[res];

      const item = document.createElement("div");
      item.innerHTML = location.properties["name"];
      if (location.properties["railway:ref"]) {
        item.innerHTML = `${ICON_NMBS}<span class="station">${item.innerHTML}</span>`;
      }
      item.addEventListener("click", () => this.onClickLocationSearchResult(res));

      this._location_search_results.appendChild(item);
    });

    this._location_search_results.classList.remove("hidden");
  }

  onClickLocationSearchResult(index) {
    // Clear left-over results and hide results container
    this._location_search_results.classList.add("hidden");
    this._location_search_results.innerHTML = "";

    // Place the text of the clicked result in the search bar
    const location = this._locationNames.features[index];
    this._location_search_bar.value = location.properties["name"];

    // Add marker to the map
    if (this._location_marker) {
      this._location_marker.removeFrom(map);
      this._location_marker = null;
    }
    if (location.geometry.type == "Point") {
      // GeoJson coordinates are [lon, lat] and Leaflet wants [lat, lon].
      // Array.reverse() will change the data itselve, so this can't be used.
      this._location_marker = L.marker([location.geometry.coordinates[1], location.geometry.coordinates[0]]).addTo(map);
      map.flyTo([location.geometry.coordinates[1], location.geometry.coordinates[0]], 13);
    }
  }

  normalize(text) {
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
}
