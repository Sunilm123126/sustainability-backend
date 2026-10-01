import React, { useState } from "react";
import "./AIChatbot.css";

function AIChatbot() {

    // =========================================================
    // CHAT WINDOW
    // =========================================================

    const [isOpen, setIsOpen] = useState(false);

    // =========================================================
    // MESSAGES
    // =========================================================

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello! 👋 I'm your Sustainability AI Assistant. Ask me about your activities, emissions, goals, or ways to reduce your carbon footprint."
        }
    ]);

    // =========================================================
    // INPUT
    // =========================================================

    const [input, setInput] = useState("");

    // =========================================================
    // LOADING
    // =========================================================

    const [loading, setLoading] = useState(false);

    // =========================================================
    // GET LOGGED-IN USERNAME
    // =========================================================

    const username = localStorage.getItem("username");

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = async () => {

        // Remove extra spaces
        const currentMessage = input.trim();

        // -----------------------------------------------------
        // CHECK EMPTY MESSAGE
        // -----------------------------------------------------

        if (currentMessage === "") {
            return;
        }

        // -----------------------------------------------------
        // CHECK USER LOGIN
        // -----------------------------------------------------

        if (!username) {

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Please login first before using the Sustainability AI Assistant."
                }
            ]);

            return;
        }

        // -----------------------------------------------------
        // DEBUG
        // -----------------------------------------------------

        console.log("=================================");
        console.log("USERNAME:", username);
        console.log("QUESTION:", currentMessage);
        console.log("=================================");

        // -----------------------------------------------------
        // DISPLAY USER MESSAGE
        // -----------------------------------------------------

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentMessage
            }
        ]);

        // -----------------------------------------------------
        // CLEAR INPUT
        // -----------------------------------------------------

        setInput("");

        // -----------------------------------------------------
        // START LOADING
        // -----------------------------------------------------

        setLoading(true);

        try {

            // =================================================
            // CALL SPRING BOOT
            // =================================================

            const response = await fetch(
                "http://localhost:8081/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    // IMPORTANT:
                    // AIChatRequest.java expects "question"
                    // NOT "message"
                    body: JSON.stringify({
                        username: username,
                        question: currentMessage
                    })
                }
            );

            // -------------------------------------------------
            // DEBUG SERVER STATUS
            // -------------------------------------------------

            console.log(
                "SERVER STATUS:",
                response.status
            );

            // -------------------------------------------------
            // CHECK RESPONSE
            // -------------------------------------------------

            if (!response.ok) {

                throw new Error(
                    "Server returned " + response.status
                );
            }

            // =================================================
            // READ RESPONSE
            // =================================================

            const answer = await response.text();

            // -------------------------------------------------
            // DEBUG AI RESPONSE
            // -------------------------------------------------

            console.log(
                "AI RESPONSE:",
                answer
            );

            // =================================================
            // DISPLAY AI RESPONSE
            // =================================================

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: answer
                }
            ]);

        } catch (error) {

            // =================================================
            // ERROR
            // =================================================

            console.error(
                "AI Chat Error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't connect to the Sustainability AI right now. Please make sure the backend is running."
                }
            ]);

        } finally {

            // =================================================
            // STOP LOADING
            // =================================================

            setLoading(false);
        }
    };

    // =========================================================
    // ENTER KEY
    // =========================================================

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    };

    // =========================================================
    // TOGGLE CHAT
    // =========================================================

    const toggleChat = () => {
        setIsOpen((prev) => !prev);
    };

    // =========================================================
    // CLOSE CHAT
    // =========================================================

    const closeChat = () => {
        setIsOpen(false);
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <>
            {/* ================================================= */}
            {/* CHAT BUTTON */}
            {/* ================================================= */}

            <button
                type="button"
                className="ai-chat-button"
                onClick={toggleChat}
            >
                🤖
            </button>

            {/* ================================================= */}
            {/* CHAT WINDOW */}
            {/* ================================================= */}

            {isOpen && (

                <div className="ai-chat-window">

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div className="ai-chat-header">

                        <div>

                            <h3>
                                🌱 Sustainability AI
                            </h3>

                            <span>
                                AI Assistant
                            </span>

                        </div>

                        <button
                            type="button"
                            className="ai-close-button"
                            onClick={closeChat}
                        >
                            ×
                        </button>

                    </div>

                    {/* ================================================= */}
                    {/* MESSAGES */}
                    {/* ================================================= */}

                    <div className="ai-chat-messages">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={
                                    message.sender === "user"
                                        ? "chat-message user-message"
                                        : "chat-message ai-message"
                                }
                            >

                                {/* AI AVATAR */}

                                {message.sender === "ai" && (

                                    <div className="ai-avatar">
                                        🤖
                                    </div>

                                )}

                                {/* MESSAGE TEXT */}

                                <div className="message-text">
                                    {message.text}
                                </div>

                            </div>

                        ))}

                        {/* ================================================= */}
                        {/* LOADING */}
                        {/* ================================================= */}

                        {loading && (

                            <div className="chat-message ai-message">

                                <div className="ai-avatar">
                                    🤖
                                </div>

                                <div className="message-text">
                                    Thinking... 🌱
                                </div>

                            </div>

                        )}

                    </div>

                    {/* ================================================= */}
                    {/* INPUT AREA */}
                    {/* ================================================= */}

                    <div className="ai-chat-input">

                        <input
                            type="text"
                            placeholder="Ask about your carbon footprint..."
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        <button
                            type="button"
                            onClick={sendMessage}
                            disabled={
                                loading ||
                                input.trim() === ""
                            }
                        >
                            ➤
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}

export default AIChatbot;