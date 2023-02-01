import React from "react";
import Map, { MiniMap as TTMiniMap } from "../../../";

import { API_KEY } from "../config";

function MiniMap() {
  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      zoom={15}
      center={[-0.12634, 51.50276]}
    >
      <TTMiniMap
        zoomOffset={5}
        mapOptions={{
          key: API_KEY,
          minZoom: 3,
          maxZoom: 15
        }}
      />
    </Map>
  );
}

export default MiniMap;
