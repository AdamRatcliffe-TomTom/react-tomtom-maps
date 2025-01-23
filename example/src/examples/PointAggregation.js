import React, { useState } from "react";
import Map, { FeatureAggregation, GeoJSONLayer, Popup } from "../../../";
import Select from "react-select";
import ColorBrewer from "colorbrewer";
import Palette from "../components/Palette";
import selectStyles from "../selectStyles";

import data from "../data/civic_art_collection.json";

import { API_KEY } from "../config";

const bounds = [
  [-122.486771, 37.740803],
  [-122.378718, 37.796115]
];
const fitBoundsOptions = {
  padding: {
    top: 50,
    right: 325,
    bottom: 50,
    left: 50
  },
  duration: 3000
};

const overlayPanelStyle = {
  overflowY: "auto",
  maxHeight: "calc(100vh - 86px)"
};

const colorSchemeOptionStyle = {
  display: "flex",
  flexDirection: "column"
};

const infoMessageStyle = {
  fontWeight: "normal"
};

const overviewButtonStyle = {
  position: "absolute",
  top: 16,
  left: 16
};

const unitOptions = [
  {
    value: "kilometers",
    label: "Kilometers"
  },
  {
    value: "degrees",
    label: "Degrees"
  },
  {
    value: "miles",
    label: "Miles"
  }
];

const colorSchemeOptions = [
  {
    label: "Sequential",
    options: [
      {
        value: "BuGn",
        label: "BuGn"
      },
      {
        value: "BuPu",
        label: "BuPu"
      },
      {
        value: "GnBu",
        label: "GnBu"
      },
      {
        value: "OrRd",
        label: "OrRd"
      },
      {
        value: "PuBu",
        label: "PuBu"
      },
      {
        value: "PuBuGn",
        label: "PuBuGn"
      },
      {
        value: "PuRd",
        label: "PuRd"
      },
      {
        value: "RdPu",
        label: "RdPu"
      },
      {
        value: "YlGn",
        label: "YlGn"
      },
      {
        value: "YlGnBu",
        label: "YlGnBu"
      },
      {
        value: "YlOrBr",
        label: "YlOrBr"
      },
      {
        value: "YlOrRd",
        label: "YlOrRd"
      }
    ]
  },
  {
    label: "Single Hue",
    options: [
      {
        value: "Blues",
        label: "Blues"
      },
      {
        value: "Greens",
        label: "Greens"
      },
      {
        value: "Greys",
        label: "Greys"
      },
      {
        value: "Oranges",
        label: "Oranges"
      },
      {
        value: "Purples",
        label: "Purples"
      },
      {
        value: "Reds",
        label: "Reds"
      }
    ]
  },
  {
    label: "Diverging",
    options: [
      {
        value: "BrBG",
        label: "BrBG"
      },
      {
        value: "PiYG",
        label: "PiYG"
      },
      {
        value: "PRGn",
        label: "PRGn"
      },
      {
        value: "PuOr",
        label: "PuOr"
      },
      {
        value: "RdBu",
        label: "RdBu"
      },
      {
        value: "RdGy",
        label: "RdGy"
      },
      {
        value: "RdYlBu",
        label: "RdYlBu"
      },
      {
        value: "RdYlGn",
        label: "RdYlGn"
      },
      {
        value: "Spectral",
        label: "Spectral"
      }
    ]
  }
];

function findSelectedOption(options, value) {
  for (let i = 0, l = options.length; i < l; i++) {
    const group = options[i];
    const selected = group.options.find((option) => option.value === value);
    if (selected) {
      return selected;
    }
  }
  return null;
}

const PointAggregation = () => {
  const [state, setState] = useState({
    type: "hex",
    extrude: true,
    extrusionHeightMultiplier: 50,
    polygonSide: 0.3,
    units: "kilometers",
    colorScheme: "BuPu",
    buckets: 5,
    fillOpacity: 0.8,
    fillHoverColor: "#ffa500",
    strokeWidth: 1,
    strokeColor: "#ffffff",
    strokeOpacity: 0.8,
    showLabels: true,
    labelColor: "#111111",
    labelHaloColor: "#ffffff",
    pitch: 45,
    bounds,
    aggregated: true,
    activeFeature: undefined,
    popupCoordinates: null
  });

  const availableBuckets = Object.keys(ColorBrewer[state.colorScheme]).map(
    Number
  );
  const minBuckets = Math.min.apply(null, availableBuckets);
  const maxBuckets = Math.max.apply(null, availableBuckets);

  function renderAggregationTypeButtons() {
    return ["hex", "square", "triangle"].map((value) => {
      const className = `js-button tt-buttons-group__button ${
        state.type === value ? "-active" : ""
      }`;

      return (
        <button
          key={value}
          className={className}
          style={{ textTransform: "capitalize" }}
          value={value}
          onClick={() => setState({ ...state, type: value })}
        >
          {value}
        </button>
      );
    });
  }

  function formatColorSchemeOptionLabel({ label, value }, { context }) {
    if (context === "menu") {
      const colors = ColorBrewer[value];
      const availableBuckets = Object.keys(colors).map(Number);
      return (
        <div style={colorSchemeOptionStyle}>
          <div>{label}</div>
          <Palette colors={colors[Math.max.apply(null, availableBuckets)]} />
        </div>
      );
    } else {
      return <Palette colors={ColorBrewer[state.colorScheme][state.buckets]} />;
    }
  }

  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{ width: "100%", height: "100%" }}
      mapStyle="https://api.tomtom.com/style/1/style/22.2.1-*/?map=2/basic_street-dark"
      pitch={state.pitch}
      bounds={state.bounds}
      fitBoundsOptions={fitBoundsOptions}
    >
      {!state.aggregated && (
        <button
          className="tt-button"
          style={overviewButtonStyle}
          onClick={() =>
            setState({ ...state, aggregated: true, pitch: 45, bounds })
          }
        >
          Overview
        </button>
      )}
      <div className="tt-overlay-panel -right-top" style={overlayPanelStyle}>
        <label className="tt-form-label">
          Aggregation style
          <div className="js-button-list tt-buttons-group">
            {renderAggregationTypeButtons()}
          </div>
        </label>
        <div className="tt-form-label">
          Extrude polygons
          <input
            id="extrudeToggle"
            className="tt-toggle js-bias-toggle"
            type="checkbox"
            checked={state.extrude}
            onChange={() => setState({ ...state, extrude: !state.extrude })}
          />
          <label htmlFor="extrudeToggle" className="tt-label"></label>
        </div>
        <label className="tt-form-label js-slider">
          Extrusion height multiplier (
          <span className="js-counter">{`${state.extrusionHeightMultiplier} meters`}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={1}
            max={100}
            step={1}
            value={state.extrusionHeightMultiplier}
            onChange={(event) =>
              setState({
                ...state,
                extrusionHeightMultiplier: parseInt(event.target.value)
              })
            }
            disabled={!state.extrude}
          />
        </label>
        <label className="tt-form-label js-slider">
          Polygon side length (
          <span className="js-counter">{`${state.polygonSide} ${state.units}`}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={state.polygonSide}
            onChange={(event) =>
              setState({
                ...state,
                polygonSide: parseFloat(event.target.value)
              })
            }
          />
        </label>
        <label className="tt-form-label">
          Units
          <Select
            value={unitOptions.find((option) => option.value === state.units)}
            styles={selectStyles}
            options={unitOptions}
            hideSelectedOptions
            onChange={(selectedOption) =>
              setState({ ...state, units: selectedOption.value })
            }
          />
        </label>
        <label className="tt-form-label">
          Color scheme
          <span style={infoMessageStyle}>
            {" (a "}
            <a
              rel="noopener noreferrer"
              className="tt-link"
              target="_blank"
              href="http://colorbrewer2.org/"
            >
              ColorBrewer
            </a>{" "}
            scheme)
          </span>
          <Select
            value={findSelectedOption(colorSchemeOptions, state.colorScheme)}
            styles={selectStyles}
            options={colorSchemeOptions}
            formatOptionLabel={formatColorSchemeOptionLabel}
            hideSelectedOptions
            isSearchable={false}
            onChange={(selectedOption) =>
              setState({
                ...state,
                colorScheme: selectedOption.value,
                buckets: 5
              })
            }
          />
        </label>
        <label className="tt-form-label js-slider">
          Buckets (<span className="js-counter">{state.buckets}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={minBuckets}
            max={maxBuckets}
            step={1}
            value={state.buckets}
            onChange={(event) =>
              setState({
                ...state,
                buckets: parseInt(event.target.value)
              })
            }
          />
        </label>
        <label className="tt-form-label js-slider">
          Fill opacity (<span className="js-counter">{state.fillOpacity}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={state.fillOpacity}
            onChange={(event) =>
              setState({
                ...state,
                fillOpacity: parseFloat(event.target.value)
              })
            }
          />
        </label>
        <label className="tt-form-label">
          Fill hover color
          <input
            className="tt-input"
            type="color"
            value={state.fillHoverColor}
            onChange={(event) =>
              setState({ ...state, fillHoverColor: event.target.value })
            }
          />
        </label>
        <label className="tt-form-label js-slider">
          Stroke width (<span className="js-counter">{state.strokeWidth}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={1}
            max={10}
            step={1}
            value={state.strokeWidth}
            onChange={(event) =>
              setState({
                ...state,
                strokeWidth: parseInt(event.target.value)
              })
            }
          />
        </label>
        <label className="tt-form-label">
          Stroke color
          <input
            className="tt-input"
            type="color"
            value={state.strokeColor}
            onChange={(event) =>
              setState({ ...state, strokeColor: event.target.value })
            }
          />
        </label>
        <label className="tt-form-label js-slider">
          Stroke opacity (
          <span className="js-counter">{state.strokeOpacity}</span>
          )
          <input
            className="tt-slider"
            type="range"
            min={0.1}
            max={1}
            step={0.1}
            value={state.strokeOpacity}
            onChange={(event) =>
              setState({
                ...state,
                strokeOpacity: parseFloat(event.target.value)
              })
            }
          />
        </label>
        <div className="tt-form-label">
          Show labels
          <input
            id="labelsToggle"
            className="tt-toggle js-bias-toggle"
            type="checkbox"
            checked={state.showLabels}
            onChange={() =>
              setState({ ...state, showLabels: !state.showLabels })
            }
          />
          <label htmlFor="labelsToggle" className="tt-label"></label>
        </div>
        <label className="tt-form-label">
          Label color
          <input
            className="tt-input"
            type="color"
            value={state.labelColor}
            onChange={(event) =>
              setState({ ...state, labelColor: event.target.value })
            }
            disabled={!state.showLabels}
          />
        </label>
        <label className="tt-form-label">
          Label halo color
          <input
            className="tt-input"
            type="color"
            value={state.labelHaloColor}
            onChange={(event) =>
              setState({ ...state, labelHaloColor: event.target.value })
            }
            disabled={!state.showLabels}
          />
        </label>
      </div>
      <GeoJSONLayer
        data={data}
        layerOptions={{ minzoom: 16 }}
        circlePaint={{
          "circle-color": "red",
          "circle-radius": 10,
          "circle-opacity": 0.3
        }}
      />
      <FeatureAggregation
        id="aggregated-points"
        type={state.type}
        data={data}
        maxZoom={16}
        polygonSide={state.polygonSide}
        units={state.units}
        colorScheme={state.colorScheme}
        buckets={state.buckets}
        fillOpacity={state.fillOpacity}
        fillHoverColor={state.fillHoverColor}
        strokeWidth={state.strokeWidth}
        strokeColor={state.strokeColor}
        strokeOpacity={state.strokeOpacity}
        extrude={state.extrude}
        extrusionHeightMultiplier={state.extrusionHeightMultiplier}
        showLabels={state.showLabels}
        labelColor={state.labelColor}
        labelHaloColor={state.labelHaloColor}
        onMouseMove={(feature, event) =>
          setState({
            ...state,
            activeFeature: feature,
            popupCoordinates: event.lngLat
          })
        }
        onMouseLeave={() =>
          setState({
            ...state,
            activeFeature: undefined,
            popupCoordinates: undefined
          })
        }
        onClick={(feature) =>
          setState({
            ...state,
            aggregated: false,
            bounds: feature.properties.expansionBounds,
            pitch: 0
          })
        }
      />
      {state.activeFeature && (
        <Popup
          className="tt-datatip"
          coordinates={state.popupCoordinates}
          offset={[0, -8]}
          closeButton={false}
        >
          {state.activeFeature.properties.childCount}
        </Popup>
      )}
    </Map>
  );
};

export default PointAggregation;
