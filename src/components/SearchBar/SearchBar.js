import "./SearchBar.css";
import { useState, useEffect, useRef } from "react";
import UserLocation from "../UserLocation/UserLocation";
import fetchData from "../../services/api";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const getAutoComplete = async () => {
      if (searchQuery.length > 2) {
        const data = await fetchData("search", searchQuery);
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    };

    if (searchQuery.length > 2) {
      getAutoComplete();
    }
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e) => {
    inputRef.current.focus();
    if (searchQuery !== "" && isInputFocused) {
      onClick("^" + searchQuery + ".*");
    } else if (suggestions.length && searchQuery === "") {
      setSearchQuery(suggestions[0].name);
    }
  };

  const handleSuggestionClick = (city) => {
    setSearchQuery(city);
    onClick("^" + city + ".*");
    setSuggestions([]);
  };

  return (
    <div className="search-wrapper">
      <form className="search-box">
        <input
          className="search-text"
          type="text"
          placeholder="Enter city"
          value={searchQuery}
          ref={inputRef}
          onChange={handleInputChange}
          onFocus={() => {
            setIsInputFocused(true);
            setIsInputOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
            setIsInputOpen(false);
          }}
        />
        <button
          type="button"
          className="search-btn"
          onClick={() => {
            handleFormSubmit();
            setIsInputOpen(!isInputOpen);
          }}
          aria-label="Search"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {/* Autocomplete suggestions dropdown */}
      {suggestions?.length > 0 && isInputFocused && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.name)}
            >
              {suggestion.name}, {suggestion.region}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}

      <UserLocation onClick={onClick} />
    </div>
  );
};

export default SearchBar;
