import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  function hide_sidebar() {
    document.querySelector("#sidebar").classList.remove("visible");
  }
  return (
    <>
      <div id="sidebar">
        <div className="siderbar_sections">
          <h1>admin options</h1>
          <Link to="/dashboard" className="dashboard_option">
            <i className="fa-solid fa-user" /> Dashboard
          </Link>

          <a className="close__menu" onClick={() => hide_sidebar()} href="#">
            Close Menu
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
