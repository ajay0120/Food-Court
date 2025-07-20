import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
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
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <Toaster />
      <h2 className="text-3xl font-bold text-center text-orange-500 mb-6">Admin Menu Panel</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition cursor-pointer
              ${selectedCategory === cat
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-orange-600"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {/* Menu List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div key={item._id} className="bg-gray-900 p-5 rounded-lg shadow-md flex flex-col items-center hover:scale-105 transition">
            <img
              src={item.img}
              alt={item.name}
              className="w-32 h-32 object-cover object-center rounded-md mb-3"
            />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
            <p className="mb-2">
              <span className="text-orange-400">₹{item.price.org}</span>{" "}
              <span className="line-through text-sm text-gray-400">
                ₹{item.price.mrp}
              </span>{" "}
              <span className="text-green-400 text-sm">({item.price.off}% off)</span>
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Categories: {item.category.join(", ")}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Availability: {item.inStock ? "Yes" : "No"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(item)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>
        <span className="text-white px-4 py-2">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md space-y-3">
            <h3 className="text-xl font-bold text-orange-500 mb-2">
              {isEdit ? "Edit Item" : "Add New Item"}
            </h3>

            <label className="block mb-1 font-semibold" htmlFor="name">Name:</label>
            <input
              id="name"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label className="block mb-1 font-semibold" htmlFor="desc">Description:</label>
            <input
              id="desc"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />

            <label className="block mb-1 font-semibold" htmlFor="img">Image URL:</label>
            <input
              id="img"
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter image URL"
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
            />

            <label className="block mb-1 font-semibold">Prices:</label>
            <div className="flex gap-2">
              <div className="flex flex-col w-1/3">
                <label className="text-sm mb-1" htmlFor="orgPrice">Our Price:</label>
                <input
                  id="orgPrice"
                  className="p-2 rounded bg-gray-700 text-white"
                  type="number"
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

              <div className="flex flex-col w-1/3">
                <label className="text-sm mb-1" htmlFor="mrpPrice">MRP:</label>
                <input
                  id="mrpPrice"
                  className="p-2 rounded bg-gray-700 text-white"
                  type="number"
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

              <div className="flex flex-col w-1/3">
                <label className="text-sm mb-1" htmlFor="offPrice">Off %:</label>
                <input
                  id="offPrice"
                  className="p-2 rounded bg-gray-700 text-white"
                  type="number"
                  value={form.price.off}
                  readOnly
                />
              </div>
            </div>

            <label className="block mb-1 font-semibold" htmlFor="type">Type:</label>
            <select
              id="type"
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="">Select type</option>
              {FOOD_TYPES.map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>

            <label className="block mb-1 font-semibold">Category:</label>
            <div className="grid grid-cols-2 gap-2">
              {FOOD_CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center space-x-2">
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
                    className="accent-green-500"
                  />
                  <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                </label>
              ))}
            </div>


            <label className="block mb-1">Availability:</label>
            <select
              className="w-full p-2 rounded bg-gray-700 text-white"
              value={form.inStock}
              onChange={(e) =>
                setForm({ ...form, inStock: e.target.value })
              }
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={isEdit ? handleUpdate : handleAdd}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md cursor-pointer"
              >
                {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMenu;
