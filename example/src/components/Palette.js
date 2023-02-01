import React from "react";
import PropTypes from "prop-types";

import "./Palette.css";

const Palette = ({ colors }) => {
  return (
    <div className="Palette">
      {colors.map(color => (
        <div
          key={color}
          className="Palette__swatch"
          style={{ background: color }}
        ></div>
      ))}
    </div>
  );
};

Palette.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  width: PropTypes.number,
  height: PropTypes.number
};

export default Palette;
