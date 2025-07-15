import React, { useEffect, useState } from "react";
import {
    Plus, Search, Filter, Eye, Edit, Trash2, Building2, ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSchool, setNewSchool] = useState({ schoolName: "", email: "", phoneNumber: "" });
    const [token, setToken] = useState(null);
    const [vendorId, setVendorId] = useState(null);
 const navigate = useNavigate();

    // Load token and vendor ID from localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const storedToken = localStorage.getItem("token");

        if (user && storedToken) {
            setVendorId(user._id);
            setToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    // Fetch schools from API
    useEffect(() => {
        if (vendorId && token) {
            fetchSchools(token);
        }
    }, [vendorId, token]);

    const fetchSchools = async (authToken) => {
        try {
            const response = await fetch(`http://145.223.20.218:2002/api/vendor/getschools/${vendorId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await response.json();
            setSchools(data.data?.schools || []);
        } catch (err) {
            console.error("Error fetching schools:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSchools = schools.filter((school) =>
        school.schoolName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedSchools = filteredSchools.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= Math.ceil(filteredSchools.length / limit)) {
            setCurrentPage(newPage);
        }
    };

    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-lg text-gray-700">Loading schools...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-in p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 md:gap-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
                        <div className="bg-blue-100 p-2 rounded-xl">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Schools</p>
                            <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap w-full md:w-auto justify-center"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add School</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search schools..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <span>{filteredSchools.length} schools found</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-yellow-300 text-black border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">Sr. No</th>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">School Name</th>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">Email</th>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">Phone</th>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">Address</th>
                            <th className="px-6 py-3 text-xs font-medium uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedSchools.map((school, index) => (
                            <tr key={school._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-center">{(currentPage - 1) * limit + index + 1}</td>
                                <td className="px-6 py-4 text-center text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{school.schoolName || "N/A"}</td>
                                <td className="px-6 py-4 text-center">{school.email || "N/A"}</td>
                                <td className="px-6 py-4 text-center">{school.phoneNumber || "N/A"}</td>
                                <td className="px-6 py-4 text-center text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                    {school.address || "N/A"}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            className="text-blue-600 hover:text-blue-900"
                                         onClick={() => navigate(`/SchoolsStudentlist`)}

                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                                        <button className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, filteredSchools.length)} of {filteredSchools.length} entries
                    </span>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        {Array.from({ length: Math.ceil(filteredSchools.length / limit) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-8 h-8 rounded-md ${currentPage === i + 1 ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredSchools.length / limit)}
                            className={`p-1 rounded-md ${currentPage === Math.ceil(filteredSchools.length / limit) ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Add School (Optional for now) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Add New School</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="School Name"
                                value={newSchool.schoolName}
                                onChange={(e) => setNewSchool({ ...newSchool, schoolName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                value={newSchool.email}
                                onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={newSchool.phoneNumber}
                                onChange={(e) => setNewSchool({ ...newSchool, phoneNumber: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                                onClick={() => {
                                    alert("Add school logic not implemented.");
                                    setIsModalOpen(false);
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Add School
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolList;
