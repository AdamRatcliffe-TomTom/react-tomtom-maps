export default interface IMapThemeOptions {
  layer: "basic" | "hybrid" | "labels";
  style: "main" | "night" | object;
  source: "vector" | "raster";
}
