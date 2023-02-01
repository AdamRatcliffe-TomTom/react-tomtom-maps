import React, { PureComponent } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import Overlay from "./Overlay";

interface Props {
  className: string;
  coordinates: tt.LngLatLike;
  closeButton?: boolean;  
  anchor?: string;
  offset?: tt.PointLike;
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
    maxWidth: "240px",    
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
        className={`mapboxgl-popup ${className}`}
        style={{ maxWidth }}
        {...otherProps}
      >
        <React.Fragment>
          <div className="mapboxgl-popup-tip" />
          <div className="mapboxgl-popup-content">
            {closeButton && (
              <button
                className="mapboxgl-popup-close-button"
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
