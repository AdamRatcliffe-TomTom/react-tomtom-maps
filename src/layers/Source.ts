import { Component } from "react";
import tt, {
  GeoJSONSourceRaw,
  VectorSource,
  RasterSource,
  GeoJSONSource,
  Layer
} from "@tomtom-international/web-sdk-maps";
import { withMap } from "../map/MapContext";

export interface LayerWithBefore extends Layer {
  before?: string;
}

interface Props {
  id: string;
  geoJsonSource?: GeoJSONSourceRaw;
  tileJsonSource?: VectorSource | RasterSource;
  map: tt.Map;
  onSourceAdded: Function;
  onSourceLoaded: Function;
}

class Source extends Component<Props> {
  onData = () => {
    const { id, map, geoJsonSource, onSourceLoaded } = this.props;

    const source = map.getSource(id) as GeoJSONSource;
    if (!source || !map.isSourceLoaded(id)) {
      return;
    }

    if (source && onSourceLoaded) {
      onSourceLoaded(source);
    }

    if (source && geoJsonSource && geoJsonSource.data) {
      source.setData(geoJsonSource.data);
    }

    map.off("sourcedata", this.onData);
  };

  onStyleDataChange = () => {
    const { id, map } = this.props;
    if (!map.getLayer(id)) {
      this.initialize();
    }
  };

  componentDidMount() {
    const { map } = this.props;

    map.on("styledata", this.onStyleDataChange);

    this.initialize();
  }

  componentWillUnmount() {
    const { map } = this.props;

    if (!map || !map.getStyle()) {
      return;
    }

    map.off("styledata", this.onStyleDataChange);

    this.unbind();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { id, geoJsonSource, tileJsonSource, map } = this.props;

    if (tileJsonSource && nextProps.tileJsonSource) {
      const hasNewTilesSource =
        tileJsonSource.url !== nextProps.tileJsonSource.url ||
        tileJsonSource.tiles !== nextProps.tileJsonSource.tiles ||
        tileJsonSource.minzoom !== nextProps.tileJsonSource.minzoom ||
        tileJsonSource.maxzoom !== nextProps.tileJsonSource.maxzoom;

      if (hasNewTilesSource) {
        const layers = this.unbind();
        map.addSource(id, nextProps.tileJsonSource);
        layers.forEach((layer) => map.addLayer(layer, layer.before));
      }
    }

    if (
      geoJsonSource &&
      nextProps.geoJsonSource &&
      nextProps.geoJsonSource.cluster !== geoJsonSource.cluster
    ) {
      const layers = this.unbind();
      map.addSource(id, nextProps.geoJsonSource);
      layers.forEach((layer) => map.addLayer(layer, layer.before));
    } else if (
      geoJsonSource &&
      nextProps.geoJsonSource &&
      nextProps.geoJsonSource.data !== geoJsonSource.data &&
      nextProps.geoJsonSource.data &&
      map.getSource(id)
    ) {
      const source = map.getSource(id) as GeoJSONSource;
      source.setData(nextProps.geoJsonSource.data);
    }
  }

  initialize() {
    const {
      id,
      map,
      geoJsonSource,
      tileJsonSource,
      onSourceAdded
    } = this.props;

    if (!map.getSource(id) && (geoJsonSource || tileJsonSource)) {
      if (geoJsonSource) {
        map.addSource(id, geoJsonSource);
      } else if (tileJsonSource) {
        map.addSource(id, tileJsonSource);
      }

      map.on("sourcedata", this.onData);

      onSourceAdded && onSourceAdded(map.getSource(id));
    }
  }

  unbind(): LayerWithBefore[] {
    const { id, map } = this.props;
    if (map.getSource(id)) {
      let { layers = [] } = map.getStyle();

      layers = layers
        .map((layer, idx) => {
          const { id: before } = layers[idx + 1] || { id: undefined };
          return { ...layer, before };
        })
        .filter((layer) => layer.source === id);

      layers.forEach((layer) => map.removeLayer(layer.id));

      map.removeSource(id);

      return layers.reverse();
    }
    return [];
  }

  render() {
    return null;
  }
}

export default withMap(Source);
