import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { Menu } from "./components/Menu";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { DoctorCalendar } from "./components/DoctorCalendar";
import { DoctorAvailability } from "./components/DoctorAvailability";
import { AuthPersistenceSelector } from "./components/AuthPersistenceSelector";
import { RoleRoute } from "./routes/RoleRoute";
import { Cart } from "./components/Cart";
import { DoctorList } from "./components/DoctorList";
import { AdminUserList } from "./components/AdminUserList";
import {Home} from "./components/Home";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
  <Menu />
  <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/doctors" element={<DoctorList />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/calendar"
      element={
        <RoleRoute allow={["admin", "doctor", "patient"]}>
          <DoctorCalendar />
        </RoleRoute>
      }
    />
    <Route path="/cart" 
    element={
      <RoleRoute allow={["patient"]}>
        <Cart />
      </RoleRoute>
    }/>

    <Route
      path="/availability"
      element={
        <RoleRoute allow={["doctor"]}>
          <DoctorAvailability />
        </RoleRoute>
      }/>

    <Route
      path="/settings"
      element={
        <RoleRoute allow={["admin"]}>
          <AuthPersistenceSelector />
        </RoleRoute>
      }/>
    <Route path="/UserManagement" element={
      <RoleRoute allow={["admin"]}>
        <AdminUserList />
      </RoleRoute>
    }/>


  </Routes>
</BrowserRouter>

    </AuthProvider>
  );
}

export default App;
