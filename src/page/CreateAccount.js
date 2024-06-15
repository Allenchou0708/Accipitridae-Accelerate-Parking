import React, { useState } from "react";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
// import "./LoginPage.css"; 

const CreateAccountPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setError("Please fill in both fields");
            setSuccess("");
        } else {
            try {
                await addDoc(collection(firestore, "users"), {
                    username,
                    password
                });
                setSuccess("Account created successfully!");
                setError("");
            } catch (err) {
                setError("Error creating account: " + err.message);
                setSuccess("");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit">Create Account</button>
            </form>
            <div className="login-link">
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
};

export { CreateAccountPage as default }