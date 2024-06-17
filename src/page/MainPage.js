import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { doc, addDoc, collection, getDocs, serverTimestamp, deleteDoc, query, where } from "@firebase/firestore";
// import "./MainPage.css"; 

const MainPage = () => {

    const [address, setAddress] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [searchAddress, setSearchAddress] = useState("");
    const [searchResult, setSearchResult] = useState("");

    const addAddress = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(firestore, "addresses"), {
                name: address,
                timestamp: serverTimestamp()
            });
            console.log("Document written with ID: ", docRef.id);
            fetchAddress(); // 更新地址清單
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    const deleteAddress = async (id) => {
        try {
            await deleteDoc(doc(firestore, "addresses", id));
            console.log("Document with ID: ", id, " successfully deleted");
            fetchAddress(); // 更新地址清單
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    }

    const searchAddressFunc = async () => {
        try {
            const q = query(collection(firestore, "addresses"), where("name", "==", searchAddress));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log("No matching documents.");
                setSearchResult("找不到該地址");
            } else {
                querySnapshot.forEach((doc) => {
                    setSearchResult(doc.data().name);
                });
            }
        } catch (e) {
            console.error("Error searching for document: ", e);
        }
    }

    const fetchAddress = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "addresses"));
            const newData = querySnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
            setAddresses(newData);
        } catch (e) {
            console.error("Error fetching documents: ", e);
        }
    }

    useEffect(() => {
        fetchAddress();
    }, [])

    return (
        <section>
            <div>
                <h1>MainPage</h1>
                <div>
                    <input
                        type="text"
                        placeholder="地址"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button onClick={addAddress}>新增</button>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="查詢地址"
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                    />
                    <button onClick={searchAddressFunc}>查詢</button>
                    {searchResult && <p>{searchResult}</p>}
                </div>

                <div>
                    <h2>地址清單</h2>
                    <ul>
                        {addresses.map(item => (
                            <li key={item.id}>
                                {item.name}
                                <button onClick={() => deleteAddress(item.id)}>刪除</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
};

export default MainPage;