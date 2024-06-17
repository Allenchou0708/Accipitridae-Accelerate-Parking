import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router"
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Button,Form,Dropdown,DropdownButton, InputGroup } from "react-bootstrap"
import "../style/LoginPage.css"


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const db = getFirestore();

    let {common_user,reviseCommonUser} = useOutletContext()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            let userFound = false;
            querySnapshot.forEach((doc) => {
                if (doc.data().password === password) {
                    userFound = true;
                }
            });

            if (userFound) {
                console.log("User signed in: ", username);
                reviseCommonUser(username)
                navigate("/"); // Redirect to the main page
            } else {
                setError("Invalid account and password");
            }
        } catch (error) {
            setError("Error checking credentials: " + error.message);
        }
    };

    return (
        <div className={["container","mt-5"].join(" ")}>
            <div className={["d-flex","justify-content-between","align-items-center","mb-5","pb-4","mp_zigzag_line"].join(" ")}>
                <div className={["d-flex"].join(" ")}>
                    <h1 className={["font-effect-shadow-multiple","mp_title_word"].join(" ")}>Accipitridae</h1>
                    <img className={["mp_title_img","ms-4"].join(" ")} src="./eagle.jpg"></img>
                </div>
                
                
                <span className={["mp_white_button","px-5","py-3","mx-1","my-1","mt-3"].join(" ")} onClick={()=>{navigate("/")}}>回到首頁</span>
        
            
            </div>

            <div className="login-container">
                <h2>Login</h2>
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
                    <button type="submit" className="create_button">Login</button>
                </form>
                <div >
                    <button className="create_button" id="create_button" onClick={()=>{navigate("/create-account")}}>Create Account</button>
                </div>
            </div>

        </div>
    );
};

export { LoginPage as default }