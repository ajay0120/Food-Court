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
    inStock: "",
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
      console.log(res.data.items);
      setMenu(res.data.items);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.log("error fetching menu", err);
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
    const payload = {
      ...form,
      category: form.category,
      price: {
        org: Number(form.price.org),
        mrp: Number(form.price.mrp),
        off: Number(form.price.off),
      },
      inStock: form.inStock === "Yes" ? true : false,
    };

    try {
      await axios.post("/menu", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item added!");
      fetchMenu(currentPage, selectedCategory);
      resetForm();
    } catch (err) {
      console.log("error adding items", err);
      toast.error("Error adding item");
    }
  };

  const handleUpdate = async () => {
    const payload = {
      ...form,
      category: form.category.split(",").map((c) => c.trim().toLowerCase()),
      price: {
        org: Number(form.price.org),
        mrp: Number(form.price.mrp),
        off: Number(form.price.off),
      },
      inStock: form.inStock === "Yes" ? true : false,
    };

    try {
      await axios.put(`/menu/${editId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item updated!");
      fetchMenu(currentPage, selectedCategory);
      resetForm();
    } catch (err) {
      console.log("error updating item", err);
      toast.error("Error updating item");
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
      price: { org: 0, mrp: 0, off: 0 },
      type: "",
      category: "",
      inStock: "",
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
      category: item.category.join(", "),
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

      {/* Modal */}
      {modalOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-8 rounded-2xl w-full max-w-2xl space-y-6 border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                {isEdit ? "Edit Item" : "Add New Item"}
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-orange-300" htmlFor="name">Item Name</label>
                  <input
                    id="name"
                    className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Enter item name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-orange-300" htmlFor="desc">Description</label>
                  <textarea
                    id="desc"
                    className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 h-24 resize-none"
                    placeholder="Enter description"
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-orange-300" htmlFor="img">Image URL</label>
                  <input
                    id="img"
                    className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder="Enter image URL"
                    value={form.img}
                    onChange={(e) => setForm({ ...form, img: e.target.value })}
                  />
                  {form.img && (
                    <div className="mt-2">
                      <img src={form.img} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-orange-300">Pricing</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block" htmlFor="orgPrice">Our Price</label>
                      <input
                        id="orgPrice"
                        className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                        type="number"
                        placeholder="₹"
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

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block" htmlFor="mrpPrice">MRP</label>
                      <input
                        id="mrpPrice"
                        className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                        type="number"
                        placeholder="₹"
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

                    <div>
                      <label className="text-sm text-gray-400 mb-1 block" htmlFor="offPrice">Discount %</label>
                      <input
                        id="offPrice"
                        className="w-full p-3 rounded-xl bg-gray-600 text-gray-300 border border-gray-600"
                        type="number"
                        value={form.price.off}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-orange-300" htmlFor="type">Food Type</label>
                  <select
                    id="type"
                    className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="">Select type</option>
                    {FOOD_TYPES.map((type) => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-orange-300">Availability</label>
                  <select
                    className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                    value={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.value })}
                  >
                    <option value="Yes">In Stock</option>
                    <option value="No">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-3 font-semibold text-orange-300">Categories</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOOD_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer">
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
                      className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
              <motion.button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={isEdit ? handleUpdate : handleAdd}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEdit ? "Update Item" : "Save Item"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminMenu;
