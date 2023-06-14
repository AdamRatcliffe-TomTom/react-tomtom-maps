import React, { Component, createRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { isEqual } from "lodash";
import IMapThemeOptions from "./IMapThemeOptions";
import IMapOptions from "./IMapOptions";
import { MapContext } from "./MapContext";

import {
  Events,
  listenEvents,
  events,
  Listeners,
  updateEvents
} from "./MapEvents";

import "@tomtom-international/web-sdk-maps/dist/maps.css";

import { DEFAULT_ZOOM, DEFAULT_CENTER } from "../defaults";

interface Props {
  apiKey: string;
  className?: string;
  containerStyle?: React.CSSProperties;
  language?: string;
  geopoliticalView?: string;
  theme?: Partial<IMapThemeOptions>;
  mapStyle?: string | tt.Style;
  stylesVisibility?: tt.StylesVisibilityOptions;
  zoom?: number;
  center?: tt.LngLatLike;
  bearing?: number;
  pitch?: number;
  bounds?: [[number, number], [number, number]];
  fitBoundsOptions?: Partial<tt.FitBoundsOptions>;
  maxBounds?: tt.LngLatBoundsLike;
  movingMethod?: "flyTo" | "easeTo" | "jumpTo";
  animationOptions?: Partial<tt.AnimationOptions>;
  mapOptions?: Partial<IMapOptions>;
  customAttribution?: string | [string];
  attributionSeparator?: string;
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
    movingMethod: "flyTo",
    customAttribution: "",
    attributionSeparator: "|",
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
  private _map!: tt.Map;
  private listeners: Listeners = {};

  componentDidMount() {
    const {
      apiKey,
      language,
      geopoliticalView,
      theme,
      mapStyle,
      stylesVisibility,
      zoom,
      center,
      bearing,
      pitch,
      bounds,
      fitBoundsOptions,
      maxBounds,
      mapOptions,
      customAttribution,
      onStyleLoad
    } = this.props;

    this._map = tt.map({
      container: this._mapContainerRef.current,
      key: apiKey,
      language,
      geopoliticalView,
      ...(mapStyle && { style: mapStyle }),
      ...(theme && { theme }),
      stylesVisibility,
      zoom,
      center,
      bearing,
      pitch,
      bounds,
      fitBoundsOptions,
      maxBounds,
      ...mapOptions
    });

    this._map.on("load", (event: React.SyntheticEvent<any>) => {
      this.setState({ ready: true });

      if (onStyleLoad) {
        onStyleLoad(this._map, event);
      }
    });

    if (customAttribution!.length) {
      this._map.once("ATTRIBUTION_LOAD_END", this.addAttributions);
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

  addAttributions = (event: tt.MapEventType) => {
    const control = this._map.getAttributionControl();
    const { customAttribution, attributionSeparator } = this.props;
    const attributionsToAdd = !Array.isArray(customAttribution)
      ? [customAttribution]
      : customAttribution;

    control.removeAttribution(event.data);
    control.addAttribution(
      [event.data as unknown]
        .concat(attributionsToAdd)
        .join(` ${attributionSeparator} `)
    );
  };

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
      (tt.LngLat.convert(newProps.center).lng !== center.lng ||
        tt.LngLat.convert(newProps.center).lat !== center.lat);

    const bearingDidChange =
      oldProps.bearing !== newProps.bearing && newProps.bearing !== bearing;

    const pitchDidChange =
      oldProps.pitch !== newProps.pitch && newProps.pitch !== pitch;

    if (
      newProps.containerStyle!.width !== oldProps.containerStyle!.width ||
      newProps.containerStyle!.height !== oldProps.containerStyle!.height
    ) {
      this._map.resize();
    }

    if (newProps.language !== oldProps.language) {
      this._map.setLanguage(newProps.language!);
    }

    if (newProps.geopoliticalView !== oldProps.geopoliticalView) {
      this._map.setGeopoliticalView(newProps.geopoliticalView!);
    }

    if (newProps.maxBounds) {
      const maxBoundsDidChange = newProps.maxBounds !== oldProps.maxBounds;

      if (maxBoundsDidChange) {
        this._map.setMaxBounds(newProps.maxBounds);
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
        const fitBoundsOptions: Partial<tt.FitBoundsOptions> = {
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

    if (newProps.mapStyle && !isEqual(newProps.mapStyle, oldProps.mapStyle)) {
      this._map.setStyle(newProps.mapStyle);
    }
  }

  getMap() {
    return this._map;
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
