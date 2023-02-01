import React, { useState } from "react";
import Select from "react-select";
import Map from "../../../";
import selectStyles from "../selectStyles";

import { API_KEY } from "../config";

const flowOptions = [
  {
    value: "relative0",
    label: "Relative 0"
  },
  {
    value: "relative0-dark",
    label: "Relative 0 Dark"
  }
];

const center = [-0.12634, 51.50276];

function VectorTrafficFlow() {
  const [style, setStyle] = useState("relative0");

  function getCurrentStyleUrl() {
    return `https://api.tomtom.com/style/1/style/*?map=basic_main&traffic_flow=flow_${style}&key=${API_KEY}`;
  }

  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle={getCurrentStyleUrl(style)}
      stylesVisibility={{
        trafficFlow: true
      }}
      zoom={10}
      center={center}
    >
      <div className="tt-overlay-panel -left-top -medium">
        <div className="tt-form">
          <label className="tt-form-label">
            Traffic flow style
            <Select
              styles={selectStyles}
              value={flowOptions.find((option) => option.value === style)}
              options={flowOptions}
              hideSelectedOptions
              onChange={(selectedOption) => setStyle(selectedOption.value)}
            />
          </label>
        </div>
      </div>
    </Map>
  );
}

export default VectorTrafficFlow;
