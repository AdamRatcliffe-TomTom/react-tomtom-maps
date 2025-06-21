import React, { PureComponent } from "react";
import maplibregl from "maplibre-gl";
import Overlay from "./Overlay";

interface Props {
  className: string;
  coordinates: maplibregl.LngLatLike;
  closeButton?: boolean;
  anchor?: string;
  offset?: maplibregl.PointLike;
  maxWidth?: string;
  children?: JSX.Element | JSX.Element[];
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}

class Popup extends PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    className: "",
    closeButton: true,
    maxWidth: "240px"
  };

  render() {
    const {
      className,
      closeButton,
      maxWidth,
      children,
      onClose,
      ...otherProps
    } = this.props;

    return (
      <Overlay
        type="popup"
        className={`maplibregl-popup ${className}`}
        style={{ maxWidth }}
        {...otherProps}
      >
        <React.Fragment>
          <div className="maplibregl-popup-tip" />
          <div className="maplibregl-popup-content">
            {closeButton && (
              <button
                className="maplibregl-popup-close-button"
                type="button"
                aria-label="Close popup"
                onClick={onClose}
              >
                ×
              </button>
            )}
            {children}
          </div>
        </React.Fragment>
      </Overlay>
    );
  }
}

export default Popup;
