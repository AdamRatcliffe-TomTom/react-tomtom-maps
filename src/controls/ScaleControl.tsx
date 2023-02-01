import { PureComponent } from "react";
import tt, {
  ScaleControl as TTScaleControl
} from "@tomtom-international/web-sdk-maps";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

export type Units = "imperial" | "metric" | "nautical";

interface Props {
  map: tt.Map;
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

  private _control!: tt.Control;
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
      this._control = new TTScaleControl({
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
