import React, { useState } from "react";
import Map from "../../../";
import Select from "react-select";
import selectStyles from "../selectStyles";

import { API_KEY } from "../config";

const styleOptions = [
  {
    value: "basic_main",
    label: "Basic main"
  },
  {
    value: "basic_night",
    label: "Basic night"
  },
  {
    value: "hybrid_main",
    label: "Hybrid main"
  },
  {
    value: "hybrid_night",
    label: "Hybrid night"
  }
];

function getStyleUrl(style) {
  return `https://api.tomtom.com/map/1/style/*/${style}.json?key=${API_KEY}`;
}

function SwitchStyles() {
  const [style, setStyle] = useState("basic_main");

  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle={getStyleUrl(style)}
    >
      <div className="tt-overlay-panel -left-top -medium">
        <div className="tt-form">
          <label className="tt-form-label">
            Map style
            <Select
              value={styleOptions.find((option) => option.value === style)}
              styles={selectStyles}
              options={styleOptions}
              hideSelectedOptions
              onChange={(selectedOption) => setStyle(selectedOption.value)}
            />
          </label>
        </div>
      </div>
    </Map>
  );
}

export default SwitchStyles;
