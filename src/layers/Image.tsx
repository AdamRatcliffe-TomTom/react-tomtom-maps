import * as React from "react";
import { withMap } from "../map/MapContext";
import maplibregl from "maplibre-gl";

interface ImageOptionsType {
  pixelRatio?: number;
  sdf?: boolean;
}

type ImageDataType =
  | HTMLImageElement
  | ImageData
  | ImageBitmap
  | { width: number; height: number; data: Uint8Array | Uint8ClampedArray };

export interface Props {
  id: string;
  url?: string;
  data?: ImageDataType;
  options?: ImageOptionsType;
  onLoaded?: () => void;
  onError?: (error: Error) => void;
  map: maplibregl.Map;
}

class Image extends React.Component<Props> {
  public UNSAFE_componentWillMount() {
    this.loadImage(this.props);
  }

  public componentWillUnmount() {
    Image.removeImage(this.props);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { id } = this.props;

    if (nextProps.map !== this.props.map) {
      // Remove image from old map
      Image.removeImage(this.props);
    }

    if (nextProps.map && !nextProps.map.hasImage(id)) {
      // Add missing image to map
      this.loadImage(nextProps);
    }
  }

  public render() {
    return null;
  }

  private loadImage(props: Props) {
    const { map, id, url, data, options, onError } = props;

    if (data) {
      map.addImage(id, data as any, options);
      this.loaded();
    } else if (url) {
      map
        .loadImage(url)
        .then((image: any) => {
          map.addImage(id, image, options);
          this.loaded();
        })
        .catch((error: Error) => {
          if (onError) {
            onError(error);
          }
        });
    }
  }

  private static removeImage(props: Props) {
    const { id, map } = props;
    if (map && map.getStyle()) {
      map.removeImage(id);
    }
  }
  private loaded() {
    const { onLoaded } = this.props;
    if (onLoaded) {
      onLoaded();
    }
  }
}

export default withMap(Image);
