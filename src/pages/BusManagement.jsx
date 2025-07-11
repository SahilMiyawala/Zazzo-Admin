import { useState, useEffect } from "react"
import { Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Users } from "lucide-react"

const BusManagement = () => {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const token = localStorage.getItem('token')

  // State for buses data
  const [buses, setBuses] = useState([])
  const [totalBusses, setTotalBusses] = useState(0);
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState([])

  // State for add bus modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    driver: "",
    conductor: "",
    route: "",
    vendor: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // State for edit bus modal
  const [showEditModal, setShowEditModal] = useState(false)
  const [editBusId, setEditBusId] = useState("")
  const [editFormData, setEditFormData] = useState({
    busNumber: "",
    capacity: "",
    driver: "",
    conductor: "",
    route: "",
    vendor: ""
  })
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [editError, setEditError] = useState("")
  const [isLoadingBusData, setIsLoadingBusData] = useState(false)

  // Fetch vendors data
  const fetchVendors = async () => {
    try {
      const response = await fetch('http://145.223.20.218:2002/api/vendor/getall', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch vendors')
      }
      const data = await response.json()
      setVendors(data.data.vendors || [])
    } catch (err) {
      console.error('Error fetching vendors:', err)
    }
  }

  // Fetch buses data
  const fetchBuses = async () => {
    try {
      const response = await fetch('http://145.223.20.218:2002/api/bus/getbuses/684a819ea8c7f1bdd04732f8', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch buses')
      }
      const data = await response.json()
      setBuses(data.data.buses)
      setTotalBusses(data.data.buses.length)
    } catch (err) {
      console.error('Error fetching buses:', err)
      setError('Failed to load buses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
    fetchBuses()
  }, [])

  // Helper function for status colors
  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  // Helper function to get status text
  const getStatusText = (isActive) => {
    return isActive ? "active" : "inactive"
  }

  // Filter buses based on search and status
  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bus.driver?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bus.route?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bus.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle vendor selection
  const handleVendorSelect = (e) => {
    const vendorId = e.target.value
    setFormData(prev => ({
      ...prev,
      vendor: vendorId
    }))
  }

  // Handle vendor selection in edit
  const handleEditVendorSelect = (e) => {
    const vendorId = e.target.value
    setEditFormData(prev => ({
      ...prev,
      vendor: vendorId
    }))
  }

  // Fetch particular bus data for editing
  const fetchBusData = async (busId) => {
    setIsLoadingBusData(true)
    setEditError("")
    try {
      const response = await fetch(`http://145.223.20.218:2002/api/bus/get/${busId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bus data')
      }

      const data = await response.json()
      const busData = data.data || data

      setEditFormData({
        busNumber: busData.busNumber || "",
        capacity: busData.capacity?.toString() || "",
        driver: busData.driver?._id || busData.driver || "",
        conductor: busData.conductor?._id || busData.conductor || "",
        route: busData.route || "",
        vendor: busData.vendor?._id || busData.vendor || ""
      })
    } catch (err) {
      setEditError(err.message || 'Failed to load bus data. Please try again.')
    } finally {
      setIsLoadingBusData(false)
    }
  }

  // Handle edit button click
  const handleEditClick = async (busId) => {
    setEditBusId(busId)
    setShowEditModal(true)
    await fetchBusData(busId)
  }

  // Handle form submission
  const handleAddBus = async () => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch('http://145.223.20.218:2002/api/bus/register-bus/684a819ea8c7f1bdd04732f8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          busNumber: formData.busNumber,
          capacity: parseInt(formData.capacity),
          driver: formData.driver,
          conductor: formData.conductor,
          route: formData.route,
          vendor: formData.vendor
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add bus')
      }

      fetchBuses()

      // Close modal and reset form
      setShowAddModal(false)
      setFormData({
        busNumber: "",
        capacity: "",
        driver: "",
        conductor: "",
        route: "",
        vendor: ""
      })

    } catch (err) {
      setError(err.message || 'Failed to add bus. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit form submission
  const handleEditBus = async () => {
    setIsEditSubmitting(true)
    setEditError("")

    try {
      const response = await fetch(`http://145.223.20.218:2002/api/bus/update-bus/${editBusId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          busNumber: editFormData.busNumber,
          capacity: parseInt(editFormData.capacity),
          driver: editFormData.driver,
          conductor: editFormData.conductor,
          route: editFormData.route,
          vendor: editFormData.vendor
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update bus')
      }

      fetchBuses()

      // Close modal and reset form
      setShowEditModal(false)
      setEditFormData({
        busNumber: "",
        capacity: "",
        driver: "",
        conductor: "",
        route: "",
        vendor: ""
      })
      setEditBusId("")

    } catch (err) {
      setEditError(err.message || 'Failed to update bus. Please try again.')
    } finally {
      setIsEditSubmitting(false)
    }
  }

  // Add this function to handle status toggle
  const handleToggleStatus = async (busId, newStatus) => {
    try {
      const response = await fetch(`http://145.223.20.218:2002/api/user/active-inactive/${busId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update bus status');
      }

      // Update local state to reflect the change
      setBuses(prev =>
        prev.map(bus =>
          bus._id === busId ? { ...bus, isActive: newStatus } : bus
        )
      );
    } catch (err) {
      console.error('Error updating bus status:', err);
    }
  };

  // delete function
  const deleteBus = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const response = await fetch(`http://145.223.20.218:2002/api/user/delete/${busId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete bus');
      }

      fetchBuses()
      alert('Bus deleted successfully!');
    } catch (err) {
      console.error('Error deleting bus:', err);
      alert('Failed to delete bus. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 md:gap-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {[
            { label: "Total Buses", count: totalBusses, color: "blue" },
            { label: "Active Buses", count: buses.filter((c) => c.isActive).length, color: "green" },
            { label: "Inactive Buses", count: buses.filter((c) => !c.isActive).length, color: "red" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`p-2 bg-${card.color}-100 rounded-xl`}>
                  <Users className={`w-6 h-6 text-${card.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Bus Button - fixed width */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Bus</span>
        </button>
      </div>

      {/* Filters - takes available space */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full md:w-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Search and Status Filter */}
          <div className="flex flex-col md:flex-row md:items-center flex-1 gap-10">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search buses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter count */}
          <div className="flex items-center justify-end md:justify-start space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {filteredBuses.length} buses found
            </span>
          </div>
        </div>
      </div>

      {/* Bus List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading buses...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-400 text-black border-b border-gray-200">
                <tr className="text-center">
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Bus Number
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Conductor
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Change Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {filteredBuses.map((bus) => (
                  <tr key={bus._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bus.busNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bus.capacity} seats</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bus.driver?.name || 'N/A'}
                        {bus.driver?.email && (
                          <div className="text-xs text-gray-500">{bus.driver.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bus.conductor?.name || 'N/A'}
                        {bus.conductor?.email && (
                          <div className="text-xs text-gray-500">{bus.conductor.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {bus.vendor?.name || 'N/A'}
                        {bus.vendor?.email && (
                          <div className="text-xs text-gray-500">{bus.vendor.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bus.route || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center items-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bus.isActive}
                            onChange={() => handleToggleStatus(bus._id, !bus.isActive)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bus.isActive)}`}
                      >
                        {getStatusText(bus.isActive)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(bus._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBus(bus._id)}
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
        )}
      </div>

      {/* Add Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Bus</h3>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number</label>
                <input
                  type="text"
                  name="busNumber"
                  value={formData.busNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="GJ-01-2323"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="20"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver ID</label>
                <input
                  type="text"
                  name="driver"
                  value={formData.driver}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="684bc66ba8c7f1bdd04738c8"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conductor ID</label>
                <input
                  type="text"
                  name="conductor"
                  value={formData.conductor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="684bd3f4a8c7f1bdd0473b04"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleVendorSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name} ({vendor.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Route description"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setError("")
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddBus}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add Bus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Bus</h3>
            {editError && <div className="text-red-500 mb-4">{editError}</div>}

            {isLoadingBusData ? (
              <div className="text-center py-4">Loading bus data...</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number</label>
                  <input
                    type="text"
                    name="busNumber"
                    value={editFormData.busNumber}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="GJ-01-2323"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={editFormData.capacity}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver ID</label>
                  <input
                    type="text"
                    name="driver"
                    value={editFormData.driver}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="684bc66ba8c7f1bdd04738c8"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conductor ID</label>
                  <input
                    type="text"
                    name="conductor"
                    value={editFormData.conductor}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="684bd3f4a8c7f1bdd0473b04"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <select
                    name="vendor"
                    value={editFormData.vendor}
                    onChange={handleEditVendorSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name} ({vendor.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                  <input
                    type="text"
                    name="route"
                    value={editFormData.route}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Route description"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditError("")
                      setEditBusId("")
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                    disabled={isEditSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEditBus}
                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-shadow"
                    disabled={isEditSubmitting}
                  >
                    {isEditSubmitting ? 'Updating...' : 'Update Bus'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BusManagement