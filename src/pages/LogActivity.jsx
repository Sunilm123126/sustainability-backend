import React, { useState } from "react";
import "./LoginActivity.css";

function LogActivity({ username, onBack }) {
    const [category, setCategory] = useState("Transport");
    const [activity, setActivity] = useState("");
    const [amount, setAmount] = useState("");
    const [unit, setUnit] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const activityOptions = {
        Transport: [
            { name: "Car", unit: "km", factor: 0.21 },
            { name: "Bus", unit: "km", factor: 0.10 },
            { name: "Train", unit: "km", factor: 0.04 },
            { name: "Bike", unit: "km", factor: 0.05 },
            { name: "Motorcycle", unit: "km", factor: 0.12 }
        ],

        Electricity: [
            { name: "Electricity Usage", unit: "kWh", factor: 0.42 }
        ],

        Food: [
            { name: "Meal", unit: "meals", factor: 2.5 },
            { name: "Vegetarian Meal", unit: "meals", factor: 1.5 },
            { name: "Non-Vegetarian Meal", unit: "meals", factor: 3.5 }
        ],

        Shopping: [
            { name: "Clothes", unit: "items", factor: 10 },
            { name: "Electronics", unit: "items", factor: 50 },
            { name: "General Shopping", unit: "items", factor: 5 }
        ]
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;

        setCategory(selectedCategory);
        setActivity("");
        setUnit("");
        setMessage("");
        setError("");
    };

    const handleActivityChange = (e) => {
        const selectedActivity = e.target.value;

        setActivity(selectedActivity);
        setMessage("");
        setError("");

        const selected = activityOptions[category].find(
            (item) => item.name === selectedActivity
        );

        if (selected) {
            setUnit(selected.unit);
        } else {
            setUnit("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!activity || !amount) {
            setError("Please select an activity and enter an amount.");
            return;
        }

        if (Number(amount) <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        const selectedActivity = activityOptions[category].find(
            (item) => item.name === activity
        );

        if (!selectedActivity) {
            setError("Please select a valid activity.");
            return;
        }

        // Calculate CO2 emission
        const emission =
            Number(amount) * selectedActivity.factor;

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8081/activities",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        category: category,
                        activity: activity,
                        amount: Number(amount),
                        unit: unit,
                        emission: Number(emission.toFixed(2))
                    })
                }
            );

            const result = await response.text();

            if (!response.ok) {
                console.error("Server error:", result);

                setError(
                    result || "Unable to save activity."
                );

                return;
            }

            console.log("Activity saved:", result);

            setMessage(
                `Activity logged successfully! Emission: ${emission.toFixed(2)} kg CO₂e`
            );

            // Clear form
            setActivity("");
            setAmount("");
            setUnit("");

        } catch (error) {
            console.error("Activity error:", error);

            setError(
                "Unable to connect to the Spring Boot server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="log-activity-page">

            <div className="log-activity-header">

                <div>
                    <h1>Log Activity</h1>

                    <p>
                        Record your daily activities and track
                        their environmental impact.
                    </p>
                </div>

                <button
                    className="back-dashboard-btn"
                    onClick={onBack}
                >
                    ← Dashboard
                </button>

            </div>


            <div className="activity-form-card">

                <div className="form-title">

                    <div className="form-icon">
                        🌱
                    </div>

                    <div>
                        <h2>Add New Activity</h2>

                        <p>
                            Enter your activity details below.
                        </p>
                    </div>

                </div>


                <form onSubmit={handleSubmit}>

                    {/* CATEGORY */}

                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={handleCategoryChange}
                        >

                            <option value="Transport">
                                Transport
                            </option>

                            <option value="Electricity">
                                Electricity
                            </option>

                            <option value="Food">
                                Food
                            </option>

                            <option value="Shopping">
                                Shopping
                            </option>

                        </select>

                    </div>


                    {/* ACTIVITY */}

                    <div className="form-group">

                        <label>
                            Activity
                        </label>

                        <select
                            value={activity}
                            onChange={handleActivityChange}
                        >

                            <option value="">
                                Select an activity
                            </option>

                            {activityOptions[category].map(
                                (item) => (
                                    <option
                                        key={item.name}
                                        value={item.name}
                                    >
                                        {item.name}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    {/* AMOUNT + UNIT */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Amount
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value)
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Unit
                            </label>

                            <input
                                type="text"
                                value={unit}
                                readOnly
                                placeholder="Unit"
                            />

                        </div>

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (
                        <div className="activity-success">
                            ✓ {message}
                        </div>
                    )}


                    {/* ERROR MESSAGE */}

                    {error && (
                        <div className="activity-error">
                            {error}
                        </div>
                    )}


                    {/* SAVE BUTTON */}

                    <button
                        type="submit"
                        className="save-activity-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : "🌱 Log Activity"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default LogActivity;