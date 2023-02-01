import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

import MapProperties from "./examples/MapProperties";
import RasterMap from "./examples/RasterMap";
import SwitchStyles from "./examples/SwitchStyles";
import MultipleMaps from "./examples/MultipleMaps";
import WMSLayer from "./examples/WMSLayer";
import AutomatedLocationChange from "./examples/AutomatedLocationChange";
import PanAndZoomControls from "./examples/PanAndZoomControls";
import MiniMap from "./examples/MiniMap";
import MapEvents from "./examples/MapEvents";
import LimitMapInteractions from "./examples/LimitMapInteractions";
import BlockMapInteractions from "./examples/BlockMapInteractions";
import ResizeMap from "./examples/ResizeMap";
import MyLocation from "./examples/MyLocation";
import AutoCompleteSearch from "./examples/AutoCompleteSearch";
import VectorTrafficFlow from "./examples/VectorTrafficFlow";
import VectorTrafficIncidents from "./examples/VectorTrafficIncidents";
import PointAggregation from "./examples/PointAggregation";
import Views from "./Views";
import Sources from "./sources";

import "./Example.css";

class Example extends React.Component {
  render() {
    const { match, view } = this.props;
    const source = Sources[match.url];
    const showMap = view === Views.MAP;

    return (
      <div className="Example">
        <div className="Example__content">
          <div className="Example__map-container" hidden={!showMap}>
            <Switch>
              <Route
                path={`${process.env.PUBLIC_URL}/map-properties`}
                component={MapProperties}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/raster-map`}
                component={RasterMap}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/switch-styles`}
                component={SwitchStyles}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/multiple-maps`}
                component={MultipleMaps}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/wms-layer`}
                component={WMSLayer}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/automated-location-change`}
                component={AutomatedLocationChange}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/pan-zoom-controls`}
                component={PanAndZoomControls}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/minimap`}
                component={MiniMap}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/map-events`}
                component={MapEvents}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/limit-map-interactions`}
                component={LimitMapInteractions}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/block-map-interactions`}
                component={BlockMapInteractions}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/resize-map`}
                component={ResizeMap}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/my-location`}
                component={MyLocation}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/autocomplete-search`}
                component={AutoCompleteSearch}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/vector-traffic-flow`}
                component={VectorTrafficFlow}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/vector-traffic-incidents`}
                component={VectorTrafficIncidents}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/point-aggregation`}
                component={PointAggregation}
              />
              <Redirect
                from="*"
                to={`${process.env.PUBLIC_URL}/map-properties`}
              />
            </Switch>
          </div>
          <SyntaxHighlighter
            hidden={showMap}
            language="jsx"
            style={vs}
            customStyle={{
              border: "none",
              margin: 0,
              padding: 16,
              height: "100%"
            }}
          >
            {source}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }
}

export default withRouter(Example);
