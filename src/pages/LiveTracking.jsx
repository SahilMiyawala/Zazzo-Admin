"use client"

import { useState } from "react"
import { MapPin, Bus, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react"

const LiveTracking = () => {
  const [selectedBus, setSelectedBus] = useState(null)

  const buses = [
    {
      id: 1,
      number: "BUS-001",
      driver: "John Smith",
      route: "Route A",
      status: "on_route",
      location: "Main Street & 5th Ave",
      students: 42,
      capacity: 45,
      speed: 25,
      eta: "8:15 AM",
      lastUpdate: "2 min ago",
    },
    {
      id: 2,
      number: "BUS-002",
      driver: "Sarah Johnson",
      route: "Route B",
      status: "at_school",
      location: "Pine Road Elementary",
      students: 38,
      capacity: 40,
      speed: 0,
      eta: "Arrived",
      lastUpdate: "1 min ago",
    },
    {
      id: 3,
      number: "BUS-003",
      driver: "Mike Wilson",
      route: "Route C",
      status: "delayed",
      location: "Oak Avenue (Traffic)",
      students: 35,
      capacity: 50,
      speed: 5,
      eta: "8:25 AM",
      lastUpdate: "30 sec ago",
    },
    {
      id: 4,
      number: "BUS-004",
      driver: "Emily Davis",
      route: "Route D",
      status: "on_route",
      location: "Cedar Lane & Park St",
      students: 29,
      capacity: 45,
      speed: 30,
      eta: "8:10 AM",
      lastUpdate: "1 min ago",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "on_route":
        return "bg-blue-100 text-blue-800"
      case "at_school":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "on_route":
        return <Bus className="w-4 h-4" />
      case "at_school":
        return <CheckCircle className="w-4 h-4" />
      case "delayed":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bus className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Bus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-gray-900">38</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Students Onboard</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Speed</p>
                <p className="text-2xl font-bold text-gray-900">28 km/h</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Updates</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Map</h3>
          <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Interactive map would be integrated here</p>
              <p className="text-sm text-gray-400 mt-2">Showing real-time bus locations and routes</p>
            </div>
          </div>
        </div>

        {/* Bus List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Buses</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedBus === bus.id ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                onClick={() => setSelectedBus(bus.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{bus.number}</h4>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bus.status)}`}
                  >
                    {getStatusIcon(bus.status)}
                    <span>{bus.status.replace("_", " ")}</span>
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{bus.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Driver: {bus.driver}</span>
                    <span>{bus.route}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>
                      Students: {bus.students}/{bus.capacity}
                    </span>
                    <span>ETA: {bus.eta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Speed: {bus.speed} km/h</span>
                    <span className="text-xs text-gray-400">{bus.lastUpdate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Bus Details */}
      {selectedBus && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bus Details - {buses.find((b) => b.id === selectedBus)?.number}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Route Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.route}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Location:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ETA:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.eta}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Driver & Capacity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students Onboard:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.capacity}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Performance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Speed:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-gray-900">
                    {buses.find((b) => b.id === selectedBus)?.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="text-gray-900">{buses.find((b) => b.id === selectedBus)?.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveTracking
