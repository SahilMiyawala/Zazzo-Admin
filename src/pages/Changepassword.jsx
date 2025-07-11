import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

const Changepassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
            ...showPasswords,
            [field]: !showPasswords[field]
        })
    }

    const handleSubmit = async () => {
        // Reset messages
        setError(null)
        setSuccess(false)

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New password and confirm password do not match!')
            return
        }

        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long!')
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`http://145.223.20.218:2002/api/user/password-change/${userId}`, { // Using template literal with userId
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password')
            }

            // Password changed successfully
            setSuccess(true)
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (err) {
            setError(err.message || 'An error occurred while changing password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-slide-in flex justify-center">
            {/* Error/Success Messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">Password changed successfully!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-[15cm]">
                <div className="max-w-md space-y-6">
                    {/* Current Password */}
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Changepassword