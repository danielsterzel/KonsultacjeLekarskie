import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import { Menu } from "./components/Menu";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { DoctorCalendar } from "./components/DoctorCalendar";
import { DoctorAvailability } from "./components/DoctorAvailability";
import { AuthPersistenceSelector } from "./components/AuthPersistenceSelector";
import { RoleRoute } from "./routes/RoleRoute";

function App() {
  return (
  <AuthProvider>
  <BrowserRouter>
    <Menu />

    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div>Welcome to the Medical Consultation App</div>
          </ProtectedRoute>
        }
      />

      <Route
        path="/calendar"
        element={
          <RoleRoute allow={["admin", "doctor", "patient"]}>
            <DoctorCalendar />
          </RoleRoute>
        }
      />

      <Route
        path="/availability"
        element={
          <RoleRoute allow={["doctor"]}>
            <DoctorAvailability />
          </RoleRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <RoleRoute allow={["admin"]}>
            <AuthPersistenceSelector />
          </RoleRoute>
        }
      />
      
    </Routes>
  </BrowserRouter>
</AuthProvider>
    );
}

export default App;
