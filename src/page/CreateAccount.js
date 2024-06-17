import React, { useState } from "react";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import { useNavigate, useOutletContext } from "react-router"
// import "./LoginPage.css"; 

const CreateAccountPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    let {common_user,reviseCommonUser} = useOutletContext()

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
                reviseCommonUser(username)
                navigate("/")
            } catch (err) {
                setError("Error creating account: " + err.message);
                setSuccess("");
            }
        }
    };

    return (
        <div className={["container","mt-5"].join(" ")}>
            <div className={["d-flex","justify-content-between","align-items-center","mb-5","pb-4","mp_zigzag_line"].join(" ")}>
                <div className={["d-flex"].join(" ")}>
                    <h1 className={["font-effect-shadow-multiple","mp_title_word"].join(" ")}>Accipitridae</h1>
                    <img className={["mp_title_img","ms-4"].join(" ")} src="./eagle.jpg"></img>
                </div>
                
                <div className="d-flex">
                    <span className={["mp_white_button","px-5","py-3","mx-1","my-1","mt-3"].join(" ")} onClick={()=>{navigate("/login")}}>回到登入頁面</span>
                    <span className={["mp_white_button","px-5","py-3","mx-1","my-1","mt-3"].join(" ")} onClick={()=>{navigate("/")}}>回到首頁</span>
                </div>


            </div>
        
            <div className="login-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="input_narrate">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="input_narrate">Password:</label>
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
            </div>
        </div>
    );
};

export { CreateAccountPage as default }