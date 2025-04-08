import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    img: "",
    price: { org: 0, mrp: 0, off: 0 },
    category: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setMenu(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Error fetching menu");
    }
  };

  const uniqueCategories = [
    "all",
    ...new Set(menu.flatMap((item) => item.category)),
  ];

  const handleCategoryFilter = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      setFiltered(menu);
    } else {
      const filteredItems = menu.filter((item) =>
        item.category.includes(cat)
      );
      setFiltered(filteredItems);
    }
    setCurrentPage(1);
  };

  const handleAdd = async () => {
    const payload = {
      ...form,
      category: form.category.split(",").map((c) => c.trim().toLowerCase()),
    };

    try {
      await axios.post("/menu", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item added!");
      fetchMenu();
      setForm({
        name: "",
        desc: "",
        img: "",
        price: { org: 0, mrp: 0, off: 0 },
        category: "",
      });
      setModalOpen(false);
    } catch (err) {
      toast.error("Error adding item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/menu/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Item deleted!");
        fetchMenu();
      } catch (err) {
        toast.error("Error deleting item");
      }
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white p-6">
        <Navbar/>
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
          onClick={() => setModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md cursor-pointer"
        >
          + Add Item
        </button>
      </div>

      {/* Menu List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <div key={item._id} className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <img
              src={item.img}
              alt={item.name}
              className="h-40 w-full object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{item.desc}</p>
            <p className="mb-2">
              <span className="text-orange-400">₹{item.price.org}</span>{" "}
              <span className="line-through text-sm text-gray-400">
                ₹{item.price.mrp}
              </span>
              {" "}
              <span className="text-green-400 text-sm">({item.price.off}% off)</span>
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Categories: {item.category.join(", ")}
            </p>
            <button
              onClick={() => handleDelete(item._id)}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === i + 1
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-orange-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-md space-y-3">
            <h3 className="text-xl font-bold text-orange-500 mb-2">Add New Item</h3>
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Description"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Image URL"
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
            />
            <div className="flex gap-2">
              <input
                className="w-1/3 p-2 rounded bg-gray-700 text-white"
                placeholder="Org Price"
                type="number"
                value={form.price.org}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: { ...form.price, org: e.target.value },
                  })
                }
              />
              <input
                className="w-1/3 p-2 rounded bg-gray-700 text-white"
                placeholder="MRP"
                type="number"
                value={form.price.mrp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: { ...form.price, mrp: e.target.value },
                  })
                }
              />
              <input
                className="w-1/3 p-2 rounded bg-gray-700 text-white"
                placeholder="Off %"
                type="number"
                value={form.price.off}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: { ...form.price, off: e.target.value },
                  })
                }
              />
            </div>
            <input
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Category (comma separated)"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
