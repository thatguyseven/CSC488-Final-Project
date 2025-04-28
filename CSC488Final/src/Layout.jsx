import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";

import Update from "./Update/update.jsx";
import Create from "./Create/create.jsx";
import Delete from "./Delete/deleteRecord.jsx";

import './Layout.css'; // Import the CSS file

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="navbar">
        <button 
          onClick={toggleDropdown} 
          className="dropdown-toggle"
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="dropdown-menu"
          aria-label="Toggle navigation menu"
        >
          <IoIosArrowDropdown size={20} />
        </button>
        {isOpen && (
          <ul id="dropdown-menu" className="dropdown-menu">
            <li><Link to="/Home" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link to="/Create" onClick={() => setIsOpen(false)}>Create Data Point</Link></li>
            <li><Link to="/Delete" onClick={() => setIsOpen(false)}>Delete a Record</Link></li>
            <li><Link to="/Update" onClick={() => setIsOpen(false)}>Update a Record</Link></li>
            <li><Link to="/Read" onClick={() => setIsOpen(false)}>All Records</Link></li>
          </ul>
        )}
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;