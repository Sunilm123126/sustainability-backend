import React, { useState } from "react";

const API_URL = "http://localhost:8081";

const Login = ({
                   onLogin,
                   onRegister,
                   onOrganizationLogin
               }) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid username or password."
                );
            }

            /*
             * Existing EcoTrack user/admin login
             */

            const loggedInUsername =
                data.username ||
                username.trim();

            const role =
                data.role ||
                "USER";

            localStorage.setItem(
                "username",
                loggedInUsername
            );

            localStorage.setItem(
                "role",
                role
            );

            /*
             * Send successful login
             * back to App.jsx
             */

            if (onLogin) {

                onLogin(
                    loggedInUsername,
                    role
                );

            }

        } catch (err) {

            console.error(
                "Login error:",
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

                {/* Logo */}

                <div style={styles.logo}>
                    🌱
                </div>

                <h1 style={styles.title}>
                    Welcome Back
                </h1>

                <p style={styles.subtitle}>
                    Login to your EcoTrack account
                </p>


                {/* Error */}

                {error && (

                    <div style={styles.error}>
                        {error}
                    </div>

                )}


                {/* User Login Form */}

                <form onSubmit={handleSubmit}>

                    {/* Username */}

                    <div style={styles.formGroup}>

                        <label style={styles.label}>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your username"
                            style={styles.input}
                            autoComplete="username"
                            spellCheck="false"
                        />

                    </div>


                    {/* Password */}

                    <div style={styles.formGroup}>

                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                            style={styles.input}
                            autoComplete="current-password"
                        />

                    </div>


                    {/* Login button */}

                    <button
                        type="submit"
                        style={{
                            ...styles.loginButton,
                            opacity: loading ? 0.7 : 1
                        }}
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"}

                    </button>

                </form>


                {/* Register */}

                <p style={styles.registerText}>

                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={onRegister}
                        style={styles.linkButton}
                    >
                        Register
                    </button>

                </p>


                {/* Divider */}

                <div style={styles.dividerContainer}>

                    <div style={styles.line}></div>

                    <span style={styles.orText}>
                        OR
                    </span>

                    <div style={styles.line}></div>

                </div>


                {/* Organization Login */}

                <div style={styles.organizationBox}>

                    <div style={styles.organizationIcon}>
                        🏢
                    </div>

                    <h3 style={styles.organizationTitle}>
                        Organization Account
                    </h3>

                    <p style={styles.organizationText}>
                        Manage your organization's
                        sustainability activities and employees.
                    </p>

                    <button
                        type="button"
                        onClick={() => {

                            if (onOrganizationLogin) {
                                onOrganizationLogin();
                            }

                        }}
                        style={styles.organizationButton}
                    >
                        Login as Organization
                    </button>

                </div>

            </div>

        </div>

    );
};


/* =========================================================
   STYLES
========================================================= */

const styles = {

    container: {

        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
            "linear-gradient(135deg, #e8f5e9, #f7fbf8)",

        padding: "20px"

    },


    card: {

        width: "100%",

        maxWidth: "430px",

        background: "#ffffff",

        borderRadius: "20px",

        padding: "40px",

        boxShadow:
            "0 15px 40px rgba(0, 0, 0, 0.10)",

        boxSizing: "border-box",

        textAlign: "center"

    },


    logo: {

        fontSize: "48px",

        marginBottom: "10px"

    },


    title: {

        margin: "0",

        color: "#1b5e20",

        fontSize: "30px",

        fontWeight: "700"

    },


    subtitle: {

        color: "#666",

        marginTop: "10px",

        marginBottom: "30px",

        fontSize: "15px"

    },


    error: {

        background: "#ffebee",

        color: "#c62828",

        padding: "12px",

        borderRadius: "8px",

        marginBottom: "20px",

        fontSize: "14px",

        textAlign: "left"

    },


    formGroup: {

        textAlign: "left",

        marginBottom: "20px"

    },


    label: {

        display: "block",

        marginBottom: "8px",

        fontWeight: "600",

        color: "#333",

        fontSize: "14px"

    },


    /*
     * IMPORTANT FIX:
     * Explicit text color makes typed username/password visible.
     */

    input: {

        width: "100%",

        boxSizing: "border-box",

        padding: "13px 14px",

        border:
            "1px solid #d6d6d6",

        borderRadius: "9px",

        fontSize: "15px",

        outline: "none",

        backgroundColor: "#ffffff",

        color: "#26352d",

        caretColor: "#26352d",

        WebkitTextFillColor: "#26352d"

    },


    loginButton: {

        width: "100%",

        border: "none",

        borderRadius: "9px",

        padding: "13px",

        background: "#2e7d32",

        color: "#ffffff",

        cursor: "pointer",

        fontSize: "16px",

        fontWeight: "600"

    },


    registerText: {

        marginTop: "22px",

        color: "#666",

        fontSize: "14px"

    },


    linkButton: {

        border: "none",

        background: "transparent",

        color: "#2e7d32",

        cursor: "pointer",

        fontWeight: "600",

        fontSize: "14px",

        padding: "0"

    },


    dividerContainer: {

        display: "flex",

        alignItems: "center",

        gap: "12px",

        margin: "25px 0"

    },


    line: {

        flex: 1,

        height: "1px",

        background: "#e0e0e0"

    },


    orText: {

        color: "#999",

        fontSize: "12px",

        fontWeight: "600"

    },


    organizationBox: {

        background: "#f5faf6",

        border:
            "1px solid #dceee0",

        borderRadius: "14px",

        padding: "20px"

    },


    organizationIcon: {

        fontSize: "30px",

        marginBottom: "5px"

    },


    organizationTitle: {

        margin: "5px 0",

        color: "#2e7d32",

        fontSize: "18px"

    },


    organizationText: {

        color: "#666",

        fontSize: "13px",

        lineHeight: "1.5",

        margin: "8px 0 16px"

    },


    organizationButton: {

        width: "100%",

        border:
            "1px solid #2e7d32",

        borderRadius: "8px",

        padding: "11px",

        background: "#ffffff",

        color: "#2e7d32",

        cursor: "pointer",

        fontSize: "14px",

        fontWeight: "600"

    }

};


export default Login;