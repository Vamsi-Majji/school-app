import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = useSelector((state) => state.auth.user);
  const currentRole = role || user?.role;
  const items = menuItems[currentRole?.toLowerCase()] || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (!isMobile) {
        setIsOpen(false); // Reset mobile open state on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

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
  };

  return (
    <>
      {isMobile && (
        <button onClick={toggleSidebar} className="hamburger-menu">
          ☰
        </button>
      )}
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobile && isOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎓</span>
            {!isCollapsed && <span className="logo-text">EduManage</span>}
          </div>
        </div>
        <ul className="sidebar-menu">
          {items.map((item) => (
            <li key={item.name}>
              {item.path ? (
                <Link
                  to={`/${currentRole}/${item.path}`}
                  title={item.name}
                  onClick={() => isMobile && setIsOpen(false)}
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
    </>
  );
};

export default Sidebar;
