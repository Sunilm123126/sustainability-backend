import React, { useState } from "react";
import "./AIChatbot.css";

function AdminAIChatbot() {

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello Admin! 👋 I'm your EcoTrack Admin AI Assistant. Ask me about users, activities, emissions, categories, or platform statistics."
        }
    ]);

    const sendMessage = async () => {

        const currentMessage = input.trim();

        if (currentMessage === "") {
            return;
        }

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: currentMessage
            }
        ]);

        setInput("");
        setLoading(true);

        try {

            console.log("ADMIN QUESTION:", currentMessage);

            const response = await fetch(
                "http://localhost:8081/api/admin/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: currentMessage
                    })
                }
            );

            console.log(
                "ADMIN AI STATUS:",
                response.status
            );

            if (!response.ok) {
                throw new Error(
                    "Server returned " + response.status
                );
            }

            const answer = await response.text();

            console.log(
                "ADMIN AI RESPONSE:",
                answer
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: answer
                }
            ]);

        } catch (error) {

            console.error(
                "Admin AI Error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't connect to the Admin AI. Please make sure the backend is running."
                }
            ]);

        } finally {

            setLoading(false);

        }
    };

    const handleKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();
        }
    };

    return (
        <>
            <button
                type="button"
                className="ai-chat-button"
                onClick={() =>
                    setIsOpen((prev) => !prev)
                }
            >
                🤖
            </button>

            {isOpen && (

                <div className="ai-chat-window">

                    <div className="ai-chat-header">

                        <div>
                            <h3>
                                🛡️ Admin AI
                            </h3>

                            <span>
                                EcoTrack Admin Assistant
                            </span>
                        </div>

                        <button
                            type="button"
                            className="ai-close-button"
                            onClick={() =>
                                setIsOpen(false)
                            }
                        >
                            ×
                        </button>

                    </div>

                    <div className="ai-chat-messages">

                        {messages.map(
                            (message, index) => (

                                <div
                                    key={index}
                                    className={
                                        message.sender === "user"
                                            ? "chat-message user-message"
                                            : "chat-message ai-message"
                                    }
                                >

                                    {message.sender === "ai" && (

                                        <div className="ai-avatar">
                                            🤖
                                        </div>

                                    )}

                                    <div className="message-text">
                                        {message.text}
                                    </div>

                                </div>

                            )
                        )}

                        {loading && (

                            <div className="chat-message ai-message">

                                <div className="ai-avatar">
                                    🤖
                                </div>

                                <div className="message-text">
                                    Analyzing admin data... 🌱
                                </div>

                            </div>

                        )}

                    </div>

                    <div className="ai-chat-input">

                        <input
                            type="text"
                            placeholder="Ask about users, emissions..."
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

export default AdminAIChatbot;