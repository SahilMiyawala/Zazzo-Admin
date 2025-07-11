import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Search, Filter, Edit, Trash2, Eye, Users, ChevronLeft, ChevronRight } from "lucide-react";

const VendorManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
        shift: "Morning",
        address: "",
        pincode: "",
        role: "VENDOR"
    });
    const [editingVendor, setEditingVendor] = useState({
        _id: "",
        name: "",
        email: "",
        password: "",
        mobile: "",
        shift: "Morning",
        address: "",
        pincode: "",
        role: "VENDOR"
    });
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalVendors, setTotalVendors] = useState(0);
    const [limit, setLimit] = useState(10);

    const token = localStorage.getItem("token");

    const fetchVendors = async () => {
        try {
            const response = await axios.get(
                `http://145.223.20.218:2002/api/vendor/getall?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setVendors(response.data.data.vendors);
            setTotalVendors(response.data.data.total);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching vendors:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, [currentPage, limit, searchTerm, token]);

    const addVendor = async (vendorData) => {
        try {
            const response = await axios.post(
                "http://145.223.20.218:2002/api/user/add-vendor",
                vendorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the vendors list after adding a new one
            fetchVendors();
            return response.data;
        } catch (error) {
            console.error("Error adding vendor:", error);
            throw error;
        }
    };

    const updateVendor = async (vendorId, vendorData) => {
        try {
            const response = await axios.put(
                `http://145.223.20.218:2002/api/vendor/update/${vendorId}`,
                vendorData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the vendors list after updating
            fetchVendors();
            return response.data;
        } catch (error) {
            console.error("Error updating vendor:", error);
            throw error;
        }
    };

    const deleteVendor = async (vendorId) => {
        try {
            await axios.delete(
                `http://145.223.20.218:2002/api/vendor/delete/${vendorId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchVendors();
        } catch (error) {
            console.error("Error deleting vendor:", error);
            throw error;
        }
    };

    const toggleVendorStatus = async (vendorId) => {
        try {
            await axios.put(
                `http://145.223.20.218:2002/api/vendor/active-inactive/${vendorId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Refresh the vendors list after status change
            fetchVendors();
        } catch (error) {
            console.error("Error toggling vendor status:", error);
            alert("Failed to change vendor status.");
        }
    };

    const handleEditClick = (vendor) => {
        setEditingVendor({
            _id: vendor._id,
            name: vendor.name,
            email: vendor.email,
            password: vendor.password,
            mobile: vendor.mobile,
            shift: vendor.shift || "Morning",
            address: vendor.address || "",
            pincode: vendor.pincode || "",
            role: vendor.role || "VENDOR"
        });
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
    };

    const filteredVendors = vendors.filter((vendor) => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vendor.address && vendor.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (vendor.pincode && vendor.pincode.toLowerCase().includes(searchTerm.toLowerCase()));
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
                        { label: "Total Vendors", count: totalVendors, color: "blue" },
                        { label: "Active Vendors", count: vendors.filter((v) => v.isActive).length, color: "green" },
                        { label: "Inactive Vendors", count: vendors.filter((v) => !v.isActive).length, color: "red" },
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

                {/* Add Vendor Button - fixed width */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Vendor</span>
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
                            placeholder="Search vendors..."
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
                            {filteredVendors.length} vendors found
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
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Address</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Pincode</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Shift</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Change Status</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredVendors.map((vendor, index) => (
                                <tr key={vendor._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {vendor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 text-center">{vendor.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{vendor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{vendor.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{vendor.address || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{vendor.pincode || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{vendor.shift || "Morning"}</td>
                                    <td className="px-8 py-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => toggleVendorStatus(vendor._id)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:opacity-80 ${vendor.isActive ? 'bg-green-600' : 'bg-gray-200'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${vendor.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap text-center">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendor.isActive)}`}>
                                            {vendor.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(vendor)}
                                                className="text-green-600 hover:text-green-900">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Are you sure you want to delete this vendor?")) {
                                                        try {
                                                            await deleteVendor(vendor._id);
                                                        } catch (error) {
                                                            alert("Failed to delete vendor.");
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
                        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalVendors)} of {totalVendors} entries
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {Array.from({ length: Math.min(5, Math.ceil(totalVendors / limit)) }, (_, i) => {
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
                            disabled={currentPage === Math.ceil(totalVendors / limit)}
                            className={`p-1 rounded-md ${currentPage === Math.ceil(totalVendors / limit) ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Vendor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add New Vendor</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newVendor.name}
                                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newVendor.email}
                                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Password"
                                value={newVendor.password}
                                onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={newVendor.mobile}
                                onChange={(e) => setNewVendor({ ...newVendor, mobile: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={newVendor.address}
                                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={newVendor.pincode}
                                onChange={(e) => setNewVendor({ ...newVendor, pincode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <select
                                value={newVendor.shift}
                                onChange={(e) => setNewVendor({ ...newVendor, shift: e.target.value })}
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
                                        await addVendor(newVendor);
                                        setIsModalOpen(false);
                                        setNewVendor({
                                            name: "",
                                            email: "",
                                            mobile: "",
                                            shift: "Morning",
                                            address: "",
                                            pincode: "",
                                            role: "VENDOR"
                                        });
                                    } catch (error) {
                                        alert("Failed to add vendor.");
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                            >
                                Add Vendor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Vendor Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Vendor</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={editingVendor.name}
                                onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editingVendor.email}
                                onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={editingVendor.mobile}
                                onChange={(e) => setEditingVendor({ ...editingVendor, mobile: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={editingVendor.address}
                                onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={editingVendor.pincode}
                                onChange={(e) => setEditingVendor({ ...editingVendor, pincode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <select
                                value={editingVendor.shift}
                                onChange={(e) => setEditingVendor({ ...editingVendor, shift: e.target.value })}
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
                                        await updateVendor(editingVendor._id, editingVendor);
                                        setIsEditModalOpen(false);
                                    } catch (error) {
                                        alert("Failed to update vendor.");
                                    }
                                }}
                                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                            >
                                Update Vendor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;