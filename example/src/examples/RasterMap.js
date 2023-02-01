import React from "react";
import Map from "../../../";

import { API_KEY } from "../config";

const endpoint = `https://{cyclingHostname}.api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?tileSize=512&key=${API_KEY}`;
const tiles = ["a", "b", "c", "d"].map((hostname) => {
  return endpoint.replace("{cyclingHostname}", hostname);
});

function RasterMap() {
  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle={{
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: tiles,
            tileSize: 256
          }
        },
        layers: [
          {
            id: "raster-tiles-layer",
            type: "raster",
            source: "raster-tiles"
          }
        ]
      }}
      zoom={12}
      center={[19.45773, 51.76217]}
    />
  );
}

export default RasterMap;
