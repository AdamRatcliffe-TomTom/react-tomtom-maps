import React, { useState } from "react";
import Map, { Popup } from "../../../";

import { API_KEY } from "../config";

const center = [4.899431, 52.379189];

function MapEvents() {
  const [popupState, setPopupState] = useState({
    visible: true,
    coordinates: center,
    content: "Click anywhere on the map to lookup the clicked lat lon."
  });

  return (
    <Map
      apiKey={API_KEY}
      containerStyle={{
        width: "100%",
        height: "100%"
      }}
      center={center}
      zoom={12}
      onClick={(_, event) =>
        setPopupState({
          visible: true,
          coordinates: event.lngLat,
          content: event.lngLat.toString()
        })
      }
    >
      {popupState.visible && (
        <Popup
          className="tt-popup"
          coordinates={popupState.coordinates}
          onClose={() => setPopupState({ ...popupState, visible: false })}
        >
          {popupState.content}
        </Popup>
      )}
    </Map>
  );
}

export default MapEvents;
