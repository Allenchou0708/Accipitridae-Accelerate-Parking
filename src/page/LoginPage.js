import React, { useState } from "react";

let LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setError("Please fill in both fields");
        } else {
            setError("");
            console.log("Username: ", username);
            console.log("Password: ", password);
            // Add your login logic here
        }
    };
    return <div className="login-container">
        <h2>Login</h2>
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
            <button type="submit">Login</button>
        </form>
        <div className="create-account">
            <a href="/enroll">Create Account</a>
        </div>
        <div className="create-account">
            <a href="/enroll">Forget Password</a>
        </div>
    </div>
}
export { LoginPage as default }