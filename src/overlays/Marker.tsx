import React, { PureComponent } from "react";
import maplibregl from "maplibre-gl";
import Overlay, { OverlayDragEventHandler } from "./Overlay";
import Icon from "./Icon";

interface Props {
  className?: string;
  style?: React.CSSProperties;
  coordinates: maplibregl.LngLatLike;
  anchor?: string;
  offset?: maplibregl.PointLike;
  color?: string;
  width?: number;
  height?: number;
  children?: JSX.Element;
  draggable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onDragStart?: OverlayDragEventHandler;
  onDrag?: OverlayDragEventHandler;
  onDragEnd?: OverlayDragEventHandler;
}

class Marker extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    className: "",
    anchor: "bottom",
    draggable: false
  };

  render() {
    const { className, anchor, color, width, height, children, ...otherProps } =
      this.props;

    return (
      <Overlay
        type="marker"
        className={`maplibregl-marker ${className}`}
        anchor={anchor}
        {...otherProps}
      >
        {children || <Icon color={color} width={width} height={height} />}
      </Overlay>
    );
  }
}

export default Marker;
