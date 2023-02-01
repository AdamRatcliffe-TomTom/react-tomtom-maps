import React from "react";
import Map from "../../../";

import { API_KEY } from "../config";

function LimitMapInteractions() {
  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapOptions={{
        minZoom: 16,
        maxZoom: 17
      }}
      zoom={16}
      center={[-0.00217, 51.47745]}
      maxBounds={[
        [-0.01717, 51.47245],
        [0.01283, 51.48245]
      ]}
    />
  );
}

export default LimitMapInteractions;
