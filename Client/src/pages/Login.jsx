import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    age: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", login);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (signup.password !== signup.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        name: signup.name,
        email: signup.email,
        password: signup.password,
        phoneNumber: signup.phoneNumber,
        gender: signup.gender,
        age: signup.age,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="auth-sub">
          {mode === "login"
            ? "Login to manage your appointments"
            : "Signup to book doctor appointments"}
        </p>

        <div className="auth-switch">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="email"
              placeholder="Email address"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <input
              placeholder="Full name"
              value={signup.name}
              onChange={(e) => setSignup({ ...signup, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email address"
              value={signup.email}
              onChange={(e) => setSignup({ ...signup, email: e.target.value })}
              required
            />

            <input
              placeholder="Phone number"
              value={signup.phoneNumber}
              onChange={(e) =>
                setSignup({ ...signup, phoneNumber: e.target.value })
              }
              required
            />

            <div className="auth-row">
              <select
                value={signup.gender}
                onChange={(e) =>
                  setSignup({ ...signup, gender: e.target.value })
                }
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                placeholder="Age"
                value={signup.age}
                onChange={(e) =>
                  setSignup({ ...signup, age: e.target.value })
                }
                required
              />
            </div>

            <input
              type="password"
              placeholder="Password"
              value={signup.password}
              onChange={(e) =>
                setSignup({ ...signup, password: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={signup.confirm}
              onChange={(e) =>
                setSignup({ ...signup, confirm: e.target.value })
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
