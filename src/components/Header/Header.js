import React from "react";
import "./Header.css";
import Searchbar from "../SearchBar/SearchBar";
import menuIcon from "../../assets/icons/menu.svg";

const Header = ({ onClick }) => {
  return (
    <>
      <div className="header-main">
        <Searchbar onClick={onClick} />

        <img src={menuIcon} />
      </div>
    </>
  );
};

export default Header;
