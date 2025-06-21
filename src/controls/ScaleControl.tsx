import { PureComponent } from "react";
import maplibregl from "maplibre-gl";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

export type Units = "imperial" | "metric" | "nautical";

interface Props {
  map: maplibregl.Map;
  maxWidth?: number;
  unit: Units;
  position?: ControlPositions;
}

class ScaleControl extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    maxWidth: 100,
    unit: "metric",
    position: "bottom-left"
  };

  private _control!: maplibregl.ScaleControl;
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
    const { map, maxWidth, unit, position } = this.props;

    if (map) {
      this._control = new maplibregl.ScaleControl({
        maxWidth,
        unit
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
    }
  }

  render() {
    return null;
  }
}

export default withMap(ScaleControl);
