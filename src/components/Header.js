import Searchbar from "./SearchBar";
import UserLocation from "./UserLocation";
import ThemeToggle from "./ThemeToggle";

const Header = ({ onClick }) => {
  return (
    <div className="flex flex-row justify-between items-center py-2 gap-4">
      <Searchbar onClick={onClick} />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div
          className="flex justify-center items-center w-9 h-9 min-w-[36px] p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-sm)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, var(--accent-start) 0%, var(--accent-end) 100%)";
            e.currentTarget.style.boxShadow = "var(--shadow-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-glass)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          }}
        >
          <UserLocation onClick={onClick} />
        </div>
      </div>
    </div>
  );
};

export default Header;
