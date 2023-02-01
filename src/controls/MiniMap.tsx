import { Component } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import TTMiniMap from "@tomtom-international/web-sdk-plugin-minimap";
import IMapOptions from "../map/IMapOptions";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

import "@tomtom-international/web-sdk-plugin-minimap/dist/Minimap.css";

interface IMiniMapOptions extends IMapOptions {
  key: string;
  style: string | tt.Style;
}

interface Props {
  map: tt.Map;
  mapOptions: IMiniMapOptions;
  zoomOffset?: number;
  ignorePitchAndBearing?: boolean;
  position?: ControlPositions;
}

class MiniMap extends Component<Props> {
  static defaultProps: Partial<Props> = {
    zoomOffset: 5,
    ignorePitchAndBearing: false,
    position: "bottom-right"
  };

  private _control!: tt.IControl;
  private _onMap: boolean = false;

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
      position,
      ...otherProps
    } = this.props;

    if (map) {
      this._control = new TTMiniMap({
        ttMapsSdk: tt,
        cssStyleCheck: false,
        ...otherProps
      });
      map.addControl(this._control, position);

      map.on("remove", () => (this._onMap = false));

      this._onMap = true;
    }
  }

  removeControl() {
    const { map } = this.props;

    if (this._onMap) {
      map.removeControl(this._control);
      this._onMap = false;
    }
  }

  render() {
    return null;
  }
}

export default withMap(MiniMap);
