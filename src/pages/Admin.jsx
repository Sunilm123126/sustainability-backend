import React, { useEffect, useState } from "react";
import "../assets/admindashboard.css";
import AdminAIChatbot from "../components/AdminAIChatbot";
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
    // LEADER STATES
    // =====================================================

    const [leaders, setLeaders] = useState([]);
    const [leadersLoading, setLeadersLoading] = useState(false);

    // =====================================================
    // ANALYTICS FILTER STATES
    // =====================================================

    const getCurrentDate = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };


    const getCurrentMonth = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        return `${year}-${month}`;
    };


    const getCurrentYear = () => {

        return new Date().getFullYear();

    };


    const [selectedDate, setSelectedDate] =
        useState(getCurrentDate());


    const [selectedMonth, setSelectedMonth] =
        useState(getCurrentMonth());


    const [selectedYear, setSelectedYear] =
        useState(getCurrentYear());


    const [filteredAnalytics, setFilteredAnalytics] =
        useState(null);


    const [filterLoading, setFilterLoading] =
        useState(false);


    const [filterError, setFilterError] =
        useState("");


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
                throw new Error(
                    "Unable to load users"
                );
            }

            const data =
                await response.json();

            setUsers(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load users."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD NORMAL ADMIN ANALYTICS
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

            const data =
                await response.json();

            console.log(
                "Admin Analytics:",
                data
            );

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
    // LOAD FILTERED ADMIN ANALYTICS
    // =====================================================

    const loadFilteredAnalytics = async (
        date = selectedDate,
        month = selectedMonth,
        year = selectedYear
    ) => {

        try {

            setFilterLoading(true);
            setFilterError("");

            const url =
                "http://localhost:8081/api/admin/analytics/selected" +
                `?date=${encodeURIComponent(date)}` +
                `&month=${encodeURIComponent(month)}` +
                `&year=${encodeURIComponent(year)}`;


            console.log(
                "Filtered Admin Analytics URL:",
                url
            );


            const response =
                await fetch(url);


            if (!response.ok) {

                throw new Error(
                    `Filtered analytics request failed: ${response.status}`
                );

            }


            const data =
                await response.json();


            console.log(
                "Filtered Admin Analytics:",
                data
            );


            setFilteredAnalytics(data);


        } catch (error) {

            console.error(
                "Filtered analytics error:",
                error
            );


            setFilterError(
                "Unable to load filtered analytics. Please check the Spring Boot server."
            );

        } finally {

            setFilterLoading(false);

        }

    };


    // =====================================================
    // LOAD LEADERS
    // =====================================================

    const loadLeaders = async () => {

        try {

            setLeadersLoading(true);

            const response =
                await fetch(
                    "http://localhost:8081/api/admin/leaders"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load leaders"
                );

            }


            const data =
                await response.json();


            console.log(
                "Leaders:",
                data
            );


            setLeaders(data);

        } catch (error) {

            console.error(
                "Error loading leaders:",
                error
            );

            setLeaders([]);

        } finally {

            setLeadersLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadUsers();
        loadAnalytics();
        loadFilteredAnalytics();
        loadLeaders();

    }, []);


    // =====================================================
    // DELETE USER
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this user?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:8081/users/${id}`,
                    {
                        method: "DELETE",
                    }
                );


            const result =
                await response.text();


            if (!response.ok) {

                alert(result);

                return;

            }


            setUsers(
                (previousUsers) =>
                    previousUsers.filter(
                        (user) =>
                            user.id !== id
                    )
            );


            loadAnalytics();

            loadFilteredAnalytics();

            loadLeaders();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete user."
            );

        }

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "username"
        );

        localStorage.removeItem(
            "role"
        );

        onLogout();

    };


    // =====================================================
    // REFRESH EVERYTHING
    // =====================================================

    const handleRefresh = () => {

        loadUsers();
        loadAnalytics();
        loadFilteredAnalytics();
        loadLeaders();

    };


    // =====================================================
    // APPLY ANALYTICS FILTER
    // =====================================================

    const handleApplyFilter = () => {

        loadFilteredAnalytics(
            selectedDate,
            selectedMonth,
            selectedYear
        );

    };


    // =====================================================
    // PIE DATA
    // =====================================================

    const getCategoryData = (
        analyticsData = analytics
    ) => {

        if (
            !analyticsData?.categoryData
        ) {

            return [];

        }


        return Object.entries(
            analyticsData.categoryData
        ).map(
            ([name, value]) => ({
                name,
                value,
            })
        );

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

                    <AdminAIChatbot />

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


                            {users.map(
                                (user) => (

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

                                                {user.role ||
                                                    "USER"}

                                            </span>

                                        </div>


                                        <div>

                                            <button
                                                className="delete-user-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        user.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

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

        const currentAnalytics =
            filteredAnalytics ||
            analytics;


        if (
            filterLoading &&
            !currentAnalytics
        ) {

            return (

                <div className="admin-empty">

                    <div className="admin-spinner"></div>

                    <p>
                        Loading admin analytics...
                    </p>

                </div>

            );

        }


        if (
            analyticsError &&
            !currentAnalytics
        ) {

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


        if (!currentAnalytics) {
            return null;
        }


        const categoryData =
            getCategoryData(
                currentAnalytics
            );


        return (

            <>

                {/* =================================================
                    HEADER
                ================================================= */}

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
                        onClick={loadFilteredAnalytics}
                        disabled={filterLoading}
                    >

                        {filterLoading
                            ? "⏳ Loading..."
                            : "↻ Refresh Analytics"}

                    </button>

                </section>


                {/* =================================================
                    DATE / MONTH / YEAR FILTER
                ================================================= */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Analytics Filters
                            </h2>

                            <p>
                                Select date, month and year to view dynamic platform analytics.
                            </p>

                        </div>

                    </div>


                    <div className="admin-analytics-filters">


                        {/* DATE */}

                        <div className="admin-filter-group">

                            <label>
                                Select Date
                            </label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(event) =>
                                    setSelectedDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* MONTH */}

                        <div className="admin-filter-group">

                            <label>
                                Select Month
                            </label>

                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(event) =>
                                    setSelectedMonth(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* YEAR */}

                        <div className="admin-filter-group">

                            <label>
                                Select Year
                            </label>

                            <select
                                value={selectedYear}
                                onChange={(event) =>
                                    setSelectedYear(
                                        Number(
                                            event.target.value
                                        )
                                    )
                                }
                            >

                                {Array.from(
                                    {
                                        length: 7,
                                    },
                                    (_, index) =>
                                        new Date()
                                            .getFullYear() -
                                        5 +
                                        index
                                ).map(
                                    (year) => (

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


                        {/* APPLY */}

                        <button
                            className="admin-refresh"
                            onClick={
                                handleApplyFilter
                            }
                            disabled={
                                filterLoading
                            }
                        >

                            {filterLoading
                                ? "⏳ Applying..."
                                : "🔍 Apply Filter"}

                        </button>

                    </div>


                    {filterError && (

                        <div
                            className="admin-message"
                            style={{
                                marginTop: "15px",
                            }}
                        >
                            {filterError}
                        </div>

                    )}

                </section>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="admin-stats">


                    {/* DATE */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon green">
                            📅
                        </div>

                        <p>
                            Selected Date
                        </p>

                        <h2>
                            {Number(
                                currentAnalytics.todayEmission ||
                                0
                            ).toFixed(2)}
                        </h2>

                        <small>
                            kg CO₂e
                        </small>

                    </div>


                    {/* WEEK */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon blue">
                            📊
                        </div>

                        <p>
                            Selected Week
                        </p>

                        <h2>
                            {Number(
                                currentAnalytics.weeklyEmission ||
                                0
                            ).toFixed(2)}
                        </h2>

                        <small>
                            kg CO₂e
                        </small>

                    </div>


                    {/* MONTH */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon purple">
                            📈
                        </div>

                        <p>
                            Selected Month
                        </p>

                        <h2>
                            {Number(
                                currentAnalytics.monthlyEmission ||
                                0
                            ).toFixed(2)}
                        </h2>

                        <small>
                            kg CO₂e
                        </small>

                    </div>


                    {/* YEAR */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon orange">
                            🌍
                        </div>

                        <p>
                            Selected Year
                        </p>

                        <h2>
                            {Number(
                                currentAnalytics.yearlyEmission ||
                                0
                            ).toFixed(2)}
                        </h2>

                        <small>
                            kg CO₂e
                        </small>

                    </div>

                </section>


                {/* =================================================
                    DAILY + WEEKLY
                ================================================= */}

                <section className="admin-chart-grid">


                    {/* DAILY */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Today's Emissions
                                </h2>

                                <p>
                                    Emissions for {selectedDate}
                                </p>

                            </div>

                        </div>


                        <div className="admin-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={300}
                            >

                                <BarChart
                                    data={
                                        currentAnalytics.dailyData ||
                                        []
                                    }
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
                                    data={
                                        currentAnalytics.weeklyData ||
                                        []
                                    }
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


                {/* =================================================
                    MONTHLY
                ================================================= */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Monthly Emissions
                            </h2>

                            <p>
                                Daily emissions for {selectedMonth}
                            </p>

                        </div>

                    </div>


                    <div className="admin-chart-container large">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <LineChart
                                data={
                                    currentAnalytics.monthlyData ||
                                    []
                                }
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


                {/* =================================================
                    YEARLY
                ================================================= */}

                <section className="admin-users-card">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Yearly Emissions
                            </h2>

                            <p>
                                Monthly emissions for {selectedYear}
                            </p>

                        </div>

                    </div>


                    <div className="admin-chart-container large">

                        <ResponsiveContainer
                            width="100%"
                            height={350}
                        >

                            <BarChart
                                data={
                                    currentAnalytics.yearlyData ||
                                    []
                                }
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


                {/* =================================================
                    CATEGORY + TOP USERS
                ================================================= */}

                <section className="admin-chart-grid">


                    {/* CATEGORY */}

                    <div className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Emissions by Category
                                </h2>

                                <p>
                                    Category breakdown for {selectedMonth}
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
                                            data={
                                                categoryData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >

                                            {categoryData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

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
                                    Users with highest emissions for {selectedMonth}
                                </p>

                            </div>

                        </div>


                        {currentAnalytics.topUsers?.length === 0 ? (

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


                                {currentAnalytics.topUsers?.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <div
                                            className="admin-table-row"
                                            key={
                                                user.username
                                            }
                                        >

                                            <div className="user-id">
                                                #{index + 1}
                                            </div>


                                            <div className="user-name">

                                                <div className="user-mini-avatar">

                                                    {user.username
                                                        ?.charAt(
                                                            0
                                                        )
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


                {/* =================================================
                    SELECTED DATE ACTIVITIES
                ================================================= */}

                {currentAnalytics.selectedDateActivities && (

                    <section className="admin-users-card">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Selected Date Activities
                                </h2>

                                <p>
                                    Activities recorded on {selectedDate}
                                </p>

                            </div>

                        </div>


                        {currentAnalytics.selectedDateActivities.length === 0 ? (

                            <div className="admin-empty">

                                <div className="admin-empty-icon">
                                    🌱
                                </div>

                                <h3>
                                    No activities
                                </h3>

                                <p>
                                    No activities were recorded on this date.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-table">

                                <div className="admin-table-header">

                                    <div>
                                        User
                                    </div>

                                    <div>
                                        Activity
                                    </div>

                                    <div>
                                        Category
                                    </div>

                                    <div>
                                        Emission
                                    </div>

                                </div>


                                {currentAnalytics.selectedDateActivities.map(
                                    (activity) => (

                                        <div
                                            className="admin-table-row"
                                            key={
                                                activity.id
                                            }
                                        >

                                            <div>
                                                {activity.username}
                                            </div>

                                            <div>
                                                {activity.activity ||
                                                    "Activity"}
                                            </div>

                                            <div>
                                                {activity.category ||
                                                    "Other"}
                                            </div>

                                            <div>
                                                {Number(
                                                    activity.emission ||
                                                    0
                                                ).toFixed(2)}{" "}
                                                kg
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}

            </>

        );

    };


    // =====================================================
    // LEADERS PAGE
    // =====================================================

    const LeadersPage = () => {

        return (

            <section className="admin-users-card">

                <div className="admin-section-header">

                    <div>

                        <h2>
                            🏆 Sustainability Leaders
                        </h2>

                        <p>
                            Users with the highest sustainability activity participation
                        </p>

                    </div>


                    <button
                        className="admin-refresh"
                        onClick={loadLeaders}
                    >
                        ↻ Refresh
                    </button>

                </div>


                {leadersLoading ? (

                    <div className="admin-empty">

                        <div className="admin-spinner"></div>

                        <p>
                            Loading leaderboard...
                        </p>

                    </div>

                ) : leaders.length === 0 ? (

                    <div className="admin-empty">

                        <div className="admin-empty-icon">
                            🏆
                        </div>

                        <h3>
                            No leaders yet
                        </h3>

                        <p>
                            Users need to log activities before appearing on the leaderboard.
                        </p>

                    </div>

                ) : (

                    <div className="leaders-list">

                        {leaders.map(
                            (
                                leader,
                                index
                            ) => (

                                <div
                                    className="leader-row"
                                    key={
                                        leader.username
                                    }
                                >

                                    <div className="leader-rank">

                                        {index === 0
                                            ? "🥇"
                                            : index === 1
                                                ? "🥈"
                                                : index === 2
                                                    ? "🥉"
                                                    : `#${index + 1}`}

                                    </div>


                                    <div className="leader-avatar">

                                        {leader.username
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>


                                    <div className="leader-user">

                                        <strong>
                                            {leader.username}
                                        </strong>

                                        <span>
                                            Sustainability participant
                                        </span>

                                    </div>


                                    <div className="leader-stat">

                                        <strong>
                                            {leader.activityCount}
                                        </strong>

                                        <span>
                                            Activities
                                        </span>

                                    </div>


                                    <div className="leader-stat">

                                        <strong>
                                            {Number(
                                                leader.emission ||
                                                0
                                            ).toFixed(2)}
                                        </strong>

                                        <span>
                                            kg CO₂e
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

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

            case "leaders":
                return <LeadersPage />;

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
                            setActivePage(
                                "dashboard"
                            )
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
                            setActivePage(
                                "users"
                            )
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
                            setActivePage(
                                "activities"
                            )
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
                            setActivePage(
                                "analytics"
                            )
                        }
                    >

                        <span>
                            📈
                        </span>

                        Analytics

                    </button>


                    <button
                        className={`admin-nav-item ${
                            activePage === "leaders"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActivePage(
                                "leaders"
                            )
                        }
                    >

                        <span>
                            🏆
                        </span>

                        Leaders

                    </button>


                </nav>


                <div className="admin-sidebar-bottom">

                    <button
                        className="admin-logout"
                        onClick={
                            handleLogout
                        }
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