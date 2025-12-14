import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/Admin.css";

function Admin() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [sweets, setSweets] = useState([]);

  /* ---------- SEARCH & FILTER ---------- */
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  /* ---------- RESTOCK ---------- */
  const [restockQty, setRestockQty] = useState({});

  /* ---------- EDIT ---------- */
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  /* ---------- FETCH ---------- */
  const fetchSweets = async () => {
    const res = await api.get("/sweets");
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  /* ---------- ADD SWEET ---------- */
  const handleAddSweet = async () => {
    if (!name || !category || !price || !quantity) {
      alert("All fields required");
      return;
    }

    await api.post("/sweets", {
      name,
      category,
      price: Number(price),
      quantity: Number(quantity),
    });

    setName("");
    setCategory("");
    setPrice("");
    setQuantity("");
    setShowAddForm(false);
    fetchSweets();
  };

  /* ---------- RESTOCK ---------- */
  const handleRestock = async (id) => {
    const qty = Number(restockQty[id]);
    if (!qty || qty <= 0) return;

    await api.post(`/sweets/${id}/restock`, { quantity: qty });
    setRestockQty({});
    fetchSweets();
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    await api.delete(`/sweets/${id}`);
    fetchSweets();
  };

  /* ---------- EDIT ---------- */
  const startEdit = (s) => {
    setShowAddForm(false);
    setEditId(s.id);
    setEditData({
      name: s.name,
      category: s.category,
      price: s.price,
      quantity: s.quantity,
    });
  };

  const saveEdit = async (id) => {
    await api.put(`/sweets/${id}`, {
      ...editData,
      price: Number(editData.price),
      quantity: Number(editData.quantity),
    });
    setEditId(null);
    fetchSweets();
  };

  /* ---------- FILTER LOGIC ---------- */
  const categories = [...new Set(sweets.map((s) => s.category))];

  const filteredSweets = sweets.filter((s) => {
    const matchSearch = s.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      !categoryFilter || s.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  return (
    <>
      {/* ---------- NAVBAR ---------- */}
      <Navbar
        search={search}
        setSearch={setSearch}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        categories={categories}
      />

      <div className="admin-container">
        <h2>Admin Panel</h2>

        {/* ---------- ADD SWEET ---------- */}
        
        <button
          className="add-toggle-btn"
          disabled={editId !== null}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add New Sweet"}
        </button>

        {showAddForm && (
          <div className="admin-form slide-down">
            <input
              className="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="name"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              className="name"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className="name"
              type="number"
              placeholder="Stock"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button className="add-btn" onClick={handleAddSweet}>
              Add
            </button>
          </div>
        )}

        {/* ---------- TABLE ---------- */}
        <h3>Existing Sweets</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSweets.map((s) => {
              const isEditingAnother =
                editId !== null && editId !== s.id;

              return (
                <tr
                  key={s.id}
                  className={editId === s.id ? "editing" : ""}
                >
                  {editId === s.id ? (
                    <>
                      <td>
                        <input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              name: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          value={editData.category}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              category: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              price: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.quantity}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              quantity: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <div className="action-group">
                          <button
                            className="icon-btn delete-btn"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="icon-btn edit-btn"
                            onClick={() => saveEdit(s.id)}
                          >
                            Save
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{s.name}</td>
                      <td>{s.category}</td>
                      <td>₹{s.price}</td>
                      <td>{s.quantity}</td>
                      <td>
                        <div className="action-group">
                          <input
                            className="in"
                            type="number"
                            placeholder="+Qty"
                            disabled={isEditingAnother}
                            value={restockQty[s.id] || ""}
                            onChange={(e) =>
                              setRestockQty({
                                ...restockQty,
                                [s.id]: e.target.value,
                              })
                            }
                          />

                          <button
                            className="Restock"
                            disabled={isEditingAnother}
                            onClick={() => handleRestock(s.id)}
                          >
                            Restock
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            disabled={isEditingAnother}
                            onClick={() => handleDelete(s.id)}
                          >
                            Delete
                          </button>

                          <button
                            className="icon-btn edit-btn"
                            disabled={editId !== null}
                            onClick={() => startEdit(s)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Admin;
