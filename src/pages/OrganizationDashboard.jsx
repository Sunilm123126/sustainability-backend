import React, { useEffect, useMemo, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

const API_URL = "http://localhost:8081";


const OrganizationDashboard = ({ onLogout }) => {

    /* =========================================================
       ORGANIZATION DETAILS
    ========================================================= */

    const organizationId =
        localStorage.getItem("organizationId");

    const organizationName =
        localStorage.getItem("organizationName") ||
        "Organization";

    const organizationEmail =
        localStorage.getItem("organizationEmail") ||
        "";


    /* =========================================================
       PAGE STATE
    ========================================================= */

    const [activePage, setActivePage] =
        useState("overview");

    const [supportSubject, setSupportSubject] = useState("");
    const [supportDescription, setSupportDescription] = useState("");
    const [supportMessage, setSupportMessage] = useState("");
    const [supportError, setSupportError] = useState("");
    const [supportLoading, setSupportLoading] = useState(false);

    const [supportRequests, setSupportRequests] = useState([]);
    /* =========================================================
       ANALYTICS STATE
    ========================================================= */

    const [analytics, setAnalytics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================================
       INVITATION STATE
    ========================================================= */

    const [showInviteForm, setShowInviteForm] =
        useState(false);

    const [inviteEmail, setInviteEmail] =
        useState("");

    const [inviteDepartment, setInviteDepartment] =
        useState("");

    const [inviteLoading, setInviteLoading] =
        useState(false);

    const [inviteMessage, setInviteMessage] =
        useState("");

    const [inviteError, setInviteError] =
        useState("");


    /* =========================================================
       LOAD ORGANIZATION ANALYTICS
    ========================================================= */

    const loadAnalytics = async () => {

        if (!organizationId) {

            setError(
                "Organization ID not found. Please login again."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                `${API_URL}/api/organizations/${organizationId}/analytics`
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to load organization analytics."
                );
            }


            setAnalytics(data);


        } catch (err) {

            console.error(
                "Organization analytics error:",
                err
            );


            setError(
                err.message ||
                "Unable to load organization analytics."
            );


        } finally {

            setLoading(false);

        }
    };


    /* =========================================================
       LOAD ANALYTICS WHEN PAGE OPENS
    ========================================================= */

    useEffect(() => {

        loadAnalytics();

    }, []);


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = () => {

        localStorage.removeItem(
            "organizationId"
        );

        localStorage.removeItem(
            "organizationName"
        );

        localStorage.removeItem(
            "organizationEmail"
        );

        localStorage.removeItem(
            "organizationLoggedIn"
        );


        if (onLogout) {

            onLogout();

        }

    };


    /* =========================================================
       SAFE ANALYTICS VALUES
    ========================================================= */

    const employeeCount =
        analytics?.employeeCount ?? 0;

    const activityCount =
        analytics?.activityCount ?? 0;

    const totalActivities =
        analytics?.totalActivities ?? 0;

    const todayEmission =
        Number(
            analytics?.todayEmission ?? 0
        );

    const weeklyEmission =
        Number(
            analytics?.weeklyEmission ?? 0
        );

    const monthlyEmission =
        Number(
            analytics?.monthlyEmission ?? 0
        );

    const yearlyEmission =
        Number(
            analytics?.yearlyEmission ?? 0
        );

    const averageEmission =
        Number(
            analytics?.averageEmission ?? 0
        );

    const sustainabilityScore =
        Number(
            analytics?.sustainabilityScore ?? 100
        );


    const categoryData =
        Array.isArray(
            analytics?.categoryData
        )
            ? analytics.categoryData
            : [];


    const dailyTrend =
        Array.isArray(
            analytics?.dailyTrend
        )
            ? analytics.dailyTrend
            : [];


    const weeklyTrend =
        Array.isArray(
            analytics?.weeklyTrend
        )
            ? analytics.weeklyTrend
            : [];


    const employees =
        Array.isArray(
            analytics?.employees
        )
            ? analytics.employees
            : [];


    /* =========================================================
       CATEGORY DATA
    ========================================================= */

    const formattedCategoryData =
        useMemo(() => {

            return categoryData
                .map((item) => ({

                    name:
                        item.name ||
                        item.category ||
                        "Other",

                    value:
                        Number(
                            item.value ??
                            item.emission ??
                            item.total ??
                            0
                        )

                }))
                .filter(
                    item => item.value > 0
                );

        }, [categoryData]);


    /* =========================================================
       DEPARTMENT DATA
    ========================================================= */

    const departmentData =
        useMemo(() => {

            const departmentMap = {};


            employees.forEach(
                employee => {

                    const department =
                        employee.department ||
                        "Unassigned";


                    if (
                        !departmentMap[
                            department
                            ]
                    ) {

                        departmentMap[
                            department
                            ] = {

                            department,
                            employees: 0,
                            activities: 0,
                            emission: 0

                        };

                    }


                    departmentMap[
                        department
                        ].employees += 1;


                    departmentMap[
                        department
                        ].activities +=
                        Number(
                            employee.activityCount ??
                            0
                        );


                    departmentMap[
                        department
                        ].emission +=
                        Number(
                            employee.emission ??
                            0
                        );

                }
            );


            return Object.values(
                departmentMap
            );

        }, [employees]);


    /* =========================================================
       COLORS
    ========================================================= */

    const pieColors = [

        "#2e7d32",
        "#66bb6a",
        "#ffa726",
        "#42a5f5",
        "#ab47bc",
        "#ef5350"

    ];


    /* =========================================================
       FORMAT EMISSION
    ========================================================= */

    const formatEmission = (
        value
    ) => {

        const number =
            Number(value ?? 0);


        if (number < 0.01) {

            return number.toFixed(4);

        }


        if (number < 1) {

            return number.toFixed(3);

        }


        return number.toFixed(2);

    };


    /* =========================================================
       OPEN INVITATION FORM
    ========================================================= */

    const openInviteForm = () => {

        setInviteEmail("");

        setInviteDepartment("");

        setInviteMessage("");

        setInviteError("");

        setShowInviteForm(true);

    };


    /* =========================================================
       CLOSE INVITATION FORM
    ========================================================= */

    const closeInviteForm = () => {

        if (inviteLoading) {

            return;

        }


        setShowInviteForm(false);

        setInviteEmail("");

        setInviteDepartment("");

        setInviteMessage("");

        setInviteError("");

    };


    /* =========================================================
       SEND EMPLOYEE INVITATION
    ========================================================= */

    const handleSendInvitation =
        async () => {

            setInviteMessage("");

            setInviteError("");


            /* ---------------------------------------------
               CHECK EMAIL
            --------------------------------------------- */

            if (
                !inviteEmail.trim()
            ) {

                setInviteError(
                    "Please enter the employee email address."
                );

                return;

            }


            /* ---------------------------------------------
               VALIDATE EMAIL
            --------------------------------------------- */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailPattern.test(
                    inviteEmail.trim()
                )
            ) {

                setInviteError(
                    "Please enter a valid email address."
                );

                return;

            }


            /* ---------------------------------------------
               CHECK ORGANIZATION
            --------------------------------------------- */

            if (!organizationId) {

                setInviteError(
                    "Organization ID was not found. Please login again."
                );

                return;

            }


            try {

                setInviteLoading(true);


                /* -----------------------------------------
                   SEND REQUEST
                ----------------------------------------- */

                const response =
                    await fetch(
                        `${API_URL}/api/organization/invitations`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                organizationId:
                                    Number(
                                        organizationId
                                    ),

                                email:
                                    inviteEmail.trim(),

                                department:
                                    inviteDepartment.trim()

                            })

                        }
                    );


                const result =
                    await response.json();


                /* -----------------------------------------
                   HANDLE ERROR
                ----------------------------------------- */

                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to send invitation."
                    );

                }


                /* -----------------------------------------
                   SUCCESS
                ----------------------------------------- */

                setInviteMessage(
                    "Invitation sent successfully."
                );


                setInviteEmail("");

                setInviteDepartment("");


                /* -----------------------------------------
                   REFRESH ANALYTICS
                ----------------------------------------- */

                await loadAnalytics();


            } catch (err) {

                console.error(
                    "Invitation error:",
                    err
                );


                setInviteError(
                    err.message ||
                    "Unable to send invitation."
                );


            } finally {

                setInviteLoading(false);

            }

        };


    /* =========================================================
       LOADING SCREEN
    ========================================================= */

    if (loading) {

        return (

            <div
                style={
                    styles.loadingScreen
                }
            >

                <div
                    style={
                        styles.loadingIcon
                    }
                >
                    🌱
                </div>


                <h2>
                    Loading Organization Dashboard...
                </h2>


                <p>
                    Fetching your organization's
                    sustainability data.
                </p>

            </div>

        );

    }


    /* =========================================================
       OVERVIEW PAGE
    ========================================================= */

    const renderOverview = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Organization Overview
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Monitor your organization's
                            sustainability performance.
                        </p>

                    </div>


                    <div
                        style={
                            styles.headerActions
                        }
                    >

                        <div
                            style={
                                styles.periodBox
                            }
                        >
                            Current Month
                        </div>


                        <button
                            style={
                                styles.refreshButton
                            }
                            onClick={
                                loadAnalytics
                            }
                        >
                            ↻ Refresh
                        </button>

                    </div>

                </div>


                {error && (

                    <div
                        style={
                            styles.errorBox
                        }
                    >
                        ⚠️ {error}
                    </div>

                )}


                {/* STATISTICS */}

                <div
                    style={
                        styles.statsGrid
                    }
                >

                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            👥
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                Employees
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {employeeCount}
                            </h2>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            🌱
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                Activities
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {activityCount}
                            </h2>


                            <span
                                style={
                                    styles.smallText
                                }
                            >
                                This month
                            </span>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            ☁️
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                CO₂ Emissions
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    formatEmission(
                                        monthlyEmission
                                    )
                                } kg
                            </h2>


                            <span
                                style={
                                    styles.smallText
                                }
                            >
                                This month
                            </span>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            ⭐
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                Sustainability Score
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    sustainabilityScore.toFixed(
                                        0
                                    )
                                }
                            </h2>


                            <span
                                style={
                                    styles.smallText
                                }
                            >
                                Out of 100
                            </span>

                        </div>

                    </div>

                </div>


                {/* CHARTS */}

                <div
                    style={
                        styles.contentGrid
                    }
                >

                    <div
                        style={
                            styles.largeCard
                        }
                    >

                        <div
                            style={
                                styles.cardHeader
                            }
                        >

                            <div>

                                <h2
                                    style={
                                        styles.cardTitle
                                    }
                                >
                                    Emission Trend
                                </h2>


                                <p
                                    style={
                                        styles.cardSubtitle
                                    }
                                >
                                    Organization-wide daily
                                    CO₂ emissions
                                </p>

                            </div>


                            <div
                                style={
                                    styles.metricBadge
                                }
                            >
                                {
                                    formatEmission(
                                        monthlyEmission
                                    )
                                } kg
                            </div>

                        </div>


                        <div
                            style={
                                styles.chartContainer
                            }
                        >

                            {dailyTrend.length >
                            0 ? (

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <LineChart
                                        data={
                                            dailyTrend
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="date"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="emission"
                                            name="CO₂ Emission"
                                            stroke="#2e7d32"
                                            strokeWidth={3}
                                            dot={false}
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            ) : (

                                <div
                                    style={
                                        styles.emptyChart
                                    }
                                >

                                    📈

                                    <p>
                                        No emission data available yet.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>


                    <div
                        style={
                            styles.mediumCard
                        }
                    >

                        <div
                            style={
                                styles.cardHeader
                            }
                        >

                            <div>

                                <h2
                                    style={
                                        styles.cardTitle
                                    }
                                >
                                    Category Breakdown
                                </h2>


                                <p
                                    style={
                                        styles.cardSubtitle
                                    }
                                >
                                    Monthly emissions by category
                                </p>

                            </div>

                        </div>


                        {formattedCategoryData.length >
                        0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height={260}
                            >

                                <PieChart>

                                    <Pie
                                        data={
                                            formattedCategoryData
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >

                                        {
                                            formattedCategoryData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            `cell-${index}`
                                                        }
                                                        fill={
                                                            pieColors[
                                                            index %
                                                            pieColors.length
                                                                ]
                                                        }
                                                    />

                                                )
                                            )
                                        }

                                    </Pie>


                                    <Tooltip />


                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        ) : (

                            <div
                                style={
                                    styles.emptyChart
                                }
                            >

                                🥧

                                <p>
                                    No category data available yet.
                                </p>

                            </div>

                        )}

                    </div>

                </div>


                {/* PERIOD SUMMARY */}

                <div
                    style={
                        styles.contentGrid
                    }
                >

                    <div
                        style={
                            styles.largeCard
                        }
                    >

                        <h2
                            style={
                                styles.cardTitle
                            }
                        >
                            Emission Summary
                        </h2>


                        <p
                            style={
                                styles.cardSubtitle
                            }
                        >
                            Organization emissions across
                            different periods.
                        </p>


                        <div
                            style={
                                styles.summaryGrid
                            }
                        >

                            <div
                                style={
                                    styles.summaryBox
                                }
                            >

                                <span>
                                    Today
                                </span>

                                <strong>
                                    {
                                        formatEmission(
                                            todayEmission
                                        )
                                    } kg
                                </strong>

                            </div>


                            <div
                                style={
                                    styles.summaryBox
                                }
                            >

                                <span>
                                    This Week
                                </span>

                                <strong>
                                    {
                                        formatEmission(
                                            weeklyEmission
                                        )
                                    } kg
                                </strong>

                            </div>


                            <div
                                style={
                                    styles.summaryBox
                                }
                            >

                                <span>
                                    This Month
                                </span>

                                <strong>
                                    {
                                        formatEmission(
                                            monthlyEmission
                                        )
                                    } kg
                                </strong>

                            </div>


                            <div
                                style={
                                    styles.summaryBox
                                }
                            >

                                <span>
                                    This Year
                                </span>

                                <strong>
                                    {
                                        formatEmission(
                                            yearlyEmission
                                        )
                                    } kg
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div
                        style={
                            styles.mediumCard
                        }
                    >

                        <h2
                            style={
                                styles.cardTitle
                            }
                        >
                            Sustainability Insights
                        </h2>


                        <p
                            style={
                                styles.cardSubtitle
                            }
                        >
                            Current organization performance
                        </p>


                        <div
                            style={
                                styles.insightBox
                            }
                        >

                            💡


                            <div>

                                {employeeCount === 0 ? (

                                    <span>
                                        Add employees and start
                                        recording activities to
                                        generate organization
                                        sustainability insights.
                                    </span>

                                ) : monthlyEmission === 0 ? (

                                    <span>
                                        Your organization has no
                                        recorded emissions for
                                        this month yet.
                                    </span>

                                ) : (

                                    <span>
                                        Your organization has
                                        recorded{" "}

                                        <strong>
                                            {
                                                formatEmission(
                                                    monthlyEmission
                                                )
                                            } kg
                                        </strong>{" "}

                                        of CO₂ emissions this
                                        month across{" "}

                                        <strong>
                                            {employeeCount}
                                        </strong>{" "}

                                        active employees.
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* PERFORMANCE */}

                <div
                    style={
                        styles.largeCard
                    }
                >

                    <h2
                        style={
                            styles.cardTitle
                        }
                    >
                        Sustainability Performance
                    </h2>


                    <p
                        style={
                            styles.cardSubtitle
                        }
                    >
                        Current organization sustainability score
                    </p>


                    <div
                        style={
                            styles.scoreContainer
                        }
                    >

                        <div
                            style={
                                styles.scoreCircle
                            }
                        >

                            <span
                                style={
                                    styles.scoreNumber
                                }
                            >
                                {
                                    sustainabilityScore.toFixed(
                                        0
                                    )
                                }
                            </span>


                            <small>
                                / 100
                            </small>

                        </div>


                        <div
                            style={
                                styles.scoreInfo
                            }
                        >

                            <p>
                                The sustainability score is
                                calculated from your organization's
                                recorded activity and emission data.
                            </p>


                            <p>
                                Average employee emission:
                                {" "}
                                <strong>
                                    {
                                        formatEmission(
                                            averageEmission
                                        )
                                    } kg
                                </strong>
                            </p>

                        </div>

                    </div>

                </div>

            </>

        );

    };


    /* =========================================================
       EMISSIONS PAGE
    ========================================================= */

    const renderEmissions = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Emissions
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Track organization-wide carbon emissions.
                        </p>

                    </div>

                </div>


                <div
                    style={
                        styles.statsGrid
                    }
                >

                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            ☁️
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                Total Emissions
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    formatEmission(
                                        yearlyEmission
                                    )
                                } kg
                            </h2>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            📅
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                This Month
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    formatEmission(
                                        monthlyEmission
                                    )
                                } kg
                            </h2>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            📊
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                Average Employee
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    formatEmission(
                                        averageEmission
                                    )
                                } kg
                            </h2>

                        </div>

                    </div>


                    <div
                        style={
                            styles.statCard
                        }
                    >

                        <div
                            style={
                                styles.statIcon
                            }
                        >
                            📈
                        </div>


                        <div>

                            <p
                                style={
                                    styles.statLabel
                                }
                            >
                                This Week
                            </p>


                            <h2
                                style={
                                    styles.statValue
                                }
                            >
                                {
                                    formatEmission(
                                        weeklyEmission
                                    )
                                } kg
                            </h2>

                        </div>

                    </div>

                </div>


                <div
                    style={
                        styles.largeCard
                    }
                >

                    <h2
                        style={
                            styles.cardTitle
                        }
                    >
                        Weekly Emission Trend
                    </h2>


                    <p
                        style={
                            styles.cardSubtitle
                        }
                    >
                        Organization emission activity during
                        the current period.
                    </p>


                    <div
                        style={
                            styles.chartContainer
                        }
                    >

                        {weeklyTrend.length >
                        0 ? (

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={
                                        weeklyTrend
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

                                    <Legend />

                                    <Bar
                                        dataKey="emission"
                                        name="CO₂ Emission"
                                        fill="#2e7d32"
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        ) : (

                            <div
                                style={
                                    styles.emptyChart
                                }
                            >

                                📊

                                <p>
                                    No weekly emission data available.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </>

        );

    };


    /* =========================================================
       EMPLOYEES PAGE
    ========================================================= */

    const renderEmployees = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Employees
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            View employees and their
                            sustainability activity.
                        </p>

                    </div>


                    {/* THIS IS NOW A REAL BUTTON */}

                    <button
                        type="button"
                        style={
                            styles.primaryButton
                        }
                        onClick={
                            openInviteForm
                        }
                    >
                        + Add Employee
                    </button>

                </div>


                <div
                    style={
                        styles.tableCard
                    }
                >

                    {employees.length === 0 ? (

                        <div
                            style={
                                styles.emptyState
                            }
                        >

                            <div
                                style={
                                    styles.emptyIcon
                                }
                            >
                                👥
                            </div>


                            <h2>
                                No employees yet
                            </h2>


                            <p>
                                Add employees by sending them
                                an EcoTrack organization invitation.
                            </p>


                            <button
                                type="button"
                                style={
                                    styles.primaryButton
                                }
                                onClick={
                                    openInviteForm
                                }
                            >
                                Invite Employee
                            </button>

                        </div>

                    ) : (

                        <div
                            style={
                                styles.tableWrapper
                            }
                        >

                            <table
                                style={
                                    styles.table
                                }
                            >

                                <thead>

                                <tr>

                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Employee
                                    </th>


                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Department
                                    </th>


                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Activities
                                    </th>


                                    <th
                                        style={
                                            styles.th
                                        }
                                    >
                                        Emissions
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {employees.map(
                                    (
                                        employee,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                employee.id ??
                                                index
                                            }
                                        >

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <strong>
                                                    {
                                                        employee.username ||
                                                        "Unknown"
                                                    }
                                                </strong>

                                            </td>


                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    employee.department ||
                                                    "Unassigned"
                                                }
                                            </td>


                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    employee.activityCount ??
                                                    0
                                                }
                                            </td>


                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >
                                                {
                                                    formatEmission(
                                                        employee.emission
                                                    )
                                                }{" "}
                                                kg
                                            </td>

                                        </tr>

                                    )
                                )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* =================================================
                    INVITATION MODAL
                ================================================= */}

                {showInviteForm && (

                    <div
                        style={
                            styles.modalOverlay
                        }
                    >

                        <div
                            style={
                                styles.modalCard
                            }
                        >

                            {/* HEADER */}

                            <div
                                style={
                                    styles.modalHeader
                                }
                            >

                                <div>

                                    <h2
                                        style={
                                            styles.modalTitle
                                        }
                                    >
                                        Invite Employee
                                    </h2>


                                    <p
                                        style={
                                            styles.modalSubtitle
                                        }
                                    >
                                        Send an EcoTrack organization
                                        invitation.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    style={
                                        styles.modalClose
                                    }
                                    onClick={
                                        closeInviteForm
                                    }
                                    disabled={
                                        inviteLoading
                                    }
                                >
                                    ×
                                </button>

                            </div>


                            {/* SUCCESS */}

                            {inviteMessage && (

                                <div
                                    style={
                                        styles.successMessage
                                    }
                                >
                                    ✅ {inviteMessage}
                                </div>

                            )}


                            {/* ERROR */}

                            {inviteError && (

                                <div
                                    style={
                                        styles.inviteErrorMessage
                                    }
                                >
                                    ❌ {inviteError}
                                </div>

                            )}


                            {/* EMAIL */}

                            <div
                                style={
                                    styles.formGroup
                                }
                            >

                                <label
                                    style={
                                        styles.formLabel
                                    }
                                >
                                    Employee Email
                                </label>


                                <input
                                    type="email"
                                    value={
                                        inviteEmail
                                    }
                                    onChange={
                                        (event) =>
                                            setInviteEmail(
                                                event.target.value
                                            )
                                    }
                                    placeholder="employee@example.com"
                                    style={
                                        styles.formInput
                                    }
                                    disabled={
                                        inviteLoading
                                    }
                                />

                            </div>


                            {/* DEPARTMENT */}

                            <div
                                style={
                                    styles.formGroup
                                }
                            >

                                <label
                                    style={
                                        styles.formLabel
                                    }
                                >
                                    Department
                                </label>


                                <input
                                    type="text"
                                    value={
                                        inviteDepartment
                                    }
                                    onChange={
                                        (event) =>
                                            setInviteDepartment(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Engineering"
                                    style={
                                        styles.formInput
                                    }
                                    disabled={
                                        inviteLoading
                                    }
                                />

                            </div>


                            {/* ORGANIZATION */}

                            <div
                                style={
                                    styles.formGroup
                                }
                            >

                                <label
                                    style={
                                        styles.formLabel
                                    }
                                >
                                    Organization
                                </label>


                                <input
                                    type="text"
                                    value={
                                        organizationName
                                    }
                                    style={{
                                        ...styles.formInput,
                                        background:
                                            "#f3f6f4"
                                    }}
                                    disabled
                                />

                            </div>


                            {/* BUTTONS */}

                            <div
                                style={
                                    styles.modalActions
                                }
                            >

                                <button
                                    type="button"
                                    style={
                                        styles.cancelButton
                                    }
                                    onClick={
                                        closeInviteForm
                                    }
                                    disabled={
                                        inviteLoading
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    style={{
                                        ...styles.primaryButton,
                                        opacity:
                                            inviteLoading
                                                ? 0.65
                                                : 1
                                    }}
                                    onClick={
                                        handleSendInvitation
                                    }
                                    disabled={
                                        inviteLoading
                                    }
                                >

                                    {
                                        inviteLoading
                                            ? "Sending..."
                                            : "Send Invitation"
                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </>

        );

    };


    /* =========================================================
       DEPARTMENTS PAGE
    ========================================================= */

    const renderDepartments = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Departments
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Compare sustainability performance
                            across departments.
                        </p>

                    </div>

                </div>


                <div
                    style={
                        styles.largeCard
                    }
                >

                    {departmentData.length ===
                    0 ? (

                        <div
                            style={
                                styles.emptyState
                            }
                        >

                            <div
                                style={
                                    styles.emptyIcon
                                }
                            >
                                🏢
                            </div>


                            <h2>
                                No department data
                            </h2>


                            <p>
                                Department information will appear
                                after employees are assigned to departments.
                            </p>

                        </div>

                    ) : (

                        <>

                            <h2
                                style={
                                    styles.cardTitle
                                }
                            >
                                Department Performance
                            </h2>


                            <p
                                style={
                                    styles.cardSubtitle
                                }
                            >
                                Employee activity and emissions
                                by department.
                            </p>


                            <div
                                style={
                                    styles.chartContainer
                                }
                            >

                                <ResponsiveContainer
                                    width="100%"
                                    height={320}
                                >

                                    <BarChart
                                        data={
                                            departmentData
                                        }
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="department"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Bar
                                            dataKey="emission"
                                            name="CO₂ Emission"
                                            fill="#2e7d32"
                                        />

                                    </BarChart>

                                </ResponsiveContainer>

                            </div>


                            <div
                                style={
                                    styles.tableWrapper
                                }
                            >

                                <table
                                    style={
                                        styles.table
                                    }
                                >

                                    <thead>

                                    <tr>

                                        <th
                                            style={
                                                styles.th
                                            }
                                        >
                                            Department
                                        </th>


                                        <th
                                            style={
                                                styles.th
                                            }
                                        >
                                            Employees
                                        </th>


                                        <th
                                            style={
                                                styles.th
                                            }
                                        >
                                            Activities
                                        </th>


                                        <th
                                            style={
                                                styles.th
                                            }
                                        >
                                            Emissions
                                        </th>

                                    </tr>

                                    </thead>


                                    <tbody>

                                    {departmentData.map(
                                        (
                                            department,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    index
                                                }
                                            >

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        department.department
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        department.employees
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        department.activities
                                                    }
                                                </td>


                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        formatEmission(
                                                            department.emission
                                                        )
                                                    }{" "}
                                                    kg
                                                </td>

                                            </tr>

                                        )
                                    )}

                                    </tbody>

                                </table>

                            </div>

                        </>

                    )}

                </div>

            </>

        );

    };


    /* =========================================================
       REPORTS
    ========================================================= */

    const renderReports = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Reports
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Review your organization's
                            sustainability data.
                        </p>

                    </div>

                </div>


                <div
                    style={
                        styles.reportGrid
                    }
                >

                    <div
                        style={
                            styles.reportCard
                        }
                    >

                        <div
                            style={
                                styles.reportIcon
                            }
                        >
                            📊
                        </div>


                        <h3>
                            Emission Report
                        </h3>


                        <p>
                            Organization-wide carbon
                            emission summary.
                        </p>


                        <button
                            type="button"
                            style={
                                styles.secondaryButton
                            }
                            onClick={() =>
                                alert(
                                    `Total annual emissions: ${formatEmission(
                                        yearlyEmission
                                    )} kg`
                                )
                            }
                        >
                            View Report
                        </button>

                    </div>


                    <div
                        style={
                            styles.reportCard
                        }
                    >

                        <div
                            style={
                                styles.reportIcon
                            }
                        >
                            🌱
                        </div>


                        <h3>
                            Sustainability Report
                        </h3>


                        <p>
                            Review your organization's
                            sustainability score.
                        </p>


                        <button
                            type="button"
                            style={
                                styles.secondaryButton
                            }
                            onClick={() =>
                                alert(
                                    `Sustainability Score: ${sustainabilityScore.toFixed(
                                        0
                                    )}/100`
                                )
                            }
                        >
                            View Report
                        </button>

                    </div>


                    <div
                        style={
                            styles.reportCard
                        }
                    >

                        <div
                            style={
                                styles.reportIcon
                            }
                        >
                            👥
                        </div>


                        <h3>
                            Employee Report
                        </h3>


                        <p>
                            Analyze employee sustainability
                            activities.
                        </p>


                        <button
                            type="button"
                            style={
                                styles.secondaryButton
                            }
                            onClick={() =>
                                setActivePage(
                                    "employees"
                                )
                            }
                        >
                            View Employees
                        </button>

                    </div>

                </div>

            </>

        );

    };


    /* =========================================================
       SETTINGS
    ========================================================= */

    const renderSettings = () => {

        return (

            <>

                <div
                    style={
                        styles.pageHeader
                    }
                >

                    <div>

                        <h1
                            style={
                                styles.pageTitle
                            }
                        >
                            Organization Settings
                        </h1>


                        <p
                            style={
                                styles.pageSubtitle
                            }
                        >
                            View your organization profile.
                        </p>

                    </div>

                </div>


                <div
                    style={
                        styles.largeCard
                    }
                >

                    <div
                        style={
                            styles.settingRow
                        }
                    >

                        <span>
                            Organization Name
                        </span>


                        <strong>
                            {organizationName}
                        </strong>

                    </div>


                    <div
                        style={
                            styles.settingRow
                        }
                    >

                        <span>
                            Organization Email
                        </span>


                        <strong>
                            {organizationEmail}
                        </strong>

                    </div>


                    <div
                        style={
                            styles.settingRow
                        }
                    >

                        <span>
                            Organization ID
                        </span>


                        <strong>
                            {organizationId ||
                                "Not available"}
                        </strong>

                    </div>


                    <div
                        style={
                            styles.settingRow
                        }
                    >

                        <span>
                            Total Employees
                        </span>


                        <strong>
                            {employeeCount}
                        </strong>

                    </div>


                    <div
                        style={
                            styles.settingRow
                        }
                    >

                        <span>
                            Total Activities
                        </span>


                        <strong>
                            {totalActivities}
                        </strong>

                    </div>

                </div>

            </>

        );

    };


    /* =========================================================
       PAGE SWITCH
    ========================================================= */
    /* =====================================================
       SUPPORT
    ===================================================== */

    const renderSupport = () => {

        const handleSubmitSupport = async (event) => {

            event.preventDefault();

            setSupportMessage("");
            setSupportError("");


            /* -----------------------------------------------
               VALIDATION
            ------------------------------------------------ */

            if (!supportSubject.trim()) {

                setSupportError(
                    "Please enter a subject."
                );

                return;
            }


            if (!supportDescription.trim()) {

                setSupportError(
                    "Please describe the issue."
                );

                return;
            }


            try {

                setSupportLoading(true);


                /*
                 * FRONTEND VERSION
                 *
                 * For now the request is stored locally.
                 * We can connect this to Spring Boot later.
                 */

                const newRequest = {

                    id:
                        Date.now(),

                    subject:
                        supportSubject.trim(),

                    description:
                        supportDescription.trim(),

                    status:
                        "OPEN",

                    createdAt:
                        new Date().toLocaleString()

                };


                setSupportRequests(
                    (previous) => [
                        newRequest,
                        ...previous
                    ]
                );


                setSupportSubject("");
                setSupportDescription("");


                setSupportMessage(
                    "Your support request has been submitted successfully."
                );


            } catch (error) {

                console.error(
                    "Support request error:",
                    error
                );

                setSupportError(
                    "Unable to submit support request."
                );

            } finally {

                setSupportLoading(false);

            }

        };


        return (
            <>

                {/* =================================================
                PAGE HEADER
            ================================================= */}

                <div style={styles.pageHeader}>

                    <div>

                        <h1 style={styles.pageTitle}>
                            Support
                        </h1>

                        <p style={styles.pageSubtitle}>
                            Tell the EcoTrack support team what you need and
                            follow every request to resolution.
                        </p>

                    </div>


                    <div style={styles.supportRequestCount}>

                        {supportRequests.length}{" "}
                        {supportRequests.length === 1
                            ? "request"
                            : "requests"}

                    </div>

                </div>


                {/* =================================================
                CONTACT SUPPORT
            ================================================= */}

                <div style={styles.largeCard}>

                    <h2 style={styles.cardTitle}>
                        Contact support
                    </h2>

                    <p style={styles.cardSubtitle}>
                        We will review your request and help you resolve
                        the issue.
                    </p>


                    {/* SUCCESS */}

                    {supportMessage && (

                        <div style={styles.successMessage}>

                            {supportMessage}

                        </div>

                    )}


                    {/* ERROR */}

                    {supportError && (

                        <div style={styles.errorMessage}>

                            {supportError}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmitSupport}
                        style={styles.supportForm}
                    >


                        {/* SUBJECT */}

                        <div style={styles.formGroup}>

                            <label style={styles.formLabel}>
                                Subject
                            </label>

                            <input
                                type="text"
                                value={supportSubject}
                                onChange={(event) =>
                                    setSupportSubject(
                                        event.target.value
                                    )
                                }
                                placeholder="What can we help with?"
                                style={styles.formInput}
                                disabled={supportLoading}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div style={styles.formGroup}>

                            <label style={styles.formLabel}>
                                Describe the issue
                            </label>

                            <textarea
                                value={supportDescription}
                                onChange={(event) =>
                                    setSupportDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Include the steps, screen, or activity involved..."
                                style={styles.supportTextarea}
                                disabled={supportLoading}
                                rows={6}
                            />

                        </div>


                        {/* SUBMIT */}

                        <div style={styles.supportActions}>

                            <button
                                type="submit"
                                style={{
                                    ...styles.primaryButton,
                                    opacity:
                                        supportLoading
                                            ? 0.7
                                            : 1
                                }}
                                disabled={supportLoading}
                            >

                                {supportLoading
                                    ? "Submitting..."
                                    : "Submit Request"}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =================================================
                REQUESTS
            ================================================= */}

                <div
                    style={{
                        ...styles.largeCard,
                        marginTop: "20px"
                    }}
                >

                    <div style={styles.cardHeader}>

                        <div>

                            <h2 style={styles.cardTitle}>
                                Your Support Requests
                            </h2>

                            <p style={styles.cardSubtitle}>
                                Track your submitted support requests.
                            </p>

                        </div>

                    </div>


                    {supportRequests.length === 0 ? (

                        <div style={styles.supportEmptyState}>

                            <div style={styles.emptyIcon}>
                                💬
                            </div>

                            <h3>
                                No support requests
                            </h3>

                            <p>
                                You haven't submitted any support requests yet.
                            </p>

                        </div>

                    ) : (

                        <div style={styles.supportRequestList}>

                            {supportRequests.map((request) => (

                                <div
                                    key={request.id}
                                    style={styles.supportRequestCard}
                                >

                                    <div
                                        style={
                                            styles.supportRequestHeader
                                        }
                                    >

                                        <div>

                                            <h3
                                                style={
                                                    styles.supportRequestTitle
                                                }
                                            >
                                                {request.subject}
                                            </h3>

                                            <span
                                                style={
                                                    styles.supportRequestDate
                                                }
                                            >
                                            {request.createdAt}
                                        </span>

                                        </div>


                                        <span
                                            style={
                                                styles.openStatus
                                            }
                                        >
                                        {request.status}
                                    </span>

                                    </div>


                                    <p
                                        style={
                                            styles.supportRequestDescription
                                        }
                                    >
                                        {request.description}
                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </>
        );
    };
    const renderPage = () => {

        switch (activePage) {

            case "emissions":
                return renderEmissions();

            case "departments":
                return renderDepartments();

            case "employees":
                return renderEmployees();

            case "reports":
                return renderReports();

            case "support":
                return renderSupport();

            case "settings":
                return renderSettings();

            case "overview":
            default:
                return renderOverview();
        }
    };

    /* =========================================================
       MAIN UI
    ========================================================= */

    return (

        <div
            style={
                styles.app
            }
        >


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                style={
                    styles.sidebar
                }
            >


                {/* BRAND */}

                <div
                    style={
                        styles.brand
                    }
                >

                    <div
                        style={
                            styles.brandIcon
                        }
                    >
                        🌱
                    </div>


                    <div>

                        <h2
                            style={
                                styles.brandTitle
                            }
                        >
                            EcoTrack
                        </h2>


                        <span
                            style={
                                styles.brandSubtitle
                            }
                        >
                            Organization
                        </span>

                    </div>

                </div>


                {/* ORGANIZATION */}

                <div
                    style={
                        styles.organizationInfo
                    }
                >

                    <div
                        style={
                            styles.orgAvatar
                        }
                    >
                        {
                            organizationName
                                .charAt(0)
                                .toUpperCase()
                        }
                    </div>


                    <div
                        style={
                            styles.orgText
                        }
                    >

                        <strong>
                            {organizationName}
                        </strong>


                        <span>
                            Organization
                        </span>

                    </div>

                </div>


                {/* NAVIGATION */}

                <nav
                    style={
                        styles.navigation
                    }
                >

                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "overview"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "overview"
                            )
                        }
                    >
                        <span>
                            📊
                        </span>

                        Overview

                    </button>


                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "emissions"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "emissions"
                            )
                        }
                    >
                        <span>
                            ☁️
                        </span>

                        Emissions

                    </button>


                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "departments"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "departments"
                            )
                        }
                    >
                        <span>
                            🏢
                        </span>

                        Departments

                    </button>


                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "employees"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "employees"
                            )
                        }
                    >
                        <span>
                            👥
                        </span>

                        Employees

                    </button>


                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "reports"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "reports"
                            )
                        }
                    >
                        <span>
                            📄
                        </span>

                        Reports

                    </button>


                    <button
                        type="button"
                        style={{
                            ...styles.navButton,

                            ...(activePage ===
                            "settings"
                                ? styles.activeNavButton
                                : {})
                        }}
                        onClick={() =>
                            setActivePage(
                                "settings"
                            )
                        }
                    >
                        <span>
                            ⚙️
                        </span>

                        Settings

                    </button>

                </nav>
                {/* SUPPORT */}

                <button
                    type="button"
                    style={{
                        ...styles.navButton,

                        ...(activePage === "support"
                            ? styles.activeNavButton
                            : {})
                    }}
                    onClick={() =>
                        setActivePage("support")
                    }
                >

    <span>
        💬
    </span>

                    Support

                </button>

                {/* LOGOUT */}

                <div
                    style={
                        styles.sidebarBottom
                    }
                >

                    <button
                        type="button"
                        style={
                            styles.logoutButton
                        }
                        onClick={
                            handleLogout
                        }
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main
                style={
                    styles.main
                }
            >

                {/* TOP BAR */}

                <header
                    style={
                        styles.topbar
                    }
                >

                    <div>

                        <span
                            style={
                                styles.topbarLabel
                            }
                        >
                            ORGANIZATION DASHBOARD
                        </span>


                        <h2
                            style={
                                styles.topbarTitle
                            }
                        >
                            {organizationName}
                        </h2>

                    </div>


                    <div
                        style={
                            styles.profile
                        }
                    >

                        <div
                            style={
                                styles.profileAvatar
                            }
                        >
                            {
                                organizationName
                                    .charAt(0)
                                    .toUpperCase()
                            }
                        </div>


                        <div>

                            <strong>
                                {organizationName}
                            </strong>


                            <span
                                style={
                                    styles.profileEmail
                                }
                            >
                                {organizationEmail}
                            </span>

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <section
                    style={
                        styles.content
                    }
                >

                    {renderPage()}

                </section>

            </main>

        </div>

    );

};


/* =============================================================
   STYLES
============================================================= */

const styles = {

    app: {
        minHeight: "100vh",
        display: "flex",
        background: "#f5f8f6",
        color: "#26332a",
        fontFamily:
            "Arial, Helvetica, sans-serif"
    },


    loadingScreen: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f8f6",
        color: "#26332a"
    },


    loadingIcon: {
        fontSize: "55px",
        marginBottom: "15px"
    },


    sidebar: {
        width: "250px",
        minHeight: "100vh",
        background: "#123524",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0
    },


    brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "25px 22px"
    },


    brandIcon: {
        fontSize: "32px"
    },


    brandTitle: {
        margin: 0,
        fontSize: "22px"
    },


    brandSubtitle: {
        fontSize: "11px",
        color: "#b9d5c0"
    },


    organizationInfo: {
        margin: "5px 15px 20px",
        padding: "15px",
        background:
            "rgba(255,255,255,0.08)",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    orgAvatar: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        background: "#4caf50",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },


    orgText: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: 0
    },


    navigation: {
        display: "flex",
        flexDirection: "column",
        padding: "0 12px",
        gap: "5px"
    },


    navButton: {
        border: "none",
        background: "transparent",
        color: "#d9e8dd",
        padding: "13px 15px",
        borderRadius: "9px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },


    activeNavButton: {
        background: "#2e7d32",
        color: "#ffffff"
    },


    sidebarBottom: {
        marginTop: "auto",
        padding: "15px"
    },


    logoutButton: {
        width: "100%",
        border:
            "1px solid rgba(255,255,255,0.2)",
        background: "transparent",
        color: "#ffffff",
        padding: "12px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "center"
    },


    main: {
        marginLeft: "250px",
        width: "calc(100% - 250px)",
        minHeight: "100vh"
    },


    topbar: {
        height: "82px",
        background: "#ffffff",
        borderBottom:
            "1px solid #e6ebe7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 35px"
    },


    topbarLabel: {
        fontSize: "10px",
        color: "#6b806f",
        letterSpacing: "1px"
    },


    topbarTitle: {
        margin: "3px 0 0",
        fontSize: "20px"
    },


    profile: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    profileAvatar: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#e8f5e9",
        color: "#2e7d32",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold"
    },


    profileEmail: {
        display: "block",
        fontSize: "11px",
        color: "#777",
        marginTop: "3px"
    },


    content: {
        padding: "32px"
    },


    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },


    pageTitle: {
        margin: 0,
        fontSize: "28px",
        color: "#173c27"
    },


    pageSubtitle: {
        margin: "7px 0 0",
        color: "#718077",
        fontSize: "14px"
    },


    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },


    periodBox: {
        padding: "10px 15px",
        background: "#ffffff",
        border:
            "1px solid #dce6df",
        borderRadius: "8px",
        color: "#52665a",
        fontSize: "13px"
    },


    refreshButton: {
        border:
            "1px solid #2e7d32",
        background: "#ffffff",
        color: "#2e7d32",
        padding: "10px 15px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },


    errorBox: {
        background: "#fff3f3",
        border:
            "1px solid #f1b5b5",
        color: "#a33a3a",
        padding: "14px",
        borderRadius: "10px",
        marginBottom: "20px"
    },


    statsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "18px",
        marginBottom: "22px"
    },


    statCard: {
        background: "#ffffff",
        border:
            "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "22px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow:
            "0 4px 14px rgba(30,60,40,0.04)"
    },


    statIcon: {
        width: "45px",
        height: "45px",
        borderRadius: "11px",
        background: "#eaf6ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px"
    },


    statLabel: {
        margin: 0,
        color: "#718077",
        fontSize: "12px"
    },


    statValue: {
        margin: "5px 0 0",
        color: "#183d27",
        fontSize: "24px"
    },


    smallText: {
        color: "#89968d",
        fontSize: "10px"
    },


    contentGrid: {
        display: "grid",
        gridTemplateColumns:
            "1.6fr 1fr",
        gap: "20px",
        marginBottom: "20px"
    },


    largeCard: {
        background: "#ffffff",
        border:
            "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "24px",
        boxShadow:
            "0 4px 14px rgba(30,60,40,0.04)",
        marginBottom: "20px"
    },


    mediumCard: {
        background: "#ffffff",
        border:
            "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "24px",
        boxShadow:
            "0 4px 14px rgba(30,60,40,0.04)",
        marginBottom: "20px"
    },


    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },


    cardTitle: {
        margin: 0,
        fontSize: "18px",
        color: "#1b3e29"
    },


    cardSubtitle: {
        margin: "6px 0 0",
        color: "#7a877e",
        fontSize: "13px"
    },


    metricBadge: {
        padding: "7px 11px",
        background: "#eaf6ec",
        color: "#2e7d32",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },


    chartContainer: {
        width: "100%",
        marginTop: "20px"
    },


    emptyChart: {
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#89968d",
        textAlign: "center",
        fontSize: "30px"
    },


    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",
        gap: "15px",
        marginTop: "25px"
    },


    summaryBox: {
        background: "#f5f9f6",
        borderRadius: "10px",
        padding: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },


    scoreContainer: {
        display: "flex",
        alignItems: "center",
        gap: "30px",
        marginTop: "25px"
    },


    scoreCircle: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "#e8f5e9",
        border:
            "8px solid #66bb6a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        color: "#2e7d32"
    },


    scoreNumber: {
        fontSize: "30px",
        fontWeight: "bold"
    },


    scoreInfo: {
        maxWidth: "500px",
        color: "#657269",
        lineHeight: "1.6"
    },


    insightBox: {
        marginTop: "25px",
        background: "#f4faf5",
        borderRadius: "10px",
        padding: "18px",
        display: "flex",
        gap: "12px",
        lineHeight: "1.5",
        color: "#58665c",
        fontSize: "13px"
    },


    tableCard: {
        background: "#ffffff",
        border:
            "1px solid #e6ebe7",
        borderRadius: "14px",
        minHeight: "400px",
        padding: "30px"
    },


    tableWrapper: {
        width: "100%",
        overflowX: "auto"
    },


    table: {
        width: "100%",
        borderCollapse: "collapse"
    },


    th: {
        textAlign: "left",
        padding: "15px",
        borderBottom:
            "2px solid #e6ebe7",
        color: "#52665a",
        fontSize: "13px",
        background: "#f8faf8"
    },


    td: {
        padding: "15px",
        borderBottom:
            "1px solid #edf1ee",
        color: "#52605a",
        fontSize: "13px"
    },


    emptyState: {
        minHeight: "340px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#718077"
    },


    emptyIcon: {
        fontSize: "50px",
        marginBottom: "10px"
    },


    primaryButton: {
        border: "none",
        borderRadius: "8px",
        padding: "11px 18px",
        background: "#2e7d32",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600"
    },


    secondaryButton: {
        border:
            "1px solid #2e7d32",
        borderRadius: "8px",
        padding: "9px 14px",
        background: "#ffffff",
        color: "#2e7d32",
        cursor: "pointer",
        fontWeight: "600"
    },


    mutedText: {
        color: "#89968d"
    },


    /* =========================================================
       INVITATION MODAL
    ========================================================= */

    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
            "rgba(0,0,0,0.50)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    },


    modalCard: {
        width: "480px",
        maxWidth: "90%",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "28px",
        boxShadow:
            "0 20px 60px rgba(0,0,0,0.25)"
    },


    modalHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "22px"
    },


    modalTitle: {
        margin: 0,
        fontSize: "22px",
        color: "#26332a"
    },


    modalSubtitle: {
        margin: "6px 0 0",
        color: "#718078",
        fontSize: "14px"
    },


    modalClose: {
        border: "none",
        background: "transparent",
        fontSize: "28px",
        color: "#718078",
        cursor: "pointer",
        lineHeight: 1
    },


    formGroup: {
        marginBottom: "18px"
    },


    formLabel: {
        display: "block",
        marginBottom: "7px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#26332a"
    },


    formInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 14px",
        border:
            "1px solid #d7e0da",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#26332a",
        background: "#ffffff",
        outline: "none"
    },


    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "25px"
    },


    cancelButton: {
        border:
            "1px solid #d7e0da",
        background: "#ffffff",
        color: "#45554b",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px"
    },


    successMessage: {
        background: "#e8f7ed",
        color: "#23743d",
        border:
            "1px solid #b9e2c5",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "14px"
    },


    inviteErrorMessage: {
        background: "#fff0f0",
        color: "#b42318",
        border:
            "1px solid #f1b8b8",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "14px"
    },


    reportGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
        gap: "20px"
    },


    reportCard: {
        background: "#ffffff",
        border:
            "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "25px",
        boxShadow:
            "0 4px 14px rgba(30,60,40,0.04)"
    },


    reportIcon: {
        fontSize: "32px",
        marginBottom: "10px"
    },


    settingRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "18px 0",
        borderBottom:
            "1px solid #edf1ee",
        color: "#657269"
    },
    /* =====================================================
   SUPPORT PAGE
===================================================== */

    supportCard: {
        background: "#ffffff",
        border: "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "26px",
        boxShadow: "0 4px 14px rgba(30,60,40,0.04)"
    },

    supportIntro: {
        marginBottom: "25px"
    },

    supportFormGroup: {
        marginBottom: "20px"
    },

    supportLabel: {
        display: "block",
        marginBottom: "8px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#26332a"
    },

    supportInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px 14px",
        border: "1px solid #d7e0da",
        borderRadius: "9px",
        fontSize: "14px",
        color: "#26332a",
        background: "#ffffff",
        outline: "none"
    },

    supportTextarea: {
        width: "100%",
        boxSizing: "border-box",
        minHeight: "150px",
        padding: "13px 14px",
        border: "1px solid #d7e0da",
        borderRadius: "9px",
        fontSize: "14px",
        color: "#26332a",
        background: "#ffffff",
        outline: "none",
        resize: "vertical",
        fontFamily: "Arial, Helvetica, sans-serif"
    },

    supportActions: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "25px"
    },

    supportSuccess: {
        background: "#e8f7ed",
        color: "#23743d",
        border: "1px solid #b9e2c5",
        padding: "12px 14px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    supportError: {
        background: "#fff0f0",
        color: "#b42318",
        border: "1px solid #f1b8b8",
        padding: "12px 14px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px"
    },

    supportRequestsCard: {
        background: "#ffffff",
        border: "1px solid #e6ebe7",
        borderRadius: "14px",
        padding: "24px",
        marginTop: "20px",
        boxShadow: "0 4px 14px rgba(30,60,40,0.04)"
    },

    supportEmpty: {
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#718077"
    },

    supportEmptyIcon: {
        fontSize: "42px",
        marginBottom: "10px"
    }

};


export default OrganizationDashboard;