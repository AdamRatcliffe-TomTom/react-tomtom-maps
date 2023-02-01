import { Component } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import TTSearchBox from "@tomtom-international/web-sdk-plugin-searchbox";
import { services } from "@tomtom-international/web-sdk-services";
import isEqual from "react-fast-compare";
import { ControlPositions } from "./ControlPositions";
import { withMap } from "../map/MapContext";

import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";

export interface ISearchOptions {
  key: string;
  bestResult?: boolean;
  boundingBox?: [[number, number], [number, number]];
  center?: tt.LngLatLike;
  countrySet?: string;
  categorySet?: string;
  brandSet?: string;
  connectorSet?: string;
  extendedPostalCodesFor?: string;
  openingHours?: string;
  idxSet?: string;
  language?: string;
  limit?: number;
  maxFuzzyLevel?: number;
  minFuzzyLevel?: number;
  offset?: number;
  protocol?: "http" | "https";
  query?: string;
  radius?: number;
  typeahead?: boolean;
  view?: string;
}

export interface IAutocompleteOptions {
  key: string;
  limit?: number;
  center?: tt.LngLatLike;
  radius?: number;
  countrySet?: string;
  resultSet?: string;
}

export interface ILabelsOptions {
  placeholder?: string;
  suggestions?: { brand?: string; category?: string };
  noResultsMessage?: string;
}

export interface Events {
  onResultFocused?: Function;
  onResultsCleared?: Function;
  onResultSelected?: Function;
  onResultsFound?: Function;
}

interface Props {
  map: tt.Map;
  placeholder?: string;
  idleTimePress?: number;
  minNumberOfCharacters?: number;
  units?: "metric" | "imperial";
  searchOptions: Partial<ISearchOptions>;
  autocompleteOptions?: Partial<IAutocompleteOptions>;
  filterSearchResults?: (result: object) => boolean;
  noResultsMessage?: string;
  showSearchButton?: boolean;
  labels?: ILabelsOptions;
  position?: ControlPositions;
}

const noop = () => {};

class SearchBox extends Component<Props & Events> {
  static defaultProps: Partial<Props & Events> = {
    idleTimePress: 200,
    minNumberOfCharacters: 3,
    units: "metric",
    searchOptions: {},
    autocompleteOptions: {},
    noResultsMessage: "No results found",
    showSearchButton: true,
    position: "top-left",
    onResultFocused: noop,
    onResultsCleared: noop,
    onResultSelected: noop,
    onResultsFound: noop
  };

  private _control!: tt.IControl & tt.Evented;
  private _onMap: boolean = false;

  shouldComponentUpdate(nextProps: Props) {
    return !isEqual(nextProps, this.props);
  }

  componentDidMount() {
    const {
      map,
      placeholder,
      idleTimePress,
      minNumberOfCharacters,
      units,
      searchOptions,
      autocompleteOptions,
      filterSearchResults,
      noResultsMessage,
      showSearchButton,
      labels,
      position,
      onResultFocused,
      onResultsCleared,
      onResultSelected,
      onResultsFound
    } = this.props;

    if (map) {
      this._control = new TTSearchBox(services, {
        placeholder,
        idleTimePress,
        minNumberOfCharacters,
        units,
        searchOptions,
        autocompleteOptions,
        filterSearchResults,
        noResultsMessage,
        showSearchButton,
        labels,
        cssStyleCheck: false
      });

      this._control.on("tomtom.searchbox.resultfocused", onResultFocused!);
      this._control.on("tomtom.searchbox.resultscleared", onResultsCleared!);
      this._control.on("tomtom.searchbox.resultsfound", onResultsFound!);
      this._control.on("tomtom.searchbox.resultselected", onResultSelected!);

      map.addControl(this._control, position);

      map.on("remove", () => (this._onMap = false));

      this._onMap = true;
    }
  }

  componentDidUpdate() {
    const { map, position, searchOptions, ...otherProps } = this.props;
    (this._control as any).updateOptions({
      ...otherProps,
      searchOptions
    });
  }

  componentWillUnmount() {
    const {
      map,
      onResultFocused,
      onResultsCleared,
      onResultSelected,
      onResultsFound
    } = this.props;

    if (this._control) {
      this._control.off("tomtom.searchbox.resultfocused", onResultFocused);
      this._control.off("tomtom.searchbox.resultscleared", onResultsCleared);
      this._control.off("tomtom.searchbox.resultsfound", onResultsFound);
      this._control.off("tomtom.searchbox.resultselected", onResultSelected);
    }

    if (this._onMap) {
      map.removeControl(this._control);
    }
  }

  render() {
    return null;
  }
}

export default withMap(SearchBox);
