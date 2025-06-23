export const DEFAULT_ZOOM: number = 2;
export const DEFAULT_CENTER: [number, number] = [0, 20];

// Default TomTom style descriptor with all components
export const DEFAULT_TOMTOM_STYLE = {
  mapType: "genesis" as const,
  map: "2/basic_street-light",
  trafficIncidents: "2/incidents_light",
  trafficFlow: "2/flow_relative-light",
  hillshade: "2/hillshade_light",
  restrictions: "2/restrictions_light"
};
