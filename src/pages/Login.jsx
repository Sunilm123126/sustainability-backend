import React, { useState } from "react";
import "./Login.css";

function Login({ onLogin, onRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!username.trim() || !password.trim()) {
            setMessage("Please enter username and password.");
            return;
        }

        setLoading(true);

        try {
            const params = new URLSearchParams();

            params.append("username", username.trim());
            params.append("password", password);

            const response = await fetch(
                "http://localhost:8081/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                    body: params.toString(),
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                data = text;
            }

            if (!response.ok) {
                setMessage(
                    typeof data === "string"
                        ? data
                        : "Invalid username or password."
                );
                return;
            }

            console.log("Login response:", data);

            // Save login information
            localStorage.setItem(
                "username",
                data.username
            );

            localStorage.setItem(
                "role",
                data.role || "USER"
            );

            // Tell App.jsx that login succeeded
            onLogin(
                data.username,
                data.role || "USER"
            );

        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Unable to connect to the Spring Boot server."
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-page">

            <div className="login-card">

                {/* Logo */}

                <div className="login-logo">
                    🌿
                </div>

                <h1>Welcome Back</h1>

                <p className="login-subtitle">
                    Sign in to continue to EcoTrack
                </p>


                {/* Form */}

                <form onSubmit={handleLogin}>

                    <div className="input-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            autoComplete="username"
                        />

                    </div>


                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                        />

                    </div>


                    {/* Error */}

                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>


                {/* Register */}

                <div className="register-link">

          <span>
            Don't have an account?
          </span>

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;