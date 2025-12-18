import React, { useState } from 'react';

const AppCustomizer = () => {
  const [customizations, setCustomizations] = useState({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontSize: 'medium',
    layout: 'grid'
  });

  const handleChange = (key, value) => {
    setCustomizations({ ...customizations, [key]: value });
  };

  const applyCustomizations = () => {
    // Apply customizations to CSS variables or classes
    document.documentElement.style.setProperty('--primary-color', customizations.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', customizations.secondaryColor);
    document.body.className = `font-${customizations.fontSize} layout-${customizations.layout}`;
  };

  return (
    <div className="app-customizer">
      <h3>App Customization</h3>
      <div className="customization-options">
        <div>
          <label>Primary Color:</label>
          <input
            type="color"
            value={customizations.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
          />
        </div>
        <div>
          <label>Secondary Color:</label>
          <input
            type="color"
            value={customizations.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
          />
        </div>
        <div>
          <label>Font Size:</label>
          <select value={customizations.fontSize} onChange={(e) => handleChange('fontSize', e.target.value)}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div>
          <label>Layout:</label>
          <select value={customizations.layout} onChange={(e) => handleChange('layout', e.target.value)}>
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
        <button onClick={applyCustomizations}>Apply Changes</button>
      </div>
    </div>
  );
};

export default AppCustomizer;
