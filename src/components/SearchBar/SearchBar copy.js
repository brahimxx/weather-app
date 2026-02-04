import "./SearchBar.css"; // Importing the CSS styles for the SearchBar component
import { useState } from "react"; // Importing the useState hook from React
import UserLocation from "../UserLocation/UserLocation";

const SearchBar = ({ onClick }) => {
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the current search query

  // Function to handle input changes
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update the searchQuery state with the current input value
  };

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    console.log(searchQuery);
    e.preventDefault(); // Prevent the default form submission behavior
    onClick(searchQuery); // Call the onClick function passed from the parent with the current search query
  };

  return (
    <>
      <form className="search-box" onSubmit={handleFormSubmit}>
        {" "}
        {/* Form element for the search bar */}
        <input
          className="search-text" // Class for styling the input field
          type="text" // Input type is text
          placeholder="Enter city" // Placeholder text for the input field
          onChange={handleInputChange} // Event handler for input changes
        />
        <button type="submit" className="search-btn">
          {/* Button to submit the form */}
          <i className="fas fa-search"></i> {/* Font Awesome icon for search */}
        </button>
      </form>
      <UserLocation onClick={onClick} />
    </>
  );
};

export default SearchBar; // Exporting the SearchBar component for use in other files
