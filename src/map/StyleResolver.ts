import { isJSON } from "../utils";
import { DEFAULT_TOMTOM_STYLE } from "../defaults";

export type TomTomMapType = "genesis" | "orbis";
export type TomTomStyleVariant = string;

export interface TomTomStyleConfig {
  mapType: TomTomMapType;
  mapVariant: TomTomStyleVariant;
}

export interface TomTomStyleDescriptor {
  mapType?: TomTomMapType;
  map: string;
  trafficIncidents?: string;
  trafficFlow?: string;
  hillshade?: string;
  poi?: string;
}

/**
 * Resolves a map style to a full URL or style object
 * @param style - Either a shorthand like "genesis:2/basic_street-light", a full URL, a JSON string, or a style descriptor object
 * @param apiKey - API key for the map service
 * @returns The resolved style URL, JSON style object, or the original style if not a TomTom shorthand
 */
export function resolveStyle(
  style: string | maplibregl.Style | TomTomStyleDescriptor | undefined,
  apiKey: string
): string | maplibregl.Style {
  // If no style provided, use default
  if (!style) {
    return resolveStyle(DEFAULT_TOMTOM_STYLE, apiKey);
  }

  // If it's already a full URL, return as-is
  if (typeof style === "string" && style.startsWith("http")) {
    return style;
  }

  // If it's a string that looks like JSON, try to parse it
  if (typeof style === "string" && isJSON(style)) {
    try {
      const parsedStyle = JSON.parse(style);
      return parsedStyle;
    } catch (error) {
      // If parsing fails, treat it as a regular string
    }
  }

  // If it's a style descriptor object
  if (typeof style === "object" && style !== null && "map" in style) {
    return buildMergedTomTomStyleUrl(style as TomTomStyleDescriptor, apiKey);
  }

  // If it's already a maplibre style object, return as-is
  if (typeof style === "object" && style !== null && "version" in style) {
    return style;
  }

  // Check if it's a TomTom shorthand (format: "mapType:mapVariant")
  if (typeof style === "string") {
    const shorthandMatch = style.match(/^(genesis|orbis):(.+)$/);
    if (shorthandMatch) {
      const [, mapType, mapVariant] = shorthandMatch;
      return buildTomTomStyleUrl(mapType as TomTomMapType, mapVariant, apiKey);
    }
  }

  // Not a TomTom shorthand, return as-is
  return style;
}

/**
 * Builds a merged TomTom style URL with multiple components
 * @param descriptor - Style descriptor object with map, trafficIncidents, trafficFlow, and hillshade
 * @param apiKey - TomTom API key
 * @returns The complete merged style URL
 */
function buildMergedTomTomStyleUrl(
  descriptor: TomTomStyleDescriptor,
  apiKey: string
): string {
  const mapType = descriptor.mapType || "genesis";
  const params = new URLSearchParams();

  // Add map parameter (required)
  params.append("map", descriptor.map);

  // Add optional components with correct parameter names based on map type
  if (descriptor.trafficIncidents) {
    const paramName =
      mapType === "genesis" ? "traffic_incidents" : "trafficIncidents";
    params.append(paramName, descriptor.trafficIncidents);
  }
  if (descriptor.trafficFlow) {
    const paramName = mapType === "genesis" ? "traffic_flow" : "trafficFlow";
    params.append(paramName, descriptor.trafficFlow);
  }
  if (descriptor.hillshade) {
    const paramName = mapType === "genesis" ? "hillshade" : "hillshade";
    params.append(paramName, descriptor.hillshade);
  }
  if (descriptor.poi) {
    params.append("poi", descriptor.poi);
  }

  // Add API key
  params.append("key", apiKey);

  switch (mapType) {
    case "genesis":
      return `https://api.tomtom.com/style/1/style/*?${params.toString()}`;

    case "orbis":
      params.append("apiVersion", "1");
      return `https://api.tomtom.com/maps/orbis/assets/styles/*/style.json?${params.toString()}`;

    default:
      throw new Error(`Unsupported TomTom map type: ${mapType}`);
  }
}

/**
 * Builds a TomTom style URL based on map type and variant (legacy support)
 * @param mapType - Either 'genesis' or 'orbis'
 * @param mapVariant - The style variant (e.g., '2/basic_street-light')
 * @param apiKey - TomTom API key
 * @returns The complete style URL
 */
function buildTomTomStyleUrl(
  mapType: TomTomMapType,
  mapVariant: TomTomStyleVariant,
  apiKey: string
): string {
  switch (mapType) {
    case "genesis":
      return `https://api.tomtom.com/style/1/style/*?map=${mapVariant}&key=${apiKey}`;

    case "orbis":
      return `https://api.tomtom.com/maps/orbis/assets/styles/*/style.json?apiVersion=1&map=${mapVariant}&key=${apiKey}`;

    default:
      throw new Error(`Unsupported TomTom map type: ${mapType}`);
  }
}
