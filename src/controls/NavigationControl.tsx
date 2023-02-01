import { PureComponent } from "react";
import tt, {
  NavigationControl as TTNavigationControl
} from "@tomtom-international/web-sdk-maps";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

interface Props {
  map: tt.Map;
  showCompass?: boolean;
  showZoom?: boolean;
  showExtendedRotationControls?: boolean;
  showPitch?: boolean;
  showExtendedPitchControls?: boolean;
  rotationStep?: number;
  pitchStep?: number;
  position?: ControlPositions;
}

class NavigationControl extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    showCompass: true,
    showZoom: true,
    showExtendedRotationControls: false,
    showPitch: false,
    showExtendedPitchControls: false,
    rotationStep: 10,
    pitchStep: 10,
    position: "top-right"
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
    const { map, position, ...otherProps } = this.props;

    if (map) {
      this._control = new TTNavigationControl({
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
    }
  }

  render() {
    return null;
  }
}

export default withMap(NavigationControl);
