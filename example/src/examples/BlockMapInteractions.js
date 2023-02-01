import React from "react";
import Map from "../../../";

import { API_KEY } from "../config";

function BlockMapInteractions() {
  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapOptions={{
        doubleClickZoom: false,
        scrollZoom: false,
        dragPan: false,
        boxZoom: false,
        dragRotate: false,
        touchZoomRotate: false,
        pitchWithRotate: false
      }}
      zoom={13}
      center={[-0.10506, 51.51419]}
    />
  );
}

export default BlockMapInteractions;
