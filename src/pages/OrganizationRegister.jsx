import React, { useState } from "react";

const API_URL = "http://localhost:8081";

const OrganizationRegister = ({
                                  onBack,
                                  onLogin
                              }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [description, setDescription] = useState("");
    const [industry, setIndustry] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegister = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Organization name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Organization email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/organizations/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        email: email.trim(),
                        password: password,
                        description: description.trim(),
                        industry: industry.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Organization registration failed."
                );
            }

            setSuccess(
                "Organization registered successfully. You can now login."
            );

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setDescription("");
            setIndustry("");

        } catch (err) {
            console.error("Organization registration error:", err);
            setError(
                err.message ||
                "Unable to register organization. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(135deg, #f0fdf4, #ecfdf5, #ffffff)",
                padding: "30px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "40px",
                    boxShadow: "0 15px 45px rgba(0,0,0,0.10)"
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div
                        style={{
                            fontSize: "42px",
                            marginBottom: "10px"
                        }}
                    >
                        🌱
                    </div>

                    <h1
                        style={{
                            margin: 0,
                            color: "#166534",
                            fontSize: "30px"
                        }}
                    >
                        Register Organization
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                            marginTop: "8px"
                        }}
                    >
                        Create your organization's EcoTrack account
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: "#fef2f2",
                            color: "#b91c1c",
                            padding: "12px 15px",
                            borderRadius: "10px",
                            marginBottom: "18px",
                            fontSize: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        style={{
                            background: "#f0fdf4",
                            color: "#166534",
                            padding: "12px 15px",
                            borderRadius: "10px",
                            marginBottom: "18px",
                            fontSize: "14px"
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleRegister}>

                    <label>Organization Name</label>

                    <input
                        type="text"
                        placeholder="Enter organization name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                    />

                    <label>Organization Email</label>

                    <input
                        type="email"
                        placeholder="organization@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                    />

                    <label>Confirm Password</label>

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        style={inputStyle}
                    />

                    <label>Industry</label>

                    <input
                        type="text"
                        placeholder="Example: IT, Manufacturing, Education"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        style={inputStyle}
                    />

                    <label>Description</label>

                    <textarea
                        placeholder="Brief description of your organization"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        style={{
                            ...inputStyle,
                            resize: "vertical"
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            marginTop: "10px",
                            border: "none",
                            borderRadius: "10px",
                            background: "#16a34a",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {loading
                            ? "Creating Organization..."
                            : "Create Organization"}
                    </button>
                </form>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "22px"
                    }}
                >
                    <button
                        onClick={onLogin}
                        style={linkButtonStyle}
                    >
                        Already have an organization account? Login
                    </button>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        marginTop: "10px"
                    }}
                >
                    <button
                        onClick={onBack}
                        style={linkButtonStyle}
                    >
                        ← Back
                    </button>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    marginTop: "7px",
    marginBottom: "18px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "15px",
    outline: "none"
};

const linkButtonStyle = {
    border: "none",
    background: "transparent",
    color: "#15803d",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600"
};

export default OrganizationRegister;