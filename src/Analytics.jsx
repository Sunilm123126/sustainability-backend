import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "./Analytics.css";

const API_BASE = "http://localhost:8081";

function Analytics({ username }) {

    // =========================================================
    // CURRENT DATE
    // =========================================================

    const today = new Date();

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatMonth = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");

        return `${year}-${month}`;
    };

    // =========================================================
    // STATE
    // =========================================================

    const [analytics, setAnalytics] = useState(null);

    const [selectedDate, setSelectedDate] = useState(
        formatDate(today)
    );

    const [selectedMonth, setSelectedMonth] = useState(
        formatMonth(today)
    );

    const [selectedYear, setSelectedYear] = useState(
        today.getFullYear()
    );

    const [loading, setLoading] = useState(true);

    const [filterLoading, setFilterLoading] =
        useState(false);

    const [error, setError] = useState("");

    // =========================================================
    // LOAD INITIAL ANALYTICS
    // =========================================================

    useEffect(() => {

        if (!username) {
            setError("Username not found.");
            setLoading(false);
            return;
        }

        loadAnalytics();

    }, [username]);

    // =========================================================
    // LOAD DEFAULT ANALYTICS
    // =========================================================

    const loadAnalytics = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/api/analytics/dashboard/${encodeURIComponent(username)}`
            );

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "INITIAL ANALYTICS:",
                data
            );

            setAnalytics(data);

        } catch (error) {

            console.error(
                "Analytics error:",
                error
            );

            setError(
                "Unable to load analytics. Please check that the Spring Boot server is running."
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================================================
    // APPLY FILTER
    // =========================================================

    const applyFilters = async () => {

        if (!username) {
            setError("Username not found.");
            return;
        }

        try {

            setFilterLoading(true);
            setError("");

            const url =
                `${API_BASE}/api/analytics/dashboard/${encodeURIComponent(username)}/selected` +
                `?date=${selectedDate}` +
                `&month=${selectedMonth}` +
                `&year=${selectedYear}`;

            console.log(
                "FILTER REQUEST:",
                url
            );

            const response = await fetch(url);

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            console.log(
                "FILTERED ANALYTICS:",
                data
            );

            /*
             * IMPORTANT:
             *
             * We replace only the DATA.
             *
             * The graph design does not change.
             */

            setAnalytics(data);

        } catch (error) {

            console.error(
                "Filter error:",
                error
            );

            setError(
                "Unable to load filtered analytics."
            );

        } finally {

            setFilterLoading(false);

        }
    };

    // =========================================================
    // SAFE NUMBER
    // =========================================================

    const getNumber = (value) => {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return 0;
        }

        return number;
    };

    // =========================================================
    // GET EMISSION FROM OBJECT
    // =========================================================

    const getEmission = (item) => {

        if (!item) {
            return 0;
        }

        return getNumber(
            item.emission ??
            item.totalEmission ??
            item.value ??
            item.total ??
            0
        );
    };

    // =========================================================
    // WEEKLY DATA
    // =========================================================

    const getWeeklyChartData = () => {

        /*
         * ALWAYS CREATE EXACTLY 7 DAYS.
         *
         * This prevents the weekly graph from accidentally
         * becoming a 1-30 monthly graph.
         */

        const days = [
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
            "SUN"
        ];

        const result = days.map((day) => ({
            day: day,
            emission: 0
        }));

        const data = analytics?.weeklyData;

        if (!Array.isArray(data)) {
            return result;
        }

        data.forEach((item) => {

            if (!item) {
                return;
            }

            let dayIndex = -1;

            // -------------------------------------------------
            // OPTION 1: Backend returns dayOfWeek
            // -------------------------------------------------

            if (item.dayOfWeek) {

                const dayName =
                    String(item.dayOfWeek)
                        .toUpperCase()
                        .substring(0, 3);

                dayIndex =
                    days.indexOf(dayName);
            }

            // -------------------------------------------------
            // OPTION 2: Backend returns day
            // -------------------------------------------------

            if (
                dayIndex === -1 &&
                typeof item.day === "string"
            ) {

                const dayName =
                    item.day
                        .toUpperCase()
                        .substring(0, 3);

                dayIndex =
                    days.indexOf(dayName);
            }

            // -------------------------------------------------
            // OPTION 3: Backend returns date
            // -------------------------------------------------

            if (
                dayIndex === -1 &&
                item.date
            ) {

                const dateString =
                    String(item.date).substring(0, 10);

                const date =
                    new Date(
                        `${dateString}T00:00:00`
                    );

                if (!Number.isNaN(date.getTime())) {

                    /*
                     * JavaScript:
                     *
                     * Sunday = 0
                     * Monday = 1
                     * Tuesday = 2
                     * ...
                     */

                    const jsDay =
                        date.getDay();

                    /*
                     * Convert to:
                     *
                     * Monday = 0
                     * Tuesday = 1
                     * ...
                     * Sunday = 6
                     */

                    dayIndex =
                        jsDay === 0
                            ? 6
                            : jsDay - 1;
                }
            }

            // -------------------------------------------------
            // ADD EMISSION
            // -------------------------------------------------

            if (
                dayIndex >= 0 &&
                dayIndex < 7
            ) {

                result[dayIndex].emission +=
                    getEmission(item);

            }

        });

        return result;
    };

    // =========================================================
    // MONTHLY DATA
    // =========================================================

    const getMonthlyChartData = () => {

        const data = analytics?.monthlyData;

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item, index) => {

            let day = null;

            // -------------------------------------------------
            // Backend returns day
            // -------------------------------------------------

            if (
                item?.day !== undefined &&
                item?.day !== null
            ) {

                day =
                    Number(item.day);

            }

            // -------------------------------------------------
            // Backend returns date
            // -------------------------------------------------

            if (
                (!day || day <= 0) &&
                item?.date
            ) {

                const dateString =
                    String(item.date).substring(0, 10);

                const date =
                    new Date(
                        `${dateString}T00:00:00`
                    );

                if (!Number.isNaN(date.getTime())) {

                    day =
                        date.getDate();

                }

            }

            // -------------------------------------------------
            // Last fallback
            // -------------------------------------------------

            if (!day || day <= 0) {
                day = index + 1;
            }

            return {
                day: day,
                emission: getEmission(item)
            };

        });
    };

    // =========================================================
    // YEARLY DATA
    // =========================================================

    const getYearlyChartData = () => {

        const months = [
            "JAN",
            "FEB",
            "MAR",
            "APR",
            "MAY",
            "JUN",
            "JUL",
            "AUG",
            "SEP",
            "OCT",
            "NOV",
            "DEC"
        ];

        const result =
            months.map((month) => ({
                month: month,
                emission: 0
            }));

        const data = analytics?.yearlyData;

        if (!Array.isArray(data)) {
            return result;
        }

        data.forEach((item, index) => {

            if (!item) {
                return;
            }

            let monthIndex = -1;

            // -------------------------------------------------
            // Backend returns month number
            // -------------------------------------------------

            if (
                item.month !== undefined &&
                item.month !== null
            ) {

                const monthNumber =
                    Number(item.month);

                if (
                    monthNumber >= 1 &&
                    monthNumber <= 12
                ) {

                    monthIndex =
                        monthNumber - 1;
                }
            }

            // -------------------------------------------------
            // Backend returns monthName
            // -------------------------------------------------

            if (
                monthIndex === -1 &&
                item.monthName
            ) {

                const name =
                    String(item.monthName)
                        .toUpperCase()
                        .substring(0, 3);

                monthIndex =
                    months.indexOf(name);
            }

            // -------------------------------------------------
            // Backend returns date
            // -------------------------------------------------

            if (
                monthIndex === -1 &&
                item.date
            ) {

                const date =
                    new Date(
                        `${String(item.date).substring(0, 10)}T00:00:00`
                    );

                if (!Number.isNaN(date.getTime())) {

                    monthIndex =
                        date.getMonth();

                }

            }

            // -------------------------------------------------
            // Last fallback: array order
            // -------------------------------------------------

            if (
                monthIndex === -1 &&
                index < 12
            ) {

                monthIndex = index;

            }

            if (
                monthIndex >= 0 &&
                monthIndex < 12
            ) {

                result[monthIndex].emission +=
                    getEmission(item);

            }

        });

        return result;
    };

    // =========================================================
    // SELECTED DATE ACTIVITIES
    // =========================================================

    const getSelectedDateActivities = () => {

        const data =
            analytics?.selectedDateActivities;

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map((item, index) => ({

            activity:
                item?.activity ||
                `Activity ${index + 1}`,

            emission:
                getEmission(item)

        }));

    };

    // =========================================================
    // CHART DATA
    // =========================================================

    const weeklyChartData =
        getWeeklyChartData();

    const monthlyChartData =
        getMonthlyChartData();

    const yearlyChartData =
        getYearlyChartData();

    const selectedDateActivities =
        getSelectedDateActivities();

    // =========================================================
    // LOADING SCREEN
    // =========================================================

    if (loading) {

        return (

            <div className="analytics-page">

                <div className="analytics-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading analytics...
                    </p>

                </div>

            </div>

        );
    }

    // =========================================================
    // MAIN PAGE
    // =========================================================

    return (

        <div className="analytics-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="analytics-header">

                <div>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Track and understand your carbon footprint
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="analytics-error">

                    {error}

                </div>

            )}


            {/* =================================================
                FILTER
            ================================================= */}

            <div className="analytics-filters">

                <div className="filter-heading">

                    <div className="filter-heading-icon">
                        🔍
                    </div>

                    <div>

                        <h3>
                            Analytics Filters
                        </h3>

                        <p>
                            Select date, month and year
                        </p>

                    </div>

                </div>


                <div className="filter-controls">

                    {/* DATE */}

                    <div className="filter-group">

                        <label>
                            Date
                        </label>

                        <div className="filter-input-wrapper">

                            <span>
                                📅
                            </span>

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
                            Month
                        </label>

                        <div className="filter-input-wrapper">

                            <span>
                                📆
                            </span>

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
                            Year
                        </label>

                        <div className="filter-input-wrapper">

                            <span>
                                🗓️
                            </span>

                            <input
                                type="number"
                                min="2000"
                                max="2100"
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* APPLY BUTTON */}

                    <button
                        className="apply-filter-btn"
                        onClick={applyFilters}
                        disabled={filterLoading}
                    >

                        {filterLoading
                            ? "Loading..."
                            : "Apply Filter"
                        }

                    </button>

                </div>

            </div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="analytics-summary">

                {/* TODAY */}

                <div className="analytics-summary-card">

                    <div className="summary-icon">
                        🌱
                    </div>

                    <div>

                        <span>
                            Today
                        </span>

                        <strong>
                            {getNumber(
                                analytics?.todayEmission
                            ).toFixed(2)}
                        </strong>

                        <small>
                            kg CO₂e
                        </small>

                    </div>

                </div>


                {/* WEEK */}

                <div className="analytics-summary-card">

                    <div className="summary-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            This Week
                        </span>

                        <strong>
                            {getNumber(
                                analytics?.weeklyEmission
                            ).toFixed(2)}
                        </strong>

                        <small>
                            kg CO₂e
                        </small>

                    </div>

                </div>


                {/* MONTH */}

                <div className="analytics-summary-card">

                    <div className="summary-icon">
                        📊
                    </div>

                    <div>

                        <span>
                            This Month
                        </span>

                        <strong>
                            {getNumber(
                                analytics?.monthlyEmission
                            ).toFixed(2)}
                        </strong>

                        <small>
                            kg CO₂e
                        </small>

                    </div>

                </div>


                {/* YEAR */}

                <div className="analytics-summary-card">

                    <div className="summary-icon">
                        🌍
                    </div>

                    <div>

                        <span>
                            This Year
                        </span>

                        <strong>
                            {getNumber(
                                analytics?.yearlyEmission
                            ).toFixed(2)}
                        </strong>

                        <small>
                            kg CO₂e
                        </small>

                    </div>

                </div>

            </div>


            {/* =================================================
                WEEKLY EMISSIONS
            ================================================= */}

            <div className="analytics-chart-card">

                <div className="chart-header">

                    <h2>
                        Weekly Emissions
                    </h2>

                    <p>
                        Monday to Sunday emission trend
                    </p>

                </div>


                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <LineChart
                            data={weeklyChartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="day"
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toFixed(2)} kg CO₂e`,
                                    "Emission"
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="emission"
                                strokeWidth={3}
                                dot={{
                                    r: 4
                                }}
                                activeDot={{
                                    r: 6
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* =================================================
                MONTHLY EMISSIONS
            ================================================= */}

            <div className="analytics-chart-card">

                <div className="chart-header">

                    <h2>
                        Monthly Emissions
                    </h2>

                    <p>
                        Daily emissions throughout{" "}
                        {selectedMonth}
                    </p>

                </div>


                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <LineChart
                            data={monthlyChartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="day"
                                allowDecimals={false}
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toFixed(2)} kg CO₂e`,
                                    "Emission"
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="emission"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{
                                    r: 6
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* =================================================
                YEARLY EMISSIONS
            ================================================= */}

            <div className="analytics-chart-card">

                <div className="chart-header">

                    <h2>
                        Yearly Emissions
                    </h2>

                    <p>
                        Monthly emissions throughout{" "}
                        {selectedYear}
                    </p>

                </div>


                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <LineChart
                            data={yearlyChartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${Number(value).toFixed(2)} kg CO₂e`,
                                    "Emission"
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="emission"
                                strokeWidth={3}
                                dot={{
                                    r: 4
                                }}
                                activeDot={{
                                    r: 6
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>


            {/* =================================================
                SELECTED DATE ACTIVITIES
            ================================================= */}

            <div className="analytics-chart-card">

                <div className="chart-header">

                    <h2>
                        Selected Date Emissions
                    </h2>

                    <p>
                        Activities recorded on{" "}
                        {selectedDate}
                    </p>

                </div>


                {selectedDateActivities.length === 0 ? (

                    <div className="no-data">

                        <div>
                            🌱
                        </div>

                        <p>
                            No activities found for this date.
                        </p>

                    </div>

                ) : (

                    <div className="chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >

                            <LineChart
                                data={
                                    selectedDateActivities
                                }
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 10,
                                    bottom: 10
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="activity"
                                />

                                <YAxis
                                    allowDecimals={false}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `${Number(value).toFixed(2)} kg CO₂e`,
                                        "Emission"
                                    ]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="emission"
                                    strokeWidth={3}
                                    dot={{
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Analytics;