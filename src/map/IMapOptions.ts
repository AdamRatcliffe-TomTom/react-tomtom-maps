export default interface IMapOptions {
  minZoom: number;
  maxZoom: number;
  interactive: boolean;
  hash: boolean;
  bearingSnap: number;
  pitchWithRotate: boolean;
  clickTolerance: number;
  failIfMajorPerformanceCaveat: boolean;
  preserveDrawingBuffer: boolean;
  refreshExpiredTiles: boolean;
  scrollZoom: boolean;
  boxZoom: boolean;
  dragRotate: boolean;
  dragPan: boolean;
  keyboard: boolean;
  doubleClickZoom: boolean;
  touchZoomRotate: boolean | object;
  trackResize: boolean;
  renderWorldCopies: boolean;
  maxTileCacheSize: number;
  localIdeographFontFamily: string;
  collectResourceTiming: boolean;
  fadeDuration: number;
  crossSourceCollisions: boolean;
}
