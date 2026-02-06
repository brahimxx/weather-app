import { useState, useEffect, useRef } from "react";
import fetchData from "../services/api";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const getAutoComplete = async () => {
      if (searchQuery.length > 2) {
        try {
          const data = await fetchData("search", searchQuery);
          if (Array.isArray(data)) {
            setSuggestions(data);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    if (searchQuery.length > 2) {
      getAutoComplete();
    } else {
      setSuggestions([]);
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
    <div className="flex items-center gap-2 relative">
      <form
        className="flex items-center h-12 rounded-[50px] p-1.5 z-[2] transition-all duration-500 ease-in-out md:hover:shadow-md md:focus-within:shadow-md"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <input
          className="border-none bg-transparent outline-none p-0 text-text-primary text-[15px] font-medium transition-all duration-500 ease-in-out h-full w-0 focus:w-[200px] focus:px-2 md:hover:w-[220px] placeholder:text-text-secondary/50 max-[480px]:text-sm"
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
          className="flex justify-center items-center w-9 h-9 min-w-[36px] rounded-full border-none cursor-pointer transition-all duration-300 text-sm p-0 hover:scale-[1.02] focus:outline-2 focus:outline-accent-start focus:outline-offset-2"
          style={{
            background: "var(--bg-selected)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-selected)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onClick={() => {
            handleFormSubmit();
            setIsInputOpen(!isInputOpen);
          }}
          aria-label="Search"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>

      {suggestions?.length > 0 && isInputFocused && (
        <ul
          className="list-none p-0 m-0 absolute top-[52px] left-0 max-h-60 w-[280px] py-2 overflow-y-auto z-10 md:w-[300px] max-[480px]:w-[220px]"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "0 0 20px 20px",
            boxShadow: "var(--shadow-lg)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="py-2 px-4 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis rounded-xl mx-1 transition-all duration-200 font-medium text-sm hover:bg-gradient-to-br hover:from-accent-start hover:to-accent-end hover:text-white hover:translate-x-1"
            >
              {suggestion.name}, {suggestion.region}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
