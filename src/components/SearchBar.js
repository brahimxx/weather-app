import { useState, useEffect, useRef } from "react";
import fetchData from "../services/api";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
    if (e) e.preventDefault();
    if (searchQuery.trim() !== "") {
      onClick(searchQuery.trim());
      setSearchQuery("");
      setSuggestions([]);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // WeatherAPI recommends using 'id' for accurate lookup
    // Format: "id:<location_id>"
    const searchParam = suggestion.id ? `id:${suggestion.id}` : suggestion.name;
    onClick(searchParam);
    setSearchQuery("");
    setSuggestions([]);
    setIsInputFocused(false);
  };

  const isExpanded = suggestions?.length > 0 && isInputFocused;

  return (
    <div className="relative z-50 ">
      {/* Background Shell for Expanded State */}
      {isExpanded && (
        <div
          className="absolute top-0 left-0 w-full flex flex-col overflow-hidden rounded-[28px] animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-md)",
            zIndex: 10,
          }}
        >
          {/* Spacer for Input Area */}
          <div className="h-12 w-full shrink-0 border-b border-white/10" />

          {/* Suggestions List */}
          <ul className="list-none p-0 m-0 w-full py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="py-3 px-5 cursor-pointer flex items-center justify-between gap-3 transition-all duration-200 hover:bg-white/10"
              >
                <span
                  className="font-semibold text-[15px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {suggestion.name}
                </span>
                <span
                  className="text-xs truncate max-w-[50%]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {suggestion.region && `${suggestion.region}, `}
                  {suggestion.country}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input Form */}
      <form
        className={`flex items-center h-12 p-1.5 transition-all duration-200 rounded-full`}
        style={{
          background: "var(--bg-secondary)",
          border: isExpanded
            ? "1px solid transparent"
            : "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          zIndex: 20,
        }}
        onSubmit={handleFormSubmit}
      >
        <input
          className="border-none bg-transparent outline-none px-3 text-text-primary text-[15px] font-medium h-full w-[90px] md:w-[110px] placeholder:text-text-secondary/50 max-[480px]:w-[70px] max-[480px]:text-sm transition-all duration-300 focus:w-[260px] md:focus:w-[320px]"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          ref={inputRef}
          onChange={handleInputChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            // Delay hide to allow click on suggestion
            setTimeout(() => setIsInputFocused(false), 200);
          }}
        />
        <button
          type="submit"
          className="flex justify-center items-center w-9 h-9 min-w-[36px] rounded-full border-none cursor-pointer transition-all duration-300 text-sm p-0 hover:scale-105 hover:brightness-110 focus:outline-2 focus:outline-accent-start focus:outline-offset-2"
          style={{
            background: "var(--bg-selected)",
            color: "var(--text-primary)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-md)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
          aria-label="Search"
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
