"use client"

import { useState } from "react"
import { Save, Bell, Shield, Globe, Database } from "lucide-react"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    // General Settings
    organizationName: "ZZAZO Transportation",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    language: "English",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    parentNotifications: true,
    driverNotifications: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: "strong",

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
  })

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Database },
  ]

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your system preferences and configurations.</p>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-100 text-primary-700 border-r-4 border-primary-500"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      value={settings.organizationName}
                      onChange={(e) => handleSettingChange("organizationName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange("timezone", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange("dateFormat", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange("emailNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange("smsNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange("pushNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Parent Notifications</h4>
                      <p className="text-sm text-gray-600">Send notifications to parents</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.parentNotifications}
                        onChange={(e) => handleSettingChange("parentNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Driver Notifications</h4>
                      <p className="text-sm text-gray-600">Send notifications to drivers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.driverNotifications}
                        onChange={(e) => handleSettingChange("driverNotifications", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange("twoFactorAuth", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                    <select
                      value={settings.passwordPolicy}
                      onChange={(e) => handleSettingChange("passwordPolicy", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="basic">Basic (8+ characters)</option>
                      <option value="medium">Medium (8+ chars, numbers)</option>
                      <option value="strong">Strong (8+ chars, numbers, symbols)</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Security Recommendations</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Enable two-factor authentication for enhanced security</li>
                      <li>• Use strong passwords with a mix of characters</li>
                      <li>• Regularly review user access permissions</li>
                      <li>• Monitor login activities for suspicious behavior</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">Automatic Backup</h4>
                      <p className="text-sm text-gray-600">Automatically backup system data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange("autoBackup", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange("backupFrequency", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={!settings.autoBackup}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
                    <input
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) => handleSettingChange("dataRetention", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      min="30"
                      max="2555"
                    />
                    <p className="text-sm text-gray-500 mt-1">How long to keep historical data (30-2555 days)</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-medium text-blue-800 mb-2">System Information</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Version:</span>
                        <span>1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Backup:</span>
                        <span>2024-01-15 03:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Size:</span>
                        <span>2.4 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span>156</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-colors">
                      Run Manual Backup
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition-colors">
                      Export System Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
