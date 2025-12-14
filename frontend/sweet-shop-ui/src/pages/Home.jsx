import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import "../styles/App.css";

function Home() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    api.get("/sweets").then((res) => setSweets(res.data));
  }, []);

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
      <Navbar
        search={search}
        setSearch={setSearch}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        categories={categories}
      />

      <div className="container">
        <h1 className="heading">Available Sweets</h1>

        {filteredSweets.length === 0 ? (
          <p style={{ textAlign: "center", color: "#fff" }}>
            No sweets found
          </p>
        ) : (
          <div className="grid">
            {filteredSweets.map((s) => (
              <SweetCard key={s.id} sweet={s} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
