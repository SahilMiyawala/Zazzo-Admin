"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bus, Eye, EyeOff } from "lucide-react"
import axios from "axios"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("http://145.223.20.218:2002/api/user/login", {
        email,
        password,
      })

      const token = response.data.data.token
      const user = response.data.data.user

      // ✅ Store token and user in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      console.log("Login successful", user)
      navigate("/") // Redirect to home/dashboard
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message)
      alert(error.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
            <Bus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ZZAZO</h1>
          <p className="text-gray-600 mt-2">Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="admin@zzazo.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-shadow font-medium"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">© 2024 ZZAZO. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login
