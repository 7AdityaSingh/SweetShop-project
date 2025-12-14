import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
}) {
  const { token, role, logout } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const showSearch = setSearch && setCategory;
  const navigate = useNavigate();


  return (
    <nav className="navbar">
      <h2>🍬 Sweet Shop</h2>

      {/* SEARCH & FILTER */}
      {showSearch && (
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search sweets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="nav-links">
        {token && currentPath !== "/home" && (
          <Link to="/home">Home</Link>
        )}

        {role === "admin" && currentPath !== "/admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/register">Register</Link>}

        {token && (
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>

        )}
      </div>
    </nav>
  );
}

export default Navbar;
