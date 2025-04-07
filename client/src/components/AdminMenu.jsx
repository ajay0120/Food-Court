import { useState, useEffect } from "react";
import axios from "../api/axios";

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", desc: "", img: "", price: { org: 0, mrp: 0, off: 0 }, category: "" });

  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    const res = await axios.get("/menu");
    setMenu(res.data);
  };

  const handleAdd = async () => {
    const payload = {
      ...form,
      category: form.category.split(",").map((c) => c.trim()),
    };

    await axios.post("/menu", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setForm({ name: "", desc: "", img: "", price: { org: 0, mrp: 0, off: 0 }, category: "" });
    fetchMenu();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/menu/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchMenu();
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div>
      <h2>Admin Menu Panel</h2>
      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Description" onChange={(e) => setForm({ ...form, desc: e.target.value })} />
      <input placeholder="Image URL" onChange={(e) => setForm({ ...form, img: e.target.value })} />
      <input placeholder="Org Price" type="number" onChange={(e) => setForm({ ...form, price: { ...form.price, org: e.target.value } })} />
      <input placeholder="MRP" type="number" onChange={(e) => setForm({ ...form, price: { ...form.price, mrp: e.target.value } })} />
      <input placeholder="Off (%)" type="number" onChange={(e) => setForm({ ...form, price: { ...form.price, off: e.target.value } })} />
      <input placeholder="Category (comma-separated)" onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <button onClick={handleAdd}>Add Item</button>

      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            {item.name} - ₹{item.price.org}{" "}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMenu;
