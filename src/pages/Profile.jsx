import React, { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa6";

const Profile = () => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, [])

  const handleToggleStatus = () => {
    setUserData(prev => ({
      ...prev,
      isActive: !prev.isActive
    }))
    // You can send an API request here if needed
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return 'bg-red-500'
      case 'ADMIN':
        return 'bg-orange-500'
      case 'USER':
        return 'bg-blue-500'
      case 'SCHOOL_ADMIN':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen p-5 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header Section */}
        <div className="bg-yellow-400 px-4 py-3 text-center text-black">
          <div className="w-20 h-20 bg-white shadow-2xl bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            <FaRegUser />
          </div>
          <h1 className="text-3xl font-semibold">User Profile</h1>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {userData ? (
            <div className="space-y-6">
              {/* Name Field */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Full Name
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {userData.name}
                </div>
              </div>

              {/* Email Field */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Email Address
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {userData.email}
                </div>
              </div>

              {/* Role Field */}
              <div className="bg-slate-50 p-5 flex items-center text-center justify-between rounded-xl border border-slate-200">
                <div className="font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </div>
                <span className={`${getRoleBadgeClass(userData.role)} text-white px-3 py-2 rounded-full text-sm font-medium capitalize`}>
                  {userData.role.replace('_', ' ').toLowerCase()}
                </span>
              </div>

              {/* Status Toggle */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex justify-between items-center">
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Account Status
                  </div>
                  <div className={`text-lg font-semibold ${userData.isActive ? 'text-green-500' : 'text-red-500'}`}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userData.isActive}
                    onChange={handleToggleStatus}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-xs font-medium text-blue-700 mb-2">
                    Joined
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatDate(userData.createdAt)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-xs font-medium text-green-700 mb-2">
                    Last Updated
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatDate(userData.updatedAt)}
                  </div>
                </div>
              </div>

              {/* Password Status */}
              {userData.isPasswordChanged && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-center gap-2">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-green-800 text-sm font-medium">
                    Password has been changed from default
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile