import React from "react";
import Map, { FullScreenControl, NavigationControl, Marker } from "../../../";

import { API_KEY } from "../config";

function MultipleMaps() {
  return (
    <div style={{ height: "100%", display: "flex", alignContent: "stretch" }}>
      <Map
        apiKey={API_KEY}
        containerStyle={{ flex: 1 }}
        bounds={[
          [17, -34],
          [27, -15]
        ]}
        fitBoundsOptions={{ padding: 100, linear: true }}
      >
        <FullScreenControl />
        <NavigationControl />
        <Marker coordinates={[25.856667, -17.924444]} />
        <Marker coordinates={[23.623112, -19.130979]} />
        <Marker coordinates={[18.403108, -33.957314]} />
      </Map>
      <Map
        apiKey={API_KEY}
        containerStyle={{ flex: 1 }}
        mapStyle={`https://api.tomtom.com/map/1/style/*/basic_night.json?key=${API_KEY}`}
        center={[4.899431, 52.379189]}
        zoom={12}
      >
        <FullScreenControl />
        <NavigationControl />
      </Map>
    </div>
  );
}

export default MultipleMaps;
