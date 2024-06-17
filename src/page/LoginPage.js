import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// const LoginPage = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const auth = getAuth();
//         try {
//             const userCredential = await signInWithEmailAndPassword(auth, username, password);
//             console.log("User signed in: ", userCredential.user);
//             navigate("/"); // Redirect to the main page
//         } catch (error) {
//             setError("Invalid account and password");
//         }
//     };

//     return (
//         <div className="login-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="username">Username:</label>
//                     <input
//                         type="text"
//                         id="username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="password">Password:</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 {error && <p className="error">{error}</p>}
//                 <button type="submit">Login</button>
//             </form>
//             <div className="create-account">
//                 <a href="/create-account">Create Account</a>
//             </div>
//         </div>
//     );
// };

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const db = getFirestore();

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
                navigate("/"); // Redirect to the main page
            } else {
                setError("Invalid account and password");
            }
        } catch (error) {
            setError("Error checking credentials: " + error.message);
        }
    };

    return (
        <div className="login-container">
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
                <a href="/create-account">Create Account</a>
            </div>
        </div>
    );
};

export { LoginPage as default }