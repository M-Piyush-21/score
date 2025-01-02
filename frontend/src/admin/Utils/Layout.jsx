import React from "react";
import Sidebar from "./Sidebar";
import "./layout.css";

const Layout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Background Elements */}
      <div className="orb-1" />
      <div className="orb-2" />
      
      <Sidebar />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
