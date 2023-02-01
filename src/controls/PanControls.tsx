import { PureComponent } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import TTPanControls from "@tomtom-international/web-sdk-plugin-pancontrols";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

import "@tomtom-international/web-sdk-plugin-pancontrols/dist/PanControls.css";

interface Props {
  map: tt.Map;
  className?: string;
  panOffset?: number;
  position?: ControlPositions;
}

class PanControls extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    className: "",
    panOffset: 100,
    position: "top-left"
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
    const { map, className, panOffset, position } = this.props;

    if (map) {
      this._control = new TTPanControls({
        className,
        panOffset,
        cssStyleCheck: false
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

export default withMap(PanControls);
