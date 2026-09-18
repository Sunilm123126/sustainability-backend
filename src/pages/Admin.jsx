import React, { useEffect, useState } from "react";
import "../assets/admindashboard.css";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

function Admin({ onLogout }) {

    // =====================================================
    // STATES
    // =====================================================

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [activePage, setActivePage] = useState("dashboard");

    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState("");


    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:8081/users"
            );

            if (!response.ok) {
                throw new Error("Unable to load users");
            }

            const data = await response.json();

            setUsers(data);

        } catch (error) {
            console.error(error);
            setMessage("Unable to load users.");
        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // LOAD ADMIN ANALYTICS
    // =====================================================

    const loadAnalytics = async () => {

        try {

            setAnalyticsLoading(true);
            setAnalyticsError("");

            const response = await fetch(
                "http://localhost:8081/api/admin/analytics"
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load admin analytics"
                );
            }

            const data = await response.json();

            console.log("Admin Analytics:", data);

            setAnalytics(data);

        } catch (error) {

            console.error(error);

            setAnalyticsError(
                "Unable to load analytics. Please check that the Spring Boot server is running."
            );

        } finally {

            setAnalyticsLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadUsers();
        loadAnalytics();
    }, []);


    // =====================================================
    // DELETE USER
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8081/users/${id}`,
                {
                    method: "DELETE",
                }
            );

            const result = await response.text();

            if (!response.ok) {
                alert(result);
                return;
            }

            setUsers((previousUsers) =>
                previousUsers.filter(
                    (user) => user.id !== id
                )
            );

            // Refresh analytics because user count may change
            loadAnalytics();

        } catch (error) {

            console.error(error);

            alert("Unable to delete user.");

        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("username");
        localStorage.removeItem("role");

        onLogout();

    };


    // =====================================================
    // REFRESH EVERYTHING
    // =====================================================

    const handleRefresh = () => {
        loadUsers();
        loadAnalytics();
    };


    // =====================================================
    // PIE DATA
    // =====================================================

    const getCategoryData = () => {

        if (!analytics?.categoryData) {
            return [];
        }

        return Object.entries(
            analytics.categoryData
        ).map(([name, value]) => ({
            name,
            value,
        }));

    };


    // =====================================================
    // COLORS
    // =====================================================

    const PIE_COLORS = [
        "#22c55e",
        "#3b82f6",
        "#a855f7",
        "#f97316",
        "#ef4444",
    ];


    // =====================================================
    // DASHBOARD PAGE
    // =====================================================

    const DashboardPage = () => {

        return (

            <>

                {/* WELCOME */}

                <section className="admin-welcome">

                    <div>

                        <h2>
                            Welcome, Admin 👋
                        </h2>

                        <p>
                            Here's an overview of your EcoTrack platform.
                        </p>

                    </div>

                    <button
                        className="admin-refresh"
                        onClick={handleRefresh}
                    >
                        ↻ Refresh
                    </button>

                </section>


                {/* STAT CARDS */}

                <section className="admin-stats">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon green">
                            👥
                        </div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {analytics
                                ? analytics.totalUsers
                                : users.length}
                        </h2>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon blue">
                            🌱
                        </div>

                        <p>
                            Total Activities
                        </p>

                        <h2>
                            {analytics
                                ? analytics.totalActivities
                                : 0}
                        </h2>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon purple">
                            🛡️
                        </div>

                        <p>
                            Total Emissions
                        </p>

                        <h2>
                            {analytics
                                ? `${analytics.totalEmissions} kg`
                                : "0 kg"}
                        </h2>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon orange">
                            🟢
                        </div>

                        <p>
                            Average Eco Score
                        </p>

                        <h2>
                            {analytics
                                ? analytics.averageEcoScore
                                : 0}
                        </h2>

                    </div>

                </section>


                {/* USERS */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Registered Users
                            </h2>

                            <p>
                                Manage users registered on EcoTrack
                            </p>

                        </div>

                        <span className="user-count">
                            {users.length} Users
                        </span>

                    </div>


                    {message && (
                        <div className="admin-message">
                            {message}
                        </div>
                    )}


                    {loading ? (

                        <div className="admin-empty">

                            <div className="admin-spinner"></div>

                            <p>
                                Loading users...
                            </p>

                        </div>

                    ) : users.length === 0 ? (

                        <div className="admin-empty">

                            <div className="admin-empty-icon">
                                👥
                            </div>

                            <h3>
                                No users found
                            </h3>

                            <p>
                                There are no registered users yet.
                            </p>

                        </div>

                    ) : (

                        <div className="admin-table">

                            <div className="admin-table-header">

                                <div>
                                    ID
                                </div>

                                <div>
                                    Username
                                </div>

                                <div>
                                    Role
                                </div>

                                <div>
                                    Action
                                </div>

                            </div>


                            {users.map((user) => (

                                <div
                                    className="admin-table-row"
                                    key={user.id}
                                >

                                    <div className="user-id">
                                        #{user.id}
                                    </div>


                                    <div className="user-name">

                                        <div className="user-mini-avatar">

                                            {user.username
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <span>
                                            {user.username}
                                        </span>

                                    </div>


                                    <div>

                                        <span
                                            className={
                                                user.role === "ADMIN"
                                                    ? "role-badge admin-role"
                                                    : "role-badge user-role"
                                            }
                                        >
                                            {user.role || "USER"}
                                        </span>

                                    </div>


                                    <div>

                                        <button
                                            className="delete-user-btn"
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </>

        );

    };


    // =====================================================
    // ANALYTICS PAGE
    // =====================================================

    const AnalyticsPage = () => {

        if (analyticsLoading && !analytics) {

            return (

                <div className="admin-empty">

                    <div className="admin-spinner"></div>

                    <p>
                        Loading admin analytics...
                    </p>

                </div>

            );

        }


        if (analyticsError) {

            return (

                <div className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Admin Analytics
                            </h2>

                            <p>
                                Platform-wide carbon emission analytics
                            </p>

                        </div>

                        <button
                            className="admin-refresh"
                            onClick={loadAnalytics}
                        >
                            ↻ Retry
                        </button>

                    </div>

                    <div className="admin-message">
                        {analyticsError}
                    </div>

                </div>

            );

        }


        if (!analytics) {
            return null;
        }


        const categoryData = getCategoryData();


        return (

            <>

                {/* HEADER */}

                <section className="admin-welcome">

                    <div>

                        <h2>
                            Analytics Overview 📊
                        </h2>

                        <p>
                            Monitor carbon emissions across the entire platform.
                        </p>

                    </div>

                    <button
                        className="admin-refresh"
                        onClick={loadAnalytics}
                    >
                        ↻ Refresh Analytics
                    </button>

                </section>


                {/* SUMMARY */}

                <section className="admin-stats">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon green">
                            👥
                        </div>

                        <p>
                            Total Users
                        </p>

                        <h2>
                            {analytics.totalUsers}
                        </h2>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon blue">
                            📋
                        </div>

                        <p>
                            Total Activities
                        </p>

                        <h2>
                            {analytics.totalActivities}
                        </h2>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon purple">
                            🌍
                        </div>

                        <p>
                            Total Emissions
                        </p>

                        <h2>
                            {analytics.totalEmissions}
                        </h2>

                        <small>
                            kg CO₂e
                        </small>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-icon orange">
                            🌱
                        </div>

                        <p>
                            Average Eco Score
                        </p>

                        <h2>
                            {analytics.averageEcoScore}
                        </h2>

                        <small>
                            / 100
                        </small>

                    </div>

                </section>


                {/* DAILY + WEEKLY */}

                <section className="admin-chart-grid">


                    {/* DAILY */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Today's Emissions
                                </h2>

                                <p>
                                    Total emissions generated today
                                </p>

                            </div>

                        </div>


                        <div className="admin-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <BarChart
                                    data={analytics.dailyData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="day"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="emission"
                                        fill="#22c55e"
                                        name="Emission (kg)"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* WEEKLY */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Weekly Emissions
                                </h2>

                                <p>
                                    Monday to Sunday
                                </p>

                            </div>

                        </div>


                        <div className="admin-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <LineChart
                                    data={analytics.weeklyData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="day"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="emission"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        name="Emission (kg)"
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>

                </section>


                {/* MONTHLY */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Monthly Emissions
                            </h2>

                            <p>
                                Daily emissions for the current month
                            </p>

                        </div>

                    </div>


                    <div className="admin-chart-container large">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <LineChart
                                data={analytics.monthlyData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="day"
                                />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="emission"
                                    stroke="#a855f7"
                                    strokeWidth={3}
                                    name="Emission (kg)"
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </section>


                {/* YEARLY */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Yearly Emissions
                            </h2>

                            <p>
                                Monthly emissions for the current year
                            </p>

                        </div>

                    </div>


                    <div className="admin-chart-container large">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={analytics.yearlyData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="month"
                                />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="emission"
                                    fill="#f97316"
                                    name="Emission (kg)"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </section>


                {/* CATEGORY + TOP USERS */}

                <section className="admin-chart-grid">


                    {/* CATEGORY */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Emissions by Category
                                </h2>

                                <p>
                                    Platform-wide category breakdown
                                </p>

                            </div>

                        </div>


                        <div className="admin-chart-container">

                            {categoryData.length === 0 ? (

                                <div className="admin-empty">

                                    <p>
                                        No category data available.
                                    </p>

                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height={320}
                                >

                                    <PieChart>

                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >

                                            {categoryData.map(
                                                (entry, index) => (

                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            PIE_COLORS[
                                                            index %
                                                            PIE_COLORS.length
                                                                ]
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>

                            )}

                        </div>

                    </div>


                    {/* TOP USERS */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Top Users
                                </h2>

                                <p>
                                    Users with highest total emissions
                                </p>

                            </div>

                        </div>


                        {analytics.topUsers?.length === 0 ? (

                            <div className="admin-empty">

                                <p>
                                    No user analytics available.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-table">

                                <div className="admin-table-header">

                                    <div>
                                        Rank
                                    </div>

                                    <div>
                                        Username
                                    </div>

                                    <div>
                                        Activities
                                    </div>

                                    <div>
                                        Emissions
                                    </div>

                                </div>


                                {analytics.topUsers.map(
                                    (user, index) => (

                                        <div
                                            className="admin-table-row"
                                            key={user.username}
                                        >

                                            <div className="user-id">
                                                #{index + 1}
                                            </div>

                                            <div className="user-name">

                                                <div className="user-mini-avatar">
                                                    {user.username
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <span>
                                                    {user.username}
                                                </span>

                                            </div>

                                            <div>
                                                {user.activities}
                                            </div>

                                            <div>
                                                {user.emissions} kg
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>

            </>

        );

    };


    // =====================================================
    // ACTIVITIES PAGE
    // =====================================================

    const ActivitiesPage = () => {

        return (

            <section className="admin-users-card">

                <div className="admin-section-header">

                    <div>

                        <h2>
                            Activities
                        </h2>

                        <p>
                            Platform activity monitoring is available through Admin Analytics.
                        </p>

                    </div>

                </div>

                <div className="admin-empty">

                    <div className="admin-empty-icon">
                        🌱
                    </div>

                    <h3>
                        Activity Analytics
                    </h3>

                    <p>
                        Use the Analytics section to monitor activity and emissions.
                    </p>

                </div>

            </section>

        );

    };


    // =====================================================
    // RENDER PAGE
    // =====================================================

    const renderPage = () => {

        switch (activePage) {

            case "users":
                return <DashboardPage />;

            case "activities":
                return <ActivitiesPage />;

            case "analytics":
                return <AnalyticsPage />;

            case "dashboard":
            default:
                return <DashboardPage />;

        }

    };


    // =====================================================
    // ADMIN DASHBOARD
    // =====================================================

    return (

        <div className="admin-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">


                <div className="admin-logo">

                    <span className="admin-logo-icon">
                        🌿
                    </span>

                    <span>
                        EcoTrack
                    </span>

                </div>


                <div className="admin-panel-label">
                    ADMIN PANEL
                </div>


                <nav className="admin-nav">


                    <button
                        className={`admin-nav-item ${
                            activePage === "dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("dashboard")
                        }
                    >

                        <span>
                            📊
                        </span>

                        Dashboard

                    </button>


                    <button
                        className={`admin-nav-item ${
                            activePage === "users"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("users")
                        }
                    >

                        <span>
                            👥
                        </span>

                        Users

                    </button>


                    <button
                        className={`admin-nav-item ${
                            activePage === "activities"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("activities")
                        }
                    >

                        <span>
                            🌱
                        </span>

                        Activities

                    </button>


                    <button
                        className={`admin-nav-item ${
                            activePage === "analytics"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage("analytics")
                        }
                    >

                        <span>
                            📈
                        </span>

                        Analytics

                    </button>


                </nav>


                <div className="admin-sidebar-bottom">

                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                    >

                        <span>
                            ⇥
                        </span>

                        Logout

                    </button>

                </div>


            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <div className="admin-main">


                {/* HEADER */}

                <header className="admin-header">

                    <div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Manage users and monitor EcoTrack
                        </p>

                    </div>


                    <div className="admin-header-right">

                        <div className="admin-notification">
                            🔔
                            <span></span>
                        </div>

                        <div className="admin-avatar">
                            A
                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <main className="admin-content">

                    {renderPage()}

                </main>


            </div>

        </div>

    );

}

export default Admin;