import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"

import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import BusManagement from "./pages/BusManagement"
import DriverManagement from "./pages/DriverManagement"
import StudentManagement from "./pages/StudentManagement"
import RouteManagement from "./pages/RouteManagement"
import SchoolManagement from "./pages/SchoolManagement"
import LiveTracking from "./pages/LiveTracking"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import Login from "./pages/Login"
import TEST from "./pages/TEST"
import SchoolList from "./pages/SchoolList"
import AddStudents from "./pages/AddStudents"
import ConductorManagement from "./pages/ConductorManagement"
import Changepassword from "./pages/Changepassword"
import Profile from "./pages/Profile"
import "./index.css"
import VendorManagement from "./pages/VendorManagement"
import AllBuses from "./pages/AllBuses"
import SchoolsStudentlist from "./pages/SchoolsStudentlist"

// Protected Route Wrapper
const ProtectedRoute = () => {
  const token = localStorage.getItem("token")
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="buses" element={<BusManagement />} />
            <Route path="drivers" element={<DriverManagement />} />
            <Route path="conductor" element={<ConductorManagement />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="routes" element={<RouteManagement />} />
            <Route path="schools" element={<SchoolManagement />} />
            <Route path="addStudents" element={<AddStudents />} />
            <Route path="vendor" element={<VendorManagement />} />
            <Route path="tracking" element={<LiveTracking />} />
            <Route path="reports" element={<Reports />} />
            <Route path="schoollist" element={<SchoolList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="changepassword" element={<Changepassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="TEST" element={<TEST />} />
            <Route path="allbuses" element={<AllBuses />} />
            <Route path="SchoolsStudentlist" element={<SchoolsStudentlist />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
