import React, { Component } from "react";
import Map from "../../../";

import { API_KEY } from "../config";

class MapProperties extends Component {
  state = {
    zoom: 11,
    center: [4.842666, 52.370717],
    bearing: 0,
    pitch: 0
  };

  handleZoomChange = (event) => {
    const zoom = parseFloat(event.target.value);
    this.setState({ zoom });
  };

  handleLngChange = (event) => {
    const lng = parseFloat(event.target.value);
    this.setState({ center: [lng, this.state.center[1]] });
  };

  handleLatChange = (event) => {
    const lat = parseFloat(event.target.value);
    this.setState({ center: [this.state.center[0], lat] });
  };

  handleBearingChange = (event) => {
    const bearing = parseInt(event.target.value, 10);
    this.setState({ bearing });
  };

  handlePitchChange = (event) => {
    const pitch = parseInt(event.target.value, 10);
    this.setState({ pitch });
  };

  render() {
    const { zoom, center, bearing, pitch } = this.state;

    const [lng, lat] = center;

    return (
      <Map
        containerStyle={{
          width: "100%",
          height: "100%"
        }}
        apiKey={API_KEY}
        zoom={zoom}
        center={center}
        bearing={bearing}
        pitch={pitch}
        customAttribution={[
          '<a target="_blank" href="https://www.tomtom.com/mapshare/tools/">Report map issue</a>',
          '<a target="_blank" href="//www.tomtom.com/en_gb/legal/privacy/" id="privacy_link">Privacy</a>'
        ]}
      >
        <div className="tt-overlay-panel -right-top -medium">
          <div className="MapPropertiesPanel__properties">
            <label className="tt-form-label" htmlFor="zoom">
              Zoom
            </label>
            <div className="tt-spacing-top-24">
              <input
                className="tt-input"
                type="number"
                name="zoom"
                min={0}
                max={20}
                value={zoom}
                onChange={this.handleZoomChange}
              />
            </div>
            <label className="tt-form-label tt-spacing-top-24" htmlFor="lng">
              Longitude
            </label>
            <div className="tt-spacing-top-24">
              <input
                className="tt-input"
                name="lng"
                value={lng}
                onChange={this.handleLngChange}
              />
            </div>
            <label className="tt-form-label tt-spacing-top-24" htmlFor="lat">
              Latitude
            </label>
            <div className="tt-spacing-top-24">
              <input
                className="tt-input"
                name="lat"
                value={lat}
                onChange={this.handleLatChange}
              />
            </div>
            <label
              className="tt-form-label tt-spacing-top-24"
              htmlFor="bearing"
            >
              Bearing
            </label>
            <div className="tt-spacing-top-24">
              <input
                className="tt-input"
                type="number"
                name="bearing"
                min={0}
                max={360}
                value={bearing}
                onChange={this.handleBearingChange}
              />
            </div>
            <label className="tt-form-label tt-spacing-top-24" htmlFor="pitch">
              Pitch
            </label>
            <div className="tt-spacing-top-24">
              <input
                className="tt-input"
                type="number"
                name="pitch"
                min={0}
                max={60}
                value={pitch}
                onChange={this.handlePitchChange}
              />
            </div>
          </div>
        </div>
      </Map>
    );
  }
}

export default MapProperties;
