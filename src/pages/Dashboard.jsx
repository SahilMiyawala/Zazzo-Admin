import { Bus, Users, GraduationCap, MapPin, TrendingUp } from "lucide-react"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

const Dashboard = () => {
  const stats = [
    { title: "Total Buses", value: "45", change: "+2", icon: Bus, color: "bg-blue-500" },
    { title: "Active Drivers", value: "38", change: "+1", icon: Users, color: "bg-green-500" },
    { title: "Students", value: "1,247", change: "+15", icon: GraduationCap, color: "bg-purple-500" },
    { title: "Active Routes", value: "12", change: "0", icon: MapPin, color: "bg-orange-500" },
  ]

  const attendanceData = [
    { name: "Mon", present: 1180, absent: 67 },
    { name: "Tue", present: 1205, absent: 42 },
    { name: "Wed", present: 1190, absent: 57 },
    { name: "Thu", present: 1220, absent: 27 },
    { name: "Fri", present: 1195, absent: 52 },
    { name: "Sat", present: 980, absent: 35 },
  ]

  const routeData = [
    { name: "Route A", students: 120 },
    { name: "Route B", students: 95 },
    { name: "Route C", students: 110 },
    { name: "Route D", students: 85 },
    { name: "Route E", students: 75 },
  ]

  const busStatusData = [
    { name: "Active", value: 38, color: "#10B981" },
    { name: "Maintenance", value: 5, color: "#F59E0B" },
    { name: "Inactive", value: 2, color: "#EF4444" },
  ]

  const recentActivities = [
    { id: 1, message: "Bus #101 completed morning route", time: "10 minutes ago", type: "success" },
    { id: 2, message: "Driver John Smith checked in", time: "15 minutes ago", type: "info" },
    { id: 3, message: "Route B delayed by 5 minutes", time: "20 minutes ago", type: "warning" },
    { id: 4, message: "Student attendance updated for Route A", time: "25 minutes ago", type: "info" },
    { id: 5, message: "Bus #205 scheduled for maintenance", time: "30 minutes ago", type: "warning" },
  ]

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 w-[26cm]">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change} this week</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-[10px]`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow">
            Generate Report
          </button>
        </div>
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Route Students Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Students per Route</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={routeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#FFD700" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bus Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={busStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                {busStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {busStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all activities
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Bus className="w-8 h-8  text-primary-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Bus</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Users className="w-8 h-8 text-secondary-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Driver</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <GraduationCap className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Add Student</span>
          </button>
          <button className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <MapPin className="w-8 h-8 text-orange-500 mb-2" />
            <span className="text-sm font-medium text-gray-900">Create Route</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
