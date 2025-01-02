import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  LogOut,
} from 'lucide-react';
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, logoutUser } = UserData();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/admin/course',
      name: 'Courses',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      path: '/live-session',
      name: 'Live Session',
      icon: <Video className="w-5 h-5" />,
      show: user && user.role === "admin"
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: <Users className="w-5 h-5" />,
      show: user && user.mainrole === "superadmin"
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.show === undefined || item.show
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white border-r border-white/10">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-white/10 text-white font-medium shadow-lg' 
                : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={() => logoutUser(navigate)}
          className="flex items-center gap-3 w-full px-4 py-3 text-white/60 
                   hover:text-red-400 rounded-lg transition-all duration-200
                   hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
