"use client"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Bus, Users, GraduationCap, Map, School, MapPin, FileText, Settings, X } from "lucide-react"
import { useEffect, useState } from "react"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Get user data from localStorage when component mounts
    const user = JSON.parse(localStorage.getItem("user"))
    setUserData(user)
  }, [])

  // Common menu items for all admin types
  const commonAdminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Bus, label: "Bus Management", path: "/buses" },
    { icon: Users, label: "Driver Management", path: "/drivers" },
    { icon: Users, label: "Conductor Management", path: "/conductor" },
    { icon: Users, label: "Vendor Management", path: "/vendor" },
    // { icon: School, label: "My School", path: `/school/${userData?.school}`   },
  ]

  // School Admin specific menu items
  const schoolAdminMenuItems = [
    // { icon: Users, label: "Student Management", path: "/students" },
    { icon: Users, label: "Students Management", path: "/addStudents" },
    { icon: Users, label: "Route Management", path: "/routes" },
    { icon: Users, label: "Live Tracking", path: "/tracking" },
  ]

  // School Admin specific menu items
  const vendorMenuItems = [
    { icon: Users, label: "Route Management", path: "/routes" },
    { icon: Users, label: "Live Tracking", path: "/tracking" },
    { icon: Users, label: "All Buses", path: "/allbuses" },
  ]

  // System Admin specific menu items
  const systemAdminMenuItems = [
    { icon: GraduationCap, label: "All Students", path: "/all-students" },
    { icon: School, label: "School Management", path: "/schools" },
    { icon: Map, label: "Route Management", path: "/routes" },
    { icon: MapPin, label: "Live Tracking", path: "/tracking" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: FileText, label: "School List", path: "/schoollist" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  // Get menu items based on role
  const getMenuItems = () => {
    if (!userData) return []

    switch (userData.role) {
      case "SYSTEM_ADMIN":
        return [...commonAdminMenuItems, ...systemAdminMenuItems]
      case "SCHOOL_ADMIN":
        return [...commonAdminMenuItems, ...schoolAdminMenuItems]
      case 'VENDOR':
        return [...commonAdminMenuItems, ...vendorMenuItems]
      default:
        return commonAdminMenuItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo and User Info */}
        <div className="flex flex-col h-16 px-2 gradient-primary">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                <Bus className="w-5 h-5 text-secondary-500" />
              </div>
              <span className="text-xl font-bold text-white">ZZAZO</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          {userData && (
            <div className="text-xs text-white pb-2">
              {userData.name} ({userData.role.replace('_', ' ')})
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-2 py-3 rounded-xl mx-2 transition-colors duration-200
                      ${isActive
                        ? "bg-primary-100 text-primary-700 border-r-4 border-primary-500"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-0">
          <div className="bg-gradient-to-r text-secondary-500 bg-primary-500 rounded-xl p-4 text-center">
            <p className="text-sm font-bold">ZZAZO Admin Panel</p>
            <p className="text-xs opacity-80 font-bold">Version 1.0.0</p>
            {userData?.role === "SYSTEM_ADMIN" && (
              <p className="text-xs mt-1 font-bold bg-white text-primary-500 rounded-full py-1">System Admin</p>
            )}
            {userData?.role === "SCHOOL_ADMIN" && (
              <p className="text-xs mt-1 font-bold bg-white text-primary-500 rounded-full py-1">School Admin</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar