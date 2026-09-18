import React from "react";
import "./assets/LandingPage.css";
import GoogleTranslate from "./components/GoogleTranslate";

function LandingPage({ onLogin, onRegister }) {

    // =====================================================
    // SCROLL FUNCTION
    // =====================================================

    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };


    // =====================================================
    // LANDING PAGE
    // =====================================================

    return (
        <div className="landing-page">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="landing-navbar">

                {/* LOGO */}

                <div
                    className="landing-logo"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                        })
                    }
                >

                    <div className="logo-icon">
                        🌱
                    </div>

                    <div className="logo-text">

                        <div className="logo-title">
                            EcoTrack
                        </div>

                        <div className="logo-subtitle">
                            Sustainability
                        </div>

                    </div>

                </div>


                {/* NAVIGATION LINKS */}

                <div className="nav-links">

                    <button
                        onClick={() =>
                            scrollToSection("features")
                        }
                    >
                        Features
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("how-it-works")
                        }
                    >
                        How It Works
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("ai-section")
                        }
                    >
                        AI Recommendations
                    </button>

                </div>


                {/* RIGHT SIDE */}

                <div className="nav-actions">

                    {/* LANGUAGE */}

                    <GoogleTranslate />


                    {/* LOGIN */}

                    <button
                        className="nav-login"
                        onClick={onLogin}
                    >
                        Login
                    </button>


                    {/* GET STARTED */}

                    <button
                        className="nav-register"
                        onClick={onRegister}
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            {/* =================================================
                HERO SECTION
            ================================================= */}

            <section className="hero-section">

                {/* Background glow */}

                <div className="hero-background-glow"></div>


                {/* =================================================
                    HERO CONTENT
                ================================================= */}

                <div className="hero-content">

                    <div className="hero-badge">
                        🌍 Build a greener future
                    </div>


                    <h1>

                        Understand Your

                        <br />

                        <span>
                            Carbon Footprint.
                        </span>

                        <br />

                        <strong>
                            Change Your
                        </strong>

                        <br />

                        <strong>
                            Impact.
                        </strong>

                    </h1>


                    <p className="hero-description">

                        Track your everyday activities, understand
                        your carbon emissions and get personalized
                        AI-powered recommendations to build a more
                        sustainable lifestyle.

                    </p>


                    {/* HERO BUTTONS */}

                    <div className="hero-buttons">

                        <button
                            className="primary-hero-button"
                            onClick={onRegister}
                        >
                            Start Your Green Journey
                            <span>→</span>
                        </button>


                        <button
                            className="secondary-hero-button"
                            onClick={() =>
                                scrollToSection("features")
                            }
                        >
                            Explore Features
                        </button>

                    </div>


                    {/* TRUST ITEMS */}

                    <div className="hero-trust">

                        <div className="trust-item">
                            <span>✓</span>
                            Easy to use
                        </div>

                        <div className="trust-item">
                            <span>✓</span>
                            Personalized insights
                        </div>

                        <div className="trust-item">
                            <span>✓</span>
                            AI powered
                        </div>

                    </div>

                </div>


                {/* =================================================
                    DASHBOARD PREVIEW
                ================================================= */}

                <div className="hero-dashboard">

                    <div className="dashboard-window">


                        {/* WINDOW HEADER */}

                        <div className="window-header">

                            <div className="window-dots">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                            EcoTrack Sustainability Dashboard

                        </div>


                        {/* DASHBOARD */}

                        <div className="dashboard-preview">


                            {/* SIDEBAR */}

                            <div className="preview-sidebar">

                                <div className="preview-logo">
                                    🌱
                                </div>

                                <div className="preview-menu active">
                                    ◈
                                </div>

                                <div className="preview-menu">
                                    +
                                </div>

                                <div className="preview-menu">
                                    ◉
                                </div>

                                <div className="preview-menu">
                                    ◌
                                </div>

                                <div className="preview-menu">
                                    ⚙
                                </div>

                            </div>


                            {/* MAIN DASHBOARD */}

                            <div className="preview-main">

                                <div className="preview-title">
                                    Good morning 👋
                                </div>

                                <div className="preview-small">
                                    Your sustainability overview
                                </div>


                                {/* STAT CARDS */}

                                <div className="preview-cards">


                                    {/* EMISSION */}

                                    <div className="preview-card">

                                        <div className="preview-card-label">
                                            Today's Emission
                                        </div>

                                        <div className="preview-number">
                                            4.82
                                        </div>

                                        <div className="preview-unit">
                                            kg CO₂e
                                        </div>

                                    </div>


                                    {/* ECO SCORE */}

                                    <div className="preview-card">

                                        <div className="preview-card-label">
                                            Eco Score
                                        </div>

                                        <div className="preview-number score">
                                            87
                                        </div>

                                        <div className="preview-unit">
                                            Excellent
                                        </div>

                                    </div>

                                </div>


                                {/* WEEKLY CHART */}

                                <div className="preview-chart">

                                    <div className="chart-header">
                                        Weekly Emissions
                                    </div>


                                    <div className="chart-bars">

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "35%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "52%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "31%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "67%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "44%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "27%"
                                            }}
                                        ></div>

                                        <div
                                            className="chart-bar"
                                            style={{
                                                height: "20%"
                                            }}
                                        ></div>

                                    </div>

                                </div>


                                {/* AI RECOMMENDATION */}

                                <div className="preview-insights">

                                    <div className="insight-card">

                                        <strong>
                                            ✦ AI Recommendation
                                        </strong>

                                        <span>
                                            Reduce your weekly emissions
                                        </span>

                                    </div>

                                    <div className="insight-card">

                                        <strong>
                                            🌱 Goal Progress
                                        </strong>

                                        <span>
                                            72% completed
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                QUICK STATISTICS
            ================================================= */}

            <section className="landing-stats">

                <div className="stat-item">

                    <strong>
                        4+
                    </strong>

                    <span>
                        Activity Categories
                    </span>

                </div>


                <div className="stat-item">

                    <strong>
                        AI
                    </strong>

                    <span>
                        Smart Recommendations
                    </span>

                </div>


                <div className="stat-item">

                    <strong>
                        24/7
                    </strong>

                    <span>
                        Impact Tracking
                    </span>

                </div>


                <div className="stat-item">

                    <strong>
                        100%
                    </strong>

                    <span>
                        Personalized
                    </span>

                </div>

            </section>


            {/* =================================================
                FEATURES
            ================================================= */}

            <section
                id="features"
                className="features-section"
            >

                <div className="section-heading">

                    <div className="section-badge">
                        FEATURES
                    </div>

                    <h2>

                        Everything you need to{" "}

                        <span>
                            live greener.
                        </span>

                    </h2>

                    <p>
                        Turn your everyday activities into
                        meaningful sustainability insights.
                    </p>

                </div>


                {/* FEATURES GRID */}

                <div className="features-grid">


                    {/* FEATURE 1 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🚗
                        </div>

                        <h3>
                            Track Activities
                        </h3>

                        <p>
                            Log transportation, electricity,
                            food and shopping activities in
                            seconds.
                        </p>

                        <span className="feature-link">
                            Track your impact →
                        </span>

                    </div>


                    {/* FEATURE 2 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            📊
                        </div>

                        <h3>
                            Smart Analytics
                        </h3>

                        <p>
                            Understand your daily, weekly,
                            monthly and yearly carbon emissions.
                        </p>

                        <span className="feature-link">
                            Explore analytics →
                        </span>

                    </div>


                    {/* FEATURE 3 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            ✦
                        </div>

                        <h3>
                            AI Recommendations
                        </h3>

                        <p>
                            Receive personalized sustainability
                            suggestions based on your actual
                            activities.
                        </p>

                        <span className="feature-link">
                            Meet your AI coach →
                        </span>

                    </div>


                    {/* FEATURE 4 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🎯
                        </div>

                        <h3>
                            Sustainability Goals
                        </h3>

                        <p>
                            Set meaningful environmental goals
                            and monitor your progress over time.
                        </p>

                        <span className="feature-link">
                            Set a goal →
                        </span>

                    </div>


                    {/* FEATURE 5 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            📈
                        </div>

                        <h3>
                            Carbon Insights
                        </h3>

                        <p>
                            Discover which activities contribute
                            most to your personal carbon footprint.
                        </p>

                        <span className="feature-link">
                            View insights →
                        </span>

                    </div>


                    {/* FEATURE 6 */}

                    <div className="feature-card">

                        <div className="feature-icon">
                            🌍
                        </div>

                        <h3>
                            Sustainable Living
                        </h3>

                        <p>
                            Make informed choices and gradually
                            build more sustainable everyday habits.
                        </p>

                        <span className="feature-link">
                            Start today →
                        </span>

                    </div>

                </div>

            </section>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section
                id="how-it-works"
                className="how-section"
            >

                <div className="section-heading">

                    <div className="section-badge">
                        HOW IT WORKS
                    </div>

                    <h2>

                        Your journey toward a{" "}

                        <span>
                            greener life.
                        </span>

                    </h2>

                    <p>
                        A simple three-step approach to
                        understanding and reducing your impact.
                    </p>

                </div>


                <div className="steps-container">


                    {/* STEP 1 */}

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Log Your Activities
                        </h3>

                        <p>
                            Record everyday activities such as
                            transportation, electricity usage,
                            food and shopping.
                        </p>

                    </div>


                    {/* STEP 2 */}

                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Understand Your Impact
                        </h3>

                        <p>
                            EcoTrack analyzes your activities and
                            converts them into meaningful carbon
                            emission insights.
                        </p>

                    </div>


                    {/* STEP 3 */}

                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Take Action
                        </h3>

                        <p>
                            Follow personalized recommendations,
                            create goals and monitor your progress
                            toward a greener lifestyle.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                AI RECOMMENDATIONS
            ================================================= */}

            <section
                id="ai-section"
                className="ai-section"
            >

                <div className="ai-glow"></div>


                {/* AI CONTENT */}

                <div className="ai-content">

                    <div className="ai-badge">
                        ✦ AI-POWERED SUSTAINABILITY
                    </div>

                    <h2>

                        Recommendations that
                        understand{" "}

                        <span>
                            your lifestyle.
                        </span>

                    </h2>

                    <p>

                        EcoTrack uses your activity data to
                        provide personalized suggestions that
                        help you understand where you can make
                        meaningful environmental improvements.

                    </p>


                    <div className="ai-benefits">

                        <div>
                            <span>✓</span>
                            Personalized recommendations
                        </div>

                        <div>
                            <span>✓</span>
                            Based on your actual activities
                        </div>

                        <div>
                            <span>✓</span>
                            Practical sustainability actions
                        </div>

                        <div>
                            <span>✓</span>
                            Track your improvement over time
                        </div>

                    </div>


                    <button
                        className="primary-hero-button"
                        onClick={onRegister}
                    >
                        Get Your Recommendations
                        <span>→</span>
                    </button>

                </div>


                {/* AI CARD */}

                <div className="ai-card">

                    <div className="ai-card-top">

                        <div className="ai-card-icon">
                            ✦
                        </div>

                        <div>

                            <div className="ai-card-title">
                                EcoTrack AI
                            </div>

                            <div className="ai-card-subtitle">
                                Personalized sustainability coach
                            </div>

                        </div>

                    </div>


                    <div className="recommendation-preview">

                        <div className="priority">
                            RECOMMENDATION
                        </div>

                        <h3>
                            Try replacing one car trip
                            with public transport.
                        </h3>

                        <p>

                            Your transportation activity
                            contributed significantly to your
                            emissions this week.

                        </p>


                        <div className="action-preview">

                            <span>
                                🌱
                            </span>

                            <span>
                                Potential impact:
                                reduce your weekly footprint
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                CALL TO ACTION
            ================================================= */}

            <section className="cta-section">

                <div className="cta-glow"></div>

                <div className="cta-content">

                    <div className="cta-icon">
                        🌱
                    </div>

                    <h2>

                        Small actions.
                        <br />

                        <span>
                            Meaningful impact.
                        </span>

                    </h2>

                    <p>

                        Start understanding your carbon
                        footprint today and take the first step
                        toward a more sustainable lifestyle.

                    </p>

                    <button
                        className="cta-button"
                        onClick={onRegister}
                    >
                        Start Your Green Journey →
                    </button>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="landing-footer">


                {/* BRAND */}

                <div className="footer-brand">

                    <div className="landing-logo">

                        <div className="logo-icon">
                            🌱
                        </div>

                        <div>

                            <div className="logo-title">
                                EcoTrack
                            </div>

                            <div className="logo-subtitle">
                                Sustainability
                            </div>

                        </div>

                    </div>


                    <p>

                        Understand your environmental impact,
                        discover sustainable habits and build
                        a greener future.

                    </p>

                </div>


                {/* PRODUCT */}

                <div className="footer-column">

                    <h4>
                        Product
                    </h4>

                    <button
                        onClick={() =>
                            scrollToSection("features")
                        }
                    >
                        Features
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("how-it-works")
                        }
                    >
                        How It Works
                    </button>

                    <button
                        onClick={() =>
                            scrollToSection("ai-section")
                        }
                    >
                        AI Recommendations
                    </button>

                </div>


                {/* ACCOUNT */}

                <div className="footer-column">

                    <h4>
                        Account
                    </h4>

                    <button onClick={onLogin}>
                        Login
                    </button>

                    <button onClick={onRegister}>
                        Get Started
                    </button>

                </div>


                {/* SUSTAINABILITY */}

                <div className="footer-column">

                    <h4>
                        Sustainability
                    </h4>

                    <span>
                        Carbon Tracking
                    </span>

                    <span>
                        Smart Analytics
                    </span>

                    <span>
                        Sustainable Goals
                    </span>

                </div>


                {/* FOOTER BOTTOM */}

                <div className="footer-bottom">

                    <span>
                        © 2026 EcoTrack. All rights reserved.
                    </span>

                    <span>
                        Building a greener future 🌍
                    </span>

                </div>

            </footer>

        </div>
    );
}

export default LandingPage;