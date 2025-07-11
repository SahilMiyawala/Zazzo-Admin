import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, Edit, Trash2, Eye, Users, ChevronLeft, ChevronRight } from "lucide-react";

const ConductorManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newConductor, setNewConductor] = useState({
        name: "",
        email: "",
        mobile: "",
        shift: "Morning" // Default to Morning shift
    });
    const [editingConductor, setEditingConductor] = useState({
        _id: "",
        name: "",
        email: "",
        mobile: "",
        shift: "Morning"
    });
    const [conductors, setConductors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalConductors, setTotalConductors] = useState(0);
    const [limit, setLimit] = useState(10);

    const token = localStorage.getItem("token");

    const fetchConductors = async () => {
        try {
            const response = await axios.get(
                `http://145.223.20.218:2002/api/user/getuserByschool/684a819ea8c7f1bdd04732f8?page=${currentPage}&limit=${limit}&search=${searchTerm}&role=CONDUCTOR`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConductors(response.data.data.users);
            setTotalPages(response.data.data.totalPages);
            setTotalConductors(response.data.data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conductors:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConductors();
    }, [currentPage, limit, searchTerm, token]);

    const addConductor = async (conductorData) => {
        try {
            const response = await axios.post(
                "http://145.223.20.218:2002/api/user/add-conductor/684a819ea8c7f1bdd04732f8",
                conductorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the conductors list after adding a new one
            const conductorsResponse = await axios.get(
                `http://145.223.20.218:2002/api/user/getuserByschool/684a819ea8c7f1bdd04732f8?page=${currentPage}&limit=${limit}&search=${searchTerm}&role=CONDUCTOR`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConductors(conductorsResponse.data.data.users);
            setTotalPages(conductorsResponse.data.data.totalPages);
            setTotalConductors(conductorsResponse.data.data.total);

            return response.data;
        } catch (error) {
            console.error("Error adding conductor:", error);
            throw error;
        }
    };

    const updateConductor = async (conductorId, conductorData) => {
        try {
            const response = await axios.put(
                `http://145.223.20.218:2002/api/user/update/${conductorId}`,
                conductorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the conductors list after updating
            const conductorsResponse = await axios.get(
                `http://145.223.20.218:2002/api/user/getuserByschool/683869f26a9429895cd17a15?page=${currentPage}&limit=${limit}&search=${searchTerm}&role=CONDUCTOR`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConductors(conductorsResponse.data.data.users);
            setTotalPages(conductorsResponse.data.data.totalPages);
            setTotalConductors(conductorsResponse.data.data.total);

            return response.data;
        } catch (error) {
            console.error("Error updating conductor:", error);
            throw error;
        }
    };

    const deleteConductor = async (conductorId) => {
        try {
            await axios.delete(
                `http://145.223.20.218:2002/api/user/delete/${conductorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchConductors()
            setConductors(conductorsResponse.data.data.users);
            setTotalPages(conductorsResponse.data.data.totalPages);
            setTotalConductors(conductorsResponse.data.data.total);
        } catch (error) {
            console.error("Error deleting conductor:", error);
            throw error;
        }
    };

    // New function to toggle conductor status
    const toggleConductorStatus = async (conductorId) => {
        // http://145.223.20.218:2002/api/user/active-inactive/684bfa73a8c7f1bdd0473c3b
        try {
            await axios.put(
                `http://145.223.20.218:2002/api/user/active-inactive/${conductorId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the conductors list after status change
            const conductorsResponse = await axios.get(
                `http://145.223.20.218:2002/api/user/getuserByschool/684a819ea8c7f1bdd04732f8?page=${currentPage}&limit=${limit}&search=${searchTerm}&role=CONDUCTOR`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setConductors(conductorsResponse.data.data.users);
            setTotalPages(conductorsResponse.data.data.totalPages);
            setTotalConductors(conductorsResponse.data.data.total);
        } catch (error) {
            console.error("Error toggling conductor status:", error);
            alert("Failed to change conductor status.");
        }
    };

    const handleEditClick = (conductor) => {
        setEditingConductor({
            _id: conductor._id,
            name: conductor.name,
            email: conductor.email,
            mobile: conductor.mobile,
            shift: conductor.shift || "Morning"
        });
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    const filteredConductors = conductors.filter((conductor) => {
        const matchesSearch = conductor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conductor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conductor.mobile.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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
                {/* Stats Cards - now in a grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
                    {[
                        { label: "Total Conductors", count: totalConductors, color: "blue" },
                        { label: "Active Conductors", count: conductors.filter((c) => c.isActive).length, color: "green" },
                        { label: "Inactive Conductors", count: conductors.filter((c) => !c.isActive).length, color: "red" },
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

                {/* Add Conductor Button - fixed width */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Conductor</span>
                </button>
            </div>

            {/* Filters - takes available space */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full md:w-auto flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    {/* Search Input */}
                    <div className="relative min-w-[200px] flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search conductors..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter count */}
                    <div className="flex items-center justify-end md:justify-start space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                            {filteredConductors.length} conductors found
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
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">E-Mail</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Mobile</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Shift</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Change Status</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredConductors.map((conductor, index) => (
                                <tr key={conductor._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {conductor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 text-center">{conductor.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{conductor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{conductor.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{conductor.shift || "Morning"}</td>
                                    <td className="px-8 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => toggleConductorStatus(conductor._id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:opacity-80 ${conductor.isActive ? 'bg-green-600' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${conductor.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(conductor.isActive)}`}>
                                            {conductor.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(conductor)}
                                                className="text-green-600 hover:text-green-900">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Are you sure you want to delete this conductor?")) {
                                                        try {
                                                            await deleteConductor(conductor._id); // Passing the conductor ID
                                                        } catch (error) {
                                                            alert("Failed to delete conductor.");
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
                        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalConductors)} of {totalConductors} entries
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-8 h-8 rounded-md ${currentPage === pageNum ? "bg-primary-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-1 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Conductor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add New Conductor</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newConductor.name}
                                onChange={(e) => setNewConductor({ ...newConductor, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newConductor.email}
                                onChange={(e) => setNewConductor({ ...newConductor, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={newConductor.mobile}
                                onChange={(e) => setNewConductor({ ...newConductor, mobile: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <select
                                value={newConductor.shift}
                                onChange={(e) => setNewConductor({ ...newConductor, shift: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </select>
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
                                        await addConductor(newConductor);
                                        setIsModalOpen(false);
                                        setNewConductor({
                                            name: "",
                                            email: "",
                                            mobile: "",
                                            shift: "Morning"
                                        });
                                    } catch (error) {
                                        alert("Failed to add conductor.");
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                            >
                                Add Conductor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Conductor Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Conductor</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={editingConductor.name}
                                onChange={(e) => setEditingConductor({ ...editingConductor, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editingConductor.email}
                                onChange={(e) => setEditingConductor({ ...editingConductor, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={editingConductor.mobile}
                                onChange={(e) => setEditingConductor({ ...editingConductor, mobile: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <select
                                value={editingConductor.shift}
                                onChange={(e) => setEditingConductor({ ...editingConductor, shift: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </select>
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
                                        await updateConductor(editingConductor._id, editingConductor);
                                        setIsEditModalOpen(false);
                                    } catch (error) {
                                        alert("Failed to update conductor.");
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                            >
                                Update Conductor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConductorManagement;