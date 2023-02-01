import React, { Component } from "react";
import tt from "@tomtom-international/web-sdk-maps";

import Map, {
  FullScreenControl,
  NavigationControl,
  Marker,
  SearchBox,
  Popup
} from "../../../";

import { API_KEY } from "../config";

function getBounds(data) {
  if (data.viewport) {
    const btmRight = [
      data.viewport.btmRightPoint.lng,
      data.viewport.btmRightPoint.lat
    ];
    const topLeft = [
      data.viewport.topLeftPoint.lng,
      data.viewport.topLeftPoint.lat
    ];
    return [btmRight, topLeft];
  }
  return null;
}

function getFitBounds(markerData) {
  if (!markerData || (Array.isArray(markerData) && !markerData.length)) {
    return;
  }

  const bounds = new tt.LngLatBounds();

  if (Array.isArray(markerData)) {
    markerData.forEach((marker) => {
      bounds.extend(getBounds(marker));
    });
  } else {
    bounds.extend(getBounds(markerData));
  }

  return bounds.toArray();
}

function convertDistance(distanceMeters) {
  if (distanceMeters < 1000) {
    return Math.ceil(distanceMeters) + " m";
  }
  return Math.ceil(distanceMeters / 1000) + " km";
}

const PopupContent = ({ result }) => {
  const name = result.poi ? result.poi.name : undefined;
  const address = `${result.address.freeformAddress}, ${result.address.countryCodeISO3}`;
  const distance = result.dist;

  return (
    <div className="tt-pop-up-container">
      <div className="pop-up-icon">
        <div className="tt-icon-flag-black" />
      </div>
      <div className="pop-up-content">
        {name && <div className="pop-up-data-name">{name}</div>}
        <div className="pop-up-result-address">{address}</div>
        {distance && (
          <div className="pop-up-result-distance">
            {convertDistance(distance)}
          </div>
        )}
      </div>
    </div>
  );
};

class AutoCompleteSearch extends Component {
  state = {
    bounds: null,
    results: [],
    selectedResult: null
  };

  handleResultsFound = (response) => {
    const { results } = response.data.results.fuzzySearch;
    const bounds = getFitBounds(results);
    this.setState({ results, selectedResult: null, bounds });
  };

  handleResultsCleared = () => {
    this.setState({ results: [], selectedResult: null });
  };

  handleResultSelected = (response) => {
    const { result } = response.data;
    const bounds = getFitBounds(result);
    this.setState({ results: [result], bounds });
  };

  handlePopupClose = () => {
    this.setState({ selectedResult: null });
  };

  selectResult = (result) => {
    this.setState({ selectedResult: result });
  };

  renderMarkers = (results) => {
    return results.map((result) => (
      <Marker
        key={result.id}
        coordinates={[result.position.lng, result.position.lat]}
        anchor="bottom"
        onClick={() => this.selectResult(result)}
      />
    ));
  };

  render() {
    const { bounds, results, selectedResult } = this.state;

    const markers = this.renderMarkers(results);

    return (
      <Map
        containerStyle={{
          width: "100%",
          height: "100%"
        }}
        apiKey={API_KEY}
        bounds={bounds}
        fitBoundsOptions={{ padding: 100, linear: true }}
      >
        <SearchBox
          labels={{ placeholder: "Search addresses and places" }}
          searchOptions={{ key: API_KEY }}
          autocompleteOptions={{ key: API_KEY }}
          onResultsFound={this.handleResultsFound}
          onResultsCleared={this.handleResultsCleared}
          onResultSelected={this.handleResultSelected}
        />
        <FullScreenControl />
        <NavigationControl />
        {markers}
        {selectedResult && (
          <Popup
            coordinates={[
              selectedResult.position.lng,
              selectedResult.position.lat
            ]}
            offset={[0, -42]}
            onClose={this.handlePopupClose}
          >
            <PopupContent result={selectedResult} />
          </Popup>
        )}
      </Map>
    );
  }
}

export default AutoCompleteSearch;
