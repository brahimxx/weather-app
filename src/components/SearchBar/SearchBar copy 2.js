import "./SearchBar.css"; // Importing the CSS styles for the SearchBar component
import { useState } from "react"; // Importing the useState hook from React
import UserLocation from "../UserLocation/UserLocation";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the current search query
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to track whether the search bar is open or closed

  // Function to handle input changes
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update the searchQuery state with the current input value
  };

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (isSearchOpen && searchQuery.trim()) {
      // Only search if the search bar is already open and there's a valid query
      onClick(searchQuery); // Call the onClick function passed from the parent with the current search query
    } else if (!isSearchOpen) {
      // If the search bar is not open, open it without submitting
      setIsSearchOpen(true);
    }
  };

  return (
    <>
      <form
        className={`search-box ${isSearchOpen ? "open" : ""}`}
        onSubmit={handleFormSubmit}
      >
        <input
          className={`search-text ${isSearchOpen ? "visible" : "hidden"}`} // Show input only when the bar is open
          type="text" // Input type is text
          placeholder="Enter city" // Placeholder text for the input field
          onChange={handleInputChange} // Event handler for input changes
          value={searchQuery}
        />
        <button
          type="submit"
          className="search-btn"
          onClick={() => {
            if (!isSearchOpen) {
              setIsSearchOpen(true); // Open the search bar on the first click
            }
          }}
        >
          <i className="fas fa-search"></i> {/* Font Awesome icon for search */}
        </button>
      </form>
      <UserLocation onClick={onClick} />
    </>
  );
};

export default SearchBar; // Exporting the SearchBar component for use in other files
