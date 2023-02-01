import { PureComponent } from "react";
import tt, {
  FullscreenControl as TTFullscreenControl
} from "@tomtom-international/web-sdk-maps";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

interface Props {
  map: tt.Map;
  container?: HTMLElement;
  position?: ControlPositions;
}

class FullScreenControl extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    position: "top-right"
  };

  private _control!: tt.Control;
  private _onMap: boolean = false;

  componentDidMount() {
    const { map, container, position } = this.props;
    if (map) {
      this._control = new TTFullscreenControl({
        container
      });
      map.addControl(this._control, position);

      map.on("remove", () => (this._onMap = false));

      this._onMap = true;
    }
  }

  componentWillUnmount() {
    const { map } = this.props;
    
    if (this._onMap) {
      map.removeControl(this._control);
    }
  }

  render() {
    return null;
  }
}

export default withMap(FullScreenControl);
