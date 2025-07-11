"use client"

import { useState } from "react"
import { Download, Calendar, Filter, FileText, BarChart3, PieChart, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

const Reports = () => {
  const [dateRange, setDateRange] = useState("last_7_days")
  const [reportType, setReportType] = useState("attendance")

  const attendanceData = [
    { date: "2024-01-01", present: 1180, absent: 67, late: 15 },
    { date: "2024-01-02", present: 1205, absent: 42, late: 8 },
    { date: "2024-01-03", present: 1190, absent: 57, late: 12 },
    { date: "2024-01-04", present: 1220, absent: 27, late: 5 },
    { date: "2024-01-05", present: 1195, absent: 52, late: 18 },
    { date: "2024-01-06", present: 980, absent: 35, late: 10 },
    { date: "2024-01-07", present: 1210, absent: 37, late: 7 },
  ]

  const routePerformanceData = [
    { route: "Route A", onTime: 95, delayed: 5 },
    { route: "Route B", onTime: 88, delayed: 12 },
    { route: "Route C", onTime: 92, delayed: 8 },
    { route: "Route D", onTime: 97, delayed: 3 },
    { route: "Route E", onTime: 85, delayed: 15 },
  ]

  const busUtilizationData = [
    { name: "Utilized", value: 85, color: "#10B981" },
    { name: "Available", value: 15, color: "#E5E7EB" },
  ]

  const reportTemplates = [
    {
      id: 1,
      name: "Daily Attendance Report",
      description: "Student attendance summary for selected date",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 2,
      name: "Route Performance Report",
      description: "On-time performance and delays by route",
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Driver Performance Report",
      description: "Driver statistics and performance metrics",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      id: 4,
      name: "Bus Utilization Report",
      description: "Fleet utilization and maintenance schedules",
      icon: PieChart,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and analyze transportation data.</p>
        </div>
        <button className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="attendance">Attendance</option>
                <option value="performance">Performance</option>
                <option value="utilization">Utilization</option>
                <option value="safety">Safety</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTemplates.map((template) => {
            const Icon = template.icon
            return (
              <div
                key={template.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`${template.color} p-2 rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                  Generate Report
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Route Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="route" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="onTime" fill="#10B981" />
              <Bar dataKey="delayed" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Utilization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie data={busUtilizationData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                {busUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {busUtilizationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">96.5%</p>
              <p className="text-sm text-gray-600">On-Time Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">94.2%</p>
              <p className="text-sm text-gray-600">Attendance Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">85%</p>
              <p className="text-sm text-gray-600">Fleet Utilization</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">4.8/5</p>
              <p className="text-sm text-gray-600">Parent Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
