"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, Users } from "lucide-react"
import axios from "axios"

const DriverManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [drivers, setDrivers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentDriverId, setCurrentDriverId] = useState(null)
  const [totalDriver, setTotalDriver] = useState(0);
  const [driver, setDriver] = useState([])

  const [driverForm, setDriverForm] = useState({
    name: "",
    shift: "",
    email: "",
    mobile: ""
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchDrivers()
  }, [searchTerm, filterStatus])

  const fetchDrivers = async () => {
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 10,
        role: "DRIVER",
        search: searchTerm || "",
        status: filterStatus !== "all" ? filterStatus : "",
      })

      const response = await axios.get(
        `http://145.223.20.218:2002/api/user/getuserByschool/684a819ea8c7f1bdd04732f8?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = response.data?.data
      setTotalDriver(data.total);
      setDrivers(data.users || []);
      setTotalDriver(data.total)
      if (Array.isArray(data)) {
        setDrivers(data)
      } else if (Array.isArray(data?.users)) {
        setDrivers(data.users)
      } else {
        setDrivers([])
      }
    } catch (error) {
      console.error("Failed to fetch drivers:", error)
      setDrivers([])
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "on_leave":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredDrivers = Array.isArray(drivers)
    ? drivers.filter((driver) => {
      const matchesSearch =
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone?.includes(searchTerm)

      const matchesFilter = filterStatus === "all" || driver.status === filterStatus

      return matchesSearch && matchesFilter
    })
    : []

  const handleToggleStatus = async (driverId, newStatus) => {
    // http://145.223.20.218:2002/api/user/active-inactive/684bc66ba8c7f1bdd04738c8
    try {
      await axios.put(
        `http://145.223.20.218:2002/api/user/active-inactive/${driverId}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDrivers((prev) =>
        prev.map((driver) =>
          driver._id === driverId ? { ...driver, isActive: newStatus } : driver
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Status update failed.");
    }
  };

  // ADD NEW DRIVER
  const registerDriver = async (driverData) => {
    try {
      await axios.post(
        "http://145.223.20.218:2002/api/user/add-driver/684a819ea8c7f1bdd04732f8",
        driverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      alert("Driver added successfully!")
      fetchDrivers()
      return true
    } catch (error) {
      console.error("Failed to add driver:", error)
      throw error
    }
  }

  // EDIT DRIVER
  const editDriver = async (driverId, driverData) => {
    try {
      await axios.put(
        `http://145.223.20.218:2002/api/user/update-driver/${driverId}`,
        driverData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )
      alert("Driver updated successfully!")
      fetchDrivers()
      return true
    } catch (error) {
      console.error("Failed to update driver:", error)
      throw error
    }
  }

  // DELETE DRIVER
  const deleteDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete(
        `http://145.223.20.218:2002/api/user/delete/${driverId}`,  // Changed endpoint
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Driver deleted successfully!");
      fetchDrivers();
    } catch (error) {
      console.error("Failed to delete driver:", error);
      alert("Delete failed. Please try again.");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (driver) => {
    setDriverForm({
      name: driver.name,
      shift: driver.shift,
      email: driver.email,
      mobile: driver.mobile
    })
    setCurrentDriverId(driver._id)
    setIsEditMode(true)
    setIsModalOpen(true)
  }

  // HANDLE FORM SUBMIT
  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await editDriver(currentDriverId, driverForm)
      } else {
        await registerDriver(driverForm)
      }
      closeModal()
    } catch {
      alert(`Operation failed. Please try again.`)
    }
  }

  // CLOSE MODAL AND RESET FORM
  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setCurrentDriverId(null)
    setDriverForm({ name: "", shift: "", email: "", mobile: "" })
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {[
            { label: "Total Drivers", count: totalDriver, color: "blue" },
            { label: "Active Drivers", count: drivers.filter(d => d.isActive).length, color: "green" },
            { label: "Inactive Drivers", count: drivers.filter(d => !d.isActive).length, color: "red" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`p-2 ${card.color === 'blue' ? 'bg-blue-100' : card.color === 'green' ? 'bg-green-100' : 'bg-red-100'} rounded-xl`}>
                  <Users className={`w-6 h-6 ${card.color === 'blue' ? 'text-blue-600' : card.color === 'green' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Driver Button - fixed width */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Driver</span>
        </button>
      </div>
      {/* Filters - takes available space */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full md:w-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter count */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {filteredDrivers.length} drivers found
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-400 text-black border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Sr. No</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Phone</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Email</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Shift</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Role</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Change Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver, index) => (
                <tr key={driver.id || index} className="hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {driver.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 text-center">{driver.name || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900"></td> */}
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.mobile || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.email || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.shift || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.role || "N/A"}</td>
                  <td>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driver.isActive}
                        onChange={() => handleToggleStatus(driver._id, !driver.isActive)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(driver.isActive ? "active" : "inactive")}`}
                      >
                        {driver.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 justify-center">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(driver)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteDriver(driver._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Driver" : "Add New Driver"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={driverForm.name}
                onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Shift (e.g. Morning)"
                value={driverForm.shift}
                onChange={(e) => setDriverForm({ ...driverForm, shift: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={driverForm.email}
                onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Mobile"
                value={driverForm.mobile}
                onChange={(e) => setDriverForm({ ...driverForm, mobile: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg"
              >
                {isEditMode ? "Update Driver" : "Add Driver"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverManagement