import React from "react";
import Map from "../../../";

import { API_KEY } from "../config";

const endpoint = `https://{cyclingHostname}.api.tomtom.com/map/1/wms/?service=WMS&version=1.1.1&request=GetMap&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=512&height=512&layers=basic&styles=&format=image/jpeg&key=${API_KEY}`;

const tiles = ["a", "b", "c", "d"].map((hostname) => {
  return endpoint.replace("{cyclingHostname}", hostname);
});

var wmsStyle = {
  version: 8,
  sources: {
    "raster-tiles-wms-jpg": {
      type: "raster",
      tileSize: 256,
      tiles: tiles
    }
  },
  layers: [
    {
      id: "tomtomWMSBasicJPG",
      type: "raster",
      source: "raster-tiles-wms-jpg"
    }
  ]
};

function WMSLayer() {
  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle={wmsStyle}
      zoom={4}
      center={[-96, 41]}
    />
  );
}

export default WMSLayer;
