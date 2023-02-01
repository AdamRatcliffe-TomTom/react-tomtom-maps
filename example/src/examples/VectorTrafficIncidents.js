import React, { useState } from "react";
import Select from "react-select";
import Map from "../../../";
import selectStyles from "../selectStyles";

import { API_KEY } from "../config";

const incidentOptions = [
  {
    value: "day",
    label: "day"
  },
  {
    value: "dark",
    label: "dark"
  },
  {
    value: "s0",
    label: "s0"
  },
  {
    value: "s0-dark",
    label: "s0-dark"
  }
];

const center = [-0.12634, 51.50276];

function VectorTrafficIncidents() {
  const [style, setStyle] = useState("day");

  function getCurrentStyleUrl(style) {
    return `https://api.tomtom.com/style/1/style/*?map=basic_main&traffic_incidents=incidents_${style}&key=${API_KEY}`;
  }

  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle={getCurrentStyleUrl(style)}
      stylesVisibility={{
        trafficIncidents: true
      }}
      zoom={15}
      center={center}
    >
      <div className="tt-overlay-panel -left-top -medium js-foldable">
        <div className="tt-form">
          <label className="tt-form-label">
            Traffic incidents style
            <Select
              styles={selectStyles}
              value={incidentOptions.find((option) => option.value === style)}
              options={incidentOptions}
              hideSelectedOptions
              onChange={(selectedOption) => setStyle(selectedOption.value)}
            />
          </label>
        </div>
      </div>
    </Map>
  );
}

export default VectorTrafficIncidents;
