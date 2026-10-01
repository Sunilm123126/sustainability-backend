import React, { useEffect, useState } from "react";
import "./Goal.css";

const API_URL = "http://localhost:8081";

function Goal({ username }) {

    // =========================================================
    // STATE
    // =========================================================

    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [success, setSuccess] = useState("");

    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({

        title: "",
        category: "Transport",
        activity: "",
        targetEmission: "",
        unit: "kg CO2e",
        frequency: "Monthly",
        difficulty: "Easy",
        startDate: "",
        endDate: "",
        description: ""

    });

    // =========================================================
    // GET USERNAME
    // =========================================================

    const currentUsername =
        username || localStorage.getItem("username");

    // =========================================================
    // LOAD GOALS
    // =========================================================

    useEffect(() => {

        if (!currentUsername) {

            setError("Username not found. Please login again.");

            setLoading(false);

            return;
        }

        fetchGoals();

    }, [currentUsername]);


    // =========================================================
    // FETCH GOALS
    // =========================================================

    const fetchGoals = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${API_URL}/api/goals/user/${encodeURIComponent(currentUsername)}`
            );

            if (!response.ok) {

                const text = await response.text();

                throw new Error(
                    `Failed to load goals: ${response.status} ${text}`
                );
            }

            const data = await response.json();

            setGoals(Array.isArray(data) ? data : []);

        } catch (err) {

            console.error("Get goals error:", err);

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({

            ...formData,

            [name]: value

        });
    };


    // =========================================================
    // CREATE GOAL
    // =========================================================

    const handleCreateGoal = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        // -----------------------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------------------

        if (!currentUsername) {

            setError("Username not found. Please login again.");

            return;
        }


        if (!formData.title.trim()) {

            setError("Please enter a goal title.");

            return;
        }


        if (!formData.activity.trim()) {

            setError("Please enter an activity.");

            return;
        }


        if (!formData.targetEmission) {

            setError("Please enter target emission.");

            return;
        }


        if (!formData.startDate) {

            setError("Please select a start date.");

            return;
        }


        if (!formData.endDate) {

            setError("Please select an end date.");

            return;
        }


        // -----------------------------------------------------
        // CREATE REQUEST OBJECT
        // -----------------------------------------------------

        const goalData = {

            username: currentUsername,

            title: formData.title,

            category: formData.category,

            activity: formData.activity,

            description: formData.description,

            targetEmission:
                Number(formData.targetEmission),

            currentEmission: 0,

            unit: formData.unit,

            frequency: formData.frequency,

            difficulty: formData.difficulty,

            startDate: formData.startDate,

            endDate: formData.endDate,

            status: "PENDING",

            progress: 0,

            emailSent: false,

            resultEmailSent: false

        };


        console.log("Sending goal:", goalData);


        try {

            const response = await fetch(
                `${API_URL}/api/goals`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(goalData)
                }
            );


            const responseText = await response.text();


            if (!response.ok) {

                throw new Error(
                    `Create goal failed: ${response.status} ${responseText}`
                );
            }


            let createdGoal;

            try {

                createdGoal = JSON.parse(responseText);

            } catch {

                createdGoal = null;
            }


            console.log(
                "Created goal:",
                createdGoal
            );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            setSuccess(
                "Goal created successfully!"
            );


            // -------------------------------------------------
            // RESET FORM
            // -------------------------------------------------

            setFormData({

                title: "",
                category: "Transport",
                activity: "",
                targetEmission: "",
                unit: "kg CO2e",
                frequency: "Monthly",
                difficulty: "Easy",
                startDate: "",
                endDate: "",
                description: ""

            });


            setShowForm(false);


            // -------------------------------------------------
            // REFRESH GOALS
            // -------------------------------------------------

            await fetchGoals();


        } catch (err) {

            console.error(
                "Create goal error:",
                err
            );

            setError(err.message);
        }
    };


    // =========================================================
    // DELETE GOAL
    // =========================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this goal?"
            );


        if (!confirmDelete) {

            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/api/goals/${id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                const text =
                    await response.text();

                throw new Error(
                    `Delete failed: ${response.status} ${text}`
                );
            }


            setSuccess(
                "Goal deleted successfully!"
            );


            await fetchGoals();


        } catch (err) {

            console.error(
                "Delete goal error:",
                err
            );

            setError(err.message);
        }
    };


    // =========================================================
    // PROGRESS CLASS
    // =========================================================

    const getProgressClass = (progress) => {

        if (progress >= 100) {

            return "goal-progress-complete";
        }

        if (progress >= 50) {

            return "goal-progress-medium";
        }

        return "goal-progress-low";
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="goal-page">

                <div className="goal-loading">

                    Loading your goals...

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="goal-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="goal-header">

                <div>

                    <h1>
                        Sustainability Goals
                    </h1>

                    <p>
                        Set targets and track your environmental progress
                    </p>

                </div>


                <button
                    className="create-goal-btn"
                    onClick={() => {

                        setShowForm(true);

                        setError("");

                        setSuccess("");

                    }}
                >

                    + Create Goal

                </button>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (

                <div className="goal-success">

                    ✓ {success}

                </div>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

                <div className="goal-error">

                    ⚠ {error}

                </div>

            )}


            {/* =================================================
                CREATE FORM
            ================================================= */}

            {showForm && (

                <div className="goal-form-container">

                    <div className="goal-form-header">

                        <div>

                            <h2>
                                Create New Goal
                            </h2>

                            <p>
                                Set a measurable sustainability target.
                            </p>

                        </div>


                        <button
                            className="close-goal-btn"
                            onClick={() => {

                                setShowForm(false);

                                setError("");

                            }}
                        >
                            ×
                        </button>

                    </div>


                    <form
                        className="goal-form"
                        onSubmit={handleCreateGoal}
                    >

                        {/* =================================================
                            ROW 1
                        ================================================= */}

                        <div className="goal-form-row">


                            <div className="goal-field">

                                <label>
                                    Goal Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Example: Reduce car travel"
                                />

                            </div>


                            <div className="goal-field">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
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

                        </div>


                        {/* =================================================
                            ROW 2
                        ================================================= */}

                        <div className="goal-form-row">


                            <div className="goal-field">

                                <label>
                                    Activity
                                </label>

                                <input
                                    type="text"
                                    name="activity"
                                    value={formData.activity}
                                    onChange={handleChange}
                                    placeholder="Example: Car travel"
                                />

                            </div>


                            <div className="goal-field">

                                <label>
                                    Target Emission
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    name="targetEmission"
                                    value={formData.targetEmission}
                                    onChange={handleChange}
                                    placeholder="Example: 50"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            ROW 3
                        ================================================= */}

                        <div className="goal-form-row">


                            <div className="goal-field">

                                <label>
                                    Unit
                                </label>

                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                >

                                    <option value="kg CO2e">
                                        kg CO₂e
                                    </option>

                                    <option value="kWh">
                                        kWh
                                    </option>

                                    <option value="km">
                                        km
                                    </option>

                                    <option value="kg">
                                        kg
                                    </option>

                                    <option value="litres">
                                        Litres
                                    </option>

                                </select>

                            </div>


                            <div className="goal-field">

                                <label>
                                    Frequency
                                </label>

                                <select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                >

                                    <option value="Daily">
                                        Daily
                                    </option>

                                    <option value="Weekly">
                                        Weekly
                                    </option>

                                    <option value="Monthly">
                                        Monthly
                                    </option>

                                    <option value="Yearly">
                                        Yearly
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                            ROW 4
                        ================================================= */}

                        <div className="goal-form-row">


                            <div className="goal-field">

                                <label>
                                    Difficulty
                                </label>

                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                >

                                    <option value="Easy">
                                        Easy
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Hard">
                                        Hard
                                    </option>

                                </select>

                            </div>


                            <div className="goal-field">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            ROW 5
                        ================================================= */}

                        <div className="goal-form-row">


                            <div className="goal-field">

                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="goal-field">

                                <label>
                                    Progress (%)
                                </label>

                                <input
                                    type="number"
                                    value="0"
                                    disabled
                                />

                            </div>

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div className="goal-field goal-description">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your sustainability goal..."
                                rows="4"
                            />

                        </div>


                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div className="goal-form-buttons">

                            <button
                                type="button"
                                className="cancel-goal-btn"
                                onClick={() => {

                                    setShowForm(false);

                                    setError("");

                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="save-goal-btn"
                            >
                                Create Goal
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =================================================
                GOALS
            ================================================= */}

            {!showForm && goals.length === 0 && (

                <div className="no-goals">

                    <div className="no-goals-icon">
                        🎯
                    </div>

                    <h2>
                        No Goals Yet
                    </h2>

                    <p>
                        Create your first sustainability goal
                        to start tracking your progress.
                    </p>

                    <button
                        className="create-goal-btn"
                        onClick={() => setShowForm(true)}
                    >
                        + Create Goal
                    </button>

                </div>

            )}


            {/* =================================================
                GOAL CARDS
            ================================================= */}

            {goals.length > 0 && (

                <div className="goals-grid">

                    {goals.map((goal) => (

                        <div
                            className="goal-card"
                            key={goal.id}
                        >

                            {/* CARD HEADER */}

                            <div className="goal-card-header">

                                <div>

                                    <h3>
                                        {goal.title}
                                    </h3>

                                    <span className="goal-category">
                                        {goal.category}
                                    </span>

                                </div>


                                <button
                                    className="delete-goal-btn"
                                    onClick={() =>
                                        handleDelete(goal.id)
                                    }
                                >
                                    🗑
                                </button>

                            </div>


                            {/* ACTIVITY */}

                            <div className="goal-info">

                                <span>
                                    Activity
                                </span>

                                <strong>
                                    {goal.activity}
                                </strong>

                            </div>


                            {/* TARGET */}

                            <div className="goal-info">

                                <span>
                                    Target
                                </span>

                                <strong>
                                    {goal.targetEmission} {goal.unit}
                                </strong>

                            </div>


                            {/* FREQUENCY */}

                            <div className="goal-info">

                                <span>
                                    Frequency
                                </span>

                                <strong>
                                    {goal.frequency}
                                </strong>

                            </div>


                            {/* DATES */}

                            <div className="goal-dates">

                                <div>

                                    <span>
                                        Start
                                    </span>

                                    <strong>
                                        {goal.startDate}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        End
                                    </span>

                                    <strong>
                                        {goal.endDate}
                                    </strong>

                                </div>

                            </div>


                            {/* PROGRESS */}

                            <div className="goal-progress-section">

                                <div className="goal-progress-header">

                                    <span>
                                        Progress
                                    </span>

                                    <strong>
                                        {Number(goal.progress || 0).toFixed(0)}%
                                    </strong>

                                </div>


                                <div className="goal-progress-bar">

                                    <div
                                        className={`goal-progress-fill ${getProgressClass(
                                            Number(goal.progress || 0)
                                        )}`}
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(goal.progress || 0)
                                                )
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="goal-status">

                                <span
                                    className={`status-badge ${
                                        goal.status === "ACHIEVED"
                                            ? "status-achieved"
                                            : goal.status === "NOT_ACHIEVED"
                                                ? "status-not-achieved"
                                                : "status-pending"
                                    }`}
                                >

                                    {goal.status || "PENDING"}

                                </span>


                                <span className="difficulty-badge">

                                    {goal.difficulty}

                                </span>

                            </div>


                            {/* DESCRIPTION */}

                            {goal.description && (

                                <p className="goal-description-text">

                                    {goal.description}

                                </p>

                            )}

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Goal;