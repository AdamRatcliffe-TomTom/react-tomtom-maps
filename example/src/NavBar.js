import React from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="NavBar">
      <NavLink to={`${process.env.PUBLIC_URL}/map-properties`}>
        Map properties
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/raster-map`}>Raster map</NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/switch-styles`}>
        Switch styles
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/multiple-maps`}>
        Multiple maps
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/wms-layer`}>WMS layer</NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/automated-location-change`}>
        Automated location change
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/pan-zoom-controls`}>
        Pan and zoom controls
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/minimap`}>Minimap</NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/map-events`}>Map events</NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/limit-map-interactions`}>
        Limit map interactions
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/block-map-interactions`}>
        Block map interactions
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/resize-map`}>Resize map</NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/my-location`}>
        My location
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/autocomplete-search`}>
        Search with autocomplete
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/vector-traffic-flow`}>
        Vector traffic flow
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/vector-traffic-incidents`}>
        Vector traffic incidents
      </NavLink>
      <NavLink to={`${process.env.PUBLIC_URL}/point-aggregation`}>
        Point aggregation
      </NavLink>
    </nav>
  );
};

export default NavBar;
