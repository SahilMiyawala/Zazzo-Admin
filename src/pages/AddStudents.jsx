"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Search, Filter, Edit, Trash2, Eye, Users, ChevronLeft, ChevronRight, Upload } from "lucide-react"

const AddStudents = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    parentData: {
      email: "",
      dob: "",
      fatherName: "",
      motherName: "",
      fatherMobile: "",
      motherMobile: "",
      address: "",
      pinCode: "",
      shift: "",
    },
    studentData: {
      firstName: "",
      lastName: "",
      dob: "",
      class: "",
      section: "",
      rollNumber: "",
      shift: "",
      bloodGroup: "",
      isActive: true,
    }
  })

  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [limit, setLimit] = useState(10)

  // Excel upload states
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null)

  const token = localStorage.getItem("token")

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `http://145.223.20.218:2002/api/student/studentlist/684a819ea8c7f1bdd04732f8?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setStudents(response.data.data.students)
      setTotalPages(response.data.data.totalPages)
      setTotalStudents(response.data.data.total)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching students:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [currentPage, limit, searchTerm])

  const registerStudent = async () => {
    try {
      const endpoint = isEditMode
        ? `http://145.223.20.218:2002/api/student/edit-student/${formData.studentData._id}`
        : "http://145.223.20.218:2002/api/student/add-student/684a819ea8c7f1bdd04732f8"

      const method = isEditMode ? "put" : "post"

      const response = await axios[method](
        endpoint,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Refresh the students list
      await fetchStudents()

      setIsModalOpen(false)
      resetForm()
      alert(`Student ${isEditMode ? 'updated' : 'added'} successfully!`)

      return response.data
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} student:`, error)
      throw error
    }
  }

  const deleteStudent = async (parentId, studentId) => {
    try {
      await axios.delete(`http://145.223.20.218:2002/api/student/delete-student/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchStudents(); // Refresh the students list after deletion
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    // Handle both Date objects and ISO strings
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (studentId) => {
    const student = students.find(s => s._id === studentId);
    if (!student) {
      alert("Student not found");
      return;
    }

    setFormData({
      parentData: {
        email: student.parent?.email || "",
        dob: formatDateForInput(student.parent?.dob),
        fatherName: student.parent?.fatherName || "",
        motherName: student.parent?.motherName || "",
        fatherMobile: student.parent?.fatherMobile || "",
        motherMobile: student.parent?.motherMobile || "",
        address: student.parent?.address || "",
        pinCode: student.parent?.pinCode || "",
        shift: student.parent?.shift || student.shift || "",
      },
      studentData: {
        _id: student._id,
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        dob: formatDateForInput(student.dob),
        class: student.class || "",
        section: student.section || "",
        rollNumber: student.rollNumber || "",
        shift: student.shift || "",
        bloodGroup: student.bloodGroup || "",
        isActive: student.isActive || true,
      }
    });

    setIsEditMode(true);
    setIsModalOpen(true);
  };


  const handleToggleStatus = async (studentId, currentStatus) => {
    try {
      // First optimistically update the UI
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId ? { ...student, isActive: !currentStatus } : student
        ),
      )

      // Then make the API call
      await axios.put(
        `http://145.223.20.218:2002/api/user/active-inactive/${studentId}`,
        {}, // empty body since we're just toggling status
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

    } catch (error) {
      // If there's an error, revert the UI change
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId ? { ...student, isActive: currentStatus } : student
        ),
      )
      console.error("Error updating student status:", error)
      alert("Failed to update student status.")
    }
  }

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const filteredStudents = students.filter((student) => {
    if (!student) return false

    const matchesSearch =
      (student.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.class?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toString().includes(searchTerm)

    return matchesSearch
  })

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setCurrentPage(1)
  }

  const handleExcelUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      setUploadStatus(null)
      setUploadProgress(0)

      const response = await axios.post(
        "http://145.223.20.218:2002/api/student/excel-upload/684a819ea8c7f1bdd04732f8",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          },
        },
      )

      setUploadStatus("success")
      await fetchStudents()

      setTimeout(() => {
        setIsExcelModalOpen(false)
        setSelectedFile(null)
        setUploadProgress(0)
        setUploadStatus(null)
      }, 3000)
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadStatus("error")
    }
  }

  const resetForm = () => {
    setFormData({
      parentData: {
        email: "",
        dob: "",
        fatherName: "",
        motherName: "",
        fatherMobile: "",
        motherMobile: "",
        address: "",
        pinCode: "",
        shift: "",
      },
      studentData: {
        firstName: "",
        lastName: "",
        dob: "",
        class: "",
        section: "",
        rollNumber: "",
        shift: "",
        bloodGroup: "",
        isActive: true,
      }
    })
    setIsEditMode(false)
  }

  const handleParentChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      parentData: {
        ...prev.parentData,
        [name]: value
      },
      studentData: {
        ...prev.studentData,
        shift: name === 'shift' ? value : prev.studentData.shift
      }
    }))
  }

  const handleStudentChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      studentData: {
        ...prev.studentData,
        [name]: value
      }
    }))
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header with stats cards and action buttons */}
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 md:gap-10">
        {/* Stats Cards - now in a grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { label: "Total Students", count: totalStudents, color: "blue" },
            { label: "Active Students", count: students.filter((s) => s.isActive).length, color: "green" },
            { label: "Inactive Students", count: students.filter((s) => !s.isActive).length, color: "red" },
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

        {/* Action Buttons - fixed width */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap justify-center"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Excel</span>
          </button>
          <button
            onClick={() => {
              resetForm()
              setIsModalOpen(true)
            }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2 whitespace-nowrap justify-center"
          >
            <Plus className="w-5 h-5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters - takes available space */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 w-full md:w-auto flex-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
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
              {filteredStudents.length} students found
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-max">
            <thead className="bg-primary-400 text-black border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  Sr. No
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  First Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  Last Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  class
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  section
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  roll Number
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  blood Group
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  Shift
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[150px]">
                  Father Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[120px]">
                  Father Contact
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[150px]">
                  Mother Name
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[120px]">
                  Mother Contact
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[250px]">
                  Address
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[120px]">
                  Pin Code
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[200px]">
                  E-Mail
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                  Change Status
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[80px]">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.class}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.section}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.rollNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.bloodGroup}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.shift}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {student.parent?.fatherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {student.parent?.fatherMobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {student.parent?.motherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {student.parent?.motherMobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.parent?.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.parent?.pinCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{student.parent?.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleToggleStatus(student._id, student.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${student.isActive ? "bg-green-600" : "bg-gray-300"
                        }`}
                      title="Click to toggle status"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${student.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.isActive)}`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-center">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(student._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this student?")) {
                            try {
                              await deleteStudent(student.parent?._id, student._id);
                            } catch (error) {
                              alert("Failed to delete student.");
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
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalStudents)} of {totalStudents}{" "}
            entries
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
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-md ${currentPage === pageNum ? "bg-primary-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {pageNum}
                </button>
              )
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

      {/* Combined Add/Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Student" : "Add New Student"}</h2>

            {/* Parent Information Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father's Name"
                    value={formData.parentData.fatherName}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    name="motherName"
                    placeholder="Mother's Name"
                    value={formData.parentData.motherName}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Contact</label>
                  <input
                    type="tel"
                    name="fatherMobile"
                    placeholder="Father's Contact"
                    value={formData.parentData.fatherMobile}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Contact</label>
                  <input
                    type="tel"
                    name="motherMobile"
                    placeholder="Mother's Contact"
                    value={formData.parentData.motherMobile}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.parentData.address}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="Pin Code"
                    value={formData.parentData.pinCode}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.parentData.email}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Shift</label>
                  <select
                    name="shift"
                    value={formData.parentData.shift}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent DOB</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.parentData.dob}
                    onChange={handleParentChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Student Information Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Student Information</h3>
              </div>
              <div className="mb-4 border border-gray-200 rounded-lg p-4 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.studentData.firstName}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.studentData.lastName}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <input
                      type="text"
                      name="class"
                      placeholder="Class"
                      value={formData.studentData.class}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      name="section"
                      placeholder="Section"
                      value={formData.studentData.section}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                    <select
                      name="shift"
                      value={formData.studentData.shift}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Shift</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      placeholder="Roll Number"
                      value={formData.studentData.rollNumber}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.studentData.dob}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.studentData.bloodGroup}
                      onChange={(e) => handleStudentChange(e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={registerStudent}
                className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              >
                {isEditMode ? "Update Student" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center !mt-0">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Upload Students via Excel</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" id="excel-upload" accept=".xlsx, .xls, .csv" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
                <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2" >
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {selectedFile ? selectedFile.name : "Click to select Excel file (.xlsx, .xls, .csv)"}
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  )}
                </label>
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${uploadStatus === "error" ? "bg-red-500" : uploadStatus === "success" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: `${uploadProgress}%` }} ></div>
                </div>
              )}
              {uploadStatus === "success" && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">File uploaded successfully!</div>
              )}
              {uploadStatus === "error" && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  Error uploading file. Please try again.
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => { setIsExcelModalOpen(false), setSelectedFile(null), setUploadProgress(0), setUploadStatus(null) }} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100" >
                Cancel
              </button>
              <button onClick={handleExcelUpload} disabled={!selectedFile || uploadStatus === "success"} className={`px-4 py-2 rounded-lg text-white ${!selectedFile || uploadStatus === "success" ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`} >
                {uploadStatus === "success" ? "Uploaded" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddStudents