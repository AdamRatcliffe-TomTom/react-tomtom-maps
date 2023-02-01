import React, { useEffect } from "react";
import tt from "@tomtom-international/web-sdk-maps";

interface Props {
  name: string;
  version: string;
}

const ProductInfo: React.SFC<Props> = ({ name, version }) => {
  useEffect(() => {
    tt.setProductInfo(name, version);
  }, []);

  return null;
};

export default ProductInfo;
