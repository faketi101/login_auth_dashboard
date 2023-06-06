import React from "react";
import { NavLink } from "react-router-dom";
const Sidebar = () => {
  function hide_sidebar() {
    document.querySelector("#sidebar").classList.remove("visible");
  }
  return (
    <>
      <div id="sidebar">
        <div className="siderbar_sections">
          <h1>admin options</h1>
          <NavLink
            to="/dashboard"
            className={
              location.pathname === "/dashboard"
                ? "active_nav dashboard_option"
                : "dashboard_option"
            }
          >
            <i className="fa-solid fa-user" /> Dashboard
          </NavLink>
          <NavLink
            to="/dashboard/other"
            className={(nav) =>
              nav.isActive ? "active_nav dashboard_option" : "dashboard_option"
            }
          >
            <i className="fa-solid fa-user" /> Other
          </NavLink>

          <a className="close__menu" onClick={() => hide_sidebar()} href="#">
            Close Menu
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
