import { Component } from "react";
import maplibregl from "maplibre-gl";
import isEqual from "react-fast-compare";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

export interface PositionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface Events {
  onError?: (event: any) => void;
  onGeolocate?: (event: any) => void;
  onTrackUserLocationEnd?: (event: any) => void;
  onTrackUserLocationStart?: (event: any) => void;
}

interface Props {
  map: maplibregl.Map;
  positionOptions?: Partial<PositionOptions>;
  fitBoundsOptions?: Partial<maplibregl.FitBoundsOptions>;
  trackUserLocation?: boolean;
  showUserLocation?: boolean;
  position?: ControlPositions;
}

class GeolocateControl extends Component<Props & Events> {
  static defaultProps: Partial<Props & Events> = {
    showUserLocation: true,
    position: "top-right",
    fitBoundsOptions: {
      maxZoom: 15
    },
    onError: () => {},
    onGeolocate: () => {},
    onTrackUserLocationEnd: () => {},
    onTrackUserLocationStart: () => {}
  };

  private _control!: maplibregl.GeolocateControl;
  private _onMap: boolean = false;

  shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps, this.props);
  }

  componentDidMount() {
    this.addControl();
  }

  componentDidUpdate() {
    if (this._control) {
      this.removeControl();
      this.addControl();
    }
  }

  componentWillUnmount() {
    this.removeControl();
  }

  addControl() {
    const {
      map,
      positionOptions,
      fitBoundsOptions,
      trackUserLocation,
      showUserLocation,
      position,
      onError,
      onGeolocate,
      onTrackUserLocationEnd,
      onTrackUserLocationStart
    } = this.props;

    if (map) {
      this._control = new maplibregl.GeolocateControl({
        positionOptions,
        fitBoundsOptions,
        trackUserLocation,
        showUserLocation
      });

      this._control.on("error", onError as any);
      this._control.on("geolocate", onGeolocate as any);
      this._control.on("trackuserlocationend", onTrackUserLocationEnd as any);
      this._control.on(
        "trackuserlocationstart",
        onTrackUserLocationStart as any
      );

      map.addControl(this._control, position);

      map.on("remove", () => (this._onMap = false));

      this._onMap = true;
    }
  }

  removeControl() {
    const {
      map,
      onError,
      onGeolocate,
      onTrackUserLocationEnd,
      onTrackUserLocationStart
    } = this.props;

    if (this._control) {
      this._control.off("error", onError as any);
      this._control.off("geolocate", onGeolocate as any);
      this._control.off("trackuserlocationend", onTrackUserLocationEnd as any);
      this._control.off(
        "trackuserlocationstart",
        onTrackUserLocationStart as any
      );

      if (this._onMap) {
        map.removeControl(this._control);
      }
    }
  }

  render() {
    return null;
  }
}

export default withMap(GeolocateControl);
