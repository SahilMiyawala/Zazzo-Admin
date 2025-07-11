"use client"

import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { Menu, Bell, Search, User, LogOut, Settings } from "lucide-react"

const Header = ({ onMenuClick }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem("user"))

  const pageTitles = {
    "/": { title: "Dashboard", description: "Welcome back! Here's what's happening with your bus fleet." },
    "/buses": { title: "Bus Management", description: "Manage your fleet of buses and their assignments." },
    "/drivers": { title: "Driver Management", description: "Manage your bus drivers and their assignments." },
    "/conductor": { title: "Conductor Management", description: "Manage conductors and their details." },
    "/schools": { title: "School Management", description: "Manage schools and their transportation requirements." },
    "/addStudents": { title: "Student Management", description: "Manage student records and information." },
    "/profile": { title: "Profile", description: "Manage your account settings and preferences." },
    "/changepassword": { title: "Change Password", description: "Update your password for enhanced security." },
    "/routes": { title: "Route Management", description: "Manage bus routes and optimize transportation efficiency." },
    "/tracking": { title: "Live Tracking", description: "Track your buses in real-time and monitor their progress." },
    "/vendor": { title: "Vendor Management", description: "Manage vendors and their details." },
    "/allbuses": { title: "All Buses", description: "View and manage all buses in the fleet." },
  }

  const currentPage = pageTitles[location.pathname] || { title: "", description: "" }

  const notifications = [
    { id: 1, message: "Bus #101 has arrived at school", time: "2 min ago", type: "info" },
    { id: 2, message: "Driver John Smith checked in", time: "5 min ago", type: "success" },
    { id: 3, message: "Route delay reported on Route A", time: "10 min ago", type: "warning" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login") // redirect to login
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-3">
      <div className="flex items-center justify-between h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-900">{currentPage.title}</h1>
            <p className="text-sm text-gray-600">{currentPage.description}</p>
          </div>
        </div>

        {/* Right side - keep this exactly the same */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <button className="w-full text-center text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-gradient-to-r bg-secondary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.role}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <a href="changepassword" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header