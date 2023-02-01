export default {
  control: (base, state) => {
    return {
      ...base,
      marginTop: 12,
      minWidth: 200,
      boxShadow: "none",
      transition: "0.2s",
      borderColor: state.isFocused ? "#8dc3eb !important" : "#cccccc !important"
    };
  },
  singleValue: (base, state) => {
    return {
      ...base,
      width: "100%"
    };
  },
  menu: (base, style) => {
    return {
      ...base,
      zIndex: 1000
    };
  },
  option: (base, state) => {
    return {
      ...base,
      color: "#333333",
      backgroundColor: state.isSelected
        ? "#ffffff !important"
        : state.isFocused
        ? "#edf2f7 !important"
        : "#ffffff"
    };
  }
};
