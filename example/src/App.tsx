import { useState } from "react";
import Map from "../../src/map/Map";
import Marker from "../../src/overlays/Marker";
import Popup from "../../src/overlays/Popup";
import NavigationControl from "../../src/controls/NavigationControl";
import GeolocateControl from "../../src/controls/GeolocateControl";
import ScaleControl from "../../src/controls/ScaleControl";
import GeoJSONLayer from "../../src/layers/GeoJSONLayer";
import { TomTomStyleDescriptor } from "../../src/map/StyleResolver";

// Get API key from environment variable
const TOMTOM_API_KEY =
  import.meta.env.VITE_TOMTOM_API_KEY || "YOUR_TOMTOM_API_KEY_HERE";

// Sample GeoJSON data
const sampleGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-74.006, 40.7128] // New York City
      },
      properties: {
        name: "New York City",
        description: "The Big Apple"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.006, 40.7128], // NYC
          [-87.6298, 41.8781] // Chicago
        ]
      },
      properties: {
        name: "NYC to Chicago Route"
      }
    }
  ]
};

// Available TomTom map styles
const mapStyles = [
  {
    label: "Genesis - Basic Street Light (Shorthand)",
    value: "genesis:2/basic_street-light",
    attribution: "Genesis",
    type: "shorthand"
  },
  {
    label: "Genesis - Basic Street Dark (Shorthand)",
    value: "genesis:2/basic_street-dark",
    attribution: "Genesis",
    type: "shorthand"
  },
  {
    label: "Genesis - Basic Street Satellite (Shorthand)",
    value: "genesis:2/basic_street-satellite",
    attribution: "Genesis",
    type: "shorthand"
  },
  {
    label: "Orbis - Basic Street Light (Shorthand)",
    value: "orbis:basic_street-light",
    attribution: "Orbis",
    type: "shorthand"
  },
  {
    label: "Orbis - Basic Street Dark (Shorthand)",
    value: "orbis:basic_street-dark",
    attribution: "Orbis",
    type: "shorthand"
  },
  {
    label: "Genesis - Full Style with Traffic",
    value: {
      mapType: "genesis",
      map: "2/basic_street-light",
      trafficIncidents: "2/incidents_light",
      trafficFlow: "2/flow_relative-light",
      hillshade: "2/hillshade_light"
    } as TomTomStyleDescriptor,
    attribution: "Genesis",
    type: "descriptor"
  },
  {
    label: "Genesis - Street Only (No Traffic)",
    value: {
      mapType: "genesis",
      map: "2/basic_street-light"
    } as TomTomStyleDescriptor,
    attribution: "Genesis",
    type: "descriptor"
  },
  {
    label: "Orbis - Full Style with Traffic",
    value: {
      mapType: "orbis",
      map: "basic_street-light",
      trafficIncidents: "incidents_light",
      trafficFlow: "flow_relative-light",
      hillshade: "hillshade_light"
    } as TomTomStyleDescriptor,
    attribution: "Orbis",
    type: "descriptor"
  }
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [stylesVisibility, setStylesVisibility] = useState({
    trafficFlow: false,
    trafficIncidents: false,
    hillshade: true
  });
  const [selectedStyle, setSelectedStyle] = useState<
    TomTomStyleDescriptor | string
  >({
    mapType: "genesis",
    map: "2/basic_street-light"
  });

  // Get the attribution for the selected style
  const selectedStyleConfig = mapStyles.find(
    (style) =>
      style.value === selectedStyle ||
      (typeof style.value === "object" &&
        JSON.stringify(style.value) === JSON.stringify(selectedStyle))
  );
  const customAttribution = selectedStyleConfig?.attribution;

  return (
    <div className="App">
      <h1>React MapLibre GL Example</h1>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label
            htmlFor="mapStyle"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Map Style:
          </label>
          <select
            id="mapStyle"
            value={
              typeof selectedStyle === "string"
                ? selectedStyle
                : JSON.stringify(selectedStyle)
            }
            onChange={(e) => {
              const value = e.target.value;
              try {
                // Try to parse as JSON for descriptor objects
                const parsed = JSON.parse(value);
                setSelectedStyle(parsed);
              } catch {
                // If parsing fails, treat as string
                setSelectedStyle(value);
              }
            }}
            style={{ padding: "5px", marginRight: "10px", minWidth: "300px" }}
          >
            {mapStyles.map((style, index) => (
              <option
                key={index}
                value={
                  typeof style.value === "string"
                    ? style.value
                    : JSON.stringify(style.value)
                }
              >
                {style.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowPopup(!showPopup)}
          style={{ marginRight: "10px", padding: "8px 16px" }}
        >
          {showPopup ? "Hide" : "Show"} Popup
        </button>
        <button
          onClick={() => setShowGeoJSON(!showGeoJSON)}
          style={{ padding: "8px 16px" }}
        >
          {showGeoJSON ? "Hide" : "Show"} GeoJSON Layer
        </button>

        <div style={{ marginTop: "10px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Style Components Visibility:</h4>
          <label style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              checked={stylesVisibility.trafficFlow}
              onChange={(e) =>
                setStylesVisibility((prev) => ({
                  ...prev,
                  trafficFlow: e.target.checked
                }))
              }
              style={{ marginRight: "5px" }}
            />
            Traffic Flow
          </label>
          <label style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              checked={stylesVisibility.trafficIncidents}
              onChange={(e) =>
                setStylesVisibility((prev) => ({
                  ...prev,
                  trafficIncidents: e.target.checked
                }))
              }
              style={{ marginRight: "5px" }}
            />
            Traffic Incidents
          </label>
          <label style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              checked={stylesVisibility.hillshade}
              onChange={(e) =>
                setStylesVisibility((prev) => ({
                  ...prev,
                  hillshade: e.target.checked
                }))
              }
              style={{ marginRight: "5px" }}
            />
            Hillshade
          </label>
        </div>
      </div>

      <div className="map-container">
        <Map
          apiKey={TOMTOM_API_KEY}
          mapStyle={selectedStyle}
          customAttribution={customAttribution}
          center={[-74.006, 40.7128]}
          zoom={10}
          containerStyle={{ width: "100%", height: "100%" }}
          globe
          stylesVisibility={stylesVisibility}
        >
          {/* Navigation Controls */}
          <NavigationControl
            showCompass={true}
            showZoom={true}
            showPitch={true}
            position="top-right"
          />

          {/* Geolocate Control */}
          <GeolocateControl
            position="top-left"
            trackUserLocation={true}
            showUserLocation={true}
          />

          {/* Scale Control */}
          <ScaleControl unit="metric" position="bottom-left" />

          {/* Sample Marker */}
          <Marker
            coordinates={[-74.006, 40.7128]}
            color="#ff0000"
            width={30}
            height={30}
            onClick={() => setShowPopup(true)}
          />
          {showPopup && (
            <Popup
              coordinates={[-74.006, 40.7128]}
              closeButton={true}
              onClose={() => setShowPopup(false)}
            >
              <div>
                <h3>New York City</h3>
                <p>The Big Apple - Click the marker to see this popup!</p>
              </div>
            </Popup>
          )}
          {/* GeoJSON Layer */}
          {showGeoJSON && (
            <GeoJSONLayer
              data={sampleGeoJSON}
              paint={{
                "circle-radius": 8,
                "circle-color": "#007cbf",
                "circle-stroke-width": 2,
                "circle-stroke-color": "#ffffff"
              }}
              layout={{
                "line-join": "round",
                "line-cap": "round"
              }}
              linePaint={{
                "line-color": "#007cbf",
                "line-width": 3
              }}
            />
          )}
        </Map>
      </div>

      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>✅ Basic Map with TomTom API key</li>
          <li>✅ TomTom Style Configuration (Genesis & Orbis)</li>
          <li>✅ New Style Descriptor Format with Traffic & Hillshade</li>
          <li>
            ✅ Style Components Visibility Controls (Traffic Flow, Incidents,
            Hillshade)
          </li>
          <li>✅ Navigation Controls (zoom, compass, pitch)</li>
          <li>✅ Geolocate Control (user location tracking)</li>
          <li>✅ Scale Control (metric/imperial units)</li>
          <li>✅ Interactive Markers with custom styling</li>
          <li>✅ Popups with custom content</li>
          <li>✅ GeoJSON Layer with points and lines</li>
          <li>✅ Dynamic show/hide functionality</li>
        </ul>

        <h3>TomTom Style Shorthand Examples:</h3>
        <ul>
          <li>
            <code>genesis:2/basic_street-light</code> - Genesis light theme
          </li>
          <li>
            <code>genesis:2/basic_street-dark</code> - Genesis dark theme
          </li>
          <li>
            <code>genesis:2/basic_street-satellite</code> - Genesis satellite
            theme
          </li>
          <li>
            <code>orbis:basic_street-light</code> - Orbis light theme
          </li>
          <li>
            <code>orbis:basic_street-dark</code> - Orbis dark theme
          </li>
        </ul>

        <p style={{ color: "#888", fontSize: "14px" }}>
          <strong>API Key:</strong> This example uses the API key from{" "}
          <code>example/.env</code>. If you need to use your own key, edit the{" "}
          <code>VITE_TOMTOM_API_KEY</code> value in that file. Get a free API
          key from{" "}
          <a
            href="https://developer.tomtom.com/"
            target="_blank"
            rel="noopener"
          >
            developer.tomtom.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
