import React, { useEffect, useState } from "react";
import AIChatbot from "./components/AIChatbot";

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
    CartesianGrid
} from "recharts";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import LogActivity from "./pages/LogActivity";
import Goal from "./pages/Goal";
import LandingPage from "./LandingPage";

import "./App.css";


/* =========================================================
   BACKEND URL
========================================================= */

const API_URL = "http://localhost:8081";


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ onLogout }) {

    const username =
        localStorage.getItem("username") || "";

    const [activePage, setActivePage] =
        useState("dashboard");

    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    const loadDashboard = async () => {

        if (!username) {

            setLoading(false);

            return;
        }

        try {

            setLoading(true);

            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/analytics/dashboard/${encodeURIComponent(username)}`
                );


            if (!response.ok) {

                throw new Error(
                    `Dashboard request failed: ${response.status}`
                );

            }


            const result =
                await response.json();


            console.log(
                "Dashboard data:",
                result
            );


            setDashboardData(result);

        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );


            setError(
                "Unable to load dashboard. Please check that the Spring Boot server is running."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    useEffect(() => {

        loadDashboard();

    }, [username]);


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem("username");

        localStorage.removeItem("role");

        onLogout();

    };


    /* =====================================================
       SIDEBAR
    ===================================================== */

    const Sidebar = () => (

        <aside className="sidebar">

            {/* BRAND */}

            <div className="sidebar-brand">

                <div className="sidebar-brand-icon">
                    🌿
                </div>

                <div className="sidebar-brand-text">

                    <div className="sidebar-brand-title">
                        EcoTrack
                    </div>

                    <div className="sidebar-brand-subtitle">
                        Sustainability
                    </div>

                </div>

            </div>


            {/* MENU */}

            <div className="sidebar-menu">

                <div className="sidebar-section-title">
                    Main
                </div>


                {/* DASHBOARD */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("dashboard")
                    }
                >

                    <span className="sidebar-item-icon">
                        ◈
                    </span>

                    <span className="sidebar-item-text">
                        Dashboard
                    </span>

                </button>


                {/* LOG ACTIVITY */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "logActivity"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("logActivity")
                    }
                >

                    <span className="sidebar-item-icon">
                        ＋
                    </span>

                    <span className="sidebar-item-text">
                        Log Activity
                    </span>

                </button>


                {/* ANALYTICS */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "analytics"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("analytics")
                    }
                >

                    <span className="sidebar-item-icon">
                        📊
                    </span>

                    <span className="sidebar-item-text">
                        Analytics
                    </span>

                </button>


                {/* PERSONAL */}

                <div
                    className="sidebar-section-title"
                    style={{
                        marginTop: "25px"
                    }}
                >
                    Personal
                </div>


                {/* GOALS */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "goals"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("goals")
                    }
                >

                    <span className="sidebar-item-icon">
                        🎯
                    </span>

                    <span className="sidebar-item-text">
                        Goals
                    </span>

                </button>


                {/* RECOMMENDATIONS */}

                <button
                    type="button"
                    className={`sidebar-item ${
                        activePage === "recommendations"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setActivePage("recommendations")
                    }
                >

                    <span className="sidebar-item-icon">
                        💡
                    </span>

                    <span className="sidebar-item-text">
                        Recommendations
                    </span>

                </button>

            </div>


            {/* SIDEBAR BOTTOM */}

            <div className="sidebar-bottom">

                <div className="sidebar-user">

                    <div className="sidebar-user-name">
                        {username}
                    </div>

                    <div className="sidebar-user-role">
                        Personal account
                    </div>

                </div>


                {/* AI CHATBOT */}

                <div>
                    <AIChatbot />
                </div>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="sidebar-item sidebar-logout"
                    onClick={handleLogout}
                >

                    <span className="sidebar-item-icon">
                        ↪
                    </span>

                    <span className="sidebar-item-text">
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );


    /* =====================================================
       HEADER
    ===================================================== */

    const DashboardHeader = () => (

        <div className="dashboard-header">

            <div className="dashboard-header-left">

                <h1>

                    {activePage === "analytics"
                        ? "Analytics"

                        : activePage === "logActivity"
                            ? "Log Activity"

                            : activePage === "goals"
                                ? "Goals"

                                : activePage === "recommendations"
                                    ? "Recommendations"

                                    : "Dashboard"}

                </h1>

                <p>
                    Track your environmental impact
                </p>

            </div>


            <div className="dashboard-header-right">

                <div className="user-profile">

                    <div className="user-profile-info">

                        <span className="user-profile-name">
                            {username}
                        </span>

                        <span className="user-profile-role">
                            User
                        </span>

                    </div>


                    <div className="user-avatar">

                        {username
                            ? username
                                .charAt(0)
                                .toUpperCase()
                            : "U"}

                    </div>

                </div>

            </div>

        </div>

    );


    /* =====================================================
       DASHBOARD HOME
    ===================================================== */

    const DashboardHome = () => {

        if (!dashboardData) {

            return (

                <>

                    <DashboardHeader />

                    <div className="dashboard-error">

                        {error ||
                            "No dashboard data available."}

                    </div>

                </>

            );

        }


        /* CATEGORY DATA */

        const categoryData =
            Object.entries(
                dashboardData.categoryData || {}
            ).map(
                ([name, value]) => ({

                    name: name,

                    value:
                        Number(value) || 0

                })
            );


        /* WEEKLY DATA */

        const weeklyData =
            Array.isArray(
                dashboardData.weeklyData
            )
                ? dashboardData.weeklyData.map(
                    item => ({

                        day:
                        item.day,

                        emission:
                            Number(
                                item.emission
                            ) || 0

                    })
                )
                : [];


        /* RECENT ACTIVITIES */

        const recentActivities =
            Array.isArray(
                dashboardData.recentActivities
            )
                ? dashboardData.recentActivities
                : [];


        return (

            <>

                <DashboardHeader />


                {/* ERROR */}

                {error && (

                    <div className="dashboard-error">
                        {error}
                    </div>

                )}


                {/* WELCOME */}

                <div className="welcome-section">

                    <div>

                        <h2 className="welcome-title">
                            Welcome back, {username} 👋
                        </h2>

                        <p className="welcome-description">
                            Here's an overview of your
                            environmental impact.
                        </p>

                    </div>


                    <div className="eco-score">

                        <div className="eco-score-value">

                            {Number(
                                dashboardData.ecoScore || 0
                            ).toFixed(0)}

                            /100

                        </div>

                        <div className="eco-score-label">
                            Eco Score
                        </div>

                    </div>

                </div>


                {/* SUMMARY */}

                <div className="stats-grid">

                    {/* TODAY */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            🌱
                        </div>

                        <div className="stat-card-title">
                            TODAY
                        </div>

                        <div className="stat-card-value">

                            {Number(
                                dashboardData.todayEmission || 0
                            ).toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            Today's emissions
                        </div>

                    </div>


                    {/* WEEK */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            📅
                        </div>

                        <div className="stat-card-title">
                            THIS WEEK
                        </div>

                        <div className="stat-card-value">

                            {Number(
                                dashboardData.weeklyEmission || 0
                            ).toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            Monday - Sunday
                        </div>

                    </div>


                    {/* MONTH */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            📈
                        </div>

                        <div className="stat-card-title">
                            THIS MONTH
                        </div>

                        <div className="stat-card-value">

                            {Number(
                                dashboardData.monthlyEmission || 0
                            ).toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            Current month
                        </div>

                    </div>


                    {/* SCORE */}

                    <div className="stat-card">

                        <div className="stat-icon">
                            ⭐
                        </div>

                        <div className="stat-card-title">
                            SCORE
                        </div>

                        <div className="stat-card-value">

                            {Number(
                                dashboardData.ecoScore || 0
                            ).toFixed(0)}

                            /100

                        </div>

                        <div className="stat-card-description">
                            Sustainability score
                        </div>

                    </div>

                </div>


                {/* CHARTS */}

                <div className="charts-grid">

                    {/* WEEKLY */}

                    <div className="chart-card">

                        <div className="chart-header">

                            <h3 className="chart-title">
                                Weekly Emissions
                            </h3>

                            <p className="chart-subtitle">
                                Monday to Sunday
                            </p>

                        </div>


                        <div className="chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={weeklyData}
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
                                        stroke="#14d9a4"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="chart-card">

                        <div className="chart-header">

                            <h3 className="chart-title">
                                Emissions by Category
                            </h3>

                            <p className="chart-subtitle">
                                This month's breakdown
                            </p>

                        </div>


                        <div className="chart-container">

                            {categoryData.length === 0 ? (

                                <div className="no-data">
                                    No category data available.
                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={105}
                                            paddingAngle={3}
                                        >

                                            {categoryData.map(
                                                (entry, index) => (

                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={[
                                                            "#14d9a4",
                                                            "#60a5fa",
                                                            "#f59e0b",
                                                            "#a78bfa"
                                                        ][
                                                        index % 4
                                                            ]}
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

                </div>


                {/* RECENT ACTIVITIES */}

                <ActivityTable
                    activities={recentActivities}
                    title="Recent Activities"
                    subtitle="Your latest recorded activities"
                    onAdd={() =>
                        setActivePage("logActivity")
                    }
                />

            </>

        );

    };


    /* =====================================================
       ACTIVITY TABLE
    ===================================================== */

    const ActivityTable = ({
                               activities,
                               title,
                               subtitle,
                               onAdd
                           }) => (

        <div className="recent-card">

            <div className="recent-header">

                <div>

                    <h3 className="recent-title">
                        {title}
                    </h3>

                    <p className="recent-subtitle">
                        {subtitle}
                    </p>

                </div>


                {onAdd && (

                    <button
                        type="button"
                        className="view-all-button"
                        onClick={onAdd}
                    >
                        + Add Activity
                    </button>

                )}

            </div>


            <div className="table-container">

                <table>

                    <thead>

                    <tr>

                        <th>
                            Activity
                        </th>

                        <th>
                            Category
                        </th>

                        <th>
                            Amount
                        </th>

                        <th>
                            Emission
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {activities.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"
                                className="no-data"
                            >
                                No activities recorded yet.
                            </td>

                        </tr>

                    ) : (

                        activities.map(
                            (item, index) => (

                                <tr
                                    key={
                                        item.id ||
                                        index
                                    }
                                >

                                    <td>
                                        {item.activity ||
                                            "Activity"}
                                    </td>

                                    <td>

                                        <span className="category-badge">

                                            {item.category ||
                                                "Other"}

                                        </span>

                                    </td>

                                    <td>

                                        {item.amount || 0}

                                        {" "}

                                        {item.unit || ""}

                                    </td>

                                    <td className="emission-cell">

                                        {Number(
                                            item.emission || 0
                                        ).toFixed(2)}

                                        {" "}kg CO₂e

                                    </td>

                                </tr>

                            )
                        )

                    )}

                    </tbody>

                </table>

            </div>

        </div>

    );


    /* =====================================================
       ANALYTICS PAGE
    ===================================================== */

    const AnalyticsPage = () => {

        const now = new Date();


        const getLocalDate = (date) => {

            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");

            return `${year}-${month}-${day}`;

        };


        const getLocalMonth = (date) => {

            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            return `${year}-${month}`;

        };


        const [selectedDate, setSelectedDate] =
            useState(
                getLocalDate(now)
            );


        const [selectedMonth, setSelectedMonth] =
            useState(
                getLocalMonth(now)
            );


        const [selectedYear, setSelectedYear] =
            useState(
                now.getFullYear()
            );


        const [analyticsData, setAnalyticsData] =
            useState(dashboardData);


        const [filterLoading, setFilterLoading] =
            useState(false);


        const [filterError, setFilterError] =
            useState("");


        /* =================================================
           YEARS
        ================================================= */

        const years = [];

        for (
            let year =
                now.getFullYear() - 5;

            year <=
            now.getFullYear() + 1;

            year++
        ) {

            years.push(year);

        }


        /* =================================================
           UPDATE ANALYTICS DATA
        ================================================= */

        useEffect(() => {

            if (dashboardData) {

                setAnalyticsData(
                    dashboardData
                );

            }

        }, [dashboardData]);


        /* =================================================
           APPLY FILTERS
        ================================================= */

        const applyFilters = async () => {

            if (!username) {

                setFilterError(
                    "Username not found. Please login again."
                );

                return;

            }


            setFilterLoading(true);

            setFilterError("");


            try {

                const url =
                    `${API_URL}/api/analytics/dashboard/${encodeURIComponent(username)}/selected` +
                    `?date=${encodeURIComponent(selectedDate)}` +
                    `&month=${encodeURIComponent(selectedMonth)}` +
                    `&year=${encodeURIComponent(selectedYear)}`;


                const response =
                    await fetch(url);


                if (!response.ok) {

                    throw new Error(
                        `Analytics request failed: ${response.status}`
                    );

                }


                const result =
                    await response.json();


                setAnalyticsData(
                    result
                );

            } catch (err) {

                console.error(
                    "Analytics filter error:",
                    err
                );


                setFilterError(
                    "Unable to load selected analytics."
                );

            } finally {

                setFilterLoading(false);

            }

        };


        /* =================================================
           CURRENT DATA
        ================================================= */

        const currentData =
            analyticsData || {};


        const todayEmission =
            Number(
                currentData.todayEmission || 0
            );


        const weeklyEmission =
            Number(
                currentData.weeklyEmission || 0
            );


        const monthlyEmission =
            Number(
                currentData.monthlyEmission || 0
            );


        const yearlyEmission =
            Number(
                currentData.yearlyEmission || 0
            );


        const ecoScore =
            Number(
                currentData.ecoScore || 0
            );


        /* =================================================
           DAILY DATA
        ================================================= */

        let dailyData = [];

        if (
            Array.isArray(
                currentData.dailyData
            )
        ) {

            dailyData =
                currentData.dailyData.map(
                    item => ({

                        day:
                            item.day ||
                            selectedDate,

                        emission:
                            Number(
                                item.emission || 0
                            )

                    })
                );

        }


        if (dailyData.length === 0) {

            dailyData = [

                {
                    day:
                    selectedDate,

                    emission:
                    todayEmission
                }

            ];

        }


        /* =================================================
           WEEKLY DATA
        ================================================= */

        const weekDays = [
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
            "SUN"
        ];


        const weeklyData =
            weekDays.map(
                day => ({

                    day: day,

                    emission: 0

                })
            );


        if (
            Array.isArray(
                currentData.weeklyData
            )
        ) {

            currentData.weeklyData.forEach(
                item => {

                    if (!item) {
                        return;
                    }


                    if (
                        typeof item.day ===
                        "string"
                    ) {

                        const day =
                            item.day
                                .trim()
                                .toUpperCase()
                                .substring(0, 3);


                        const index =
                            weekDays.indexOf(day);


                        if (index >= 0) {

                            weeklyData[index]
                                .emission =
                                Number(
                                    item.emission || 0
                                );

                        }

                        return;

                    }


                    if (item.date) {

                        const dateString =
                            String(
                                item.date
                            ).substring(
                                0,
                                10
                            );


                        const date =
                            new Date(
                                `${dateString}T00:00:00`
                            );


                        if (
                            !Number.isNaN(
                                date.getTime()
                            )
                        ) {

                            const jsDay =
                                date.getDay();


                            const index =
                                jsDay === 0
                                    ? 6
                                    : jsDay - 1;


                            if (
                                index >= 0 &&
                                index < 7
                            ) {

                                weeklyData[index]
                                    .emission +=
                                    Number(
                                        item.emission ||
                                        0
                                    );

                            }

                        }

                    }

                }
            );

        }


        /* =================================================
           MONTHLY DATA
        ================================================= */

        const monthlyData =
            Array.isArray(
                currentData.monthlyData
            )
                ? currentData.monthlyData.map(
                    item => ({

                        day:
                        item.day,

                        emission:
                            Number(
                                item.emission || 0
                            )

                    })
                )
                : [];


        /* =================================================
           YEARLY DATA
        ================================================= */

        const yearlyData =
            Array.isArray(
                currentData.yearlyData
            )
                ? currentData.yearlyData.map(
                    item => ({

                        month:
                        item.month,

                        emission:
                            Number(
                                item.emission || 0
                            )

                    })
                )
                : [];


        /* =================================================
           CATEGORY DATA
        ================================================= */

        const categoryData =
            Object.entries(
                currentData.categoryData || {}
            ).map(
                ([name, value]) => ({

                    name: name,

                    value:
                        Number(value) || 0

                })
            );


        /* =================================================
           RECENT ACTIVITIES
        ================================================= */

        const recentActivities =
            Array.isArray(
                currentData.recentActivities
            )
                ? currentData.recentActivities
                : [];


        /* =================================================
           SELECTED DATE ACTIVITIES
        ================================================= */

        const selectedDateActivities =
            Array.isArray(
                currentData.selectedDateActivities
            )
                ? currentData.selectedDateActivities
                : [];


        return (

            <>

                <DashboardHeader />


                {/* INTRO */}

                <div className="welcome-section">

                    <div>

                        <h2 className="welcome-title">
                            Emission Analytics
                        </h2>

                        <p className="welcome-description">
                            Analyze your carbon footprint across
                            different dates, weeks, months and years.
                        </p>

                    </div>

                </div>


                {/* FILTERS */}

                <div className="analytics-filters">

                    <div className="filter-heading">

                        <div className="filter-heading-icon">
                            ⚙️
                        </div>

                        <div>

                            <h3>
                                Analytics Filters
                            </h3>

                            <p>
                                Choose a date, month and year
                                to explore your emissions
                            </p>

                        </div>

                    </div>


                    <div className="filter-controls">

                        {/* DATE */}

                        <div className="filter-group">

                            <label>
                                📅 Select Date
                            </label>

                            <div className="filter-input-wrapper">

                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* MONTH */}

                        <div className="filter-group">

                            <label>
                                🗓️ Select Month
                            </label>

                            <div className="filter-input-wrapper">

                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) =>
                                        setSelectedMonth(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* YEAR */}

                        <div className="filter-group">

                            <label>
                                📆 Select Year
                            </label>

                            <div className="filter-input-wrapper">

                                <select
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(
                                            Number(
                                                e.target.value
                                            )
                                        )
                                    }
                                >

                                    {years.map(
                                        year => (

                                            <option
                                                key={year}
                                                value={year}
                                            >
                                                {year}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* APPLY */}

                        <button
                            type="button"
                            className="apply-filter-btn"
                            onClick={applyFilters}
                            disabled={filterLoading}
                        >

                            {filterLoading
                                ? "⏳ Loading..."
                                : "🔍 Apply Filters"}

                        </button>

                    </div>

                </div>


                {/* FILTER ERROR */}

                {filterError && (

                    <div
                        className="dashboard-error"
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        {filterError}
                    </div>

                )}


                {/* SUMMARY */}

                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            🌱
                        </div>

                        <div className="stat-card-title">
                            SELECTED DAY
                        </div>

                        <div className="stat-card-value">

                            {todayEmission.toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            {selectedDate}
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            📅
                        </div>

                        <div className="stat-card-title">
                            SELECTED WEEK
                        </div>

                        <div className="stat-card-value">

                            {weeklyEmission.toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            Monday - Sunday
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            📈
                        </div>

                        <div className="stat-card-title">
                            SELECTED MONTH
                        </div>

                        <div className="stat-card-value">

                            {monthlyEmission.toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            {selectedMonth}
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            🌍
                        </div>

                        <div className="stat-card-title">
                            SELECTED YEAR
                        </div>

                        <div className="stat-card-value">

                            {yearlyEmission.toFixed(2)}

                            {" "}kg CO₂e

                        </div>

                        <div className="stat-card-description">
                            {selectedYear}
                        </div>

                    </div>

                </div>


                {/* ECO SCORE */}

                <div className="welcome-section">

                    <div>

                        <h2 className="welcome-title">
                            Eco Score
                        </h2>

                        <p className="welcome-description">
                            Your sustainability score for
                            the selected period.
                        </p>

                    </div>

                    <div className="eco-score">

                        <div className="eco-score-value">
                            {ecoScore.toFixed(0)}/100
                        </div>

                        <div className="eco-score-label">
                            Eco Score
                        </div>

                    </div>

                </div>


                {/* DAILY */}

                <AnalyticsChart
                    title="Daily Emissions"
                    subtitle={`Emission for ${selectedDate}`}
                    data={dailyData}
                    xKey="day"
                    type="bar"
                />


                {/* WEEKLY */}

                <AnalyticsChart
                    title="Weekly Emissions"
                    subtitle="Monday to Sunday"
                    data={weeklyData}
                    xKey="day"
                    type="line"
                />


                {/* MONTHLY */}

                <AnalyticsChart
                    title="Monthly Emissions"
                    subtitle={`Daily emissions throughout ${selectedMonth}`}
                    data={monthlyData}
                    xKey="day"
                    type="line"
                />


                {/* YEARLY */}

                <AnalyticsChart
                    title="Yearly Emissions"
                    subtitle={`Monthly emissions for ${selectedYear}`}
                    data={yearlyData}
                    xKey="month"
                    type="bar"
                />


                {/* CATEGORY + ACTIVITIES */}

                <div className="charts-grid">

                    <div className="chart-card">

                        <div className="chart-header">

                            <h3 className="chart-title">
                                Emissions by Category
                            </h3>

                            <p className="chart-subtitle">
                                Category breakdown for {selectedMonth}
                            </p>

                        </div>


                        <div className="chart-container">

                            {categoryData.length === 0 ? (

                                <div className="no-data">
                                    No category data available.
                                </div>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >

                                    <PieChart>

                                        <Pie
                                            data={categoryData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65}
                                            outerRadius={105}
                                            paddingAngle={3}
                                        >

                                            {categoryData.map(
                                                (entry, index) => (

                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={[
                                                            "#14d9a4",
                                                            "#60a5fa",
                                                            "#f59e0b",
                                                            "#a78bfa"
                                                        ][
                                                        index % 4
                                                            ]}
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


                    <ActivityTable
                        activities={
                            selectedDateActivities
                        }
                        title="Selected Date Activities"
                        subtitle={
                            `Activities recorded on ${selectedDate}`
                        }
                    />

                </div>


                {/* RECENT */}

                <ActivityTable
                    activities={recentActivities}
                    title="Recent Activities"
                    subtitle="Your latest recorded activities"
                    onAdd={() =>
                        setActivePage("logActivity")
                    }
                />

            </>

        );

    };


    /* =====================================================
       ANALYTICS CHART
    ===================================================== */

    const AnalyticsChart = ({
                                title,
                                subtitle,
                                data,
                                xKey,
                                type
                            }) => (

        <div className="chart-card">

            <div className="chart-header">

                <h3 className="chart-title">
                    {title}
                </h3>

                <p className="chart-subtitle">
                    {subtitle}
                </p>

            </div>


            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    {type === "bar" ? (

                        <BarChart data={data}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey={xKey}
                            />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="emission"
                                fill="#14d9a4"
                                radius={[
                                    8,
                                    8,
                                    0,
                                    0
                                ]}
                            />

                        </BarChart>

                    ) : (

                        <LineChart data={data}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey={xKey}
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="emission"
                                stroke="#14d9a4"
                                strokeWidth={3}
                                dot={{ r: 3 }}
                                activeDot={{ r: 6 }}
                            />

                        </LineChart>

                    )}

                </ResponsiveContainer>

            </div>

        </div>

    );


    /* =====================================================
       RECOMMENDATIONS PAGE
    ===================================================== */

    const RecommendationsPage = () => {

        const [
            recommendations,
            setRecommendations
        ] = useState([]);


        const [
            recommendationLoading,
            setRecommendationLoading
        ] = useState(true);


        const [
            recommendationError,
            setRecommendationError
        ] = useState("");


        /* =================================================
           LOAD RECOMMENDATIONS
        ================================================= */

        const loadRecommendations = async () => {

            try {

                setRecommendationLoading(true);

                setRecommendationError("");


                if (!username) {

                    throw new Error(
                        "User is not logged in"
                    );

                }


                const response =
                    await fetch(
                        `${API_URL}/api/recommendations/${encodeURIComponent(username)}`
                    );


                if (!response.ok) {

                    throw new Error(
                        `Recommendation request failed: ${response.status}`
                    );

                }


                const result =
                    await response.json();


                setRecommendations(
                    Array.isArray(result)
                        ? result
                        : []
                );


            } catch (error) {

                console.error(
                    "Recommendation error:",
                    error
                );


                setRecommendationError(
                    "Unable to load recommendations. Please check the Spring Boot server."
                );

            } finally {

                setRecommendationLoading(false);

            }

        };


        /* =================================================
           LOAD WHEN PAGE OPENS
        ================================================= */

        useEffect(() => {

            if (
                activePage ===
                "recommendations"
            ) {

                loadRecommendations();

            }

        }, [activePage]);


        /* =================================================
           ICON
        ================================================= */

        const getIcon = (category) => {

            switch (
                String(category || "")
                    .toLowerCase()
                ) {

                case "transport":
                    return "🚗";

                case "electricity":
                    return "⚡";

                case "food":
                    return "🍽️";

                case "shopping":
                    return "🛍️";

                case "water":
                    return "💧";

                default:
                    return "🌱";

            }

        };


        /* =================================================
           PRIORITY
        ================================================= */

        const getPriorityClass =
            (priority) => {

                switch (
                    String(priority || "")
                        .toUpperCase()
                    ) {

                    case "HIGH":
                        return "recommendation-high";

                    case "MEDIUM":
                        return "recommendation-medium";

                    default:
                        return "recommendation-low";

                }

            };


        /* =================================================
           LOADING
        ================================================= */

        if (recommendationLoading) {

            return (

                <>

                    <DashboardHeader />

                    <div className="recommendation-loading">

                        <div className="ai-loading-icon">
                            ✨
                        </div>

                        <h2>
                            Gemini is analyzing your activities...
                        </h2>

                        <p>
                            Creating personalized ways to reduce
                            your carbon footprint.
                        </p>

                    </div>

                </>

            );

        }


        /* =================================================
           ERROR
        ================================================= */

        if (recommendationError) {

            return (

                <>

                    <DashboardHeader />

                    <div className="recommendation-error">

                        ⚠️ {recommendationError}

                        <br />
                        <br />

                        <button
                            type="button"
                            onClick={
                                loadRecommendations
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </>

            );

        }


        /* =================================================
           PAGE
        ================================================= */

        return (

            <>

                <DashboardHeader />


                {/* HERO */}

                <div className="ai-recommendation-hero">

                    <div className="ai-hero-left">

                        <div className="ai-sparkle">
                            ✨
                        </div>

                        <div>

                            <div className="ai-label">
                                GEMINI AI
                            </div>

                            <h1>
                                Your AI Sustainability Coach
                            </h1>

                            <p>
                                Personalized recommendations
                                based on your real activities
                                and carbon footprint.
                            </p>

                        </div>

                    </div>


                    <div className="ai-hero-right">

                        <div className="ai-orb">
                            🌱
                        </div>

                    </div>

                </div>


                {/* EMPTY */}

                {recommendations.length === 0 ? (

                    <div className="recommendation-empty">

                        <div>
                            🌱
                        </div>

                        <h2>
                            Start your green journey
                        </h2>

                        <p>
                            Log some activities and Gemini
                            will create personalized
                            sustainability recommendations.
                        </p>

                        <button
                            type="button"
                            className="ai-primary-button"
                            onClick={() =>
                                setActivePage(
                                    "logActivity"
                                )
                            }
                        >
                            + Log Activity
                        </button>

                    </div>

                ) : (

                    <>

                        {/* SUMMARY */}

                        <div className="ai-summary">

                            <div className="ai-summary-icon">
                                🧠
                            </div>

                            <div>

                                <h3>
                                    Personalized for you
                                </h3>

                                <p>

                                    Gemini analyzed{" "}

                                    <strong>
                                        {
                                            recommendations.length
                                        }
                                    </strong>{" "}

                                    of your recorded
                                    activities.

                                </p>

                            </div>


                            <button
                                type="button"
                                className="ai-refresh-button"
                                onClick={
                                    loadRecommendations
                                }
                            >
                                🔄 Refresh AI
                            </button>

                        </div>


                        {/* CARDS */}

                        <div className="recommendation-grid">

                            {recommendations.map(
                                (item, index) => (

                                    <div
                                        className="ai-recommendation-card"
                                        key={
                                            `${item.activity || "activity"}-${index}`
                                        }
                                    >

                                        {/* TOP */}

                                        <div className="ai-card-top">

                                            <div className="ai-activity-icon">

                                                {
                                                    getIcon(
                                                        item.category
                                                    )
                                                }

                                            </div>


                                            <div className="ai-activity-info">

                                                <span>
                                                    {
                                                        item.category ||
                                                        "Sustainability"
                                                    }
                                                </span>

                                                <h3>
                                                    {
                                                        item.activity ||
                                                        "Activity"
                                                    }
                                                </h3>

                                            </div>


                                            <div
                                                className={`ai-priority ${getPriorityClass(
                                                    item.priority
                                                )}`}
                                            >
                                                {
                                                    item.priority ||
                                                    "LOW"
                                                }
                                            </div>

                                        </div>


                                        {/* IMPACT */}

                                        <div className="ai-impact">

                                            <div>

                                                <span>
                                                    Your activity
                                                </span>

                                                <strong>

                                                    {
                                                        item.amount ||
                                                        0
                                                    }{" "}

                                                    {
                                                        item.unit ||
                                                        ""
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Carbon impact
                                                </span>

                                                <strong>

                                                    {Number(
                                                        item.emission ||
                                                        0
                                                    ).toFixed(2)}

                                                    {" "}kg CO₂e

                                                </strong>

                                            </div>

                                        </div>


                                        {/* TITLE */}

                                        <h2 className="ai-card-title">

                                            {
                                                item.title ||
                                                "A greener choice for you"
                                            }

                                        </h2>


                                        {/* RECOMMENDATION */}

                                        <div className="ai-message">

                                            <div className="ai-message-icon">
                                                💡
                                            </div>

                                            <div>

                                                <span>
                                                    AI Recommendation
                                                </span>

                                                <p>

                                                    {
                                                        item.recommendation ||
                                                        item.message ||
                                                        "Consider a lower-carbon alternative for this activity."
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* ACTION */}

                                        <div className="ai-action">

                                            <span>
                                                🎯
                                            </span>

                                            <div>

                                                <strong>
                                                    Your next step
                                                </strong>

                                                <p>

                                                    {
                                                        item.action ||
                                                        "Try a more sustainable alternative next time."
                                                    }

                                                </p>

                                            </div>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="ai-card-footer">

                                            <span>
                                                ✨ Generated by Gemini AI
                                            </span>

                                            <span>
                                                EcoTrack
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </>

                )}

            </>

        );

    };


    /* =====================================================
       LOG ACTIVITY PAGE
    ===================================================== */

    const LogActivityPage = () => (

        <LogActivity
            username={username}
            onBack={() =>
                setActivePage("dashboard")
            }
        />

    );


    /* =====================================================
       GOALS PAGE
    ===================================================== */

    const GoalsPage = () => (

        <Goal
            username={username}
        />

    );


    /* =====================================================
       PAGE ROUTING
    ===================================================== */

    const renderPage = () => {

        switch (activePage) {

            case "logActivity":

                return (
                    <LogActivityPage />
                );


            case "analytics":

                return (
                    <AnalyticsPage />
                );


            case "goals":

                return (
                    <GoalsPage />
                );


            case "recommendations":

                return (
                    <RecommendationsPage />
                );


            case "dashboard":

            default:

                return (
                    <DashboardHome />
                );

        }

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        loading &&
        activePage === "dashboard"
    ) {

        return (

            <div className="dashboard-loading">
                Loading your dashboard...
            </div>

        );

    }


    /* =====================================================
       MAIN LAYOUT
    ===================================================== */

    return (

        <div className="dashboard-container">

            <Sidebar />

            <main className="dashboard-main">

                <div className="dashboard-content">

                    {renderPage()}

                </div>

            </main>

        </div>

    );

}


/* =========================================================
   APP
========================================================= */

function App() {

    const [page, setPage] =
        useState(() => {

            const username =
                localStorage.getItem(
                    "username"
                );

            const role =
                localStorage.getItem(
                    "role"
                );


            /* =================================================
               ADMIN
            ================================================= */

            if (
                username &&
                role === "ADMIN"
            ) {

                return "admin";

            }


            /* =================================================
               NORMAL USER
            ================================================= */

            if (username) {

                return "dashboard";

            }


            /* =================================================
               NOT LOGGED IN
            ================================================= */

            return "landing";

        });


    /* =====================================================
       LOGIN
    ===================================================== */

    const handleLogin = (
        username,
        role
    ) => {

        localStorage.setItem(
            "username",
            username
        );

        localStorage.setItem(
            "role",
            role || "USER"
        );


        if (
            role === "ADMIN"
        ) {

            setPage("admin");

        } else {

            setPage("dashboard");

        }

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        console.log(
            "Logging out..."
        );


        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "role"
        );


        /* IMPORTANT:
           Go to LANDING PAGE */

        setPage("landing");

    };


    /* =====================================================
       LANDING PAGE
    ===================================================== */

    if (
        page === "landing"
    ) {

        return (

            <LandingPage
                onLogin={() =>
                    setPage("login")
                }

                onRegister={() =>
                    setPage("register")
                }
            />

        );

    }


    /* =====================================================
       LOGIN PAGE
    ===================================================== */

    if (
        page === "login"
    ) {

        return (

            <Login
                onLogin={handleLogin}
                onRegister={() =>
                    setPage("register")
                }
            />

        );

    }


    /* =====================================================
       REGISTER PAGE
    ===================================================== */

    if (
        page === "register"
    ) {

        return (

            <Register
                onBackToLogin={() =>
                    setPage("login")
                }
            />

        );

    }


    /* =====================================================
       ADMIN PAGE
    ===================================================== */

    if (
        page === "admin"
    ) {

        return (

            <Admin
                onLogout={handleLogout}
            />

        );

    }


    /* =====================================================
       USER DASHBOARD
    ===================================================== */

    return (

        <Dashboard
            onLogout={handleLogout}
        />

    );

}


export default App;