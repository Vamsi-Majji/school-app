import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";
import {
  useTheme,
  useMediaQuery,
  Drawer,
  Backdrop,
  IconButton,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useBranding } from "../contexts/BrandingContext";
import "./Sidebar.css";

const menuItems = {
  student: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Assignments", path: "assignments", icon: "📋" },
    { name: "Homework", path: "homework", icon: "📖" },
    { name: "Grades", path: "grades", icon: "🎓" },
    { name: "Messages", path: "messages", icon: "💬" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Profile", path: "profile", icon: "👤" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  teacher: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Assignments", path: "assignments", icon: "📋" },
    { name: "Homework Management", path: "homework", icon: "📖" },
    { name: "Grades", path: "grades", icon: "🎓" },
    { name: "Attendance Overview", path: "attendance", icon: "✅" },
    { name: "Students", path: "students", icon: "👨‍🎓" },
    { name: "Messages", path: "messages", icon: "💬" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Settings", path: "settings", icon: "⚙️" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  parent: [
    { name: "Child Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Assignments Tracker", path: "assignments", icon: "📋" },
    { name: "Grades", path: "grades", icon: "🎓" },
    { name: "Calendar/Meetings", path: "calendar", icon: "📅" },
    { name: "Messages", path: "messages", icon: "💬" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Feedback", path: "feedback", icon: "📝" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  principal: [
    { name: "Overview Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Students", path: "students", icon: "👨‍🎓" },
    { name: "Teachers", path: "teachers", icon: "👨‍🏫" },
    { name: "Parents", path: "parents", icon: "👨‍👩‍👧" },
    { name: "Attenders", path: "attenders", icon: "👷" },
    { name: "Meetings", path: "meetings", icon: "📅" },
    { name: "Permissions", path: "permissions", icon: "🔐" },
    { name: "Analytics", path: "analytics", icon: "📈" },
    { name: "Complaints", path: "complaints", icon: "📢" },
    { name: "School Branding", path: "branding", icon: "🎨" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  attender: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Attendance Marking", path: "marking", icon: "✅" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Alerts", path: "alerts", icon: "🚨" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  admin: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Users", path: "users", icon: "👥" },
    { name: "Classes/Subjects", path: "classes", icon: "🏫" },
    { name: "Audit Log", path: "audit", icon: "📜" },
    { name: "Customizations", path: "customizations", icon: "🎨" },
    { name: "System Settings", path: "settings", icon: "🔧" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  accountant: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Fee Setup & Structures", path: "fee-setup", icon: "💰" },
    { name: "Invoices & Fee Collection", path: "invoices", icon: "📄" },
    { name: "Dues & Refunds", path: "dues-refunds", icon: "🔄" },
    { name: "Payroll & Payslips", path: "payroll", icon: "💼" },
    { name: "Expenses & Vendor Payments", path: "expenses", icon: "🧾" },
    { name: "Finance Reports", path: "reports", icon: "📊" },
    { name: "Communications (Email/SMS)", path: "communications", icon: "📧" },
    { name: "Settings / Finance Policy", path: "settings", icon: "⚙️" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  maid: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Cleaning Tasks", path: "tasks", icon: "🧹" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Alerts", path: "alerts", icon: "🚨" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  professor: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Assignments", path: "assignments", icon: "📋" },
    { name: "Homework Management", path: "homework", icon: "📖" },
    { name: "Grades", path: "grades", icon: "🎓" },
    { name: "Attendance Overview", path: "attendance", icon: "✅" },
    { name: "Students", path: "students", icon: "👨‍🎓" },
    { name: "Messages", path: "messages", icon: "💬" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Settings", path: "settings", icon: "⚙️" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  hod: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Assignments", path: "assignments", icon: "📋" },
    { name: "Homework Management", path: "homework", icon: "📖" },
    { name: "Grades", path: "grades", icon: "🎓" },
    { name: "Attendance Overview", path: "attendance", icon: "✅" },
    { name: "Students", path: "students", icon: "👨‍🎓" },
    { name: "Messages", path: "messages", icon: "💬" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Settings", path: "settings", icon: "⚙️" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  dean: [
    { name: "Overview Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Students", path: "students", icon: "👨‍🎓" },
    { name: "Teachers", path: "teachers", icon: "👨‍🏫" },
    { name: "Parents", path: "parents", icon: "👨‍👩‍👧" },
    { name: "Attenders", path: "attenders", icon: "👷" },
    { name: "Meetings", path: "meetings", icon: "📅" },
    { name: "Permissions", path: "permissions", icon: "🔐" },
    { name: "Analytics", path: "analytics", icon: "📈" },
    { name: "Complaints", path: "complaints", icon: "📢" },
    { name: "School Branding", path: "branding", icon: "🎨" },
    { name: "Notifications", path: "notifications", icon: "🔔" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
  librarian: [
    { name: "Dashboard", path: "dashboard", icon: "🏠" },
    { name: "Attendance Marking", path: "marking", icon: "✅" },
    { name: "Reports", path: "reports", icon: "📄" },
    { name: "Alerts", path: "alerts", icon: "🚨" },
    { name: "Logout", action: "logout", icon: "🚪" },
  ],
};

const Sidebar = ({ role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const user = useSelector((state) => state.auth.user);
  const currentRole = role || user?.role;
  const items = menuItems[currentRole?.toLowerCase()] || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branding } = useBranding();

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (item) => {
    if (item.action === "logout") {
      dispatch(logout());
      navigate("/login");
    }
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarContent = (
    <div className={`sidebar-content ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          {branding.showLogo && branding.logo ? (
            <Avatar src={branding.logo} sx={{ width: 32, height: 32, mr: 1 }}>
              {branding.schoolName.charAt(0)}
            </Avatar>
          ) : (
            <span className="logo-icon">🎓</span>
          )}
          {!isCollapsed && branding.showSchoolName && (
            <span className="logo-text">
              {branding.schoolName || "EduManage"}
            </span>
          )}
        </div>
      </div>
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li key={item.name}>
            {item.path ? (
              <Link
                to={`/${currentRole}/${item.path}`}
                title={item.name}
                onClick={() => handleItemClick(item)}
                className="sidebar-link"
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </Link>
            ) : (
              <button
                onClick={() => handleItemClick(item)}
                className="sidebar-menu-button"
                title={item.name}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1201,
            backgroundColor: "background.paper",
            boxShadow: 2,
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "280px",
              background: `linear-gradient(135deg, ${
                branding.primaryColor || "#667eea"
              } 0%, ${branding.secondaryColor || "#764ba2"} 100%)`,
              color: "white",
              "@media (max-width: 600px)": {
                width: "80vw",
                maxWidth: "300px",
              },
            },
          }}
        >
          {sidebarContent}
        </Drawer>
        <Backdrop
          sx={{ color: "#fff", zIndex: 1199 }}
          open={isOpen}
          onClick={() => setIsOpen(false)}
        />
      </>
    );
  }

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "60px" : "280px",
        transition: "width 0.3s ease-in-out",
        "--sidebar-primary": branding.primaryColor || "#667eea",
        "--sidebar-secondary": branding.secondaryColor || "#764ba2",
      }}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
