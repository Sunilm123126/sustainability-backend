import React, { useState } from "react";
import "./Register.css";

function Register({ onBackToLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const params = new URLSearchParams();
            params.append("username", username.trim());
            params.append("password", password);

            const response = await fetch(
                "http://localhost:8081/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: params.toString(),
                }
            );

            const result = await response.text();

            if (!response.ok) {
                setError(result || "Registration failed.");
                return;
            }

            setMessage("Registration successful! You can now login.");

            setUsername("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error("Registration error:", error);
            setError("Unable to connect to the Spring Boot server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <div className="register-logo">
                    🌿
                </div>

                <h1>Create Account</h1>

                <p className="register-subtitle">
                    Join EcoTrack and start tracking your carbon footprint
                </p>

                <form onSubmit={handleRegister}>

                    <div className="register-input-group">
                        <label>Username</label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="register-input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="register-input-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    {message && (
                        <div className="register-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="login-link">
                    <span>Already have an account?</span>

                    <button
                        type="button"
                        onClick={onBackToLogin}
                    >
                        Login
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Register;