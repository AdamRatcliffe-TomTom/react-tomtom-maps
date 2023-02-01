import React, { useState, useEffect } from "react";
import Map, { GeolocateControl } from "../../../";

import { API_KEY } from "../config";

const messages = {
  permissionDenied:
    "Permission denied. You can change your browser settings to allow usage of geolocation on this domain.",
  notAvailable: "Geolocation data provider not available."
};

function MyLocation() {
  const [error, setError] = useState();

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setError(messages.permissionDenied);
        }
      });
    }
  }, []);

  return (
    <Map apiKey={API_KEY} containerStyle={{ width: "100%", height: "100%" }}>
      <GeolocateControl
        positionOptions={{
          enableHighAccuracy: false
        }}
        onError={(error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(messages.permissionDenied);
              break;
            case error.POSITION_UNAVAILABLE:
            case error.TIMEOUT:
            default:
              setError(messages.notAvailable);
          }
        }}
      />
      {error && (
        <div className="tt-overlay-panel -center js-message-box">
          <button
            className="tt-overlay-panel__close js-message-box-close"
            onClick={() => setError(null)}
          />
          <span className="tt-overlay-panel__content">{error}</span>
        </div>
      )}
    </Map>
  );
}

export default MyLocation;
