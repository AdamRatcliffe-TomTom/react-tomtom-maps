import React, { useState, useEffect } from "react";
import Map from "../../../";

import { API_KEY } from "../config";

const points = [
  [-104.98485, 39.73845],
  [-118.24334, 34.05224],
  [-122.42017, 37.78008]
];

function AutomatedLocationChange() {
  const [pointIndex, setPointIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPointIndex((i) => (i + 1) % points.length),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <Map
      containerStyle={{
        width: "100%",
        height: "100%"
      }}
      apiKey={API_KEY}
      zoom={9}
      center={points[pointIndex]}
      movingMethod="flyTo"
    />
  );
}

export default AutomatedLocationChange;
