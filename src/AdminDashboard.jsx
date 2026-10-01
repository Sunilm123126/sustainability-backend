import React, { useEffect, useState } from "react";
import "./assets/AdminDashboard.css";


function AdminDashboard({ username, onLogout }) {

    const [activities, setActivities] = useState([]);

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] = useState(null);


    // ==========================================
    // FETCH ALL ACTIVITIES
    // ==========================================

    const fetchActivities = async () => {

        try {

            const response = await fetch(
                "http://localhost:8081/activities"
            );

            if (!response.ok) {

                console.error(
                    "Failed to fetch activities"
                );

                return;
            }

            const data = await response.json();

            setActivities(data);

            setLastUpdated(new Date());

        } catch (error) {

            console.error(
                "Error fetching activities:",
                error
            );

        }

    };


    // ==========================================
    // FETCH USERS
    // ==========================================

    const fetchUsers = async () => {

        try {

            const response = await fetch(
                "http://localhost:8081/users"
            );

            if (!response.ok) {

                return;
            }

            const data = await response.json();

            setUsers(data);

        } catch (error) {

            console.error(
                "Error fetching users:",
                error
            );

        }

    };


    // ==========================================
    // LOAD DATA AUTOMATICALLY
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await fetchActivities();

            await fetchUsers();

            setLoading(false);

        };


        loadData();


        // AUTO REFRESH EVERY 3 SECONDS

        const interval = setInterval(() => {

            fetchActivities();

            fetchUsers();

        }, 3000);


        return () => {

            clearInterval(interval);

        };

    }, []);


    // ==========================================
    // CALCULATIONS
    // ==========================================

    const totalEmission = activities.reduce(
        (total, item) =>
            total + Number(item.emission || 0),
        0
    );


    const totalActivities =
        activities.length;


    const totalUsers =
        users.length;


    // ==========================================
    // CATEGORY TOTALS
    // ==========================================

    const transportEmission = activities
        .filter(
            item => item.category === "Transport"
        )
        .reduce(
            (total, item) =>
                total + Number(item.emission || 0),
            0
        );


    const electricityEmission = activities
        .filter(
            item => item.category === "Electricity"
        )
        .reduce(
            (total, item) =>
                total + Number(item.emission || 0),
            0
        );


    const foodEmission = activities
        .filter(
            item => item.category === "Food"
        )
        .reduce(
            (total, item) =>
                total + Number(item.emission || 0),
            0
        );


    const shoppingEmission = activities
        .filter(
            item => item.category === "Shopping"
        )
        .reduce(
            (total, item) =>
                total + Number(item.emission || 0),
            0
        );

// ==========================================
// LEADERBOARD
// ==========================================

    const leaderboard = users
        .map((user) => {

            const username = user.username;

            const userActivities = activities.filter(
                (item) => item.username === username
            );

            const activityCount = userActivities.length;

            const userEmission = userActivities.reduce(
                (total, item) =>
                    total + Number(item.emission || 0),
                0
            );

            return {
                username,
                activityCount,
                emission: userEmission
            };
        })
        .filter((user) => user.activityCount > 0)
        .sort(
            (a, b) =>
                b.activityCount - a.activityCount
        );


// ==========================================
// BADGES
// ==========================================

    const getBadges = (username) => {

        const userActivities = activities.filter(
            (item) => item.username === username
        );

        const activityCount = userActivities.length;

        const badges = [];

        if (activityCount >= 1) {
            badges.push({
                icon: "🌱",
                name: "Eco Starter",
                description: "Logged your first sustainability activity"
            });
        }

        if (activityCount >= 5) {
            badges.push({
                icon: "🌿",
                name: "Eco Explorer",
                description: "Logged 5 or more activities"
            });
        }

        if (activityCount >= 10) {
            badges.push({
                icon: "🌍",
                name: "Eco Warrior",
                description: "Logged 10 or more activities"
            });
        }

        if (activityCount >= 25) {
            badges.push({
                icon: "🏆",
                name: "Eco Champion",
                description: "Logged 25 or more activities"
            });
        }

        return badges;
    };
    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="admin-loading">

                Loading admin dashboard…

            </div>

        );

    }


    return (

        <div className="admin-app">


            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="admin-sidebar">


                <div className="admin-brand">

                    <span className="brand-icon">
                        🌱
                    </span>

                    <span className="brand-text">
                        EcoTrack
                    </span>

                </div>


                {/* MAIN MENU */}

                <div className="admin-menu-title">

                    Main menu

                </div>


                <button className="admin-menu active">

                    <span className="menu-icon">📊</span>

                    <span className="menu-text">
                        Dashboard
                    </span>

                </button>


                <button className="admin-menu">

                    <span className="menu-icon">👥</span>

                    <span className="menu-text">
                        Users
                    </span>

                </button>


                <button className="admin-menu">

                    <span className="menu-icon">🌍</span>

                    <span className="menu-text">
                        Activities
                    </span>

                </button>


                <button className="admin-menu">

                    <span className="menu-icon">📈</span>

                    <span className="menu-text">
                        Analytics
                    </span>

                </button>


                <div className="admin-menu-title management-title">

                    Management

                </div>


                <button className="admin-menu">

                    <span className="menu-icon">⚙️</span>

                    <span className="menu-text">
                        Settings
                    </span>

                </button>


                <button
                    className="admin-menu logout"
                    onClick={onLogout}
                >

                    <span className="menu-icon">🚪</span>

                    <span className="menu-text">
                        Logout
                    </span>

                </button>


            </aside>



            {/* =====================================
                MAIN AREA
            ===================================== */}

            <main className="admin-main">


                {/* HEADER */}

                <header className="admin-header">


                    <div>

                        <h1>
                            Admin dashboard
                        </h1>

                        <p>
                            Monitor your sustainability platform
                        </p>

                    </div>


                    <div className="admin-header-right">

                        <div className="admin-user">


                            <div>

                                <strong>

                                    {username}

                                </strong>


                                <small>
                                    Administrator
                                </small>

                            </div>


                            <div className="admin-avatar">

                                {username
                                    ? username
                                        .charAt(0)
                                        .toUpperCase()
                                    : "A"
                                }

                            </div>


                        </div>

                    </div>


                </header>



                <section className="admin-content">


                    {/* =====================================
                        LIVE STATUS
                    ===================================== */}

                    <div className="last-updated">

                        <span>
                            🟢 Live data connected
                        </span>

                        <span>

                            {lastUpdated
                                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                                : "Waiting for data…"
                            }

                        </span>

                    </div>


                    {/* =====================================
                        STATS
                    ===================================== */}

                    <div className="admin-stats">


                        <div className="admin-stat-card">

                            <div className="stat-icon">

                                👥

                            </div>


                            <div>

                                <p>
                                    Total users
                                </p>

                                <h2>
                                    {totalUsers}
                                </h2>

                            </div>

                        </div>



                        <div className="admin-stat-card">

                            <div className="stat-icon">

                                📝

                            </div>


                            <div>

                                <p>
                                    Total activities
                                </p>

                                <h2>
                                    {totalActivities}
                                </h2>

                            </div>

                        </div>



                        <div className="admin-stat-card">

                            <div className="stat-icon">

                                🌍

                            </div>


                            <div>

                                <p>
                                    Total CO₂ emission
                                </p>

                                <h2>

                                    {totalEmission.toFixed(2)}

                                    <small>
                                        {" "}kg
                                    </small>

                                </h2>

                            </div>

                        </div>



                        <div className="admin-stat-card">

                            <div className="stat-icon">

                                🌱

                            </div>


                            <div>

                                <p>
                                    Platform status
                                </p>

                                <h2>
                                    Active
                                </h2>

                            </div>

                        </div>


                    </div>



                    {/* =====================================
                        CATEGORY ANALYTICS
                    ===================================== */}

                    <div className="admin-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    Carbon emission by category
                                </h2>

                                <p>
                                    Live data from user activities
                                </p>

                            </div>


                            <button
                                className="refresh-btn"
                                onClick={fetchActivities}
                            >

                                🔄 Refresh

                            </button>


                        </div>


                        <div className="category-stats">


                            <div className="category-stat">

                                <span className="category-icon">
                                    🚗
                                </span>

                                <div>

                                    <p>
                                        Transport
                                    </p>

                                    <h3>

                                        {transportEmission.toFixed(2)}
                                        {" "}
                                        <small>kg CO₂e</small>

                                    </h3>

                                </div>

                            </div>



                            <div className="category-stat">

                                <span className="category-icon">
                                    ⚡
                                </span>

                                <div>

                                    <p>
                                        Electricity
                                    </p>

                                    <h3>

                                        {electricityEmission.toFixed(2)}
                                        {" "}
                                        <small>kg CO₂e</small>

                                    </h3>

                                </div>

                            </div>



                            <div className="category-stat">

                                <span className="category-icon">
                                    🍔
                                </span>

                                <div>

                                    <p>
                                        Food
                                    </p>

                                    <h3>

                                        {foodEmission.toFixed(2)}
                                        {" "}
                                        <small>kg CO₂e</small>

                                    </h3>

                                </div>

                            </div>



                            <div className="category-stat">

                                <span className="category-icon">
                                    🛍️
                                </span>

                                <div>

                                    <p>
                                        Shopping
                                    </p>

                                    <h3>

                                        {shoppingEmission.toFixed(2)}
                                        {" "}
                                        <small>kg CO₂e</small>

                                    </h3>

                                </div>

                            </div>


                        </div>


                    </div>

                    <button className="admin-menu">
                        <span className="menu-icon">🏆</span>

                        <span className="menu-text">
        Leaders
    </span>
                    </button>

                    <button className="admin-menu">
                        <span className="menu-icon">🏅</span>

                        <span className="menu-text">
        Badges
    </span>
                    </button>{/* =====================================
    LEADERBOARD
===================================== */}

                    <div className="admin-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    🏆 Sustainability Leaders
                                </h2>

                                <p>
                                    Users with the highest activity participation
                                </p>

                            </div>

                            <span className="activity-count">
            {leaderboard.length} active users
        </span>

                        </div>


                        <div className="leaderboard-container">

                            {leaderboard.length === 0 ? (

                                <div className="no-data">
                                    No leaderboard data available
                                </div>

                            ) : (

                                leaderboard
                                    .slice(0, 10)
                                    .map((leader, index) => (

                                        <div
                                            className="leader-card"
                                            key={leader.username}
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
                                                    .charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div className="leader-info">

                                                <h3>
                                                    {leader.username}
                                                </h3>

                                                <p>
                                                    {leader.activityCount} activities logged
                                                </p>

                                            </div>


                                            <div className="leader-emission">

                                                <strong>
                                                    {leader.emission.toFixed(2)}
                                                </strong>

                                                <span>
                                kg CO₂e
                            </span>

                                            </div>

                                        </div>

                                    ))

                            )}

                        </div>

                    </div>{/* =====================================
    BADGES
===================================== */}

                    <div className="admin-section">

                        <div className="section-header">

                            <div>

                                <h2>
                                    🏅 EcoTrack Badges
                                </h2>

                                <p>
                                    Achievement badges earned by users
                                </p>

                            </div>

                            <span className="activity-count">
            {users.length} registered users
        </span>

                        </div>


                        <div className="badges-grid">

                            {[
                                {
                                    icon: "🌱",
                                    name: "Eco Starter",
                                    description: "Logged at least one activity",
                                    requirement: 1
                                },
                                {
                                    icon: "🌿",
                                    name: "Eco Explorer",
                                    description: "Logged 5 or more activities",
                                    requirement: 5
                                },
                                {
                                    icon: "🌍",
                                    name: "Eco Warrior",
                                    description: "Logged 10 or more activities",
                                    requirement: 10
                                },
                                {
                                    icon: "🏆",
                                    name: "Eco Champion",
                                    description: "Logged 25 or more activities",
                                    requirement: 25
                                }
                            ].map((badge) => {

                                const earnedBy = users.filter(
                                    (user) => {

                                        const count = activities.filter(
                                            (item) =>
                                                item.username === user.username
                                        ).length;

                                        return count >= badge.requirement;
                                    }
                                ).length;


                                return (

                                    <div
                                        className="badge-card"
                                        key={badge.name}
                                    >

                                        <div className="badge-icon">
                                            {badge.icon}
                                        </div>


                                        <div className="badge-info">

                                            <h3>
                                                {badge.name}
                                            </h3>

                                            <p>
                                                {badge.description}
                                            </p>

                                            <span>
                            {earnedBy} users earned this
                        </span>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                    {/* =====================================
                        RECENT ACTIVITIES
                    ===================================== */}

                    <div className="admin-section">


                        <div className="section-header">

                            <div>

                                <h2>
                                    Recent user activities
                                </h2>

                                <p>

                                    Automatically updates every
                                    3 seconds

                                </p>

                            </div>

                            <span className="activity-count">

                                {totalActivities} logged

                            </span>

                        </div>



                        <div className="table-container">


                            <table>


                                <thead>

                                <tr>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Activity
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Unit
                                    </th>

                                    <th>
                                        Emission
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                                </thead>



                                <tbody>


                                {activities.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="no-data"
                                        >

                                            No activities found

                                        </td>

                                    </tr>

                                ) : (

                                    activities
                                        .slice()
                                        .reverse()
                                        .map((item) => (

                                            <tr key={item.id}>

                                                <td>

                                                    👤{" "}

                                                    {item.username}

                                                </td>


                                                <td>

                                                    <span className="category-badge">
                                                        {item.category}
                                                    </span>

                                                </td>


                                                <td>

                                                    {item.activity}

                                                </td>


                                                <td>

                                                    {item.amount}

                                                </td>


                                                <td>

                                                    {item.unit}

                                                </td>


                                                <td className="emission-cell">

                                                    {Number(
                                                        item.emission || 0
                                                    ).toFixed(2)}

                                                    {" "}kg

                                                </td>


                                                <td>

                                                    {item.createdAt
                                                        ? new Date(
                                                            item.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"
                                                    }

                                                </td>


                                            </tr>

                                        ))

                                )}


                                </tbody>


                            </table>


                        </div>


                    </div>


                </section>


            </main>


        </div>

    );

}

export default AdminDashboard;
