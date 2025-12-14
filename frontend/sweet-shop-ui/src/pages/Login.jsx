import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";
import { Link } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            login(res.data.token, res.data.role);

            if (res.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/home");
            }

        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <div className="input-box">
                <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            
            <button onClick={handleLogin}>Login</button>
            <p className="auth-switch">
                Don’t have an account? <Link to="/register">Register</Link>
            </p>

        </div>
    );
}

export default Login;
