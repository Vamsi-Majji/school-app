import React, { createContext, useContext, useState, useEffect } from "react";

const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [currentSchool, setCurrentSchool] = useState(null);
  const [branding, setBranding] = useState({
    schoolName: "Springfield High School",
    logo: null,
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    showLogo: true,
    showSchoolName: true,
    customCSS: "",
  });

  // Get current user from localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  // Load branding for current user's school
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.schoolName) {
      setCurrentSchool(user.schoolName);
      const savedBranding = localStorage.getItem(
        `schoolBranding_${user.schoolName}`
      );
      if (savedBranding) {
        try {
          const parsedBranding = JSON.parse(savedBranding);
          setBranding(parsedBranding);
        } catch (error) {
          console.error("Error parsing saved branding:", error);
          // Load default branding for this school
          loadDefaultBranding(user.schoolName);
        }
      } else {
        // Load default branding for this school
        loadDefaultBranding(user.schoolName);
      }
    } else {
      // No user logged in, use default
      loadDefaultBranding("Default School");
    }
  }, []);

  // Load default branding for a school
  const loadDefaultBranding = (schoolName) => {
    const defaultBranding = {
      schoolName: schoolName,
      logo: null,
      primaryColor: "#667eea",
      secondaryColor: "#764ba2",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      showLogo: true,
      showSchoolName: true,
      customCSS: "",
    };
    setBranding(defaultBranding);
  };

  // Save branding to localStorage whenever it changes
  useEffect(() => {
    if (currentSchool) {
      localStorage.setItem(
        `schoolBranding_${currentSchool}`,
        JSON.stringify(branding)
      );
    }
  }, [branding, currentSchool]);

  const updateBranding = (newBranding) => {
    setBranding((prev) => ({
      ...prev,
      ...newBranding,
    }));
  };

  const resetBranding = () => {
    if (currentSchool) {
      loadDefaultBranding(currentSchool);
    }
  };

  // Update school when user changes
  const updateCurrentSchool = (schoolName) => {
    setCurrentSchool(schoolName);
    const savedBranding = localStorage.getItem(`schoolBranding_${schoolName}`);
    if (savedBranding) {
      try {
        const parsedBranding = JSON.parse(savedBranding);
        setBranding(parsedBranding);
      } catch (error) {
        console.error("Error parsing saved branding:", error);
        loadDefaultBranding(schoolName);
      }
    } else {
      loadDefaultBranding(schoolName);
    }
  };

  const value = {
    branding,
    currentSchool,
    updateBranding,
    resetBranding,
    updateCurrentSchool,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};
