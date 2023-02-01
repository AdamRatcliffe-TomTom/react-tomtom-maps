import { PureComponent } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import TTZoomControls from "@tomtom-international/web-sdk-plugin-zoomcontrols";
import { withMap } from "../map/MapContext";
import { ControlPositions } from "./ControlPositions";

import "@tomtom-international/web-sdk-plugin-zoomcontrols/dist/ZoomControls.css";

interface Props {
  map: tt.Map;
  className?: string;
  animate?: boolean;
  position?: ControlPositions;
}

class ZoomControls extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    className: "",
    animate: true,
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
    const { map, className, animate, position } = this.props;

    if (map) {
      this._control = new TTZoomControls({
        className,
        animate,
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

export default withMap(ZoomControls);
