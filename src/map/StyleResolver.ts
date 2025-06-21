export type TomTomMapType = "genesis" | "orbis";
export type TomTomStyleVariant = string;

export interface TomTomStyleConfig {
  mapType: TomTomMapType;
  mapVariant: TomTomStyleVariant;
}

/**
 * Resolves a map style shorthand to a full URL
 * @param style - Either a shorthand like "genesis:2/basic_street-light" or a full URL/object
 * @param apiKey - API key for the map service
 * @returns The resolved style URL or the original style if not a shorthand
 */
export function resolveStyle(
  style: string | maplibregl.Style | undefined,
  apiKey: string
): string | maplibregl.Style {
  // If no style provided, use default
  if (!style) {
    return resolveStyle("genesis:2/basic_street-light", apiKey);
  }

  // If it's already a full URL or object, return as-is
  if (typeof style === "object" || style.startsWith("http")) {
    return style;
  }

  // Check if it's a TomTom shorthand (format: "mapType:mapVariant")
  const shorthandMatch = style.match(/^(genesis|orbis):(.+)$/);
  if (!shorthandMatch) {
    // Not a TomTom shorthand, return as-is
    return style;
  }

  const [, mapType, mapVariant] = shorthandMatch;
  return buildTomTomStyleUrl(mapType as TomTomMapType, mapVariant, apiKey);
}

/**
 * Builds a TomTom style URL based on map type and variant
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
