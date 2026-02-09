import { useState, useEffect, useRef } from "react";
import { searchLocations } from "../services/locationService";
import { useUserLocation } from "../context/LocationContext";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Get user location for distance-based sorting
  const { latitude, longitude, hasLocation } = useUserLocation();

  useEffect(() => {
    // Debounce search requests
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length > 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchLocations(
            searchQuery,
            hasLocation ? latitude : null,
            hasLocation ? longitude : null
          );
          setSuggestions(results);
        } catch (error) {
          console.error("Search error:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, latitude, longitude, hasLocation]);

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
    // Pass coordinates and full Geoapify location info
    const locationInfo = {
      name: suggestion.name,
      region: suggestion.region,
      country: suggestion.country,
    };
    onClick(`${suggestion.lat},${suggestion.lon}`, locationInfo);
    setSearchQuery("");
    setSuggestions([]);
    setIsInputFocused(false);
  };

  const isExpanded = suggestions?.length > 0 && isInputFocused;

  return (
    <div className="relative z-50">
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
                key={suggestion.id || index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="py-3 px-5 cursor-pointer flex items-center justify-between gap-3 transition-all duration-200 hover:bg-white/10"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className="font-semibold text-[15px] truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {suggestion.name}
                  </span>
                  <span
                    className="text-xs truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {suggestion.region && `${suggestion.region}, `}
                    {suggestion.country}
                  </span>
                </div>
                
                {/* Distance Badge */}
                {suggestion.distanceFormatted && (
                  <span
                    className="shrink-0 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: suggestion.distance < 10 
                        ? "var(--accent-start)" 
                        : "var(--bg-glass)",
                      color: suggestion.distance < 10 
                        ? "white" 
                        : "var(--text-secondary)",
                    }}
                  >
                    {suggestion.distance < 10 ? "📍 " : ""}
                    {suggestion.distanceFormatted}
                  </span>
                )}
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
          border: isExpanded ? "1px solid transparent" : "1px solid var(--border-primary)",
          boxShadow: "var(--shadow-md)",
          position: "relative",
          zIndex: 20,
        }}
        onSubmit={handleFormSubmit}
      >
        <input
          className="border-none bg-transparent outline-none px-3 text-text-primary text-[15px] font-medium h-full w-[90px] md:w-[110px] placeholder:text-text-secondary/50 max-[480px]:w-[70px] max-[480px]:text-sm transition-all duration-300 focus:w-[260px] md:focus:w-[320px]"
          type="text"
          placeholder="Search location..."
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
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" 
                 style={{ borderColor: "var(--text-primary) transparent transparent transparent" }} />
          ) : (
            <i className="fas fa-search"></i>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
