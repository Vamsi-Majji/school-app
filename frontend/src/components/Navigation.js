import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';

const Navigation = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    // Mock logout
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleRoleSwitch = (newRole) => {
    // Mock role switch
    dispatch({ type: 'SWITCH_ROLE', payload: newRole });
    navigate(`/${newRole}/dashboard`);
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: '🎓',
      teacher: '👨‍🏫',
      parent: '👨‍👩‍👧',
      principal: '🏫',
      attender: '📝',
      admin: '⚙️'
    };
    return badges[role] || '';
  };

  const getAvailableRoles = () => {
    // Mock multi-role support
    return ['student', 'teacher', 'parent'];
  };

  if (!user) return null;

  return (
    <nav className="navigation">
      <div className="nav-left">
        <h3>School App {getRoleBadge(user.role)}</h3>
      </div>
      <div className="nav-center">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>
      <div className="nav-right">
        <NotificationBadge count={5} />
        {getAvailableRoles().length > 1 && (
          <select
            value={user.role}
            onChange={(e) => handleRoleSwitch(e.target.value)}
            className="role-switcher"
          >
            {getAvailableRoles().map(role => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        )}
        <div className="profile-menu">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="profile-btn"
          >
            👤
          </button>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <Link to={`/${user.role}/profile`}>Profile</Link>
              <Link to={`/${user.role}/settings`}>Settings</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
