import React from "react";
import Map, { PanControls, ZoomControls } from "../../../";

import { API_KEY } from "../config";

function PanAndZoomControls() {
  return (
    <Map apiKey={API_KEY} containerStyle={{ width: "100%", height: "100%" }}>
      <ZoomControls className="margin-left-30" />
      <PanControls />
    </Map>
  );
}

export default PanAndZoomControls;
