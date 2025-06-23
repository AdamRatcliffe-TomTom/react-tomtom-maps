import React, { Component, createRef } from "react";
import maplibregl from "maplibre-gl";
import { isEqual } from "lodash";
import IMapOptions from "./IMapOptions";
import { MapContext } from "./MapContext";
import { resolveStyle, TomTomStyleDescriptor } from "./StyleResolver";

import {
  Events,
  listenEvents,
  events,
  Listeners,
  updateEvents
} from "./MapEvents";

import "maplibre-gl/dist/maplibre-gl.css";

import { DEFAULT_ZOOM, DEFAULT_CENTER } from "../defaults";

interface Props {
  apiKey: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  mapStyle?: string | maplibregl.Style | TomTomStyleDescriptor;
  zoom?: number;
  center?: maplibregl.LngLatLike;
  bearing?: number;
  pitch?: number;
  bounds?: [[number, number], [number, number]];
  fitBoundsOptions?: Partial<maplibregl.FitBoundsOptions>;
  maxBounds?: maplibregl.LngLatBoundsLike;
  padding: number | maplibregl.PaddingOptions;
  attributionControl?: boolean;
  movingMethod?: "flyTo" | "easeTo" | "jumpTo";
  animationOptions?: Partial<maplibregl.AnimationOptions>;
  mapOptions?: Partial<IMapOptions>;
  customAttribution?: string | [string];
  attributionSeparator?: string;
  globe?: boolean;
  stylesVisibility?: {
    trafficFlow?: boolean;
    trafficIncidents?: boolean;
    hillshade?: boolean;
  };
  children?: any;
}

interface State {
  ready: boolean;
}

class Map extends Component<Props & Events, State> {
  static defaultProps: Partial<Props> = {
    className: "",
    containerStyle: {},
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    bearing: 0,
    pitch: 0,
    attributionControl: true,
    movingMethod: "flyTo",
    customAttribution: "",
    attributionSeparator: "|",
    globe: false,
    stylesVisibility: {
      trafficFlow: false,
      trafficIncidents: false,
      hillshade: true
    },
    mapOptions: {
      minZoom: 0,
      maxZoom: 20,
      interactive: true,
      hash: false,
      bearingSnap: 7,
      pitchWithRotate: true,
      clickTolerance: 3,
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false,
      refreshExpiredTiles: true,
      scrollZoom: true,
      boxZoom: true,
      dragRotate: true,
      dragPan: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      trackResize: true,
      renderWorldCopies: true,
      collectResourceTiming: false,
      fadeDuration: 300,
      crossSourceCollisions: true
    }
  };

  state: State = {
    ready: false
  };

  private _mapContainerRef = createRef<HTMLDivElement>();
  private _map!: maplibregl.Map;
  private listeners: Listeners = {};
  private _attributionControl: maplibregl.AttributionControl | null = null;

  /**
   * Creates attribution control with processed custom attributions
   */
  private createAttributionControl(
    customAttribution: string | [string] | undefined,
    attributionSeparator: string | undefined
  ): maplibregl.AttributionControl {
    const attributions = !Array.isArray(customAttribution)
      ? [customAttribution]
      : customAttribution;

    const filteredAttributions = attributions.filter(Boolean) as string[];
    const joinedAttributions =
      filteredAttributions.length > 0
        ? filteredAttributions.join(` ${attributionSeparator || "|"} `)
        : undefined;

    return new maplibregl.AttributionControl({
      compact: true,
      customAttribution: joinedAttributions
    });
  }

  /**
   * Sets the map projection and updates the container background accordingly
   */
  private setGlobe(isGlobe: boolean) {
    if (isGlobe) {
      this._map.setProjection({ type: "globe" });
      if (this._mapContainerRef.current) {
        this._mapContainerRef.current.style.backgroundColor = "#081832";
      }
    } else {
      this._map.setProjection({ type: "mercator" });
      if (this._mapContainerRef.current) {
        this._mapContainerRef.current.style.backgroundColor = "";
      }
    }
  }

  componentDidMount() {
    const {
      apiKey,
      mapStyle,
      zoom,
      center,
      bearing,
      pitch,
      bounds,
      fitBoundsOptions,
      maxBounds,
      padding,
      attributionControl,
      mapOptions,
      customAttribution,
      onStyleLoad,
      attributionSeparator,
      globe
    } = this.props;

    // Resolve the map style using the style resolver
    const resolvedStyle = resolveStyle(mapStyle, apiKey);

    this._map = new maplibregl.Map({
      container: this._mapContainerRef.current!,
      style: resolvedStyle,
      center: center as maplibregl.LngLatLike,
      zoom: zoom,
      bearing: bearing,
      pitch: pitch,
      ...(maxBounds && {
        maxBounds: maxBounds as maplibregl.LngLatBoundsLike
      }),
      ...(padding && {
        padding: padding as maplibregl.PaddingOptions
      }),
      ...(bounds && {
        bounds: bounds as maplibregl.LngLatBoundsLike
      }),
      ...(fitBoundsOptions && {
        fitBoundsOptions: fitBoundsOptions as maplibregl.FitBoundsOptions
      }),
      attributionControl: false,
      ...(mapOptions as any)
    });

    // Only add attribution control if attributionControl prop is true
    if (attributionControl) {
      this._attributionControl = this.createAttributionControl(
        customAttribution,
        attributionSeparator
      );
      this._map.addControl(this._attributionControl);
    }

    this._map.on("load", () => {
      this.setState({ ready: true });

      if (onStyleLoad) {
        onStyleLoad(this._map, {} as any);
      }
    });

    // Set projection on style load
    this._map.on("style.load", () => {
      if (globe) {
        this.setGlobe(true);
      }

      // Set initial styles visibility if provided
      if (this.props.stylesVisibility) {
        const { trafficFlow, trafficIncidents, hillshade } =
          this.props.stylesVisibility;

        if (trafficFlow !== undefined) {
          this.setLayerVisibilityForSource("vectorTilesFlow", trafficFlow);
        }

        if (trafficIncidents !== undefined) {
          this.setLayerVisibilityForSource(
            "vectorTilesIncidents",
            trafficIncidents
          );
        }

        if (hillshade !== undefined) {
          this.setLayerVisibilityForSource("hillshade", hillshade);
        }
      }
    });

    if (padding !== undefined) {
      this._map.setPadding(padding as maplibregl.PaddingOptions);
    }

    this.listeners = listenEvents(events, this.props, this._map);
  }

  componentWillUnmount() {
    if (this._map) {
      this._map.remove();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this._map) {
      this.listeners = updateEvents(this.listeners, this.props, this._map);
      this.updateMap(prevProps, this.props);
    }
  }

  updateMap(oldProps: Props, newProps: Props) {
    const zoom = this._map.getZoom();
    const center = this._map.getCenter();
    const bearing = this._map.getBearing();
    const pitch = this._map.getPitch();

    const zoomDidChange =
      oldProps.zoom !== newProps.zoom && newProps.zoom !== zoom;

    const centerDidChange =
      newProps.center &&
      newProps.center !== oldProps.center &&
      (maplibregl.LngLat.convert(newProps.center).lng !== center.lng ||
        maplibregl.LngLat.convert(newProps.center).lat !== center.lat);

    const bearingDidChange =
      oldProps.bearing !== newProps.bearing && newProps.bearing !== bearing;

    const pitchDidChange =
      oldProps.pitch !== newProps.pitch && newProps.pitch !== pitch;

    const mapStyleDidChange =
      newProps.mapStyle && !isEqual(newProps.mapStyle, oldProps.mapStyle);

    const projectionDidChange = oldProps.globe !== newProps.globe;

    if (
      newProps.containerStyle!.width !== oldProps.containerStyle!.width ||
      newProps.containerStyle!.height !== oldProps.containerStyle!.height
    ) {
      this._map.resize();
    }

    // Note: maplibre-gl doesn't have setLanguage or setGeopoliticalView methods
    // These would need to be implemented differently if needed

    if (newProps.maxBounds) {
      const maxBoundsDidChange = newProps.maxBounds !== oldProps.maxBounds;

      if (maxBoundsDidChange) {
        this._map.setMaxBounds(
          newProps.maxBounds as maplibregl.LngLatBoundsLike
        );
      }
    }

    if (newProps.padding && !isEqual(newProps.padding, oldProps.padding)) {
      this._map.setPadding(newProps.padding as maplibregl.PaddingOptions);
    }

    if (mapStyleDidChange) {
      const resolvedStyle = resolveStyle(newProps.mapStyle, newProps.apiKey);
      this._map.setStyle(resolvedStyle as string);
    }

    // Handle projection changes
    if (projectionDidChange) {
      this.setGlobe(newProps.globe || false);
    }

    // Handle attribution control changes
    if (
      oldProps.attributionControl !== newProps.attributionControl ||
      mapStyleDidChange
    ) {
      // Remove existing attribution control if it exists
      if (this._attributionControl) {
        this._map.removeControl(this._attributionControl);
        this._attributionControl = null;
      }

      // Add attribution control if enabled
      if (newProps.attributionControl) {
        this._attributionControl = this.createAttributionControl(
          newProps.customAttribution,
          newProps.attributionSeparator
        );
        this._map.addControl(this._attributionControl);
      }
    }

    if (newProps.bounds) {
      const didFitBoundsUpdate =
        oldProps.bounds !== newProps.bounds || // Check for reference equality
        newProps.bounds.length !==
          (oldProps.bounds && oldProps.bounds.length) || // Added element
        !!oldProps.bounds.filter((c, i) => {
          // Check for equality
          const nc = newProps.bounds && newProps.bounds[i];
          return c[0] !== (nc && nc[0]) || c[1] !== (nc && nc[1]);
        })[0];

      if (
        didFitBoundsUpdate ||
        !isEqual(oldProps.fitBoundsOptions, newProps.fitBoundsOptions)
      ) {
        const fitBoundsOptions: Partial<maplibregl.FitBoundsOptions> = {
          ...newProps.fitBoundsOptions
        };
        if (pitchDidChange) {
          fitBoundsOptions.pitch = newProps.pitch;
        }
        this._map.fitBounds(newProps.bounds, fitBoundsOptions);
        return;
      }
    }

    const viewPortDidChange =
      zoomDidChange || centerDidChange || bearingDidChange || pitchDidChange;

    if (viewPortDidChange) {
      const { movingMethod, zoom, center, bearing, pitch, animationOptions } =
        newProps;

      this._map[movingMethod!]({
        zoom,
        center,
        bearing,
        pitch,
        ...animationOptions
      });
    }

    // Handle styles visibility changes
    if (newProps.stylesVisibility) {
      const trafficFlow = newProps.stylesVisibility?.trafficFlow;
      const trafficFlowDidChange =
        trafficFlow !== oldProps.stylesVisibility?.trafficFlow;

      if (trafficFlowDidChange) {
        this.setLayerVisibilityForSource("vectorTilesFlow", trafficFlow);
      }

      const trafficIncidents = newProps.stylesVisibility?.trafficIncidents;
      const trafficIncidentsDidChange =
        trafficIncidents !== oldProps.stylesVisibility?.trafficIncidents;

      if (trafficIncidentsDidChange) {
        this.setLayerVisibilityForSource(
          "vectorTilesIncidents",
          trafficIncidents
        );
      }

      const hillshade = newProps.stylesVisibility?.hillshade;
      const hillshadeDidChange =
        hillshade !== oldProps.stylesVisibility?.hillshade;

      if (hillshadeDidChange) {
        this.setLayerVisibilityForSource("hillshade", hillshade);
      }
    }
  }

  /**
   * Sets the visibility of all layers for a given source
   * @param sourceId - The source ID to target
   * @param visible - Whether the layers should be visible
   */
  private setLayerVisibilityForSource(
    sourceId: string,
    visible: boolean | undefined
  ) {
    if (!this._map || !this._map.getStyle()) {
      return;
    }

    this._map.getStyle().layers.forEach((layer) => {
      if ("source" in layer && layer.source === sourceId) {
        if (this._map.getLayer(layer.id)) {
          this._map.setLayoutProperty(
            layer.id,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      }
    });
  }

  getMap() {
    return this._map;
  }

  isReady() {
    return this.state.ready;
  }

  render() {
    const { className, containerStyle, children } = this.props;
    const { ready } = this.state;

    return (
      <MapContext.Provider value={this._map as any}>
        <div
          ref={this._mapContainerRef}
          className={className}
          style={containerStyle}
        >
          {ready && children}
        </div>
      </MapContext.Provider>
    );
  }
}

export default Map;
