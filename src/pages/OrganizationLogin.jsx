import React, { useState } from "react";

const API_URL = "http://localhost:8081";

const OrganizationLogin = ({ onBack, onOrganizationLogin, onRegister }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Organization email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/organizations/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Invalid organization email or password."
                );
            }

            // Save organization information
            localStorage.setItem(
                "organizationId",
                String(data.id)
            );

            localStorage.setItem(
                "organizationName",
                data.name
            );

            localStorage.setItem(
                "organizationEmail",
                data.email
            );

            localStorage.setItem(
                "organizationLoggedIn",
                "true"
            );

            // Go to organization dashboard
            if (onOrganizationLogin) {
                onOrganizationLogin(data);
            }

        } catch (err) {

            console.error(
                "Organization login error:",
                err
            );

            setError(
                err.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            <div style={styles.card}>

                <div style={styles.logo}>
                    🌱
                </div>

                <h1 style={styles.title}>
                    Organization Login
                </h1>

                <p style={styles.subtitle}>
                    Sign in to your EcoTrack organization account
                </p>

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <div style={styles.formGroup}>

                        <label style={styles.label}>
                            Organization Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter organization email"
                            style={styles.input}
                            required
                        />

                    </div>

                    <div style={styles.formGroup}>

                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter organization password"
                            style={styles.input}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        style={styles.loginButton}
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login as Organization"}
                    </button>

                </form>

                <div style={styles.divider}>
                    OR
                </div>

                <button
                    type="button"
                    style={styles.registerButton}
                    onClick={onRegister}
                >
                    Register Organization
                </button>

                <button
                    type="button"
                    style={styles.backButton}
                    onClick={onBack}
                >
                    ← Back to User Login
                </button>

            </div>

        </div>
    );
};

const styles = {

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f8f4",
        padding: "20px"
    },

    card: {
        width: "100%",
        maxWidth: "450px",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "40px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        textAlign: "center"
    },

    logo: {
        fontSize: "48px",
        marginBottom: "10px"
    },

    title: {
        margin: "0",
        color: "#2e7d32",
        fontSize: "28px"
    },

    subtitle: {
        color: "#666",
        marginTop: "10px",
        marginBottom: "30px"
    },

    formGroup: {
        textAlign: "left",
        marginBottom: "20px"
    },

    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#333"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        border: "1px solid #d5d5d5",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none"
    },

    loginButton: {
        width: "100%",
        border: "none",
        borderRadius: "8px",
        padding: "13px",
        background: "#2e7d32",
        color: "#ffffff",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600"
    },

    divider: {
        margin: "25px 0",
        color: "#999",
        fontSize: "13px"
    },

    registerButton: {
        width: "100%",
        border: "1px solid #2e7d32",
        borderRadius: "8px",
        padding: "12px",
        background: "#ffffff",
        color: "#2e7d32",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "600"
    },

    backButton: {
        marginTop: "18px",
        border: "none",
        background: "transparent",
        color: "#555",
        cursor: "pointer",
        fontSize: "14px"
    },

    error: {
        background: "#ffebee",
        color: "#c62828",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px"
    }
};

export default OrganizationLogin;