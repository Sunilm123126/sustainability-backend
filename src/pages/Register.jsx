import React, { useState } from "react";
import "./Register.css";

function Register({ onBackToLogin }) {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    /* =====================================================
       REGISTER
    ===================================================== */

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        /* -----------------------------------------------
           VALIDATE ALL FIELDS
        ------------------------------------------------ */

        if (
            !username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {

            setError("Please fill in all fields.");

            return;
        }


        /* -----------------------------------------------
           EMAIL VALIDATION
        ------------------------------------------------ */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.trim())) {

            setError("Please enter a valid email address.");

            return;
        }


        /* -----------------------------------------------
           PASSWORD MATCH
        ------------------------------------------------ */

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }


        /* -----------------------------------------------
           PASSWORD LENGTH
        ------------------------------------------------ */

        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        setLoading(true);


        try {

            /* -------------------------------------------
               FORM DATA
            -------------------------------------------- */

            const params = new URLSearchParams();

            params.append(
                "username",
                username.trim()
            );

            params.append(
                "email",
                email.trim()
            );

            params.append(
                "password",
                password
            );


            /* -------------------------------------------
               API REQUEST
            -------------------------------------------- */

            const response = await fetch(
                "http://localhost:8081/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: params.toString()
                }
            );


            const result =
                await response.text();


            /* -------------------------------------------
               ERROR
            -------------------------------------------- */

            if (!response.ok) {

                setError(
                    result ||
                    "Registration failed."
                );

                return;
            }


            /* -------------------------------------------
               SUCCESS
            -------------------------------------------- */

            setMessage(
                "Registration successful! You can now login."
            );


            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                "Unable to connect to the Spring Boot server."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       UI
    ===================================================== */

    return (

        <div className="register-page">

            <div className="register-card">


                {/* LOGO */}

                <div className="register-logo">
                    🌿
                </div>


                <h1>
                    Create Account
                </h1>


                <p className="register-subtitle">
                    Join EcoTrack and start tracking your carbon footprint
                </p>


                <form onSubmit={handleRegister}>


                    {/* USERNAME */}

                    <div className="register-input-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            autoComplete="username"
                            disabled={loading}
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="register-input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            autoComplete="email"
                            disabled={loading}
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="register-input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                            disabled={loading}
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="register-input-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="new-password"
                            disabled={loading}
                        />

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="register-message">
                            {message}
                        </div>

                    )}


                    {/* ERROR MESSAGE */}

                    {error && (

                        <div className="register-error">
                            {error}
                        </div>

                    )}


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* LOGIN LINK */}

                <div className="login-link">

                    <span>
                        Already have an account?
                    </span>

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