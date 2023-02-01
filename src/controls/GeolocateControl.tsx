import { Component } from "react";
import tt, {
  GeolocateControl as TTGeolocateControl
} from "@tomtom-international/web-sdk-maps";
import isEqual from "react-fast-compare";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

export interface PositionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export interface Events {
  onError?: Function;
  onGeolocate?: Function;
  onTrackUserLocationEnd?: Function;
  onTrackUserLocationStart?: Function;
}

interface Props {
  map: tt.Map;
  positionOptions?: Partial<PositionOptions>;
  fitBoundsOptions?: Partial<tt.FitBoundsOptions>;
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

  private _control!: tt.Control;
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
      this._control = new TTGeolocateControl({
        positionOptions,
        fitBoundsOptions,
        trackUserLocation,
        showUserLocation
      });

      this._control.on("error", onError!);
      this._control.on("geolocate", onGeolocate!);
      this._control.on("trackuserlocationend", onTrackUserLocationEnd!);
      this._control.on("trackuserlocationstart", onTrackUserLocationStart!);

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
      this._control.off("error", onError!);
      this._control.off("geolocate", onGeolocate!);
      this._control.off("trackuserlocationend", onTrackUserLocationEnd!);
      this._control.off("trackuserlocationstart", onTrackUserLocationStart!);

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
