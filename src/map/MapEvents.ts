import maplibregl from "maplibre-gl";

export type MapEventHandler = (
  map: maplibregl.Map,
  evt: React.SyntheticEvent<any>
) => void;

export interface Events {
  onStyleLoad?: MapEventHandler;
  onResize?: MapEventHandler;
  onDblClick?: MapEventHandler;
  onClick?: MapEventHandler;
  onMouseMove?: MapEventHandler;
  onMouseOut?: MapEventHandler;
  onMoveStart?: MapEventHandler;
  onMove?: MapEventHandler;
  onMoveEnd?: MapEventHandler;
  onMouseDown?: MapEventHandler;
  onMouseUp?: MapEventHandler;
  onDragStart?: MapEventHandler;
  onDragEnd?: MapEventHandler;
  onDrag?: MapEventHandler;
  onZoomStart?: MapEventHandler;
  onZoom?: MapEventHandler;
  onZoomEnd?: MapEventHandler;
  onPitch?: MapEventHandler;
  onPitchStart?: MapEventHandler;
  onPitchEnd?: MapEventHandler;
  onWebGlContextLost?: MapEventHandler;
  onWebGlContextRestored?: MapEventHandler;
  onRemove?: MapEventHandler;
  onContextMenu?: MapEventHandler;
  onLoad?: MapEventHandler;
  onRender?: MapEventHandler;
  onError?: MapEventHandler;
  onSourceData?: MapEventHandler;
  onDataLoading?: MapEventHandler;
  onStyleDataLoading?: MapEventHandler;
  onStyleImageMissing?: MapEventHandler;
  onTouchCancel?: MapEventHandler;
  onData?: MapEventHandler;
  onSourceDataLoading?: MapEventHandler;
  onTouchMove?: MapEventHandler;
  onTouchEnd?: MapEventHandler;
  onTouchStart?: MapEventHandler;
  onStyleData?: MapEventHandler;
  onBoxZoomStart?: MapEventHandler;
  onBoxZoomEnd?: MapEventHandler;
  onBoxZoomCancel?: MapEventHandler;
  onRotateStart?: MapEventHandler;
  onRotate?: MapEventHandler;
  onRotateEnd?: MapEventHandler;
  onAttributionLoadEnd?: MapEventHandler;
}

export type EventMapping = { [T in keyof Events]: string };

export const events: EventMapping = {
  onResize: "resize",
  onDblClick: "dblclick",
  onClick: "click",
  onMouseMove: "mousemove",
  onMouseOut: "mouseout",
  onMoveStart: "movestart",
  onMove: "move",
  onMoveEnd: "moveend",
  onMouseUp: "mouseup",
  onMouseDown: "mousedown",
  onDragStart: "dragstart",
  onDrag: "drag",
  onDragEnd: "dragend",
  onZoomStart: "zoomstart",
  onZoom: "zoom",
  onZoomEnd: "zoomend",
  onPitch: "pitch",
  onPitchStart: "pitchstart",
  onPitchEnd: "pitchend",
  onWebGlContextLost: "webglcontextlost",
  onWebGlContextRestored: "webglcontextrestored",
  onRemove: "remove",
  onContextMenu: "contextmenu",
  onLoad: "load",
  onRender: "render",
  onError: "error",
  onSourceData: "sourcedata",
  onDataLoading: "dataloading",
  onStyleDataLoading: "styledataloading",
  onStyleImageMissing: "styleimagemissing",
  onTouchCancel: "touchcancel",
  onData: "data",
  onSourceDataLoading: "sourcedataloading",
  onTouchMove: "touchmove",
  onTouchEnd: "touchend",
  onTouchStart: "touchstart",
  onStyleData: "styledata",
  onBoxZoomStart: "boxzoomstart",
  onBoxZoomEnd: "boxzoomend",
  onBoxZoomCancel: "boxzoomcancel",
  onRotateStart: "rotatestart",
  onRotate: "rotate",
  onRotateEnd: "rotateend",
  onAttributionLoadEnd: "ATTRIBUTION_LOAD_END"
};

export type Listeners = {
  [T in keyof Events]: (evt: React.SyntheticEvent<any>) => void;
};

export const listenEvents = (
  partialEvents: EventMapping,
  props: Partial<Events>,
  map: maplibregl.Map
) =>
  Object.keys(partialEvents).reduce((listeners, event) => {
    const propEvent = (props as any)[event];

    if (propEvent) {
      const listener = (evt: React.SyntheticEvent<any>) => {
        propEvent(map, evt);
      };

      map.on((partialEvents as any)[event], listener);

      (listeners as any)[event] = listener;
    }

    return listeners;
  }, {} as Listeners);

export const updateEvents = (
  listeners: Listeners,
  nextProps: Partial<Events>,
  map: any
) => {
  const toListenOff = Object.keys(events).filter(
    (eventKey) =>
      (listeners as any)[eventKey] &&
      typeof (nextProps as any)[eventKey] !== "function"
  );

  toListenOff.forEach((key) => {
    map.off((events as any)[key], (listeners as any)[key]);
    delete (listeners as any)[key];
  });

  const toListenOn = Object.keys(events)
    .filter(
      (key) =>
        !(listeners as any)[key] &&
        typeof (nextProps as any)[key] === "function"
    )
    .reduce(
      (acc, next) => (((acc as any)[next] = (events as any)[next]), acc),
      {} as EventMapping
    );

  const newListeners = listenEvents(toListenOn, nextProps, map);

  return { ...listeners, ...newListeners };
};
