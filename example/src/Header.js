import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faCode } from "@fortawesome/free-solid-svg-icons";
import Views from "./Views";

import { version } from "../../package.json";

import "./Header.css";

const Header = ({ view, onViewChange }) => {
  const showMap = view === Views.MAP;

  return (
    <div className="Header">
      <div className="Header__version">{`Library Version ${version}`}</div>
      <div className="Header__view-controls">
        <button
          className={showMap ? "active" : ""}
          onClick={() => onViewChange(Views.MAP)}
        >
          <FontAwesomeIcon className="Header__icon" icon={faMap} />
          <span>Map</span>
        </button>
        <button
          className={!showMap ? "active" : ""}
          onClick={() => onViewChange(Views.CODE)}
        >
          <FontAwesomeIcon className="Header__icon" icon={faCode} />
          <span>Code</span>
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
  view: PropTypes.string,
  onViewChange: PropTypes.func
};

export default Header;
