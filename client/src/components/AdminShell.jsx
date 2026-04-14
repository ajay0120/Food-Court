import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, LogOut, PackageSearch, Users } from "lucide-react";
import Navbar from "./Navbar";

const navItems = [
  { to: "/admin", label: "Profile", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: PackageSearch },
];

function AdminShell({ title, subtitle, children, actions = null }) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 24) {
        setIsCollapsed(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex">
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 ${
          isCollapsed ? "w-24" : "w-64"
        }`}
      >
        <div>
          <div className={`flex items-center mb-8 ${isCollapsed ? "justify-center" : "justify-between gap-3"}`}>
            <div>
              {!isCollapsed ? (
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Admin Dashboard
                </h2>
              ) : (
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  A
                </h2>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed((value) => !value)}
              className="rounded-xl bg-gray-800/70 hover:bg-gray-700/80 p-2 transition-all duration-300"
              aria-label={isCollapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/admin"}>
                {({ isActive }) => (
                  <div
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 m-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500/90 to-red-500/90 text-white shadow-lg transform scale-105"
                        : "bg-gray-800/50 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:shadow-md"
                    } ${isCollapsed ? "justify-center" : "space-x-3"}`}
                  >
                    <item.icon size={20} />
                    {!isCollapsed ? <span className="font-medium">{item.label}</span> : null}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600/90 to-red-700/90 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg ${
            isCollapsed ? "" : "space-x-3"
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed ? <span className="font-medium">Logout</span> : null}
        </button>
      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-24" : "ml-64"}`}>
        <Navbar />
        <div className="p-8 flex-1">
          <div>
            <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  {title}
                </h2>
                {subtitle ? (
                  <p className="mt-3 text-sm text-gray-300 max-w-3xl">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminShell;
