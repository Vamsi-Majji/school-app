import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import store from "./redux/store";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AttenderDashboard from "./pages/AttenderDashboard";
import MaidDashboard from "./pages/MaidDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import DeanDashboard from "./pages/DeanDashboard";
import HodDashboard from "./pages/HodDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import { useSelector } from "react-redux";
import { BrandingProvider } from "./contexts/BrandingContext";
import DynamicThemeProvider from "./components/DynamicThemeProvider";

function AppContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <BrandingProvider>
        <DynamicThemeProvider>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </DynamicThemeProvider>
      </BrandingProvider>
    );
  }

  return (
    <BrandingProvider>
      <DynamicThemeProvider>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/accountant/*" element={<AccountantDashboard />} />
            <Route path="/principal/*" element={<PrincipalDashboard />} />
            <Route path="/teacher/*" element={<TeacherDashboard />} />
            <Route path="/professor/*" element={<ProfessorDashboard />} />
            <Route path="/dean/*" element={<DeanDashboard />} />
            <Route path="/hod/*" element={<HodDashboard />} />
            <Route path="/librarian/*" element={<LibrarianDashboard />} />
            <Route path="/maid/*" element={<MaidDashboard />} />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/parent/*" element={<ParentDashboard />} />
            <Route path="/attender/*" element={<AttenderDashboard />} />
            <Route
              path="*"
              element={<Navigate to={`/${user.role}/dashboard`} />}
            />
          </Routes>
        </Router>
      </DynamicThemeProvider>
    </BrandingProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
