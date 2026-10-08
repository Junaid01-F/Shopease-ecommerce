import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Auth.css";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {

      setLoading(true);

      const result = await login(email, password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate(location.state?.from || "/profile");

    } catch (err) {

      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");

    } finally {

      setLoading(false);

    }
  };


  return (
    <main className="auth-page">

      <div className="auth-shell">

        <div className="auth-side">
          <h2>Welcome back to ShopEase</h2>
          <p>Sign in to pick up right where you left off.</p>

          <ul className="auth-perks">
            <li><span>📦</span> Track all your orders</li>
            <li><span>🛒</span> Faster, easier checkout</li>
            <li><span>🎁</span> Exclusive member deals</li>
          </ul>
        </div>


        <div className="auth-card">

          <div className="auth-header">
            <h1>Login</h1>
            <p>Enter your details to access your account</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Password</label>

              <div className="password-wrap">
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;