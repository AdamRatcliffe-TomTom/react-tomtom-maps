/* eslint import/no-webpack-loader-syntax: off */

import mapPropertiesSource from "!!raw-loader!./examples/MapProperties";
import rasterMapSource from "!!raw-loader!./examples/RasterMap";
import switchStylesSource from "!!raw-loader!./examples/SwitchStyles";
import multipleMapsSource from "!!raw-loader!./examples/MultipleMaps";
import wmsLayerSource from "!!raw-loader!./examples/WMSLayer";
import automatedLocationChangeSource from "!!raw-loader!./examples/AutomatedLocationChange";
import panAndZoomControlsSource from "!!raw-loader!./examples/PanAndZoomControls";
import miniMapSource from "!!raw-loader!./examples/MiniMap";
import mapEventsSource from "!!raw-loader!./examples/MapEvents";
import limitMapInteractionsSource from "!!raw-loader!./examples/LimitMapInteractions";
import blockMapInteractionsSource from "!!raw-loader!./examples/BlockMapInteractions";
import resizeMapSource from "!!raw-loader!./examples/ResizeMap";
import myLocationSource from "!!raw-loader!./examples/MyLocation";
import autoCompleteSearchSource from "!!raw-loader!./examples/AutoCompleteSearch";
import vectorTrafficFlowSource from "!!raw-loader!./examples/VectorTrafficFlow";
import vectorTrafficIncidentsSource from "!!raw-loader!./examples/VectorTrafficIncidents";
import pointAggregationSource from "!!raw-loader!./examples/PointAggregation";

export default {
  "/map-properties": mapPropertiesSource,
  "/raster-map": rasterMapSource,
  "/switch-styles": switchStylesSource,
  "/multiple-maps": multipleMapsSource,
  "/wms-layer": wmsLayerSource,
  "/automated-location-change": automatedLocationChangeSource,
  "/pan-zoom-controls": panAndZoomControlsSource,
  "/minimap": miniMapSource,
  "/map-events": mapEventsSource,
  "/limit-map-interactions": limitMapInteractionsSource,
  "/block-map-interactions": blockMapInteractionsSource,
  "/resize-map": resizeMapSource,
  "/my-location": myLocationSource,
  "/autocomplete-search": autoCompleteSearchSource,
  "/vector-traffic-flow": vectorTrafficFlowSource,
  "/vector-traffic-incidents": vectorTrafficIncidentsSource,
  "/point-aggregation": pointAggregationSource
};
