import React, { Component } from "react";
import Map from "../../../";

import { API_KEY } from "../config";

class ResizeMap extends Component {
  state = {
    containerWidth: "100%"
  };

  onStyleLoad = (map) => {
    this.map = map;
  };

  resizeMap = (size) => {
    this.setState(
      { containerWidth: size },
      () => this.map && this.map.resize()
    );
  };

  renderButtons() {
    return ["50%", "75%", "100%"].map((size) => {
      const className = `js-button tt-buttons-group__button ${
        this.state.containerWidth === size ? "-active" : ""
      }`;

      return (
        <button
          key={size}
          className={className}
          value={size}
          onClick={() => this.resizeMap(size)}
        >
          {size}
        </button>
      );
    });
  }

  render() {
    const { containerWidth } = this.state;
    const buttons = this.renderButtons();

    return (
      <Map
        apiKey={API_KEY}
        containerStyle={{ width: containerWidth, height: "100%" }}
        onStyleLoad={this.onStyleLoad}
      >
        <div className="tt-overlay-panel -left-top">
          <div className="tt-form-label">
            Map size
            <div className="js-button-list tt-buttons-group">{buttons}</div>
          </div>
        </div>
      </Map>
    );
  }
}

export default ResizeMap;
