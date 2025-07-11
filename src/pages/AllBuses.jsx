import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Eye, Bus, ChevronLeft, ChevronRight } from "lucide-react";

const AllBuses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    busNumber: "",
    capacity: "",
    driverName: "",
    driverPhone: "",
    route: "",
  });
  const [editingBus, setEditingBus] = useState({
    _id: "",
    busNumber: "",
    capacity: "",
    driverName: "",
    driverPhone: "",
    route: "",
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBuses, setTotalBuses] = useState(0);
  const [limit, setLimit] = useState(10);

  // Get vendorId from localStorage
  const vendorId = localStorage.getItem("vendorId") || "686fa93c99634da41589ec8f";
  const token = localStorage.getItem("token");

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://145.223.20.218:2002/api/vendor/getbuses/${vendorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch buses");
      }
      
      const data = await response.json();
      setBuses(data.data || []);
      setTotalBuses(data.data ? data.data.length : 0);
      setTotalPages(Math.ceil((data.data ? data.data.length : 0) / limit));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [vendorId, token]);

  const addBus = async (busData) => {
    try {
      const response = await fetch("http://145.223.20.218:2002/api/bus/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...busData, vendorId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add bus");
      }

      await fetchBuses();
      return await response.json();
    } catch (error) {
      console.error("Error adding bus:", error);
      throw error;
    }
  };

  const updateBus = async (busId, busData) => {
    try {
      const response = await fetch(`http://145.223.20.218:2002/api/bus/update/${busId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(busData),
      });

      if (!response.ok) {
        throw new Error("Failed to update bus");
      }

      await fetchBuses();
      return await response.json();
    } catch (error) {
      console.error("Error updating bus:", error);
      throw error;
    }
  };

  const deleteBus = async (busId) => {
    try {
      const response = await fetch(`http://145.223.20.218:2002/api/bus/delete/${busId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete bus");
      }

      await fetchBuses();
    } catch (error) {
      console.error("Error deleting bus:", error);
      throw error;
    }
  };

  const toggleBusStatus = async (busId) => {
    try {
      const response = await fetch(`http://145.223.20.218:2002/api/bus/toggle-status/${busId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle bus status");
      }

      await fetchBuses();
    } catch (error) {
      console.error("Error toggling bus status:", error);
      throw error;
    }
  };

  const handleEditClick = (bus) => {
    setEditingBus(bus);
    setIsEditModalOpen(true);
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch = 
      bus.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.capacity?.toString().includes(searchTerm);
    return matchesSearch;
  });

  const paginatedBuses = filteredBuses.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header with stats cards and add button */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 md:gap-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {[
            { label: "Total Buses", count: totalBuses, color: "blue" },
            { label: "Active Buses", count: buses.filter((b) => b.isActive).length, color: "green" },
            { label: "Inactive Buses", count: buses.filter((b) => !b.isActive).length, color: "red" },
            { label: "Total Capacity", count: buses.reduce((sum, b) => sum + (b.capacity || 0), 0), color: "purple" },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`p-2 ${
                  card.color === 'blue' ? 'bg-blue-100' : 
                  card.color === 'green' ? 'bg-green-100' : 
                  card.color === 'red' ? 'bg-red-100' : 'bg-purple-100'
                } rounded-xl`}>
                  <Bus className={`w-6 h-6 ${
                    card.color === 'blue' ? 'text-blue-600' : 
                    card.color === 'green' ? 'text-green-600' : 
                    card.color === 'red' ? 'text-red-600' : 'text-purple-600'
                  }`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Bus Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span>Add Bus</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full md:w-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search buses..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-300 text-black border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Sr. No</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Bus Number</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Capacity</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Driver Name</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Driver Phone</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Route</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Change Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedBuses.map((bus, index) => (
                <tr key={bus._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {bus.busNumber ? bus.busNumber.slice(0, 2) : "BU"}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 text-center">
                          {bus.busNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {bus.capacity || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {bus.driverName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {bus.driverPhone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {bus.route || "N/A"}
                  </td>
                  
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={async () => {
                        try {
                          await toggleBusStatus(bus._id);
                        } catch (error) {
                          alert("Failed to change bus status.");
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        bus.isActive ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          bus.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bus.isActive)}`}>
                      {bus.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-center">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(bus)} 
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this bus?")) {
                            try {
                              await deleteBus(bus._id);
                            } catch (error) {
                              alert("Failed to delete bus.");
                            }
                          }
                        }}
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

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select 
            value={limit} 
            onChange={handleLimitChange} 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, filteredBuses.length)} of {filteredBuses.length} entries
          </span>
          <div className="flex space-x-1">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              className={`p-1 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, Math.ceil(filteredBuses.length / limit)) }, (_, i) => {
              const totalPagesForFiltered = Math.ceil(filteredBuses.length / limit);
              let pageNum;
              if (totalPagesForFiltered <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPagesForFiltered - 2) {
                pageNum = totalPagesForFiltered - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button 
                  key={pageNum} 
                  onClick={() => handlePageChange(pageNum)} 
                  className={`w-8 h-8 rounded-md ${
                    currentPage === pageNum ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === Math.ceil(filteredBuses.length / limit)} 
              className={`p-1 rounded-md ${
                currentPage === Math.ceil(filteredBuses.length / limit) ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Bus Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Bus</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Bus Number" 
                value={newBus.busNumber} 
                onChange={(e) => setNewBus({ ...newBus, busNumber: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Capacity" 
                value={newBus.capacity} 
                onChange={(e) => setNewBus({ ...newBus, capacity: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Driver Name" 
                value={newBus.driverName} 
                onChange={(e) => setNewBus({ ...newBus, driverName: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Driver Phone" 
                value={newBus.driverPhone} 
                onChange={(e) => setNewBus({ ...newBus, driverPhone: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Route" 
                value={newBus.route} 
                onChange={(e) => setNewBus({ ...newBus, route: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await addBus(newBus);
                    setIsModalOpen(false);
                    setNewBus({
                      busNumber: "",
                      capacity: "",
                      driverName: "",
                      driverPhone: "",
                      route: "",
                    });
                  } catch (error) {
                    alert("Failed to add bus.");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Bus</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Bus Number" 
                value={editingBus.busNumber} 
                onChange={(e) => setEditingBus({ ...editingBus, busNumber: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="number" 
                placeholder="Capacity" 
                value={editingBus.capacity} 
                onChange={(e) => setEditingBus({ ...editingBus, capacity: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Driver Name" 
                value={editingBus.driverName} 
                onChange={(e) => setEditingBus({ ...editingBus, driverName: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Driver Phone" 
                value={editingBus.driverPhone} 
                onChange={(e) => setEditingBus({ ...editingBus, driverPhone: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
              <input 
                type="text" 
                placeholder="Route" 
                value={editingBus.route} 
                onChange={(e) => setEditingBus({ ...editingBus, route: e.target.value })} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateBus(editingBus._id, editingBus);
                    setIsEditModalOpen(false);
                  } catch (error) {
                    alert("Failed to update bus.");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Update Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBuses;