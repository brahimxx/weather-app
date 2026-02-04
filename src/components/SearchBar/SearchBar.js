import "./SearchBar.css";
import { useState, useEffect, useRef } from "react";
import UserLocation from "../UserLocation/UserLocation";
import fetchData from "../../services/api";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // Track if input is focused
  const inputRef = useRef(null);

  useEffect(() => {
    const getAutoComplete = async () => {
      if (searchQuery.length > 2) {
        const data = await fetchData("search", searchQuery);
        setSuggestions(data);
      } else {
        setSuggestions([]); // Clear suggestions if the query is too short
      }
    };

    if (searchQuery.length > 2) {
      getAutoComplete();
    }
  }, [searchQuery]); // This effect will run whenever searchQuery changes

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update the input state with the current value
  };

  const handleFormSubmit = (e) => {
    inputRef.current.focus(); // Focus on the input element
    console.log("^" + searchQuery + ".*");
    if (searchQuery !== "" && isInputFocused) {
      onClick("^" + searchQuery + ".*");
    } else if (suggestions.length && searchQuery === "") {
      setSearchQuery(suggestions[0].name);
    }
  };

  const handleSuggestionClick = (city) => {
    console.log("clicked");
    setSearchQuery(city); // Set the search query to the clicked suggestion
    onClick("^" + city + ".*"); // Trigger the search for the selected city
    setSuggestions([]); // Clear the autocomplete suggestions after selecting
  };

  return (
    <>
      <form className={`search-box`}>
        <input
          className={`search-text`}
          type="text"
          placeholder="Enter city"
          value={searchQuery}
          ref={inputRef}
          onChange={handleInputChange} // Handle user typing
          onFocus={() => {
            setIsInputFocused(true);
            setIsInputOpen(true);
          }} // Set input as focused
          onBlur={() => {
            setTimeout(() => setIsInputFocused(false), 200);
            setIsInputOpen(false);
          }} // Set input as blurred with slight delay to allow click on suggestions
        />
        <button
          type="button"
          className="search-btn"
          onClick={() => {
            handleFormSubmit();
            setIsInputOpen(!isInputOpen);
          }}
        >
          <i className="fas fa-search"></i> {/* Font Awesome icon for search */}
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
    </>
  );
};

export default SearchBar;
