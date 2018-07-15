/*
  regular-grid-cluster plugin for leaflet
  https://github.com/adammertel/Leaflet.RegularGridCluster
  Adam Mertel | univie
*/

"use strict";
var _typeof2 =
  typeof Symbol === "function" && typeof Symbol.iterator === "symbol"
    ? function(a) {
        return typeof a;
      }
    : function(a) {
        return a &&
          typeof Symbol === "function" &&
          a.constructor === Symbol &&
          a !== Symbol.prototype
          ? "symbol"
          : typeof a;
      };
L.RegularGridClusterCell = L.Polygon.extend({
  options: {
    weight: 1,
    fillOpacity: 0.6,
    clickable: false,
    color: "grey",
    lineJoin: "miter",
    fillRule: "evenodd",
    strokeLocation: "inside",
    pane: "grid-cells-pane",
    interactive: false
  },
  initialize: function a(b, c) {
    this.options = L.extend(this.options, c);
    L.Util.setOptions(this, this.options);
    L.Polygon.prototype.initialize.call(this, b, this.options);
  }
});
L.regularGridClusterCell = function(a, b) {
  return new L.RegularGridClusterCell(a, b);
};
("use strict");
L.RegularGridClusterCellsGroup = L.FeatureGroup.extend({
  options: { interactive: false },
  initialize: function a(b) {
    this.controller = b.controller;
    this.options = L.extend(this.options, b);
    L.Util.setOptions(this, b);
    L.FeatureGroup.prototype.initialize.call(
      this,
      { features: [] },
      this.options
    );
  },
  render: function a(b, c) {},
  addLayer: function a(b) {
    L.FeatureGroup.prototype.addLayer.call(this, b);
  },
  truncate: function a() {
    this.clearLayers();
  }
});
L.regularGridClusterCellsGroup = function(a) {
  return new L.RegularGridClusterCellsGroup(a);
};
("use strict");
L.RegularGridClusterMarker = L.CircleMarker.extend({
  options: { pane: "grid-markers-pane", interactive: false },
  initialize: function a(b, c) {
    this.options = L.extend(this.options, c);
    L.Util.setOptions(this, c);
    L.CircleMarker.prototype.initialize.call(this, b, this.options);
  }
});
L.regularGridClusterMarker = function(a, b) {
  return new L.RegularGridClusterMarker(a, b);
};
("use strict");
L.RegularGridClusterMarkersGroup = L.FeatureGroup.extend({
  options: {},
  initialize: function a(b) {
    this.controller = b.controller;
    this.options = L.extend(this.options, b);
    L.Util.setOptions(this, b);
    L.FeatureGroup.prototype.initialize.call(this, { features: [] }, b);
  },
  render: function a(b, c) {},
  addLayer: function a(b) {
    L.FeatureGroup.prototype.addLayer.call(this, b);
  },
  truncate: function a() {
    this.clearLayers();
  }
});
L.regularGridClusterMarkersGroup = function(a) {
  return new L.RegularGridClusterMarkersGroup(a);
};
("use strict");
L.RegularGridClusterText = L.Marker.extend({
  options: { pane: "grid-texts-pane", interactive: false },
  initialize: function a(b, c) {
    // to be able to write every option camelCase
    c["font-size"] = c.fontSize;
    c["font-weight"] = c.fontWeight;
    L.Util.setOptions(this, c);
    var d = JSON.stringify(c)
      .substring(1, JSON.stringify(c).length - 2)
      .replace(/,/g, ";")
      .replace(/\"/g, "");
    this.options.icon = L.divIcon({
      html:
        '<span class="regular-grid-text-html" style="' +
        d +
        ' ; text-align: center">' +
        this.options.text +
        "</span>",
      iconSize: [0, 0],
      iconAnchor: [c.anchorOffsetX || -10, c.anchorOffsetY || -30],
      className: "regular-grid-text-marker"
    });
    L.Marker.prototype.initialize.call(this, b, this.options);
  }
});
L.regularGridClusterText = function(a, b) {
  return new L.RegularGridClusterText(a, b);
};
("use strict");
L.RegularGridClusterTextsGroup = L.FeatureGroup.extend({
  options: {},
  initialize: function a(b) {
    this.controller = b.controller;
    this.options = L.extend(this.options, b);
    L.Util.setOptions(this, b);
    L.FeatureGroup.prototype.initialize.call(this, { features: [] }, b);
  },
  render: function a(b, c) {},
  addLayer: function a(b) {
    L.FeatureGroup.prototype.addLayer.call(this, b);
  },
  truncate: function a() {
    this.clearLayers();
  }
});
L.regularGridClusterTextsGroup = function(a) {
  return new L.RegularGridClusterTextsGroup(a);
};
("use strict");
var _typeof =
  typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol"
    ? function(a) {
        return typeof a === "undefined" ? "undefined" : _typeof2(a);
      }
    : function(a) {
        return a &&
          typeof Symbol === "function" &&
          a.constructor === Symbol &&
          a !== Symbol.prototype
          ? "symbol"
          : typeof a === "undefined"
            ? "undefined"
            : _typeof2(a);
      };
function _toConsumableArray(a) {
  if (Array.isArray(a)) {
    for (var b = 0, c = Array(a.length); b < a.length; b++) {
      c[b] = a[b];
    }
    return c;
  } else {
    return Array.from(a);
  }
} // main class, controller, ...
L.RegularGridCluster = L.FeatureGroup.extend({
  options: {
    gridMode: "square", // square of hexagon
    zoneSize: 10000, // size of the cell at a scale of 10
    gridOrigin: "auto", // SW corner for grid extent. 'auto' for getting this value from data. Useful for more independent datasets
    gridEnd: "auto",
    gridBoundsPadding: 0.1, // ratio to extend bounding box of elements
    // turning components on and off
    showCells: true,
    showMarkers: true,
    showTexts: true,
    defaultStyle: { cells: {}, texts: {}, markers: {} },
    showEmptyCells: false,
    emptyCellOptions: {
      weight: 1,
      fillOpacity: 0,
      clickable: false,
      color: "grey",
      lineJoin: "miter",
      fillRule: "evenodd",
      strokeLocation: "inside",
      interactive: false
    }, // setting z-indices for data layers
    paneElementsZ: 1000,
    paneCellsZ: 700,
    paneMarkersZ: 800,
    paneTextsZ: 900, // levels of zoom when to turn grid off and elements on
    zoomShowElements: 10,
    zoomHideGrid: 10,
    indexSize: 12, // ratio for pre-indexing elements in grid
    // set of dynamical and static visual rules that define markers, cells and texts
    rules: { cells: {}, markers: {}, texts: {} },
    trackingTime: false // for developement purposes only
  },
  initialize: function a(b) {
    //this.options = L.extend(this.options, options);
    this.lastelmid = 0;
    this.elementDisplayed = false;
    L.Util.setOptions(this, b);
    this._actions = [];
    this._elements = {};
    this._displayedElements = L.featureGroup([]);
    this._zones = [];
    this._cells = new L.regularGridClusterCellsGroup({ controller: this });
    this._markers = new L.regularGridClusterMarkersGroup({ controller: this });
    this._texts = new L.regularGridClusterTextsGroup({ controller: this });
    L.FeatureGroup.prototype.initialize.call(this, { features: [] }, b);
  },
  onAdd: function a(b) {
    var c = this;
    this._map = b;
    this._addPane("grid-elements-pane", this.options.paneElementsZ);
    this._addPane("grid-markers-pane", this.options.paneMarkersZ);
    this._addPane("grid-cells-pane", this.options.paneCellsZ);
    this._addPane("grid-texts-pane", this.options.paneTextsZ); //L.GeoJSON.prototype.onAdd.call(this, map);
    this._cells.addTo(this._map);
    this._markers.addTo(this._map);
    this._texts.addTo(this._map);
    this._addAction(function() {
      c.refresh();
    }, "zoomend");
    this._index();
    this.refresh();
  },
  _addPane: function a(b, c) {
    if (!map.getPane(b)) {
      this._map.createPane(b);
      this._map.getPane(b).style.zIndex = c;
    }
  },
  _elementCollectionNotEmpty: function a() {
    return Object.keys(this._elements).length !== 0;
  },
  _addAction: function a(b, c) {
    this._actions.push({ callback: b, type: c });
    this._map.on(c, b);
  },
  _unregisterActions: function a() {
    var b = this;
    this._actions.map(function(a) {
      if (b._map.off) b._map.off(a.type, a.callback);
    });
  },
  addLayer: function a(b) {
    this.addLayers([b]);
  },
  addLayers: function a(b) {
    var c = this;
    b.map(function(a) {
      return c._addElement(a);
    });
    if (this._map) {
      this._index();
      this.refresh();
    }
  },
  _removePanes: function a() {
    var b = this;
    var c = [
      "grid-elements-pane",
      "grid-markers-pane",
      "grid-cells-pane",
      "grid-texts-pane"
    ];
    c.map(function(a) {
      b._map.getPane(a).remove(); //paneElement.parentNode.removeChild(paneElement);
    });
  },
  unregister: function a() {
    this._unregisterActions(); // this._removePanes();
    this._truncateLayers();
    this._cells.remove();
    this._markers.remove();
    this._texts.remove(); // this._map.removeLayer(this._cells);
    // this._map.removeLayer(this._markers);
    // this._map.removeLayer(this._texts);
    this._map.removeLayer(this._displayedElements);
  },
  _addElement: function a(b) {
    // todo - filter non point and group data
    this._elements[this.lastelmid] = {
      id: this.lastelmid,
      latlng: b.marker.getLatLng(),
      properties: b.properties,
      marker: b.marker
    };
    this.lastelmid++; //L.GeoJSON.prototype.addData.call(this, element);
  },
  _index: function a() {
    if (this._elementCollectionNotEmpty()) {
      var b = [];
      b.push(new Date());
      this._indexZones();
      b.push(new Date());
      this._indexElements();
      b.push(new Date());
      if (this.options.trackingTime) {
      }
    }
  },
  _getElementsCollection: function a() {
    var b = this;
    return Object.keys(this._elements).map(function(a) {
      return {
        id: b._elements[a].id,
        g: b._elements[a].latlng,
        i: b._elements[a].index
      };
    });
  },
  _getElementMarkers: function a() {
    var b = this;
    return Object.keys(this._elements).map(function(a) {
      return b._elements[a].marker;
    });
  },
  refresh: function a() {
    if (this._elementCollectionNotEmpty()) {
      this._renderComponents();
      this._renderElements();
    }
  },
  _renderElements: function a() {
    if (this._map.getZoom() >= this.options.zoomShowElements) {
      this._displayElements();
    } else {
      this._hideElements();
    }
  },
  _displayElements: function a() {
    var b = this;
    if (!this.elementDisplayed) {
      this._displayedElements.clearLayers();
      this.elementDisplayed = true;
      this._getElementMarkers().map(function(a) {
        a.setStyle({ pane: "grid-elements-pane" });
        b._displayedElements.addLayer(a);
      });
      this._displayedElements.addTo(this._map);
    }
  },
  _hideElements: function a() {
    if (this.elementDisplayed) {
      this.elementDisplayed = false;
      this._displayedElements.clearLayers();
    }
  },
  _renderComponents: function a() {
    if (this._map.getZoom() < this.options.zoomHideGrid) {
      this._truncateLayers();
      var b = [];
      b.push(new Date());
      this._prepareZones();
      b.push(new Date());
      this._findElements();
      b.push(new Date());
      this._buildCells();
      b.push(new Date());
      this._buildMarkers();
      b.push(new Date());
      this._buildTexts();
      b.push(new Date());
      if (this.options.trackingTime) {
      }
    } else {
      this._truncateLayers();
    }
  },
  _truncateLayers: function a() {
    this._cells.truncate();
    this._markers.truncate();
    this._texts.truncate();
  },
  _buildCells: function a() {
    var b = this;
    if (this.options.rules.cells && this.options.showCells) {
      this._visualise("cells");
      this._zones
        .filter(function(a) {
          return b.options.showEmptyCells || b._zoneIsNotEmpty(a);
        })
        .map(function(a) {
          var c = a.options.cells;
          if (b.options.showEmptyCells) {
            if (!b._zoneIsNotEmpty(a)) {
              c = b.options.emptyCellOptions;
            }
          }
          var d = new L.regularGridClusterCell(a.path, c);
          b._cells.addLayer(d);
        });
      this._cells.addTo(this._map);
    }
  },
  _buildMarkers: function a() {
    var b = this;
    if (this.options.rules.markers && this.options.showMarkers) {
      this._visualise("markers");
      this._zones.map(function(a) {
        if (b._zoneIsNotEmpty(a)) {
          var c = [a.y + a.h / 2, a.x + a.w / 2];
          var d = new L.regularGridClusterMarker(c, a.options.markers);
          b._markers.addLayer(d);
        }
      });
      this._markers.addTo(this._map);
    }
  },
  _buildTexts: function a() {
    var b = this;
    if (this.options.rules.texts && this.options.showTexts) {
      this._visualise("texts");
      this._zones.map(function(a) {
        if (b._zoneIsNotEmpty(a)) {
          var c = [a.y + a.h / 2, a.x + a.w / 2];
          var d = new L.regularGridClusterText(c, a.options.texts);
          b._texts.addLayer(d);
        }
      });
      this._texts.addTo(this._map);
    }
  },
  _indexZones: function a() {
    var b = this._gridOrigin();
    var c = this._gridEnd(); // const gridEnd = this._gridExtent().getNorthEast();
    var d = c.lng,
      e = c.lat;
    var f = b.lng,
      g = b.lat;
    var h = this.options.indexSize;
    var i = (d - f) / h,
      j = (e - g) / h;
    this._indexedZones = {};
    var k = 0;
    for (var l = f; l < d; l += i) {
      for (var m = g; m < e; m += j) {
        var n = L.latLngBounds([m, l], [m + j, l + i]);
        this._indexedZones[k] = { b: n, cs: [] };
        k++;
      }
    }
  },
  _indexElements: function a() {
    var b = this;
    this._getElementsCollection().map(function(a) {
      for (var c in b._indexedZones) {
        if (b._indexedZones[c].b.contains(a.g)) {
          b._elements[a.id].index = c;
          break;
        }
      }
    });
  },
  _indexedZonesCollection: function a() {
    var b = this;
    return Object.keys(this._indexedZones).map(function(a) {
      return b._indexedZones[a];
    });
  },
  _truncateIndexedZones: function a() {
    this._indexedZonesCollection().map(function(a) {
      a.cs = [];
    });
  },
  _prepareZones: function a() {
    this._zones = [];
    this._truncateIndexedZones();
    var b = 1;
    var c = this._zoneSize();
    var d = this._gridOrigin();
    var e = this._gridEnd();
    var f = e.lng,
      g = e.lat;
    var h = d.lng,
      i = d.lat;
    var j = 1;
    var k = c / 111319;
    var l = this._indexedZonesCollection();
    var m = function a(b, c) {
      l.map(function(a) {
        if (a.b.overlaps(c)) {
          a.cs.push(b);
        }
      });
    };
    while (i < g) {
      var n = this._zoneHeightAtY(i, c);
      if (this.options.gridMode === "hexagon" && j % 2) {
        h -= k / 2;
      }
      while (h < f) {
        var o = {
          id: b,
          x: h,
          y: i,
          h: n,
          w: k,
          options: { cells: {}, markers: {}, texts: {} },
          elms: []
        };
        var p = L.latLngBounds([i, h], [i + n, h + k]);
        o.path = this._buildPathOperations[this.options.gridMode].call(this, o);
        this._zones.push(o);
        m(o, p);
        b++;
        h += k;
      }
      h = d.lng;
      i = this.options.gridMode === "hexagon" ? i + (3 / 4) * n : i + n;
      j += 1;
    }
  },
  _findElements: function a() {
    var b = this;
    this._getElementsCollection().map(function(a) {
      var c = a.id;
      var d = a.g.lng,
        e = a.g.lat;
      if (_typeof(b._indexedZones[a.i]) === "object") {
        b._indexedZones[a.i].cs.map(function(a) {
          if (b._elmInsideOperations[b.options.gridMode].call(b, d, e, a)) {
            a.elms.push(c);
          }
        });
      }
    });
  },
  _zoneIsNotEmpty: function a(b) {
    return b.elms.length !== 0;
  },
  _visualise: function a(b) {
    var c = this;
    if (this.options.rules[b]) {
      Object.keys(this.options.rules[b]).forEach(function(a) {
        var d = c.options.rules[b][a];
        if (a === "text") {
          c._zonesValues(d.method, d.attribute);
          c._zones.forEach(function(a) {
            if (c._zoneIsNotEmpty(a)) {
              a.options.texts.text = a.value;
            }
          });
        } else if (c._isDynamicalRule(d)) {
          c._zonesValues(d.method, d.attribute);
          c._applyOptions(b, d, a);
        } else {
          c._zones.forEach(function(e) {
            if (c._zoneIsNotEmpty(e)) {
              e.options[b][a] = d;
            }
          });
        }
      });
    }
  },
  _applyOptions: function a(b, c, d) {
    var e = this;
    var f = c.scale;
    var g = c.range;
    if (g.length === 1) {
      this._zones.forEach(function(a) {
        a.options[b][d] = g[0];
      });
    } else if (g.length > 1) {
      var h = this._zoneValues(true).sort(function(c, a) {
        return c - a;
      });
      var j = g.length;
      if (f === "continuous") {
        j = j - 1;
      }
      var k = c.domain
        ? c.domain[0]
        : Math.min.apply(Math, _toConsumableArray(h));
      var l = c.domain
        ? c.domain[1]
        : Math.max.apply(Math, _toConsumableArray(h));
      var m = [];
      if (f != "size") {
        var n = Math.floor(h.length / j);
        for (var o = 1; o != j; o++) {
          m.push(h[n * o]);
        }
      }
      if (this._scaleOperations[f]) {
        this._zones.forEach(function(a) {
          if (e._isDefined(a.value)) {
            a.options[b][d] = e._scaleOperations[f](e, a.value, k, l, j, m, g);
          } else {
            if (e.options.defaultStyle[b] && e.options.defaultStyle[b][d]) {
              a.options[b][d] = e.options.defaultStyle[b][d];
            } else {
              a.options[b][d] = "none";
            }
          }
        });
      }
    }
  },
  _zonesValues: function a(b, c) {
    var d = this;
    this._zones.forEach(function(a) {
      if (d._zoneIsNotEmpty(a)) {
        if (b === "count") {
          a.value = d._methodOperations[b](d, a, false);
        } else {
          var e = d._zoneAttrValues(a, c);
          a.value = e.length ? d._methodOperations[b](d, a, e) : false;
        }
      }
    });
  },
  _zoneValues: function a(b) {
    if (b) {
      return this._zones
        .filter(function(a) {
          return a.value && typeof a.value !== "undefined" && !isNaN(a.value);
        })
        .map(function(a) {
          return a.value;
        });
    } else {
      return this._zones.map(function(a) {
        return a.value;
      });
    }
  },
  _zoneAttrValues: function a(b, c) {
    var d = this;
    var e = b.elms.map(function(a) {
      return d._elements[a].properties[c];
    });
    return this._cleanAttrValues(e);
  },
  _cleanAttrValues: function a(b) {
    return b.filter(this._isNumber);
  },
  _isDynamicalRule: function a(b) {
    return b.method && b.scale && b.range;
  }, // return size of the zone in meters
  _zoneSize: function a() {
    return this.options.zoneSize * Math.pow(2, 10 - this._mapZoom());
  },
  _gridOrigin: function a() {
    return this.options.gridOrigin === "auto"
      ? this._gridExtent().getSouthWest()
      : this.options.gridOrigin;
  },
  _gridEnd: function a() {
    return this.options.gridEnd === "auto"
      ? this._gridExtent().getNorthEast()
      : this.options.gridEnd;
  },
  _gridExtent: function a() {
    return this._getBounds().pad(this.options.gridBoundsPadding);
  },
  _getBounds: function a() {
    return L.latLngBounds(this._getGeometries());
  },
  _getGeometries: function a() {
    return this._getElementsCollection().map(function(a) {
      return a.g;
    });
  },
  _mapZoom: function a() {
    return this._map ? this._map.getZoom() : false;
  }, // BASE FUNCTIONS
  // longitude delta for given latitude
  _zoneHeightAtY: function a(b, c) {
    return c / 111319; // return (cellSize/111319) * this._deltaHeightAtY(y);
  },
  _isDefined: function a(b) {
    return !(!b && b !== 0);
  },
  _isNumber: function a(b) {
    return !isNaN(parseFloat(b)) && isFinite(b);
  }
});
L.regularGridCluster = function(a, b) {
  return new L.RegularGridCluster(a);
};
("use strict");
L.RegularGridCluster.include({
  // COLORS
  colors: {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    "indianred ": "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  },
  _colorNameToHex: function a(b) {
    if (typeof this.colors[b.toLowerCase()] != "undefined") {
      return this.colors[b.toLowerCase()].substring(1);
    } else {
      return false;
    }
  },
  _hex: function a(b) {
    b = b.toString(16);
    return b.length == 1 ? "0" + b : b;
  },
  _validateColor: function a(b) {
    if (b.indexOf("#") == -1) {
      return this._colorNameToHex(b);
    } else {
      return b.substring(1);
    }
  },
  _colorMix: function a(c, d, e) {
    c = this._validateColor(c);
    d = this._validateColor(d);
    var f = Math.floor(
      parseInt(c.substring(0, 2), 16) * e +
        parseInt(d.substring(0, 2), 16) * (1 - e)
    );
    var h = Math.floor(
      parseInt(c.substring(2, 4), 16) * e +
        parseInt(d.substring(2, 4), 16) * (1 - e)
    );
    var g = Math.floor(
      parseInt(c.substring(4, 6), 16) * e +
        parseInt(d.substring(4, 6), 16) * (1 - e)
    );
    return "#" + this._hex(f) + this._hex(h) + this._hex(g);
  }
});
("use strict");
function _toConsumableArray(a) {
  if (Array.isArray(a)) {
    for (var b = 0, c = Array(a.length); b < a.length; b++) {
      c[b] = a[b];
    }
    return c;
  } else {
    return Array.from(a);
  }
}
L.RegularGridCluster.include({
  _math_max: function a(b) {
    return Math.max.apply(Math, _toConsumableArray(b));
  },
  _math_min: function a(b) {
    return Math.min.apply(Math, _toConsumableArray(b));
  },
  _math_mode: function a(b) {
    if (b.length === 0) {
      return null;
    }
    var c = {};
    var d = b[0],
      e = 1;
    for (var f = 0; f < b.length; f++) {
      var g = b[f];
      if (g) {
        if (c[g] === null) {
          c[g] = 1;
        } else {
          c[g]++;
        }
        if (c[g] > e) {
          d = g;
          e = c[g];
        } // extendable to solve ties
      }
    }
    return d;
  },
  _math_mean: function a(b) {
    return (
      b.reduce(function(c, a) {
        return c + a;
      }, 0) / b.length
    );
  },
  _math_sum: function a(b) {
    return b.reduce(function(c, a) {
      return c + a;
    }, 0);
  },
  _math_median: function a(b) {
    b.sort(function(c, a) {
      return c - a;
    });
    var c = Math.floor(b.length / 2);
    return b.length % 2 ? b[c] : (b[c - 1] + b[c]) / 2;
  }
});
("use strict");
L.RegularGridCluster.include({
  _scaleOperations: {
    size: function a(b, c, d, e, f, g, h) {
      var i = e - d;
      var j = f - 1;
      if (c < e) {
        j = Math.floor(((c - d) / i) * f);
      }
      return h[j];
    },
    quantile: function a(b, c, d, e, f, g, h) {
      var i = 0;
      g.forEach(function(a, b) {
        if (c > a) {
          i = parseInt(b) + 1;
        }
      });
      return h[i];
    },
    continuous: function a(b, c, d, e, f, g, h) {
      var i = 0;
      g.forEach(function(a, b) {
        if (c > a) {
          i = parseInt(b) + 1;
        }
      });
      var j = g.slice(0);
      j.push(e);
      j.unshift(d);
      var k = (c - j[i]) / (j[i + 1] - j[i]) || 0;
      var l = h[i];
      var m = h[i + 1];
      if (b._isNumber(l)) {
        return l + k * (m - l);
      } else {
        return b._colorMix(m, l, k);
      }
    }
  },
  _methodOperations: {
    count: function a(b, c, d) {
      return c.elms.length;
    },
    mean: function a(b, c, d) {
      return b._math_mean(d);
    },
    median: function a(b, c, d) {
      return b._math_median(d);
    },
    mode: function a(b, c, d) {
      return b._math_mode(d);
    },
    max: function a(b, c, d) {
      return b._math_max(d);
    },
    min: function a(b, c, d) {
      return b._math_min(d);
    },
    sum: function a(b, c, d) {
      return b._math_sum(d);
    }
  },
  _elmInsideOperations: {
    square: function a(b, c, d) {
      var e = d.x,
        f = d.x + d.w,
        g = d.y,
        h = d.y + d.h;
      if (b > e) {
        if (c > g) {
          if (b < f) {
            if (c < h) {
              return true;
            }
          }
        }
      }
      return false;
    },
    hexagon: function a(b, c, d) {
      var e = d.x,
        f = d.x + d.w,
        g = d.y,
        h = d.y + d.h;
      if (b > e) {
        if (c > g) {
          if (b < f) {
            if (c < h) {
              var i = g + (d.h * 1) / 4,
                j = g + (d.h * 3) / 4;
              if (c > i && c < j) {
                return true;
              } else {
                var k = b - e,
                  l = c - g;
                if (l > (d.h / 4) * 3) {
                  l = d.h - l;
                }
                if (k > d.w / 2) {
                  k = d.w - k;
                }
                return l / (d.h / 4) + k / (d.w / 2) > 1;
              }
            }
          }
        }
      }
      return false;
    }
  },
  _buildPathOperations: {
    square: function a(b) {
      return [
        [b.y, b.x],
        [b.y, b.x + b.w],
        [b.y + b.h, b.x + b.w],
        [b.y + b.h, b.x],
        [b.y, b.x]
      ];
    },
    hexagon: function a(b) {
      return [
        [b.y + b.h / 4, b.x],
        [b.y, b.x + b.w / 2],
        [b.y + b.h / 4, b.x + b.w],
        [b.y + 3 * (b.h / 4), b.x + b.w],
        [b.y + b.h, b.x + b.w / 2],
        [b.y + 3 * (b.h / 4), b.x],
        [b.y + b.h / 4, b.x]
      ];
    }
  }
});
