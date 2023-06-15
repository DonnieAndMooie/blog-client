import React from "react";
import { Link } from "react-router-dom";
import PC from "../images/pc-icon.png";

const Header = () => {
  return (
    <header>
      <img src={PC} alt="" />
      <h1><Link to="/" className="title">DonnieDebugsLife</Link></h1>
    </header>
  );
};

export default Header;
