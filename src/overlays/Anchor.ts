import tt from "@tomtom-international/web-sdk-maps";

export const anchorTranslates = {
  center: "translate(-50%, -50%)",
  top: "translate(-50%, 0)",
  left: "translate(0, -50%)",
  right: "translate(-100%, -50%)",
  bottom: "translate(-50%, -100%)",
  "top-left": "translate(0, 0)",
  "top-right": "translate(-100%, 0)",
  "bottom-left": "translate(0, -100%)",
  "bottom-right": "translate(-100%, -100%)"
};

export function calculateAnchor(
  map: tt.Map,
  position: tt.LngLatLike,
  offset: tt.PointLike,
  element: HTMLElement
): string {
  const { offsetWidth: mapWidth, offsetHeight: mapHeight } = map.getContainer();
  const { x, y } = map.project(position);
  const { offsetWidth: elWidth, offsetHeight: elHeight } = element || {
    offsetWidth: 0,
    offsetHeight: 0
  };
  const halfWidth = elWidth / 2;
  const { x: offsetX, y: offsetY } = tt.Point.convert(offset);
  const anchors = [];

  if (y - (elHeight - offsetY) < 0) {
    anchors.push("top");
  } else if (y + (elHeight + offsetY) > mapHeight) {
    anchors.push("bottom");
  }

  if (x - (halfWidth - offsetX) < 0) {
    anchors.push("left");
  } else if (x + (halfWidth + offsetX) > mapWidth) {
    anchors.push("right");
  }

  return anchors.length ? anchors.join("-") : "bottom";
}
