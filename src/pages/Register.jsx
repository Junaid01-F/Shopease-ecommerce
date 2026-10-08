import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

function Register() {

  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (event) => {

    event.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/profile");
  };


  return (
    <main className="auth-page">

      <div className="auth-shell">

        <div className="auth-side">
          <h2>Join ShopEase today</h2>
          <p>Create your free account and start shopping in seconds.</p>

          <ul className="auth-perks">
            <li><span>🚚</span> Free delivery above ₹999</li>
            <li><span>↩️</span> 7-day easy returns</li>
            <li><span>🔒</span> Safe and secure shopping</li>
          </ul>
        </div>


        <div className="auth-card">

          <div className="auth-header">
            <h1>Create Account</h1>
            <p>It only takes a minute</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="field">
              <label>Full Name</label>
              <input className="input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" disabled={loading} />
            </div>

            <div className="field">
              <label>Email</label>
              <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" disabled={loading} />
            </div>

            <div className="field">
              <label>Password</label>
              <input className="input" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" disabled={loading} />
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <input className="input" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" disabled={loading} />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Register;