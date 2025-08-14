import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { FOOD_TYPES, FOOD_CATEGORIES } from "../../../common/foodEnums";

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    img: "",
    price: { org: "", mrp: "", off: 0 },
    type: "",
    category: [],
    inStock: "Yes",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchMenu = async (page = 1, category = "all") => {
    try {
      const res = await axios.get("/menu", {
        params: {
          page,
          limit: itemsPerPage,
          category: category === "all" ? undefined : category,
        },
      });
      // console.log(res.data.items);
      setMenu(res.data.items);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      // console.log("error fetching menu", err);
      toast.error("Error fetching menu");
    }
  };

  const uniqueCategories = [
    "all",
    ...new Set(menu.flatMap((item) => item.category)),
  ];

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    fetchMenu(1, cat);
  };

  const handleAdd = async () => {
    // Client-side validation
    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (!form.desc.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.img.trim()) {
      toast.error("Image URL is required");
      return;
    }
    if (!form.price.org || form.price.org <= 0) {
      toast.error("Valid selling price is required");
      return;
    }
    if (!form.type) {
      toast.error("Food type is required");
      return;
    }
    if (!form.category || form.category.length === 0) {
      toast.error("At least one category is required");
      return;
    }

    // Validate image URL format
    const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i;
    if (!imageUrlPattern.test(form.img)) {
      toast.error("Image URL must be a valid URL ending with .jpg, .jpeg, .png, or .gif");
      return;
    }

    const payload = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      img: form.img.trim(),
      type: form.type,
      category: Array.isArray(form.category) ? form.category : [],
      price: {
        org: Number(form.price.org),
        mrp: Number(form.price.mrp) || Number(form.price.org),
        off: Number(form.price.off) || 0,
      },
      inStock: form.inStock === "Yes" ? true : false,
    };

    // console.log("Payload being sent:", payload);

    try {
      await axios.post("/menu", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item added successfully!");
      fetchMenu(currentPage, selectedCategory);
      resetForm();
    } catch (err) {
      // console.log("Full error object:", err);
      // console.log("Error response:", err.response?.data);
      // console.log("Error status:", err.response?.status);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Error adding item. Please check all fields.";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async () => {
    // Client-side validation
    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (!form.desc.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.img.trim()) {
      toast.error("Image URL is required");
      return;
    }
    if (!form.price.org || form.price.org <= 0) {
      toast.error("Valid selling price is required");
      return;
    }
    if (!form.type) {
      toast.error("Food type is required");
      return;
    }
    if (!form.category || form.category.length === 0) {
      toast.error("At least one category is required");
      return;
    }

    // Validate image URL format
    const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i;
    if (!imageUrlPattern.test(form.img)) {
      toast.error("Image URL must be a valid URL ending with .jpg, .jpeg, .png, or .gif");
      return;
    }

    const payload = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      img: form.img.trim(),
      type: form.type,
      category: Array.isArray(form.category) ? form.category : [],
      price: {
        org: Number(form.price.org),
        mrp: Number(form.price.mrp) || Number(form.price.org),
        off: Number(form.price.off) || 0,
      },
      inStock: form.inStock === "Yes" ? true : false,
    };

    try {
      await axios.put(`/menu/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item updated successfully!");
      fetchMenu(currentPage, selectedCategory);
      resetForm();
    } catch (err) {
      // console.log("Full error object:", err);
      // console.log("Error response:", err.response?.data);
      // console.log("Error status:", err.response?.status);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Error updating item. Please check all fields.";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/menu/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item deleted!");
        fetchMenu(currentPage, selectedCategory);
      } catch (err) {
        toast.error("Error deleting item");
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      desc: "",
      img: "",
      price: { org: "", mrp: "", off: 0 },
      type: "",
      category: [],
      inStock: "Yes",
    });
    setIsEdit(false);
    setEditId(null);
    setModalOpen(false);
  };

  const openEditModal = (item) => {
    setForm({
      name: item.name,
      desc: item.desc,
      img: item.img,
      price: {
        org: item.price.org,
        mrp: item.price.mrp,
        off: item.price.off
      },
      type: item.type,
      category: Array.isArray(item.category) ? item.category : [],
      inStock: item.inStock ? "Yes" : "No",
    });
    setIsEdit(true);
    setEditId(item._id);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchMenu(currentPage, selectedCategory);
  }, []);

  // Update currentPage setter to fetch new page when changed
  useEffect(() => {
    fetchMenu(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <Navbar />
      <Toaster position="top-right" />
      
      <div className="relative z-10 p-6">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Menu Panel
        </motion.h2>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap gap-3 justify-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {uniqueCategories.map((cat, index) => (
            <motion.button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium capitalize transition-all duration-300 shadow-lg cursor-pointer ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30"
                  : "bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-500 hover:text-white border border-gray-700"
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Add Button */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-2xl cursor-pointer flex items-center gap-3 group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
            Add New Item
          </motion.button>
        </motion.div>

        {/* Menu List */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {menu.map((item, index) => (
            <motion.div 
              key={item._id} 
              className="group bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Stock indicator */}
              <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
                  {item.name}
                </h3>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
                
                <div className="mb-3">
                  <span className="text-2xl font-bold text-orange-400">₹{item.price.org}</span>
                  {item.price.mrp > item.price.org && (
                    <>
                      <span className="line-through text-sm text-gray-500 ml-2">₹{item.price.mrp}</span>
                      <span className="text-green-400 text-sm font-semibold ml-2">({item.price.off}% off)</span>
                    </>
                  )}
                </div>
                
                <div className="mb-3 flex flex-wrap gap-1 justify-center">
                  {item.category.map((cat, i) => (
                    <span key={i} className="bg-gray-700 text-xs px-2 py-1 rounded-full text-gray-300">
                      {cat}
                    </span>
                  ))}
                </div>
                
                <div className="mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    item.inStock 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {item.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                
                <div className="flex gap-3 w-full">
                  <motion.button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <motion.div 
          className="flex justify-center items-center mt-12 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg"
            whileHover={{ scale: currentPage === 1 ? 1 : 1.05, y: currentPage === 1 ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
          
          <div className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-700">
            <span className="text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <motion.button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gradient-to-r from-orange-500 to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-all duration-300 cursor-pointer shadow-lg"
            whileHover={{ scale: currentPage === totalPages ? 1 : 1.05, y: currentPage === totalPages ? 0 : -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Modal */}
      {modalOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && resetForm()}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-800/95 via-gray-850/95 to-gray-900/95 backdrop-blur-xl text-white rounded-3xl w-full max-w-4xl border border-gray-700/50 shadow-2xl max-h-[95vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-8 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                    {isEdit ? "Edit Menu Item" : "Add New Item"}
                  </h3>
                  <p className="text-gray-400">
                    {isEdit ? "Update the item details below" : "Fill in the details for your new menu item"}
                  </p>
                </div>
                <motion.button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <h4 className="text-xl font-semibold text-orange-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-300" htmlFor="name">
                          Item Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="name"
                          className={`w-full p-4 rounded-xl bg-gray-700/50 text-white border transition-all duration-300 ${
                            form.name ? 'border-green-500/50 focus:border-green-500' : 'border-gray-600 focus:border-orange-500'
                          } focus:ring-2 focus:ring-orange-500/20 placeholder-gray-400`}
                          placeholder="e.g., Margherita Pizza"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-300" htmlFor="desc">
                          Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          id="desc"
                          className={`w-full p-4 rounded-xl bg-gray-700/50 text-white border transition-all duration-300 ${
                            form.desc ? 'border-green-500/50 focus:border-green-500' : 'border-gray-600 focus:border-orange-500'
                          } focus:ring-2 focus:ring-orange-500/20 h-32 resize-none placeholder-gray-400`}
                          placeholder="Describe your delicious item..."
                          value={form.desc}
                          onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        />
                        <div className="text-right text-sm text-gray-400 mt-1">
                          {form.desc.length}/200
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-300" htmlFor="img">
                          Image URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="img"
                          className={`w-full p-4 rounded-xl bg-gray-700/50 text-white border transition-all duration-300 ${
                            form.img ? 'border-green-500/50 focus:border-green-500' : 'border-gray-600 focus:border-orange-500'
                          } focus:ring-2 focus:ring-orange-500/20 placeholder-gray-400`}
                          placeholder="https://example.com/image.jpg"
                          value={form.img}
                          onChange={(e) => setForm({ ...form, img: e.target.value })}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Must be a valid URL ending with .jpg, .jpeg, .png, or .gif
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <h4 className="text-xl font-semibold text-orange-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Pricing Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block" htmlFor="orgPrice">
                          Selling Price <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            id="orgPrice"
                            className={`w-full pl-8 pr-4 py-4 rounded-xl bg-gray-700/50 text-white border transition-all duration-300 ${
                              form.price.org ? 'border-green-500/50 focus:border-green-500' : 'border-gray-600 focus:border-orange-500'
                            } focus:ring-2 focus:ring-orange-500/20`}
                            type="number"
                            placeholder="0"
                            min="0"
                            value={form.price.org}
                            onChange={(e) => {
                              const org = e.target.value === "" ? "" : Number(e.target.value);
                              const mrp = form.price.mrp === "" ? 0 : Number(form.price.mrp);
                              const off = mrp > 0 && org !== "" ? Math.round(((mrp - org) / mrp) * 100) : 0;
                              setForm({
                                ...form,
                                price: { ...form.price, org, off }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block" htmlFor="mrpPrice">
                          MRP (Optional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            id="mrpPrice"
                            className="w-full pl-8 pr-4 py-4 rounded-xl bg-gray-700/50 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                            type="number"
                            placeholder="0"
                            min="0"
                            value={form.price.mrp}
                            onChange={(e) => {
                              const mrp = e.target.value === "" ? "" : Number(e.target.value);
                              const org = form.price.org === "" ? 0 : Number(form.price.org);
                              const off = mrp > 0 && org !== "" ? Math.round(((mrp - org) / mrp) * 100) : 0;
                              setForm({
                                ...form,
                                price: { ...form.price, mrp, off }
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block" htmlFor="offPrice">
                          Discount %
                        </label>
                        <div className="relative">
                          <input
                            id="offPrice"
                            className="w-full px-4 py-4 rounded-xl bg-gray-600/50 text-gray-300 border border-gray-600"
                            type="number"
                            value={form.price.off}
                            readOnly
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                        </div>
                      </div>
                    </div>
                    {form.price.off > 0 && (
                      <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-green-400 text-sm">
                          Great! Customers will save ₹{(form.price.mrp - form.price.org).toFixed(2)} with this discount
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <h4 className="text-xl font-semibold text-orange-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Categories <span className="text-red-400">*</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {FOOD_CATEGORIES.map((cat) => (
                        <motion.label 
                          key={cat} 
                          className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            form.category.includes(cat)
                              ? 'bg-orange-500/20 border-orange-500/50 text-white'
                              : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="checkbox"
                            value={cat}
                            checked={form.category.includes(cat)}
                            onChange={(e) => {
                              const updatedCategories = e.target.checked
                                ? [...form.category, cat]
                                : form.category.filter((c) => c !== cat);
                              setForm({ ...form, category: updatedCategories });
                            }}
                            className="w-5 h-5 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium capitalize">{cat}</span>
                        </motion.label>
                      ))}
                    </div>
                    {form.category.length === 0 && (
                      <p className="text-red-400 text-sm mt-2">Please select at least one category</p>
                    )}
                  </div>
                </div>

                {/* Right Column - Preview & Settings */}
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <h4 className="text-xl font-semibold text-orange-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Preview
                    </h4>
                    {form.img ? (
                      <div className="relative group">
                        <img 
                          src={form.img} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-xl border border-gray-600"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-48 bg-gray-700/50 border border-gray-600 rounded-xl items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">Invalid image URL</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Image preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Item Settings */}
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <h4 className="text-xl font-semibold text-orange-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium text-gray-300" htmlFor="type">
                          Food Type <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="type"
                          className={`w-full p-4 rounded-xl bg-gray-700/50 text-white border transition-all duration-300 ${
                            form.type ? 'border-green-500/50 focus:border-green-500' : 'border-gray-600 focus:border-orange-500'
                          } focus:ring-2 focus:ring-orange-500/20`}
                          value={form.type}
                          onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                          <option value="">Select food type</option>
                          {FOOD_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-300">
                          Availability Status <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <motion.label 
                            className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                              form.inStock === "Yes"
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 text-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="inStock"
                              value="Yes"
                              checked={form.inStock === "Yes"}
                              onChange={(e) => setForm({ ...form, inStock: e.target.value })}
                              className="sr-only"
                            />
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              In Stock
                            </div>
                          </motion.label>
                          <motion.label 
                            className={`flex items-center justify-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                              form.inStock === "No"
                                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50 text-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              name="inStock"
                              value="No"
                              checked={form.inStock === "No"}
                              onChange={(e) => setForm({ ...form, inStock: e.target.value })}
                              className="sr-only"
                            />
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Out of Stock
                            </div>
                          </motion.label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-800/30 p-6 border-t border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  <span className="text-red-400">*</span> Required fields
                </div>
                <div className="flex gap-4">
                  <motion.button
                    onClick={resetForm}
                    className="bg-gray-600/50 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 border border-gray-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={isEdit ? handleUpdate : handleAdd}
                    disabled={!form.name || !form.desc || !form.img || !form.price.org || !form.type || form.category.length === 0}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isEdit ? "Update Item" : "Save Item"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminMenu;
