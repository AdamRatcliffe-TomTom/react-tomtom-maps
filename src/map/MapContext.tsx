import React from "react";

export const MapContext = React.createContext(undefined);

export function withMap(Component: React.ComponentClass<any>) {
  return function MapComponent<T>(props: T) {
    return (
      <MapContext.Consumer>
        {map => <Component {...props} map={map} />}
      </MapContext.Consumer>
    );
  };
}
