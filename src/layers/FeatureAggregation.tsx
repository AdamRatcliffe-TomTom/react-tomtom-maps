import { Component } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import uuid from "uuid/v4";
import { flatten } from "lodash";
import { featureCollection as turfFeatureCollection } from "@turf/helpers";
import turfBbox from "@turf/bbox";
import turfHexGrid from "@turf/hex-grid";
import turfSquareGrid from "@turf/square-grid";
import turfTriangleGrid from "@turf/triangle-grid";
import turfCollect from "@turf/collect";
import { equalIntervalBreaks } from "simple-statistics";
import ColorBrewer from "colorbrewer";
import LayerTypes from "./LayerTypes";
import ColorSchemes from "./ColorSchemes";
import { withMap } from "../map/MapContext";
import decodeFeatureProperties from "../util/decodeFeatureProperties";

const eventToHandler = {
  mousemove: "handleMapMouseMove",
  mouseenter: "handleMapMouseEnter",
  mouseleave: "handleMapMouseLeave",
  mousedown: "handleMapMouseDown",
  mouseup: "handleMapMouseUp",
  click: "handleMapClick"
};

type Transition = { duration: number; delay: number };

type AggregationTypes = "hex" | "square" | "triangle";

interface Props {
  map: tt.Map;
  id?: string;
  type?: AggregationTypes;
  data: GeoJSON.FeatureCollection;
  sourceOptions?: object;
  polygonSide?: number;
  units?: "degrees" | "radians" | "miles" | "kilometers";
  //aggOperation?: "count" | "sum" | "avg" | "max" | "min";
  //aggProperty?: string;
  buckets?: number;
  colorScheme?: ColorSchemes;
  fillOpacity?: number;
  fillHoverColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  extrude?: boolean;
  extrusionHeightMultiplier?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelHaloColor?: string;
  transition?: Transition;
  onMouseMove?: Function;
  onMouseEnter?: Function;
  onMouseLeave?: Function;
  onMouseDown?: Function;
  onMouseUp?: Function;
  onClick?: Function;
  minZoom?: number;
  maxZoom?: number;
  before?: string;
}

interface State {
  polygons: GeoJSON.FeatureCollection | undefined;
  hoveredStateId: string | number | undefined;
}

function getGridFunction(type: AggregationTypes): Function {
  switch (type) {
    case "square":
      return turfSquareGrid;
    case "triangle":
      return turfTriangleGrid;
    case "hex":
    default:
      return turfHexGrid;
  }
}

function clampBuckets(colorScheme: string, buckets: number) {
  const colors = ColorBrewer[colorScheme];
  const availableBuckets = Object.keys(colors).map(Number);
  const minBuckets = Math.min.apply(null, availableBuckets);
  const maxBuckets = Math.max.apply(null, availableBuckets);
  return Math.min(Math.max(buckets, minBuckets), maxBuckets);
}

function calculateExpansionBounds(feature: GeoJSON.Feature) {
  const coordinates = flatten(
    (feature.geometry as GeoJSON.Polygon).coordinates
  ) as unknown as [number, number][];
  const bounds = coordinates.reduce(
    (bounds: tt.LngLatBounds, coord: [number, number]) => {
      return bounds.extend(new tt.LngLat(coord[0], coord[1]));
    },
    new tt.LngLatBounds(coordinates[0], coordinates[0])
  );

  return bounds.toArray();
}

class FeatureAggregation extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    type: "hex",
    polygonSide: 50,
    units: "kilometers",
    //aggOperation: "count",
    buckets: 5,
    colorScheme: "YlGnBu",
    fillOpacity: 0.8,
    fillHoverColor: "#ffa500",
    strokeWidth: 1,
    strokeColor: "#ffffff",
    strokeOpacity: 0.8,
    extrude: false,
    extrusionHeightMultiplier: 1,
    showLabels: false,
    labelColor: "#111111",
    labelHaloColor: "#ffffff",
    transition: {
      duration: 1000,
      delay: 0
    }
  };

  state: State = {
    polygons: undefined,
    hoveredStateId: undefined
  };

  private id: string = this.props.id || `feature-aggregation-${uuid()}`;

  componentDidMount() {
    this.createLayers();
  }

  componentWillUnmount() {
    const { map } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    this.removeLayers();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      map,
      type,
      data,
      sourceOptions,
      polygonSide,
      units,
      buckets,
      colorScheme,
      fillOpacity,
      fillHoverColor,
      strokeWidth,
      strokeColor,
      strokeOpacity,
      extrude,
      extrusionHeightMultiplier,
      showLabels,
      labelColor,
      labelHaloColor
    } = this.props;

    const source = map.getSource(this.id) as tt.GeoJSONSource;

    if (!source) {
      return;
    }

    const polgonsChanged =
      prevProps.type !== type ||
      prevProps.data !== data ||
      prevProps.extrude !== extrude ||
      prevProps.sourceOptions !== sourceOptions ||
      prevProps.polygonSide !== polygonSide ||
      prevProps.units !== units;

    if (polgonsChanged) {
      this.removeLayers();
      this.createLayers();
      this.forceUpdate();
    } else {
      const fillChanged =
        prevProps.colorScheme !== colorScheme ||
        prevProps.buckets !== buckets ||
        prevProps.fillOpacity !== fillOpacity ||
        prevProps.fillHoverColor !== fillHoverColor ||
        prevProps.extrude !== extrude ||
        prevProps.extrusionHeightMultiplier !== extrusionHeightMultiplier;

      if (fillChanged) {
        this.updateLayerStyle("fill");
      }

      const strokeChanged =
        prevProps.strokeWidth !== strokeWidth ||
        prevProps.strokeColor !== strokeColor ||
        prevProps.strokeOpacity !== strokeOpacity;

      if (strokeChanged) {
        this.updateLayerStyle("line");
      }

      const labelsChanged =
        prevProps.showLabels !== showLabels ||
        prevProps.labelColor !== labelColor ||
        prevProps.labelHaloColor !== labelHaloColor;

      if (labelsChanged) {
        this.updateLayerStyle("symbol");
      }
    }
  }

  updateLayerStyle(type: LayerTypes) {
    const { map } = this.props;
    const layerId = this.buildLayerId(type);

    if (map.getLayer(layerId)) {
      const { layout, paint } = this.getLayerStyle(type) as any;

      if (layout) {
        Object.keys(layout).forEach((key) => {
          map.setLayoutProperty(layerId, key, layout[key]);
        });
      }
      if (paint) {
        Object.keys(paint).forEach((key) => {
          map.setPaintProperty(layerId, key, paint[key]);
        });
      }
    }
  }

  buildLayerId(type: string) {
    return `${this.id}-${type}`;
  }

  buildColorRamp() {
    const { polygons } = this.state;

    if (!polygons) return;

    const { colorScheme, buckets } = this.props;
    const clampedBuckets = clampBuckets(colorScheme!, buckets!);
    const colors = ColorBrewer[colorScheme!][clampedBuckets];
    const values = polygons.features.map(
      (feature) => feature.properties!.childCount
    );
    const breaks = equalIntervalBreaks(values, buckets! - 1);

    return (breaks as any).reduce(
      (values: [number], value: number, i: number) => {
        return [...values, value, colors[i]];
      },
      []
    );
  }

  createLayers() {
    const { map, type, sourceOptions, data, polygonSide, units } = this.props;

    if (!data) return;

    const features = data.features
      .map((feature) => ({
        ...feature,
        properties: {
          id: feature.properties?.id || uuid(),
          ...feature.properties
        }
      }))
      .filter((feature) => !!feature.geometry) as GeoJSON.Feature[];
    const fc = turfFeatureCollection(features);
    const bbox = turfBbox(fc);
    const polygons = getGridFunction(type!)(bbox, polygonSide, { units });

    turfCollect(polygons, fc, "id", "children");

    polygons.features = polygons.features.filter((feature: GeoJSON.Feature) => {
      const properties = feature.properties!;
      const childCount = properties.children.length;
      const hasChildren = childCount > 0;

      if (hasChildren) {
        properties.childCount = childCount;
        properties.expansionBounds = calculateExpansionBounds(feature);
      }

      return hasChildren;
    });

    map.addSource(this.id, {
      type: "geojson",
      ...sourceOptions,
      generateId: true,
      data: polygons
    });

    this.setState({ polygons }, () => {
      this.createLayer("fill");
      this.createLayer("line");
      this.createLayer("symbol");
    });
  }

  createLayer(type: LayerTypes, visible: boolean = true) {
    const { map, extrude, minZoom, maxZoom, before } = this.props;
    const layerId = this.buildLayerId(type);
    const style = this.getLayerStyle(type);

    map.addLayer(
      {
        id: layerId,
        source: this.id,
        type: type === "fill" && extrude ? "fill-extrusion" : type,
        ...(minZoom && { minzoom: minZoom }),
        ...(maxZoom && { maxzoom: maxZoom }),
        ...style
      },
      before
    );

    this.addMapEventHandlers(type);
  }

  getLayerStyle(type: LayerTypes): object {
    const {
      fillOpacity,
      strokeWidth,
      strokeColor,
      strokeOpacity,
      extrude,
      extrusionHeightMultiplier,
      labelColor,
      labelHaloColor,
      fillHoverColor,
      transition,
      showLabels
    } = this.props;

    switch (type) {
      case "fill": {
        const fillPrefix = extrude ? "fill-extrusion-" : "fill-";
        const colorRamp = this.buildColorRamp();

        return {
          paint: {
            [`${fillPrefix}color`]: [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              fillHoverColor,
              ["interpolate", ["linear"], ["get", "childCount"], ...colorRamp]
            ],
            [`${fillPrefix}color-transition`]: transition,
            [`${fillPrefix}opacity`]: fillOpacity,
            [`${fillPrefix}opacity-transition`]: transition,
            ...(extrude && {
              "fill-extrusion-height": [
                "*",
                ["get", "childCount"],
                extrusionHeightMultiplier
              ],
              "fill-extrusion-height-transition": transition
            })
          }
        };
      }
      case "line": {
        return {
          layout: {
            visibility: !extrude ? "visible" : "none"
          },
          paint: {
            "line-color": strokeColor,
            "line-color-transition": transition,
            "line-width": strokeWidth,
            "line-width-transition": transition,
            "line-opacity": strokeOpacity,
            "line-opacity-transition": transition
          }
        };
      }
      case "symbol": {
        return {
          layout: {
            "text-field": ["get", "childCount"],
            "text-font": ["Noto-Medium"],
            "text-size": {
              stops: [
                [0, 8],
                [10, 12],
                [13, 13],
                [14, 14],
                [15, 15]
              ]
            },
            visibility: !extrude && showLabels ? "visible" : "none"
          },
          paint: {
            "text-color": labelColor,
            "text-halo-color": labelHaloColor,
            "text-halo-width": {
              stops: [
                [0, 1],
                [16, 1.5],
                [17, 2]
              ]
            }
          }
        };
      }
      default:
        return {};
    }
  }

  removeLayers() {
    const { map, extrude, strokeWidth } = this.props;

    if (map.getSource(this.id)) {
      const { layers } = map.getStyle();

      if (layers) {
        layers
          .filter((layer) => layer.source === this.id)
          .forEach((layer) => map.removeLayer(layer.id));
      }

      map.removeSource(this.id);
    }

    this.removeMapEventHandlers("fill");
    if (!extrude && strokeWidth) {
      this.removeMapEventHandlers("line");
    }
  }

  addMapEventHandlers(type: string) {
    const { map } = this.props;
    const layerId = this.buildLayerId(type);
    const events = Object.keys(eventToHandler);
    events.forEach((event) => {
      map.on(event as any, layerId, this[eventToHandler[event]]);
    });
  }

  removeMapEventHandlers(type: string) {
    const { map } = this.props;
    const layerId = this.buildLayerId(type);
    const events = Object.keys(eventToHandler);
    events.forEach((event) => {
      map.off(event as any, layerId, this[eventToHandler[event]]);
    });
  }

  handleMapMouseMove = (event: tt.MapLayerMouseEvent) => {
    const { map, onMouseMove } = this.props;
    const { hoveredStateId } = this.state;

    if (event.features && event.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: this.id, id: hoveredStateId },
          { hover: false }
        );
      }

      const feature = event.features[0];

      decodeFeatureProperties(feature);

      const featureId = feature.id;
      map.setFeatureState({ source: this.id, id: featureId! }, { hover: true });

      this.setState({ hoveredStateId: featureId });

      onMouseMove && onMouseMove(feature, event);
    }
  };

  handleMapMouseEnter = (event: tt.MapLayerMouseEvent) => {
    const { onMouseEnter } = this.props;

    if (event.features && event.features.length > 0) {
      const feature = event.features[0];
      decodeFeatureProperties(feature);
      onMouseEnter && onMouseEnter(feature, event);
    }
  };

  handleMapMouseLeave = (event: tt.MapLayerMouseEvent) => {
    const { map, onMouseLeave } = this.props;
    const { hoveredStateId } = this.state;

    if (hoveredStateId) {
      map.setFeatureState(
        { source: this.id, id: hoveredStateId },
        { hover: false }
      );
    }
    this.setState({ hoveredStateId: undefined });

    onMouseLeave && onMouseLeave(event);
  };

  handleMapMouseDown = (event: tt.MapLayerMouseEvent) => {
    const { onMouseDown } = this.props;

    if (event.features) {
      const feature = event.features[0];
      decodeFeatureProperties(feature);
      onMouseDown && onMouseDown(feature, event);
    }
  };

  handleMapMouseUp = (event: tt.MapLayerMouseEvent) => {
    const { onMouseUp } = this.props;

    if (event.features) {
      const feature = event.features[0];
      decodeFeatureProperties(feature);
      onMouseUp && onMouseUp(feature, event);
    }
  };

  handleMapClick = (event: tt.MapLayerMouseEvent) => {
    const { onClick } = this.props;

    if (event.features) {
      const feature = event.features[0];
      decodeFeatureProperties(feature);
      onClick && onClick(feature, event);
    }
  };

  render() {
    return null;
  }
}

export default withMap(FeatureAggregation);
