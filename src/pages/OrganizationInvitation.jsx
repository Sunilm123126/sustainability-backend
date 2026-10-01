import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8081";

const OrganizationInvitation = ({ token, onBack }) => {

    const [invitation, setInvitation] = useState(null);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");


    /* =====================================================
       LOAD INVITATION
    ===================================================== */

    useEffect(() => {

        const loadInvitation = async () => {

            if (!token) {

                setError(
                    "Invalid invitation link."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                const response = await fetch(
                    `${API_URL}/api/organization/invitations/${encodeURIComponent(token)}`
                );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to load invitation."
                    );
                }


                setInvitation(result);

            } catch (err) {

                console.error(
                    "Invitation loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load invitation."
                );

            } finally {

                setLoading(false);

            }

        };


        loadInvitation();

    }, [token]);


    /* =====================================================
       ACCEPT INVITATION
    ===================================================== */

    const handleAccept = async () => {

        if (!token) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setMessage("");


            const response = await fetch(
                `${API_URL}/api/organization/invitations/${encodeURIComponent(token)}/accept`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to accept invitation."
                );
            }


            setMessage(
                "Invitation accepted successfully. You are now a member of this organization."
            );


            /*
             * Keep the invitation information visible.
             * The backend has already created/reactivated
             * the organization membership.
             */

            setInvitation((previous) => {

                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    status: "ACCEPTED"
                };

            });


        } catch (err) {

            console.error(
                "Accept invitation error:",
                err
            );

            setError(
                err.message ||
                "Unable to accept invitation."
            );

        } finally {

            setActionLoading(false);

        }

    };


    /* =====================================================
       DECLINE INVITATION
    ===================================================== */

    const handleDecline = async () => {

        if (!token) {
            return;
        }

        try {

            setActionLoading(true);

            setError("");

            setMessage("");


            const response = await fetch(
                `${API_URL}/api/organization/invitations/${encodeURIComponent(token)}/decline`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to decline invitation."
                );
            }


            setMessage(
                "Invitation declined."
            );


            setInvitation((previous) => {

                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    status: "DECLINED"
                };

            });


        } catch (err) {

            console.error(
                "Decline invitation error:",
                err
            );

            setError(
                err.message ||
                "Unable to decline invitation."
            );

        } finally {

            setActionLoading(false);

        }

    };


    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    if (loading) {

        return (

            <div style={styles.page}>

                <div style={styles.card}>

                    <div style={styles.logo}>
                        🌱
                    </div>

                    <h1 style={styles.title}>
                        EcoTrack
                    </h1>

                    <p style={styles.subtitle}>
                        Loading your organization invitation...
                    </p>

                    <div style={styles.loadingBox}>
                        <div style={styles.spinner}>
                            ⏳
                        </div>

                        <p>
                            Please wait...
                        </p>
                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       ERROR SCREEN
    ===================================================== */

    if (error && !invitation) {

        return (

            <div style={styles.page}>

                <div style={styles.card}>

                    <div style={styles.errorIcon}>
                        ⚠️
                    </div>

                    <h1 style={styles.title}>
                        Invitation Unavailable
                    </h1>

                    <p style={styles.subtitle}>
                        We could not load this organization invitation.
                    </p>


                    <div style={styles.errorBox}>
                        {error}
                    </div>


                    <button
                        type="button"
                        style={styles.backButton}
                        onClick={onBack}
                    >
                        Back to EcoTrack
                    </button>

                </div>

            </div>

        );

    }


    /* =====================================================
       INVITATION SCREEN
    ===================================================== */

    return (

        <div style={styles.page}>

            <div style={styles.card}>


                {/* BRAND */}

                <div style={styles.logo}>
                    🌱
                </div>

                <h1 style={styles.title}>
                    EcoTrack
                </h1>


                {/* HEADING */}

                <h2 style={styles.invitationTitle}>
                    Organization Invitation
                </h2>


                <p style={styles.subtitle}>
                    You have been invited to join an organization
                    on EcoTrack.
                </p>


                {/* ORGANIZATION INFORMATION */}

                <div style={styles.organizationCard}>

                    <div style={styles.organizationIcon}>
                        🏢
                    </div>

                    <div style={styles.organizationDetails}>

                        <span style={styles.label}>
                            Organization
                        </span>

                        <strong style={styles.organizationName}>
                            {invitation?.organizationName ||
                                "Organization"}
                        </strong>

                    </div>

                </div>


                {/* INVITATION DETAILS */}

                <div style={styles.detailsCard}>

                    <div style={styles.detailRow}>

                        <span style={styles.detailLabel}>
                            Email
                        </span>

                        <span style={styles.detailValue}>
                            {invitation?.email || "-"}
                        </span>

                    </div>


                    <div style={styles.detailRow}>

                        <span style={styles.detailLabel}>
                            Department
                        </span>

                        <span style={styles.detailValue}>
                            {invitation?.department ||
                                "Not specified"}
                        </span>

                    </div>


                    <div style={styles.detailRow}>

                        <span style={styles.detailLabel}>
                            Status
                        </span>

                        <span
                            style={{
                                ...styles.statusBadge,
                                ...(invitation?.status ===
                                "ACCEPTED"
                                    ? styles.acceptedStatus
                                    : invitation?.status ===
                                    "DECLINED"
                                        ? styles.declinedStatus
                                        : invitation?.status ===
                                        "EXPIRED"
                                            ? styles.expiredStatus
                                            : styles.pendingStatus)
                            }}
                        >
                            {invitation?.status ||
                                "PENDING"}
                        </span>

                    </div>

                </div>


                {/* SUCCESS MESSAGE */}

                {message && (

                    <div style={styles.successBox}>
                        {message}
                    </div>

                )}


                {/* ERROR MESSAGE */}

                {error && (

                    <div style={styles.errorBox}>
                        {error}
                    </div>

                )}


                {/* ACTIONS */}

                {invitation?.status === "PENDING" && (

                    <div style={styles.actions}>

                        <button
                            type="button"
                            style={styles.declineButton}
                            onClick={handleDecline}
                            disabled={actionLoading}
                        >

                            {actionLoading
                                ? "Please wait..."
                                : "Decline"}

                        </button>


                        <button
                            type="button"
                            style={{
                                ...styles.acceptButton,
                                opacity:
                                    actionLoading
                                        ? 0.7
                                        : 1
                            }}
                            onClick={handleAccept}
                            disabled={actionLoading}
                        >

                            {actionLoading
                                ? "Processing..."
                                : "Accept Invitation"}

                        </button>

                    </div>

                )}


                {/* ACCEPTED */}

                {invitation?.status === "ACCEPTED" && (

                    <div style={styles.completedBox}>

                        <div style={styles.completedIcon}>
                            ✅
                        </div>

                        <strong>
                            You are now a member of this organization.
                        </strong>

                        <p>
                            Your EcoTrack organization membership
                            has been activated successfully.
                        </p>

                    </div>

                )}


                {/* DECLINED */}

                {invitation?.status === "DECLINED" && (

                    <div style={styles.completedBox}>

                        <div style={styles.completedIcon}>
                            ℹ️
                        </div>

                        <strong>
                            Invitation declined.
                        </strong>

                        <p>
                            You have declined this organization
                            invitation.
                        </p>

                    </div>

                )}


                {/* EXPIRED */}

                {invitation?.status === "EXPIRED" && (

                    <div style={styles.completedBox}>

                        <div style={styles.completedIcon}>
                            ⏰
                        </div>

                        <strong>
                            Invitation expired.
                        </strong>

                        <p>
                            Please contact the organization if you
                            need a new invitation.
                        </p>

                    </div>

                )}


                {/* BACK */}

                <button
                    type="button"
                    style={styles.backLink}
                    onClick={onBack}
                >
                    ← Back to EcoTrack
                </button>


                {/* FOOTER */}

                <p style={styles.footer}>
                    EcoTrack • Sustainability Analytics Platform
                </p>

            </div>

        </div>

    );

};


/* =========================================================
   STYLES
========================================================= */

const styles = {

    page: {
        minHeight: "100vh",
        background:
            "linear-gradient(135deg, #eef7f0 0%, #f8fbf9 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily:
            "Arial, Helvetica, sans-serif",
        color: "#26332a"
    },


    card: {
        width: "520px",
        maxWidth: "100%",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "38px",
        boxSizing: "border-box",
        boxShadow:
            "0 20px 60px rgba(30,60,40,0.12)",
        border:
            "1px solid #e3ebe5",
        textAlign: "center"
    },


    logo: {
        fontSize: "45px",
        marginBottom: "5px"
    },


    title: {
        margin: "0",
        color: "#173c27",
        fontSize: "28px"
    },


    invitationTitle: {
        margin: "25px 0 8px",
        color: "#1b3e29",
        fontSize: "23px"
    },


    subtitle: {
        margin: "0 auto 25px",
        color: "#718077",
        fontSize: "14px",
        lineHeight: "1.6",
        maxWidth: "420px"
    },


    organizationCard: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        background: "#f1f8f2",
        border:
            "1px solid #dcebdd",
        borderRadius: "12px",
        padding: "18px",
        textAlign: "left",
        marginBottom: "18px"
    },


    organizationIcon: {
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "#dff0e2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px"
    },


    organizationDetails: {
        display: "flex",
        flexDirection: "column",
        gap: "4px"
    },


    label: {
        fontSize: "11px",
        color: "#718077",
        textTransform: "uppercase",
        letterSpacing: "0.7px"
    },


    organizationName: {
        fontSize: "18px",
        color: "#173c27"
    },


    detailsCard: {
        border:
            "1px solid #e4ebe6",
        borderRadius: "12px",
        padding: "5px 18px",
        marginBottom: "20px",
        textAlign: "left"
    },


    detailRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "15px 0",
        borderBottom:
            "1px solid #edf1ee"
    },


    detailLabel: {
        fontSize: "13px",
        color: "#718077",
        fontWeight: "600"
    },


    detailValue: {
        fontSize: "13px",
        color: "#26332a",
        textAlign: "right",
        wordBreak: "break-word"
    },


    statusBadge: {
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: "700"
    },


    pendingStatus: {
        background: "#fff4d6",
        color: "#8a6500"
    },


    acceptedStatus: {
        background: "#e7f7eb",
        color: "#23743d"
    },


    declinedStatus: {
        background: "#fff0f0",
        color: "#b42318"
    },


    expiredStatus: {
        background: "#eeeeee",
        color: "#666666"
    },


    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginTop: "20px"
    },


    acceptButton: {
        border: "none",
        borderRadius: "9px",
        padding: "12px 20px",
        background: "#2e7d32",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    },


    declineButton: {
        border:
            "1px solid #d7e0da",
        borderRadius: "9px",
        padding: "12px 20px",
        background: "#ffffff",
        color: "#45554b",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px"
    },


    successBox: {
        background: "#e8f7ed",
        color: "#23743d",
        border:
            "1px solid #b9e2c5",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "13px",
        lineHeight: "1.5"
    },


    errorBox: {
        background: "#fff0f0",
        color: "#b42318",
        border:
            "1px solid #f1b8b8",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "18px",
        fontSize: "13px",
        lineHeight: "1.5"
    },


    completedBox: {
        marginTop: "20px",
        background: "#f4faf5",
        border:
            "1px solid #dcebdd",
        borderRadius: "10px",
        padding: "18px",
        color: "#52665a",
        fontSize: "13px",
        lineHeight: "1.6"
    },


    completedIcon: {
        fontSize: "30px",
        marginBottom: "8px"
    },


    loadingBox: {
        marginTop: "25px",
        color: "#718077",
        fontSize: "14px"
    },


    spinner: {
        fontSize: "30px"
    },


    errorIcon: {
        fontSize: "45px",
        marginBottom: "10px"
    },


    backButton: {
        marginTop: "20px",
        border: "none",
        borderRadius: "8px",
        padding: "11px 20px",
        background: "#2e7d32",
        color: "#ffffff",
        cursor: "pointer",
        fontWeight: "600"
    },


    backLink: {
        marginTop: "25px",
        border: "none",
        background: "transparent",
        color: "#2e7d32",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600"
    },


    footer: {
        margin: "25px 0 0",
        color: "#9aa59e",
        fontSize: "11px"
    }

};


export default OrganizationInvitation;