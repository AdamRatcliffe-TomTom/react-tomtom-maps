import { Component } from "react";
import maplibregl from "maplibre-gl";
import uuid from "uuid/v4";
import { isEqual } from "lodash";
import LayerTypes from "./LayerTypes";
import { withMap } from "../map/MapContext";

const types: LayerTypes[] = [
  "fill",
  "fill-extrusion",
  "line",
  "circle",
  "symbol"
];

const toCamelCase = (str: string) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/[\s+]|-/g, "");

const eventToHandler = {
  mousemove: "OnMouseMove",
  mouseenter: "OnMouseEnter",
  mouseleave: "OnMouseLeave",
  mousedown: "OnMouseDown",
  mouseup: "OnMouseUp",
  click: "OnClick"
};

export interface LineProps {
  linePaint?: any;
  lineLayout?: any;
  lineOnMouseMove?: MouseEvent;
  lineOnMouseEnter?: MouseEvent;
  lineOnMouseLeave?: MouseEvent;
  lineOnMouseDown?: MouseEvent;
  lineOnMouseUp?: MouseEvent;
  lineOnClick?: MouseEvent;
}

export interface CircleProps {
  circlePaint?: any;
  circleLayout?: any;
  circleOnMouseMove?: MouseEvent;
  circleOnMouseEnter?: MouseEvent;
  circleOnMouseLeave?: MouseEvent;
  circleOnMouseDown?: MouseEvent;
  circleOnMouseUp?: MouseEvent;
  circleOnClick?: MouseEvent;
}

export interface SymbolProps {
  symbolLayout?: any;
  symbolPaint?: any;
  symbolOnMouseMove?: MouseEvent;
  symbolOnMouseEnter?: MouseEvent;
  symbolOnMouseLeave?: MouseEvent;
  symbolOnMouseDown?: MouseEvent;
  symbolOnMouseUp?: MouseEvent;
  symbolOnClick?: MouseEvent;
}

export interface FillProps {
  fillLayout?: any;
  fillPaint?: any;
  fillOnMouseMove?: MouseEvent;
  fillOnMouseEnter?: MouseEvent;
  fillOnMouseLeave?: MouseEvent;
  fillOnMouseDown?: MouseEvent;
  fillOnMouseUp?: MouseEvent;
  fillOnClick?: MouseEvent;
}

export interface FillExtrusionProps {
  fillExtrusionLayout?: any;
  fillExtrusionPaint?: any;
  fillExtrusionOnMouseMove?: MouseEvent;
  fillExtrusionOnMouseEnter?: MouseEvent;
  fillExtrusionOnMouseLeave?: MouseEvent;
  fillExtrusionOnMouseDown?: MouseEvent;
  fillExtrusionOnMouseUp?: MouseEvent;
  fillExtrusionOnClick?: MouseEvent;
}

interface Props
  extends LineProps,
    CircleProps,
    SymbolProps,
    FillProps,
    FillExtrusionProps {
  map: maplibregl.Map;
  data: GeoJSON.Feature | GeoJSON.FeatureCollection | string;
  id?: string;
  before?: string;
  sourceId?: string;
  sourceOptions?: any;
  layerOptions?: any;
  onInitialize?: Function;
}

type Paints = any;

type Layouts = any;

class GeoJSONLayer extends Component<Props> {
  private id = this.props.id || `geojson-${uuid()}`;

  componentDidMount() {
    const { map, onInitialize = () => {} } = this.props;

    this.initialize();

    onInitialize();

    map.on("styledata", this.onStyleDataChange);
  }

  componentDidUpdate(prevProps: Props) {
    const { sourceId, map, data, layerOptions, before } = prevProps;
    const source = map.getSource(
      sourceId || this.id
    ) as maplibregl.GeoJSONSource;

    // update data if needed
    if (this.props.data !== data) {
      source?.setData(this.props.data);
    }

    // update filters if needed
    const layerFilterChanged =
      (this.props.layerOptions &&
        layerOptions &&
        !isEqual(this.props.layerOptions.filter, layerOptions.filter)) ||
      !layerOptions;

    types.forEach((type) => {
      const layerId = this.buildLayerId(type);

      if (this.props.layerOptions && layerFilterChanged) {
        map.setFilter(layerId, this.props.layerOptions.filter || []);
      }

      // update paint properties if needed
      const paintProp = toCamelCase(type) + "Paint";
      const currentPaint = (this.props as any)[paintProp];
      const prevPaint = (prevProps as any)[paintProp];
      if (!isEqual(prevPaint, currentPaint)) {
        for (let key in currentPaint) {
          map.setPaintProperty(layerId, key, currentPaint[key]);
        }
      }

      // update layout properties if needed
      const layoutProp = toCamelCase(type) + "Layout";
      const currentLayout = (this.props as any)[layoutProp];
      const prevLayout = (prevProps as any)[layoutProp];
      if (!isEqual(prevLayout, currentLayout)) {
        for (let key in currentLayout) {
          map.setLayoutProperty(layerId, key, currentLayout[key]);
        }
      }

      // move layer if before prop has changed
      if (before !== this.props.before) {
        map.moveLayer(layerId, this.props.before);
      }
    }, this);
  }

  componentWillUnmount() {
    const { map } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off("styledata", this.onStyleDataChange);

    this.unbind();
  }

  initialize() {
    const { map, data, sourceId, sourceOptions } = this.props;

    if (!sourceId && !map.getSource(sourceId || this.id)) {
      map.addSource(this.id, {
        type: "geojson",
        data,
        ...sourceOptions
      });
    }

    types.forEach(this.createLayer, this);
  }

  unbind() {
    const { sourceId, map } = this.props;

    if (map.getSource(sourceId || this.id)) {
      types.forEach((type) => map.removeLayer(this.buildLayerId(type)), this);
      map.removeSource(this.id);
    }

    types.forEach((type) => {
      const events = Object.keys(eventToHandler) as Array<
        keyof typeof eventToHandler
      >;

      events.forEach((event) => {
        const prop = toCamelCase(type) + eventToHandler[event];
        const handler = (this.props as any)[prop];

        if (handler) {
          map.off(event as any, this.buildLayerId(type), handler);
        }
      });
    });
  }

  buildLayerId = (type: string) => {
    return `${this.id}-${type}`;
  };

  createLayer(type: LayerTypes) {
    const { before, map, sourceId, layerOptions } = this.props;
    const layerId = this.buildLayerId(type);
    const paint: Paints =
      (this.props as any)[`${toCamelCase(type)}Paint`] || {};
    const visibility = Object.keys(paint).length ? "visible" : "none";
    const layout: Layouts = (this.props as any)[
      `${toCamelCase(type)}Layout`
    ] || {
      visibility
    };

    map.addLayer(
      {
        id: layerId,
        source: sourceId || this.id,
        type,
        paint,
        layout,
        ...layerOptions
      },
      before
    );

    this.mapLayerMouseHandlers(type);
  }

  mapLayerMouseHandlers = (type: string) => {
    const { map } = this.props;

    const layerId = this.buildLayerId(type);

    const events = Object.keys(eventToHandler) as Array<
      keyof typeof eventToHandler
    >;

    events.forEach((event) => {
      const handler =
        (this.props as any)[`${toCamelCase(type)}${eventToHandler[event]}`] ||
        null;

      if (handler) {
        map.on(event as any, layerId, handler);
      }
    });
  };

  onStyleDataChange = () => {
    const { sourceId, map } = this.props;

    if (!map.getSource(sourceId || this.id)) {
      this.unbind();
      this.initialize();
    }
  };

  render() {
    return null;
  }
}

export default withMap(GeoJSONLayer);
