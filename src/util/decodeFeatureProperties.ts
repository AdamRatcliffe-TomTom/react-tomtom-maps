// See https://github.com/mapbox/mapbox-gl-js/issues/2434

function decodeFeatureProperties(feature: GeoJSON.Feature) {
  const properties = feature.properties!;
  Object.keys(properties).forEach(key => {
    properties[key] = JSON.parse(properties[key]);
  });
}

export default decodeFeatureProperties;
