import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Auth.css";
import { Link } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email || !password) {
            setMessage("Email and password are required");
            return;
        }

        try {
            const res = await api.post("/auth/register", {
                email,
                password,
            });

            setMessage("Registered successfully ✅");
            setTimeout(() => navigate("/login"), 1000);
        } catch (err) {
            setMessage("Registration failed ❌ (user may already exist)");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>

            {message && <p>{message}</p>}

            <div className="input-box">

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>


            <button onClick={handleRegister}>Register</button>
            <p className="auth-switch">
                Already have an account? <Link to="/login">Login</Link>

            </p>


        </div>
    );
}

export default Register;
