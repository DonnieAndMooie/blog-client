import React from "react";
import PC from "../images/pc-icon.png";

const Header = () => {
  return (
    <header>
      <img src={PC} alt="" />
      <h1><a href="/" className="title">DonnieDebugsLife</a></h1>
    </header>
  );
};

export default Header;
