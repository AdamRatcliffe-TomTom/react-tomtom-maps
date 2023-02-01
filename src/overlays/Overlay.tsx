import React, { Component } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import { withMap } from "../map/MapContext";
import { calculateAnchor, anchorTranslates } from "./Anchor";

export type OverlayDragEventHandler = (event: {
  lngLat: tt.LngLat;
  point: tt.Point;
}) => void;

type AlignmentType = "map" | "viewport" | "auto";

interface Props {
  map: tt.Map;
  type?: string;
  className: string;
  coordinates: tt.LngLatLike;
  anchor?: string;
  offset?: tt.PointLike;
  rotation?: number;
  pitchAlignment?: AlignmentType;
  rotationAlignment?: AlignmentType;
  style?: React.CSSProperties;
  children?: JSX.Element;
  draggable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onDragStart?: OverlayDragEventHandler;
  onDrag?: OverlayDragEventHandler;
  onDragEnd?: OverlayDragEventHandler;
}

interface DefaultProps {
  className: string;
  offset: tt.PointLike;
  rotation: number;
  rotationAlignment: string;
  pitchAlignment: string;
  draggable: boolean;
}

type PropsWithDefaults = Props & DefaultProps;

interface State {
  position: tt.Point | undefined;
  anchor: string | undefined;
}

function moveTranslate(point: tt.Point): string {
  const { x, y } = point;
  return `translate(${x.toFixed(0)}px,${y.toFixed(0)}px)`;
}

function rotationTransform(
  map: tt.Map,
  rotation: number,
  rotationAlignment: AlignmentType
) {
  if (rotationAlignment === "viewport" || rotationAlignment === "auto") {
    return `rotateZ(${rotation}deg)`;
  } else if (rotationAlignment === "map") {
    const bearing = map.getBearing();
    const overlayRotation = rotation - bearing;
    return `rotateZ(${overlayRotation}deg)`;
  }
}

function pitchTransform(map: tt.Map, pitchAlignment: AlignmentType) {
  if (pitchAlignment === "viewport" || pitchAlignment === "auto") {
    return "rotateX(0deg)";
  } else if (pitchAlignment === "map") {
    const pitch = map.getPitch();
    return `rotateX(${pitch}deg)`;
  }
}

function getAnchorClassName(type?: string, anchor?: string): string {
  switch (type) {
    case "marker":
      return anchor ? `mapboxgl-marker-anchor-${anchor}` : "";
    case "popup":
      return anchor ? `mapboxgl-popup-anchor-${anchor}` : "";
    default:
      return "";
  }
}

class Overlay extends Component<Props, State> {
  static defaultProps: DefaultProps = {
    className: "",
    offset: new tt.Point(0, 0),
    rotation: 0,
    rotationAlignment: "auto",
    pitchAlignment: "auto",
    draggable: false
  };

  state: State = {
    position: undefined,
    anchor: this.props.anchor
  };

  private _container = React.createRef<HTMLDivElement>();
  private _initialScreenCoordinates: tt.Point | undefined;

  componentDidMount() {
    const { map, coordinates, offset, draggable } = this.props;
    const position = this.getPosition();
    const anchor =
      this.props.anchor ||
      calculateAnchor(map, coordinates, offset!, this._container.current!);

    map.on("move", this.handleMapMove);

    this.setDraggable(!!draggable);

    this.setState({ position, anchor });
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.off("move", this.handleMapMove);
  }

  componentDidUpdate(prevProps: Props) {
    const { map, coordinates, offset, draggable } = this
      .props as PropsWithDefaults;

    if (prevProps.coordinates !== coordinates) {
      const position = this.getPosition();
      const anchor =
        this.props.anchor ||
        calculateAnchor(map, coordinates, offset!, this._container.current!);

      this.setState({ position, anchor });
    }

    if (prevProps.draggable !== draggable) {
      this.setDraggable(!!draggable);
    }
  }

  getPosition(): tt.Point {
    const { map, offset, coordinates } = this.props as PropsWithDefaults;
    const normalizedOffset = tt.Point.convert(offset);

    let { x, y } = map.project(coordinates!);
    x += normalizedOffset.x;
    y += normalizedOffset.y;

    return new tt.Point(x, y);
  }

  calculatePositionFromScreenCoords(coords: tt.Point) {
    const { map, coordinates, offset } = this.props as PropsWithDefaults;
    const delta = coords.sub(this._initialScreenCoordinates!);
    const normalizedOffset = tt.Point.convert(offset);

    return map
      .project(coordinates)
      .add(delta)
      .add(normalizedOffset);
  }

  setDraggable(draggable: boolean) {
    const containerEl = this._container.current!;

    if (draggable) {
      containerEl.addEventListener("mousedown", this.addDragHandler);
    } else {
      containerEl.removeEventListener("mousedown", this.addDragHandler);
    }
  }

  addDragHandler = (event: MouseEvent) => {
    const { screenX, screenY } = event;
    this._initialScreenCoordinates = new tt.Point(screenX, screenY);

    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.handleDragEnd);

    if (this.props.onDragStart) {
      const point = this.state.position!;
      const lngLat = this.props.map.unproject(point);
      this.props.onDragStart({ lngLat, point });
    }
  };

  handleDrag = (event: MouseEvent) => {
    this._container.current!.style.pointerEvents = "none";

    const { screenX, screenY } = event;
    const coords = new tt.Point(screenX, screenY);
    const position = this.calculatePositionFromScreenCoords(coords);

    this.setState({ position }, () => {
      this.props.onDrag &&
        this.props.onDrag({
          lngLat: this.props.map.unproject(position),
          point: position
        });
    });
  };

  handleDragEnd = (event: MouseEvent) => {
    this._container.current!.style.pointerEvents = "auto";

    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleDragEnd);

    if (this.props.onDragEnd) {
      const { screenX, screenY } = event;
      const coords = new tt.Point(screenX, screenY);
      const position = this.calculatePositionFromScreenCoords(coords);

      this.props.onDragEnd({
        lngLat: this.props.map.unproject(position),
        point: position
      });
    }
  };

  handleMapMove = () => {
    const { map, coordinates, offset } = this.props;
    const position = this.getPosition();
    const anchor =
      this.props.anchor ||
      calculateAnchor(map, coordinates, offset!, this._container.current!);

    this.setState({ position, anchor });
  };

  render() {
    const { map, rotation, rotationAlignment, pitchAlignment } = this
      .props as PropsWithDefaults;
    const { position } = this.state;
    const {
      type,
      className,
      style,
      children,
      onClick,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    const { anchor } = this.state;

    const mergedStyles = {
      ...style,
      userSelect: "none"
    } as React.CSSProperties;

    if (position) {
      mergedStyles.transform = `${moveTranslate(position)} ${
        (anchorTranslates as any)[anchor!]
      } ${pitchTransform(map, pitchAlignment)} ${rotationTransform(
        map,
        rotation,
        rotationAlignment
      )} ${mergedStyles.transform ? " " + mergedStyles.transform : ""}`;
    }

    const anchorClassName = getAnchorClassName(type, anchor);

    return (
      <div
        ref={this._container}
        className={`${className} ${anchorClassName}`}
        style={mergedStyles}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    );
  }
}

export default withMap(Overlay);
