import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const USERS_KEY = "fmd_users";
const CURRENT_KEY = "fmd_current";

export default function Login() {
  const [mode, setMode] = useState("login"); // login | signup
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // login form
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginErr, setLoginErr] = useState({});

  // signup form
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [signErr, setSignErr] = useState({});

  const [user, setUser] = useState(null);

  // load logged user
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch { }
  }, []);

  // -------- utilities ----------
  const getUsers = () => {
    try {
      const u = localStorage.getItem(USERS_KEY);
      return u ? JSON.parse(u) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (arr) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(arr));
  };

  // -------- SIGNUP --------
  const handleSignup = (e) => {
    e.preventDefault();
    const err = {};

    if (!signup.name.trim()) err.name = "Name required.";
    if (!signup.email.trim()) err.email = "Email required.";
    else if (!/^\S+@\S+\.\S+$/.test(signup.email)) err.email = "Invalid email.";
    if (!signup.password) err.password = "Password required.";
    if (signup.password !== signup.confirm)
      err.confirm = "Passwords do not match.";

    if (Object.keys(err).length) {
      setSignErr(err);
      return;
    }

    setLoading(true);

    const users = getUsers();
    const exists = users.find(
      (u) => u.email.toLowerCase() === signup.email.toLowerCase()
    );

    if (exists) {
      setSignErr({ email: "Email already registered." });
      setLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: signup.name.trim(),
      email: signup.email.trim().toLowerCase(),
      password: signup.password,
    };

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));
    setUser(newUser);

    setLoading(false);
    alert("Signup successful! Logged in.");
  };

  // -------- LOGIN --------
  const handleLogin = (e) => {
    e.preventDefault();
    const err = {};

    if (!login.email.trim()) err.email = "Email required.";
    if (!login.password) err.password = "Password required.";

    if (Object.keys(err).length) {
      setLoginErr(err);
      return;
    }

    setLoading(true);

    const users = getUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === login.email.toLowerCase() &&
        u.password === login.password
    );

    if (!found) {
      setLoginErr({ general: "Invalid email or password." });
      setLoading(false);
      return;
    }

    localStorage.setItem(CURRENT_KEY, JSON.stringify(found));
    setUser(found);

    setLoading(false);
    alert("Login successful!");
  };

  // -------- LOGOUT --------
  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  };

  // -------- RENDER --------
  if (user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Welcome, {user.name || user.email}</h2>
          <p className="muted">{user.email}</p>

          <button
            className="btn primary"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>

          <button className="btn logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* MODE SWITCH */}
        <div className="switch-row">
          <button
            className={mode === "login" ? "switch-btn active" : "switch-btn"}
            onClick={() => {
              setMode("login");
              setLoginErr({});
            }}
          >
            Login
          </button>

          <button
            className={mode === "signup" ? "switch-btn active" : "switch-btn"}
            onClick={() => {
              setMode("signup");
              setSignErr({});
            }}
          >
            Signup
          </button>
        </div>

        {/* LOGIN */}
        {mode === "login" && (
          <form className="login-form" onSubmit={handleLogin}>
            {loginErr.general && (
              <div className="error-box">{loginErr.general}</div>
            )}

            <label>
              Email
              <input
                type="email"
                value={login.email}
                onChange={(e) =>
                  setLogin({ ...login, email: e.target.value })
                }
                className={loginErr.email ? "input error" : "input"}
              />
              {loginErr.email && <div className="field-error">{loginErr.email}</div>}
            </label>

            <label>
              Password
              <div className="pwd-row">
                <input
                  type={showPwd ? "text" : "password"}
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                  className={loginErr.password ? "input error" : "input"}
                />
                <button
                  type="button"
                  className="show-btn"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
              {loginErr.password && (
                <div className="field-error">{loginErr.password}</div>
              )}
            </label>

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <form className="login-form" onSubmit={handleSignup}>
            <label>
              Name
              <input
                type="text"
                value={signup.name}
                onChange={(e) =>
                  setSignup({ ...signup, name: e.target.value })
                }
                className={signErr.name ? "input error" : "input"}
              />
              {signErr.name && <div className="field-error">{signErr.name}</div>}
            </label>

            <label>
              Email
              <input
                type="email"
                value={signup.email}
                onChange={(e) =>
                  setSignup({ ...signup, email: e.target.value })
                }
                className={signErr.email ? "input error" : "input"}
              />
              {signErr.email && <div className="field-error">{signErr.email}</div>}
            </label>

            <label>
              Password
              <input
                type="password"
                value={signup.password}
                onChange={(e) =>
                  setSignup({ ...signup, password: e.target.value })
                }
                className={signErr.password ? "input error" : "input"}
              />
              {signErr.password && (
                <div className="field-error">{signErr.password}</div>
              )}
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                value={signup.confirm}
                onChange={(e) =>
                  setSignup({ ...signup, confirm: e.target.value })
                }
                className={signErr.confirm ? "input error" : "input"}
              />
              {signErr.confirm && (
                <div className="field-error">{signErr.confirm}</div>
              )}
            </label>

            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
