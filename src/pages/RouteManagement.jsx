"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Clock, Users, X } from "lucide-react"

const RouteManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [routes, setRoutes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newRoute, setNewRoute] = useState({
    name: "",
    from: "",
    to: "",
    status: "active",
    areas: [],
    startTime: "07:30" // Added startTime field
  })
  const [currentArea, setCurrentArea] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const token = localStorage.getItem("token")

  // Fetch routes on component mount
  const fetchRoutes = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const schoolId = userData?.school;

      if (!schoolId) {
        throw new Error("School ID not found in user data");
      }

      const response = await fetch(`http://145.223.20.218:2002/api/route/getallroutes/${schoolId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch routes');
      }

      const data = await response.json();
      console.log("API Response:", data); // 👈 यहाँ लॉग एड किया
      setRoutes(Array.isArray(data.data) ? data.data : []); // 👈 data.data एक्सेस करें
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const getStatusColor = (isActive) => {
  return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route?.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route?.startPoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route?.endPoint?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "active" && route.isActive) || 
      (filterStatus === "inactive" && !route.isActive)
    
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    console.log("Filtered routes:", filteredRoutes);
  }, [filteredRoutes]);

  const handleAddArea = () => {
    if (currentArea.trim() !== "") {
      setNewRoute({
        ...newRoute,
        areas: [...newRoute.areas, currentArea.trim()]
      })
      setCurrentArea("")
    }
  }

  const handleRemoveArea = (index) => {
    const updatedAreas = newRoute.areas.filter((_, i) => i !== index)
    setNewRoute({
      ...newRoute,
      areas: updatedAreas
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const createdRoute = await addNewRoute(newRoute)
      console.log("Route created successfully:", createdRoute)

      // Reset form and close modal
      setNewRoute({
        name: "",
        from: "",
        to: "",
        status: "active",
        areas: [],
        startTime: "07:30"
      })
      setIsModalOpen(false)

      // Show success message (in a real app, you might use a toast notification)
      alert("Route created successfully!")

    } catch (error) {
      console.error("Error creating route:", error)
      setError(error.message || "Failed to create route. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addNewRoute = async (routeData) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const schoolId = userData?.school;

    if (!schoolId) {
      throw new Error("School ID not found in user data");
    }

    try {
      const response = await fetch(`http://145.223.20.218:2002/api/route/addroute/${schoolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          routeName: routeData.name,
          startPoint: routeData.from,
          endPoint: routeData.to,
          areas: routeData.areas,
          startTime: routeData.startTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add route')
      }

      fetchRoutes()

      return await response.json()
    } catch (error) {
      console.error('Error adding route:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-[6cm]">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-[6cm]">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">485</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-[6cm]">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900">42 min</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-[6cm]">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-xl">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Distance</p>
                <p className="text-2xl font-bold text-gray-900">156 km</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Route</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">{filteredRoutes.length} routes found</span>
          </div>
        </div>
      </div>

      {/* Route Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div
            key={route._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{route.routeName}</h3>
                <p className="text-gray-600 text-sm">{route.startPoint} to {route.endPoint}</p>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(route.isActive)}`}>
  {route.isActive ? "Active" : "Inactive"}
</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">0 students</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{route.areas?.length || 0} stops</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">-- min</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">-- km</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Areas:</span>
                <div className="text-sm text-gray-900 max-w-[13cm]">
                  {route.areas?.map(a => a.areaName).join(", ")}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 text-green-600 hover:bg-green-50 rounded-xl">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Route</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Point</label>
                  <input
                    type="text"
                    value={newRoute.from}
                    onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Point</label>
                  <input
                    type="text"
                    value={newRoute.to}
                    onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={newRoute.startTime}
                  onChange={(e) => setNewRoute({ ...newRoute, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex items-center">
                <label className="block text-sm font-medium text-gray-700 mr-3">Status</label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRoute.status === "active"}
                    onChange={(e) => setNewRoute({
                      ...newRoute,
                      status: e.target.checked ? "active" : "inactive"
                    })}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {newRoute.status === "active" ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Areas</label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentArea}
                    onChange={(e) => setCurrentArea(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddArea()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add area"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600"
                  >
                    Add
                  </button>
                </div>

                {newRoute.areas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newRoute.areas.map((area, index) => (
                      <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(index)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Route"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteManagement